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
- **Reception rule** — how a matching email is handled: the **account** movements land in, the **country**,
  the **parsing template** applied to the attachment, an optional **fallback currency**, the **match
  criteria** that identify the email, and what happens **after processing**.
- **Match criteria** — tests on **Sender**, **Subject**, or **Attachment** (file name); each is matched by
  **Any** (ignore), **Exact** (full text), or **Regex**. A message must meet **all** defined criteria.
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

Rules are **active as soon as they're saved** and apply to **incoming** emails (past emails aren't
reprocessed); any rule can be enabled or disabled later. Run **one rule per provider** so each sender maps
to the right template.

### Review what was ingested
1. Incoming emails that match your rules are processed and their data is created in Treasury Hub.
2. Check [Ingestion Activity](ingestion-activity.md) to see each processed email, its status, and any
   errors.

## AI Ingestion Assistant (`In Preview` 👁️)
A **✨ Set up with AI** assistant can create reception rules from plain language — "ingest our Adyen, Stripe
and dLocal settlement files into the Collections USD account". It **asks only for what it can't infer**
(which template per provider, how to match, what to do after processing), suggests matching by sender domain
and file pattern, and **flags problems** such as a provider with no parsing template yet. Because providers
are separate rules, it's **batch-first**: name several providers (or attach a list) and it drafts **one rule
per provider**, showing a **results review** — ready vs. needs-attention — before anything is created. The
assistant drafts; you confirm.

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
