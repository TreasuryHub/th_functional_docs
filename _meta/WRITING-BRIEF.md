# Writing Brief — Treasury Hub Client Functional Documentation

You are writing **client-facing functional documentation** for Treasury Hub, a multi-tenant
Treasury Management System (TMS). Readers are **platform users** — treasurers, finance teams, and
administrators — NOT developers. The goal is to help them **understand, use, and configure** the
platform.

## Non-negotiable rules
1. **Audience = users.** Plain, second-person English ("You can…", "To do X…, click…"). No code,
   no API/internals, no architecture. No marketing fluff or hype. Define any term before using it.
2. **Follow the template** in `_meta/TEMPLATE.md` exactly (Overview, Key concepts, Before you start,
   How to use it, Configuration, Tips & good practices, Related). Omit a section only
   if it genuinely doesn't apply.
3. **Every page starts with the header block:**
   `> **Where to find it:** <menu path>` · `> **Who uses it:** …`
   · `> **Permissions required:** …` (see below).
4. **Describe every capability as a present, shipped part of the platform.** Write in plain present
   tense ("the screen shows…", "the assistant builds…"). Do NOT add availability, readiness,
   preview, roadmap, target-quarter or plan/tier badges or notes of any kind, and do not split
   features into live vs. not-yet-built. Product *states* (a payment's status, a reconciliation's
   progress, a user being Active) are a different thing and are documented normally.
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
10. **The AI agent has one name across the whole platform: Alex.** Each module has its own agent,
    but they all present under that single name, so a reader meets one assistant rather than a
    cast. Never list a roster of agents, never give an agent a per-module name or a specialty
    label, and never describe switching between agents. Where a page does not need to name the
    agent at all, prefer "the agent".
11. **Do not edit files outside your assigned output folder.** Only create the files you're told to.

## Reference examples (read these first)
- `_meta/TEMPLATE.md` — the required structure.
- `04-reconciliation/overview.md` — the exemplar page: tone, header block, cross-links, depth.
- `00-getting-started/03-core-concepts.md` — shared concepts to link to, not repeat.

## Permissions reference (for the header block)
Permission modules & 5 levels (NoAccess/Read/CreateEdit/Delete/Admin) are documented in
`00-getting-started/04-roles-and-permissions.md`. Cite the relevant permission module + a sensible
minimum level. If unknown, write "See Roles & Permissions."

## When you finish
Return a short summary: the files you created (paths), any screenshots you flagged, and any place
where the source material was ambiguous or where live-vs-roadmap status needs the Treasury Hub
team to confirm.
