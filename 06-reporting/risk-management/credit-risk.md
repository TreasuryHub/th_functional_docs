# Credit Risk

> **Where to find it:** Reporting › Risk Management › Credit Risk
> **Who uses it:** risk managers, treasurers, credit officers; for the Funding tab, partner/settlement operations teams.
> **Permissions required:** Reporting / Risk Management access — see [Roles & Permissions](../../00-getting-started/04-roles-and-permissions.md).

## Overview
Credit Risk continuously monitors the risk that a **counterparty or funding partner** fails to
meet its obligations — from current exposure through to expected loss — with early warning of
deterioration. The screen has two tabs:

- **By Stage** — counterparty credit quality under IFRS 9 (staging, expected credit loss, limits, and
  a watch list).
- **Funding** — real-time monitoring of **partner funding risk**: prefund balances, credit-line
  utilization, and settlement exposure.

Within [Risk Management](overview.md), aggregations (exposure, limit utilization, concentration) can
run in-house, while calibrated PD/LGD models and potential-future-exposure simulation can be executed
by a specialist partner. See the [hybrid model](overview.md#the-hybrid-model-in-house-engine--specialist-partners).

## Key concepts
- **Counterparty exposure** — how much you stand to lose if a counterparty defaults. **Current
  exposure** is today's net mark-to-market (per netting set); **potential future exposure (PFE)**
  estimates how it could grow.
- **IFRS 9 staging** — loans/exposures are classified **Stage 1 (performing)**, **Stage 2
  (significant increase in credit risk — SICR)**, or **Stage 3 (non-performing — NPL)**.
- **PD / LGD / EAD** — the building blocks of expected loss: **Probability of Default**, **Loss Given
  Default**, and **Exposure at Default**.
- **Expected Credit Loss (ECL)** — PD × LGD × EAD, per counterparty and for the portfolio.
- **NPL ratio** — the share of the book that is non-performing (Stage 3).
- **Concentration** — how exposure clusters by counterparty, sector, geography, or rating, measured
  against limits.
- **Credit limit vs utilization** — the approved limit per counterparty vs how much is used; alerts
  fire as utilization approaches or breaches the limit.
- **Watch list** — a prioritised list of counterparties showing signs of deterioration (rating
  downgrade, rising days-sales-outstanding, missed payment, widening CDS spread).
- **Active credit-risk policy** — your thresholds (NPL target, SICR/NPL triggers, concentration
  limits, coverage ratio), shown in the policy banner at the top of the screen.

### Funding-tab concepts
- **Funding model** — how a partner settles: **Prefund** (partner pre-loads a balance you draw down),
  **Credit / post-fund** (you extend a credit line the partner uses and repays), or **Net
  settlement** (positions net and settle periodically).
- **Funding hierarchy: Partner › Corridor › Account** — thresholds and balances are tracked per
  **partner**, per **corridor** (a country/currency route), and per **account**.
- **Prefund controls** — minimum prefund per corridor, **low-balance alerts** (e.g. at 20%
  remaining), and **auto-queue** (hold transactions when a balance is insufficient rather than
  rejecting them).
- **Credit-line controls** — approval workflow, real-time utilization (limit, utilized, days-to-due),
  interest/charges, and **automatic suspension** on breach (e.g. utilization over a ceiling, expiry,
  or a compliance flag).

## Before you start
Credit Risk depends on: counterparty positions and mark-to-market from
[Integrations](../../02-integrations/overview.md) and [Mark-to-Market](mark-to-market.md); financials
and payment history for scoring; approved credit limits; and — for the Funding tab — real-time balance
sync with your core banking. Your **credit-risk policy** and **funding policy** define the thresholds
that monitoring enforces.

## How to use it

### Review counterparty credit quality (By Stage tab)
1. Go to **Reporting › Risk Management › Credit Risk** and stay on the **By Stage** tab.
2. Check the **active policy banner** for the version and key thresholds (NPL target, SICR/NPL
   triggers, concentration and coverage limits).
3. Review the KPI tiles (e.g. **active loans, outstanding, NPL ratio vs target, total ECL**).
4. Read the **stage breakdown table** — # of exposures, outstanding, % of total, ECL, coverage, and
   PD range for Stage 1 / 2 / 3.

### Work the watch list
1. Open the **counterparty watch list** — the names flagged by your policy.
2. Select a counterparty card to expand its detail: stage, outstanding, **PD / LGD / EAD**, ECL, and
   the **policy reference** that triggered the flag.
3. Use the actions offered (e.g. **restructure proposal, write-off request, committee review**).

### Monitor partner funding risk (Funding tab)
1. Select the **Funding** tab.
2. Review the **funding policy banner** (min prefund per corridor, low-balance alert level,
   auto-queue rule, credit-line max utilization, max exposure per partner, settlement cycle).
3. Read the KPI tiles for **prefunding** (prefunded partners and total balance, low-balance alerts,
   auto-queued transactions, real-time sync rate) and **post-funding/credit** (active credit lines and
   amount utilized, average utilization, suspensions, accrued interest).
4. In the **partner table**, review each partner's **type, funding model, balance/limit,
   utilization, low-balance flag, days-to-due, auto-queue count, settlement cycle,** and status.

### Manage a partner's funding (Funding tab)
1. Select a partner to expand its detail across two areas:
   - **Prefunding controls** — per-corridor thresholds and current balances, low-balance alert status
     and delivery channels, auto-queue logic, and core-banking sync status.
   - **Credit-line details** — request/approval workflow, available vs utilized limit, days-to-due,
     interest rate, and auto-suspension triggers; plus a downloadable **partner statement**.
2. Use the footer actions as needed (e.g. **send low-balance alert, release queued transactions,
   review credit-line request, generate partner statement**).

## Configuration
- **Credit-risk policy** — upload/maintain thresholds (NPL target, SICR/NPL PD triggers, single-name
  and sector concentration limits, ECL coverage ratio).
- **Funding policy** — minimum prefund per corridor, low-balance alert level, auto-queue vs reject,
  credit-line max utilization, max exposure per partner, and settlement cycle.
- **Credit limits** — approved limits per counterparty and instrument type.
- **Alert Settings** — utilization and breach thresholds that raise [Alerts](../../08-alerts/alerts.md).

## Tips & good practices
- Watch **Stage 2** names closely — a PD crossing the Stage 3 trigger forces lifetime-ECL
  provisioning, which can be a large P&L charge.
- Use the **concentration** view to keep sector/geography exposure within policy before it becomes a
  problem.
- On the Funding tab, treat **low-balance and auto-queue** signals as operational priorities — a
  depleted corridor can stall settlements.
- Keep both policies current; the value of the alerts depends on the thresholds you set.

## Capabilities at a glance
- **By Stage tab** — IFRS 9 staging, ECL, credit limits, and counterparty watch list.
- **Funding tab** — prefund, credit-line, and net-settlement monitoring across the Partner ›
  Corridor › Account hierarchy.
- **Policy-driven monitoring** — status flags and alerts checked against your active credit-risk and
  funding policies.
- **Partner PD/LGD and PFE** via specialist partner integration.

## Related
- [Risk Management — Overview](overview.md) — hybrid model and partner integration.
- [Mark-to-Market](mark-to-market.md) — fair values feed current-exposure calculations.
- [Risk Cockpit](risk-cockpit.md) — credit KPIs (ECL, NPL) summarised alongside other dimensions.
- [Alerts](../../08-alerts/alerts.md) — where limit and low-balance breaches surface.
