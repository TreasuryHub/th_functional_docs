# Chart of Accounts & Rules Engine

> **Map every transaction to the right accounts, automatically**
>
> **Why it matters**
> - **Coding stops being manual**: write the mapping once and every later transaction of that shape books itself.
> - **Consistent across the group**: each entity keeps its own chart and its own standard, and the same rule set applies to all of them.
> - **Explainable**: every posting names the rule that produced it, so "why was this booked here?" has a written answer.

> **Where to find it:** [CONFIRM: menu path — PM to supply]
> **Who uses it:** accountants, financial controllers, treasury operations.
> **Permissions required:** `CashManagement.TransactionsPosting` · Read. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Decide once how each kind of treasury activity is booked, and let every transaction after that code
itself. Your **Chart of Accounts (CoA)** is the list of general-ledger accounts your organization
posts to, and a **posting rule** decides, for each transaction, which of those accounts a
[posting](gl-postings.md) debits and credits.

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
- **Rule priority** — the order rules are evaluated in, so the most specific rule wins when more
  than one could apply.

## Before you start
- Have your chart of accounts loaded for each entity you post for, and know which accounting
  standard each one follows.
- Keep your [master data](../00-getting-started/03-core-concepts.md#master-data) current —
  companies, currencies, counterparties and tags are what rule conditions match on.
- Decide rule priority deliberately: the most specific rule needs the highest priority, or a broad
  rule will catch transactions before it.

## How to use it

### Write a posting rule
A posting rule combines one or more **conditions** and names the **debit and credit accounts** for
the posting it produces. Conditions include:

- **Transaction type** — payment, collection, FX deal, fee, and so on.
- **Counterparty** — a specific bank, supplier, or customer.
- **Currency** or currency pair.
- **Entity (company)** — one subsidiary or all of them.
- **Amount range.**
- **Tags / custom metadata.**

### Follow a rule to its postings
When a transaction is processed, the rule with the highest priority whose conditions match decides
the accounts. Reading a posting alongside its rule tells you exactly why it was booked the way it
was — see [G/L Postings](gl-postings.md).

## Configuration
- **Per entity** — each company can carry its own chart and its own rule set.
- **Priority order** — set the specific rules above the general ones.
- **Coverage** — a transaction that matches no rule produces no posting, so review what falls
  through and write the rule it needs.

## Tips to get more value
- Start with the transaction types that make up most of your volume: a handful of rules usually
  covers the bulk of the month's coding, so the exceptions are all that reach a person.
- Keep a copy of your rule set with your period-close file — it documents the accounting policy
  behind every posting you made.
- Re-check coverage after a new bank, entity or product goes live, so new activity does not sit
  uncoded while everyone assumes it is handled.

## Where to go next
- [G/L Postings](gl-postings.md) — see exactly how every transaction hit your ledger.
- [Journal Entries](journal-entries.md) — route the entries these rules build through approval and
  out to your ERP.
- [Matching Rules](../10-admin-console/matching-rules.md) — the tenant-wide rules that tag and post
  transactions automatically.
- [Core Concepts](../00-getting-started/03-core-concepts.md) — understand company structure and
  master data once, and every rule you write makes sense.
