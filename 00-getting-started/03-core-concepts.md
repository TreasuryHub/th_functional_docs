# Core Concepts

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

**Counterparties & SSIs** add the *payee* side used by transfers, with maker-checker approval on
banking changes.

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
historicals. Any cashflow can be created manually; a contract is optional. This is the data model the
platform is built around.

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
reporting are all modeled this way. See [Reconciliation Workflows](../04-reconciliation/workflows.md).

## The AI layer
Each module has its own **agent**, and you work with it on that module's screens. An agent knows
the records its module holds, the operations it allows, and the rules a change to it has to
satisfy.

You describe what you want in plain language; that module's agent works out which records you mean
and what would have to change, has the change checked against the platform's own validation rules,
and hands it back to you as a **proposal**. It never saves anything: you read the summary and the
changed fields and submit the change yourself, and the platform rejects a save that originates from
an agent rather than from a person.

An agent acts with the permissions you already have. The modules with an agent today:
- **Reconciliation workflows** — build a workflow, with its chains, rules and matching criteria, by
  conversation in the Workflow Studio.
- **Ingestion formats** — when a file arrives in a format nobody has set up yet, the platform
  proposes a mapping template for a person to review and accept.
- **Administration** — organizations, people, roles and permissions.

See [AI assistance](../09-agents/overview.md).

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
| **Agent** | AI assistance needs input from you, or has a proposal waiting for your review. |
| **Admin** | Security/administration events — access changes, expiring consents or tokens, configuration issues. |

## Related
- [Roles & Permissions](04-roles-and-permissions.md)
