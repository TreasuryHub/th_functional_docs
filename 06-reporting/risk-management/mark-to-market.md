# Mark-to-Market Valuations

> **Availability:** `In Preview` 👁️ (part of Risk Management, ~Q3 2026)
> **Where to find it:** Reporting › Risk Management › Mark-to-Market
> **Who uses it:** treasurers, portfolio and investment managers, finance and accounting teams.
> **Permissions required:** Reporting / Risk Management access — see [Roles & Permissions](../../00-getting-started/04-roles-and-permissions.md).

## Overview
Mark-to-Market (MtM) will value your financial portfolio at current market prices and show the
**unrealized profit or loss** on every position — so you always know what your instruments are worth
today and why that has changed. Within [Risk Management](overview.md), MtM is the one dimension that
runs **in-house** in Treasury Hub, because the platform already holds the positions and market data
needed. You'll be able to complement it with an external partner valuation for complex instruments or
independent validation.

> 👁️ **In Preview.** This screen is in testing and available on request. All figures below are
> **illustrative** — they show the intended layout, not your data.

## Key concepts
- **Mark-to-Market (MtM)** — valuing an instrument at its current market price rather than its book
  (purchase) value.
- **Book value vs market value** — what you paid/recorded vs what it's worth now. The difference is
  the unrealized P&L.
- **Unrealized P&L** — gains or losses on positions you still hold (not yet closed/settled).
- **P&L attribution** — breaking the total MtM result down by asset class, subsidiary, or
  counterparty so you can see *where* value is being made or lost.
- **Pricing curves & market data** — the inputs the valuation engine uses: interest-rate curves
  (SOFR, EURIBOR, sovereign and swap curves), FX spot rates and forward points, implied volatility
  surfaces for options, and credit spreads. Sources will be configurable (e.g. Bloomberg, Refinitiv,
  central banks, or your own feeds).
- **Side-by-side comparison** — when both an in-house and a partner valuation exist, the dashboard
  can show them together with the difference.

## What the engine will value
The valuation engine is designed to cover a broad instrument set, including:
- **FX & derivatives** — FX forwards & NDFs (discounted cash flows per currency curve), FX swaps
  (both legs, netted), FX options (option-pricing models using implied vols), interest-rate swaps and
  cross-currency swaps, and IR/equity/commodity options (with greeks and volatility surfaces).
- **Fixed income & investments** — sovereign and corporate bonds (clean price, dirty price, accrued
  interest, yield to maturity), term deposits (market rate vs contracted rate), and money-market
  funds (daily NAV and accrued yield).
- **Commodities & others** — physical and derivative positions priced against futures curves,
  including the mark-to-market of hedges.

## Before you start
When live, MtM will depend on: connected market-data sources and
[Integrations](../../02-integrations/overview.md); positions ingested and normalized; and a valuation
date. Complex or exotic instruments may route to a specialist partner — see *The hybrid model* in the
[module overview](overview.md#the-hybrid-model-in-house-engine--specialist-partners).

## How to use it
> The steps describe the **intended** experience once released.

### Review your portfolio valuation
1. Go to **Reporting › Risk Management › Mark-to-Market**.
2. Confirm the **valuation date/time** and reporting currency in the header.
3. Choose a **View**: **By Asset Class**, **By Subsidiary**, or **By Counterparty**.
4. Read the summary table — for each group you'll see **# of positions, book value, market value,
   MtM (unrealized P&L), MtM %, and the change vs the prior period**, with a status flag.
5. **Expand a row** (e.g. FX Contracts, Loans, Investments) to see the sub-classes and drill down.

### Compare periods and see what drove the change
1. Select a **Period** (YTD, MTD, QTD, or Custom).
2. Use **Compare periods** / **Historical** to see how the valuation has moved.
3. Read the **Olivia (AI) commentary** below the table — it attributes the P&L to specific drivers
   (for example, *investment repricing added the most, offset by a drag from a Stage 2 loan due to
   currency depreciation*) and may suggest an action such as hedging a particular exposure.

### Export the valuation
1. Select **Export** to download the valuation for accounting, audit, or reporting.

## Configuration
- **Market-data sources** — administrators configure which pricing feeds supply curves, FX rates,
  volatilities, and credit spreads.
- **Partner valuation** — where enabled, complex instruments can be routed to an external partner and
  shown side by side with the in-house value.
- **Views and periods** — your selected view, period, and currency are remembered between visits.

## Tips & good practices
- Use **By Counterparty** or **By Subsidiary** views to localise a large swing before drilling in.
- Rely on the **Δ vs prior period** column and Olivia's attribution to explain results to management
  quickly.
- For instruments where audit or regulation needs an independent mark, enable the **partner
  valuation** and review the side-by-side difference.

## Related
- [Risk Management — Overview](overview.md) — the hybrid (in-house + partner) model.
- [FX Risk](fx-risk.md) — MtM fair values feed FX exposure and hedge-effectiveness metrics.
- [Credit Risk](credit-risk.md) — MtM feeds counterparty exposure calculations.
- [Exchange Rates](../../00-getting-started/03-core-concepts.md) and market data via
  [Integrations](../../02-integrations/overview.md).

## In Preview
- 👁️ **In-house valuation engine** — daily revaluation across FX, derivatives, fixed income,
  investments, and commodities.
- 👁️ **Configurable pricing curves & market-data feeds**.
- 👁️ **Side-by-side in-house vs partner valuation** for complex instruments and independent validation.
- 👁️ **Standard and custom MtM reports** with Olivia P&L attribution.
