// Simple report builder (Studio).
//
// The Studio speaks in business terms: a source (Transacciones, Saldos, Conciliaciones), what to group by
// (Grupo, Empresa, Cuenta, Moneda, País, Categoría…), what to show (montos, saldos, KPIs) and a period.
// `compileStudio` turns that into a regular ReportTemplate, so the engine, the Viewer, runs and
// schedules work unchanged. The template keeps the spec in `studio` so it can be reopened here.

import { indexCalcs } from '../engine/query'
import { ANY_MIX, type Agg, type CalcField, type ColumnRef, type Filter, type JoinContext, type OutputConfig, type ReportParam, type ReportTemplate, type TimeGrain } from '../engine/report'

export type SourceId = 'transactions' | 'statement' | 'balances' | 'recon'
export type PeriodPreset = 'this_month' | 'prev_month' | 'last_30' | 'ytd' | 'custom' | 'all'

/** A filter placed in the Studio. `key` is a group or value key; `ref` is resolved from it on compile. */
export interface StudioFilter extends Filter { key: string }

export interface StudioSpec {
  source: SourceId
  /** Transacciones only: financial types included. */
  txTypes?: string[]
  /** Group keys, in order. */
  groupBy: string[]
  /** Value keys, `calc:<id>` for the user's calculated fields, or `field:<group key>` for a field shown as a column. */
  values: string[]
  filters: StudioFilter[]
  period: { preset: PeriodPreset; from?: string; to?: string }
  /** The user's calculated fields. Column formulas reference values as [@v_<key>] or [@c_<calc id>]. */
  calcs: CalcField[]
  output: OutputConfig
  limit?: number
}

export interface GroupDef {
  key: string; label: string; ref: string; section: string; grain?: TimeGrain
  /** shorter column header when the block name explains more than the column needs */
  column?: string
  /** defines what a row is (one per movement / transaction / match): only makes sense in Agrupar por */
  rowPer?: boolean
}

export interface ValueDef {
  key: string
  label: string
  section: string
  hint?: string
  /** a catalog field aggregated with `agg`… */
  ref?: string
  agg?: Agg
  /** …or a formula (aggregate, or over other columns as [@v_<key>]) */
  expr?: string
  format?: CalcField['format']
  /** Saldos: balance as of the start / end of the period (a JOIN of Balances per date) */
  asOf?: 'from' | 'to'
  /** column label; may interpolate the period parameters */
  column?: string
  /** accumulated down the rows from the balance before the period (saldo después de cada movimiento) */
  running?: boolean
  /** groupings the value can't be computed without; the Studio adds them when the value is added */
  needsGroups?: string[]
  /** other values it needs (added in front of it) */
  needs?: string[]
  /** running value shown divided by this value of the same row (a rate, to convert the balance) */
  divideBy?: string
}

export interface SourceDef {
  id: SourceId
  label: string
  description: string
  domain: string
  dateRef: string
  /** entities whose fields the free-formula editor offers */
  entities: string[]
  groups: GroupDef[]
  values: ValueDef[]
  defaults: { groupBy: string[]; values: string[] }
}

export const TX_TYPES: { type: string; label: string }[] = [
  { type: 'PSP_PAYIN', label: 'PSP Payins' },
  { type: 'PSP_PAYOUT', label: 'PSP Payouts' },
  { type: 'INTERNAL_PAYIN', label: 'Internal Payins' },
  { type: 'INTERNAL_PAYOUT', label: 'Internal Payouts' },
  { type: 'BANK_MOVEMENT', label: 'Bank Movements' },
  { type: 'EXTERNAL_PAYIN', label: 'External Payins' },
  { type: 'PAYMENT_ORDER', label: 'Órdenes de pago' },
]

export const ORG_KEYS = ['group', 'company', 'account', 'currency', 'country']

const ORG = 'Organización'
const org = (currencyRef: string): GroupDef[] => [
  { key: 'group', label: 'Grupo', ref: 'account.company_group', section: ORG },
  { key: 'company', label: 'Empresa', ref: 'account.company_name', section: ORG },
  { key: 'account', label: 'Cuenta', ref: 'account.account_name', section: ORG },
  { key: 'currency', label: 'Moneda', ref: currencyRef, section: ORG },
  { key: 'country', label: 'País', ref: 'account.country_code', section: ORG },
  { key: 'bank', label: 'Banco', ref: 'account.bank_name', section: ORG },
]
const time = (ref: string): GroupDef[] => [
  { key: 'day', label: 'Día', ref, grain: 'day', section: 'Fecha' },
  { key: 'week', label: 'Semana', ref, grain: 'week', section: 'Fecha' },
  { key: 'month', label: 'Mes', ref, grain: 'month', section: 'Fecha' },
]
const TIME_KEYS = ['day', 'week', 'month']

