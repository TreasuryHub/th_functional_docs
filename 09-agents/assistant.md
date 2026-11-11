# Working with an Agent

> **Turn a sentence into a validated, ready-to-submit change**
>
> **Why it matters**
> - **Not a description, the change itself**: the records found, the fields worked out, the whole thing validated.
> - **Checked before you see it**: the proposal has already been run against the platform's own validation rules.
> - **You confirm, always**: reviewing and submitting stays with you, by design.

> **Where to find it:** Wherever a screen offers it — the Workflow Studio under
> **Reconciliation › Workflows**, and the ingestion format proposals under **Settings › Ingestion**
> **Who uses it:** Treasurers, finance teams, operations staff, and administrators
> **Permissions required:** None of its own — it acts with the permissions you already have. See
> [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Turn a sentence into a validated, ready-to-submit change: that is what a module's **agent** does. You say what you want; it finds the
records you named, works out exactly which fields would have to change, has that change checked
against the platform's own validation rules, and gives it back to you as a **proposal**.

What it hands you is not a description of a change — it is the change itself, prepared and ready to
submit. What it never does is submit it. Reviewing and confirming is always yours, and the platform
rejects a save that originates from the agent rather than from a person, independently of
anything the agent does. See
[the promise](overview.md#the-promise-the-agent-proposes-a-person-submits).

## Key concepts
- **Turn** — one message from you and the agent's reply. A turn can be an answer to a question,
  a change to what you are building, or an honest "that is not something this does".
- **Proposal** — the prepared change: summary, resolution trace, changed fields, validation. Nothing
  else is required to submit it.
- **Resolution trace** — which record each name in your sentence matched, named rather than
  numbered.
- **Changed fields** — the exact list of fields that differ from what is stored or from the draft you
  had before this turn.
- **Validation** — the result of having the owning area check the change without storing it, down to
  the individual field.

## Before you start
- Nothing to install or switch on. The agent appears inside the screens that use it.
- The records you will name need to exist. The agent resolves "Acme" or "Ana Torres" by
  searching — it cannot create a record that is not there, and it will not guess.
- Your organization needs allowance left on its monthly token budget. See
  [Token budgets](overview.md#token-budgets-are-a-hard-stop).

## How to use it

### Ask for a change
1. Open the screen that offers the agent — for example a reconciliation workflow in the
   **Workflow Studio**.
2. Type what you want in plain language: *"match pay-ins against bank movements, same amount, up to
   two days apart"*.
3. Wait for the reply. The agent searches for the records your sentence named, builds the change,
   and has it validated.
4. Read what comes back — see [What you see in a proposal](#what-you-see-in-a-proposal).
5. If it is right, **submit it** from the screen. If not, say what to change and go again.

### Refine what you are building
1. Stay in the same conversation. The agent keeps the work so far.
2. Say only what differs: *"the tolerance is too wide, make it 0.50"*, or *"do the same for
   pay-outs"*.
3. Check the **changed fields** on the reply — only what you asked for should be in that list. If
   something else moved, it is visible there before anything is saved.

### Ask a question instead of making a change
1. Ask it as a question: *"which fields can I match on?"*, *"why does this not validate?"*
2. The agent answers and **changes nothing** — the draft comes back exactly as it was.
3. Suggested follow-ups appear as buttons where the screen offers them; choosing one sends it as your
   next message.

### Answer a question it asks you
1. When something was not in your sentence, the agent stops and asks for it by name — *"a value
   the request did not give is needed: start date of 'Reconciliation workflow setup'"*.
2. Answer with that value: *"start on 1 October"*.
3. The agent keeps everything that had already resolved and completes the change. You do not
   repeat the original request.

## What you see in a proposal
Every proposal has the same four parts, and they are worth reading in this order:

| Part | What it tells you |
|---|---|
| **Summary** | One or two sentences in plain language describing what was prepared and whether it validated. Written for readability — if it ever disagrees with the fields below, the fields are what would be saved. |
| **Resolution trace** | How each name you used became a record: what was searched for, and which record matched, **by that record's name**. "Acme" → *Acme Corp S.A.* is checkable at a glance; an internal identifier is not. |
| **Changed fields** | The exact list of fields that would change, down to the individual entry in a list. A batch names the row, not just the list. |
| **Validation** | The result of the owning area's own checks, field by field: errors that block, and warnings that do not. |

Where a change still does not validate, you get it anyway, with the problems attached and clearly
marked as not valid, so you can finish it by hand rather than starting over.

## When it asks instead of guessing
The agent stops and asks you in three situations. In all of them nothing is invented and nothing
is saved:

- **Your sentence did not supply a value.** A required date, a required code — it asks for exactly
  that field, names the item it belongs to, and keeps everything else it had already worked out. In a
  batch it groups the question: *"items 3 and 5 have no end date"*, naming the items by name rather
  than by position.
- **A date conflicts with one already stored.** If you ask to complete something before the stored
  start date, it does not quietly move the other date to make yours fit. It tells you both dates and
  asks which one should give way. Your value stays untouched while you decide.
- **Two records share a display name.** It returns the candidates and asks which one you meant. It
  never picks one silently.

Answering is a normal next message in the same conversation.

## When it declines
- **Out of scope.** If nothing in the area you are working in does what you asked, the agent says
  so and returns nothing. It does not hand you the nearest available operation instead.
- **Beyond your permissions.** If the change would grant more than you are entitled to grant, you get
  a refusal with no proposal at all — the change is not shown, because a proposal on screen is
  something people confirm.
- **Budget exhausted.** When a token ceiling is reached the turn stops rather than degrading. Your
  draft is not lost.
- **Model provider unreachable.** AI assistance switches off; every screen and every manual flow
  continues to work exactly as before.

## Tips to get more value
- **One intent per message.** "Add the rule and rename the chain and change the tolerance" is harder
  to review than three turns, and the changed-fields list is longer than it needs to be.
- **Correct it with a fact, not a question.** *"0.50, not 1"* is applied; *"is 1 too much?"* is
  answered. Both are useful — just know which one you are sending.
- **Trust the trace over the summary.** If the resolution trace matched the wrong company, nothing
  further in the proposal is worth reading.
- **An incomplete draft is normal.** The agent builds only what you have actually stated and asks
  about the rest, rather than filling the gaps with defaults you did not choose.
- **Start a new conversation for unrelated work.** A conversation carries its own context and its own
  ceiling; mixing two pieces of work in one makes both harder to follow.

## Where to go next
- [AI Assistance — Overview](overview.md) — the safety promise, guardrails, budgets and audit.
- [Reconciliation workflows](../04-reconciliation/workflows.md) — the Workflow Studio, where you use
  the agent most.
- [File Import](../02-integrations/file-import.md) — parsing templates and the proposals the
  agent prepares for unrecognised formats.
- [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md) — what the agent can
  and cannot reach on your behalf.
