# AI Agents — Overview

> **Availability:** `In Preview` 👁️ (no agents are live yet, including the in-app Assistant)
> **Where to find it:** Agents (sidebar) · **Open Assistant** (top bar)
> **Who uses it:** everyone — treasurers, finance teams, analysts, auditors, administrators.
> **Permissions required:** using the Assistant needs no special permission (it acts within your own access). Managing agents needs `AdminAndSettings.UserManagement` · Admin (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).

## Overview
AI agents are Treasury Hub's assistants that help you **operate the whole platform in plain
language** — instead of learning every screen, you tell an agent what you need and it guides you,
answers questions, or does the work for you (always within your permissions). Agents are not a
single chatbot bolted on the side; they are a **transversal layer** that reaches across every
module — integrations, reconciliation, payments, reporting, data, and workflows.

The AI agents are **not live yet** — including the in-app Assistant (the **Open Assistant** button is
present in the top bar, but the assistant behind it is still in development). The **named, specialized
agents** listed in the catalogue below (16 agents, each an expert in one domain) are in preview —
this page explains where they fit so you understand the direction of the product. You will switch
between them from the **Switch Agent** panel, with **Alex** (Customer Success) as the default
orchestrator.

> Note: Sophia's AI-assisted **matching** is a feature of the
> [Reconciliation](../04-reconciliation/overview.md) module (also In Preview), not one of the
> standalone conversational agents described here.

> The figures and agent names shown in demos (action counts, success rates, hours saved, sample
> counterparties) are **illustrative examples**, not your organization's data.

## Key concepts
- **Agent** — a specialized AI assistant with a defined role, a scope of data it can see, and a set
  of actions it can take. Some agents are conversational helpers; others run in the background.
- **Orchestrator / enabler** — an agent doesn't replace the platform's modules; it *coordinates*
  them. It can read your data, invoke a [workflow](../07-workflows/overview.md), draft a report, or
  hand off to another, more specialized agent.
