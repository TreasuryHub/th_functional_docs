# Security & Compliance

> **Bank-grade security: SSO, MFA, encryption and ISO 27001**
>
> **Why it matters**
> - **Only the right people get in**: single sign-on, multi-factor authentication and role-based permissions.
> - **Your data stays yours**: isolated to your organization, encrypted in transit and at rest.
> - **Human in the loop: approval on every agent action.**
>
> *For the CFO: the security questionnaire is answered from a standing position rather than assembled per deal.*

> **Where to find it:** applies platform-wide · access management in **Admin Console › User & Agent Management**
> **Who uses it:** everyone signs in; administrators manage access and review the audit trail; security, risk, and compliance teams review the platform's posture.
> **Permissions required:** signing in requires no permission; managing users, roles, and access requires `AdminAndSettings.UserManagement` · Admin (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).

## Overview
Bank-grade security, so the question stops being whether your treasury data is safe: TreasuryHub is
built so that only the right people reach it, and every action they take is recorded. Access is controlled by **single sign-on**, **multi-factor authentication**,
and **role-based permissions**; your data is **isolated to your organization**; and everything is
**encrypted** in transit and at rest. This page explains, in plain terms, how you sign in and out,
how access is controlled, and the security and compliance assurances the platform provides.

## Key concepts
- **Tenant (organization)** — your company's private space in TreasuryHub. All your data is scoped
  to your tenant and never mixed with another customer's. See [Core Concepts](../00-getting-started/03-core-concepts.md#organizations--tenants).
- **Single sign-on (SSO)** — signing in through your organization's identity provider instead of a
  separate TreasuryHub password. TreasuryHub uses **Azure AD B2C** and supports corporate
  directories such as **Azure AD, Active Directory / LDAP, Okta, and Google Workspace**.
- **Multi-factor authentication (MFA)** — a second verification step (e.g. a code or authenticator
  app) on top of your password, so a stolen password alone can't grant access.
- **Role-based access control (RBAC)** — what you can see and do is decided by the **roles** you are
  assigned. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).
- **Session** — your active signed-in period. Sessions time out after inactivity and end when you
  sign out.
- **Audit trail** — the record of who did what, when, and the outcome, kept across the platform.

## Before you start
- Your administrator sets up your account and roles in the [Users & Roles](../10-admin-console/users-and-roles.md)
  before you can sign in.
- If your organization uses SSO with its own identity provider, that connection must be configured
  first — ask your administrator.
- MFA may be required by your organization's policy; if so, have your authenticator method ready.

## How to use it

### Sign in
1. Open TreasuryHub in your browser. If you're not signed in, you're taken to the **Login** page.
2. The login screen shows your organization's branding, a **Sign in with Azure B2C** button, a
   **language selector**, and a **theme toggle**.
3. Click **Sign in with Azure B2C**. You're redirected to your organization's secure sign-in flow.
4. Enter your corporate credentials and complete **MFA** if prompted.
5. On success you're returned to TreasuryHub — to your **Home / Dashboard**, or to the page you
   originally requested.

### Sign out
1. Click your **avatar** in the top bar.
2. Select **Logout**.
3. Your session is cleared and you're returned to the **Login** page.

> **Automatic sign-out:** if your session expires or is left idle beyond the configured timeout,
> TreasuryHub signs you out and returns you to the login page to protect your data. Sign in
> again to continue.

### Understand what you can access
- Your menu and available actions adapt to your **roles and permissions** — if you don't see a
  module or button, it's likely hidden by your permission level.
- Access can be narrowed further by **legal entity / company**, **bank account**, and
  **payment approval level**. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md#access-can-be-scoped-further).

## Configuration
These are managed by administrators (and, for SSO/MFA, in coordination with the TreasuryHub team):

- **Users, roles, and groups** — invite users, assign roles, and set entity/account scope in the
  [Users & Roles](../10-admin-console/users-and-roles.md).
- **SSO connection** — link your corporate identity provider (Azure AD, Active Directory / LDAP,
  Okta, Google Workspace) so access follows your directory.
- **MFA policy** — require multi-factor authentication for users per your security policy.
- **Session policy** — session timeout, renewal, and concurrent-session handling.
- **User lifecycle** — users can be **activated, suspended, or deactivated**; the history of
  permission changes is preserved for audit.

## How your data is protected
TreasuryHub applies enterprise-grade protection across every layer:

- **Data isolation** — each organization's data is logically isolated to its own tenant; sessions
  are scoped so there is no data leakage between organizations.
- **Encryption in transit** — all communication is encrypted (TLS 1.3).
- **Encryption at rest** — sensitive stored data is encrypted (AES-256).
- **Data masking** — sensitive data is masked in non-production environments.
- **Secrets management & key rotation** — API keys, integration credentials, and certificates are
  held in a secure vault, and encryption keys and credentials are rotated regularly.
- **Perimeter protection** — network segmentation, firewalls, intrusion detection, and DDoS
  protection guard the platform.
- **Security event logging** — sign-in attempts, access violations, and security incidents are
  logged comprehensively.

## Compliance posture
TreasuryHub is operated against recognized security and data-protection standards:

- **ISO 27001 certified** — information security management.
- **GDPR program** — European data protection (EU 2016/679), including data-subject rights.
- **Encrypted in transit and at rest.**
- **Human in the loop: approval on every agent action.**
- **Local data-protection regulations** — e.g. Ghana's Data Protection Act (Act 843), for
  deployments where local law applies.

Data-residency options are described in
[Deployment, Availability & Continuity](deployment-availability-and-continuity.md).

## Audit & accountability
- Most actions in TreasuryHub are modeled as **workflows** that record **who did what, when, and
  the outcome** — see [Core Concepts](../00-getting-started/03-core-concepts.md#everything-is-a-workflow).
- Reconciliation keeps a full **audit trail** of every match; approvals record the approver and
  decision.
- Administrators can review the history of permission and user-lifecycle changes.

## Tips to get more value
- Keep MFA enabled even when it's optional for internal users — it's the single biggest protection
  against account compromise.
- Sign out when leaving a shared device rather than relying on the idle timeout.
- Review roles regularly and apply **least privilege** — grant the lowest permission level that lets
  each person do their job.
- Use **suspend/deactivate** promptly when someone changes role or leaves, so access follows your
  directory.

## Where to go next
- [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md) — the RBAC model and permission levels.
- [Core Concepts](../00-getting-started/03-core-concepts.md) — tenants, workflows, and auditability.
- [Users & Roles](../10-admin-console/users-and-roles.md) — where access is managed.
- [Deployment, Availability & Continuity](deployment-availability-and-continuity.md) — data residency, backup, and recovery.
- [Preferences](preferences.md) — theme and language on the login screen and in-app.
