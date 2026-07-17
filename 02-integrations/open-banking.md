# Open Banking (PSD2)

> **Availability:** `Available` ✅
> **Where to find it:** click **+ Add Account** on **Home** (top-right) and choose Open Banking. The Bank Accounts grid — where you can also add accounts — lives under **Admin Console › Master Data › Bank Accounts**. There is no separate "Open Banking" item under Integrations.
> **Who uses it:** treasury operations, finance team, administrators.
> **Permissions required:** administrator to link accounts (bank-account access); see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Open Banking connects Treasury Hub directly to your bank accounts through the bank's own regulated
API — no files, no portals, no SWIFT. Once you authorize a connection, **balances and movements
refresh automatically**, giving you a real-time consolidated position across banks and countries.
It's the natural way to bring in local banks, fintechs, and neobanks — accounts that often sit
outside SWIFT.

Treasury Hub uses **Nordigen**, a certified account-information aggregator, to reach a wide network
of banks under PSD2 and equivalent Open Finance regulations.

## Key concepts
- **Open Banking / PSD2** — regulation that requires banks to expose secure APIs so authorized
  third parties can read account data on your behalf.
- **Aggregator** — a certified provider (Treasury Hub uses **Nordigen**) that connects to many banks
  through one integration, so you don't integrate each bank separately.
- **Consent (OAuth)** — you authorize the connection once at your bank; Treasury Hub then keeps the
  access current automatically until the consent expires and needs renewing.
- **Account discovery** — when you connect a bank, Treasury Hub can discover the accounts you hold
  there rather than you entering each one by hand.

## What data is ingested
- **Balances** — available balance, book balance, currency, and the time it was last updated.
- **Movements** — date, amount, counterparty, reference, and category, normalized to Treasury Hub's
  standard model.
- **Accounts** — discovered automatically for each connected bank.
- **Account metadata** — account type, IBAN, currency, and bank.

## Before you start
- Check that your bank is reachable via Open Banking in your country (coverage is broad in Europe and
  the UK, and growing in Latin America).
- Have your bank login ready for the one-time authorization step.
- Confirm you have rights to add or link bank accounts — see
  [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## How to use it
### Link a bank via Open Banking
1. On **Home**, click **+ Add Account** (top-right) and pick **Open Banking** linking. You can also add
   accounts from **Admin Console › Master Data › Bank Accounts**. See
   [Bank Accounts › Link an account via Open Banking](../06-reporting/bank-accounts.md#link-an-account-via-open-banking).
2. Select your **bank / country** from the list.
3. Complete the **secure authorization (OAuth)** at your bank — you log in at the bank, not in
   Treasury Hub.
4. **Confirm the accounts** you want to bring in from those discovered.
5. Save. Balances and movements begin refreshing automatically.

### Set up with the AI integration sub-agent
1. When connecting a new bank, the **integration sub-agent** can guide you step by step: choosing the
   bank, completing authorization, and verifying the first data.
2. If a connection fails or data looks incomplete, the agent helps **diagnose** the problem and
   suggests the fix.

## Configuration
- **Refresh cadence** — balances and movements update automatically on a schedule.
- **Alerts** — the integration sub-agent monitors connections continuously and can alert you to:
  - a **consent / token about to expire** (so you re-authorize before data stops),
  - a **bank not responding** or a **disconnected account**,
  - **data not updated** within an expected window,
  - and business signals such as a **low balance** or an **unusual movement**.

## Tips & good practices
- Re-authorize promptly when you're warned a consent is expiring — otherwise the feed pauses until
  you do.
- Use Open Banking for banks and fintechs where [SWIFT](swift.md) isn't available; the two channels
  complement each other and land in the same unified position.
- After linking, check [Ingestion Activity](ingestion-activity.md) to confirm the first balances and
  movements arrived as expected.

## Related
- [Bank Accounts](../06-reporting/bank-accounts.md#link-an-account-via-open-banking) — where you add and link accounts.
- [Integrations Overview](overview.md) — all ingestion channels.
- [SWIFT](swift.md) — the complementary channel for global banks.
- [Ingestion Activity](ingestion-activity.md) — confirm data is flowing.
- [Reconciliation](../04-reconciliation/overview.md) — where movements are matched.
