# Integrations — Overview

> **Connect any source once, and data flows in automatically from then on**
>
> **Why it matters**
> - **Any bank, any format**: SWIFT, Open Banking, APIs, files, email, SFTP.
> - **Normalized at the source**: everything arrives as the same financial entities, so the rest of the platform agrees with itself.
> - **Both directions**: data comes in, and goes back out to the systems that need it.

> **Where to find it:** Integrations
> **Who uses it:** treasury operations, finance systems owners, administrators, IT.
> **Permissions required:** administrator to set up and enable connections; see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Connect a source once and its data flows in automatically from then on — no bank portals, no
exported files, no re-keyed numbers. The **Integrations** menu is where every data source connects
to TreasuryHub, and what arrives is normalized — normalized into the same [financial entities](../00-getting-started/03-core-concepts.md#financial-entities-treasury-hub-understands)
the rest of the platform uses. This is the first layer of the platform: **Sources → Integrations
(ingestion) → Data layer → Workflows → Modules.**

Integrations cover both directions: **inbound** (bringing data *into* TreasuryHub) and **outbound**
(sending data *out* to other systems).

## Key concepts
- **Inbound (ingestion)** — data coming *into* TreasuryHub: bank statements, balances, PSP
  settlements, ERP records, invoices, and files. Most of this menu is about inbound.
- **Outbound** — data TreasuryHub sends *out* to your systems, via exports and outbound APIs. See
  [Data Exports & APIs](../03-data/data-exports.md).
- **Connector** — a single configured link to one source (a bank, an ERP, a PSP, a file feed).
- **Normalization** — no matter which channel a record arrives on, it is converted to TreasuryHub's
  standard model of movements, balances, invoices, and so on, so everything reconciles and reports
  the same way.

## What's in the Integrations menu
| Screen | What it's for |
|---|---|
| **Services** (catalog) | Browse and connect available connectors, grouped by category. |
| [Status](webhooks-and-status.md) | Operational health of each connection (last sync, uptime, logs). |
| [Webhooks](webhooks-and-status.md) | Real-time push notifications to/from external systems. |
| [Email Ingestion](email-ingestion.md) | Read data from incoming emails and attachments. |
| [SFTP Ingestion](sftp-ingestion.md) | Pick up files dropped on an SFTP location. |
| [API Agent Integrator](third-party-apis.md) | Build and maintain third-party API pull integrations with AI help. |
| [Ingestion Activity](ingestion-activity.md) | Monitor what's been ingested, with status and errors. |

## The catalog of sources
![Integrations Services catalog with connectors grouped by category](../assets/screenshots/integrations-services-catalog.png)

The **Services** catalog groups connectors by the kind of system they connect to. Typical categories
include:

- **Banks** — commercial and central banks, for statements and balances.
- **Core banking systems** — e.g. Temenos, Finacle, Flexcube.
- **Settlement networks / payment rails** — e.g. SEPA, PIX, SPEI, ACH, SWIFT.
- **PSPs (payment service providers)** — e.g. Stripe, Mercado Pago, Adyen, dLocal.
- **ERPs** — e.g. [NetSuite](netsuite-erp.md), SAP, Oracle, Dynamics. The NetSuite connector syncs
  accounts, companies and currencies nightly, and carries approved G/L postings back to NetSuite.
- **Files** — [CSV / Excel / PDF import](file-import.md).
- **Email & SFTP** — [Email Ingestion](email-ingestion.md) and [SFTP Ingestion](sftp-ingestion.md).
- **APIs** — [third-party pull APIs](third-party-apis.md) and [inbound push APIs](inbound-apis.md).

> Connector counts and named logos shown in the platform's demo tenant are **examples**.

## Ways data comes in
TreasuryHub supports several ingestion channels so you can use whatever each source offers:

| Channel | Best for | Page |
|---|---|---|
| SWIFT | Global banks with institutional connectivity. | [SWIFT](swift.md) |
| Open Banking (PSD2) | Local banks, fintechs, neobanks, real-time balances. | [Open Banking](open-banking.md) |
| Third-party APIs (pull) | Vendor systems TreasuryHub reads from on a schedule. | [Third-party APIs](third-party-apis.md) |
| Inbound APIs (push) | Your systems sending data into TreasuryHub. | [Inbound APIs](inbound-apis.md) |
| ERP | The NetSuite connection, kept for its history — no exchange runs from it. | [NetSuite](netsuite-erp.md) |
| Files | CSV / Excel / PDF, via a templating wizard. | [File import](file-import.md) |
| Email / SFTP | Emails, attachments, and dropped files. | [Email](email-ingestion.md) · [SFTP](sftp-ingestion.md) |

These channels are complementary — for example, [SWIFT](swift.md) and [Open Banking](open-banking.md)
can cover different banks and still land in one unified position.

## Before you start
- Decide which sources you need and which channel each supports (your bank, ERP, or PSP will tell
  you which formats and APIs they offer).
- Confirm you have administrator rights to set up connections — see
  [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Tips to get more value
- Connect your highest-volume sources first (usually your main banks) so your cash position is
  complete from day one.
- Use [Ingestion Activity](ingestion-activity.md) and the [Status](webhooks-and-status.md) board to
  confirm data is flowing before you rely on downstream reports.
- Where a bank offers both SWIFT and Open Banking, you can use both for resilience.

## Where to go next
- [AI Extraction](ai-extraction.md) — the fallback when a file's format has moved on from its
  template.
- [Core Concepts](../00-getting-started/03-core-concepts.md) — how data flows source → insight.
- [Reconciliation](../04-reconciliation/overview.md) — the main consumer of ingested data.
- [Data Exports & APIs](../03-data/data-exports.md) — the outbound side.
