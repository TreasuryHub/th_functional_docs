# Risk Management — Overview

> **Availability:** `In Preview` 👁️ (Risk Cockpit ~Q3 2026; the underlying dimensions roll out on the same timeline)
> **Where to find it:** Reporting › Risk Management
> **Who uses it:** treasurers, risk managers, CFOs, and (in financial institutions) ALM and regulatory-reporting teams.
> **Permissions required:** Reporting / Risk Management access — see [Roles & Permissions](../../00-getting-started/04-roles-and-permissions.md). Exact permission modules will be confirmed at release.

## Overview
Risk Management is the part of [Reporting](../overview.md) that will give you a single, real-time
view of the treasury risks that matter — **currency (FX), counterparty credit, interest rate,
mark-to-market valuation, and asset & liability (liquidity) risk** — instead of pulling them from
separate spreadsheets and provider portals.

The centrepiece will be the **[Risk Cockpit](risk-cockpit.md)**: one executive dashboard that
consolidates all five dimensions, monitors your limits and policies continuously, raises alerts the
moment something breaches, and lets each dimension's specialized agent explain every number in plain
language and recommend what to do next.

> 👁️ **In Preview.** This module is in testing and available on request. The pages in this
> section describe what each capability *will* do so you can plan for it. Any figures shown here
> (exposures, ratios, counterparty names) are **illustrative examples**, not your data. Target
> availability and exact packaging will be confirmed by the Treasury Hub team.

## Key concepts
- **The five risk dimensions** — the areas Risk Management will cover:
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
  credit limit, a minimum liquidity ratio). Risk Management will monitor actuals against these
  continuously and alert you on a breach.
- **Risk policy** — the document that defines your limits, triggers, and rules. Each dimension can
  have an **active policy** that the dimension's agent insights and alerts enforce — so recommendations
  reflect *your* rules, not generic ones.
- **Specialized risk agents** — each dimension has its own advisor that will monitor its metrics,
  explain them, flag anomalies, and recommend actions: **Nadia** (FX Risk), **Isabella** (Credit
  Risk), **Liam** (Interest Rate Risk), **Mia** (ALM & Liquidity), and **Olivia** (Mark-to-Market /
  market data). Like the rest of the module, they are **In Preview 👁️**. See
  [Agents](../../09-agents/overview.md).
- **In-house vs partner calculation** — see *The hybrid model* below.

## The hybrid model: in-house engine + specialist partners
Treasury Hub will not try to replicate what specialist risk vendors do. Instead it positions itself
as the **orchestrator** that connects your data to the best calculation engine and presents
everything in one place:

- **In-house** — **Mark-to-Market valuations** will run inside Treasury Hub, because the platform
  already holds the positions and market data needed. Simpler aggregations (net exposures, limit
  utilization, contractual gaps) can also be computed in-house.
- **With specialist partners** — the more model-intensive calculations (advanced VaR, PFE with Monte
  Carlo, calibrated PD/LGD, behavioral liquidity models, full regulatory reporting) will be executed
  by specialized risk partners. You still operate from a single platform, whichever engine runs the
  numbers.
- **Best of both** — you are never locked in to a single valuation. Where both an in-house and a
  partner figure exist, the dashboard can show them **side by side** with the difference — valuable
  for audit and independent validation.

## How the partner integration will work (5 steps)
For the partner-calculated dimensions, Treasury Hub will run an automated, monitored, auditable
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
5. **Visualization + assistance** — results appear in the Treasury Hub UI with drill-down by area,
   instrument, and counterparty; execution logs show exactly what was sent and received; and the
   relevant dimension's agent interprets the results, suggests actions, and flags anomalies.

Adding a new risk partner will be **configuration, not code** — flexible field mapping, robust
authentication (OAuth2, API keys, mutual TLS), continuous health monitoring, and a full audit trail
of every value sent and received.

## What's in this section
| Screen | What it will be for |
|---|---|
| [Risk Cockpit](risk-cockpit.md) | Consolidated dashboard across all five dimensions, with KPIs, per-area cards, and the per-dimension agent chat. |
| [Mark-to-Market](mark-to-market.md) | Portfolio valuation, unrealized P&L, and P&L attribution by asset class. |
| [FX Risk](fx-risk.md) | Net open position, hedge coverage, VaR, stress testing, and hedging recommendations. |
| [Credit Risk](credit-risk.md) | Counterparty exposure, IFRS 9 staging, limits, watch list, and partner funding monitoring. |
| [Interest Rate Risk](interest-rate-risk.md) | Repricing gap, duration/DV01, NII and EVE sensitivity, and rate scenarios. |
| [ALM](alm.md) | Liquidity gap by maturity, LCR/NSFR, HQLA, stress scenarios, and funding concentration. |

## Before you start
When this module goes live, getting reliable risk output will depend on the same foundations as the
rest of the platform:
- **Connected data sources** — positions, contracts, and market data flow in through
  [Integrations](../../02-integrations/overview.md).
- **Clean master data** — counterparties, currencies, and the company hierarchy must be complete.
  See [Core Concepts](../../00-getting-started/03-core-concepts.md).
- **Risk policies defined** — your limits and thresholds per dimension, so monitoring and alerts have
  something to check against.

## Tips & good practices
- Start from the **[Risk Cockpit](risk-cockpit.md)** for the daily overview, then use **Explore** on
  any card to drill into that dimension.
- Treat the **agents' recommendations** as expert prompts, not automatic actions — every insight cites
  the metric, the threshold, and the driver so you can decide.
- Keep your **risk policies current**; the quality of alerts and recommendations depends on the
  limits you set.

## Related
- [Reporting — Overview](../overview.md) — the parent section.
- [Integrations](../../02-integrations/overview.md) — where positions and market data come from.
- [Agents](../../09-agents/overview.md) — Nadia, Isabella, Liam, Mia, and Olivia, the specialized risk agents.
- [Alerts](../../08-alerts/alerts.md) — where limit breaches and anomalies surface.
- [Core Concepts](../../00-getting-started/03-core-concepts.md) — company hierarchy, master data, the AI layer.

## In Preview
- 👁️ **Risk Cockpit** (~Q3 2026) — the consolidated dashboard and its per-dimension risk agents.
- 👁️ **Mark-to-Market, FX Risk, Credit Risk, Interest Rate Risk, ALM** — the five dimension screens,
  on the same timeline.
- 👁️ **Specialist partner integrations** — config-driven connections to external risk-calculation
  engines with side-by-side comparison.
