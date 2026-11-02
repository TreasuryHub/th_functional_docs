# AI Extraction

> **Where to find it:** Integrations › Ingestion — on a file waiting for a template
> **Who uses it:** treasury operations, finance systems owners.
> **Permissions required:** create/edit on the data being loaded; see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Sometimes you have one statement to load and no intention of ever seeing its format again — a bank
you used once, a one-off report, a PDF that arrived outside your normal channels. Building a
[parse template](parsing-templates.md) for it is work you will never reuse.

**AI extraction reads that one file directly.** The AI pulls the movements out of it, checks them
against the balances the statement itself prints, and shows you the result beside the original page
before anything is loaded. No template is created and no existing template changes.

It is the other half of the choice a waiting file gives you: a template, which is reusable and
free to run again, or an extraction, which is immediate and costs AI budget each time.

## Key concepts
- **Extraction** — one AI read of one file. It produces movements, not a template.
- **Part** — a slice of a long file. The AI reads a file in parts, so progress reads *3 of 8
  parts*, and a part that already came out right is never paid for twice.
- **Correction round** — a pass the AI makes over its own output when the balance does not add up.
  Rounds are capped, and the review tells you how many it took.
- **Balance check** — the proof that nothing was dropped or duplicated: the movements are run
  against the opening and closing balances the statement prints. It is what makes an extraction
  trustworthy rather than plausible.
- **Incident** — a flag on an extracted row: the balance stops adding up here, the amount was not
  found on the page it should be on, or a sign was corrected from what the PDF prints.
- **AI budget** — the monthly token allowance. An extraction is estimated before it starts and
  stops rather than overrunning. See [AI usage](../10-admin-console/ai-usage.md).

## Before you start
- The file must be waiting on **Integrations › Ingestion** with **Needs template**.
- Your organisation needs AI budget left for the month. A long PDF can exceed the per-file ceiling
  on its own, and the screen says so rather than starting.
- A statement that prints no balances can still be extracted, but the check will only be partial —
  read [When the balance cannot be proven](#when-the-balance-cannot-be-proven) first.

## How to use it

### Start an extraction
1. On **Integrations › Ingestion**, expand the waiting file. Beside the template choice you are
   offered **Extract the movements with AI**.
2. Choose **Extract with AI…**. The dialog states the **pages**, the **estimated usage** in AI
   tokens — with the higher figure if parts have to be re-read — and roughly **how long** it will
   take.
3. If a template proposal is already running for this format, the dialog says so: extracting spends
   tokens separately from proposing.
4. Choose **Extract movements**. The row changes to **Extracting with AI** and counts its parts. You
   can leave the page; the status updates on the list.

If the monthly budget runs out midway the extraction **pauses** rather than failing. The parts
already read are kept, and **Resume extraction** finishes the rest once the budget renews.

### Review what it read
The row reaches **Review extraction**. Open it.

1. **Statement data** across the top: account, currency, period, opening and closing balance, and
   how many movements were read against how many the PDF appears to hold — *142 read · the PDF has
   ≈ 145 · ≈ 3 missing*.
2. The **Result** tab lists the movements with date, description, amount, balance, source and
   **incidents**. Filter to **Only with incidents** to go straight to what needs you.
3. The **Original file** tab shows the PDF page beside the table. Selecting a movement highlights
   the lines it came from; a page that is missing movements says so and offers **next page with
   missing movements**.
4. **How it was extracted** records the correction rounds and the tokens actually spent against
   what was estimated.
5. If the file has no account, choose the one the movements load into. If the account printed on
   the statement differs from the one chosen, the review says so rather than silently accepting it.

### Load the movements
1. Choose **Load *n* movements**.
2. Where something is unproven you are asked to confirm it explicitly — movements the PDF appears to
   hold that were not read, a balance that could not be proven, an account that does not match, or
   amounts the check flagged. Each is a separate confirmation.
3. Confirm. The movements load and the row returns to the list with its normal status. The review
   stays readable afterwards.

Loading is **blocked**, not merely warned about, when more than 5% of the movements are missing,
when the balances do not reconcile, or when bank movements have no account. Retry the extraction or
build a template instead.

### When the balance cannot be proven
A statement that prints only its closing balance, only its opening balance, or no currency cannot be
fully checked. The review says which case applies, and the movements can still be loaded — after a
confirmation that names what was not proven.

Where the statement does print balances that the AI misread, **Correct balances** lets you enter the
figures the PDF shows and run the check again. It asks for a reason, and the extraction is marked as
having been corrected by a person rather than by the AI.

### Discard an extraction
**Discard extraction** returns the file to **Needs template**, where you can choose a template,
ask for a proposal, or extract again. The tokens already spent are not recovered.

## Configuration
- **AI budget** is set per organisation and consumed per conversation, per person per day and per
  month. Administrators follow it on [AI usage](../10-admin-console/ai-usage.md).
- **A very long PDF** can need more tokens than one file is allowed. The screen says so and points
  you at a template, which reads a file of any length without spending AI.
- **Which event types** an extraction may produce follows the same tenant configuration as parse
  templates.

## Tips & good practices
- **Extract once, template twice.** If the same format turns up a second time, stop extracting and
  ask for a [template](parsing-templates.md): it costs nothing to run and it will keep working.
- **Read the incidents, not the row count.** A clean count with three flagged signs is worth more
  attention than a count that is three short and says so.
- **Use the Original file tab on anything you confirm.** The whole point of the side-by-side is that
  you can check a questionable amount against the page in one click.
- **Treat a partial balance check as a partial answer.** Without both balances, nothing proves a
  movement was not dropped — so either correct the balances or expect to spot-check.
- **Do not extract a format you already have a proposal for.** Both spend budget; the proposal is
  the one that lasts.

## Related
- [Ingestion](ingestion-activity.md) — where files arrive and wait, and where extraction is offered.
- [Parse Templates](parsing-templates.md) — the reusable alternative, and how a draft is reviewed.
- [PDF statements](pdf-statements.md) — how a PDF is read by a template, and the balance rules.
- [AI usage](../10-admin-console/ai-usage.md) — the budget this spends.
- [AI Assistance](../09-agents/overview.md) — the proposes-but-never-saves rule this follows.
