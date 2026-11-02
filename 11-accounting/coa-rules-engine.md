# Chart of Accounts & Rules Engine

> **Where to find it:** there is no screen for posting rules. They were authored as **PostingRule** matching
> rules, whose menu entry has been removed, and their output is the [G/L posting](gl-postings.md) history.
> **Who uses it:** accountants, financial controllers, treasury operations.
> **Permissions required:** `CashManagement.TransactionsPosting` · Read. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Your **Chart of Accounts (CoA)** is the list of general-ledger accounts your organization posts to.
A **posting rule** decided, for each transaction, which of those accounts a
[posting](gl-postings.md) should debit and credit.

**Posting rules no longer run.** The process that evaluated them has been switched off, so no
transaction is mapped to accounts and no posting is produced. Editing a posting rule, or adding one,
changes nothing.

**Nothing has been deleted.** Your posting rules and the postings they produced are kept, so you can
still see how each type of transaction was booked.

G/L posting — the rules engine included — is being rebuilt from scratch, together with
reconciliation, as its own project.

## Key concepts
- **Chart of Accounts (CoA)** — the structured list of G/L accounts for a legal entity. Each account
  has a code, a name, a type, and a currency.
- **Account group** — a level of the CoA hierarchy (groups and sub-groups) that organizes accounts.
- **Multi-entity CoA** — each [company](../00-getting-started/03-core-concepts.md#company-structure)
  can have its own chart, so a group with subsidiaries in different countries keeps separate
  ledgers.
- **Accounting standard** — the framework a chart follows (for example IFRS, US GAAP, or a local
  standard such as Spain's PGC).
- **Posting rule** — a condition-to-account mapping: *when a transaction looks like this, post it to
  these accounts*.
- **Rule priority** — the order rules were evaluated in, so the most specific rule won when more
  than one could apply.

## How your existing posting rules read
A posting rule combines one or more **conditions** and names the **debit and credit accounts** for
the posting it produced. Conditions include:

- **Transaction type** — payment, collection, FX deal, fee, and so on.
- **Counterparty** — a specific bank, supplier, or customer.
- **Currency** or currency pair.
- **Entity (company)** — one subsidiary or all of them.
- **Amount range.**
- **Tags / custom metadata.**

When a transaction was processed, the rule with the highest priority whose conditions matched
decided the accounts. Reading an old posting alongside its rule tells you why it was booked the way
it was. The rules are kept exactly as they were last saved; none of them is evaluated any more.

## What this means for you
- **Account mapping now happens in your ERP, not in Treasury Hub.** Treasury activity reaches your
  ledger the way it did before Treasury Hub posted for you.
- **A gap in the rules no longer matters.** Nothing is posted, so nothing can be posted to the wrong
  account or land in an exceptions queue.
- **Keep your [master data](../00-getting-started/03-core-concepts.md#master-data) clean anyway** —
  companies, currencies, counterparties, and tags are used across the rest of the platform.

## Tips & good practices
- Keep a copy of your rule set with your period-close file: it documents the accounting policy
  behind every historical posting.
- When you reconcile the ledger one last time against Treasury Hub's postings, use the rules to
  explain any entry your accountants query.

## Related
- [G/L Postings](gl-postings.md) — the posting history these rules produced.
- [Journal Entries](journal-entries.md) — how full entries are generated and approved.
- [Matching Rules](../10-admin-console/matching-rules.md) — where posting rules were authored.
- [Core Concepts](../00-getting-started/03-core-concepts.md) — company structure and master data.
