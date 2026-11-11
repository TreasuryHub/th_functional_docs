# Home — Cash Position Dashboard

> **See all your cash, in every bank and currency, the moment you log in**
>
> **Why it matters**
> - **No morning spreadsheet**: one consolidated position replaces the portal logins and the manual roll-up.
> - **Day by day**: a column per date over the range you choose, so you read the movement, not only the closing figure.
> - **Drill all the way down**: from the group total to the company, the account, and the transaction behind it.
>
> *For the CFO: the single number the board asks for, current, with every figure traceable to a bank movement.*

> **Where to find it:** Home
> **Who uses it:** treasurers, cash managers, finance teams, CFOs — anyone who needs to see where the money is.
> **Permissions required:** `CashManagement.CashPosition` · Read (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).

## Overview
See every bank, currency and entity the moment you sign in: Home is your landing page, and it gives
you a **real-time view of your organization's cash position** — how much money you hold, in which currencies, at which banks, across which
companies and countries — laid out as a single grouped table with a **column for each date** in the
range you choose, so you can read balances day by day.

Instead of logging into each bank portal and stitching balances together in a spreadsheet, you get
one consolidated, always-current picture the moment you open the platform. From here you can drill
into [Transactions](../06-reporting/transactions.md) when you need transaction-level detail.

![The Cash Position dashboard: module tabs, the date/currency/filter control row, and the grouped balance table with a column per date](../assets/screenshots/home-cash-position-dashboard.png)

## Key concepts
- **Balance** — the amount of money held, aggregated to whatever level you're looking at (a single
  account, a company, a currency, or the whole group).
- **Grouping hierarchy** — balances roll up through levels shown in the **Type** column:
  **Currency → Group → Country → Company → Bank → Account**. You expand or collapse levels to move
  between the big picture and a single account.
- **Date columns** — the table shows one column per date across the range you set, so you see each
  day's balance side by side.
- **Convert To (display currency)** — a single currency you pick so every balance on the page is
  converted into it for one comparable total; choose **None** to keep each account in its native
  currency. See [Core Concepts](../00-getting-started/03-core-concepts.md#company-structure) for how
  the Company Group › Company › Account hierarchy underpins these totals.

## Before you start
- At least one **bank account** must exist, with balance data. If none does, Home shows an empty
  state prompting you to **add an account or upload a statement** — see
  [Bank Accounts](../06-reporting/bank-accounts.md).
- To convert balances into a display currency, **exchange rates** must be loaded for the currency
  pairs involved (managed under Master Data / Exchange Rates).
- You need `CashManagement.CashPosition` at Read level. Without it, the Home menu item is hidden and
  you're routed to the first screen you can access.

## How to use it

### Read your consolidated cash position
1. Open **Home** from the sidebar (it's also where the logo takes you). The **Cash Position** tab is
   selected by default.
2. Read the balance table: the **Type** and **Name** columns on the left show each grouping level
   (Currency, Group, Country, Company, Bank, Account), and each **date column** to the right shows
   the balance on that day.
3. Use **Expand All** / **Collapse All** (or the ▸ arrows on a row) to open a currency down to its
   companies, banks and individual accounts — or roll everything back up.

### Change the time period
1. Set the **From** and **To** date fields in the control row at the top of the dashboard.
2. The table redraws with one **column per date** across that range.

### Focus on specific currencies, companies or banks
1. Use the **Currencies**, **Companies**, and **Banks** dropdowns in the control row to filter the
   table to just what you want to see.
2. Combine filters as needed; the totals recalculate to match your selection.

### See everything in one currency
1. Open the **Convert To** dropdown in the control row (next to the date fields).
2. Select a currency (for example, USD). Every balance and total re-renders **converted** into that
   currency, so you can compare across the group on a like-for-like basis.
3. To go back to seeing each account in its own native currency, choose **None**.

> If an account's currency has no exchange rate to your chosen display currency for the selected
> dates, that value is shown as a dash or an "FX unavailable" marker and is left out of the
> converted total, with a note — so a missing rate never silently distorts your figures.

### Add data or export
- Use **+ Add Account** and **Upload Statement** (top-right) to bring in more balances, and
  **Export** or **Print** to take the current view with you.

### Drill into the detail
For the movements behind a balance, open [Transactions](../06-reporting/transactions.md). To compare
two dates account by account, use [Balance Differential](../06-reporting/balance-differential.md); to
see what moved by category, use [Category Positions](../06-reporting/category-positions.md).

## Configuration
Home is view-only — you don't set data up here, you set it up upstream:

- **Accounts, companies and company groups** — configured in the [Admin Console](../10-admin-console/overview.md);
  the hierarchy you define there is exactly what the grouping tabs consolidate.
- **Exchange rates** — required for currency conversion; managed in Master Data.
- **Your view state** (chosen tab, grouping, date range, display currency) is remembered between
  visits, so Home opens the way you left it.

## Tips to get more value
- Set **Convert To** to your reporting currency so the headline total is immediately meaningful to
  management.
- Keep your **company structure and account list clean** — Home is only as accurate as the master
  data behind it (see [Core Concepts](../00-getting-started/03-core-concepts.md#master-data)).
- Expand to the **Bank** level to spot bank concentration, and read balances at the **Country** level
  to check cross-border exposure before it becomes a risk.
- If a currency total looks off, check for an **"FX unavailable"** marker — it usually means a
  missing exchange rate rather than a real cash movement.

## Personalized cockpit
Beyond the cash dashboard, Home is also a **personalized cockpit** organized around your roles,
across three further tabs:

- **Cockpit tab** — a personalized grid of KPIs, approval queue, featured reports and alerts,
  each tagged with the role that makes it relevant to you.
- **Performance tab** — a daily briefing, meeting prep, and progress against daily/weekly/
  monthly objectives.
- **Setup tab** — your work routines, built from the roles and workflows set up in the Admin
  Console.

The demo KPI figures and personas you may see are illustrative examples, not your data.

## Where to go next
- [Balance Differential](../06-reporting/balance-differential.md) — the same balances as a flat
  two-date comparison.
- [Category Positions](../06-reporting/category-positions.md) — what moved, by category.
- [Navigation & Your Workspace](../00-getting-started/02-navigation-and-workspace.md) — the sidebar,
  top bar, and shared grid behaviors.
- [Core Concepts](../00-getting-started/03-core-concepts.md) — company hierarchy and master data
  behind the totals.
- [Status board](status-board.md) — how your TreasuryHub implementation is progressing: the
  platform roadmap, your onboarding programme, and your open support tickets.
