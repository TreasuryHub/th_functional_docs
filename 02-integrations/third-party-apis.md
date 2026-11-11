# Third-party APIs & the API Agent Integrator

> **New integrations in days, not months, kept working by AI**
>
> **Why it matters**
> - **No IT project per vendor**: the API Agent Integrator builds the connector with you.
> - **It stays built**: when the vendor changes its API, the agent helps keep the connection working.
> - **Any kind of source**: ERPs, PSPs, trading platforms and banks with proprietary APIs, pulled on a schedule.

> **Where to find it:** Integrations › API Agent Integrator
> **Who uses it:** finance systems owners, IT, administrators.
> **Permissions required:** administrator to build and enable connectors; see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Add a new integration in days rather than months: TreasuryHub connects to third-party and vendor
systems — ERPs, PSPs, fintechs, banks with proprietary APIs, trading platforms — by **pulling**
data from their APIs on a schedule. Instead
of a weeks-long IT project per integration, the **API Agent Integrator** uses AI to help build
and maintain each connector, and keep it working when the vendor's API changes.

In this model TreasuryHub **reads from** the vendor (a pull integration). For the reverse — your
systems sending data *into* TreasuryHub — see [Inbound APIs](inbound-apis.md).

## Key concepts
- **Pull integration** — TreasuryHub calls the vendor's API on a schedule and brings the data in
  (as opposed to the vendor pushing to you).
- **Connector** — one configured integration to one vendor API, including how to authenticate, which
  data to fetch, how to map fields, and how often.
- **Field mapping** — linking the vendor's data to TreasuryHub entities (movements, balances,
  invoices, and so on) so it's normalized like every other source.
- **API Agent Integrator** — an AI assistant that helps create a connector from a description or from
  the vendor's API documentation, tests it, and proposes fixes when the API changes.

## Before you start
- Have the vendor's **API documentation** and **credentials** (the vendor decides which
  authentication methods it supports).
- Know which data you need from the vendor and which TreasuryHub entities it maps to.

## How to use it

### Build a connector with the API Agent Integrator
1. Open **Integrations › API Agent Integrator**.
2. **Describe** in plain language what data you need from which API — the agent can also read the
   vendor's documentation and propose the field mapping.
3. Review the proposed **connector and mapping**; adjust anything you need. Generated logic is
   visible and auditable, so your technical team can review or modify it.
4. **Test** the connection — the agent generates sample requests and validates the responses.
5. Set the **authentication** and **schedule** (how often to pull), then **enable** the connector.

### Keep a connector healthy
1. Once live, the connector pulls data automatically on its schedule.
2. If the vendor's API changes (a new field, a deprecated endpoint), the agent detects the break and
   **proposes a correction** for you to approve.
3. Monitor each connector's health on the [Integration Status](webhooks-and-status.md) board and its
   data on [Ingestion Activity](ingestion-activity.md).

## Configuration
- **Authentication** — set the method the vendor requires (e.g. OAuth2, API keys, or others).
- **Schedule** — pull on an interval that matches how fresh you need the data.
- **Resilience** — connectors retry automatically on transient failures and raise an alert if a
  source stays down, without blocking your other data.

## Tips to get more value
- Start from the vendor's official API documentation so the agent's proposed mapping is accurate.
- Review generated connector logic before enabling it — the transparency is there to be used.
- Watch the [Status](webhooks-and-status.md) board after the first runs to confirm the connector is
  healthy before you depend on it.

## Where to go next
- [Inbound APIs](inbound-apis.md) — the push direction (your systems send data in).
- [Integrations Overview](overview.md) — all ingestion channels.
- [Webhooks & Integration Status](webhooks-and-status.md) — real-time events and connector health.
- [Ingestion Activity](ingestion-activity.md) — monitor pulled data.
