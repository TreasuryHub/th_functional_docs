// Tiny expression language for calculated fields.
//
//   Row-level:        [amount_base] * -1          IF([direction] = "OUT", [amount], 0)
//   Aggregate-level:  SUM([amount_in]) - SUM([amount_out])      COUNTD([account_id])
//
// A formula that contains an aggregate function is evaluated once per group (post-aggregation);
// otherwise once per row (pre-aggregation), and the result behaves like any other column.

export type Value = number | string | boolean | null

type Node =
  | { k: 'num'; v: number }
  | { k: 'str'; v: string }
  | { k: 'bool'; v: boolean }
  | { k: 'null' }
  | { k: 'field'; name: string }
  | { k: 'unary'; op: string; arg: Node }
  | { k: 'bin'; op: string; l: Node; r: Node }
  | { k: 'call'; fn: string; args: Node[] }

export const AGG_FUNCS = ['SUM', 'AVG', 'MIN', 'MAX', 'COUNT', 'COUNTD', 'FIRST', 'LAST'] as const
const AGG = new Set<string>(AGG_FUNCS)

export const FUNCTION_DOCS: { sig: string; doc: string; agg?: boolean }[] = [
  { sig: 'SUM(x)', doc: 'Suma del grupo', agg: true },
  { sig: 'AVG(x)', doc: 'Promedio del grupo', agg: true },
  { sig: 'MIN(x) / MAX(x)', doc: 'Mínimo / máximo del grupo', agg: true },
  { sig: 'COUNT(x)', doc: 'Cantidad de filas no nulas', agg: true },
  { sig: 'COUNTD(x)', doc: 'Cantidad de valores distintos', agg: true },
  { sig: 'LAST(x)', doc: 'Último valor por fecha (semi-aditivos: saldos)', agg: true },
  { sig: 'IF(cond, a, b)', doc: 'Condicional' },
  { sig: 'ABS(x) · ROUND(x, n)', doc: 'Valor absoluto · redondeo' },
  { sig: 'COALESCE(a, b, …)', doc: 'Primer valor no nulo' },
  { sig: 'DIV(a, b)', doc: 'División segura (null si b = 0)' },
  { sig: 'DATEDIFF(d1, d2)', doc: 'Días entre dos fechas' },
  { sig: 'YEAR(d) · MONTH(d)', doc: 'Partes de fecha' },
  { sig: 'CONCAT(a, b, …) · UPPER(s)', doc: 'Texto' },
  { sig: 'CONTAINS(s, "x")', doc: 'Contiene texto' },
]

// ---------------------------------------------------------------- tokenizer

type Tok = { t: 'num' | 'str' | 'field' | 'id' | 'op' | 'lp' | 'rp' | 'comma'; v: string; pos: number }

function tokenize(src: string): Tok[] {
  const out: Tok[] = []
  let i = 0
  while (i < src.length) {
    const ch = src[i]
    if (/\s/.test(ch)) { i++; continue }
    if (/[0-9.]/.test(ch)) {
      let j = i
      while (j < src.length && /[0-9._]/.test(src[j])) j++
      out.push({ t: 'num', v: src.slice(i, j).replace(/_/g, ''), pos: i }); i = j; continue
    }
    if (ch === '"' || ch === "'") {
      const j = src.indexOf(ch, i + 1)
      if (j < 0) throw new FormulaError(`Texto sin cerrar en posición ${i + 1}`)
      out.push({ t: 'str', v: src.slice(i + 1, j), pos: i }); i = j + 1; continue
    }
    if (ch === '[') {
      const j = src.indexOf(']', i + 1)
      if (j < 0) throw new FormulaError(`Campo sin cerrar en posición ${i + 1}`)
      out.push({ t: 'field', v: src.slice(i + 1, j).trim(), pos: i }); i = j + 1; continue
    }
    if (/[A-Za-z_]/.test(ch)) {
      let j = i
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++
      out.push({ t: 'id', v: src.slice(i, j), pos: i }); i = j; continue
    }
    const two = src.slice(i, i + 2)
    if (['<=', '>=', '!=', '<>', '==', '&&', '||'].includes(two)) { out.push({ t: 'op', v: two, pos: i }); i += 2; continue }
    if ('+-*/%<>=!'.includes(ch)) { out.push({ t: 'op', v: ch, pos: i }); i++; continue }
    if (ch === '(') { out.push({ t: 'lp', v: ch, pos: i }); i++; continue }
    if (ch === ')') { out.push({ t: 'rp', v: ch, pos: i }); i++; continue }
    if (ch === ',') { out.push({ t: 'comma', v: ch, pos: i }); i++; continue }
    throw new FormulaError(`Carácter inesperado "${ch}" en posición ${i + 1}`)
  }
  return out
}

export class FormulaError extends Error {}

// ---------------------------------------------------------------- parser (precedence climbing)

