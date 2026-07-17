# Inbound APIs (Push)

> **Availability:** `Available` ✅
> **Plan:** Premium (Upgrade)
> **Where to find it:** credentials are issued in the **TreasuryHub Portal** (and managed in Admin Console › Access Tokens); the business rules that act on incoming data live in **Admin › Master Data › Matching Rules** and **Settings › Reconciliation**.
> **Who uses it:** your IT / development teams, finance systems owners, administrators.
> **Permissions required:** administrator to obtain credentials and manage access tokens; see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).
> **Full API reference:** <https://docs.treasuryhub.ai/api-reference/>

## Overview
Inbound APIs let your own systems **push data into Treasury Hub** in real time — your ERP, PSP, or
in-house platform sending records directly, with no files, email, or manual upload. It's a
**machine-to-machine (H2H)** REST API: your system authenticates with two header credentials, POSTs
a JSON record, and gets an immediate accepted/rejected response. Accepted records become normalized
**financial events** that flow straight into reconciliation, posting, and reporting.

This page covers **inbound** (data coming in). For sending data **out**, see
[Data Exports](../03-data/data-exports.md). For Treasury Hub *pulling* from a vendor, see
[Third-party APIs](third-party-apis.md).

## Key concepts
- **H2H (machine-to-machine)** — no OAuth, no Bearer token, no end-user login. Each request carries
  two header credentials.
- **Financial event** — the record you push: a pay-in, a pay-out, or a bank movement. This is the
  entity the current API ingests.
- **`externalId`** — your own unique identifier for each record (unique per tenant). It's how
  Treasury Hub deduplicates and how you match records back to your system.
