import type { Row } from './types'
import { categoryLabel } from './silver'

// Deterministic fake Silver tables for one tenant. Relationships are coherent across tables:
// BANK_MOVEMENT events become account transactions, payins/bank movements feed reconciliation
// workflows, conciliations group Left (PSP) movements against a Right (bank) movement, and outflow
// transactions carry tags from tag groups.

export const TODAY = '2026-09-28'
const START = '2026-05-01'
const DAYS = Math.round((Date.parse(TODAY) - Date.parse(START)) / 86_400_000)

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rnd = mulberry32(20260928)
const pick = <T,>(xs: readonly T[]): T => xs[Math.floor(rnd() * xs.length)]
const weighted = <T,>(xs: readonly [T, number][]): T => {
  const tot = xs.reduce((a, [, w]) => a + w, 0)
  let r = rnd() * tot
  for (const [x, w] of xs) { if ((r -= w) <= 0) return x }
  return xs[xs.length - 1][0]
}
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = (rnd() * 16) | 0; return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16) })
const addDays = (iso: string, n: number) => new Date(Date.parse(iso) + n * 86_400_000).toISOString().slice(0, 10)
const round2 = (x: number) => Math.round(x * 100) / 100
const logn = (median: number, spread = 0.9) => median * Math.exp((rnd() + rnd() + rnd() - 1.5) * spread * 1.4)

const FX: Record<string, number> = { USD: 1, ARS: 1 / 1380, MXN: 1 / 18.7, CLP: 1 / 940, BRL: 1 / 5.45, EUR: 1.09 }
const fx = (ccy: string, date: string) => {
  // gentle drift so time series of base amounts aren't flat
  const t = (Date.parse(date) - Date.parse(START)) / 86_400_000
  const drift = ccy === 'ARS' ? 1 - t * 0.0011 : ccy === 'USD' ? 1 : 1 + Math.sin(t / 17) * 0.015
  return FX[ccy] * drift
}

// ------------------------------------------------------------------ accounts

const COMPANIES = [
  { name: 'Acme Argentina S.A.', country: 'AR', group: 'LatAm Sur' },
  { name: 'Acme México S.A. de C.V.', country: 'MX', group: 'LatAm Norte' },
  { name: 'Acme Chile SpA', country: 'CL', group: 'LatAm Sur' },
  { name: 'Acme Brasil Ltda.', country: 'BR', group: 'LatAm Sur' },
  { name: 'Acme Holding LLC', country: 'US', group: 'Holding' },
]

const ACCOUNT_SPECS: [string, string, string, string, string, string, number][] = [
  // company, bank, bic, currency, type, integration, opening balance (account ccy)
  ['Acme Argentina S.A.', 'Banco Galicia', 'GABAARBA', 'ARS', 'Cuenta corriente', 'Interbanking', 820_000_000],
  ['Acme Argentina S.A.', 'Banco Santander AR', 'BSCHARBA', 'ARS', 'Cuenta corriente', 'Interbanking', 410_000_000],
  ['Acme Argentina S.A.', 'Banco Galicia', 'GABAARBA', 'USD', 'Caja de ahorro', 'Interbanking', 1_150_000],
  ['Acme Argentina S.A.', 'Mercado Pago', 'MPAGARBA', 'ARS', 'Cuenta PSP', 'OpenBanking', 260_000_000],
  ['Acme México S.A. de C.V.', 'BBVA México', 'BCMRMXMM', 'MXN', 'Cuenta de cheques', 'OpenBanking', 38_000_000],
  ['Acme México S.A. de C.V.', 'Banorte', 'MENOMXMT', 'MXN', 'Cuenta de cheques', 'Fipto', 21_000_000],
  ['Acme México S.A. de C.V.', 'Kuspit', 'KUSPMXMM', 'MXN', 'Cuenta concentradora', 'Virtu', 9_500_000],
  ['Acme Chile SpA', 'Banco de Chile', 'BCHICLRM', 'CLP', 'Cuenta corriente', 'OpenBanking', 1_900_000_000],
  ['Acme Brasil Ltda.', 'Itaú Unibanco', 'ITAUBRSP', 'BRL', 'Conta corrente', 'OpenBanking', 7_800_000],
  ['Acme Holding LLC', 'JPMorgan Chase', 'CHASUS33', 'USD', 'Checking', 'CBI', 6_400_000],
  ['Acme Holding LLC', 'JPMorgan Chase', 'CHASUS33', 'EUR', 'Checking', 'CBI', 1_200_000],
  ['Acme Holding LLC', 'Silicon Valley Bank', 'SVBKUS6S', 'USD', 'Money market', 'Manual', 3_100_000],
]

