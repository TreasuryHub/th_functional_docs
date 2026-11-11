# Datalake Reports

> **Fast, plain answers straight from your consolidated data**
>
> **Why it matters**
> - **One question per screen**: how much you hold, how it moved, what happened on an account, where money came from and went.
> - **No conversion, no drill-down**: every figure stays in its own currency, which makes it quick and unambiguous.
> - **Filters, totals, chart, table**: the same shape every time, so there is nothing to learn twice.

> **Where to find it:** Reporting › Datalake › Cash position · Opening vs closing balance · Account
> statement · Cash flow
> **Who uses it:** treasurers, cash managers, finance teams, group controllers.
> **Permissions required:** no report-specific permission — these screens show every account of your
> organisation to anyone who can open them. See
> [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

> **In 60 seconds**
> 1. [See how much cash you hold on a date](#see-how-much-cash-you-hold-on-a-date).
> 2. [Compare the start and the end of a period](#compare-the-start-and-the-end-of-a-period).
> 3. [Read one account's statement](#read-one-accounts-statement) when a figure is queried.
> 4. [See where the money came from and went](#see-where-the-money-came-from-and-went).

## Overview
Get a plain answer out of your consolidated data without building anything: four screens read your
accounts, balances, statement movements and payment events out of TreasuryHub's reporting store and
answer one question each — **how much do we hold**, **how did
it move between two dates**, **what happened on this one account**, and **where did the money come
from and go**.

They are deliberately plain. Each screen is a strip of filters, a set of per-currency totals, a
chart and a table, with no conversion and no drill-down — every figure stays in the currency of the
account it belongs to. The note at the foot of each screen records that the figures are refreshed
once a night, so a screen read in the morning covers everything up to the previous day.

## Key concepts
- **Last balance up to a date** — a balance is never added up over time. For each account the screen
  takes the most recent balance recorded on or before the date you asked for, and that one figure
  stands for the account.
- **Which balance stands for a day** — when more than one balance was recorded for an account on the
  same day, the screens prefer a booked closing balance, then the bank's intraday or expected
  figure, then a balance supplied externally, then one entered by hand. A balance held in a currency
  other than the account's own never stands for the account.
- **Totals per currency** — amounts in different currencies are never added together. Every total is
  a separate card per currency, with the number of accounts or events behind it.
- **No currency** — an account with no currency recorded in TreasuryHub is grouped under
  **No currency**. Its card shows counts only, with a line explaining that those accounts may hold
  different currencies, so their amounts are not added up. The per-account rows still show each
  amount.
- **Booked movements** — the account statement and the cash flow count only movements and events the
  bank or the provider has booked. Pending items are left out.

## How these differ from Cash Position and Balance Differential
[Cash Position](../01-home/home-dashboard.md) and [Balance Differential](balance-differential.md) answer similar
questions from the live operational data, and they are the ones to quote in a pack. These four are a
different cut of the same underlying facts, and the differences change what a number means:

| | Cash Position · Balance Differential | Datalake reports |
|---|---|---|
| **Figures** | The live position, as it stands when you open the screen. | Refreshed once a night. |
| **Currency** | Converted into one display currency with your exchange rates, so the group reads as a single number. | Each account in its own currency; totals are per currency and never converted. |
| **Scope** | The companies and accounts you are entitled to see. | Every account of your organisation. |
| **Depth** | Drill-down from currency to the individual transaction, and an Excel export. | A chart and a table on screen, read as they are. |
| **Coverage** | Balances and the movements behind them. | Balances, statement lines **and** payment events — the cash flow screen has no counterpart elsewhere. |

A figure here and a figure in Cash Position will therefore differ whenever rates have moved, an
account sits outside your entitlements, or a balance has landed since last night's refresh. When the
two disagree, Cash Position is the live answer.

## Before you start
- Accounts and their balances must be flowing in — see [Bank Accounts](bank-accounts.md),
  [Bank Statements](bank-statements.md) and [Integrations](../02-integrations/overview.md).
- Give every account a **currency** in its master data. Without one it falls into the
  **No currency** group and its amounts are kept out of every total.
- The cash flow screen reads payment events, so it has something to show only for periods in which
  payments, collections or bank movements were processed.

## How to use it

### See how much cash you hold on a date
1. Open **Reporting › Datalake › Cash position**.
2. Set **As of**. The screen opens on today and reloads as soon as you change the date.
3. Read the cards along the top: one per currency, with the total balance and how many accounts it
   covers.
4. Read **Balance by company and currency** — one bar per company, one colour per currency. Bars of
   different currencies sit side by side rather than stacking, so nothing is added across
   currencies.
5. Read the table underneath: one row per account, with its group, company, currency, the date of
   the balance being used and the balance itself. Rows run by company group, then company, then
   account.

The **Balance date** column is the one to check when a figure looks stale — it is the day the
balance actually comes from, which may be earlier than the date you asked for.

### Compare the start and the end of a period
1. Open **Reporting › Datalake › Opening vs closing balance**.
2. Set **From** and **To**. These are two independent cut-offs, not a range: each one resolves on
   its own to the last balance up to that day.
3. Read the cards: per currency, the opening total, the closing total, the change and the change as
   a percentage. A fall is shown in red, a rise in green.
4. Read the table: one row per account, with its company and currency, the opening and closing
   balances, the difference and the percentage.

An account with no balance at all before **From** shows an empty opening and counts its whole
closing balance as the change. An account with no balance up to **To** does not appear at all.

### Read one account's statement
1. Open **Reporting › Datalake › Account statement**.
2. Pick the account from the **Account** list. Each entry shows the account name with its currency
   and company, so accounts with similar names stay apart.
3. Set **From** and **To**.
4. Read the summary bar: the **opening balance** and the date it comes from, the number of
   movements, total credits, total debits and the closing balance. When there is no balance at all
   before the period, the bar says so and the running balance starts from zero.
5. Read the chart — the balance after each movement, in date order, for the movements on screen.
6. Read the table: date, description, counterparty, amount and the balance after that movement.
7. Use **Previous** and **Next** to move through the movements; the counter beside them shows which
   of the total you are looking at. Changing the account or either date returns you to the first
   page.

### See where the money came from and went
1. Open **Reporting › Datalake › Cash flow**.
2. Set **From** and **To**.
3. Read the cards: per currency, the number of events, the inflow, the outflow and the net.
4. Pick a currency in the **Currency** list. The chart and the table below show that currency alone;
   the screen opens on the currency with the most events.
5. Read **Inflow and outflow by month** — two bars a month, inflow and outflow.
6. Read the table: one row per month, event type and company, with the number of events, the
   inflow, the outflow and the net. The types separate collections, pay-outs, payment orders and
   bank movements, so you can see which channel moved the money.

## Configuration
There is nothing to set up on these screens. Every control is a choice you make for the run in front
of you, and nothing is kept between visits. What the figures depend on is maintained elsewhere:

- **Which accounts appear** — your [bank account master data](bank-accounts.md). Accounts marked as
  deleted are left out, and the currency, company and company group on the account are what the
  screens group by.
- **Balances** — your statement and balance feeds; see
  [Integrations](../02-integrations/overview.md).
- **Statement movements** — see [Bank Statements](bank-statements.md) and
  [Transactions](transactions.md).

## Tips to get more value
- Check the **Balance date** on the cash position before circulating a number. An account whose feed
  has stopped keeps showing its last known balance, and the date is the only thing that gives it
  away.
- On **Opening vs closing balance**, read the change column first: a handful of accounts usually
  explains a group-level move.
- Keep an eye on the **No currency** card. It is the quickest way to spot accounts whose master data
  is incomplete, because they are exactly the accounts being left out of every total.
- Use the account statement to prove a cash position figure: the closing balance in the summary bar
  and the account's row on the cash position should tell the same story for the same date.
- Narrow the period before asking for a long statement. The screen pages through movements rather
  than loading a year at once, and a tight period is quicker to read as well as to load.

## Where to go next
- [Cash Position](../01-home/home-dashboard.md) — the live, converted, drillable position.
- [Balance Differential](balance-differential.md) — balances at two dates with currency conversion
  and an Excel export.
- [Bank Accounts](bank-accounts.md) · [Bank Statements](bank-statements.md) ·
  [Transactions](transactions.md) — where the accounts, balances and movements come from.
- [Reporting — Overview](overview.md) — the rest of the report library.
