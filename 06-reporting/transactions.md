# Transactions

> **Availability:** `Available` ✅
> **Where to find it:** Reporting › Operations › Transactions (flat and hierarchical views)
> **Who uses it:** treasury operations, finance teams, accountants, auditors.
> **Permissions required:** `CashManagement.Transactions` · Read. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Transactions is the complete record of every bank movement across your accounts. You can work with it
two ways: a **flat grid** of all movements with a rich detail panel, or a **hierarchical drill-down**
that groups movements by your company structure so you can navigate from the whole group down to a
single transaction. Both views share the same filtering, detail, and export.

## Key concepts
- **Flat view** — one row per transaction across all accounts, filterable and sortable, with a detail
  panel for the full record.
- **Hierarchical view** — the same transactions grouped as **Company Group › Company › Account ›
  Transaction**, expanding one level at a time.
- **Detail panel** — the full record for a selected transaction, including **remittance
  information**, agents (debtor/creditor and their banks), bank transaction codes, purpose code, and
  the **balance after** the transaction.
- **Tag** — the cash-flow category on a transaction (AR Collection, AP Payment, FX Settlement,
  Payroll, Tax, etc.) that drives how it appears in [Cash Position](cash-position.md) and reports.
- **Value date vs booking date** — when a movement is effective for interest/settlement vs when it
  was booked.

## Before you start
- Transactions come from processed [statements](bank-statements.md) and account feeds, so at least
  one [account](bank-accounts.md) with activity must exist.
- You need `CashManagement.Transactions` at **Read**.

## How to use it

### Browse the flat grid
1. Open **Transactions** (the flat view).
2. The grid shows columns including **Currency, Description, Institution, Amount, Booking Date, Value
   Date, D/C** (debit/credit), and **debtor/creditor** name.
3. Filter by **date range, account, currency,** and **company**, and sort by any column. Your view is
   remembered between visits.

### Open a transaction's full detail
1. Click a transaction row.
2. The **detail panel** opens with every field — including **remittance information**, the agents
   (debtor/creditor and their banks), bank transaction codes, purpose code, and the **balance
   after** the transaction.

### Drill down hierarchically
1. Switch to the **hierarchical** view.
2. Expand from **Company Group → Company → Account → Transaction**; each level loads its children
   when you open it.
3. At the transaction level you get the same detail panel as the flat view.

### Export
1. Click **Export** and choose **Excel** or **CSV**; the current, filtered view is downloaded.

## Tips & good practices
- Use the **flat view** when you're searching for specific movements (by counterparty or reference),
  and the **hierarchical view** when you're reviewing activity by entity or account.
- Open the **detail panel's remittance information** to identify what a payment was for when the
  description is terse — it often carries the invoice or reference the description omits.
- Accurate **tags** make everything downstream better; a well-tagged transaction slots straight into
  the right cash-flow line in [Cash Position](cash-position.md) and the forecast.

## Related
- [Cash Position](cash-position.md) — transactions consolidated into your position, with drill-down
  back to these movements.
- [Bank Statements](bank-statements.md) — where transactions come from.
- [Bank Accounts](bank-accounts.md) — the accounts these movements belong to.
- [G/L Postings](gl-postings-report.md) — how transactions map to the ledger.
- [Reconciliation](../04-reconciliation/overview.md) — matching transactions to your records.
