# Screenshots — Capture Checklist

Rebuilt 2026-11-01 against the shipped navigation. Work top-down: group A first (the docs currently
show a mocked-up screen where a real one now exists), then B, then C.

## How to capture (please read once)
- **Use the demo tenant** (e.g. "TH Demo" / GBG) so no real client data is shown.
- **Switch the platform to English** (top-bar language toggle) so screenshots match these English docs.
- **Pick one theme and stay consistent** — light theme is recommended for legibility in the docs.
- **Consistent width** — capture the browser around ~1400px wide; crop to the relevant panel/screen,
  not the whole OS window.
- **Format & name** — save as **PNG** with the exact filename shown. Lowercase, hyphenated.
- **In-Preview screens** are visible in the platform as previews (shown "Upgrade") — you can still
  capture them; they'll show preview/sample data. Prioritize the **Live** ones if you want a
  truthful current-state help center first.

After adding files, run `python _meta/build_preview.py` and refresh `preview.html`. Check progress
any time with `python _meta/check_screenshots.py`.
- **Set the tenant's logo** before capturing. The platform now renders it in the top bar, so a fresh
  capture carries it automatically — the logo in the current images was composited in afterwards.

---

## A. Users & Roles — the module has no images at all

The old `admin-users-grid.png` and `admin-role-permission-matrix.png` showed the static demo
console. Both pages that used them are deleted, so those images are unreferenced and can go;
[`users-and-roles.md`](../10-admin-console/users-and-roles.md) needs these two captures instead.

| Capture | Capture it from | What to show |
|---|---|---|
| `users-roles-user-management.png` | **Admin Console › Users & Roles › User Management** | The user grid with User / Role(s) / Account access / Approval level / Status / Last active, the search and filter toolbar, an invitation row, and a row's actions menu open. |
| `users-roles-permission-matrix.png` | **Admin Console › Users & Roles › Roles & Permissions** | The role list beside the Module × Read/Write/Edit/Delete/Approve matrix, including a dash cell, a changed cell, and the violations block showing a segregation-of-duties message. |

## B. Recapture — the screen is real but has changed since the image was taken

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
| `reconciliation-workflows.png` | Settings › Reconciliation › Reconciliation Flows | The flow list, with filter groups reachable from a flow. |

## C. New — pages that have no image at all

### Admin Console
| File | Screen | What to show |
|---|---|---|
| `users-roles-audit.png` | Users & Roles › Audit Trail | Time / Actor / Event / Detail with one row expanded to its Before and After. |
| `ai-usage-quota.png` | Admin Console › AI usage | The monthly token quota panel: bar, remaining, reset date, "You today". |
| `ai-usage-breakdowns.png` | Admin Console › AI usage | The KPI tiles with tokens-per-day and by-module side by side. |
| `payment-approval-rules-list.png` | Admin Console › Master Data › Payment Approval Rules | The rule list with the signing-levels strip, scope chips and an exemption badge. |
| `payment-approval-rule-dialog.png` | Admin Console › Master Data › Payment Approval Rules | The new-rule dialog: the scope cascade with lower levels locked, and the exemption note. |

### Home
| File | Screen | What to show |
|---|---|---|
| `status-board-roadmap.png` | Status board | The three panes with one workstream expanded to its milestone rows. |
| `status-board-tickets.png` | Status board | The Open tickets pane with one overdue counter. |

### Ingestion and templates
| File | Screen | What to show |
|---|---|---|
| `template-workbook-sheets.png` | Settings › Parse Templates | The Workbook sheets table for a workbook of three or more sheets — two switched on, one "Not in the file", a per-sheet layout block expanded. |
| `template-two-pane-layout.png` | Settings › Parse Templates | The preview full width with the configuration panel over it, showing Swap the panes. |
| `template-account-balance-card.png` | Settings › Parse Templates | The Account balance card in a preview: per-field Source and Value in the sample, with a doesn't-add-up badge and Go to row. |
| `template-sibling-format.png` | Integrations › Ingestion | The sibling-template card on a parked .xls file — "Same sheet layout as this file" with Use this template. |
| `balance-adjust-dialog.png` | Integrations › Ingestion | The Adjust balance manually dialog: editable grid, a field marked Adjusted, the live "it adds up" line and the Reason field. |
| `ai-draft-review-editor.png` | Settings › Parse Templates | An AI draft open in the editor: the summary card, the section rail with counters, a field with a missing-value outline and a "Changed by you" tag. |
| `ai-draft-action-bar.png` | Settings › Parse Templates | The bottom bar — Discard proposal, Save draft, Save template, Save template and load file — with the reasons line. |
| `ingestion-upload-panel.png` | Integrations › Ingestion › Upload file | Three files queued, each row expanded: one with an existing template chosen, one marked **New template** with its Event type, one showing *No template recognises this file*. The capacity meter and **Apply to similar files** visible. |
| `ai-extraction-dialog.png` | Integrations › Ingestion | The **Extract movements with AI** dialog: pages, estimated token usage with its upper figure, and the time estimate. |
| `ai-extraction-review.png` | Integrations › Ingestion › Review extraction | The review on the **Result** tab: the Statement data header reading *n read · the PDF has ≈ m*, and rows carrying incidents. |
| `ai-extraction-side-by-side.png` | Integrations › Ingestion › Review extraction | The **Original file** tab with a movement selected and its lines highlighted on the PDF page beside the table. |
| `sftp-connection-logs.png` | Integrations › SFTP ingestion › Logs | The Files checked column and a sweep-summary message. |

