# Screenshots — Capture Checklist

Rebuilt 2026-11-02 against the merged docs (82 pages). **16 images are in use, 9 are dead, and
67 pages carry no image at all.**

Work down the priorities: **P1** fixes what is wrong or broken today, **P2** covers the modules that
shipped without any image, **P3** is worth having but nothing is misleading without it.

Progress at any time: `python _meta/check_screenshots.py`. After adding files, rebuild the preview
with `python _meta/build_preview.py` and commit the rebuilt `preview.html` with them.

## How to capture (please read once)
- **Use the demo tenant** (e.g. "TH Demo" / GBG) so no real client data is shown.
- **Set the tenant's logo first.** The platform renders it in the top bar, so a fresh capture carries
  it automatically — the logo in the existing images was composited in afterwards.
- **Switch the platform to English** (top-bar language toggle) so captures match these English docs.
- **Light theme**, for legibility in the docs.
- **~1400px browser width.** Crop to the panel or screen, not the whole OS window.
- **PNG, the exact filename given.** Lowercase, hyphenated.
- **Turn "Active only" off** in the Services menu if a screen seems to be missing — it hides every
  screen that runs on demo data. Leave it off while capturing, or the menu in your shots will differ
  from the one the docs describe.
- **Demo screens:** a screen that runs on demo data still captures fine, but anything on the list in
  [`MOCK-PAGES-TBD.md`](MOCK-PAGES-TBD.md) is awaiting a decision — don't spend time on those yet.

---

# P1 · Fix what is wrong today

## A. One page shows a broken image

| Capture | From | What to show |
|---|---|---|
| DONE `services-panel-overlay.png` | Any screen → **Services** | The Services menu overlay with a section selected, showing both columns. The page that needs it is live with a broken image right now, so this is the single most worthwhile capture on the list. |

## B. Users & Roles — the shipped module has no images

The old `admin-users-grid.png` and `admin-role-permission-matrix.png` showed the static demo console.
Both pages that used them are deleted, so the images are dead (see D) and
[`users-and-roles.md`](../10-admin-console/users-and-roles.md) needs these instead.

| Capture | From | What to show |
|---|---|---|
| DONE `users-roles-user-management.png` | **Admin Console › Users & Roles › User Management** | The user grid with User / Role(s) / Account access / Approval level / Status / Last active, the search and filter toolbar, an invitation row, and a row's actions menu open. |
| DONE `users-roles-permission-matrix.png` | **Admin Console › Users & Roles › Roles & Permissions** | The role list beside the Module × Read/Write/Edit/Delete/Approve matrix, including a dash cell, a changed cell, and the violations block showing a segregation-of-duties message. |
| DONE `users-roles-audit.png` | **Users & Roles › Audit Trail** | Time / Actor / Event / Detail, with one row expanded to its Before and After. |

## C. Recapture — the screen is real but has changed since the image was taken

| File | Screen | What changed |
|---|---|---|
| DONE `top-bar.png` | Any screen | The tenant's own logo now renders in the top bar. |
| DONE `create-payment-form.png` | Payments › New payment | The single-payment form became a multi-line batch composer with an ordering-account picker and payable-instruction list. |
| DONE `payment-blotter.png` | Payments › Payment Blotter | New status tabs, an Import payment files button, and rows that expand into a traceability panel. |
| DONE `ingestion-activity-monitor.png` | Integrations › Ingestion | New tabs (All / Pending review / Worker activity) and the Balance mismatch state — ideally a mismatch row expanded with its ledger and the Actions menu open on the five exits. |
| DONE `reconciliation-matching.png` | Reconciliation › Administration › Matching 1-to-1 | Redesigned: a flow and rule picked, a movement selected on the left, the right pane on "Candidates for …" with score bars and signal chips. |
| DONE `reconciliation-dashboard.png` | Reconciliation › Administration › Dashboard | Single-date dashboard with auto / fully / partially / unreconciled and the volume chart. No savings band. |
| DONE `reconciliation-approvals.png` | Reconciliation › Administration › Reconciliation Approvals | All / Pending / Approved / Rejected / Annulled tabs with selection-based batch approve. No confidence tiles. |
| DONE `reconciliation-movements-flows.png` | Reconciliation › Administration › Reconciliation Status | Chain instances with faceted counts and an expanded chain. |
| DONE `reconciliation-rules-criteria.png` | Settings › Reconciliation › Reconciliation Flows → a flow → Rules | A rule's match criteria with the real operator list. |
| DONE `reconciliation-workflows.png` | Settings › Reconciliation › Reconciliation Flows | The flow list, plus the **Workflow Studio** that New workflow and Edit now open — ideally one capture of the list and one of the Studio's graph view with the agent chat beside it. |

