# Pages describing demo screens — pending a group decision

Internal tracking. These pages document screens whose data is demo content rather than the live
platform. **They are written as live and carry no flag**, by decision — this file is the record, not
a marker in the docs.

Review them as a group. The options are the ones already on the table: leave as-is, delete, or
reframe the page around the capability rather than the screen.

Last reviewed: 2026-11-02.

## Reporting — Risk Management (7 pages, 677 lines)
The whole **Reporting › Risk Management** group is demo. It is a menu group, not a screen, which is
why there is a section overview with no screen of its own.

| Page | Screen |
|---|---|
| [`06-reporting/risk-management/overview.md`](../06-reporting/risk-management/overview.md) | the group itself |
| [`risk-cockpit.md`](../06-reporting/risk-management/risk-cockpit.md) | Risk Cockpit |
| [`mark-to-market.md`](../06-reporting/risk-management/mark-to-market.md) | MtM Portfolio |
| [`fx-risk.md`](../06-reporting/risk-management/fx-risk.md) | FX Exposure |
| [`credit-risk.md`](../06-reporting/risk-management/credit-risk.md) | Credit Risk by Stage |
| [`interest-rate-risk.md`](../06-reporting/risk-management/interest-rate-risk.md) | IRRBB |
| [`alm.md`](../06-reporting/risk-management/alm.md) | ALM Gap |

## Reporting — Cash & Liquidity (3 pages, 217 lines)

| Page | Screen |
|---|---|
| [`cash-forecast.md`](../06-reporting/cash-forecast.md) | Cash Forecast |
| [`actual-vs-forecast.md`](../06-reporting/actual-vs-forecast.md) | Actual vs Forecast |
| [`scenarios-what-if.md`](../06-reporting/scenarios-what-if.md) | Scenarios (What-If) |

## Reporting — other, plus Accounting (3 pages, 281 lines)

| Page | Screen |
|---|---|
| [`operations-blotters.md`](../06-reporting/operations-blotters.md) | FX Contracts, Loans, Investments, Debt Repayment, Customer Aging. Transactions, Bank Statements, Invoices, Reconciliation Status and Exchange Rates in the same group are live. |
| [`regulatory-compliance.md`](../06-reporting/regulatory-compliance.md) | Audit (`/reporting/audit-trail`) |
| [`11-accounting/audit-trail.md`](../11-accounting/audit-trail.md) | The same `/reporting/audit-trail` screen. Added 2026-11-02 — missed in the first pass. Distinct in scope from the live **Admin Console › Users & Roles › Audit Trail**, which records user and role changes only. |

## Elsewhere (3 pages, 188 lines)

| Page | Screen |
|---|---|
| [`08-alerts/alerts.md`](../08-alerts/alerts.md) | all 11 Alerts screens |
| [`02-integrations/webhooks-and-status.md`](../02-integrations/webhooks-and-status.md) | Webhooks, Status |
| [`02-integrations/third-party-apis.md`](../02-integrations/third-party-apis.md) | API Agent Integrator |

## Hidden rather than deleted

| Page | Note |
|---|---|
| [`11-accounting/erp-integration.md`](../11-accounting/erp-integration.md) | Out of the README index and the preview build; the file is kept. |
| [`03-data/data-hub.md`](../03-data/data-hub.md) | Hidden 2026-11-02. **Data Hub is treated as demo** by decision, although `nav-config.ts` marks it `active`. Superseded by **Integrations › Ingestion** — see below. |
| [`03-data/data-repository.md`](../03-data/data-repository.md) | Hidden 2026-11-02. Same reason. |

[`04-reconciliation/erp-posting.md`](../04-reconciliation/erp-posting.md) was unhidden on 2026-11-02 and is an ordinary TBD again: back in the README index, the preview build and its inbound links.
 Its link to the still-hidden `erp-integration.md` was removed.

## Written from the POC: Build Your Own Report
[`06-reporting/build-your-own.md`](../06-reporting/build-your-own.md) was rewritten on 2026-11-02
entirely from the Report Builder POC in
[`assets/ReportBuilder-2026-10-14/`](../assets/ReportBuilder-2026-10-14/ReportBuilder/doc/README.md),
which is the reference for this module. The shipped `/reporting/builder` screen is still demo, and
the page describes the POC's behaviour, not that screen.

`06-reporting/datalake-report-builder.md` was **deleted** on 2026-11-02: the datalake's own
builder (`/reporting/datalake/report-builder`) is live but will be replaced by this module, so
only the POC version is documented. That live screen therefore has no page of its own until the
replacement lands. The other datalake reports keep theirs in
[`datalake-reports.md`](../06-reporting/datalake-reports.md).

