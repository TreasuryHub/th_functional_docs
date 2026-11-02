import { ArrowDownWideNarrow, ArrowUpNarrowWide, Eye, Filter as FilterIcon, GripVertical, Link2, Plus, Rows3, Sigma, Trash2, Variable, X } from 'lucide-react'
import { useState } from 'react'
import { aggLabel, grainLabel } from '../engine/query'
import { relativeLabel } from '../engine/params'
import { RELATIVE_DATES, uid, type Agg, type CalcField, type ColumnRef, type Filter, type JoinContext, type ReportParam, type ReportTemplate, type TimeGrain } from '../engine/report'
import { catalog } from '../state/store'
import { Button, cn, inputCls, Label, Popover } from '../ui/primitives'
import { DRAG_MIME, type AddTarget } from './FieldPanel'
import { FilterEditor, type ParamBinding } from './FilterEditor'
import { AGGS, FieldIcon, filterSummary, GRAINS, refInfo } from './helpers'

type Drop = { kind: 'field'; ref: string } | { kind: 'chip'; from: AddTarget; id: string }

/** base entity of a plain field measure (calc measures don't get a JOIN of their own) */
export const measureEntity = (ref: string) => { const hit = catalog.lookup(ref); return hit ? catalog.base(hit.entity.id) : undefined }

export function nextCtxName(t: ReportTemplate) {
  let i = (t.contexts?.length ?? 0) + 1
  while (t.contexts?.some(c => c.name === `t${i}`)) i++
  return `t${i}`
}

