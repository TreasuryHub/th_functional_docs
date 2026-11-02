import type { ReportRun, ReportTemplate } from '../engine/report'
import { compileStudio, QUICK_STARTS } from '../studio/spec'

const now = '2026-09-27T18:00:00Z'
const owner = 'nicolas@treasuryhub.ai'

export const SEED_TEMPLATES: ReportTemplate[] = [
  {
    id: 'tpl_close', name: 'Comparación de cierre de caja', domain: 'accounts', owner, updatedAt: now,
    description: 'Saldo al {Desde} vs saldo al {Hasta} por cuenta: Balances entra dos veces (dos JOINs con su filtro de fecha) y Transactions una tercera para explicar la variación.',
    params: [
      { id: 'p_from', name: 'Desde', type: 'date', value: '@start_of_month' },
      { id: 'p_to', name: 'Hasta', type: 'date', value: '@end_of_month' },
    ],
    contexts: [
      { id: 'x_open', entity: 'account_balance', name: 't1 · Apertura', filters: [{ id: 'cf1', ref: 'account_balance.balance_date', op: 'lte', value: { $param: 'p_from' } }] },
      { id: 'x_close', entity: 'account_balance', name: 't2 · Cierre', filters: [{ id: 'cf2', ref: 'account_balance.balance_date', op: 'lte', value: { $param: 'p_to' } }] },
      {
        id: 'x_flow', entity: 'account_transaction', name: 'Movimientos (t1, t2]', filters: [
          { id: 'cf3', ref: 'account_transaction.booking_date', op: 'gt', value: { $param: 'p_from' } },
          { id: 'cf4', ref: 'account_transaction.booking_date', op: 'lte', value: { $param: 'p_to' } },
        ],
      },
    ],
    dimensions: [
      { id: 'd1', ref: 'account.account_name' },
      { id: 'd2', ref: 'account.currency_code' },
    ],
    measures: [
      { id: 'm1', ref: 'account_balance.balance', agg: 'LAST', ctx: 'x_open', label: 'Saldo al {Desde}' },
      { id: 'm2', ref: 'account_balance.balance', agg: 'LAST', ctx: 'x_close', label: 'Saldo al {Hasta}' },
      { id: 'm3', ref: 'calc.var', label: 'Variación' },
      { id: 'm4', ref: 'account_transaction.amount', agg: 'SUM', ctx: 'x_flow', label: 'Movimientos del período' },
      { id: 'm5', ref: 'calc.gap', label: 'Diferencia no explicada' },
    ],
    filters: [{ id: 'f1', ref: 'account.company_name', op: 'in', value: [], exposed: true }],
    calcs: [
      { id: 'var', name: 'Variación', expr: '[@Saldo al {Hasta}] - [@Saldo al {Desde}]', format: 'currency' },
      { id: 'gap', name: 'Diferencia no explicada', expr: '[Variación] - [@Movimientos del período]', format: 'currency' },
    ],
    output: { type: 'table', showTotals: true },
    schedule: { enabled: true, frequency: 'monthly', monthday: 1, time: '07:30', recipients: 'tesoreria@acme.com', format: 'xlsx' },
  },
  {
    id: 'tpl_mom', name: 'Egresos: mes actual vs anterior', domain: 'accounts', owner, updatedAt: now,
    description: 'La misma tabla (Transactions) en dos JOINs con rangos de fecha distintos, agrupada por un campo propio (contraparte).',
    params: [
      { id: 'p_a1', name: 'Anterior desde', type: 'date', value: '@start_of_prev_month' },
      { id: 'p_a2', name: 'Anterior hasta', type: 'date', value: '@end_of_prev_month' },
      { id: 'p_b1', name: 'Actual desde', type: 'date', value: '@start_of_month' },
      { id: 'p_b2', name: 'Actual hasta', type: 'date', value: '@today' },
    ],
    contexts: [
      { id: 'x_prev', entity: 'account_transaction', name: 'Mes anterior', filters: [{ id: 'cf1', ref: 'account_transaction.booking_date', op: 'between', value: { $param: 'p_a1' }, value2: { $param: 'p_a2' } }] },
      { id: 'x_cur', entity: 'account_transaction', name: 'Mes actual', filters: [{ id: 'cf2', ref: 'account_transaction.booking_date', op: 'between', value: { $param: 'p_b1' }, value2: { $param: 'p_b2' } }] },
    ],
    dimensions: [{ id: 'd1', ref: 'account_transaction.counterparty_name' }],
    measures: [
      { id: 'm1', ref: 'account_transaction.amount_base', agg: 'SUM', ctx: 'x_prev', label: '{Anterior desde} → {Anterior hasta}' },
      { id: 'm2', ref: 'account_transaction.amount_base', agg: 'SUM', ctx: 'x_cur', label: '{Actual desde} → {Actual hasta}' },
      { id: 'm3', ref: 'calc.dpct', label: 'Δ %' },
    ],
    filters: [{ id: 'f1', ref: 'account_transaction.direction', op: 'eq', value: 'Débito', exposed: true }],
    calcs: [{ id: 'dpct', name: 'Δ %', expr: 'DIV([@m2] - [@m1], ABS([@m1]))', format: 'percent' }],
    sort: { ref: 'm2', dir: 'asc' },
    output: { type: 'table', showTotals: true },
  },
  {
    id: 'tpl_cash', name: 'Posición de caja por banco', domain: 'accounts', owner, updatedAt: now,
    description: 'Saldo USD al cierre, por banco y grupo de empresas. El saldo es semi-aditivo: último valor por cuenta, sumado entre cuentas.',
    dimensions: [
      { id: 'd1', ref: 'account.bank_name' },
      { id: 'd2', ref: 'account.company_group' },
    ],
    measures: [{ id: 'm1', ref: 'account_balance.balance_base', agg: 'LAST' }],
    filters: [{ id: 'f1', ref: 'account_balance.balance_date', op: 'between', value: '2026-05-01', value2: '2026-09-28', exposed: true }],
    calcs: [],
    grain: { signature: 'account+account_balance', mode: 'parent' },
    sort: { ref: 'm1', dir: 'desc' },
    output: { type: 'stacked', xRef: 'd1', pivotRef: 'd2', showTotals: true },
    schedule: { enabled: true, frequency: 'daily', time: '08:00', recipients: 'tesoreria@acme.com', format: 'pdf' },
  },
  {
    id: 'tpl_flow', name: 'Flujo mensual cobros vs pagos', domain: 'fe', owner, updatedAt: now,
    description: 'Eventos BOOKED por mes y dirección, con neto calculado por fórmula agregada.',
    dimensions: [{ id: 'd1', ref: 'financial_event.created_date', grain: 'month' }],
    measures: [
      { id: 'm1', ref: 'calc.cin', label: 'Cobros USD' },
      { id: 'm2', ref: 'calc.cout', label: 'Pagos USD' },
      { id: 'm3', ref: 'calc.net', label: 'Neto USD' },
    ],
    filters: [
      { id: 'f1', ref: 'financial_event.status', op: 'in', value: ['BOOKED'], exposed: true },
      { id: 'f2', ref: 'financial_event.type', op: 'nin', value: ['ACCOUNT_BALANCE', 'BANK_MOVEMENT'] },
    ],
    calcs: [
      { id: 'cin', name: 'Cobros', expr: 'SUM(IF([financial_event.direction] = "IN", [financial_event.amount_base], 0))', format: 'currency' },
      { id: 'cout', name: 'Pagos', expr: 'SUM(IF([financial_event.direction] = "OUT", [financial_event.amount_base], 0))', format: 'currency' },
      { id: 'net', name: 'Neto', expr: '[Cobros] - [Pagos]', format: 'currency' },
    ],
    output: { type: 'bar', xRef: 'd1', showTotals: true },
    schedule: { enabled: true, frequency: 'monthly', monthday: 1, time: '07:00', recipients: 'cfo@acme.com, tesoreria@acme.com', format: 'xlsx' },
  },
  {
    id: 'tpl_psp', name: 'Payins por PSP y canal de venta', domain: 'fe', owner, updatedAt: now,
    description: 'Usa campos del subtipo Internal Payin: el filtro por type se agrega solo.',
    dimensions: [
      { id: 'd1', ref: 'financial_event.partner_name' },
      { id: 'd2', ref: 'payin.merchant_name' },
    ],
    measures: [
      { id: 'm1', ref: 'financial_event.n' },
      { id: 'm2', ref: 'financial_event.amount_base', agg: 'SUM' },
      { id: 'm3', ref: 'calc.ticket', label: 'Ticket promedio USD' },
    ],
    filters: [
      { id: 'f1', ref: 'financial_event.created_date', op: 'last_n_days', value: 30, exposed: true },
      { id: 'f2', ref: 'financial_event.status', op: 'in', value: ['BOOKED'] },
    ],
    calcs: [{ id: 'ticket', name: 'Ticket promedio', expr: 'DIV(SUM([financial_event.amount_base]), COUNTD([financial_event.event_uuid]))', format: 'currency' }],
    sort: { ref: 'm2', dir: 'desc' },
    output: { type: 'pivot', pivotRef: 'd2', showTotals: true },
  },
  {
    id: 'tpl_bal_tx', name: 'Saldo vs movimientos por cuenta', domain: 'accounts', owner, updatedAt: now,
    description: 'Balances y Transactions son hermanos bajo Account: se agregan por separado (drill-across), sin multiplicar saldos por transacciones.',
    dimensions: [
      { id: 'd1', ref: 'account.account_name' },
      { id: 'd2', ref: 'account.currency_code' },
    ],
    measures: [
      { id: 'm1', ref: 'account_balance.balance', agg: 'LAST', label: 'Saldo actual' },
      { id: 'm2', ref: 'account_transaction.n', label: '# transacciones' },
      { id: 'm3', ref: 'account_transaction.amount', agg: 'SUM', label: 'Neto movimientos' },
    ],
    filters: [{ id: 'f1', ref: 'account.company_name', op: 'in', value: [], exposed: true }],
    calcs: [],
    output: { type: 'table', showTotals: false },
  },
  {
    id: 'tpl_recon', name: 'Conciliaciones por workflow', domain: 'recon', owner, updatedAt: now,
    description: 'Padre (Workflow) + hijo (Conciliation) en modo jerárquico: subtotales por workflow, desplegables por estado.',
    dimensions: [
      { id: 'd1', ref: 'workflow.workflow_name' },
      { id: 'd2', ref: 'conciliation.conciliation_status' },
    ],
    measures: [
      { id: 'm1', ref: 'conciliation.n' },
      { id: 'm2', ref: 'conciliation.total_amount_base', agg: 'SUM' },
      { id: 'm3', ref: 'conciliation.difference_amount_base', agg: 'SUM' },
      { id: 'm4', ref: 'calc.diffpct', label: '% diferencia' },
    ],
    filters: [{ id: 'f1', ref: 'conciliation.conciliation_date', op: 'last_n_days', value: 90, exposed: true }],
    calcs: [{ id: 'diffpct', name: '% diferencia', expr: 'DIV(SUM([conciliation.difference_amount_base]), SUM([conciliation.total_amount_base]))', format: 'percent' }],
    grain: { signature: 'conciliation+workflow', mode: 'nested' },
    output: { type: 'table', showTotals: true },
    schedule: { enabled: true, frequency: 'weekly', weekday: 1, time: '09:00', recipients: 'conciliaciones@acme.com', format: 'xlsx' },
  },
  {
    id: 'tpl_tags', name: 'Egresos por grupo de tags', domain: 'tagging', owner, updatedAt: now,
    description: 'Tag Group → Tag (padre/hijo) contra Transactions (M:N vía asignaciones).',
    dimensions: [
      { id: 'd1', ref: 'tag_group.group_name' },
      { id: 'd2', ref: 'tag.tag_name' },
    ],
    measures: [
      { id: 'm1', ref: 'account_transaction.amount_base', agg: 'SUM', label: 'Monto USD' },
      { id: 'm2', ref: 'account_transaction.n', label: '# transacciones' },
    ],
    filters: [{ id: 'f1', ref: 'account_transaction.direction', op: 'eq', value: 'Débito', exposed: true }],
    calcs: [],
    grain: { signature: 'account_transaction+tag+tag_group', mode: 'nested' },
    sort: { ref: 'm1', dir: 'asc' },
    output: { type: 'table', showTotals: true },
  },
  {
    id: 'tpl_aging', name: 'Movimientos sin conciliar', domain: 'recon', owner, updatedAt: now,
    description: 'Detalle de movimientos abiertos con días de antigüedad calculados por fórmula; filtro por workflow expuesto.',
    dimensions: [
      { id: 'd1', ref: 'workflow.workflow_name' },
      { id: 'd2', ref: 'recon_movement.external_id' },
      { id: 'd3', ref: 'recon_movement.movement_type' },
      { id: 'd4', ref: 'recon_movement.wm_status' },
      { id: 'd5', ref: 'recon_movement.created_date' },
      { id: 'd6', ref: 'calc.bucket', label: 'Antigüedad' },
    ],
    measures: [
      { id: 'm1', ref: 'recon_movement.amount_base', agg: 'SUM' },
      { id: 'm2', ref: 'recon_movement.days_open', agg: 'MAX' },
    ],
    filters: [
      { id: 'f1', ref: 'recon_movement.is_reconciled', op: 'eq', value: 'false' },
      { id: 'f2', ref: 'workflow.workflow_name', op: 'in', value: [], exposed: true },
    ],
    calcs: [{ id: 'bucket', name: 'Antigüedad', expr: 'IF([recon_movement.days_open] > 7, "> 7 días", IF([recon_movement.days_open] > 3, "4–7 días", "0–3 días"))', format: 'text' }],
    grain: { signature: 'recon_movement+workflow', mode: 'child' },
    sort: { ref: 'm2', dir: 'desc' },
    limit: 200,
    output: { type: 'table', showTotals: true },
  },
  {
    id: 'tpl_kpi', name: 'KPIs de conciliación', domain: 'recon', owner, updatedAt: now,
    description: 'Tasa de conciliación y tiempo medio, como tarjetas KPI.',
    dimensions: [],
    measures: [
      { id: 'm1', ref: 'recon_movement.n', label: 'Movimientos' },
      { id: 'm2', ref: 'calc.rate', label: 'Tasa de conciliación' },
      { id: 'm3', ref: 'recon_movement.days_open', agg: 'AVG', label: 'Días abiertos (prom.)' },
      { id: 'm4', ref: 'calc.open_usd', label: 'Abierto USD' },
    ],
    filters: [{ id: 'f1', ref: 'recon_movement.created_date', op: 'last_n_days', value: 30, exposed: true }],
    calcs: [
      { id: 'rate', name: 'Tasa de conciliación', expr: 'DIV(SUM(IF([recon_movement.is_reconciled], 1, 0)), COUNT([recon_movement.wm_id]))', format: 'percent' },
      { id: 'open_usd', name: 'Abierto USD', expr: 'SUM(IF([recon_movement.is_reconciled], 0, [recon_movement.amount_base]))', format: 'currency' },
    ],
    output: { type: 'kpi' },
  },
  {
    id: 'tpl_trend', name: 'Evolución de saldo por moneda', domain: 'accounts', owner, updatedAt: now,
    description: 'Saldo USD semanal por moneda de cuenta (último saldo de cada semana).',
    dimensions: [
      { id: 'd1', ref: 'account_balance.balance_date', grain: 'week' },
      { id: 'd2', ref: 'account.currency_code' },
    ],
    measures: [{ id: 'm1', ref: 'account_balance.balance_base', agg: 'LAST' }],
    filters: [],
    calcs: [],
    grain: { signature: 'account+account_balance', mode: 'nested' },
    output: { type: 'area', xRef: 'd1', pivotRef: 'd2' },
  },
]

