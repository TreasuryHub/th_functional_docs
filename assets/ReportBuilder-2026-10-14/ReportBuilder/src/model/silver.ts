import type { Domain, Entity, Field } from './types'

// Proposed Silver model for th_datalake (see SILVER_MODEL.md).
// Every table is single-tenant filtered (tenant_id) and already denormalized: dim_account carries the
// bank, company and company-group attributes, facts carry base-currency amounts, etc.

const d = (id: string, label: string, type: Field['type'] = 'string', extra: Partial<Field> = {}): Field => ({ id, label, type, role: 'dimension', ...extra })
const m = (id: string, label: string, agg: Field['agg'] = 'SUM', extra: Partial<Field> = {}): Field => ({ id, label, type: 'money', role: 'measure', agg, ...extra })
const count = (label: string): Field => ({ id: 'n', label: `# ${label}`, type: 'number', role: 'measure', agg: 'COUNTD', lineage: 'COUNT(DISTINCT pk)' })

export const FE_TYPES = ['PSP_PAYIN', 'INTERNAL_PAYIN', 'EXTERNAL_PAYIN', 'BANK_MOVEMENT', 'PAYMENT_ORDER', 'INTERNAL_PAYOUT', 'PSP_PAYOUT', 'ACCOUNT_BALANCE']
export const PAYIN_TYPES = ['PSP_PAYIN', 'INTERNAL_PAYIN', 'EXTERNAL_PAYIN']
export const PAYOUT_TYPES = ['PAYMENT_ORDER', 'INTERNAL_PAYOUT', 'PSP_PAYOUT']

/** Cashflow categories a transaction can be tagged with (Tagging module). Stored as "CF09 · Cobro de cliente (AR)". */
export const CATEGORIES: [code: string, name: string][] = [
  ['CF01', 'Principal'], ['CF02', 'Intereses pagados'], ['CF03', 'Cuota'], ['CF04', 'Colocación (depósito)'],
  ['CF05', 'Vencimiento / Rescate'], ['CF06', 'Intereses cobrados / Cupón'], ['CF07', 'Compra de instrumento'], ['CF08', 'Liquidación FX'],
  ['CF09', 'Cobro de cliente (AR)'], ['CF10', 'Pago a proveedor (AP)'], ['CF11', 'Dividendo pagado'], ['CF12', 'Movimiento de equity'],
  ['O01', 'Saldo de apertura'], ['O02', 'Saldo de cierre'], ['O03', 'Nómina'], ['O04', 'Obligación fiscal / impuesto'],
  ['O05', 'Posición de IVA'], ['O06', 'Comisiones bancarias'], ['O07', 'Transferencia interna'], ['O08', 'Ad-hoc cashflow'],
  ['O09', 'Flujo recurrente (sin contrato)'],
]
export const categoryLabel = (code: string) => { const c = CATEGORIES.find(x => x[0] === code); return c ? `${c[0]} · ${c[1]}` : code }
const CATEGORY_VALUES = CATEGORIES.map(c => categoryLabel(c[0]))
const category = () => d('category', 'Categoría', 'enum', { enumValues: CATEGORY_VALUES, lineage: 'Tagging: categoría de cashflow (regla o manual)' })
const tagField = () => d('tag', 'Tag', 'string', { lineage: 'Tagging: tag definido por el usuario' })

