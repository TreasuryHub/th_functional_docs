# Counterparties & SSIs

> **Where to find it:** Admin Console › Master Data › Counterparties & SSIs
> **Who uses it:** treasury operations, accounts payable, administrators.
> **Permissions required:** `CoreData.Counterparties` and `CoreData.SSIs` — Read to view; Create/Edit to add; **Approve** to authorize banking changes (maker-checker). See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
To pay someone by transfer you need two things: **who** you're paying and **where/how** the money
settles. Counterparties & SSIs manages both, so payments are raised against known, validated payees
instead of free-typed account numbers.

- **Counterparty** — the party the money goes to. Usually a third party (supplier, client,
  intragroup entity, bank), but it can also be **your own company**, when the money is moving
  between your own accounts.
- **SSI (Standard Settlement Instruction)** — a counterparty's banking coordinates for settlement,
  together with the **dispersion methods** allowed to use them.

This screen is where [payment creation](../05-payments/creating-a-payment.md) gets its
beneficiaries. Everything configured here decides what the New Payment dialog offers: a counterparty
that is not approved, an instruction in the wrong currency or on the wrong channel, and an own
account the payment provider has not registered all appear in the beneficiary list **greyed, with
the reason on the row**. Those reasons are written here.

## Key concepts
- **One-to-many** — a counterparty has **many SSIs**; each SSI belongs to **exactly one**
  counterparty. An SSI (a beneficiary account) is never shared across counterparties, which makes
  misrouting impossible.
- **Default instruction** — at most one instruction can be the **default for a given currency**. It
  is the one used when a payment names the counterparty rather than a specific instruction.
- **Dispersion method (channel)** — the rail an instruction may be paid through: Manual, SWIFT,
  SEPA, SPEI, ACH Colombia, Kuspit. What you mark on an instruction decides which fields it asks for
  and which ordering accounts can pay it.
- **Own account** — a counterparty marked as the tenant itself. It is not a type and not a
  permission: what the mark changes is decided by each dispersion method's own policy.
- **Provider registration** — some channels have to file the beneficiary with the payment provider
  before any money can move to it. Until that is done, the instruction cannot be paid.
- **Maker-checker** — a new or edited counterparty is created **Pending** and can't be used in
  payments until a **different** user with the approve permission reviews it. You can't approve your
  own change.
- **Status** — **Pending**, **Approved**, **Rejected** or **Suspended**. Only **Approved** can be
  paid.

## Before you start
- Set up your [Companies and Bank Accounts](companies-and-groups.md) first — the payer side of a
  transfer.
- You need `CoreData.Counterparties` at **CreateEdit** to create and edit, and
  `CoreData.Counterparties.Approve` to take an approval decision.
- Decide who **creates** counterparties/SSIs and who **approves** them (segregation of duties).
- For an own account, have the **account cover document** the provider demands ready before you save
  — the counterparty cannot be saved without it.

## How to use it
### Add a counterparty
1. Go to **Admin Console › Master Data › Counterparties & SSIs** and choose **New counterparty**.
2. Under **General details**, enter the **Name**, **Legal name**, **Code**, **Type** (Client,
   Supplier, Bank, Broker, Intercompany or Other), **Tax id** and **Country**. Add a **Credit
   rating**, its **Rating agency** and **Rating date** if you track them, plus any **Notes**.
3. Save. The counterparty is created **Pending** until a checker approves it. The form warns you up
   front that every change sends the record back to pending approval.

### Add a settlement instruction (SSI)
1. Open a counterparty and, under **Settlement instructions**, choose **Add instruction**.
2. Start with **Dispersion methods** — it is the first question because it governs every other one.
   Mark the methods allowed to use this account. What you mark is what makes the rest of the card's
   fields appear, become mandatory and tighten their validation.
   - If two marked methods expect different things in the same field, the card says so on the spot
     and tells you what to do: keep one method here and move the other to its own instruction.
   - An instruction with no method marked cannot pay anybody, and will not save.
3. Under **Account**, fill in what the marked methods ask for: **Alias**, **Currency**,
   **Institution**, **Account number**, **IBAN**, **BIC**, and any extra fields a method demands —
   for example a CLABE, a beneficiary RFC or NIT, an ACH account type, or correspondent bank
   details. Each field says which method made it mandatory and what format it expects.
4. Under **Validity**, set **Valid from** and, if the instruction expires, **Valid to**. A new
   instruction cannot start in the past; one already on record keeps the start date it has.
5. Optionally mark it the **Default instruction** for its currency.
6. Save. The counterparty goes back to **Pending** approval.

### Mark a counterparty as your own account
Use this when the "payee" is your own company — moving money between your own accounts.

1. In the counterparty form, switch on **The holder's own account**.
2. A list appears of what each dispersion method you have marked will do about it. A method with no
   own-account policy says so plainly: nothing changes, it keeps paying the account exactly as it
   would a third party's. A method that does contemplate own accounts explains what it does instead
   — for example paying it as a **withdrawal** against the account registered on the contract.
