# NetSuite (ERP Integration)

> **Treasury and NetSuite in sync, every night**
>
> **Why it matters**
> - **Reference data stays aligned**: accounts, companies and currencies come across nightly, so the two systems describe the same group.
> - **Entries reach the ledger by themselves**: approved G/L postings are sent to NetSuite and followed until NetSuite confirms them.
> - **Keep the systems you have**: NetSuite stays your system of record; TreasuryHub runs underneath it.

> **Where to find it:** Integrations › Services (NetSuite connector).
> **Who uses it:** finance systems owners, accounts payable, treasury operations, administrators.
> **Permissions required:** administrator to view or change the connection; see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Keep your ERP and your treasury layer telling the same story without anyone copying data between
them. The NetSuite integration links TreasuryHub to your NetSuite ERP: a nightly sync brings
NetSuite **accounts, companies, and currencies** into TreasuryHub, and
[G/L postings](../11-accounting/gl-postings.md) are sent back to NetSuite and followed up until
NetSuite confirms them.

## Key concepts
- **Sync** — the nightly job that copies NetSuite reference data (accounts, companies, currencies)
  into TreasuryHub.
- **Posting** — a TreasuryHub accounting entry written to NetSuite's ledger; see
  [G/L Postings](../11-accounting/gl-postings.md).
- **Connection settings** — the credentials and mapping stored for your NetSuite account.

## Before you start
- You need administrator rights to view or change the connection.
- Have your NetSuite credentials and the subsidiary mapping ready before you configure the
  connector.
- Decide which NetSuite accounts your [posting
  rules](../11-accounting/coa-rules-engine.md) will book to, so entries land where your accountants
  expect them.

## How to use it

### Check the nightly sync
1. Open **Integrations › Services** and select the NetSuite connector.
2. Confirm the last sync completed, and when.
3. If an account, subsidiary or currency added in NetSuite is missing in TreasuryHub, it will arrive
   on the next sync.

### Follow a posting to NetSuite
1. Open [G/L Postings](../11-accounting/gl-postings.md).
2. Read the status: **Generated / Pending** means prepared, **Posted** means NetSuite has confirmed
   it, **Mismatch / Exception** means it was rejected downstream.
3. Work the exceptions first — they are the entries that have not reached your ledger.

## Configuration
- **Credentials and mapping** are held in the connector's connection settings, and can be rotated
  whenever your security policy requires.
- **Which entries are sent** follows your [posting
  rules](../11-accounting/coa-rules-engine.md) and the approval flow on
  [Journal Entries](../11-accounting/journal-entries.md).

## Tips to get more value
- Check your NetSuite chart of accounts against what TreasuryHub holds before relying on a report
  that uses the synced reference data, so a missing account is found before it reaches a number.
- Add new subsidiaries and currencies in NetSuite first and let the sync carry them across, so the
  two systems never drift apart.
- Rotate the connector's credentials on the same schedule as your other integration secrets, so ERP
  access is governed like everything else.

## Where to go next
- [Integrations Overview](overview.md) — connect any source once and let data flow in from then on.
- [G/L Postings](../11-accounting/gl-postings.md) — see exactly how every transaction hit your
  ledger.
- [Journal Entries](../11-accounting/journal-entries.md) — approve entries before they leave for
  your ERP.
- [Ingestion Activity](ingestion-activity.md) — know your data is complete before you rely on it.
