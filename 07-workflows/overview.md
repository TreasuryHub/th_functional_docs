# Workflows — Overview

> **Availability:** `In Preview` 👁️
> **Where to find it:** Workflows
> **Who uses it:** treasurers, treasury operations, finance teams, approvers, administrators.
> **Permissions required:** workflow access (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).

> 👁️ **In Preview.** This screen is in testing and available on request — contact Treasury Hub to enable it. This page describes how it works.

## Overview
Almost everything you *do* in Treasury Hub is a **workflow** — a sequence of steps that carries a
task from start to finish safely and with a full record of who did what. Payments, FX deals, cash
transfers, loans, investments, risk revaluations, and reports are all run as workflows. A workflow
doesn't just capture *what* to do; it encodes *how* to do it safely — the validations, the
approvals, the journal entry, and the reporting that should follow.

The Workflows module will be where you **see every workflow running in your organization**, track its
progress, and **approve the steps** that are waiting on you. The whole Workflows area — the
[Workflow Dashboard & Approvals](workflow-dashboard-and-approvals.md) and the visual
[Workflow Builder](workflow-builder.md) — is **in preview** (available on request; see
[In Preview](#in-preview)).

## Key concepts
- **Workflow** — an orchestrated sequence of steps that completes a treasury task (e.g. an AP
  payment batch, an FX deal, a monthly payroll run). Steps run in order, and some can run in
  parallel.
- **Step** — a single stage in a workflow (for example *Receive*, *Validate*, *Approve*, *Send*,
  *Confirm*). Each step can be carried out by a person, by an AI agent, or triggered automatically.
- **The universal structure** — every workflow follows the same shape:
  **[Step 1] → [Step 2] → … → [Step N] → [Journal Entry (optional)] → [Reporting (optional)]**.
  After the operational steps, a workflow can automatically post a **journal entry** and update the
  relevant **report**.
- **Template** — a ready-made, best-practice workflow you can use as-is or copy and adapt. Treasury
  Hub ships **35 templates** across **8 categories** (see below).
- **Custom workflow** — a workflow you have created or adapted (typically by copying a template) to
  match your own banks, entities, and approval rules.
- **Integration-required step** — a step that needs an external connection to run (a bank, PSP, ERP,
  trading venue, custodian, or pricing feed). These steps are marked so you know a connection must be
  configured in [Integrations](../02-integrations/overview.md).
- **Trigger** — what starts a workflow: an **event** (e.g. a file arrives), a **schedule** (e.g.
  daily / month-end), a **manual** start by a user, or an **AI agent** acting on your behalf.
- **Journal entry (JE)** — the accounting entry a workflow can generate automatically at the right
  moment (for a payment, only once it is confirmed on the bank statement — not before).

## The 35 workflow templates
Templates are grouped into eight categories. You can use a template as-is or copy it to build your
own version.

| Category | Templates | Examples |
|---|:--:|---|
| **Payments** | 9 | AP payment (single & batch), salary/payroll, tax, intercompany/netting, urgent, standing order/recurring. |
| **FX** | 3 | Deal execution, hedging (NDF/forward), rollover. |
| **Cash Management** | 3 | Rule-based internal transfer, scheduled/recurring transfer, intercompany loan. |
| **Loans** | 4 | Disbursement, repayment received, restructuring, IFRS 9 stage migration. |
| **Investments** | 3 | Purchase, maturity/redemption, coupon/dividend collection. |
| **Risk Management** | 8 | Mark-to-market revaluations, credit risk review, FX exposure, IRRBB, ALM/liquidity stress, limit breach. |
| **Reporting** | 4 | FX position, cash forecast, covenant monitoring, risk cockpit. |
| **Compliance** | 1 | Daily activity log. |

> Which specific templates are switched on for your organization can vary by plan — check the
> [Workflow Dashboard](workflow-dashboard-and-approvals.md) or ask your administrator.

## What every workflow gives you
- **Governance built in** — the right validations and approvals are assigned to the right roles
  automatically. Approvals support **maker/checker (4-eyes)** and **escalation by amount** (for
  example, larger payments route up to a Head of Payments, Group Treasurer, or CFO).
- **People *and* AI on each step** — a step can be handled by a person, by an **AI agent** (for
  example validation, sanctions screening, or generating the journal entry), or triggered
  automatically.
- **Auto-assign roles** — if a step needs a role a user doesn't have, the system flags it so an
  administrator can grant access rather than the workflow silently stalling.
- **A complete audit trail** — every step records **who did what, when, and the outcome**, so the
  whole run is explainable and auditable.
- **Notifications & alerts** — people are notified when a step needs them, and exceptions surface in
  the [Alerts](../08-alerts/alerts.md) centre.
- **Versioning** — when you copy a template into your own workflow, Treasury Hub keeps track of what
  you changed versus the original, and the audit trail preserves the history of edits.
- **Performance tracking** — runs, success rate, and average duration are tracked per workflow so you
  can see where things slow down.

## Before you start
- Make sure the connections your workflows rely on are set up — see
  [Integrations](../02-integrations/overview.md). Steps marked **Integration required** won't run
  without them.
- Confirm your team's [roles, approval authority, and routing](../00-getting-started/04-roles-and-permissions.md)
  so approvals reach the right people.

## What's in the module
| Screen | What it's for |
|---|---|
| [Workflow Dashboard & Approvals](workflow-dashboard-and-approvals.md) | See every active workflow, its status and performance, and approve the steps waiting on you. **In Preview.** |
| [Workflow Builder](workflow-builder.md) | Design and customize workflows visually, with no code. **In Preview (Q2 2026).** |

## Tips & good practices
- Start from a **template** rather than a blank workflow — the built-in approvals and validations
  reflect treasury best practice.
- Keep an eye on the **Dashboard success rate**; a dip usually points to an integration or data
  issue upstream.
- Resolve **Integration required** gaps early so scheduled workflows don't stall at month-end.

## Related
- [Core Concepts — "Everything is a workflow"](../00-getting-started/03-core-concepts.md) — the idea
  behind the module.
- [Workflow Dashboard & Approvals](workflow-dashboard-and-approvals.md) — the live view and approvals.
- [Workflow Builder](workflow-builder.md) — designing your own (in preview).
- [Integrations](../02-integrations/overview.md) — where integration-required steps connect.
- [Alerts](../08-alerts/alerts.md) — where workflow exceptions surface.

## In Preview
- 👁️ **Workflow Dashboard & Approvals** — the live view of every running workflow and the place to
  approve the steps waiting on you. In testing and available on request. See
  [Workflow Dashboard & Approvals](workflow-dashboard-and-approvals.md).
- 👁️ **Workflow Builder** (Q2 2026) — a visual, no-code designer to build workflows from scratch or
  by copying a template, with drag-and-drop steps, approval chains, SLA tracking, and exception
  handling. See [Workflow Builder](workflow-builder.md).
