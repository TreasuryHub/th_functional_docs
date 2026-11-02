import type { Entity, FieldType, Row } from '../model/types'
import type { Catalog, DataStore } from './catalog'
import { aggregate, evalGroup, evalRow, fieldRefs, isAggregate, parse, type Value } from './formula'
import { bindFilter, interpolate, resolveParamValues } from './params'
import { grainApplies, isParamRef, type CalcField, type ColumnRef, type Filter, type GrainMode, type JoinContext, type ReportTemplate, type TimeGrain } from './report'

// ============================================================================ mix analysis

export interface MixAnalysis {
  /** base entity ids touched by dimensions / measures */
  entities: string[]
  /** entities with no other used entity below them */
  leaves: string[]
  /** a used parent/child pair: the decision the Builder asks about */
  parent?: string
  child?: string
  /** entity whose rows are scanned (the leaf, or the bridge for M:N) */
  grain?: string
  /** M:N resolved through a bridge entity nobody selected */
  bridge?: string
  /** two or more leaves under a common ancestor (e.g. Balances + Transactions under Account) */
  siblings?: string[]
  commonAncestor?: string
  /** some measure lives in its own JOIN context -> independent aggregations joined on the dimensions */
  multiScope: boolean
  /** subtypes used -> implicit type filter */
  subtypes: Entity[]
  needsDecision: boolean
  /** changes when the parent/child combination changes, so an old decision is re-asked */
  signature: string
  unreachable: string[]
}

/** `post` = formula over result columns ([@Saldo al {Hasta}] - [@Saldo al {Desde}]), evaluated after aggregation. */
type CalcIndex = Map<string, { calc: CalcField; ast: ReturnType<typeof parse>; agg: boolean; post: boolean }>

export function indexCalcs(calcs: CalcField[]): CalcIndex {
  const m: CalcIndex = new Map()
  for (const c of calcs) {
    try {
      const ast = parse(c.expr)
      const post = [...fieldRefs(ast)].some(n => n.startsWith('@'))
      m.set(c.id, { calc: c, ast, agg: isAggregate(ast) || post, post })
    } catch { /* invalid formulas are reported by the editor */ }
  }
  // a formula that references an aggregate formula is itself aggregate: [Cobros] - [Pagos];
  // one that references a column formula is itself a column formula: [Variación] - [@Movimientos]
  for (let changed = true; changed;) {
    changed = false
    for (const v of m.values()) {
      const refs = [...fieldRefs(v.ast)].map(n => resolveFormulaRef(n, calcs)).filter(r => r.startsWith('calc.')).map(r => m.get(r.split('.')[1]))
      if (!v.agg && refs.some(x => x?.agg)) { v.agg = true; changed = true }
      if (!v.post && refs.some(x => x?.post)) { v.post = true; v.agg = true; changed = true }
    }
  }
  return m
}

/** Field refs inside formulas are written as [entity.field] or [calc name]. */
export function resolveFormulaRef(name: string, calcs: CalcField[]): string {
  if (name.includes('.')) return name
  const c = calcs.find(x => x.name.toLowerCase() === name.toLowerCase())
  return c ? `calc.${c.id}` : name
}

function entitiesOfRef(ref: string, calcs: CalcIndex, all: CalcField[], seen = new Set<string>()): string[] {
  const [eid, fid] = ref.split('.')
  if (eid !== 'calc') return [eid]
  if (seen.has(fid)) return []
  seen.add(fid)
  const c = calcs.get(fid)
  if (!c) return []
  return [...fieldRefs(c.ast)].flatMap(n => entitiesOfRef(resolveFormulaRef(n, all), calcs, all, seen))
}

export function analyzeMix(t: ReportTemplate, catalog: Catalog): MixAnalysis {
  const calcs = indexCalcs(t.calcs)
  const raw = [...t.dimensions, ...t.measures].flatMap(c => entitiesOfRef(c.ref, calcs, t.calcs))
  const known = raw.filter(id => catalog.byId.has(id))
  const subtypes = [...new Set(known)].map(id => catalog.entity(id)).filter(e => e.parent?.kind === 'subtype')
  const entities = [...new Set(known.map(id => catalog.base(id)))]
  const leaves = entities.filter(x => !entities.some(y => y !== x && catalog.isAncestor(x, y)))
  const signature = [...entities].sort().join('+')
  const ctxIds = new Set((t.contexts ?? []).map(c => c.id))
  const multiScope = t.measures.some(m => !!m.ctx && ctxIds.has(m.ctx))
  const res: MixAnalysis = { entities, leaves, subtypes, needsDecision: false, signature, unreachable: [], multiScope }

  res.grain = leaves[0]
  if (leaves.length > 1) {
    const anc = catalog.commonAncestor(leaves)
    const bridge = anc ? null : catalog.commonDescendant(leaves)
    if (anc) { res.siblings = leaves; res.commonAncestor = anc }
    else if (bridge) { res.bridge = bridge; res.grain = bridge }
    else res.unreachable = leaves.slice(1)
  }
  if (!res.siblings && !res.unreachable.length) {
    // nearest used (ancestor, descendant) pair -> the parent/child decision
    let best: { p: string; c: string; len: number } | null = null
    for (const c of entities) for (const p of entities) {
      if (p === c || !catalog.isAncestor(p, c)) continue
      const len = catalog.pathUp(c, p)!.length
      const cIsLeaf = leaves.includes(c) ? 0 : 1
      if (!best || cIsLeaf * 10 + len < (leaves.includes(best.c) ? 0 : 10) + best.len) best = { p, c, len }
    }
    if (best) {
      res.parent = best.p
      res.child = best.c
      res.needsDecision = !multiScope && !grainApplies(t.grain, signature)
    }
  }
  return res
}

// ============================================================================ result types

export interface ResultColumn {
  key: string
  label: string
  kind: 'dim' | 'measure'
  type: FieldType | 'calc'
  format?: string
  entity?: string
  ref: string
}

