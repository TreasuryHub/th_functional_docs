# TreasuryHub — User Documentation

> **New here? Start with [What is TreasuryHub?](00-getting-started/01-what-is-treasury-hub.md)**

Welcome to the TreasuryHub help center. These guides explain **what each part of the platform
does, how to use it, and how to configure it**, written for the people who use TreasuryHub every
day — treasurers, finance teams, and administrators.

> **New here? Start with [What is TreasuryHub?](00-getting-started/01-what-is-treasury-hub.md)**

## How this documentation is organized
The sections below mirror the platform's own navigation menu, so you can find the help for whatever
screen you're on.

## Getting started
- [What is TreasuryHub?](00-getting-started/01-what-is-treasury-hub.md)
- [Navigation & Your Workspace](00-getting-started/02-navigation-and-workspace.md)
- [Core Concepts](00-getting-started/03-core-concepts.md)
- [Roles & Permissions](00-getting-started/04-roles-and-permissions.md)

## The platform, module by module

### 1. Home
- [Home Dashboard](01-home/home-dashboard.md) — your real-time cash position, day by day, and your cockpit.
- [Status Board](01-home/status-board.md) — your implementation progress, open tickets, and what's next.

### 2. Integrations
- [Overview](02-integrations/overview.md)
- [File Import (CSV/Excel/PDF)](02-integrations/file-import.md) — what a file has to do to get in.
- [Parse Templates](02-integrations/parsing-templates.md) — how a format is taught, with the AI assistant.
- [PDF Statements](02-integrations/pdf-statements.md) — how a PDF is read, and its balance checks.
- [Ingestion](02-integrations/ingestion-activity.md) — upload a file and follow everything that arrives.
- [AI Extraction](02-integrations/ai-extraction.md) — the fallback when no template reads a file.
- **Channels:** [Email Ingestion](02-integrations/email-ingestion.md) · [SFTP Ingestion](02-integrations/sftp-ingestion.md) · [Open Banking](02-integrations/open-banking.md) · [SWIFT](02-integrations/swift.md)
- **APIs:** [Inbound APIs](02-integrations/inbound-apis.md) · [Third-party APIs](02-integrations/third-party-apis.md) · [NetSuite / ERP](02-integrations/netsuite-erp.md) · [Webhooks & Status](02-integrations/webhooks-and-status.md)
- [Transaction Tagging](02-integrations/transaction-tagging.md) — categories, tags, classification rules and conflicts.

### 3. Data
- [Data Export (API)](03-data/data-exports.md) · [Financial Events](03-data/financial-events.md)

### 4. Reconciliation
- [Overview](04-reconciliation/overview.md)
- [Workflows/Flows (Settings)](04-reconciliation/workflows.md) — the container, built in the Workflow Studio.
- [Rules & Criteria](04-reconciliation/rules-and-criteria.md) — the chains and rules inside one.
- [Flows (Reconciliation Status)](04-reconciliation/movements-and-flows.md) · [Matching (1-to-1 & Batch)](04-reconciliation/matching.md) · [Approvals](04-reconciliation/approvals.md)
- [Conciliations](04-reconciliation/conciliations.md) · [Dashboard](04-reconciliation/dashboard.md)
- **Reporting:** [Conciliation Reporting](04-reconciliation/conciliation-reporting.md) — what was reconciled and what is still open, week by week. · [Fee Report](04-reconciliation/fee-report.md) — what each payment provider should charge per contract.
- [ERP Posting](04-reconciliation/erp-posting.md)

### 5. Payments
- [Overview (Payment Hub)](05-payments/overview.md)
- [Creating a Payment](05-payments/creating-a-payment.md) · [Payment Blotter](05-payments/payment-blotter.md)
- [Approvals](05-payments/approvals.md) · [Invoices](05-payments/invoices.md)

### 6. Reporting
- [Overview](06-reporting/overview.md) · [Build Your Own](06-reporting/build-your-own.md)
- [Balance Differential](06-reporting/balance-differential.md) — balances at two dates and the difference.
- [Category Positions](06-reporting/category-positions.md) — net movement by nature, category and tag.
- **Datalake:** [Datalake Reports](06-reporting/datalake-reports.md)
- **Cash & Liquidity:** [Cash Forecast](06-reporting/cash-forecast.md) · [Actual vs Forecast](06-reporting/actual-vs-forecast.md) · [Scenarios (What-If)](06-reporting/scenarios-what-if.md)
- **Operations:** [Operations Blotters](06-reporting/operations-blotters.md) · [Bank Accounts](06-reporting/bank-accounts.md) · [Bank Statements](06-reporting/bank-statements.md) · [Transactions](06-reporting/transactions.md) · [Exchange Rates](06-reporting/exchange-rates.md) · [G/L Postings](06-reporting/gl-postings-report.md)
- **Risk Management:** [Overview](06-reporting/risk-management/overview.md) · [Risk Cockpit](06-reporting/risk-management/risk-cockpit.md) · [Mark-to-Market](06-reporting/risk-management/mark-to-market.md) · [FX Risk](06-reporting/risk-management/fx-risk.md) · [Credit Risk](06-reporting/risk-management/credit-risk.md) · [Interest Rate Risk](06-reporting/risk-management/interest-rate-risk.md) · [ALM](06-reporting/risk-management/alm.md)
- **Regulatory & Compliance** *(not a menu section; Audit is under the Reporting › Overview group):* [Reports](06-reporting/regulatory-compliance.md)

### 8. Alerts
- [Alerts](08-alerts/alerts.md)

### 9. AI Assistance
- [Overview](09-agents/overview.md) · [Working with an Agent](09-agents/assistant.md)

### 10. Admin Console
- [Overview](10-admin-console/overview.md) · [Users & Roles](10-admin-console/users-and-roles.md) — users, roles and the audit trail.
- [Companies & Groups](10-admin-console/companies-and-groups.md) · [Tags](10-admin-console/tags.md) · [Matching Rules](10-admin-console/matching-rules.md)
- [Access Tokens](10-admin-console/access-tokens.md) · [Master Data](10-admin-console/master-data.md) · [Counterparties & SSIs](10-admin-console/counterparties-and-ssis.md)
- [Payment Approval Rules](10-admin-console/payment-approval-rules.md) · [AI Usage](10-admin-console/ai-usage.md)

### 11. Accounting (G/L & ERP)
- [G/L Postings](11-accounting/gl-postings.md) · [CoA & Rules Engine](11-accounting/coa-rules-engine.md) · [Journal Entries](11-accounting/journal-entries.md)
- [Audit Trail](11-accounting/audit-trail.md)

### 12. Platform
- [Security & Compliance](12-platform/security-and-compliance.md) · [Preferences (theme & language)](12-platform/preferences.md)
- [White-label & Partners](12-platform/white-label-and-partners.md) · [Deployment, Availability & Continuity](12-platform/deployment-availability-and-continuity.md)
