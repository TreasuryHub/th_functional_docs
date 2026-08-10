# SFTP Ingestion

> **Availability:** `Available` ✅ — shown **Active** in the platform.
> **Where to find it:** Integrations › SFTP Ingestion
> **Who uses it:** treasury operations, finance systems owners, IT, administrators.
> **Permissions required:** administrator to configure; create/edit on the data being ingested. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
SFTP Ingestion picks up files from a secure file-transfer location and imports them into Treasury
Hub automatically. It's the standard way to handle recurring file feeds from banks, ERPs, and
partners that deliver files by dropping them on a server — no one has to log in and upload each file
by hand. Files are read on a schedule, mapped with your [import templates](file-import.md), and
turned into structured data.

## Key concepts
SFTP ingestion is a **two-step** setup — a **connection**, then **assignment rules** on it.
- **SFTP** — SSH File Transfer Protocol, a secure way to exchange files between systems.
- **Connection** — the server Treasury Hub reaches: **host**, **port**, **username**, **authentication**
  (Password or SSH key), and a **secret** stored in **Key Vault** (the connection keeps only a reference).
  A connection can be **tested** before you rely on it.
- **Assignment rule** — for a connection, which files to pick up and how to process them: an optional
  **account**, a **parsing template**, **match criteria** (folder + file name), and an **after-processing**
  action.
- **Match criteria** — tests on **Folder** and **File** name, each matched by **Exact** or **Regex**; a
  file must meet all of them.
- **After processing** — what happens to the file on the server once ingested: **Leave**, **Move to a
  folder**, or **Delete**.
- **Template** — the saved [file-import mapping](file-import.md) applied to each file so its columns land in
  the right Treasury Hub fields.

## Before you start
- Have the SFTP connection details (host, credentials or key, and folder path) ready.
- Confirm the file format each feed delivers and prepare a [file-import template](file-import.md) for
  it.
- Confirm you have administrator rights to set up ingestion — see
  [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## How to use it
### Step 1 — Create a connection
1. Open **Integrations › SFTP Ingestion** and add a connection.
2. Enter the **name**, **host**, **port** (22 by default), **username**, and **authentication** (Password or
   SSH key). The **secret** is stored in **Key Vault** — Treasury Hub keeps only a reference.
3. **Test** the connection (reachability + auth), then save.

### Step 2 — Add assignment rules
1. On the connection, add one or more **assignment rules**.
2. Set the (optional) **account**, the **parsing template**, and the **match criteria** — a **Folder** and a
   **File** name matched by **Exact** or **Regex** (e.g. folder `/settlements`, file regex `settle_.*\.csv`).
3. Choose the **after-processing** action (Leave / Move / Delete) and save. New matching files are imported
   automatically; already-processed files aren't reprocessed. Use **one rule per file type** so each maps to
   the right template.

### Confirm files are being picked up
1. Once configured, Treasury Hub collects and processes new files without manual steps.
2. Check [Ingestion Activity](ingestion-activity.md) to see each file, its status, and any errors.

## Configuration
- **Schedule** — set the polling frequency to match how often your source delivers files.
- **Templates** — map each folder or feed to the right import template; adjust the template if a
  source changes its format.

## AI Ingestion Assistant (`In Preview` 👁️)
A **✨ Set up with AI** assistant configures the **connection and its rules** from plain language ("connect
to BBVA Peru's SFTP and ingest the daily files into BBVA PEN"). It **asks only what it needs**, **offers
insights** (banks usually use an SSH key; port 22 is standard; one rule per file type), and **runs
validations** — including a live **connection test** and a check that each parsing template exists —
flagging anything that isn't ready. It can draft **one rule per file type** in a batch (from several folders
or an attached list) and shows a **results review** before creating. Secrets always stay in Key Vault; the
assistant drafts, you confirm.

## Tips & good practices
- Use a **separate folder per feed** so each maps to a single template and issues are easy to isolate.
- Verify the first few automated pickups in [Ingestion Activity](ingestion-activity.md) before you
  rely on the feed.
- Choose SFTP for high-volume, scheduled files; use [Email Ingestion](email-ingestion.md) when the
  source only sends by email, and manual [file import](file-import.md) for one-off files.

## Related
- [Integrations Overview](overview.md) — all ingestion channels.
- [File Import](file-import.md) — the templates applied to picked-up files.
- [Email Ingestion](email-ingestion.md) — the alternative automated file channel.
- [Ingestion Activity](ingestion-activity.md) — monitor processed files.
