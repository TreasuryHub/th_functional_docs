# Counterparties & SSIs

> **Availability:** `In Preview` 👁️
> **Where to find it:** Admin Console › Master Data › Counterparties & SSIs
> **Who uses it:** treasury operations, accounts payable, administrators.
> **Permissions required:** `CoreData.Counterparties` and `CoreData.SSIs` — Read to view; Create/Edit to add; **Approve** to authorize banking changes (maker-checker). See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

> 👁️ **In Preview.** Counterparties & SSIs is in testing and available on request — contact Treasury Hub to enable it. This page describes how it works.

## Overview
To pay someone by transfer you need two things: **who** you're paying and **where/how** the money settles.
Counterparties & SSIs manages both, so payments are raised against known, validated payees instead of
free-typed account numbers.

- **Counterparty** — the company you pay (supplier, customer, intragroup entity, or bank).
- **SSI (Standard Settlement Instruction)** — a counterparty's banking coordinates for settlement, held
  **one set per currency**.

When you create a payment, you pick your payer company and account, then the payee **counterparty** and one
of **its** SSIs — and the list only ever shows that counterparty's instructions, so you can't pay one party
into another's account.

## Key concepts
- **One-to-many** — a counterparty has **many SSIs**; each SSI belongs to **exactly one** counterparty. An
  SSI (a beneficiary account) is never shared across counterparties, which makes misrouting impossible.
- **By currency** — an SSI is defined per currency; one SSI per currency can be the **default**, which the
  payment form pre-selects.
- **Maker-checker** — a new or edited counterparty/SSI is created **Pending approval** and can't be used in
  payments until a **different** user with **Approve** reviews it (you can't approve your own change).
- **Bank reference data** — beneficiary and intermediary banks (BIC) are shared reference data that SSIs
  point to.

## Before you start
- Set up your [Companies and Bank Accounts](companies-and-groups.md) first — the payer side of a transfer.
- Decide who **creates** counterparties/SSIs and who **approves** them (segregation of duties).

## How to use it
### Add a counterparty
1. Go to **Admin Console › Master Data › Counterparties & SSIs** and choose **+ New counterparty**.
2. Enter the **name**, **type** (Supplier / Customer / Intragroup / Bank), **country**, tax id and reference.
3. Save. The counterparty is created **Pending approval** until a checker activates it.

### Add a settlement instruction (SSI)
1. Open a counterparty and its **Settlement Instructions** tab, then **+ Add SSI**.
2. Choose the **currency**, enter the **beneficiary account** (IBAN or account number), the **beneficiary
   bank** (BIC), and an optional **intermediary bank**.
3. Optionally set it as the **default for that currency**. Save — it goes **Pending approval**.

### Approve a change (maker-checker)
1. A user with **Approve** on SSIs opens the **Approvals** queue (or the pending record).
2. For an edit, review the **before/after** of the banking fields, then **Approve** or **Reject** with a
   reason. Only **Active** counterparties/SSIs can be selected in payments.

### Use them in a payment
1. In **New payment**, pick the **payer company** and **account** (your own accounts).
2. Pick the **payee counterparty**, then its **settlement instruction** — the list is filtered to that
   counterparty and to Active SSIs, with the default for the payment currency pre-selected.

## AI Configuration Assistant (`In Preview` 👁️)
A **✨ Create with AI** assistant can set up counterparties and SSIs from a plain-language description
("add Acme as a UK supplier with a GBP NatWest account, IBAN …"). It asks only for what's missing (e.g. the
BIC), **validates** format and duplicates, and shows a **draft** to confirm before anything is created —
after which the record enters the normal maker-checker flow. It can also create **many at once** from a
pasted list or an uploaded file, flagging rows that need attention (missing account, duplicate, invalid
BIC). The assistant drafts; a person always confirms, and it can't approve its own records.

## Tips & good practices
- Keep one **default SSI per currency** so payment preparers rarely have to choose.
- Treat SSI edits as sensitive — the maker-checker review of the before/after is your safeguard against
  redirected funds.
- Onboard payees in bulk with the assistant, then let a checker approve the batch.

## Related
- [Companies & Company Groups](companies-and-groups.md) — the payer side of a transfer.
- [Bank Accounts](../06-reporting/bank-accounts.md) — your own accounts.
- [Payments](../05-payments/overview.md) — where counterparties and SSIs are consumed.
- [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md) — the Approve permission behind maker-checker.
