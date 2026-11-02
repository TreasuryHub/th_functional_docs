# Parse Templates

> **Where to find it:** Settings › Ingestion › Parse Templates (the list, the drafts and the editor) ·
> Integrations › Ingestion (where a file waiting for a template is picked up)
> **Who uses it:** treasury operations, finance systems owners, administrators.
> **Permissions required:** See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Every bank, payment provider and ERP exports its data in its own shape: one calls a column *Fecha*,
the next *Value date*, a third splits the amount into separate debit and credit columns. A **parse
template** is the saved answer to the question "what does this file mean" — it maps the columns of a
file you receive onto the fields Treasury Hub stores, so the same export can be loaded every month
without anybody re-keying it.

When a file arrives — uploaded on [Ingestion](ingestion-activity.md), or arriving on its own
through [Email Ingestion](email-ingestion.md) or [SFTP Ingestion](sftp-ingestion.md) — Treasury Hub
works out whether it already recognises the format. If it does, the file is read with the template it
matched and there is nothing for you to do. If it does not, the file stops on Ingestion as **Needs
template** and waits: a file no template recognises is never loaded on a guess.

A template for that format is created with the **AI assistant**. It reads the file and drafts the
template from the file itself — the sheet and the header row, how dates and numbers are written, what
each column means, and the rules that will recognise the next file of the same shape. The draft is a
proposal, not a decision: it opens in the template editor with everything filled in, each field marked
with what is missing or wrong, and a preview of the records it would create. You review it, adjust
what needs adjusting, and publish it. From that point the format is recognised and its files load on
their own.

