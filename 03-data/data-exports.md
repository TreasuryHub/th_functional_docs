# Data Exports

> **Your data, wherever you need it, through a secure API**
>
> **Why it matters**
> - **No lock-in**: your data is yours, and there are no restrictions on exporting it.
> - **Feeds whatever you run**: BI tools, a data lake, a custom ERP, or a compliance process.
> - **Governed access**: exports authenticate with an access token scoped to your tenant, not a personal login.

> **Where to find it:** Data › Data Export
> **Who uses it:** data/IT owners, treasury operations, teams feeding external systems (BI, data lakes, compliance).
> **Permissions required:** `AdminAndSettings.UserManagement` · Admin (to create and manage access tokens — see [Access Tokens](../10-admin-console/access-tokens.md)).
> **Full API reference:** <https://docs.treasuryhub.ai/api-reference/>

## Overview
Take your data wherever you need it: Data Exports sends TreasuryHub data out to your own systems
through a secure API. It's
for cases where you need treasury data *outside* the platform — feeding a BI tool, a data lake, a
custom ERP, or a compliance/reporting process.

Your data is yours, so there are no restrictions on exporting it. Keep in mind, though, that
TreasuryHub's own reporting and insights work on the full, connected dataset — with the context,
correlations, and forecasts that are lost once data leaves the platform. Use Data Exports when
another system genuinely needs the raw data; use TreasuryHub's [Reporting](../06-reporting/overview.md)
when you need analysis.

This page explains the capability in functional terms — what you can export, how it's delivered, and
how access is secured. It is not a developer reference.

## Key concepts
- **Export** — a set of data sent from TreasuryHub to a destination you control, either on demand,
  on a schedule, or automatically when something happens.
- **Data domain** — a group of data you can export (for example transactions, balances, forecasts).
  Access is granted per domain, so each connection only sees what it needs.
- **Access token / API key** — the credential a connecting system uses to authenticate. You create
  and revoke these in the [Admin Console](../10-admin-console/access-tokens.md).
- **Scope** — the permission attached to a credential that limits it to specific data domains, and
  optionally to specific companies/entities (so, for example, a subsidiary's system only sees that
  subsidiary's data).
- **External ID** — a stable, public identifier for each exported record. Because it never changes,
  you can safely match TreasuryHub records to records in your own systems, even as the platform
  evolves internally.
- **Internal ID** — TreasuryHub's own identifier for a record, available mainly to help support and
  troubleshooting. A mapping between External and Internal IDs is available if you need it.
- **Rate limit** — the maximum number of requests a connection may make in a given period.

## Before you start
- You (or an administrator) need `AdminAndSettings.UserManagement` at **Admin** level to create the
  access tokens / API keys a connection will use.
- Decide which **data domains** and which **companies/entities** each connecting system should be
  allowed to access, so you can scope credentials to the minimum needed.

## What you can export
The API covers the main treasury data domains:

| Data domain | What it contains |
|---|---|
| **Transactions** | Bank movements, pay-ins/pay-outs, and invoices. |
| **Balances / Positions** | Cash positions and balances by account, entity, and currency — current or historical. |
| **Reconciliation** | Reconciliation status, matches, exceptions, and KPIs. |
| **Accounting** | Journal entries / G/L postings and the chart of accounts. |
| **Financial Events** | The normalized financial events captured across sources. |
| **Metadata** | Entities, bank accounts, and configuration. |

Exports are available in common formats (such as JSON and CSV) so the data works with everything
from spreadsheets to data-warehouse pipelines.

> **The published API** covers the **Financial Events** resource (the endpoint is below). The other
> domains in this table are exported from the in-app **Data › Data Export** screen. Some domains also
> depend on the corresponding module being enabled for your organization — confirm with your
> administrator.

## How to use it
### Set up an outbound connection
1. In the **Admin Console**, open [Access Tokens](../10-admin-console/access-tokens.md)
   and create an **API key / access token** for the system that will connect.
2. Grant it only the **scopes** (data domains) — and, where supported, the specific
   companies/entities — that system needs.
3. Copy the credential when it's shown (it's displayed once, at creation) and provide it securely to
   the team building the connection.
4. Your IT/integration team uses that credential to pull data from **Data › Data Export**.

### Pull data via the API (where to call)
The published API resource is **Financial Events**, called with the same H2H credentials as the
[inbound API](../02-integrations/inbound-apis.md).

**Base URL:** `https://api.gateway.treasuryhub.ai` (Sandbox: `https://sandbox.api.gateway.treasuryhub.ai`)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/h2h/ingestion/financial-events` | List/export events — paginated; filter by `createdOnFrom`, `createdOnTo`, `page`, `pageSize`. |
| `GET` | `/api/h2h/ingestion/financial-events/{uuid}?versions=true` | A single event, with its version history. |

```bash
curl "https://api.gateway.treasuryhub.ai/api/h2h/ingestion/financial-events?page=1&pageSize=50&createdOnFrom=2026-05-01T00:00:00Z" \
  -H "X-Client-Id: {tenant_id}" \
  -H "X-Access-Token: th_live_xxxxxxxxxxxx" \
  -H "Content-Type: application/json"
```

The response is a paginated list (items plus totals); page through it with `page` / `pageSize`. The
complete schema, all query parameters, and every field are in the
[API reference](https://docs.treasuryhub.ai/api-reference/).

For data domains that aren't exposed as API endpoints, use the in-app **Data › Data Export** screen.

### Match exported records to your own systems
- Use the **External ID** on each record as the stable key when loading data into your systems. It
  won't change, so incremental syncs stay consistent over time.
- If you need to reconcile a record with TreasuryHub support, the **Internal ID** and an
  External ↔ Internal ID mapping are available.

## Configuration
- **Access & security** — API keys/tokens, their scopes, and which entities they can reach are
  managed in [Access Tokens](../10-admin-console/access-tokens.md). All
  API usage is recorded in the audit trail.

## Tips to get more value
- Give each connecting system its **own** token with the **narrowest** scope it needs — it's easier
  to rotate or revoke without disrupting everything else.
- Prefer the **External ID** as your join key so your integrations stay stable over time.
- Export raw data for other systems, but keep analysis in TreasuryHub's [Reporting](../06-reporting/overview.md)
  where the full context is preserved.

## "Create Your Own" export builder
In **Configuración › Data Exports** you define your own export packages, schedules, and delivery
destinations (SFTP, cloud storage, email), as well as event **webhooks**.

## Where to go next
- [Access Tokens](../10-admin-console/access-tokens.md) — create the credentials.
- [Financial Events](financial-events.md) — trace any exported number back to the record ingestion created.
- [Inbound APIs](../02-integrations/inbound-apis.md) — the opposite direction (sending data *in*).
