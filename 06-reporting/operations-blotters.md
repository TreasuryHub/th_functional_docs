# Operations Blotters

> **Availability:** `Available` ✅ — Transactions, Bank Statements, Bank Accounts, Invoices, Reconciliation Status, and G/L Postings are live. The FX / Debt / Investment blotters, Debt Repayment (Amortization Schedule), and Customer Aging are `In Preview` 👁️ — see the per-blotter table below.
> **Where to find it:** Reporting › Operations
> **Who uses it:** treasury operations, finance teams, accountants, risk and credit teams.
> **Permissions required:** each blotter respects its own data permissions (e.g. `CashManagement.Transactions` for Transactions, `CoreData.BankAccounts` for Bank Accounts). See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
The Operations area is a set of **blotters** — searchable, filterable grids of your operational
records. Each blotter lists one kind of item (bank movements, accounts, FX contracts, loans,
investments, reconciliation status, and more), lets you open any row for full detail, and exports the
current view. They all share the same behavior, so once you know one, you know them all.

Blotters are your operational source of truth: they show every record, where it came from (its
**source**), and its current status — the raw operational detail behind the consolidated
[Cash Position](cash-position.md) and risk reports.

## Key concepts
- **Blotter** — a data grid of operational records with filters, grouping, a detail panel, and
  export.
- **Source** — where a record came from (a bank statement format such as MT940 or CAMT.053, an API,
  a trading venue like 360T, a custodian feed, Core Banking, or a manual/PDF upload). Shown as a
  coloured pill on each row.
- **Detail panel** — the side panel that opens when you select a row, showing all fields plus an
  **audit trail** of what happened to the record and when.
- **Status** — where the record stands (e.g. Reconciled / Pending for a transaction; Open / Settled /
  Rolled Over for an FX contract; Active / SICR / NPL for a loan).

## The blotters

| Blotter | What it lists | Status |
|---|---|---|
| **Transactions** | Every bank movement across all accounts, with tag, reference, and source. | `Available` ✅ — see [Transactions](transactions.md). |
| **Bank Statements** | Statement files and the transactions produced from them. | `Available` ✅ — see [Bank Statements](bank-statements.md). |
| **Bank Accounts** | All accounts, their balances, banks, currencies, and sync source. | `Available` ✅ — see [Bank Accounts](bank-accounts.md). |
| **Invoices** | AR/AP invoices with amount, due date, counterparty, and status. | `Available` ✅ |
| **Reconciliation Status** | The reconciliation state of items across sources. | `Available` ✅ — see [Reconciliation](../04-reconciliation/overview.md). |
| **G/L Postings** | Accounting postings produced from transactions. | `Available` ✅ — see [G/L Postings](gl-postings-report.md). |
| **FX Contracts** | FX spot, forward, NDF, swap, and option deals with rate, notional, MtM, and status. | `In Preview` 👁️ |
| **Debt Contracts (Loans)** | Loans and credit lines with principal, outstanding, rate, maturity, IFRS 9 stage. | `In Preview` 👁️ |
| **Investment Contracts** | The investment portfolio (govies, corporates, money market, equities, funds) with book/market value, MtM, and yield. | `In Preview` 👁️ |
| **Debt Repayment (Amortization Schedule)** | Principal + interest repayment schedule, by loan and by entity. | `In Preview` 👁️ |
| **Customer Aging** | AR aging buckets (current, 30/60/90/120d+) by customer. | `In Preview` 👁️ |

> 👁️ The FX Contracts, Debt (Loans), and Investment blotters, the Debt Repayment (Amortization
> Schedule), and Customer Aging are in testing and available on request. The sections that
> describe them are written in future tense — they describe what those blotters *will* do. Related
> risk views (Mark-to-Market, FX Exposure, Credit Risk) live under
> [Risk Management](risk-management/) and are also in preview.

## Common blotter behaviors
Every blotter works the same way:

### Filter and search
1. Open the blotter from **Reporting › Operations**.
2. Use the **filter chips** at the top to narrow by subsidiary/company, currency, source, date,
   status, and other fields specific to that blotter.
3. Use the **search** box to find a record by reference, counterparty, ID, or name.

### Group and sort
1. Sort by clicking any **column header**.
2. Where available, **group** rows (e.g. by company or currency) to see subtotals.
3. Your view — filters, columns, sort, grouping — is remembered between visits.

### Open a record's detail
1. Click a **row** to open the **detail panel**.
2. Review all fields, the **source** it came from, and the **audit trail** (who/what touched it and
   when — ingestion, matching, approval, posting).

### Export
1. Click **Export**.
2. Choose **Excel** or **CSV**; the current, filtered view is downloaded.

## Each blotter's purpose
- **Transactions** — the day-to-day movements on your accounts; the base layer for cash position and
  reconciliation. See [Transactions](transactions.md).
- **Bank Accounts** — the "where is our liquidity" master list of accounts and live balances. See
  [Bank Accounts](bank-accounts.md).
- **Reconciliation Status** — a reporting view of what's reconciled, partially reconciled, or open.
- **G/L Postings** — the accounting postings produced from your transactions. See
  [G/L Postings](gl-postings-report.md).

The following blotters are **In Preview** 👁️ — the descriptions below are what they *will* do:

- **FX Contracts** — will list every FX deal and its mark-to-market, with the source (e.g. a **360T**
  trading venue vs a manual booking) clearly shown; will feed FX exposure and settlement forecasting.
- **Debt Contracts (Loans)** — will hold your borrowing and lending book: outstanding balances,
  rates, maturities, and credit stage; will feed repayment schedules and credit risk.
- **Investment Contracts** — will list the investment portfolio with valuations and yields; will feed
  mark-to-market and duration views.
- **Debt Repayment (Amortization Schedule)** — will show the forward calendar of principal and
  interest due.
- **Customer Aging** — will show how much your customers owe and how overdue it is.

## Tips & good practices
- Use the **source** pill to verify where a figure originated before you rely on it — a venue or API
  source is straight-through; a PDF/manual source may warrant a second look.
- Export a filtered blotter (rather than the whole grid) to hand a colleague exactly the slice they
  asked for.
- Open the **detail panel's audit trail** to answer "who changed this and when" without leaving the
  screen.

## Related
- [Transactions](transactions.md) · [Bank Accounts](bank-accounts.md) · [Bank Statements](bank-statements.md).
- [G/L Postings](gl-postings-report.md) — the accounting postings behind operations.
- [Reconciliation](../04-reconciliation/overview.md) — how items are matched.
- [Risk Management](risk-management/) — the risk dashboards built on this data.
- [Data Repository](../03-data/data-repository.md) — the original source files.

## In Preview
- 👁️ **Risk dashboards** built on these blotters (Mark-to-Market, FX Exposure, Credit Risk, IRRBB,
  ALM) — see your administrator.
- 👁️ **Position reporting** — a consolidated, deduplicated, lifecycle-tracked view of open positions
  across instruments (reconciled from multiple sources); scope to be confirmed.
