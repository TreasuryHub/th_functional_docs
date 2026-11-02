import { Catalog, DataStore } from '../src/engine/catalog'
import { runReport, analyzeMix } from '../src/engine/query'
import { ENTITIES, DOMAINS } from '../src/model/silver'
import { TABLES, TABLE_STATS, TODAY } from '../src/model/mockData'
import { SEED_TEMPLATES } from '../src/model/seeds'

const catalog = new Catalog(ENTITIES, DOMAINS)
const store = new DataStore(catalog, TABLES)
console.log(TABLE_STATS)
for (const t of SEED_TEMPLATES) {
  const mix = analyzeMix(t, catalog)
  const r = runReport(t, catalog, store, { today: TODAY })
  console.log('\n==', t.name, '| mode', r.mode, '| sig', mix.signature, '| needsDecision', mix.needsDecision, '| rows', r.rows.length, '|', r.ms, 'ms')
  console.log('  grain:', r.grainLabel)
  r.warnings.forEach(w => console.log('  WARN', w)); r.notices.forEach(w => console.log('  note', w))
  for (const row of r.rows.slice(0, 4)) {
    console.log('  ', JSON.stringify(row.cells), row.children ? `(+${row.children.length} children, first ${JSON.stringify(row.children[0]?.cells)})` : '')
  }
  console.log('  totals', JSON.stringify(r.totals))
}
console.log('\nSQL sample:\n' + runReport(SEED_TEMPLATES[3], catalog, store, { today: TODAY }).sql)

// ---------------------------------------------------------------- invariants
const assert = (ok: boolean, msg: string) => { console.log(ok ? '  ✓' : '  ✗', msg); if (!ok) process.exitCode = 1 }
const T = Object.fromEntries(SEED_TEMPLATES.map(t => [t.id, t]))
const run = (id: string, patch = {}) => runReport({ ...T[id], ...patch }, catalog, store, { today: TODAY })
console.log('\nInvariants')

