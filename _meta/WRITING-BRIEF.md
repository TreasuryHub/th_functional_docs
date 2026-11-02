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
12. **A new page has to be placed in the reading order.** The docs are meant to be readable
    front to back, so nothing should rely on a concept the reader has not met yet. The order
    is `PAGE_ORDER` in `_meta/build_preview.py`, one list of file names per directory, and it
    drives both the preview's navigation and the order to use in `README.md`. **A page that is
    not listed falls to the end of its section**, which is almost never where it belongs, so
    add it in the right place and mirror it in the README.
    Where a page genuinely has to use a term that a later page owns, link to that page on the
    first mention — a forward reference with a link is fine, a bare one is not.

## Reference examples (read these first)
- `_meta/TEMPLATE.md` — the required structure.
- `04-reconciliation/overview.md` — the exemplar page: tone, header block, cross-links, depth.
- `00-getting-started/03-core-concepts.md` — shared concepts to link to, not repeat.

## Permissions reference (for the header block)
A role is a matrix: one row per **permission module**, with the action columns **Read, Write,
Edit, Delete, Approve**. Behind it each module resolves to one of five **levels** — No Access,
Read, Create/Edit, Delete, Admin — and the level is what the screens are gated on. Both are
documented in `00-getting-started/04-roles-and-permissions.md`, which also carries the full
module catalogue.

Cite the relevant permission module and a sensible minimum level, and link to that page. If you
do not know the module, write "See [Roles & Permissions](...)" rather than guessing one.

## When you finish
1. Place every new page in `PAGE_ORDER` (`_meta/build_preview.py`) and in `README.md`, in the
   same order (rule 12).
2. Rebuild the preview: `python _meta/build_preview.py`. It is a generated file — a change is
   not visible locally until it is rebuilt, and the rebuilt file is committed with the page.
3. Return a short summary: the files you created (paths), any screenshots you flagged, and any
   place where the source material was ambiguous or needs the Treasury Hub team to confirm.
