# Deployment, Availability & Continuity

> **Availability:** `Available` ✅ (SaaS is the default; on-premises available; specifics vary by contract)
> **Where to find it:** platform-wide assurances — arranged with the Treasury Hub team and your contract.
> **Who uses it:** IT, security, risk, and procurement teams evaluating or operating Treasury Hub;
> useful assurance for treasurers and administrators.
> **Permissions required:** none to read; deployment and continuity arrangements are set with the
> Treasury Hub team.

## Overview
This page explains, at a customer-assurance level, **how Treasury Hub is delivered, how fast and
reliable it is, how your data quality is protected, and how your data is backed up and recovered**.
It answers the questions IT and risk teams ask before and during a rollout — without going into
infrastructure internals. Specific figures below are **platform targets**; the exact commitments for
your organization are confirmed in your contract and design workshops.

## Key concepts
- **SaaS** — Treasury Hub hosts and manages the platform in the cloud; you just sign in.
- **On-premises** — Treasury Hub runs inside your own infrastructure, for regulatory or compliance
  requirements.
- **Data residency** — the region(s) where your data is stored, to meet local requirements.
- **SLA (Service Level Agreement)** — the performance and availability targets Treasury Hub commits
  to.
- **RPO / RTO** — **Recovery Point Objective** (how much recent data could be lost in a disaster,
  measured in time) and **Recovery Time Objective** (how quickly service is restored).
- **DR (Disaster Recovery)** — a standby copy of production that takes over if the primary fails.

## Deployment models
Treasury Hub offers the same functionality and quality across delivery models — you choose the one
that fits your infrastructure and regulatory needs.

| Model | Summary | Managed by |
|---|---|---|
| **SaaS (default)** | Multi-tenant cloud with logical isolation per organization; updates, patching, monitoring, and backups handled for you; onboarding in minutes. Multi-region for data residency. | Treasury Hub |
| **On-premises** | Runs inside your infrastructure and network. In the initial release there are no public-facing interfaces; vendor support is via secure VPN; external data access flows through your API gateway. Treasury Hub ships signed release packages that you deploy. | You (Treasury Hub provides releases, runbooks, and support) |
| **Hybrid** 👁️ | Sensitive data kept on-premises while selected AI/analytics services run in a secured cloud, with only authorized data replicated. In preview. | Shared |

### Environments
A typical delivery uses separate environments so changes are validated before reaching production:
**Development** and **Testing** (Treasury Hub), **UAT** for your functional sign-off (shared), and
**Production** plus **Disaster Recovery** (managed by Treasury Hub for SaaS, or by you for
on-premises).

### Release management (on-premises)
- **Signed releases** — each release includes checksums and a digital signature so integrity can be
  verified before deployment.
- **Change management** — releases are coordinated with your change-control process (CAB).
- **Rollback** — a documented rollback procedure covers post-deployment issues.
- **Cadence** — typically one planned release per month, aligned to your maintenance windows.

## Performance & availability
Treasury Hub is designed for high transaction volumes with responsive screens. Illustrative platform
targets:

| Area | Target |
|---|---|
| Standard screens (balances, positions, transactions) | ≤ 2 seconds |
| Analytics queries (forecasts, risk, cross-entity reports) | ≤ 5 seconds |
| Full page load | ≤ 3 seconds |
| Interactive actions (clicks, filters, toggles) | ≤ 1 second |
| Search results | ≤ 2 seconds |
| Peak transaction throughput | ~10,000 transactions/min |
| Uptime target | 99.9% (≤ ~8.76 hours unplanned downtime/year) |

How this is achieved (functionally, not the internals):
- **Scales out** by adding capacity rather than relying on ever-larger servers, so performance holds
  as your volumes grow.
- **Heavy operations run in the background** — bulk imports, report generation, and risk
  calculations don't block the screens you're using.
- **Redundancy and automatic failover** keep the service available if a component fails.
- **Continuous health checks and proactive alerting** let issues be caught early.
- **Planned maintenance windows** are scheduled and communicated in advance.