3. If the method demands an **account cover** document, attach it in the instruction's document
   field. The screen states what it accepts and the size limit, and the counterparty cannot be saved
   without it. Replacing the cover later **drops the registration**: what the provider validated was
   the account together with the cover it saw.
4. Save and have the counterparty approved. **Approving is what sends the own account to the
   provider** — there is no separate "register" button.

Once marked, an **Own account** badge appears beside the counterparty's name on the grid and on its
detail, and on the beneficiary row in the New Payment dialog.

### Follow an own account's registration with the provider
1. Expand the counterparty's row in the grid (or open **View**) to see the registration block for
   each instruction.
2. It shows where the account stands — *Not sent yet*, *Under review*, *Registered* or *Refused* —
   the provider's own last words, when it was last sent, and when it was registered.
3. **Sends** lists every attempt, newest first, with who triggered it and what came back: an
   approval send, a status update, or a send that replaced an already-registered account. The
   expanded row shows the most recent few and links to the detail for the rest.
4. Use **Update status** to ask again. The button is honest about what it does: for a provider that
   publishes no way to query a registration, asking means **sending it again** and reading the
   answer — a pending request stays pending, an account already registered comes back as already
   registered, and anything else opens a new request. The button carries the method's cooldown and
   tells you how long is left.
5. Before the counterparty is approved there is no button, only a sentence saying that approving is
   what sends the registration in the first place.

For a **third party**, the equivalent block shows the id the provider issued, when it issued it and
when it last took a change — and, when your record and the provider's no longer agree, which value
the provider is still holding and what will happen to it. Changing an account number, a bank or a
document drops the registration and sends the counterparty back through approval, which is when it
is sent again.

### Approve a change (maker-checker)
1. Open the counterparty (**View**, or the row's actions). A user holding
   `CoreData.Counterparties.Approve` sees an **Approval** panel on the detail; for everyone else the
   panel is simply absent rather than greyed out.
2. Choose **Approve**, **Reject**, **Suspend** or **Reactivate**. A confirmation dialog states
   exactly what the decision does — approving makes the counterparty nameable as a payment
   beneficiary, rejecting leaves it on record but unpayable, suspending blocks payments until
   somebody reactivates it, reactivating sends it back to pending. **Reject** and **Suspend**
   require a written reason.
3. If you created the counterparty or were the last to edit it, the panel tells you plainly that
   **this approval has to be given by someone else**, and why: four-eyes control keeps one person
   from both preparing and approving who gets paid.
4. **Status history** on the detail records every decision, newest first, with who took it, when,
   the reason given, and — when an approved counterparty went back to pending — **which fields
   changed**. Nothing on that trail can be edited; it is the evidence an audit reads.

### Read why a counterparty cannot be paid
A counterparty that is not **Approved** carries a **banner** at the top of its detail saying so in
plain words: *pending approval and cannot be paid yet*, *was rejected and cannot be paid*, or *is
suspended and cannot be paid*, together with the reason recorded with the decision.

That banner and the greyed rows in the New Payment beneficiary list are the same fact told in two
places. When a payment preparer reports that a beneficiary "isn't there", this is where the answer
is.

### Use them in a payment
1. In **New payment**, pick the **ordering account** — the account the money leaves from. Its
   currency and its dispersion channel are what the beneficiary list answers.
2. Pick the **beneficiary**: the list offers every live settlement instruction of your
   counterparties, plus your own accounts, split into the ones that account can pay and the ones it
   cannot.
3. An instruction is payable only when its counterparty is **Approved**, its **currency** matches
   the ordering account's, and it is marked for the **channel** that account disperses through —
   and, for an own account, only once the provider has **registered** it. Anything else is listed
   greyed with that reason spelled out.

See [Creating a payment](../05-payments/creating-a-payment.md) for the full flow.

## Tips & good practices
- Keep one **default instruction per currency** so payment preparers rarely have to choose.
- Mark the **dispersion methods first** on a new instruction. Done in that order, the card asks for
  four fields instead of twelve, and every mandatory one says which method is asking.
- Treat SSI edits as sensitive — the maker-checker review of the changed fields is your safeguard
  against redirected funds, and the status history keeps the evidence.
- Onboard an **own account** well before you need to pay it: the provider's review can take days,
  and the payment composer will keep it greyed until it comes back registered.
- Don't replace an own account's cover document casually — it drops a registration you then have to
  wait for again.
- If a payment preparer says a beneficiary is missing, open the counterparty and read its banner and
  its registration block before changing any bank details.

## Related
- [Companies & Company Groups](companies-and-groups.md) — the payer side of a transfer.
- [Bank Accounts](../06-reporting/bank-accounts.md) — your own accounts.
- [Creating a payment](../05-payments/creating-a-payment.md) — where counterparties and SSIs are
  consumed.
- [Payment Blotter](../05-payments/payment-blotter.md) — tracking what happened to each payment
  line.
- [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md) — the Approve permission
  behind maker-checker.
