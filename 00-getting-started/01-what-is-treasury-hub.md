# What is TreasuryHub?

> **The bedrock your finance runs on: every action governed, every number traced**
>
> **Why it matters**
> - **Keep the systems you have**: TreasuryHub runs underneath your banks, ERP and ledgers, so going live takes weeks and replaces nothing.
> - **Trusted data first**: everything is normalized at the source, which is what makes the reporting, the reconciliation and the AI on top of it worth believing.
> - **AI agents that do the work, with people in control**: approvals, permissions and a full audit trail on every action an agent takes.
>
> *For the CFO: one layer that the banks, the ERP and the board pack all agree with — and a control framework that stands up to audit because every number carries its own trail.*

> **Who this is for:** everyone using the platform.

## Overview
TreasuryHub is AI-native financial infrastructure: the bedrock your finance runs on. It sits
underneath the banks, payment rails, ERP and ledgers you already have, and connects, normalizes,
reconciles, pays, posts and measures risk across all of them. Every action governed, every number
traced.

It is built for organizations that manage **multiple bank accounts across multiple institutions,
currencies, and companies** — corporates and groups, growth companies, fintechs and PSPs, and banks
and central banks.

## The problem it solves
Corporate treasury is usually fragmented:

- Accounts spread across dozens of banks, each with its own portal and file format.
- Balances and movements arriving in different formats (MT940, CAMT.053, BAI2, CSV, PDF…).
- Manual, error-prone reconciliation and month-end close.
- No single, trustworthy, real-time cash position.

TreasuryHub consolidates all of this into one layer and automates the flow from **raw bank/ERP
data → normalized data → reconciliation → reporting, payments and accounting**.

## Architecture: one layer, from source to insight