const account: Row[] = ACCOUNT_SPECS.map(([company, bank, bic, ccy, type, integ], i) => {
  const c = COMPANIES.find(x => x.name === company)!
  return {
    account_uuid: uuid(),
    account_name: `${bank} ${ccy} ${type.split(' ')[0]}${i === 1 || i === 5 ? ' 2' : ''}`,
    account_number: `****${String(1000 + Math.floor(rnd() * 8999))}`,
    currency_code: ccy, bank_name: bank, bank_bic: bic, company_name: company, company_group: c.group,
    country_code: c.country, account_type: type, integration_type: integ, is_active: i !== 11 || true,
  }
})
account.forEach(a => { a.n = a.account_uuid })
const accountsBy = (pred: (a: Row) => boolean) => account.filter(pred)

// ------------------------------------------------------------------ financial events

const PSPS: Record<string, { country: string; ccy: string; methods: string[] }> = {
  'Mercado Pago': { country: 'AR', ccy: 'ARS', methods: ['Tarjeta de crédito', 'Tarjeta de débito', 'Dinero en cuenta', 'QR'] },
  dLocal: { country: 'MX', ccy: 'MXN', methods: ['Tarjeta de crédito', 'SPEI', 'OXXO'] },
  Kushki: { country: 'CL', ccy: 'CLP', methods: ['Tarjeta de crédito', 'Transferencia', 'Webpay'] },
  Stripe: { country: 'US', ccy: 'USD', methods: ['Tarjeta de crédito', 'ACH'] },
  'PagSeguro': { country: 'BR', ccy: 'BRL', methods: ['PIX', 'Boleto', 'Tarjeta de crédito'] },
  Conekta: { country: 'MX', ccy: 'MXN', methods: ['Tarjeta de débito', 'SPEI', 'OXXO'] },
}
const FIRST = ['María', 'Juan', 'Lucía', 'Carlos', 'Sofía', 'Diego', 'Valentina', 'Mateo', 'Camila', 'Andrés', 'Paula', 'Jorge', 'Ana', 'Pedro', 'Laura']
const LAST = ['González', 'Rodríguez', 'López', 'Martínez', 'García', 'Pérez', 'Sánchez', 'Romero', 'Díaz', 'Torres']
const SUPPLIERS = ['AWS Latam', 'Google Cloud', 'Telecom Argentina', 'CFE', 'Proveedora Industrial SA', 'Logística del Sur', 'DHL Express', 'Deloitte', 'Oracle NetSuite', 'Salesforce']
const MERCHANTS = ['Tienda online', 'App mobile', 'Marketplace', 'Suscripciones']

const financial_event: Row[] = []
const account_transaction: Row[] = []

function baseEvent(type: string, family: string, date: string, ccy: string, country: string, amount: number, negative: boolean, acc?: Row): Row {
  const status = weighted([['BOOKED', 86], ['PENDING', 10], ['REJECTED', 4]] as const)
  const r: Row = {
    event_uuid: uuid(), external_id: `${type.slice(0, 3)}-${Math.floor(rnd() * 9e8 + 1e8)}`,
    type, family, status, original_status: status === 'BOOKED' ? pick(['approved', 'accredited', 'settled']) : status === 'PENDING' ? 'in_process' : pick(['rejected', 'cancelled']),
    direction: negative ? 'OUT' : 'IN', currency_code: ccy, country_code: country,
    created_on: `${date}T${String(8 + Math.floor(rnd() * 12)).padStart(2, '0')}:${String(Math.floor(rnd() * 60)).padStart(2, '0')}:00Z`,
    created_date: date, version: 1 + Math.floor(rnd() * 3), related_count: Math.floor(rnd() * 3),
    amount: round2(amount), amount_signed: round2(negative ? -amount : amount),
    amount_base: round2(amount * fx(ccy, date)), amount_base_signed: round2((negative ? -amount : amount) * fx(ccy, date)),
    account_uuid: acc?.account_uuid ?? null,
  }
  r.n = r.event_uuid
  financial_event.push(r)
  return r
}

