# Bank Accounts

> **Availability:** `Available` ✅
> **Where to find it:** Admin Console › Master Data › Bank Accounts (the management grid); also shown as a report under Reporting › Operations › Bank Accounts. Add accounts with **+ Add Account** on Home (top-right) or on the Bank Accounts screen. This is **core data** used across the platform.
> **Who uses it:** treasury operations, cash managers, finance teams, administrators.
> **Permissions required:** `CoreData.BankAccounts` · Read to view; CreateEdit to add/edit accounts and set balances; Delete to remove. Uploading a statement per account needs `CashManagement.CashPosition.BankStatements` · CreateEdit. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Bank Accounts is where you manage the accounts that hold your cash. It's a full-featured grid of
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
2. Fill in the account name, IBAN, account number, BIC, institution, company, and currency (plus an
   optional description).
3. Save. The account appears in the grid.

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

## Tips & good practices
- Check the **Exceptions** and **Disconnected** tabs regularly — an expired consent silently stops data
  flowing until you reconnect.
- Use **force balance** only to correct or seed a balance; routine balances should come from
  statements or automatic sync.
- Keep account **type** and **company** accurate — they drive how balances consolidate in
  [Cash Position](cash-position.md).

## Related
- [Bank Statements](bank-statements.md) — the statement pipeline that feeds account balances.
- [Transactions](transactions.md) — the movements on each account.
- [Cash Position](cash-position.md) — accounts consolidated into your position.
- [Exchange Rates](exchange-rates.md) — used to convert balances to your display currency.
- [Integrations](../02-integrations/overview.md) — Open Banking and other feeds.
- [Core Concepts](../00-getting-started/03-core-concepts.md) — company/account hierarchy and master
  data.
