# Workflow Dashboard & Approvals

> **Availability:** `In Preview` 👁️
> **Where to find it:** Workflows › Workflow Dashboard · Workflows › Workflow Approvals
> **Who uses it:** treasury operations, treasurers, approvers, finance managers.
> **Permissions required:** workflow access — Read to view, and your assigned **approval authority** to approve (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).

> 👁️ **In Preview.** This screen is in testing and available on request — contact Treasury Hub to enable it. This page describes how it works.

## Overview
The **Workflow Dashboard** will be your command centre for everything running in the Workflows module.
It will list every workflow deployed in your organization — whether it came from a
[template](overview.md#the-35-workflow-templates) or was built as a custom workflow — show whether
each is **active or inactive**, and let you expand any one to see its steps, the people and AI
agents on each step, the integrations it uses, and its performance.

**Workflow Approvals** will be where the steps that need a decision from *you* are gathered, so you can
review and approve (or reject) them in one place.

## Key concepts
- **Active / Inactive** — an **Active** workflow will be live and running; an **Inactive** one will be
  paused or still a draft.
- **Origin** — whether a workflow was created from a **Template** or built as a **Custom** workflow.
- **Run** — one execution of a workflow (for example, one payroll batch processed).
- **Success rate** — the share of recent runs that completed without error.
- **SLA** — the expected time for a step or workflow; steps running past it are flagged.
- **Maker / checker (4-eyes)** — an approval that requires two different people, common for
  payments.
- **Escalation** — approvals that route to more senior roles above set amount thresholds.

## Before you start
- To **approve** workflow steps you will need the relevant **approval authority** for that workflow
  (for example, a payment approval level). See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).
- Workflows that use external connections will need those [integrations](../02-integrations/overview.md)
  configured, or their **Integration required** steps will not run.

## How to use it

*The steps below describe the intended experience once this screen is live.*

### Monitor active workflows
1. Go to **Workflows › Workflow Dashboard**.
2. Review the summary tiles at the top — for example **active** workflows, **inactive** (paused or
   draft), **runs** in the period, and **success rate**. *(The figures shown are illustrative.)*
3. Scan the list. Each row shows the workflow **name**, **origin** (Template or Custom),
   **category**, **status**, recent **runs**, **success rate**, **average duration**, and **last
   run**.
4. Use the filters and search to narrow by category or status.

### Inspect a single workflow
1. Select a workflow row to **expand its detail panel**.
2. Review the **step flow** — each step in order, who runs it (a person or an AI agent), any
   **Integration required** connection, and the assigned users or auto-assigned roles.
3. For a customized workflow, check **what changed versus the template** it was copied from.
4. Review the **performance** figures (runs, success, average duration, errors) and the **owner**.

### Activate or pause a workflow
1. Open the workflow's detail panel.
2. Use the **status toggle** to switch it **Active** or **Inactive**.
3. Confirm. Pausing a workflow stops new runs without deleting it.

### View the audit trail
1. In a workflow's detail panel, choose **View audit trail**.
2. Review the full history of changes and runs — who did what, when, and the outcome.

### Approve a workflow step
1. Go to **Workflows › Workflow Approvals**.
2. Open a pending item to see the **context** — what the step is, the amount or details involved, who
   is requesting, and where it sits in the workflow.
3. Choose **Approve** or **Reject**. For **maker/checker** steps, a second approver must also act.
4. If the amount exceeds an **escalation threshold**, the item routes on to the more senior approver
   automatically.
5. Your decision is recorded in the workflow's **audit trail**, and the workflow continues to its
   next step.

## Configuration
Most setup for a workflow — its steps, approval chains, SLAs, and exception handling — will be done
in the [Workflow Builder](workflow-builder.md) (coming Q2 2026). Once live, the Dashboard will be used
to **monitor, activate/pause, and audit** workflows, and Approvals to **action the steps assigned to
you**. Who can approve what will be governed by [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)
and each user's approval authority.

## Tips & good practices
- Check the Dashboard at the **start of the day** for anything **Inactive** or with a falling
  **success rate**.
- Approve from the **Workflow Approvals** screen rather than chasing items across modules — it
  gathers everything waiting on you.
- Assign approvals to **roles** where possible so approvals keep flowing when people are away.
- Treat a run failure as a signal to check the related [integration](../02-integrations/overview.md)
  or the source data.

## Related
- [Workflows — Overview](overview.md) — the universal structure and the 35 templates.
- [Workflow Builder](workflow-builder.md) — design and customize workflows (in preview).
- [Alerts](../08-alerts/alerts.md) — where workflow exceptions and failures surface.
- [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md) — approval authority and
  escalation.
- [Payments — Approvals](../05-payments/approvals.md) — payment-specific multi-level approvals.