- **Tenant context** — every agent is scoped to your [organization (tenant)](../00-getting-started/03-core-concepts.md#organizations--tenants).
  It answers with your real data and never sees another organization's data.
- **Human-in-the-loop** — agents propose and prepare; **people approve**. Anything that changes
  data or money routes through the platform's normal [approvals](../07-workflows/overview.md).
- **RAG (retrieval-augmented generation)** — how an agent grounds its answers in *your* data and the
  platform's knowledge base, rather than giving generic responses.

## How agents fit the platform
AI is a layer that sits across the [5-layer stack](../00-getting-started/03-core-concepts.md#data-flows-in-one-direction-source--insight),
not a module in isolation. In practice an agent can:

- **Understand your tenant context** — who you are, your role, your permissions, your entities and
  accounts, and which screen you're on.
- **Invoke workflows** — kick off or advance a [workflow](../07-workflows/overview.md) (a
  reconciliation run, a payment, a report) on your behalf.
- **Read and write with your permissions** — an agent can only see and do what *you* are allowed to;
  it inherits your [role-based access](../00-getting-started/04-roles-and-permissions.md).
- **Answer from your data (RAG)** — "What's my cash position today?" returns real figures with links
  to the relevant screen or report.
- **Track outcomes** — every agent action is recorded (what it did, when, the result) so you get a
  full audit trail and can measure the time it saves.

## The agent catalogue
Treasury Hub's vision is a **team of specialized agents**, each an expert in one domain, coordinated
by **Alex** (Customer Success) who routes each request to the right expert. You pick an agent from
the **Switch Agent** panel. Only the in-app Assistant is live today; the specialized agents below
are largely **In Preview** 👁️.

| Agent | Specialty | What it does / will do | Status |
|---|---|---|---|
| **Alex** | Customer Success | The orchestrator — guides tenant setup and daily operations, routes questions to domain agents, escalates to a human when needed. | 👁️ In Preview |
| **Sophia** | Reconciliation | Suggests matches, scores confidence, explains its reasoning, and flags anomalies. | 👁️ In Preview |
| **Mateo** | Confirmation Matcher | Matches and confirms deal/settlement confirmations against your records. | 👁️ In Preview |
| **Lucas** | Journal Entry Generator | Generates journal entries from reconciled activity for review and posting. | 👁️ In Preview |
| **Olivia** | Market Data & Reporting | Pulls market data and prepares reporting, including mark-to-market inputs. | 👁️ In Preview |
| **Nadia** | FX Risk & Hedging | Monitors FX exposure and recommends hedging actions. | 👁️ In Preview |
| **Isabella** | Credit Risk Monitor | Monitors counterparty credit exposure, limits, and watch-list names. | 👁️ In Preview |
| **Noah** | Cash Management | Assists with cash position, liquidity, and forecasting. | 👁️ In Preview |
| **Carter** | Workflow Designer | Helps design and configure workflows in the Workflow Builder. | 👁️ In Preview |
| **Elena** | Reporting Agent | Builds reports and models what-if scenarios in plain language. | 👁️ In Preview |
| **Ethan** | Payment Processor | Assists with creating, batching, and routing payments. | 👁️ In Preview |
| **Ava** | AML & Compliance | Screens payments and counterparties for sanctions/AML and compliance. | 👁️ In Preview |
| **Liam** | Interest Rate Risk | Analyzes repricing gap, duration, and IRRBB scenarios. | 👁️ In Preview |
| **Mia** | ALM & Liquidity | Supports asset-&-liability management, liquidity gap, LCR/NSFR. | 👁️ In Preview |
| **Ona** | Admin & Personal Coach | Admin assistance plus a personal copilot with role-based coaching. | 👁️ In Preview |
| **Oliver** | Data Governance & Lineage | Watches data quality and traces lineage from source to report. | 👁️ In Preview |
| **Custom agents** | Anything you need | Agents you build by describing them in plain language in the [Agent Builder](agent-builder.md). | 👁️ In Preview |

> **Sophia:** Sophia's AI-assisted matching — suggested matches, confidence scores, and anomaly flags —
> is part of the [Reconciliation](../04-reconciliation/overview.md) module (In Preview), separate from
> the standalone conversational agent.

## What's in the Agents area
The **Agents** menu will bring these agents together in one place:

| Screen | What it's for | Status |
|---|---|---|
| [Assistant](assistant.md) | The in-app Assistant for onboarding, setup, and help (button present in the top bar; assistant in development). | 👁️ In Preview |
| [Agent Dashboard](agent-dashboard.md) | See every agent, what each one is doing, and the outcomes and time it saves. | 👁️ In Preview |
| [Agent Builder & Execution Log](agent-builder.md) | Build and configure agents by conversation, and review a log of everything agents have done, with approvals. | 👁️ In Preview |

## Before you start
- The in-app Assistant is available to everyone from the **Open Assistant** button in the top bar —
  see [Navigation & Your Workspace](../00-getting-started/02-navigation-and-workspace.md#the-top-bar).
- Named agents inherit your [permissions](../00-getting-started/04-roles-and-permissions.md), so
  clean [master data](../00-getting-started/03-core-concepts.md#master-data) and correct role
  assignments will make them more useful when they arrive.

## Tips & good practices
- Think of an agent as a **colleague who knows the platform**, not a search box — describe your goal
  ("reconcile last week's PSP settlements") rather than hunting for the right screen.
- Agents act **within your permissions**. If an agent can't do something, it's usually a permissions
  or data-availability limit, not a failure — check with your administrator.
- Remember that agents **prepare, people approve**. Review what an agent proposes before it's
  committed, especially for payments and postings.

## Related
- [Core Concepts — The AI layer & agents](../00-getting-started/03-core-concepts.md#the-ai-layer--agents)
- [Assistant](assistant.md) — the in-app helper.
- [Reconciliation](../04-reconciliation/overview.md) — where Sophia's AI matching runs.
- [Workflows](../07-workflows/overview.md) — what agents orchestrate.

## In Preview
- 👁️ **Alex — Customer Success agent** — conversational onboarding, daily operations, and Q&A over
  your real data, orchestrating the specialized agents.
- 👁️ **The specialized domain agents** — Sophia (Reconciliation), Mateo (Confirmation Matcher),
  Lucas (Journal Entries), Olivia (Market Data & Reporting), Nadia (FX Risk), Isabella (Credit
  Risk), Noah (Cash Management), Carter (Workflow Designer), Elena (Reporting), Ethan (Payments),
  Ava (AML & Compliance), Liam (Interest Rate Risk), Mia (ALM & Liquidity), Ona (Admin & Coach),
  and Oliver (Data Governance & Lineage).
- 👁️ **Ona role-based coach variants** — a personal copilot tailored to your job description and goals.
- 👁️ **[Agent Dashboard](agent-dashboard.md)** and **[Agent Builder & Execution Log](agent-builder.md)**.
