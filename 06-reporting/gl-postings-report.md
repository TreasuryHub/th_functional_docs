# G/L Postings (Reporting)

> **See exactly how every transaction hit your ledger**
>
> **Why it matters**
> - **One place to answer "where did this book?"**: the debit account, the credit account and the rule behind them, for any transaction, on one row.
> - **Evidence for the auditor**: each posting stays joined to the movement that produced it, so a sampled entry is explained without a hunt.
> - **Coverage you can see**: the transactions that produce no posting stand out, which is how you find the mapping you still need.

> **Where to find it:** [CONFIRM: menu path — PM to supply]. The movements behind the postings are on
> **Reporting › Operations › Transactions**.
> **Who uses it:** accountants, finance teams, controllers, auditors.
> **Permissions required:** `CashManagement.TransactionsPosting` · Read. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Read your ledger impact straight from treasury, without exporting anything: this is the
reporting-side view of **G/L postings** — the debit/credit records that map a transaction to your
general ledger, each showing which ledger accounts were debited and credited and the rule that
produced it.

## Key concepts
- **Posting** — the debit/credit record created for a transaction, mapping it to ledger accounts.
- **PostingRule** — the rule that generates the posting and decides which ledger accounts a given
  transaction is booked to. Each posting names its rule in the **Matching Rule** field. See
  [Matching Rules](../10-admin-console/matching-rules.md).
- **Debit Acct / Credit Acct** — the two accounts of each entry.
- **Status** — where a posting stands (for example generated, posted to the ERP, pending, or a
  mismatch).

## Before you start
- You need `CashManagement.TransactionsPosting` · Read.
- The accounts a posting books to come from your [chart of accounts and posting
  rules](../11-accounting/coa-rules-engine.md).

## How to use it

### Read a posting record
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
| **Status** | Where the posting stands. |

### Trace a posting back to its movement
1. Note the **Account** and **Booking Date** on the posting row.
2. Open **Reporting › Operations › Transactions** and filter to that account and date to see the
   movement the posting was generated from.
3. The **Matching Rule** field names the rule that decided the accounts — open it on
   [Matching Rules](../10-admin-console/matching-rules.md) to see the conditions it matched on.

### Take a period away for audit
Pull a period's postings as a file through the transaction-postings endpoint of the TreasuryHub API,
or export the matching transactions from the Transactions grid.

## Configuration
- **Account mapping** is set in [Chart of Accounts & Rules
  Engine](../11-accounting/coa-rules-engine.md).
- **Which entries are dispatched** follows the approval flow on
  [Journal Entries](../11-accounting/journal-entries.md).

## Tips to get more value
- Filter to **Mismatch / Exception** first each close, so a rejected entry is fixed while the
  transaction behind it is still fresh.
- Keep an exported copy of the periods your auditors sample, so the evidence sits in your audit file
  rather than depending on system access later.
- Watch for transactions with no posting at all: each cluster is a posting rule worth writing, and
  writing it takes that coding off someone's desk for good.

## Where to go next
- [Accounting — G/L Postings](../11-accounting/gl-postings.md) — the accounting side of the same
  records, with the full lifecycle.
- [Transactions](transactions.md) — find any bank movement in seconds, including the ones behind
  these postings.
- [Operations blotters](operations-blotters.md) — one source of truth for every FX deal, loan and
  investment.
- [Reconciliation — ERP Posting](../04-reconciliation/erp-posting.md) — reconciled items become
  accounting entries with no re-keying.