export function Shelves({ t, onDrop, onChange, onRemove, binding }: {
  t: ReportTemplate
  onDrop: (d: Drop, to: AddTarget, beforeId?: string) => void
  onChange: (patch: Partial<ReportTemplate>) => void
  onRemove: (shelf: AddTarget, id: string) => void
  binding: ParamBinding
}) {
  const updCol = (shelf: 'dimensions' | 'measures', id: string, patch: Partial<ColumnRef>) => onChange({ [shelf]: t[shelf].map(c => (c.id === id ? { ...c, ...patch } : c)) })
  const updFilter = (id: string, f: Filter) => onChange({ filters: t.filters.map(x => (x.id === id ? f : x)) })
  const contexts = t.contexts ?? []
  const updCtx = (id: string, patch: Partial<JoinContext>) => onChange({ contexts: contexts.map(c => (c.id === id ? { ...c, ...patch } : c)) })
  const removeCtx = (id: string) => onChange({ contexts: contexts.filter(c => c.id !== id), measures: t.measures.map(m => (m.ctx === id ? { ...m, ctx: undefined } : m)) })
  const newCtxFor = (col: ColumnRef) => {
    const entity = measureEntity(col.ref)
    if (!entity) return
    const ctx: JoinContext = { id: uid('x'), entity, name: nextCtxName(t), filters: [] }
    onChange({ contexts: [...contexts, ctx], measures: t.measures.map(m => (m.id === col.id ? { ...m, ctx: ctx.id } : m)) })
  }
  const compare = (a: ColumnRef, b: ColumnRef) => {
    const la = a.label || refInfo(a.ref, t.calcs).label, lb = b.label || refInfo(b.ref, t.calcs).label
    const d: CalcField = { id: uid('k'), name: `Δ ${la} vs ${lb}`, expr: `[@${a.id}] - [@${b.id}]`, format: 'currency' }
    const pct: CalcField = { id: uid('k'), name: `Δ% ${la} vs ${lb}`, expr: `DIV([@${a.id}] - [@${b.id}], ABS([@${b.id}]))`, format: 'percent' }
    onChange({ calcs: [...t.calcs, d, pct], measures: [...t.measures, { id: uid('c'), ref: `calc.${d.id}`, label: 'Δ' }, { id: uid('c'), ref: `calc.${pct.id}`, label: 'Δ %' }] })
  }

  return (
    <div className="grid gap-2">
      <Shelf label="Dimensiones" hint="agrupar por" icon={<Rows3 size={13} />} target="dimensions" onDrop={onDrop} empty="Soltá dimensiones (texto, fechas, categorías)">
        {t.dimensions.map(c => (
          <ColumnChip key={c.id} col={c} shelf="dimensions" t={t} onDrop={onDrop} onChange={p => updCol('dimensions', c.id, p)} onRemove={() => onRemove('dimensions', c.id)} onSort={dir => onChange({ sort: dir ? { ref: c.id, dir } : undefined })} />
        ))}
      </Shelf>
      <Shelf label="Medidas" hint="valores" icon={<Sigma size={13} />} target="measures" onDrop={onDrop} empty="Soltá medidas (montos, cantidades, fórmulas)">
        {t.measures.map(c => (
          <ColumnChip key={c.id} col={c} shelf="measures" t={t} onDrop={onDrop} onChange={p => updCol('measures', c.id, p)} onRemove={() => onRemove('measures', c.id)} onSort={dir => onChange({ sort: dir ? { ref: c.id, dir } : undefined })}
            onNewCtx={() => newCtxFor(c)} onCompare={other => compare(c, other)} />
        ))}
      </Shelf>
      <Shelf label="Filtros" hint="where / having" icon={<FilterIcon size={13} />} target="filters" onDrop={onDrop} empty="Soltá cualquier campo para filtrar">
        {t.filters.map(f => <FilterChip key={f.id} f={f} t={t} binding={binding} onChange={nf => updFilter(f.id, nf)} onRemove={() => onRemove('filters', f.id)} />)}
      </Shelf>

      {contexts.map(c => (
        <Shelf key={c.id} target={`ctx:${c.id}`} onDrop={onDrop} icon={<Link2 size={13} />} tone="join"
          label={<CtxTitle ctx={c} onRename={name => updCtx(c.id, { name })} />}
          hint={`JOIN · ${catalog.entity(c.entity).label}`}
          empty={`Soltá campos para filtrar sólo este JOIN (${t.measures.filter(m => m.ctx === c.id).length} medidas lo usan)`}
          after={<button onClick={() => removeCtx(c.id)} title="Quitar JOIN (sus medidas vuelven al principal)" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-negative"><Trash2 size={13} /></button>}>
          {c.filters.map(f => (
            <FilterChip key={f.id} f={f} t={t} binding={binding}
              onChange={nf => updCtx(c.id, { filters: c.filters.map(x => (x.id === f.id ? nf : x)) })}
              onRemove={() => updCtx(c.id, { filters: c.filters.filter(x => x.id !== f.id) })} />
          ))}
        </Shelf>
      ))}

      <ParamsShelf t={t} onChange={onChange} />
    </div>
  )
}

function readDrop(e: React.DragEvent): Drop | null {
  try { return JSON.parse(e.dataTransfer.getData(DRAG_MIME)) as Drop } catch { return null }
}

function Shelf({ label, hint, icon, target, onDrop, children, empty, tone, after }: {
  label: React.ReactNode; hint: string; icon: React.ReactNode; target: AddTarget; onDrop: (d: Drop, to: AddTarget, beforeId?: string) => void; children: React.ReactNode; empty: string
  tone?: 'join'; after?: React.ReactNode
}) {
  const [over, setOver] = useState(false)
  const has = Array.isArray(children) ? children.length > 0 : !!children
  return (
    <div data-shelf={target}
      onDragOver={e => { if (e.dataTransfer.types.includes(DRAG_MIME)) { e.preventDefault(); setOver(true) } }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); const d = readDrop(e); if (d) onDrop(d, target) }}
      className={cn('grid grid-cols-[132px_1fr_auto] items-start gap-2 rounded-lg border bg-card px-2 py-1.5 transition-colors', tone === 'join' && 'ml-6 border-dashed border-primary/50 bg-accent/20', over && 'border-primary bg-accent/40 ring-2 ring-primary/20')}>
      <div className={cn('flex gap-1.5 pt-1 text-[12px] font-semibold', tone === 'join' ? 'flex-col items-start gap-0' : 'items-center')}>
        <span className="flex items-center gap-1.5"><span className="text-muted-foreground">{icon}</span>{label}</span>
        <span className="text-[10.5px] font-normal text-muted-foreground">{hint}</span>
      </div>
      <div className="flex min-h-[30px] flex-wrap items-center gap-1.5">
        {has ? children : <span className="text-[12px] text-muted-foreground/80">{empty}</span>}
      </div>
      <div>{after}</div>
    </div>
  )
}

