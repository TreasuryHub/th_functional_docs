# Silver model proposed for th_datalake

Denormalized, single-tenant tables in `silver.*`, rebuilt from bronze. This is the
model the Report Builder POC queries. The definition used in code is
[`src/model/silver.ts`](src/model/silver.ts).

## What exists today (surveyed on 2026-09-28)

| Source | What it publishes or holds | Relevance to silver |
|---|---|---|
| `th_event_core_library` | Only `FinancialEventCreated` / `FinancialEventUpdated`, published by th_ingestion | The only source that reaches the lake through events |
| `th_datalake` | Bronze: one Delta table per `message_type`, partitioned by `dt`. Typed tables: `payin-payment`, `bank-movement`, `payout-payment`, `account-balance` | Silver starts from these tables. Every spec lists silver itself as "out of scope" |
| `th_ingestion` | `financial_events` and `financial_type_catalog` (type → shape → family) | Status enum (PENDING/BOOKED/REJECTED), 8 financial types |
| `th_saas` | Accounts, Balances, Transactions, Companies, CompanyGroup, Institutions, Currency, ExchangeRate, Tags / TransactionTags, Counterparty | Master data and history **without events**. Decided: it will publish state events through the EventCore **Outbox** |
| `th_reconcilation_module` | workflow, conciliation(+detail), movement, workflow_movement, movement_tag, rules | **No events** published. Decided: it will publish state events through the EventCore **Outbox** |

### Gaps the model has to cover

1. **Tag Groups do not exist.** th_saas Tags are flat. Reconciliation tags are plain text: `movement_tag.tag` holds the rule filter's name. Decided: tag groups come from a **new Tagging module**.
2. **Only financial events publish events.** Decided: th_saas and th_reconcilation_module adopt the EventCore transactional **Outbox** and publish state events, plus a one-off initial load. Capture only needs configuration.
3. **Keys differ between systems:**
   - Tenant: uuid in ingestion, long in saas, int in recon. Unify on the tenant **uuid**.
   - Account: `event.account_uuid` matches `Accounts.Uuid`, not `Accounts.Id`.
   - `Movement.ThbTxId` points to `Transactions.Id`.
   - `Transaction.InternalTransactionId` is the event uuid.
4. **Amounts and currencies:**
   - `Amount` is always unsigned, and `IsNegative` carries the sign.
   - A Conciliation has no currency; it comes from the default MovementCurrency.
   - A Balance has no currency; it comes from the account.
   - Silver adds `amount_signed` and `amount_base` (converted to USD with the daily ExchangeRate).
5. **Current state of an event:** apply Created, then Updated, per uuid, ordered by `version`. Dedupe on `(message_type, aggregate_id, aggregate_version)` and keep the bus row over the backfill row.
6. **Counterparties have no FK.** Resolve them in silver by name or identifier (PartnerName, Debtor/CreditorName).

## Tables

`●` = can be derived from events today · `○` = needs a new source

| Domain | Table | Grain | Relationship | Source |
|---|---|---|---|---|
| Financial Events | ● `fct_financial_event` | 1 row per event (current state) | N:1 `dim_account` (account_uuid) | bronze + typed tables |
| | ↳ Internal Payin | same row, `type ∈ PSP_PAYIN, INTERNAL_PAYIN, EXTERNAL_PAYIN` | **subtype** | payload payin_payment |
| | ↳ Internal Payout | same row, `type ∈ PAYMENT_ORDER, INTERNAL_PAYOUT, PSP_PAYOUT` | **subtype** | payload payout_payment |
| | ↳ Bank Movement | same row, `type = BANK_MOVEMENT` | **subtype** | payload bank_movement |
| Accounts | ○ `dim_account` | 1 row per account, with bank, company, group and currency denormalized onto it | parent | th_saas events (Outbox) |
| | ● `fct_account_balance` | 1 row per account per day (priority FromUser > Closing > Available > External > FromTransactions) | **child** of account · N:1 event | ACCOUNT_BALANCE events + saas Balances |
| | ● `fct_account_transaction` | 1 row per statement line | **child** of account · N:1 event (InternalTransactionId) | BANK_MOVEMENT events + saas Transactions |
| Reconciliation Workflows | ○ `dim_recon_workflow` | 1 row per workflow | parent | recon events (Outbox) |
| | ○ `fct_conciliation` | 1 row per match, with currency and USD amounts | **child** of workflow | conciliation + detail |
| | ○ `fct_recon_movement` | 1 row per (workflow, movement): status, side, conciliation | **child** of workflow · N:1 conciliation · N:1 event | workflow_movement + movement + conciliation_detail |
| Tagging | ○ `dim_tag_group` | 1 row per group | parent | **new** |
| | ○ `dim_tag` | 1 row per tag (saas + recon-filter) | **child** of group | Tags + movement_tag |
| | ○ `brg_tag_assignment` | 1 row per (tag, transaction) | child of tag · N:1 transaction (**M:N bridge**) | TransactionTags |

### Measure rules the model encodes

- **Semi-additive:** `balance` and `balance_base` are summed across accounts. Across time, the Builder takes `LAST` per account, then sums.
- **Money in original currency:** each such field carries a `currencyRef`. When the Builder is about to add up different currencies, it warns, and it hides the total.
- **Symmetric aggregates:** a parent measure shown at the child's grain counts once per parent. A measure reached through a bridge counts once per item.

## How the Builder uses the relationships

| The user combines… | What the Builder does |
|---|---|
| Fields from a single entity | Plain `GROUP BY` |
| Parent + child (Account + Balances) | **Asks** how to group: summarize by parent, hierarchical with subtotals, or detail by child |
| Siblings (Balances + Transactions) | Drill-across: aggregates each sibling separately and joins them on the dimensions (no fan-out) |
| Two entities with no common parent (Tag Group + Transaction) | Looks for the bridge (`brg_tag_assignment`) and uses symmetric aggregates |
| Fields from a subtype (Payin) | Adds the `type ∈ …` filter automatically |
| A filter on a child (parent-level report) | Semi-join: "has at least one" |