export interface ResultRow {
  key: string
  cells: Record<string, Value>
  depth: number
  kind: 'group' | 'row' | 'detail'
  children?: ResultRow[]
}

export interface QueryResult {
  columns: ResultColumn[]
  rows: ResultRow[]
  totals: Record<string, Value>
  warnings: string[]
  notices: string[]
  mode: GrainMode | 'flat' | 'drill-across' | 'detail'
  grainLabel: string
  sql: string
  scanned: number
  ms: number
}

// ============================================================================ helpers

export function bucket(v: unknown, grain?: TimeGrain): Value {
  if (!v || !grain) return (v ?? null) as Value
  const d = new Date(String(v).slice(0, 10) + 'T00:00:00Z')
  if (Number.isNaN(d.getTime())) return String(v)
  const y = d.getUTCFullYear(), m = d.getUTCMonth()
  switch (grain) {
    case 'day': return d.toISOString().slice(0, 10)
    case 'week': {
      const day = (d.getUTCDay() + 6) % 7
      const monday = new Date(d.getTime() - day * 86_400_000)
      return monday.toISOString().slice(0, 10)
    }
    case 'month': return `${y}-${String(m + 1).padStart(2, '0')}`
    case 'quarter': return `${y}-Q${Math.floor(m / 3) + 1}`
    case 'year': return String(y)
  }
}

function matchFilter(v: unknown, f: Filter, today: string): boolean {
  const s = v === null || v === undefined ? null : v
  switch (f.op) {
    case 'eq': return String(s) === String(f.value)
    case 'neq': return String(s) !== String(f.value)
    case 'in': return Array.isArray(f.value) && (f.value.length === 0 || f.value.map(String).includes(String(s)))
    case 'nin': return !Array.isArray(f.value) || !f.value.map(String).includes(String(s))
    case 'gt': return s !== null && (typeof s === 'string' ? s > String(f.value) : Number(s) > Number(f.value))
    case 'gte': return s !== null && (typeof s === 'string' ? s >= String(f.value) : Number(s) >= Number(f.value))
    case 'lt': return s !== null && (typeof s === 'string' ? s < String(f.value) : Number(s) < Number(f.value))
    case 'lte': return s !== null && (typeof s === 'string' ? s <= String(f.value) : Number(s) <= Number(f.value))
    case 'between': {
      if (s === null) return false
      if (typeof s === 'string') return (!f.value || s >= String(f.value)) && (!f.value2 || s.slice(0, 10) <= String(f.value2))
      return Number(s) >= Number(f.value) && Number(s) <= Number(f.value2)
    }
    case 'contains': return s !== null && String(s).toLowerCase().includes(String(f.value ?? '').toLowerCase())
    case 'is_null': return s === null || s === ''
    case 'not_null': return s !== null && s !== ''
    case 'last_n_days': {
      if (s === null) return false
      const from = new Date(Date.parse(today) - Number(f.value ?? 30) * 86_400_000).toISOString().slice(0, 10)
      return String(s).slice(0, 10) >= from && String(s).slice(0, 10) <= today
    }
  }
}

const isEmptyFilter = (f: Filter) =>
  !['is_null', 'not_null'].includes(f.op) &&
  (f.value === undefined || f.value === '' || (Array.isArray(f.value) && f.value.length === 0)) &&
  (f.op !== 'between' || !f.value2)

// ============================================================================ executor

export interface RunOptions {
  today?: string
  /** override filter values (Viewer parameters) */
  params?: Filter[]
  /** values for the report parameters (ReportParam.id -> value); defaults otherwise */
  paramValues?: Record<string, string | number>
}

