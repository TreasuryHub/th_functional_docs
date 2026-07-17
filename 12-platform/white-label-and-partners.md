# White-Label & Partner Branding

> **Availability:** `In Preview` 👁️
> **Plan:** Premium (Professional Services / Upgrade)
> **Where to find it:** enabled and configured with the Treasury Hub team · self-service brand
> management via the **Partner / Brand Kit** portal (where provisioned).
> **Who uses it:** partners who resell or embed Treasury Hub under their own brand; partner
> administrators who manage the brand kit.
> **Permissions required:** partner administrator access to the brand-kit portal (arranged with
> Treasury Hub). See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

> 👁️ **In Preview.** This module is in testing and available on request — contact Treasury Hub to enable it for your organization. This page describes how it works.

## Overview
White-label will let a **partner** deliver Treasury Hub under **their own brand** — logo, colors,
typography, and a custom web address — so end users experience the platform as the partner's own
product. Every visible touchpoint, from the login screen to emails and PDF reports, can reflect the
partner's brand, while the underlying treasury functionality, data model, and security stay the
same for everyone. This is an **add-on delivered with Professional Services**; contact your account
manager to enable it.

## Key concepts
- **Partner** — an organization that resells or embeds Treasury Hub under its own brand.
- **White-label** — presenting the platform under the partner's brand rather than Treasury Hub's.
- **Brand kit** — the collection of a partner's brand assets and settings: logo, favicon, colors,
  typography, custom text (app name, welcome message, email sender), and custom domain.
- **Custom domain** — the partner's own web address for the platform (for example
  `treasury.partner.com`), served securely over HTTPS.
- **Theme inheritance** — the partner's brand kit is applied on top of Treasury Hub's default
  design; anything the partner doesn't override keeps the platform default.
- **Multi-tenant** — each partner (and each partner's clients) is isolated in its own tenant, so
  branding and data never cross between partners. See [Core Concepts](../00-getting-started/03-core-concepts.md#organizations--tenants).

## What can be branded
The partner's brand can be applied consistently across the experience:

| Area | Touchpoints | What's customized |
|---|---|---|
| **Authentication** | Login, MFA, password reset | Logo, background, welcome text, favicon, colors |
| **Global UI** | Navbar / sidebar, favicon & page title, loading/splash, error pages | Logo, primary/secondary colors, typography, browser-tab name and icon |
| **Communications** | Transactional emails, in-app notifications, push / SMS | Header/footer branding, colors, custom sender name and reply-to address |
| **Documents** | PDF reports, CSV/Excel exports, invoices & statements | Branded headers/footers, corporate colors, partner metadata |
| **Technical** | Custom domain, OAuth consent screen | Partner domain with HTTPS, partner brand in authorization flows |

### What is **not** customized
To keep the platform consistent and safe, some things are the same for everyone and can't be
white-labeled:

- **Business logic and financial calculations** — the treasury engine behaves identically for all.
- **Data structures and APIs** — endpoints and data shapes are common across all deployments.
- **Security and compliance** — the same standards apply to every tenant (see
  [Security & Compliance](security-and-compliance.md)).

## How partner onboarding works
*The steps below describe the intended experience once this module is live.*

Bringing a partner live will follow a guided, largely self-service flow:

1. **Initial setup** — Treasury Hub (or the partner, via the admin panel/API) creates the partner's
   tenant, assigns the custom domain (with the required DNS record), and enables the modules covered
   by the partner's license.
2. **Brand kit upload** — through a self-service portal, the partner uploads its logo (SVG and PNG),
   favicon, colors (primary, secondary, accent), and typography (a common web font or a custom font
   file). Uploads are checked automatically for format, size, and resolution.
3. **Preview & QA** — the partner reviews the fully branded experience in a **sandbox** pre-loaded
   with demo data, seeing every touchpoint (login, dashboard, emails, PDFs) and iterating safely
   without affecting production.
4. **Validation** — automated checks confirm the brand kit is production-ready: color **contrast
   (WCAG AA)** for readability, **responsive rendering** across desktop/tablet/mobile, and that all
   required assets are present. A pass/fail report is produced.
5. **Activation** — the custom domain and its security certificate are provisioned and the partner
   is switched live. If a problem is detected, the change can be rolled back immediately.
6. **Monitoring** — after go-live, the partner has a dashboard with usage metrics and automated
   health checks on the custom domain, including alerts before a certificate is due to expire.

> The demo target of "partner live in under 48 hours" is illustrative — actual timing depends on DNS
> and certificate provisioning and on the partner's review. Confirm timelines with the Treasury Hub
> team.

## Managing your brand kit
Partner administrators can manage branding in two ways:

- **Self-service portal** — upload assets, set colors and fonts, preview in the sandbox, and
  activate — no Treasury Hub intervention needed for routine changes.
- **Brand Kit API** — for partners who prefer to manage branding programmatically, a REST API is
  available to read and update the brand kit, upload or remove assets, generate a temporary preview,
  run validations, and **activate** or **roll back** a version. Every change is **versioned**, so
  you can revert to any previous brand kit instantly.

Practical guardrails to be aware of:
- **Versioning & rollback** — each change creates a new version; rollback restores a prior version
  completely.
- **Preview links** are temporary (they expire after a set period) so you validate before going live.
- **Asset and readability limits** apply (for example, minimum color contrast for accessibility and
  sensible file-size limits) and are enforced by the automatic validation step.

> ⚠️ **Confirm with Treasury Hub.** Whether the self-service portal and Brand Kit API are enabled for
> your engagement, and the exact limits and endpoints, are set up as part of Professional Services —
> confirm scope with your account manager.

## Tips & good practices
- Prepare a complete brand kit up front (vector logo, favicon, exact color values, chosen font) to
  move through onboarding quickly.
- Use the **sandbox preview** to check every touchpoint — especially emails and PDFs — before
  activating.
- Choose color combinations that pass the **contrast check** so screens stay legible for all users.
- Rely on **versioning**: activate confidently knowing you can roll back instantly if needed.

## Related
- [Security & Compliance](security-and-compliance.md) — the uniform security applied to every tenant.
- [Core Concepts](../00-getting-started/03-core-concepts.md) — multi-tenancy and tenant isolation.
- [Navigation & Your Workspace](../00-getting-started/02-navigation-and-workspace.md) — where your brand appears in the top bar.

## In Preview
- 👁️ **Sub-client branding** — a further level of brand inheritance so a partner's own clients can be
  branded beneath the partner. In preview; confirm availability with Treasury Hub.
