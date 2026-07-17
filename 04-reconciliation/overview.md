# Reconciliation — Overview

> **Availability:** `In Preview` 👁️
> **Where to find it:** Reconciliation
> **Who uses it:** treasury operations, finance team, accountants.
> **Permissions required:** reconciliation access (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).


> 👁️ **In Preview.** The Reconciliation module is in testing and available on request — contact Treasury Hub to enable it. This page describes how it works.

## Overview
The Reconciliation module automatically matches your financial data across sources — bank
movements, PSP settlements, ERP/internal records, invoices, and treasury deals — so you can see
what's settled, what's partial, and what needs attention. It combines **configurable rules** with
**AI-assisted suggestions** to reconcile most items with no manual effort, and gives you a full
**audit trail** of every match.

The goal: turn what used to be a manual, spreadsheet-driven process (often ~45 minutes per item)
into near-instant, explainable, auditable reconciliation.

## Key concepts
- **Movement** — an individual financial item (a bank movement, a payin/payout, a PSP settlement,
  a fee). These are the raw items to be reconciled.
- **Flow** — a chain of related movements that belong together, e.g. **Payout Internal → Payout
  PSP → Bank Movement**. A flow is *fully reconciled* when every step in the chain is matched.
- **Match** — the link between two or more items the system considers the same real-world event.
  Matches can be **1-to-1** or **batch** (many-to-many).
- **Reconciliation status** — each item/flow is **Fully Reconciled**, **Partially Reconciled**, or
  **Unreconciled** (see [Reconciliation statuses](#reconciliation-statuses) below).
- **Reconciliation rule / criteria** — the conditions that make items match (amount, tolerance,
  reference, date ± N days, partner, currency…).
- **Rule chain** — an ordered set of rules the engine applies in sequence.
- **Sophia (AI)** — the reconciliation assistant that suggests matches with a confidence score,
  explains its reasoning, learns from your manual matches, and flags anomalies.
- **Mateo (AI)** — the Confirmation Matcher agent (in preview), which matches and confirms deal and
  settlement confirmations against your records. See [Agents](../09-agents/overview.md).

## Reconciliation statuses
A flow is a chain of steps that must each be matched for the transaction to be complete (for example
**Payout Internal → Payout PSP → Bank Movement** is a 3-step flow). The status tells you how far along
that matching is:

| Status | Meaning | Example progress |
|---|---|---|
| **Fully Reconciled** | Every step in the flow is matched — the transaction is completely accounted for. | 3 / 3 |
| **Partially Reconciled** | At least one step is matched, but one or more are still outstanding. The money is partly accounted for; something (a settlement, a bank posting, a fee) is missing or not yet matched. | 2 / 3 |
| **Unreconciled** | None of the flow's steps are matched yet. | 0 / 3 |

You see the status on each row of [Flows (Reconciliation Status)](movements-and-flows.md) — with a **progress
bar** showing matched steps ÷ total — and as KPI tiles on the [Dashboard](dashboard.md).

> **Tip:** work **Partially Reconciled** items first — a partial flow usually means an expected leg
> hasn't arrived or hasn't been matched, so it's where problems (missing settlements, delays,
> duplicates) tend to surface.

## What's in the module
The Reconciliation menu contains these screens:

| Screen | What it's for |
|---|---|
| [Dashboard](dashboard.md) | KPIs, status breakdown, savings, volume trends. |
| [Flows (Reconciliation Status)](movements-and-flows.md) | Browse your reconciliation flows; expand a flow to see the movements inside it. |
| [Matching (1-to-1 & Batch)](matching.md) | Confirm suggested matches, match manually, run batch matching. |
| [Rules & Criteria](rules-and-criteria.md) | Define and chain the rules that drive auto-matching. |
| [Approvals](approvals.md) | Review and approve/reject reconciliation requests, individually or in batch. |
| [Workflows (Settings › Reconciliation Flows)](workflows.md) | Configure the resolution workflows/flows (PSP & Bank, Invoice, Bank-to-Bank, and treasury-specific). Configured under Settings, not the Reconciliation menu. |
| [ERP Posting](erp-posting.md) | Post reconciled items to your ERP. |

## How reconciliation works, end to end
1. **Data arrives** through [Integrations](../02-integrations/overview.md) (bank statements, PSP
   feeds, ERP, files, email/SFTP) and becomes normalized **movements**.
2. **The engine applies your rules** (and rule chains) to propose matches, grouping related items
   into **flows**.
3. **Sophia (AI) suggests** additional matches with a confidence score and an explanation, and
   **flags anomalies** (unusual amounts, duplicates, off-hours activity).
4. **You review** on the [Matching](matching.md) screen — accept suggestions, match manually, or
   handle exceptions. Batch matching handles high volumes at once.
5. **Approvals** route requests to the right people (individually or in batch).
6. **Reconciled items post to your ERP** via [ERP Posting](erp-posting.md), with the full trail
   preserved.

## Before you start
- Make sure your data sources are connected — see [Integrations](../02-integrations/overview.md).
- Set up your [matching rules & criteria](rules-and-criteria.md) (or start from the built-in
  workflows).
- Confirm your team's [permissions and approval routing](../00-getting-started/04-roles-and-permissions.md).

## Tips & good practices
- Start with the **built-in workflows** (PSP & Bank, Invoice, Bank-to-Bank), then refine rules as
  you see real exceptions.
- Let **Sophia's suggestions** train the engine — every manual match improves future auto-matching.
- Use the **Dashboard** period selector to monitor auto-match rate and exception backlog.
- Handle **anomaly alerts** promptly; they often surface duplicates or data issues upstream.

## Related
- [Integrations](../02-integrations/overview.md) — where the data comes from.
- [ERP Posting](erp-posting.md) and [Accounting / G/L Postings](../11-accounting/gl-postings.md).
- [Alerts](../08-alerts/alerts.md) — reconciliation exceptions surface here too.
- [Admin — Matching Rules](../10-admin-console/matching-rules.md).