> ⚠️ **To be confirmed by Treasury Hub.** The figures above are platform targets. Your committed SLAs
> (uptime, response times, throughput) and any credits are defined in your contract.

## Data quality & governance
Reliable treasury decisions depend on clean data, so Treasury Hub validates, cleanses, and enriches
data at every step from ingestion to reporting.

- **Processing modes** — **real-time** for critical items (bank statements, payments, alerts),
  **batch** for large or scheduled datasets, and **hybrid** (data arrives immediately, full
  enrichment runs in cycles).
- **Validation on ingestion** — data is checked against the expected schema and your business rules
  (valid currencies, amount ranges, required fields, date formats), and referenced entities
  (account, counterparty, currency) must exist. Items that fail go to an **exception queue** with the
  reason, for review.
- **Cleansing & normalization** — duplicates are detected, and currencies (ISO 4217), dates
  (ISO 8601), and BIC/IBAN are validated and standardized; counterparties and banks are normalized to
  a master catalog.
- **Enrichment** — transactions are automatically categorized, tagged, and cross-referenced to
  related entities (invoice → payment → reconciliation).
- **Quality reporting** — a **quality score per data source**, an **exception dashboard** with aging
  and priority, trend analysis over time, and alerts when a source's quality drops below a threshold.

### Data retention & privacy
- **Retention policies** are configurable by data type and regulation (e.g. 1, 3, 5, 7 years, or
  custom).
- **Right to erasure** and **data anonymization** support GDPR (Art. 17) and equivalent local
  regulations.
- **Data classification** tags sensitive data so appropriate controls are applied.

## Backup, recovery & continuity
Your data is protected by automated backups, tested recovery, and disaster-recovery planning.

- **Automated backups** — on a configurable schedule (continuous transaction logs, daily full
  snapshots, weekly full + archival), using incremental backups between full snapshots.
- **Encrypted backups** — all backups are encrypted at rest (AES-256); keys are held by you
  (on-premises) or by Treasury Hub (SaaS).
- **Geographic redundancy** — copies are held in a secondary location to protect against local
  disasters.
- **Recovery objectives** — typically **RPO ≤ 1 hour** and **RTO ≤ 4 hours** for production
  (configurable by environment).
- **Point-in-time and granular recovery** — restore the database to any point within the retention
  window, or restore specific items (a single tenant, table, or date range) without affecting the
  rest of the system.
- **Restore testing** — restores are tested periodically (at least quarterly) with data-integrity
  verification.
- **Disaster recovery** — a DR replica in a secondary site (on-premises) or alternate region (SaaS),
  with continuous or periodic replication, planned **DR drills** (at least annually), a documented
  failover procedure, and a **post-incident report within 10 business days** of a DR event.

### Historical data
Older data moves through a lifecycle — **Active → Warm archive → Cold archive → Deletion** (after
legal retention) — to control cost while keeping archived data accessible for queries and audits
(with higher latency). Archival always respects minimum-retention regulations.

> ⚠️ **To be confirmed by Treasury Hub.** RPO/RTO, backup schedules, retention periods, DR drill
> frequency, and who provisions/operates DR depend on your deployment model and are finalized in your
> contract and design workshops. In on-premises deployments, some responsibilities (e.g. provisioning
> and running the DR environment) sit with you, with Treasury Hub providing runbooks and support.

## Tips & good practices
- Decide **data-residency** and **deployment model** requirements early — they shape onboarding and
  your contract.
- Agree **RPO/RTO** targets with your risk team up front so backup and DR are sized to your tolerance.
- Use the **data-quality dashboard** to spot sources sending poor data before it affects reports.
- Participate in **DR drills** and review the post-incident report so your team knows the recovery
  playbook.

## Related
- [Security & Compliance](security-and-compliance.md) — encryption, access control, and compliance posture.
- [Integrations](../02-integrations/overview.md) — where data enters the platform.
- [Reconciliation](../04-reconciliation/overview.md) — where much data validation and matching happens.

## In Preview
- 👁️ **Hybrid deployment** — sensitive data on-premises with selected AI/analytics services in a
  secured cloud. In preview; confirm availability with Treasury Hub.