const RECONCILED = '[recon_movement.is_reconciled]'

export const SOURCES: Record<SourceId, SourceDef> = {
  transactions: {
    id: 'transactions', label: 'Transacciones', domain: 'fe', dateRef: 'financial_event.created_date',
    description: 'PSP e Internal Payins / Payouts, órdenes de pago y Bank Movements, con su categoría y tag.',
    entities: ['financial_event', 'account'],
    groups: [
      ...org('financial_event.currency_code'),
      { key: 'tx_type', label: 'Tipo de transacción', ref: 'financial_event.type', section: 'Transacción' },
      { key: 'category', label: 'Categoría', ref: 'financial_event.category', section: 'Transacción' },
      { key: 'tag', label: 'Tag', ref: 'financial_event.tag', section: 'Transacción' },
      { key: 'partner', label: 'PSP / Partner', ref: 'financial_event.partner_name', section: 'Transacción' },
      { key: 'direction', label: 'Dirección (IN / OUT)', column: 'Dirección', ref: 'financial_event.direction', section: 'Transacción' },
      { key: 'status', label: 'Estado', ref: 'financial_event.status', section: 'Transacción' },
      { key: 'movement', label: 'Transacción (una fila por transacción)', column: 'Transacción', rowPer: true, ref: 'financial_event.external_id', section: 'Transacción' },
      ...time('financial_event.created_date'),
    ],
    values: [
      { key: 'count', label: '# Transacciones', section: 'Montos', ref: 'financial_event.n', agg: 'COUNTD' },
      { key: 'amount_usd', label: 'Monto USD', section: 'Montos', ref: 'financial_event.amount_base', agg: 'SUM' },
      { key: 'in_usd', label: 'Ingresos USD', section: 'Montos', expr: 'SUM(IF([financial_event.direction] = "IN", [financial_event.amount_base], 0))', format: 'currency' },
      { key: 'out_usd', label: 'Egresos USD', section: 'Montos', expr: 'SUM(IF([financial_event.direction] = "OUT", [financial_event.amount_base], 0))', format: 'currency' },
      { key: 'net_usd', label: 'Neto USD', section: 'Montos', ref: 'financial_event.amount_base_signed', agg: 'SUM', hint: 'Ingresos − egresos' },
      { key: 'net', label: 'Neto (moneda original)', section: 'Montos', ref: 'financial_event.amount_signed', agg: 'SUM', hint: 'Ingresos − egresos en la moneda de cada transacción. Agrupá o filtrá por Moneda o Cuenta.' },
      { key: 'avg_usd', label: 'Ticket promedio USD', section: 'Montos', ref: 'financial_event.amount_base', agg: 'AVG' },
      { key: 'amount', label: 'Monto (moneda original)', section: 'Montos', ref: 'financial_event.amount', agg: 'SUM', hint: 'Agrupá por Moneda para no sumar monedas distintas' },
    ],
    defaults: { groupBy: ['company', 'category'], values: ['count', 'in_usd', 'out_usd', 'net_usd'] },
  },
  statement: {
    id: 'statement', label: 'Extracto de cuenta', domain: 'accounts', dateRef: 'account_transaction.booking_date',
    description: 'Cada movimiento del extracto bancario de tus cuentas, con el saldo después de cada uno.',
    entities: ['account_transaction', 'account'],
    groups: [
      ...org('account.currency_code'),
      { key: 'movement', label: 'Movimiento (una fila por movimiento)', column: 'Movimiento', rowPer: true, ref: 'account_transaction.transaction_id', section: 'Movimiento' },
      { key: 'description', label: 'Descripción', ref: 'account_transaction.description', section: 'Movimiento' },
      { key: 'counterparty', label: 'Contraparte', ref: 'account_transaction.counterparty_name', section: 'Movimiento' },
      { key: 'category', label: 'Categoría', ref: 'account_transaction.category', section: 'Movimiento' },
      { key: 'tag', label: 'Tag', ref: 'account_transaction.tag', section: 'Movimiento' },
      { key: 'direction', label: 'Crédito / Débito', ref: 'account_transaction.direction', section: 'Movimiento' },
      { key: 'bank_code', label: 'Código bancario', ref: 'account_transaction.bank_transaction_code', section: 'Movimiento' },
      { key: 'status', label: 'Estado', ref: 'account_transaction.transaction_type', section: 'Movimiento' },
      ...time('account_transaction.booking_date'),
    ],
    values: [
      { key: 'net', label: 'Importe (moneda de la cuenta)', column: 'Importe', section: 'Montos', ref: 'account_transaction.amount', agg: 'SUM', hint: 'Créditos en positivo, débitos en negativo' },
      { key: 'credits', label: 'Créditos', section: 'Montos', expr: 'SUM(IF([account_transaction.amount] > 0, [account_transaction.amount], 0))', format: 'currency' },
      { key: 'debits', label: 'Débitos', section: 'Montos', expr: 'SUM(IF([account_transaction.amount] < 0, -[account_transaction.amount], 0))', format: 'currency' },
      { key: 'count', label: '# Movimientos', section: 'Montos', ref: 'account_transaction.n', agg: 'COUNTD' },
      { key: 'net_usd', label: 'Importe USD', section: 'Montos', ref: 'account_transaction.amount_base', agg: 'SUM' },
      {
        key: 'balance_after', label: 'Saldo después del movimiento', column: 'Saldo', section: 'Saldo', ref: 'account_transaction.amount', agg: 'SUM', running: true,
        needsGroups: ['account', 'day', 'movement'], hint: 'Saldo de la cuenta antes del período + cada movimiento, en orden cronológico',
      },
      {
        key: 'balance_after_usd', label: 'Saldo después del movimiento (USD)', column: 'Saldo USD', section: 'Saldo', ref: 'account_transaction.amount', agg: 'SUM', running: true,
        needsGroups: ['account', 'day', 'movement'], needs: ['fx'], divideBy: 'fx',
        hint: 'El saldo en la moneda de la cuenta, convertido al tipo de cambio del día de cada movimiento',
      },
      {
        key: 'fx', label: 'Tipo de cambio (moneda por USD)', column: 'Tipo de cambio', section: 'Saldo', format: 'number',
        expr: 'DIV(SUM([account_transaction.amount]), SUM([account_transaction.amount_base]))', hint: 'Unidades de la moneda de la cuenta por 1 USD, del día del movimiento',
      },
    ],
    defaults: { groupBy: ['account', 'day', 'movement'], values: ['field:description', 'field:category', 'net', 'balance_after'] },
  },
  balances: {
    id: 'balances', label: 'Saldos', domain: 'accounts', dateRef: 'account_balance.balance_date',
    description: 'Saldo de cada cuenta al inicio y al cierre del período, y su variación.',
    entities: ['account_balance', 'account'],
    groups: [
      ...org('account.currency_code'),
      { key: 'balance_type', label: 'Tipo de saldo', ref: 'account_balance.balance_type', section: 'Saldo' },
      ...time('account_balance.balance_date'),
    ],
    values: [
      { key: 'open', label: 'Saldo al inicio', column: 'Saldo al {Desde}', section: 'Moneda de la cuenta', ref: 'account_balance.balance', agg: 'LAST', asOf: 'from' },
      { key: 'close', label: 'Saldo al cierre', column: 'Saldo al {Hasta}', section: 'Moneda de la cuenta', ref: 'account_balance.balance', agg: 'LAST', asOf: 'to' },
      { key: 'var', label: 'Variación', section: 'Moneda de la cuenta', expr: '[@v_close] - [@v_open]', format: 'currency', hint: 'Cierre − inicio' },
      { key: 'var_pct', label: 'Variación %', section: 'Moneda de la cuenta', expr: 'DIV([@v_close] - [@v_open], ABS([@v_open]))', format: 'percent' },
      { key: 'open_usd', label: 'Saldo al inicio USD', column: 'Saldo USD al {Desde}', section: 'USD', ref: 'account_balance.balance_base', agg: 'LAST', asOf: 'from' },
      { key: 'close_usd', label: 'Saldo al cierre USD', column: 'Saldo USD al {Hasta}', section: 'USD', ref: 'account_balance.balance_base', agg: 'LAST', asOf: 'to' },
      { key: 'var_usd', label: 'Variación USD', section: 'USD', expr: '[@v_close_usd] - [@v_open_usd]', format: 'currency' },
    ],
    defaults: { groupBy: ['account', 'currency'], values: ['open', 'close', 'var'] },
  },
  recon: {
    id: 'recon', label: 'Conciliaciones', domain: 'recon', dateRef: 'recon_movement.created_date',
    description: 'Movimientos conciliados y pendientes, columnas de match (izquierdo / derecho / diferencia) y KPIs.',
    entities: ['recon_movement', 'conciliation', 'workflow', 'account', 'financial_event'],
    groups: [
      ...org('recon_movement.currency_code'),
      { key: 'workflow', label: 'Workflow', ref: 'workflow.workflow_name', section: 'Conciliación' },
      { key: 'match', label: 'Match (una fila por conciliación)', column: 'Match', rowPer: true, ref: 'conciliation.conciliation_ref', section: 'Conciliación' },
      { key: 'match_date', label: 'Fecha del match', ref: 'conciliation.conciliation_date', section: 'Conciliación' },
      { key: 'match_status', label: 'Estado del match', ref: 'conciliation.conciliation_status', section: 'Conciliación' },
      { key: 'match_type', label: 'Automático / Manual', ref: 'conciliation.conciliation_type', section: 'Conciliación' },
      { key: 'rule', label: 'Regla', ref: 'conciliation.rule_name', section: 'Conciliación' },
      { key: 'side', label: 'Lado (izquierdo / derecho)', column: 'Lado', ref: 'recon_movement.side', section: 'Conciliación' },
      { key: 'reconciled', label: 'Conciliado (sí / no)', column: 'Conciliado', ref: 'recon_movement.is_reconciled', section: 'Conciliación' },
      { key: 'mov_status', label: 'Estado del movimiento', ref: 'recon_movement.wm_status', section: 'Conciliación' },
      { key: 'tx_type', label: 'Tipo de transacción', ref: 'recon_movement.movement_type', section: 'Conciliación' },
      { key: 'category', label: 'Categoría', ref: 'financial_event.category', section: 'Conciliación' },
      { key: 'tag', label: 'Tag', ref: 'financial_event.tag', section: 'Conciliación' },
      ...time('recon_movement.created_date'),
    ],
    values: [
      { key: 'movements', label: '# Movimientos', section: 'KPIs', ref: 'recon_movement.n', agg: 'COUNTD' },
      { key: 'reconciled_n', label: '# Conciliados', section: 'KPIs', expr: `SUM(IF(${RECONCILED}, 1, 0))`, format: 'number' },
      { key: 'pending_n', label: '# Pendientes', section: 'KPIs', expr: `SUM(IF(${RECONCILED}, 0, 1))`, format: 'number' },
      { key: 'rate', label: '% conciliado', section: 'KPIs', expr: `DIV(SUM(IF(${RECONCILED}, 1, 0)), COUNT())`, format: 'percent', hint: 'Movimientos conciliados / movimientos' },
      { key: 'rate_amount', label: '% conciliado (monto)', section: 'KPIs', expr: `DIV(SUM(IF(${RECONCILED}, [recon_movement.amount_base], 0)), SUM([recon_movement.amount_base]))`, format: 'percent' },
      { key: 'reconciled_usd', label: 'Monto conciliado USD', section: 'KPIs', expr: `SUM(IF(${RECONCILED}, [recon_movement.amount_base], 0))`, format: 'currency' },
      { key: 'pending_usd', label: 'Monto pendiente USD', section: 'KPIs', expr: `SUM(IF(${RECONCILED}, 0, [recon_movement.amount_base]))`, format: 'currency' },
      { key: 'reconciled_amt', label: 'Monto conciliado (moneda original)', column: 'Monto conciliado', section: 'KPIs', expr: `SUM(IF(${RECONCILED}, [recon_movement.amount], 0))`, format: 'currency', hint: 'En la moneda de los movimientos. Agrupá por Moneda para no sumar monedas distintas.' },
      { key: 'pending_amt', label: 'Monto pendiente (moneda original)', column: 'Monto pendiente', section: 'KPIs', expr: `SUM(IF(${RECONCILED}, 0, [recon_movement.amount]))`, format: 'currency', hint: 'En la moneda de los movimientos. Agrupá por Moneda para no sumar monedas distintas.' },
      { key: 'days_open', label: 'Días abierto (prom.)', section: 'KPIs', ref: 'recon_movement.days_open', agg: 'AVG' },
      { key: 'auto_rate', label: '% matches automáticos', section: 'KPIs', expr: 'DIV(COUNTD(IF([conciliation.conciliation_type] = "Automatic", [conciliation.conciliation_id], NULL)), COUNTD([conciliation.conciliation_id]))', format: 'percent' },
      { key: 'matches', label: '# Matches', section: 'Columnas de match', ref: 'conciliation.n', agg: 'COUNTD' },
      { key: 'left_usd', label: 'Importe izquierdo USD', section: 'Columnas de match', ref: 'conciliation.left_amount_base', agg: 'SUM' },
      { key: 'right_usd', label: 'Importe derecho USD', section: 'Columnas de match', ref: 'conciliation.right_amount_base', agg: 'SUM' },
      { key: 'diff_usd', label: 'Diferencia USD', section: 'Columnas de match', ref: 'conciliation.difference_amount_base', agg: 'SUM' },
      { key: 'diff_pct', label: '% diferencia', section: 'Columnas de match', expr: 'DIV([@v_diff_usd], [@v_left_usd])', format: 'percent', hint: 'Diferencia / importe izquierdo' },
      { key: 'amount_usd', label: 'Monto movimientos USD', section: 'Columnas de match', ref: 'recon_movement.amount_base', agg: 'SUM' },
      { key: 'left', label: 'Importe izquierdo (moneda original)', column: 'Importe izquierdo', section: 'Columnas de match', ref: 'conciliation.left_amount', agg: 'SUM', hint: 'En la moneda de la conciliación (la de sus movimientos).' },
      { key: 'right', label: 'Importe derecho (moneda original)', column: 'Importe derecho', section: 'Columnas de match', ref: 'conciliation.right_amount', agg: 'SUM', hint: 'En la moneda de la conciliación (la de sus movimientos).' },
      { key: 'diff', label: 'Diferencia (moneda original)', column: 'Diferencia', section: 'Columnas de match', ref: 'conciliation.difference_amount', agg: 'SUM', hint: 'En la moneda de la conciliación (la de sus movimientos).' },
      { key: 'amount', label: 'Monto movimientos (moneda original)', column: 'Monto movimientos', section: 'Columnas de match', ref: 'recon_movement.amount', agg: 'SUM', hint: 'En la moneda de cada movimiento.' },
    ],
    defaults: { groupBy: ['company', 'workflow'], values: ['movements', 'rate', 'pending_usd', 'days_open'] },
  },
}

