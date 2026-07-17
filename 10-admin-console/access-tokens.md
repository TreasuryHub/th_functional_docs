# Access Tokens

> **Availability:** `Available` ✅
> **Where to find it:** Admin Console › Access Tokens
> **Who uses it:** administrators setting up integrations and data exports.
> **Permissions required:** `AdminAndSettings.UserManagement` · Admin

## Overview
Access Tokens is where administrators create the credentials that let external systems talk to
Treasury Hub securely — without sharing anyone's personal login. An **access token** authenticates an
integration or an outbound data feed to Treasury Hub's APIs (for example the H2H
[inbound ingestion](../02-integrations/inbound-apis.md) and [data export](../03-data/data-exports.md)
APIs), scoped to your tenant.

> For the H2H API, the token you create here is sent as the **`X-Access-Token`** header, paired with
> your **`X-Client-Id`** (tenant id). In production, credentials can also be issued and managed in the
> **TreasuryHub Portal**.

## Key concepts
- **Access token** — a tenant-scoped credential issued for a specific integration or export. It's
  shown in full **only once**, at creation — copy it then.
- **Client ID (tenant)** — identifies your organization; sent alongside the token on every request.
- **Expiration & IP allowlist** — a token can have an expiry and be restricted to known IP addresses
  (configured for production credentials).
- **Revoke** — permanently disabling a token so it can no longer be used.

## Before you start
- You need `AdminAndSettings.UserManagement` at **Admin** level.
- Know which integration or export needs the token, and treat every token like a password — anyone
  holding it can act on your tenant's data within its scope.
- If the token is for outbound data feeds, review [Data Exports](../03-data/data-exports.md) first.

## How to use it

### Create an access token
1. Go to **Admin Console › Access Tokens**.
2. Click **+ Create Token** (or **Create**).
3. Complete the token form and **Save**.
4. The generated token is displayed **once** — copy it now (use the copy-to-clipboard action) and store
   it in your secrets manager. You won't be able to see it again.
5. The token appears in the grid, showing its status and (where applicable) expiration.

### Revoke a token
1. On the Access Tokens grid, use the **Revoke** (or **Delete**) action on the row.
2. Confirm in the dialog.
3. The token stops working immediately. Any integration using it will fail until you issue a
   replacement.

### Review and export
- The grid shows each token with a **status** badge (active / revoked) and its details.
- Use **Export** to download the list to Excel/CSV for security reviews.

> ⚠️ **To be confirmed by Treasury Hub:** the exact fields on access tokens (scopes, expiry, naming)
> are still being finalized — confirm the current form with the Treasury Hub team before rolling out to
> integrators.

## Configuration
- **One token per integration.** Issuing a distinct token per system means you can revoke one without
  breaking the others.
- **Rotate** tokens periodically, and immediately if one may have been exposed — create the
  replacement, switch the integration over, then revoke the old one.

## Tips & good practices
- **Never** paste tokens into email, chat, or shared documents — store them in a secrets manager.
- Keep a record of **which integration uses which token** so revocation is safe and predictable.
- Review the list during security audits and revoke anything you can't account for.

## Related
- [Inbound APIs](../02-integrations/inbound-apis.md) — the H2H ingestion API these tokens authenticate.
- [Data Exports](../03-data/data-exports.md) — the outbound API these tokens authenticate.
- [Integrations](../02-integrations/overview.md) — connections that may use tokens.
- [User & Agent Management](user-and-agent-management.md) — human access (as opposed to programmatic).
