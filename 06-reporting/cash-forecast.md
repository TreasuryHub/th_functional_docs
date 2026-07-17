# Cash Forecast

> **Availability:** `In Preview` 👁️
> **Where to find it:** Reporting › Cash & Liquidity › Cash Forecast
> **Who uses it:** treasurers, cash managers, FP&A, finance teams.
> **Permissions required:** `CashManagement.CashPosition` · Read (and `…ExportData` · Read to export). See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

> 👁️ **In Preview.** This screen is in testing and available on request — contact Treasury Hub to enable it. This page describes how it works.

## Overview
Cash Forecast will project your liquidity forward using the same hierarchy and drill-down as your
actuals. It will bring together scheduled and contractual cash flows already in the system, cash
flows you add manually, and cash flows fed from other systems, so you can see your expected position
from tomorrow's settlements out to next year's budget.

It is designed to help you spot funding gaps early, plan investments of surplus cash, and give the
business a forward view of where balances are heading — by entity, bank, and account, in the currency
of your choice.

## Key concepts
- **Forecast** — projected balances and movements for future dates. This report will show the
  forecast only (the **Actuals** toggle is off); to compare the two, use
  [Actual vs Forecast](actual-vs-forecast.md).
- **Scheduled** cash flow — a future flow already known to the system (a loan repayment on its
  calendar, an FX contract's settlement date, a coupon, payroll, tax).
- **Expected** cash flow — a projection you add manually as a treasurer (e.g. "Expected: customer
  invoice settlement Q2"). This is how you enrich the forecast with knowledge the system doesn't have.
- **External source** cash flow — a projection imported from another system (e.g. an ERP budget or
  planning tool).
- **Smart grouping** — near-term periods shown in days, then weeks, then months, so the immediate
  future is granular and the long horizon stays readable.
- **Horizon** — how far ahead the forecast runs (e.g. up to a 12-month horizon).

## Before you start
- The richer your source data, the better the forecast will be: keep
  [FX contracts](operations-blotters.md), [debt](operations-blotters.md), and
  [investments](operations-blotters.md) current, and make sure scheduled payments and collections are
  captured.
- Keep [Exchange Rates](exchange-rates.md) up to date for cross-currency projections.
- To add your own projections you will need write access to cash-flow data (Create/Edit).

## How to use it
*The steps below describe the intended experience once this screen is live.*

### View your forecast
1. Open **Reporting › Cash & Liquidity › Cash Forecast**.
2. Confirm the **Forecast** toggle is on (and **Actuals** is off).
3. Set the **date range** (From / To) and the **horizon**.
4. Choose **Smart** grouping (or Days / Weeks / Months), the **view** (Group / Company / Bank), and
   the **display currency**.
5. Expand any row through the hierarchy to reach an account, then expand a period to see projected
   **Opening Balance → Inflows/Outflows (by tag) → Net Flow → Closing Balance**. Individual future
   items carry a badge showing their origin — **Scheduled**, **Expected**, or **External Source**.

### Add an expected cash flow
1. Click **+ Create Expected Cashflow** in the header or control bar.
2. Enter the flow's details — the account, tag/category, amount, currency, and expected date, plus a
   description (e.g. "Expected: annual renewal").
3. Save. The item appears in the forecast marked **Expected**, and flows into the net position for
   its date.

### Export or schedule
1. Click **Export** to download the forecast as **PDF**, **Excel**, or **CSV**.
2. Click **Schedule** to deliver it automatically on a cadence to chosen recipients.

## Tips & good practices
- Use **Expected** items to capture what only you know (a delayed collection, a one-off outflow) —
  they immediately reshape the projected closing balance.
- Watch the near-term daily columns for the days a balance dips toward its operating minimum, and
  act before the shortfall lands.
- Keep scheduled data clean: because loan, FX, and investment calendars feed the forecast directly,
  a missing maturity or settlement date shows up as a gap in your projection.
- To sanity-check the forecast, switch to [Actual vs Forecast](actual-vs-forecast.md) periodically
  and review where actuals diverged.

## Related
- [Cash Position](cash-position.md) — the actuals this forecast projects forward from.
- [Actual vs Forecast](actual-vs-forecast.md) — measure forecast accuracy and variance.
- [Scenarios (What-If)](scenarios-what-if.md) — stress the forecast under different assumptions.
- [Operations blotters](operations-blotters.md) — the contracts and schedules that feed the forecast.

## In Preview
- 👁️ **Predictive / ML-assisted forecasting** — a probabilistic layer over the deterministic
  baseline (e.g. modeling how many days late a customer typically pays), continuous
  **recalibration** as real data arrives, and **accuracy tracking**. Present in the product vision;
  confirm current scope with the Treasury Hub team.
- 👁️ **Automatic transaction categorization** — hybrid rules + AI tagging of incoming movements
  (including your own prompt-defined categories) so actuals line up with the forecast by category.
- 👁️ **Liquidity alerts** — proactive warnings when a projected balance will breach a threshold.