export const PERIODS: { preset: PeriodPreset; label: string; from?: string; to?: string }[] = [
  { preset: 'this_month', label: 'Este mes', from: '@start_of_month', to: '@today' },
  { preset: 'prev_month', label: 'Mes anterior', from: '@start_of_prev_month', to: '@end_of_prev_month' },
  { preset: 'last_30', label: 'Últimos 30 días', from: '@last_30_days', to: '@today' },
  { preset: 'ytd', label: 'En el año', from: '@start_of_year', to: '@today' },
  { preset: 'custom', label: 'Fechas…' },
  { preset: 'all', label: 'Todo' },
]

// ---------------------------------------------------------------- lookups

export const groupDef = (source: SourceId, key: string) => SOURCES[source].groups.find(g => g.key === key)
export const valueDef = (source: SourceId, key: string) => SOURCES[source].values.find(v => v.key === key)
export const calcKey = (id: string) => `calc:${id}`
/** A field (Categoría, Tag…) shown as a column in Mostrar, without grouping by it. */
export const fieldKey = (groupKey: string) => `field:${groupKey}`
export const isFieldKey = (key: string) => key.startsWith('field:')
export const columnId = (valueKey: string) => (valueKey.startsWith('calc:') ? `c_${valueKey.slice(5)}` : isFieldKey(valueKey) ? `f_${valueKey.slice(6)}` : `v_${valueKey}`)
export const isTimeKey = (key: string) => TIME_KEYS.includes(key)
export const hasTimeGroup = (spec: StudioSpec) => spec.groupBy.some(k => TIME_KEYS.includes(k))

