# Roles & Permissions

> **Give each person exactly the access their role needs**
>
> **Why it matters**
> - **Segregation of duties by design**: build a role once as a matrix of modules and actions, then hand it to people.
> - **Access that scales**: a new joiner gets a role, not a list of individually granted screens.
> - **Audit-ready**: every permission change is recorded, so who could do what, and when, is answerable.

> **Where to find it:** Admin Console › Users & Roles
> **Who this is for:** administrators; useful background for all users.
> **Permissions required:** `AdminAndSettings.UserManagement` · Read

> **In 60 seconds**
> 1. Read what an action means — ["Approve" is an action, and Counterparties also has its own module](#approve-is-an-action-and-counterparties-also-has-its-own-module).
> 2. Check the controls you must preserve — [Segregation of duties](#segregation-of-duties).
> 3. Find the module your person needs in the permission tables below.
> 4. Build the role in [Users & Roles](../10-admin-console/users-and-roles.md) and hand it to them.

## Overview
Give each person exactly the access their job needs, and nothing more: TreasuryHub controls what
everyone can see and do with **role-based access control (RBAC)**. Users are assigned one or more
**roles**; each role grants a set of **actions** on each module.
This is also why two people can see different menus and buttons — the Services menu and the
on-screen actions adapt to your permissions.

## Actions and levels
A role is built as a matrix: one row per **permission module**, and five action columns.

| Action | What it allows |
|--------|----------------|
| **Read** | View the module's data. |
| **Write** | Create records. |
| **Edit** | Change existing records. |
| **Delete** | Remove records. |
| **Approve** | Approve what someone else prepared. |

Not every action applies to every module — a read-only report has nothing to create or delete, and
only an approval module offers Approve. Where an action does not apply, the cell shows a dash and
cannot be ticked. **Read is the base:** turning on any other action turns Read on, and Read cannot
be removed while another action is set.

Behind the matrix each module still resolves to one of five **permission levels**, and these five
are the whole list:

| Level | What it means |
|-------|----------------|
| **No Access** | The module is hidden from the menu and its screens can't be opened. |
| **Read** | View data only. |
| **Create/Edit** | View, create, and edit records. |
| **Delete** | View, create, edit, and delete records. |
| **Admin** | Everything the module offers, including its configuration. |

The levels build on each other: each one includes everything the level below it allows. The level
follows from the ticked actions — no actions is No Access; Read alone is Read; Write, Edit or
Approve reaches Create/Edit; Delete reaches Delete; and every action a module offers, on a module
that can be deleted from, reaches Admin. You tick actions; the level is what the screens are gated
on.

### "Approve" is an action, and Counterparties also has its own module
Approve is one of the five actions, offered only on the modules where approving is a separate job
from changing — Payment Approvals, Reconciliation Matching and Approvals, G/L Postings, Settlement
Instructions, Workflow and Agent Approvals.

Counterparties is the exception that keeps a module of its own: `CoreData.Counterparties.Approve`
("Counterparties — approve") sits alongside `CoreData.Counterparties`, and a user needs Approve on
it to move a counterparty through its approval statuses. Someone with Write and Edit on
`CoreData.Counterparties` alone can maintain counterparties but is not offered the status buttons
at all.

### Segregation of duties
Four combinations are refused, whether they come from one role or from the union of several roles
given to the same person:

| Make | Approve |
|---|---|
| **Write** on Payment Blotter | **Approve** on Payment Approvals |
| **Write** or **Edit** on G/L Postings | **Approve** on G/L Postings |
| **Write** or **Edit** on Counterparties | **Approve** on Counterparties — approve |
| **Write** or **Edit** on Settlement Instructions (SSIs) | **Approve** on Settlement Instructions (SSIs) |

Editing a payment is not creating one, so Edit on the Payment Blotter is allowed beside Approve on
Payment Approvals. The **Admin** role is exempt.

You also cannot grant an action you do not hold yourself. Cells for those actions are disabled in
the role editor, and a role that holds more than you do cannot be assigned to anyone.

## Permission modules
The role editor groups the modules as follows. The **Actions** column lists the actions that can be
granted on that module.

### Cash & Reporting
| Permission module | Governs | Actions |
|---|---|---|
| `CashManagement.CashPosition` | Cash Position | Read |
| `CashManagement.CashPosition.Forecast` | Cash Forecast | Read, Write, Edit |
| `CashManagement.Transactions` | Transactions | Read, Edit |
| `CashManagement.Invoices` | Invoices | Read, Write, Edit, Delete |
| `CoreData.ExchangeRates` | Exchange Rates | Read, Write, Edit, Delete |
| `Reporting.Blotters` | Operations Blotters | Read |
| `Reporting.Risk` | Risk Management | Read |
| `Reporting.Regulatory` | Reports — Regulatory & Compliance | Read |
| `Reporting.Custom` | Reports — Build Your Own | Read, Write, Edit, Delete |

### Payments
| Permission module | Governs | Actions |
|---|---|---|
| `CashManagement.Payments.Blotter` | Payment Blotter | Read, Write, Edit, Delete |
| `CashManagement.Payments.Approvals` | Payment Approvals | Read, Approve |
| `CashManagement.Payments.NetSettlements` | Net Settlements | Read, Write, Edit |

### Reconciliation
| Permission module | Governs | Actions |
|---|---|---|
| `Reconciliation.View` | Reconciliation Dashboard | Read |
| `Reconciliation.Matching` | Matching | Read, Write, Edit, Approve |
| `Reconciliation.Approvals` | Reconciliation Approvals | Read, Approve |
| `Reconciliation.Posting` | ERP Posting | Read, Write, Edit |

### Accounting
| Permission module | Governs | Actions |
|---|---|---|
| `CashManagement.TransactionsPosting` | G/L Postings | Read, Write, Edit, Delete, Approve |
| `Accounting.Journal` | Journal Entries | Read, Write, Edit, Delete |
| `Accounting.CoARules` | CoA Rules Engine | Read, Write, Edit, Delete |
| `Accounting.ERP` | ERP Integration | Read, Write, Edit |
| `Accounting.Audit` | Audit Trail | Read |

### Data & Integrations
| Permission module | Governs | Actions |
|---|---|---|
| `Data.Hub` | Bringing files in — see [Ingestion](../02-integrations/ingestion-activity.md) | Read, Write, Edit, Delete |
| `Data.Repository` | The stored files behind ingested data | Read, Write, Edit, Delete |
| `Data.Export` | Data Export | Read, Write |
| `Data.FinancialEvents` | Financial Events | Read, Write, Edit, Delete |
| `Integrations.Services` | Integration Services | Read, Write, Edit, Delete |
| `Integrations.Ingestion` | Email / SFTP Ingestion | Read, Write, Edit, Delete |
| `Integrations.Activity` | Ingestion Activity | Read |
| `Integrations.Api` | Webhooks / API Agent Integrator | Read, Write, Edit, Delete |

### Workflows, Alerts & Agents
| Permission module | Governs | Actions |
|---|---|---|
| `Workflows.View` | Workflow Dashboard | Read |
| `Workflows.Approvals` | Workflow Approvals | Read, Approve |
| `Workflows.Builder` | Building reconciliation flows — see [Reconciliation Workflows](../04-reconciliation/workflows.md) | Read, Write, Edit, Delete |
| `Alerts.Manage` | Alerts | Read, Write, Edit, Delete |
| `Agents.View` | Agent Dashboard, Chats and Logs | Read |
| `Agents.Builder` | Agent Builder | Read, Write, Edit, Delete |
| `Agents.Approvals` | Agent Approvals | Read, Approve |

### Administration
| Permission module | Governs | Actions |
|---|---|---|
| `AdminAndSettings.UserManagement` | User & Role Management | Read, Write, Edit, Delete |
| `AdminAndSettings.AccessTokens` | Access Tokens | Read, Write, Edit, Delete |
| `CoreData.CompanyGroups` | Company Groups | Read, Write, Edit, Delete |
| `CoreData.Companies` | Companies | Read, Write, Edit, Delete |
| `CoreData.BankAccounts` | Bank Accounts | Read, Write, Edit, Delete |
| `CoreData.Counterparties` | Counterparties | Read, Write, Edit, Delete |
| `CoreData.Counterparties.Approve` | Counterparties — approve | Read, Approve |
| `CoreData.SSIs` | Settlement Instructions (SSIs) | Read, Write, Edit, Delete, Approve |
| `CoreData.Tags` | Transaction tagging — tags, classification rules and conflicts | Read, Write, Edit, Delete |
| `CoreData.CustomEntities` | Custom Entities | Read, Write, Edit, Delete |
| `CoreData.MatchingRules` | Matching Rules | Read, Write, Edit, Delete |
| `Config.ParsingTemplates` | Parse Templates | Read, Write, Edit, Delete |
| `CoreData.StaticData` | Static Data | Read, Write, Edit, Delete |

### Platform
| Permission module | Governs | Actions |
|---|---|---|
| `Platform.OnboardingRoadmapBoard` | The content of the Status board | Read |

Reading the [Status board](../01-home/status-board.md) itself needs no permission at all — every
user can open it. This module covers who may *maintain* its content, and editing it is reserved for
TreasuryHub.

Older module names such as `AdminAndSettings.Roles`, `AdminAndSettings.Connectivity`,
`AdminAndSettings.UserGroups` and the `CashManagement.CashPosition.*` family are still honoured for
roles that already hold them, but they are not offered in the role editor.

## How effective permissions are calculated
- A user can hold **multiple roles**.
- For each module, the user gets the **union of the actions** granted by any of their roles, which
  resolves to the **highest** of the levels those roles grant.
- A module you hold nothing on at all behaves exactly like **No Access**.
- When you invite someone or change their roles, a **Resulting effective permissions** panel shows
  that union before you save.

## Super Admin
**Super Admin is a flag on a user record, not a role.** It is deliberately absent from the Roles &
Permissions screen — which says so in a note — and never appears in the dialog where you assign
roles to a user, so there is nothing to look for there. Three things follow from that:

- It applies **across every organization** — a person is a Super Admin everywhere or nowhere. There
  is no "Super Admin of one organization".
- It **bypasses module permission checks**, so a Super Admin can open every module and action.
- Only TreasuryHub staff can grant or revoke it, from an internal panel. **Nobody inside your
  organization can grant it or escalate to it**, including your own administrators. An attempt to
  do so is refused and recorded in the audit trail.

The flag does not replace normal membership: a Super Admin still needs to belong to an organization
in order to work in it.

## Access can be scoped further
Module permissions decide *what* you can do. A second layer decides *which rows* you see, and its
rules surprise people, so they are worth knowing:

- A user with the **Admin** role in the organization is **not restricted** — they see every account
  and company.
- A non-admin is limited to the **accounts and companies linked to them**, and the two combine with
  **AND**: a row has to match both an account they're linked to and a company they're linked to.
- A non-admin with **no links at all** is **not restricted** either. No links means "nothing to
  narrow by", not "nothing to see".

That last rule is usually the answer to *"why do I see fewer rows than my colleague?"* — the
colleague either has the Admin role or has no links, while you have links that narrow the view.

Row-level scoping is applied per screen rather than platform-wide, so it does not reach every
report. **Balance Differential**, for example, is controlled by the Cash Position permission alone:
anyone who can open it sees every account in the organization. Where a screen scopes rows, its own
page says so.

Changes to permissions and to account or company links take effect within about **60 seconds**,
because each user's scope is cached. If you have just been given access and can't see it yet, wait a
minute and refresh the page before raising a ticket.

Payments add one more dimension: users are assigned a **payment approval level** used by multi-level
payment approvals. See [Payment Approvals](../05-payments/approvals.md).

## Checking your own access
You don't have to ask an administrator what you can do.

1. Click **your avatar** in the top bar.
2. Choose **My Access**.
3. The dialog shows your email address, the organization you're currently in, a badge saying whether
   you are an **Admin**, a **SuperAdmin** or a standard user, and every role you hold by name with
   the permissions it grants.

Check it before reporting a problem: it tells you in one place whether a missing screen is a
permission question or something else. If your own access does not let you read roles, the dialog
lists your roles by number instead of by name and says so.

## Roles
Each organization starts with a set of **preset** roles — Admin, Configurator, User Manager, Cash
Manager, View Only, Book Keeper, Payment Preparer and Payment Approver — plus Invoice Manager,
Invoice Admin and Docs Manager as ordinary custom roles. Organizations set up earlier keep the roles
they already had, so your own list is whatever the Roles & Permissions screen shows.

A preset is maintained by TreasuryHub and cannot be changed, renamed or deleted; you fork one with
**Save as new role** instead. A role's name is only a label — what it actually permits is the
matrix behind it, which you can open and read on the Roles & Permissions screen.

## How to manage roles & permissions
### Create or edit a role
1. Open **Admin Console › Users & Roles › Roles & Permissions**.
2. Pick a role from the **Preset roles** or **Custom roles** list, or choose **+ Add role**.
3. Tick the actions you want, module by module. Changed cells stay highlighted.
4. **Save** a custom role in place, or type a name in the **Save as new role** bar to create a new
   one.

Managing roles requires **Create/Edit** on `AdminAndSettings.UserManagement`; deleting one requires
**Delete**.

### Assign roles to a user
1. Open **Admin Console › Users & Roles › User Management**.
2. Find the user in the grid, or invite a new one.
3. Use the row actions to **Change roles**, **Edit access** (the companies and accounts that narrow
   what they see), and set their **Payment approval** level.
4. **Save**. Allow about a minute for the change to take effect.

For full details see [Users & Roles](../10-admin-console/users-and-roles.md).

## Lifecycle & audit
A person's membership of an organization is **Invited**, **Invitation expired**, **Active**,
**Suspended** or **Deactivated**, and an administrator moves them between those states from the
Users grid. Every change to a user, a role or an invitation is recorded with its actor, its time and
a before-and-after snapshot, readable on **Admin Console › Users & Roles › Audit Trail**. SSO with
corporate directories (Azure AD, Okta, Google Workspace) is supported so access follows your
identity provider.

## Where to go next
- [Users & Roles](../10-admin-console/users-and-roles.md) — managing people, roles and the audit
  trail.
- [Payment Approvals](../05-payments/approvals.md) — see the permission model enforcing four-eyes control on real money.
- [Navigation & Your Workspace](02-navigation-and-workspace.md) — where these screens live.
- [Core Concepts](03-core-concepts.md) — understand the model once, and every screen makes sense.
