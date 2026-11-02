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
| `services-panel-overlay.png` | Any screen → **Services** | The Services menu overlay with a section selected, showing both columns. The page that needs it is live with a broken image right now, so this is the single most worthwhile capture on the list. |

## B. Users & Roles — the shipped module has no images

The old `admin-users-grid.png` and `admin-role-permission-matrix.png` showed the static demo console.
Both pages that used them are deleted, so the images are dead (see D) and
[`users-and-roles.md`](../10-admin-console/users-and-roles.md) needs these instead.

| Capture | From | What to show |
|---|---|---|
| `users-roles-user-management.png` | **Admin Console › Users & Roles › User Management** | The user grid with User / Role(s) / Account access / Approval level / Status / Last active, the search and filter toolbar, an invitation row, and a row's actions menu open. |
| `users-roles-permission-matrix.png` | **Admin Console › Users & Roles › Roles & Permissions** | The role list beside the Module × Read/Write/Edit/Delete/Approve matrix, including a dash cell, a changed cell, and the violations block showing a segregation-of-duties message. |
| `users-roles-audit.png` | **Users & Roles › Audit Trail** | Time / Actor / Event / Detail, with one row expanded to its Before and After. |

## C. Recapture — the screen is real but has changed since the image was taken

| File | Screen | What changed |
|---|---|---|
| `top-bar.png` | Any screen | The tenant's own logo now renders in the top bar. |
| `create-payment-form.png` | Payments › New payment | The single-payment form became a multi-line batch composer with an ordering-account picker and payable-instruction list. |
| `payment-blotter.png` | Payments › Payment Blotter | New status tabs, an Import payment files button, and rows that expand into a traceability panel. |
| `ingestion-activity-monitor.png` | Integrations › Ingestion | New tabs (All / Pending review / Worker activity) and the Balance mismatch state — ideally a mismatch row expanded with its ledger and the Actions menu open on the five exits. |
| `reconciliation-matching.png` | Reconciliation › Administration › Matching 1-to-1 | Redesigned: a flow and rule picked, a movement selected on the left, the right pane on "Candidates for …" with score bars and signal chips. |
| `reconciliation-dashboard.png` | Reconciliation › Administration › Dashboard | Single-date dashboard with auto / fully / partially / unreconciled and the volume chart. No savings band. |
| `reconciliation-approvals.png` | Reconciliation › Administration › Reconciliation Approvals | All / Pending / Approved / Rejected / Annulled tabs with selection-based batch approve. No confidence tiles. |
| `reconciliation-movements-flows.png` | Reconciliation › Administration › Reconciliation Status | Chain instances with faceted counts and an expanded chain. |
| `reconciliation-rules-criteria.png` | Settings › Reconciliation › Reconciliation Flows → a flow → Rules | A rule's match criteria with the real operator list. |
| `reconciliation-workflows.png` | Settings › Reconciliation › Reconciliation Flows | The flow list, plus the **Workflow Studio** that New workflow and Edit now open — ideally one capture of the list and one of the Studio's graph view with the agent chat beside it. |

---

# P2 · Modules that shipped without any image

### Ingestion and templates
| Capture | From | What to show |
|---|---|---|
| `ingestion-upload-panel.png` | Integrations › Ingestion › **Upload file** | Three files queued, each row expanded: one with an existing template chosen, one marked **New template** with its Event type, one showing *No template recognises this file*. The capacity meter and **Apply to similar files** visible. |
| `template-workbook-sheets.png` | Settings › Parse Templates | The Workbook sheets table for a workbook of three or more sheets — two switched on, one "Not in the file", a per-sheet layout block expanded. |
| `template-two-pane-layout.png` | Settings › Parse Templates | The preview full width with the configuration panel over it, showing Swap the panes. |
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
| `tagging-rule-editor.png` | Settings › Ingestion › Transaction Tagging › Classification rules | The conditions tree, the selected-transactions panel, and the live preview. |
| `tagging-conflicts-inbox.png` | Settings › Ingestion › Transaction Tagging › Classification conflicts | One conflict card expanded with its sample transactions and decision buttons. |
| `tagging-transaction-panel.png` | Reporting › Transactions | The side panel with the Classification section filled in and the "apply to similar?" prompt. |

