# Master Data

> **Clean reference data, accurate everything**
>
> **Why it matters**
> - **The single biggest lever on accuracy**: transactions, reconciliation, reporting and payments all read from here.
> - **One map of the area**: companies, bank accounts, currencies and exchange rates, with who can change what.
> - **Errors stop at the source**: a correction here fixes every figure downstream at once.

> **Where to find it:** Admin Console › Master Data
> **Who uses it:** administrators; some areas also for Cash Managers and Bookkeepers.
> **Permissions required:** the relevant `CoreData.*` module at **Read** or higher (see the table below).

## Overview
Clean reference data is the single biggest thing you can do for accurate results: **master data**
is what everything else in TreasuryHub depends on — your companies and
bank accounts, and currencies and exchange rates. Transactions, reconciliation, reporting, and
payments all read from it, so keeping master data clean, complete, and consistent is the single
biggest thing you can do for accurate results. This page is the map of the Master Data area and how
access to it is controlled.

Transaction categories and tags are set by [classification rules](../02-integrations/transaction-tagging.md)
and by [matching rules](matching-rules.md), and the labels themselves are maintained on [Tags](tags.md).

## Key concepts
- **Master data** — shared, slow-changing reference data that other modules point to (as opposed to
  transactional data, which flows in constantly).
- **RBAC** — access to each master-data area is granted per permission module, so people see only the
  reference data they're entitled to. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).
- **Default company** — the one company per tenant marked as default; other companies can't be created
  until it exists.

## What's in Master Data
| Area | What it holds | Manage it in |
|---|---|---|
| **Company Groups** | Groupings of companies for consolidation. | [Companies & Company Groups](companies-and-groups.md) |
| **Companies** | Your legal entities (one is the default). | [Companies & Company Groups](companies-and-groups.md) |
| **Bank Accounts** | Accounts held at institutions, in currencies, under a company. | [Bank Accounts](../06-reporting/bank-accounts.md) |
| **Counterparties & SSIs** | The parties you pay and their settlement instructions (by currency), for transfers. | [Counterparties & SSIs](counterparties-and-ssis.md) |
| **Currencies & Exchange Rates** | Currency pairs and rates used for conversion. | [Exchange Rates](../06-reporting/exchange-rates.md) |
| **Tags** | The labels you attach to transactions, by cost centre, project or purpose. | [Tags](tags.md) |
| **Custom Entities** | User-defined master-data entity types you create for reference data specific to your organization. | Admin Console › Master Data › Custom Entities |
| **Matching Rules** | Tenant-wide rules that tag transactions or create G/L postings automatically. | [Matching Rules](matching-rules.md) |
| **User Management** | The people who can sign in to your tenant. | [Users & Roles](users-and-roles.md) |
| **Static Data** | Standing reference lists for the platform. | Admin Console › Master Data › Static Data |

> **Custom Entities** let you add your own reference-data entity types. **Static Data (Datos
> Estáticos)** holds the platform’s standing reference lists.

## Who can see what
Access to Master Data is enforced **per area**, so two administrators may see different items. A user
sees a Master Data item in the menu **only if** they have at least **Read** on its permission module,
and can open its page only under the same check. **Super Admin** users bypass all checks.

| Master Data area | Permission module | Minimum level | Typically granted to |
|---|---|---|---|
| Company Groups | `CoreData.CompanyGroups` | Read | Admin |
| Companies | `CoreData.Companies` | Read | Admin |
| Bank Accounts | `CoreData.BankAccounts` | Read | Admin, Cash Manager |
| Counterparties & SSIs | `CoreData.Counterparties` · `CoreData.SSIs` | Read (Approve to authorize) | Admin, AP, Treasury Controller |
| Tags | `CoreData.Tags` | Read | Admin, Cash Manager |
| Matching Rules | `CoreData.MatchingRules` | Read | Admin, Bookkeeper |
| Exchange Rates | `CoreData.ExchangeRates` | Read | Admin |
| Custom Entities | Admin only | — | Admin |
| Static Data | — | — | Admin |

Higher levels grant more: **Create/Edit** to add and change records, **Delete** to remove them. If a
user opens a Master Data URL they aren't entitled to, they're redirected — access fails closed rather
than showing content by accident. Which role carries which permission is configured in
[Users & Roles](users-and-roles.md); the platform never gates by role name, only by permission.

## Before you start
- Decide who owns each area — typically administrators own companies and currencies, while Cash
  Managers and Bookkeepers own the areas they work in daily.
- Set up master data **before** inviting most users, so access scoping and rules have something to
  reference.

## How to use it
### Open a Master Data area
1. Go to **Admin Console › Master Data**.
2. The submenu lists only the areas you're authorized to see, in a fixed top-down order.
3. Click an area to open its management grid. Each area has its own how-to page (linked above).

### Keep master data clean
1. Establish and document **naming conventions** for companies, accounts, and counterparties.
2. Set the **default company** deliberately and review it after any restructuring.
3. Review **currencies and exchange rates** so conversions and consolidated views stay accurate.
4. Keep your transaction categories tidy in **Settings › Ingestion › Transaction Tagging ›
   Classification rules**, so reporting by category stays meaningful as volumes grow.
5. **Export** each area periodically for audit and offline review.

## Tips to get more value
- Treat master data as the **foundation**: a single wrong company or currency propagates into every
  report.
- Limit **Create/Edit** and **Delete** on core areas (companies, currencies) to a small group.
- Make routine cleanup a **scheduled task**, not a one-off — reference data drifts over time.

## Where to go next
- [Companies & Company Groups](companies-and-groups.md) — model your group once, and every figure consolidates correctly.
- [Tags](tags.md) · [Matching Rules](matching-rules.md) — label every transaction your way, and apply those labels by rule.
- [Bank Accounts](../06-reporting/bank-accounts.md) · [Exchange Rates](../06-reporting/exchange-rates.md) — the register and the rates behind every number you publish.
- [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md) — how access is enforced.
- [Core Concepts — Master data](../00-getting-started/03-core-concepts.md#master-data) — why this data is the single biggest lever on accuracy.
