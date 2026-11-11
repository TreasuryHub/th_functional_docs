# Regulatory & Compliance Reports

> **Regulator-ready reports from data you already hold**
>
> **Why it matters**
> - **Nothing assembled by hand**: every action and every ingested item is already tracked and traceable.
> - **What auditors ask for**: a complete, searchable record of who did what in the platform.
> - **The prudential views too**: capital, liquidity and credit-quality reporting for a regulated institution.

> **Where to find it:** the **Audit** report sits in the Reporting menu (breadcrumb **Reporting ›
> Overview › Audit**); the prudential reports (capital, liquidity, credit quality) are listed in the
> reports library.
> **Who uses it:** compliance officers, risk teams, controllers, auditors, regulators.
> **Permissions required:** Reporting access · Read; the Audit Trail is typically granted to Auditor and Admin roles. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Answer a regulator from data you already hold: the Regulatory & Compliance area brings together the
reports auditors and regulators ask for — a
complete, searchable record of who did what in the platform, plus the prudential views a regulated
institution needs — capital, liquidity, and credit-quality reporting. Because every action and every
ingested item is already tracked and traceable to its source, these reports are generated from
data you already hold rather than assembled by hand.

## The reports

| Report | What it covers |
|---|---|
| **Audit Trail** | A time-stamped record of actions across the platform — who did what, when, and the outcome — with drill-down to the underlying record. |
| **Capital Requirements** | Regulatory capital views (e.g. capital adequacy / RWA reporting). |
| **Liquidity Requirements** | Regulatory liquidity metrics (e.g. LCR/NSFR-style liquidity coverage). |
| **Credit Quality & Asset Classification** | Credit-quality and asset-classification reporting (e.g. IFRS 9 staging, provisioning, NPL). |

## Key concepts
- **Audit trail** — the immutable, chronological log of actions and events; every reconciliation
  match, approval, posting, and configuration change is recorded with the user, time, and result.
- **Asset classification** — grouping credit exposures by quality/stage (for example IFRS 9 Stage 1
  performing, Stage 2 significant increase in credit risk, Stage 3 non-performing).
- **Prudential metrics** — the regulator-defined ratios for capital and liquidity a regulated firm
  must report.

## How to use it

### Use the Audit Trail
1. Open the **Audit** report from the Reporting menu (breadcrumb **Reporting › Overview › Audit**; see also [Audit Trail](../11-accounting/audit-trail.md)).
2. The log lists **Timestamp, User, Action, Resource, Details,** and **IP Address**. Sort by any
   column, and use the column filters on **User**, **Action**, and **Resource** to find the events you need.
3. Open an entry to see the full detail and drill through to the underlying record.
4. Click **Export** to produce a **PDF / Excel / CSV** record for auditors.

### Regulatory reports
The Capital, Liquidity, and Credit-Quality reports work like the other standard reports: choose
the reporting period and entity scope, review on screen, then export or schedule the output for your
compliance calendar.

## Tips to get more value
- Export the **Audit Trail** for the exact period and scope an auditor requests rather than
  granting them broad platform access.
- Use audit-trail filters to reconstruct a specific event end to end (from ingestion through
  approval and posting) when investigating a query.

## Where to go next
ℹ️ Regulatory reporting and [ALM](risk-management/alm.md) together make up the **ALM & Regulatory**
module: the filings and the balance sheet they are built on.

- [Risk Management](risk-management/) — the risk dashboards (Credit Risk, IRRBB, ALM) these
  regulatory views build on.
- [Operations blotters](operations-blotters.md) — the underlying debt, investment, and reconciliation
  records.
- [Platform — Audit](../12-platform/) — platform-wide audit and governance.
