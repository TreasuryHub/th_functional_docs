# Tags

> **Availability:** `Available` ✅
> **Where to find it:** Admin Console › Master Data › Tags
> **Who uses it:** administrators and treasury operations (typically Admin or Cash Manager).
> **Permissions required:** `CoreData.Tags` · Read+ (Create/Edit to add, edit, or bulk upload; Delete to remove).

## Overview
**Tags** are labels you attach to transactions to categorize them — for example by cost centre,
project, purpose, or counterparty type. Tags are managed centrally here so they stay consistent, and
they're reused across the platform: [matching rules](matching-rules.md) can apply a tag automatically,
and reporting can group and filter by tag. Clean, well-chosen tags make categorization automatic and
reports meaningful.

## Key concepts
- **Tag** — a reusable label with a **name** and an optional **description**.
- **Bulk upload** — creating many tags at once from a file, using a downloadable template.
- **Tagging via rules** — a [matching rule](matching-rules.md) can assign a tag automatically when a
  transaction meets its criteria.

## Before you start
- You need `CoreData.Tags` at **Read** to view, **Create/Edit** to add or upload, and **Delete** to
  remove.
- Agree a naming convention with your team first — consistent names keep reports clean.

## How to use it

### Create a tag
1. Go to **Admin Console › Master Data › Tags**.
2. Click **+ Add Tag**.
3. Enter a **name** and an optional **description** explaining when to use it.
4. Click **Save**. The tag is now available to matching rules, transactions, and reports.

> Tag names must be unique — a duplicate name returns an error.

### Edit or delete a tag
1. On the **Tags** grid, click a tag to **edit** its name or description, then **Save**.
2. To remove one, use the **Delete** action on its row and confirm. Check that no active
   [matching rule](matching-rules.md) still assigns it first.

### Bulk upload tags
1. On the **Tags** screen, click **Download template** to get the correctly formatted file.
2. Fill in one row per tag (name and description).
3. Click **Bulk upload**, then drag the file into the drop zone (or browse to it).
4. Review the **validation results** — Treasury Hub reports which rows succeeded and which failed, with
   the reason per failed row.
5. Fix any failed rows in the file and re-upload if needed.

### Export tags
- Click **Export** to download the current tag list to Excel/CSV.

## How tags are used across the platform
- **Matching rules** — a rule can automatically apply a tag to every transaction it matches; see
  [Matching Rules](matching-rules.md).
- **Transactions** — tags appear on transaction records and detail panels for categorization.
- **Reporting** — group, filter, and break down figures by tag.

## Tips & good practices
- Keep the tag list **short and purposeful** — a handful of well-defined tags beats dozens of
  overlapping ones.
- Use the **description** field so everyone applies each tag the same way.
- Prefer applying tags through **matching rules** for consistency at scale, rather than tagging by
  hand.
- Before deleting a tag, check it isn't referenced by an active matching rule.

## Related
- [Matching Rules](matching-rules.md) — apply tags automatically.
- [Master Data](master-data.md) — the wider reference-data picture.
- [Reconciliation Overview](../04-reconciliation/overview.md) — where tagged data is reconciled.