// semi-additive: cash position total = Σ latest balance_base per account in range
{
  const latest = new Map<unknown, { d: string; v: number }>()
  for (const b of TABLES.account_balance) {
    const d = String(b.balance_date), cur = latest.get(b.account_uuid)
    if (d <= '2026-09-28' && (!cur || d >= cur.d)) latest.set(b.account_uuid, { d, v: Number(b.balance_base) })
  }
  const expected = [...latest.values()].reduce((a, x) => a + x.v, 0)
  assert(Math.abs(Number(run('tpl_cash').totals.m1) - expected) < 0.01, 'saldo semi-aditivo = último saldo por cuenta, sumado entre cuentas')
}
// drill-across: siblings don't fan out
{
  const r = run('tpl_bal_tx')
  assert(r.totals.m2 === TABLES.account_transaction.length, '# transacciones en drill-across = filas reales (sin multiplicar por saldos)')
}
// M:N bridge: total counts each transaction once
{
  const r = run('tpl_tags')
  const tagged = new Set(TABLES.tag_assignment.map(a => a.transaction_id))
  const debits = TABLES.account_transaction.filter(t => t.direction === 'Débito' && tagged.has(t.transaction_id)).length
  const sumGroups = r.rows.reduce((a, x) => a + Number(x.cells.m2), 0)
  assert(r.totals.m2 === debits, 'total M:N deduplicado = transacciones distintas')
  assert(sumGroups > debits, 'la suma de grupos supera el total (una transacción cuenta en cada grupo)')
}
// parent measure at child grain: counted once per parent
{
  const r = run('tpl_aging', { measures: [{ id: 'mx', ref: 'workflow.rule_count', agg: 'SUM' }], limit: undefined })
  const expected = [...new Set(r.rows.map(x => x.cells.d1))].reduce((a: number, name) => a + Number(TABLES.workflow.find(w => w.workflow_name === name)!.rule_count), 0)
  assert(r.totals.mx === expected, 'medida del padre en grano hijo: total simétrico (una vez por workflow)')
}
// aggregate formula referencing aggregate formulas
{
  const r = run('tpl_flow')
  assert(r.rows.every(x => Math.abs(Number(x.cells.m3) - (Number(x.cells.m1) - Number(x.cells.m2))) < 0.01), '[Cobros] - [Pagos] = Neto por fila')
}
// JOIN contexts: saldo t1 / t2 match a direct computation
{
  const r = run('tpl_close')
  const acc = TABLES.account[0]
  const bal = (d: string) => TABLES.account_balance.filter(b => b.account_uuid === acc.account_uuid && String(b.balance_date) <= d).sort((a, b) => String(a.balance_date).localeCompare(String(b.balance_date))).pop()?.balance
  const row = r.rows.find(x => x.cells.d1 === acc.account_name)!
  assert(row.cells.m1 === bal('2026-09-01') && row.cells.m2 === bal('2026-09-30'), 'mismo Balances en dos JOINs: saldo al t1 y al t2 correctos')
  const flow = TABLES.account_transaction.filter(t => t.account_uuid === acc.account_uuid && String(t.booking_date) > '2026-09-01' && String(t.booking_date) <= '2026-09-30').reduce((a, t) => a + Number(t.amount), 0)
  assert(Math.abs(Number(row.cells.m4) - flow) < 0.01, 'tercer JOIN (Transactions) con rango (t1, t2]')
  assert(Math.abs(Number(row.cells.m3) - (Number(row.cells.m2) - Number(row.cells.m1))) < 0.01, 'fórmula entre columnas: Variación = t2 - t1')
  assert(r.columns.find(c => c.key === 'm1')!.label === 'Saldo al 01/09/2026', 'etiqueta interpolada con el parámetro')
  const r2 = runReport(T.tpl_close, catalog, store, { today: TODAY, paramValues: { p_from: '2026-08-31' } })
  assert(r2.rows.find(x => x.cells.d1 === acc.account_name)!.cells.m1 === bal('2026-08-31'), 'cambiar el parámetro en ejecución cambia el JOIN t1')
}

