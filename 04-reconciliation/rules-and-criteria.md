# Reconciliation — Rules & Criteria

> **Availability:** `In Preview` 👁️
> **Where to find it:** basic rules under **Admin Console › Matching Rules**; the advanced criteria/chain builder under **Configuración › Reconciliation Criteria (Criterios de Conciliación)**.
> **Who uses it:** treasury operations lead, reconciliation administrators.
> **Permissions required:** reconciliation matching rules · CreateEdit to create or edit; Read to view (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).

> **Two related but distinct things — mind the difference:**
> - **Matching Rules (basic)** — `Available` ✅. Live, tenant-wide rules that auto-categorize, tag,
>   and route transactions, managed under **Admin Console › Matching Rules (Reglas de Coincidencia)**.
>   See [Admin — Matching Rules](../10-admin-console/matching-rules.md).
> - **Reconciliation Criteria builder (advanced)** — `In Preview` 👁️. The advanced criteria-and-chain
>   builder described below — **Configuración › Reconciliation Criteria (Criterios de Conciliación)** —
>   is in testing and available on request. The steps in this page describe what it *will* do.

## Overview
Reconciliation rules are the conditions that make items match automatically. In the advanced builder you
will define the criteria a match must meet — amount, tolerance, reference, date window, partner,
currency — and organise rules into ordered **chains** that the engine applies in sequence. Good rules
mean most items reconcile with no manual effort, leaving only genuine exceptions for the
[Matching](matching.md) screen.

## How workflows, chains & rules fit together
Three levels, from the outside in:
- **Workflow** — a named container for a body of reconciliation logic (e.g. "HG.Cash Operative Balances").
  It's created first, then holds chains, rules and run **instances**.