---

# P2 · Modules that shipped without any image

### Ingestion and templates
| Capture | From | What to show |
|---|---|---|
| `ingestion-upload-panel.png` | Integrations › Ingestion › **Upload file** | Three files queued, each row expanded: one with an existing template chosen, one marked **New template** with its Event type, one showing *No template recognises this file*. The capacity meter and **Apply to similar files** visible. |
| `template-workbook-sheets.png` | Settings › Parse Templates | The Workbook sheets table for a workbook of three or more sheets — two switched on, one "Not in the file", a per-sheet layout block expanded. |
| DONE `template-two-pane-layout.png` | Settings › Parse Templates | The preview full width with the configuration panel over it, showing Swap the panes. |
| `template-account-balance-card.png` | Settings › Parse Templates | The Account balance card in a preview: per-field Source and Value in the sample, with a doesn't-add-up badge and Go to row. |
| `template-sibling-format.png` | Integrations › Ingestion | The sibling-template card on a parked .xls file — "Same sheet layout as this file" with Use this template. |
| `balance-adjust-dialog.png` | Integrations › Ingestion | The Adjust balance manually dialog: editable grid, a field marked Adjusted, the live "it adds up" line and the Reason field. |
| `ai-draft-review-editor.png` | Settings › Parse Templates | An AI draft open in the editor: the summary card, the section rail with counters, a field with a missing-value outline and a "Changed by you" tag. |
| `ai-draft-action-bar.png` | Settings › Parse Templates | The bottom bar — Discard proposal, Save draft, Save template, Save template and load file — with the reasons line. |
| `sftp-connection-logs.png` | Integrations › SFTP ingestion › Logs | The Files checked column and a sweep-summary message. |

### AI extraction
Its two entry points matter more than the review itself: the page's whole point is that it is a
**fallback**, so a capture of where it is offered is worth more than a pretty result.

| Capture | From | What to show |
|---|---|---|
| `ai-extraction-offered.png` | Integrations › Ingestion | A parked row expanded, showing *why it was not recognised* next to the template picker and the **Extract the movements with AI** block beside it. Best of all if the reason reads "some templates match only in part". |
| `ai-extraction-failed-draft.png` | Settings › Parse Templates → a failed draft | The failed-draft banner offering **Or extract the movements with AI** alongside Retry, Complete by hand and Choose an existing template. |
| `ai-extraction-dialog.png` | Integrations › Ingestion | The **Extract movements with AI** dialog: pages, estimated token usage with its upper figure, and the time estimate. |
| `ai-extraction-review.png` | Integrations › Ingestion › Review extraction | The **Result** tab: the Statement data header reading *n read · the PDF has ≈ m*, and rows carrying incidents. |
| `ai-extraction-side-by-side.png` | Integrations › Ingestion › Review extraction | The **Original file** tab with a movement selected and its lines highlighted on the PDF page beside the table. |

### Transaction tagging
| Capture | From | What to show |
|---|---|---|
| DONE `tagging-rule-editor.png` | Settings › Ingestion › Transaction Tagging › Classification rules | The conditions tree, the selected-transactions panel, and the live preview. |
| DONE `tagging-conflicts-inbox.png` | Settings › Ingestion › Transaction Tagging › Classification conflicts | One conflict card expanded with its sample transactions and decision buttons. |
| `tagging-transaction-panel.png` | Reporting › Transactions | The side panel with the Classification section filled in and the "apply to similar?" prompt. |

