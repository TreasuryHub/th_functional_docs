# Matching Rules

> **Tag and post transactions automatically, by rule**
>
> **Why it matters**
> - **Classification without clicks**: a rule written once labels and books every transaction that matches it, across the whole organization.
> - **Scoped exactly**: company group, company, institution, account, currency and a validity window decide precisely which transactions a rule covers.
> - **Predictable order**: rules are evaluated in a sequence you set, so the specific case always beats the general one.

> **Where to find it:** [CONFIRM: menu path — PM to supply]
> **Who uses it:** administrators, treasury operations, and bookkeepers who decide how transactions are
> classified and posted.
> **Permissions required:** `CoreData.MatchingRules` · Read. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Write the rule once and stop touching the transactions it covers: a **matching rule** is a
tenant-wide rule that, when a transaction meets its conditions, either assigns a [tag](tags.md) to
it or creates a G/L posting for it.

Matching rules work across the whole organization, which makes them the place for policy that
should hold everywhere — how a fee is labelled, which account a collection books to — rather than
per-screen handling.

## Key concepts
- **Matching rule** — a scoped definition of what is done with the transactions it covers.
- **Implementation** — the rule's type, which decides what it produces:
  - **PostingRule** — creates the G/L postings (ledger entries) for matching transactions.
  - **TagAssignmentRule** — assigns [tags](tags.md) to matching transactions.
- **Scope** — the filters that decide which transactions a rule covers: **Company Group, Company,
  Institution, Account, Currency**, and the **From Date / To Date** validity window.
- **Order** — the sequence number that decides which rule is evaluated first when more than one
  could apply.
- **Active / Inactive** — a flag on the rule, so you can retire a pattern without losing it.

## Before you start
- Decide the scope first. A rule left at company-group level reaches every account beneath it, which
  is usually what you want for policy and rarely what you want for an exception.
- Know your [chart of accounts](../11-accounting/coa-rules-engine.md) if the rule will post, and
  your [tag](tags.md) list if it will classify.
- Plan the order. Put the narrow rules above the broad ones, or the broad one will catch the
  transactions first.

## How to use it

### Write a rule
1. Choose the **implementation** — **TagAssignmentRule** to classify, **PostingRule** to book.
2. Set the **scope**: company group, company, institution, account and currency, plus the **From
   Date / To Date** window the rule is valid for.
3. Set the **order** relative to the rules that could compete with it.
4. Name what the rule produces — the tag to assign, or the debit and credit accounts to post to.
5. Set it **Active**.

### Check what a rule did
1. Open **Reporting › Operations › Transactions**.
2. Add the **Tags** column, or open a transaction's detail panel, to see the tags it carries.
3. Filter or group by tag as usual, and use **Export** to take the list away for analysis.

Postings produced by a **PostingRule** are read on [G/L
Postings](../11-accounting/gl-postings.md), where each one names the rule behind it.

## Configuration
- **Scope entities** come from [Companies & Company Groups](companies-and-groups.md) and your bank
  account register.
- **Tags** are maintained on [Tags](tags.md).
- **Accounts** for a PostingRule come from your [chart of
  accounts](../11-accounting/coa-rules-engine.md).

## Tips to get more value
- Review your rule order whenever you add a narrow rule, so the exception you just wrote actually
  gets a chance to fire.
- Deactivate rather than delete a pattern you no longer need, so the history of how transactions
  were classified stays explainable.
- Check which transactions carry no tag at all: each group of them is a rule worth writing, and
  writing it takes that work off someone's desk permanently.

## Where to go next
- [Tags](tags.md) — the labels these rules apply, and how to maintain them.
- [Transaction Tagging](../02-integrations/transaction-tagging.md) — classify at ingestion time, so
  transactions arrive already labelled.
- [G/L Postings](../11-accounting/gl-postings.md) — see exactly how a PostingRule hit your ledger.
- [Chart of Accounts & Rules Engine](../11-accounting/coa-rules-engine.md) — map every transaction
  to the right accounts automatically.
- [Companies & Company Groups](companies-and-groups.md) — model your group once, and every rule
  scope resolves correctly.