// ---------------------------------------------------------------- simple builder (Studio)
console.log('\nStudio')
{
  const { compileStudio, newSpec, QUICK_STARTS } = await import('../src/studio/spec')
  const { resolveRelative } = await import('../src/engine/params')
  const meta = { id: 'tpl_test', name: 'test', owner: 'smoke', updatedAt: '2026-09-28T00:00:00Z' }
  const qs = Object.fromEntries(QUICK_STARTS.map(q => [q.id, q.spec]))
  const exec = (spec: Parameters<typeof compileStudio>[0]) => {
    const c = compileStudio(spec, meta)
    return { ...c, r: runReport(c.template, catalog, store, { today: TODAY }) }
  }
  const FE = TABLES.financial_event
  const fromYtd = String(resolveRelative('@start_of_year', TODAY))

  // category + tag in the sample data
  const nonBalance = FE.filter(e => e.type !== 'ACCOUNT_BALANCE')
  const unclassified = nonBalance.filter(e => !e.category).length / nonBalance.length
  assert(FE.every(e => 'category' in e && 'tag' in e) && TABLES.account_transaction.every(t => 'category' in t), 'transacciones con Categoría y Tag')
  assert(unclassified > 0.01 && unclassified < 0.08, `~4% de transacciones sin categoría (${(unclassified * 100).toFixed(1)}%)`)

  // Empresa × Categoría: the child-level grouping is kept (flat grain), totals match the raw rows
  {
    const { r, warnings } = exec(qs.flow)
    const expected = FE.filter(e => e.type !== 'ACCOUNT_BALANCE' && String(e.created_date) >= fromYtd && String(e.created_date) <= TODAY).length
    assert(!warnings.length && !r.warnings.length && r.columns.some(c => c.key === 'g_category'), 'Empresa × Categoría: no se descarta la categoría')
    assert(r.totals.v_count === expected, '# transacciones = filas reales del período')
    assert(r.rows.every(x => Math.abs(Number(x.cells.v_in_usd) - Number(x.cells.v_out_usd) - Number(x.cells.v_net_usd)) < 0.05), 'ingresos − egresos = neto en cada fila')
  }
  // PSP payins only, by tag
  {
    const { r } = exec({ ...newSpec('transactions'), txTypes: ['PSP_PAYIN'], groupBy: ['tag'], values: ['count'], period: { preset: 'all' } })
    assert(r.totals.v_count === FE.filter(e => e.type === 'PSP_PAYIN').length && r.rows.every(x => String(x.cells.g_tag ?? '').startsWith('Cobranza') || x.cells.g_tag === null), 'filtro por tipo (PSP Payins) y agrupación por Tag')
  }
  // Saldos: inicio / cierre / variación by account
  {
    const { r } = exec(qs.balances)
    const acc = TABLES.account[0]
    const bal = (d: string) => TABLES.account_balance.filter(b => b.account_uuid === acc.account_uuid && String(b.balance_date) <= d).sort((a, b) => String(a.balance_date).localeCompare(String(b.balance_date))).pop()?.balance
    const row = r.rows.find(x => x.cells.g_account === acc.account_name)!
    const from = String(resolveRelative('@start_of_month', TODAY))
    assert(row.cells.v_open === bal(from) && row.cells.v_close === bal(TODAY), 'saldo al inicio y al cierre por cuenta')
    assert(Math.abs(Number(row.cells.v_var) - (Number(row.cells.v_close) - Number(row.cells.v_open))) < 0.01, 'variación = cierre − inicio')
    const byMonth = exec({ ...qs.balances, groupBy: ['account', 'month'] })
    assert(!byMonth.r.columns.some(c => c.key === 'v_open') && byMonth.warnings.length > 0, 'con agrupación por fecha, el saldo al inicio se quita con aviso')
  }
  // Conciliaciones: KPIs by empresa (every movement reaches its account), matching columns
  {
    const { r } = exec({ ...qs.recon_kpis, period: { preset: 'all' } })
    const mov = TABLES.recon_movement
    assert(r.rows.every(x => x.cells.g_company), 'cada movimiento conciliable llega a su empresa (también los pendientes)')
    assert(Math.abs(Number(r.totals.v_rate) - mov.filter(m => m.is_reconciled).length / mov.length) < 1e-9, '% conciliado total = conciliados / movimientos')
    const m = exec({ ...qs.matches, period: { preset: 'all' } }).r
    const byRef = new Map(TABLES.conciliation.map(c => [c.conciliation_ref, c]))
    assert(m.rows.length === TABLES.conciliation.length, 'detalle de matches: una fila por conciliación')
    assert(m.rows.every(x => { const c = byRef.get(x.cells.g_match)!; return x.cells.v_left_usd === c.left_amount_base && x.cells.v_diff_usd === c.difference_amount_base }), 'columnas de match = importes de la conciliación (sin duplicar por movimiento)')
  }
  // calculated fields: between columns, auto-adding what they need
  {
    const spec = { ...qs.flow, values: ['net_usd', 'calc:k1'], calcs: [{ id: 'k1', name: 'Egresos / Ingresos', expr: 'DIV([@v_out_usd], [@v_in_usd])', format: 'percent' as const }] }
    const { r } = exec(spec)
    assert(r.columns.map(c => c.key).join() === 'g_company,g_category,v_net_usd,v_out_usd,v_in_usd,c_k1', 'campo calculado entre columnas agrega las columnas que usa')
    const row = r.rows.find(x => Number(x.cells.v_in_usd) > 0)!
    assert(Math.abs(Number(row.cells.c_k1) - Number(row.cells.v_out_usd) / Number(row.cells.v_in_usd)) < 1e-9, 'campo calculado evaluado por fila')
  }
}