## Key concepts
- **Template** — one saved definition for one source and one format ("Bank X statement", "PSP Y
  settlement export"). It declares a **file type**, how to read the file, and what each column means.
- **File type** — what kind of file the template reads: **CSV**, **Microsoft Excel**, **SWIFT MT
  message**, **PDF document**, **Fixed-width text** or **XML document**. A template reads only its own
  file type, and the editor changes which sections it shows accordingly.
- **Section (stage)** — one part of the template editor (Basics, Settings, Fields, Detection…).
  Reviewing a draft lets you jump between the sections with the preview beside you; building a
  template by hand walks them in order as a wizard.
- **Destination field** — the Treasury Hub field a column feeds: amount, transaction date, currency,
  reference, counterparty name, external ID, and so on. Each destination field can be mapped only once
  per financial event.
- **Financial event (financial type)** — the kind of record a row becomes (a bank movement, a payin, a
  payout, a payment order). One template can declare several and route each row to the right one.
- **Discriminator column** — the column a multi-event template reads to decide which event a row
  belongs to.
- **Transformation** — a small recipe that computes a field instead of copying a cell: the amount from
  separate credit and debit columns, the type from the sign of the amount, a fixed value, a value
  chosen by conditions, or arithmetic over two mapped fields.
- **Extra field** — a value that is **not** in the table: the statement period, an account number in a
  banner line, a report date. It is read once per file and can then feed the rows.
- **Declared sheet** — for an Excel template, one sheet of the workbook that the template reads. A
  template can declare several, each with its own header row, its own columns and its own event.
- **Movement date** — the day the movement happened, as opposed to the day the file was loaded. Every
  event a template creates maps one, and a template cannot be saved until each of them does.
- **Row filter** — a rule that keeps or drops whole rows before anything is mapped (a totals line, a
  legal notice, a block of rows belonging to another section).
- **Detection** — how Treasury Hub works out, on its own, which template reads an incoming file.
- **Format fingerprint** — the shape of a file: its format, its sheet, its header row and the exact
  column labels. A template learns the fingerprint of every file it loads successfully, so the next
  file of the same shape is recognised without anyone declaring a rule for it.
- **Status** — **Draft**, **Active** or **Inactive**. Only an **Active** template is ever used to load
  a file.
- **Proposal** — one attempt to build a template from one file. It produces a draft template plus a
  conversation you can use to correct it.
- **Draft** — the proposed template before you publish it. **A draft recognises no file.** It only
  starts reading files when you press **Save template**; saving the draft is not enough.
- **Pending review** — a file whose proposal is finished and waiting for a person. The **Ingestion**
  menu entry carries a counter of how many proposals are waiting.
- **Waiting files** — every file of that same format that arrived with no template. They are attached
  to the draft, so one decision can release all of them.
- **Errors and notes** — an **error** is something that would stop the load (a date that cannot be
  read, a required field with no column). A **note** is something to look at (a balance checked on
  only some pages, a column deliberately left unmapped and why). Errors stop a template from being
  published; notes never stop anything.
- **A value only you can give** — a field that this kind of record requires and the file simply does
  not contain. It is marked rather than invented, and you supply a column or a fixed value.
- **Sample file** — the file a template is built against. The preview is recalculated against it at
  every change.

## Before you start
- **Have a real sample file.** A template is always built against one, whether it is drafted for you
  or you build it by hand, and the preview runs against that file at every step.
- A proposal reads **CSV, TXT, Excel or PDF**. A PDF with no readable text, with no movements in it,
  holding several accounts, password protected, or that could not be analysed, is not proposed for —
  those get a template by hand.
- Your organisation needs at least one financial event type that a proposal is allowed to produce.
  With none, the proposal stops before any work is done and says so; an administrator enables the
  event types.
- A proposal can give the template an **account balance** as well as its movements — the balance the
  statement prints, loaded once per file — when your organisation has the account-balance event type
  enabled. Without that type the balance is left out, and a template that loads one cannot be
  published.
- Know what the file represents — bank movements, payment orders, settlements — and which fields are
  mandatory for that kind of record.
- A template never carries one account's data. The account a file is booked to comes from the upload
  (or from the email or SFTP rule that claimed the file), never from the template, so one template
  reads every account of the same bank.
- Templates are listed per organisation. The list also shows read-only **Global default** templates
  that Treasury Hub maintains; to change one, duplicate it first.

## How to use it

### Follow what happens when a file arrives
1. The file is matched against your Active templates — see
   [How a file finds its template](#how-a-file-finds-its-template).
2. **A format that is recognised loads straight away**, with no decision asked of you.
3. **A format that is not recognised parks.** The file appears on **Integrations › Ingestion** as
   **Needs template** and nothing is read from it. A channel can be set to ask for a proposal the
   moment this happens — see
   [Let a channel park unknown files for a proposal](#let-a-channel-park-unknown-files-for-a-proposal).
4. Create the template for that format with the AI assistant, publish it, and the waiting files load.

### Have a template drafted for a file that is waiting
1. Open **Integrations › Ingestion** and find the file. Its status reads **Needs template**.
2. Open the row's **Actions** menu and choose **Create template with AI**.
3. The row changes to **✦ The AI is proposing…** and the list refreshes itself while the work runs.
   You can leave the page; the counter on the **Ingestion** menu entry tells you when something is
   waiting.
4. When it finishes the row reads **✦ Pending review** — or **✦ Pending review · one value missing**
   or **· things to fix** when the draft still needs you. Click **Review** on the row, or **Review
   template** in the Actions menu.

If the file cannot be proposed for, the menu says why instead of starting: the format is not one of
the four accepted, its columns could not be recognised, a proposal is already open for it, or its
template has already been published and the file only needs **Process with template**.

### Ask for a draft as you upload
You do not have to let a file park first. The choice is on the upload panel, per file.

1. Open **Integrations › Ingestion** and choose **Upload file**.
2. Drag the files into the panel, or click to choose them. It shows how many files and how many
   megabytes the upload still has room for, and names any file it refuses together with the reason.
3. Each file gets its own row. While the row reads the file it says *Looking for templates for this
   file…*, then the **Template** list offers whatever recognises it, with **Create a new template
   with AI** as the last option. Choose that and the row is marked **New template**.
4. **Event type** is optional, and only appears for a file you asked AI for. Leave it on **Let the
   AI decide**, or name the kind of record the file holds to guide the proposal.
5. Give the file its **account** and, where neither the file nor the account settles it, its
   **currency**. With several files of the same shape, **Apply to similar files** copies the first
   row's template, account and currency to the rest.
6. Click **Upload**. The **This upload** panel lists the batch and refreshes while anything is still
   running.
7. A file with a template loads straight away. A file you asked AI for shows *New format: the AI is
   preparing the template*, then offers **Review**.

Proposals waiting for you are also collected on the **Pending review** tab of the same screen, and on
the **AI drafts** tab of **Settings › Ingestion › Parse Templates**.

### Review the draft
1. Open the draft from **Pending review**, from the row's **Review**, or from the **AI drafts** tab of
   Parse Templates.
2. Read the **AI assistant summary** at the top: the file, how many files share the format, how many
   rows were read, how dates are read and where a missing year comes from, and chips saying how far
   the draft is from loadable — *N values to complete*, *N to fix*, *Ready to load*, and for a PDF
   statement whether the balance adds up.
3. Work down the section list on the left. Each section carries its own counter, so you can go
   straight to what is pending instead of reading the whole template — see
   [What each section of the editor holds](#what-each-section-of-the-editor-holds).
4. Inside a section every field is marked with what is known about it:
   - **A value is missing** — an orange outline. The file has no column for it; choose a column, a
     transformation or a fixed value.
   - **Validator error** — a red outline. The mapping is wrong and the rows would not load. The
     message says how many rows are affected and shows examples taken from the file.
   - **Changed by you** — a quiet tag on a field you edited yourself, so your own corrections stand
     apart from the proposed ones.
5. Errors that belong to a section rather than to one field appear at the top of that section, with
   the section's **notes** in a separate block beneath them. Read the notes — they are where the
   platform explains the choices it was least certain about — but they never stop you from saving.
6. When a date cannot be told apart from the same date with day and month swapped, or a separator from
   its opposite, you are asked to decide: tick **I confirm dates and amounts are read this way**.
7. Click **Save draft** whenever you have changed several things. **A draft saves even with errors in
   it** — saving is how the draft is re-checked against the real file, and it is what refreshes the
   counters, the preview and the balance check.

### What each section of the editor holds
The sections always run in this order; which of them appear depends on the file type, and the
[table below](#sections-by-file-type) says which. This is what you are looking at in each one and what
you can change.

1. **Basics** — name, file type, description, the Active switch, and the default status (Pending,
   Rejected or Booked) that the records this template creates take.
2. **Settings** — how to read the file: separators, encoding, which sheets of a workbook to read,
   where the header sits, how dates and numbers are written. Check these first when whole columns
   look wrong. See [Reading settings by format](#reading-settings-by-format).
3. **PDF page regions** (PDF only) — where the table sits on the page, where its header is, and where
   each column is split. Drag the regions when a column is cut in the wrong place. See
   [PDF Statements](pdf-statements.md).
4. **Columns** (PDF only) — each extracted column can be cleaned with an expression when text from a
   neighbouring column bleeds into it.
5. **Pre-process** — ordered text transformations applied to the raw file *before* it is parsed
   (replace a character, replace by expression, normalise line endings, make sure the file ends with
   its trailer line). Useful for text formats that arrive slightly malformed.
6. **Row Filters** — include-only and skip rules over whole rows, each testing one named column or any
   column for *contains*, *equals*, *is empty* or *matches an expression*. This is what keeps totals
   lines, subtotals and footer notes out of your data; add a rule here when a summary row shows up in
   the preview as a movement.
7. **Extra Fields** — values read from outside the table. For a text file they are a row plus an
   expression with a capture group; for a PDF, a region drawn on the page. The statement period is the
   common one: it is what lets dates that print no year be completed from the file itself.
8. **Fields** — the heart of the template. One or more **financial types**, and for each one every
   destination field mapped to a column (by name, by Excel letter or by position) or to a
   **transformation**. Required fields are marked and cannot be removed, and a destination can be used
   only once per event. A date field can carry its own **format override** when one column is written
   differently from the rest.
   - **Every event maps a Movement date** — the day the movement happened — to a column, a
     transformation or a fixed value. A template cannot be saved while an event leaves it unmapped.
     For a file that carries no date at all, the **Load date** transformation dates every row with
     the day the file arrived; use it only in that case.
   - An event of a settlement or an invoice can map the **breakdown fields** as well as its amount —
     gross, fee, tax on the fee, dispute hold, refund discount, released hold, subtotal, tax,
     discount, withholding. Each one is offered as a destination named *Breakdown: <component>*, and
     the file states each figure in its natural sense (a fee is `450`, not `-450`). See
     [Financial Events](../03-data/financial-events.md) for what the breakdown is for.
   - A shape that requires an **External ID** and a file with no column that identifies one row are
     reconciled by the **Generate ExternalId** transformation: it computes one id per row out of all
     that row's values, with an optional **Prefix**, so the same file always produces the same ids.
     It is only ever used on External ID.
   - When a template declares more than one financial type **on one sheet**, the **Discriminator
     column** and its rules route the rows: *equals*, *not equals*, *contains*, *starts with*, *ends
     with*, *matches regex* or *is not empty*. The first matching rule wins; rows that match none are
     reported as **unassigned** in the preview rather than loaded.
   - When an Excel template declares **several sheets**, the sheet does the routing instead: each
     event, field and row filter carries **Reads from sheet**, and the mapping table's column header
     becomes *Column of <sheet>*. A template reads each financial type once, so the same type cannot
     be put on two sheets.
   - **Update the account balance with this file** is a switch on its own group card, marked *One per
     file*. Turned on, the template loads the balance the statement prints as well as its movements:
     *One balance per file. Each field is read with its own transformation and doesn't depend on the
     rows.* Turned off, *this template's files won't update the account balance. Transformations are
     kept: turn it on to use them again.* See
     [Say where each balance figure is read from](#say-where-each-balance-figure-is-read-from).
9. **Validations** — per-event checks on the value a field ended up with: required, matches an
   expression, within a range, minimum or maximum length, one of a list, a valid IBAN, a valid ISO
   4217 currency, not a future date, and pair rules (mutually exclusive, exactly one of, both
   required).
10. **Detection** — the rules that let this template claim an incoming file. Worth a look before you
    publish: a template that recognises nothing but its own fingerprint will park the next file
    instead of loading it, and a rule that is too generic will claim files from another source. See
    [How a file finds its template](#how-a-file-finds-its-template).

### Find your way around the editor
The editor gives the whole width to one pane and lays the other over it.

- By default the **preview** is the wide pane, and the template's sections open over it from the
  right when you click **Edit template** in the toolbar. The panel has no veil behind it, so the
  preview stays readable while you work in the form.
- **Swap the panes** in the toolbar exchanges them: the sections take the whole width and the preview
  becomes the overlay, and the button that opens the overlay renames itself **Preview**. The choice
  is remembered next time you open an editor; the overlay itself always starts closed.
- On a narrower screen the overlay and the **AI assistant** share one sheet as two tabs —
  **Template** (or **Preview** when the panes are swapped) and the assistant. On a wide screen the
  assistant is a column of its own at the right edge.
- Whatever you do with the panes, the form keeps its state: your scroll position, what you have typed
  and the groups you have opened all survive closing the overlay and swapping.

Creating a template from scratch still walks the sections in order as a wizard. The two-pane editor is
what you get when you open an existing template or review a draft.

### Read the preview
The preview recalculates whenever a field changes. It is the wide pane unless you have swapped them,
in which case **Preview** in the toolbar brings it over the form.

- **Result** (also called **Parse result**) shows the records the template produces, with a bar for
  **All**, **Valid** and **With errors** so you can jump straight to the rows that have a problem, and
  the problem named on the row itself. The footer counts the rows read, the rows without errors, the
  rows with errors and the rows skipped. Pre-processing, the extra fields and their values, and the
  rows a filter removed each have their own collapsible section, folded away until something looks
  wrong.
- **Original file** (also called **File visualization**) shows the file as it was received and as the
  template reads it — the delimiter and the columns it produced, the sheet and its first rows for an
  Excel file, the page with its regions and column splits for a PDF.
- A multi-event template shows one block per financial type, plus an **Unassigned rows** block for the
  rows the discriminator matched to nothing.
- For a workbook of more than one sheet, a row of **sheet tabs** sits under the preview table, one
  per sheet of the file. Each tab says whether the template reads that sheet; a sheet the template
  declares is shown through its own layout and row filters, one it does not is shown raw.
- For a template that loads a balance, an **Account balance** card shows the balance that would be
  loaded and its date, where each figure was read from (*Read from «Saldo final»*, *Read from the
  last row of the Balance column*), and whether it adds up — **Adds up**, **Doesn't add up**,
  **Unchecked**, **No balance**, **Other currency**, or **Off** when the template does not update the
  balance. When it does not add up, the card names the row where the chain breaks and offers **Go to
  row N** and **Ask the AI Assistant**. The card is part of **every** preview — the editor, the
  upload-with-a-template dialog and Ingestion — and for **CSV and Excel as much as for PDF**: a
  spreadsheet's balance is reconciled exactly as a statement's is, and **Go to row N** works there
  too.

**What the preview shows is what the load does.** The preview runs the same parsing engine and the
same gate the real load runs, so a row the preview flags as blocking is a row that would stop the
file, and a clean preview means a clean load. The balance check runs here too, on the file in front
of you. Two things can only be judged by a real load of a real file: a PDF's column labels as
printed in *that* file, and the balance of *next* month's file — see
[PDF Statements](pdf-statements.md).

A preview reads one file at a time, and a file given to any of these screens must be **20 MB or
smaller**; a manual upload accepts at most 20 files at once.

### Correct the draft by describing the change
1. Open **AI assistant** from the toolbar. A dot on the button means there is a reply you have not
   read.
2. Type what is wrong in plain language — which column the real amount comes from, that a line is a
   total rather than a movement, that two columns are the wrong way round. Enter sends; Shift+Enter
   adds a line.
3. Your unsaved edits are saved first, so the assistant works on the draft you are looking at. The
   draft is rewritten and the screen repaints with the new version.
4. **Undo last** reverses the most recent exchange and puts the draft back as it was, including the
   markers on the fields it had touched. You can use it repeatedly.
5. Several problems offer **Ask the AI Assistant** beside them, which opens the assistant with the
   question already written for you.

Nothing the assistant does is published. The draft still has to be saved as a template by you.

### Publish the template, or publish it and load the files
Two buttons finish the job. Both need the draft to be free of errors and the reading confirmed.

1. **Save template** creates the template and leaves the files alone. They stay on Ingestion waiting,
   and you load each one later with **Process with template**. Use this when you want the format
   recognised from here on but are not ready to load what has already arrived.
2. **Save template and load file** creates the template *and* puts every waiting file of that format
   back into the queue. If those files arrived without an account or a country, a dialog asks for them
   first and lists the files it is about to load.
3. Either way you land back where you opened the draft from, and the outcome is confirmed on screen:
   *Template «name» saved*, or *Template saved and N files queued*.
4. From there it is an ordinary parse template. It appears on **Parse Templates** with an **✦ AI**
   badge, it has learned the shape of its sample file, and it recognises the next file of that format
   on its own.

While the buttons wait, the line underneath says exactly why — *«Value date» is missing*, *fix
«Amount»*, *confirm dates and amounts*, *fix 2 errors in Detection*, *save the draft to validate it*.
Every reason is a link to the place that fixes it.

**One error can be accepted instead of fixed.** When the only thing blocking the publish is that a
**PDF statement's balance does not add up**, saving offers you the choice: a dialog headed *The
file's balance does not add up* repeats the figures and warns that, saved anyway, *the template
carries no balance check: uploads of this format are no longer refused over the balance, and the one
the file prints is loaded as it is*. **Save anyway** publishes it; **Cancel** leaves it a draft. No
other error can be confirmed away, and confirming the balance lets nothing else through. See
[PDF Statements](pdf-statements.md).

### When a proposal fails
A draft that could not be filled in opens with a banner saying so and naming **the reason**, and the
draft stays editable. Three ways out sit side by side:

1. **Retry with AI** starts the proposal again from the same file.
2. **Complete by hand** drops you into the fields to finish the template yourself. A hand-finished
   draft saves like any other.
3. **Or choose an existing template** hands the file to a template you already have. The file goes back
   into the queue with that template and the draft is discarded.

The reason tells you which of the three is worth trying:

| What it says | What to do |
|---|---|
| The AI budget is spent | Retrying fails the same way. Wait for the budget to renew or have it raised; build the template by hand meanwhile. |
| The AI service failed · The AI took too long · Ingestion answered with an error | Passing problems. **Retry with AI**. |
| The proposal could not be validated | The file was harder than the platform could resolve. Retry once, then complete it by hand. |
| This looks like a balances file · This looks like a positions report | Deliberately not proposed for. Create the template by hand. |
| This client has no financial event type enabled that the AI can propose | Ask an administrator to enable the event types your organisation loads. No proposal can be made until one exists. |

A proposal that is interrupted part-way through is picked up again only a limited number of times.
After that it is marked as failed with *The AI took too long* and waits for you, rather than retrying
for ever. **Retry with AI** starts it afresh with a clean count.

### Discard a proposal
1. Click **Discard proposal** in the draft, or **Discard** on the **AI drafts** tab of Parse Templates.
2. The dialog names the draft and says how many files are attached to it.
3. Confirm. The draft and its conversation are deleted, and **the files it was holding go back to
   waiting for a template** on Ingestion. Nothing is lost and nothing is loaded: ask for another
   proposal, choose an existing template, or build one by hand.

A proposal still being written cannot be discarded. Wait for it to finish or to fail.

### Build a template by hand
Some files are never proposed for — a fixed-width text file, an XML message, a SWIFT MT message, a
balances or positions report — and sometimes you would simply rather start from the form.

1. Go to **Settings › Ingestion › Parse Templates** and click **New template**.
2. In **Upload a sample file**, pick a real file from the source. Treasury Hub pre-selects the **File
   type** from the extension.
3. Fill in **Basics**, then click **Next** through the sections. A section unlocks as soon as the ones
   before it are valid, so the optional ones open on their own once Basics, Settings and Fields are
   complete. Every section holds exactly what it holds in a drafted template — see
   [What each section of the editor holds](#what-each-section-of-the-editor-holds).
4. Open the **Preview** at any point and clear the **With errors** list.
5. Click **Create template** in the footer. The template is created active unless you turn the
   **Active** switch off in Basics.

### Test a file against the templates you have
1. On **Parse Templates**, click **Test with file**.
2. Drop the file into the dropzone. Nothing is stored and nothing is loaded — this screen only reads.
3. **Template detection** lists every template whose rules were evaluated, each with *n/m rules
   matched* and, rule by rule, whether it matched and why. The line above the list says what was
   decided: the template with the most matched rules wins, none matched all of its rules, or there is
   a tie to break by hand. Click **Use this** on any candidate to preview the file under it instead.
4. Read the preview exactly as you would in the editor — the same two tabs, the same counts, the same
   gate.

### Activate, deactivate, duplicate and delete
1. On **Parse Templates**, the **Active** switch on each row turns a template on and off.
2. **Duplicate** in the row's actions menu makes an editable copy named *<original> (copy)*. The copy
   is created **inactive** on purpose, so it never competes to read files until you have reviewed it.
3. **Delete** removes the template and everything in it (settings, fields, validations, mappings) and
   cannot be undone. It is refused while an email or SFTP ingestion rule still points at the
   template — change the rule first.
4. Every save increments the template's **revision**, so a template two people have open at once
   cannot be overwritten silently.

### Teach a template another file shape
A template learns the **format fingerprint** of every file it loads successfully, so a shape that
worked once is recognised on its own next time. You can also teach it from a sample — "recognise files
like this one" — and you can list the formats a template has learned and make it forget one.

If another of your templates already knows that exact shape, Treasury Hub does not refuse: it names
the templates that share it and asks you to confirm. Two banks' exports — or one provider's exports for
two countries — can legitimately look identical, and the declared rules (a file-name pattern, a
constant value in the file) are what tell them apart.

## Configuration

### Sections by file type
| File type | Sections the editor shows |
|---|---|
| **CSV** (and `.txt` / `.tsv` read as delimited text) | Basics · Settings · Pre-process · Row Filters · Extra Fields · Fields · Validations · Detection |
| **Microsoft Excel** | Basics · Settings · Row Filters · Extra Fields · Fields · Validations · Detection |
| **PDF document** | Basics · Settings · PDF page regions · Columns · Extra Fields · Fields · Validations · Detection |
| **SWIFT MT message** | Basics · Settings · Pre-process · Detection |
| **Fixed-width text** | Basics · Settings · Pre-process · Extra Fields · Fields · Validations · Detection |
| **XML document** | Basics · Pre-process · Detection |

Why they differ: Excel works on typed cells rather than on text, so pre-processing the raw stream has
nothing to act on. A PDF is read from the geometry of the page rather than from a stream, so it skips
pre-processing too and gains the two sections that describe the page instead; a PDF template set to
**one row per document** (an invoice rather than a statement) loses those two as well, because there
is no table to delimit and every value comes from extra fields. A SWIFT MT message has a fixed
structure, so there is nothing to map and nothing to validate field by field. Row filters apply to the
two tabular formats, CSV and Excel.

### Reading settings by format
- **CSV** — *File structure*: **Encoding**, **Delimiter**, **Quote char**, **Escape char**. *Header*:
  **Has header**, **Header row index**, **Skip rows before header**, **Skip rows after header**. *Value
  format*: **Date language** (it only translates month names such as `mar`), **Date format** (the
  day/month/year order and the separator — this is what decides how a date is read), **Decimal
  separator**, **Thousand separator** and **Trim values**. Both separators must be chosen before the
  template can be saved.
- **Microsoft Excel** — *Sheet & header*: the **Workbook sheets** table, which is where you say which
  sheets of the workbook the template reads — see
  [Read several sheets of one workbook](#read-several-sheets-of-one-workbook). A template that reads
  a single sheet keeps that sheet's **Has header**, **Header row index** and the two skip counts
  inline beside the table; one that reads several gives each sheet its own set. *Format &
  processing*: **Evaluate formulas**, **Detect native date cells**, **Date format**, and the
  **Decimal separator** and **Thousand separator** used when a number arrives as text.
- **SWIFT MT message** — **Encoding** and **Message type** (for example `MT940`). The rest of the
  structure is fixed by the standard, which is why this template needs no field mapping.
- **PDF document** — **Encoding**, **Date language**, **Date format**, **Decimal separator**,
  **Thousand separator**, **Trim values**, and the **one row per document** switch for documents that
  are not tables. Everything about where the table sits on the page lives in the PDF page-regions
  section — see [PDF Statements](pdf-statements.md).
- **Fixed-width text** — the file type exists and its detection rules work, but the Settings section
  offers no reading settings for it. In practice a fixed-width `.txt` is read as delimited text, or
  loaded under a template chosen for it explicitly.

**Dates written as a number.** Every **Date format** picker — the template's own in Settings, and a
field's **Format override** in Fields — also offers a **Unix timestamp** group: *Unix (seconds)* and
*Unix (milliseconds)*, with a **Time zone** list beside it that defaults to **UTC (default)**. A
column of plain integers is never read as a timestamp on its own: the format has to be chosen on
purpose. A value that would fall outside the years 1970 to 9999 is reported as unreadable rather than
guessed.

**A file with no date at all** is dated by the **Load date** transformation on its Movement date
field: *Every row takes the day the file arrived, in the time zone you pick (UTC if you pick none).*
It is the day the file reached Treasury Hub, not the day it was processed, and it is only worth using
when the file truly carries no date — a file that has one should always be read from it.

### Read several sheets of one workbook
Some providers deliver one workbook with the collections on one sheet and the payouts on another. An
Excel template reads as many sheets of that workbook as you declare, each with its own header row,
its own columns and its own event.

1. In **Settings**, the **Workbook sheets** table lists every sheet of the sample file, in the order
   the workbook holds them: *These are the sheets of the file. Switch on the ones the template must
   read; each is matched by its exact name or by its position. If a sheet that is switched on is
   missing, the file is not processed.*
2. Turn the **Read** switch on for each sheet the template must read. With no sample file loaded,
   **Add sheet** lets you declare one by hand instead.
3. Set **Match by** for each declared sheet — **Name** (its exact name) or **Index** (*Sheet N of the
   workbook*). A sheet matched by name keeps its position too, as a fallback if it is renamed.
4. **State in the file** reads **Found** or **Not in the file** for each one, and the footer
   summarises: *The template declares 2 sheet(s) · the sample file has 5.* and *Not read: …*
5. As soon as the template declares more than one sheet, each gets its own **Layout of <sheet>**
   block — **Has header**, **Header row index**, **Skip rows before header**, **Skip rows after
   header** — and every event, field and row filter must say which sheet it **Reads from**.
6. **Removing a sheet removes what reads from it.** The confirmation says how many events, fields and
   row filters go with it; they are not moved to another sheet.

Two rules follow:

- **A sheet you do not declare is ignored, and that is not an error.** *Extra sheets are ignored
  without an error: if the bank adds a new sheet, the template keeps processing the same way.*
- **A sheet you do declare has to be there.** When a declared sheet is missing from a file, nothing
  of that workbook is processed and the row names the sheet it could not find. In the editor the same
  problem reads *This template cannot process the file: sheet X is missing. Fix the name, match it by
  index, or remove the sheet from the template.*

**How a multi-sheet workbook loads.** Each declared sheet is loaded on its own, so one sheet that
fails does not take the others down with it. On [Ingestion Activity](ingestion-activity.md) the
workbook is a single row carrying an **n of m sheets** count; expand it for the **Workbook sheets**
panel, one line per sheet with its event, its status, its row count and its own actions. A workbook
where some sheets loaded and others did not reads **Partially loaded**, and the sheets the template
does not declare are listed as a note rather than an error.

**What the AI proposes for one.** Given a workbook, the assistant proposes a single template that
reads the sheets holding events and leaves out the ones that do not — a cover page, a summary, a
parameter list. It gives each event the sheet its rows are on instead of a discriminator column,
because a template that reads several sheets tells its events apart by the sheet. It never puts two
events of the same financial type on two sheets: a template reads each type once.

### Say where each balance figure is read from
A statement prints its balance in a different place in every bank's layout: a labelled line, a column
beside the movements, a figure in the header. The account-balance group lists **every balance field
separately**, each with the **Source** it is read from and its **Value in the sample**, so you can
check figure by figure what the template would load rather than trusting one number at the bottom.

| Field | What it is |
|---|---|
| **Closing balance** | The balance that is loaded for the account. |
| **Opening balance** | *It only reconciles the movements: it isn't loaded.* |
| **Balance date** | The day the closing balance belongs to. |
| **Currency** | The currency of the balance. |
| **Balance type** | Which balance it is — a statement's closing balance, for instance. |

Each field names its own way of reading the file, chosen like any other transformation:

- **Labelled row** — *finds the row whose label column says the given text and reads the value of
  another column of that same row.* You give the **Label column**, the **Label** (for example
  `FINAL BALANCE`), the **Value column** and the **Comparison**.
- **Movement row** — *takes values from a movement row of the file. A row prints the balance after
  its movement: for the opening balance, subtract that row's amount.* You pick the **Row** (first or
  last) and, where needed, an **Expression** that adds or subtracts other fields of that same row.
- **Opening balance** — *the statement doesn't print a closing balance: the opening balance is
  loaded.*
- **End or start of the period** — *uses the last day of the period the statement prints, or the day
  before it starts.* This is the usual source of the balance date.
- **Value of one of the file's extra fields** — for a figure read out of a banner line or, in a PDF,
  out of a region you drew.
- **Currency of the movements** — *takes the currency the statement's movements are in, for the
  account balance.* Where the movements carry no currency, the account's own currency is used.

A balance the template cannot read with certainty is left unread, with a note on the field, rather
than guessed: the movements still load and only the balance is left out. The same happens when the
file's balance column turns out not to follow its movements — *the balance this file prints is not
reliable: its Balance column does not follow the movements. The template will not load a balance.*

### When a load is refused over its balance or its currency
These checks run at load time on **every** tabular format — CSV, Excel and PDF alike — and the reason
is written out in full in the expanded row on [Ingestion Activity](ingestion-activity.md), with a
short version under the status pill.

- **The balance does not add up.** The rows read do not reconcile with the balances the file prints,
  under a template that was published with its balance proved. The row reads *The balance does not
  add up: the file prints X and the movements give Y (difference Z, row N). Nothing was loaded. Open
  it in the template's preview to see that row* — or the same sentence without a row when the break
  is in a total rather than part-way down. Nothing is inserted, and you choose what to do from the
  five options described in [PDF Statements](pdf-statements.md); they are the same for a spreadsheet.
  *(ERR-4038 for a CSV or Excel, ERR-4029 for a PDF.)*
- **The file is in a different currency from the account.** The currency the file states — in its
  rows, its balance, its amount cells or its header — is not the currency of the account it is being
  loaded into. The row reads *The file is in USD and the account «…» is in MXN. Nothing was loaded:
  choose the USD account or check the template*, or, when an email or SFTP rule chose the account,
  *change the rule's account for the next files*. Nothing is booked in a currency the account does
  not hold. *(ERR-4039)*
- A third, passing case is worth recognising: *the account's currency could not be checked right
  now, so nothing was loaded. Try again in a moment.* Nothing is wrong with the file; the load goes
  back into the queue on its own.

### How a file finds its template
A file that arrives without a template named for it is matched in order:

1. **The detection rules a template declares.** Which rules a template can carry depends on the file
   type:

   | Rule | What it checks |
   |---|---|
   | **Extension** | The uploaded file's extension, with or without the leading dot. |
   | **Filename regex** | An expression run against the whole file name. |
   | **Leading bytes or text** | A signature in the content, usually right at the start. |
   | **First line starts with** | The first line begins with a literal text, case sensitive. |
   | **Expected header** | The header row contains a given text (or the first rows, for Excel). |
   | **Anchor value** | An anchor value somewhere in the file's first 50 rows — for a header that is not on row 1. |
   | **Excel cell value** | One cell, by row and column, tested with an operator against a value. |
   | **Content contains** | A literal anywhere in the file's text, ignoring case. In a PDF it searches the text of the first pages. |
   | **XML namespace** | The XML declares a given namespace URI. |
   | **Format fingerprint** | The file's shape is one the template has learned. |

2. **Learned format fingerprints** — a shape the template has already read successfully.
3. **The same header**, cell for cell, in the same order and at the same row, as a template already
   reads. This resolves with a warning, because it is weaker evidence.

**Two modes decide how the rules are read.** In **Score** — the default for a template you create — the
rules compete with every other template's and the complete candidate with the most matched rules wins;
when no rule decides, the learned fingerprint and the matching header may still pick the template. In
**AllRequired** the rules *are* the definition: the template wins only when every one of its rules
matches, it outranks every Score candidate when it does, and it takes no part in the fingerprint and
header steps — so a learned shape can never skip, say, a file-name rule.

**A tie is handed to a person on purpose.** When two templates both match a file completely, nothing is
loaded on a guess: the file is parked on [Ingestion Activity](ingestion-activity.md) as *Needs
template* and waits for someone to choose. The same happens when no Active template recognises the file
completely — a template that matches only some of its rules may read the file wrongly, so none is used.

### One sheet design, two Excel formats
The same sheet design saved as `.xls`, `.xlsx` or `.xlsm` is three formats, and each keeps its own
template: a template is never stretched to a format it was not built for without you saying so.
Rather than telling you no template exists, Treasury Hub names the one that already reads that
design.

1. The file waits on [Ingestion Activity](ingestion-activity.md) as **Needs template**. Expand the
   row and the reason reads *This layout already has a template, but for .xlsx files. Your file is
   .xls and each format has its own template, so we do not apply it on its own. Use it with one
   click, or create one for .xls from «Actions».*
2. Below it, a card names the template with its format chip (*.xlsx format*), an **Active** badge and
   the line *Same sheet layout as this file*. **Use this template** opens the **Process with a
   template** dialog with that template already chosen.
3. In that dialog the candidates are grouped — *Matches this file*, *Same layout, other format*,
   *Partly match*, *Other templates* — so you can pick a different one instead. Choosing an
   other-format template shows a note rather than a warning: *This template is for .xlsx files. Your
   file is .xls. We will read it with that template's columns; if a row does not fit, you will see
   the error in the upload and can correct it.*
4. **Process with this template** puts the file back in the queue under it. Nothing is applied on
   your behalf and the template learns no new shape from it — each Excel format keeps its own
   template. If you would rather the format had one of its own, **Create template with AI** is still
   on the row's Actions menu.

This is an Excel courtesy only. A CSV's delimiter and a PDF's shape carry information of their own,
so those formats are never offered across each other.

### What a proposed template will never do
These are rules of the platform, applied to every draft after it is written and checked against the
real file. They are the reason a proposed template is safe to keep using on next month's files.

- **A template never stores a year.** When a file prints dates with no year, the template records
  *where* the year comes from, not what it is: the statement period read out of each file. Every
  month's file then gets its own year, and a year fixed in the template is refused outright. In a CSV
  or Excel file that period must be an extra field of the template; a PDF can also read it from the
  text of the page. If a file turns out not to print its period, the load stops and names the field
  rather than guessing.
- **A template never carries one holder's details.** An account number, bank account data, an
  identification number or a holder name taken from the sample is stripped out instead of being written
  into the template, because that template will go on to read every other account's files from the same
  bank. The same applies to the rules that recognise the file.
- **A statement is refused rather than booked to the wrong account.** If a template does fix an account
  number and a PDF statement prints a different one, the load is rejected and tells you to take the
  fixed account off the template.
- **An amount keeps the sign its column gives it.** A mapping that would throw the sign away is
  reported as an error and blocks saving, because charges would otherwise load as credits. Where a file
  carries money in and money out in separate columns, the draft says which it read as which, and why.
- **The currency is taken from the file, not asked of you.** It is read from the column header, from
  the amounts themselves, from the file or sheet name, or from the country of the upload — and the
  draft names the evidence it used so you can check it. Where the evidence is genuinely ambiguous it is
  left as a value for you to give instead of being guessed.
- **An identifier is never mapped from a column whose values repeat.** A reference two rows of one file
  can share does not identify an operation, and a file loaded under it would have every such row
  rejected. The draft leaves the external ID unmapped, lets the load derive one per row, and tells you
  which column it rejected and why. A running statement number is left out for the same reason: another
  account at the same bank prints the same numbers.

### What "Active" really controls
**Only an Active template is ever used to load a file.** That single rule covers every door into the
platform: automatic detection, the background worker that processes uploads, the manual **Process with
this template** choice on a parked file, the template picker in the upload dialog, and the email and
SFTP ingestion rules. Draft and Inactive templates are invisible to all of them; the editor is the only
place that can open one.

The consequence you will meet in practice: **if an email or SFTP rule points at a template that is
later switched off, its files stop loading and park instead.** Nothing is lost — they appear on
[Ingestion Activity](ingestion-activity.md) as *Needs template* — but no data comes in until you turn
the template back on or point the rule at another one. Check your ingestion rules before deactivating a
template.

**Template names are deliberately not unique.** Two templates may share a name, so a name is never what
identifies a template to the platform — its rules and its learned formats are.

### Let a channel park unknown files for a proposal
An email mailbox or an SFTP connection can hand the files no rule claims to a proposal instead of
dropping them.

1. Open the mailbox on [Email Ingestion](email-ingestion.md), or the connection on
   [SFTP Ingestion](sftp-ingestion.md).
2. Set **Files that match no rule** to **Park and propose with AI**. The alternative is **Ignore**.
3. Only CSV, Excel and PDF files are proposed for. Each parked file opens a proposal of its own, and
   the account and the country are chosen when you review it.

### Let a rule detect the template instead of naming one
An email or SFTP rule can be set to **✦ Automatic** instead of naming a template. Its files are matched
against the templates you already have; if none recognises a file, a proposal is made and the file
waits as **Pending review** on Ingestion. Note that a rule with no account in it leaves that choice to
whoever reviews the proposal, who must supply one before the files can load.

## Tips & good practices
- **Propose against the messiest sample you have**, not the tidiest. Footer totals, a blank sheet in
  the middle, a legal notice at the end: these are exactly what row filters exist for, and you want to
  see them in the preview before the file is real.
- **Read the notes, not only the errors.** A draft with no errors can still be reading the wrong sheet
  or the wrong column. The notes are where the platform explains what it decided and what it was least
  sure about.
- **Save the draft after every few changes.** Saving re-checks the draft against the real file, so the
  counters, the preview and the balance check all come back honest instead of stale.
- **Use the assistant for intent and the form for precision.** "The second amount column is the fee,
  not the amount" is worth saying in words; changing one date format is faster in the field itself.
- **Clear the *With errors* list in the preview before you publish.** It is the same gate the load
  runs, so clearing it here is the whole job.
- **Prefer Save template while files are still arriving.** The format starts being recognised
  immediately and you keep control of when the backlog is loaded.
- **The reviewer owns the result.** A proposal is a head start, not an answer: confirm the event type,
  the dates, the amounts and the account before you publish, because the template will keep loading
  files on those terms.
- **Discarding is cheap.** If a draft is far from right, discard it and start again from a cleaner
  sample — the files it was holding simply go back to waiting.
- **Give the template rules that identify the source, not the customer.** A file-name pattern or a
  title line is a good rule; an account number or a company name is not — it would make the template
  recognise one account's statements and ignore every other. For a format two providers share, add one
  cheap distinguishing rule rather than relying on the learned shape alone.
- **Duplicate before you experiment.** The copy is inactive, so you can rework it against the same
  sample while the live template keeps reading today's files.
- **When a source changes its format, edit the template instead of starting over.** Everything it has
  learned — including the shapes it recognises — stays with it.
- **Declare only the sheets that hold events.** A cover page, a summary or a parameter list is not an
  event, and leaving it undeclared costs nothing: undeclared sheets are ignored without an error,
  which is also what keeps the template working when the provider adds a sheet.
- **Think twice before matching a sheet by index.** A name survives the provider reordering the
  workbook; a position does not. Match by index only when the sheet's name changes every month.
- **Map Movement date to the date the business means.** It is the date everything downstream filters
  and reports on, so choose the value date over the booking date when the bank prints both, and reach
  for the **Load date** transformation only when the file genuinely carries no date.
- **Read the Account balance card before you publish, not just the field list.** It is where you see
  which figure the template would actually load, which label it came from, and whether it adds up.

## Related
- [AI Extraction](ai-extraction.md) — the alternative for a format you will only meet once.
- [File Import (CSV / Excel / PDF)](file-import.md) — uploading a file and what happens to it.
- [PDF Statements](pdf-statements.md) — how a PDF is read, the balance check, and why a PDF is refused.
- [Ingestion Activity](ingestion-activity.md) — where files wait for a template, where proposals are
  requested and tracked, and where load errors are explained.
- [Email Ingestion](email-ingestion.md) and [SFTP Ingestion](sftp-ingestion.md) — channels that name a
  template for incoming files, or park what they cannot place.
- [Financial Events](../03-data/financial-events.md) — the records a template creates.
- [Core concepts](../00-getting-started/03-core-concepts.md) — accounts, movements and events.
