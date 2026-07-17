# Agent Builder & Execution Log

> **Availability:** `In Preview` 👁️
> **Where to find it:** Agents › Agent Builder
> **Who uses it:** treasurers and administrators who want to automate a recurring task; auditors reviewing what agents did.
> **Permissions required:** to be confirmed — expected to follow `AdminAndSettings.UserManagement` · Admin for building and publishing agents (see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md)).

## Overview
The **Agent Builder** will let you **create and configure your own AI agents by conversation** — you
describe, in plain language, what you want an agent to do, and the Customer Success agent (Alex)
wires it up, shows you a preview, and lets you refine it before you publish. It's the same
build-by-describing pattern as the [Workflow Builder](../07-workflows/overview.md), applied to
agents.

The same screen includes the **Execution Log** — a running record of everything your agents have
done: which agent, what action, on what, how long it took, and the result. Together they let you
**build automation without code** and keep a **full audit trail** of it.

This screen is **in preview** and not yet available. The description below explains the intended
experience; preview screens exist but the capability is not live.

> Any agent names, timings, and results shown in demos of this screen are **illustrative examples**,
> not your data.

## Key concepts
- **Custom agent** — an agent you define yourself: a name, a data source, a scope, a trigger, and
  the action(s) it should take.
- **Trigger** — the condition that makes an agent act (a schedule, or an event such as "a value
  moves more than a threshold").
- **Chain** — a sequence where one agent's output hands off to another (for example, detect an
  event → have a specialist review it → alert the right people).
- **Draft vs published** — a new agent starts as a **draft** you can test; it only starts working
  once you **publish** it.
- **Execution log** — the timestamped history of agent actions, with duration, result, and the
  impact on your data.

## What you'll be able to do (planned)

### Build an agent by conversation
1. Open **Agents › Agent Builder**.
2. In the chat, **describe the agent you want** in plain language — for example, "monitor our top
   counterparties and alert me when a risk metric rises sharply within a week."
3. The Customer Success agent proposes a configuration — **name, data source, scope, trigger,
   action, and frequency** — shown as a **preview** on the right.
4. **Refine it** by continuing the conversation (add a data source, add a trigger, add an action, or
   chain in another agent), or use the quick chips such as **Add data source**, **Add trigger**,
   **Add action**.
5. Choose **Test run** to see how it behaves on your data.
6. When you're happy, choose **Publish**. The agent begins working on its schedule.

### Review the execution log
1. Open the **Execution Log** on the Agent Builder screen (or from the [Agent Dashboard](agent-dashboard.md)).
2. Browse recent executions across all agents — **timestamp, agent, action, detail, duration,
   result, and user impact**.
3. Use it to confirm an agent did what you expected, investigate a warning, or provide evidence for
   an audit.

## Approvals
Agents **prepare and propose; people approve.** Anything an agent does that changes data or moves
money is routed for human sign-off before it takes effect — the same governance that applies to
[payments](../05-payments/approvals.md) and [reconciliation approvals](../04-reconciliation/overview.md).
The **Agents › Agent Approvals** screen (in preview) will be where you review and approve or reject
agent-initiated actions, and publishing a custom agent is itself an approval step. The guiding
principle is simple: **humans always approve.**

## Before you start
Nothing to prepare yet — this screen isn't live. When it arrives, having your
[data sources](../02-integrations/overview.md) connected and your
[roles and approval routing](../00-getting-started/04-roles-and-permissions.md) set up will let your
custom agents act safely within the right guardrails.

## Tips & good practices (for when it's live)
- Start from a **narrow, well-defined task** ("alert me when X"), test it, then expand — small
  agents are easier to trust and audit.
- Keep a **human approval** on anything that writes data or moves money; use agents to prepare the
  work, not to bypass controls.
- Use the **Execution Log** regularly to confirm your agents are behaving as intended.

## Related
- [AI Agents Overview](overview.md) — the agent concept, catalogue, and transversal capabilities.
- [Agent Dashboard](agent-dashboard.md) — monitor the agents you build.
- [Workflows](../07-workflows/overview.md) — the build-by-describing pattern and the actions agents orchestrate.
- [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md) — the guardrails agents inherit.

## In Preview
- 👁️ **Agent Builder** — create and configure custom agents by conversation, preview, test, and publish.
- 👁️ **Execution Log** — a full, timestamped audit trail of every agent action.
- 👁️ **Agent Approvals** — review and approve agent-initiated actions before they take effect. See
  your administrator.
