import { ChevronDown, ChevronRight, Filter as FilterIcon, Info, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { indexCalcs } from '../engine/query'
import type { CalcField } from '../engine/report'
import { DOMAINS, type TreeNode } from '../model/silver'
import type { Entity, Field } from '../model/types'
import { catalog } from '../state/store'
import { Badge, cn, inputCls } from '../ui/primitives'
import { FieldIcon } from './helpers'

/** `ctx:<id>` = the filter list of one JOIN context */
export type AddTarget = 'dimensions' | 'measures' | 'filters' | `ctx:${string}`
export const DRAG_MIME = 'application/x-rb'

export function FieldPanel({ domain, onDomain, calcs, usedRefs, onAdd, onNewCalc, onEditCalc, onDeleteCalc }: {
  domain: string; onDomain: (d: string) => void; calcs: CalcField[]; usedRefs: Set<string>
  onAdd: (ref: string, target: AddTarget) => void; onNewCalc: () => void; onEditCalc: (c: CalcField) => void; onDeleteCalc: (id: string) => void
}) {
  const [q, setQ] = useState('')
  const dom = DOMAINS.find(d => d.id === domain) ?? DOMAINS[0]
  const inTree = useMemo(() => {
    const s = new Set<string>()
    const walk = (n: TreeNode) => { s.add(n.entity); n.children?.forEach(walk) }
    dom.tree.forEach(walk)
    return s
  }, [dom])
  // everything else reachable through joins, so a Financial Events report can still pull Account attributes
  const related = catalog.entities.filter(e => !inTree.has(e.id) && e.parent?.kind !== 'subtype')
  const calcIdx = indexCalcs(calcs)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="space-y-2 border-b p-3">
        <div className="grid grid-cols-2 gap-1">
          {DOMAINS.map(d => (
            <button key={d.id} onClick={() => onDomain(d.id)}
              className={cn('rounded-md border px-2 py-1.5 text-left text-[12px] font-medium leading-tight transition-colors', d.id === dom.id ? 'border-primary bg-accent text-accent-foreground' : 'bg-card hover:bg-muted')}>
              {d.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2 top-2 text-muted-foreground" />
          <input className={cn(inputCls, 'pl-7')} placeholder="Buscar campo…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {dom.tree.map(n => <EntityNode key={n.entity} node={n} depth={0} q={q} usedRefs={usedRefs} onAdd={onAdd} defaultOpen />)}

        <Section title="Campos calculados" defaultOpen action={<button onClick={onNewCalc} className="rounded p-0.5 text-accent-foreground hover:bg-accent" title="Nueva fórmula"><Plus size={14} /></button>}>
          {calcs.length === 0 && <button onClick={onNewCalc} className="w-full rounded-md border border-dashed px-2 py-2 text-left text-[12px] text-muted-foreground hover:bg-muted">+ Nueva fórmula</button>}
          {calcs.map(c => {
            const agg = !!calcIdx.get(c.id)?.agg
            return (
              <FieldRow key={c.id} refId={`calc.${c.id}`} label={c.name} type="calc" role={agg ? 'measure' : 'dimension'} used={usedRefs.has(`calc.${c.id}`)} onAdd={onAdd}
                title={c.expr}
                extra={<>
                  <button className="rounded p-0.5 hover:bg-card" onClick={() => onEditCalc(c)} title="Editar"><Pencil size={12} /></button>
                  <button className="rounded p-0.5 hover:bg-card" onClick={() => onDeleteCalc(c.id)} title="Borrar"><Trash2 size={12} /></button>
                </>} />
            )
          })}
        </Section>

        <Section title="Entidades relacionadas" hint="Se unen por join (N:1 o bridge)">
          {related.map(e => <EntityNode key={e.id} node={{ entity: e.id }} depth={0} q={q} usedRefs={usedRefs} onAdd={onAdd} />)}
        </Section>
      </div>

      <div className="border-t px-3 py-2 text-[11px] leading-snug text-muted-foreground">
        Arrastrá campos a los shelves o usá <Plus size={10} className="inline" />. <span className="text-info">●</span> dimensión · <span className="text-positive">Σ</span> medida
      </div>
    </div>
  )
}

function Section({ title, hint, children, defaultOpen, action }: { title: string; hint?: string; children: React.ReactNode; defaultOpen?: boolean; action?: React.ReactNode }) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div className="mt-3 border-t pt-2">
      <div className="flex items-center justify-between px-1">
        <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground">
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}{title}
        </button>
        {action}
      </div>
      {hint && open && <div className="px-1 pb-1 text-[11px] text-muted-foreground">{hint}</div>}
      {open && <div className="mt-1">{children}</div>}
    </div>
  )
}

function relationBadge(e: Entity) {
  if (e.parent?.kind === 'subtype') return <Badge tone="info">subtipo</Badge>
  if (e.table.startsWith('brg_')) return <Badge>bridge M:N</Badge>
  if (e.parent?.kind === 'parent') return <Badge>hijo de {catalog.entity(e.parent.entity).label}</Badge>
  return null
}

function EntityNode({ node, depth, q, usedRefs, onAdd, defaultOpen }: {
  node: TreeNode; depth: number; q: string; usedRefs: Set<string>; onAdd: (ref: string, t: AddTarget) => void; defaultOpen?: boolean
}) {
  const e = catalog.entity(node.entity)
  const [open, setOpen] = useState(!!defaultOpen)
  const [info, setInfo] = useState(false)
  const fields = e.fields.filter(f => !f.hidden && (!q || f.label.toLowerCase().includes(q.toLowerCase())))
  const dims = fields.filter(f => f.role === 'dimension')
  const meas = fields.filter(f => f.role === 'measure')
  const anyUsed = e.fields.some(f => usedRefs.has(`${e.id}.${f.id}`))
  const isOpen = open || (!!q && fields.length > 0)
  if (q && !fields.length && !node.children?.length) return null

  return (
    <div className={cn(depth > 0 && 'ml-3 border-l pl-2')}>
      <div className="group flex items-center gap-1 rounded-md px-1 py-1 hover:bg-muted">
        <button onClick={() => setOpen(o => !o)} className="flex min-w-0 flex-1 items-center gap-1 text-left">
          {isOpen ? <ChevronDown size={13} className="shrink-0 text-muted-foreground" /> : <ChevronRight size={13} className="shrink-0 text-muted-foreground" />}
          <span className={cn('truncate text-[13px] font-semibold', anyUsed && 'text-accent-foreground')}>{node.alias ?? e.label}</span>
          <span title={e.availability === 'events' ? 'Derivable hoy de eventos' : 'Requiere fuente nueva (eventos por Outbox)'}
            className={cn('ml-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full', e.availability === 'events' ? 'bg-positive' : 'bg-[#eda100]')} />
        </button>
        <button onClick={() => setInfo(i => !i)} className="rounded p-0.5 text-muted-foreground opacity-0 hover:text-foreground group-hover:opacity-100" title="Info"><Info size={12} /></button>
      </div>
      {info && (
        <div className="mx-1 mb-1 rounded-md bg-muted p-2 text-[11px] leading-snug text-muted-foreground">
          <div className="mb-1 flex flex-wrap items-center gap-1"><code className="text-foreground">silver.{e.table}</code>{relationBadge(e)}</div>
          {e.description}
        </div>
      )}
      {isOpen && (
        <div className="pb-1">
          {e.parent?.kind === 'subtype' && !q && <div className="px-6 pb-0.5 text-[10.5px] text-muted-foreground">type ∈ {e.parent.typeValues?.join(', ')}</div>}
          {dims.map(f => <FieldRow key={f.id} refId={`${e.id}.${f.id}`} field={f} used={usedRefs.has(`${e.id}.${f.id}`)} onAdd={onAdd} />)}
          {meas.map(f => <FieldRow key={f.id} refId={`${e.id}.${f.id}`} field={f} used={usedRefs.has(`${e.id}.${f.id}`)} onAdd={onAdd} />)}
        </div>
      )}
      {node.children?.map(c => <EntityNode key={c.entity} node={c} depth={depth + 1} q={q} usedRefs={usedRefs} onAdd={onAdd} defaultOpen={false} />)}
    </div>
  )
}

function FieldRow({ refId, field, label, type, role, used, onAdd, extra, title }: {
  refId: string; field?: Field; label?: string; type?: Field['type'] | 'calc'; role?: 'dimension' | 'measure'; used: boolean
  onAdd: (ref: string, t: AddTarget) => void; extra?: React.ReactNode; title?: string
}) {
  const r = field?.role ?? role ?? 'dimension'
  return (
    <div draggable onDragStart={ev => { ev.dataTransfer.setData(DRAG_MIME, JSON.stringify({ kind: 'field', ref: refId })); ev.dataTransfer.effectAllowed = 'copy' }}
      title={title ?? field?.description ?? field?.lineage}
      className="group flex cursor-grab items-center gap-1.5 rounded px-1.5 py-[3px] pl-5 text-[12.5px] hover:bg-muted active:cursor-grabbing">
      <FieldIcon type={field?.type ?? type ?? 'string'} role={r} />
      <span className={cn('min-w-0 flex-1 truncate', used && 'font-semibold')}>{field?.label ?? label}</span>
      {field?.semiAdditive && <span className="text-[10px] text-muted-foreground" title="Semi-aditivo">semi</span>}
      <span className="hidden items-center gap-0.5 group-hover:flex">
        {extra}
        <button className="rounded p-0.5 text-muted-foreground hover:bg-card hover:text-foreground" title="Agregar como filtro" onClick={() => onAdd(refId, 'filters')}><FilterIcon size={12} /></button>
        <button className="rounded p-0.5 text-accent-foreground hover:bg-card" title={r === 'measure' ? 'Agregar a Medidas' : 'Agregar a Dimensiones'} onClick={() => onAdd(refId, r === 'measure' ? 'measures' : 'dimensions')}><Plus size={13} /></button>
      </span>
    </div>
  )
}