for (let day = 0; day <= DAYS; day++) {
  const date = addDays(START, day)
  const dow = new Date(date).getUTCDay()
  const weekend = dow === 0 || dow === 6
  const season = 1 + 0.25 * Math.sin(day / 11) + day / DAYS * 0.35

  // payins (PSP + internal/external)
  const nPayins = Math.round((weekend ? 12 : 22) * season)
  for (let i = 0; i < nPayins; i++) {
    const psp = weighted([['Mercado Pago', 38], ['dLocal', 18], ['Stripe', 14], ['Kushki', 10], ['PagSeguro', 12], ['Conekta', 8]] as const)
    const P = PSPS[psp]
    const med = { ARS: 380_000, MXN: 6_500, CLP: 340_000, USD: 480, BRL: 1_900 }[P.ccy] ?? 400
    const type = weighted([['PSP_PAYIN', 84], ['INTERNAL_PAYIN', 8], ['EXTERNAL_PAYIN', 8]] as const)
    const acc = accountsBy(a => a.currency_code === P.ccy)[0]
    const e = baseEvent(type, 'payment', date, P.ccy, P.country, logn(med), false, acc)
    Object.assign(e, {
      partner_name: psp, payment_method_name: pick(P.methods), payer_name: `${pick(FIRST)} ${pick(LAST)}`,
      payer_personal_id_type: P.country === 'AR' ? 'DNI' : P.country === 'MX' ? 'CURP' : P.country === 'BR' ? 'CPF' : P.country === 'CL' ? 'RUT' : 'SSN',
      merchant_name: pick(MERCHANTS), transaction_reference: `TR${Math.floor(rnd() * 1e10)}`,
    })
  }

  // payouts
  if (!weekend) {
    const nPayouts = Math.round(3 * season)
    for (let i = 0; i < nPayouts; i++) {
      const acc = pick(account.filter(a => a.integration_type !== 'Manual'))
      const ccy = String(acc.currency_code)
      const med = { ARS: 3_800_000, MXN: 95_000, CLP: 4_500_000, USD: 14_000, BRL: 26_000, EUR: 9_000 }[ccy] ?? 10_000
      const type = weighted([['PAYMENT_ORDER', 70], ['INTERNAL_PAYOUT', 18], ['PSP_PAYOUT', 12]] as const)
      const e = baseEvent(type, 'payment', date, ccy, String(acc.country_code), logn(med, 1), true, acc)
      Object.assign(e, {
        partner_name: type === 'PSP_PAYOUT' ? pick(Object.keys(PSPS)) : null,
        payment_method_name: pick(['Transferencia', 'SPEI', 'ACH', 'Wire']), beneficiary_name: pick(SUPPLIERS),
        channel: pick(['H2H', 'API', 'Portal banco']), bank_account_type: pick(['Corriente', 'Ahorro', 'CLABE']),
        transaction_reference: `PO${Math.floor(rnd() * 1e9)}`,
      })
    }
  }

  // bank movements -> also account transactions
  if (!weekend) {
    for (const acc of account) {
      const n = Math.round((acc.bank_name === 'Mercado Pago' ? 1 : 2.2) * season * (0.5 + rnd()))
      for (let i = 0; i < n; i++) {
        const ccy = String(acc.currency_code)
        const med = { ARS: 2_600_000, MXN: 60_000, CLP: 3_000_000, USD: 9_000, BRL: 18_000, EUR: 6_000 }[ccy] ?? 8_000
        const kind = weighted([['settlement', 30], ['supplier', 30], ['payroll', 6], ['tax', 8], ['fee', 14], ['intercompany', 6], ['interest', 6]] as const)
        const negative = !['settlement', 'interest'].includes(kind) && !(kind === 'intercompany' && rnd() < 0.5)
        const amount = kind === 'settlement' ? logn(med * 2.2) : kind === 'fee' ? logn(med * 0.02) : kind === 'interest' ? logn(med * 0.05) : kind === 'payroll' ? logn(med * 4) : logn(med)
        const counterparty = kind === 'settlement' ? pick(Object.keys(PSPS)) : kind === 'supplier' ? pick(SUPPLIERS)
          : kind === 'payroll' ? 'Nómina' : kind === 'tax' ? pick(['AFIP', 'SAT', 'SII', 'Receita Federal', 'IRS']) : kind === 'intercompany' ? pick(COMPANIES).name : String(acc.bank_name)
        const desc = { settlement: `Liquidación ${counterparty}`, supplier: `Pago a ${counterparty}`, payroll: 'Pago de nómina', tax: `Impuestos ${counterparty}`, fee: 'Comisión mantenimiento', intercompany: `Transferencia intercompany ${counterparty.split(' ')[1] ?? ''}`, interest: 'Intereses ganados' }[kind]
        const fromEvent = acc.integration_type !== 'OpenBanking' || rnd() < 0.3
        let eventUuid: unknown = null
        if (fromEvent) {
          const e = baseEvent('BANK_MOVEMENT', 'bank_movement', date, ccy, String(acc.country_code), amount, negative, acc)
          e.status = 'BOOKED'
          Object.assign(e, {
            partner_name: kind === 'settlement' ? counterparty : null, description: desc,
            creditor_name: negative ? counterparty : String(acc.company_name), debtor_name: negative ? String(acc.company_name) : counterparty,
            booking_date: date, value_date: addDays(date, rnd() < 0.8 ? 0 : 1),
          })
          eventUuid = e.event_uuid
        }
        const t: Row = {
          transaction_id: account_transaction.length + 1, account_uuid: acc.account_uuid, event_uuid: eventUuid,
          booking_date: date, value_date: addDays(date, rnd() < 0.8 ? 0 : 1),
          direction: negative ? 'Débito' : 'Crédito', description: desc, counterparty_name: counterparty,
          bank_transaction_code: { settlement: 'PMNT-RCDT', supplier: 'PMNT-ICDT', payroll: 'PMNT-ICDT-SALA', tax: 'PMNT-ICDT-TAXS', fee: 'ACMT-MDOP-CHRG', intercompany: 'PMNT-ICDT-INTC', interest: 'ACMT-MDOP-INTR' }[kind],
          transaction_type: date >= addDays(TODAY, -2) && rnd() < 0.4 ? 'Pending' : 'Booked',
          posting_status: weighted([['Processed', 62], ['PendingApproval', 14], ['Approved', 10], ['Sent', 6], ['Error', 3], ['Unknown', 5]] as const),
          source: fromEvent ? 'event' : pick(['openbanking', 'bankstatement']),
          amount: round2(negative ? -amount : amount), amount_abs: round2(amount), amount_base: round2((negative ? -amount : amount) * fx(ccy, date)),
          _kind: kind,
        }
        t.n = t.transaction_id
        account_transaction.push(t)
      }
    }
  }
}

