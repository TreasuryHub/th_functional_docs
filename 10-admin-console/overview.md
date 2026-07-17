# Admin Console — Overview

> **Availability:** `Available` ✅
> **Where to find it:** Admin Console
> **Who uses it:** administrators, user managers, and treasury operations leads.
> **Permissions required:** `AdminAndSettings.UserManagement` · Admin (people & access); `CoreData.*` · Read+ (master data). See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
The **Admin Console** is the central place where administrators govern your organization's Treasury
Hub tenant: who can log in, what each person can do, how your legal structure is modeled, and the
reference data every other module depends on. It's where you demonstrate governance, compliance, and
control — the settings here shape what every other user sees and can do.

Everything in the Admin Console is scoped to your current **tenant** (organization). If you belong
to more than one organization, switch tenants first — see [Core Concepts](../00-getting-started/03-core-concepts.md#organizations--tenants).

## Key concepts
- **Tenant** — your organization's isolated workspace. All admin settings apply only to the tenant
  you're currently in.
- **RBAC (role-based access control)** — access is granted through **roles**, each of which sets a
  **permission level** per module. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).
- **Master data** — the reference data (companies, bank accounts, currencies, tags, matching rules)
  that the rest of the platform reads from. See [Master Data](master-data.md).

## The admin areas
The Admin Console groups its screens into three areas in the sidebar:

| Area | What it's for |
|---|---|
| [User & Agent Management](user-and-agent-management.md) | Invite and manage users, assign roles and groups, set company/account access and payment approval levels. **User Management is live** ✅; the combined **User & Agent Management** screen and **agent** management are `In Preview` 👁️. |
| [Roles & Groups](roles-and-groups.md) | Define roles (the permission matrix) and organize users into groups. `Available` ✅ |
| [Access Tokens](access-tokens.md) | Create and revoke API credentials and tenant access tokens for integrations and exports. `Available` ✅ |
| [Master Data](master-data.md) | Company Groups, Companies, Bank Accounts, [Tags](tags.md), Custom Entities, [Matching Rules](matching-rules.md), and User Management — all `Available` ✅. (**Static Data** is `In Preview` 👁️.) |

## Who can access the Admin Console
- The Admin Console appears in the sidebar only for users whose role grants an admin permission.
- **People & access** screens (Users, Roles, Groups, Access Tokens) require
  `AdminAndSettings.UserManagement` at **Admin** level.
- **Master data** screens are gated individually — a user might see Tags and Bank Accounts but not
  Companies, depending on their permissions. See [Master Data](master-data.md#who-can-see-what) and
  [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).
- **Super Admin** users bypass all checks and can reach every area.

If you don't see the Admin Console, you don't have an admin permission — ask an existing
administrator to grant it.

## Setting up a new tenant (onboarding)
When your organization joins Treasury Hub, your tenant is provisioned for you. An administrator then
completes setup by working through the Admin Console, typically in this order:

1. **Model your structure** — create your [Company Groups and Companies](companies-and-groups.md) and
   mark one company as the **default**.
2. **Add your bank accounts** — see [Bank Accounts](../06-reporting/bank-accounts.md) (reached under
   Master Data).
3. **Define roles** — review the built-in roles or create [custom roles](roles-and-groups.md) that
   match your team.
4. **Invite users** — [add people by email](user-and-agent-management.md#add-or-invite-a-user) and
   assign their roles, company/account access, and payment approval level.
5. **Prepare reference data** — set up [Tags](tags.md) and [Matching Rules](matching-rules.md) so
   reconciliation and reporting work against clean data.
6. **Connect systems** — link banks, ERPs, and files through [Integrations](../02-integrations/overview.md),
   and create [access tokens](access-tokens.md) where an integration needs them.

> 👁️ **Guided onboarding assistant (In Preview).** A conversational Customer Success assistant will
> walk a new tenant through organization, processes, workflows, users, and source systems, suggesting
> roles and settings as you go. Until then, complete the steps above manually.

## Tips & good practices
- Set up **master data first**, then people — roles and account access reference the companies and
  accounts you've created.
- Grant the **least privilege** that lets each person do their job; add access rather than removing it
  later.
- Keep at least two administrators so you're never locked out.

## Related
- [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md) — the RBAC model in depth.
- [Core Concepts](../00-getting-started/03-core-concepts.md) — tenants, company structure, master data.

## In Preview
- 👁️ **Guided onboarding assistant** — conversational tenant setup (organization, processes,
  workflows, users, systems).
- 👁️ **Agent management** — permissions and oversight for AI agents alongside human users, plus the
  combined **User & Agent Management** screen. See
  [User & Agent Management](user-and-agent-management.md#agent-management-in-preview).
- 👁️ **Static Data (Datos Estáticos)** — standing reference lists under Master Data (premium plan).
