# Master Data

> **Availability:** `Available` ✅
> **Where to find it:** Admin Console › Master Data
> **Who uses it:** administrators; some areas also for Cash Managers and Bookkeepers.
> **Permissions required:** the relevant `CoreData.*` module at **Read** or higher (see the table below).

## Overview
**Master data** is the reference data everything else in Treasury Hub depends on — your companies and
bank accounts, currencies and exchange rates, tags, and matching rules. Transactions, reconciliation,
reporting, and payments all read from it, so keeping master data clean, complete, and consistent is
the single biggest thing you can do for accurate results. This page is the map of the Master Data area
and how access to it is controlled.

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
| **Currencies & Exchange Rates** | Currency pairs and rates used for conversion. | [Exchange Rates](../06-reporting/exchange-rates.md) |
| **Tags** | Reusable labels for categorizing transactions. | [Tags](tags.md) |
| **Custom Entities** (Entidades Personalizadas) | User-defined master-data entity types you create for reference data specific to your organization. `Available` ✅ | Admin Console › Master Data › Custom Entities |
| **Matching Rules** | Rules that auto-categorize, tag, and route transactions. | [Matching Rules](matching-rules.md) |
| **User Management** (Gestión de Usuarios) | The people who can sign in to your tenant. `Available` ✅ | [User Management](user-and-agent-management.md) |
| **Static Data** (Datos Estáticos) | Standing reference lists for the platform. `In Preview` 👁️ | *In testing and available on request* |

> **Custom Entities** are live today, letting you add your own reference-data entity types. **Static
> Data (Datos Estáticos)** is `In Preview` 👁️ — in testing and available on request.

## Who can see what
Access to Master Data is enforced **per area**, so two administrators may see different items. A user
sees a Master Data item in the menu **only if** they have at least **Read** on its permission module,
and can open its page only under the same check. **Super Admin** users bypass all checks.

| Master Data area | Permission module | Minimum level | Typically granted to |
|---|---|---|---|
| Company Groups | `CoreData.CompanyGroups` | Read | Admin |
| Companies | `CoreData.Companies` | Read | Admin |
| Bank Accounts | `CoreData.BankAccounts` | Read | Admin, Cash Manager |
| Tags | `CoreData.Tags` | Read | Admin, Cash Manager |
| Matching Rules | `CoreData.MatchingRules` | Read | Admin, Bookkeeper |
| Exchange Rates | `CoreData.ExchangeRates` | Read | Admin |
| Custom Entities | Admin only | — | Admin |
| Static Data (`In Preview` 👁️) | — | — | Admin (when live) |

Higher levels unlock more: **Create/Edit** to add and change records, **Delete** to remove them. If a
user opens a Master Data URL they aren't entitled to, they're redirected — access fails closed rather
than showing content by accident. Which role carries which permission is configured in
[Roles & Groups](roles-and-groups.md); the platform never gates by role name, only by permission.

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
1. Establish and document **naming conventions** for companies, tags, and rules.
2. Set the **default company** deliberately and review it after any restructuring.
3. Review **currencies and exchange rates** so conversions and consolidated views stay accurate.
4. Retire unused **tags** and **matching rules** (deactivate rules rather than deleting when unsure).
5. **Export** each area periodically for audit and offline review.

## Tips & good practices
- Treat master data as the **foundation**: a single wrong company or currency propagates into every
  report.
- Limit **Create/Edit** and **Delete** on core areas (companies, currencies) to a small group.
- Make routine cleanup a **scheduled task**, not a one-off — reference data drifts over time.

## Related
- [Companies & Company Groups](companies-and-groups.md) · [Tags](tags.md) · [Matching Rules](matching-rules.md)
- [Bank Accounts](../06-reporting/bank-accounts.md) · [Exchange Rates](../06-reporting/exchange-rates.md)
- [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md) — how access is enforced.
- [Core Concepts — Master data](../00-getting-started/03-core-concepts.md#master-data).