// ------------------------------------------------------------------ balances (one per account per day, rolled from transactions)

const account_balance: Row[] = []
{
  const txByAccDay = new Map<string, number>()
  for (const t of account_transaction) {
    const k = `${t.account_uuid}|${t.booking_date}`
    txByAccDay.set(k, (txByAccDay.get(k) ?? 0) + Number(t.amount))
  }
  account.forEach((a, i) => {
    let bal = ACCOUNT_SPECS[i][6]
    for (let day = 0; day <= DAYS; day++) {
      const date = addDays(START, day)
      bal += txByAccDay.get(`${a.account_uuid}|${date}`) ?? 0
      // unexplained flows (sweeps, other channels) so balances move realistically
      bal *= 1 + (rnd() - 0.47) * 0.0012
      const fromEvent = a.integration_type !== 'OpenBanking'
      let eventUuid: unknown = null
      if (fromEvent && day % 1 === 0) {
        const e = baseEvent('ACCOUNT_BALANCE', 'balance', date, String(a.currency_code), String(a.country_code), Math.abs(bal), bal < 0, a)
        e.status = 'BOOKED'
        Object.assign(e, { balance_type: 'TH_ClosingBalance', reference_date: date })
        eventUuid = e.event_uuid
      }
      const r: Row = {
        balance_id: `${a.account_uuid}-${date}`, account_uuid: a.account_uuid, event_uuid: eventUuid, balance_date: date,
        balance_type: fromEvent ? 'TH_ClosingBalance' : weighted([['TH_AvailableBalance', 70], ['TH_ExternalBalance', 20], ['TH_FromTransactions', 10]] as const),
        source: fromEvent ? 'event' : 'saas',
        balance: round2(bal), balance_base: round2(bal * fx(String(a.currency_code), date)),
      }
      r.n = r.balance_id
      account_balance.push(r)
    }
  })
}