Sources used: `doc/02-funcionalidades.md`, the POC `README.md`, `src/studio/spec.ts` (the editor's
sources, groupings, measures and quick starts) and `src/engine/` (grain resolution, joins,
formulas). **Not** used: `doc/05-definiciones-po-ceo.md`, whose PII policy, retention, currency and
permission rules are proposals still marked pending validation — nothing from it is stated as
platform behaviour. If those are signed off they will need their own pass, particularly the
`reporting.pii.financial` and `reporting.pii.personal` permissions and the masking rules for
exports and scheduled sends.

## Why the Data Hub and Data Repository were withdrawn
Both were demo screens, and what they were meant to do is covered by **Integrations › Ingestion**,
which does it for real.

| What the Data pages claimed | On Ingestion |
|---|---|
| Data Hub: drop-files upload zone | **Upload file** opens a multi-file dropzone (CSV, TXT, Excel, PDF) that feeds the real ingest pipeline. |
| Data Repository: file list with Origin | The grid's **Source** column — manual, email or SFTP — which is more precise than Manual/Autogenerated. |
| Data Repository: Status (Success/Processing/Failed) | The grid's **Status** column, plus the Last-30-days tiles and the parked/failed outcomes. |
| Data Repository: Imported On / Processed On | The grid's **Date** column. |
| Data Repository: download the original file | A real row action, `GET /ingestion-uploads/{uuid}/download`. On the Data Repository the download button was a `demoToast`. |
| Data Hub: category cards (Bank Statements, FX Confirmations, …) | **Not carried over.** The categories were a hardcoded fixture and the cards opened nothing. |

The only loss is the category grouping, which was never real. [`02-integrations/ingestion-activity.md`](../02-integrations/ingestion-activity.md)
now carries an explicit **Upload a file** procedure, since it is the only documented way in.

## Removed from the navigation reference
The demo **Workflow Builder** (Settings › Workflows, `/workflows/builder`) is out of [`02-navigation-and-workspace.md`](../00-getting-started/02-navigation-and-workspace.md), and the Settings section now reads as three groups. It is a different screen from the real **Workflow Studio**, which is reached from Reconciliation Flows and documented in [`04-reconciliation/workflows.md`](../04-reconciliation/workflows.md).

The `Workflows.Builder` permission row now reads **"Building reconciliation flows"** and links to [`04-reconciliation/workflows.md`](../04-reconciliation/workflows.md), rather than naming the hidden demo screen. Note that nothing enforces it today — see finding 18 in the product-issues log. It stays in the catalogue on [`04-roles-and-permissions.md`](../00-getting-started/04-roles-and-permissions.md): it is a real, grantable permission that an administrator sees in the role matrix, so leaving it out would make the catalogue wrong. The same holds for `Workflows.View`, `Workflows.Approvals`, `Alerts.Manage` and the three `Agents.*` modules, whose screens are also demo.

## Resolved: the Data Hub drop zone is fully superseded
The Ingestion upload panel does everything the Data Hub's `DataIngestDialog` did, per file rather
than per upload, and adds the route the old dialog had no answer for.

| Data Hub dialog | Ingestion upload panel |
|---|---|
| One file, one template | Many files, **each row set up on its own**, with **Apply to similar files** to copy a row's choices |
| Pick a template from the ones that match | Same, plus **Create a new template with AI** as the last option in the list |
| No answer when nothing matched — the file was stuck | The AI option is offered exactly there, and the row says so |
| Account, country, fallback currency, status | Account and currency, asked once the template says what the file loads |
| Preview against the chosen template, then queue | The AI draft opens in the **template editor with the parsed file beside it**, every field marked, editable before anything is created |
| Loads data only | **Save template and load file** publishes the template *and* loads the data |

So the old flow could only load a format somebody had already mapped; this one turns an unmapped
file into a reusable template and loaded data in one reviewed step. Nothing further is needed, and
the Data Hub stays out of the docs.

## Excluded from the docs entirely
Screens gated to the `infra` tenant: Cashflow Daily, Cashflow Forecast, Interest Payments,
Dividends, Investment Risk, and the Operations `Investments` entry. None has a page, and they have
been removed from the navigation reference.

## Related
- [`SCREENSHOTS-NEEDED.md`](SCREENSHOTS-NEEDED.md) — section E lists the images that correctly show
  these demo screens.
