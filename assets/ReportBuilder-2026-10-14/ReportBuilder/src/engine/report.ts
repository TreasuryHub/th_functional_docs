// Report Template = the definition authored in the Builder.
// Report Run      = one execution of a template (ad-hoc or scheduled) with resolved parameters + result snapshot.

/** ONE: the group's value when all its rows share it (a text column shown next to the values), else "n valores". */
export type Agg = 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'COUNT' | 'COUNTD' | 'LAST' | 'FIRST' | 'ONE'

export type TimeGrain = 'day' | 'week' | 'month' | 'quarter' | 'year'

/** A column placed in the report. `ref` is `<entity>.<field>` or `calc.<id>`. */
export interface ColumnRef {
  id: string
  ref: string
  label?: string
  /** Only for measures. */
  agg?: Agg
  /** Only for date dimensions. */
  grain?: TimeGrain
  /** Only for measures: which JOIN context the measure is computed in (none = the main join). */
  ctx?: string
  /** Only for measures: show the running total of this column down the rows instead of its own value. */
  running?: RunningTotal
}

/**
 * Running total, e.g. "saldo después de cada movimiento": rows are put in chronological order and the
 * column's value is accumulated per partition, starting from the balance before the period.
 */
export interface RunningTotal {
  /** dimension column id that restarts the total (e.g. the account) */
  partition?: string
  /** dimension column ids that give the order to accumulate in (e.g. date, then movement id) */
  order?: string[]
  /** starting point: last value of a semi-additive balance strictly before `before` (a date or a parameter), per partition */
  opening?: { ref: string; before: unknown }
  /** show the running value divided by this column of the same row (e.g. a rate in ARS per USD, to show the balance in USD) */
  divideBy?: string
}

export type FilterOp = 'eq' | 'neq' | 'in' | 'nin' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'contains' | 'is_null' | 'not_null' | 'last_n_days'

/** A filter value bound to a report parameter instead of a literal. */
export interface ParamRef { $param: string }
export const isParamRef = (v: unknown): v is ParamRef => typeof v === 'object' && v !== null && '$param' in v

export interface Filter {
  id: string
  ref: string
  op: FilterOp
  value?: unknown | ParamRef
  value2?: unknown | ParamRef
  /** Exposed in the Viewer so the person running the report can change it. */
  exposed?: boolean
}

/**
 * A JOIN context: the same silver table joined again with its own filters. Two measures of Balances in
 * different contexts are two independent aggregations (e.g. "saldo al t1" vs "saldo al t2") that are then
 * joined on the report's dimensions, exactly like two sibling tables.
 */
export interface JoinContext {
  id: string
  /** base entity id (e.g. account_balance) */
  entity: string
  name: string
  filters: Filter[]
}

/**
 * Report variable. Filters (global or per context) can bind to it, column labels can interpolate it
 * with {Name}, and the Viewer asks for it at run time. Date defaults may be relative tokens (@start_of_month).
 */
export interface ReportParam {
  id: string
  name: string
  type: 'date' | 'number' | 'text'
  value: string | number
}

export const RELATIVE_DATES: { token: string; label: string }[] = [
  { token: '@today', label: 'Hoy' },
  { token: '@yesterday', label: 'Ayer' },
  { token: '@last_30_days', label: 'Hace 30 días' },
  { token: '@start_of_month', label: 'Inicio de mes' },
  { token: '@end_of_month', label: 'Fin de mes' },
  { token: '@start_of_prev_month', label: 'Inicio mes anterior' },
  { token: '@end_of_prev_month', label: 'Fin mes anterior' },
  { token: '@start_of_year', label: 'Inicio de año' },
  { token: '@end_of_prev_year', label: 'Fin año anterior' },
]

export interface CalcField {
  id: string
  name: string
  expr: string
  format?: 'number' | 'currency' | 'percent' | 'text'
}

/**
 * How to resolve a report that mixes a parent entity with one or more of its children
 * (e.g. Account + Transactions, or Workflow + Conciliations + Movements).
 *
 *  - `parent`  : one row per parent. Child measures are aggregated up to the parent. Siblings are
 *                pre-aggregated independently, so Balances x Transactions never fan out.
 *  - `child`   : one row per child (detail). Parent attributes are repeated on every child row.
 *  - `nested`  : parent rows with subtotals, expandable to their children.
 *  - `flat`    : one row per combination of the chosen dimensions, whatever level they come from
 *                (e.g. Empresa × Categoría). Child measures aggregate, parent measures stay symmetric.
 */
export type GrainMode = 'parent' | 'child' | 'nested' | 'flat'

export interface GrainResolution {
  /** MixAnalysis.signature the decision was taken for; a different mix re-asks. `*` applies to every mix. */
  signature: string
  mode: GrainMode
}

export const ANY_MIX = '*'

/** The decision stored in the template applies to this combination of entities. */
export const grainApplies = (g: GrainResolution | undefined, signature: string): g is GrainResolution =>
  !!g && (g.signature === signature || g.signature === ANY_MIX)

export type OutputType = 'table' | 'pivot' | 'bar' | 'stacked' | 'line' | 'area' | 'pie' | 'kpi'

export interface OutputConfig {
  type: OutputType
  /** For charts: which dimension goes on the X axis / slices; the rest become series. */
  xRef?: string
  /** Pivot: dimension ids spread as columns */
  pivotRef?: string
  showTotals?: boolean
  currency?: string
}

export interface Schedule {
  enabled: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  time: string
  weekday?: number
  monthday?: number
  recipients: string
  format: 'pdf' | 'xlsx' | 'csv' | 'link'
}

export interface ReportTemplate {
  id: string
  name: string
  description?: string
  domain: string
  dimensions: ColumnRef[]
  measures: ColumnRef[]
  filters: Filter[]
  calcs: CalcField[]
  contexts?: JoinContext[]
  params?: ReportParam[]
  grain?: GrainResolution
  sort?: { ref: string; dir: 'asc' | 'desc' }
  limit?: number
  output: OutputConfig
  schedule?: Schedule
  /** Set when the template is authored in the simple builder (Studio); the rest of the template is compiled from it. */
  studio?: StudioSpec
  updatedAt: string
  owner: string
}

export interface ReportRun {
  id: string
  templateId: string
  templateName: string
  trigger: 'ad-hoc' | 'scheduled'
  status: 'succeeded' | 'failed' | 'running'
  startedAt: string
  durationMs: number
  rowCount: number
  params: Filter[]
  /** values of the report parameters used by this run */
  paramValues?: Record<string, string | number>
  /** frozen copy of the template at run time — later edits don't rewrite history */
  snapshot: ReportTemplate
  runBy: string
  error?: string
}

import type { StudioSpec } from '../studio/spec'

export const uid = (p = '') => p + Math.random().toString(36).slice(2, 9)