// ------------------------------------------------------------------ reconciliation

const workflow: Row[] = [
  { workflow_id: 1, workflow_name: 'Mercado Pago vs Galicia', left_source: 'PSP_PAYIN (Mercado Pago)', right_source: 'BANK_MOVEMENT', is_active: true, rule_count: 6, psp: 'Mercado Pago' },
  { workflow_id: 2, workflow_name: 'dLocal + Conekta vs BBVA', left_source: 'PSP_PAYIN (dLocal, Conekta)', right_source: 'BANK_MOVEMENT', is_active: true, rule_count: 9, psp: 'dLocal|Conekta' },
  { workflow_id: 3, workflow_name: 'Stripe settlements vs JPM', left_source: 'PSP_PAYIN (Stripe)', right_source: 'BANK_MOVEMENT', is_active: true, rule_count: 4, psp: 'Stripe' },
  { workflow_id: 4, workflow_name: 'Órdenes de pago vs extracto', left_source: 'PAYMENT_ORDER', right_source: 'BANK_MOVEMENT', is_active: true, rule_count: 5, psp: '' },
]
workflow.forEach(w => { w.n = w.workflow_id })

const conciliation: Row[] = []
const recon_movement: Row[] = []
{
  const RULES = ['Monto + fecha exacta', 'Monto ±1% + referencia', 'Batch diario por PSP', 'Referencia exacta', 'Monto + contraparte']
  const tagsFor = (pm: string) => `Tag:${pm.replace(/\s+/g, '')}`
  const addMov = (w: Row, e: Row, side: 'Left' | 'Right', status: string, concId: number | null, reconciledDate: string | null) => {
    const created = String(e.created_date)
    const end = reconciledDate ?? TODAY
    const r: Row = {
      wm_id: recon_movement.length + 1, workflow_id: w.workflow_id, event_uuid: e.event_uuid, conciliation_id: concId, account_uuid: e.account_uuid,
      external_id: e.external_id, movement_type: e.type, side, wm_status: status, is_reconciled: status === 'Conciliated',
      recon_tag: e.payment_method_name ? tagsFor(String(e.payment_method_name)) : null, currency_code: e.currency_code,
      created_date: created, due_date: addDays(created, 3), reconciled_date: reconciledDate,
      amount: e.amount, amount_base: e.amount_base,
      days_open: Math.max(0, Math.round((Date.parse(end) - Date.parse(created)) / 86_400_000)),
    }
    r.n = r.wm_id
    recon_movement.push(r)
  }
  for (const w of workflow) {
    const psps = String(w.psp).split('|')
    const lefts = financial_event.filter(e => w.workflow_id === 4 ? e.type === 'PAYMENT_ORDER' && e.status !== 'REJECTED' : psps.includes(String(e.partner_name)) && String(e.type).endsWith('PAYIN') && e.status === 'BOOKED')
    // batch lefts per day (payins settle as one bank credit; payment orders 1:1)
    const byDay = new Map<string, Row[]>()
    for (const e of lefts) { const k = w.workflow_id === 4 ? String(e.event_uuid) : String(e.created_date); byDay.set(k, [...(byDay.get(k) ?? []), e]) }
    for (const [, group] of byDay) {
      const date = String(group[0].created_date)
      const age = (Date.parse(TODAY) - Date.parse(date)) / 86_400_000
      const lag = w.workflow_id === 3 ? 2 : 1
      const reconciledDate = addDays(date, lag + (rnd() < 0.15 ? 2 + Math.floor(rnd() * 5) : 0))
      const status = age < lag ? 'Pending' : weighted([['Conciliated', age > 10 ? 93 : 70], ['Matched', 6], ['Pending', age > 10 ? 3 : 18], ['Rejected', 1], ['Annulled', 1]] as const)
      const total = group.reduce((a, e) => a + Number(e.amount), 0)
      const sample = group[0]
      const bankAcc = account.find(a => a.account_uuid === sample.account_uuid)
      // right side: a synthetic bank movement (the settlement credit) when not already created
      const right = baseEvent('BANK_MOVEMENT', 'bank_movement', addDays(date, lag), String(sample.currency_code), String(sample.country_code), total * (w.workflow_id === 4 ? 1 : 0.972), w.workflow_id === 4, bankAcc)
      Object.assign(right, { status: 'BOOKED', description: w.workflow_id === 4 ? `Débito ${sample.beneficiary_name}` : `Liquidación ${sample.partner_name}`, booking_date: addDays(date, lag), value_date: addDays(date, lag) })
      if (status === 'Pending' || rnd() < 0.08) {
        group.forEach(e => addMov(w, e, 'Left', rnd() < 0.2 ? 'PendingApproval' : 'Pending', null, null))
        addMov(w, right, 'Right', 'Pending', null, null)
        continue
      }
      const cid = conciliation.length + 1
      const diff = w.workflow_id === 4 ? 0 : round2(total * (0.028 + (rnd() - 0.5) * 0.01))
      conciliation.push({
        conciliation_id: cid, workflow_id: w.workflow_id, conciliation_ref: `C-${String(cid).padStart(5, '0')}`,
        conciliation_date: reconciledDate, conciliation_type: weighted([['Automatic', 82], ['Manual', 12], ['Request', 6]] as const),
        conciliation_status: status, rule_name: w.workflow_id === 4 ? pick(['Referencia exacta', 'Monto + contraparte']) : pick(RULES.slice(0, 3)),
        batch_type: group.length > 1 ? 'Batch' : 'Single', currency_code: sample.currency_code, account_uuid: right.account_uuid,
        total_amount: round2(total), difference_amount: diff, movements_quantity: group.length + 1,
        left_amount: round2(total), right_amount: round2(Number(right.amount)),
        total_amount_base: round2(total * fx(String(sample.currency_code), reconciledDate)), difference_amount_base: round2(diff * fx(String(sample.currency_code), reconciledDate)),
        left_amount_base: round2(total * fx(String(sample.currency_code), reconciledDate)), right_amount_base: round2(Number(right.amount) * fx(String(sample.currency_code), reconciledDate)),
      })
      const mStatus = status === 'Conciliated' ? 'Conciliated' : status === 'Matched' ? 'Processed' : status === 'Rejected' ? 'LeftPartial' : 'Pending'
      group.forEach(e => addMov(w, e, 'Left', mStatus, cid, status === 'Conciliated' ? reconciledDate : null))
      addMov(w, right, 'Right', mStatus === 'LeftPartial' ? 'RightPartial' : mStatus, cid, status === 'Conciliated' ? reconciledDate : null)
    }
  }
  conciliation.forEach(c => { c.n = c.conciliation_id })
}