/** Label of any value key, including the user's calculated fields. */
export function valueLabel(spec: StudioSpec, key: string): string {
  if (key.startsWith('calc:')) return spec.calcs.find(c => c.id === key.slice(5))?.name ?? '(fórmula borrada)'
  if (isFieldKey(key)) return groupDef(spec.source, key.slice(6))?.label ?? key.slice(6)
  return valueDef(spec.source, key)?.label ?? key
}

/** Why a value can't be used right now, or null. */
export function valueBlocked(spec: StudioSpec, key: string): string | null {
  const v = valueDef(spec.source, key)
  const missing = (v?.needsGroups ?? []).filter(g => !spec.groupBy.includes(g))
  if (missing.length) return `Necesita agrupar por ${missing.map(g => groupDef(spec.source, g)?.label).join(', ')}.`
  if (spec.source !== 'balances' || !hasTimeGroup(spec)) return null
  if (v?.asOf === 'from' || /@v_open/.test(v?.expr ?? '')) return 'Con agrupación por fecha cada fila ya muestra el saldo al cierre de ese período; el saldo al inicio y la variación no aplican.'
  return null
}

/** Values the given key needs to be computed ([@v_open] → open), recursively. */
function dependencies(spec: StudioSpec, key: string, seen = new Set<string>()): string[] {
  if (seen.has(key)) return []
  seen.add(key)
  const expr = key.startsWith('calc:') ? spec.calcs.find(c => c.id === key.slice(5))?.expr : valueDef(spec.source, key)?.expr
  const deps: string[] = []
  for (const dep of key.startsWith('calc:') ? [] : valueDef(spec.source, key)?.needs ?? []) deps.push(...dependencies(spec, dep, seen), dep)
  for (const [, kind, id] of (expr ?? '').matchAll(/\[@(v|c)_([A-Za-z0-9_]+)\]/g)) {
    const dep = kind === 'v' ? id : calcKey(id)
    deps.push(...dependencies(spec, dep, seen), dep)
  }
  return deps
}