/** Reports authored in the simple builder (Studio): one per quick start. */
export const STUDIO_SEED_PREFIX = 'tpl_s_'
export const STUDIO_SEEDS: ReportTemplate[] = QUICK_STARTS.map(q =>
  compileStudio(q.spec, { id: `${STUDIO_SEED_PREFIX}${q.id}`, name: q.name, description: q.description, owner, updatedAt: now }).template)
SEED_TEMPLATES.unshift(...STUDIO_SEEDS)

/** A few historical runs so the Viewer has history (ad-hoc and scheduled). */
export function seedRuns(templates: ReportTemplate[]): ReportRun[] {
  const runs: ReportRun[] = []
  const byId = Object.fromEntries(templates.map(t => [t.id, t]))
  const mk = (tid: string, when: string, trigger: 'ad-hoc' | 'scheduled', status: ReportRun['status'] = 'succeeded', rowCount = 0, error?: string) => {
    const t = byId[tid]
    if (!t) return
    runs.push({
      id: `run_${runs.length + 101}`, templateId: tid, templateName: t.name, trigger, status, startedAt: when,
      durationMs: 180 + ((runs.length * 137) % 900), rowCount, params: t.filters, snapshot: t,
      runBy: trigger === 'scheduled' ? 'scheduler' : owner, error,
    })
  }
  for (let i = 1; i <= 6; i++) mk('tpl_cash', `2026-09-${String(28 - i).padStart(2, '0')}T08:00:03Z`, 'scheduled', 'succeeded', 9)
  mk('tpl_cash', '2026-09-26T15:42:10Z', 'ad-hoc', 'succeeded', 9)
  mk('tpl_flow', '2026-09-01T07:00:02Z', 'scheduled', 'succeeded', 5)
  mk('tpl_flow', '2026-08-01T07:00:02Z', 'scheduled', 'failed', 0, 'Timeout leyendo silver.fct_financial_event (partición dt=2026-07-31 en compactación)')
  mk('tpl_recon', '2026-09-22T09:00:05Z', 'scheduled', 'succeeded', 4)
  mk('tpl_recon', '2026-09-15T09:00:04Z', 'scheduled', 'succeeded', 4)
  mk('tpl_psp', '2026-09-25T11:03:44Z', 'ad-hoc', 'succeeded', 18)
  return runs.sort((a, b) => b.startedAt.localeCompare(a.startedAt))
}
