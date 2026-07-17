# Feature Availability

This page is the master list of what is **live today** versus **in preview**, mapped directly to the
platform's own navigation menu. Every page in this help center carries an availability badge at the
top so you always know what to expect.

## What the badges mean

**Availability** — how ready a feature is for you to use:

| Badge | Meaning |
|-------|---------|
| `Available` ✅ | Live and generally available in the platform (shown **Active** in the menu). |
| `In Preview` 👁️ | Being tested — **available on request**. Contact Treasury Hub (or your account manager) to have it enabled for your organization. |

**Plan tier** — a separate, commercial dimension:

> **Premium plans ("Upgrade").** Some modules belong to a **premium plan**, shown with an **Upgrade**
> tag in the platform. This is a plan/pricing tier only — it says nothing about whether a feature is
> live. Where a page is premium, we note **Plan: Premium (Upgrade)** in its header; its readiness is
> shown separately by the `Available` / `In Preview` badge above.

> **Reading the platform's own tags:** a green **Active** tag means the feature is live for you; an
> orange **Upgrade** tag means it belongs to a premium plan.

## Live today (Active) — quick list
Home · Roadmap · Email Ingestion · SFTP Ingestion · Ingestion
Activity · Parsing Templates (file import) · Transactions · Bank Statements · Invoices ·
Reconciliation Status report · G/L Postings · Exchange Rates · Payment Blotter (incl. creating
payments) · Data Hub · Data Export · Financial Events · Access Tokens · Company Groups · Companies ·
Bank Accounts · Tags · Custom Entities · Matching Rules · User Management.

Everything else is **In Preview**.

## Status by menu

### Home · Roadmap
| Item | Status |
|---|---|
| Home (cash position dashboard) | ✅ Available |
| Roadmap | ✅ Available (interactive Alex agent 👁️ In Preview) |

### Integrations
| Item | Status |
|---|---|
| Email Ingestion · SFTP Ingestion · Ingestion Activity | ✅ Available (Active) |
| Services · Status · Webhooks · API Agent Integrator | 👁️ In Preview (Upgrade) |
| SWIFT · NetSuite (live under *Services*) | 👁️ In Preview (Upgrade) |
| Open Banking account linking (via Bank Accounts) | ✅ Available |
| File import — CSV, Excel, PDF (with OCR) via **Parsing Templates** | ✅ Available |

### Reconciliation — **In Preview · Premium (Upgrade)**
The Reconciliation module is In Preview (per the team). The separate *Reconciliation Status* report under Reporting › Operations is Available.
| Item | Status |
|---|---|
| Dashboard · Reconciliation Status · 1-to-1 Matching · Batch Matching · Approvals · ERP Posting (Publishing) | 👁️ In Preview |
| Advanced Reconciliation *Criteria* & *Flows* setup (under Configuration) | 👁️ In Preview (Upgrade) |

### Reports
| Item | Status |
|---|---|
| Transactions · Bank Statements · Invoices · Reconciliation Status · G/L Postings · Exchange Rates | ✅ Available (Active) |
| Reporting Dashboard · Audit | 👁️ In Preview |
| Cash Position · Cash Forecast · Actual vs Forecast · Scenarios (What-If) | 👁️ In Preview |
| FX / Debt / Investment blotters · Amortization Schedule · Customer Aging · G/L Entry Lifecycle | 👁️ In Preview |
| Risk Management (Risk Cockpit, MtM, FX Exposure, Credit Risk, IRRBB, ALM) | 👁️ In Preview |

> Note: the **Home** cash-position dashboard is live, but the detailed **Cash Position report** under
> Reports is In Preview.

### Payments
| Item | Status |
|---|---|
| Payment Blotter (incl. creating single & batch payments via **+ New Payment**) | ✅ Available (Active) |
| Payment Approvals | 👁️ In Preview (Upgrade) |
| Payment Lifecycle Blotter · Net Settlements | 👁️ In Preview (Upgrade) |
| SWIFT/SEPA network dispatch · sanctions screening · ERP AP | 👁️ In Preview (premium) |

### Data
| Item | Status |
|---|---|
| Data Hub | ✅ Available (Active) |
| Data Export (outbound API) | ✅ Available (Active) |
| Financial Events | ✅ Available (Active) |
| Data Repository | 👁️ In Preview (Upgrade) |
| Custom export builder ("Create Your Own", under Configuration) | 👁️ In Preview (Upgrade) |

### Workflows — **In Preview**
| Item | Status |
|---|---|
| Workflow Dashboard · Workflow Approvals · Workflow Builder | 👁️ In Preview (Upgrade) |

### Alerts — **In Preview**
| Item | Status |
|---|---|
| Alerts Dashboard + all per-module alerts (Integration, Data, Reconciliation, GL Posting, Payment, Reports, Prefunding, Workflow, Agent, Admin) | 👁️ In Preview (Upgrade) |

> Reconciliation exceptions surface **within** the Reconciliation module; the
> standalone Alerts centre is in testing and available on request.

### Agents (AI) — **In Preview**
The **Switch Agent** panel shows 16 agents (Alex, Sophia, Mateo, Lucas, Olivia, Nadia, Isabella,
Noah, Carter, Elena, Ethan, Ava, Liam, Mia, Ona, Oliver). **None are live yet**, including the in-app
Assistant. Screens (Agent Dashboard, Builder, Approvals, Chats, Logs) are all 👁️ In Preview.

> The AI-assisted **matching** inside the live Reconciliation module works today as a feature of that
> module; the standalone conversational agents are In Preview.

### Admin Console
| Item | Status |
|---|---|
| Access Tokens | ✅ Available (Active) |
| Master Data: Company Groups · Companies · Bank Accounts · Tags · Custom Entities · Matching Rules · User Management | ✅ Available (Active) |
| User & Agent Management (combined screen) | 👁️ In Preview (Upgrade) |
| Static Data | 👁️ In Preview (Upgrade) |

> Plain **User Management** (under Master Data) is live; the combined **User & Agent Management**
> screen is In Preview because it includes agent management.

### Configuration
| Item | Status |
|---|---|
| Parsing Templates (ingestion) | ✅ Available (Active) |
| Workflow Builder · Reconciliation Flows · Reconciliation Criteria · Data Exports "Create Your Own" | 👁️ In Preview (Upgrade) |

### Platform
| Item | Status |
|---|---|
| Multi-tenant, tenant switching · light/dark theme · language (EN/ES) · login | ✅ Available |
| White-label / partner branding | 👁️ In Preview (premium) |

\* = present in the build but scope/depth to be confirmed by the Treasury Hub team.

---

See also: [What is Treasury Hub](01-what-is-treasury-hub.md) · [Core Concepts](03-core-concepts.md) ·
internal map: [`_meta/LIVE-STATUS.md`](../_meta/LIVE-STATUS.md)