/** Blocks that can only group (dates, "una fila por…") can't be shown as a column. */
export const canShowAsColumn = (source: SourceId, groupKey: string) => !isTimeKey(groupKey) && !groupDef(source, groupKey)?.rowPer

/** Repairs specs saved before a rule existed: a "una fila por…" block shown as a column goes back to Agrupar por. */
export function normalizeSpec(spec: StudioSpec): StudioSpec {
  const misplaced = spec.values.filter(k => isFieldKey(k) && !canShowAsColumn(spec.source, k.slice(6)))
  if (!misplaced.length) return spec
  return { ...spec, values: spec.values.filter(k => !misplaced.includes(k)), groupBy: [...spec.groupBy, ...misplaced.map(k => k.slice(6)).filter(k => !spec.groupBy.includes(k))] }
}

// ---------------------------------------------------------------- new specs

export function newSpec(source: SourceId = 'transactions', keep?: StudioSpec): StudioSpec {
  const src = SOURCES[source]
  // switching sources keeps what still makes sense: org / date groups, filters on them, the output type
  const groupBy = keep ? keep.groupBy.filter(k => groupDef(source, k)) : src.defaults.groupBy
  return {
    source,
    txTypes: source === 'transactions' ? keep?.txTypes ?? TX_TYPES.map(x => x.type) : undefined,
    groupBy: groupBy.length ? groupBy : src.defaults.groupBy,
    values: src.defaults.values,
    filters: (keep?.filters ?? []).flatMap(f => { const g = groupDef(source, f.key); return g ? [{ ...f, ref: g.ref }] : [] }),
    period: keep?.period.preset === 'all' && source === 'balances' ? { preset: 'this_month' } : keep?.period ?? { preset: source === 'balances' || source === 'statement' ? 'this_month' : 'ytd' },
    calcs: [],
    output: { type: keep?.output.type ?? 'table', showTotals: true },
  }
}

