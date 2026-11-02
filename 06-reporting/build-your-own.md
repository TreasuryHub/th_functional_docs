# Build Your Own Report

> **Where to find it:** Reporting › Build your own report
> **Who uses it:** treasurers, FP&A, finance teams, controllers — anyone who needs a report that is not in the library.
> **Permissions required:** Read on the data the report draws on; a report only ever shows the companies and accounts you are entitled to see. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Build Your Own Report is where you define a report yourself: what it draws on, how it is grouped,
what it measures, how it is filtered, and how it is displayed. You save it as a **template**, and
every time it is run — by you or on a schedule — it produces a **run** against current data.

There are two ways in. The **editor** describes a report in business terms and covers most of what
teams ask for. **Advanced mode** opens the same report in the full builder, where you work with the
field catalog, several joins, formulas and the generated query. A report moves from one to the
other without being rebuilt.

## Key concepts
- **Template** — the saved definition of a report: its source, groupings, measures, filters,
  parameters, output and schedule. Editing a template does not change runs already taken.
- **Run** — one execution, with the parameter values it used, the row count, the grain, how long it
  took, who ran it and whether it was ad-hoc or scheduled. A run keeps a **snapshot** of the
  template, so it stays readable even after the template changes.
- **Source** — the business area a report starts from: **Transactions**, **Account statement**,
  **Balances** or **Reconciliations**.
- **Dimension** — something you group or slice by: a company, a currency, a category, a date.
- **Measure** — a number that aggregates: an amount, a count, an average.
- **Grain** — the level one row of the result represents. The builder resolves it and tells you
  what it settled on.
- **Join context** — the same table brought into a report more than once, each copy with its own
  filters, so a single report can hold "balance at the start" beside "balance at the end".
- **Parameter** — a named value the report asks for when it runs, such as *From* and *To*.
- **Semi-additive measure** — a balance. Balances are not summed over time: the builder takes the
  last one per account, then sums across accounts.

## Before you start
- Know the question before the layout. The source you pick decides which fields are available.
- Have the period in mind. Balances and account statements default to the current month;
  transactions and reconciliations to the year to date.
- Know whether anyone else will run it. A report that others will use wants **parameters** rather
  than fixed dates.

## How to use it

### Start a report
1. Open **Reporting › Build your own report**. The library lists your templates — their source,
   output type, schedule and last run — and the most recent runs beneath.
2. Choose **New report**, then pick the **source**:

   | Source | What it covers |
   |---|---|
   | **Transactions** | PSP, internal and external pay-ins and pay-outs, payment orders and bank movements, each with its cashflow category and tag. |
   | **Account statement** | Every statement line of an account, one row per movement, with the balance after each movement. |
   | **Balances** | The balance at the start and the end of the period, and the variation between them. |
   | **Reconciliations** | Matching columns — left, right and difference — and reconciliation KPIs. |

3. Or start from a **quick start**, which opens a working report you then adjust: cashflow by
   company and category, the movements of one account, opening versus closing balance,
   reconciliation KPIs by company, or match detail.

You can duplicate or delete a template from the library at any time.

### Build it in the editor
The editor has three shelves and a period picker, and the result updates as you work.

1. **Group by** — drag in the dimensions that define a row. Every source groups by **Group,
   Company, Account, Currency, Country** and **Bank** in any combination, plus its own fields: the
   transaction type, category, tag, PSP, direction and status for transactions; the workflow, rule,
   match status and automatic-or-manual flag for reconciliations.
2. **Show** — drag in the measures. Transactions offer the count, amount, inflows, outflows, net and
   average ticket; balances offer opening, closing, variation and variation %; reconciliations offer
   the reconciled and pending counts and amounts, % reconciled, average days open and % automatic.
   Most come in a **USD** form and an **original currency** form.
3. **Filter** — drag in any field and set its condition.
4. Set the **period**: this month, last month, the last 30 days, year to date, specific dates, or
   everything. *From* and *To* can be left changeable at run time.
5. Save. The report appears in the library and can be run, scheduled or opened in advanced mode.

Add **one row per transaction**, **per movement** or **per match** to drop from a summary to the
underlying detail.

### Show a field without grouping by it
Drop a field such as the category, the tag or a description onto **Show** rather than **Group by**.
It becomes a text column: each row shows its value, or *n values* where a summary row covers
several. This is how you carry a label through a report without it splitting the rows.

