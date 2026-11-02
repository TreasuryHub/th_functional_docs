# Reconciliation — ERP Posting

> **Where to find it:** there is no ERP Posting screen. Your reconciled items and their history are under
> **Reconciliation › Conciliations**; the accounting side is described in
> [G/L Postings](../11-accounting/gl-postings.md).
> **Who uses it:** finance team, accountants.
> **Permissions required:** reconciliation access · Read (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).

## Overview
ERP posting was the step that would turn confirmed reconciliations into accounting entries and send
them to your accounting system, grouped into **batches** by conciliation rule and date.

**Reconciliation does not post to your ERP.** The reconciliation module itself never carried out the
posting: it relied on the platform's [G/L posting](../11-accounting/gl-postings.md), which is now
switched off. No batch is prepared, no entry is generated, and nothing is sent to an accounting
system.

**Nothing has been deleted.** Your reconciliations, their approvals, the items inside them, and any
postings produced in the past are all kept and remain readable.

G/L posting is being rebuilt from scratch, together with reconciliation, as its own project. Until
then, reconciliation ends with the confirmed reconciliation itself, and the accounting entry is made
in your ERP.

## Key concepts
These terms appear in older records and hand-offs:

- **Batch** — a group of reconciled flows, identified by an ID (for example `ERP-0081`) and grouped
  by **conciliation rule** and **date**.
- **Batch type (SINGLE vs BATCH)** — whether the batch held one reconciled flow or several from the
  same rule and date.
- **Target ERP** — the accounting system a batch was destined for.
- **Posting status** — **Pending** (prepared, never sent) or **Posted**.

## What this means for you
- **Reconciliation itself is unaffected.** Matching, approvals, conciliations, movements, and the
  reconciliation dashboard all work as before — see [Reconciliation Overview](overview.md).
- **The accounting entry is yours to make.** Reconcile in Treasury Hub, then book the result in your
  ERP.
- **A batch left as Pending was never sent.** Treat it as a record of intent, not as something in
  your ledger.

## How to use it

### Follow a reconciliation through to your ledger
1. Open **Reconciliation › Conciliations** and find the reconciliation you need.
2. Open it to see the matched items, the amounts, and the rule that produced the match.
3. Use **Export** to take the list into your accounting process.
4. Book the entry in your ERP, and keep the conciliation ID with it so the two can be tied together
   later.

## Tips & good practices
- Agree with your accounting team which reconciliations they book and how they reference them, so
  the link between a conciliation and a ledger entry is not lost.
- Reconcile and approve as usual — a clean reconciliation history is exactly what the rebuilt
  posting will need.
- When reading an older report that mentions posted batches, check the posting history before
  assuming an entry reached the ledger.

## Related
- [Reconciliation Overview](overview.md) — the end-to-end reconciliation flow.
- [Reconciliation Requests (Approvals)](approvals.md) — where reconciliations are signed off.
- [Conciliations](conciliations.md) — the reconciled items themselves.
- [G/L Postings](../11-accounting/gl-postings.md) — the posting history and what stopped.
