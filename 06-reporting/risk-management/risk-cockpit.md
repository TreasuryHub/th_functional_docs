# Risk Cockpit

> **Where to find it:** Reporting › Risk Management › Risk Cockpit
> **Who uses it:** treasurers, risk managers, CFOs, and risk committees.
> **Permissions required:** Reporting / Risk Management access — see [Roles & Permissions](../../00-getting-started/04-roles-and-permissions.md).

## Overview
The Risk Cockpit is the executive home screen for the [Risk Management](overview.md) module —
one consolidated dashboard that pulls all five risk dimensions (FX, credit, interest rate,
mark-to-market, and ALM/liquidity) into a single view, with a card per dimension that you can
explore in full detail.

## Key concepts
- **KPI tile** — a headline number at the top of the cockpit with a status indicator (e.g. Normal,
  Within limits, or a warning). The tiles include: Cash Position, MtM YTD, Net Open
  Position, NPL Ratio, Total ECL (expected credit loss), and LCR (liquidity coverage ratio).
- **Risk card** — a per-dimension panel with a mini chart, the key metric, a status, and an
  **Explore →** link into the full screen.
- **Consolidated view** — the cockpit defaults to a group-consolidated position (all companies)
  as of a valuation date, and lets you drill down from there.

## Before you start
The cockpit draws on: connected [Integrations](../../02-integrations/overview.md) for
positions and market data; complete master data (counterparties, currencies, company hierarchy); and
the **risk policies** you have defined per dimension so the status indicators and alerts have limits
to check against.

## How to use it

### Get your daily risk overview
1. Go to **Reporting › Risk Management › Risk Cockpit**.
2. Confirm the **scope and date** in the header (for example *Group consolidated · as of <date>*).
3. Scan the **KPI tiles** across the top for headline status — anything flagged with a warning icon
   needs attention.
4. Review the **risk cards** for each dimension (Mark-to-Market, FX Exposure, Credit Risk, Interest
   Rate Risk, ALM / Liquidity), each showing its key metric, a mini chart, and a status.

### Drill into a specific risk area
1. On any risk card, select **Explore →**.
2. You'll open the full screen for that dimension — for example
   [FX Risk](fx-risk.md), [Credit Risk](credit-risk.md), or [ALM](alm.md) — with the detailed
   tables, positions, and scenarios.

### Export a risk pack
1. Select **Export Risk Pack** in the header.
2. Use the export for your risk committee papers or regulatory file.

## Configuration
- **Alert Settings** — from the header, you configure which breaches trigger alerts and
  who is notified (for example, the treasurer plus the risk committee). Breaches also surface in
  the central [Alerts](../../08-alerts/alerts.md) area.
- **Policies** — the thresholds shown on each card come from the active risk policy for that
  dimension; you maintain those on the individual dimension screens.

## Tips & good practices
- Use the cockpit as your **first stop each day**; let the KPI tiles and card statuses direct where
  you spend time.
- When a card shows a warning, **Explore** into that dimension to find the driver behind it.
- Keep **Alert Settings** aligned to your governance so the right people are notified automatically,
  24/7, on any breach.

## Capabilities at a glance
- **Risk Cockpit** — consolidated multi-dimension dashboard.
- **Configurable alert routing** — breach notifications to named roles and committees.

## Related
- [Risk Management — Overview](overview.md) — the module and the hybrid calculation model.
- [Mark-to-Market](mark-to-market.md) · [FX Risk](fx-risk.md) · [Credit Risk](credit-risk.md) ·
  [Interest Rate Risk](interest-rate-risk.md) · [ALM](alm.md) — the five dimension screens.
- [Alerts](../../08-alerts/alerts.md) — where breaches and anomalies are collected.
