import { AlertTriangle, ArrowLeft, CalendarClock, Code2, GitMerge, Info, Link2, Play, Save, Table2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FieldPanel, type AddTarget } from '../builder/FieldPanel'
import { FormulaEditor } from '../builder/FormulaEditor'
import { GrainDialog } from '../builder/GrainDialog'
import { defaultFilter, newColumn, refInfo, usedEntityIds } from '../builder/helpers'
import { OutputBar } from '../builder/OutputBar'
import { ScheduleDialog, scheduleLabel } from '../builder/ScheduleDialog'
import { measureEntity, nextCtxName, Shelves } from '../builder/Shelves'
import type { ParamBinding } from '../builder/FilterEditor'
import { analyzeMix, runReport } from '../engine/query'
import type { CalcField, GrainMode, JoinContext, ReportTemplate } from '../engine/report'
import { grainApplies, uid } from '../engine/report'
import { DOMAINS } from '../model/silver'
import { ReportOutput } from '../output/ReportOutput'
import { actions, catalog, dataStore, TODAY, useStore } from '../state/store'
import { navigate } from '../App'
import { Badge, Button, Card, cn, Modal, Segmented } from '../ui/primitives'

const MODE_LABEL: Record<GrainMode, string> = { parent: 'Resumir por padre', nested: 'Jerárquico', child: 'Detalle por hijo', flat: 'Plano (todas las dimensiones)' }

export function blankTemplate(domain = 'fe'): ReportTemplate {
  return {
    id: uid('tpl_'), name: 'Reporte sin título', domain, dimensions: [], measures: [], filters: [], calcs: [],
    output: { type: 'table', showTotals: true }, updatedAt: new Date().toISOString(), owner: 'nicolas@treasuryhub.ai',
  }
}