function ColumnChip({ col, shelf, t, onDrop, onChange, onRemove, onSort, onNewCtx, onCompare }: {
  col: ColumnRef; shelf: 'dimensions' | 'measures'; t: ReportTemplate; onDrop: (d: Drop, to: AddTarget, beforeId?: string) => void
  onChange: (p: Partial<ColumnRef>) => void; onRemove: () => void; onSort: (dir?: 'asc' | 'desc') => void
  onNewCtx?: () => void; onCompare?: (other: ColumnRef) => void
}) {
  const entity = shelf === 'measures' ? measureEntity(col.ref) : undefined
  const ctx = col.ctx ? t.contexts?.find(c => c.id === col.ctx) : undefined
  const sameEntityCtx = (t.contexts ?? []).filter(c => c.entity === entity)
  const [open, setOpen] = useState(false)
  const [over, setOver] = useState(false)
  const info = refInfo(col.ref, t.calcs)
  const sorted = t.sort?.ref === col.id ? t.sort.dir : undefined
  const isMeasure = shelf === 'measures'
  const showAgg = isMeasure && !(info.type === 'calc' && info.agg)
  return (
    <div className="relative">
      <div draggable
        onDragStart={e => { e.dataTransfer.setData(DRAG_MIME, JSON.stringify({ kind: 'chip', from: shelf, id: col.id })); e.stopPropagation() }}
        onDragOver={e => { if (e.dataTransfer.types.includes(DRAG_MIME)) { e.preventDefault(); e.stopPropagation(); setOver(true) } }}
        onDragLeave={() => setOver(false)}
        onDrop={e => { e.preventDefault(); e.stopPropagation(); setOver(false); const d = readDrop(e); if (d) onDrop(d, shelf, col.id) }}
        onClick={() => setOpen(o => !o)}
        className={cn('group flex h-7 cursor-pointer items-center gap-1 rounded-md border pl-1 pr-1 text-[12.5px] shadow-sm transition-colors',
          isMeasure ? 'border-positive/30 bg-positive/5 hover:bg-positive/10' : 'border-info/30 bg-info/5 hover:bg-info/10',
          over && 'border-l-4 border-l-primary')}>
        <GripVertical size={12} className="text-muted-foreground/60" />
        {showAgg && col.agg ? <span className="rounded bg-card px-1 text-[10.5px] font-semibold text-positive">{aggLabel(col.agg)}</span> : <FieldIcon type={info.type} role={isMeasure ? 'measure' : 'dimension'} size={12} />}
        <span className="max-w-[200px] truncate font-medium">{col.label || info.label}</span>
        {col.grain && <span className="rounded bg-card px-1 text-[10.5px] text-info">{grainLabel(col.grain)}</span>}
        {ctx && <span className="inline-flex items-center gap-0.5 rounded bg-primary/15 px-1 text-[10.5px] font-semibold text-accent-foreground" title="JOIN propio"><Link2 size={10} />{ctx.name}</span>}
        <span className="max-w-[90px] truncate text-[10.5px] text-muted-foreground">· {info.entityLabel}</span>
        {sorted && (sorted === 'asc' ? <ArrowUpNarrowWide size={12} className="text-accent-foreground" /> : <ArrowDownWideNarrow size={12} className="text-accent-foreground" />)}
        <button onClick={e => { e.stopPropagation(); onRemove() }} className="rounded p-0.5 text-muted-foreground opacity-60 hover:bg-card hover:opacity-100"><X size={12} /></button>
      </div>
      <Popover open={open} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <div>
            <div className="text-[13px] font-semibold">{info.label}</div>
            <div className="text-[11px] text-muted-foreground">{info.entityLabel}{info.field?.lineage ? ` · ${info.field.lineage}` : ''}</div>
          </div>
          <div>
            <Label>Etiqueta</Label>
            <input className={inputCls} value={col.label ?? ''} placeholder={info.label} onChange={e => onChange({ label: e.target.value || undefined })} />
            {(t.params?.length ?? 0) > 0 && <div className="mt-1 text-[11px] text-muted-foreground">Usá {'{'}{t.params![0].name}{'}'} para mostrar el valor del parámetro.</div>}
          </div>
          {showAgg && (
            <div>
              <Label>Agregación</Label>
              <select className={inputCls} value={col.agg} onChange={e => onChange({ agg: e.target.value as Agg })}>
                {AGGS.filter(a => (a.value === 'ONE' ? info.role !== 'measure' : info.role === 'measure' || info.type === 'calc' || ['COUNT', 'COUNTD', 'MIN', 'MAX'].includes(a.value))).map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
              {info.field?.semiAdditive && <div className="mt-1 text-[11px] leading-snug text-muted-foreground">Semi-aditivo: con "Último" se toma el último saldo por cuenta y se suma entre cuentas. "Suma" sumaría días (incorrecto para saldos).</div>}
            </div>
          )}
          {!isMeasure && (info.type === 'date' || info.type === 'datetime') && (
            <div>
              <Label>Granularidad</Label>
              <div className="flex flex-wrap gap-1">
                <button onClick={() => onChange({ grain: undefined })} className={cn('rounded border px-2 py-0.5 text-xs', !col.grain ? 'border-primary bg-accent' : 'hover:bg-muted')}>Exacta</button>
                {GRAINS.map(g => (
                  <button key={g.value} onClick={() => onChange({ grain: g.value as TimeGrain })} className={cn('rounded border px-2 py-0.5 text-xs', col.grain === g.value ? 'border-primary bg-accent' : 'hover:bg-muted')}>{g.label}</button>
                ))}
              </div>
            </div>
          )}
          {entity && (
            <div>
              <Label>JOIN</Label>
              <select className={inputCls} value={col.ctx ?? ''} onChange={e => (e.target.value === '__new' ? onNewCtx?.() : onChange({ ctx: e.target.value || undefined }))}>
                <option value="">Principal (mismo JOIN)</option>
                {sameEntityCtx.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                <option value="__new">+ Nuevo JOIN de {catalog.entity(entity).label}…</option>
              </select>
              <div className="mt-1 text-[11px] leading-snug text-muted-foreground">Un JOIN nuevo es la misma tabla otra vez, con sus propios filtros (ej. saldo a otra fecha).</div>
            </div>
          )}
          {isMeasure && onCompare && t.measures.length > 1 && (
            <div>
              <Label>Comparar con</Label>
              <select className={inputCls} value="" onChange={e => { const o = t.measures.find(m => m.id === e.target.value); if (o) onCompare(o) }}>
                <option value="">Agregar Δ y Δ% contra…</option>
                {t.measures.filter(m => m.id !== col.id && !refInfo(m.ref, t.calcs).calc?.expr.includes('[@')).map(m => <option key={m.id} value={m.id}>{m.label || refInfo(m.ref, t.calcs).label}</option>)}
              </select>
            </div>
          )}
          <div>
            <Label>Orden</Label>
            <div className="flex gap-1">
              <Button size="sm" variant={sorted === 'asc' ? 'primary' : 'secondary'} onClick={() => onSort(sorted === 'asc' ? undefined : 'asc')}><ArrowUpNarrowWide size={12} /> Asc</Button>
              <Button size="sm" variant={sorted === 'desc' ? 'primary' : 'secondary'} onClick={() => onSort(sorted === 'desc' ? undefined : 'desc')}><ArrowDownWideNarrow size={12} /> Desc</Button>
            </div>
          </div>
          <div className="flex justify-end border-t pt-2"><Button size="sm" variant="danger" onClick={onRemove}>Quitar</Button></div>
        </div>
      </Popover>
    </div>
  )
}

function FilterChip({ f, t, binding, onChange, onRemove }: { f: Filter; t: ReportTemplate; binding: ParamBinding; onChange: (f: Filter) => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false)
  const calcs = t.calcs
  const info = refInfo(f.ref, calcs)
  const bound = JSON.stringify([f.value, f.value2]).includes('$param')
  const isHaving = info.type === 'calc' && info.agg
  return (
    <div className="relative">
      <div onClick={() => setOpen(o => !o)} className="group flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-foreground/15 bg-muted pl-2 pr-1 text-[12.5px] shadow-sm hover:bg-accent/60">
        <FilterIcon size={12} className="text-muted-foreground" />
        <span className="max-w-[260px] truncate">{filterSummary(f, calcs, t)}</span>
        {bound && <span title="Ligado a parámetro"><Variable size={12} className="text-accent-foreground" /></span>}
        {isHaving && <span className="rounded bg-card px-1 text-[10px] text-accent-foreground">having</span>}
        {f.exposed && <span title="Parámetro editable en el Viewer"><Eye size={12} className="text-accent-foreground" /></span>}
        <button onClick={e => { e.stopPropagation(); onRemove() }} className="rounded p-0.5 text-muted-foreground opacity-60 hover:bg-card hover:opacity-100"><X size={12} /></button>
      </div>
      <Popover open={open} onClose={() => setOpen(false)} className="w-[300px]">
        <div className="space-y-3">
          <div>
            <div className="text-[13px] font-semibold">{info.label}</div>
            <div className="text-[11px] text-muted-foreground">{info.entityLabel}{isHaving ? ' · se aplica después de agregar (HAVING)' : ''}</div>
          </div>
          <FilterEditor filter={f} calcs={calcs} onChange={onChange} binding={binding} />
          <label className="flex items-center gap-2 border-t pt-2 text-[12.5px]">
            <input type="checkbox" className="accent-[hsl(38_35%_53%)]" checked={!!f.exposed} onChange={e => onChange({ ...f, exposed: e.target.checked })} />
            Exponer como parámetro en el Viewer
          </label>
        </div>
      </Popover>
    </div>
  )
}

function CtxTitle({ ctx, onRename }: { ctx: JoinContext; onRename: (n: string) => void }) {
  return (
    <input value={ctx.name} onChange={e => onRename(e.target.value)} title="Nombre del JOIN"
      className="w-[100px] rounded bg-transparent px-0.5 font-semibold outline-none hover:bg-card focus:bg-card focus:ring-1 focus:ring-primary/40" />
  )
}

// ---------------------------------------------------------------- report parameters

function ParamsShelf({ t, onChange }: { t: ReportTemplate; onChange: (p: Partial<ReportTemplate>) => void }) {
  const params = t.params ?? []
  const upd = (id: string, patch: Partial<ReportParam>) => onChange({ params: params.map(p => (p.id === id ? { ...p, ...patch } : p)) })
  const add = () => onChange({ params: [...params, { id: uid('p'), name: `Fecha ${params.length + 1}`, type: 'date', value: '@today' }] })
  return (
    <div className="grid grid-cols-[132px_1fr] items-start gap-2 rounded-lg border bg-card px-2 py-1.5">
      <div className="flex items-center gap-1.5 pt-1 text-[12px] font-semibold">
        <span className="text-muted-foreground"><Variable size={13} /></span>Parámetros
        <span className="text-[10.5px] font-normal text-muted-foreground">se piden al ejecutar</span>
      </div>
      <div className="flex min-h-[30px] flex-wrap items-center gap-1.5">
        {params.map(p => <ParamChip key={p.id} p={p} onChange={patch => upd(p.id, patch)} onRemove={() => onChange({ params: params.filter(x => x.id !== p.id) })} />)}
        <button onClick={add} className="inline-flex h-7 items-center gap-1 rounded-md border border-dashed px-2 text-[12px] text-muted-foreground hover:bg-muted hover:text-foreground"><Plus size={12} /> Parámetro</button>
      </div>
    </div>
  )
}

function ParamChip({ p, onChange, onRemove }: { p: ReportParam; onChange: (patch: Partial<ReportParam>) => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false)
  const rel = relativeLabel(p.value)
  return (
    <div className="relative">
      <div onClick={() => setOpen(o => !o)} className="flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-primary/40 bg-accent/50 pl-2 pr-1 text-[12.5px] shadow-sm hover:bg-accent">
        <Variable size={12} className="text-accent-foreground" />
        <span className="font-semibold">{p.name}</span>
        <span className="text-[11px] text-muted-foreground">= {rel ?? String(p.value)}</span>
        <button onClick={e => { e.stopPropagation(); onRemove() }} className="rounded p-0.5 text-muted-foreground opacity-60 hover:bg-card hover:opacity-100"><X size={12} /></button>
      </div>
      <Popover open={open} onClose={() => setOpen(false)} className="w-[280px]">
        <div className="space-y-3">
          <div><Label>Nombre</Label><input className={inputCls} value={p.name} onChange={e => onChange({ name: e.target.value })} /></div>
          <div>
            <Label>Tipo</Label>
            <select className={inputCls} value={p.type} onChange={e => onChange({ type: e.target.value as ReportParam['type'], value: e.target.value === 'date' ? '@today' : '' })}>
              <option value="date">Fecha</option><option value="number">Número</option><option value="text">Texto</option>
            </select>
          </div>
          <div>
            <Label>Valor por defecto</Label>
            {p.type === 'date' ? (
              <div className="space-y-1.5">
                <select className={inputCls} value={rel ? String(p.value) : ''} onChange={e => onChange({ value: e.target.value || new Date().toISOString().slice(0, 10) })}>
                  <option value="">Fecha fija…</option>
                  {RELATIVE_DATES.map(r => <option key={r.token} value={r.token}>{r.label} (relativo)</option>)}
                </select>
                {!rel && <input type="date" className={inputCls} value={String(p.value)} onChange={e => onChange({ value: e.target.value })} />}
              </div>
            ) : <input className={inputCls} type={p.type === 'number' ? 'number' : 'text'} value={String(p.value)} onChange={e => onChange({ value: p.type === 'number' ? Number(e.target.value) : e.target.value })} />}
            <div className="mt-1 text-[11px] leading-snug text-muted-foreground">Relativo = se resuelve el día de cada ejecución (útil en reportes programados). En el Viewer se puede cambiar.</div>
          </div>
        </div>
      </Popover>
    </div>
  )
}
