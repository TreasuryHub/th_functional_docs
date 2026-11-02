# G/L Postings (Reporting)

> **Where to find it:** the **G/L Posting** entry has been removed from Reporting › Operations, and its
> old link now opens **Reporting › Operations › Transactions**. The posting records described here are
> kept and stay readable through the read-only transaction-postings endpoint of the Treasury Hub API.
> **Who uses it:** accountants, finance teams, controllers, auditors.
> **Permissions required:** `CashManagement.TransactionsPosting` · Read. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
This page describes the reporting-side view of **G/L postings** — the debit/credit records that
mapped a transaction to your general ledger, each showing which ledger accounts were debited and
credited and the rule that produced it.

**Treasury Hub no longer generates G/L postings, and no longer sends them to an ERP.** The processes
that created postings, dispatched them, and tracked their status have all been switched off, so no
new posting arrives to be reported on. The report screen itself has been removed from the menu.

**Nothing has been deleted.** Every posting ever created, the accounts it was booked to, its status
history, and its link to the underlying transactions are kept and remain readable.

G/L posting is being rebuilt from scratch, together with reconciliation, as its own project. Until
then, treat your postings as a closed set of historical records: this page explains what they
contain so you can read them and hand them over.

## Key concepts
- **Posting** — the debit/credit record created for a transaction, mapping it to ledger accounts.
- **PostingRule** — the rule that generated the posting and decided which ledger accounts a given
  transaction was booked to. Each posting names its rule in the **Matching Rule** field. Posting
  rules are frozen: nothing runs them any more. See
  [Matching Rules](../10-admin-console/matching-rules.md).
- **Debit Acct / Credit Acct** — the two accounts of each entry.
- **Status** — where a posting stood when generation stopped (for example generated, posted to the
  ERP, pending, or a mismatch). Statuses no longer change, because nothing advances them.

## What a posting record contains
Each posting record carries:

| Field | Shows |
|---|---|
| **Booking Date** | The date the posting was booked. |
| **Company** | The legal entity the posting belongs to. |
| **Account** | The account the underlying transaction relates to. |
| **Debit Acct** | The general-ledger account debited. |
| **Credit Acct** | The general-ledger account credited. |
| **Amount** | The posting amount. |
| **Matching Rule** | The **PostingRule** that produced the posting. |
| **Remittance Info** | The remittance message carried by the transaction. |
| **Status** | Where the posting stood when generation stopped. |

## How to use it

### Read the history
1. Open **Reporting › Operations › Transactions** — the screen the old G/L Posting link now
   opens — to work with the movements the postings were generated from.
2. For the posting records themselves, see [Accounting — G/L Postings](../11-accounting/gl-postings.md),
   which describes what is kept and how to read it.
3. If you need a period's postings as a file for your auditors, ask your administrator to pull them
   from the read-only transaction-postings endpoint of the Treasury Hub API.

## Tips & good practices
- Read a posting's **Status** as the state it was in when generation stopped, not as something that
  is still moving — a **Pending** posting will stay pending.
- Keep an exported copy of the periods your auditors still need, rather than relying on anyone
  having system access later.
- A transaction with no posting is not an error to chase: no transaction has been posted since
  generation was switched off.

## Related
- [Accounting — G/L Postings](../11-accounting/gl-postings.md) — the accounting side of the same
  records, and what is kept.
- [Transactions](transactions.md) — the movements these postings were generated from, and where the
  old G/L Posting link now takes you.
- [Operations blotters](operations-blotters.md) — the other operational reporting grids.
- [Reconciliation — ERP Posting](../04-reconciliation/erp-posting.md) — the reconciliation side,
  which no longer posts to an ERP either.
