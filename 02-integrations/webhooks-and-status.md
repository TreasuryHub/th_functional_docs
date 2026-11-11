# Webhooks & Integration Status

> **React to events instantly and spot a broken feed before it hurts**
>
> **Why it matters**
> - **Downstream systems act immediately**: events are delivered the moment they happen, not on the next poll.
> - **Health at a glance**: what is connected, when it last synced, its uptime, and a link to its logs.
> - **Find the silence**: a feed that stopped shows here before a missing figure turns up in a report.

> **Where to find it:** Integrations › Webhooks · Integrations › Status
> **Who uses it:** finance systems owners, IT, administrators, treasury operations.
> **Permissions required:** administrator to configure; see [Roles & Permissions](../00-getting-started/04-roles-and-permissions.md).

## Overview
Two tools help you run integrations in real time and keep them healthy:

- **Webhooks** deliver events the moment they happen — so external systems can react to activity
  in TreasuryHub, and TreasuryHub can receive real-time pushes from other systems.
- **The Integration Status board** shows the operational health of every connection at a glance:
  what's connected, when it last synced, its uptime, and a link to its logs.

Together they answer two questions: "did that happen yet?" and "is everything still working?"

## Key concepts
- **Webhook** — an automatic notification sent between systems when an event occurs, instead of one
  side repeatedly asking "anything new?". Webhooks can be **inbound** (a system notifies TreasuryHub)
  or **outbound** (TreasuryHub notifies a system).
- **Event** — the thing that triggers a webhook (for example, data received or a status change).
- **Status board** — the list of your connections with a live health indicator for each.
- **Last sync** — when a connection last successfully exchanged data.
- **Uptime** — the proportion of a recent period a connection was healthy.
- **Logs** — the detailed record of a connection's activity, for troubleshooting.

## Before you start
- For webhooks, know which events you want to send or receive and, for outbound webhooks, the
  destination your system exposes.

## How to use it

### Set up a webhook
1. Open **Integrations › Webhooks**.
2. Add a webhook and choose whether it is **inbound** (received by TreasuryHub) or **outbound** (sent
   by TreasuryHub).
3. Select the **event(s)** that trigger it and, for outbound, the **destination** and security
   settings.
4. Save and **test** it, then confirm the event was delivered.

![Integration Status board listing each connection with status, last sync, uptime, and a Logs link](../assets/screenshots/integration-status-board.png)

### Monitor connection health
1. Open **Integrations › Status**.
2. Review each connection's **status**, **category**, **account/entity**, **last sync**, and
   **uptime**.
3. Sort or filter to find any connection that is degraded or hasn't synced recently.
4. Open a connection's **Logs** to investigate an issue in detail.

## Configuration
- **Webhook events & destinations** — choose which events fire and where they go.
- **Status columns** — adjust the columns shown on the board (for example via **Columns**) to focus
  on what matters to you.

## Tips to get more value
- Check the **Status** board as part of your routine — catching a connection that stopped syncing
  early prevents gaps in your position.
- Use **outbound webhooks** to keep downstream systems in step without them polling TreasuryHub.
- When a connection looks unhealthy, start from its **Logs**, then cross-check
  [Ingestion Activity](ingestion-activity.md) for the affected data.

## Where to go next
- [Integrations Overview](overview.md) — all connectors and channels.
- [Ingestion Activity](ingestion-activity.md) — item-level view of what was ingested.
- [Inbound APIs](inbound-apis.md) and [Third-party APIs](third-party-apis.md) — the integrations these tools monitor.
- [Alerts](../08-alerts/alerts.md) — where integration failures also surface.
