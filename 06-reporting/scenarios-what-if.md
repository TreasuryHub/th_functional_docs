# Scenarios (What-If)

> **Availability:** `In Preview` 👁️ (Q4 2026)
> **Where to find it:** Reporting › Cash & Liquidity › Scenarios (What-If)
> **Who uses it:** treasurers, risk managers, FP&A, CFOs.
> **Permissions required:** to be confirmed — expected to align with Cash & Liquidity reporting (`CashManagement.CashPosition`). See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

> ⚠️ **This module is in testing and available on request.** The description below is
> forward-looking and explains what Scenarios (What-If) is intended to do. In demo environments it
> appears with a **Demo tenant** banner; contact Customer Support to discuss enabling it when it
> ships. Statuses and details should be confirmed with the Treasury Hub team — see
> your administrator.

## Overview
Scenarios (What-If) will let you model how your liquidity behaves under different assumptions —
adverse, expected, and favorable — side by side. You'll adjust a handful of shocks (FX moves, deposit
runoff, collection delays, rate changes), watch the projected closing balance redraw as you go, and
save each scenario for later comparison and contingency planning.

The intent is to answer "what happens if…?" before it happens: what if a key currency devalues, what
if collections slow by two weeks, what if rates rise — and how much funding headroom do you need to
stay safe across that range of outcomes.

## Key concepts (planned)
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

## How it will work

### Compare scenarios
1. Open **Reporting › Cash & Liquidity › Scenarios (What-If)**.
2. You'll see your **Base**, **Stress**, and **Upside** cases together, each with its shock sliders
   and a projected closing-balance chart.
3. Click **Edit**, move a scenario's sliders, and watch the chart and the delta KPIs update live.
4. Click **Save** to persist your changes.

### Create a new scenario
1. Click **+ New Scenario**.
2. Choose a starting point:
   - **Start from a template** (e.g. FX Crisis, Rate Hike, Recession) or clone an existing scenario;
   - **Ask Elena** — describe the scenario in plain English (for example, *"What if NGN devalues 20%
     and rates rise 100bps"*) and the AI builder assembles the shocks for you;
   - **Build manually** — drag shocks from the library onto the canvas.
3. Adjust each shock on the canvas, watch the **live preview** chart and KPIs (closing balance,
   delta vs base, lowest point, whether a funding plan is triggered), and **Save** when ready.

### The Elena (AI) scenario builder
Elena is the reporting assistant that will let you build scenarios from a natural-language prompt:
you describe the situation, Elena parses it into concrete shocks on the canvas, and you refine from
there. The AI path is optional — templates and manual drag-and-drop reach the same result.

## Tips & good practices (once live)
- Keep a stable **Base** case tied to your approved budget so every scenario has a consistent
  reference.
- Use the **stress-to-upside spread** to size your contingency funding — plan to the range, not a
  single point estimate.
- Save the scenarios you revisit (quarter-end stress, FX crisis) so you can re-run them against
  fresh data rather than rebuilding each time.

## Related
- [Cash Forecast](cash-forecast.md) — the base projection scenarios are built on.
- [Actual vs Forecast](actual-vs-forecast.md) — see how earlier assumptions played out.
- [Agents](../09-agents/overview.md) — Elena and the other AI assistants.

## In Preview
- 👁️ **Scenarios (What-If)** (Q4 2026) — multi-scenario modeling with live preview.
- 👁️ **Elena (AI) scenario builder** — build scenarios from a plain-English prompt.
- 👁️ **Contingency funding triggers** — automatic flags when a scenario's balance breaches a
  defined threshold.
