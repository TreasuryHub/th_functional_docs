# Open Questions — For the Treasury Hub Team to Confirm

This documentation was drafted from the product-thinking slides (the intended product) and the
webapp `docs/` (what's actually built). Where those disagreed, or where commercial packaging isn't
derivable from the code, we made a best-effort call and flagged it here. **Please review these
before publishing the help center to clients.** Items are grouped by theme; each notes the affected
pages.

## 1. Live vs. roadmap status  ✅ RESOLVED (definitive menu map applied)
The team provided screenshots of **every menu**, giving the exact **Active** (live) / **Upgrade**
(Active = live; Upgrade = In Preview) status of each item. This is captured in
[`_meta/LIVE-STATUS.md`](LIVE-STATUS.md) and applied throughout; the client-facing summary is
[`_drafts/feature-availability.md`](../_drafts/feature-availability.md).

Key outcomes / corrections made:
- **"Upgrade" = plan/tier label, not lifecycle.** The Reconciliation module is Upgrade **and** In Preview (per the team).
- **Data Export is LIVE** (Active) — corrected from an earlier wrong "In Preview".
- **Data Repository → In Preview**; **Financial Events → new live page added**; **Data Hub → live**.
- **Reports:** only Transactions, Bank Statements, Invoices, Reconciliation Status, G/L Postings,
  Exchange Rates are live; all others (Cash Position, Cash Forecast, Actual vs Forecast, Scenarios,
  FX/Debt/Investment blotters, Amortization, Customer Aging, G/L Lifecycle, all Risk) → In Preview.
- **Payments:** Blotter + creating payments + Invoices live; **Approvals, Lifecycle, Net Settlements → In Preview.**
- **Workflows & Alerts:** entirely In Preview. **Agents (incl. Assistant):** entirely In Preview.
- **Admin:** all Master Data live (incl. new **Custom Entities**); **combined User & Agent
  Management** and **Static Data** → In Preview.
- **Configuration:** Parsing Templates live; Workflow Builder, Reconciliation Flows/Criteria, custom
  export builder → In Preview.

Confirmed since:
- **File import** — CSV, Excel, and PDF (with OCR) are **all live** (via Parsing Templates). ✅
- **Open Banking** account linking — left as documented for now, per the team. ✅

Terminology note: not-live items are labeled **`In Preview` 👁️** throughout (they're visible in the
platform as previews, shown "Upgrade"), replacing the earlier "Coming soon".

## 2. AI agents — naming & availability  ✅ RESOLVED (roster confirmed)
The canonical 16-agent roster was confirmed from the platform's **Switch Agent** panel and applied
throughout the docs (see [`_meta/AGENT-ROSTER.md`](AGENT-ROSTER.md) and
[`09-agents/overview.md`](../09-agents/overview.md)): **Alex** (Customer Success), **Sophia**
(Reconciliation), **Mateo** (Confirmation Matcher), **Lucas** (Journal Entry Generator), **Olivia**
(Market Data & Reporting), **Nadia** (FX Risk & Hedging), **Isabella** (Credit Risk Monitor),
**Noah** (Cash Management), **Carter** (Workflow Designer), **Elena** (Reporting Agent), **Ethan**
(Payment Processor), **Ava** (AML & Compliance), **Liam** (Interest Rate Risk), **Mia** (ALM &
Liquidity), **Ona** (Admin & Personal Coach), **Oliver** (Data Governance & Lineage). The risk pages
were corrected (they had wrongly used Sophia as the risk advisor).

Remaining to confirm:
- **Availability per agent** — we mark all conversational agents `In Preview` 👁️ except Sophia's
  AI-assisted *matching* (part of the In-Preview Reconciliation module) and the in-app Assistant. Confirm
  which, if any, other agents are already live.
- Should **Agent Approvals** be its own page? (currently a section in `09-agents/agent-builder.md`)

## 3. Alerts
- The webapp shows **only reconciliation alerts** wired to a real (read-only) backend — no
  Resolve/Dismiss/bulk actions, no RACI routing, no cross-module coverage yet. We wrote those as
  "In Preview." Confirm current state and whether any write actions have shipped. (`08-alerts/alerts.md`)

## 4. Payments & corridors
- Which payment **rails/corridors** are actually live? Slides mention SWIFT, SEPA, PIX, SPEI,
  NIBSS, etc.; we named only SWIFT/SEPA concretely. (`05-payments/overview.md`)
- **Packaging** of SWIFT/SEPA dispatch, sanctions/AML screening, and NetSuite AP integration
  (marked `Add-on`). Confirm.

## 5. Integrations
- **File import:** CSV confirmed live; Excel/PDF+OCR marked confirm-scope. (`02-integrations/file-import.md`)
- **Open Banking:** grounded on **Nordigen** (per the build); other aggregators from the slides
  (Plaid/Yapily/Belvo/Salt Edge) were dropped. Confirm. (`02-integrations/open-banking.md`)
- **SWIFT:** marked enterprise add-on; broader message types noted as enterprise scope. Confirm.
- **ERP adapters** beyond NetSuite (SAP/Oracle/Dynamics/Sage) — described as "varies by plan." (`11-accounting/erp-integration.md`)

## 6. Menu paths / navigation
Several screens have no dedicated sidebar item in the source; confirm where they actually live:
- SWIFT / Open Banking / NetSuite → placed under **Integrations › Services**.
- **G/L Postings** → documented under Reporting/Transactions (route `/transactions-posting`).
- **Journal Entries** (roadmap) → placed under Reporting › Accounting.
- **Admin Console** grouping — nav doc vs. UC-031 differ on whether Users/Roles sit under
  "User & Agent Management" or under "Master Data." We followed the nav doc.

## 7. Permissions
The permission model documents these modules: `CashManagement.*`, `CoreData.*`,
`AdminAndSettings.UserManagement`. Several areas have **no documented permission module** yet — we
used soft phrasing ("… access — see Roles & Permissions"). Please assign/confirm modules + minimum
levels for: **Integrations, Data, Workflows, Alerts, Reporting/Risk Management**, and clarify
whether **Roles** has its own module (`AdminAndSettings.Roles` appears in UC-031 vs.
`AdminAndSettings.UserManagement` elsewhere). Also confirm the client-facing labels for the
`Reconciliation.*` namespace. (all sections)

## 8. Roadmap target quarters
Used from the roadmap: **Workflow Builder ~Q2 2026**, **Scenarios/What-If ~Q4 2026**, **Risk
Management ~Q3 2026** (applied to all five risk dimensions — confirm per-dimension dates). (`07-workflows/*`, `06-reporting/scenarios-what-if.md`, `06-reporting/risk-management/*`)

## 9. Platform / security
- **Compliance certifications** (ISO 27001, SOC 2 Type II, GDPR, Ghana DPA): which are formally
  *certified* vs *aligned*, with current validity? (`12-platform/security-and-compliance.md`)
- **SSO/MFA** (Azure AD / Okta / Google) — stated as supported per the roles source but not in the
  availability matrix. Confirm. (`10-admin-console/user-and-agent-management.md`, `12-platform/security-and-compliance.md`)
- **Supported languages** — brief/nav say EN/ES, but webapp UC-028 lists EN/FR/DE/ES. We
  documented **EN/ES**. Confirm the shipped set. (`12-platform/preferences.md`, `00-getting-started/02-navigation-and-workspace.md`)
- **Deployment models** (SaaS/on-prem/hybrid), SLAs, RPO/RTO — presented as illustrative/"defined
  in contract." Confirm. (`12-platform/deployment-availability-and-continuity.md`)

## 10. Reconciliation specifics
- Are the **treasury-specific workflows** (FX / Loan / Investment) actually seeded, or only the 3
  base workflows (PSP & Bank, Invoice, Bank-to-Bank) + cross-border? We described the former as
  "supported patterns." (`04-reconciliation/workflows.md`)
- Final **menu naming** for the recon sub-nav (internal names like "Recon Request" map to both AI
  suggestions and approval requests). (`04-reconciliation/*`)

## 11. White-label & data exports
- **White-label self-service portal & Brand Kit API** — enabled per engagement? (`12-platform/white-label-and-partners.md`)
- **Data Exports** commercial model (tiers, rate limits, External-ID/Internal-ID, ~7-day trial) —
  slides note pricing is "pending"; presented as indicative. (`03-data/data-exports.md`)

---

### Notes on how illustrative data was handled
All demo figures (KPIs, run counts, balances) and demo entities (Global Banking Group, BBVA,
Stripe, etc.) were treated as **examples**, not documented as the client's own data.