### Admin Console
| Capture | From | What to show |
|---|---|---|
| DONE `ai-usage-quota.png` | Admin Console › AI usage | The monthly token quota panel: bar, remaining, reset date, "You today". |
| DONE `ai-usage-breakdowns.png` | Admin Console › AI usage | The KPI tiles with tokens-per-day and by-module side by side. |
| DONE `payment-approval-rules-list.png` | Admin Console › Master Data › Payment Approval Rules | The rule list with the signing-levels strip, scope chips and an exemption badge. |
| DONE `payment-approval-rule-dialog.png` | Admin Console › Master Data › Payment Approval Rules | The new-rule dialog: the scope cascade with lower levels locked, and the exemption note. |

### Payments
| Capture | From | What to show |
|---|---|---|
| `payment-blotter-awaiting-approval.png` | Payments › Payment Blotter › **Awaiting approval** | The tab with a row expanded to its traceability panel showing "Awaiting signature 1 of 2", and the Approve/Reject row actions visible. |
| `payment-approve-dialog.png` | Payments › Payment Blotter | The reject dialog with the required Reason field, confirm disabled until it is filled. |

### Reconciliation
| Capture | From | What to show |
|---|---|---|
| DONE `reconciliation-conciliations.png` | Reconciliation › Administration › Conciliations | The workflow / chain / rule cascade, field filters and the Difference column. |
| DONE `reconciliation-conciliation-reporting.png` | Reconciliation › Reporting › Conciliation Reporting | The Conciliated tab with the week navigator, filter bar and Export week. |
| DONE `reconciliation-fee-report.png` | Reconciliation › Reporting › Fee Report | Fees by contract with the per-currency totals banner and one row expanded to its per-concept detail. |

### Reporting
| Capture | From | What to show |
|---|---|---|
| DONE `balance-differential-grid.png` | Reporting › Cash & Liquidity › Balance Differential | The toolbar (both dates, Convert To, the exchange-rate pair, the three multi-selects, Export), the three header groups, a sticky Total row and an N/A row. |
| DONE `category-positions-grid.png` | Reporting › Cash & Liquidity › Category Positions | One nature expanded to tag level with the refresh note visible. |
| `datalake-cash-position.png` | Reporting › Datalake › Cash position | The per-currency cards, the company/currency chart and the account table, ideally including a "No currency" card. |
| `datalake-account-statement.png` | Reporting › Datalake › Account statement | The summary bar (opening balance and its date, credits, debits, closing) with the paging counter. |

### Home and Data
| Capture | From | What to show |
|---|---|---|
| DONE `status-board-roadmap.png` | Status board | The three panes with one workstream expanded to its milestone rows. |
| `status-board-tickets.png` | Status board | The Open tickets pane with one overdue counter. |
| DONE `financial-events-breakdown.png` | Data › Financial Events | A PSP_SETTLEMENT event's detail panel with its amount breakdown table and movement date. |

---

# P3 · Live screens that would benefit

Nothing here is wrong without an image — these pages simply describe a real screen in words only.

| Capture | From | What to show |
|---|---|---|
| `bank-accounts-grid.png` | Admin Console › Master Data › Bank Accounts | The account list with a row's actions menu open, including Upload statement and Update balance. |
| `bank-statements-grid.png` | Reporting › Operations › Bank Statements | The statement list with its filters and a row expanded. |
| `transactions-grid.png` | Reporting › Operations › Transactions | The grid with the last-week default, the Account ID/Number filters and the column chooser. |
| `exchange-rates-grid.png` | Reporting › Operations › Exchange Rates | The rate list for a currency pair over a date range. |
| `companies-and-groups.png` | Admin Console › Master Data › Companies | The company list with its group, and the default-company marker. |
| `counterparties-ssis.png` | Admin Console › Master Data › Counterparties | A counterparty with its settlement instructions and an approval state visible. |
| `tags-list.png` | Settings › Ingestion › Transaction Tagging › Tags | The tag list with its categories. |
| `access-tokens.png` | Admin Console › Access Tokens | The token list with a scope and an expiry, and the create dialog's one-time-secret notice. |
| `data-exports.png` | Data › Data Exports | The export list or the API-key panel, whichever carries more of the page. |
| `email-ingestion-mailboxes.png` | Integrations › Email Ingestion | A mailbox expanded to its assignment rules and its log tab. |
| `datalake-cash-flow.png` | Reporting › Datalake › Cash flow | The chart and table for a period. |
| `datalake-opening-closing.png` | Reporting › Datalake › Opening vs closing balance | The per-account comparison with its variation column. |
| `workflow-studio-chat.png` | Settings › Reconciliation › Reconciliation Flows → New workflow | The Studio with the agent chat beside the graph, mid-conversation — the clearest single image of how the AI layer is actually used. |

