# Alerts

> **Know what needs your attention right now, and nothing else**
>
> **Why it matters**
> - **One place instead of every module**: reconciliation breaks, stalled integrations and payment exceptions gathered together.
> - **Raised for you**: the platform notices and tells you, rather than waiting for someone to check.
> - **Grouped to act on**: alerts arrive sorted so the important one is not buried in the routine ones.

> **Where to find it:** Alerts
> **Who uses it:** everyone — treasury operations, finance teams, approvers, administrators.
> **Permissions required:** alerts access; reconciliation alerts follow `Reconciliation.Alerts` · Read (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).

## Overview
Know what needs your attention right now, and nothing else: the **Alerts** centre gathers the
notable events from across the whole platform into one place, so nothing important slips through. Instead of checking each module separately, you open
**Alerts** to answer one question: *what needs my attention right now?* Alerts are raised
automatically by the platform — for example a reconciliation break, an integration that stopped
feeding data, or a payment exception — and grouped so you can find and act on them quickly.

The standalone Alerts centre includes the Alerts Dashboard and per-module alerts (Integration,
Data, Reconciliation, Payment, Reports, Prefunding, Workflow, Agent, and Admin). No **G/L Posting**
alert is raised any more: nothing generates, approves or exports a posting, so there is no posting
activity to alert on — see [G/L Postings](../11-accounting/gl-postings.md).
Reconciliation exceptions also surface within the
[Reconciliation](../04-reconciliation/overview.md) module itself; the dedicated Alerts centre
aggregates alerts across every module.

## Key concepts
- **Alert** — an automatically raised notice that something needs attention. Each alert carries
  **what happened**, **when**, and (where relevant) the **record it relates to**.
- **Source module** — where the alert came from. The Alerts centre gathers alerts from
  every module: **Integration, Data, Reconciliation, Payment, Reporting, Workflow, Agent,** and
  **Admin**.
- **Severity** — how serious an alert is. Reconciliation alerts use three levels: **Info**,
  **Warning**, and **Grave** (critical).
- **Status** — where an alert is in its lifecycle: **Open** (still needs attention) or **Resolved**.
  You can view **All**, **Open**, or **Resolved**.
- **Contextual / RACI routing** — alerts reach the right people based on their role
  in the related workflow (Responsible, Accountable, Consulted, Informed), each with a clear
  suggested action.

## How alerts are generated
- The platform **raises alerts automatically** as it works — the reconciliation and matching
  engines, integrations, and other modules emit alerts when they detect a problem or an
  exception.
- Each alert is **linked to the record that triggered it** where one exists (for example a
  movement), so you can click straight through to investigate.
- Reconciliation, for example, raises alerts such as an **orphan** item, a **matching or
  conciliation failure**, a **duplicate match**, an **edited-movement conflict**, a rule that **did
  not fire** when expected, or a **sum/cap threshold exceeded** — each with a severity so you can
  prioritise.

## Before you start
- To see reconciliation alerts you need at least **Read** on the relevant module (see
  [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).
- Alerts only appear once the modules that raise them are connected and running — see
  [Integrations](../02-integrations/overview.md) and [Reconciliation](../04-reconciliation/overview.md).

## How to use it

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
2. Once the underlying issue is handled, the alert moves to **Resolved** and drops off the **Open**
   tab, with **who resolved it** and **when** recorded.

> **Note:** Resolution is **driven by fixing the underlying item**, and in-list **Resolve / Dismiss**
> buttons and bulk actions are available for reconciliation alerts. The list reflects
> an alert as **Resolved** once the backend marks it so. Reconciliation exceptions can also be worked
> directly in the [Reconciliation](../04-reconciliation/overview.md) module.

## Configuration
- **Notifications** and **alert rules** (which events raise an alert, their severity, and who is
  notified) are configured alongside the Alerts centre. Reconciliation
  alerts are generated by the reconciliation rules — see
  [Reconciliation — Rules & Criteria](../04-reconciliation/rules-and-criteria.md).
  [Admin — Matching Rules](../10-admin-console/matching-rules.md) are a separate mechanism, for
  tagging and posting rather than alerting.
- Per-user notification preferences and **RACI-based routing** are configurable.

## Tips to get more value
- Start each day on the **Open** tab — it is your shortest list of what actually needs action.
- Use **severity** to triage: handle **Grave** alerts first, then **Warning**, then **Info**.
- Click through to the **linked record** rather than working from the alert text alone — the detail
  panel shows the full context.
- Tighten your reconciliation [rules & criteria](../04-reconciliation/rules-and-criteria.md) when the
  same alert type keeps recurring; it usually points to a fixable data or matching gap.

## What the Alerts centre covers
- **The Alerts centre** — the standalone Alerts Dashboard and per-module alerts (Integration, Data,
  Reconciliation, Payment, Reports, Prefunding, Workflow, Agent, and Admin) in one feed.
- **Contextual / RACI routing & call-to-action** — alerts routed to the right people by their role
  in the workflow, each with a suggested next action.
- **In-list Resolve / Dismiss and bulk actions** for reconciliation alerts.
- **Configurable alert rules & notification preferences** — choose which events alert you and how
  you're notified.

## Where to go next
💡 Get more from this: combine alerts with the [Risk Cockpit](../06-reporting/risk-management/risk-cockpit.md) so a limit breach reaches you the moment it happens, with the whole risk picture one click away.

- [Reconciliation — Overview](../04-reconciliation/overview.md) — where reconciliation alerts come
  from.
- [Reconciliation — Rules & Criteria](../04-reconciliation/rules-and-criteria.md) — the rules that
  raise matching alerts.
- [Reconciliation Workflows](../04-reconciliation/workflows.md) — workflow exceptions surface as alerts.
- [Integrations](../02-integrations/overview.md) — connection problems raise alerts.
- [Core Concepts — Alerts](../00-getting-started/03-core-concepts.md#alerts) — the idea behind the
  centre.
