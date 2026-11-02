# Journal Entries

> **Where to find it:** there is no Journal Entries screen, and the **G/L Posting** entry has been removed from Reporting › Operations. The entries generated in the past are described in [G/L Postings](gl-postings.md) and stay readable.
> **Who uses it:** accountants, financial controllers, treasury operations, approvers.
> **Permissions required:** `CashManagement.TransactionsPosting` · Read to view; approval rights follow your role. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
A **journal entry (JE)** is a complete, balanced accounting entry — its debit and credit lines
together — created for a treasury event. Where a [posting](gl-postings.md) is the accounting output
you view, the **Journal Entries** module is the workspace that generated entries from a workflow,
routed them through an approval flow, and exported them to your ERP.

**Treasury Hub no longer generates accounting entries, no longer approves them, and no longer sends
them to an ERP.** The processes behind each of those steps have been switched off; approving or
deleting an entry answers an error.

**Nothing has been deleted.** Every entry generated in the past, its status history, and its link to
the originating transactions are kept and remain readable — see [G/L Postings](gl-postings.md).

G/L posting is being rebuilt from scratch, together with reconciliation, as its own project. The
rest of this page describes how entries were produced and approved, so you can read the history you
have.

## Key concepts
- **Journal entry (JE)** — a balanced set of debit and credit lines for one accounting event, with a
  reference, a date, the entity, and a source module.
- **Journal entry generation** — creating the entry from a completed workflow (a payment, an FX
  deal, a loan disbursement, a reconciled item, and so on). This no longer happens.
- **Approval workflow** — the path an entry followed before it could be exported: who reviewed it,
  at how many levels, and under what thresholds.
- **Segregation of duties (SoD)** — approval rules that prevent the same person from both creating
  and approving an entry, a common regulatory requirement.

## How journal entries were generated
Journal entries were the accounting step of the platform's standard workflow model — see
[Core Concepts › Everything is a workflow](../00-getting-started/03-core-concepts.md#everything-is-a-workflow).
No part of this lifecycle runs today; it explains the entries you already have:

```
Ingestion → Reconciliation → Journal Entry generated → Approval → ERP export → ERP matched
```

1. **A workflow completed** in a module (for example a payment settled or an item was reconciled).
2. **An entry was generated**, using your [posting rules](coa-rules-engine.md) to pick the debit and
   credit accounts. Posting rules are frozen: nothing runs them any more.
3. **The entry was validated** — checked that it balanced and that its accounts mapped correctly.
4. **The entry was routed for approval** (see below).
5. **The approved entry was exported** to your ERP and, where possible, matched to an existing ERP
   record. Nothing is exported today.

## Journal entry statuses
An entry moved through these states. An existing entry stays in the state it reached, because
nothing advances it any more:

```
Draft → Pending Approval → Approved → Exported → Matched
              │
              ├─ Rejected
              └─ Escalated → Manual Review → Approved / Rejected
```

## The approval workflow
Entries are no longer approved: there is no Accounting blotter to work them in, and approving or
deleting an entry answers an error. The flow entries went through was:

1. Filter to entries **Pending Approval**.
2. Select an entry to see its debit/credit breakdown, the accounts it maps to, and its source
   transaction.
3. Choose **Approve** or **Reject**. A rejection or override required a justification.
4. Approved entries moved to **Exported** as they were sent to your ERP.
5. **Bulk approval** cleared batches of low-risk entries at once.

## Configuration
Because no entry is generated or approved, approval configuration changes nothing today. For
reference, and for the rebuild, approval workflows were described through natural-language prompts
(for example requiring dual approval above a set amount, restricting FX entries to the treasury
team, or routing small fee entries to a single approver). The dimensions were:

- **Approval levels** — single, dual, or n-level.
- **Roles / users** per level.
- **Thresholds** by amount, currency, transaction type, and entity.
- **Segregation-of-duties** rules.
- **Exceptions and overrides**, with a mandatory justification.
- **Notifications and SLAs** — per-channel alerts and time limits per approval level, with a
  pending-entry dashboard showing aging and priority.

## Tips & good practices
- See [G/L Postings](gl-postings.md) for what your existing entries contain and how to read them.
- An entry left at **Pending Approval** or **Approved** will stay there; it is not waiting on anyone.
- Make the accounting entry for new treasury activity in your accounting system until G/L posting
  is rebuilt.
- Keep the record of your approval thresholds and segregation-of-duties rules with your auditors —
  they describe the control framework the existing entries went through.

## Related
- [G/L Postings](gl-postings.md) — the postings that were generated, and what is kept of them.
- [Chart of Accounts & Rules Engine](coa-rules-engine.md) — the rules that built each entry.
- [End-to-end audit trail](audit-trail.md) — the immutable record behind every entry and approval.
- [Reconciliation Workflows](../04-reconciliation/workflows.md) — how approvals are modeled.
