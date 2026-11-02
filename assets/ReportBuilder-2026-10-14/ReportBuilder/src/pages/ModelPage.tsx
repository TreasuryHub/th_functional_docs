import { AlertTriangle, Database, KeyRound, Link2 } from 'lucide-react'
import { FieldIcon } from '../builder/helpers'
import { DOMAINS, type TreeNode } from '../model/silver'
import type { Entity } from '../model/types'
import { TABLE_STATS } from '../model/mockData'
import { catalog } from '../state/store'
import { Badge, Card } from '../ui/primitives'

const GAPS = [
  { t: 'Tag Groups no existen', d: 'Los Tags de th_saas son planos (Tags / TransactionTags) y los de conciliación son texto (movement_tag = nombre del filtro). Los grupos los aporta un módulo nuevo de Tagging.' },
  { t: 'Solo Financial Events publica eventos', d: 'Accounts, Balances (saas), Transactions (saas), Workflows, Conciliations y Tags no emiten eventos: th_saas y th_reconcilation_module van a publicar eventos de estado con el patrón Outbox (EventCore), más una carga inicial.' },
  { t: 'Claves que no coinciden', d: 'Tenant: uuid (ingestion) vs long (saas) vs int (recon) → unificar por tenant uuid. Account: event.account_uuid = Accounts.Uuid (no Accounts.Id). Movement.ThbTxId → Transactions.Id.' },
  { t: 'Monedas y montos', d: 'Amount siempre sin signo + IsNegative. Conciliation no tiene moneda (se deriva de MovementCurrency default). Balance no tiene moneda (sale de la cuenta). Silver agrega amount_signed y amount_base (USD vía fx diario).' },
  { t: 'Estado actual de un evento', d: 'Silver = FinancialEventCreated + FinancialEventUpdated por uuid, ordenados por version, dedupe por (message_type, aggregate_id, aggregate_version) prefiriendo bus sobre backfill.' },
  { t: 'Contrapartes sin FK', d: 'Ni eventos ni Transactions referencian Counterparty: se resuelven en silver por nombre/identificador (PartnerName, Debtor/CreditorName).' },
]

export function ModelPage() {
  return (
    <div className="mx-auto max-w-[1240px] space-y-6 px-6 py-6">
      <Card className="p-5">
        <h1 className="flex items-center gap-2 text-[20px] font-semibold"><Database size={18} /> Modelo Silver propuesto</h1>
        <p className="mt-1 max-w-3xl text-[13px] text-muted-foreground">
          Tablas desnormalizadas por tenant en <code>silver.*</code>. Las relaciones <b>padre → hijo</b> (1:N), <b>subtipo</b> (mismo row, payload distinto) y <b>bridge</b> (M:N) son las que usa el Builder para decidir el grano.
          <span className="ml-1 inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-positive" /> derivable hoy de eventos</span>
          <span className="ml-2 inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#eda100]" /> requiere fuente nueva</span>
        </p>
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {GAPS.map(g => (
            <div key={g.t} className="rounded-md border bg-muted/50 p-3">
              <div className="flex items-center gap-1.5 text-[12.5px] font-semibold"><AlertTriangle size={13} className="text-accent-foreground" /> {g.t}</div>
              <div className="mt-1 text-[12px] leading-snug text-muted-foreground">{g.d}</div>
            </div>
          ))}
        </div>
      </Card>

      {DOMAINS.map(d => (
        <section key={d.id}>
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-[15px] font-semibold">{d.label}</h2>
            <span className="text-[12.5px] text-muted-foreground">{d.description}</span>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {flatten(d.tree).map(({ node, depth }) => <EntityCard key={d.id + node.entity} e={catalog.entity(node.entity)} alias={node.alias} depth={depth} />)}
          </div>
        </section>
      ))}
    </div>
  )
}

function flatten(tree: TreeNode[], depth = 0): { node: TreeNode; depth: number }[] {
  return tree.flatMap(n => [{ node: n, depth }, ...flatten(n.children ?? [], depth + 1)])
}

function EntityCard({ e, alias, depth }: { e: Entity; alias?: string; depth: number }) {
  const rel = e.parent
  const rows = TABLE_STATS[catalog.base(e.id)]
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${e.availability === 'events' ? 'bg-positive' : 'bg-[#eda100]'}`} />
        <span className="text-[14px] font-semibold">{alias ?? e.label}</span>
        <code className="text-[12px] text-accent-foreground">silver.{e.table}</code>
        <Badge>{e.kind === 'fact' ? (e.table.startsWith('brg_') ? 'bridge' : 'fact') : 'dimension'}</Badge>
        {depth > 0 && <Badge tone="gold">nivel {depth}</Badge>}
        <span className="ml-auto text-[11px] text-muted-foreground">{rows?.toLocaleString('es-AR')} filas mock</span>
      </div>
      <p className="mt-1.5 text-[12.5px] leading-snug text-muted-foreground">{e.description}</p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><KeyRound size={11} /> {e.key}</span>
        {rel && <span className="inline-flex items-center gap-1"><Link2 size={11} /> {rel.kind === 'subtype' ? `subtipo de ${catalog.entity(rel.entity).label} (type ∈ ${rel.typeValues?.join(', ')})` : `${rel.fk} → ${catalog.entity(rel.entity).table} (N:1, padre)`}</span>}
        {e.lookups?.map(l => <span key={l.fk} className="inline-flex items-center gap-1"><Link2 size={11} /> {l.fk} → {catalog.entity(l.entity).table}</span>)}
      </div>
      <table className="mt-3 w-full text-[12px]">
        <tbody>
          {e.fields.filter(f => f.id !== 'n').map(f => (
            <tr key={f.id} className="border-t">
              <td className="w-5 py-1"><FieldIcon type={f.type} role={f.role} size={12} /></td>
              <td className="py-1 pr-2 font-mono text-[11.5px]">{f.id}</td>
              <td className="py-1 pr-2">{f.label}{f.semiAdditive && <Badge className="ml-1">semi-aditivo</Badge>}</td>
              <td className="py-1 text-[11px] text-muted-foreground">{f.lineage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
