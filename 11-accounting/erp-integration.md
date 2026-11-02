# Posting to your ERP

> **Where to find it:** there is no screen for ERP posting. The NetSuite connection details stay under
> [Integrations](../02-integrations/overview.md), and the posting history is described in
> [G/L Postings](gl-postings.md).
> **Who uses it:** accountants, financial controllers, treasury operations, integration administrators.
> **Permissions required:** `CashManagement.TransactionsPosting` · Read. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Treasury Hub used to send the [postings](gl-postings.md) it generated to **NetSuite**, then poll
NetSuite for the status of each one.

**Postings are no longer sent to your ERP, and their status is no longer tracked.** The processes
that dispatched postings and polled for their outcome have been switched off, along with the
[generation of postings](gl-postings.md) itself. Nothing is queued, nothing is waiting to go out.

**Nothing has been deleted.** The postings, their status history, their link to the originating
transactions, and your NetSuite connection settings are all kept and remain readable.

G/L posting and its ERP delivery are being rebuilt from scratch, together with reconciliation, as
its own project.

## Key concepts
You still meet these terms when reading the history:

- **Export** — sending a posting from Treasury Hub to the ERP. No export runs any more.
- **CoA mapping** — the correspondence between a Treasury Hub G/L account and the account in your
  ERP's chart of accounts. See [Chart of Accounts & Rules Engine](coa-rules-engine.md).
- **Posting status** — the state a posting reached before dispatch stopped. A posting still shown as
  pending was never delivered.

## What this means for you
- **Book treasury activity in your ERP directly**, as you did before Treasury Hub posted for you.
- **Check the last delivered posting.** Anything that had not reached **Posted** when dispatch
  stopped is not in your ledger, and will not arrive.
- **Your NetSuite credentials stay configured.** They are not used for posting; see [NetSuite ERP
  integration](../02-integrations/netsuite-erp.md) for what the connector does now.
- **Reconciliation is unaffected** as a process — see [Reconciliation — ERP
  Posting](../04-reconciliation/erp-posting.md) for the posting step specifically.

## Tips & good practices
- Agree a **cut-off date** with your accounting team: the date of the last posting Treasury Hub
  delivered, so both sides know where the ledger hand-over ends.
- Export the posting history once and file it with your period-close pack, rather than relying on
  being able to pull it screen by screen later.
- Review your ERP for duplicates around the cut-off, in case an entry was booked manually as well.

## Related
- [NetSuite ERP integration](../02-integrations/netsuite-erp.md) — the NetSuite connector.
- [G/L Postings](gl-postings.md) — the posting history.
- [Chart of Accounts & Rules Engine](coa-rules-engine.md) — how postings were mapped to accounts.
- [Reconciliation — ERP Posting](../04-reconciliation/erp-posting.md) — the reconciliation side of
  posting.
- [Journal Entries](journal-entries.md) — how full entries are generated and approved.
- [Integrations](../02-integrations/overview.md) — connecting your systems.
