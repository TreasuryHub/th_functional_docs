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
- **SFTP** — SSH File Transfer Protocol, a secure way to exchange files between systems.
- **Monitored location / folder** — the SFTP path Treasury Hub watches for new files.
- **Template** — the saved [file-import mapping](file-import.md) applied to each file so its columns
  land in the right Treasury Hub fields.
- **Schedule** — how often Treasury Hub checks the location for new files.

## Before you start
- Have the SFTP connection details (host, credentials or key, and folder path) ready.
- Confirm the file format each feed delivers and prepare a [file-import template](file-import.md) for
  it.
- Confirm you have administrator rights to set up ingestion — see
  [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## How to use it
### Set up an SFTP source
1. Open **Integrations › SFTP Ingestion**.
2. Add a connection with the **host, credentials, and folder** to monitor.
3. Choose the **template** to apply to files from that folder and set the **schedule** for checking.
4. Save. New files dropped in the folder are imported automatically on schedule.

### Confirm files are being picked up
1. Once configured, Treasury Hub collects and processes new files without manual steps.
2. Check [Ingestion Activity](ingestion-activity.md) to see each file, its status, and any errors.

## Configuration
- **Schedule** — set the polling frequency to match how often your source delivers files.
- **Templates** — map each folder or feed to the right import template; adjust the template if a
  source changes its format.

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
