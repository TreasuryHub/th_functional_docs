## What this does

Applies the CEO's *Commercial Upgrade Brief* across the documentation. 85 published pages (was 82).

Full detail, including every decision taken and why, is in
[`_meta/COMMERCIAL-UPGRADE-CHANGELOG.md`](_meta/COMMERCIAL-UPGRADE-CHANGELOG.md).

## Structural fixes (Section 3, done first)

- **8 pages rewritten as live** in the standard template: G/L Postings, G/L Postings (Reporting),
  Journal Entries, Chart of Accounts & Rules Engine, Matching Rules, Tags, Reconciliation ERP
  Posting, NetSuite.
- **New page**: Investment Risk, between FX Risk and Interest Rate Risk, linked from the Risk
  Management overview, the Risk Cockpit and the modules table.
- **SOC 2 claim removed**; ISO 27001 stated as certified; the to-be-confirmed caveat dropped.
- **29 broken bullet lists fixed** at source (the brief estimated ~30).
- Draft marker replaced, both "Permissions: to be confirmed" lines resolved, Spanish leftovers
  removed.

## The value layer

85 value headers · 12 CFO call-outs · 69 Overview openings rewritten outcome-first · 22 "In 60
seconds" quick-start boxes · 6 "Get more from this" call-outs · "Tips to get more value" and "Where
to go next" renamed throughout · *What is TreasuryHub?* rebuilt around the architecture diagram with
the website positioning and the Ask/Build/Automate/Govern framework · two new pages (*Why
TreasuryHub: value by role*, *Your first 30 days*).

## Three things to check before merging

1. **10 `[CONFIRM:]` placeholders** across 8 pages, listed in one table in the change log. Seven are
   menu paths for features whose menu entry is not in `nav-config.ts` — left as placeholders rather
   than invented, per the brief's own guardrail.

2. **The 8 "live" pages describe behaviour the code does not currently perform.** `th_saas` carries
   two deprecation notes (`docs/deprecations/2026-10-*.md`): the cron jobs are removed on every
   CronJobs start by `DeprecatedRecurringJobsCleanup`, writes answer **410 Gone**, and the menu
   entries were removed with routes redirecting. Applied as instructed; flagged here so the decision
   is visible at review.

3. **This repo is public.** `preview.html` returns 200 unauthenticated, which is how the
   htmlpreview link works. The architecture diagram is marked client-only in the brief, so it is now
   on a public link, along with the rest of the commercial layer.

## Verification run after the edits

- 0 broken internal `.md` links across 89 files
- 0 occurrences of TMS, Treasury Management System, SOC 2, Professional Services, or any banned word
- All 22 quick-start anchors resolve to real headings
- `preview.html` rebuilds cleanly; the diagram's `<style>` and `<figure>` survive the Markdown build
- Outside the 4 pages that also gained a quick-start box, no page grew by more than ~160 words

🤖 Generated with [Claude Code](https://claude.com/claude-code)
