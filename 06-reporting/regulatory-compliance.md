# Regulatory & Compliance Reports

> **Availability:** `In Preview` 👁️
> **Where to find it:** Reporting › Regulatory & Compliance
> **Who uses it:** compliance officers, risk teams, controllers, auditors, regulators.
> **Permissions required:** to be confirmed per report; the Audit Trail will typically be available to Auditor/Admin roles. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

> 👁️ **In Preview.** This screen is in testing and available on request — contact Treasury Hub to enable it. This page describes how it works.

## Overview
The Regulatory & Compliance area will bring together the reports auditors and regulators ask for: a
complete, searchable record of who did what in the platform, plus the prudential views a regulated
institution needs — capital, liquidity, and credit-quality reporting. Because every action and every
ingested item is already tracked and traceable to its source, these reports will be generated from
data you already hold rather than assembled by hand.

## The reports

| Report | What it covers | Status |
|---|---|---|
| **Audit Trail** | A time-stamped record of actions across the platform — who did what, when, and the outcome — with drill-down to the underlying record. | `In Preview` 👁️ |
| **Capital Requirements** | Regulatory capital views (e.g. capital adequacy / RWA reporting). | `In Preview` 👁️ |
| **Liquidity Requirements** | Regulatory liquidity metrics (e.g. LCR/NSFR-style liquidity coverage). | `In Preview` 👁️ |
| **Credit Quality & Asset Classification** | Credit-quality and asset-classification reporting (e.g. IFRS 9 staging, provisioning, NPL). | `In Preview` 👁️ |

## Key concepts
- **Audit trail** — the immutable, chronological log of actions and events; every reconciliation
  match, approval, posting, and configuration change is recorded with the user, time, and result.
- **Asset classification** — grouping credit exposures by quality/stage (for example IFRS 9 Stage 1
  performing, Stage 2 significant increase in credit risk, Stage 3 non-performing).
- **Prudential metrics** — the regulator-defined ratios for capital and liquidity a regulated firm
  must report.

## How to use it
*The steps below describe the intended experience once this screen is live.*

### Use the Audit Trail
1. Open **Reporting › Regulatory & Compliance › Audit Trail**.
2. Filter by **user**, **module**, **date range**, and **action** to find the events you need.
3. Open an entry to see the full detail and drill through to the underlying record.
4. Click **Export** to produce a **PDF / Excel / CSV** record for auditors.

### Regulatory reports
The Capital, Liquidity, and Credit-Quality reports will work like the other standard reports: choose
the reporting period and entity scope, review on screen, then export or schedule the output for your
compliance calendar.

## Tips & good practices
- When it is live, export the **Audit Trail** for the exact period and scope an auditor requests
  rather than granting them broad platform access.
- Use audit-trail filters to reconstruct a specific event end to end (from ingestion through
  approval and posting) when investigating a query.

## Related
- [Risk Management](risk-management/) — the risk dashboards (Credit Risk, IRRBB, ALM) these
  regulatory views build on.
- [Operations blotters](operations-blotters.md) — the underlying debt, investment, and reconciliation
  records.
- [Platform — Audit](../12-platform/) — platform-wide audit and governance.

## In Preview
- 👁️ **Audit Trail** — the searchable, time-stamped record of platform actions.
- 👁️ **Capital Requirements** report — regulatory capital / RWA reporting.
- 👁️ **Liquidity Requirements** report — regulatory liquidity coverage reporting.
- 👁️ **Credit Quality & Asset Classification** report — staging, provisioning, and NPL reporting.
