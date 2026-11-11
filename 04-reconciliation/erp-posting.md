# Reconciliation — ERP Posting

> **Reconciled items become accounting entries with no re-keying**
>
> **Why it matters**
> - **The close follows the reconciliation**: once an item is confirmed, its accounting entry is prepared for you rather than typed again in another system.
> - **Batched the way you work**: entries are grouped by conciliation rule and date, so what reaches your ERP matches how you reconcile.
> - **Traceable both ways**: every batch keeps its link to the reconciled flows inside it, so a ledger entry can always be opened back to the movements it came from.

> **Where to find it:** [CONFIRM: menu path — PM to supply]. Your reconciled items and their history are
> under **Reconciliation › Conciliations**; the accounting side is described in
> [G/L Postings](../11-accounting/gl-postings.md).
> **Who uses it:** finance team, accountants.
> **Permissions required:** reconciliation access · Read (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).

## Overview
Stop re-keying what you have already matched: ERP posting turns confirmed reconciliations into
accounting entries and sends them to your accounting system, grouped into **batches** by
conciliation rule and date.

It is the step that joins reconciliation to the ledger — the reconciled flow on one side, the
[G/L posting](../11-accounting/gl-postings.md) on the other, with the link between them kept.

## Key concepts
- **Batch** — a group of reconciled flows, identified by an ID (for example `ERP-0081`) and grouped
  by **conciliation rule** and **date**.
- **Batch type (SINGLE vs BATCH)** — whether the batch holds one reconciled flow or several from the
  same rule and date.
- **Target ERP** — the accounting system a batch is destined for.
- **Posting status** — **Pending** (prepared, not yet sent) or **Posted**.

## Before you start
- The reconciliation has to be confirmed first: posting works from confirmed reconciliations, not
  from provisional matches. See [Reconciliation Requests (Approvals)](approvals.md).
- Your [posting rules](../11-accounting/coa-rules-engine.md) decide which accounts each entry books
  to.
- Your ERP connection carries the batches onward — see
  [NetSuite (ERP Integration)](../02-integrations/netsuite-erp.md).

## How to use it

### Follow a reconciliation through to your ledger
1. Open **Reconciliation › Conciliations** and find the reconciliation you need.
2. Open it to see the matched items, the amounts, and the rule that produced the match.
3. Check the posting status on the batch it belongs to — **Pending** means prepared, **Posted**
   means confirmed downstream.
4. Keep the conciliation ID with your ledger reference, so the two can be tied together later.

### Work the exceptions
A batch that stays **Pending** longer than usual is the one to look at: either the reconciliation
behind it is not confirmed, or the entry has not been accepted downstream. Open it from
[G/L Postings](../11-accounting/gl-postings.md) to see which.

## Configuration
- **Grouping** follows the conciliation rule and date; the rule set is maintained on
  [Rules & Criteria](rules-and-criteria.md).
- **Account mapping** is configured in
  [Chart of Accounts & Rules Engine](../11-accounting/coa-rules-engine.md).

## Tips to get more value
- Agree with your accounting team which reconciliations they expect to see posted and how they are
  referenced, so nothing is booked twice.
- Clear **Pending** batches before period end, so the close is not held up by an entry that never
  left.
- Reconcile and approve promptly — the cleaner the reconciliation history, the less there is to
  explain when the ledger is reviewed.

## Where to go next
- [Reconciliation Overview](overview.md) — reconcile most items automatically and focus on the real
  exceptions.
- [Reconciliation Requests (Approvals)](approvals.md) — keep a human check on borderline matches
  without slowing the flow.
- [Conciliations](conciliations.md) — answer "how was this reconciled?" in one click.
- [G/L Postings](../11-accounting/gl-postings.md) — see exactly how every transaction hit your
  ledger.
