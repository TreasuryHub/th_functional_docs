# Build Your Own Report

> **Availability:** `In Preview` 👁️
> **Where to find it:** the **Build Your Own** button on the **Reports gallery** (Reporting overview) — there is no standalone "Build Your Own Report" menu item. (A related **"Create Your Own"** builder for data exports lives under Settings › Data Exports.)
> **Who uses it:** treasurers, FP&A, finance teams, data owners — anyone who needs a report that isn't in the standard library.
> **Permissions required:** `CashManagement.CashPosition.ExportData` · Read; custom reports will only ever include data you're entitled to see. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

> 👁️ **In Preview.** This screen is in testing and available on request — contact Treasury Hub to enable it. This page describes how it works.

## Overview
Build Your Own Report will let you create custom reports without waiting on development. You will
choose the data, the dimensions to group by, the filters, and the layout, then save the report so you
can re-run it any time against fresh data — and schedule it for automatic delivery. Because it will
draw on the same governed data layer as the standard reports, a custom report will always respect
your permissions and show figures consistent with the rest of the platform.

The important difference from a raw data export: you will export the *finished report* — already
filtered, grouped, and formatted — not a pile of raw rows you have to assemble yourself.

## Key concepts
- **Data source** — the data a report draws on: core Treasury Hub data (balances, movements,
  transactions, FX/loans/investments, forecasts), imported data (CSV/Excel/PDF), ERP data, and, where
  configured, market data.
- **Dimension** — how you group and break down the report (by company, bank, currency, counterparty,
  tag, period, etc.).
- **Metric** — the value being measured (amount, count, balance, and so on).
- **Filter** — the conditions that limit what the report includes (date range, currency, status,
  entity…).
- **Saved report** — a report definition you keep, to re-run against current data.
- **Scheduled delivery** — a saved report set to generate and be emailed automatically on a cadence.
- **Template** — a pre-designed report you can clone as a starting point.

## Before you start
- The data you want will need to be available in the platform. Most arrives automatically through
  [Integrations](../02-integrations/overview.md); you can also add files via the
  [Data Hub](../03-data/data-hub.md).
- If a report needs data that isn't connected yet (for example a budget from a planning tool), that
  source needs to be added first — see *In Preview* below.

## How to use it
*The steps below describe the intended experience once this screen is live.*

### Build a report
1. Open **Reporting**, then click **Build Your Own** on the reports gallery.
2. (Optional) Start from a **template** in the gallery and clone it as your base.
3. Choose the **data** the report draws on.
4. Add the **dimensions** to group by (e.g. company, then currency) and the **metrics** to measure.
5. Apply **filters** (date range, currency, status, entity, tag).
6. Choose the layout — table and/or chart — and review the preview.

### Save and re-run
1. Click **Save** and give the report a clear name.
2. Re-open it any time from **My Reports** to run it against the latest data.

### Schedule delivery
1. Open your saved report and click **Schedule**.
2. Choose the **frequency** (daily / weekly / monthly), the **format** (PDF / Excel / CSV), and the
   **recipients**.
3. Save. The report is now generated and delivered automatically.

### Export
1. Click **Export** on any built report.
2. Choose **PDF**, **Excel**, or **CSV** to download the finished, formatted report.

## Tips & good practices
- Start from a **template** close to what you need and adjust — it's faster than building from a
  blank canvas.
- Name and save reports clearly so colleagues can find and reuse them instead of rebuilding.
- Schedule the reports people ask you for repeatedly (a weekly entity P&L, a monthly aging pack) so
  they arrive without a manual step.
- Keep filters tight — a focused report is easier to read and faster to generate than an everything
  dump.

## Related
- [Reporting — Overview](overview.md) — the gallery, standard reports, and scheduling.
- [Data Hub](../03-data/data-hub.md) and [Data Repository](../03-data/data-repository.md) — the data
  your reports draw on.
- [Data Exports](../03-data/data-exports.md) — pushing data to your own systems via API.
- [Agents](../09-agents/overview.md) — Elena (Reporting Agent) and Oliver (Data Governance & Lineage).

## In Preview
- 👁️ **Prompt-based building with Elena (AI)** — describe the report you want in plain English and
  have the reporting agent build it, ask clarifying questions, and detect data gaps.
- 👁️ **Automatic data-gap detection & assisted integration** — the builder flags missing data (e.g.
  "no statements from Bank X in 5 days", "8 of 10 entities included") and can enlist the Customer
  Success agent to connect a missing source.
- 👁️ **Report-as-API & embedding** — expose any saved report as a ready-made API endpoint (JSON / CSV
  / Excel) or embed it in external dashboards, so consumers get the finished report, not raw data.
  Scope and packaging to be confirmed by the Treasury Hub team — see
  your administrator.
