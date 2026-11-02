// Semantic layer over the Silver tables of th_datalake.
// Each Entity maps to one denormalized silver table (dim_* or fct_*). Relations between entities are
// what lets the Builder know that Account is the parent of Balances and Transactions, or that
// Payin is a specialization (subtype) of Financial Event.

export type FieldType = 'string' | 'number' | 'money' | 'date' | 'datetime' | 'bool' | 'enum'
export type FieldRole = 'dimension' | 'measure'

export interface Field {
  id: string
  label: string
  type: FieldType
  role: FieldRole
  description?: string
  /** measure default aggregation */
  agg?: 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'COUNT' | 'COUNTD' | 'LAST'
  /** semi-additive measures (balances): SUM across entities, LAST across time */
  semiAdditive?: boolean
  enumValues?: string[]
  /** where the value comes from (bronze column / payload path / source table) — shown in the catalog */
  lineage?: string
  /** hide from the picker (technical keys) */
  hidden?: boolean
  /** money in original currency: the field holding its currency (summing across currencies is flagged) */
  currencyRef?: string
  /** semi-additive measures are summed across this key after taking LAST() per key */
  partitionBy?: string
}

export type RelationKind =
  /** 1:N — the child has many rows per parent. Mixing both requires a grain decision. */
  | 'parent'
  /** is-a — the subtype is the same row with extra payload columns; picking it narrows by type. */
  | 'subtype'

export interface Entity {
  id: string
  label: string
  domain: string
  /** silver table name */
  table: string
  kind: 'dimension' | 'fact'
  description: string
  /** primary key column */
  key: string
  /** default business date used for time filters and LAST() ordering */
  dateField?: string
  /** relation to another entity */
  parent?: { entity: string; kind: RelationKind; fk: string; typeValues?: string[] }
  /** extra N:1 joins outside the display hierarchy (e.g. financial_event.account_id -> account) */
  lookups?: { entity: string; fk: string }[]
  /** field used as the row label when the entity is shown as detail under a parent */
  labelField?: string
  /** available today from events vs needs a new source (Outbox events from th_saas / recon / Tagging module) */
  availability: 'events' | 'new-source'
  fields: Field[]
}

export interface Domain {
  id: string
  label: string
  description: string
  root: string
}

export type Row = Record<string, unknown>
