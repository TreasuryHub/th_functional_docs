# SWIFT Connectivity

> **Start every morning with an up-to-date cash position from all your banks**
>
> **Why it matters**
> - **No portal round**: statements and balances arrive over SWIFT and parse themselves.
> - **Early, not after lunch**: the position is ready when you are, rather than after a morning of downloads.
> - **Straight into reconciliation**: the same movements feed matching and reporting without a second step.

> **Where to find it:** Integrations › Services → **Settlement networks** category → **SWIFT** connector; setup is assisted by TreasuryHub.
> **Who uses it:** treasury operations at organizations with SWIFT connectivity, IT.
> **Permissions required:** administrator to configure; see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Start the day with an up-to-date position instead of a morning of portal logins: SWIFT connectivity
brings your **bank statements and balances** into TreasuryHub automatically over the SWIFT network,
with no downloads and no re-keying. Statements arrive, are parsed into structured [movements and balances](../00-getting-started/03-core-concepts.md#financial-entities-treasury-hub-understands),
and feed straight into your cash position and [reconciliation](../04-reconciliation/overview.md). The
goal is an up-to-date cash position early in the day, not after a morning of portal logins.

It is aimed at organizations that already have (or want) institutional bank connectivity across many
entities and banks.

## Key concepts
- **Bank statement** — the record of movements and balances a bank sends you. TreasuryHub reads
  the common SWIFT formats:
  - **MT940** — end-of-day statement (the global standard).
  - **MT942** — intraday statement (a partial, in-day view).
  - **camt.053** — end-of-day statement in the newer ISO 20022 (MX) standard; the successor to MT940.
  - **camt.054** — individual debit/credit notification.
- **BIC** — a bank's SWIFT address. A **multi-BIC** connection covers all your entities and banks
  through one link.
- **End-of-day vs intraday** — end-of-day statements (MT940 / camt.053) give the closing picture;
  intraday statements (MT942) refresh your position during the day.
- **Deduplication** — if the same movement arrives intraday and again at end of day, it isn't counted
  twice.

## Before you start
- Confirm your organization has SWIFT connectivity (e.g. Alliance Lite2, Alliance Access, or a
  service bureau) and knows which formats each bank delivers.
- Have your bank BIC(s) and account details ready.

## How to use it

### Set up a SWIFT connection
1. Open **Integrations › Services**, select the **Settlement networks** category, and find the
   **SWIFT** connector.
2. Choose **Connect** to start the guided setup.
3. Provide your connectivity details and the BIC(s) and accounts to receive statements for.
4. Confirm the formats your banks send (MT940 / MT942 / camt.053 / camt.054).
5. Save. TreasuryHub begins polling for incoming statements automatically.

### Let statements flow in
1. Once connected, statements are received automatically — no manual import.
2. Each message is parsed field by field, normalized (currencies, dates, references, amounts), and
   classified (payment, collection, fee, interest, tax).
3. Parsed movements and balances appear in your cash position and are available for
   [reconciliation](../04-reconciliation/overview.md).

### Review and fix a parsing issue
1. When a statement doesn't parse cleanly, an **alert** is raised with the context of the problem.
2. Open the item to see the **raw message alongside the parsed fields**, so you can see exactly what
   was extracted.
3. Use the **AI integration sub-agent** to get a plain-language explanation of the error and a
   suggested fix.
4. After correcting the rule, **re-process** the affected statement — you don't need to request the
   file from the bank again.

## The AI integration sub-agent
A specialized AI sub-agent supports SWIFT setup and day-to-day running:

- **Assisted setup** — guides you through connecting and mapping each bank.
- **Error explanation** — turns a parsing failure into a clear description of what went wrong and
  how to fix it.
- **Proactive alerts** — flags messages that fail to parse, missing statements, or unexpected data
  so nothing goes unnoticed.

## Beyond statements
SWIFT carries more than statements, and TreasuryHub supports a wider set of message types
(payment and interbank confirmations, FX and derivatives, trade finance, and securities messages) as
part of enterprise connectivity. Bank statements and balances are the primary use case.

## Tips to get more value
- Use **intraday (MT942)** alongside **end-of-day (MT940 / camt.053)** where your banks offer it, for
  a fresher in-day position.
- Treat the AI sub-agent's alerts as an early-warning system — a missing or unparsed statement is
  usually easier to fix the same day.
- SWIFT and [Open Banking](open-banking.md) complement each other; use Open Banking for banks where
  SWIFT isn't available or isn't cost-effective.

## Where to go next
- [Integrations Overview](overview.md) — all ingestion channels.
- [Open Banking](open-banking.md) — the complementary channel for local banks and fintechs.
- [Reconciliation](../04-reconciliation/overview.md) — where ingested movements are matched.
- [Ingestion Activity](ingestion-activity.md) — monitor what's been received.
