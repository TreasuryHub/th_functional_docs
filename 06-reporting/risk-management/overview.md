# Risk Management — Overview

> **All your treasury risks in one real-time view**
>
> **Why it matters**
> - **Five dimensions, one place**: FX, counterparty credit, interest rate, mark-to-market and ALM, plus investment risk.
> - **Limits watched continuously**: policies are monitored as positions change, and breaches raise alerts.
> - **Hybrid model**: fast in-house analytics, with specialist partners for advanced models.
>
> *For the CFO: risk reporting stops being a quarterly assembly exercise and becomes a standing view the board can be shown.*

> **Where to find it:** Reporting › Risk Management
> **Who uses it:** treasurers, risk managers, CFOs, and (in financial institutions) ALM and regulatory-reporting teams.
> **Permissions required:** Reporting / Risk Management access — see [Roles & Permissions](../../00-getting-started/04-roles-and-permissions.md). Exact permission modules will be confirmed at release.

## Overview
See all your treasury risks in one real-time view, instead of pulling them from separate
spreadsheets and provider portals: Risk Management is the part of [Reporting](../overview.md) that
consolidates the risks that matter — **currency (FX), counterparty credit, interest rate,
mark-to-market valuation, and asset & liability (liquidity) risk** — instead of pulling them from
separate spreadsheets and provider portals.

The centrepiece is the **[Risk Cockpit](risk-cockpit.md)**: one executive dashboard that
consolidates all five dimensions, monitors your limits and policies continuously, and raises alerts
the moment something breaches.

## Key concepts
- **The five risk dimensions** — the areas Risk Management covers:
  - **[Mark-to-Market (MtM)](mark-to-market.md)** — the current fair value of your financial
    instruments and the unrealized profit/loss on them.
  - **[FX Risk](fx-risk.md)** — your exposure to currency movements, and how much of it is hedged.
  - **[Credit Risk](credit-risk.md)** — the risk that a counterparty or funding partner fails to
    meet its obligations.
  - **[Interest Rate Risk](interest-rate-risk.md)** — how movements in interest rates affect your
    earnings and the economic value of your balance sheet.
  - **[Asset & Liability Management (ALM)](alm.md)** — structural liquidity, funding, and maturity
    mismatch, including regulatory ratios for banks.
- **Risk Cockpit** — the consolidated dashboard that brings all five dimensions into one screen.
- **Limit / threshold** — a boundary you set (e.g. a maximum unhedged FX position, a single-name
  credit limit, a minimum liquidity ratio). Risk Management monitors actuals against these
  continuously and alerts you on a breach.
- **Risk policy** — the document that defines your limits, triggers, and rules. Each dimension can
  have an **active policy** that its alerts are checked against — so what you are warned about
  reflects *your* rules, not generic ones.
- **In-house vs partner calculation** — see *The hybrid model* below.

## The hybrid model: in-house engine + specialist partners
TreasuryHub does not try to replicate what specialist risk vendors do. Instead it positions itself
as the **orchestrator** that connects your data to the best calculation engine and presents
everything in one place:

- **In-house** — **Mark-to-Market valuations** run inside TreasuryHub, because the platform
  already holds the positions and market data needed. Simpler aggregations (net exposures, limit
  utilization, contractual gaps) can also be computed in-house.
- **With specialist partners** — the more model-intensive calculations (advanced VaR, PFE with Monte
  Carlo, calibrated PD/LGD, behavioral liquidity models, full regulatory reporting) are executed
  by specialized risk partners. You still operate from a single platform, whichever engine runs the
  numbers.
- **Best of both** — you are never locked in to a single valuation. Where both an in-house and a
  partner figure exist, the dashboard can show them **side by side** with the difference — valuable
  for audit and independent validation.

## How the partner integration works (5 steps)
For the partner-calculated dimensions, TreasuryHub runs an automated, monitored, auditable
pipeline — not a "export a CSV and wait for an email" process:

1. **Data capture** — open positions, contracts, market data (rate curves, FX rates, volatilities,
   credit spreads) are ingested, normalized, and validated automatically.
2. **API export** — the required data is sent to the partner in their format (JSON, XML, CSV, FpML),
   on a configurable schedule (on-demand, daily, or intraday), with pre-send validation and
   automatic retry.
3. **Partner calculation** — the specialist runs its proprietary risk models. Each run is logged
   (timestamp, model version, parameters).
4. **API import** — results (risk metrics, reports, alerts) are received back, validated, and
   versioned so you can compare runs over time.
5. **Visualization** — results appear in the TreasuryHub UI with drill-down by area, instrument,
   and counterparty, and execution logs show exactly what was sent and received.

Adding a new risk partner is **configuration, not code** — flexible field mapping, robust
authentication (OAuth2, API keys, mutual TLS), continuous health monitoring, and a full audit trail
of every value sent and received.

## What's in this section
| Screen | What it's for |
|---|---|
| [Risk Cockpit](risk-cockpit.md) | Consolidated dashboard across all five dimensions, with KPIs and per-area cards. |
| [Mark-to-Market](mark-to-market.md) | Portfolio valuation, unrealized P&L, and P&L attribution by asset class. |
| [FX Risk](fx-risk.md) | Net open position, hedge coverage, VaR, stress testing, and hedging recommendations. |
| [Credit Risk](credit-risk.md) | Counterparty exposure, IFRS 9 staging, limits, watch list, and partner funding monitoring. |
| [Interest Rate Risk](interest-rate-risk.md) | Repricing gap, duration/DV01, NII and EVE sensitivity, and rate scenarios. |
| [ALM](alm.md) | Liquidity gap by maturity, LCR/NSFR, HQLA, stress scenarios, and funding concentration. |

## Before you start
Getting reliable risk output depends on the same foundations as the rest of the platform:

- **Connected data sources** — positions, contracts, and market data flow in through
  [Integrations](../../02-integrations/overview.md).
- **Clean master data** — counterparties, currencies, and the company hierarchy must be complete.
  See [Core Concepts](../../00-getting-started/03-core-concepts.md).
- **Risk policies defined** — your limits and thresholds per dimension, so monitoring and alerts have
  something to check against.

## Tips to get more value
- Start from the **[Risk Cockpit](risk-cockpit.md)** for the daily overview, then use **Explore** on
  any card to drill into that dimension.
- Keep your **risk policies current**; the quality of the alerts depends on the limits you set.

## Capabilities at a glance
- **Risk Cockpit** — the consolidated dashboard over the five dimensions.
- **Mark-to-Market, FX Risk, Credit Risk, Interest Rate Risk, ALM** — the five dimension screens.
- **Specialist partner integrations** — config-driven connections to external risk-calculation
  engines with side-by-side comparison.

## Where to go next
- [Reporting — Overview](../overview.md) — the parent section.
- [Integrations](../../02-integrations/overview.md) — where positions and market data come from.
- [Alerts](../../08-alerts/alerts.md) — where limit breaches and anomalies surface.
- [Core Concepts](../../00-getting-started/03-core-concepts.md) — company hierarchy, master data, the AI layer.
