# NetSuite (ERP Integration)

> **Where to find it:** Integrations › Services (NetSuite connector). The connection settings are kept there;
> no NetSuite exchange runs from them.
> **Who uses it:** finance systems owners, accounts payable, treasury operations, administrators.
> **Permissions required:** administrator to view or change the connection; see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
The NetSuite integration linked Treasury Hub to your NetSuite ERP: a nightly sync brought NetSuite
**accounts, companies, and currencies** into Treasury Hub, and [G/L
postings](../11-accounting/gl-postings.md) were sent back to NetSuite and followed up until NetSuite
confirmed them.

**No NetSuite exchange runs any more.** The nightly sync, the dispatch of postings, and the status
polling have all been switched off. Nothing is read from NetSuite and nothing is written to it.

**Nothing has been deleted.** The NetSuite data already in Treasury Hub, the postings that were
sent, their status history, and your NetSuite connection settings are all kept and remain readable.

G/L posting and its ERP delivery are being rebuilt from scratch, together with reconciliation, as
its own project.

## Key concepts
- **Sync** — the nightly job that copied NetSuite reference data (accounts, companies, currencies)
  into Treasury Hub. It no longer runs.
- **Posting** — a Treasury Hub accounting entry written to NetSuite's ledger. None are produced or
  sent; see [G/L Postings](../11-accounting/gl-postings.md).
- **Connection settings** — the credentials and mapping stored for your NetSuite account. They are
  kept, and nothing uses them.

## What this means for you
- **NetSuite reference data in Treasury Hub is frozen** at the last sync. If you add an account, a
  subsidiary, or a currency in NetSuite, it will not appear here.
- **Nothing reaches NetSuite from Treasury Hub.** Book treasury activity in NetSuite the way you did
  before the integration posted for you.
- **Your credentials stay in place**, so nothing has to be re-entered when ERP posting is rebuilt.
  If your security policy requires it, you can still rotate or remove them.
- **Other ingestion channels are unaffected** — bank files, APIs, and email ingestion keep running;
  see [Integrations Overview](overview.md).

## Tips & good practices
- Check your NetSuite chart of accounts against what Treasury Hub holds before relying on any report
  that uses the synced reference data; it is as of the last sync, not as of today.
- Tell whoever owns NetSuite that the connection is dormant, so nobody troubleshoots a sync that is
  meant to be off.
- Keep the connection settings as they are unless your security policy says otherwise.

## Related
- [Integrations Overview](overview.md) — the ingestion channels that are running.
- [G/L Postings](../11-accounting/gl-postings.md) — the posting history.
- [Ingestion Activity](ingestion-activity.md) — what is still arriving, and when.
