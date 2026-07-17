# Payments — Overview

> **Availability:** `Available` ✅ (core payment management — blotter, creating payments, invoices) · `In Preview` 👁️ (Payment Approvals, Payment Lifecycle Blotter, Net Settlements, SWIFT/SEPA network dispatch, sanctions screening, ERP/NetSuite AP integration — premium/Upgrade)
> **Where to find it:** Payments
> **Who uses it:** treasury operations, accounts payable, finance managers, approvers.
> **Permissions required:** `CashManagement.Payments` — Read to view, CreateEdit to create and approve. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
The Payments module — the **Payment Hub** — is where your organization prepares, approves, and
tracks every outbound payment from one place, instead of logging into a separate portal for each
bank. You can raise a single payment or a batch (supplier runs, payroll, intercompany, tax),
route it for **multi-level approval**, and follow it all the way to settlement — with a full audit
trail of who did what and when.

The goal: replace the manual, portal-by-portal, spreadsheet-controlled payment process with one
governed, auditable workflow that works across all your banks and currencies.

## Key concepts
- **Payment** — an instruction to move money from one of your accounts (the **debtor account**) to
  a beneficiary's account (the **creditor account**). A payment has a header and one or more detail
  lines.
- **Batch payment** — a single payment that carries **multiple detail lines** (for example, one
  supplier run paying many invoices, or a payroll file). Each line has its own amount, remittance
  information, and execution date.
- **Beneficiary** — the party you are paying. Beneficiary and bank details can be reused across
  payments so you don't re-key them.
- **Payment corridor / rail** — the network a payment travels on to reach the beneficiary's bank,
  such as **SWIFT** (cross-border) or **SEPA** (Eurozone), alongside local instant and batch rails.
  Treasury Hub records which corridor each payment uses.
- **Approval level** — the authority a user holds for signing off payments. A payment carries the
  **approval level it requires**, and only users at or above that level can approve it. See
  [Payment Approvals](approvals.md).
- **Status** — where a payment is in its lifecycle: pending approval, sending, sent/settled, or in
  an exception/rejected state. See [Payment Blotter](payment-blotter.md).

## What's in the module
The Payments menu contains these screens:

| Screen | What it's for |
|---|---|
| [Payment Blotter](payment-blotter.md) | The main list of payments, with status tabs, details, status history, and failed imports. ✅ Available |
| [Creating a payment](creating-a-payment.md) | The multi-step form for raising a new single or batch payment (opened from the blotter via **+ New Payment**). ✅ Available |
| [Payment Approvals](approvals.md) | Review payments awaiting sign-off and approve or reject them. 👁️ In Preview |

> **Related:** [Invoices](invoices.md) — the invoice documents that back your payables — live under
> **Reports › Operations › Invoices (Facturas)**, not the Payments menu. ✅ Available

## How payments flow, end to end
1. **A payment is created** — either directly in Treasury Hub via the
   [multi-step form](creating-a-payment.md), or generated from your ERP's accounts-payable data
   (add-on).
2. **It is validated** — the form checks the essentials (for example, the debtor and creditor
   accounts must differ and the amount must be positive). Enhanced pre-send validation, including
   sanctions screening, is available as an add-on.
3. **It routes for approval** — based on your rules, the payment will require one or more approvers,
   and the creator cannot approve their own payment (four-eyes). The dedicated
   [Payment Approvals](approvals.md) workspace is **in preview** (premium plan).
4. **It is dispatched** — approved payments are sent to the bank. SWIFT/SEPA message dispatch and
   real-time tracking are provided by the connectivity add-on.
5. **Its status is tracked** — you follow progress on the [Blotter](payment-blotter.md), with a
   full status history and notes on every payment.

## What's available vs. add-on
Treasury Hub is modular. For payments:

| Capability | Status |
|---|---|
| Payment Blotter, status tabs, detail & status history | ✅ Available |
| Multi-step single & batch payment creation | ✅ Available |
| Notes and failed-imports management | ✅ Available |
| [Invoices](invoices.md) (upload, download, metadata) | ✅ Available |
| [Payment Approvals](approvals.md) — multi-level approvals with mandatory rejection notes | 👁️ In Preview · Premium (Upgrade) |
| Payment Lifecycle Blotter | 👁️ In Preview · Premium (Upgrade) |
| Net Settlements | 👁️ In Preview · Premium (Upgrade) |
| SWIFT / SEPA message dispatch & real-time tracking | 👁️ In Preview · Premium (Upgrade) |
| Sanctions / AML pre-send screening | 👁️ In Preview · Premium (Upgrade) |
| ERP / NetSuite accounts-payable integration | 👁️ In Preview · Premium (Upgrade) |

Core payment management — the blotter, creating payments, and invoices — is live today;
Payment Approvals, the Payment Lifecycle Blotter, Net Settlements, and the network-dispatch,
screening, and ERP capabilities above are premium modules still in development.

## Before you start
- Make sure the **bank accounts** you'll pay from exist and you have access to them — see
  [Bank Accounts](../06-reporting/bank-accounts.md).
- Confirm your **permissions**: `CashManagement.Payments` at CreateEdit to raise payments, plus a
  sufficient **payment approval level** to sign them off.
- Agree your **approval rules** (how many approvers, at what amounts) with your administrator.

## Tips & good practices
- Use **batch payments** for supplier runs and payroll so many lines move through one approval.
- Keep beneficiary and bank details clean and reusable to avoid rejected payments from bad
  BIC/IBAN data.
- Attach the backing document in [Invoices](invoices.md) so approvers have full context.

## Related
- [Payment Blotter](payment-blotter.md) · [Creating a payment](creating-a-payment.md) ·
  [Payment Approvals](approvals.md) · [Invoices](invoices.md)
- [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md) — approval levels and access.
- [Core Concepts](../00-getting-started/03-core-concepts.md) — company structure and workflows.
- [Reconciliation](../04-reconciliation/overview.md) — where dispatched payments are matched back to bank movements.

## In Preview
- 👁️ **Enhanced pre-send validation & tracking** — multi-layer message validation and real-time
  payment status (via the connectivity add-on) continue to expand. Confirm current scope with the
  Treasury Hub team.
- 👁️ **Payment AI agents** — **Ethan** (Payment Processor) to assist with creating, batching, and
  routing payments, and **Ava** (AML & Compliance) to screen payments and counterparties for
  sanctions/AML. See [Agents](../09-agents/overview.md).
