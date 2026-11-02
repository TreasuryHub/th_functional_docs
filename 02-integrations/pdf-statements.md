# PDF Statements

> **Where to find it:** **Settings › Ingestion › Parse Templates** (the PDF stages of the template editor); PDFs come in through **Integrations › Ingestion** or **Upload Statement**, where their outcome is also shown.
> **Who uses it:** treasury operations, finance team, finance systems owners.
> **Permissions required:** See [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Many banks still send a statement as a PDF. Treasury Hub reads those statements directly: it pulls the
**text layer** out of the document, works out from the **geometry of the page** where the table is,
which column is which, where each movement starts and where the statement ends, and turns the result
into movements — the same movements a CSV would have produced.

Two things follow from reading a PDF rather than looking at it. First, **this is not OCR**: a PDF whose
pages are photographs of a statement carries no text, so there is nothing to read. Second, because a
statement prints its own balances, Treasury Hub can check its work: the movements it extracted are
reconciled against the opening, closing and running balances the bank printed. What happens when they
do not reconcile is yours to decide — a template can be published with the mismatch accepted, and a
load that does not add up stops and offers you five ways forward rather than quietly storing figures
nobody can stand behind.

## Key concepts
- **Text layer** — the characters embedded in the PDF. If you can select and copy text in the document,
  it has one. A scan has an image and no text.
- **Layout analysis** — working out, from where the words sit on each page, which lines form the table,
  where its columns are split, which line is the header, which line starts a movement and which lines
  continue the one above.
- **Row anchor** — the column a movement starts in, normally the date column. Lines that follow a
  movement without an anchor value are its continuation and are merged into it.
- **Closing marker** — the line that ends the table (a closing-balance label, a final total, a banner).
  Everything after it is not a movement.
- **Balance check** — the reconciliation of the rows read against the balances the statement prints. A
  template either carries the check or it does not, and that is settled when the template is
  published: only a template published with the balance proved goes on checking every later file.
- **Statement period** — the dates the statement says it covers. It is what completes dates that print
  no year.
- **Continuation** — a second line of one movement (a long reference, an address). The editor shows a
  merged cell for it; two amounts merged into one cell are never silently added together.

## Before you start
- **Ask your bank for a PDF with selectable text.** If you can select and copy the figures in the
  document, Treasury Hub can read it. If the page is an image, it cannot, and no template will change
  that.
- Have one statement per file, for one account. A PDF that holds several accounts' statements one after
  the other has to be split first.
- Remove the password from a protected PDF before uploading it.
- Build the template on a statement that is typical, not on the shortest one you have — a month with no
  debits, a page break in the middle of a movement and a footer at the end are all things the template
  should have seen once.

## How to use it

### Build a template for a PDF statement
1. Go to **Settings › Ingestion › Parse Templates**, click **New template** and give it a sample
   statement. The file type is set to **PDF document** from the extension.
2. In **Basics** and **Settings**, name the template and set how its values are written: encoding, date
   language, **Date format**, **Decimal separator**, **Thousand separator**, **Trim values**.
3. In the **PDF page regions** stage, work page by page:
   - Choose which pages a set of regions applies to — **First page**, **Last page**, **Rest of pages**,
     or an explicit page range. A template is written from one example but has to read a statement of
     any length, so there is always a "rest of pages" region.
   - **Draw the data area** around the movements, and optionally **draw the header** over the column
     labels (one header per template).
   - **Add columns** by clicking on the data area to place the vertical splits between columns; drag to
     move one, right-click to remove it.
   - Set the **transaction-start expression** that says which lines open a movement, the **multi-line
     merge separator** for continuation lines, the **stop expression** that closes the table, and any
     **skip-row expression** for lines to ignore.
4. Watch the page overlay while you work: **every line that starts a movement is highlighted on the
   page**, and the extracted table is rebuilt beside it as you change the regions, splits and
   expressions. Page through the document to check that the highlighting holds on page 2 and on the
   last page, not only on page 1.
5. Use the **Columns** stage if text from a neighbouring column bleeds into one of yours — each column
   can be cleaned with an expression.
6. In **Extra Fields**, draw a region over the **statement period** (or over any other value printed
   outside the table, such as a reference or a report date). This is what lets dates that print only a
   day and a month be completed.
7. Map the fields, add validations and detection rules as for any template, then save and activate it.
   See [Parse Templates](parsing-templates.md).

### Read the balance check
A statement prints its own balances, so Treasury Hub can prove what it read. After the rows are
extracted they are reconciled, to the cent, in one of two ways:

- **Running balance** — the balance printed on each row must equal the previous one plus that row's
  amount, all the way down.
- **Opening plus movements equals closing** — used when there is no running-balance column, and only
  when every page of the document was read and every row produced an amount.

The balance card in the editor shows the result as one of four verdicts, with a fifth state before you
have saved the draft:

| Verdict | What it means | What to do |
|---|---|---|
| **Not checked yet** | The draft has not been saved since you last changed it. | Save the draft; the check runs against the real file and the verdict appears. |
| **Adds up** | The rows read reconcile with the printed balances. | Nothing. The template is proved against this statement. |
| **Does not add up** | They do not reconcile, and turning the signs around does not fix it. | Decide between fixing the template and publishing without the check — see below. |
| **Partial** | Balances were printed but could not be proved: some rows produced no readable amount, a row filter removed a line that looks like a movement, or the chain does not start at the printed opening or end at the printed closing. The card says how many pages were checked, or how many rows had no readable amount. | Look at the rows named in the note; usually one row is being read wrongly or filtered out. |
| **No balances** | The statement prints no opening balance, closing balance or balance per row, so there is nothing to check against. | Nothing. Not every statement prints them. |

### What blocks, and what only warns
The balance check matters at two separate moments, and they behave differently.

**When you publish the template.** A draft whose balance does not add up stops at the publish and says
so. If the balance is the **only** thing blocking it, you are offered the choice rather than a dead
end: a dialog headed *The file's balance does not add up* repeats the figures and warns that, saved
anyway, *the template carries no balance check: uploads of this format are no longer refused over the
balance, and the one the file prints is loaded as it is*. **Save anyway** publishes it; **Cancel**
leaves it as a draft. Every other error still blocks the publish outright, and confirming the balance
never lets one of them through.

**When a file is loaded.** What the template carries decides this, and the editor tells you which you
are about to get before you publish — *Once the template is saved, every load will check this
balance: a file that does not add up will not load*, or *If you save the template like this, loads
will not check the balance.*

- A template published with the balance **proved** keeps checking on every load. A later file whose
  rows stop reconciling is stopped rather than loaded with numbers that are wrong *(ERR-4029)*, and
  you choose what to do with it — see below.
- A template published with the mismatch confirmed carries **no** balance check. Its files are never
  stopped over the balance, and the balance the file prints is loaded as printed.
- **Partial** and **No balances** never block anything, at publish or at load. Neither does a balance
  column that turns out not to be a running balance at all: the movements load as read and no balance
  is stored.

When the rows do not reconcile, the most common cause is still the sign of the amount: a debit mapped
as a positive number breaks the chain from the second row on. Check the **Amount** mapping — a single
signed column, or separate debit and credit columns combined by a transformation — before you look
anywhere else.

### Decide what to do when a load does not add up
A file whose rows do not reconcile with the balances it prints is neither loaded nor thrown away. It
stops on [Ingestion Activity](ingestion-activity.md) as **Balance mismatch** with nothing inserted.
Expand the row and you get what Treasury Hub found — **Opening balance**, **Movements read**,
**Calculated closing balance**, **Printed closing balance** and the **Difference** — above the line
*Nothing was loaded. The balance the file prints does not match the sum of its movements. Choose what
to do in the row's «Actions» menu.*

The row's **Actions** menu offers five ways out.

1. **Edit template** — opens the template that read the file. Use it when the figures point at the
   template rather than at the statement: a debit column read as a credit, an amount column split in
   the wrong place, a totals line counted as a movement. Nothing is loaded.
2. **Reprocess file** — reads the same stored file again with the template as it now stands, and
   forgets the failure and any earlier balance decision. It is offered only once the template has
   actually changed; until then the entry reads *Edit the template first: as it is, reading the file
   again fails the same way.*
3. **Adjust balance manually** — opens the figures as an editable sheet. **Opening balance** and
   **Printed closing balance** are yours to correct, each marked **Adjusted** with a **Restore** link
   and the figure it had before; **Movements read** and the **Calculated closing balance** are shown
   and not editable. The verdict updates as you type — *It adds up: the opening balance plus the
   movements gives the closing balance*, or *It still does not add up: … off. Nothing will be loaded
   until it does.* A **Reason** is required. **Check and load** runs the check again with your
   figures, and only a statement that then adds up is queued: this corrects a figure the document
   printed badly or the platform misread, and it is never a way around the check. The closing balance
   you give becomes the balance stored for the account.
4. **Load without updating balance** — loads every movement and leaves the account's balance alone.
   A **Reason** and an explicit acknowledgement are required, because the movements become real bank
   movements that reconciliation and reporting use and cannot be removed afterwards.
5. **Create a new template for this file** — releases the file from its template and asks for a fresh
   one. Nothing is loaded and no balance is stored.

Options 3 and 4 sit together under the heading *They load the movements · cannot be undone*.
**Download file** is always available beside them.

An option that does not apply to your case is shown greyed out with the reason rather than hidden —
for example *Not applicable: the balance breaks at row N, not in a total. Fix the file or load it
without updating the balance* when the chain breaks part-way instead of at the total, or *This
template does not read the closing balance of the statement, so there is nothing to adjust.*

Whichever you choose, the row keeps the trail: *Closing balance adjusted by hand by <user>, on
<date>* or *Loaded without updating balance by <user>, on <date>*, with your reason and the figures
the refusal recorded.

**None of this is particular to PDFs.** A CSV or Excel statement that prints its balances is
reconciled the same way, stops the same way when it does not add up, and offers the same five ways
out — see [Parse Templates](parsing-templates.md). What is particular to a PDF is only how the
figures are found on the page.

### Dates that print no year
Many statements print `15/03` and leave the year to the letterhead. Treasury Hub never fills that in
from the clock: **the year always comes from the file itself**, either from the statement period you
captured as an extra field or from the period the document prints under its own labels. A period that
crosses New Year is handled correctly — in a statement covering 15 December to 14 January, the December
rows take the old year and the January rows the new one.

A template therefore never stores a year. If a file's dates print no year and the file says nothing
about its period, the load is refused and names the field that read nothing, rather than inventing a
date.

## Configuration

### When a PDF is refused, and what to do
These files are parked on [Ingestion Activity](ingestion-activity.md) as **Needs template** with the
reason shown on the row. For most of them the only action on the row is **Download**, because no
template can rescue the file.

| What the row says | What it means | What to do |
|---|---|---|
| **No text layer** | The pages are an image — a scan or a photograph. There is nothing to read. | Ask the source for a PDF with selectable text, or for a CSV or Excel export. |
| **Text cannot be read** | There is a text layer, but the fonts do not map their shapes to characters. | Same: ask for a readable export. |
| **No table of movements found** | The pages read hold no table, or the lines with amounts carry no date (a movement needs one), or they print dates in a form the platform does not read yet. | Check that it really is a statement of movements. If the dates look ordinary, send the file to support — the example is recorded on the row. |
| **No movements in the pages read** | A long document whose first and last pages hold no movements. | The file is not incompatible: a template written for that format reads it, so build or choose a template for it. |
| **Several accounts in one file** | The PDF holds the statements of two or more accounts one after the other. A template reads one account. | Download the file and split it into one statement per account, or ask the bank to send them separately. |
| **Password-protected** | The document is encrypted. | Remove the password and upload it again. |
| **Damaged or not a valid PDF** (including a file of zero bytes) | The file cannot be opened. | Get a fresh copy from the source. |
| **A report of positions, not of movements** | An investment or holdings report (funds, term deposits): it lists positions, which are not movements. | Nothing to load. Positions are not statement movements. |
| **Took too long to analyse** | Not the file's fault. | Try again, or upload a smaller file. |

Two things are **warnings**, not refusals. A PDF whose text is the invisible layer an OCR tool added to
a scan is read, with a note that the characters are the OCR's and are worth checking. A statement whose
table continues on the next page with *different* columns (a statement wider than its page) is read
using the columns of the first page only, with a note to check the amounts — ask for the statement in a
narrower format.

### A statement with no movements is "No data"
A month in which nothing happened is not an error and not a template problem. A statement that prints
its header and no rows, or whose only lines are balances, zeros or a "no movements" message, is
recorded as **No data**: nothing is loaded, nothing is parked, and nothing is waiting for you. It never
asks for a template.

### Load refusals you must act on
Once a template exists, a few checks run at load time that the editor can only report. Each one stops
the file with nothing inserted, rather than loading numbers that are wrong. They appear on
[Ingestion Activity](ingestion-activity.md).

- **The document has too many pages.** A load reads up to **3,000 pages**; above that it is refused
  before any page is read. Split the file. *(ERR-4027)*
- **The columns have moved since the template was built.** The labels printed over the mapped columns
  are no longer the ones the template was made with — the bank renamed a column, swapped the debit and
  credit headers, or changed the layout. The row names the first column that moved, the label expected
  and the label found. Open the template, redraw the splits and re-map that column against a current
  statement. *(ERR-4028)*
- **The balances do not reconcile**, under a template that was published with its balance proved. The
  row is recorded as **Balance mismatch** and gives the expected and computed figures, their
  difference, and — when the break can be placed — the movement and the page where the chain breaks.
  The number it quotes is the movement's own position among the movements the template read, counting
  from one; a break that cannot be placed on a single movement deliberately names none rather than
  blaming the first. Almost always a sign or an amount column read wrongly. See
  [Decide what to do when a load does not add up](#decide-what-to-do-when-a-load-does-not-add-up).
  *(ERR-4029)*
- **Real movements fall outside the template's regions.** Lines that look like movements — a date and an
  amount where the template starts a row — were left outside every page region, so the file would have
  loaded *Completed* with fewer movements than it holds. The row says how many lines and on which page.
  Extend the page regions (usually the "rest of pages" one) to cover them. *(ERR-4032)*
- **Dates with no year, and nothing in the file to complete them.** The template completes its dates
  from the document or from an extra field, and this file printed neither. The row names the field that
  read nothing. Either the statement is unusual — check it prints its period where the template looks —
  or the extra field's region needs widening. *(ERR-4034)*
- **The file belongs to a different account.** The template has an account number fixed into it, and
  this statement prints other accounts and not that one. Loading it would book another account's
  movements to yours. Take the fixed account number out of the template: the account of a load comes
  from the upload, so one template can read every account of the same bank. *(ERR-4035)*
- **The amounts are in a different currency than the template fixes.** The template fixes a currency
  (chosen for the example it was built from) and this statement prints its amounts with another one.
  Either load the file under a template for that currency, or stop fixing the currency and read it from
  the file. A plain `$` with no other evidence says nothing and loads normally. *(ERR-4036)*
- **The statement is in a different currency from the account.** Whatever the template says, the
  currency the file states is not the currency of the account it is being loaded into: *The file is
  in USD and the account «…» is in MXN. Nothing was loaded: choose the USD account or check the
  template.* Nothing is ever booked in a currency the account does not hold. This check applies to
  every format, not only to PDFs. *(ERR-4039)*

The codes in brackets are there only so you can quote one to support; the row always explains itself in
words.

### Limits
- **File size:** 20 MB per file, like any upload; a manual upload takes at most 20 files at once.
- **Pages per load:** up to 3,000. Above that the file is refused before it is read.
- **Analysis:** when a template is being worked out for a long document, the first 5 and last 2 pages
  are analysed, extended up to 60 pages when nothing is found, and at most 3 tables are kept. A real
  load reads every page.
- **Editor:** the page viewer fetches up to 10 pages per request as you move through the document.

## Tips & good practices
- **Check in the editor that the page overlay highlights every movement**, on page 1, on a middle page
  and on the last page. A region drawn on page 1 alone is the usual cause of a later refusal for rows
  left outside it.
- **Keep the balance check if you possibly can.** It is the cheapest proof you have that the template
  reads the statement correctly, and it is the one check that catches a sign error silently flipping
  half your movements. Publishing with the mismatch confirmed turns it off for every future file of
  that format, so do it when the *statement* is the odd one, not when the template is.
- **Prefer Adjust balance manually over Load without updating balance** when one printed figure is
  plainly wrong. Adjusting re-runs the check, so the file is only loaded once it adds up; loading
  without the balance accepts movements nobody has proved.
- **Draw the statement period as an extra field even when this month's dates carry a year.** The next
  month's may not.
- **Never fix an account number, a tax id or a holder name into a PDF template** — neither as a value
  nor as a detection rule. It ties the template to one customer and makes it refuse, or mis-book, every
  other statement of the same bank.
- **Prefer a machine-readable export when you can get one.** A CSV or Excel statement has no geometry to
  go wrong; a PDF template is worth building when the PDF is all the bank will send.
- **Re-check a template after a bank redesigns its statement.** The column-label check will refuse the
  file rather than mis-read it, so you will know — but you will know at load time.

## Related
- [AI Extraction](ai-extraction.md) — reading a PDF directly when its template no longer fits.
- [Parse Templates](parsing-templates.md) — the AI assistant that drafts a template, the editor and
  the template lifecycle.
- [File Import (CSV / Excel / PDF)](file-import.md) — uploading files and the outcomes they end in.
- [Ingestion Activity](ingestion-activity.md) — where a parked or failed PDF waits, and how to resolve it.
- [Bank Statements](../06-reporting/bank-statements.md) — the statement upload and processing flow.
- [Email Ingestion](email-ingestion.md) and [SFTP Ingestion](sftp-ingestion.md) — getting statements in
  without uploading them by hand.
