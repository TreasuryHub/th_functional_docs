# NetSuite (ERP Integration)

> **Availability:** `In Preview` 👁️
> **Plan:** Premium (Upgrade) — shown **Upgrade** in the platform.
> **Where to find it:** Integrations › Services (NetSuite connector)
> **Who uses it:** finance systems owners, accounts payable, treasury operations, administrators.
> **Permissions required:** administrator to configure; see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

> 👁️ **In Preview.** This module is in testing and available on request — contact Treasury Hub to enable it for your organization. This page describes how it works.

## Overview
The NetSuite integration will connect Treasury Hub to your NetSuite ERP so financial data flows
between the two without double manual entry. It is designed to be **bidirectional**: it will bring
NetSuite data *into* Treasury Hub to enrich your treasury position — with a focus on
**accounts-payable (AP) flows and postings** — and, as part of the
[Payment Hub](../05-payments/overview.md) and [ERP posting](../04-reconciliation/overview.md) flows,
disburse payments and post back to NetSuite.

It's aimed at organizations already running NetSuite that want a consolidated treasury view without
re-keying data.

## Key concepts
- **Bidirectional** — data moves both ways: NetSuite → Treasury Hub (for visibility and forecasting)
  and Treasury Hub → NetSuite (for AP payments and postings).
- **AP flow** — accounts-payable data: vendor bills and scheduled/executed payments, used for an
  up-to-date cash position and payment planning.
- **Posting** — reconciled treasury activity written back to NetSuite's ledger.
- **Assisted mapping** — a guided setup that maps NetSuite records to Treasury Hub entities without
  custom development.

## What data flows in
Once available, when you connect NetSuite, Treasury Hub will be able to bring in:
- **Invoices (AR / AP)** — receivables and payables for full visibility of what's owed and due.
- **Purchase orders** — future payment commitments that feed your cash-flow forecast.
- **Accounting data** — chart of accounts, journals, and balances to support reconciliation and
  posting.
- **Vendor bills & payments** — scheduled and executed payments for an accurate cash position.

## Before you start
- Confirm the add-on is enabled (contact your account manager if it shows **Upgrade**).
- Have NetSuite connection details and the appropriate access ready.
- Decide which NetSuite records you want to bring in and where they map in Treasury Hub.

## How to use it
*The steps below describe the intended experience once this module is live.*

### Connect NetSuite
1. Open **Integrations › Services** and choose the **NetSuite** connector.
2. Start the **assisted setup** and provide your NetSuite connection details.
3. Use the **guided mapping** to link NetSuite records (invoices, purchase orders, journals, vendor
   bills and payments) to Treasury Hub entities — no custom development required.
4. Choose the **sync method** (scheduled polling or event-based updates) so data stays current.
5. Save. NetSuite data begins flowing in automatically.

### Post back to NetSuite
1. Reconciled treasury activity can be **posted back** to NetSuite as part of your
   [ERP posting](../04-reconciliation/overview.md) workflow.
2. Payments disbursed through Treasury Hub are reflected in NetSuite via the AP flow.

## Configuration
- **Sync method & frequency** — choose scheduled polling or event-based updates to match how current
  you need the data.
- **Mapping** — adjust the record-to-entity mapping if your NetSuite configuration changes.

## Tips & good practices
- Bring in **purchase orders** as well as invoices — future commitments materially improve your
  [cash-flow forecast](../06-reporting/overview.md).
- Verify the first sync in [Ingestion Activity](ingestion-activity.md) before relying on the data.
- Keep the mapping aligned with any changes to your NetSuite chart of accounts.

## Related
- [Integrations Overview](overview.md) — all ingestion channels.
- [Reconciliation](../04-reconciliation/overview.md) — ERP posting of reconciled items.
- [Ingestion Activity](ingestion-activity.md) — confirm NetSuite data is flowing.