### Read a running balance
On **Account statement**, **Balance after the movement** is a running total, not an aggregate: the
account's last balance before *From*, plus each movement in date order, restarting for each account.
Its USD form converts at each movement's own day rate and brings the **exchange rate** used along
with it, so a converted statement can be checked line by line.

### Add a calculated field
1. Choose to add a calculated field in the editor.
2. Pick **two values** and an operation — subtract, add, multiply, divide, *% of*, or Δ%.
3. Name it. Any value the calculation needs is added to the report automatically.

For anything beyond two values, write a formula — see [Formulas](#write-a-formula).

### Work in advanced mode
**Advanced mode** hands the same report to the full builder. Nothing is lost, and the Viewer, its
runs and its schedule keep working.

**The field catalog** on the left is organised by domain — financial events, accounts,
reconciliation workflows and tagging — as a tree of parent, child and subtype entities. Each entity
shows where its data comes from and, behind its ⓘ, its underlying table and how it relates to the
others. Fields are marked as **dimensions** or **measures**, with balances flagged as
semi-additive. You can search the catalog, pull in fields from any related entity, and create,
edit and delete calculated fields from the same panel.

**The shelves** are **Dimensions**, **Measures** and **Filters**. Drag a field in, or use the
buttons on it. A measure dropped on Dimensions is redirected to Measures; a dimension dropped on
Measures becomes a distinct count. Chips reorder by dragging and move between shelves.

**Click a chip** for that column's options:
- its **label**, which can interpolate a parameter — `Balance at {From}`;
- its **aggregation** — sum, average, min, max, count, distinct count, or **last by date**;
- its **date granularity** — exact, day, week, month, quarter or year;
- its **sort**;
- its **join context**;
- **Compare with…**, which adds Δ and Δ% columns against another measure.

### Let the builder settle the grain
When a report combines a **parent with its child**, the builder asks once how to group them, and
shows the row count each answer would produce:

- **summarise by parent** — one row per parent;
- **hierarchical** — expandable rows with subtotals;
- **detail by child** — one row per child.

The answer is saved with the template, and you are only asked again if the combination of entities
changes. A band at the top of the report shows the current mode and lets you change it there and
then.

Fields from **sibling** entities — balances beside transactions, say — are combined without asking,
by drill-across, so no row is counted twice.

### Use the same table twice
When you add a measure from a table the report already uses, the builder asks **same join or a new
one?** A new join gets its own row — t1, t2 — which you rename, and filters dropped on that row
apply to that join alone. Each join is filtered and aggregated separately, then combined on the
report's dimensions.

This is what makes a side-by-side report possible: balance at one date against balance at another,
or this month's transactions against last month's, grouped by a field of the duplicated table
itself.

### Filter
A filter's operators follow the kind of field:

| Field | Operators |
|---|---|
| Date | last N days, between, ≥, ≤, empty, not empty |
| Category | is one of (searchable), is not, =, ≠, empty, not empty |
| Number or amount | ≥, ≤, >, <, between, =, ≠, empty, not empty |
| Boolean | is yes / no |
| Text | contains, =, ≠, is one of, empty, not empty |

Any value can be **fixed or bound to a parameter**, and a new parameter can be created from the same
selector. A filter on an aggregate formula is applied after aggregation. A filter on an entity
**below** the report's grain becomes "has at least one"; a filter on a **sibling** is applied through
the common parent.

### Use parameters
1. Create a parameter and give it a type — date, number or text.
2. Give it a default: fixed, or **relative** — today, yesterday, start or end of this month, start
   or end of last month, start of year, end of last year. A relative default is resolved on every
   run, which is what makes a scheduled report keep up.
3. Use it as a filter value, in a column label as `{Name}`, or in the report's description.

### Write a formula
Formulas reference a field as `[entity.field]`, another formula by `[Name]`, and a column of the
report as `[@Column]`.

They support arithmetic and comparison operators, `AND / OR / NOT`, and functions for aggregation
(`SUM`, `AVG`, `MIN`, `MAX`, `COUNT`, `COUNTD`, `LAST`, `FIRST`), logic (`IF`, `COALESCE`), numbers
(`ABS`, `ROUND`, `DIV`, which returns nothing rather than dividing by zero), dates (`DATEDIFF`,
`YEAR`, `MONTH`) and text (`CONCAT`, `UPPER`, `LOWER`, `CONTAINS`).

The editor validates as you type, works out whether the formula is **per row**, **an aggregation**
or **across columns**, shows a sample value under the current filters, and lets you insert fields,
formulas and columns with a click. A formula's format can be a number, a currency, a percentage or
text. A formula that references another inherits its kind.

### Choose the output
**Table, Pivot, Bars, Stacked bars, Lines, Area, Pie** or **KPI**, each with its own options — the
x-axis or slices, the series, the pivot's columns, totals and a row limit.

- **Table** is flat or hierarchical, with expandable groups, subtotals, sortable columns, a totals
  row, and negatives in red.
- **Pivot** crosses rows by one dimension in columns. Its row, column and grand totals are
  **re-queried at their own grain**, never summed from the cells on screen, so they stay correct
  with averages, distinct counts and balances.
- **Charts** carry a legend and tooltips, use a fixed colour order that follows the entity rather
  than its rank, and group everything past the eighth series into "Other". Bars turn horizontal past
  eight non-date categories. A pie shows up to six slices plus "Other". A chart showing fewer
  dimensions than the result is re-queried at its own grain.
- **KPI** gives one card per measure, for the filtered period.

### Check what it will actually do
Beside the preview, two tabs show the report rather than describe it: **the query** it would run,
with one block per join and its parameters, and **the definition**, the template as saved. The
preview also reports the resulting grain, how many rows came back, how many were read, and how long
it took.

### Read the builder's notices
The builder says what it did and what it ignored, rather than silently producing a wrong number.

In **red**, what would be wrong: a child field used while summarising by parent, a dimension that
does not exist in every join, or amounts in different currencies added in one row.

In **blue**, what it did for you: adding a subtype's type filter, resolving a drill-across or a
many-to-many, turning a filter into a "has at least one", or hiding a total because it would mix
currencies.

### Schedule it
Set a daily, weekly or monthly frequency with a time, the recipients and the delivery format — PDF,
Excel, CSV or a link. The next three executions are listed, and you can simulate one, which is
recorded as a run with a scheduled trigger.

### Run it and read the result
The **Viewer** asks for the report's parameters — a date picker and a relative selector for dates,
and a control for every exposed filter — and **Run** produces an ad-hoc run.

Each run shows its id, how it was triggered, when it ran, how long it took, who ran it, how many
rows it returned and at what grain, and the parameter values and filters it resolved to. The run
history sits alongside, and opening an old run shows it against **its own** snapshot; if the
template has changed since, the Viewer says so. The same notices as the builder explain how the
numbers were reached, and the result exports to CSV.

## Configuration
- **A report never widens your access.** It is built and run against the data you are already
  entitled to, so two people can run the same template and read different totals.
- **Amounts come in two forms.** A USD measure is converted; an original-currency measure is not.
  Group or filter by currency when you use the second, or the builder will warn you and hide the
  total.
- **Relative parameter defaults** are what a scheduled report should use. A fixed date will go stale
  the day after you set it.

## Tips & good practices
- **Start in the editor, move up when you need to.** Advanced mode exists for several joins,
  formulas and the field catalog — not for ordinary reports.
- **Use a quick start as a worked example.** It is faster to adjust a report that already runs than
  to assemble one from an empty canvas.
- **Read the grain the builder reports.** Most surprising totals are a grain question, and the
  parent/child band tells you which answer is in force.
- **Reach for a second join** when you catch yourself wanting the same measure at two dates or over
  two periods. That is what it is for.
- **Expose the dates as parameters** on anything a colleague will open, so they do not have to edit
  the template to change the period.
- **Trust the re-queried totals.** A pivot total is computed at its own grain, which is why it can
  differ from adding up the cells you can see.
- **Take the red notices seriously.** They mark a number that would be wrong, not a style
  preference.

## Related
- [Reporting — Overview](overview.md) — the reports that already exist, before you build one.
- [Datalake Reports](datalake-reports.md) — the fixed datalake reports and how their figures differ.
- [Transactions](transactions.md) · [Balance Differential](balance-differential.md) ·
  [Category Positions](category-positions.md) — the standing reports over the same data.
- [Reconciliation — Conciliation Reporting](../04-reconciliation/conciliation-reporting.md) — the
  standing reconciliation report.
- [Data Exports](../03-data/data-exports.md) — pushing the same data to your own systems.
