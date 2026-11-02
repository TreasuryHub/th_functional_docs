import { AlertTriangle, ArrowLeft, ArrowLeftRight, Columns3, ScrollText, Type, Calculator, CalendarClock, CalendarDays, Filter as FilterIcon, GitCompareArrows, GripVertical, Info, Landmark, Pencil, Play, Plus, Rows3, Save, Search, Sigma, Sparkles, Trash2, Wrench, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { FilterEditor } from '../builder/FilterEditor'
import { FormulaEditor } from '../builder/FormulaEditor'
import { defaultFilter, filterSummary, refInfo } from '../builder/helpers'
import { OutputBar } from '../builder/OutputBar'
import { ScheduleDialog, scheduleLabel } from '../builder/ScheduleDialog'
import { runReport } from '../engine/query'
import type { CalcField, ReportTemplate } from '../engine/report'
import { uid } from '../engine/report'
import { ReportOutput } from '../output/ReportOutput'
import { actions, catalog, dataStore, TODAY, useStore } from '../state/store'
import {
  calcKey, canShowAsColumn, columnId, compileStudio, fieldKey, groupDef, isFieldKey, isTimeKey, newSpec, normalizeSpec, ORG_KEYS, PERIODS, QUICK_STARTS, SOURCES, TX_TYPES, valueBlocked, valueDef, valueLabel,
  type SourceId, type StudioFilter, type StudioSpec,
} from '../studio/spec'
import { navigate } from '../App'
import { Badge, Button, Card, cn, inputCls, Label, Modal, Popover, Segmented } from '../ui/primitives'

type Zone = 'group' | 'value' | 'filter'
type Drag = { kind: 'item'; what: 'group' | 'value'; key: string } | { kind: 'chip'; zone: Zone; key: string }
const MIME = 'application/x-rb-studio'
const readDrag = (e: React.DragEvent): Drag | null => { try { return JSON.parse(e.dataTransfer.getData(MIME)) as Drag } catch { return null } }

const SOURCE_ICON: Record<SourceId, typeof Sigma> = { transactions: ArrowLeftRight, statement: ScrollText, balances: Landmark, recon: GitCompareArrows }

/** Inserts `key` before `before` (or at the end), moving it if it was already there. */
const place = (list: string[], key: string, before?: string) => {
  const out = list.filter(k => k !== key)
  const i = before ? out.indexOf(before) : -1
  i >= 0 ? out.splice(i, 0, key) : out.push(key)
  return out
}

export function StudioPage({ id }: { id?: string }) {
  const templates = useStore(s => s.templates)
  const saved = templates.find(t => t.id === id)
  const [meta, setMeta] = useState<Pick<ReportTemplate, 'id' | 'name' | 'description' | 'owner' | 'updatedAt' | 'schedule'>>(() => saved
    ? { id: saved.id, name: saved.name, description: saved.description, owner: saved.owner, updatedAt: saved.updatedAt, schedule: saved.schedule }
    : { id: uid('tpl_'), name: 'Nuevo reporte', description: '', owner: 'nicolas@treasuryhub.ai', updatedAt: new Date().toISOString() })
  const [spec, setSpec] = useState<StudioSpec>(() => (saved?.studio ? normalizeSpec(structuredClone(saved.studio)) : newSpec()))
  const [savedKey, setSavedKey] = useState(() => (saved?.studio ? JSON.stringify([saved.name, saved.description ?? '', saved.studio]) : ''))
  const [toast, setToast] = useState<string | null>(null)
  const [calcOpen, setCalcOpen] = useState(false)
  const [formula, setFormula] = useState<{ open: boolean; calc?: CalcField }>({ open: false })
  const [schedOpen, setSchedOpen] = useState(false)
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const dirty = JSON.stringify([meta.name, meta.description ?? '', spec]) !== savedKey

  const compiled = useMemo(() => compileStudio(spec, meta), [spec, meta])
  const result = useMemo(() => {
    if (!spec.values.length) return null
    try { return runReport(compiled.template, catalog, dataStore, { today: TODAY }) } catch (e) { return { error: (e as Error).message } as const }
  }, [compiled, spec.values.length])

  if (saved && !saved.studio) {
    return (
      <Card className="mx-auto mt-10 max-w-lg space-y-3 p-6 text-[13px]">
        <div className="text-[15px] font-semibold">"{saved.name}" se edita en modo avanzado</div>
        <p className="text-muted-foreground">Usa JOINs, parámetros o fórmulas que el editor simple no muestra.</p>
        <Button variant="primary" onClick={() => navigate(`#/builder/${saved.id}`, true)}><Wrench size={14} /> Abrir en modo avanzado</Button>
      </Card>
    )
  }

  const src = SOURCES[spec.source]
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3200) }
  const upd = (p: Partial<StudioSpec>) => setSpec(s => ({ ...s, ...p }))
  const labelOf = (key: string) => groupDef(spec.source, key)?.label ?? valueLabel(spec, key)

  // ---------------------------------------------------------------- editing
  const addGroup = (key: string, before?: string) => setSpec(s => ({ ...s, groupBy: place(s.groupBy, key, before) }))
  const addValue = (key: string, before?: string) => {
    // values that only make sense at a given grain bring their groupings along (e.g. saldo después del movimiento)
    const needs = (valueDef(spec.source, key)?.needsGroups ?? []).filter(g => !spec.groupBy.includes(g))
    const next = { ...spec, groupBy: [...spec.groupBy, ...needs] }
    const blocked = valueBlocked(next, key)
    if (blocked) return flash(blocked)
    if (needs.length) flash(`Para "${valueLabel(spec, key)}" se agregó ${needs.map(g => groupDef(spec.source, g)?.label).join(', ')} a Agrupar por.`)
    setSpec({ ...next, values: place(next.values, key, before) })
  }
  /** A field shown as a column next to the values, without grouping by it. */
  const addField = (groupKey: string, before?: string) => {
    if (!canShowAsColumn(spec.source, groupKey)) {
      const g = groupDef(spec.source, groupKey)
      flash(isTimeKey(groupKey) ? `"${g?.label}" agrupa por fecha: se agregó a Agrupar por.` : `"${g?.column ?? g?.label}" define las filas (una por cada una): se agregó a Agrupar por.`)
      return addGroup(groupKey)
    }
    addValue(fieldKey(groupKey), before)
  }
  const addFilter = (key: string) => {
    const ref = groupDef(spec.source, key)?.ref ?? valueDef(spec.source, key)?.ref
    if (!ref) return flash(`"${labelOf(key)}" es un cálculo: para filtrar usá un campo o un monto.`)
    const base = defaultFilter(ref, [])
    // text fields read better as a pick list than as "contains"
    const f: StudioFilter = { ...base, ...(refInfo(ref, []).type === 'string' ? { op: 'in' as const, value: [] } : {}), key, exposed: true }
    setSpec(s => ({ ...s, filters: [...s.filters, f] }))
    setOpenFilter(f.id)
  }
  const remove = (zone: Zone, key: string) => setSpec(s => (
    zone === 'group' ? { ...s, groupBy: s.groupBy.filter(k => k !== key) }
      : zone === 'value' ? { ...s, values: s.values.filter(k => k !== key) }
        : { ...s, filters: s.filters.filter(f => f.id !== key) }))

  const onDrop = (d: Drag, zone: Zone, before?: string) => {
    if (d.kind === 'chip' && d.zone === zone) {
      if (zone !== 'filter' && before && before !== d.key) zone === 'group' ? addGroup(d.key, before) : addValue(d.key, before)
      return
    }
    // the field behind what's dragged: a palette block, a grouping, a filter or a column shown in Mostrar
    let key = d.kind === 'chip' && d.zone === 'filter' ? spec.filters.find(f => f.id === d.key)?.key ?? '' : d.key
    if (isFieldKey(key)) key = key.slice(6)
    const isField = d.kind === 'item' ? d.what === 'group' : !!groupDef(spec.source, key) && (d.zone !== 'value' || isFieldKey(d.key))
    // a value dropped on Agrupar por goes to Mostrar; a field dropped on Mostrar is shown as a column
    let target = zone
    if (zone === 'group' && !isField) { target = 'value'; flash(`"${labelOf(key)}" es un valor: se agregó a Mostrar.`) }
    if (d.kind === 'chip' && d.zone === target) return
    if (target === 'group') addGroup(key, before)
    else if (target === 'value') isField ? addField(key, before) : addValue(key, before)
    else addFilter(key)
    if (d.kind === 'chip') remove(d.zone, d.key)
  }

  const switchSource = (s: SourceId) => {
    if (s === spec.source) return
    if (spec.calcs.length && !confirm('Los campos calculados dependen de la fuente actual y se van a quitar. ¿Cambiar de fuente?')) return
    setSpec(x => newSpec(s, x))
  }

  const pickQuickStart = (q: (typeof QUICK_STARTS)[number]) => {
    setSpec(structuredClone(q.spec))
    setMeta(m => ({ ...m, name: q.name, description: q.description }))
  }

  const saveCalc = (c: CalcField) => {
    setSpec(s => {
      const exists = s.calcs.some(k => k.id === c.id)
      return { ...s, calcs: exists ? s.calcs.map(k => (k.id === c.id ? c : k)) : [...s.calcs, c], values: exists ? s.values : [...s.values, calcKey(c.id)] }
    })
  }
  const deleteCalc = (cid: string) => setSpec(s => ({ ...s, calcs: s.calcs.filter(c => c.id !== cid), values: s.values.filter(v => v !== calcKey(cid)) }))

  // ---------------------------------------------------------------- persistence
  const save = () => {
    const s = actions.saveTemplate(compiled.template)
    setSavedKey(JSON.stringify([s.name, s.description ?? '', s.studio]))
    if (!saved) navigate(`#/studio/${s.id}`, true)
    flash('Reporte guardado')
    return s
  }
  const toAdvanced = () => {
    if (!confirm('En modo avanzado tenés JOINs, parámetros y SQL, pero el reporte ya no se podrá editar en el modo simple. ¿Continuar?')) return
    const s = actions.saveTemplate({ ...compiled.template, studio: undefined })
    navigate(`#/builder/${s.id}`)
  }

  const res = result && !('error' in result) ? result : null
  const notes = [...compiled.warnings, ...(res?.warnings ?? [])]

  return (
    <div className="flex h-[calc(100vh-48px)] min-h-0">
      <Palette spec={spec} onAdd={(what, key) => (what === 'group' ? addGroup(key) : addValue(key))} onFilter={addFilter} onShow={addField}
        onNewCalc={() => setCalcOpen(true)} onEditCalc={c => setFormula({ open: true, calc: c })} onDeleteCalc={deleteCalc} />

      <main className="min-w-0 flex-1 overflow-y-auto">
        {/* ---------------- header */}
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b bg-card/95 px-5 py-2.5 backdrop-blur">
          <button onClick={() => navigate('#/')} className="rounded p-1 text-muted-foreground hover:bg-muted" title="Volver"><ArrowLeft size={16} /></button>
          <div className="min-w-0 flex-1">
            <input value={meta.name} onChange={e => setMeta(m => ({ ...m, name: e.target.value }))} className="w-full truncate bg-transparent text-[16px] font-semibold outline-none focus:underline decoration-primary" />
            <input value={meta.description ?? ''} onChange={e => setMeta(m => ({ ...m, description: e.target.value }))} placeholder="Descripción…" className="w-full truncate bg-transparent text-[12px] text-muted-foreground outline-none" />
          </div>
          <Badge tone="positive">Simple</Badge>
          {scheduleLabel(meta.schedule) && <Badge tone="info"><CalendarClock size={11} /> {scheduleLabel(meta.schedule)}</Badge>}
          {dirty && <span className="text-[11px] text-muted-foreground">sin guardar</span>}
          <Button variant="ghost" onClick={toAdvanced} title="Abrir en el Builder avanzado (JOINs, parámetros, SQL)"><Wrench size={14} /> Modo avanzado</Button>
          <Button onClick={() => setSchedOpen(true)}><CalendarClock size={14} /> Programar</Button>
          <Button onClick={save} disabled={!dirty}><Save size={14} /> Guardar</Button>
          <Button variant="primary" disabled={!spec.values.length} onClick={() => { const s = dirty || !saved ? save() : compiled.template; navigate(`#/view/${s.id}?run=1`) }}><Play size={14} /> Ejecutar</Button>
        </div>

        <div className="mx-auto max-w-[1180px] space-y-4 p-5">
          {!saved && <QuickStarts onPick={pickQuickStart} />}

          {/* ---------------- 1. source */}
          <Card className="p-4">
            <Step n={1} title="¿Qué querés analizar?" />
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              {(Object.keys(SOURCES) as SourceId[]).map(s => {
                const Icon = SOURCE_ICON[s]
                const on = spec.source === s
                return (
                  <button key={s} onClick={() => switchSource(s)}
                    className={cn('flex items-start gap-3 rounded-lg border p-3 text-left transition-colors', on ? 'border-primary bg-accent/40 ring-2 ring-primary/20' : 'hover:border-primary/60 hover:bg-muted/60')}>
                    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md', on ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}><Icon size={17} /></div>
                    <div>
                      <div className="text-[14px] font-semibold">{SOURCES[s].label}</div>
                      <div className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{SOURCES[s].description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
            {spec.source === 'transactions' && <TypePicker spec={spec} onChange={txTypes => upd({ txTypes })} onEmpty={() => flash('Dejá al menos un tipo de transacción.')} />}
          </Card>

          {/* ---------------- 2. layout */}
          <Card className="space-y-2.5 p-4">
            <Step n={2} title="Armá el reporte" hint="Arrastrá bloques desde la izquierda, o hacé click en ellos." />
            <PeriodPicker spec={spec} onChange={period => upd({ period })} />

            <DropZone zone="group" title="Agrupar por" sub="una fila por cada combinación" icon={<Rows3 size={14} />} onDrop={onDrop}
              empty="Soltá Grupo, Empresa, Cuenta, Moneda, País… Podés combinar varios."
              footer={<Suggestions spec={spec} onAdd={addGroup} />}>
              {spec.groupBy.map(k => (
                <Chip key={k} zone="group" id={k} tone="group" label={groupDef(spec.source, k)?.label ?? k} onDrop={onDrop} onRemove={() => remove('group', k)} />
              ))}
            </DropZone>

            <DropZone zone="value" title="Mostrar" sub="las columnas de cada fila" icon={<Sigma size={14} />} onDrop={onDrop}
              empty="Soltá montos, saldos o KPIs, o un campo como Categoría o Tag para verlo como columna sin agrupar por él.">
              {spec.values.map(k => {
                if (isFieldKey(k)) return <Chip key={k} zone="value" id={k} tone="info" label={valueLabel(spec, k)} onDrop={onDrop} onRemove={() => remove('value', k)}
                  title="Se muestra el valor de cada fila; si la fila junta varios, dice cuántos" />
                const isCalc = k.startsWith('calc:')
                const def = isCalc ? undefined : valueDef(spec.source, k)
                // a value that needs groupings which were removed offers to put them back
                const missing = (def?.needsGroups ?? []).filter(g => !spec.groupBy.includes(g))
                return (
                  <Chip key={k} zone="value" id={k} tone={isCalc || def?.expr ? 'calc' : 'value'} label={valueLabel(spec, k)} title={def?.hint}
                    warn={valueBlocked(spec, k) ?? undefined} onDrop={onDrop} onRemove={() => remove('value', k)}>
                    {missing.length > 0 && (
                      <button onClick={e => { e.stopPropagation(); setSpec(s => ({ ...s, groupBy: [...s.groupBy, ...missing.filter(g => !s.groupBy.includes(g))] })) }}
                        className="ml-1 inline-block rounded bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90"
                        title="Agregar a Agrupar por lo que este valor necesita">
                        + {missing.map(g => groupDef(spec.source, g)?.column ?? groupDef(spec.source, g)?.label).join(', ')}
                      </button>
                    )}
                  </Chip>
                )
              })}
            </DropZone>

            <DropZone zone="filter" title="Filtrar" sub="qué datos entran" icon={<FilterIcon size={14} />} onDrop={onDrop} empty="Soltá un campo para quedarte sólo con algunos valores (ej. ciertas cuentas o categorías).">
              {spec.filters.map(f => (
                <FilterChip key={f.id} f={f} t={compiled.template} open={openFilter === f.id} onOpen={o => setOpenFilter(o ? f.id : null)} onDrop={onDrop}
                  onChange={nf => upd({ filters: spec.filters.map(x => (x.id === f.id ? { ...nf, key: f.key } : x)) })} onRemove={() => remove('filter', f.id)} />
              ))}
            </DropZone>
          </Card>

          {/* ---------------- 3. result */}
          <Card className="p-4">
            <Step n={3} title="Resultado" hint={res ? `${res.rows.length.toLocaleString('es-AR')} filas · ${res.grainLabel}` : undefined} />
            <OutputBar t={compiled.template} onChange={(o, extra) => upd({ output: { ...spec.output, ...o }, ...(extra && 'limit' in extra ? { limit: extra.limit } : {}) })} />
            {notes.map(w => (
              <div key={w} className="mt-3 flex items-start gap-2 rounded-lg border border-negative/30 bg-negative/5 px-3 py-2 text-[12.5px]"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-negative" />{w}</div>
            ))}
            <div className="pt-3">
              {!spec.values.length ? <Empty>Agregá al menos un valor en <b>Mostrar</b> para ver el resultado.</Empty>
                : result && 'error' in result ? <div className="text-sm text-negative">{result.error}</div>
                  : res && <ReportOutput template={compiled.template} result={res} />}
            </div>
            {res && res.notices.length > 0 && (
              <details className="mt-3 text-[12px] text-muted-foreground">
                <summary className="cursor-pointer select-none"><Info size={12} className="mr-1 inline" />Cómo se calculó</summary>
                <ul className="mt-1 list-disc space-y-0.5 pl-5">{res.notices.map(n => <li key={n}>{n}</li>)}</ul>
              </details>
            )}
          </Card>
        </div>
      </main>

      {calcOpen && (
        <CalcDialog spec={spec} onClose={() => setCalcOpen(false)} onSave={c => { saveCalc(c); setCalcOpen(false) }}
          onFreeFormula={() => { setCalcOpen(false); setFormula({ open: true }) }} />
      )}
      {formula.open && (
        <FormulaEditor open onClose={() => setFormula({ open: false })} template={compiled.template} initial={formula.calc} entityIds={src.entities}
          onSave={c => { saveCalc(c.format === 'text' ? { ...c, format: 'number' } : c); setFormula({ open: false }) }} />
      )}
      {schedOpen && (
        <ScheduleDialog open onClose={() => setSchedOpen(false)} value={meta.schedule}
          onSave={s => { setMeta(m => ({ ...m, schedule: s })); actions.saveTemplate({ ...compiled.template, schedule: s }); setSavedKey(JSON.stringify([meta.name, meta.description ?? '', spec])); flash('Programación guardada') }}
          onSimulate={() => { const run = actions.run(compiled.template, compiled.template.filters, 'scheduled'); flash(`Run programado simulado: ${run.id}`) }} />
      )}
      {toast && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-md bg-topbar px-4 py-2 text-[13px] text-white shadow-lg">{toast}</div>}
    </div>
  )
}

// ================================================================ layout pieces

function Step({ n, title, hint }: { n: number; title: string; hint?: string }) {
  return (
    <div className="mb-3 flex items-baseline gap-2">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">{n}</span>
      <span className="text-[14px] font-semibold">{title}</span>
      {hint && <span className="text-[12px] text-muted-foreground">{hint}</span>}
    </div>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-dashed p-8 text-center text-[13px] text-muted-foreground">{children}</div>
}

function QuickStarts({ onPick }: { onPick: (q: (typeof QUICK_STARTS)[number]) => void }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground"><Sparkles size={13} className="text-accent-foreground" /> Empezá desde un ejemplo, o armalo de cero abajo</div>
      <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-5">
        {QUICK_STARTS.map(q => {
          const Icon = SOURCE_ICON[q.spec.source]
          return (
            <button key={q.id} onClick={() => onPick(q)} className="rounded-lg border bg-card p-3 text-left transition-colors hover:border-primary hover:bg-accent/30">
              <div className="flex items-center gap-1.5 text-[13px] font-semibold"><Icon size={14} className="text-accent-foreground" />{q.name}</div>
              <div className="mt-1 text-[11.5px] leading-snug text-muted-foreground">{q.description}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TypePicker({ spec, onChange, onEmpty }: { spec: StudioSpec; onChange: (types: string[]) => void; onEmpty: () => void }) {
  const sel = new Set(spec.txTypes ?? [])
  const toggle = (type: string) => {
    const next = new Set(sel)
    next.has(type) ? next.delete(type) : next.add(type)
    if (!next.size) return onEmpty()
    onChange(TX_TYPES.map(x => x.type).filter(x => next.has(x)))
  }
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t pt-3">
      <span className="mr-1 text-[12px] font-medium text-muted-foreground">Incluir:</span>
      {TX_TYPES.map(x => (
        <button key={x.type} onClick={() => toggle(x.type)}
          className={cn('h-7 rounded-full border px-3 text-[12px] font-medium transition-colors', sel.has(x.type) ? 'border-primary bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted')}>
          {x.label}
        </button>
      ))}
      {sel.size < TX_TYPES.length && <button onClick={() => onChange(TX_TYPES.map(x => x.type))} className="ml-1 text-[12px] text-accent-foreground hover:underline">Todos</button>}
    </div>
  )
}

function PeriodPicker({ spec, onChange }: { spec: StudioSpec; onChange: (p: StudioSpec['period']) => void }) {
  const presets = PERIODS.filter(p => !(spec.source === 'balances' && p.preset === 'all'))
  const custom = spec.period.preset === 'custom'
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
      <span className="flex w-[118px] items-center gap-1.5 text-[12.5px] font-semibold"><CalendarDays size={14} className="text-muted-foreground" /> Período</span>
      <Segmented value={spec.period.preset} onChange={preset => onChange(preset === 'custom' ? { preset, from: spec.period.from ?? '2026-09-01', to: spec.period.to ?? TODAY } : { preset })}
        options={presets.map(p => ({ value: p.preset, label: p.label }))} />
      {custom && (
        <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <input type="date" className={cn(inputCls, 'h-7 w-[140px] text-[12px]')} value={spec.period.from ?? ''} onChange={e => onChange({ ...spec.period, from: e.target.value })} />
          a
          <input type="date" className={cn(inputCls, 'h-7 w-[140px] text-[12px]')} value={spec.period.to ?? ''} onChange={e => onChange({ ...spec.period, to: e.target.value })} />
        </span>
      )}
      <span className="ml-auto text-[11.5px] text-muted-foreground">
        {spec.source === 'balances' ? 'Saldo al inicio = fecha Desde, saldo al cierre = fecha Hasta. ' : ''}
        {spec.period.preset !== 'all' && 'Desde y Hasta se pueden cambiar al ejecutar.'}
      </span>
    </div>
  )
}

function Suggestions({ spec, onAdd }: { spec: StudioSpec; onAdd: (key: string) => void }) {
  const missing = ORG_KEYS.filter(k => !spec.groupBy.includes(k) && groupDef(spec.source, k))
  if (!missing.length) return null
  return (
    <div className="flex flex-wrap items-center gap-1 pt-1.5">
      <span className="text-[11px] text-muted-foreground">Rápido:</span>
      {missing.map(k => (
        <button key={k} onClick={() => onAdd(k)} className="inline-flex h-6 items-center gap-0.5 rounded-md border border-dashed px-1.5 text-[11.5px] text-muted-foreground hover:border-info/60 hover:bg-info/5 hover:text-info">
          <Plus size={11} />{groupDef(spec.source, k)!.label}
        </button>
      ))}
    </div>
  )
}

// ================================================================ drag & drop

function DropZone({ zone, title, sub, icon, empty, onDrop, children, footer }: {
  zone: Zone; title: string; sub?: string; icon: React.ReactNode; empty: string; onDrop: (d: Drag, z: Zone, before?: string) => void; children: React.ReactNode[]; footer?: React.ReactNode
}) {
  const [over, setOver] = useState(false)
  return (
    <div
      onDragOver={e => { if (e.dataTransfer.types.includes(MIME)) { e.preventDefault(); setOver(true) } }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); const d = readDrag(e); if (d) onDrop(d, zone) }}
      className={cn('grid grid-cols-[118px_1fr] items-start gap-2 rounded-lg border-2 border-dashed px-3 py-2 transition-colors', over ? 'border-primary bg-accent/40' : 'border-border bg-card')}>
      <div className="pt-1">
        <div className="flex items-center gap-1.5 text-[12.5px] font-semibold"><span className="text-muted-foreground">{icon}</span>{title}</div>
        {sub && <div className="pl-5 text-[10.5px] leading-tight text-muted-foreground">{sub}</div>}
      </div>
      <div>
        <div className="flex min-h-[30px] flex-wrap items-center gap-1.5">
          {children.length ? children : <span className="text-[12px] text-muted-foreground">{empty}</span>}
        </div>
        {footer}
      </div>
    </div>
  )
}

function Chip({ zone, id, label, tone, title, warn, onDrop, onRemove, onClick, children }: {
  zone: Zone; id: string; label: string; tone: 'group' | 'value' | 'calc' | 'filter' | 'info'; title?: string; warn?: string
  onDrop: (d: Drag, z: Zone, before?: string) => void; onRemove: () => void; onClick?: () => void; children?: React.ReactNode
}) {
  const [over, setOver] = useState(false)
  return (
    <div draggable title={warn ?? title}
      onDragStart={e => { e.dataTransfer.setData(MIME, JSON.stringify({ kind: 'chip', zone, key: id } satisfies Drag)); e.stopPropagation() }}
      onDragOver={e => { if (e.dataTransfer.types.includes(MIME)) { e.preventDefault(); e.stopPropagation(); setOver(true) } }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); e.stopPropagation(); setOver(false); const d = readDrag(e); if (d) onDrop(d, zone, zone === 'filter' ? undefined : id) }}
      onClick={onClick}
      className={cn('group flex h-7 cursor-grab items-center gap-1 rounded-md border pl-1 pr-1 text-[12.5px] font-medium shadow-sm active:cursor-grabbing',
        tone === 'group' && 'border-info/30 bg-info/5 hover:bg-info/10',
        tone === 'value' && 'border-positive/30 bg-positive/5 hover:bg-positive/10',
        tone === 'calc' && 'border-primary/40 bg-accent/40 hover:bg-accent/70',
        tone === 'info' && 'border-info/30 bg-card hover:bg-info/5',
        tone === 'filter' && 'cursor-pointer border-foreground/15 bg-muted font-normal hover:bg-accent/60',
        warn && 'border-negative/40 bg-negative/5 line-through decoration-negative/50',
        over && 'border-l-4 border-l-primary')}>
      <GripVertical size={12} className="text-muted-foreground/60" />
      {tone === 'calc' && <Calculator size={12} className="text-accent-foreground" />}
      {tone === 'info' && <Type size={12} className="text-info" />}
      {tone === 'filter' && <FilterIcon size={12} className="text-muted-foreground" />}
      <span className="max-w-[260px] truncate">{label}</span>
      {children}
      <button onClick={e => { e.stopPropagation(); onRemove() }} className="rounded p-0.5 text-muted-foreground opacity-60 hover:bg-card hover:opacity-100" title="Quitar"><X size={12} /></button>
    </div>
  )
}

function FilterChip({ f, t, open, onOpen, onDrop, onChange, onRemove }: {
  f: StudioFilter; t: ReportTemplate; open: boolean; onOpen: (o: boolean) => void; onDrop: (d: Drag, z: Zone, before?: string) => void
  onChange: (f: StudioFilter) => void; onRemove: () => void
}) {
  const label = groupDef(t.studio!.source, f.key)?.label
  // show the Studio name of the field (Empresa, Categoría…) instead of the catalog one
  const summary = filterSummary(f, t.calcs, t).replace(refInfo(f.ref, t.calcs).label, label ?? refInfo(f.ref, t.calcs).label)
  return (
    <div className="relative">
      <Chip zone="filter" id={f.id} tone="filter" label={summary} onDrop={onDrop} onRemove={onRemove} onClick={() => onOpen(!open)}
        title={f.exposed ? 'Se puede cambiar al ejecutar' : undefined} />
      <Popover open={open} onClose={() => onOpen(false)} className="w-[300px]">
        <div className="space-y-3">
          <div className="text-[13px] font-semibold">{label ?? refInfo(f.ref, t.calcs).label}</div>
          <FilterEditor filter={f} calcs={t.calcs} onChange={nf => onChange({ ...nf, key: f.key })} />
          <label className="flex items-center gap-2 border-t pt-2 text-[12.5px]">
            <input type="checkbox" className="accent-[hsl(38_35%_53%)]" checked={!!f.exposed} onChange={e => onChange({ ...f, exposed: e.target.checked })} />
            Se puede cambiar al ejecutar
          </label>
        </div>
      </Popover>
    </div>
  )
}

// ================================================================ palette

function Palette({ spec, onAdd, onFilter, onShow, onNewCalc, onEditCalc, onDeleteCalc }: {
  spec: StudioSpec; onAdd: (what: 'group' | 'value', key: string) => void; onFilter: (key: string) => void; onShow: (key: string) => void
  onNewCalc: () => void; onEditCalc: (c: CalcField) => void; onDeleteCalc: (id: string) => void
}) {
  const [q, setQ] = useState('')
  const src = SOURCES[spec.source]
  const match = (label: string) => !q || label.toLowerCase().includes(q.toLowerCase())
  const bySection = <T extends { section: string; label: string }>(xs: T[]) => {
    const m = new Map<string, T[]>()
    xs.filter(x => match(x.label)).forEach(x => m.set(x.section, [...(m.get(x.section) ?? []), x]))
    return [...m]
  }
  return (
    <aside className="flex w-[290px] shrink-0 flex-col border-r bg-card">
      <div className="border-b p-3">
        <div className="mb-2 text-[12px] text-muted-foreground">Bloques de <b className="text-foreground">{src.label}</b></div>
        <div className="relative">
          <Search size={14} className="absolute left-2 top-2 text-muted-foreground" />
          <input className={cn(inputCls, 'pl-7')} placeholder="Buscar…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
        <div>
          <Label>Agrupar por</Label>
          {bySection(src.groups).map(([section, items]) => (
            <div key={section} className="mb-2">
              <div className="px-1 pb-0.5 text-[11px] text-muted-foreground">{section}</div>
              {items.map(g => (
                <PaletteItem key={g.key} what="group" id={g.key} label={g.label} used={spec.groupBy.includes(g.key) || spec.values.includes(fieldKey(g.key))}
                  onAdd={() => onAdd('group', g.key)} onFilter={() => onFilter(g.key)} onShow={canShowAsColumn(spec.source, g.key) ? () => onShow(g.key) : undefined} />
              ))}
            </div>
          ))}
        </div>
        <div>
          <Label>Valores</Label>
          {bySection(src.values).map(([section, items]) => (
            <div key={section} className="mb-2">
              <div className="px-1 pb-0.5 text-[11px] text-muted-foreground">{section}</div>
              {items.map(v => (
                <PaletteItem key={v.key} what="value" id={v.key} label={v.label} hint={v.hint} calc={!!v.expr} used={spec.values.includes(v.key)}
                  blocked={valueBlocked(spec, v.key) ?? undefined} onAdd={() => onAdd('value', v.key)} onFilter={v.ref ? () => onFilter(v.key) : undefined} />
              ))}
            </div>
          ))}
        </div>
        <div>
          <Label>Campos calculados</Label>
          {spec.calcs.filter(c => match(c.name)).map(c => (
            <PaletteItem key={c.id} what="value" id={calcKey(c.id)} label={c.name} hint={c.expr} calc used={spec.values.includes(calcKey(c.id))} onAdd={() => onAdd('value', calcKey(c.id))}
              extra={<>
                <button className="rounded p-0.5 text-muted-foreground hover:bg-card hover:text-foreground" title="Editar" onClick={e => { e.stopPropagation(); onEditCalc(c) }}><Pencil size={12} /></button>
                <button className="rounded p-0.5 text-muted-foreground hover:bg-card hover:text-negative" title="Borrar" onClick={e => { e.stopPropagation(); onDeleteCalc(c.id) }}><Trash2 size={12} /></button>
              </>} />
          ))}
          <button onClick={onNewCalc} className="mt-1 flex w-full items-center gap-1.5 rounded-md border border-dashed px-2 py-2 text-left text-[12px] text-muted-foreground hover:border-primary/60 hover:bg-accent/30 hover:text-foreground">
            <Calculator size={13} /> Nuevo campo calculado
          </button>
        </div>
      </div>
    </aside>
  )
}

function PaletteItem({ what, id, label, hint, calc, used, blocked, onAdd, onFilter, onShow, extra }: {
  what: 'group' | 'value'; id: string; label: string; hint?: string; calc?: boolean; used: boolean; blocked?: string
  onAdd: () => void; onFilter?: () => void; onShow?: () => void; extra?: React.ReactNode
}) {
  return (
    <div draggable={!blocked} onClick={onAdd} title={blocked ?? hint}
      onDragStart={e => { e.dataTransfer.setData(MIME, JSON.stringify({ kind: 'item', what, key: id } satisfies Drag)); e.dataTransfer.effectAllowed = 'copy' }}
      className={cn('group flex cursor-grab items-center gap-1.5 rounded-md px-1.5 py-[3px] text-[12.5px] hover:bg-muted active:cursor-grabbing', blocked && 'cursor-not-allowed opacity-45')}>
      <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded', what === 'group' ? 'bg-info/10 text-info' : calc ? 'bg-accent text-accent-foreground' : 'bg-positive/10 text-positive')}>
        {what === 'group' ? <Rows3 size={10} /> : calc ? <Calculator size={10} /> : <Sigma size={10} />}
      </span>
      <span className={cn('min-w-0 flex-1 truncate', used && 'font-semibold')}>{label}</span>
      <span className="hidden items-center gap-0.5 group-hover:flex">
        {extra}
        {onShow && <button className="rounded p-0.5 text-muted-foreground hover:bg-card hover:text-foreground" title="Mostrar como columna (sin agrupar)" onClick={e => { e.stopPropagation(); onShow() }}><Columns3 size={12} /></button>}
        {onFilter && <button className="rounded p-0.5 text-muted-foreground hover:bg-card hover:text-foreground" title="Usar como filtro" onClick={e => { e.stopPropagation(); onFilter() }}><FilterIcon size={12} /></button>}
        <Plus size={13} className="text-accent-foreground" />
      </span>
    </div>
  )
}

// ================================================================ calculated fields

const OPS = [
  { op: 'sub', label: '−  menos', build: (a: string, b: string) => `${a} - ${b}`, name: (a: string, b: string) => `${a} − ${b}`, format: 'currency' as const },
  { op: 'add', label: '+  más', build: (a: string, b: string) => `${a} + ${b}`, name: (a: string, b: string) => `${a} + ${b}`, format: 'currency' as const },
  { op: 'mul', label: '×  por', build: (a: string, b: string) => `${a} * ${b}`, name: (a: string, b: string) => `${a} × ${b}`, format: 'number' as const },
  { op: 'div', label: '÷  dividido', build: (a: string, b: string) => `DIV(${a}, ${b})`, name: (a: string, b: string) => `${a} ÷ ${b}`, format: 'number' as const },
  { op: 'share', label: '%  como % de', build: (a: string, b: string) => `DIV(${a}, ${b})`, name: (a: string, b: string) => `${a} como % de ${b}`, format: 'percent' as const },
  { op: 'pct', label: 'Δ%  variación % contra', build: (a: string, b: string) => `DIV(${a} - ${b}, ABS(${b}))`, name: (a: string, b: string) => `Variación % ${a} vs ${b}`, format: 'percent' as const },
]

function CalcDialog({ spec, onClose, onSave, onFreeFormula }: { spec: StudioSpec; onClose: () => void; onSave: (c: CalcField) => void; onFreeFormula: () => void }) {
  const options = [
    ...SOURCES[spec.source].values.filter(v => !valueBlocked(spec, v.key)).map(v => ({ key: v.key, label: v.label })),
    ...spec.calcs.map(c => ({ key: calcKey(c.id), label: c.name })),
  ]
  const [a, setA] = useState(spec.values.find(v => options.some(o => o.key === v)) ?? options[0].key)
  const [b, setB] = useState(spec.values.find(v => v !== a && options.some(o => o.key === v)) ?? options[1]?.key ?? options[0].key)
  const [op, setOp] = useState(OPS[0].op)
  const [name, setName] = useState('')
  const [format, setFormat] = useState<CalcField['format']>()
  const o = OPS.find(x => x.op === op)!
  const label = (k: string) => options.find(x => x.key === k)?.label ?? k
  const readable = o.name(label(a), label(b))
  const expr = o.build(`[@${columnId(a)}]`, `[@${columnId(b)}]`)
  const sel = cn(inputCls, 'text-[13px]')
  return (
    <Modal open onClose={onClose} width={620} title={<span className="inline-flex items-center gap-2"><Calculator size={16} className="text-accent-foreground" /> Nuevo campo calculado</span>}
      subtitle="Combiná dos valores del reporte. Se calcula en cada fila y en los totales."
      footer={<>
        <Button variant="ghost" className="mr-auto" onClick={onFreeFormula}>Escribir una fórmula libre…</Button>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="primary" disabled={a === b && op !== 'mul' && op !== 'add'} onClick={() => onSave({ id: uid('k'), name: name.trim() || readable, expr, format: format ?? o.format })}>Crear campo</Button>
      </>}>
      <div className="grid grid-cols-[1fr_190px_1fr] items-end gap-2">
        <div><Label>Valor</Label><select className={sel} value={a} onChange={e => setA(e.target.value)}>{options.map(x => <option key={x.key} value={x.key}>{x.label}</option>)}</select></div>
        <div><Label>Operación</Label><select className={sel} value={op} onChange={e => { setOp(e.target.value); setFormat(undefined) }}>{OPS.map(x => <option key={x.op} value={x.op}>{x.label}</option>)}</select></div>
        <div><Label>Valor</Label><select className={sel} value={b} onChange={e => setB(e.target.value)}>{options.map(x => <option key={x.key} value={x.key}>{x.label}</option>)}</select></div>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_190px] gap-2">
        <div><Label>Nombre de la columna</Label><input className={cn(inputCls, 'text-[13px]')} placeholder={readable} value={name} onChange={e => setName(e.target.value)} /></div>
        <div>
          <Label>Formato</Label>
          <select className={sel} value={format ?? o.format} onChange={e => setFormat(e.target.value as CalcField['format'])}>
            <option value="currency">Moneda</option><option value="number">Número</option><option value="percent">Porcentaje</option>
          </select>
        </div>
      </div>
      <div className="mt-3 rounded-md bg-muted px-3 py-2 text-[12px] text-muted-foreground">
        <b className="text-foreground">{name.trim() || readable}</b> = {readable}
        {[a, b].some(k => !spec.values.includes(k)) && <div className="mt-1">Los valores que usa y todavía no están en <b>Mostrar</b> se agregan solos.</div>}
      </div>
    </Modal>
  )
}