### Admin Console
| Capture | From | What to show |
|---|---|---|
| `ai-usage-quota.png` | Admin Console › AI usage | The monthly token quota panel: bar, remaining, reset date, "You today". |
| `ai-usage-breakdowns.png` | Admin Console › AI usage | The KPI tiles with tokens-per-day and by-module side by side. |
| `payment-approval-rules-list.png` | Admin Console › Master Data › Payment Approval Rules | The rule list with the signing-levels strip, scope chips and an exemption badge. |
| `payment-approval-rule-dialog.png` | Admin Console › Master Data › Payment Approval Rules | The new-rule dialog: the scope cascade with lower levels locked, and the exemption note. |

### Payments
| Capture | From | What to show |
|---|---|---|
| `payment-blotter-awaiting-approval.png` | Payments › Payment Blotter › **Awaiting approval** | The tab with a row expanded to its traceability panel showing "Awaiting signature 1 of 2", and the Approve/Reject row actions visible. |
| `payment-approve-dialog.png` | Payments › Payment Blotter | The reject dialog with the required Reason field, confirm disabled until it is filled. |

### Reconciliation
| Capture | From | What to show |
|---|---|---|
| `reconciliation-conciliations.png` | Reconciliation › Administration › Conciliations | The workflow / chain / rule cascade, field filters and the Difference column. |
| `reconciliation-conciliation-reporting.png` | Reconciliation › Reporting › Conciliation Reporting | The Conciliated tab with the week navigator, filter bar and Export week. |
| `reconciliation-fee-report.png` | Reconciliation › Reporting › Fee Report | Fees by contract with the per-currency totals banner and one row expanded to its per-concept detail. |

### Reporting
| Capture | From | What to show |
|---|---|---|
| `balance-differential-grid.png` | Reporting › Cash & Liquidity › Balance Differential | The toolbar (both dates, Convert To, the exchange-rate pair, the three multi-selects, Export), the three header groups, a sticky Total row and an N/A row. |
| `category-positions-grid.png` | Reporting › Cash & Liquidity › Category Positions | One nature expanded to tag level with the refresh note visible. |
| `datalake-cash-position.png` | Reporting › Datalake › Cash position | The per-currency cards, the company/currency chart and the account table, ideally including a "No currency" card. |
| `datalake-account-statement.png` | Reporting › Datalake › Account statement | The summary bar (opening balance and its date, credits, debits, closing) with the paging counter. |

### Home and Data
| Capture | From | What to show |
|---|---|---|
| `status-board-roadmap.png` | Status board | The three panes with one workstream expanded to its milestone rows. |
| `status-board-tickets.png` | Status board | The Open tickets pane with one overdue counter. |
| `financial-events-breakdown.png` | Data › Financial Events | A PSP_SETTLEMENT event's detail panel with its amount breakdown table and movement date. |

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

## D. Safe to delete — unreferenced, and the screen no longer exists

All nine are dead: no visible page references them.

| File | Why |
|---|---|
| `admin-users-grid.png` | Showed the demo console; its page is deleted. Superseded by `users-roles-user-management.png`. |
| `admin-role-permission-matrix.png` | Showed the demo console's 27-role catalogue; superseded by `users-roles-permission-matrix.png`. |
| `admin-matching-rules.png` | Matching rules were switched off; the menu entry is gone. |
| `gl-postings-grid.png` | G/L posting was switched off; the menu entry is gone. |
| `reconciliation-erp-posting.png` | Reconciliation never had ERP posting, and the G/L side it relied on is off. |
| `sidebar-main-menu.png` | There is no left sidebar; superseded by `services-panel-overlay.png`. |
| `cash-position-drilldown.png` | The Reporting › Cash Position screen is gone; the position lives on Home. |
| `reporting-gallery.png` | There is no reports gallery; each report is its own menu entry. |
| `payment-approvals.png` | Showed the demo Payment Approvals workspace; approving happens on the blotter. |

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
