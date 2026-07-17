# Email Ingestion

> **Availability:** `Available` ✅ — shown **Active** in the platform.
> **Where to find it:** Integrations › Email Ingestion
> **Who uses it:** treasury operations, finance team, administrators.
> **Permissions required:** administrator to configure; create/edit on the data being ingested. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Email Ingestion lets Treasury Hub read data straight from incoming emails and their attachments, so
files your banks, PSPs, or partners send by email become structured data without anyone downloading
and uploading them by hand. You point a monitored mailbox at Treasury Hub, set rules for what to do
with each message, and matching emails are processed automatically.

## Key concepts
- **Monitored mailbox** — the email address Treasury Hub watches for incoming messages.
- **Attachment** — a file on an email (e.g. a statement or report) that Treasury Hub extracts and
  processes, typically using a [file-import template](file-import.md).
- **Rule** — conditions that decide how a message is handled — for example, which sender or subject
  triggers ingestion, and which template to apply to the attachment.
- **Automated sending** — Treasury Hub can also send emails automatically as part of a flow (for
  example, notifications or outputs), not only read them.

## Before you start
- Decide which mailbox will receive the source emails and confirm you can configure it to forward or
  grant access to Treasury Hub.
- Have a [file-import template](file-import.md) ready for the attachment format, if the emails carry
  files to map.
- Confirm you have administrator rights to set up ingestion — see
  [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## How to use it
### Set up an email ingestion source
1. Open **Integrations › Email Ingestion**.
2. Add a **monitored mailbox** and connect it.
3. Define one or more **rules** — the sender, subject, or content that identifies the emails to
   ingest, and the **template** to apply to any attachment.
4. Save. Matching emails are now processed automatically as they arrive.

### Review what was ingested
1. Incoming emails that match your rules are processed and their data is created in Treasury Hub.
2. Check [Ingestion Activity](ingestion-activity.md) to see each processed email, its status, and any
   errors.

## Configuration
- **Rules** — set as many as you need to route different senders or message types to the right
  handling and template.
- **Automated sending** — configure outbound emails where a flow needs to notify or deliver output
  by email.

## Tips & good practices
- Use a **dedicated mailbox** for ingestion so it's easy to see what's coming in and to keep rules
  simple.
- Make rules specific (by sender and subject) to avoid processing unrelated messages.
- Pair email ingestion with a well-built [file-import template](file-import.md) so attachments map
  cleanly and consistently.

## Related
- [Integrations Overview](overview.md) — all ingestion channels.
- [File Import](file-import.md) — the templates applied to attachments.
- [SFTP Ingestion](sftp-ingestion.md) — an alternative automated file channel.
- [Ingestion Activity](ingestion-activity.md) — monitor processed emails.
