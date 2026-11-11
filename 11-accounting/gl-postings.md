# G/L Postings

> **Journals with evidence, posted to your ERP after approval**
>
> **Why it matters**
> - **Less re-keying**: every treasury transaction arrives in your ledger as a debit and a credit, built by rule rather than typed by hand.
> - **Evidence on every entry**: each posting stays linked to the transaction that produced it and the rule that mapped it, so a question about any line is answered in one click.
> - **A continuous close**: entries are drafted as the activity happens, not gathered in the last week of the month.
>
> *For the CFO: the ledger and the treasury system agree by construction, and every number in the close carries its own trail back to a bank movement.*

> **Where to find it:** [CONFIRM: menu path — PM to supply]
> **Who uses it:** accountants, finance team, treasury operations, auditors.
> **Permissions required:** `CashManagement.TransactionsPosting` · Read. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Hand your accountants a ledger that is already written: a **G/L posting** is the accounting record a
treasury transaction produces — the debit and credit lines meant for your general ledger, with the
transaction and the rule behind them attached.

Postings are generated from your [posting rules](coa-rules-engine.md), approved, dispatched to your
ERP, and followed until the ERP confirms them. Every action governed, every number traced.

## Key concepts
- **Posting** — the accounting entry created for a transaction, expressed as a **debit and credit
  account** for the amount.
- **PostingRule** — the rule that generates a posting and decides which accounts it is booked to.
  See [Chart of Accounts & Rules Engine](coa-rules-engine.md) and
  [Matching Rules](../10-admin-console/matching-rules.md).
- **Debit Acct / Credit Acct** — the general-ledger accounts a posting is booked to.
- **Posting status** — where a posting stands in its lifecycle, from generated to confirmed.

## Before you start
- You need `CashManagement.TransactionsPosting` · Read to view postings.
- Your [chart of accounts and posting rules](coa-rules-engine.md) decide which accounts each
  transaction maps to. A transaction with no matching rule produces no posting.
- Your ERP connection carries the approved entries onward — see
  [NetSuite (ERP Integration)](../02-integrations/netsuite-erp.md).

## How to use it

### Read a posting
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
| **Status** | Where the posting stands in its lifecycle. |

### Follow a posting to your ledger
Statuses tell you how far an entry has travelled:

| Status | Meaning |
|---|---|
| **Generated / Pending** | The posting is created and waiting to be confirmed in the ledger or ERP. |
| **Posted** | The posting is recorded and confirmed in the ERP. |
| **Mismatch / Exception** | The posting could not be matched or was rejected downstream. Work these first. |

> Any figures, account codes, or counterparties you see in demo screens are illustrative. Your
> records hold your own transactions and your own chart of accounts.

## Configuration
- Posting rules are maintained in [Chart of Accounts & Rules Engine](coa-rules-engine.md); changing
  a rule changes how later transactions map.
- Approval and dispatch behaviour is covered in [Journal Entries](journal-entries.md).

## Tips to get more value
- Work the **Mismatch / Exception** status first thing in the close, so a rejected entry is fixed
  while the underlying transaction is still fresh.
- Take an extract of your posting history into your period-close file, so the evidence sits where
  your auditors expect to find it.
- Review which transactions produce no posting at all: each one is a rule you have not written yet,
  and writing it removes that line from next month's manual work.

## Where to go next
- [Chart of Accounts & Rules Engine](coa-rules-engine.md) — map every transaction to the right
  accounts automatically, so postings need no manual coding.
- [Journal Entries](journal-entries.md) — route entries through approval and out to your ERP with
  segregation of duties enforced.
- [End-to-end audit trail](audit-trail.md) — answer any auditor's question about a posting with an
  immutable record.
- [Reconciliation — ERP Posting](../04-reconciliation/erp-posting.md) — turn reconciled items into
  accounting entries with no re-keying.
- [Matching Rules](../10-admin-console/matching-rules.md) — the tenant-wide rules that tag and post
  transactions by rule.