// ---------------------------------------------------------------- compile

export interface Compiled { template: ReportTemplate; warnings: string[] }

type Meta = Pick<ReportTemplate, 'id' | 'name' | 'owner' | 'updatedAt'> & Partial<Pick<ReportTemplate, 'description' | 'schedule'>>

export function compileStudio(input: StudioSpec, meta: Meta): Compiled {
  const spec = normalizeSpec(input)
  const src = SOURCES[spec.source]
  const warnings: string[] = []
  const timeGroup = hasTimeGroup(spec)

  // ---- period -> Desde / Hasta parameters (the Viewer asks for them on every run)
  const preset = spec.source === 'balances' && spec.period.preset === 'all' ? 'this_month' : spec.period.preset
  const p = PERIODS.find(x => x.preset === preset)!
  const from = preset === 'custom' ? spec.period.from : p.from
  const to = preset === 'custom' ? spec.period.to : p.to
  const params: ReportParam[] = preset === 'all' ? [] : [
    { id: 'p_from', name: 'Desde', type: 'date', value: from ?? '@start_of_month' },
    { id: 'p_to', name: 'Hasta', type: 'date', value: to ?? '@today' },
  ]
  const FROM = { $param: 'p_from' }, TO = { $param: 'p_to' }

  // ---- group by
  const dimensions: ColumnRef[] = []
  for (const key of spec.groupBy) {
    const g = groupDef(spec.source, key)
    if (!g) { warnings.push(`"${key}" no existe en ${src.label}: se quitó del agrupamiento.`); continue }
    dimensions.push({ id: `g_${key}`, ref: g.ref, label: g.column ?? g.label, grain: g.grain })
  }

  // ---- values: add what column formulas need, in front of the formula
  const keys: string[] = []
  for (const k of spec.values) for (const x of [...dependencies(spec, k), k]) if (!keys.includes(x)) keys.push(x)

  // every source formula is defined, so a user formula can reference it by name: [Ingresos USD] - [Egresos USD]
  const calcs: CalcField[] = src.values.filter(v => v.expr).map(v => ({ id: `s_${v.key}`, name: v.label, expr: v.expr!, format: v.format }))
  calcs.push(...spec.calcs)
  const calcIdx = indexCalcs(calcs)

  const contexts: JoinContext[] = []
  const contextFor = (asOf: 'from' | 'to') => {
    const id = asOf === 'from' ? 'x_from' : 'x_to'
    if (!contexts.some(c => c.id === id)) {
      contexts.push({
        id, entity: 'account_balance', name: asOf === 'from' ? 'Inicio' : 'Cierre',
        filters: [{ id: `cf_${asOf}`, ref: src.dateRef, op: 'lte', value: asOf === 'from' ? FROM : TO }],
      })
    }
    return id
  }

  const measures: ColumnRef[] = []
  for (const key of keys) {
    const id = columnId(key)
    if (key.startsWith('calc:')) {
      const c = spec.calcs.find(x => x.id === key.slice(5))
      if (!c) continue
      measures.push({ id, ref: `calc.${c.id}`, label: c.name, ...(calcIdx.get(c.id)?.agg ? {} : { agg: 'SUM' as const }) })
      continue
    }
    if (isFieldKey(key)) {
      // shown, not grouped: the row's value when all its transactions share it
      const g = groupDef(spec.source, key.slice(6))
      if (!g) { warnings.push(`"${key.slice(6)}" no existe en ${src.label}: se quitó.`); continue }
      measures.push({ id, ref: g.ref, agg: 'ONE', label: g.column ?? g.label })
      continue
    }
    const v = valueDef(spec.source, key)
    if (!v) { warnings.push(`"${key}" no existe en ${src.label}: se quitó.`); continue }
    const blocked = valueBlocked(spec, key)
    if (blocked) { warnings.push(`${v.label}: ${blocked}`); continue }
    if (v.expr) { measures.push({ id, ref: `calc.s_${v.key}`, label: v.column ?? v.label }); continue }
    // with a date grouping, "saldo al cierre" is just the last balance of each period
    const ctx = v.asOf && !timeGroup ? contextFor(v.asOf) : undefined
    // running balance: per account, in date + movement order, starting from the balance before Desde
    const running = v.running ? {
      partition: 'g_account', order: ['g_day', 'g_movement'],
      opening: params.length ? { ref: 'account_balance.balance', before: FROM } : undefined,
      ...(v.divideBy ? { divideBy: columnId(v.divideBy) } : {}),
    } : undefined
    // "Saldo al {Desde}" only makes sense as the as-of JOIN; other short headers always apply
    measures.push({ id, ref: v.ref!, agg: v.agg, label: ctx || !v.asOf ? v.column ?? v.label : v.label, ...(ctx ? { ctx } : {}), ...(running ? { running } : {}) })
  }

  // ---- filters
  const filters: Filter[] = []
  if (spec.source === 'transactions') {
    const types = spec.txTypes?.length ? spec.txTypes : TX_TYPES.map(x => x.type)
    filters.push({ id: 'f_types', ref: 'financial_event.type', op: 'in', value: types })
  }
  if (params.length && !contexts.length) filters.push({ id: 'f_period', ref: src.dateRef, op: 'between', value: FROM, value2: TO })
  for (const f of spec.filters) {
    const ref = groupDef(spec.source, f.key)?.ref ?? valueDef(spec.source, f.key)?.ref
    if (!ref) { warnings.push(`El filtro "${f.key}" no aplica a ${src.label}: se ignoró.`); continue }
    const { key: _key, ...rest } = f
    filters.push({ ...rest, ref })
  }

  // ---- output: chart axes must point at an existing grouping
  const dimIds = new Set(dimensions.map(d => d.id))
  const output: OutputConfig = { ...spec.output }
  if (output.xRef && !dimIds.has(output.xRef)) delete output.xRef
  if (output.pivotRef && output.pivotRef !== '__measures' && !dimIds.has(output.pivotRef)) delete output.pivotRef

  const template: ReportTemplate = {
    id: meta.id, name: meta.name, description: meta.description, owner: meta.owner, updatedAt: meta.updatedAt, schedule: meta.schedule,
    domain: src.domain, dimensions, measures, filters, calcs,
    contexts: contexts.length ? contexts : undefined,
    params: params.length ? params : undefined,
    // one row per combination of the chosen groupings, whatever table each one comes from
    grain: { signature: ANY_MIX, mode: 'flat' },
    output, limit: spec.limit,
    studio: spec,
  }
  return { template, warnings }
}

