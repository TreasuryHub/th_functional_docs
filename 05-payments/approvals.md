# Payment Approvals

> **Where to find it:** Payments › Payment Blotter › **Awaiting approval**
> **Who uses it:** approvers — treasurers, finance managers, and anyone with payment approval authority.
> **Permissions required:** `CashManagement.Payments` · CreateEdit **and** a sufficient payment approval level. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Approving payments is part of the [Payment Blotter](payment-blotter.md), not a separate screen. The
**Awaiting approval** tab holds every payment that has been created but not yet signed, and you
approve or reject them from there.

Treasury Hub enforces governance automatically: the person who creates a payment cannot approve it,
and larger or riskier payments can require **several signatures** in sequence. Every decision is
recorded with the approver, the timestamp and — for rejections — a mandatory reason.

## Key concepts
- **Signature** — one approval on a payment. A payment in this state reads **Awaiting signature
  *n* of *m***, so you can see how far through its chain it is.
- **Payment approval level** — the authority assigned to each user. Every payment carries the level
  it requires, and only users at or above that level can sign it. Your level is set on your user
  record by an administrator — see
  [Users & Roles](../10-admin-console/users-and-roles.md#set-a-payment-approval-level).
- **Four-eyes** — the creator of a payment cannot also be its approver.
- **Approval rule** — what decides how many signatures a payment needs, by ordering account, amount,
  currency and payment type. See [Payment Approval Rules](../10-admin-console/payment-approval-rules.md).
- **Reason** — the explanation captured when you reject. It is required, and it is what tells the
  creator what to fix.

## Before you start
- You need `CashManagement.Payments` at **CreateEdit**, and an approval level that meets the
  payment's requirement.
- There must be payments in the **Awaiting approval** tab. A payment is born there — creating one
  does not send it.
- Your browser may ask for your location. Treasury Hub records where an approval was given when the
  browser provides it; approval still works if you decline.

## How to use it

### Approve a payment
1. Open **Payments › Payment Blotter** and select the **Awaiting approval** tab.
2. Find the payment and read it — ordering account, beneficiary, amount, currency and value date.
   Expand the row for its traceability panel, which shows the signatures collected so far.
3. Choose **Approve** on the row.
4. Add a note if it is useful; it is optional on an approval.
5. Confirm. The signature count advances. Once the last required signature is in, the payment moves
   to **On its way**.

### Reject a payment
1. Choose **Reject** on the row.
2. Enter the **reason**. This is required — the confirm button stays disabled until you write one.
3. Confirm. The payment moves to the **Rejected** tab with your reason and identity on its history.

### When an approval is refused
A payment can be refused by the platform rather than by you, and the message says why — for example
that a line's counterparty has no linked settlement instruction and so cannot be paid. Fix what the
message names, then approve again. The refusal is not a rejection: the payment stays in **Awaiting
approval**.

### When you cannot approve
- If your approval level is **below** what the payment requires, you cannot sign it; it has to go to
  someone with sufficient authority.
- You cannot approve a payment **you created**.

## Configuration
- **How many signatures a payment needs** is set by the rules under **Admin Console › Master Data ›
  Payment Approval Rules** — see [Payment Approval Rules](../10-admin-console/payment-approval-rules.md).
- **Each user's approval level** is set on their user record — see
  [Users & Roles](../10-admin-console/users-and-roles.md#set-a-payment-approval-level).

## Tips & good practices
- Write **specific rejection reasons**. The creator works from your text alone to correct and
  resubmit.
- Read the **traceability panel** before signing a payment that already carries signatures — it
  tells you who has seen it and what they saw.
- Keep approval levels aligned to real authority, so payments route to the right people instead of
  stalling in the tab.

## Related
- [Payment Blotter](payment-blotter.md) — the screen this tab belongs to, and the other statuses.
- [Payment Approval Rules](../10-admin-console/payment-approval-rules.md) — where the number of
  signatures is configured.
- [Creating a payment](creating-a-payment.md) — what happens before approval.
- [Users & Roles](../10-admin-console/users-and-roles.md) — where an approver's level is set.
- [Payments — Overview](overview.md) — the module end to end.
