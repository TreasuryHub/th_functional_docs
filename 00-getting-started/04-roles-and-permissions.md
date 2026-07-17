# Roles & Permissions

> **Availability:** `In Preview` 👁️
> **Where to find it:** Admin Console › User & Agent Management
> **Who this is for:** administrators; useful background for all users.
> **Permissions required:** AdminAndSettings.UserManagement · Admin

> 👁️ **In Preview.** The Roles & Permissions management console is in testing and available on
> request — contact Treasury Hub to enable it. This page describes how it works.

## Overview
Treasury Hub controls what each person can see and do with **role-based access control (RBAC)**.
Users are assigned one or more **roles**; each role grants a **permission level** for each module.
This is also why two people can see different menus and buttons — the sidebar and actions adapt to
your permissions.

## Permission levels
Every module is governed by one of five levels:

| Level | Value | What it allows |
|-------|-------|----------------|
| **No Access** | 0 | The module is hidden from the menu and its screens can't be opened. |
| **Read** | 1 | View data only — no create, edit, or delete. |
| **Create/Edit** | 2 | View, create, and edit records. |
| **Delete** | 3 | View, create, edit, and delete records. |
| **Admin** | 4 | Full access, including configuration. |

## Permission modules
Levels are set **per module**. The main permission modules are:

| Permission module | Governs |
|---|---|
| `CashManagement.CashPosition` | Dashboard, bank statements, data export. |
| `CashManagement.Transactions` | Transactions (flat & hierarchical). |
| `CashManagement.TransactionsPosting` | G/L postings. |
| `CashManagement.Payments` | Payment management. |
| `CashManagement.Invoices` | Invoice management. |
| `CoreData.BankAccounts` | Bank account management. |
| `CoreData.ExchangeRates` | Exchange rate management. |
| `CoreData.CompanyGroups` | Company group management. |
| `CoreData.Companies` | Company management. |
| `CoreData.Tags` | Tag management. |
| `CoreData.MatchingRules` | Matching-rule management. |
| `AdminAndSettings.UserManagement` | Users, roles, groups, access tokens. |

## How effective permissions are calculated
- A user can hold **multiple roles**.
- For each module, the user's **effective level is the highest** level granted by any of their roles.
- **Super Admin** users bypass all checks and can access every module and action.
- Roles store their permissions as an allowance matrix, so you can tune each role precisely.

## Access can be scoped further
Beyond module-level permissions, access can be narrowed by:
- **Legal entity / company** and **bank account** — users see only the entities and accounts they're
  entitled to.
- **Payment approval level** — users are assigned an approval authority used by multi-level payment
  approvals. See [Payment Approvals](../05-payments/approvals.md).

## Typical roles
Common predefined roles include **Admin, Treasurer, Analyst, Auditor, and Viewer**, each with a
sensible default permission matrix. The platform's broader model spans operational, governance, and
system roles that map onto workflow approvals. You can also create **custom roles** to match your
organization.

| Role | Typical access |
|---|---|
| Treasurer | Broad read/write across cash, payments, reporting; approvals. |
| Analyst | Create/edit on operational data; read on admin. |
| Accounts Payable | Payments create/edit; invoices; limited elsewhere. |
| Auditor | Read-only across modules + audit trail. |
| Viewer | Read-only, limited modules. |
| Administrator | Admin on user management and configuration. |

## How to manage roles & permissions
### Create or edit a role
1. Go to **Admin Console › User & Agent Management › Roles**.
2. Choose **+ Add Role** (or open an existing role).
3. Name the role, then set the **permission level for each module** in the matrix.
4. Save. The role is now assignable to users.

### Assign roles to a user
1. Go to **Admin Console › User & Agent Management › Users**.
2. Open the user (or invite a new one).
3. Assign one or more **roles**, and set their **company/account access** and **payment approval
   level** as needed.
4. Save.

For full details see the [Admin Console](../10-admin-console/roles-and-groups.md).

## Lifecycle & audit
Users can be **activated, suspended, or deactivated**; the history of permission changes is
preserved for audit. SSO with corporate directories (Azure AD, Okta, Google Workspace) is supported
so access follows your identity provider.

## Related
- [Admin Console — Users, Roles & Groups](../10-admin-console/roles-and-groups.md)
- [Payment Approvals](../05-payments/approvals.md)
- [Core Concepts](03-core-concepts.md)
