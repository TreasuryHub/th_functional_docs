# Companies & Company Groups

> **Availability:** `Available` ✅
> **Where to find it:** Admin Console › Master Data › Company Groups (and › Companies)
> **Who uses it:** administrators and treasury operations.
> **Permissions required:** `CoreData.CompanyGroups` · Read+ and `CoreData.Companies` · Read+ (Create/Edit to add or change; Delete to remove).

## Overview
This is where you model your organization's legal and reporting structure. A **Company** is a legal
entity; a **Company Group** bundles related companies (for example a region or division). This
hierarchy is what lets Treasury Hub consolidate balances and let you drill down: **Company Group ›
Company › Account › Transaction**. Getting it right here means every other module — dashboards,
reconciliation, reporting, payments — rolls up correctly.

## Key concepts
- **Company** — a legal entity in your organization. Bank accounts belong to a company.
- **Company Group** — a grouping of companies used for consolidation and reporting.
- **Default company** — exactly one company per tenant is flagged as the default. It's used as the
  fallback entity, and you can't create other companies until a default exists.
- **Hierarchy** — Company Group › Company › Bank Account. See [Core Concepts](../00-getting-started/03-core-concepts.md#company-structure).

## Before you start
- You need `CoreData.CompanyGroups` and/or `CoreData.Companies` at **Read** to view, **Create/Edit** to
  change, and **Delete** to remove.
- Plan your structure before entering it — how many legal entities you have and how they group.
- Create at least one company and mark it **default** before adding the rest.

## How to use it

### Create a company group
1. Go to **Admin Console › Master Data › Company Groups**.
2. Click **+ Add Company Group**.
3. Enter a **name** for the group.
4. Click **Save**. You can now assign companies to it.

### Create a company
1. Go to **Admin Console › Master Data › Companies**.
2. Click **+ Add Company**.
3. Enter the company **name** and choose its **company group**.
4. Click **Save**.

> **First company must be the default.** If no default company exists yet, Treasury Hub prompts
> *"Please define a default company"* — create one and mark it default before adding others.

### Set or change the default company
1. On the **Companies** grid, open the company you want as default (or use the inline **default**
   toggle).
2. Switch on **Set as default** and **Save**.
3. The previous default is automatically unset — there is always exactly one.

> You **cannot remove the last default company** — set another company as default first.

### Reassign a company to a different group
1. On the **Companies** grid, use the **company group** selector on the company's row (or open the
   company and change its group).
2. **Save**. Consolidation for both groups updates accordingly.

### Delete a company or group
1. Use the **Delete** action on the row and confirm.
2. You can't delete the default company (reassign default first). Make sure no accounts or data depend
   on a company before deleting it.

### Export
- Use **Export** on either grid to download the current list to Excel/CSV.

## Configuration
- **Bank accounts** attach to companies — manage them under Master Data › Bank Accounts (see
  [Bank Accounts](../06-reporting/bank-accounts.md)).
- Company and company-group assignments feed **user access scoping** — the companies you create here
  are what you grant users access to in [User Management](user-and-agent-management.md#configure-a-users-roles-access-and-approval-level).

## Tips & good practices
- Mirror your **legal entity structure** exactly — reporting and reconciliation rely on it.
- Choose the **default company** deliberately; it's the fallback for records that don't specify one.
- Keep group names stable — they appear throughout dashboards and reports.

## Related
- [Master Data](master-data.md) — the wider reference-data picture and who can see what.
- [Core Concepts — Company structure](../00-getting-started/03-core-concepts.md#company-structure).
- [User & Agent Management](user-and-agent-management.md) — scope users to these companies.
- [Bank Accounts](../06-reporting/bank-accounts.md) — accounts belong to companies.
