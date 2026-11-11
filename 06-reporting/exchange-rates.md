# Exchange Rates

> **Consistent FX rates behind every consolidated figure**
>
> **Why it matters**
> - **One source for every conversion**: the cash position, the reports and the blotter equivalents all read these rates.
> - **Accuracy where it compounds**: a wrong rate here moves every cross-currency number you publish.
> - **Maintained on your terms**: the grid is yours to keep current.

> **Where to find it:** Reporting › Operations › Exchange Rates (this is **core / master data** used across the platform; also reachable from the Admin Console).
> **Who uses it:** treasury operations, finance teams, administrators.
> **Permissions required:** `CoreData.ExchangeRates` · Read to view; CreateEdit to add/edit; Delete to remove. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Keep every consolidated figure correct at the source: Exchange Rates is the grid where you maintain
the FX rates the platform uses to convert between currencies. Every consolidated figure — your [cash position](../01-home/home-dashboard.md), reports, and USD
equivalents on the blotters — relies on these rates, so keeping them accurate keeps your
cross-currency numbers correct.

## Key concepts
- **Currency pair** — the two currencies a rate converts between (a **from** currency and a **to**
  currency), e.g. EUR → USD.
- **Rate** — the conversion factor for that pair.
- **Timestamp** — when the rate applies / was recorded, so historical conversions stay consistent.
- **Display currency** — elsewhere in reporting you pick a single currency to show everything in;
  these rates are what make that conversion possible.

## Before you start
- The currencies you want to convert between must exist in the platform.
- You need `CoreData.ExchangeRates` at **CreateEdit** to add or change rates.

## How to use it

### View and find rates
1. Open **Exchange Rates**.
2. The grid lists rates with their **from currency, to currency, rate,** and **timestamp**.
3. Filter and sort to find a specific pair.

### Add a rate
1. Click **Add** (or **+**).
2. Choose the **from currency** and **to currency**, and enter the **rate**.
3. Save. The rate becomes available for conversions.

### Edit or delete a rate
1. Open a rate to **edit** it, adjust the value, and save.
2. To remove a rate, use **Delete** and confirm.

### Export
1. Click **Export** and choose **Excel** or **CSV** for the current grid.

## Tips to get more value
- Keep rates current — stale FX rates quietly distort every consolidated figure and USD equivalent.
- Be consistent about the direction of each pair (from → to) so conversions apply the way you expect.
- Coordinate rate maintenance with whoever owns [master data](../00-getting-started/03-core-concepts.md#master-data);
  exchange rates are shared reference data, not a per-report setting.

## Where to go next
- [Cash Position](../01-home/home-dashboard.md) — where rates drive the consolidated display currency.
- [Bank Accounts](bank-accounts.md) — USD-equivalent balances use these rates.
- [Operations blotters](operations-blotters.md) — FX/investment valuations rely on rates.
- [Core Concepts — Master data](../00-getting-started/03-core-concepts.md#master-data) — clean reference data is what keeps every converted figure correct.