### Transaction tagging
| File | Screen | What to show |
|---|---|---|
| `tagging-rule-editor.png` | Settings › Ingestion › Transaction Tagging › Classification rules | The conditions tree, the selected-transactions panel, and the live preview. |
| `tagging-conflicts-inbox.png` | Settings › Ingestion › Transaction Tagging › Classification conflicts | One conflict card expanded with its sample transactions and decision buttons. |
| `tagging-transaction-panel.png` | Reporting › Transactions | The side panel with the Classification section filled in and the "apply to similar?" prompt. |

### Reporting
| File | Screen | What to show |
|---|---|---|
| `balance-differential-grid.png` | Reporting › Cash & Liquidity › Balance Differential | The toolbar (both dates, Convert To, the exchange-rate pair, the three multi-selects, Export), the three header groups, a sticky Total row and an N/A row. |
| `category-positions-grid.png` | Reporting › Cash & Liquidity › Category Positions | One nature expanded to tag level with the refresh note visible. |
| `datalake-cash-position.png` | Reporting › Datalake › Cash position | The per-currency cards, the company/currency chart and the account table, ideally including a "No currency" card. |
| `datalake-account-statement.png` | Reporting › Datalake › Account statement | The summary bar (opening balance and its date, credits, debits, closing) with the paging counter. |

### Reconciliation
| File | Screen | What to show |
|---|---|---|
| `reconciliation-conciliations.png` | Reconciliation › Administration › Conciliations | The workflow / chain / rule cascade, field filters and the Difference column. |
| `reconciliation-conciliation-reporting.png` | Reconciliation › Reporting › Conciliation Reporting | The Conciliated tab with the week navigator, filter bar and Export week. |
| `reconciliation-fee-report.png` | Reconciliation › Reporting › Fee Report | Fees by contract with the per-currency totals banner and one row expanded to its per-concept detail. |

### Data
| File | Screen | What to show |
|---|---|---|
| `payment-blotter-awaiting-approval.png` | Payments › Payment Blotter › Awaiting approval | The tab with a row expanded to its traceability panel showing "Awaiting signature 1 of 2", and the Approve/Reject row actions visible. |
| `payment-approve-dialog.png` | Payments › Payment Blotter | The reject dialog with the required Reason field, confirm disabled until it is filled. |
| `financial-events-breakdown.png` | Data › Financial Events | A PSP_SETTLEMENT event's detail panel with its amount breakdown table and movement date. |

### Navigation
| File | Screen | What to show |
|---|---|---|
| `services-panel-overlay.png` | Any screen | The Services menu overlay with a section selected. Replaces the obsolete `sidebar-main-menu.png` — the app has a top bar, not a left sidebar. |

---

## D. Safe to delete — unreferenced, and the screen no longer exists

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

## E. Leave as they are — the image correctly shows a demo screen that is still a demo

`audit-trail-timeline.png`, `integration-status-board.png`. Their pages are on the TBD list in
[`MOCK-PAGES-TBD.md`](MOCK-PAGES-TBD.md); recapturing them would not make them real.

`data-hub-overview.png` and `data-repository-grid.png` stay with their pages, which are hidden
rather than deleted. Delete them only if those pages go.

## F. Deliberately without images

[`06-reporting/build-your-own.md`](../06-reporting/build-your-own.md) is written from the Report
Builder POC in [`assets/ReportBuilder-2026-10-14/`](../assets/ReportBuilder-2026-10-14/ReportBuilder/README.md),
not from the shipped `/reporting/builder` screen, which is still demo. Capturing either would be
misleading — the POC is a prototype and the shipped screen is not what the page describes. Add
captures once the module ships for real.
