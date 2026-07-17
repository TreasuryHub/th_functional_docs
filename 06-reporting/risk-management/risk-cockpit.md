# Risk Cockpit

> **Availability:** `In Preview` 👁️ (~Q3 2026)
> **Where to find it:** Reporting › Risk Management › Risk Cockpit
> **Who uses it:** treasurers, risk managers, CFOs, and risk committees.
> **Permissions required:** Reporting / Risk Management access — see [Roles & Permissions](../../00-getting-started/04-roles-and-permissions.md).

## Overview
The Risk Cockpit will be the executive home screen for the [Risk Management](overview.md) module —
one consolidated dashboard that pulls all five risk dimensions (FX, credit, interest rate,
mark-to-market, and ALM/liquidity) into a single view. Rather than just showing KPIs and charts, it
is designed so each dimension's specialized agent — **Nadia** (FX), **Isabella** (credit), **Liam**
(interest rate), **Mia** (ALM/liquidity), and **Olivia** (mark-to-market / market data) — explains its
metrics in context and lets you ask follow-up questions to drill into that area.

> 👁️ **In Preview (~Q3 2026).** This screen is in preview; preview screens exist but it is not
> yet live. The numbers in this page are **illustrative examples** to show the layout — they are not
> your organization's data.

## Key concepts
- **KPI tile** — a headline number at the top of the cockpit with a status indicator (e.g. Normal,
  Within limits, or a warning). Examples of the intended tiles: Cash Position, MtM YTD, Net Open
  Position, NPL Ratio, Total ECL (expected credit loss), and LCR (liquidity coverage ratio).
- **Risk card** — a per-dimension panel with a mini chart, the key metric, a status, an **Explore →**
  link into the full screen, and an insight from that dimension's agent.
- **Agent insight** — one or two lines of expert commentary generated for that metric by the
  dimension's own agent (Nadia, Isabella, Liam, Mia, or Olivia), including the driver and a
  recommendation (not generic text).
- **Consolidated view** — the cockpit will default to a group-consolidated position (all companies)
  as of a valuation date, and let you drill down from there.

## Before you start
When live, the cockpit will draw on: connected [Integrations](../../02-integrations/overview.md) for
positions and market data; complete master data (counterparties, currencies, company hierarchy); and
the **risk policies** you have defined per dimension so the status indicators and alerts have limits
to check against.

## How to use it
> The steps below describe the **intended** experience once the Risk Cockpit is released.

### Get your daily risk overview
1. Go to **Reporting › Risk Management › Risk Cockpit**.
2. Confirm the **scope and date** in the header (for example *Group consolidated · as of <date>*).
3. Scan the **KPI tiles** across the top for headline status — anything flagged with a warning icon
   needs attention.
4. Review the **risk cards** for each dimension (Mark-to-Market, FX Exposure, Credit Risk, Interest
   Rate Risk, ALM / Liquidity), each showing its key metric, a mini chart, and an insight from that
   dimension's agent.

### Drill into a specific risk area
1. On any risk card, select **Explore →**.
2. You'll open the full screen for that dimension — for example
   [FX Risk](fx-risk.md), [Credit Risk](credit-risk.md), or [ALM](alm.md) — with the detailed
   tables, positions, and scenarios.

### Ask a dimension's agent about a metric
1. Open the **agent panel** shown alongside the cards. Your question is routed to the agent for that
   dimension — **Nadia** for FX, **Isabella** for credit, **Liam** for interest rate, **Mia** for
   ALM/liquidity, and **Olivia** for mark-to-market / market data.
2. Type a question in plain language (for example, *"Explain the credit risk on <counterparty>"* — which
   Isabella answers — or *"What happens to total ECL if it moves to Stage 3?"*), or use a quick chip such
   as **MtM detail**, **FX hedging**, **Credit watch**, **Rate sensitivity**, or **Liquidity stress**.
3. The relevant agent will respond with the figures, the policy context, and a recommendation. You can
   keep asking follow-ups; the conversation stays in context.

### Export a risk pack
1. Select **Export Risk Pack** in the header.
2. Use the export for your risk committee papers or regulatory file. (Exact formats will be confirmed
   at release.)

## Configuration
- **Alert Settings** — from the header, you'll be able to configure which breaches trigger alerts and
  who is notified (for example, the treasurer plus the risk committee). Breaches will also surface in
  the central [Alerts](../../08-alerts/alerts.md) area.
- **Policies** — the thresholds shown on each card come from the active risk policy for that
  dimension; you maintain those on the individual dimension screens.

## Tips & good practices
- Use the cockpit as your **first stop each day**; let the KPI tiles and card statuses direct where
  you spend time.
- When a card shows a warning, read the **agent insight** first — it names the driver — then
  **Explore** into the detail.
- Keep **Alert Settings** aligned to your governance so the right people are notified automatically,
  24/7, on any breach.

## Related
- [Risk Management — Overview](overview.md) — the module and the hybrid calculation model.
- [Mark-to-Market](mark-to-market.md) · [FX Risk](fx-risk.md) · [Credit Risk](credit-risk.md) ·
  [Interest Rate Risk](interest-rate-risk.md) · [ALM](alm.md) — the five dimension screens.
- [Agents](../../09-agents/overview.md) — Nadia, Isabella, Liam, Mia, and Olivia, the specialized risk agents.
- [Alerts](../../08-alerts/alerts.md) — where breaches and anomalies are collected.

## In Preview
- 👁️ **Risk Cockpit** (~Q3 2026) — consolidated multi-dimension dashboard.
- 👁️ **Specialized risk agents** — Nadia, Isabella, Liam, Mia, and Olivia providing real-time
  monitoring, contextual insights, and conversational drill-down across their dimensions.
- 👁️ **Configurable alert routing** — breach notifications to named roles and committees.
