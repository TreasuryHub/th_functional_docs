# AI Assistance — Overview

> **Describe the change in plain language; the AI prepares it and you approve it**
>
> **Why it matters**
> - **An agent per module**: each one knows its records, its operations and the rules a change must satisfy.
> - **Prepared, never submitted**: what comes back is a proposal to review, and the platform refuses a save that did not come from a person.
> - **Human in the loop: approval on every agent action.**
>
> *For the CFO: automation arrives with its control framework attached, rather than as an exception to it.*

> **Where to find it:** Reconciliation › Workflows (Workflow Studio) · Admin Console › AI usage
> **Who uses it:** Treasurers, finance teams, operations staff, and administrators
> **Permissions required:** None of its own — the agent works with the permissions you already
> have. The **AI usage** screen is administrator-only. See
> [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Describe the change in plain language and approve what comes back: TreasuryHub gives **each module
its own agent**, and you work with it on that module's own screens.
An agent knows the records its module holds, the operations it allows, and the rules a change to
it must satisfy — so what it prepares is already shaped to that module's own rules.

You describe what you want in plain language; that module's agent works out which record you mean,
what would have to change, and whether that change is valid — then hands the result back to you as a
**proposal** to review.

It does not save anything. Every change an agent prepares is checked against the same validations
the screens use, shown to you field by field, and only takes effect when **you** submit it. That
single rule is what makes it safe to let an agent touch treasury data at all.

## The promise: the agent proposes, a person submits
This is the most important thing to know about AI on TreasuryHub, and it holds everywhere the
agent appears:

- **The agent is never given the ability to save.** The tools it is offered are read-only ones
  and a check-this-for-me one. The tools that write are not withheld from it by instruction — they
  are never put in front of it in the first place.
- **The platform refuses an AI-originated save independently.** Even if something went wrong inside
  the agent and a save were attempted, the request is rejected before it reaches the module that
  would store it. The two controls are separate on purpose, so neither has to be trusted alone.
- **Confirming is a deliberate act.** You read the summary, you read the changed fields, and you
  press the button. Nothing happens on your behalf while you are not looking.

The practical consequence, and the one your auditors will ask about: **the AI layer cannot move
money and cannot change a live configuration.**

## Key concepts
- **Agent** — the single conversational helper. It interprets what you ask and produces a change
  that is valid against the platform's existing rules; it does not have a personality, a queue of
  its own, or work it performs unattended.
- **Proposal** — a prepared change the agent hands back for you to review: a plain-language
  summary, the records it matched, the fields that would change, and the validation result.
- **Resolution trace** — the part of a proposal that shows how a name in your sentence became a real
  record: what it searched for, and which record it matched, shown by that record's name rather than
  by its internal identifier.
- **Conversation** — a thread of messages about one piece of work. The agent remembers what has
  been agreed so far within it, so a follow-up can be a fragment ("make it 0.50 instead").
- **Token budget** — the ceiling on how much AI work can be done, counted per conversation, per
  person per day, and per organization per month. See
  [Token budgets](#token-budgets-are-a-hard-stop).

## What the agent can reach
The agent does not have general access to the platform. It can only work on the areas that have
**published what they can do and how a change to them must be validated**. Three areas have done so:

| Area | What the agent can prepare there |
|---|---|
| **Reconciliation workflows** | A complete reconciliation workflow — its entry conditions, chains, rules, filters and matching criteria — built by conversation in the Workflow Studio. |
| **Ingestion formats** | A proposed mapping template for a file that arrived in a format nobody has set up yet. |
| **Administration** | Organizations, people, roles and permissions — the records behind [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md). |

The list is deliberately short and grows one area at a time. Capability is added by an area of the
platform **exposing its own operations and its own validations** to the agent — never by
creating another agent. That is why the agent behaves the same way in every area, and why a new
area arrives with the same guardrails as the first one rather than its own interpretation of them.

## Where you meet it
- **Workflow Studio** — a chat beside a reconciliation workflow. You describe the workflow you want
  and refine it turn by turn; the diagram and the underlying document update as you go, and saving
  is yours. Reached from **Reconciliation › Workflows**, on **New** or **Edit**. See
  [Reconciliation workflows](../04-reconciliation/workflows.md).
- **Ingestion format proposals** — when a file arrives in a format the platform does not recognise,
  the agent proposes a mapping template for it, which someone then reviews and accepts. The file
  may have arrived with nobody present — by email or SFTP — so the proposal waits for a person
  rather than applying itself. See [File Import](../02-integrations/file-import.md).
- **AI usage (Admin Console)** — where an administrator follows how much of the month's allowance
  the organization has used, how much is left, when it resets, and which areas and people the usage
  came from.

Each of those is covered in depth on its own page; the descriptions here are deliberately short.

## Guardrails
- **It cannot invent an identifier.** When your sentence names a counterparty, a person or an
  account, the agent has to find that record first. The values it is allowed to put into a change
  are narrowed to the ones those searches actually returned, so a plausible-looking identifier that
  nobody looked up cannot be produced.
- **It is never offered the tools that write.** It reads, and it asks the owning area to check a
  draft without storing it. There is no path from the agent to a save.
- **A request beyond your own permissions is refused, not proposed.** If what you asked for would
  grant you or someone else more than you are entitled to grant, you get a refusal and no proposal at
  all. A proposal is something a person is asked to confirm, and a request that looks reasonable on
  screen tends to get confirmed — so it is never shown.
- **It declines rather than returning the closest match.** If nothing in the area you are working in
  does what you asked, it says so and returns nothing. It does not substitute a related operation or
  a similar value.
- **It never marks an unverified change as valid.** If a change still fails validation after the
  agent has tried to correct it, you get the change with the errors attached, plainly labelled as
  not valid — never presented as ready.
- **If the model provider is unavailable, every manual flow keeps working.** AI assistance switches
  off and the screens behave exactly as they did before. No business process on TreasuryHub depends
  on the model being reachable.

## Token budgets are a hard stop
AI work is metered in **tokens**, and the ceilings are enforced as a stop rather than a slowdown:

- **per conversation** — a single thread cannot run away;
- **per person per day** — one person cannot consume the organization's allowance;
- **per organization per month** — the overall ceiling, which resets at the start of each month.

When a ceiling is reached the turn stops. You are told, nothing is saved, and the work in progress is
not lost — you pick it up again once the ceiling resets or an administrator raises it. The three
ceilings are counted independently, so exhausting one does not consume the others.

Administrators follow consumption against the monthly ceiling on the **AI usage** screen in the
[Admin Console](../10-admin-console/overview.md), which also shows usage per area and per person.

## Language
Replies come back in **the language of the screen you are on**. The agent does not try to guess
your language from what you type — short follow-ups like "ok" or "that one" are far too ambiguous for
that, and a reply that changes language mid-conversation is worse than one that is consistently in
the language you chose. If you switch the platform's language, the next message is answered in the
new one.

Your own words are never translated inside a change: text you dictate into a field is carried through
exactly as you wrote it.

## Audit and data handling
- **Every AI-originated call is stamped** with the fact that it came from the agent, which person
  it acted for, which conversation it belonged to, and which tool it used. So the question an auditor
  asks — *was this done by a person, or suggested by the system?* — is answerable from the record
  rather than reconstructed.
- **Conversations and their turns are kept for 24 months**, so what the agent proposed remains
  reviewable long after the change itself was made.
- **The agent acts with your permissions, never its own.** It cannot see or do anything you could
  not see or do yourself, and a permission revoked from you is revoked from it at the same moment.
- **Reads are narrow by design.** What is sent to the model to ground a change is limited to the
  fields needed to tell one record from another — a name and a status, not balances, limits or bank
  details.
- **No keys, no inbound exposure, no training.** The connection to the model runs outbound only, over
  a private connection inside TreasuryHub's own cloud tenancy, authenticated without API keys. Your
  data is not retained by the provider for training, and the agent is the single point through
  which anything leaves at all.

## Tips to get more value
- **Say what you want, not where it lives.** "Reconcile pay-ins against the bank statement" works
  better than hunting for the screen that does it.
- **Read the changed-fields list, not just the summary.** The summary is written to be readable; the
  field list is the change. If the two ever disagree, the field list is what would be saved.
- **Answer its questions rather than restarting.** When the agent asks for a missing value, the
  work it has already done is kept — a one-word answer finishes it, whereas a fresh request starts
  from nothing and costs more of the budget.
- **Keep your reference data clean.** The agent resolves names to records by searching. Two
  counterparties with the same display name means it has to stop and ask you every time.

## Where to go next
- [The Agent](assistant.md) — how a request turns into a proposal, and what you do with it.
- [Reconciliation workflows](../04-reconciliation/workflows.md) — the Workflow Studio in depth.
- [File Import](../02-integrations/file-import.md) — parsing templates and the formats the agent
  proposes.
- [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md) — the permissions the
  agent inherits from you.
- [Admin Console](../10-admin-console/overview.md) — where the **AI usage** screen lives.
