# Chart of Accounts & Rules Engine

> **Availability:** `In Preview` 👁️
> **Where to find it:** planned as the **G/L Entry Lifecycle** module (Reporting › Accounting) and the prompt-based **Rules Engine**. Today the posting rules that drive your G/L postings can be *viewed* on the live [G/L Postings](gl-postings.md) grid (Reporting › Operations blotters).
> **Who uses it:** accountants, financial controllers, treasury operations.
> **Permissions required:** `CashManagement.TransactionsPosting` · Read to view rules today (Create/Edit for the future rule-editing tools). See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

> 👁️ **In Preview.** This is in testing and available on request — contact Treasury Hub to enable it. This page describes how it works.

## Overview
Your **Chart of Accounts (CoA)** is the list of general-ledger accounts your organization posts to.
The **Rules Engine** is the logic that decides, for each transaction, which accounts a
[posting](gl-postings.md) should debit and credit. Together they turn treasury activity into correct
accounting entries automatically, rather than by hand.

Today you can **view the posting rules** that drive your G/L postings. Managing a full chart of
accounts inside Treasury Hub and building rules through natural-language prompts are **planned
capabilities** — described below in future tense so you know what is coming and what exists now.

## What's available today
- **Posting-rules grid.** The rules that map transactions to accounts are visible on the
  [G/L Postings](gl-postings.md) screen. You can filter, sort, and export them to see how each type
  of transaction is being posted.

Everything else on this page — multi-entity CoA management, prompt-based rule creation, dry-run
simulation, and conflict detection — is in preview. Check with your administrator for the current
status and what is enabled for your organization.

## Key concepts
- **Chart of Accounts (CoA)** — the structured list of G/L accounts for a legal entity. Each account
  has a code, a name, a type, and a currency.
- **Account group** — a level of the CoA hierarchy (groups and sub-groups) that organizes accounts.
- **Multi-entity CoA** — each [company](../00-getting-started/03-core-concepts.md#company-structure)
  can have its own chart, so a group with subsidiaries in different countries keeps separate,
  correct ledgers.
- **Accounting standard** — the framework a chart follows (for example IFRS, US GAAP, or a local
  standard such as Spain's PGC).
- **Posting rule** — a condition-to-account mapping: *when a transaction looks like this, post it to
  these accounts*.
- **Rule priority** — the order rules are evaluated in, so the most specific rule wins when more than
  one could apply.

*The steps below describe the intended experience once this is live.*

## How the Rules Engine decides accounts (planned)
A rule combines one or more **conditions** and produces the **debit and credit accounts** for the
posting. Conditions that will be available include:

- **Transaction type** — payment, collection, FX deal, fee, and so on.
- **Counterparty** — a specific bank, supplier, or customer.
- **Currency** or currency pair.
- **Entity (company)** — apply a rule to one subsidiary or to all.
- **Amount range.**
- **Tags / custom metadata.**

When a transaction is processed, the engine finds the highest-priority rule whose conditions match
and posts to the accounts that rule specifies. If **no rule matches**, the posting is planned to be
sent to an **exceptions queue** for manual review rather than posted incorrectly.

## Configuration (planned — In Preview 👁️)
These configuration tools are in preview. They are described here so you can plan; they are not
yet live.

### Build a chart of accounts (planned)
An AI accounting agent will let you create and maintain a chart through natural-language prompts —
for example asking it to create an IFRS chart for a new subsidiary modeled on the parent's chart,
or to add a new bank-fees account to a group. The agent proposes the change and **you review and
confirm it** before it takes effect (human-in-the-loop). The chart will be **versioned**, keeping a
timestamped history of every change and who made it (a user or the agent).

### Create a posting rule (planned)
You will be able to describe a rule in plain language — for example, that a particular bank's wire
fees should always post to a specific expense account — and the agent will draft the rule with its
conditions and accounts for you to confirm or adjust. The engine is planned to:

- **Order rules by priority** (adjustable directly or by prompt).
- **Detect conflicts and overlaps** between rules automatically.
- **Dry-run** a rule set against historical transactions so you can see the impact before activating.
- **Suggest additional rules** based on patterns it finds in your past activity.

Until these tools ship, posting rules are configured by the Treasury Hub team as part of your setup,
and you view the result on the [G/L Postings](gl-postings.md) grid.

## Tips & good practices
- Review the posting-rules grid periodically so you understand how each transaction type is being
  booked before month-end.
- Keep your [master data](../00-getting-started/03-core-concepts.md#master-data) — companies,
  currencies, counterparties, tags — clean; rules match on exactly these fields.
- When the dry-run tool arrives, always simulate a new rule against historical data before
  activating it in production.

## Related
- [G/L Postings](gl-postings.md) — where posting rules and their output are viewed.
- [Journal Entries](journal-entries.md) — how full entries are generated and approved.
- [Posting to your ERP](erp-integration.md) — mapping Treasury Hub accounts to your ERP's accounts.
- [Core Concepts](../00-getting-started/03-core-concepts.md) — company structure and master data.

## In Preview
- 👁️ **AI-assisted Chart of Accounts management** — multi-entity charts (IFRS / US GAAP / local
  standards) created and maintained through prompts, with full version history.
- 👁️ **Prompt-based Rules Engine** — natural-language rule creation, priority ordering, automatic
  conflict detection, and dry-run simulation against historical transactions.
