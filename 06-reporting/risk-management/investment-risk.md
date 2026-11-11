# Investment Risk

> **Put idle cash to work, with every investment kept within policy**
>
> **Why it matters**
> - **Nothing sits idle unnoticed**: surplus cash is flagged against your forecast, so a balance earning nothing is a decision rather than an oversight.
> - **Limits checked continuously, not at quarter end**: every holding is measured against your investment policy as positions change.
> - **One portfolio view**: instrument, counterparty and maturity in one place, with the yield each position is actually returning.
>
> *For the CFO: the return on surplus cash becomes a managed number with a policy behind it, and the board question "what are we doing with the cash?" has a standing answer.*

> **Where to find it:** Reporting › Risk Management › Investment Risk
> **Who uses it:** treasurers, investment managers, risk managers, CFOs.
> **Permissions required:** Reporting / Risk Management access — see [Roles & Permissions](../../00-getting-started/04-roles-and-permissions.md).

## Overview
Surplus cash sits idle, or in investments nobody monitors. Investment Risk tracks every investment
against limits, yield and risk: the portfolio by **instrument, counterparty and maturity**, the
**annualized yield** each position returns, your **policy limits** checked continuously, and the
**idle cash** that could be invested.

Within [Risk Management](overview.md), straightforward outputs — portfolio aggregation, yield
calculation, limit checks — run in-house, while model-intensive valuation can be executed by a
specialist partner. See the [hybrid
model](overview.md#the-hybrid-model-in-house-engine--specialist-partners).

## Key concepts
- **Portfolio** — your investment holdings, grouped by **instrument**, by **counterparty**, and by
  **maturity**.
- **Annualized yield** — the return a position is producing, stated on an annual basis so
  instruments of different tenors can be compared.
- **Policy limit** — a constraint from your investment policy, for example a maximum exposure to one
  counterparty, an instrument type, or a maturity bucket. Limits are checked continuously, and a
  breach is raised rather than waiting for a review.
- **Idle cash** — balances with no investment against them, identified from your
  [cash forecast](../cash-forecast.md) so the surplus you can actually commit is what gets flagged.
- **Concentration** — how much of the portfolio sits with one counterparty or in one instrument;
  the counterparty side is also carried on [Credit Risk](credit-risk.md).

## Before you start
Investment Risk depends on: your investment positions, recorded on the
[Operations Blotters](../operations-blotters.md); your **investment policy** (permitted instruments,
counterparty and concentration limits, maximum maturities); current valuations from
[Mark-to-Market](mark-to-market.md); and a [cash forecast](../cash-forecast.md) good enough to tell
genuine surplus from cash you will need.

## How to use it

### See your portfolio and its yield
1. Go to **Reporting › Risk Management › Investment Risk**.
2. [CONFIRM: screen-level steps — PM to supply.] The screen groups holdings by instrument,
   counterparty and maturity, and shows the annualized yield for each.

### Check your positions against policy
1. Review the limit status across the portfolio — counterparty, instrument and maturity.
2. [CONFIRM: screen-level steps — PM to supply.]
3. Breaches also raise [Alerts](../../08-alerts/alerts.md), so you do not have to be on the screen
   to hear about one.

### Find cash you could be investing
1. Review the idle-cash figure against your [cash forecast](../cash-forecast.md).
2. [CONFIRM: screen-level steps — PM to supply.]

## Configuration
- **Investment policy** — permitted instruments, counterparty and concentration limits, and maximum
  maturities. These drive the limit status on the portfolio.
- **Alert Settings** — thresholds that raise [Alerts](../../08-alerts/alerts.md) when a limit is
  approached or breached.
- **Valuation source** — see [Mark-to-Market](mark-to-market.md).

## Tips to get more value
- Start with the maturity ladder rather than the yield column: cash you need back before an
  instrument matures is the risk that actually hurts, so fix the shape first.
- Read the idle-cash figure alongside your forecast accuracy on [Actual vs
  Forecast](../actual-vs-forecast.md) — a forecast you trust is what lets you commit cash for
  longer and earn more.
- Review concentration by counterparty here and on [Credit Risk](credit-risk.md) together, so a
  name that looks fine on yield is not quietly your largest single exposure.

## Where to go next
- [Operations Blotters](../operations-blotters.md) — one source of truth for every FX deal, loan and
  investment, including the positions measured here.
- [Cash Forecast](../cash-forecast.md) — spot the surplus weeks before you have to decide what to do
  with it.
- [Credit Risk](credit-risk.md) — see counterparty deterioration before it becomes a loss.
- [Mark-to-Market](mark-to-market.md) — know what every position is worth today.
- [Risk Cockpit](risk-cockpit.md) — investment risk summarised alongside the other dimensions.
- [Alerts](../../08-alerts/alerts.md) — know the moment a policy limit is breached.