export function BuilderPage({ id }: { id?: string }) {
  const templates = useStore(s => s.templates)
  const saved = templates.find(t => t.id === id)
  const [t, setT] = useState<ReportTemplate>(() => structuredClone(saved ?? blankTemplate(new URLSearchParams(location.hash.split('?')[1]).get('domain') ?? 'fe')))
  const [savedJson, setSavedJson] = useState(() => (saved ? JSON.stringify(saved) : ''))
  const [tab, setTab] = useState<'result' | 'sql' | 'json'>('result')
  const [formula, setFormula] = useState<{ open: boolean; calc?: CalcField }>({ open: false })
  const [grainOpen, setGrainOpen] = useState(false)
  const [schedOpen, setSchedOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const dirty = JSON.stringify(t) !== savedJson

  const patch = (p: Partial<ReportTemplate>) => setT(x => ({ ...x, ...p }))

  const mix = useMemo(() => analyzeMix(t, catalog), [t])
  const result = useMemo(() => {
    try { return runReport(t, catalog, dataStore, { today: TODAY }) } catch (e) { return { error: (e as Error).message } as const }
  }, [t])

  // Ask how to group as soon as a parent and a child get mixed (once per combination).
  const asked = useRef(new Set<string>())
  useEffect(() => {
    if (mix.needsDecision && !asked.current.has(mix.signature)) {
      asked.current.add(mix.signature)
      setGrainOpen(true)
    }
  }, [mix.needsDecision, mix.signature])

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2600) }

  const usedRefs = useMemo(() => new Set([...t.dimensions, ...t.measures, ...t.filters].map(c => c.ref)), [t])

  /** Pure: returns the template with `ref` added to `target` (measures dropped on Dimensions are redirected). */
  const addTo = (x: ReportTemplate, ref: string, target: AddTarget, beforeId?: string, ctx?: string): ReportTemplate => {
    const info = refInfo(ref, x.calcs)
    if (target.startsWith('ctx:')) {
      const cid = target.slice(4)
      // in a JOIN, a date usually means "as of": saldo al {fecha}
      const f = info.type === 'date' ? { ...defaultFilter(ref, x.calcs), op: 'lte' as const, value: undefined } : defaultFilter(ref, x.calcs)
      return { ...x, contexts: (x.contexts ?? []).map(c => (c.id === cid ? { ...c, filters: [...c.filters, f] } : c)) }
    }
    if (target === 'filters') return { ...x, filters: [...x.filters, defaultFilter(ref, x.calcs)] }
    let shelf = target as 'dimensions' | 'measures'
    if (shelf === 'dimensions' && (info.role === 'measure' || (info.type === 'calc' && info.agg))) shelf = 'measures'
    const col = { ...newColumn(ref, shelf, x.calcs), ...(shelf === 'measures' && ctx ? { ctx } : {}) }
    const list = [...x[shelf]]
    const i = beforeId ? list.findIndex(c => c.id === beforeId) : -1
    i >= 0 ? list.splice(i, 0, col) : list.push(col)
    return { ...x, [shelf]: list }
  }

  const [joinAsk, setJoinAsk] = useState<{ ref: string; beforeId?: string; entity: string } | null>(null)

  const add = (ref: string, target: AddTarget, beforeId?: string) => {
    const info = refInfo(ref, t.calcs)
    const toMeasures = target === 'measures' || (target === 'dimensions' && (info.role === 'measure' || (info.type === 'calc' && info.agg)))
    if (target === 'dimensions' && toMeasures) flash(`"${info.label}" es ${info.type === 'calc' ? 'una fórmula de agregación' : 'una medida'}: se agregó a Medidas.`)
    // the table is already in the report: same JOIN or a new one with its own filters?
    const entity = toMeasures ? measureEntity(ref) : undefined
    if (entity && t.measures.some(m => measureEntity(m.ref) === entity)) { setJoinAsk({ ref, beforeId, entity }); return }
    setT(x => addTo(x, ref, target, beforeId))
  }

  const answerJoin = (choice: { ctx?: string } | 'new') => {
    const ask = joinAsk!
    setJoinAsk(null)
    setT(x => {
      if (choice !== 'new') return addTo(x, ask.ref, 'measures', ask.beforeId, choice.ctx)
      // new JOIN: if the existing measures of this table are in the main join, they become t1 and the new one t2
      let next = x
      const plain = x.measures.filter(m => measureEntity(m.ref) === ask.entity && !m.ctx)
      if (plain.length && !(x.contexts ?? []).some(c => c.entity === ask.entity)) {
        const c1: JoinContext = { id: uid('x'), entity: ask.entity, name: nextCtxName(next), filters: [] }
        next = { ...next, contexts: [...(next.contexts ?? []), c1], measures: next.measures.map(m => (plain.includes(m) ? { ...m, ctx: c1.id } : m)) }
      }
      const c2: JoinContext = { id: uid('x'), entity: ask.entity, name: nextCtxName(next), filters: [] }
      next = { ...next, contexts: [...(next.contexts ?? []), c2] }
      return addTo(next, ask.ref, 'measures', ask.beforeId, c2.id)
    })
  }

  const onDrop = (d: { kind: 'field'; ref: string } | { kind: 'chip'; from: AddTarget; id: string }, to: AddTarget, beforeId?: string) => {
    if (d.kind === 'field') return add(d.ref, to, beforeId)
    if (d.from === to) {
      if (to === 'filters' || to.startsWith('ctx:') || !beforeId || beforeId === d.id) return
      const shelf = to as 'dimensions' | 'measures'
      setT(x => {
        const list = [...x[shelf]]
        const [moved] = list.splice(list.findIndex(c => c.id === d.id), 1)
        list.splice(list.findIndex(c => c.id === beforeId), 0, moved)
        return { ...x, [shelf]: list }
      })
      return
    }
    // moved across shelves: remove from the source, add to the target
    setT(x => {
      if (d.from.startsWith('ctx:')) return x
      const from = d.from as 'dimensions' | 'measures' | 'filters'
      const src = from === 'filters' ? x.filters.find(f => f.id === d.id) : x[from].find(c => c.id === d.id)
      if (!src) return x
      const without = from === 'filters' ? { ...x, filters: x.filters.filter(f => f.id !== d.id) } : { ...x, [from]: x[from].filter(c => c.id !== d.id) }
      return addTo(without, src.ref, to, beforeId, 'ctx' in src ? src.ctx : undefined)
    })
  }

  const remove = (shelf: AddTarget, cid: string) => {
    if (shelf === 'filters') patch({ filters: t.filters.filter(f => f.id !== cid) })
    else if (shelf === 'dimensions' || shelf === 'measures') patch({ [shelf]: t[shelf].filter(c => c.id !== cid), sort: t.sort?.ref === cid ? undefined : t.sort })
  }

  const binding: ParamBinding = {
    params: t.params ?? [],
    onCreate: (type, seed) => {
      const id = uid('p')
      const n = (t.params?.length ?? 0) + 1
      const isoDate = typeof seed === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(seed)
      const value = type === 'date' ? (isoDate ? (seed as string) : '@today') : typeof seed === 'string' || typeof seed === 'number' ? seed : ''
      setT(x => ({ ...x, params: [...(x.params ?? []), { id, name: type === 'date' ? `Fecha ${n}` : `Parámetro ${n}`, type, value }] }))
      flash('Parámetro creado: renombralo en la fila Parámetros')
      return id
    },
  }

  const save = () => {
    // once edited here, the template is no longer compiled from a simple-builder spec
    const s = actions.saveTemplate({ ...t, studio: undefined })
    setT(s); setSavedJson(JSON.stringify(s))
    if (!id) navigate(`#/builder/${s.id}`, true)
    flash('Template guardado')
    return s
  }

  const saveCalc = (c: CalcField) => {
    setT(x => {
      const exists = x.calcs.some(k => k.id === c.id)
      const next = { ...x, calcs: exists ? x.calcs.map(k => (k.id === c.id ? c : k)) : [...x.calcs, c] }
      return exists ? next : addTo(next, `calc.${c.id}`, c.format === 'text' ? 'dimensions' : 'measures')
    })
  }

  const entityIds = useMemo(() => {
    const dom = DOMAINS.find(d => d.id === t.domain)!
    const ids = new Set<string>(usedEntityIds(t))
    const walk = (n: { entity: string; children?: { entity: string }[] }) => { ids.add(n.entity); n.children?.forEach(walk) }
    dom.tree.forEach(walk)
    return [...ids]
  }, [t])

  const res = 'error' in result ? null : result

  return (
    <div className="flex h-[calc(100vh-48px)] min-h-0">
      {/* ---------------- field catalog */}
      <aside className="w-[300px] shrink-0 border-r bg-card">
        <FieldPanel domain={t.domain} onDomain={d => patch({ domain: d })} calcs={t.calcs} usedRefs={usedRefs} onAdd={(r, tg) => add(r, tg)}
          onNewCalc={() => setFormula({ open: true })} onEditCalc={c => setFormula({ open: true, calc: c })}
          onDeleteCalc={cid => patch({ calcs: t.calcs.filter(c => c.id !== cid), measures: t.measures.filter(m => m.ref !== `calc.${cid}`), dimensions: t.dimensions.filter(m => m.ref !== `calc.${cid}`) })} />
      </aside>

      {/* ---------------- canvas */}
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b bg-card/95 px-5 py-2.5 backdrop-blur">
          <button onClick={() => navigate('#/')} className="rounded p-1 text-muted-foreground hover:bg-muted" title="Volver"><ArrowLeft size={16} /></button>
          <div className="min-w-0 flex-1">
            <input value={t.name} onChange={e => patch({ name: e.target.value })} className="w-full truncate bg-transparent text-[16px] font-semibold outline-none focus:underline decoration-primary" />
            <input value={t.description ?? ''} onChange={e => patch({ description: e.target.value })} placeholder="Descripción…" className="w-full truncate bg-transparent text-[12px] text-muted-foreground outline-none" />
          </div>
          <Badge tone="gold">Builder</Badge>
          {scheduleLabel(t.schedule) && <Badge tone="info"><CalendarClock size={11} /> {scheduleLabel(t.schedule)}</Badge>}
          {dirty && <span className="text-[11px] text-muted-foreground">sin guardar</span>}
          <Button onClick={() => setSchedOpen(true)}><CalendarClock size={14} /> Programar</Button>
          <Button onClick={save} disabled={!dirty}><Save size={14} /> Guardar</Button>
          <Button variant="primary" onClick={() => { const s = dirty || !saved ? save() : t; navigate(`#/view/${s.id}?run=1`) }}><Play size={14} /> Ejecutar en Viewer</Button>
        </div>

        <div className="space-y-3 p-5">
          <Shelves t={t} onDrop={onDrop} onChange={patch} onRemove={remove} binding={binding} />

          {/* ---------------- grain / relationship banners */}
          {mix.parent && !mix.multiScope && (
            <div className="flex items-center gap-3 rounded-lg border border-primary/40 bg-accent/40 px-3 py-2 text-[13px]">
              <GitMerge size={16} className="shrink-0 text-accent-foreground" />
              <div className="flex-1">
                <b>{catalog.entity(mix.parent).label}</b> (padre) + <b>{catalog.entity(mix.child!).label}</b> (hijo)
                {mix.bridge && <> vía <b>{catalog.entity(mix.bridge).label}</b> (M:N)</>}
                {' · '}
                {grainApplies(t.grain, mix.signature) ? <>agrupado como <b>{MODE_LABEL[t.grain.mode]}</b></> : <span className="text-accent-foreground">falta elegir cómo agrupar (por defecto: resumir por padre)</span>}
              </div>
              {grainApplies(t.grain, mix.signature) && (
                <Segmented value={t.grain.mode} onChange={m => patch({ grain: { signature: t.grain!.signature, mode: m } })}
                  options={[{ value: 'parent', label: 'Resumir' }, { value: 'nested', label: 'Jerárquico' }, { value: 'child', label: 'Detalle' }, { value: 'flat', label: 'Plano' }]} />
              )}
              <Button size="sm" onClick={() => setGrainOpen(true)}>Elegir…</Button>
            </div>
          )}
          {res && [...res.warnings].map(w => (
            <div key={w} className="flex items-start gap-2 rounded-lg border border-negative/30 bg-negative/5 px-3 py-2 text-[12.5px]"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-negative" />{w}</div>
          ))}
          {res && res.notices.map(n => (
            <div key={n} className="flex items-start gap-2 rounded-lg border border-info/25 bg-info/5 px-3 py-2 text-[12.5px]"><Info size={14} className="mt-0.5 shrink-0 text-info" />{n}</div>
          ))}

          {/* ---------------- output + preview */}
          <Card className="p-4">
            <OutputBar t={t} onChange={(o, extra) => patch({ output: { ...t.output, ...o }, ...extra })} />
            <div className="mt-3 flex items-center gap-3 border-b pb-2">
              <Segmented value={tab} onChange={setTab} options={[
                { value: 'result', label: <span className="inline-flex items-center gap-1"><Table2 size={12} /> Vista previa</span> },
                { value: 'sql', label: <span className="inline-flex items-center gap-1"><Code2 size={12} /> SQL sobre Silver</span> },
                { value: 'json', label: 'Definición' },
              ]} />
              {res && (
                <div className="ml-auto flex items-center gap-3 text-[11.5px] text-muted-foreground">
                  <span>Grano: <b className="text-foreground">{res.grainLabel}</b></span>
                  <span>{res.rows.length.toLocaleString('es-AR')} filas</span>
                  <span>{res.scanned.toLocaleString('es-AR')} filas leídas</span>
                  <span>{res.ms} ms</span>
                </div>
              )}
            </div>
            <div className="pt-3">
              {'error' in result ? <div className="text-sm text-negative">{result.error}</div>
                : tab === 'result' ? <ReportOutput template={t} result={result} />
                : tab === 'sql' ? <pre className={cn('overflow-auto rounded-md bg-[#1a1a19] p-4 text-[12px] leading-relaxed text-[#e8e6df]')}>{result.sql || '-- vacío'}</pre>
                : <pre className="max-h-[520px] overflow-auto rounded-md bg-muted p-4 text-[11.5px]">{JSON.stringify(t, null, 2)}</pre>}
            </div>
          </Card>
        </div>
      </main>

      {formula.open && (
        <FormulaEditor open onClose={() => setFormula({ open: false })} template={t} initial={formula.calc} entityIds={entityIds} onSave={saveCalc} />
      )}
      {grainOpen && mix.parent && (
        <GrainDialog open onClose={() => { setGrainOpen(false); setT(x => (x.grain?.signature === mix.signature ? x : { ...x, grain: { signature: mix.signature, mode: 'parent' } })) }}
          template={t} mix={mix} onPick={m => patch({ grain: { signature: mix.signature, mode: m } })} />
      )}
      {schedOpen && (
        <ScheduleDialog open onClose={() => setSchedOpen(false)} value={t.schedule}
          onSave={s => { const next = { ...t, schedule: s }; setT(next); const sv = actions.saveTemplate(next); setSavedJson(JSON.stringify(sv)); setT(sv) }}
          onSimulate={() => { const run = actions.run({ ...t }, t.filters, 'scheduled'); flash(`Run programado simulado: ${run.id}`) }} />
      )}
      {joinAsk && <JoinAskDialog t={t} ask={joinAsk} onAnswer={answerJoin} onClose={() => setJoinAsk(null)} />}
      {toast && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-md bg-topbar px-4 py-2 text-[13px] text-white shadow-lg">{toast}</div>}
    </div>
  )
}

