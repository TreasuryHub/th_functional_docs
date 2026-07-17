# File Import (CSV / Excel / PDF)

> **Availability:** `Available` ✅ (CSV, Excel, and PDF with OCR — all live)
> **Where to upload:** **Data › Data Hub** (drop-files zone) for any file; **Upload Statement** for bank statements (on Home, on a [Bank Account](../06-reporting/bank-accounts.md), or the [Bank Statements](../06-reporting/bank-statements.md) screen).
> **Where templates live:** **Settings › Ingestion › Parsing Templates**.
> **Who uses it:** treasury operations, finance team — no IT required.
> **Permissions required:** create/edit on the data you're importing; see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
File import lets anyone on your team bring flat files into Treasury Hub without scripts or custom
spreadsheet mapping. You **upload a file** (from the **Data Hub**, or via **Upload Statement** for
bank statements), Treasury Hub reads it using a **Parsing Template** that maps its columns to Treasury
Hub fields, and the data lands as transactions, balances, or other entities. The first time you import
a new format you set the mapping up once; every import after that from the same source reuses it.

**CSV, Excel, and PDF (with OCR) are all supported.** Reusable column mappings are managed as
**Parsing Templates** under **Settings › Ingestion**.

> There is **no** upload button on the reconciliation screens — files come in through the Data Hub (or
> Upload Statement), get parsed, and then flow into reconciliation automatically.

## Key concepts
- **Parsing Template** — a saved mapping for one source (e.g. "Bank X statement", "ERP Y export") that
  remembers which column means what, so recurring files import automatically. Managed under
  **Settings › Ingestion › Parsing Templates**; if a source changes its format, you edit the template
  instead of starting over.
- **Column mapping** — linking each column in your file to a Treasury Hub field (date, amount,
  reference, counterparty…) and a target entity (movements, balances, invoices).
- **Auto-detection** — on upload, Treasury Hub detects the separator, encoding, and structure and
  suggests a mapping based on column names and previously seen patterns.
- **OCR (optical character recognition)** — reading data out of a PDF or scanned document so it can be
  mapped like any other file.
- **Preview / validation** — a check of the data before it's committed, flagging format errors,
  missing fields, and wrong types.

## Before you start
- Have the file ready and know which entity it represents (movements, balances, invoices, …).
- Confirm you have create/edit rights on that data — see
  [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## How to use it

### Upload a file (Data Hub)
1. Go to **Data › Data Hub**.
2. **Drag your files** into the **drop-files** zone at the top of the screen, or click **Browse
   files** to pick them. Supported formats: **CSV, Excel (XLSX), PDF, TXT**.
3. Treasury Hub reads the file with the matching **Parsing Template** (auto-detecting the layout for a
   new source and proposing a mapping).
4. Review the **preview** — errors, missing fields, and wrong types are flagged — then **confirm** to
   import.
5. Track the result on [Ingestion Activity](ingestion-activity.md).

### Upload a bank statement
1. Use **Upload Statement** — it's on **Home** (top-right), on a specific
   [Bank Account](../06-reporting/bank-accounts.md#upload-a-statement-for-one-account), and on the
   [Bank Statements](../06-reporting/bank-statements.md) screen.
2. Choose the **parser/format** for the file so it's read correctly, then upload and **process** it.
   See [Bank Statements](../06-reporting/bank-statements.md) for the full upload → analyze → process
   flow.

### Create or edit a Parsing Template
1. Go to **Settings › Ingestion › Parsing Templates**.
2. Create a template (or open an existing one) and define the **column mapping** — which column maps to
   which Treasury Hub field and entity.
3. Save it. From then on, files from that source are parsed automatically with this template.

## Configuration
- **Parsing Templates** — one per source, managed under **Settings › Ingestion › Parsing Templates**;
  edit a template when a source's format changes.
- **Automated intake** — for recurring files, prefer an automated channel so no one has to upload by
  hand: [SFTP Ingestion](sftp-ingestion.md) (files dropped on a server) or
  [Email Ingestion](email-ingestion.md) (attachments read from a mailbox).

## Tips & good practices
- Set up a clean **Parsing Template** the first time — every later import from that source reuses it,
  so the effort pays back immediately.
- Always read the **preview** before confirming; it's designed to catch silent data errors before they
  reach your numbers.
- For high-volume, recurring feeds, use [SFTP](sftp-ingestion.md), [Email](email-ingestion.md), or
  [APIs](inbound-apis.md) instead of manual upload.

## Related
- [Data Hub](../03-data/data-hub.md) — the drop-files upload zone.
- [Bank Statements](../06-reporting/bank-statements.md) — the statement upload → process pipeline.
- [SFTP Ingestion](sftp-ingestion.md) and [Email Ingestion](email-ingestion.md) — automate recurring files.
- [Ingestion Activity](ingestion-activity.md) — track imported files and errors.