// ------------------------------------------------------------------ tagging

const TAG_GROUPS: [string, boolean, string[]][] = [
  ['Tipo de gasto', true, ['Proveedores', 'Nómina', 'Impuestos', 'Comisiones bancarias', 'Cloud & software']],
  ['Centro de costo', true, ['Operaciones', 'Comercial', 'Tecnología', 'Administración']],
  ['Naturaleza', false, ['Intercompany', 'Cobranza PSP', 'Recurrente', 'Extraordinario']],
]
const tag_group: Row[] = TAG_GROUPS.map(([name, excl], i) => ({ group_id: i + 1, group_name: name, is_exclusive: excl, n: i + 1 }))
const tag: Row[] = []
TAG_GROUPS.forEach(([, , tags], gi) => tags.forEach(t => tag.push({ tag_id: tag.length + 1, group_id: gi + 1, tag_name: t, tag_origin: 'saas', n: tag.length + 1 })))
const tagId = (name: string) => tag.find(t => t.tag_name === name)!.tag_id

const tag_assignment: Row[] = []
for (const t of account_transaction) {
  const k = String(t._kind)
  const names: string[] = []
  if (k === 'supplier') names.push(['AWS Latam', 'Google Cloud', 'Oracle NetSuite', 'Salesforce'].includes(String(t.counterparty_name)) ? 'Cloud & software' : 'Proveedores')
  if (k === 'payroll') names.push('Nómina')
  if (k === 'tax') names.push('Impuestos')
  if (k === 'fee') names.push('Comisiones bancarias')
  if (names.length || rnd() < 0.3) {
    names.push(k === 'payroll' ? pick(['Operaciones', 'Comercial', 'Tecnología', 'Administración'])
      : names[0] === 'Cloud & software' ? 'Tecnología' : k === 'settlement' ? 'Comercial' : pick(['Operaciones', 'Administración', 'Tecnología']))
  }
  if (k === 'intercompany') names.push('Intercompany')
  if (k === 'settlement') names.push('Cobranza PSP')
  if (k === 'supplier' || k === 'payroll') names.push('Recurrente')
  if (rnd() < 0.04) names.push('Extraordinario')
  const unique = [...new Set(names)]
  t.tag_list = unique.join(', ') || null
  for (const n of unique) {
    tag_assignment.push({
      assignment_id: tag_assignment.length + 1, tag_id: tagId(n), transaction_id: t.transaction_id,
      applied_by: rnd() < 0.78 ? 'Regla automática' : 'Manual', applied_date: t.booking_date,
    })
  }
}
tag_assignment.forEach(a => { a.n = a.assignment_id })

