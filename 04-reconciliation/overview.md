# Reconciliations — Overview

> **Reconcile most items automatically, and focus only on real exceptions**
>
> **Why it matters**
> - **Days back each month**: configurable rules match the bulk with no manual effort.
> - **Across every source**: bank movements, PSP settlements, ERP and internal records, invoices and treasury deals.
> - **Explainable every time**: a full audit trail of every match, so a result can always be defended.
>
> *For the CFO: the close stops depending on how many people are available to reconcile, and every matched item carries its evidence.*

> **Where to find it:** Reconciliation
> **Who uses it:** treasury operations, finance team, accountants.
> **Permissions required:** reconciliation access (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).

## Overview
Get most of the month's matching done before anyone opens a spreadsheet: the Reconciliation module
matches your financial data automatically across sources — bank movements, PSP settlements,
ERP/internal records, invoices, and treasury deals — so you see what's settled, what's partial, and
what needs attention. It applies **configurable rules** to
reconcile most items with no manual effort, and gives you a full **audit trail** of every match.

The goal: turn what used to be a manual, spreadsheet-driven process into explainable, auditable
reconciliation.

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
- **Workflow Studio** — where a reconciliation workflow is built. You can describe the workflow you
  want in plain language and the agent prepares it for you to review and save — it never saves
  anything itself. See [Workflows](workflows.md) and
  [AI assistance](../09-agents/overview.md).

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
The Reconciliation menu has two groups: **Administration**, the screens you work the reconciliation
on, and **Reporting**, the read-only reports. A few related screens are configured under Settings
instead.

| Screen | Where to find it | What it's for |
|---|---|---|
| [Dashboard](dashboard.md) | Reconciliation › Administration › Dashboard | KPIs, status breakdown, savings, volume trends. |
| [Flows (Reconciliation Status)](movements-and-flows.md) | Reconciliation › Administration › Reconciliation Status | Browse your reconciliation flows; expand a flow to see the movements inside it. |
| [Matching (1-to-1 & Batch)](matching.md) | Reconciliation › Administration › Matching 1-to-1 | Match by hand what the rules didn't: every eligible movement per side, with ranked candidates for the one you pick. |
| [Approvals](approvals.md) | Reconciliation › Administration › Reconciliation Approvals | Review and approve/reject reconciliation requests, individually or in batch. |
| [Conciliations](conciliations.md) | Reconciliation › Administration › Conciliations | The register of matches that exist — what the rules, approvals and manual matching produced. |
| [Conciliation Reporting](conciliation-reporting.md) | Reconciliation › Reporting › Conciliation Reporting (also Reporting › Operations) | What was reconciled and what is still open, one week at a time, with the Excel download. |
| [Fee Report](fee-report.md) | Reconciliation › Reporting › Fee Report (also Reporting › Operations) | What each payment provider should charge per contract each month, and whether its settlements deducted it right. |
| [Rules & Criteria](rules-and-criteria.md) | Settings › Reconciliation › Reconciliation Flows → open a flow | Define and chain the rules that drive auto-matching. |
| [ERP Posting](erp-posting.md) | no screen | Reconciliation does not post to an ERP; the page explains what is kept. |
| [Workflows](workflows.md) | Settings › Reconciliation › Reconciliation Flows | Configure the resolution workflows/flows (PSP & Bank, Invoice, Bank-to-Bank, and treasury-specific). |

## How reconciliation works, end to end
1. **Data arrives** through [Integrations](../02-integrations/overview.md) (bank statements, PSP
   feeds, ERP, files, email/SFTP) and becomes normalized **movements**.
2. **The engine applies your rules** (and rule chains) to propose matches, grouping related items
   into **flows**.
3. **You review** on the [Matching](matching.md) screen — accept proposed matches, match manually, or
   handle exceptions.
4. **Approvals** route requests to the right people (individually or in batch).
5. **The confirmed reconciliation is the end of the chain**, with the full trail preserved.
   Reconciliation does not post to your ERP — see [ERP Posting](erp-posting.md) — and the accounting
   system.

## Before you start
- Make sure your data sources are connected — see [Integrations](../02-integrations/overview.md).
- Set up your [matching rules & criteria](rules-and-criteria.md) (or start from the built-in
  workflows).
- Confirm your team's [permissions and approval routing](../00-getting-started/04-roles-and-permissions.md).

## Tips to get more value
- Start with the **built-in workflows** (PSP & Bank, Invoice, Bank-to-Bank), then refine rules as
  you see real exceptions.
- When a manual match keeps repeating, turn it into a rule so the engine handles it next time.
- Use the **Dashboard** period selector to monitor auto-match rate and exception backlog.
- Handle **reconciliation alerts** promptly; they often surface duplicates or data issues upstream.

## Where to go next
- [Integrations](../02-integrations/overview.md) — connect any source once, and the data this
  module matches arrives on its own from then on.
- [Accounting / G/L Postings](../11-accounting/gl-postings.md) — turn reconciled activity into
  journals with evidence, posted to your ERP after approval.
- [ERP Posting](erp-posting.md) — reconciled items become accounting entries with no re-keying.
- [Alerts](../08-alerts/alerts.md) — know the moment a break needs attention, without watching
  the dashboard.
- [Admin — Matching Rules](../10-admin-console/matching-rules.md) — tag and post transactions
  automatically across the whole organization. These are separate from the reconciliation rules above.
