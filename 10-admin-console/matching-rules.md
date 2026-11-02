# Matching Rules

> **Where to find it:** the **Matching Rules** entry has been removed from the menu. Its old link now
> opens **Settings › Ingestion › Transaction Tagging › Classification rules**, the screen that replaces it.
> **Who uses it:** administrators, treasury operations, and bookkeepers looking at how transactions were
> classified or posted in the past.
> **Permissions required:** `CoreData.MatchingRules` · Read. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
A **matching rule** was a tenant-wide rule that, when a transaction met its conditions, either
assigned a [tag](tags.md) to it or created a G/L posting for it.

**Matching rules are no longer applied to transactions.** The process that evaluated them no longer
runs, so no rule tags a transaction or produces a posting any more — including a rule you create or
edit today, which has no effect.

**Nothing has been deleted.** The rule definitions, the tags those rules assigned, and the postings
they produced are all kept, and the transactions that carry them read exactly as before.

Automatic classification of transactions is now done by the **tagging module**, under **Settings ›
Ingestion › Transaction Tagging** — **Tags**, **Classification rules**, and **Classification
conflicts**. G/L posting is being rebuilt from scratch, together with reconciliation, as its own
project; see [G/L Postings](../11-accounting/gl-postings.md).

## Key concepts
You still meet these terms when you look at historical records:

- **Matching rule** — a scoped definition of what was done with the transactions it covered.
- **Implementation** — the rule's type, which decided what it produced:
  - **PostingRule** — created the G/L postings (ledger entries) for matching transactions.
  - **TagAssignmentRule** — assigned [tags](tags.md) to matching transactions.
- **Scope** — the filters that decided which transactions a rule covered: **Company Group, Company,
  Institution, Account, Currency**, and the **From Date / To Date** validity window.
- **Order** — the sequence number that decided which rule was evaluated first when more than one
  could apply.
- **Active / Inactive** — a flag on the rule. It no longer changes anything: neither state runs.

## What this means for you
- **New transactions are not tagged by these rules.** If you still need a transaction classified
  automatically, recreate the rule as a **classification rule** in the tagging module.
- **No new G/L postings are generated.** Postings that already exist stay readable; see [G/L
  Postings](../11-accounting/gl-postings.md).
- **Changing a legacy rule changes nothing.** Creating, editing, re-ordering, activating, or
  deactivating a matching rule has no effect on any transaction.
- **Your history is intact.** Tags assigned by these rules in the past remain on the transactions,
  and the Transactions list shows them alongside tags from the tagging module.

## Where to read the history
1. Open **Reporting › Operations › Transactions**.
2. Add the **Tags** column, or open a transaction's detail panel, to see the tags it carries — both
   the ones assigned by legacy matching rules and the ones assigned by the tagging module.
3. Filter or group by tag as usual, and use **Export** to take the list away for analysis.

The matching-rule definitions themselves are retained, but they no longer have a screen of their
own.

## Tips & good practices
- Go through the matching rules your organization relied on and recreate the ones you still need as
  classification rules in the tagging module — do not assume an existing rule is still doing its
  job.
- Treat the historical tags as reference data: they describe how a transaction *was* classified,
  which may differ from how the tagging module would classify it today.
- When an old report or hand-off refers to a rule name, look for the same name among your
  classification rules rather than assuming it is still running.

## Related
- [Tags](tags.md) — the legacy labels these rules applied, and where the tag history is now read.
- [Reconciliation — Rules & Criteria](../04-reconciliation/rules-and-criteria.md) — the separate
  reconciliation rules that decide how two movements are matched; these are unaffected.
- [G/L Postings](../11-accounting/gl-postings.md) — the postings a PostingRule used to create.
- [Companies & Company Groups](companies-and-groups.md) — the scope entities rules referenced.
