# Interest Rate Risk

> **Availability:** `In Preview` 👁️ (part of Risk Management, ~Q3 2026)
> **Where to find it:** Reporting › Risk Management › Interest Rate Risk
> **Who uses it:** treasurers, ALM and risk teams, and (in banks) IRRBB regulatory-reporting teams.
> **Permissions required:** Reporting / Risk Management access — see [Roles & Permissions](../../00-getting-started/04-roles-and-permissions.md).

## Overview
Interest Rate Risk will measure and help you manage how movements in interest rates affect your
portfolio — from the **repricing gap** through **duration/DV01** to the sensitivity of both your
**earnings (net interest income)** and the **economic value of your balance sheet**. For banks it
covers the standard **IRRBB** (Interest Rate Risk in the Banking Book) framework.

Within [Risk Management](overview.md), the gap and vanilla sensitivities can run in-house, while
option-adjusted and dynamic-balance simulations can be executed by a specialist partner. See the
[hybrid model](overview.md#the-hybrid-model-in-house-engine--specialist-partners).

> 👁️ **In Preview.** This screen is in testing and available on request. All figures below are
> **illustrative**, not your data.

## Key concepts
- **Repricing gap** — the difference between assets and liabilities that reprice in each time band
  (overnight, 1–3M, 3–6M, 6–12M, 1–2Y, 2–5Y, >5Y). A positive gap in a band means more assets than
  liabilities reprice there.
- **Duration / DV01 / convexity** — measures of price sensitivity to rates. **Modified/effective
  duration** and **DV01** (the value change for a 1-basis-point move) tell you how much your portfolio
  value moves as rates move.
- **Duration gap** — the difference in interest-rate sensitivity between your assets and liabilities.
- **NII sensitivity** — the impact on **Net Interest Income** (your earnings) over the next 12 months
  under rate shocks (e.g. ±25, 50, 100, 200 bps).
- **EVE sensitivity** — the impact on **Economic Value of Equity** (a longer-term, value view) under
  rate shocks, including the standard IRRBB scenarios.
- **Rate scenarios** — **parallel shifts** (the whole curve up/down) and **non-parallel** ones
  (steepener, flattener, short-rate up/down). Basel defines six standard IRRBB scenarios.
- **Repricing profile** — a calendar of when each instrument next reprices, by type and currency.
- **Fixed-rate ratio** — the share of your book on fixed rates; often subject to a policy minimum.
- **Active IRRBB policy** — your limits (DV01 limit, duration-gap limit, NII/EVE tolerances, minimum
  fixed-rate ratio). Liam's insights cite the policy section they enforce.

## Before you start
When live, Interest Rate Risk will depend on: rate-sensitive instruments ingested via
[Integrations](../../02-integrations/overview.md) with their terms (notional, fixed/floating, next
repricing date, maturity, coupon frequency); discount curves per currency; and, for banks, behavioral
assumptions for non-maturity deposits and prepayments. Your **IRRBB policy** defines the limits that
monitoring enforces.

## How to use it
> The steps describe the **intended** experience once released.

### Check your rate-sensitivity position
1. Go to **Reporting › Risk Management › Interest Rate Risk**.
2. Review the **active policy banner** and the KPI tiles (e.g. **DV01 vs limit, duration gap vs limit,
   NII impact at ±100 bps, fixed-rate ratio vs minimum**).
3. Read the **rate-sensitivity table** — by portfolio segment (fixed/floating assets and liabilities)
   with notional, duration, DV01, and NII impact under +/–100 and +/–200 bps, ending in a **net
   position** row and the **policy-limit** row for comparison.

### Analyse the repricing gap
1. Open the **gap / repricing** view.
2. Read the gap by time band (assets minus liabilities repricing in each band) and the **cumulative
   gap**, which shows where you are asset- or liability-sensitive.
3. Use the **repricing profile** to see when volumes reprice, grouped by type and currency.

### Run rate scenarios and stress tests
1. Review the **yield-curve chart** with the current curve and the shocked curves (e.g. +100 bps and
   −100 bps).
2. Open the **Scenario Builder** to apply **parallel shifts** or **non-parallel** scenarios
   (steepener, flattener, short-rate up/down), including the six standard IRRBB scenarios where
   relevant.
3. Read the resulting **NII sensitivity** and **EVE sensitivity** against your policy tolerances.

### Get recommendations
1. Read the **Liam (AI) commentary** — it states whether you are asset- or liability-sensitive,
   confirms which figures are within policy, explains the driver (e.g. an inverted short end benefiting
   floating-rate loans), and recommends positioning (e.g. reduce duration with swaps).

## Configuration
- **IRRBB policy** — upload/maintain limits: DV01 limit, duration-gap limit, NII and EVE tolerances,
  minimum fixed-rate ratio.
- **Discount curves & scenarios** — configure curves per currency and maintain your scenario library.
- **Behavioral assumptions** — for non-maturity deposits and prepayments (in-house simplified models,
  or partner-calibrated models).
- **Alert Settings** — limit breaches raise [Alerts](../../08-alerts/alerts.md).

## Tips & good practices
- Watch both **earnings (NII)** and **value (EVE)** — a position can look fine on one and stressed on
  the other.
- Use the **cumulative gap** to spot structural mismatches (e.g. long-dated fixed assets funded by
  short repricing liabilities) before they hit earnings.
- For banks, keep an eye on the **EVE outlier test** (a large ΔEVE relative to Tier 1 capital draws
  supervisory attention).

## Related
- [Risk Management — Overview](overview.md) — hybrid model and partner integration.
- [ALM](alm.md) — IRRBB regulatory reporting sits alongside structural liquidity there.
- [Risk Cockpit](risk-cockpit.md) — IRRBB KPIs (DV01, duration gap) summarised with other dimensions.
- [Alerts](../../08-alerts/alerts.md) — where limit breaches surface.

## In Preview
- 👁️ **Repricing gap & profile** by time band and currency.
- 👁️ **Duration / DV01 / convexity**, including effective duration for instruments with optionality.
- 👁️ **NII and EVE sensitivity** under parallel and non-parallel shocks (six IRRBB scenarios).
- 👁️ **Scenario Builder** and Liam positioning recommendations.
