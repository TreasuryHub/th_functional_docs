# Transactions

> **Availability:** `Available` ✅
> **Where to find it:** Reporting › Operations › Transactions
> **Who uses it:** treasury operations, finance teams, accountants, auditors.
> **Permissions required:** `CashManagement.Transactions` · Read. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Transactions is the complete record of every bank movement across your accounts — a **flat grid** of
all movements that you filter, sort, and export. For balances grouped by your company structure
(Company Group › Company › Account), use the [Home dashboard](../01-home/home-dashboard.md) or the
[Cash Position](cash-position.md) report, which drill down to these same transactions.

## Key concepts
- **Flat grid** — one row per transaction across all accounts, which you filter and sort. Use the
  **Columns** control to show or hide the fields you want.
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
1. Open **Transactions**.
2. The grid shows columns such as **Currency, Description, Institution, Amount, Booking Date, Value
   Date, D/C** (debit/credit), and **counterparty**; use the **Columns** control to show or hide fields.
3. Filter by **date range, account, currency,** and **company**, and sort by any column. Your view is
   remembered between visits.

### Export
1. Click **Export** and choose **Excel** or **CSV**; the current, filtered view is downloaded.

## Tips & good practices
- Use **filters** (date range, account, currency, company) to narrow to the movements you're after,
  then sort by any column. For a view grouped by entity/account, use [Cash Position](cash-position.md)
  instead.
- Accurate **tags** make everything downstream better; a well-tagged transaction slots straight into
  the right cash-flow line in [Cash Position](cash-position.md) and the forecast.

## Related
- [Cash Position](cash-position.md) — transactions consolidated into your position, with drill-down
  back to these movements.
- [Bank Statements](bank-statements.md) — where transactions come from.
- [Bank Accounts](bank-accounts.md) — the accounts these movements belong to.
- [G/L Postings](gl-postings-report.md) — how transactions map to the ledger.
- [Reconciliation](../04-reconciliation/overview.md) — matching transactions to your records.
