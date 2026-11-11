# SFTP Ingestion

> **Run recurring file feeds on autopilot**
>
> **Why it matters**
> - **Nobody logs in to collect files**: the server is read on a schedule and the files import themselves.
> - **The standard channel for banks and ERPs**: feeds that arrive by drop-and-collect, handled end to end.
> - **Your templates do the mapping**: files land as structured data, not as a folder of attachments.

> **Where to find it:** Integrations › SFTP ingestion (the connections; **Assignment rules** and **Logs** open from its toolbar)
> **Who uses it:** treasury operations, finance systems owners, IT, administrators.
> **Permissions required:** administrator to configure; create/edit on the data being ingested. See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

> **In 60 seconds**
> 1. Create a connection to the SFTP server — see the first step below.
> 2. Add the assignment rules that say which files are picked up and how they are parsed.
> 3. [Confirm files are being picked up](#confirm-files-are-being-picked-up).
> 4. [See what each sweep checked](#see-what-each-sweep-checked) if something is missing.

## Overview
Put your recurring file feeds on autopilot: SFTP Ingestion picks up files from a secure
file-transfer location and imports them into TreasuryHub automatically. It's the standard way to handle recurring file feeds from banks, ERPs, and
partners that deliver files by dropping them on a server — no one has to log in and upload each file
by hand. Files are read on a schedule, mapped with your [import templates](file-import.md), and
turned into structured data.

## Key concepts
SFTP ingestion is a **two-step** setup — a **connection**, then **assignment rules** on it.

- **SFTP** — SSH File Transfer Protocol, a secure way to exchange files between systems.
- **Connection** — the server TreasuryHub reaches: **host**, **port**, **username**, **authentication**
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
  the right TreasuryHub fields.
- **Sweep** — one pass over the connection, made every 15 minutes: TreasuryHub lists the folders your
  rules point at, picks up the files that match, and then looks at what is left over. Each pass is
  recorded with what it checked and what it skipped.
- **Unmatched action** — what the connection does with a file **no rule claims**: *Ignore* (leave it
  where it is) or *Park for a template* (bring it in and let it wait for a template for its format).

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
   SSH key). The **secret** is stored in **Key Vault** — TreasuryHub keeps only a reference.
3. **Test** the connection (reachability + auth), then save.

### Step 2 — Add assignment rules
1. On the connection, add one or more **assignment rules**.
2. Set the (optional) **account**, the **parsing template**, and the **match criteria** — a **Folder** and a
   **File** name matched by **Exact** or **Regex** (e.g. folder `/settlements`, file regex `settle_.*\.csv`).
3. Choose the **after-processing** action (Leave / Move / Delete) and save. New matching files are imported
   automatically; already-processed files aren't reprocessed. Use **one rule per file type** so each maps to
   the right template.

**A rule does not have to carry a template.** When a file reaches ingestion without one — a rule left
without a template, a rule whose template is a draft or has been deactivated, or a file no rule
claimed at all — the platform works the format out itself: it matches the file against your active
templates and loads it with the one that recognises it. If none does, the file is **parked** and
waits for a person rather than being loaded with a guess, and you finish it from
[Ingestion Activity](ingestion-activity.md).

### Confirm files are being picked up
1. Once configured, TreasuryHub collects and processes new files without manual steps.
2. Check [Ingestion Activity](ingestion-activity.md) to see each file, its status, and any errors.

### What a sweep does and does not pick up
A sweep runs **every 15 minutes** on each connection.

- **Only the folders your rules point at** are listed. A sweep never goes wandering for new folders.
- **A file already handled and older than three days is not checked again.** Once a file on this
  connection has reached a final outcome — loaded, duplicate, empty, parked, or failed for good — and
  the server's own modified time on it is more than three days old, the sweep passes over it: it is
  not downloaded, not read and not counted. This is what keeps a folder nobody ever clears from being
  worked through again every quarter of an hour. Two things are deliberately **not** skipped: a file
  older than three days that was **never** handled is still picked up, so a late delivery that keeps
  its original timestamp is never lost; and a file whose last attempt failed for a passing reason is
  tried again whatever its age.
- **A file already handled is not handled twice.** A file a rule claims is read once and identified by
  its **contents**, so the same bytes under a new name, or a file left in place and listed again, are
  recognised and not loaded twice. For a file **no rule claims**, TreasuryHub compares the **size and
  modified time** it saw last time and skips the download altogether when neither has moved — which
  means a file rewritten with different contents but the same size and timestamp is not noticed.
- **Hidden and part-written files are left alone when no rule claims them** — anything whose name
  starts with a dot, and anything ending in `.tmp` or `.part`, because the uploader is probably still
  writing it. The file is picked up under its final name once renamed. A rule whose pattern matches
  such a name deliberately still claims the file.
- **Files that no rule claims** are handled according to the connection's unmatched action. When they
  are parked, TreasuryHub takes **at most 50 new or changed ones per connection on each pass**; the
  rest wait for the next pass, so a folder with a large backlog is worked through gradually rather
  than all at once. Files that have not changed since the pass that handled them cost nothing and do
  not count against that figure.

### See what each sweep checked
1. Open **Integrations › SFTP ingestion** and click **Logs** in the toolbar for the **Connection logs**
   screen, or expand a connection's row to read its recent passes underneath it.
2. Each pass is one row, with **Files checked** and a message that says what the pass did — for
   example *Checked 12 of 40 files on the server.* · *28 skipped: already handled and older than the
   age limit.* · *9 of the checked files had not changed.* A pass with nothing new to do reads *No new
   files since the last check.*
3. A pass that could not reach the server, or failed part-way, shows its error in the same place
   instead of the counts.

Use these counts to tell a quiet feed from a broken one: a connection that reports *No new files since
the last check* is working and has nothing to do, while a connection whose checked count stays at zero
while files keep arriving is pointing at the wrong folder or has lost its credentials.

## Configuration
- **Templates** — map each folder or feed to the right import template; adjust the template if a
  source changes its format.
- **Unmatched action** — per connection: ignore files no rule claims, or park them for a template.
  Ignore suits a shared drop folder that also holds files meant for other systems.

## Tips to get more value
- Use a **separate folder per feed** so each maps to a single template and issues are easy to isolate.
- Have the source **write to a temporary name and rename** when the file is complete (`.tmp` or
  `.part` then the final name). TreasuryHub skips the temporary file, so a half-written file is
  never ingested.
- Verify the first few automated pickups in [Ingestion Activity](ingestion-activity.md) before you
  rely on the feed.
- **Leaving handled files on the server is fine.** After three days they stop being checked, so a
  drop folder that is never cleared does not slow the sweep down. Use **Move to a folder** or
  **Delete** for tidiness, not for speed.
- **If a source re-publishes a corrected file under the same name, have it update the file's
  timestamp** (most uploaders do). A file left untouched on the server for more than three days after
  it was handled is not looked at again.
- Choose SFTP for high-volume, scheduled files; use [Email Ingestion](email-ingestion.md) when the
  source only sends by email, and manual [file import](file-import.md) for one-off files.

## Where to go next
- [Integrations Overview](overview.md) — all ingestion channels.
- [File Import](file-import.md) — the templates applied to picked-up files.
- [Email Ingestion](email-ingestion.md) — the alternative automated file channel.
- [Ingestion Activity](ingestion-activity.md) — monitor processed files and resolve parked ones.
