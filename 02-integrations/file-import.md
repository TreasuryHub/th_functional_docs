# File Import (CSV / Excel / PDF)

> **Load any bank or ERP file without IT or custom scripts**
>
> **Why it matters**
> - **Set it up once**: the first file of a new format needs a template; every file after that reuses it.
> - **The formats you actually get**: CSV, TXT, TSV, Excel and PDF, uploaded straight from your desk.
> - **Straight into the platform**: rows land as transactions and balances, ready for reconciliation and reporting.

> **Where to upload:** **Integrations › Ingestion** (**Upload file**) for any file; **Upload Statement** for bank statements (on Home, on a [Bank Account](../06-reporting/bank-accounts.md), or the [Bank Statements](../06-reporting/bank-statements.md) screen).
> **Where templates live:** **Settings › Ingestion › Parse Templates**.
> **Who uses it:** treasury operations, finance team — no IT required.
> **Permissions required:** create/edit on the data you're importing; see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

> **In 60 seconds**
> 1. [Upload a file](#upload-a-file), or [upload a bank statement](#upload-a-bank-statement) if that is what you have.
> 2. [Create or edit a Parsing Template](#create-or-edit-a-parsing-template) the first time you see a format.
> 3. [Read the outcome of an upload](#read-the-outcome-of-an-upload).
> 4. Every later file from the same source reuses the template.

## Overview
Load any bank or ERP file without IT: file import lets anyone on your team bring flat files into
TreasuryHub, with no scripts and no custom spreadsheet mapping. You **upload a file** (on **Integrations › Ingestion**, or via **Upload
Statement** for bank statements), TreasuryHub reads it using a **Parsing Template** that maps its columns to Treasury
Hub fields, and the data lands as transactions, balances, or other entities. The first time you import
a new format you set the template up once; every import after that from the same source reuses it.

A manual upload accepts **.csv**, **.txt**, **.tsv**, **.xlsx**, **.xlsm**, **.xls** and **.pdf**.
Reusable templates are managed as **Parse Templates** under **Settings › Ingestion**.

> There is **no** upload button on the reconciliation screens — files come in through Ingestion (or
> Upload Statement), get parsed, and then flow into reconciliation automatically.

## Key concepts
- **Parsing Template** — a saved definition for one source (e.g. "Bank X statement", "ERP Y export")
  that remembers which column means what, so recurring files import automatically. Managed under
  **Settings › Ingestion › Parse Templates**; if a source changes its format, you edit the template
  instead of starting over. A template declares the **file type** it reads — CSV, Excel, fixed-width
  text, SWIFT MT, PDF or XML — and the file it is given has to be of that type.
- **Column mapping** — linking each column in your file to a TreasuryHub field (date, amount,
  reference, counterparty…) and a target entity (movements, balances, payment orders).
- **Auto-detection** — when a file arrives without a template named for it, TreasuryHub works out
  **which template** reads it, in three steps: the detection rules a template declares (extension,
  file-name pattern, expected header, a value in a known cell), then the **format fingerprint**
  learned from the last file of that shape that loaded successfully, then a **similar header**. It
  either resolves a template or it does not: when no active template recognises the file completely,
  or when two recognise it equally well, the file is **parked** and waits for a person rather than
  being loaded with a guess.
- **How PDFs are read** — TreasuryHub reads the **text layer** of the PDF and then analyses the
  **geometry of the page** to find the table, its columns, its header and where each row starts. It
  does not perform OCR. A **scanned, image-only PDF has no text layer and cannot be read** — it is
  parked as incompatible, and the only thing left to do with it is download it again. (A scan that
  somebody else has already put through an OCR tool does carry a text layer, so it is read, with a
  warning that the characters are the OCR's and are worth checking.) A password-protected PDF, a
  damaged file, a PDF holding several accounts one after the other, and a report of positions rather
  than of movements are parked in the same way.
- **Preview** — the sample the template editor shows you: your file run through the template, with
  parsing warnings listed per row. It is a dry run, not the import. See
  [Parse Templates](parsing-templates.md).
- **All-or-nothing load** — a file loads whole or not at all. If any row is rejected, **nothing is
  inserted**; the rows that were not at fault are still reported, so no row disappears without an
  explanation.

## Before you start
- Have the file ready and know which entity it represents (movements, balances, payment orders, …).
- Have a Parsing Template for that format, or expect the file to wait until one exists.
- Confirm you have create/edit rights on that data — see
  [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## How to use it

### Upload a file
1. Go to **Integrations › Ingestion** and choose **Upload file**.
2. Drop your files on the panel, or **Choose files**. Several can go at once, each set up on its
   own row.
3. On each row, pick the **Template** that should read the file from the ones that recognise it —
   or **Create a new template with AI**, the last option in the same list, when none does.
4. Supply what the file does not state: the **account**, and a **currency** where the account does
   not settle it. With several files of the same shape, **Apply to similar files** copies the first
   row's choices to the rest.
5. Upload. A file with an existing template is parsed and loaded in the background; duplicates are
   skipped. A file you asked AI for comes back as a **draft you review** in the template editor,
   with the parsed file beside it — change anything, then **Save template and load file** to
   publish the template and load the data in one step. The grid on the Ingestion screen shows what
   each file did. See [Ingestion](ingestion-activity.md) and [Parse Templates](parsing-templates.md).

### Upload a bank statement
1. Use **Upload Statement** — it's on **Home** (top-right), on a specific
   [Bank Account](../06-reporting/bank-accounts.md#upload-a-statement-for-one-account), and on the
   [Bank Statements](../06-reporting/bank-statements.md) screen.
2. Choose the **parser/format** for the file so it's read correctly, then upload and **process** it.
   See [Bank Statements](../06-reporting/bank-statements.md) for the full upload → analyze → process
   flow.

### Create or edit a Parsing Template
1. Go to **Settings › Ingestion › Parse Templates**.
2. Create a template (or open an existing one), choose the **file type** it reads, and define the
   **column mapping** — which column maps to which TreasuryHub field and entity.
3. Work against a sample file in the template workbench: that is the screen where you adjust the
   mapping, re-read the parsed result, and commit only once it looks right.
4. Save and activate it. From then on, files from that source are parsed automatically with this
   template.

### Read the outcome of an upload
A file ends in one of these outcomes, shown on [Ingestion Activity](ingestion-activity.md):

- **Completed** — the rows were inserted.
- **No data** — the file was read and held nothing to ingest (an empty statement, a header with no
  rows). Not an error.
- **Needs template** — no template could be resolved, or the file could not be read at all. The file
  is kept; you answer it by choosing a template for it.
- **Not processed — Duplicate** — **every row of this file was already loaded**. Nothing was
  inserted, and the row points at the upload that holds the data.
- **Failed** — something was rejected, so nothing was inserted. A file that repeats the same
  **External ID within itself** is Failed, not Duplicate: that is a template mapping a column that is
  not unique, not a file you have already loaded.
- **Superseded** — the same file was uploaded again and is being processed under the newer row.

## Configuration
- **Parse Templates** — one per source, managed under **Settings › Ingestion › Parse Templates**;
  edit a template when a source's format changes.
- **File formats** — `.csv` is read as delimited text with the separator sniffed from the file, and
  so are `.txt` and `.tsv`. A `.txt` that is **not** delimited (a SWIFT MT940 message, a fixed-width
  file) is read as a single column with no header, so it cannot be recognised automatically: it needs
  a template named for it. `.xlsx`, `.xlsm` and the legacy `.xls` are all read as Excel.
- **Automated intake** — for recurring files, prefer an automated channel so no one has to upload by
  hand: [SFTP Ingestion](sftp-ingestion.md) (files dropped on a server) or
  [Email Ingestion](email-ingestion.md) (attachments read from a mailbox).

## Tips to get more value
- Set up a clean **Parsing Template** the first time — every later import from that source reuses it,
  so the effort pays back immediately.
- **Ask your bank for a machine-readable statement** — CSV, Excel, or a PDF with selectable text. If
  you can select and copy text in the PDF, TreasuryHub can read it; if the page is a photograph of a
  statement, it cannot.
- Always read the **Preview** and its parsing warnings before you upload; it's designed to catch
  silent data errors before they reach your numbers.
- Because a load is all-or-nothing, a single bad row stops the whole file. Fix the template (or the
  file) and upload the same file again — the platform accepts the same bytes again on purpose, and
  closes the earlier row instead of leaving two.
- For high-volume, recurring feeds, use [SFTP](sftp-ingestion.md), [Email](email-ingestion.md), or
  [APIs](inbound-apis.md) instead of manual upload.

## Where to go next
- [Parse Templates](parsing-templates.md) — how a file finds its template, and how a template is
  created with the AI assistant.
- [PDF Statements](pdf-statements.md) — how a PDF is read, the balance check, and why a PDF is refused.
- [Ingestion](ingestion-activity.md) — upload a file and follow what happens to it.
- [Bank Statements](../06-reporting/bank-statements.md) — the statement upload → process pipeline.
- [SFTP Ingestion](sftp-ingestion.md) and [Email Ingestion](email-ingestion.md) — automate recurring files.
- [Ingestion Activity](ingestion-activity.md) — track imported files and errors.
- [Financial Events](../03-data/financial-events.md) — the records an import creates.
