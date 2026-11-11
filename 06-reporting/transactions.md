# Transactions

> **Find any bank movement in seconds**
>
> **Why it matters**
> - **Every movement, every account**: one flat grid you filter, sort and export.
> - **Across banks and entities at once**: no per-portal searching to answer a single question.
> - **The level everything drills to**: the dashboards and reports above all land here.

> **Where to find it:** Reporting › Operations › Transactions
> **Who uses it:** treasury operations, finance teams, accountants, auditors.
> **Permissions required:** `CashManagement.Transactions` · Read. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Find any bank movement, across every bank and entity, in seconds: Transactions is the complete,
searchable record of all your movements — a **flat grid** you filter, sort and export. For balances grouped by your company structure
(Company Group › Company › Account), use the [Home dashboard](../01-home/home-dashboard.md) or the
[Cash Position](../01-home/home-dashboard.md) report, which drill down to these same transactions.

## Key concepts
- **Flat grid** — one row per transaction across all accounts, which you filter and sort. Use the
  **Columns** control to show or hide the fields you want.
- **Tag** — the cash-flow category on a transaction (AR Collection, AP Payment, FX Settlement,
  Payroll, Tax, etc.) that drives how it appears in [Cash Position](../01-home/home-dashboard.md) and reports.
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

## Tips to get more value
- Use **filters** (date range, account, currency, company) to narrow to the movements you're after,
  then sort by any column. For a view grouped by entity/account, use [Cash Position](../01-home/home-dashboard.md)
  instead.
- Accurate **tags** make everything downstream better; a well-tagged transaction slots straight into
  the right cash-flow line in [Cash Position](../01-home/home-dashboard.md) and the forecast.

## Where to go next
- [Cash Position](../01-home/home-dashboard.md) — transactions consolidated into your position, with drill-down
  back to these movements.
- [Bank Statements](bank-statements.md) — where transactions come from.
- [Bank Accounts](bank-accounts.md) — the accounts these movements belong to.
- [G/L Postings](gl-postings-report.md) — how transactions map to the ledger.
- [Reconciliation](../04-reconciliation/overview.md) — matching transactions to your records.
