# Reporting — Overview

> **Where to find it:** Reporting
> **Who uses it:** treasurers, finance teams, FP&A, controllers, auditors, executives.
> **Permissions required:** each report respects the permissions of the data it shows; most cash
> reports need `CashManagement.CashPosition` · Read. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Reporting is where you read the numbers that run treasury. The data is already ingested,
normalized and reconciled, so a report is a live view of your position rather than a spreadsheet
you rebuild each morning.

Each report is its own screen in the **Reporting** menu, with its own controls. You open the one
you need, set its dates and filters, read it on screen, and export it if you want to take it with
you.

## How the menu is organized
The Reporting menu has an **Overview** column, which carries the **Cash & Liquidity** and
**Datalake (POC)** sub-headings, then **Operations** and **Risk Management**.

| Group | What's in it |
|---|---|
| **Cash & Liquidity** | [Balance Differential](balance-differential.md), [Category Positions](category-positions.md), [Cash Forecast](cash-forecast.md), [Actual vs Forecast](actual-vs-forecast.md) and [Scenarios (What-If)](scenarios-what-if.md). Your consolidated position itself is on [Home](../01-home/home-dashboard.md). |
| **Datalake (POC)** | [Cash position, Opening vs closing balance, Account statement and Cash flow](datalake-reports.md), plus its own report builder. Refreshed nightly, each account in its own currency. |
| **Operations** | [Transactions](transactions.md), [Bank Statements](bank-statements.md), [Invoices](../05-payments/invoices.md), [Reconciliation Status](../04-reconciliation/movements-and-flows.md), [Exchange Rates](exchange-rates.md), [Conciliation Reporting](../04-reconciliation/conciliation-reporting.md), [Fee Report](../04-reconciliation/fee-report.md), and the [operations blotters](operations-blotters.md). |
| **Risk Management** | Risk Cockpit, Mark-to-Market, FX Exposure, Credit Risk, IRRBB and ALM — see [Risk Management](risk-management/). |

## Key concepts
- **Display currency** — the single currency figures convert to on screen, so a group total is
  comparable across entities. Conversion uses your loaded [exchange rates](exchange-rates.md);
  the Datalake reports do not convert, and report each account in its own currency.
- **Drill-down** — expanding a total to see what makes it up, down to the individual transaction.
- **Entitlement** — a report only ever shows the companies and accounts you are entitled to see,
  so two people can run the same report and read different totals.

## Before you start
- Your data must already be flowing in through [Integrations](../02-integrations/overview.md) and,
  for the cleanest results, be [reconciled](../04-reconciliation/overview.md).
- Exchange rates must be loaded for any currency pair you want converted — see
  [Exchange Rates](exchange-rates.md).

## How to use it

### Run a report
1. Open **Reporting** and choose the report from its group in the menu.
2. Set the report's controls — typically a date or date range, a display currency, a grouping,
   and any company, account or currency filters.
3. Read the result on screen, expanding a total where the report supports drill-down.

### Export what you are looking at
1. Use the report's **Export** control.
2. The **current, filtered view** is what gets exported — set your filters before exporting, not
   after.

## Tips & good practices
- Set the **display currency** once so every figure converts consistently; it is what makes a group
  total meaningful to management.
- Reconcile first. A report is only as good as the data behind it, so clear reconciliation
  exceptions before relying on one for a decision.
- Know which cut you are quoting. The **Cash & Liquidity** reports are live and converted; the
  **Datalake** reports are refreshed nightly and never converted. They will not agree, and both are
  right — see [Datalake Reports](datalake-reports.md).

## Related
- [Home](../01-home/home-dashboard.md) — your consolidated cash position, day by day.
- [Balance Differential](balance-differential.md) · [Category Positions](category-positions.md) —
  the live cash reports.
- [Build Your Own Report](build-your-own.md) — define a report yourself: source, groupings,
  measures, filters, output and schedule.
- [Datalake Reports](datalake-reports.md) — the nightly cut, each account in its own currency.
- [Operations blotters](operations-blotters.md) — the operational grids.
- [Risk Management](risk-management/) — the risk dashboards.
- [Transactions](transactions.md) — the movement-level detail behind every total.