export function runReport(t: ReportTemplate, catalog: Catalog, store: DataStore, opts: RunOptions = {}): QueryResult {
  const t0 = performance.now()
  const today = opts.today ?? new Date().toISOString().slice(0, 10)
  const warnings: string[] = []
  const notices: string[] = []
  const calcs = indexCalcs(t.calcs)
  const mix = analyzeMix(t, catalog)
  const pvals = resolveParamValues(t, opts.paramValues, today)
  const rawFilters = (opts.params ?? t.filters).filter(f => !isEmptyFilter(bindFilter(f, pvals)))
  const filters = rawFilters.map(f => bindFilter(f, pvals))
  const ctxById = new Map((t.contexts ?? []).map(c => [c.id, c]))
  const ctxFilters = (c?: JoinContext) => (c?.filters ?? []).map(f => bindFilter(f, pvals)).filter(f => !isEmptyFilter(f))
  const isPost = (ref: string) => ref.startsWith('calc.') && !!calcs.get(ref.split('.')[1])?.post

  if (!t.dimensions.length && !t.measures.length) {
    return { columns: [], rows: [], totals: {}, warnings, notices, mode: 'flat', grainLabel: '—', sql: '', scanned: 0, ms: 0 }
  }
  if (mix.unreachable.length) warnings.push(`No hay un camino de join entre ${mix.leaves.map(l => catalog.entity(l).label).join(' y ')}. Se usa sólo ${catalog.entity(mix.leaves[0]).label}.`)

  // ---- value resolution on a row of `leaf`
  const makeResolver = (leaf: string) => {
    const resolveRef = (row: Row, ref: string, depth = 0): unknown => {
      const [eid, fid] = ref.split('.')
      if (eid === 'calc') {
        const c = calcs.get(fid)
        if (!c || c.agg || depth > 8) return null
        return evalRow(c.ast, row, (r, n) => resolveRef(r, resolveFormulaRef(n, t.calcs), depth + 1))
      }
      if (!catalog.byId.has(eid)) return null
      const base = catalog.base(eid)
      if (base === catalog.base(leaf)) return row[fid]
      const up = store.climb(leaf, row, base)
      return up?.[fid]
    }
    return resolveRef
  }

  const columnMeta = (c: ColumnRef, kind: 'dim' | 'measure'): ResultColumn => {
    const hit = catalog.lookup(c.ref)
    if (hit) {
      const grain = c.grain ? ` (${grainLabel(c.grain)})` : ''
      const agg = kind === 'measure' && c.agg ? `${aggLabel(c.agg)} ` : ''
      const ctx = c.ctx ? ctxById.get(c.ctx) : undefined
      return {
        key: c.id, ref: c.ref, label: c.label ? interpolate(c.label, t, pvals) : `${agg}${hit.field.label}${grain}${ctx ? ` · ${ctx.name}` : ''}`, kind, type: hit.field.type, entity: hit.entity.id,
        ...(kind === 'measure' && c.agg === 'ONE' ? { format: 'text' } : {}),
      }
    }
    const calc = calcs.get(c.ref.split('.')[1])
    return { key: c.id, ref: c.ref, label: interpolate(c.label || calc?.calc.name || c.ref, t, pvals), kind, type: 'calc', format: calc?.calc.format }
  }

  // ---- decide mode
  let mode: QueryResult['mode'] = 'flat'
  if (mix.siblings || mix.multiScope) mode = 'drill-across'
  else if (mix.parent) mode = grainApplies(t.grain, mix.signature) ? t.grain.mode : 'parent'
  const leaves = mix.siblings ?? [mix.grain ?? catalog.base((t.dimensions[0] ?? t.measures[0]).ref.split('.')[0])]
  const leaf = leaves[0]

  let dims = t.dimensions
  const measures = t.measures
  const refEntities = (ref: string) => entitiesOfRef(ref, calcs, t.calcs).filter(e => catalog.byId.has(e)).map(e => catalog.base(e))
  const isLeafRef = (ref: string, lf = leaf) => refEntities(ref).includes(catalog.base(lf))
  /** belongs to the child side of the parent/child decision (the child or anything below it) */
  const isChildRef = (ref: string) => !!mix.child && refEntities(ref).some(e => e === mix.child || catalog.isAncestor(mix.child!, e))

  if (mode === 'parent') {
    const dropped = dims.filter(d => isChildRef(d.ref))
    if (dropped.length) {
      warnings.push(`En modo "una fila por ${catalog.entity(mix.parent!).label}" no se agrupa por campos de ${catalog.entity(mix.child!).label}: ${dropped.map(d => columnMeta(d, 'dim').label).join(', ')}. Pasalos a filtros o cambiá a modo jerárquico.`)
      dims = dims.filter(d => !isChildRef(d.ref))
    }
  }
  // ---- scopes: one independent aggregation per (table, JOIN context). Siblings and contexts alike.
  type Scope = { key: string; leaf: string; ctx?: JoinContext; measures: ColumnRef[] }
  const scopes: Scope[] = []
  const scopeLabel = (sc: Scope) => `${catalog.entity(sc.leaf).label}${sc.ctx ? ` · ${sc.ctx.name}` : ''}`
  if (mode === 'drill-across') {
    const baseLeaves = mix.siblings ?? [leaf]
    const scopeFor = (lf: string, ctx?: JoinContext) => {
      const key = `${lf}@${ctx?.id ?? ''}`
      let sc = scopes.find(x => x.key === key)
      if (!sc) { sc = { key, leaf: lf, ctx, measures: [] }; scopes.push(sc) }
      return sc
    }
    const pending: ColumnRef[] = []
    for (const m of measures) {
      if (isPost(m.ref)) continue
      const ctx = m.ctx ? ctxById.get(m.ctx) : undefined
      if (ctx) { scopeFor(catalog.base(ctx.entity), ctx).measures.push(m); continue }
      const own = baseLeaves.find(l => refEntities(m.ref).includes(l))
      if (own) scopeFor(own).measures.push(m)
      else pending.push(m) // ancestor measure (e.g. # cuentas): computed once, in the first plain scope
    }
    if (!scopes.length) scopeFor(baseLeaves[0])
    const host = scopes.find(x => !x.ctx) ?? scopes[0]
    host.measures.push(...pending)

    const resolvable = (ref: string, lf: string) => refEntities(ref).every(e => e === catalog.base(lf) || !!catalog.pathUp(lf, e))
    const bad = dims.filter(d => scopes.some(sc => !resolvable(d.ref, sc.leaf)))
    if (bad.length) {
      warnings.push(`${bad.map(d => columnMeta(d, 'dim').label).join(', ')} no existe en todos los JOINs (${scopes.map(scopeLabel).join(', ')}); agrupar por ahí duplicaría o perdería filas. Se quitó del agrupamiento.`)
      dims = dims.filter(d => !bad.includes(d))
    }
    const by = dims.length ? dims.map(d => columnMeta(d, 'dim').label).join(' × ') : 'total'
    if (mix.multiScope) notices.push(`${scopes.length} JOINs independientes (${scopes.map(scopeLabel).join(' · ')}): cada uno se filtra y agrega por separado, y se unen por ${by}.`)
    else notices.push(`${mix.siblings!.map(s => catalog.entity(s).label).join(' y ')} son hermanos bajo ${catalog.entity(mix.commonAncestor!).label}: cada uno se agrega por separado y luego se une por las dimensiones (drill-across, sin fan-out).`)
  }
  if (mix.bridge) {
    notices.push(`Relación M:N resuelta vía ${catalog.entity(mix.bridge).label} (${catalog.entity(mix.bridge).table}). Un ítem con varios tags cuenta en cada grupo, pero los totales se deduplican (agregado simétrico).`)
  }
  if (mix.subtypes.length) {
    const types = [...new Set(mix.subtypes.flatMap(s => s.parent!.typeValues ?? []))]
    notices.push(`Usás campos de ${mix.subtypes.map(s => s.label).join(', ')} → se filtra type ∈ {${types.join(', ')}}.`)
  }

  const dimCols = dims.map(d => columnMeta(d, 'dim'))
  const measCols = measures.map(m => columnMeta(m, 'measure'))
  const columns = [...dimCols, ...measCols]

  // ---- per-leaf filtered rows
  let scanned = 0
  const filteredRows = (lf: string, extra: Filter[] = []): Row[] => {
    const resolve = makeResolver(lf)
    let rows = store.rows(lf)
    scanned += rows.length
    const typeValues = mix.subtypes.filter(s => catalog.base(s.parent!.entity) === catalog.base(lf)).flatMap(s => s.parent!.typeValues ?? [])
    if (typeValues.length) rows = rows.filter(r => typeValues.includes(String(r.type)))
    for (const f of [...filters, ...extra]) {
      const [eid, fid] = f.ref.split('.')
      if (eid === 'calc') {
        const c = calcs.get(fid)
        if (!c || c.agg) continue // aggregate calcs are applied after grouping (HAVING)
        rows = rows.filter(r => matchFilter(resolve(r, f.ref), f, today))
        continue
      }
      if (!catalog.byId.has(eid)) continue
      const fb = catalog.base(eid)
      if (fb === catalog.base(lf) || catalog.pathUp(lf, fb)) {
        rows = rows.filter(r => matchFilter(resolve(r, f.ref), f, today))
      } else if (catalog.pathUp(fb, lf)) {
        // filter on a descendant: keep leaf rows that have at least one matching child (semi-join)
        const ok = new Set<unknown>()
        const leafKey = catalog.entity(lf).key
        for (const cr of store.rows(fb)) if (matchFilter(cr[fid], f, today)) { const up = store.climb(fb, cr, lf); if (up) ok.add(up[leafKey]) }
        rows = rows.filter(r => ok.has(r[leafKey]))
        if (!notices.some(n => n.includes('semi-join'))) notices.push(`Filtro sobre ${catalog.entity(fb).label} aplicado como semi-join ("que tengan al menos uno").`)
      } else {
        // sibling filter: go through the common ancestor
        const anc = catalog.commonAncestor([lf, fb])
        if (anc) {
          const ancKey = catalog.entity(anc).key
          const ok = new Set<unknown>()
          for (const cr of store.rows(fb)) if (matchFilter(cr[fid], f, today)) { const up = store.climb(fb, cr, anc); if (up) ok.add(up[ancKey]) }
          rows = rows.filter(r => ok.has(store.climb(lf, r, anc)?.[ancKey]))
        } else warnings.push(`El filtro sobre ${catalog.entity(fb).label} no aplica a ${catalog.entity(lf).label}.`)
      }
    }
    return rows
  }

  // ---- measure evaluation over a group of leaf rows
  const measureValue = (m: ColumnRef, rows: Row[], lf: string, groupCells: Record<string, Value>, depth = 0): Value => {
    const resolve = makeResolver(lf)
    const [eid, fid] = m.ref.split('.')
    if (eid === 'calc') {
      const c = calcs.get(fid)
      if (!c || c.post) return null
      const le = catalog.entity(lf)
      if (!c.agg) return aggregate(m.agg ?? 'SUM', rows.map(r => resolve(r, m.ref) as Value))
      return evalGroup(c.ast, rows, (r, n) => resolve(r, resolveFormulaRef(n, t.calcs)), n => {
        const ref = resolveFormulaRef(n, t.calcs)
        const d = dims.find(x => x.ref === ref)
        if (d) return groupCells[d.id]
        // another aggregate formula referenced by name, e.g. [Cobros] - [Pagos]
        if (ref.startsWith('calc.') && calcs.get(ref.split('.')[1])?.agg && depth < 8) return measureValue({ id: '_', ref }, rows, lf, groupCells, depth + 1)
        return rows[0] ? (resolve(rows[0], ref) as Value) : null
      }, le.dateField ? r => String(r[le.dateField!] ?? '') : undefined)
    }
    const hit = catalog.lookup(m.ref)
    if (!hit) return null
    const agg = m.agg ?? hit.field.agg ?? 'SUM'
    const mb = catalog.base(eid)
    const owner = catalog.entity(mb)
    // measure of an ancestor evaluated at a finer grain: symmetric aggregate, one value per ancestor row
    if (mb !== catalog.base(lf)) {
      const seen = new Map<unknown, Row>()
      for (const r of rows) { const up = store.climb(lf, r, mb); if (up && !seen.has(up[owner.key])) seen.set(up[owner.key], up) }
      const ups = [...seen.values()]
      return semi(agg, ups, fid, hit.field, owner)
    }
    return semi(agg, rows, fid, hit.field, owner)
  }

  function semi(agg: string, rows: Row[], fid: string, field: { semiAdditive?: boolean; partitionBy?: string }, owner: Entity): Value {
    if (agg === 'LAST' && field.semiAdditive && field.partitionBy && owner.dateField) {
      // semi-additive: latest value per partition (account), then summed across partitions
      const latest = new Map<unknown, Row>()
      for (const r of rows) {
        const k = r[field.partitionBy]
        const cur = latest.get(k)
        if (!cur || String(r[owner.dateField]) >= String(cur[owner.dateField])) latest.set(k, r)
      }
      return aggregate('SUM', [...latest.values()].map(r => r[fid] as Value))
    }
    return aggregate(agg, rows.map(r => r[fid] as Value), owner.dateField ? rows.map(r => String(r[owner.dateField!] ?? '')) : undefined)
  }

  const dimValue = (d: ColumnRef, row: Row, lf: string) => bucket(makeResolver(lf)(row, d.ref), d.grain)

  const groupBy = (rows: Row[], ds: ColumnRef[], lf: string) => {
    const groups = new Map<string, { cells: Record<string, Value>; rows: Row[] }>()
    for (const r of rows) {
      const cells: Record<string, Value> = {}
      ds.forEach(d => { cells[d.id] = dimValue(d, r, lf) })
      const k = ds.map(d => String(cells[d.id])).join('\u0001')
      let g = groups.get(k)
      if (!g) { g = { cells, rows: [] }; groups.set(k, g) }
      g.rows.push(r)
    }
    return groups
  }

  // ---- currency safety: a money measure in original currency must not add up different currencies
  const moneyCcy = (m: ColumnRef): string | undefined => {
    if (m.agg === 'COUNT' || m.agg === 'COUNTD' || m.agg === 'ONE') return undefined
    const hit = catalog.lookup(m.ref)
    if (hit) return hit.field.currencyRef
    // a formula over amounts in original currency (e.g. SUM(IF(…, [amount], 0))) inherits their currency
    const c = m.ref.startsWith('calc.') ? calcs.get(m.ref.split('.')[1]) : undefined
    if (!c || c.post) return undefined
    return [...fieldRefs(c.ast)].map(n => catalog.lookup(resolveFormulaRef(n, t.calcs))?.field.currencyRef).find(Boolean)
  }
  const mixedCols = new Set<string>()
  const checkCcy = (rows: Row[], lf: string, groupLevel: boolean, only: ColumnRef[] = measures) => {
    for (const m of only) {
      const cref = moneyCcy(m)
      if (!cref) continue
      const resolve = makeResolver(lf)
      const seen = new Set<unknown>()
      // rows without a currency (e.g. a pending movement with no conciliation yet) don't count as another currency
      for (const r of rows) { const ccy = resolve(r, cref); if (ccy !== null && ccy !== undefined && ccy !== '') seen.add(ccy); if (seen.size > 1) break }
      if (seen.size > 1) { if (groupLevel) mixedCols.add(m.id); else mixedTotals.add(m.id) }
    }
  }
  const mixedTotals = new Set<string>()

  const having = filters.filter(f => f.ref.startsWith('calc.') && calcs.get(f.ref.split('.')[1])?.agg)
  const passHaving = (cells: Record<string, Value>) => having.every(f => {
    const col = measures.find(m => m.ref === f.ref)
    return col ? matchFilter(cells[col.id], f, today) : true
  })

  let rows: ResultRow[] = []
  const totals: Record<string, Value> = {}
  let grainLabelTxt = ''

  if (mode === 'drill-across') {
    const merged = new Map<string, ResultRow>()
    for (const sc of scopes) {
      const lrows = filteredRows(sc.leaf, ctxFilters(sc.ctx))
      checkCcy(lrows, sc.leaf, false, sc.measures)
      for (const [k, g] of groupBy(lrows, dims, sc.leaf)) {
        checkCcy(g.rows, sc.leaf, true, sc.measures)
        let rr = merged.get(k)
        if (!rr) { rr = { key: k, cells: { ...g.cells }, depth: 0, kind: 'row' }; merged.set(k, rr) }
        sc.measures.forEach(m => { rr!.cells[m.id] = measureValue(m, g.rows, sc.leaf, g.cells) })
      }
      sc.measures.forEach(m => { totals[m.id] = measureValue(m, lrows, sc.leaf, {}) })
    }
    rows = [...merged.values()]
    // a key present in one JOIN but not in another has no value there (FULL OUTER JOIN)
    rows.forEach(r => measures.forEach(m => { if (r.cells[m.id] === undefined) r.cells[m.id] = null }))
    grainLabelTxt = dims.length ? dimCols.map(c => c.label).join(' × ') : mix.commonAncestor ? catalog.entity(mix.commonAncestor).label : 'Total'
  } else {
    const lrows = filteredRows(leaf)
    const leafE = catalog.entity(leaf)
    if (mode === 'child' || (mode === 'flat' && !measures.length)) {
      // detail: one row per leaf row
      mode = mode === 'flat' ? 'detail' : 'child'
      rows = lrows.map(r => {
        const cells: Record<string, Value> = {}
        dims.forEach(d => { cells[d.id] = dimValue(d, r, leaf) })
        measures.forEach(m => { cells[m.id] = measureValue(m, [r], leaf, cells) })
        return { key: String(r[leafE.key]), cells, depth: 0, kind: 'row' as const }
      })
      grainLabelTxt = `1 fila por ${leafE.label}`
      if (mode === 'child') {
        const parentMeasures = measures.filter(m => !isLeafRef(m.ref) && !m.ref.startsWith('calc.'))
        if (parentMeasures.length) notices.push(`${parentMeasures.map(m => columnMeta(m, 'measure').label).join(', ')} no es de ${leafE.label}: se repite en cada fila, pero el total se calcula una vez por registro de origen (agregado simétrico).`)
      }
    } else if (mode === 'nested') {
      const parentDims = dims.filter(d => !isChildRef(d.ref))
      const childDims = dims.filter(d => isChildRef(d.ref))
      for (const [k, g] of groupBy(lrows, parentDims, leaf)) {
        if (!childDims.length) checkCcy(g.rows, leaf, true)
        const cells = { ...g.cells }
        measures.forEach(m => { cells[m.id] = measureValue(m, g.rows, leaf, cells) })
        let children: ResultRow[]
        if (childDims.length) {
          children = [...groupBy(g.rows, childDims, leaf)].map(([ck, cg]) => {
            checkCcy(cg.rows, leaf, true)
            const cc: Record<string, Value> = { ...cells, ...cg.cells }
            measures.forEach(m => { cc[m.id] = measureValue(m, cg.rows, leaf, cc) })
            return { key: k + '|' + ck, cells: cc, depth: 1, kind: 'row' as const }
          })
        } else {
          children = g.rows.map(r => {
            const cc: Record<string, Value> = { ...cells }
            measures.forEach(m => { cc[m.id] = measureValue(m, [r], leaf, cc) })
            cc.__label = String(r[leafE.labelField ?? leafE.key] ?? r[leafE.key])
            return { key: k + '|' + String(r[leafE.key]), cells: cc, depth: 1, kind: 'detail' as const }
          })
        }
        rows.push({ key: k, cells, depth: 0, kind: 'group', children })
      }
      grainLabelTxt = `${catalog.entity(mix.parent!).label} ▸ ${childDims.length ? childDims.map(d => columnMeta(d, 'dim').label).join(' × ') : leafE.label}`
    } else {
      // flat / parent: aggregate by the chosen dims
      for (const [k, g] of groupBy(lrows, dims, leaf)) {
        checkCcy(g.rows, leaf, true)
        const cells = { ...g.cells }
        measures.forEach(m => { cells[m.id] = measureValue(m, g.rows, leaf, cells) })
        rows.push({ key: k, cells, depth: 0, kind: 'row' })
      }
      grainLabelTxt = mode === 'parent'
        ? `1 fila por ${dims.length ? dimCols.map(c => c.label).join(' × ') : catalog.entity(mix.parent!).label} (hijos agregados)`
        : dims.length ? `1 fila por ${dimCols.map(c => c.label).join(' × ')}` : 'Total'
    }
    measures.forEach(m => { totals[m.id] = measureValue(m, lrows, leaf, {}) })
    checkCcy(lrows, leaf, false)
  }

  // ---- running totals: accumulate down the rows in their order, per partition, from the opening balance
  const running = measures.filter(m => m.running)
  const cmpValues = (x: Value, y: Value) => {
    if (x === y) return 0
    if (x === null || x === undefined) return 1
    if (y === null || y === undefined) return -1
    return typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))
  }
  const round2 = (x: number) => Math.round(x * 100) / 100
  const SEP = '\u0001'
  for (const m of running) {
    const rt = m.running!
    const keys = [rt.partition, ...(rt.order ?? [])].filter((k): k is string => !!k && dims.some(d => d.id === k))
    rows.sort((a, b) => { for (const k of keys) { const c = cmpValues(a.cells[k], b.cells[k]); if (c) return c } return 0 })
    const opening = new Map<string, number>()
    const before = rt.opening ? (isParamRef(rt.opening.before) ? pvals[rt.opening.before.$param] : rt.opening.before) : undefined
    const hit = rt.opening ? catalog.lookup(rt.opening.ref) : null
    if (hit && before) {
      // semi-additive: the latest balance before the period, per account, summed within each partition
      const owner = catalog.entity(catalog.base(hit.entity.id))
      const pdim = dims.find(d => d.id === rt.partition)
      const resolve = makeResolver(owner.id)
      const latest = new Map<string, Row>()
      for (const r of store.rows(owner.id)) {
        const date = String(r[owner.dateField!] ?? '')
        if (!(date < String(before))) continue
        const k = `${pdim ? String(bucket(resolve(r, pdim.ref), pdim.grain)) : ''}${SEP}${r[hit.field.partitionBy ?? owner.key]}`
        const cur = latest.get(k)
        if (!cur || date >= String(cur[owner.dateField!])) latest.set(k, r)
      }
      for (const [k, r] of latest) { const p = k.split(SEP)[0]; opening.set(p, (opening.get(p) ?? 0) + Number(r[hit.field.id] ?? 0)) }
      const day = String(before).split('-').reverse().join('/')
      notices.push(`"${columnMeta(m, 'measure').label}" arranca en el último ${hit.field.label.toLowerCase()} anterior al ${day} y suma cada fila en orden${keys.length ? ` (${keys.map(k => dimCols.find(c => c.key === k)!.label).join(', ')})` : ''}${rt.divideBy ? `, convertido al tipo de cambio de cada fila (${columnMeta(measures.find(x => x.id === rt.divideBy)!, 'measure').label})` : ''}.`)
      if (!latest.size) notices.push(`No hay ${hit.field.label.toLowerCase()} anterior al ${day}: el acumulado arranca en 0.`)
    }
    const acc = new Map<string, number>()
    const lastRate = new Map<string, number>()
    for (const r of rows) {
      const p = rt.partition ? String(r.cells[rt.partition]) : ''
      const next = (acc.has(p) ? acc.get(p)! : opening.get(p) ?? 0) + Number(r.cells[m.id] ?? 0)
      acc.set(p, next)
      if (!rt.divideBy) { r.cells[m.id] = round2(next); continue }
      // shown in another currency: the balance so far, converted at this row's rate (e.g. ARS per USD that day)
      const rate = Number(r.cells[rt.divideBy])
      lastRate.set(p, rate)
      r.cells[m.id] = rate ? round2(next / rate) : null
    }
    // the total is the closing value of every partition; converted ones share a currency, so they add up
    const closing = [...acc].reduce((a, [p, v]) => a + (rt.divideBy ? v / (lastRate.get(p) || NaN) : v), 0)
    if (rt.divideBy) mixedTotals.delete(m.id)
    totals[m.id] = mixedTotals.has(m.id) || !Number.isFinite(closing) ? null : round2(closing)
  }

  // a text column has no meaningful total
  measures.filter(m => m.agg === 'ONE').forEach(m => { totals[m.id] = null })

  const hiddenTotals: string[] = []
  for (const m of measures) {
    const label = columnMeta(m, 'measure').label
    if (mixedCols.has(m.id)) warnings.push(`"${label}" suma importes de distintas monedas en una misma fila. Agregá la moneda como dimensión o usá el campo en USD.`)
    else if (mixedTotals.has(m.id)) { totals[m.id] = null; hiddenTotals.push(label) }
  }
  if (hiddenTotals.length) notices.push(`Totales ocultos porque las filas están en distintas monedas: ${hiddenTotals.join(', ')}.`)

  // ---- column formulas, evaluated on the aggregated cells (rows, children and totals)
  const postMeasures = measures.filter(m => isPost(m.ref))
  if (postMeasures.length) {
    const norm = (x: string) => x.toLowerCase().trim()
    const findCol = (name: string) => measures.find(m => norm(m.id) === norm(name) || norm(m.label ?? '') === norm(name) || norm(columnMeta(m, 'measure').label) === norm(name))
    const evalPost = (cells: Record<string, Value>) => {
      for (let pass = 0; pass < 2; pass++) for (const m of postMeasures) {
        const c = calcs.get(m.ref.split('.')[1])!
        try {
          cells[m.id] = evalRow(c.ast, cells, (cc, n) => {
            if (n.startsWith('@')) { const col = findCol(n.slice(1)); return col ? cc[col.id] : null }
            const pm = measures.find(x => x.ref === resolveFormulaRef(n, t.calcs))
            return pm ? cc[pm.id] : null
          })
        } catch { cells[m.id] = null }
      }
    }
    rows.forEach(r => { evalPost(r.cells); r.children?.forEach(ch => evalPost(ch.cells)) })
    evalPost(totals)
  }

  rows = rows.filter(r => passHaving(r.cells))

  // ---- sort + limit (running totals keep their chronological order unless the report sets one)
  const sortKey = t.sort ? [...t.dimensions, ...t.measures].find(c => c.id === t.sort!.ref || c.ref === t.sort!.ref)?.id : running.length ? undefined : dims[0]?.id
  const dir = t.sort?.dir === 'desc' ? -1 : 1
  const cmp = (a: ResultRow, b: ResultRow) => {
    if (!sortKey) return 0
    const x = a.cells[sortKey], y = b.cells[sortKey]
    if (x === y) return 0
    if (x === null || x === undefined) return 1
    if (y === null || y === undefined) return -1
    return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * dir
  }
  rows.sort(cmp)
  rows.forEach(r => r.children?.sort(cmp))
  if (t.limit && t.limit > 0) rows = rows.slice(0, t.limit)

  return {
    columns, rows, totals, warnings, notices, mode, grainLabel: grainLabelTxt,
    sql: buildSql(t, catalog, mix, mode, dims, rawFilters, calcs, Object.fromEntries(columns.map(c => [c.key, c.label])), scopes),
    scanned, ms: Math.round((performance.now() - t0) * 10) / 10,
  }
}

