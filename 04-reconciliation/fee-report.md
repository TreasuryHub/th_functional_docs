# Reconciliation — Fee Report

> **Where to find it:** Reconciliation › Reporting › Fee Report (also listed as **Fee Report** under **Reporting › Operations**)
> **Who uses it:** treasury operations, finance team, accountants, accounts payable.
> **Permissions required:** reconciliation access · Read (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).

## Overview
If you collect through payment providers, each one charges you a fee set by your contract with it —
a fixed amount or a percentage per payment, a monthly charge, a price that drops once your volume
passes a threshold. The Fee Report works out, month by month and contract by contract, **what each
provider should charge you**. For the providers that deduct their fee from what they settle, it
also checks **what they actually deducted**, settlement by settlement, and against the deposit that
reached your bank.

The report reads your reconciled data; it does not create movements or change any reconciliation.

## Key concepts
- **Contract** — one agreement with one provider, for one of your legal entities. It is what the
  report is calculated per: a provider you deal with under two entities is two contracts.
- **Partner and merchant** — the two values that decide which payments a contract counts. A payment
  belongs to a contract when both its partner (the provider) and its merchant identifier (your
  account, company ID or tax ID with that provider) are listed on the contract. A payment belongs
  to at most one contract.
- **Concept** — a line of the contract's pricing: a fixed amount, a rate, or both, charged either
  **per payment** or **monthly**. A concept can apply to one payment method only, so card and cash
  can be priced differently.
- **Tier** — a price that starts from a monthly volume. The detail shows both the **tier applied**
  and the **tier reached this month**; on some contracts a cheaper tier only takes effect after the
  volume has been sustained for several months, and it never applies to months already past.
- **Base amount** — the gross value of the payments counted, and what percentage fees are
  calculated on.
- **Charged** — how the provider takes its fee: **Deducted from settlement** (it keeps the fee out
  of what it pays you) or **Invoiced** (it bills you separately).
- **Settlement check** — for a contract whose fee is deducted, a comparison of one settlement: the
  fee, tax and net it should carry against the ones it reports, and its net against the bank
  deposit reconciled with it.
- **Difference** — always *reported minus expected*. A positive number means the provider kept or
  reported more than the contract says.

## Before you start
- Your provider contracts must be loaded for your tenant. Treasury Hub does this; the screen reads
  them and does not edit them. A tenant with no contracts sees empty tabs.
- Payments reach a contract only once the data carries the merchant identifier. Until the
  integration that brings those payments in fills it, they appear on **Without contract** — see
  [Integrations](../02-integrations/overview.md).
- Settlement checks compare against the bank only where the settlement has been reconciled with its
  deposit, so keep [Matching](matching.md) and [Approvals](approvals.md) current.

## How to use it

### Read a month's expected fees
1. Open **Reconciliation › Reporting › Fee Report**. It opens on **Fees by contract** for the
   previous month — the last closed one.
2. Read the banner above the grid: the month's **Fee**, **Tax** and **Total** per currency, and
   when the month was last calculated (UTC).
3. Read the grid. One row per contract: **Contract**, **Name**, **Entity**, **Partners**,
   **Charged**, **Currency**, **Payments**, **Base amount**, **Fee**, **Tax** and **Total**.
4. Click a row to open its detail, one line per concept: **Concept**, **Payment method**,
   **Basis**, **Tier applied**, **Tier reached this month**, **Payments**, **Base amount** and
   **Fee**. This is where you see why a contract cost what it cost.

### Check what a provider actually deducted
1. Open the **Settlement checks** tab. It lists the month's settlements, 50 at a time, for the
   contracts whose fee is deducted from the settlement.
2. Each row shows the settlement — its date, its ID and external ID — the payments behind it
   (**Payins**, and **Other payins** for the ones belonging to another contract or to none), the
   **Gross**, then **Expected fee** and **Expected tax** against **Reported fee** and **Reported
   tax**, and **Expected net** against **Settlement net**.
3. Read the three difference columns: **Fee + tax difference**, **Net difference** and **Bank
   difference** (the reconciled deposit against the settlement's net). A non-zero difference is
   shown in red.
4. Pick a **Contract** to look at one provider, and turn on **Only differences** to leave just the
   rows that do not agree.

### Find payments no contract covers
1. Open the **Without contract** tab. It lists, per partner and merchant, the payments from a
   provider you do have a contract with that no contract counted, with their **Payments** count and
   **Base amount**.
2. Rows here usually mean a new merchant account that is not on any contract yet, or data arriving
   without its merchant identifier. Either way those payments are missing from the fees above, so
   clear them before trusting the month's total.

### Move between months and refresh a month
1. Use **Previous month** and **Next month**, or pick one in **Month**. **Next month** is
   unavailable once you are on the current month, and a future month lands on the current one.
2. Click **Recalculate** to recompute the month you are looking at. The button reads
   *Recalculating…* while it runs, then a message summarises what was written and the three tabs
   reload. Use it after a contract has been loaded or a late file has arrived.
3. Treasury Hub recalculates the current month and the previous one every day, so most of the time
   you do not need to.

### Download the workbook
1. Click **Export month**. The button reads *Exporting…* while the file is produced.
2. Your browser saves `Fee Report {month}.xlsx`, with the three views as sheets.
3. The download is the whole month: the filters on screen narrow the grid, not the file.

## Configuration
Your contracts are set up by Treasury Hub and shape every figure on this screen. Each one carries:

- **The provider and merchant values** that decide which payments it counts, and the **legal
  entity** it belongs to.
- **The date it starts counting from.** Payments before it are not in the monthly totals.
- **Its concepts** — fixed amount, rate, or both, per payment or once a month, optionally for one
  payment method — each with the **tiers** that price it from a given monthly volume, and whether
  rounding happens on each payment or on the concept's total.
- **The currency** the fee is charged in.
- **The tax rate**, and whether tax is worked out on the rounded or the unrounded fees.
- **How the fee is charged** — deducted from the settlement, or invoiced — which is what decides
  whether the contract appears on the **Settlement checks** tab.

A price change is loaded as a new concept starting on the day the new price took effect, so a month
is always costed at the prices that applied then. For the same reason, a settlement is checked with
the prices in force on each payment's own date: a payment made at the end of a month and settled in
the next one is still charged at the earlier month's price. To change a contract, ask your Treasury
Hub administrator.

## Tips & good practices
- Close **Without contract** first. A single uncovered merchant makes every total on the month look
  too low.
- Use **Only differences** as your working queue: a short list of settlements to query with the
  provider beats reading every row.
- Treat a non-zero **Bank difference** as a banking question and a non-zero **Fee + tax
  difference** as a contract question — they usually have different owners on your team.
- Open a contract's concept detail before challenging a provider. **Tier applied** against **Tier
  reached this month** explains most surprises on a volume-based contract.
- Recalculate a closed month once, a few days after the month end, so late settlements and
  reconciliations are included before you use the figures.
- Fees and base amounts are in the contract's currency; read the banner's per-currency totals
  rather than adding rows across currencies.

## Related
- [Reconciliation Overview](overview.md) — how the reports fit the end-to-end flow.
- [Conciliation Reporting](conciliation-reporting.md) — the other reconciliation report, on what is
  reconciled and what is still open.
- [Conciliations](conciliations.md) — the reconciliations behind a settlement's bank check.
- [Matching (1-to-1 & Batch)](matching.md) — reconcile the settlements and deposits this report
  compares.
- [Integrations](../02-integrations/overview.md) — where the provider data arrives from.
