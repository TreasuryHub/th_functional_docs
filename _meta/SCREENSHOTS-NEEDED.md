# Screenshots — Capture Checklist

✅ **All 26 referenced screenshots are captured and in `assets/screenshots/`** (15 live + 9 in-preview
+ 2 nav-chrome). `python _meta/check_screenshots.py` reports 26/26, no missing/orphans. Kept below as
a reference for what each shows / for recapturing later.

## How to capture (please read once)
- **Use the demo tenant** (e.g. "TH Demo" / GBG) so no real client data is shown.
- **Switch the platform to English** (top-bar language toggle) so screenshots match these English docs.
- **Pick one theme and stay consistent** — light theme is recommended for legibility in the docs.
- **Consistent width** — capture the browser around ~1400px wide; crop to the relevant panel/screen,
  not the whole OS window.
- **Format & name** — save as **PNG** with the exact filename shown. Lowercase, hyphenated.
- **In-Preview screens** are visible in the platform as previews (shown "Upgrade") — you can still
  capture them; they'll show preview/sample data. Prioritize the **Live** ones if you want a
  truthful current-state help center first.

After adding files, run `python _meta/build_preview.py` and refresh `preview.html`. Check progress
any time with `python _meta/check_screenshots.py`.

## Live screens (capture these first — 15)

| Filename (`assets/screenshots/…`) | Page | What to capture |
|---|---|---|
| `home-cash-position-dashboard.png` | Home | Cash position dashboard: balance widgets, grouping tabs (currency/company/country), timeline chart. |
| `ingestion-activity-monitor.png` | Integrations › Ingestion Activity | The activity list: source, time, and status for recent ingestion events. |
| `data-hub-overview.png` | Data › Data Hub | The drop-files upload zone (CSV/XLSX/PDF/TXT) and the Data Repository category cards (Bank Statements, FX Confirmations, Loan Agreements, Invoices…). |
| `reconciliation-dashboard.png` | Reconciliation › Dashboard | KPI tiles, savings band, daily volume chart, and the by-type donut. |
| `reconciliation-movements-flows.png` | Reconciliation › Status | Movements list beside the Flows view, with one flow chain expanded. |
| `reconciliation-matching.png` | Reconciliation › 1-to-1 Matching | Manual 1-to-1 matching: Internal and PSP/Bank panels with checkbox rows (ID, Partner, Amount, Status, Date), the center Match / Clear selection controls, and the Matched Pairs (History) list. No AI suggestions on this screen. |
| `reconciliation-approvals.png` | Reconciliation › Reconciliation Approvals (screen titled "Reconciliation Requests") | Confidence tiles (High/Medium/Low) + Total; All/High/Medium/Low tabs and Execute All; grid of suggested matches with confidence scores, left/right items, Reasons chips, and per-row Approve/Reject. |
| `reconciliation-erp-posting.png` | Reconciliation › ERP Posting | The posting screen: Pending Batches / Pending Amount / Posted tiles, batches grouped by match type & date, Select all, and the Confirm & Post footer. |
| `payment-blotter.png` | Payments › Payment Blotter | Status tabs, the payment list, and a payment's detail panel. |
| `create-payment-form.png` | Payments › Payment Blotter → **+ New Payment** | The single **New Payment** dialog (Debtor/Creditor Company+Account, Amount, Currency, Reference, Remittance, Execution Date). Open it from the blotter. |
| `invoices-grid.png` | **Reporting › Operations › Invoices** | The invoices blotter: columns (Invoice #, Payee, Status, Amount, Uploaded, Invoice/Due Date) and the New Invoice / Print / Columns actions. |
| `gl-postings-grid.png` | Reporting › Operations › G/L Posting | Postings grid: Booking Date, Company, Account, Debit Acct, Credit Acct, Amount, Matching Rule, Remittance Info, Status. |
| `admin-users-grid.png` | Admin › User & Agent Management console (**In Preview**) | The In-Preview console user grid: roles, status columns, **+ Invite User** and **Export**. Capture as a preview (shown "Upgrade"). |
| `admin-role-permission-matrix.png` | Admin › User & Agent Management console › Roles & Permissions (**In Preview**) | The In-Preview console's Roles & Permissions view (org levels L1/L2/L3, the 27-role catalog with the "Can Approve?" column). Capture as a preview. |
| `admin-matching-rules.png` | Admin › Master Data › Matching Rules | The Matching Rules grid (Active/Inactive/All tabs; Description, Implementation, Credit, Debit, Order, Active columns) with the **New Matching Rule** dialog open. |

## In-Preview screens (optional / capture as previews — 9)

| Filename (`assets/screenshots/…`) | Page | What to capture |
|---|---|---|
| `integrations-services-catalog.png` | Integrations › Services | Connector catalog grouped by category with Active/Upgrade badges. |
| `integration-status-board.png` | Integrations › Status | Status board: each connection with status, last sync, uptime, Logs link. |
| `data-repository-grid.png` | Data › Data Repository | The repository grid with category tabs and per-row download. |
| `reconciliation-rules-criteria.png` | Configuration › Reconciliation Criteria | Rules table with a rule's match criteria expanded. |
| `reconciliation-workflows.png` | Configuration › Reconciliation Flows | Workflows list with a workflow's step chain shown. |
| `payment-approvals.png` | Payments › Approvals | Pending inbox on the left, payment detail + approval chain on the right. |
| `cash-position-drilldown.png` | Reports › Cash Position | Currency hierarchy expanded down to account inflows/outflows by tag. |
| `reporting-gallery.png` | Reports (overview) | Reports gallery: featured cards, categorized library, scheduled-reports strip. |
| `audit-trail-timeline.png` | Reporting › Overview › Audit Trail | The audit log grid: Timestamp, User, Action, Resource, Details, IP Address (with column filters). |

## Optional — navigation chrome (nice to have)
| Filename | Page | What to capture |
|---|---|---|
| `sidebar-main-menu.png` | Getting Started › Navigation | Full left sidebar expanded (you already shared a partial). |
| `top-bar.png` | Getting Started › Navigation | Top bar: search, Open Assistant, language, theme, tenant, avatar. |

> ✅ The two nav-chrome shots are now placed in `00-getting-started/02-navigation-and-workspace.md`.