// ============================================================================ SQL preview (what this would be against silver)

function buildSql(t: ReportTemplate, catalog: Catalog, mix: MixAnalysis, mode: QueryResult['mode'], dims: ColumnRef[], filters: Filter[], calcs: CalcIndex, labels: Record<string, string>,
  scopes: { leaf: string; ctx?: JoinContext; measures: ColumnRef[] }[]): string {
  const paramSql = (v: unknown) => `:${((t.params ?? []).find(p => isParamRef(v) && p.id === v.$param)?.name ?? 'param').toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '_')}`
  const alias = new Map<string, string>()
  const aliasOf = (id: string) => {
    const b = catalog.base(id)
    if (!alias.has(b)) {
      let a = catalog.entity(b).table.replace(/^(fct|dim|brg)_/, '').split('_').map(p => p[0]).join('')
      while ([...alias.values()].includes(a)) a += alias.size
      alias.set(b, a)
    }
    return alias.get(b)!
  }
  const col = (ref: string, grain?: TimeGrain): string => {
    const [eid, fid] = ref.split('.')
    if (eid === 'calc') {
      const c = calcs.get(fid)
      if (!c) return 'NULL'
      return c.calc.expr.replace(/\[([^\]]+)\]/g, (_, n: string) => col(resolveFormulaRef(n, t.calcs)))
    }
    if (!catalog.byId.has(eid)) return ref
    const expr = `${aliasOf(eid)}.${fid === 'n' ? catalog.entity(catalog.base(eid)).key : fid}`
    return grain ? `DATE_TRUNC('${grain}', ${expr})` : expr
  }
  const measureSql = (m: ColumnRef): string => {
    if (m.running) {
      const over = [m.running.partition && `PARTITION BY ${q(labels[m.running.partition] ?? '')}`, m.running.order?.length && `ORDER BY ${m.running.order.map(o => q(labels[o] ?? '')).join(', ')}`].filter(Boolean).join(' ')
      return `${m.running.opening ? `saldo_anterior(${paramSql(m.running.opening.before)}) + ` : ''}SUM(${measureSql({ ...m, running: undefined })}) OVER (${over})`
    }
    if (m.ref.startsWith('calc.') && calcs.get(m.ref.split('.')[1])?.agg) return col(m.ref)
    if (m.ctx) {
      const hit = catalog.lookup(m.ref)
      if (hit?.field.semiAdditive) return `SUM(${col(m.ref)}) FILTER (WHERE rn_latest = 1) /* último por ${hit.field.partitionBy} dentro del JOIN */`
    }
    const hit = catalog.lookup(m.ref)
    const agg = m.agg ?? hit?.field.agg ?? 'SUM'
    if (agg === 'LAST' && hit?.field.semiAdditive) return `SUM(${col(m.ref)}) FILTER (WHERE is_latest_per_${hit.field.partitionBy})`
    if (agg === 'COUNTD') return `COUNT(DISTINCT ${col(m.ref)})`
    if (agg === 'ONE') return `CASE WHEN COUNT(DISTINCT ${col(m.ref)}) = 1 THEN MIN(${col(m.ref)}) ELSE COUNT(DISTINCT ${col(m.ref)}) || ' valores' END`
    if (hit && mix.child && catalog.base(hit.entity.id) !== mix.child && mode !== 'drill-across')
      return `${agg}(DISTINCT ON (${aliasOf(hit.entity.id)}.${catalog.entity(catalog.base(hit.entity.id)).key}) ${col(m.ref)}) /* simétrico */`
    return `${agg}(${col(m.ref)})`
  }
  const q = (s: string) => `"${s.replace(/"/g, '')}"`
  const opSql = (f: Filter) => {
    const c = col(f.ref)
    const v = (x: unknown) => (isParamRef(x) ? paramSql(x) : typeof x === 'number' ? String(x) : `'${String(x)}'`)
    switch (f.op) {
      case 'eq': return `${c} = ${v(f.value)}`
      case 'neq': return `${c} <> ${v(f.value)}`
      case 'in': return `${c} IN (${(f.value as unknown[]).map(v).join(', ')})`
      case 'nin': return `${c} NOT IN (${(f.value as unknown[]).map(v).join(', ')})`
      case 'gt': return `${c} > ${v(f.value)}`
      case 'gte': return `${c} >= ${v(f.value)}`
      case 'lt': return `${c} < ${v(f.value)}`
      case 'lte': return `${c} <= ${v(f.value)}`
      case 'between': return `${c} BETWEEN ${v(f.value)} AND ${v(f.value2)}`
      case 'contains': return `${c} ILIKE '%${String(f.value)}%'`
      case 'is_null': return `${c} IS NULL`
      case 'not_null': return `${c} IS NOT NULL`
      case 'last_n_days': return `${c} >= CURRENT_DATE - INTERVAL '${f.value} days'`
    }
  }

  const fromFor = (lf: string, used: string[]) => {
    const lines = [`FROM silver.${catalog.entity(lf).table} ${aliasOf(lf)}`]
    const joined = new Set([catalog.base(lf)])
    for (const u of used) {
      const path = catalog.pathUp(lf, u)
      if (!path) continue
      let prev = catalog.base(lf)
      for (const h of path) {
        if (!joined.has(h.to)) {
          lines.push(`JOIN silver.${catalog.entity(h.to).table} ${aliasOf(h.to)} ON ${aliasOf(h.to)}.${catalog.entity(h.to).key} = ${aliasOf(prev)}.${h.fk}`)
          joined.add(h.to)
        }
        prev = h.to
      }
    }
    return lines
  }
  const refsEntities = [...dims, ...t.measures].map(c => c.ref.split('.')[0]).concat(filters.map(f => f.ref.split('.')[0])).filter(e => catalog.byId.has(e))
  const where = (lf: string, extra: Filter[] = []) => {
    const w = [`${aliasOf(lf)}.tenant_id = :tenant_id`]
    const types = mix.subtypes.flatMap(s => s.parent!.typeValues ?? [])
    if (types.length && catalog.base(mix.subtypes[0].parent!.entity) === catalog.base(lf)) w.push(`${aliasOf(lf)}.type IN (${types.map(x => `'${x}'`).join(', ')})`)
    ;[...filters, ...extra].filter(f => !(f.ref.startsWith('calc.') && calcs.get(f.ref.split('.')[1])?.agg)).forEach(f => w.push(opSql(f)))
    return `WHERE ${w.join('\n  AND ')}`
  }
  const dimSel = dims.map(d => `${col(d.ref, d.grain)} AS ${q(labels[d.id])}`)

  // column formulas: [@Saldo al {Hasta}] -> "Saldo al 30/09/2026"
  const postSql = t.measures.filter(m => m.ref.startsWith('calc.') && calcs.get(m.ref.split('.')[1])?.post).map(m => {
    const c = calcs.get(m.ref.split('.')[1])!
    const expr = c.calc.expr.replace(/\[([^\]]+)\]/g, (_, n: string) => {
      const name = n.startsWith('@') ? n.slice(1) : n
      const hit = t.measures.find(x => [x.id, x.label ?? '', labels[x.id]].some(l => l.toLowerCase() === name.toLowerCase()) || x.ref === resolveFormulaRef(n, t.calcs))
      return hit ? q(labels[hit.id]) : 'NULL'
    })
    return `${expr} AS ${q(labels[m.id])}`
  })

  if (mode === 'drill-across' && scopes.length) {
    const names: string[] = []
    const ctes = scopes.map(sc => {
      let name = `${aliasOf(sc.leaf)}_${(sc.ctx?.name ?? 'agg').toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '_')}`
      while (names.includes(name)) name += '_'
      names.push(name)
      const ms = sc.measures.map(m => `${measureSql(m)} AS ${q(labels[m.id])}`)
      const head = sc.ctx ? `  -- JOIN "${sc.ctx.name}": ${catalog.entity(sc.leaf).table} con sus propios filtros\n` : ''
      return `${name} AS (\n${head}  SELECT ${[...dimSel, ...ms].join(',\n         ')}\n  ${fromFor(sc.leaf, refsEntities).join('\n  ')}\n  ${where(sc.leaf, sc.ctx?.filters).replace(/\n/g, '\n  ')}\n  GROUP BY ${dims.map((_, i) => i + 1).join(', ') || '()'}\n)`
    })
    const [a, ...rest] = names
    const on = dims.map(d => q(labels[d.id]))
    return `WITH ${ctes.join(',\n')}\nSELECT *${postSql.length ? `,\n       ${postSql.join(',\n       ')}` : ''}\nFROM ${a}\n${rest.map(r => `FULL OUTER JOIN ${r} USING (${on.join(', ') || 'TRUE'})`).join('\n')};`
  }

  const leaf = mix.leaves[0] ?? catalog.base((dims[0] ?? t.measures[0]).ref.split('.')[0])
  const detail = mode === 'child' || mode === 'detail'
  const isPostM = (m: ColumnRef) => m.ref.startsWith('calc.') && !!calcs.get(m.ref.split('.')[1])?.post
  const sel = [...dimSel, ...t.measures.filter(m => !isPostM(m)).map(m => `${detail ? col(m.ref) : measureSql(m)} AS ${q(labels[m.id])}`)]
  const lines = [`SELECT ${sel.join(',\n       ')}`, ...fromFor(leaf, refsEntities), where(leaf)]
  const groupList = dims.map((_, i) => i + 1).join(', ')
  if (!detail && dims.length) lines.push(`GROUP BY ${mode === 'nested' ? `ROLLUP(${groupList})` : groupList}`)
  const having = filters.filter(f => f.ref.startsWith('calc.') && calcs.get(f.ref.split('.')[1])?.agg)
  if (having.length) lines.push(`HAVING ${having.map(opSql).join(' AND ')}`)
  if (t.sort && labels[t.sort.ref]) lines.push(`ORDER BY ${q(labels[t.sort.ref])} ${t.sort.dir.toUpperCase()}`)
  if (t.limit) lines.push(`LIMIT ${t.limit}`)
  const inner = lines.join('\n')
  if (!postSql.length) return inner + ';'
  return `SELECT *,\n       ${postSql.join(',\n       ')}\nFROM (\n  ${inner.replace(/\n/g, '\n  ')}\n) q;`
}

export const aggLabel = (a: string) => ({ SUM: 'Σ', AVG: 'x̄', MIN: 'mín', MAX: 'máx', COUNT: '#', COUNTD: '#≠', LAST: 'últ.', FIRST: '1º', ONE: 'valor' } as Record<string, string>)[a] ?? a
export const grainLabel = (g: TimeGrain) => ({ day: 'día', week: 'semana', month: 'mes', quarter: 'trimestre', year: 'año' })[g]
