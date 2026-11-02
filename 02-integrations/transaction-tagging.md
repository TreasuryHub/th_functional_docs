# Transaction Tagging

> **Where to find it:** Settings › Ingestion › Transaction Tagging — **Tags**,
> **Classification rules**, **Classification conflicts**
> **Who uses it:** cash managers, treasury operations, finance teams, and administrators.
> **Permissions required:** `CoreData.Tags` · Read to see tags, rules and conflicts · Create/Edit to
> classify transactions, manage tags and rules, and resolve conflicts. See
> [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Transaction Tagging is how you say what each bank movement actually **is**. Every transaction
carries one **category** from a catalogue the platform maintains, and any number of **tags** — the
labels your own organization invents. You set both by hand from the Transactions screen, or you
write **classification rules** that set them automatically as transactions arrive.

Because the catalogue is shared, a classified transaction means the same thing everywhere: it is
what [Category Positions](../06-reporting/category-positions.md) adds up when it answers "what did
the money go to, and where did it come from". Tags are yours alone, so you can cut the same figures
by cost centre, project, country or anything else you care about.

When two rules want to put the same transaction in two different categories, the disagreement is not
silently resolved and forgotten: it is collected in the **Classification conflicts** inbox, grouped
so that thousands of transactions become a handful of decisions.

## Key concepts
- **Nature** — the top level of the catalogue: **Operating**, **Investing** or **Financing**.
  Reporting adds **Unclassified** for movement nobody has categorized yet.
- **Category** — one entry of the platform's catalogue of 44 categories, each inside a nature and a
  group (for example Operating · Payroll › *Net payroll*). Categories carry business meaning, so the
  list is fixed and you cannot add to it. **A transaction has exactly one category, or none.**
- **Tag** — a label your organization creates, such as "Payroll Peru" or "Checked". A tag carries no
  business meaning and a transaction can carry **any number** of them.
- **Classification** — a transaction's category plus its tags, together with where they came from.
- **Manual classification** — a classification a person set. **No rule ever overwrites it.**
- **Classification rule** — a named set of conditions that assigns one category and any number of
  tags to every transaction that matches.
- **Version** — what a rule *does* (its category, tags and conditions) is versioned. Changing any of
  them saves the next version; renaming the rule or editing its description does not.
- **Oldest rule wins** — when several rules match the same transaction, the oldest one classifies
  it.
- **Conflict** — a transaction an older rule already classified, which another rule also matches
  with a **different** category. The transaction keeps what it has until somebody decides.
- **Retroactive run** — a rule created with *Also apply to existing transactions* also works back
  through transactions already booked. This is decided once, when the rule is created.

## Before you start
- You need `CoreData.Tags` at **Read** to see classifications, tags, rules and conflicts, and at
  **Create/Edit** to change anything. With Read only, the side panel is read-only and the
  Transactions grid shows neither the checkbox column nor the selection bar.
- Transactions must already be in the platform — see
  [Transactions](../06-reporting/transactions.md).
- Nothing has to be configured before you start: the category catalogue ships with the platform, and
  tags can be created on the spot from any tag picker.
- Agree a tag naming convention before people start inventing their own. Tag names must be unique,
  so "LATAM payroll" and "Payroll LATAM" will happily coexist and split your reporting in two.

## How to use it

### Classify one transaction
1. Open **Reporting › Operations › Transactions**.
2. Click the transaction's row. A side panel opens on the right, showing the amount, booking date,
   account, counterparty, remittance text and reference.
3. In the **Classification** section, open the **Category** picker. Type to search; the list is
   grouped by nature and group, so *Operating · Payroll* sits together.
4. Under **Tags**, choose **Add tag** and pick the tags you want. To use a label that does not exist
   yet, type the name and choose the **Create “…”** entry — the tag is created and attached at once.
5. Click **Save**. The panel confirms with *Classification saved*, and the origin line underneath
   now reads *Classified manually* with the date.
6. The panel then offers **Apply this to similar transactions?** — choose **Create rule** to turn
   what you just did into a rule, or **Not now** to dismiss it.

A category is required: tags on their own cannot be saved, and the panel reminds you to choose one.
If the category usually goes the other way — an inflow filed under *Net payroll*, say — an amber
line points it out. It is a warning, never a block: a salary refund really is an inflow under
payroll.

### Classify many transactions at once
1. In **Transactions**, tick the checkbox at the start of each row you want, or tick **Select page**
   in the bar above the grid to take every row on the current page.
2. The bar shows **N selected** along with **Classify**, **Create rule** and **Clear**.
3. Choose **Classify**. A dialog opens, titled *Classify N transactions*.
4. Set the **Category**. Leave it on **Keep each transaction's category** to change only the tags.
5. Pick the tags to attach under **Add tags**, and the tags to strip under **Remove tags**. A tag
   can be in one list or the other, never in both.
6. Click **Classify**. A message confirms how many transactions were classified, the selection
   clears, and any open side panel refreshes.

Everything you set this way is a manual classification, so no rule will change it afterwards. The
dialog handles up to **500** transactions at a time; above that the bar warns *At most 500 at once*
and **Classify** is unavailable. The selection is deliberately short-lived — it clears as soon as
you change the page, the page size, the filters or the sorting, so it can never act on rows you can
no longer see.

### Find what still needs classifying
1. In **Transactions**, open the filter on the **Category** column.
2. Choose **To review** to list the transactions that have no category yet, or pick one or more
   categories to see what has been filed where.
3. The **Tags** column next to it shows the tags each transaction carries.

### Create and manage tags
1. Go to **Settings › Ingestion › Transaction Tagging › Tags**. Each tag is listed with its colour,
   its description, how many transactions carry it, and, under **Applied by rules**, the rules that
   attach it — each a link to that rule.
2. Click **New tag**. Fill in **Name** and, optionally, **Description**, then pick one of the ten
   colours. Click **Create**.
3. To change a tag, click its row or the pencil, edit it and click **Save**. The new name or colour
   appears immediately everywhere the tag is shown — transactions, rules, pickers and the
   Transactions grid.
4. To remove a tag, click the bin. The confirmation spells out exactly what it touches: the tag
   disappears from the pickers, the transactions that carry it keep it, and any rule that attaches
   it stops doing so.

A name is required, at most 100 characters, and must be unique among your active tags regardless of
capitalisation; descriptions are limited to 500 characters. Deleting a tag frees its name for reuse.
Tags that have been deleted still show on the transactions that carry them, but the pickers no
longer offer them.

### Write a rule from transactions you already have
This is the quickest way to a good rule, because the editor can see the transactions you want it to
catch.

1. In **Transactions**, select the transactions the rule should match and click **Create rule** in
   the selection bar. Coming from the side panel instead, use **Create rule** in the *Apply this to
   similar transactions?* prompt — the category and tags you just chose travel with you.
2. The rule editor opens, pre-filled but not yet saved. While it works out a first draft of the
   conditions from what your transactions have in common — their direction, their counterparty and a
   couple of distinctive words — it says *Drafting conditions from the selected transactions…*.
3. Under the conditions, the panel **The N selected transactions in …** shows them side by side in
   one field at a time. Change the field with the picker next to the heading. Above the table, the
   editor summarises what the selection has in common in that field: *Same in all N*, *Words in all*
   (also highlighted inside each value), *All start with*, *All end with*, *Between* for amounts and
   dates, and the distinct *Values* of short lists such as direction or currency. The **Covered**
   column ticks the transactions your conditions already match.
4. Give the rule a **Name**, check its **Category** and **Tags**, and adjust the conditions until
   the preview reads the way you want.
5. To reach back over transactions already booked, switch on **Also apply to existing transactions**
   and set a **Booked from** date. This choice is available only while creating the rule.
6. Click **Save rule**. The rule is applied to the selected transactions straight away, and the
   confirmation says how many it classified and how many conflicts it left for review. **Save rule**
   and **Cancel** both return you to where you came from, with your filters as they were.

When a rule is applied to a selection, an unclassified match takes the rule's category and tags; one
already filed in the same category by another rule simply gains the tags; one an older rule put in a
different category raises a conflict; and anything a person classified by hand is left untouched.

### Build the conditions
1. Choose how the top-level group reads: **All of these**, **Any of these**, or **None of these
   (exclude)**.
2. Click **Condition** to add a test. Pick the field, the operator and the value.
3. Click **Exclusion group** to nest a group inside the current one — this is how a rule says "…but
   not when". Groups nest up to four levels deep, and each group needs at least one condition.
4. Remove a condition or a group with the cross at its right.

A rule can test the transaction's text — **Remittance information** and **Structured remittance**,
**Additional information** and **Structured additional information**, **Entry reference**,
**Creditor name** and **Debtor name**, **Ultimate creditor** and **Ultimate debtor**, **Bank
transaction code**, **Proprietary bank code**, **Purpose code**, **Type**, **End-to-end id** and
**Mandate id** — as well as **Amount (absolute)**, **Direction**, **Booking date**, **Value date**,
**Day of month (booking)**, **Currency**, and the account, company, company group and institution
the movement belongs to.

The operators on offer follow the field. Text fields take *contains*, *contains any of*, *does not
contain*, *is*, *is not*, *is one of*, *is none of*, *starts with*, *ends with*, *is empty* and
*matches pattern (advanced)*. Amounts and dates take *between*, *is*, *greater than*, *at least*,
*less than* and *at most*. Currencies and the account, company, company group and institution fields
take *is*, *is one of* and *is none of*; direction takes *is*.

### Read the live preview
The **Preview** panel under the conditions refreshes shortly after every change and tells you four
things before you commit to anything:

- **Coverage** — *Covers N of the M selected transactions*, naming the ones it misses, when the rule
  was started from a selection.
- **Reach** — how many of the most recent transactions would match. The panel labels this plainly as
  *A sample, not the whole history*, so read it as an order of magnitude rather than a count of
  everything the rule will ever touch.
- **Conflicts** — the other rules that also match those transactions with a different category, with
  a reminder that the older rule wins and the other raises a conflict to review.
- **Warnings** — for instance inflows landing in a category that is usually an outflow.

Anything invalid is reported on the condition it belongs to, so you can see which row to fix;
problems with the category or the tags are listed in the Preview panel itself. **Save rule** stays
unavailable until the rule has a name and a category.

### Manage the rules
1. Go to **Settings › Ingestion › Transaction Tagging › Classification rules**. Rules are listed
   oldest first — which is also the order in which they take precedence.
2. Each row shows the rule's **Name**, the **Category** and **Tags** it assigns, its **Version**, a
   **Status**, and an **Enabled** switch.
3. **Status** is where you see what a rule is doing beyond its definition: how its retroactive run
   is going (queued, *N reviewed, M classified…*, *Classified M existing transactions*, stopped or
   failed), and how many open conflicts it is part of, as a link into the conflicts inbox.
4. Turn the **Enabled** switch off to stop a rule classifying without deleting it.
5. Click a row, or the pencil, to edit the rule. Click **New rule** to start from an empty editor.
6. Use the bin to delete a rule. It stops classifying new transactions; everything it already
   classified keeps its category.

When you edit a rule, the editor reminds you that changes apply to new transactions only, and that
changing the category, tags or conditions saves the next version while what the rule already
classified keeps pointing at the version that did it.

### Review and resolve conflicts
The **Classification conflicts** entry in the menu carries a count of how many rule pairs currently
disagree, and the **Classification rules** page shows a banner summarising the same thing with a
link to the inbox. You do not have to go looking.

1. Open **Settings › Ingestion › Transaction Tagging › Classification conflicts**. Each card is one
   pair of rules, reading for example *Payroll (Net payroll) classified them; Suppliers (Supplier
   payment) also matches.* Both rule names link to their editor.
2. Under it, the card says how many transactions are affected and since when. A pair whose first
   disagreement is less than a day old is marked **New**.
3. Click the chevron to see the most recent transactions of the group, with their date, amount,
   counterparty and remittance text.
4. Decide for the whole group:
   - **Keep** — the transactions keep their current category and the conflicts close.
   - **Keep and don't warn again** — the same, and these two rules stop raising conflicts with each
     other from now on.
   - **Switch to** the other rule's category — every transaction in the group moves to that
     category, with that rule's tags. Because this touches them all, you are asked to confirm first.
     Switched transactions become manual classifications, so no rule changes them afterwards; the
     tags a person added are kept, the tags the previous rules added are not.
5. To decide one transaction rather than a whole pair, open it in **Transactions**: the side panel
   shows an amber banner naming the rule that also matches and the category it proposes, with
   **Keep** and a **Switch to** button for that transaction only.

The side panel is also where you see *why* a transaction has its category: the origin line reads
*Classified by rule*, with its name, version and a link to the rule, or *Classified manually* — each
with the date.

## Configuration
- **The category catalogue** is part of the platform: 44 categories across Operating, Investing and
  Financing, each in a group such as Collections, Payroll, Taxes, CapEx or Debt. You choose from it,
  you do not edit it.
- **Tags** are entirely yours — name, description and one of ten colours.
- **A rule** is defined by its name, optional description, the single category and the tags it
  assigns, its conditions, and whether it reaches back over existing transactions. Retroactivity is
  set only at creation; the **Enabled** switch and deletion are available at any time.
- **Conflict suppression** is a property of a *pair* of rules, set with *Keep and don't warn again*
  in the inbox. It is not offered on a single transaction.
- **Rules run on their own.** New transactions are classified automatically shortly after they
  arrive, and a retroactive run works through history in batches, so the **Status** column on the
  rules list moves while it progresses.

## Tips & good practices
- Start from real transactions. Selecting a handful and using **Create rule** gives you conditions
  drafted from what they actually share, and the **Covered** column tells you immediately whether
  the rule does what you think it does.
- Keep conditions as specific as the data allows. A rule matching a single common word will collide
  with everything you write later, and you will meet it again in the conflicts inbox.
- Because the **oldest** rule wins, write your broad fallback rules *after* the precise ones. A
  catch-all created early will quietly claim transactions a later, better rule was meant to catch.
- Use *Also apply to existing transactions* with a **Booked from** date rather than the whole
  history: it is quicker, and it leaves closed periods as they were.
- Classifying by hand is final by design. It is the right tool for the odd exception and the wrong
  one for a pattern that repeats — turn those into a rule instead.
- Keep the tag list short and deliberate. Tags with overlapping meanings make Category Positions
  harder to read, and the **Transactions** count on the Tags screen is a quick way to spot ones
  nobody uses.
- Deal with conflicts while they are new. One decision on a rule pair settles every transaction
  behind it, and letting them accumulate only makes the choice harder.
- After a round of reclassifying, use **Refresh now** on
  [Category Positions](../06-reporting/category-positions.md) rather than waiting for the nightly
  rebuild.

## Related
- [Category Positions](../06-reporting/category-positions.md) — net movement by Nature › Category ›
  Tag, built from these classifications.
- [Transactions](../06-reporting/transactions.md) — where you classify by hand, and where the
  Category and Tags columns live.
- [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md) — the `CoreData.Tags`
  permission that governs this module.
- [Core Concepts](../00-getting-started/03-core-concepts.md) — transactions, tenants and the shared
  vocabulary used here.
- [Admin Console — Overview](overview.md) — the rest of the configuration and reference-data areas.
