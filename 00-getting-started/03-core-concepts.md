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
- **Company** — a legal entity. One company can be marked the **default**.
- **Bank Account** — belongs to a company, held at an institution, in a currency.

This hierarchy is what lets you consolidate and drill down: **Company Group › Company › Account ›
Transaction**. You set it up in the [Admin Console](../10-admin-console/companies-and-groups.md).

## Master data
**Master data** is the reference data everything else depends on — companies, bank accounts,
currencies and exchange rates, counterparties, tags, and matching rules. Keeping master data clean
and complete is the foundation for accurate reconciliation, reporting, and payments. It's managed
in the [Admin Console](../10-admin-console/master-data.md).

## Financial entities Treasury Hub understands
Treasury Hub isn't limited to bank balances. It ingests, classifies, and documents the full range
of financial entities your team handles, including:

| Area | Entities |
|---|---|
| Banking & cash | Bank accounts, bank movements, statements (MT940, CAMT.053, BAI2), cash pooling. |
| Collections & payments | Pay-ins/pay-outs, PSP/merchant settlements, direct debits & standing orders, payroll. |
| Invoicing & trade | Purchase & sales invoices, credit/debit notes, purchase orders. |
| Debt & financing | Loans, credit lines, leasing, factoring/confirming, letters of credit, promissory notes. |
| Investments & markets | Term deposits, money-market funds, bonds, equities, FX (spot/forward/NDF/swap), derivatives. |
| Other | Taxes & withholdings, insurance, intercompany, guarantees, crypto/digital assets, real estate, commodities. |

Not every entity is exposed as its own screen yet —
but this is the data model the platform is built around.

## Data flows in one direction: source → insight
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
Specialized **agents** can guide setup, answer questions, and act on your behalf (with your
permissions), for example:
- **Onboarding / in-app Assistant** — guided setup and help (open it from the top bar).
- **Alex** — Customer Success (in preview).
- **Ona** — personal coach with role-based variants (in preview).

See [Agents](../09-agents/overview.md).

## Alerts
Notable events across every module (integration failures, reconciliation breaks, payment
exceptions, etc.) surface as **alerts**, gathered into one [Alerts](../08-alerts/alerts.md) area so
nothing is missed.

## Related
- [Roles & Permissions](04-roles-and-permissions.md)
