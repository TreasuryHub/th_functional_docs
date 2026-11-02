# Email Ingestion

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
- **Reception rule** — how a matching email is handled: the **account** movements land in, the **country**,
  an optional **parsing template** applied to the attachment, an optional **fallback currency**, the
  **match criteria** that identify the email, and what happens **after processing**.
- **Match criteria** — tests on **Sender**, **Subject**, or **Attachment** (file name); each is matched by
  **Any** (ignore), **Exact** (full text), or **Regex**. A message must meet **all** defined criteria.
- **Unmatched action** — what the mailbox does with an attachment that **no rule claims**: *Ignore*
  (record it as unmatched and leave the message unread) or *Park for a template* (keep the file and
  wait for a template for its format). Set per mailbox.
- **Omitted attachment** — an attachment whose file type is outside the supported list. It is marked
  **Omitted**: it neither fails nor blocks the rest of the message.
- **Automated sending** — Treasury Hub can also send emails automatically as part of a flow (for
  example, notifications or outputs), not only read them.

## Before you start
- Decide which mailbox will receive the source emails and confirm you can configure it to forward or
  grant access to Treasury Hub.
- Have a [file-import template](file-import.md) ready for the attachment format, if you want the
  rule to name one.
- Confirm you have administrator rights to set up ingestion — see
  [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## How to use it
### Set up an email ingestion source
1. Open **Integrations › Email Ingestion**.
2. Add a **monitored mailbox** and connect it.
3. Define one or more **rules** — the sender, subject, or attachment name that identifies the emails
   to ingest, and the **template** to apply to the attachment.
4. Save. Matching emails are now processed automatically as they arrive.

### Configure a reception rule
A rule has three parts:
1. **Source & routing** — a **name**, the **account** where the ingested movements are added (optional),
   the **country**, the **parsing template** to apply, and a **fallback currency** (used only when the file
   or template has no explicit currency).
2. **Match criteria** — one or more rows of **Field** (Sender / Subject / Attachment) · **Match** (Any /
   Exact / Regex) · **Value**. The rule fires only when **all** criteria match — for example *Sender regex
   `.*@adyen\.com`* and *Attachment regex `settlement_.*\.csv`*.
3. **After processing** — what to do with the email once ingested: **Leave**, **Mark as read**, **Move to a
   folder**, or **Delete**.

**A rule does not have to carry a template.** When an attachment reaches ingestion without one — a
rule left without a template, a rule whose template is a draft or has been deactivated, or an
attachment no rule claimed at all — the platform works the format out itself: it matches the file
against your active templates and loads it with the one that recognises it. If none does, the file
is **parked** and waits for a person rather than being loaded with a guess, and you finish it from
[Ingestion Activity](ingestion-activity.md). Naming the template on the rule is still the safest
choice for a feed you already know.

Rules are **active as soon as they're saved** and apply to **incoming** emails (past emails aren't
reprocessed); any rule can be enabled or disabled later. Run **one rule per provider** so each sender maps
to the right template.

### Review what was ingested
1. Incoming emails that match your rules are processed and their data is created in Treasury Hub.
2. Check [Ingestion Activity](ingestion-activity.md) to see each processed file, its status, and any
   errors.

### Open a mailbox's messages
Each mailbox has its own message list — the actual emails, not just the files they produced.
1. On **Integrations › Email Ingestion**, open the mailbox's actions menu and choose **View
   messages**.
2. The list shows each message with its **processing status**: *Processed*, *With errors*,
   *Unmatched*, *Mixed*, *Not processed*, *No attachments*, or *Omitted*.
3. Filter by read / unread, or search, to find a message.
4. Use the row's actions menu to **Mark read** or **Mark unread** — useful when a mailbox is also
   read by people.
5. Expand a message to see its attachments: file name, size, status, last attempt, errors, and how
   many attempts it has had. Expand an attachment again for the error detail or its full history.
6. Click **Reprocess** on an attachment to send it through ingestion again. The request is queued and
   the row shows **Reprocess pending** until a worker picks it up.

Attachments whose type isn't supported show as **Omitted** here. That is the expected result, not a
failure — the rest of the message is processed normally.

## Configuration
- **Rules** — set as many as you need to route different senders or message types to the right
  handling and template.
- **Unmatched action** — per mailbox: ignore attachments no rule claims, or park them for a template.
  Ignore suits a shared mailbox that also receives invoices and loose spreadsheets; park suits a
  mailbox dedicated to data feeds.
- **Automated sending** — configure outbound emails where a flow needs to notify or deliver output
  by email.

## Tips & good practices
- Use a **dedicated mailbox** for ingestion so it's easy to see what's coming in and to keep rules
  simple.
- Make rules specific (by sender and subject) to avoid processing unrelated messages.
- Pair email ingestion with a well-built [file-import template](file-import.md) so attachments map
  cleanly and consistently.
- Think about the mailbox's **unmatched action** before setting it to park: on a mailbox that also
  receives invoices and loose spreadsheets, every stray attachment then becomes a file somebody has
  to answer for.

## Related
- [Integrations Overview](overview.md) — all ingestion channels.
- [File Import](file-import.md) — the templates applied to attachments.
- [SFTP Ingestion](sftp-ingestion.md) — an alternative automated file channel.
- [Ingestion Activity](ingestion-activity.md) — monitor processed files and resolve parked ones.