// ------------------------------------------------------------------ cashflow category + tag (Tagging module)
// A separate PRNG so classifying doesn't shift the sequence that generated everything above.
{
  const rnd2 = mulberry32(4242)
  const BY_KIND: Record<string, (t: Row) => [string, string]> = {
    settlement: t => ['CF09', `Liquidación ${t.counterparty_name}`],
    supplier: t => ['CF10', String(t.counterparty_name)],
    payroll: () => ['O03', 'Nómina mensual'],
    tax: t => ['O04', `Impuestos ${t.counterparty_name}`],
    fee: () => ['O06', 'Mantenimiento de cuenta'],
    intercompany: () => ['O07', 'Intercompany'],
    interest: () => ['CF06', 'Intereses cuenta remunerada'],
  }
  const set = (r: Row, c: [string, string | null] | null) => { r.category = c ? categoryLabel(c[0]) : null; r.tag = c?.[1] ?? null }
  // ~4% of movements stay unclassified, so "sin categoría" is a real case to filter on
  const txByEvent = new Map<unknown, Row>()
  for (const t of account_transaction) {
    set(t, rnd2() < 0.04 ? null : BY_KIND[String(t._kind)](t))
    if (t.event_uuid) txByEvent.set(t.event_uuid, t)
  }
  for (const e of financial_event) {
    const tx = txByEvent.get(e.event_uuid)
    if (tx) { e.category = tx.category; e.tag = tx.tag; continue }
    const unclassified = e.type !== 'ACCOUNT_BALANCE' && rnd2() < 0.04
    switch (e.type) {
      case 'PSP_PAYIN': case 'EXTERNAL_PAYIN': set(e, unclassified ? null : ['CF09', `Cobranza ${e.partner_name}`]); break
      case 'INTERNAL_PAYIN': set(e, unclassified ? null : ['O07', 'Fondeo entre cuentas']); break
      case 'PAYMENT_ORDER': set(e, unclassified ? null : ['CF10', String(e.beneficiary_name)]); break
      case 'INTERNAL_PAYOUT': set(e, unclassified ? null : ['O07', 'Barrido a cuenta concentradora']); break
      case 'PSP_PAYOUT': set(e, unclassified ? null : ['O08', `Devoluciones ${e.partner_name}`]); break
      case 'ACCOUNT_BALANCE': set(e, ['O02', null]); break
      default: {
        // synthetic settlement / debit legs created by the reconciliation workflows
        const desc = String(e.description ?? '')
        set(e, unclassified ? null : desc.startsWith('Liquidación') ? ['CF09', desc] : ['CF10', desc.replace(/^Débito /, '')])
      }
    }
  }
}

export const TABLES: Record<string, Row[]> = {
  financial_event, account, account_balance, account_transaction, workflow, conciliation, recon_movement, tag_group, tag, tag_assignment,
}

export const TABLE_STATS = Object.fromEntries(Object.entries(TABLES).map(([k, v]) => [k, v.length]))