<!-- TreasuryHub architecture diagram, identical to the website version. Client documentation only: do not publish publicly. -->
<!-- Paste this whole block into the docs page where the diagram should appear. All CSS is scoped to .th-arch. -->
<style>
.th-arch{--ink:#141414;--ink-1:#1A1A1A;--ink-2:#202020;--rule-2:rgba(255,255,255,.16);--gold:#B4975A;--gold-l:#CEBB8B;--gold-b:#D4AF37;--txt-d:rgba(255,255,255,.68);--txt-dd:rgba(255,255,255,.46);
  background:var(--ink-1);color:#fff;border-radius:18px;padding:32px;font-family:'DM Sans',system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.5;margin:24px 0}
.th-arch *{box-sizing:border-box}
.th-arch .eyebrow{font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-b)}
.th-arch h3{margin:10px 0 8px;font-size:28px;font-weight:600;letter-spacing:-.02em;line-height:1.1;color:#fff}
.th-arch h3 .hl{color:var(--gold-b)}
.th-arch .lead{margin:0 0 24px;font-size:16px;color:var(--txt-d);max-width:62ch}
.th-arch .stack{display:grid;grid-template-columns:64px 1fr;gap:14px}
.th-arch .agents{grid-row:1/span 3;border:1px solid rgba(212,175,55,.55);border-radius:16px;background:linear-gradient(180deg,rgba(212,175,55,.2),rgba(180,151,90,.05));display:flex;align-items:center;justify-content:center;padding:16px 0}
.th-arch .agents span{writing-mode:vertical-rl;transform:rotate(180deg);font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#fff;white-space:nowrap}
.th-arch .mods{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.th-arch .mod{border:1px solid var(--rule-2);border-radius:12px;padding:14px;background:var(--ink-2);display:grid;gap:4px;min-width:0}
.th-arch .mod b{font-weight:600;font-size:15px;line-height:1.3}
.th-arch .mod small{font-size:13px;color:var(--txt-dd);line-height:1.4}
.th-arch .layers{display:grid;gap:10px}
.th-arch .lyr{display:grid;grid-template-columns:200px 1fr;gap:20px;align-items:center;border:1px solid rgba(180,151,90,.4);border-radius:12px;padding:12px 18px;background:rgba(180,151,90,.05)}
.th-arch .lyr b{font-family:'JetBrains Mono',monospace;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold-l);font-weight:500}
.th-arch .lyr span{font-size:15px;color:var(--txt-d)}
.th-arch .yours{grid-column:1/-1;display:grid;grid-template-columns:120px repeat(4,1fr);gap:10px;margin-top:6px}
.th-arch .lab{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--txt-dd);display:flex;align-items:center}
.th-arch .sys{border:1px dashed var(--rule-2);border-radius:12px;padding:12px;font-size:14px;color:var(--txt-d);display:flex;align-items:center;gap:10px;min-width:0}
.th-arch .sys svg{flex-shrink:0;color:var(--gold)}
.th-arch .note{margin-top:24px;display:flex;flex-wrap:wrap;gap:10px 32px;font-size:15px;color:var(--txt-d)}
.th-arch .note b{color:#fff}
@media (max-width:900px){.th-arch .mods{grid-template-columns:repeat(2,1fr)}}
@media (max-width:640px){.th-arch{padding:20px}.th-arch .stack{grid-template-columns:1fr}.th-arch .agents{grid-row:auto;padding:12px}.th-arch .agents span{writing-mode:horizontal-tb;transform:none;white-space:normal;text-align:center}.th-arch .lyr{grid-template-columns:1fr;gap:4px}.th-arch .yours{grid-template-columns:1fr 1fr}.th-arch .lab{grid-column:1/-1}}
</style>
<figure class="th-arch" role="img" aria-label="TreasuryHub architecture: AI agents run end to end across eight capabilities, on top of Workflows, Data science and Integrations layers, connected to the client's banks, PSPs, ERP and internal ledger.">
  <div class="eyebrow">Architecture</div>
  <h3>One layer, <span class="hl">from source to insight.</span></h3>
  <p class="lead">AI agents operate end to end across every capability, on trusted, normalized data and governed workflows, connected to the stack you already run.</p>
  <div class="stack">
    <div class="agents"><span>AI agents · end to end</span></div>
    <div class="mods">
      <div class="mod"><b>Bank Connectivity</b><small>Every account, one feed</small></div>
      <div class="mod"><b>Reconciliations</b><small>Continuous matching</small></div>
      <div class="mod"><b>GL Postings</b><small>Journals with evidence</small></div>
      <div class="mod"><b>Payment Hub</b><small>Pay anywhere, controlled</small></div>
      <div class="mod"><b>Cash &amp; Liquidity</b><small>Live position, forecast</small></div>
      <div class="mod"><b>Analytics &amp; Reporting</b><small>Board and investor packs</small></div>
      <div class="mod"><b>Risk Management</b><small>FX, rates, credit, investments, MtM</small></div>
      <div class="mod"><b>ALM &amp; Regulatory</b><small>Balance sheet and filings</small></div>
    </div>
    <div class="layers">
      <div class="lyr"><b>Workflows</b><span>Orchestrated · configurable · audited</span></div>
      <div class="lyr"><b>Data science</b><span>Data normalized · standardized · enriched</span></div>
      <div class="lyr"><b>Integrations</b><span>Multi-format · multi-source · real time</span></div>
    </div>
    <div class="yours">
      <span class="lab">Your stack</span>
      <div class="sys"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg><span>Banks</span></div>
      <div class="sys"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg><span>PSPs, exchanges, wallets, IMTOs, MNOs</span></div>
      <div class="sys"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg><span>ERP</span></div>
      <div class="sys"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg><span>Internal ledger</span></div>
    </div>
  </div>
  <div class="note">
    <span><b>No rip-and-replace.</b> Your systems of record stay. TreasuryHub becomes the layer they run on.</span>
    <span><b>Trusted data first.</b> AI is only as good as the data under it. Ours is normalized at the source.</span>
  </div>
</figure>

## How the AI works
The last generation helped finance teams do the work. This one does it — with people in control.

- **Ask** — question every bank, rail and ledger in plain language; every answer traces back to its
  source.
- **Build** — describe a report, a reconciliation or a workflow; TreasuryHub builds it for you to
  review.
- **Automate** — turn any recurring task into an agent that runs on a schedule or on an event.
- **Govern** — approvals, permissions and a full audit trail on every action an agent takes.

The ladder: **the first time, you do it. The second time, it becomes a workflow. From then on, an
agent runs it for you.** See [AI Assistance — Overview](../09-agents/overview.md).

## What you can do with it
One layer to run treasury **end to end** — from the moment bank and ERP data lands to the
reconciliation, reporting, payments, and decisions you make on it.

- **See every account in real time** — one live, consolidated cash position across banks, currencies,
  countries, and companies, instead of logging into portals and stitching spreadsheets together.
- **Connect to everything, automatically** — any bank, any format: SWIFT, Open Banking, APIs, files,
  email, SFTP, and NetSuite ERP bring balances and movements in with no manual downloads.
- **Normalize any format** — MT940, CAMT.053, BAI2, CSV, PDF, and more are parsed into consistent
  accounts, movements, invoices, deals, loans, and investments.
- **Reconcile continuously** — rule-based and AI-assisted matching across **bank ↔ ERP ↔ internal**
  records, with configurable reconciliation workflows so your team handles only the exceptions.
- **Pay with control** — initiate single or batch payments against known payees and their settlement
  instructions, with **multi-level approvals**, threshold rules, and full status tracking.
- **Report, forecast, and model** — standard reports and **build-your-own**, cash position, cash forecast,
  actual-vs-forecast, operations blotters for FX, loans, and investments, and what-if scenario
  modeling.
- **Close the books** — post to your **G/L / ERP** with a chart-of-accounts rules engine, approval
  workflow, journal entries, and a full **audit trail**.
- **Manage risk** — FX, credit, interest-rate, investment, mark-to-market, and ALM, with exposures,
  VaR, and stress testing.
- **Let AI do the setup and the busywork** — describe a change in plain language on the screen you
  are already on, and get back a prepared change to review and submit.
- **Administer with confidence** — users, roles, and granular permissions with **segregation of duties**,
  companies and groups, bank accounts, tags, counterparties & settlement instructions, and access tokens —
  all audited.
- **Run it your way** — multi-tenant and **white-label** from day one, English/Spanish, light/dark,
  with enterprise-grade security and availability.

## The modules at a glance
| Module | In plain language |
|---|---|
| 🏦 Bank Connectivity | Every account, one feed. Brings every bank account into one place and keeps balances up to date. |
| ⚖️ Reconciliations | Continuous matching. Matches your records against the bank so you can trust the numbers. |
| 📒 GL Postings | Journals with evidence. Turns treasury activity into accounting entries for your ERP. |
| 💸 Payment Hub | Pay anywhere, controlled. Pay suppliers and move money, with approvals on every payment. |
| 💧 Cash & Liquidity | Live position, forecast. Shows the cash you have and the cash you'll have. |
| 📊 Analytics & Reporting | Board and investor packs. Shows where your cash is and lets you build the reports you need. |
| 🛡️ Risk Management | FX, rates, credit, investments, MtM — your treasury risks in one real-time view. |
| ⚖️ ALM & Regulatory | Balance sheet and filings. Keeps assets and liabilities in balance, and regulators answered. |

Risk Management covers [FX Risk](../06-reporting/risk-management/fx-risk.md),
[Interest Rate Risk](../06-reporting/risk-management/interest-rate-risk.md),
[Credit Risk](../06-reporting/risk-management/credit-risk.md),
[Investment Risk](../06-reporting/risk-management/investment-risk.md) and
[Mark-to-Market](../06-reporting/risk-management/mark-to-market.md), summarised together on the
[Risk Cockpit](../06-reporting/risk-management/risk-cockpit.md).

## Where to go next
- [Why TreasuryHub: value by role](05-value-by-role.md) — what changes for you specifically, whether you run finance, treasury, control or risk.
- [Your first 30 days: quick wins](06-first-30-days.md) — the order to switch things on, and what each step gives you.
- [Navigation & Your Workspace](02-navigation-and-workspace.md) — everything you need is two clicks away.
- [Core Concepts](03-core-concepts.md) — understand the model once, and every screen makes sense.
- [Roles & Permissions](04-roles-and-permissions.md) — give each person exactly the access their role needs.