const PREC: Record<string, number> = {
  OR: 1, '||': 1, AND: 2, '&&': 2,
  '=': 3, '==': 3, '!=': 3, '<>': 3, '<': 4, '>': 4, '<=': 4, '>=': 4,
  '+': 5, '-': 5, '*': 6, '/': 6, '%': 6,
}

export function parse(src: string): Node {
  if (!src.trim()) throw new FormulaError('La fórmula está vacía')
  const toks = tokenize(src)
  let p = 0
  const peek = () => toks[p]
  const opOf = (t?: Tok) => (t && (t.t === 'op' || (t.t === 'id' && /^(AND|OR)$/i.test(t.v))) ? t.v.toUpperCase() : null)

  function primary(): Node {
    const t = toks[p++]
    if (!t) throw new FormulaError('Fin de fórmula inesperado')
    if (t.t === 'num') return { k: 'num', v: Number(t.v) }
    if (t.t === 'str') return { k: 'str', v: t.v }
    if (t.t === 'field') return { k: 'field', name: t.v }
    if (t.t === 'lp') { const e = expr(0); expect('rp'); return e }
    if (t.t === 'op' && (t.v === '-' || t.v === '!')) return { k: 'unary', op: t.v, arg: primary() }
    if (t.t === 'id') {
      const up = t.v.toUpperCase()
      if (up === 'TRUE' || up === 'FALSE') return { k: 'bool', v: up === 'TRUE' }
      if (up === 'NULL') return { k: 'null' }
      if (up === 'NOT') return { k: 'unary', op: '!', arg: primary() }
      if (peek()?.t === 'lp') {
        p++
        const args: Node[] = []
        if (peek()?.t !== 'rp') {
          args.push(expr(0))
          while (peek()?.t === 'comma') { p++; args.push(expr(0)) }
        }
        expect('rp')
        return { k: 'call', fn: up, args }
      }
      // bare identifiers are accepted as field refs for convenience
      return { k: 'field', name: t.v }
    }
    throw new FormulaError(`Token inesperado "${t.v}" en posición ${t.pos + 1}`)
  }
  function expect(tt: Tok['t']) {
    const t = toks[p++]
    if (!t || t.t !== tt) throw new FormulaError(`Se esperaba "${tt === 'rp' ? ')' : tt}"${t ? ` en posición ${t.pos + 1}` : ''}`)
  }
  function expr(min: number): Node {
    let l = primary()
    for (;;) {
      const op = opOf(peek())
      if (!op || PREC[op] === undefined || PREC[op] <= min - 1 || PREC[op] < min) break
      p++
      const r = expr(PREC[op] + 1)
      l = { k: 'bin', op, l, r }
    }
    return l
  }
  const node = expr(0)
  if (p < toks.length) throw new FormulaError(`Sobra "${toks[p].v}" en posición ${toks[p].pos + 1}`)
  return node
}

// ---------------------------------------------------------------- analysis

export function fieldRefs(node: Node, acc = new Set<string>()): Set<string> {
  switch (node.k) {
    case 'field': acc.add(node.name); break
    case 'unary': fieldRefs(node.arg, acc); break
    case 'bin': fieldRefs(node.l, acc); fieldRefs(node.r, acc); break
    case 'call': node.args.forEach(a => fieldRefs(a, acc)); break
  }
  return acc
}

export function isAggregate(node: Node): boolean {
  if (node.k === 'call') return AGG.has(node.fn) || node.args.some(isAggregate)
  if (node.k === 'bin') return isAggregate(node.l) || isAggregate(node.r)
  if (node.k === 'unary') return isAggregate(node.arg)
  return false
}

// ---------------------------------------------------------------- evaluation

type Row = Record<string, unknown>

const num = (v: unknown): number | null => (v === null || v === undefined || v === '' ? null : typeof v === 'number' ? v : Number(v))

function applyBin(op: string, a: Value, b: Value): Value {
  switch (op) {
    case '+':
      if (typeof a === 'string' || typeof b === 'string') return `${a ?? ''}${b ?? ''}`
      return a === null || b === null ? null : (a as number) + (b as number)
    case '-': return a === null || b === null ? null : (num(a)! - num(b)!)
    case '*': return a === null || b === null ? null : (num(a)! * num(b)!)
    case '/': return a === null || b === null || num(b) === 0 ? null : (num(a)! / num(b)!)
    case '%': return a === null || b === null || num(b) === 0 ? null : (num(a)! % num(b)!)
    case '=': case '==': return a === b || String(a) === String(b)
    case '!=': case '<>': return !(a === b || String(a) === String(b))
    case '<': return a !== null && b !== null && a < b
    case '>': return a !== null && b !== null && a > b
    case '<=': return a !== null && b !== null && a <= b
    case '>=': return a !== null && b !== null && a >= b
    case 'AND': case '&&': return Boolean(a) && Boolean(b)
    case 'OR': case '||': return Boolean(a) || Boolean(b)
  }
  throw new FormulaError(`Operador desconocido ${op}`)
}

