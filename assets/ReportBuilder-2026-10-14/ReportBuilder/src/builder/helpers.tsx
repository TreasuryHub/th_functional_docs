import { Calendar, Hash, Sigma, ToggleLeft, Type, List, FunctionSquare } from 'lucide-react'
import { indexCalcs } from '../engine/query'
import { isParamRef, type CalcField, type ColumnRef, type Filter, type FilterOp, type ReportTemplate } from '../engine/report'
import { formatParamValue } from '../engine/params'
import { uid } from '../engine/report'
import type { Field, FieldType } from '../model/types'
import { catalog, dataStore } from '../state/store'

export function FieldIcon({ type, role, size = 13 }: { type: FieldType | 'calc'; role?: 'dimension' | 'measure'; size?: number }) {
  const cls = role === 'measure' ? 'text-positive' : 'text-info'
  if (type === 'calc') return <FunctionSquare size={size} className="text-accent-foreground" />
  if (role === 'measure') return <Sigma size={size} className={cls} />
  if (type === 'date' || type === 'datetime') return <Calendar size={size} className={cls} />
  if (type === 'number') return <Hash size={size} className={cls} />
  if (type === 'bool') return <ToggleLeft size={size} className={cls} />
  if (type === 'enum') return <List size={size} className={cls} />
  return <Type size={size} className={cls} />
}

export function refInfo(ref: string, calcs: CalcField[]) {
  const [eid, fid] = ref.split('.')
  if (eid === 'calc') {
    const c = calcs.find(x => x.id === fid)
    const agg = !!c && !!indexCalcs(calcs).get(fid)?.agg
    return { label: c?.name ?? '(fórmula borrada)', entityLabel: 'Fórmula', type: 'calc' as const, role: agg ? 'measure' as const : 'dimension' as const, agg, field: undefined as Field | undefined, calc: c }
  }
  const hit = catalog.lookup(ref)
  return {
    label: hit?.field.label ?? ref, entityLabel: hit?.entity.label ?? eid, type: (hit?.field.type ?? 'string') as FieldType, role: hit?.field.role ?? 'dimension',
    agg: false, field: hit?.field, calc: undefined as CalcField | undefined,
  }
}

export function newColumn(ref: string, target: 'dimensions' | 'measures', calcs: CalcField[]): ColumnRef {
  const info = refInfo(ref, calcs)
  const col: ColumnRef = { id: uid('c'), ref }
  if (target === 'measures') {
    if (info.type === 'calc') { if (!info.agg) col.agg = 'SUM' }
    else col.agg = info.role === 'measure' ? info.field?.agg ?? 'SUM' : 'COUNTD'
  } else if (info.type === 'date') col.grain = 'month'
  return col
}

export function defaultFilter(ref: string, calcs: CalcField[]): Filter {
  const info = refInfo(ref, calcs)
  const op: FilterOp = info.type === 'date' ? 'last_n_days' : info.type === 'enum' ? 'in' : info.type === 'bool' ? 'eq'
    : info.role === 'measure' || info.type === 'number' || info.type === 'money' ? 'gte' : info.type === 'calc' ? 'gte' : 'contains'
  return { id: uid('f'), ref, op, value: op === 'in' ? [] : op === 'last_n_days' ? 30 : op === 'eq' ? 'true' : undefined }
}

const distinctCache = new Map<string, string[]>()
export function distinctValues(ref: string): string[] {
  if (distinctCache.has(ref)) return distinctCache.get(ref)!
  const [eid, fid] = ref.split('.')
  if (!catalog.byId.has(eid)) return []
  const e = catalog.entity(eid)
  let rows = dataStore.rows(eid)
  if (e.parent?.kind === 'subtype') rows = rows.filter(r => e.parent!.typeValues?.includes(String(r.type)))
  const hit = catalog.lookup(ref)
  const vals = new Set<string>(hit?.field.enumValues ?? [])
  for (const r of rows) { const v = r[fid]; if (v !== null && v !== undefined && v !== '') vals.add(String(v)); if (vals.size > 300) break }
  const out = [...vals].sort((a, b) => a.localeCompare(b))
  distinctCache.set(ref, out)
  return out
}

export const OP_LABEL: Record<FilterOp, string> = {
  eq: '=', neq: '≠', in: 'es uno de', nin: 'no es', gt: '>', gte: '≥', lt: '<', lte: '≤', between: 'entre',
  contains: 'contiene', is_null: 'vacío', not_null: 'no vacío', last_n_days: 'últimos N días',
}

export function opsFor(type: FieldType | 'calc', role: 'dimension' | 'measure'): FilterOp[] {
  if (type === 'date' || type === 'datetime') return ['last_n_days', 'between', 'gte', 'lte', 'is_null', 'not_null']
  if (type === 'enum') return ['in', 'nin', 'eq', 'neq', 'is_null', 'not_null']
  if (type === 'bool') return ['eq']
  if (role === 'measure' || type === 'number' || type === 'money' || type === 'calc') return ['gte', 'lte', 'gt', 'lt', 'between', 'eq', 'neq', 'is_null', 'not_null']
  return ['contains', 'eq', 'neq', 'in', 'is_null', 'not_null']
}

export function filterSummary(f: Filter, calcs: CalcField[], t?: Pick<ReportTemplate, 'params'>, values?: Record<string, string | number>): string {
  const { label } = refInfo(f.ref, calcs)
  // a value bound to a parameter reads {Desde}, or its resolved value when one is given
  const show = (x: unknown) => {
    if (!isParamRef(x)) return x
    const p = t?.params?.find(pp => pp.id === x.$param)
    return values && p ? formatParamValue(p, values[p.id]) : `{${p?.name ?? '?'}}`
  }
  f = { ...f, value: show(f.value), value2: show(f.value2) }
  const v = f.value
  switch (f.op) {
    case 'in': case 'nin': {
      const arr = (v as string[]) ?? []
      if (!arr.length) return `${label}: todos`
      return `${label} ${f.op === 'in' ? '∈' : '∉'} ${arr.length > 2 ? `${arr.slice(0, 2).join(', ')} +${arr.length - 2}` : arr.join(', ')}`
    }
    case 'between': return `${label} entre ${v ?? '…'} y ${f.value2 ?? '…'}`
    case 'last_n_days': return `${label}: últimos ${v} días`
    case 'is_null': case 'not_null': return `${label} ${OP_LABEL[f.op]}`
    case 'eq': if (v === 'true' || v === 'false') return `${label} = ${v === 'true' ? 'Sí' : 'No'}`
  }
  return `${label} ${OP_LABEL[f.op]} ${v ?? '…'}`
}

/** Entities touched by a template (for "related" fields and formula helpers). */
export function usedEntityIds(t: ReportTemplate): string[] {
  return [...new Set([...t.dimensions, ...t.measures, ...t.filters].map(c => c.ref.split('.')[0]).filter(e => catalog.byId.has(e)))]
}

export const GRAINS = [
  { value: 'day', label: 'Día' }, { value: 'week', label: 'Semana' }, { value: 'month', label: 'Mes' },
  { value: 'quarter', label: 'Trimestre' }, { value: 'year', label: 'Año' },
] as const

export const AGGS = [
  { value: 'SUM', label: 'Suma' }, { value: 'AVG', label: 'Promedio' }, { value: 'MIN', label: 'Mínimo' }, { value: 'MAX', label: 'Máximo' },
  { value: 'COUNT', label: 'Cantidad' }, { value: 'COUNTD', label: 'Cantidad distinta' }, { value: 'LAST', label: 'Último (por fecha)' },
  { value: 'ONE', label: 'Valor (si es único en la fila)' },
] as const
