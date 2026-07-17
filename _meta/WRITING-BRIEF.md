# Writing Brief — Treasury Hub Client Functional Documentation

You are writing **client-facing functional documentation** for Treasury Hub, a multi-tenant
Treasury Management System (TMS). Readers are **platform users** — treasurers, finance teams, and
administrators — NOT developers. The goal is to help them **understand, use, and configure** the
platform.

## Non-negotiable rules
1. **Audience = users.** Plain, second-person English ("You can…", "To do X…, click…"). No code,
   no API/internals, no architecture. No marketing fluff or hype. Define any term before using it.
2. **Follow the template** in `_meta/TEMPLATE.md` exactly (Overview, Key concepts, Before you start,
   How to use it, Configuration, Tips & good practices, Related, In Preview). Omit a section only
   if it genuinely doesn't apply.
3. **Every page starts with the badge block:**
   `> **Availability:** <badge>` · `> **Where to find it:** <menu path>` · `> **Who uses it:** …`
   · `> **Permissions required:** …` (see below).
4. **Availability badges** — use only `Available` ✅ or `In Preview` 👁️ (Qx 20XX). Definitions:
   `Available` = live and generally available; `In Preview` = **being tested, available on request**
   (users contact Treasury Hub to enable it). Get the correct status from
   `_drafts/feature-availability.md`. For an `In Preview` page, add a short banner right
   after the badge block: `> 👁️ **In Preview.** This <screen/module> is in testing and available on
   request — contact Treasury Hub to enable it. This page describes how it works.` **Plan/tier is a
   separate dimension:** if a module is premium, add a `> **Plan:** Premium (Upgrade)` line — "Upgrade"
   means a premium plan and says nothing about readiness (e.g. Reconciliation is Premium *and*
   Available). Do NOT use the old `Add-on 🔓` badge, and do NOT tie "Upgrade" to whether something is live.
5. **"How to use it" must be concrete, numbered steps** that name real UI elements (buttons, tabs,
   menu paths). The live navigation menu and screen names are in
   `00-getting-started/02-navigation-and-workspace.md` and the source slides.
6. **Cross-link** with relative Markdown links to related docs (see the exemplar). Link to Getting
   Started pages for shared concepts rather than re-explaining them.
7. **Screenshots:** where a screenshot would help, insert `![descriptive alt](../assets/screenshots/<kebab-name>.png)`
   and append a line to `_meta/SCREENSHOTS-NEEDED.md` describing exactly what screen to capture. Do
   not invent image files.
8. **Ground everything in the provided source files.** The product-thinking slides describe the
   intended UI and demo screens; the webapp `docs/` describe what's actually built. Where the demo
   slides show illustrative numbers (KPIs, counterparties like BBVA/Stripe), treat them as
   *examples* — describe the capability, don't hard-code demo figures as if they're the user's data.
9. **Tone & length:** clear and complete but not padded. A screen page is typically 60–150 lines.
10. **Do not edit files outside your assigned output folder.** Only create the files you're told to.

## Reference examples (read these first)
- `_meta/TEMPLATE.md` — the required structure.
- `04-reconciliation/overview.md` — the exemplar page: tone, badge block, cross-links, depth.
- `00-getting-started/03-core-concepts.md` — shared concepts to link to, not repeat.
- `_drafts/feature-availability.md` — authoritative live/roadmap status.

## Permissions reference (for the badge block)
Permission modules & 5 levels (NoAccess/Read/CreateEdit/Delete/Admin) are documented in
`00-getting-started/04-roles-and-permissions.md`. Cite the relevant permission module + a sensible
minimum level. If unknown, write "See Roles & Permissions."

## When you finish
Return a short summary: the files you created (paths), any screenshots you flagged, and any place
where the source material was ambiguous or where live-vs-roadmap status needs the Treasury Hub
team to confirm.
