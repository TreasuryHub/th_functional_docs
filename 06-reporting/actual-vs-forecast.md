# Actual vs Forecast

> **Availability:** `In Preview` 👁️
> **Where to find it:** Reporting › Cash & Liquidity › Actual vs Forecast
> **Who uses it:** treasurers, cash managers, FP&A, finance controllers.
> **Permissions required:** `CashManagement.CashPosition` · Read (and `…ExportData` · Read to export). See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

> 👁️ **In Preview.** This screen is in testing and available on request — contact Treasury Hub to enable it. This page describes how it works.

## Overview
Actual vs Forecast will put what really happened next to what you projected, for each period, and
show the deviation between them. It is how you will measure the quality of your forecast, spot where
cash came in ahead of or behind plan, and drill in to understand why — so you can recalibrate the
next forecast with confidence.

## Key concepts
- **Actual (A)** — the settled figure for the period (from [Cash Position](cash-position.md)).
- **Forecast (F)** — the figure you had projected for that same period (from
  [Cash Forecast](cash-forecast.md)).
- **Variance (Var)** — the difference, shown as both an **absolute** amount and a **percentage**
  (Variance = Actual − Forecast).
- **Overlap period** — this report only covers dates where both an actual exists *and* a prior
  forecast existed, so there's something to compare.
- **Accuracy score** — the share of lines that landed within a tolerance (e.g. ±5%), giving you a
  single read on how good the forecast was.

## Reading the colours
Variance will be coloured from the treasurer's perspective — more cash is good, less cash is a
concern:

| Colour | Meaning |
|---|---|
| **Green** | Actual is better than forecast (e.g. more inflows, or fewer outflows than expected). |
| **Red** | Actual is worse than forecast (e.g. more outflows, or fewer inflows than expected). |
| **Grey** | Within tolerance (roughly zero, or under ~1%). |

## Before you start
- You will need both sides of the comparison: settled [actuals](cash-position.md) and a
  [forecast](cash-forecast.md) that existed for the same periods.
- Keep [Exchange Rates](exchange-rates.md) current so the comparison is consistent in your display
  currency.

## How to use it
*The steps below describe the intended experience once this screen is live.*

### Compare a period
1. Open **Reporting › Cash & Liquidity › Actual vs Forecast**.
2. Both **Actuals** and **Forecast** toggles are on for this report.
3. Set the **date range** to the periods you want to review, choose the **grouping** (Days / Weeks /
   Months) and the **display currency**.
4. For each date you'll see three sub-columns — **Actual**, **Forecast**, and **Variance** (absolute
   + %). The variance is colour-coded as above.

### Understand a deviation
1. Find a line with a large red or green variance.
2. Drill down through the account's **Inflows/Outflows by tag** to see which category drove the gap
   (for example, AR Collections that came in higher than forecast, or AP Payments that ran heavier).
3. Read the **variance summary** strip for the headline story — total variance, the largest
   over- and under-performance, and the overall **accuracy score**.

### Export or schedule
1. Click **Export** for **PDF**, **Excel**, or **CSV** of the current comparison.
2. Click **Schedule** to deliver the variance report automatically (e.g. a weekly recap to treasury).

## Tips & good practices
- Review variance on a regular cadence and feed the lessons back into your
  [forecast](cash-forecast.md) — persistent one-directional gaps usually mean an assumption needs
  adjusting.
- Focus on the largest absolute variances first; a big percentage on a tiny line rarely matters.
- Use the **accuracy score** trend over time as a simple KPI for how well your forecasting is
  improving.

## Related
- [Cash Forecast](cash-forecast.md) — where the projected side comes from.
- [Cash Position](cash-position.md) — where the actual side comes from.
- [Scenarios (What-If)](scenarios-what-if.md) — model alternative outcomes before they happen.

## In Preview
- 👁️ **Forecast-accuracy drift detection** — automatic monitoring that flags when your forecast
  accuracy is trending down and suggests which assumptions to revisit (in preview).