- **Chain** — inside a workflow, an **ordered set of rules that together form a flow**. Each rule is one
  **hop** between two movement types; run in order they trace a transaction end-to-end — for example
  `PSP_PAYIN → INTERNAL_PAYIN → BANK_MOVEMENT` is **two rules in one chain**. One rule is the **flow start**
  (entry point), and the chain's **topology** shows **Valid** when its rules connect into a coherent flow
  (or **degraded** when they don't).
- **Rule** — one hop: a **from** and **to** movement type, **Single** or **Batch**, optional **filters**,
  one or more **matches** (what happens on each outcome), and the **match criteria** (field + operator) that
  pair the two sides.

So a **single chain can capture an entire flow** across several movement types — you don't need one chain
per hop. A chain with one rule is just the simplest case.

## Key concepts
- **Reconciliation rule (criteria)** — the conditions two items must satisfy to be matched. A rule
  states which item types it links (a **From** type and a **To** type), whether it matches items one
  at a time (**Single**) or in groups (**Batch**), and one or more match criteria.
- **Criterion** — a single condition, such as *amount equals*, *amount within a tolerance*, *same
  reference*, *value date within ± N days*, *same partner*, or *same currency*.
- **Filter** — an optional condition that narrows which movements a rule even considers, before the
  match criteria are applied.
- **Rule chain** — an ordered set of rules that together form a **flow** (typically one rule per hop
  between movement types); rules run in order and every rule belongs to one chain. Its **topology** is
  **Valid** when the rules connect end-to-end, **degraded** when they don't.
- **Movement type** — the kind of item on each side of a hop, e.g. `PSP_PAYIN`, `INTERNAL_PAYIN`,
  `INTERNAL_PAYOUT`, `BANK_MOVEMENT`.
- **Flow start** — marks the rule that begins a flow chain (see [Movements & Flows](movements-and-flows.md)).

## Before you start
- Rules live under a **workflow**. Set up (or pick) the workflow first — see
  [Workflows](workflows.md).
- Decide the item types you're matching (for example Payin Internal to Payin PSP) and the tolerance
  your business accepts.

## How to use it
*The steps below describe the advanced Reconciliation Criteria builder (Configuración › Criterios de
Conciliación), which is `In Preview` 👁️. Basic Matching Rules that are live today are managed in
[Admin Console › Matching Rules](../10-admin-console/matching-rules.md).*

### Create a rule
1. Open **Reconciliation › Conciliation Criteria** and select the workflow whose rules you want to
   manage, then choose **New rule**.
2. Set the **basics**: the **From** and **To** movement types, the **conciliation type** (**Single**
   or **Batch**), whether it's a **flow start**, and the **chain** it belongs to.
3. Add one or more **match criteria**. For each, pick the field to compare and the operator:
   - **Equals** — the values must match exactly (for example amount, reference, currency, partner).
   - **Range / tolerance** — the values must fall within an allowed difference (for example amount
     within a percentage, or value date within ± N days).
   - **Sum equals** — the totals of both sides must balance (used for batch matches).
4. Optionally add **filters** to restrict which movements the rule applies to before matching.
5. Set what the engine should do for each outcome (for example auto-reconcile a unique match, raise
   an alert, or fall through to the next rule).
6. Save. The rule joins its chain and starts matching new movements straight away.

### Edit or deactivate a rule
1. Select a rule to open its detail, then choose **Edit** to change any of its criteria, filters, or
   actions.
2. To stop a rule matching new items without deleting it, choose **Deactivate**. Existing matches and
   alerts are kept; the rule simply stops running. (Rules are deactivated rather than hard-deleted so
   your configuration history stays intact.)

### Organise rules into chains
1. From a workflow, open its **rule chains**.
2. Create a chain with a **name** and the number of **required steps** that make it complete, then
   assign rules to it. A new chain starts inactive until it has at least one rule.
3. Rules run in the chain's order; reorder or **move a rule to another chain** to change how the
   engine sequences them.
4. If a chain's steps don't yet form a valid sequence, it's flagged as **degraded** with a short
   explanation — open it, review the listed rules, and adjust them until the chain is valid.

![Conciliation criteria: rules table with a rule's match criteria expanded](../assets/screenshots/reconciliation-rules-criteria.png)

## Configuration
- **Operators available:** Equals, Range/tolerance, Sum equals.
- **Common criteria fields:** amount, reference, value date, partner, currency, personal/tax ID.
- **Conciliation type:** Single (item-to-item) or Batch (group-to-group).
- **Rule outcomes:** auto-reconcile, raise an alert, or pass to the next rule in the chain.

## AI Reconciliation Assistant (`In Preview` 👁️)
A **✨ Set up with AI** assistant builds the whole **workflow, chain and rules** from a plain-language
description ("reconcile PSP payins → internal payins → bank movements, matching on external/related IDs").
It **asks only what it needs** (match field & operator, Single or Batch, what to do on multiple matches),
**offers insights** (which rule should be the entry point, put the strictest hop first), and **runs
validations to raise warnings** — confirming the **topology is valid and connected**, there's a **single
entry point**, and flagging risks such as matching on IDs alone with no amount/tolerance criterion. It shows
a **topology diagram** and the drafted rules for review; you then create them Active or save them inactive to
fine-tune. The assistant drafts; you confirm, and it only ever produces a valid configuration.

## Tips & good practices
- Start from the **built-in workflows** and their rules, then tighten criteria as real exceptions
  appear.
- Put the **strictest, highest-confidence** rules first in a chain and looser tolerance rules later,
  so exact matches win before approximate ones.
- Keep tolerances realistic: too tight and good items fall through to manual matching; too loose and
  the engine mis-matches.
- Prefer **Deactivate** over deleting — it preserves the audit trail.

## Related
- [Reconciliation Overview](overview.md) — rules, chains, and the matching engine.
- [Matching](matching.md) — where items your rules didn't catch are resolved.
- [Workflows](workflows.md) — rules and chains live inside workflows.
- [Admin — Matching Rules](../10-admin-console/matching-rules.md) — the tenant-wide matching rules
  used across the platform (distinct from reconciliation criteria).
