# Balance Differential

> **Where to find it:** Reporting › Cash & Liquidity › Balance Differential
> **Who uses it:** treasurers, cash managers, finance teams, controllers.
> **Permissions required:** `CashManagement.CashPosition` · Read. See
> [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Balance Differential answers one question across your whole account estate: **how much did each
account move between two dates?** It lists every account once, with its balance on the first date,
its balance on the second date, and the difference — first in the account's own currency, then
converted into a single currency you choose so the group can be read as one number.

Unlike [Cash Position](../01-home/home-dashboard.md), which is a hierarchy you drill into, this is a flat grid
built for comparison and for export: one row per account, a total line, and an Excel file that looks
exactly like what you see on screen.

## Key concepts
- **Balance date 1 / Balance date 2** — two independent **as-of** points, not a date range. Each one
  resolves on its own to the balance in force on that day. The report never sums the days between
  them.
- **Difference** — always **date 2 minus date 1**. Positive differences are shown in green, negative
  ones in red. You may set date 1 after date 2 if you want to read the comparison the other way
  round; the arithmetic does not change.
- **Original currency** — the account's own currency, exactly as the balance is held.
- **Converted to <currency>** — the same three figures restated in the single currency picked in
  **Convert To**, so accounts in different currencies can be added up.
- **Exchange rate basis** — which rate does the converting. This is the choice that changes what the
  converted difference *means*; see
  [Choosing the exchange rate basis](#choosing-the-exchange-rate-basis).

## Choosing the exchange rate basis
The **Exchange rate** control offers two options, and the one you pick decides whether currency
movement is part of the answer or kept out of it. The grid header always states which basis produced
the figures on screen, and so does the Excel file.

| Option | How it converts | What the converted difference tells you |
|---|---|---|
| **Latest rate** | Both balances are converted at the most recent rate available — the same rate for both dates. | **How the balances moved, with exchange rates held constant.** A currency swing between the two dates cannot show up as a difference. |
| **Rate on each date** | Each balance is converted at the rate in force on its own date. | **The movement including the FX effect** — cash movement and currency movement together. |

**Latest rate** is the option selected when you open the screen.

Which one you want depends on the question you are answering:

- **Did we actually gain or lose cash?** Use **Latest rate**. An account whose balance did not move
  shows a difference of zero even if its currency moved against the converted currency, so every line
  that does show a difference is a real cash movement.
- **What happened to the reporting value of our cash?** Use **Rate on each date**. This is the basis
  that matches a consolidated position taken on each date independently — revaluation included — and
  it is the basis [Cash Position](../01-home/home-dashboard.md) uses for each of its columns.
- **Comparing the two runs** is itself informative: the gap between the two converted totals is, in
  effect, the currency effect over the period.

## The columns
One row per account, under three header groups:

| Header group | Columns |
|---|---|
| Account identification | **Company country**, **Account ID**, **Company**, **Institution**, **Account name**, **IBAN**, **Account country**, **Currency** |
| **Original currency** | **Balance** on date 1, **Balance** on date 2, **Difference** |
| **Converted to <currency>** | the same three columns, restated in the currency chosen in **Convert To** |

Each balance column shows the word **Balance** with its date underneath, so you can always see which
cut-off a figure belongs to.

**Two countries sit on every row, and they answer different questions.** **Company country** is
where the account's company is registered — the first column, and the one the **Countries** filter
matches. **Account country** is where the account's bank is, taken from the institution the account
is held with; it sits just before **Currency**. A Spanish company holding an account with a French
bank reads *Spain* in the first column and *France* in the second. Either column shows **—** when
the country is not known: a company without a country, or a bank that is not tied to a single one.
Read together they tell you where the cash belongs and where it physically sits, which is the
starting point for any question about trapped cash or cross-border exposure.

A **Total** row sits directly beneath the column headers and a second one at the foot of the grid, so
the total stays in view wherever you are in a long list. The total line names the converted currency
and the number of accounts behind it. **Only the converted columns are totalled** — the
original-currency columns hold a mix of currencies, so adding them would be meaningless and that
block is deliberately left blank on the total rows.

The grid is never paged: every account in the report arrives at once. Click any column header to sort
by it; rows with nothing in that column (no country, or an **N/A** amount) sort to the bottom in both
directions. On a wide enough window the amount columns stay pinned to the right while
the account columns scroll underneath them.

## When a figure is missing
Three situations change what a cell shows, and two of them change the totals. They are signposted on
the row rather than hidden, because anyone reading a total needs to know what is inside it.

- **The account had no balance on or before the date.** The cell shows **0**, faded. Hovering it says
  that there was no balance on or before that date. The row still counts towards the totals.
- **The balance used is older than the date you asked for.** The amount is underlined with a dotted
  line, and hovering it gives the date of the balance actually used. This is normal — a balance
  stands until the next one arrives — but it tells you whether you are reading a fresh figure or a
  stale one.
- **There is no exchange rate for the account's currency on one of the dates.** The converted cells
  show **N/A**, and **the row is left out of the totals entirely**. A note under the grid says how
  many accounts that affected, and the same note is written into the Excel file.

> **Read the note under the grid before you quote a total.** When accounts are excluded for want of a
> rate, the total is a partial total. The fix is to load the missing rates — see
> [Exchange Rates](exchange-rates.md) — and run the report again.

## Before you start
- Balances must be flowing in for the accounts you want to compare — see
  [Bank Accounts](bank-accounts.md), [Bank Statements](bank-statements.md), and
  [Integrations](../02-integrations/overview.md).
- Exchange rates must cover the currencies you hold, and must cover both dates if you intend to use
  **Rate on each date**. See [Exchange Rates](exchange-rates.md).
- You need `CashManagement.CashPosition` at **Read** — the same permission as
  [Cash Position](../01-home/home-dashboard.md).

## How to use it

### Compare every account's balance between two dates
1. Open **Reporting › Cash & Liquidity › Balance Differential**.
2. Check the two date fields. **Balance date 1** and **Balance date 2** open on the first and the
   last day of the previous month; change either to the cut-offs you want.
3. Pick the currency in **Convert To** — everything in the **Converted to** block restates into it.
4. Choose the **Exchange rate** basis: **Latest rate** or **Rate on each date** (see
   [Choosing the exchange rate basis](#choosing-the-exchange-rate-basis)).
5. Read the grid. Each row is one account; the **Difference** columns are the movement between the
   two dates, and the **Total** row gives the group figure in the converted currency.

Changing any control reloads the grid. The previous result stays on screen, dimmed, while the new one
loads, so the page never goes blank underneath you.

### Narrow the report to part of the group
1. Use the **Countries** selector to keep only accounts whose company is registered in those
   countries. It matches **Company country**, never **Account country**, so an account held abroad
   by one of those companies stays in the report.
2. Use **Company groups** to keep only the companies belonging to the groups you pick. A company can
   sit in more than one group, which is why group is a filter here and never a column.
3. Use **Companies** to pick individual companies. This list narrows itself to the companies that
   match the countries and groups you have already selected.
4. Combine as many as you need — the three filters apply together, and within one filter the values
   you pick apply as alternatives.
5. Click **Reset** to return every control, including the dates and the exchange rate basis, to its
   opening state.

If nothing matches, a short "No accounts" message replaces the grid and the export button is switched
off.

### Export the report to Excel
1. Set the dates, currency, exchange rate basis, filters and sort order you want to keep.
2. Click **Export to Excel** at the right of the toolbar.
3. An `.xlsx` file downloads, named after the report, the two dates and the converted currency.

The file is the screen, not a raw extract: the same columns, the same row order including your sort,
both total rows, and a header that records the two dates, the converted currency, which exchange rate
basis was used, which filters were applied, and when the file was generated. If any account was
excluded for want of a rate, that note is at the bottom of the sheet too.

## Configuration
The screen itself has nothing to set up — every control is a choice you make for the run in front of
you, and nothing is saved between visits. What the numbers depend on is maintained elsewhere:

- **Accounts** — which accounts exist comes from your [bank account master data](bank-accounts.md).
  Accounts that are closed, deleted, or held in more than one currency are not listed.
- **Balances** — maintained by your statement and balance feeds; see
  [Integrations](../02-integrations/overview.md).
- **Exchange rates** — see [Exchange Rates](exchange-rates.md). Their coverage is what decides
  whether a row converts or shows **N/A**.

## Tips & good practices
- For a month-end pack, leave the dates on their defaults: they already frame the previous month.
- Run the same period on both exchange rate bases. **Latest rate** shows you what moved; **Rate on
  each date** shows you what it is worth. The gap between the two totals is the currency effect, and
  it is usually the number someone asks about.
- Sort descending on the converted **Difference** to put the largest movements at the top — the
  quickest way to find the handful of accounts that explain a group-level change.
- Sort on **Account country** when the question is about where cash physically sits — which
  jurisdiction's banks hold it — and on **Company country** when the question is about which part of
  the group owns it. The two answers are rarely the same.
- Clear any **N/A** rows before circulating a report: load the missing rates and run it again, so the
  total covers every account.
- The account-identification columns are in the Excel file too, which makes the export
  straightforward to pivot or to join to your own account list.
- The balance and exchange-rate rules are deliberately the same as
  [Cash Position](../01-home/home-dashboard.md), so a figure here and a figure there should agree. If they do
  not, check the exchange rate basis first — it is the usual explanation.

## Related
- [Cash Position](../01-home/home-dashboard.md) — the same balance and exchange-rate rules, presented as a
  drillable hierarchy rather than a flat comparison.
- [Exchange Rates](exchange-rates.md) — the rates this report converts with.
- [Bank Accounts](bank-accounts.md) and [Bank Statements](bank-statements.md) — where the balances
  come from.
- [Reporting — Overview](overview.md) — the rest of the report library.
