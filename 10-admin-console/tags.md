# Tags

> **Where to find it:** the legacy **Tags** entry has been removed from the menu. Its old link now opens
> **Settings › Ingestion › Transaction Tagging › Tags**, the screen that replaces it. Tags already on your
> transactions stay visible on **Reporting › Operations › Transactions**.
> **Who uses it:** administrators and treasury operations working with historical categorization.
> **Permissions required:** `CoreData.Tags` · Read. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
**Tags** are labels attached to transactions to categorize them — by cost centre, project, purpose,
or counterparty type, for example. This page describes the **legacy tags**: the list that was
maintained under Admin Console › Master Data and applied by [matching rules](matching-rules.md).

**Legacy tags can no longer be created, edited, uploaded, or deleted.** Those actions answer an
error, and the rules that used to assign them [no longer run](matching-rules.md).

**Nothing has been deleted.** Every legacy tag and every transaction it was attached to is kept and
stays readable, so your past categorization and the reports built on it are unchanged.

Tagging is now done by the **tagging module**, under **Settings › Ingestion › Transaction Tagging**
— **Tags**, **Classification rules**, and **Classification conflicts**. The Transactions list shows
legacy tags and tags from the tagging module together, so you see a transaction's full history in
one place.

## Key concepts
- **Legacy tag** — a label with a name and an optional description, from the list maintained before
  the tagging module.
- **Tag on a transaction** — the link between a transaction and a tag. Those links are kept exactly
  as they were.
- **Classification tag** — the equivalent in the tagging module, and what new tagging uses.

## How to use it

### Read the tags on your transactions
1. Open **Reporting › Operations › Transactions**.
2. Show the **Tags** column, or select a row to open its detail panel. The tags listed include both
   legacy tags and tags set by the tagging module.
3. Sort, group, or filter the grid as usual to see how a period or an account was categorized.
4. Use **Export** to take the tagged list into Excel or CSV for analysis or an audit file.

### Set up tagging for new transactions
1. Open **Settings › Ingestion › Transaction Tagging › Tags** and create the tags you want to use.
2. Open **Classification rules** to decide which transactions get which tag.
3. Check **Classification conflicts** for transactions that more than one rule claims.

## Tips & good practices
- Rebuild only the tags you actually use. The move to the tagging module is a good moment to drop
  labels that no longer earn their place.
- Keep the legacy names in mind when reading older reports — a figure grouped by a legacy tag will
  not pick up transactions tagged by the new module unless you use the same name.
- Do not plan around editing the legacy list: it is read-only.

## Related
- [Matching Rules](matching-rules.md) — the rules that used to apply these tags, and what replaces
  them.
- [Master Data](master-data.md) — the wider reference-data picture.
- [Reconciliation Overview](../04-reconciliation/overview.md) — where tagged data is reconciled.
