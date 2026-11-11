# Bank Accounts

> **One accurate register of every account, the foundation for every number**
>
> **Why it matters**
> - **The anchor for everything else**: statements, transactions and balances all hang off the account record.
> - **However they arrive**: accounts link automatically through Open Banking, or you add them by hand.
> - **Live balances in the register**: bank, currency, type and current balance in one grid.

> **Where to find it:** Admin Console › Master Data › Bank Accounts (the management grid); also shown as a report under Reporting › Operations › Bank Accounts. Add accounts with **+ Add Account** on Home (top-right) or on the Bank Accounts screen. This is **core data** used across the platform.
> **Who uses it:** treasury operations, cash managers, finance teams, administrators.
> **Permissions required:** `CoreData.BankAccounts` · Read to view; CreateEdit to add/edit accounts and set balances; Delete to remove. Uploading a statement per account needs `CashManagement.CashPosition.BankStatements` · CreateEdit. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Keep one accurate register of every account, because everything else is built on it: Bank Accounts
is where you manage the accounts that hold your cash. It's a full-featured grid of
every account — its bank, currency, type, and live balance — that you can view, add, edit, and link
to your banks. Accounts can be **linked automatically** through Open Banking or **created manually**,
and each account is the anchor for its statements, transactions, and balances everywhere else in the
platform.

Because accounts are **core data**, keeping this list accurate and complete is the foundation for
your cash position, reconciliation, and reporting.

## Key concepts
- **Open Banking linking** — connecting an account directly to your bank (via the Nordigen/PSD2
  Open Banking service) so balances and movements flow in automatically.
- **Consent** — the authorization that permits an Open Banking connection; consents expire and need
  **reconnecting** periodically.
- **Manual account** — an account you create by hand (name, IBAN, account number, BIC, institution,
  company, currency) when an automatic link isn't used.
- **Connection** — the channel an account's data arrives on: **Open Banking**, **Manual Upload**,
  **Swift**, **API**, **SFTP** or **Email**. One is chosen when the account is created, and most
  accounts can be moved to another one later.
- **Account type** — what the account is for (Current, Nostro, Reserve, Settlement, Escrow,
  Investment, Disbursement).
- **Force balance** — manually setting an account's closing balance as of a date, with the position
  recalculated from there.
- **Source** — how an account's data syncs (API, SWIFT, Open Banking, H2H).

## The tabs
The grid is split into tabs so you can focus on accounts that need attention:

| Tab | Shows |
|---|---|
| **All** | Every account. |
| **Exceptions** | Accounts whose sync or data is in an error/exception state. |
| **Disconnected** | Accounts whose Open Banking consent has expired and need reconnecting. |

## Before you start
- To link accounts via Open Banking you need the integration enabled and your bank supported in your
  country.
- You need `CoreData.BankAccounts` at **CreateEdit** to add or edit accounts.

## How to use it

### View and filter accounts
1. Open **Bank Accounts**.
2. Pick a tab (**All / Exceptions / Disconnected**).
3. The grid shows the account details and balances across up to **31 columns**. Use **Columns** to
   show or hide fields, and the filters to narrow by subsidiary, currency, bank, account type, or
   status.

### Link an account via Open Banking
1. Click **+ Add Account** and choose the **Open Banking** option.
2. Select the **country**, then your **bank** from the list.
3. Complete your bank's consent flow. On return, the account is linked and begins syncing balances
   and movements automatically.

### Add an account manually
1. Click **+ Add Account** and choose **manual creation**.
2. Fill in the account **name**, **company**, **currency**, **country**, **connection type**,
   **institution**, **account number**, **IBAN**, **BIC**, an optional **description**, and whether
   **payments are enabled** from it.
3. Save. The account appears in the grid.

### Change how an account's data arrives
1. Select the account and choose **Edit**.
2. On the **Configure account** step, look at the **Connection** options — **Open Banking**,
   **Manual Upload**, **Swift**, **API**, **SFTP** and **Email**.
3. Click the one you want and save. A short **Account updated** confirmation appears and the grid
   shows the new connection.
4. Choosing **Swift** also sets the account up to receive MT940 statements, so nothing further is
   needed to start taking them.

Three rules decide whether the options can be clicked at all, and an option you cannot pick is
dimmed rather than hidden:

- **Open Banking is never a destination.** It is reached only by connecting the bank through the
  consent flow, so its option is always dimmed while you are editing.
- **An account created on Open Banking keeps its connection.** All of its options stay dimmed.
- **An account whose integration was set up for you keeps its connection** as well, because the
  integration and the account have to agree.

If a change is refused when you save, the message says so: *This account's connection cannot be
changed. Open Banking accounts and accounts with an operator-configured integration keep their
connection.*

### Set an account's balance (force balance)
1. Select the account and choose **Set Account Closing Balance**.
2. Enter the **amount** and the **date**.
3. Save. The closing balance is set and the position recalculated from that point.

### Upload a statement for one account
1. Select the account and choose **Upload Statement**.
2. Drag in the file, pick the correct **parser/format**, and review the **validation summary**.
3. Confirm to process. For bulk and admin-level statement handling, use
   [Bank Statements](bank-statements.md).

### Reconnect an expired consent
1. Open the **Disconnected** tab.
2. On the affected account, click **Reconnect** and complete the bank's consent flow again.

### Export
1. Click **Export** and choose **Excel** or **CSV** for the current, filtered grid.

## Tips to get more value
- Check the **Exceptions** and **Disconnected** tabs regularly — an expired consent silently stops data
  flowing until you reconnect.
- Use **force balance** only to correct or seed a balance; routine balances should come from
  statements or automatic sync.
- Change an account's **connection** before you change anything feeding it. Switching to SFTP or
  Email with no ingestion rule in place leaves the account with no data arriving — see
  [Integrations](../02-integrations/overview.md).
- Keep account **type** and **company** accurate — they drive how balances consolidate in
  [Cash Position](../01-home/home-dashboard.md).

## Where to go next
- [Bank Statements](bank-statements.md) — the statement pipeline that feeds account balances.
- [Transactions](transactions.md) — the movements on each account.
- [Cash Position](../01-home/home-dashboard.md) — accounts consolidated into your position.
- [Exchange Rates](exchange-rates.md) — used to convert balances to your display currency.
- [Integrations](../02-integrations/overview.md) — Open Banking and other feeds.
- [Counterparties & SSIs](../10-admin-console/counterparties-and-ssis.md) — the *payee* side of transfers.
- [Core Concepts](../00-getting-started/03-core-concepts.md) — company/account hierarchy and master
  data.
