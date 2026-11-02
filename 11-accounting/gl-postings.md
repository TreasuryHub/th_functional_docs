# G/L Postings

> **Where to find it:** the **G/L Posting** entry has been removed from Reporting › Operations, and its old
> link now opens **Reporting › Operations › Transactions**. Your posting history is kept and stays readable
> through the read-only transaction-postings endpoint of the Treasury Hub API.
> **Who uses it:** accountants, finance team, treasury operations, auditors.
> **Permissions required:** `CashManagement.TransactionsPosting` · Read. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
A **G/L posting** is the accounting record a treasury transaction produced — the debit and credit
lines meant for your general ledger.

**Treasury Hub no longer generates G/L postings, and no longer sends them to an ERP.** The processes
that created postings, dispatched them, and tracked their status have all been switched off.
Postings can also no longer be approved or deleted; those actions answer an error.

**Nothing has been deleted.** Every posting ever created, its status history, and its link to the
underlying transactions are kept and remain readable.

G/L posting is being rebuilt from scratch, together with reconciliation, as its own project. This
page describes what your existing posting records mean, so you can read the history and hand it
over with confidence.

## Key concepts
- **Posting** — the accounting entry created for a transaction, expressed as a **debit and credit
  account** for the amount.
- **PostingRule** — the rule that generated a posting and decided which accounts it was booked to.
  Posting rules are frozen: they no longer run. See [Chart of Accounts & Rules
  Engine](coa-rules-engine.md) and [Matching Rules](../10-admin-console/matching-rules.md).
- **Debit Acct / Credit Acct** — the general-ledger accounts a posting was booked to.
- **Posting status** — where a posting stood when generation stopped.

## What your posting records contain
Each posting record carries:

| Field | Shows |
|---|---|
| **Booking Date** | The date the posting was booked. |
| **Company** | The legal entity the posting belongs to. |
| **Account** | The account the underlying transaction relates to. |
| **Debit Acct** | The general-ledger account debited. |
| **Credit Acct** | The general-ledger account credited. |
| **Amount** | The posting amount. |
| **Matching Rule** | The **PostingRule** that generated the posting. |
| **Remittance Info** | The remittance message carried by the transaction. |
| **Status** | Where the posting stood in its lifecycle. |

## Posting statuses
Statuses are frozen as they were when posting stopped — none of them will change on their own any
more.

| Status | Meaning |
|---|---|
| **Generated / Pending** | The posting was created but never confirmed in the ledger or ERP. |
| **Posted** | The posting was recorded and confirmed in the ERP. |
| **Mismatch / Exception** | The posting could not be matched or was rejected downstream. |

> Any figures, account codes, or counterparties you see in demo screens are illustrative. Your
> records hold your own transactions and your own chart of accounts.

## What this means for you
- **New treasury activity produces no accounting entries in Treasury Hub.** Book it in your ERP as
  you did before Treasury Hub posted for you.
- **A posting left in Generated / Pending will stay there.** It was never confirmed downstream;
  treat it as an entry that did not reach your ledger.
- **Changing a posting rule has no effect**, because nothing runs the rules.
- **Reconciliation itself is unaffected.** Matching, approvals, and conciliations continue as
  before; only the accounting entries that used to follow them have stopped — see [Reconciliation —
  ERP Posting](../04-reconciliation/erp-posting.md).

## Tips & good practices
- Take an extract of your posting history and keep it with your period-close file, so the record is
  where your auditors expect it.
- Reconcile your ledger against the last **Posted** entries once, so you know exactly where Treasury
  Hub's contribution to the ledger ends.
- Tell your accounting team the cut-off date, so nobody waits for entries that are not coming.

## Related
- [Chart of Accounts & Rules Engine](coa-rules-engine.md) — how postings were mapped to accounts.
- [Journal Entries](journal-entries.md) — how full entries are generated and approved.
- [End-to-end audit trail](audit-trail.md) — the immutable history behind every posting.
- [Reconciliation — ERP Posting](../04-reconciliation/erp-posting.md) — the reconciliation side of
  posting.
- [Matching Rules](../10-admin-console/matching-rules.md) — the rules that produced postings.
