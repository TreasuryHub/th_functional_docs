# Scenarios (What-If)

> **Stress-test your liquidity before the market does**
>
> **Why it matters**
> - **Three futures side by side**: adverse, expected and favorable, compared directly.
> - **Shocks that matter**: FX moves, deposit runoff, collection delays and rate changes, adjusted live.
> - **Saved for later**: each scenario is kept for comparison and contingency planning.
>
> *For the CFO: the funding headroom question is answered before a board asks it, with the assumptions written down.*

> **Where to find it:** Reporting › Cash & Liquidity › Scenarios (What-If)
> **Who uses it:** treasurers, risk managers, FP&A, CFOs.
> **Permissions required:** `CashManagement.CashPosition` · Read, in line with the rest of Cash & Liquidity reporting. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Stress-test your liquidity before the market does it for you: Scenarios (What-If) models how your
liquidity behaves under different assumptions — adverse, expected and favorable — side by side. You adjust a handful of shocks (FX moves, deposit
runoff, collection delays, rate changes), watch the projected closing balance redraw as you go, and
save each scenario for later comparison and contingency planning.

It answers "what happens if…?" before it happens: what if a key currency devalues, what
if collections slow by two weeks, what if rates rise — and how much funding headroom do you need to
stay safe across that range of outcomes.

## Key concepts
- **Scenario** — a named set of assumptions applied to your base forecast (for example **Base**,
  **Stress**, **Upside**), each producing its own projected balance curve.
- **Shock** — an individual assumption you dial in, such as an FX shock (%), deposit runoff (%),
  AR collection delay (days), or an interest-rate move (bps).
- **Base case** — your approved budget and confirmed pipeline, used as the reference line.
- **Delta vs base** — how much a scenario's closing balance differs from the base case over the
  horizon.
- **Stress-to-upside spread** — the range between your worst and best scenarios, i.e. the band a
  contingency funding plan needs to cover.
- **Live preview** — the projection chart and KPIs recalculate as you move a slider, so you see
  impact immediately.

## How it works

### Compare scenarios
1. Open **Reporting › Cash & Liquidity › Scenarios (What-If)**.
2. You see your **Base**, **Stress**, and **Upside** cases together, each with its shock sliders
   and a projected closing-balance chart.
3. Click **Edit**, move a scenario's sliders, and watch the chart and the delta KPIs update live.
4. Click **Save** to persist your changes.

### Create a new scenario
1. Click **+ New Scenario**.
2. Choose a starting point:
   - **Start from a template** (e.g. FX Crisis, Rate Hike, Recession) or clone an existing scenario;
   - **Build manually** — drag shocks from the library onto the canvas.
3. Adjust each shock on the canvas, watch the **live preview** chart and KPIs (closing balance,
   delta vs base, lowest point, whether a funding plan is triggered), and **Save** when ready.

## Tips to get more value
- Keep a stable **Base** case tied to your approved budget so every scenario has a consistent
  reference.
- Use the **stress-to-upside spread** to size your contingency funding — plan to the range, not a
  single point estimate.
- Save the scenarios you revisit (quarter-end stress, FX crisis) so you can re-run them against
  fresh data rather than rebuilding each time.

## Where to go next
- [Cash Forecast](cash-forecast.md) — the base projection scenarios are built on.
- [Actual vs Forecast](actual-vs-forecast.md) — see how earlier assumptions played out.
