# Core Concepts

> **Availability:** `Available` ✅
> **Who this is for:** everyone — read this once and the rest of the platform makes sense.

A handful of ideas run through the whole platform. Understanding these will help you use every
module.

## Organizations & tenants
Treasury Hub is **multi-tenant**. Each customer organization is a **tenant**, and all your data is
isolated to your tenant. If your login belongs to more than one organization, you can
[switch tenants](02-navigation-and-workspace.md#switching-organizations-tenants) from your avatar
menu. Everything you see — accounts, transactions, reports — is always scoped to the tenant you're
currently in.

## Company structure
Within a tenant, your legal and reporting structure is modeled as a hierarchy:
- **Company Group** — a grouping of companies (e.g. a region or division).
- **Company** — a legal entity. One company can be marked the **default**; new bank accounts are assigned
  to the default company unless the user assigns them to another company.
- **Bank Account** — belongs to a company, held at an institution, in **one currency — or multiple
  currencies** if it is a multi-currency account.

This hierarchy is what lets you consolidate and drill down: **Company Group › Company › Account ›
Transaction**. You set it up in the [Admin Console](../10-admin-console/companies-and-groups.md).

## Master data
**Master data** is the reference data everything else depends on — **company groups, companies, and bank
accounts**; **currencies and exchange rates**; **counterparties and their settlement instructions (SSIs)**;
and **tags, custom entities, and matching rules**. Keeping it clean and complete is the foundation for
accurate reconciliation, reporting, and payments. It's managed in the
[Admin Console](../10-admin-console/master-data.md).

An **AI Master Data Assistant** (`In Preview` 👁️) can build a whole hierarchy — **groups, companies and
accounts, and their associations** — from a single plain-language request, ask for what's missing, flag
validation issues, and create records in bulk from a pasted list or an uploaded file.
**Counterparties & SSIs** (`In Preview` 👁️) add the *payee* side used by transfers, with maker-checker
approval on banking changes.

## Financial entities
Treasury Hub isn't limited to bank balances. Its **cash-forecast model** classifies the full range of
financial entities your team handles — organized as **contracts** (which emit cashflows), the **cashflows**
themselves, standalone **operatives**, and **plans** that project future flows:

| Group | Entities |
|---|---|
| **Contracts** | Loans & term loans, revolving lines (RCF), leases (IFRS 16), term deposits & investments, bonds, FX (spot / forward / swap), and commercial sales & purchase contracts. |
| **Cashflows they emit** | Principal (drawdown / repayment), interest paid & received, installments (cuota), placements, maturities & redemptions, coupons, FX settlements, customer receipts (AR), supplier payments (AP), dividends, and equity movements. |
| **Standalone operatives** | Payroll, taxes & VAT, bank & merchant fees, internal transfers, ad-hoc flows, and recurring flows — no contract needed. |
| **Balances & the "actual"** | Opening & closing balances per account, and the bank movements/statements (MT940, CAMT.053, BAI2, CSV, PDF) that reconcile against the forecast. |
| **Plans (scenario input)** | Sales, hiring/headcount, OpEx/budget, Capex, dividend, and financing plans that generate projected cashflows. |

Every cashflow carries a **tag** — grouped as **financing (`fin_`)**, **investment (`inv_`)**, or
**operational (`op_`)** — so the same taxonomy classifies both the **forecast** and the **Transactions**
historicals. Any cashflow can be created manually; a contract is optional. Not every entity has its own
screen yet, but this is the data model the platform is built around.

## Data flows from source to insight
Everything follows the same path:
**Sources → Integrations (ingestion) → Data layer (normalize/unify/enrich) → Workflows → Modules.**
Raw data from banks, ERPs, files, and email comes in through **Integrations**, becomes clean
**normalized data**, is processed by **workflows** (reconciliation, payments, posting…), and shows
up in the **modules** you use. See [What is Treasury Hub](01-what-is-treasury-hub.md#how-the-platform-is-organized-the-5-layer-stack).

## Everything is a workflow
Beyond the data foundation, most things you *do* in Treasury Hub are **workflows** — a sequence of
steps that can include validations, approvals, an optional journal entry, and optional reporting.
Every workflow is:
- **Orchestrated & configurable** — steps run in order (or in parallel), with rules per step.
- **Governed** — approvals and validations are assigned to the right roles automatically.
- **Auditable** — every step records who did what, when, and the outcome.

Payments, FX deals, reconciliation, cash transfers, loans, investments, risk revaluations, and
reporting are all modeled this way. See [Workflows](../07-workflows/overview.md).

## The AI layer & agents
AI is not a single feature bolted on — it's a **transversal layer** available across the platform.
Specialized **agents** can guide setup, answer questions, and act on your behalf (with your permissions).

**Assistants & coaches**
- **Onboarding / in-app Assistant** — guided setup and help (open it from the top bar).
- **Alex** — Customer Success (in preview).
- **Ona** — personal coach with role-based variants (in preview).

**Configuration assistants** (`In Preview` 👁️) — describe what you want in plain language and the assistant
drafts it for you to confirm. It never creates without confirmation, only produces valid configurations, and
every result is audited:
- **Roles** — draft a role from a description ("read-only on transactions and balances"), with
  segregation-of-duties checks.
- **Counterparties & SSIs** — set up payees and settlement instructions, with validation and maker-checker.
- **Email & SFTP ingestion** — build reception/assignment rules (one per provider or file type), test the
  connection, and flag missing templates.
- **Reconciliation** — assemble workflows, chains and rules from a description, with topology validation and
  warnings.
- **Master data** — build groups, companies and accounts and their links from one prompt.
- **Forecast & document ingestion** — turn invoices, payments, contracts or statements into the right
  entities for you to review.

See [Agents](../09-agents/overview.md).

## Alerts
Notable events across every module surface as **alerts**, gathered into one
[Alerts](../08-alerts/alerts.md) area — with an **Alerts Dashboard** — so nothing is missed. Alerts are
organized by source:

| Alert type | Raised when… |
|---|---|
| **Integration** | A feed or connection fails — a bank / Open Banking / SFTP / email source stops delivering, or a connection test breaks. |
| **Data** | Ingested data is missing, malformed, or fails validation. |
| **Reconciliation** | A break appears — an expected item with no actual, or an actual with no match. |
| **G/L Posting** | A posting fails, is rejected by the ERP, or needs review. |
| **Payment** | A payment is held, rejected, awaiting approval, or breaches a threshold. |
| **Prefunding** | An account is projected to run short of the funds a payment run needs. |
| **Reports** | A scheduled report fails or a monitored metric crosses a limit. |
| **Workflow** | A workflow step stalls, errors, or waits too long for an approval. |
| **Agent** | An AI agent needs input, proposes an action, or finishes a run. |
| **Admin** | Security/administration events — access changes, expiring consents or tokens, configuration issues. |

The Alerts module — the dashboard and the alert types above — is `In Preview` 👁️.

## Related
- [Roles & Permissions](04-roles-and-permissions.md)
