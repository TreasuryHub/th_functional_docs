# Financial Events

> **Availability:** `Available` ✅ (shown **Active** in the platform)
> **Where to find it:** Data › Financial Events
> **Who uses it:** treasury operations, finance teams, data/IT owners, auditors.
> **Permissions required:** Data access (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).

## Overview
**Financial events** are the normalized records Treasury Hub creates when data is brought in and
committed — for example when a parsed file (via [file import / parsing templates](../02-integrations/file-import.md))
is turned into transactions and movements. The Financial Events screen is a **read-only** place to
see exactly what was created: every event, its status, its details, and its change history. It's your
audit window onto the raw output of ingestion, before and after it flows into the rest of the
platform.

## Key concepts
- **Financial event** — a single normalized record produced by ingestion (a movement, pay-in/pay-out,
  and so on), identified by a unique **UUID** and, where provided, an **External ID** from the source.
- **Status** — where the event is in its lifecycle. There are three:
  - **Pending** — captured, not yet booked.
  - **Booked** — accepted and reflected in the platform.
  - **Rejected** — not accepted (for example, failed a validation).
- **Type** — what kind of event it is (for example an internal pay-in or pay-out). The set of types
  is defined per organization and can grow over time, so you may see types specific to your setup.
- **Version history** — each event keeps a record of its snapshots over time, so you can see how its
  status and amounts changed.
- **Related events** — links between events that belong together (for example the two sides of a
  transfer), navigable from the detail panel.

## How to use it
### Browse and filter financial events
1. Go to **Data › Financial Events**.
2. The grid lists events with **UUID, Type, Status, External ID, Country, Amount, Version, Created,**
   and **Updated**, newest first.
3. Filter using the column headers:
   - **Created** — a date filter (equals / after / before / between).
   - **UUID** and **External ID** — exact-match text filters.
4. Page through results and adjust the page size as needed. Previous rows stay visible while a new
   page loads.

### Inspect a single event
1. Click a row to open the **detail panel**.
2. Review the full record: the common fields, related IDs, related events, multi-currency amounts, and
   the underlying payload.
3. Toggle **Show versions** to see the event's version history — each snapshot's version, status,
   original status, amount, and timestamp.
4. Click a **related-event** link to jump to that event (the list re-filters by its External ID).

## Tips & good practices
- Use Financial Events to **troubleshoot ingestion** — if something looks off downstream (in
  transactions or reconciliation), find the source event here and check its status and version history.
- Filter by **External ID** to trace a specific record from your source system end to end.
- **Rejected** events are the first place to look when an expected transaction didn't appear —
  the version history shows why.

## Related
- [Data Hub](data-hub.md) — bring data in and see what's stored.
- [File import / parsing templates](../02-integrations/file-import.md) — where many financial events originate.
- [Transactions](../06-reporting/transactions.md) — where booked events appear as transactions.
- [Reconciliation](../04-reconciliation/overview.md) — matching those movements against other sources.
