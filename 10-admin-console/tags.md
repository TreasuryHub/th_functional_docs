# Tags

> **Label every transaction your way, by cost centre, project or purpose**
>
> **Why it matters**
> - **Your categories, not the bank's**: one label set that matches how your business actually reports, applied across every account and entity.
> - **Applied by rule, not by hand**: [matching rules](matching-rules.md) attach tags as transactions arrive, so categorization keeps up with volume.
> - **Analysis that holds up**: grouping, filtering and export all work off the same tags, so a figure in a report traces back to the movements behind it.

> **Where to find it:** [CONFIRM: menu path — PM to supply]. Tags on your transactions are visible on
> **Reporting › Operations › Transactions**.
> **Who uses it:** administrators and treasury operations who own how transactions are categorized.
> **Permissions required:** `CoreData.Tags` · Read. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Give every movement a label that means something to your business: **tags** are labels attached to
transactions to categorize them — by cost centre, project, purpose, or counterparty type, for
example. You maintain the list, and [matching rules](matching-rules.md) apply them automatically to
the transactions that match.

## Key concepts
- **Tag** — a label with a name and an optional description.
- **Tag on a transaction** — the link between a transaction and a tag. One transaction can carry
  several.
- **Classification tag** — the equivalent in the [tagging
  module](../02-integrations/transaction-tagging.md), applied at ingestion time. The Transactions
  list shows both together, so you see a transaction's full categorization in one place.

## Before you start
- Agree the label set with whoever reads the reports. A tag that nobody groups by is upkeep without
  a payoff.
- Decide how tags will be applied — by [matching rule](matching-rules.md) for anything recurring,
  by hand only for the exceptions.
- You need `CoreData.Tags` to work with the list.

## How to use it

### Maintain the tag list
1. Create a tag with a name and, where it helps, a description of when it should be used.
2. Edit a tag's name or description as your reporting structure changes.
3. Upload a list in bulk when you are setting up, rather than typing them one at a time.

### Apply tags automatically
1. Open [Matching Rules](matching-rules.md) and create a **TagAssignmentRule**.
2. Set its scope — company group, company, institution, account, currency and validity window.
3. Name the tag it assigns, and set its order relative to competing rules.

### Read the tags on your transactions
1. Open **Reporting › Operations › Transactions**.
2. Show the **Tags** column, or select a row to open its detail panel.
3. Sort, group, or filter the grid to see how a period or an account was categorized.
4. Use **Export** to take the tagged list into Excel or CSV for analysis or an audit file.

## Configuration
- **Who can change the list** is controlled by `CoreData.Tags` — see
  [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).
- **How tags are assigned** is configured on [Matching Rules](matching-rules.md).

## Tips to get more value
- Keep the list short enough that people remember it. A dozen tags used consistently tell you more
  than fifty used occasionally.
- Name tags for what they describe rather than who asked for them, so the label still makes sense
  after a reorganization.
- Review untagged transactions once a month: each cluster is a rule you have not written yet, and
  writing it removes that work for good.

## Where to go next
- [Matching Rules](matching-rules.md) — apply tags automatically across the whole organization.
- [Transaction Tagging](../02-integrations/transaction-tagging.md) — classify at ingestion time,
  with AI-drafted rules and a conflicts inbox.
- [Category Positions](../06-reporting/category-positions.md) — see where your cash came from and
  where it went, grouped by the tags you set here.
- [Master Data](master-data.md) — clean reference data behind every figure.