// ---------------------------------------------------------------- quick starts

export const QUICK_STARTS: { id: string; name: string; description: string; spec: StudioSpec }[] = [
  {
    id: 'flow', name: 'Flujo por empresa y categoría',
    description: 'Ingresos, egresos y neto de todas las transacciones, por empresa y categoría de cashflow.',
    spec: { ...newSpec('transactions'), groupBy: ['company', 'category'], values: ['count', 'in_usd', 'out_usd', 'net_usd'], period: { preset: 'ytd' } },
  },
  {
    id: 'statement', name: 'Movimientos de una cuenta',
    description: 'Cada movimiento de la cuenta en el período, con su importe y el saldo después de cada uno.',
    spec: {
      ...newSpec('statement'), groupBy: ['account', 'day', 'movement'], period: { preset: 'this_month' },
      values: ['field:description', 'field:category', 'field:tag', 'net', 'balance_after'],
      filters: [{ id: 'sf_account', key: 'account', ref: 'account.account_name', op: 'in', value: ['Banco Galicia ARS Cuenta'], exposed: true }],
    },
  },
  {
    id: 'balances', name: 'Saldo inicial vs final',
    description: 'Saldo de cada cuenta al inicio y al cierre del período, con la variación.',
    spec: { ...newSpec('balances'), groupBy: ['account', 'currency'], values: ['open', 'close', 'var'], period: { preset: 'this_month' } },
  },
  {
    id: 'recon_kpis', name: 'KPIs de conciliación por empresa',
    description: '% conciliado, monto pendiente y días abiertos por empresa y workflow.',
    spec: { ...newSpec('recon'), groupBy: ['company', 'workflow'], values: ['movements', 'rate', 'pending_usd', 'days_open', 'auto_rate'], period: { preset: 'ytd' } },
  },
  {
    id: 'matches', name: 'Detalle de matches',
    description: 'Una fila por conciliación: importe izquierdo, derecho y diferencia.',
    spec: {
      ...newSpec('recon'), groupBy: ['match', 'match_date', 'workflow', 'rule', 'match_type', 'match_status'],
      values: ['left_usd', 'right_usd', 'diff_usd', 'diff_pct'], period: { preset: 'last_30' },
      filters: [{ id: 'sf_match', key: 'match', ref: 'conciliation.conciliation_ref', op: 'not_null' }],
    },
  },
]