// ---------------------------------------------------------------- account statement with running balance
console.log('\nExtracto de cuenta')
{
  const { compileStudio, newSpec, QUICK_STARTS } = await import('../src/studio/spec')
  const { resolveRelative } = await import('../src/engine/params')
  const meta = { id: 'tpl_test', name: 'test', owner: 'smoke', updatedAt: '2026-09-28T00:00:00Z' }
  const spec = QUICK_STARTS.find(q => q.id === 'statement')!.spec
  const c = compileStudio(spec, meta)
  const r = runReport(c.template, catalog, store, { today: TODAY })
  const acc = TABLES.account.find(a => a.account_name === 'Banco Galicia ARS Cuenta')!
  const from = String(resolveRelative('@start_of_month', TODAY))
  const txs = TABLES.account_transaction.filter(t => t.account_uuid === acc.account_uuid && String(t.booking_date) >= from && String(t.booking_date) <= TODAY)
  const opening = Number(TABLES.account_balance.filter(b => b.account_uuid === acc.account_uuid && String(b.balance_date) < from).sort((a, b) => String(a.balance_date).localeCompare(String(b.balance_date))).pop()!.balance)
  assert(r.rows.length === txs.length && r.rows.every(x => x.cells.g_account === acc.account_name), `una fila por movimiento de la cuenta filtrada (${r.rows.length})`)
  assert(r.rows.every((x, i) => i === 0 || String(x.cells.g_day) >= String(r.rows[i - 1].cells.g_day)), 'filas en orden cronológico')
  assert(Math.abs(Number(r.rows[0].cells.v_balance_after) - (opening + Number(r.rows[0].cells.v_net))) < 0.01, 'primer saldo = saldo anterior al período + primer movimiento')
  assert(r.rows.every((x, i) => i === 0 || Math.abs(Number(x.cells.v_balance_after) - Number(r.rows[i - 1].cells.v_balance_after) - Number(x.cells.v_net)) < 0.01), 'cada saldo = saldo anterior + movimiento')
  const closing = opening + txs.reduce((a, t) => a + Number(t.amount), 0)
  assert(Math.abs(Number(r.totals.v_balance_after) - closing) < 0.01 && Math.abs(Number(r.totals.v_net) - (closing - opening)) < 0.01, 'total: saldo final y neto del período')
  assert(/OVER \(PARTITION BY/.test(r.sql), 'el SQL muestra el saldo corrido como window function')

  // two accounts: the running balance restarts per account
  const two = runReport(compileStudio({ ...spec, filters: [{ ...spec.filters[0], value: ['Banco Galicia ARS Cuenta', 'BBVA México MXN Cuenta'] }] }, meta).template, catalog, store, { today: TODAY })
  const firstMx = two.rows.findIndex(x => x.cells.g_account === 'BBVA México MXN Cuenta')
  assert(firstMx > 0 && Math.abs(Number(two.rows[firstMx].cells.v_balance_after) - Number(two.rows[firstMx].cells.v_net)) > 1, 'con dos cuentas, el saldo corrido arranca de nuevo en cada una')
  assert(two.totals.v_balance_after === null, 'total oculto cuando las cuentas tienen monedas distintas')

  // Transacciones: net in original currency + one row per transaction
  const tx = runReport(compileStudio({ ...newSpec('transactions'), groupBy: ['movement'], values: ['net'], period: { preset: 'this_month' },
    filters: [{ id: 'f', key: 'account', ref: 'account.account_name', op: 'in', value: ['Banco Galicia ARS Cuenta'] }] }, meta).template, catalog, store, { today: TODAY })
  const fe = TABLES.financial_event.filter(e => e.account_uuid === acc.account_uuid && e.type !== 'ACCOUNT_BALANCE' && String(e.created_date) >= from && String(e.created_date) <= TODAY)
  assert(tx.rows.length === new Set(fe.map(e => e.external_id)).size, 'Transacciones: una fila por transacción')
  assert(Math.abs(Number(tx.totals.v_net) - fe.reduce((a, e) => a + Number(e.amount_signed), 0)) < 0.01, 'Neto (moneda original) = Σ importes con signo')
}

// ---------------------------------------------------------------- fields shown as columns (not grouped)
console.log('\nCampos como columna')
{
  const { compileStudio, newSpec, QUICK_STARTS } = await import('../src/studio/spec')
  const meta = { id: 'tpl_test', name: 'test', owner: 'smoke', updatedAt: '2026-09-28T00:00:00Z' }
  const exec = (spec: Parameters<typeof compileStudio>[0]) => runReport(compileStudio(spec, meta).template, catalog, store, { today: TODAY })
  const stmt = exec(QUICK_STARTS.find(q => q.id === 'statement')!.spec)
  const byId = new Map(TABLES.account_transaction.map(t => [String(t.transaction_id), t]))
  assert(stmt.rows.every(r => { const t = byId.get(String(r.cells.g_movement))!; return r.cells.f_category === t.category && r.cells.f_tag === t.tag && r.cells.f_description === t.description }),
    'una fila por movimiento: Categoría, Tag y Descripción son los de cada movimiento')
  assert(stmt.columns.filter(c => c.key.startsWith('f_')).every(c => c.format === 'text' && stmt.totals[c.key] === null), 'columnas de texto sin total')
  // summary rows: the value when the row shares it, otherwise how many
  const byCompany = exec({ ...newSpec('transactions'), groupBy: ['company'], values: ['count', 'field:category', 'field:currency'], period: { preset: 'all' } })
  const cl = byCompany.rows.find(r => r.cells.g_company === 'Acme Chile SpA')!
  assert(cl.cells.f_currency === 'CLP' && /^\d+ valores$/.test(String(cl.cells.f_category)), `fila resumida: valor único (${cl.cells.f_currency}) o "n valores" (${cl.cells.f_category})`)
  assert(byCompany.rows.length === new Set(TABLES.account.map(a => a.company_name)).size, 'mostrar un campo no agrega filas (no agrupa)')
}
{
  // the case from the screenshot: "Movimiento" placed in Mostrar still gives one row per movement
  const { compileStudio, newSpec } = await import('../src/studio/spec')
  const meta = { id: 'tpl_test', name: 'test', owner: 'smoke', updatedAt: '2026-09-28T00:00:00Z' }
  const acc = TABLES.account.find(a => a.account_name === 'Banco de Chile CLP Cuenta')!
  const spec = { ...newSpec('statement'), groupBy: ['account'], values: ['field:description', 'field:category', 'net', 'field:movement'], period: { preset: 'custom' as const, from: '2026-08-01', to: '2026-08-31' },
    filters: [{ id: 'f', key: 'account', ref: 'account.account_name', op: 'in' as const, value: [acc.account_name] }] }
  const r = runReport(compileStudio(spec, meta).template, catalog, store, { today: TODAY })
  const n = TABLES.account_transaction.filter(t => t.account_uuid === acc.account_uuid && String(t.booking_date) >= '2026-08-01' && String(t.booking_date) <= '2026-08-31').length
  assert(r.rows.length === n && r.columns.some(c => c.key === 'g_movement'), `"Movimiento" en Mostrar pasa a Agrupar por: ${r.rows.length} filas = ${n} movimientos`)
}
{
  // balance after each movement in USD = balance in the account currency ÷ the day's rate
  const { compileStudio, QUICK_STARTS } = await import('../src/studio/spec')
  const meta = { id: 'tpl_test', name: 'test', owner: 'smoke', updatedAt: '2026-09-28T00:00:00Z' }
  const base = QUICK_STARTS.find(q => q.id === 'statement')!.spec
  const spec = { ...base, values: [...base.values, 'balance_after_usd'], filters: [{ ...base.filters[0], value: ['Banco Galicia ARS Cuenta', 'BBVA México MXN Cuenta'] }] }
  const c = compileStudio(spec, meta)
  const r = runReport(c.template, catalog, store, { today: TODAY })
  const byId = new Map(TABLES.account_transaction.map(t => [String(t.transaction_id), t]))
  assert(c.template.measures.map(m => m.id).join() === 'f_description,f_category,f_tag,v_net,v_balance_after,v_fx,v_balance_after_usd', 'el saldo USD trae la columna Tipo de cambio')
  assert(r.rows.every(x => { const t = byId.get(String(x.cells.g_movement))!; const rate = Number(t.amount) / Number(t.amount_base); return Math.abs(Number(x.cells.v_fx) - rate) < 1e-6 && Math.abs(Number(x.cells.v_balance_after_usd) - Number(x.cells.v_balance_after) / rate) < 0.01 }),
    'saldo USD = saldo en moneda de la cuenta ÷ tipo de cambio del día, en cada fila')
  const last = (acc: string) => [...r.rows].reverse().find(x => x.cells.g_account === acc)!
  const expected = ['Banco Galicia ARS Cuenta', 'BBVA México MXN Cuenta'].reduce((a, n) => a + Number(last(n).cells.v_balance_after_usd), 0)
  assert(r.totals.v_balance_after === null && Math.abs(Number(r.totals.v_balance_after_usd) - expected) < 0.05, 'con dos monedas, el total en USD sí suma (saldos finales en USD)')
}

// ---------------------------------------------------------------- amounts in original currency (reconciliation) + currency guard on formulas
console.log('\nMoneda original')
{
  const { compileStudio, newSpec, QUICK_STARTS } = await import('../src/studio/spec')
  const meta = { id: 'tpl_test', name: 'test', owner: 'smoke', updatedAt: '2026-09-28T00:00:00Z' }
  const exec = (spec: Parameters<typeof compileStudio>[0]) => runReport(compileStudio(spec, meta).template, catalog, store, { today: TODAY })
  const matches = exec({ ...QUICK_STARTS.find(q => q.id === 'matches')!.spec, values: ['left', 'right', 'diff', 'left_usd'], period: { preset: 'all' } })
  const byRef = new Map(TABLES.conciliation.map(c => [c.conciliation_ref, c]))
  assert(matches.rows.every(x => { const c = byRef.get(x.cells.g_match)!; return x.cells.v_left === c.left_amount && x.cells.v_right === c.right_amount && x.cells.v_diff === c.difference_amount }),
    'importes de match en moneda de la conciliación = los de cada conciliación')
  assert(!matches.warnings.length && matches.totals.v_left === null && matches.totals.v_left_usd !== null, 'una fila por match: sin avisos; total en moneda original oculto (varias monedas), total USD visible')

  // pending amount by currency: exact; without currency, rows that mix currencies are flagged
  const mov = TABLES.recon_movement
  const byCcy = exec({ ...newSpec('recon'), groupBy: ['currency'], values: ['pending_amt'], period: { preset: 'all' } })
  assert(byCcy.rows.every(x => Math.abs(Number(x.cells.v_pending_amt) - mov.filter(m => m.currency_code === x.cells.g_currency && !m.is_reconciled).reduce((a, m) => a + Number(m.amount), 0)) < 0.01) && !byCcy.warnings.length,
    'monto pendiente (moneda original) por moneda = suma de los no conciliados')
  const byWf = exec({ ...newSpec('recon'), groupBy: ['workflow'], values: ['pending_amt', 'pending_usd'], period: { preset: 'all' } })
  assert(byWf.warnings.some(w => w.includes('Monto pendiente')) && byWf.totals.v_pending_usd !== null, 'una fórmula sobre importes en moneda original avisa si la fila mezcla monedas (RF-1)')

  // statement credits across accounts in different currencies: total hidden
  const st = QUICK_STARTS.find(q => q.id === 'statement')!.spec
  const two = exec({ ...st, values: ['credits', 'net'], filters: [{ ...st.filters[0], value: ['Banco Galicia ARS Cuenta', 'BBVA México MXN Cuenta'] }] })
  assert(two.totals.v_credits === null && two.totals.v_net === null, 'Créditos con dos monedas: total oculto, igual que Importe')
}
