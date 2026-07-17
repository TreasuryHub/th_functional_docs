# Screenshot Accuracy Findings (from live captures)

Verified each live screenshot against its doc. The **"Demo Tenant data" banner appears on most
screens because captures were taken in the TH Demo tenant — it is NOT a live/preview signal.** Live
vs preview is the menu's Active/Upgrade tag.

Below: exact UI facts per screen and the doc change required.

## ✅ Accurate (no change / trivial)
- **home-cash-position-dashboard** — Tabs: Cash Position (active), Cockpit/Performance/Setup (Upgrade → In Preview). Controls: From/To dates, **Convert To** (display currency), Currencies, Companies, Banks, Expand/Collapse/Select All, + Add Account, Upload Statement, Export, Print. Grid = balances by date columns, grouped Currency→Group→Country→Company→Bank→Account. (Doc is fine; ensure "Convert To" is named.)
- **reconciliation-dashboard** — Matches: Time Saved / Cost Savings / Auto Reconciliations / Avg Speed tiles; Fully/Partially/Unreconciled + Payins/Payouts Approved/Rejected tiles; Daily Reconciliation Volume area chart; Reconciliation by Type donut; Today/This Week/This Month.
- **reconciliation-movements-flows** — The **Flows** view at *Reporting › Operations › Reconciliation Status*. Columns: Flow ID, Workflow, Type, Partner, Amount, Tx Status, Recon Status, Progress (x/y), Date. Tabs All/Completed/Partial/Pending; filters All Types/Partners/Workflows; expandable flow chain.

## ✳️ Corrections required

### 04-reconciliation/matching.md — 1-to-1 is MANUAL
Real screen "Matching 1-to-1": tabs **Payin PSP / Payout PSP / Payin Bank / Payout Bank**; two panels (Internal vs PSP) each with search, checkbox rows (ID, Partner, Amount, Status, Date); center **Match** + **Clear selection**; **Matched Pairs (History)** with **Undo**. No AI/confidence here. → Rewrite as manual select-both-sides-and-Match; move AI-suggestion content to approvals.md.

### 04-reconciliation/approvals.md — this is where AI lives ("Reconciliation Requests")
Real screen "Reconciliation Requests": tiles High/Medium/Low **Confidence** + Total Suggestions; tabs All/High/Medium/Low; **Execute All**; **Columns**. Grid: select checkbox, **Confidence (High 98…)**, Left ID, Left Partner, Amount, →, Right ID, Right Partner, Amount, **Reasons** (chips: ID match, Exact amount, Same partner, Same currency, Date proximity), per-row **Approve/Reject**. → Enrich to match; this is the suggested-match approval queue (single + batch via Execute All / checkboxes).

### 04-reconciliation/erp-posting.md — preparing is live; ERP push is add-on
Real screen "ERP Posting": tiles Pending Batches / Pending Amount / Posted; tabs All/Pending/Posted; grouped by match type & date (e.g. "PSP Payin vs Internal"), rows erp-001 … with target ERP (e.g. FLEXCUBE), amount, Pending/Posted; **Select all/Deselect all**; **Confirm & Post (n) · amount**. Toast: *"ERP posting is available in the full version."* → Keep Available for preparing/reviewing/confirming batches, but note the actual push to the ERP requires the ERP-integration add-on (In Preview).

### 10-admin-console/matching-rules.md — single dialog, not a 3-step wizard
Live screen *Admin Console › Master Data › Matching Rules*: tabs **Active / Inactive / All**; **+ New Rule**, **Print**, **Columns**; grid cols Description, **Implementation** (PostingRule / TagAssignmentRule), …, Credit, Debit, **O.(rder)**, Active; row actions **edit / duplicate / delete**. **New Matching Rule** dialog fields: **Implementation*** (PostingRule / TagAssignmentRule), **Description***, **Company Group**, **Company**, **Institution**, **Account**, **Currency**, **Order**, **From Date**, **To Date** → **Create / Cancel**. → Rewrite: it's a single dialog; rule types are PostingRule (creates G/L postings) and TagAssignmentRule (auto-assigns tags), scoped by company/account/currency/date. Remove "scope→details→assignments wizard" and any "bulk upload" claim (not shown).