---

## G. The stand-in names used in the screenshots

Eight captures were taken on a tenant holding live data, so the identifying fields were rewritten
in place on 2026-11-03. **Reuse these names in any future edit or recapture**, or the docs end up
showing two different fictional worlds.

- **Entities:** Astra, Nordia (and *Nordia do Brasil*)
- **Partners / providers:** Veritas, Lumen Pay (lPAY / LPAY), Corriente, Brightwell,
  Mercado Uno (Mercado / mercadouno), Correo Pay (correopay)
- **Contract codes:** `VERITAS-ASTRA`, `CORRIENTE-NORDIA`, `LPAY-NORDIA`, `MUNO-ASTRA-A`,
  `CORREO-NORDIA`, and the same pattern for the rest
- **External-id prefix:** `CPAY-`, kept to four characters so the line wraps where it did before
- **People:** `p.navarro@astra.example`, `e.varga@nordia.example`, `a.ruiz@nordia.example`,
  `l.herrera@nordia.example`, `t.okafor@astra.example`, `demo-user@astra.example`, with display
  names Luis Herrera, Elena Varga and Astra Demo

Edited: `reconciliation-fee-report`, `users-roles-user-management`, `users-roles-audit`,
`ingestion-activity-monitor`, `financial-events-breakdown`, `status-board-roadmap`,
`ai-usage-breakdowns`, and `services-panel-overlay` (its three plan badges painted out).

Amounts were left alone. The names were the disclosure risk; the figures mean nothing once
detached from them, and rewriting them would mean rebuilding the totals banners to stay
consistent.

The editing tool is not in this repo. It matches the UI font and the mono columns, renders with
subpixel anti-aliasing so a patch does not read as greyscale beside untouched text, and aligns on
the ink top rather than a guessed baseline. Ask for it again if more captures need it.

## H. Captured, but showing an empty screen

These are in the docs and fine to keep. They were taken where the screen had nothing in it, so
they show the empty state rather than what the page describes. Worth retaking once the demo
tenant has data in them.

| File | Shows | Should show |
|---|---|---|
| `reconciliation-matching.png` | *Select a flow and a rule to load movements* | a movement picked, with ranked candidates, score bars and signal chips |
| `reconciliation-approvals.png` | an empty grid | pending requests across the status tabs |
| `tagging-conflicts-inbox.png` | *No conflicts. Every rule agrees with the others* | a conflict expanded to its sample transactions |
| `create-payment-form.png` | *No account can order a payment yet* | the batch composer with an ordering account and payable lines |
| `category-positions-grid.png` | every figure zero, all Unclassified | a nature expanded to tag level with real movement |
| `template-two-pane-layout.png` | *Attach a file to preview how this template parses it* | a parsed sample beside the configuration |

## D. Deleted

The nine images whose screens no longer exist were removed on 2026-11-03: the two that showed the
static demo admin console, superseded by the Users & Roles captures, plus `admin-matching-rules`,
`gl-postings-grid`, `reconciliation-erp-posting`, `sidebar-main-menu`, `cash-position-drilldown`,
`reporting-gallery` and `payment-approvals`. Each was verified unreferenced before removal.

## E. Leave as they are

`audit-trail-timeline.png` and `integration-status-board.png` show demo screens whose pages are on
the TBD list in [`MOCK-PAGES-TBD.md`](MOCK-PAGES-TBD.md); recapturing them would not make them real.

`data-hub-overview.png` and `data-repository-grid.png` belong to pages that are hidden rather than
deleted. Delete them only if those pages go.

## F. Deliberately without images

[`06-reporting/build-your-own.md`](../06-reporting/build-your-own.md) is written from the Report
Builder POC in [`assets/ReportBuilder-2026-10-14/`](../assets/ReportBuilder-2026-10-14/ReportBuilder/README.md),
not from the shipped `/reporting/builder` screen, which is demo. Capturing either would mislead —
the POC is a prototype and the shipped screen is not what the page describes. Add captures once the
module ships for real.
