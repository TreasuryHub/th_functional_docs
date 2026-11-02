# Reconciliation — Conciliation Reporting

> **Where to find it:** Reconciliation › Reporting › Conciliation Reporting (also listed as **Conciliation Reporting** under **Reporting › Operations**)
> **Who uses it:** treasury operations, finance team, accountants, auditors.
> **Permissions required:** reconciliation access · Read (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).

## Overview
Conciliation Reporting is the reconciliation workbook as a screen: what was reconciled in a period,
and what is still open. It is the same report Treasury Hub emails you as an Excel attachment — same
two sheets, same columns, same order — with filters on top and a button that downloads that exact
file. Use it to answer "what did we reconcile last week, and what is still outstanding?" without
waiting for the email or opening a spreadsheet.

## Key concepts
- **Conciliated** — one row per origin movement reconciled in the week, with its conciliation and
  the counterpart it was matched with.
- **Not Conciliated** — one row per origin movement that is still open, with no conciliation
  columns.
- **Origin movement** — the movement the row is about. On the Conciliated sheet the **Counterpart ·**
  columns describe the movement on the other side of the same conciliation.
- **The week** — the report always covers exactly seven calendar days (UTC), ending today or
  earlier. On Conciliated the week is read against the **conciliation date**; on Not Conciliated
  against the date the movement was **created**.
- **Difference** — the gap between the two sides of a conciliation. **Has Difference** filters the
  rows that carry one.
- **Cross currency** — a conciliation whose two sides are in different currencies.

## Before you start
- The report covers the flows your tenant runs. If a movement never entered a flow it is not in
  either sheet — see [Movements & Flows](movements-and-flows.md).
- Figures reflect what the engine, the approvals and manual matching have produced so far, so read
  a week that has had time to settle before treating it as final.

## How to use it

### Read the week
1. Open **Reconciliation › Reporting › Conciliation Reporting**. It opens on the **Conciliated**
   tab for the last seven days ending today, and the tab shows the week's total, for example
   *Conciliated (1,234)*.
2. Read the grid. Rows arrive 50 at a time; the columns scroll sideways and follow the workbook's
   own order and headers. Hovering a **Counterpart ·** header shows the workbook's own name for
   that column.
3. Switch to **Not Conciliated** for the movements still open. Rows are coloured by how far they
   are: red for a movement that is still **Pending** or **Pending approval**, yellow for the rest.
4. Sort by clicking a sortable header — Workflow ID, Workflow Name, Conciliation Date, Conciliation
   ID and Conciliation Amount on Conciliated; Workflow ID, Workflow Name, Movement Created On and
   Movement ID on Not Conciliated. Without a sort, rows come in the workbook's order.

### Move between weeks
1. Click **Previous week** or **Next week** to shift the window by seven days. The range in the
   middle shows the exact days covered.
2. **Next week** is unavailable once you are on the week ending today.
3. To jump, pick a day in **Week ending on**. The window becomes the seven days ending on that day;
   a day in the future lands on today.

### Narrow what you're looking at
1. Pick a **Workflow** to see one flow only, or leave it on **All workflows**.
2. Pick a **Movement Status** — Pending, Processed, Pending approval, Left partial, Right partial
   or Conciliated — to see the origin movements in that state in their flow.
3. Type in **External ID** to match any part of the external ID of the origin movement or, on the
   Conciliated sheet, of its counterpart.
4. Use the field dropdowns — Currency, Account, Merchant ID, Merchant Name, Partner ID, Partner
   Name, Payment Method ID, Payment Method and Original Status — to narrow by catalog values.
5. On **Conciliated** only, add **Conciliation Type** (Automatic, Manual or Request), **Cross
   Currency** and **Has Difference**.
6. Click **Clear filters** to drop them all. The tab and the week stay where they are.

Changing the tab, the week or a filter takes you back to the first page. Switching tabs also drops
the sort, because the two sheets sort on different columns.

### Download the workbook
1. Click **Export week**. The button reads *Exporting…* while the file is produced.
2. Your browser saves `Conciliation Report {from} to {to}.xlsx`, with both sheets.
3. The download is the whole week: the filters on screen narrow the grid, not the file.

## Configuration
The same workbook is emailed to your team on a schedule. Treasury Hub sets this up for your tenant:

- **Which report** — the conciliation workbook.
- **How often** — daily, weekly or monthly.
- **When** — a time of day, on a chosen weekday for a weekly schedule or a day of the month (1 to
  28) for a monthly one, read in the time zone set for the schedule.
- **Who receives it** — a list of email addresses per schedule, so someone can be on the weekly
  send without getting the daily one.
- **On or off** — a single switch turns every emailed report off for your tenant, and individual
  schedules and recipients can be switched off on their own.

Each email covers the period that ends at its scheduled moment — the previous day, the previous
seven days or the previous calendar month — so consecutive emails neither overlap nor leave gaps.
The subject names the report, your tenant, the frequency and the period. To change a schedule, its
time zone or its recipients, ask your Treasury Hub administrator.

## Tips & good practices
- Work the **Not Conciliated** tab first, reds before yellows: a red row is a movement nothing has
  matched yet, and it is the one most likely to be an exception worth chasing.
- Filter **Has Difference** on the Conciliated tab to find reconciliations that balanced only
  within a tolerance; they are where fees and rounding hide.
- Filter **Conciliation Type** to *Manual* to see how much your team is still matching by hand. A
  recurring shape there is a rule worth writing — see [Rules & Criteria](rules-and-criteria.md).
- Export the week when you need to share or archive it; the file is the same one your scheduled
  email carries, so a colleague reading the attachment sees exactly what you see.
- Dates and times in the grid are shown in UTC, as the workbook writes them. Keep that in mind when
  comparing against a local bank cut-off.

## Related
- [Reconciliation Overview](overview.md) — how the reports fit the end-to-end flow.
- [Conciliations](conciliations.md) — the live register behind the Conciliated sheet, where you can
  open a single reconciliation.
- [Matching (1-to-1 & Batch)](matching.md) — clear the open items this report lists.
- [Approvals](approvals.md) — the decisions behind the *Pending approval* rows.
- [Dashboard](dashboard.md) — the same picture as KPIs and trends rather than rows.
- [Fee Report](fee-report.md) — the other reconciliation report, on what your payment providers
  charge.
