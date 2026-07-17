# Journal Entries

> **Availability:** `In Preview` 👁️ (viewing generated postings is `Available` ✅ today — see [G/L Postings](gl-postings.md))
> **Where to find it:** planned as **Reporting › Accounting** (the Accounting Hub blotter). Today, generated postings appear on the [G/L Postings](gl-postings.md) grid.
> **Who uses it:** accountants, financial controllers, treasury operations, approvers.
> **Permissions required:** `CashManagement.TransactionsPosting` · Read to view; approval rights follow your role. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

> 👁️ **In Preview.** This is in testing and available on request — contact Treasury Hub to enable it. This page describes how it works.

## Overview
A **journal entry (JE)** is a complete, balanced accounting entry — its debit and credit lines
together — created for a treasury event. Where a [posting](gl-postings.md) is the accounting output
you can view today, the **Journal Entries** module is the planned workspace where entries are
generated automatically from every workflow, routed through an approval flow, and then exported to
your ERP.

Most of what this page describes is **in preview** and is written in future tense. What exists
today is the ability to **view the postings** that transactions generate, on the
[G/L Postings](gl-postings.md) screen. Do not expect the review-and-approve workflow below to be live
until your administrator confirms it is enabled — check
your administrator.

## Key concepts
- **Journal entry (JE)** — a balanced set of debit and credit lines for one accounting event, with a
  reference, a date, the entity, and a source module.
- **Journal entry generation** — creating the entry automatically from a completed workflow (a
  payment, an FX deal, a loan disbursement, a reconciled item, and so on).
- **Approval workflow** — the configurable path an entry follows before it can be exported: who
  reviews it, at how many levels, and under what thresholds.
- **Lucas (AI) — Journal Entry Generator** — the accounting agent that can generate entries and act as a first-level approver,
  always subject to your rules and confirmation (**human-in-the-loop**: the agent proposes, a person
  can confirm or revoke).
- **Confidence score** — a 0–100% score the agent assigns to an entry, based on how well it matches
  your rules, its consistency with history, and how complete its data is.
- **Segregation of duties (SoD)** — approval rules that prevent the same person from both creating
  and approving an entry, a common regulatory requirement.

## How journal entries are generated (planned)
Journal entries are the accounting step of the platform's standard workflow model — see
[Core Concepts › Everything is a workflow](../00-getting-started/03-core-concepts.md#everything-is-a-workflow).
The intended lifecycle is:

```
Ingestion → Reconciliation → Journal Entry generated → Approval → ERP export → ERP matched
```

1. **A workflow completes** in a module (for example a payment settles or an item is reconciled).
2. **An entry is generated** automatically, using your [posting rules](coa-rules-engine.md) to pick
   the debit and credit accounts.
3. **The entry is validated** — checked that it balances and that its accounts map correctly.
4. **The entry is routed for approval** (see below).
5. **The approved entry is exported** to your ERP and, where possible, matched to any existing ERP
   record. See [Posting to your ERP](erp-integration.md).

## Journal entry statuses (planned)
An entry is planned to move through these states:

```
Draft → Pending Approval → Approved → Exported → Matched
              │
              ├─ Rejected
              └─ Escalated → Manual Review → Approved / Rejected
```

## The approval workflow (planned)

### Review and approve an entry (planned)
*The steps below describe the intended experience once this is live.*

When the module is live, the intended flow will be:

1. Open the **Accounting** blotter and filter to entries **Pending Approval**.
2. Select an entry to see its debit/credit breakdown, the accounts it maps to, its source
   transaction, and — where the AI agent was involved — its **confidence score and reasoning**.
3. Choose **Approve** or **Reject**. A rejection or override will require a justification.
4. Approved entries move to **Exported** as they are sent to your ERP.
5. Use **bulk approval** to clear batches of low-risk entries at once.

### The AI agent as a delegated approver (planned)
The accounting agent can act as a **first level of approval**, within limits you set:

| Behaviour | What it means |
|---|---|
| **Confidence scoring** | Each entry gets a 0–100% score from rule match, historical consistency, and data completeness. |
| **Auto-approval** | If the score is above your threshold and the entry meets your policies, it can be approved automatically. |
| **Escalation** | If the score is below the threshold, or an anomaly is detected, the entry is escalated to a human approver with full context. |
| **Explainability** | Every decision records the reasoning — why it approved or why it escalated. |

You stay in control: **you define the thresholds and policies, and you can revoke any approval the
agent makes.**

## Configuration (planned — In Preview 👁️)
Approval workflows are intended to be configured through natural-language prompts (for example
requiring dual approval above a set amount, restricting FX entries to the treasury team, or
auto-approving small fee entries above a confidence threshold). Configurable dimensions will include:

- **Approval levels** — single, dual, or n-level.
- **Roles / users** per level.
- **Thresholds** by amount, currency, transaction type, and entity.
- **Segregation-of-duties** rules.
- **Exceptions and overrides**, with a mandatory justification.
- **Notifications and SLAs** — per-channel alerts and time limits per approval level, with a
  pending-entry dashboard showing aging and priority.

## Tips & good practices
- Until the module is live, use the [G/L Postings](gl-postings.md) grid to see the entries your
  transactions generate.
- Plan your approval thresholds and segregation-of-duties rules with your auditors before enabling
  auto-approval, so the AI agent operates inside your control framework from day one.
- Keep your [posting rules](coa-rules-engine.md) accurate — entry generation is only as good as the
  rules behind it.

## Related
- [G/L Postings](gl-postings.md) — view generated postings today.
- [Chart of Accounts & Rules Engine](coa-rules-engine.md) — the rules that build each entry.
- [Posting to your ERP](erp-integration.md) — exporting and matching approved entries.
- [End-to-end audit trail](audit-trail.md) — the immutable record behind every entry and approval.
- [Workflows](../07-workflows/overview.md) — how approvals are modeled across the platform.

## In Preview
- 👁️ **Automatic journal-entry generation** — balanced entries created from every module (Payments,
  FX, Loans, Investments, Reconciliation).
- 👁️ **Configurable approval workflow** — multi-level approvals with thresholds, SoD, SLAs, and
  bulk approval.
- 👁️ **AI accounting agent as delegated approver** — confidence-based auto-approval with escalation
  and full explainability, always human-in-the-loop.
