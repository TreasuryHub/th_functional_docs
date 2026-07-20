# Treasury Hub — User Documentation

Welcome to the Treasury Hub help center. These guides explain **what each part of the platform
does, how to use it, and how to configure it**, written for the people who use Treasury Hub every
day — treasurers, finance teams, and administrators.

> **New here? Start with [What is Treasury Hub?](00-getting-started/01-what-is-treasury-hub.md)**

## How this documentation is organized
The sections below mirror the platform's own navigation menu, so you can find the help for whatever
screen you're on. Every page shows an **availability badge** at the top:

- `Available` ✅ — live and generally available.
- `In Preview` 👁️ — being tested; **available on request** (contact Treasury Hub to enable it).

Separately, some modules belong to a **premium plan** (shown as **"Upgrade"** in the platform). That's
a plan/pricing tier only and says nothing about readiness.

## Getting started
- [What is Treasury Hub?](00-getting-started/01-what-is-treasury-hub.md)
- [Navigation & Your Workspace](00-getting-started/02-navigation-and-workspace.md)
- [Core Concepts](00-getting-started/03-core-concepts.md)
- [Roles & Permissions](00-getting-started/04-roles-and-permissions.md)

## The platform, module by module

### 1. Home
- [Home Dashboard](01-home/home-dashboard.md) — your real-time cash position and cockpit.
- [Roadmap](01-home/roadmap.md) — what's shipped, what's coming, and your treasury journey.

### 2. Integrations
- [Overview](02-integrations/overview.md)
- [SWIFT](02-integrations/swift.md) · [Open Banking](02-integrations/open-banking.md)
- [File Import (CSV/Excel/PDF)](02-integrations/file-import.md)
- [Email Ingestion](02-integrations/email-ingestion.md) · [SFTP Ingestion](02-integrations/sftp-ingestion.md) · [Ingestion Activity](02-integrations/ingestion-activity.md)
- [Third-party APIs](02-integrations/third-party-apis.md) · [Inbound APIs](02-integrations/inbound-apis.md)
- [NetSuite / ERP](02-integrations/netsuite-erp.md) · [Webhooks & Status](02-integrations/webhooks-and-status.md)

### 3. Data
- [Data Hub](03-data/data-hub.md) · [Data Export (API)](03-data/data-exports.md) · [Financial Events](03-data/financial-events.md) · [Data Repository](03-data/data-repository.md)

### 4. Reconciliation
- [Overview](04-reconciliation/overview.md)
- [Dashboard](04-reconciliation/dashboard.md) · [Flows (Reconciliation Status)](04-reconciliation/movements-and-flows.md)
- [Matching (1-to-1 & Batch)](04-reconciliation/matching.md) · [Rules & Criteria](04-reconciliation/rules-and-criteria.md)
- [Approvals](04-reconciliation/approvals.md) · [Workflows/Flows (Settings)](04-reconciliation/workflows.md) · [ERP Posting](04-reconciliation/erp-posting.md)

### 5. Payments
- [Overview (Payment Hub)](05-payments/overview.md) · [Payment Blotter](05-payments/payment-blotter.md)
- [Creating a Payment](05-payments/creating-a-payment.md) · [Approvals](05-payments/approvals.md) · [Invoices](05-payments/invoices.md)

### 6. Reporting
- [Overview](06-reporting/overview.md) · [Build Your Own](06-reporting/build-your-own.md)
- **Cash & Liquidity:** [Cash Position](06-reporting/cash-position.md) · [Cash Forecast](06-reporting/cash-forecast.md) · [Actual vs Forecast](06-reporting/actual-vs-forecast.md) · [Scenarios (What-If)](06-reporting/scenarios-what-if.md)
- **Operations:** [Operations Blotters](06-reporting/operations-blotters.md) · [Bank Accounts](06-reporting/bank-accounts.md) · [Bank Statements](06-reporting/bank-statements.md) · [Transactions](06-reporting/transactions.md) · [Exchange Rates](06-reporting/exchange-rates.md) · [G/L Postings](06-reporting/gl-postings-report.md)
- **Risk Management:** [Overview](06-reporting/risk-management/overview.md) · [Risk Cockpit](06-reporting/risk-management/risk-cockpit.md) · [Mark-to-Market](06-reporting/risk-management/mark-to-market.md) · [FX Risk](06-reporting/risk-management/fx-risk.md) · [Credit Risk](06-reporting/risk-management/credit-risk.md) · [Interest Rate Risk](06-reporting/risk-management/interest-rate-risk.md) · [ALM](06-reporting/risk-management/alm.md)
- **Regulatory & Compliance** *(In Preview — not a menu section; Audit sits under Summary):* [Reports](06-reporting/regulatory-compliance.md)

### 7. Workflows
- [Overview](07-workflows/overview.md) · [Workflow Builder](07-workflows/workflow-builder.md) · [Dashboard & Approvals](07-workflows/workflow-dashboard-and-approvals.md)

### 8. Alerts
- [Alerts](08-alerts/alerts.md)

### 9. Agents (AI)
- [Overview](09-agents/overview.md) · [Assistant](09-agents/assistant.md) · [Agent Dashboard](09-agents/agent-dashboard.md) · [Agent Builder](09-agents/agent-builder.md)

### 10. Admin Console
- [Overview](10-admin-console/overview.md) · [User & Agent Management](10-admin-console/user-and-agent-management.md) · [Roles & Groups](10-admin-console/roles-and-groups.md)
- [Companies & Groups](10-admin-console/companies-and-groups.md) · [Tags](10-admin-console/tags.md) · [Matching Rules](10-admin-console/matching-rules.md)
- [Access Tokens](10-admin-console/access-tokens.md) · [Master Data](10-admin-console/master-data.md)

### 11. Accounting (G/L & ERP)
- [G/L Postings](11-accounting/gl-postings.md) · [CoA & Rules Engine](11-accounting/coa-rules-engine.md) · [Journal Entries](11-accounting/journal-entries.md)
- [ERP Integration](11-accounting/erp-integration.md) · [Audit Trail](11-accounting/audit-trail.md)

### 12. Platform
- [Security & Compliance](12-platform/security-and-compliance.md) · [Preferences (theme & language)](12-platform/preferences.md)
- [White-label & Partners](12-platform/white-label-and-partners.md) · [Deployment, Availability & Continuity](12-platform/deployment-availability-and-continuity.md)

---

## For documentation editors
- `_meta/TEMPLATE.md` — the page template every doc follows.
- `_meta/WRITING-BRIEF.md` — the style/authoring rules.
- `_meta/SCREENSHOTS-NEEDED.md` — list of screenshots to capture from the live platform.
- `_meta/OPEN-QUESTIONS.md` — **consolidated list of items for the Treasury Hub team to confirm**
  (live-vs-in-preview statuses, agent naming, menu paths, permissions, packaging). Review this first.
- Availability statuses across the docs are marked **to be confirmed** by the Treasury Hub team —
  review before publishing to clients. *(The consolidated Feature Availability page is parked in
  `_drafts/feature-availability.md` for now.)*
