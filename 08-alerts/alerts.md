# Alerts

> **Availability:** `In Preview` 👁️
> **Where to find it:** Alerts
> **Who uses it:** everyone — treasury operations, finance teams, approvers, administrators.
> **Permissions required:** alerts access; reconciliation alerts follow `Reconciliation.Alerts` · Read (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).

> 👁️ **In Preview.** This screen is in testing and available on request — contact Treasury Hub to enable it. This page describes how it works.

## Overview
The **Alerts** centre will be a single place that gathers the notable events happening across the whole
platform, so nothing important slips through. Instead of checking each module separately, you will open
**Alerts** to answer one question: *what needs my attention right now?* Alerts will be raised
automatically by the platform — for example a reconciliation break, an integration that stopped
feeding data, or a payment exception — and grouped so you can find and act on them quickly.

The standalone Alerts centre — including the Alerts Dashboard and per-module alerts (Integration,
Data, Reconciliation, GL Posting, Payment, Reports, Prefunding, Workflow, Agent, and Admin) — is
**in testing (available on request)**. Reconciliation exceptions surface within the
[Reconciliation](../04-reconciliation/overview.md) module itself; the dedicated Alerts centre that
would aggregate alerts across every module is what this page describes.

## Key concepts
- **Alert** — an automatically raised notice that something needs attention. Each alert will carry
  **what happened**, **when**, and (where relevant) the **record it relates to**.
- **Source module** — where the alert came from. The Alerts centre is designed to gather alerts from
  every module: **Integration, Data, Reconciliation, Payment, Reporting, Workflow, Agent,** and
  **Admin**.
- **Severity** — how serious an alert is. Reconciliation alerts will use three levels: **Info**,
  **Warning**, and **Grave** (critical).
- **Status** — where an alert is in its lifecycle: **Open** (still needs attention) or **Resolved**.
  You will be able to view **All**, **Open**, or **Resolved**.
- **Contextual / RACI routing** — the plan for alerts to reach the right people based on their role
  in the related workflow (Responsible, Accountable, Consulted, Informed), each with a clear
  suggested action. *(In preview — see [In Preview](#in-preview).)*

## How alerts are generated
- The platform will **raise alerts automatically** as it works — the reconciliation and matching
  engines, integrations, and other modules will emit alerts when they detect a problem or an
  exception.
- Each alert will be **linked to the record that triggered it** where one exists (for example a
  movement), so you can click straight through to investigate.
- Reconciliation, for example, will raise alerts such as an **orphan** item, a **matching or
  conciliation failure**, a **duplicate match**, an **edited-movement conflict**, a rule that **did
  not fire** when expected, or a **sum/cap threshold exceeded** — each with a severity so you can
  prioritise.

## Before you start
- To see reconciliation alerts you will need at least **Read** on the relevant module (see
  [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).
- Alerts will only appear once the modules that raise them are connected and running — see
  [Integrations](../02-integrations/overview.md) and [Reconciliation](../04-reconciliation/overview.md).

## How to use it

*The steps below describe the intended experience once this screen is live.*

### View and filter alerts
1. Open **Alerts** from the sidebar and choose the relevant module (for example **Reconciliation**).
2. The list opens on **Open** alerts by default — the things currently needing attention.
3. Switch between the **All**, **Open**, and **Resolved** tabs to change what you see.
4. Read each row for its **type**, **severity**, the **record** it relates to, a short **message**,
   and when it was **created**. Newest alerts appear first.
5. Page through the list or change the page size for long histories.

### Investigate an alert
1. Select an alert whose linked record is shown (for example a **movement**).
2. The related **detail panel** opens so you can see the underlying item and its context.
3. For a matching alert, review the **left and right entities** involved and the **rule that
   triggered** it to understand why it was raised.

### Acknowledge and resolve
1. Work the alert to its conclusion in the source module (for example, fix or confirm the
   reconciliation).
2. Once the underlying issue is handled, the alert will move to **Resolved** and drop off the **Open**
   tab, with **who resolved it** and **when** recorded.

> **Note:** Resolution will be **driven by fixing the underlying item**; in-list **Resolve / Dismiss**
> buttons and bulk actions are in preview (see [In Preview](#in-preview)). The list will reflect
> an alert as **Resolved** once the backend marks it so. Until the Alerts centre is live, reconciliation
> exceptions are worked directly in the [Reconciliation](../04-reconciliation/overview.md) module.

## Configuration
- **Notifications** and **alert rules** (which events raise an alert, their severity, and who is
  notified) will be introduced alongside the wider rollout of the Alerts centre. Reconciliation
  alerts will be generated by the reconciliation **matching rules** — see
  [Admin — Matching Rules](../10-admin-console/matching-rules.md) and
  [Reconciliation — Rules & Criteria](../04-reconciliation/rules-and-criteria.md).
- Configurable per-user notification preferences and **RACI-based routing** are in preview (see
  [In Preview](#in-preview)).

## Tips & good practices
- Start each day on the **Open** tab — it is your shortest list of what actually needs action.
- Use **severity** to triage: handle **Grave** alerts first, then **Warning**, then **Info**.
- Click through to the **linked record** rather than working from the alert text alone — the detail
  panel shows the full context.
- Tighten your reconciliation [rules & criteria](../04-reconciliation/rules-and-criteria.md) when the
  same alert type keeps recurring; it usually points to a fixable data or matching gap.

## Related
- [Reconciliation — Overview](../04-reconciliation/overview.md) — where reconciliation alerts come
  from.
- [Reconciliation — Rules & Criteria](../04-reconciliation/rules-and-criteria.md) — the rules that
  raise matching alerts.
- [Workflows — Overview](../07-workflows/overview.md) — workflow exceptions surface as alerts.
- [Integrations](../02-integrations/overview.md) — connection problems raise alerts.
- [Core Concepts — Alerts](../00-getting-started/03-core-concepts.md#alerts) — the idea behind the
  centre.

## In Preview
- 👁️ **The Alerts centre** — the standalone Alerts Dashboard and per-module alerts (Integration, Data,
  Reconciliation, GL Posting, Payment, Reports, Prefunding, Workflow, Agent, and Admin) in one feed.
  In testing and available on request.
- 👁️ **Contextual / RACI routing & call-to-action** — alerts routed to the right people by their role
  in the workflow, each with a suggested next action.
- 👁️ **In-list Resolve / Dismiss and bulk actions** for reconciliation alerts.
- 👁️ **Configurable alert rules & notification preferences** — choose which events alert you and how
  you're notified.