- **Client / Tenant** — the same thing; your `X-Client-Id` identifies your organization.
- **Business rules** — what happens to a record *after* it's accepted (which G/L posting or tag it
  produces, how it's reconciled). These are configured **in the platform**, not in the API call — see
  [Configuration](#configuration).

## The endpoint
The current H2H resource is **Financial Events**:

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/h2h/ingestion/financial-events` | Push a new financial event |
| `GET` | `/api/h2h/ingestion/financial-events` | List events (paginated; filter by date) |
| `GET` | `/api/h2h/ingestion/financial-events/{uuid}?versions=true` | Retrieve one event (with version history) |
| `PUT` | `/api/h2h/ingestion/financial-events/{uuid}` | Update an event (creates a new version) |

**Base URLs**

| Environment | Base URL |
|---|---|
| Sandbox | `https://sandbox.api.gateway.treasuryhub.ai` |
| Production | `https://api.gateway.treasuryhub.ai` |

## Authentication
Every request (including GET) sends three headers:

```http
X-Client-Id: {your tenant id}
X-Access-Token: {your access token}
Content-Type: application/json
```

- Access tokens are prefixed **`th_live_`** (Production) or **`th_test_`** (Sandbox); tokens are **not**
  interchangeable between environments.
- Sandbox tokens don't expire; Production token expiration and allowed IP ranges are set when you
  create the credentials. Both environments enforce an **IP allowlist**.

## Before you start
1. Confirm the inbound API is enabled for your organization (it's available on request — contact
   Treasury Hub).
2. Get credentials:
   - **Sandbox** — request manual provisioning and give Treasury Hub a fixed IP to allowlist.
   - **Production** — in the **TreasuryHub Portal**, create your client (tenant), generate credentials,
     and set token expiration + allowed IP ranges. Tokens are also visible/manageable in
     [Admin Console › Access Tokens](../10-admin-console/access-tokens.md).
3. Share the credentials securely with your technical team (environment variables / a secrets vault —
   never in client-side code or a public repo).

## How to use it

### Push a financial event
Your system POSTs a JSON record. Minimal example (Sandbox):

```bash
curl -X POST https://sandbox.api.gateway.treasuryhub.ai/api/h2h/ingestion/financial-events \
  -H "X-Client-Id: {tenant_id}" \
  -H "X-Access-Token: th_test_xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "externalId": "ext-payin-001",
    "type": "INTERNAL_PAYIN",
    "countryCode": "MX",
    "currencyCode": "MXN",
    "amount": 1500.00,
    "status": "PENDING",
    "originalStatus": "CREATED",
    "payload": {}
  }'
```

A success returns **`201`** with the internal `uuid`. Use that `uuid` (or your `externalId`) to
retrieve or update the event later.

**Key fields**

| Field | Notes |
|---|---|
| `externalId` | Your unique ID for the record (unique per tenant). |
| `type` | One of `INTERNAL_PAYIN`, `INTERNAL_PAYOUT`, `BANK_MOVEMENT`. |
| `countryCode` / `currencyCode` | ISO country / ISO 4217 currency codes. |
| `amount` / `isNegative` | The value, and whether it's a debit. |
| `status` | One of `PENDING`, `REJECTED`, `BOOKED`. |
| `accountId` | The bank account UUID — **required for `BANK_MOVEMENT`**. |
| `payload` | Type-specific detail (payer/beneficiary, payment method, merchant/partner, ISO 20022 bank fields, etc.). |

The `payload` fields differ by `type` (payer details for pay-ins, beneficiary/channel for pay-outs,
creditor/debtor/value-date for bank movements). The [API reference](https://docs.treasuryhub.ai/api-reference/)
has the complete schema and worked examples for each type.

> **Currencies must be ISO 4217 (fiat).** `currencyCode` (and each `multiCurrencyAmounts` entry) must
> be a valid ISO 4217 code — anything else is rejected with `ERR-3004`. **Crypto currencies such as
> ETH or TRX are not supported** as `currencyCode`. Note that a pay-out's `payload.channel` does accept
> `CRYPTO` (alongside `CASH` and `ONLINE`), but that only records the *channel* — the amount itself
> must still be in a fiat ISO 4217 currency.

### Confirm what arrived
- Every request returns an **immediate result** — `201` on success, or a `400` whose `errorCode`
  tells your team exactly what to fix (validation) or that the `externalId` was a duplicate
  (`ERR-4001`).
- In the platform, watch incoming records on [Ingestion Activity](ingestion-activity.md) and inspect
  each normalized record on the [Financial Events](../03-data/financial-events.md) screen (including
  its version history).

## Configuration
Two different things are configured in two different places:

**1. The API contract (automatic).** Schema validation — required fields, valid enums, ISO codes,
positive amounts, unique `externalId` — is enforced by the API itself; you don't configure it. Fix
rejects based on the error response.

**2. Business rules (in the platform).** What happens to an accepted event is driven by the platform's
rules engine, which you configure:
- **[Matching Rules](../10-admin-console/matching-rules.md)** (Admin › Master Data › Matching Rules) —
  scoped by company, account, currency, and date, these decide the **G/L posting** an event produces
  (a *PostingRule*) or the **tags** it gets (a *TagAssignmentRule*). `Available` ✅.
- **[Reconciliation Criteria & Flows](../04-reconciliation/rules-and-criteria.md)** (Settings ›
  Reconciliation) — how pushed events are matched against bank movements and other sources. `In Preview` 👁️.

**Volume.** The default rate limit is **1,000 requests per minute per tenant** (a `429` is returned
when exceeded); a higher limit can be requested via the Portal.

## Tips & good practices
- Build against **Sandbox** first (tokens don't expire), then switch the base URL and credentials to
  go live.
- Use a **distinct access token per sending system** so you can monitor and revoke each independently.
- Set a stable, meaningful **`externalId`** — it's your dedup key and your link back to your system.
  Duplicates are rejected (`ERR-4001`), and you should **not retry a request that already returned
  `201`** (this endpoint has no idempotency header).
- Get your [Matching Rules](../10-admin-console/matching-rules.md) right early so pushed events post
  and tag correctly from day one.

## Related
- [API reference (docs.treasuryhub.ai)](https://docs.treasuryhub.ai/api-reference/) — full schema, all endpoints, and examples.
- [Financial Events](../03-data/financial-events.md) — where pushed records appear in the platform.
- [Ingestion Activity](ingestion-activity.md) — confirm pushed data and rejections.
- [Matching Rules](../10-admin-console/matching-rules.md) — posting & tagging rules for incoming data.
- [Access Tokens](../10-admin-console/access-tokens.md) — manage credentials.
- [Third-party APIs](third-party-apis.md) · [Data Exports](../03-data/data-exports.md) — the other API directions.