export const ENTITIES: Entity[] = [
  // ------------------------------------------------------------------ Financial Events
  {
    id: 'financial_event', label: 'Financial Events', domain: 'fe', table: 'fct_financial_event', kind: 'fact',
    description: 'Estado actual de cada evento financiero: FinancialEventCreated + FinancialEventUpdated aplicados por uuid, ordenados por version y deduplicados (bus > backfill).',
    key: 'event_uuid', dateField: 'created_date', labelField: 'external_id', availability: 'events',
    lookups: [{ entity: 'account', fk: 'account_uuid' }],
    fields: [
      d('event_uuid', 'Event UUID', 'string', { hidden: true }),
      d('external_id', 'External ID', 'string', { lineage: 'ExternalId' }),
      d('type', 'Financial type', 'enum', { enumValues: FE_TYPES, lineage: 'Type (financial_type_catalog)' }),
      d('family', 'Familia', 'enum', { enumValues: ['payment', 'bank_movement', 'balance'], lineage: 'financial_type_catalog.family' }),
      d('status', 'Estado', 'enum', { enumValues: ['PENDING', 'BOOKED', 'REJECTED'], lineage: 'Status (último version)' }),
      d('original_status', 'Estado original (proveedor)', 'string', { lineage: 'OriginalStatus' }),
      d('direction', 'Dirección', 'enum', { enumValues: ['IN', 'OUT'], lineage: 'derivado de IsNegative' }),
      d('currency_code', 'Moneda', 'enum', { lineage: 'CurrencyCode' }),
      d('country_code', 'País', 'enum', { lineage: 'CountryCode' }),
      d('partner_name', 'Partner / PSP', 'string', { lineage: 'payload.PartnerName' }),
      category(),
      tagField(),
      d('created_on', 'Fecha creación', 'date', { lineage: 'CreatedOn' }),
      d('created_date', 'Fecha', 'date', { lineage: 'DATE(CreatedOn)' }),
      d('version', 'Versión', 'number', { lineage: 'Version' }),
      d('related_count', '# Related IDs', 'number', { lineage: 'len(RelatedIds)' }),
      count('eventos'),
      m('amount', 'Monto (moneda orig.)', 'SUM', { lineage: 'Amount (unsigned)', currencyRef: 'financial_event.currency_code' }),
      m('amount_signed', 'Monto con signo', 'SUM', { lineage: 'Amount × (IsNegative ? -1 : 1)', currencyRef: 'financial_event.currency_code' }),
      m('amount_base', 'Monto USD', 'SUM', { lineage: 'amount × fx_rate(currency→USD, fecha)' }),
      m('amount_base_signed', 'Neto USD', 'SUM', { lineage: 'amount_signed × fx_rate' }),
    ],
  },
  {
    id: 'payin', label: 'Internal Payin', domain: 'fe', table: 'fct_financial_event', kind: 'fact',
    description: 'Payload payin_payment (PSP_PAYIN, INTERNAL_PAYIN, EXTERNAL_PAYIN). Mismo row que Financial Events con las columnas del payload.',
    key: 'event_uuid', dateField: 'created_date', availability: 'events',
    parent: { entity: 'financial_event', kind: 'subtype', fk: 'event_uuid', typeValues: PAYIN_TYPES },
    fields: [
      d('payment_method_name', 'Medio de pago', 'enum', { lineage: 'payload.PaymentMethodName' }),
      d('payer_name', 'Pagador', 'string', { lineage: 'payload.PayerName' }),
      d('payer_personal_id_type', 'Tipo doc. pagador', 'enum', { lineage: 'payload.PayerPersonalIdType' }),
      d('merchant_name', 'Merchant', 'enum', { lineage: 'payload.MerchantName' }),
      d('transaction_reference', 'Referencia', 'string', { lineage: 'payload.TransactionReference' }),
    ],
  },
  {
    id: 'payout', label: 'Internal Payout', domain: 'fe', table: 'fct_financial_event', kind: 'fact',
    description: 'Payload payout_payment (PAYMENT_ORDER, INTERNAL_PAYOUT, PSP_PAYOUT).',
    key: 'event_uuid', dateField: 'created_date', availability: 'events',
    parent: { entity: 'financial_event', kind: 'subtype', fk: 'event_uuid', typeValues: PAYOUT_TYPES },
    fields: [
      d('payment_method_name', 'Medio de pago', 'enum', { lineage: 'payload.PaymentMethodName' }),
      d('beneficiary_name', 'Beneficiario', 'string', { lineage: 'payload.BeneficiaryName' }),
      d('channel', 'Canal', 'enum', { lineage: 'payload.Channel' }),
      d('bank_account_type', 'Tipo cuenta destino', 'enum', { lineage: 'payload.BankAccountType' }),
    ],
  },
  {
    id: 'bank_movement', label: 'Bank Movement', domain: 'fe', table: 'fct_financial_event', kind: 'fact',
    description: 'Payload bank_movement (BANK_MOVEMENT). Campos ISO 20022 + fechas valor/contable.',
    key: 'event_uuid', dateField: 'created_date', availability: 'events',
    parent: { entity: 'financial_event', kind: 'subtype', fk: 'event_uuid', typeValues: ['BANK_MOVEMENT'] },
    fields: [
      d('description', 'Descripción', 'string', { lineage: 'payload.Description' }),
      d('creditor_name', 'Acreedor', 'string', { lineage: 'payload.CreditorName' }),
      d('debtor_name', 'Deudor', 'string', { lineage: 'payload.DebtorName' }),
      d('booking_date', 'Fecha contable', 'date', { lineage: 'payload.BookingDate' }),
      d('value_date', 'Fecha valor', 'date', { lineage: 'payload.ValueDate' }),
    ],
  },

  // ------------------------------------------------------------------ Accounts
  {
    id: 'account', label: 'Accounts', domain: 'accounts', table: 'dim_account', kind: 'dimension',
    description: 'Cuenta bancaria desnormalizada: banco (Institution), empresa (Company), grupo de empresas, moneda y conectividad. Fuente: eventos de estado de th_saas publicados por Outbox (EventCore), a implementar.',
    key: 'account_uuid', labelField: 'account_name', availability: 'new-source',
    fields: [
      d('account_uuid', 'Account UUID', 'string', { hidden: true }),
      d('account_name', 'Cuenta', 'string', { lineage: 'Accounts.Name' }),
      d('account_number', 'Nº cuenta (enmasc.)', 'string', { lineage: 'Accounts.AccountNumber / Iban' }),
      d('currency_code', 'Moneda cuenta', 'enum', { lineage: 'Currency.IsoCode' }),
      d('bank_name', 'Banco', 'enum', { lineage: 'Institutions.Name' }),
      d('bank_bic', 'BIC', 'string', { lineage: 'Institutions.Bic' }),
      d('company_name', 'Empresa', 'enum', { lineage: 'Companies.Name' }),
      d('company_group', 'Grupo de empresas', 'enum', { lineage: 'CompanyGroup.Name' }),
      d('country_code', 'País empresa', 'enum', { lineage: 'Country.CountryCode' }),
      d('account_type', 'Tipo de cuenta', 'enum', { lineage: 'Accounts.CashAccountType' }),
      d('integration_type', 'Conectividad', 'enum', { enumValues: ['OpenBanking', 'Fipto', 'Interbanking', 'CBI', 'Virtu', 'Manual'], lineage: 'AccountIntegrationType' }),
      d('is_active', 'Activa', 'bool', { lineage: 'Active && !Deleted' }),
      count('cuentas'),
    ],
  },
  {
    id: 'account_balance', label: 'Balances', domain: 'accounts', table: 'fct_account_balance', kind: 'fact',
    description: 'Un saldo por cuenta y día (regla de prioridad FromUser > Closing > Available > External > FromTransactions). Fuente: eventos ACCOUNT_BALANCE + Balances de th_saas publicados por Outbox.',
    key: 'balance_id', dateField: 'balance_date', labelField: 'balance_date', availability: 'events',
    parent: { entity: 'account', kind: 'parent', fk: 'account_uuid' },
    lookups: [{ entity: 'financial_event', fk: 'event_uuid' }],
    fields: [
      d('balance_id', 'Balance ID', 'string', { hidden: true }),
      d('balance_date', 'Fecha saldo', 'date', { lineage: 'ValueDate / ReferenceDate' }),
      d('balance_type', 'Tipo de saldo', 'enum', { enumValues: ['TH_ClosingBalance', 'TH_AvailableBalance', 'TH_ExternalBalance', 'TH_FromTransactions', 'TH_FromUser'], lineage: 'BalanceType' }),
      d('source', 'Origen', 'enum', { enumValues: ['event', 'saas'], lineage: 'lineage' }),
      m('balance', 'Saldo (moneda cuenta)', 'LAST', { currencyRef: 'account.currency_code', semiAdditive: true, partitionBy: 'account_uuid', lineage: 'BalanceValue — semi-aditivo: último por cuenta', description: 'Semi-aditivo: se suma entre cuentas, pero en el tiempo se toma el último.' }),
      m('balance_base', 'Saldo USD', 'LAST', { semiAdditive: true, partitionBy: 'account_uuid', lineage: 'balance × fx_rate(fecha)', description: 'Semi-aditivo: se suma entre cuentas, pero en el tiempo se toma el último.' }),
      count('saldos'),
    ],
  },
  {
    id: 'account_transaction', label: 'Transactions', domain: 'accounts', table: 'fct_account_transaction', kind: 'fact',
    description: 'Movimientos de extracto. BANK_MOVEMENT → Transaction (InternalTransactionId = event uuid) + transacciones Open Banking / extracto sin evento.',
    key: 'transaction_id', dateField: 'booking_date', labelField: 'description', availability: 'events',
    parent: { entity: 'account', kind: 'parent', fk: 'account_uuid' },
    lookups: [{ entity: 'financial_event', fk: 'event_uuid' }],
    fields: [
      d('transaction_id', 'Transaction ID', 'string', { hidden: true }),
      d('booking_date', 'Fecha contable', 'date', { lineage: 'BookingDate' }),
      d('value_date', 'Fecha valor', 'date', { lineage: 'ValueDate' }),
      d('direction', 'Crédito / Débito', 'enum', { enumValues: ['Crédito', 'Débito'], lineage: 'IsNegative' }),
      d('description', 'Descripción', 'string', { lineage: 'RemittanceInformationUnstructured' }),
      d('counterparty_name', 'Contraparte', 'string', { lineage: 'Debtor/CreditorName → Counterparty (resuelto en silver)' }),
      d('bank_transaction_code', 'Código bancario', 'enum', { lineage: 'BankTransactionCode' }),
      d('transaction_type', 'Estado', 'enum', { enumValues: ['Booked', 'Pending'], lineage: 'TransactionType' }),
      d('posting_status', 'Estado contabilización', 'enum', { enumValues: ['Processed', 'PendingApproval', 'Approved', 'Sent', 'Error', 'Unknown'], lineage: 'TransactionPostings.Status' }),
      d('source', 'Origen', 'enum', { enumValues: ['event', 'openbanking', 'bankstatement'], lineage: 'lineage' }),
      category(),
      tagField(),
      d('tag_list', 'Tags (grupos)', 'string', { lineage: 'string_agg(Tags.Name)' }),
      count('transacciones'),
      m('amount', 'Monto (moneda cuenta)', 'SUM', { lineage: 'Amount (con signo)', currencyRef: 'account.currency_code' }),
      m('amount_abs', 'Monto absoluto', 'SUM', { lineage: 'UAmount', currencyRef: 'account.currency_code' }),
      m('amount_base', 'Monto USD', 'SUM', { lineage: 'amount × fx_rate' }),
    ],
  },

  // ------------------------------------------------------------------ Reconciliation Workflows
  {
    id: 'workflow', label: 'Reconciliation Workflows', domain: 'recon', table: 'dim_recon_workflow', kind: 'dimension',
    description: 'Workflow de conciliación con su configuración resumida (cadenas, reglas). Fuente: eventos de th_reconcilation_module publicados por Outbox, a implementar.',
    key: 'workflow_id', labelField: 'workflow_name', availability: 'new-source',
    fields: [
      d('workflow_id', 'Workflow ID', 'number', { hidden: true }),
      d('workflow_name', 'Workflow', 'enum', { lineage: 'workflow.name' }),
      d('left_source', 'Lado izquierdo', 'enum', { lineage: 'rules.movement_type_from' }),
      d('right_source', 'Lado derecho', 'enum', { lineage: 'rules.movement_type_to' }),
      d('is_active', 'Activo', 'bool', { lineage: 'workflow.active' }),
      { id: 'rule_count', label: '# reglas', type: 'number', role: 'measure', agg: 'SUM', lineage: 'COUNT(conciliation_rule)' },
      count('workflows'),
    ],
  },
  {
    id: 'conciliation', label: 'Conciliations', domain: 'recon', table: 'fct_conciliation', kind: 'fact',
    description: 'Un match. Moneda derivada del MovementCurrency default de sus detalles; importes izquierdo/derecho desnormalizados; cuenta = la cuenta bancaria del lado derecho.',
    key: 'conciliation_id', dateField: 'conciliation_date', labelField: 'conciliation_ref', availability: 'new-source',
    parent: { entity: 'workflow', kind: 'parent', fk: 'workflow_id' },
    lookups: [{ entity: 'account', fk: 'account_uuid' }],
    fields: [
      d('conciliation_id', 'Conciliation ID', 'number', { hidden: true }),
      d('conciliation_ref', 'Conciliación', 'string', { lineage: "'C-' || id" }),
      d('conciliation_date', 'Fecha', 'date', { lineage: 'conciliation.date' }),
      d('conciliation_type', 'Tipo', 'enum', { enumValues: ['Automatic', 'Manual', 'Request'], lineage: 'ConciliationDetailType' }),
      d('conciliation_status', 'Estado', 'enum', { enumValues: ['Conciliated', 'Matched', 'Pending', 'Unmatched', 'Rejected', 'Annulled'], lineage: 'ConciliationStatus' }),
      d('rule_name', 'Regla', 'enum', { lineage: 'conciliation_rule_match.name' }),
      d('batch_type', 'Batch / Single', 'enum', { enumValues: ['Batch', 'Single'], lineage: 'ConciliationType' }),
      d('currency_code', 'Moneda', 'enum', { lineage: 'movement_currency (is_default)' }),
      count('conciliaciones'),
      m('total_amount', 'Importe total', 'SUM', { lineage: 'total_amount', currencyRef: 'conciliation.currency_code' }),
      m('difference_amount', 'Diferencia', 'SUM', { lineage: 'difference_amount', currencyRef: 'conciliation.currency_code' }),
      m('left_amount', 'Importe izquierdo', 'SUM', { lineage: 'Σ detalles lado Left', currencyRef: 'conciliation.currency_code' }),
      m('right_amount', 'Importe derecho', 'SUM', { lineage: 'Σ detalles lado Right', currencyRef: 'conciliation.currency_code' }),
      m('total_amount_base', 'Importe total USD', 'SUM', { lineage: 'total_amount × fx_rate' }),
      m('left_amount_base', 'Importe izquierdo USD', 'SUM', { lineage: 'left_amount × fx_rate' }),
      m('right_amount_base', 'Importe derecho USD', 'SUM', { lineage: 'right_amount × fx_rate' }),
      m('difference_amount_base', 'Diferencia USD', 'SUM', { lineage: 'difference_amount × fx_rate' }),
      { id: 'movements_quantity', label: '# movimientos', type: 'number', role: 'measure', agg: 'SUM', lineage: 'movements_quantity' },
    ],
  },
  {
    id: 'recon_movement', label: 'Movements', domain: 'recon', table: 'fct_recon_movement', kind: 'fact',
    description: 'Grano (workflow, movimiento): estado del movimiento en cada workflow, lado del match y conciliación. movement.uuid = financial event uuid; account_uuid desnormalizado del evento.',
    key: 'wm_id', dateField: 'created_date', labelField: 'external_id', availability: 'new-source',
    parent: { entity: 'workflow', kind: 'parent', fk: 'workflow_id' },
    lookups: [{ entity: 'account', fk: 'account_uuid' }, { entity: 'conciliation', fk: 'conciliation_id' }, { entity: 'financial_event', fk: 'event_uuid' }],
    fields: [
      d('wm_id', 'WorkflowMovement ID', 'number', { hidden: true }),
      d('external_id', 'External ID', 'string', { lineage: 'movement.external_id' }),
      d('movement_type', 'Tipo movimiento', 'enum', { lineage: 'movement.type' }),
      d('side', 'Lado', 'enum', { enumValues: ['Left', 'Right'], lineage: 'conciliation_detail.side' }),
      d('wm_status', 'Estado en workflow', 'enum', { enumValues: ['Conciliated', 'Pending', 'PendingApproval', 'Processed', 'LeftPartial', 'RightPartial'], lineage: 'WorkflowMovementStatus' }),
      d('is_reconciled', 'Conciliado', 'bool', { lineage: "wm_status = 'Conciliated'" }),
      d('recon_tag', 'Tag de regla', 'string', { lineage: 'movement_tag.tag' }),
      d('currency_code', 'Moneda', 'enum', { lineage: 'movement_currency (is_default)' }),
      d('created_date', 'Fecha', 'date', { lineage: 'movement.created_on' }),
      d('due_date', 'Vencimiento', 'date', { lineage: 'movement.due_date' }),
      d('reconciled_date', 'Fecha conciliación', 'date', { lineage: 'conciliation.date' }),
      count('movimientos'),
      m('amount', 'Monto', 'SUM', { lineage: 'movement_currency.amount (default)', currencyRef: 'recon_movement.currency_code' }),
      m('amount_base', 'Monto USD', 'SUM', { lineage: 'amount × fx_rate' }),
      { id: 'days_open', label: 'Días abierto', type: 'number', role: 'measure', agg: 'AVG', lineage: 'COALESCE(reconciled_date, today) - created_date' },
    ],
  },

  // ------------------------------------------------------------------ Tagging
  {
    id: 'tag_group', label: 'Groups', domain: 'tagging', table: 'dim_tag_group', kind: 'dimension',
    description: 'NUEVO: hoy no existen grupos de tags en ningún repo. Los aporta el nuevo módulo de Tagging, que publica por Outbox desde el día uno.',
    key: 'group_id', labelField: 'group_name', availability: 'new-source',
    fields: [
      d('group_id', 'Group ID', 'number', { hidden: true }),
      d('group_name', 'Grupo de tags', 'enum'),
      d('is_exclusive', 'Exclusivo (1 tag por item)', 'bool'),
      count('grupos'),
    ],
  },
  {
    id: 'tag', label: 'Tags', domain: 'tagging', table: 'dim_tag', kind: 'dimension',
    description: 'Tags de th_saas (Tags) + tags de reglas de conciliación (movement_tag, texto). Unificados por nombre en silver.',
    key: 'tag_id', labelField: 'tag_name', availability: 'new-source',
    parent: { entity: 'tag_group', kind: 'parent', fk: 'group_id' },
    fields: [
      d('tag_id', 'Tag ID', 'number', { hidden: true }),
      d('tag_name', 'Tag', 'enum', { lineage: 'Tags.Name' }),
      d('tag_origin', 'Origen del tag', 'enum', { enumValues: ['saas', 'recon-filter'] }),
      count('tags'),
    ],
  },
  {
    id: 'tag_assignment', label: 'Asignaciones', domain: 'tagging', table: 'brg_tag_assignment', kind: 'fact',
    description: 'Bridge M:N tag ↔ transacción (TransactionTags). Una transacción con 2 tags aparece 2 veces: las medidas de la transacción se agregan de forma simétrica.',
    key: 'assignment_id', dateField: 'applied_date', availability: 'new-source',
    parent: { entity: 'tag', kind: 'parent', fk: 'tag_id' },
    lookups: [{ entity: 'account_transaction', fk: 'transaction_id' }],
    fields: [
      d('assignment_id', 'Assignment ID', 'number', { hidden: true }),
      d('applied_by', 'Aplicado por', 'enum', { enumValues: ['Regla automática', 'Manual'], lineage: 'MatchingRuleAssignmentTagAppliedId IS NULL → Manual' }),
      d('applied_date', 'Fecha asignación', 'date'),
      count('asignaciones'),
    ],
  },
]

