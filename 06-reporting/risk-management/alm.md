# Asset & Liability Management (ALM)

> **Availability:** `In Preview` 👁️ (part of Risk Management, ~Q3 2026)
> **Where to find it:** Reporting › Risk Management › ALM
> **Who uses it:** ALM committees, treasurers, and liquidity/regulatory-reporting teams (primarily banks and regulated financial institutions).
> **Permissions required:** Reporting / Risk Management access — see [Roles & Permissions](../../00-getting-started/04-roles-and-permissions.md).

## Overview
Asset & Liability Management (ALM) will give you an integrated view of the balance sheet —
**structural liquidity, funding, maturity mismatch, and regulatory compliance** — from a single
platform. It covers the liquidity **gap by maturity bucket**, the Basel III/IV liquidity ratios
(**LCR** and **NSFR**), **HQLA** tracking, **stress scenarios**, and **funding concentration**.

> 👁️ **In Preview.** This is the most regulation-intensive screen in
> [Risk Management](overview.md); it is in testing and available on request. ALM is aimed primarily at
> **banks and regulated institutions**. All figures below are **illustrative**, not your data.

Within Risk Management, contractual gaps and standard ratio calculations can run in-house, while
**behavioral models** (deposit stability, prepayments, drawdowns) and jurisdiction-specific
regulatory treatments can be executed by a specialist partner. See the
[hybrid model](overview.md#the-hybrid-model-in-house-engine--specialist-partners).

## Key concepts
- **Liquidity gap** — the difference between inflows and outflows in each maturity band. The
  **contractual** gap uses contract dates; the **behavioral** gap adjusts for how balances really
  behave (e.g. demand deposits that are stable in practice).
- **Maturity bucket** — a time band (e.g. <1M, 1–3M, 3–6M, 6–12M, 1–3Y, 3–5Y, >5Y) into which each
  asset and liability is slotted.
- **Cumulative gap** — the running total of the gap across buckets, showing where refinancing need
  builds up.
- **LCR — Liquidity Coverage Ratio** — HQLA divided by net cash outflows over 30 days; the regulatory
  minimum is 100%.
- **NSFR — Net Stable Funding Ratio** — available stable funding divided by required stable funding
  over a one-year structural horizon; minimum 100%.
- **HQLA — High-Quality Liquid Assets** — the liquid buffer (cash, central-bank reserves, high-grade
  bonds) classified into levels with regulatory haircuts.
- **Funding concentration** — how dependent you are on particular funding sources, counterparties,
  tenors, or currencies (a post-2008 supervisory focus).
- **Behavioral models** — models of how demand deposits, prepayments, and committed-line drawdowns
  actually behave versus their contractual terms.
- **Active ALM policy** — your thresholds (LCR/NSFR minimums and internal targets, maximum gaps, HQLA
  minimum, stress LCR floor). Mia's insights cite the policy section they enforce.

## Before you start
When live, ALM will depend on: the full balance sheet ingested via
[Integrations](../../02-integrations/overview.md) with contractual terms; a classification of assets
into HQLA levels and of liabilities by stability; historical balance series for behavioral models; and
rate curves per currency. Your **ALM policy** defines the limits that monitoring enforces.

## How to use it
> The steps describe the **intended** experience once released.

### Review liquidity position and ratios
1. Go to **Reporting › Risk Management › ALM**.
2. Check the **active policy banner** (LCR/NSFR minimums and targets, gap limits, HQLA minimum, stress
   floor).
3. Review the KPI tiles — for example **LCR, NSFR, cumulative gap <1M, HQLA, and LCR under stress** —
   each showing status against its policy limit.

### Analyse the maturity gap
1. Read the **gap analysis table** — assets, liabilities, gap, cumulative gap, and gap % per maturity
   bucket, ending in a total row.
2. Look for **negative gaps** (more outflows than inflows in a band) and where the **cumulative gap**
   signals a refinancing need.

### Run liquidity stress scenarios
1. Open the **stress scenarios** panel (e.g. **Baseline**, **Moderate stress**, **Severe stress**).
2. For each scenario, review the resulting **LCR and NSFR** and its assumptions (e.g. deposit runoff
   %, HQLA haircut, loss of wholesale funding).
3. Read the per-scenario **Mia insight**, which flags how close you are to the policy floor and
   recommends contingency actions (e.g. activating a sweep or contingency-funding facility).

### Track HQLA and funding concentration
1. Review **HQLA** by level against the policy minimum.
2. Open **funding concentration** to see the share of funding by source, tenor, currency, and
   counterparty, with alerts against your limits.

### Read Mia's analysis
1. The **Mia (AI) commentary** confirms which ratios are within policy and names the drivers.
2. Mia may also raise **proactive sector insights** — for example, an upcoming central-bank policy
   change or a scheduled sovereign credit review that could reclassify HQLA — and offer to monitor the
   event and pre-calculate the impact. These end with an actionable question you can accept.

## Configuration
- **ALM policy** — upload/maintain LCR/NSFR minimums and internal targets, maximum cumulative and
  single-bucket gaps, HQLA minimum, and stress LCR floor.
- **HQLA classification & haircuts** — how assets map to HQLA levels (standard or jurisdiction-specific
  via a partner).
- **Run-off and behavioral assumptions** — regulatory run-off rates and behavioral models for
  deposits, prepayments, and drawdowns.
- **Stress scenarios** — maintain your scenario library and assumptions.
- **Alert Settings** — ratio and gap breaches raise [Alerts](../../08-alerts/alerts.md).

## Tips & good practices
- Watch the **LCR under stress**, not just the baseline — a comfortable headline ratio can sit close
  to the floor once deposit runoff is applied.
- Use **behavioral** (not just contractual) gaps for demand deposits; contractual-only views badly
  understate deposit stability.
- Keep **funding sources diversified** — concentration in short-term wholesale funding is a recurring
  supervisory concern.
- Maintain your **ALM policy** carefully; LCR/NSFR statuses, stress flags, and Mia's recommendations
  all reference it.

## Related
- [Risk Management — Overview](overview.md) — hybrid model and partner integration.
- [Interest Rate Risk](interest-rate-risk.md) — IRRBB regulatory reporting overlaps with the banking-book view.
- [Credit Risk](credit-risk.md) — funding partners and settlement exposure.
- [Risk Cockpit](risk-cockpit.md) — LCR/NSFR summarised with the other dimensions.
- [Alerts](../../08-alerts/alerts.md) — where ratio and gap breaches surface.

## In Preview
- 👁️ **Liquidity gap** by maturity bucket (contractual and behavioral).
- 👁️ **LCR / NSFR monitoring** with HQLA classification and haircuts.
- 👁️ **Stress scenarios** with per-scenario LCR/NSFR and contingency guidance.
- 👁️ **Funding concentration** analysis and **behavioral models** (partner-calibrated).
- 👁️ **IRRBB regulatory reporting** for the banking book.
- 👁️ **Mia proactive sector insights** tied to central-bank and rating events.
