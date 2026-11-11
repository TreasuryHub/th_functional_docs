# Journal Entries

> **A faster, continuous close: journals drafted, approved and exported**
>
> **Why it matters**
> - **The close starts itself**: entries are drafted as workflows complete, so month-end is a review rather than a build.
> - **Controls that hold**: thresholds, multi-level approval and segregation of duties decide who can sign what, on every entry.
> - **One trail from event to ledger**: each entry keeps its link to the transaction that caused it and the approver who released it.

> **Where to find it:** [CONFIRM: menu path — PM to supply]
> **Who uses it:** accountants, financial controllers, treasury operations, approvers.
> **Permissions required:** `CashManagement.TransactionsPosting` · Read to view; approval rights follow your role. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Turn a completed treasury event into a balanced accounting entry without anyone opening a
spreadsheet: a **journal entry (JE)** is a complete, balanced accounting entry — its debit and
credit lines together — created for a treasury event. Where a [posting](gl-postings.md) is the
accounting output you view, **Journal Entries** is the workspace that generates entries from a
workflow, routes them through approval, and exports them to your ERP.

## Key concepts
- **Journal entry (JE)** — a balanced set of debit and credit lines for one accounting event, with a
  reference, a date, the entity, and a source module.
- **Journal entry generation** — creating the entry from a completed workflow (a payment, an FX
  deal, a loan disbursement, a reconciled item, and so on).
- **Approval workflow** — the path an entry follows before it can be exported: who reviews it, at
  how many levels, and under what thresholds.
- **Segregation of duties (SoD)** — approval rules that prevent the same person from both creating
  and approving an entry, a common regulatory requirement.

## Before you start
- Your [posting rules](coa-rules-engine.md) decide which accounts each entry maps to; have them in
  place before you expect entries to generate.
- Agree your approval levels and thresholds with whoever owns the control framework, so the rules
  you configure match the policy you are audited against.
- You need `CashManagement.TransactionsPosting` · Read to view entries, and approval rights on your
  role to sign them.

## How to use it

### Follow an entry from event to ledger
Journal entries are the accounting step of the platform's standard workflow model — see
[Core Concepts › Everything is a workflow](../00-getting-started/03-core-concepts.md#everything-is-a-workflow).

```
Ingestion → Reconciliation → Journal Entry generated → Approval → ERP export → ERP matched
```

1. **A workflow completes** in a module (for example a payment settles or an item is reconciled).
2. **An entry is generated**, using your [posting rules](coa-rules-engine.md) to pick the debit and
   credit accounts.
3. **The entry is validated** — checked that it balances and that its accounts map correctly.
4. **The entry is routed for approval** (see below).
5. **The approved entry is exported** to your ERP and, where possible, matched to an existing ERP
   record.

### Read an entry's status
An entry moves through these states:

```
Draft → Pending Approval → Approved → Exported → Matched
              │
              ├─ Rejected
              └─ Escalated → Manual Review → Approved / Rejected
```

### Approve or reject an entry
1. Filter to entries **Pending Approval**.
2. Select an entry to see its debit/credit breakdown, the accounts it maps to, and its source
   transaction.
3. Choose **Approve** or **Reject**. A rejection or override requires a justification.
4. Approved entries move to **Exported** as they are sent to your ERP.
5. **Bulk approval** clears batches of low-risk entries at once.

## Configuration
Approval workflows are described through natural-language prompts — for example requiring dual
approval above a set amount, restricting FX entries to the treasury team, or routing small fee
entries to a single approver. The dimensions are:

- **Approval levels** — single, dual, or n-level.
- **Roles / users** per level.
- **Thresholds** by amount, currency, transaction type, and entity.
- **Segregation-of-duties** rules.
- **Exceptions and overrides**, with a mandatory justification.
- **Notifications and SLAs** — per-channel alerts and time limits per approval level, with a
  pending-entry dashboard showing aging and priority.

## Tips to get more value
- Set a threshold that sends routine, low-value entries to single approval and reserves dual
  approval for the ones that matter, so your controllers spend their time where the risk is.
- Watch the aging on the pending-entry dashboard, so an entry never holds up the close because
  nobody knew it was waiting.
- Keep your approval thresholds and segregation-of-duties rules with your audit file — they are the
  control framework every entry has passed through.

## Where to go next
- [G/L Postings](gl-postings.md) — see exactly how every transaction hit your ledger, with the rule
  that put it there.
- [Chart of Accounts & Rules Engine](coa-rules-engine.md) — write the mapping once and every later
  entry codes itself.
- [End-to-end audit trail](audit-trail.md) — an immutable record of every entry and approval, ready
  for audit.
- [Reconciliation Workflows](../04-reconciliation/workflows.md) — model the process that produces
  the entries in the first place.