### 10-admin-console/user-and-agent-management.md AND roles-and-groups.md — the rich console is IN PREVIEW
The captured `admin-users-grid` and `admin-role-permission-matrix` are BOTH the **User & Agent Management** console = **Upgrade / In Preview** (body: "Contact Customer Support to roll out for your Organization"). Its tabs: **Users & Levels, Roles & Permissions, Agent Permissions, Integrations, Audit Trail & Compliance, Data Management, Rules & Thresholds, Security (SSO/MFA)**. It shows **Organization Levels L1/L2/L3 (Country/Hub/Group)**, a **27-role** list with a **"Can Approve?"** column (Admin, User Manager, Cash Manager, View Only, Book Keeper, Payment Preparer, Payment Approver, +20), and a user grid with **+ Invite User / Export**.
→ Reframe both pages: the **basic User Management is live** under *Admin Console › Master Data › User Management*; the **rich User & Agent Management console** (org levels, 27 roles, permission matrix, agent permissions, SSO/MFA, rules & thresholds) is **In Preview**. Mark the advanced console content `In Preview` 👁️; keep the two screenshots illustrating that In-Preview console. Do NOT present the L1/L2/L3 + 27-role model as the live per-module RBAC (the live model is the 5-level one in Getting Started › Roles & Permissions).

### 05-payments/payment-blotter.md — tabs & columns
Real "Payments" blotter: tabs **All / Pending / Approved / Sent / Rejected / Error** + **Failed Imports**; **+ New Payment**, **Print**, **Columns**. Columns: **Batch Reference, Account, Company, Institution, Amount, # (count), Status (PendingApproval/Error/Sent…), Origin (e.g. NetSuite), Approval (x/y), Created**; row **⋯**. → Fix tabs (remove Sending/Exceptions) and columns (no "corridor"; use the real columns). Note Approve/Reject is not on the blotter (Approvals screen is In Preview).

### 05-payments/creating-a-payment.md — single dialog, not multi-step
Real **New Payment** dialog fields: **Debtor Company*, Debtor Account*, Creditor Company*, Creditor Account*, Amount*, Currency*, Reference*** (no spaces), **Remittance Information** (optional), **Execution Date** → **Create / Cancel**. → Rewrite as a single dialog; remove "multi-step form / step progress indicator". Fix screenshot alt text too.

### 11-accounting/gl-postings.md AND 06-reporting/gl-postings-report.md — columns
Live *Reporting › Operations › G/L Posting* grid columns: **Booking Date, Company, Account, Debit Acct, Credit Acct, Amount, Matching Rule, Remittance Info, Status**; **Print**, **Columns**; read-only, sortable. → Align columns; note postings are generated by a **PostingRule** (the "Matching Rule" column links to it). No add/edit here.

### 03-data/data-hub.md — upload + repository cards; no Oliver panel shown
Live "Data Hub" (subtitle "Upload, explore and query your treasury data"): a **drop-files** zone (CSV / XLSX / PDF / TXT, **Browse files**) + a **DATA REPOSITORY** section of category cards (Bank Statements, FX Confirmations, Loan Agreements, Invoices, …, each with file count + last date); **Print**. No visible Oliver chat panel. → Adjust: file upload lives here (drag-drop CSV/XLSX/PDF/TXT); repository category cards; soften/remove the "Oliver panel on the right" (treat Oliver as roadmap/In Preview). Fix screenshot alt.

### 02-integrations/ingestion-activity.md — tiles, tabs, columns
Live "Ingestion Activity": **Last 30 days** tiles **Processed / Duplicates / Failed / Rows with errors**; tabs **Uploads / Activity**; filters All sources, All statuses, Search by file name, date range; grid cols **File, Source, Rule → Template, Rows, Status, Date**; **Print, Columns**. → Align.