function JoinAskDialog({ t, ask, onAnswer, onClose }: {
  t: ReportTemplate; ask: { ref: string; entity: string }; onAnswer: (c: { ctx?: string } | 'new') => void; onClose: () => void
}) {
  const e = catalog.entity(ask.entity)
  const field = refInfo(ask.ref, t.calcs).label
  const existing = t.measures.filter(m => measureEntity(m.ref) === ask.entity)
  const ctxIds = [...new Set(existing.map(m => m.ctx ?? ''))]
  const plainOnly = ctxIds.length === 1 && ctxIds[0] === '' && !(t.contexts ?? []).some(c => c.entity === ask.entity)
  const opt = (key: string, title: React.ReactNode, body: React.ReactNode, onClick: () => void, primary = false) => (
    <button key={key} onClick={onClick} className={cn('w-full rounded-lg border p-3 text-left transition-colors hover:border-primary hover:bg-accent/40', primary && 'border-primary/60 bg-accent/20')}>
      <div className="text-[14px] font-semibold">{title}</div>
      <div className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">{body}</div>
    </button>
  )
  return (
    <Modal open onClose={onClose} width={620}
      title={<span className="inline-flex items-center gap-2"><Link2 size={16} className="text-accent-foreground" /> {e.label} ya está en el reporte</span>}
      subtitle={<>Vas a agregar <b>{field}</b>. ¿Se calcula sobre el <b>mismo JOIN</b> (mismas filas y filtros) o sobre un <b>JOIN nuevo</b> de {e.label} con filtros propios?</>}>
      <div className="space-y-2">
        {ctxIds.map(cid => {
          const c = t.contexts?.find(x => x.id === cid)
          const cols = existing.filter(m => (m.ctx ?? '') === cid).map(m => m.label || refInfo(m.ref, t.calcs).label).join(', ')
          return opt(`same-${cid}`, <>Mismo JOIN{c ? <> · <span className="text-accent-foreground">{c.name}</span></> : ' (principal)'}</>,
            <>Junto a {cols}. Ej. monto y cantidad de las mismas transacciones.</>, () => onAnswer({ ctx: cid || undefined }))
        })}
        {opt('new', <>Nuevo JOIN de {e.label}</>,
          plainOnly
            ? <>Las columnas actuales pasan a <b>t1</b> y la nueva a <b>t2</b>. Después le ponés a cada JOIN su filtro (ej. fecha ≤ {'{Desde}'} y ≤ {'{Hasta}'}).</>
            : <>La nueva columna va a un JOIN propio. Le ponés sus filtros en la fila del JOIN.</>,
          () => onAnswer('new'), true)}
      </div>
    </Modal>
  )
}
