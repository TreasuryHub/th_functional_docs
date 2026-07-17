# Posting to your ERP

> **Availability:** `In Preview` 👁️
> **Plan:** Premium (Upgrade) — NetSuite bidirectional and other ERP connectors.
> **Where to find it:** Reporting › Accounting (export from the postings / journal-entries view) and [Reconciliation › ERP Posting](../04-reconciliation/erp-posting.md). Connectors are set up under [Integrations](../02-integrations/overview.md).
> **Who uses it:** accountants, financial controllers, treasury operations, integration administrators.
> **Permissions required:** `CashManagement.TransactionsPosting` · Read/Create-Edit; connector setup needs administrator access. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

> 👁️ **In Preview.** This module is in testing and available on request — contact Treasury Hub to enable it for your organization. This page describes how it works.

## Overview
Treasury Hub will be able to send your [journal entries and postings](gl-postings.md) straight to your
ERP — such as **NetSuite** or **SAP** — so your general ledger stays current without manual re-keying
or file reformatting. It will also be able to **read entries that already exist in the ERP** and match
them to the ones Treasury Hub generated, so you don't have to reconcile the two sides by hand.

ERP integration is an **add-on**: it shows as **Upgrade** in the platform until enabled for your
organization. Contact your account manager to turn it on. What each connector supports depends on
your ERP and plan — confirm scope with the Treasury Hub team.

## Key concepts
- **Export** — sending an approved posting or journal entry from Treasury Hub to the ERP.
- **Bidirectional flow** — Treasury Hub both **writes** entries to the ERP and **reads** existing ERP
  entries back. NetSuite is supported bidirectionally as an add-on.
- **API-first connection** — a direct system-to-system link (used when your ERP offers an API).
- **File-based export** — a fallback for ERPs without an API, using a file (for example CSV or XML)
  delivered over SFTP, a shared folder, or email.
- **CoA mapping** — the mapping between a Treasury Hub G/L account and the corresponding account in
  your ERP's chart of accounts.
- **ERP matching** — automatically associating a Treasury Hub entry with an entry that already exists
  in the ERP (for example an AP invoice booked directly in the ERP).
- **Idempotency** — each export has a unique identifier, so re-sending a batch cannot create
  duplicates in the ERP.

## Before you start
- The ERP add-on must be **enabled** for your organization (shown as **Active** rather than
  **Upgrade**).
- The **connector** for your ERP must be configured under [Integrations](../02-integrations/overview.md)
  — including credentials and, for file-based ERPs, the export template and transport.
- Your **CoA mapping** must be defined so Treasury Hub accounts resolve to the right ERP accounts.
  See [Chart of Accounts & Rules Engine](coa-rules-engine.md).
- Entries should be **approved** before export — see [Journal Entries](journal-entries.md).

## How it works
*The steps below describe the intended experience once this module is live.*

### Two ways to connect
- **API-first (preferred).** A direct connector to ERPs that offer an API. It can create entries,
  read existing ones, and check status. Adapters are available for major ERPs including
  **SAP S/4HANA, Oracle, NetSuite, Microsoft Dynamics 365, and Sage** (availability varies by plan).
- **File-based (fallback).** For ERPs without an API, entries are exported as a file (CSV, XML, or a
  format your ERP expects) and delivered over SFTP, a shared folder, or email, using a template
  configured per ERP and entity.

### Export a batch to the ERP
1. From the postings or journal-entries view, select the approved entries you want to send (or let
   your scheduled batch run).
2. Choose **Export** (or **Post to ERP**). Entries are grouped into a batch by entity, period, and
   type according to your configuration.
3. Treasury Hub **pre-validates** the batch against the ERP's requirements before sending, so
   formatting problems are caught early.
4. Track the batch status as it moves through **Queued → Sending → Sent → Confirmed** (or
   **Failed**).
5. If the ERP rejects a batch, you are notified and the affected entries return to **Approved** for
   review. Because each export is idempotent, you can safely re-send once the issue is fixed without
   creating duplicates.

### Match Treasury Hub entries to existing ERP entries
When bidirectional integration is enabled, Treasury Hub can associate its entries with records
already in the ERP — so the link arrives ready-made instead of being reconciled by hand.

1. Treasury Hub **reads existing entries** from the ERP (via the API or a file import).
2. The matching engine applies your criteria — **reference / external ID, amount (exact or within a
   tolerance), date (exact or range), counterparty, and G/L account**.
3. **Proposed matches** are presented for you to confirm (human-in-the-loop).
4. The association is stored on both sides, linking the Treasury Hub ID to the ERP ID.

## Configuration
- **Connector & credentials** — set up the ERP connection under
  [Integrations](../02-integrations/overview.md); for NetSuite specifically see
  [NetSuite ERP integration](../02-integrations/netsuite-erp.md).
- **CoA mapping** — map Treasury Hub accounts to ERP accounts.
- **Batching rules** — how entries are grouped (by entity, period, type).
- **Matching criteria** — the fields and tolerances used to pair Treasury Hub and ERP entries.
- **Export templates** (file-based) — the file format and transport per ERP and entity.

## Tips & good practices
- Rely on **pre-validation** — resolving schema issues before sending avoids ERP rejections at
  period close.
- Trust **idempotency**: if you're unsure whether a batch sent, re-run it; duplicates are prevented
  by the unique export ID.
- Keep **CoA mapping** current whenever you add accounts, so nothing lands in a suspense account.
- Use **automatic matching** to eliminate manual reconciliation inside the ERP — review the proposed
  matches rather than pairing entries yourself.

## Related
- [NetSuite ERP integration](../02-integrations/netsuite-erp.md) — the NetSuite connector in detail.
- [Reconciliation — ERP Posting](../04-reconciliation/erp-posting.md) — posting reconciled items to the ERP.
- [G/L Postings](gl-postings.md) — the postings you export.
- [Journal Entries](journal-entries.md) — approving entries before export.
- [Chart of Accounts & Rules Engine](coa-rules-engine.md) — CoA mapping.
- [Integrations](../02-integrations/overview.md) — connecting your systems.

## In Preview
- 👁️ **Expanded ERP adapter coverage** — additional API connectors and templates as more ERPs are
  onboarded. Confirm the current adapter list with the Treasury Hub team.