export const DOMAINS: (Domain & { tree: TreeNode[]; badge: string })[] = [
  {
    id: 'fe', label: 'Financial Events', root: 'financial_event', badge: 'Eventos',
    description: 'Hub de eventos financieros ingestados (th_ingestion → bronze → silver).',
    tree: [
      { entity: 'financial_event', children: [{ entity: 'payin' }, { entity: 'payout' }, { entity: 'bank_movement' }] },
      { entity: 'account_balance', alias: 'Accounts_Balances' },
      { entity: 'account_transaction', alias: 'Accounts_Transactions' },
      { entity: 'recon_movement', alias: 'Reconciliations_Movements' },
    ],
  },
  {
    id: 'accounts', label: 'Accounts', root: 'account', badge: 'Eventos + Outbox saas',
    description: 'Cuentas bancarias con sus saldos y movimientos.',
    tree: [{ entity: 'account', children: [{ entity: 'account_balance' }, { entity: 'account_transaction' }] }],
  },
  {
    id: 'recon', label: 'Reconciliations Workflows', root: 'workflow', badge: 'Fuente nueva',
    description: 'Workflows de conciliación, sus matches y el estado de cada movimiento.',
    tree: [{ entity: 'workflow', children: [{ entity: 'conciliation' }, { entity: 'recon_movement' }] }],
  },
  {
    id: 'tagging', label: 'Tagging', root: 'tag_group', badge: 'Fuente nueva',
    description: 'Grupos de tags → tags → asignaciones a transacciones.',
    tree: [{ entity: 'tag_group', children: [{ entity: 'tag', children: [{ entity: 'tag_assignment' }] }] }],
  },
]

export interface TreeNode { entity: string; alias?: string; children?: TreeNode[] }
