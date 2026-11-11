# Commercial upgrade — change log

Applied from the CEO's *TreasuryHub Documentation: Commercial Upgrade Brief*.
Branch `docs/commercial-layer`. 85 published pages (was 82).

---

## 1. What the PM has to fill in

Ten `[CONFIRM: …]` placeholders, across 8 pages. All of them exist because the feature
is described as live but its menu entry is not in `nav-config.ts`, so inventing a path
would have broken the "never invent a menu path" guardrail.

| Page | Placeholder |
|---|---|
| `11-accounting/gl-postings.md` | menu path |
| `11-accounting/journal-entries.md` | menu path |
| `11-accounting/coa-rules-engine.md` | menu path |
| `10-admin-console/matching-rules.md` | menu path |
| `10-admin-console/tags.md` | menu path |
| `04-reconciliation/erp-posting.md` | menu path |
| `06-reporting/gl-postings-report.md` | menu path |
| `06-reporting/risk-management/investment-risk.md` | screen-level steps (×3) |

Investment Risk's **menu path and permission did not need a placeholder**: the screen is
in `nav-config.ts` as `rptInvestmentRisk` at **Reporting › Risk Management › Investment
Risk**, with the same permission treatment as the other risk pages. Only the on-screen
field names are unknown, and those are the three placeholders.

---

## 2. Decisions taken on the brief, and why

| Point | Decision |
|---|---|
| **Everything is LIVE** | Applied. The 8 pages below were rewritten in the present tense as active capabilities. Flagged at the time: `th_saas` carries two deprecation notes (`docs/deprecations/2026-10-*.md`) stating these were switched off in Oct 2026 — the cron jobs are removed on every CronJobs start by `DeprecatedRecurringJobsCleanup`, writes answer **410 Gone**, and the menu entries were removed with routes redirecting. The docs now describe behaviour the code does not currently perform. |
| **ISO 27001** | Applied as instructed: SOC 2 Type II deleted, "designed to align with ISO/IEC 27001" → "**ISO 27001 certified**", and the "to be confirmed by TreasuryHub" caveat removed. |
| **Architecture diagram** | Pasted unchanged. Note that `th_functional_docs` is a **public** GitHub repo (`preview.html` returns 200 unauthenticated), so the diagram marked client-only is now on a public link. |
| **Module names** | Website names in module titles, the modules table and the architecture diagram. Every "Where to find it" line keeps the label the user sees in the product menu, so nobody hunts for a "Payment Hub" entry that the app calls "Payments". |
| **Brand spelling** | "Treasury Hub" → "TreasuryHub" throughout (235 replacements). The app's own `<title>` still reads "Treasury Hub" — worth aligning in `th_webapp/index.html`. |

---

## 3. Structural fixes (Section 3)

- **3.1 — eight pages rewritten as live**, in the standard template (Overview, Key
  concepts, Before you start, How to use it, Configuration, Tips, Where to go next):
  `11-accounting/gl-postings.md`, `11-accounting/journal-entries.md`,
  `11-accounting/coa-rules-engine.md`, `10-admin-console/matching-rules.md`,
  `10-admin-console/tags.md`, `04-reconciliation/erp-posting.md`,
  `02-integrations/netsuite-erp.md`, `06-reporting/gl-postings-report.md`.
  Residual "switched off / no longer / legacy / removed from the menu" wording cleared from
  `02-integrations/overview.md`, `04-reconciliation/overview.md`,
  `10-admin-console/master-data.md`, `11-accounting/audit-trail.md`, `08-alerts/alerts.md`.
  Kept where it describes ordinary product behaviour: a template that is switched off, a
  report schedule that is switched off, the quoted UI string "Payments are switched off for
  this account", and the legacy `.xls` file format.
- **3.1a — new page** `06-reporting/risk-management/investment-risk.md`, placed between FX
  Risk and Interest Rate Risk (via a new `PAGE_ORDER` entry), and linked from the Risk
  Management overview, the Risk Cockpit and the modules table.
- **3.1b — SOC 2 removed**, ISO wording changed, GDPR program / encryption / human-in-the-loop
  worded as on the website.
- **3.2 — draft markers gone.** The preview top bar now reads *"TreasuryHub · User
  documentation · 85 pages · November 2026"*. The two "Permissions required: to be confirmed"
  lines (Scenarios, Regulatory & Compliance) now carry the permission their sibling pages use.
- **3.3 — 29 broken bullet lists fixed** by inserting the missing blank line before the list in
  the Markdown source. The brief estimated "about 30"; the exact count was 29.
- **3.4 — Spanish leftovers removed**: "(Flujos de Conciliación)", "(Entidades
  Personalizadas)", "(Gestión de Usuarios)", "(Datos Estáticos)". "Where to find it" lines that
  opened with a negative now lead with the real location.

---

## 4. The value layer (Sections 1A, 2, 4, 5)

- **85 value headers** — outcome headline plus 2–3 "Why it matters" benefits, between the H1 and
  the existing metadata blockquote. Headlines from Section 4; benefits written from each page's
  own content.
- **12 "For the CFO" call-outs**, on the pages Section 2.6 names.
- **69 Overview openings rewritten** outcome-first.
- **81 × "Tips & good practices" → "Tips to get more value"**, **85 × "Related" → "Where to go
  next"**.
- **22 "In 60 seconds" boxes** on pages over ~1,500 words, each 3–5 steps linking to that page's
  own sections. Every in-page anchor was verified against the headings it points at.
- **6 "Get more from this" call-outs**, on the pairings Section 2.4 names.
- **2 new pages**: `00-getting-started/05-value-by-role.md` and
  `00-getting-started/06-first-30-days.md`, both linked from "What is TreasuryHub?".
- **What is TreasuryHub? rewritten**: AI-native financial infrastructure opening, the 5-layer
  stack replaced by the architecture diagram, an Ask / Build / Automate / Govern section, the
  modules table cut to the website's 8 with Professional Services removed.
- **Banned words**: 31 instances of *unlock(s)*, *simply* and minimising *just* replaced. Uses of
  "just" meaning *only* or *recently* were kept, as removing them damages readability without
  serving the rule's purpose.

---

## 5. Not done, and why

- **"Each link states a benefit"** — the 17 bullets that carried no description at all now have
  one, and every link list I touched was rewritten to state a reason. The remaining link
  descriptions already name a reason to go there; converting all ~350 of them would have pushed
  most pages past the brief's own ~120-word budget. Worth a second pass if the CEO wants it.
- **"ALM & Regulatory" as one module** — ALM (under Risk Management) and Regulatory & Compliance
  Reports live in different directories. Rather than restructure, each now carries a line naming
  them as the two halves of the ALM & Regulatory module. Say the word and they can be merged.
- **The preview sidebar** still mirrors the product menu (4 · Reconciliation, 5 · Payments, 6 ·
  Reporting) rather than the website's module names, so it keeps working as a navigation aid.

---

## 6. Verification run after the edits

- 0 broken internal `.md` links across 89 files.
- 0 occurrences of TMS, Treasury Management System, SOC 2, Professional Services, or any banned word.
- All 22 quick-start anchors resolve to real headings.
- `preview.html` rebuilds cleanly at 85 pages; the architecture diagram's `<style>` and `<figure>`
  survive the Markdown build unescaped.
- Outside the 4 pages that also gained a quick-start box, no page grew by more than ~160 words.
