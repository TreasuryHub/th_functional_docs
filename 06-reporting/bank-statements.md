# Bank Statements

> **Availability:** `Available` ✅
> **Where to find it:** Reporting › Operations › Bank Statements (admin-level statement management; per-account upload also lives on [Bank Accounts](bank-accounts.md)).
> **Who uses it:** treasury operations, finance teams, administrators.
> **Permissions required:** `CashManagement.CashPosition.BankStatements` · Read to view and download; CreateEdit to upload and process; Delete to remove statements (and their transactions). See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Bank Statements is where statement files become transactions. You upload a statement (choosing the
right format), the platform **validates** and **analyzes** it, flags any problems, and — once it's
clean — **processes** it into the movements that appear across the rest of the platform. It's the
admin-level home for statement management: uploading, checking, processing, downloading, and
deleting statements, plus downloading blank templates for supported formats.

## Key concepts
- **Parser / format** — the statement format the file is in (e.g. MT940, CAMT.053, and other
  supported formats). You pick the parser when you upload so the file is read correctly.
- **Upload → Analyze → Process** — the three stages of the pipeline: the file is uploaded, analyzed
  and validated (with any errors surfaced), then processed to create transactions.
- **Validation summary** — the report shown after analysis, listing what's fine and what's wrong
  before you commit.
- **Template** — a blank file in a given format you can download as a starting point for a manual or
  bulk statement.

## Validation checks
Before a statement is processed, common issues are flagged, including:

- **Bank statement already exists** — a duplicate upload.
- **Statement number two or more ahead/behind** — a gap or out-of-sequence statement.
- **Statement currency does not match account currency** — wrong account or wrong file.
- **Opening/closing balances do not match** — continuity break with the previous statement.
- Analysis errors are marked with `*` indicators so you can see exactly where the problem is.

## Before you start
- The [account](bank-accounts.md) the statement belongs to must exist.
- You need `CashManagement.CashPosition.BankStatements` at **CreateEdit** to upload and process.
- Know your statement's **format** so you can pick the right parser.

## How to use it

### Upload and process a statement
1. Open **Bank Statements** and click **Upload**.
2. **Drag and drop** the file (or browse to it) and select the correct **parser/format**.
3. The platform **analyzes** the file and shows a **validation summary**. Review any errors (see the
   checks above).
4. If the summary is clean, **Process** the statement. Transactions are created and the account's
   balance updates.
5. If there are errors, correct the source file (or the account/format) and re-upload.

### Download a template
1. Choose the **format** you need.
2. Click **Download template** to get a blank file in that format to fill in.

### Find, download, or delete a statement
1. Use the grid's filters and sort to find a statement (by account, format, institution, uploaded
   date, or status).
2. Click **Download** to retrieve the original file exactly as received.
3. To remove one, use **Delete** — note this also removes the transactions created from it, so
   confirm the warning.

### Export the statement list
1. Click **Export** and choose **Excel** or **CSV** for the current, filtered list.

## Tips & good practices
- Always read the **validation summary** before processing — catching a duplicate or a balance break
  here prevents downstream reconciliation and position errors.
- If balances don't match, check the **previous** statement's closing balance first; the break is
  usually a missing statement in the sequence.
- Use the per-account **Upload Statement** action on [Bank Accounts](bank-accounts.md) for one-off,
  account-specific uploads; use this page for bulk and admin-level management.
- Deleting a statement deletes its transactions — download the original first if you might need it.

## Related
- [Bank Accounts](bank-accounts.md) — where balances land and per-account upload lives.
- [Transactions](transactions.md) — the movements created from statements.
- [Data Repository](../03-data/data-repository.md) — every stored statement file, searchable and
  downloadable.
- [Reconciliation](../04-reconciliation/overview.md) — matching statement movements to your records.
- [Integrations](../02-integrations/overview.md) — automatic statement feeds (SWIFT, Open Banking).
