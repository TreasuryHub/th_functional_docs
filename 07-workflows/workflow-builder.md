# Workflow Builder

> **Availability:** `In Preview` 👁️ (Q2 2026)
> **Where to find it:** Workflows › Workflow Builder
> **Who uses it:** treasurers, treasury operations leads, administrators who design and maintain workflows.
> **Permissions required:** workflow administration (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).

> 👁️ **In Preview** (targeted Q2 2026). This feature is in testing and available on request — contact
> Treasury Hub to enable it. This page describes how the Workflow Builder is planned to work so you
> can prepare. Until it ships, workflows are
> delivered as ready-to-use **templates** and managed from the
> [Workflow Dashboard & Approvals](workflow-dashboard-and-approvals.md). To adapt a workflow to your
> banks, entities, or approval rules today, contact the Treasury Hub team.

## Overview
The Workflow Builder will be a **visual, no-code designer** for creating and customizing workflows.
Instead of asking us to configure a workflow for you, you will be able to start from one of the
[35 templates](overview.md#the-35-workflow-templates) — or from scratch — and lay out the steps,
approvals, and connections yourself. Every workflow you build will follow the same
[universal structure](overview.md#key-concepts): a sequence of steps, an optional journal entry, and
optional reporting.

## Key concepts
- **Copy & customize** — the fastest way to build will be to copy an existing template into an
  editable workflow of your own, then change the parts that differ for your organization.
- **Step** — each stage you add to the canvas. A step can be assigned to a **person**, an **AI
  agent**, or set to run **automatically**. **Carter** (the Workflow Designer agent) will help you
  build and configure workflows — see [Agents](../09-agents/overview.md).
- **Approval chain** — the ordered set of approvers on a step, including **maker/checker (4-eyes)**
  and **escalation by amount** (larger amounts route to more senior approvers).
- **SLA** — the time a step or workflow is expected to take. SLA tracking will flag steps that are
  running late.
- **Exception handling** — the rules for what happens when a step fails or falls outside tolerance
  (for example, pause the workflow and raise an [alert](../08-alerts/alerts.md), or route to a
  reviewer).

## How it is planned to work
The steps below describe the intended experience once the Workflow Builder is released.

### Start a new workflow
1. Go to **Workflows › Workflow Builder**.
2. Choose **+ New from template** to copy one of the 35 templates, or **+ New from scratch** for a
   blank canvas.
3. Give the workflow a name and, for a copy, review what it inherits from the template.

### Design the steps
1. Add steps to the canvas in the order they should run (for example *Receive → Validate → Approve →
   Send → Confirm*).
2. For each step, choose who runs it — a **person**, an **AI agent**, or an **automatic trigger**.
3. Mark any step that needs an external connection as **Integration required** and point it at the
   correct [integration](../02-integrations/overview.md) (bank, PSP, ERP, trading venue, custodian,
   or pricing feed).
4. Add the optional **Journal Entry** and **Reporting** steps at the end where they apply.

### Set up approvals
1. On an approval step, build the **approval chain** — add approvers and turn on **maker/checker**
   where two people are required.
2. Add **escalation thresholds** so amounts above a limit route to more senior approvers.
3. Assign approvers by **role** (recommended) so the workflow keeps working as people change, or to
   **named users** for specific cases.

### Configure triggers, SLAs, and exceptions
1. Choose how the workflow **starts**: on an **event**, on a **schedule**, **manually**, or by an
   **AI agent**.
2. Set an **SLA** per step or for the whole workflow so late steps are flagged.
3. Define **exception handling** — what happens if a step fails or a value is out of tolerance.

### Test, activate, and version
1. **Save as draft** and review the audit trail of your changes.
2. **Activate** the workflow to make it live; it then appears in the
   [Workflow Dashboard](workflow-dashboard-and-approvals.md).
3. Later edits are **versioned**, and copies keep a record of what changed versus the original
   template.

## Tips & good practices
- Prefer **copying a template** over building from scratch — you inherit tested approvals and
  validations.
- Assign approvals to **roles rather than named individuals** so workflows survive team changes.
- Set realistic **SLAs** first, then tighten them once you see real run times on the Dashboard.

## Related
- [Workflows — Overview](overview.md) — the universal structure and the 35 templates.
- [Workflow Dashboard & Approvals](workflow-dashboard-and-approvals.md) — where your workflows run.
- [Integrations](../02-integrations/overview.md) — connections for integration-required steps.
- [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md) — who can approve what.

## In Preview
- 👁️ **Workflow Builder** (Q2 2026) — visual, no-code workflow design: steps, approval chains, SLA
  tracking, and exception handling, building on the 35 templates available today.
