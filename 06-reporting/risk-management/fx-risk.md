# FX Risk

> **Availability:** `In Preview` 👁️ (part of Risk Management, ~Q3 2026)
> **Where to find it:** Reporting › Risk Management › FX Risk
> **Who uses it:** treasurers, FX dealers, risk managers.
> **Permissions required:** Reporting / Risk Management access — see [Roles & Permissions](../../00-getting-started/04-roles-and-permissions.md).

## Overview
FX Risk will give you complete visibility of your currency exposure — from the **net open position**
in each currency through to **Value at Risk (VaR)**, **stress testing**, and **hedging
recommendations**. It answers the two questions treasurers ask most: *how much am I exposed to each
currency, and how much of that is hedged?*

Within [Risk Management](overview.md), simpler outputs (net exposure aggregation, rule-based hedge
suggestions, basic stress shocks) can run in-house, while model-intensive calculations (advanced VaR,
greeks for exotic options, certified hedge-effectiveness tests) can be executed by a specialist
partner. See the [hybrid model](overview.md#the-hybrid-model-in-house-engine--specialist-partners).

> 👁️ **In Preview.** This screen is in testing and available on request. All figures below are
> **illustrative**, not your data.

## Key concepts
- **Net open position (NOP)** — your net exposure per currency after combining spot, forwards, NDFs,
  swaps, and options, grouped by currency and maturity.
- **Hedged vs unhedged** — how much of a currency exposure is covered by FX contracts vs left open.
  The **hedge ratio** is the covered percentage; you'll compare it to a target (e.g. 80%).
- **Value at Risk (VaR)** — an estimate of the potential loss on your FX positions over a horizon
  (e.g. 1 day, 10 days, 1 month) at a confidence level (e.g. 95% or 99%), based on historical rate
  movements.
- **Stress testing** — the impact on your positions of extreme but plausible scenarios — either a
  custom shock you define (e.g. a currency devalues X%) or a predefined historical scenario.
- **Sensitivity / greeks** — how the value of FX derivatives changes with the market: delta for
  forwards; delta, gamma, and vega for options.
- **Hedge effectiveness** — a ratio showing how well a designated hedge offsets the item it hedges,
  aligned with IFRS 9 / ASC 815 hedge accounting.

## Before you start
When live, FX Risk will depend on: open FX positions ingested via
[Integrations](../../02-integrations/overview.md); historical FX rate series (for VaR, typically a
minimum window such as 250 days); market data (spot, forward points, volatilities); and your **hedging
policy** (target ratios, permitted instruments, horizon).

## How to use it
> The steps describe the **intended** experience once released.

### See your net open position and hedge coverage
1. Go to **Reporting › Risk Management › FX Risk**.
2. Review the KPI tiles — for example **Net Open Position**, **Hedged ratio vs target**, **Unhedged
   exposure**, and **potential loss under an adverse move**.
3. Choose a **View** (By Currency, By Subsidiary, By Counterparty) and a **Horizon** (Spot, 1M, 3M,
   6M, 12M).
4. In the exposure table, read each currency pair's **gross exposure, hedged amount, unhedged amount,
   hedge %,** the unhedged build-up across time buckets, the **risk under a shock**, and a status flag
   (e.g. below or within the target ratio).

### Drill into a specific currency pair
1. Select a currency pair row (the worst exposure is typically pre-selected).
2. Review the expanded **hedge portfolio** — each instrument (NDF, forward, option), its notional,
   maturity, rate, and counterparty — plus any hedges **Nadia** (the FX Risk & Hedging agent)
   **recommends** but that you have not yet executed.

### Run VaR and stress tests
1. Review the **VaR** for your chosen horizon and confidence level.
2. Open **stress testing** and apply a **custom shock** (define a percentage move per currency) or a
   **predefined historical scenario**; the screen shows the estimated P&L impact.

### Get hedging recommendations
1. Read the **Nadia (AI) commentary**. Nadia flags pairs below target, quantifies the exposure and
   potential loss, and recommends specific hedges (for example, *add an NDF for the 3-month horizon to
   bring coverage to target; estimated cost and risk reduction shown*).
2. Use the **Hedge Simulator** to test a hedge before executing it.

## Configuration
- **Hedging policy** — target hedge ratios, permitted instruments, and horizons. These drive the
  status flags and Nadia's recommendations.
- **VaR parameters** — method (parametric, historical, or partner Monte Carlo), confidence level, and
  window.
- **Stress scenario library** — maintain custom shocks and predefined historical scenarios.
- **Alert Settings** — thresholds (e.g. VaR limit, minimum hedge ratio) that raise
  [Alerts](../../08-alerts/alerts.md).

## Tips & good practices
- Focus first on pairs **below the target hedge ratio** and with the largest unhedged amount at the
  near horizons.
- Use the **Hedge Simulator** to check cost vs risk reduction before committing to a contract.
- Keep an eye on **hedge effectiveness** if you apply hedge accounting — a ratio drifting below
  threshold (e.g. 80%) can jeopardise IFRS 9 / ASC 815 treatment.
- FX Risk is the analytical view (VaR, stress, sensitivity); pair it with FX exposure matching to
  manage day-to-day coverage.

## Related
- [Risk Management — Overview](overview.md) — hybrid model and partner integration.
- [Mark-to-Market](mark-to-market.md) — fair values feed exposure and hedge-effectiveness metrics.
- [Risk Cockpit](risk-cockpit.md) — FX exposure summarised alongside the other dimensions.
- [Alerts](../../08-alerts/alerts.md) — where limit breaches surface.

## In Preview
- 👁️ **Net open position & hedge-coverage table** by currency pair and time horizon.
- 👁️ **VaR** (parametric / historical in-house; Monte Carlo via partner).
- 👁️ **Stress testing** with custom and historical scenarios.
- 👁️ **Sensitivity / greeks** and **hedge-effectiveness** testing (IFRS 9 / ASC 815).
- 👁️ **Hedge Simulator** and Nadia hedging recommendations.