function scalarFn(fn: string, args: Value[]): Value {
  switch (fn) {
    case 'IF': return args[0] ? args[1] ?? null : args[2] ?? null
    case 'ABS': return args[0] === null ? null : Math.abs(num(args[0])!)
    case 'ROUND': { const f = 10 ** (num(args[1]) ?? 0); return args[0] === null ? null : Math.round(num(args[0])! * f) / f }
    case 'COALESCE': return args.find(a => a !== null && a !== undefined && a !== '') ?? null
    case 'DIV': return args[0] === null || !num(args[1]) ? null : num(args[0])! / num(args[1])!
    case 'UPPER': return args[0] === null ? null : String(args[0]).toUpperCase()
    case 'LOWER': return args[0] === null ? null : String(args[0]).toLowerCase()
    case 'CONCAT': return args.map(a => a ?? '').join('')
    case 'CONTAINS': return args[0] !== null && String(args[0]).toLowerCase().includes(String(args[1] ?? '').toLowerCase())
    case 'YEAR': return args[0] ? new Date(String(args[0])).getUTCFullYear() : null
    case 'MONTH': return args[0] ? new Date(String(args[0])).getUTCMonth() + 1 : null
    case 'DATEDIFF': {
      if (!args[0] || !args[1]) return null
      return Math.round((Date.parse(String(args[1])) - Date.parse(String(args[0]))) / 86_400_000)
    }
  }
  throw new FormulaError(`Función desconocida ${fn}`)
}

export type Resolver = (row: Row, name: string) => unknown

export function evalRow(node: Node, row: Row, resolve: Resolver): Value {
  switch (node.k) {
    case 'num': return node.v
    case 'str': return node.v
    case 'bool': return node.v
    case 'null': return null
    case 'field': return (resolve(row, node.name) ?? null) as Value
    case 'unary': { const v = evalRow(node.arg, row, resolve); return node.op === '-' ? (v === null ? null : -num(v)!) : !v }
    case 'bin': return applyBin(node.op, evalRow(node.l, row, resolve), evalRow(node.r, row, resolve))
    case 'call':
      if (AGG.has(node.fn)) throw new FormulaError(`${node.fn}() es de agregación: usá la fórmula como medida`)
      return scalarFn(node.fn, node.args.map(a => evalRow(a, row, resolve)))
  }
}

export function aggregate(fn: string, values: Value[], dates?: (string | null)[]): Value {
  const nums = () => values.map(num).filter((v): v is number => v !== null && !Number.isNaN(v))
  switch (fn) {
    case 'SUM': return nums().reduce((a, b) => a + b, 0)
    case 'AVG': { const n = nums(); return n.length ? n.reduce((a, b) => a + b, 0) / n.length : null }
    case 'MIN': { const n = nums(); return n.length ? Math.min(...n) : null }
    case 'MAX': { const n = nums(); return n.length ? Math.max(...n) : null }
    case 'COUNT': return values.filter(v => v !== null && v !== undefined).length
    case 'COUNTD': return new Set(values.filter(v => v !== null).map(String)).size
    case 'FIRST': return values[0] ?? null
    case 'ONE': {
      const distinct = [...new Set(values.filter(v => v !== null && v !== undefined && v !== '').map(String))]
      return distinct.length === 0 ? null : distinct.length === 1 ? values.find(v => v !== null && v !== undefined && v !== '')! : `${distinct.length} valores`
    }
    case 'LAST': {
      if (!dates) return values[values.length - 1] ?? null
      let best = -1
      for (let i = 0; i < values.length; i++) if (best < 0 || (dates[i] ?? '') >= (dates[best] ?? '')) best = i
      return best < 0 ? null : values[best]
    }
  }
  throw new FormulaError(`Agregación desconocida ${fn}`)
}

/** Evaluates an aggregate formula for one group of rows. Aggregates evaluate their argument per row. */
export function evalGroup(node: Node, rows: Row[], resolve: Resolver, groupValue: (name: string) => unknown, dateOf?: (r: Row) => string | null): Value {
  const go = (n: Node): Value => {
    switch (n.k) {
      case 'call':
        if (AGG.has(n.fn)) {
          const inner = n.args[0]
          if (!inner) return n.fn === 'COUNT' ? rows.length : null
          return aggregate(n.fn, rows.map(r => evalRow(inner, r, resolve)), dateOf ? rows.map(dateOf) : undefined)
        }
        return scalarFn(n.fn, n.args.map(go))
      case 'field': return (groupValue(n.name) ?? null) as Value
      case 'unary': { const v = go(n.arg); return n.op === '-' ? (v === null ? null : -num(v)!) : !v }
      case 'bin': return applyBin(n.op, go(n.l), go(n.r))
      default: return evalRow(n, {}, resolve)
    }
  }
  return go(node)
}
