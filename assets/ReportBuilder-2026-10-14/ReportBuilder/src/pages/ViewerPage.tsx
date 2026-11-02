import { AlertTriangle, ArrowLeft, CalendarClock, CheckCircle2, Clock, Download, Pencil, Play, User, Variable, XCircle, Zap } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FilterEditor } from '../builder/FilterEditor'
import { filterSummary } from '../builder/helpers'
import { OUTPUTS } from '../builder/OutputBar'
import { scheduleLabel } from '../builder/ScheduleDialog'
import { runReport, type QueryResult } from '../engine/query'
import { RELATIVE_DATES, type Filter, type ReportParam, type ReportRun, type ReportTemplate } from '../engine/report'
import { formatParamValue, interpolate, relativeLabel, resolveParamValues, resolveRelative } from '../engine/params'
import { DOMAINS } from '../model/silver'
import { ReportOutput } from '../output/ReportOutput'
import { actions, catalog, dataStore, TODAY, useStore } from '../state/store'
import { navigate } from '../App'
import { fmtDateTime } from '../ui/format'
import { Badge, Button, Card, cn, Popover } from '../ui/primitives'

export function ViewerPage({ id, runId, autoRun }: { id: string; runId?: string; autoRun?: boolean }) {
  const templates = useStore(s => s.templates)
  const allRuns = useStore(s => s.runs)
  const template = templates.find(t => t.id === id)
  const runs = useMemo(() => allRuns.filter(r => r.templateId === id), [allRuns, id])
  const [params, setParams] = useState<Filter[]>(() => structuredClone(template?.filters ?? []))
  // report parameters as typed by the viewer (relative tokens allowed); resolved at run time
  const [pvals, setPvals] = useState<Record<string, string | number>>(() => Object.fromEntries((template?.params ?? []).map(p => [p.id, p.value])))

  // ?run=1 comes from the Builder: execute once on arrival
  const autoRan = useRef(false) // StrictMode runs effects twice in dev; refs survive that
  useEffect(() => {
    if (autoRun && template && !autoRan.current) {
      autoRan.current = true
      const r = actions.run(template, template.filters, 'ad-hoc', pvals)
      navigate(`#/view/${id}/run/${r.id}`, true)
    }
  }, []) // eslint-disable-line

  const run: ReportRun | undefined = runId ? runs.find(r => r.id === runId) : runs[0]

  // A run is rendered from its frozen snapshot + params: later edits to the template don't rewrite history.
  const result: QueryResult | null = useMemo(() => {
    if (!run || run.status === 'failed') return null
    return runReport(run.snapshot, catalog, dataStore, { today: TODAY, params: run.params, paramValues: run.paramValues })
  }, [run])
  const runOpts = useMemo(() => (run ? { params: run.params, paramValues: run.paramValues } : undefined), [run])

  if (!template) return <div className="p-8 text-sm">Template no encontrado. <button className="underline" onClick={() => navigate('#/')}>Volver</button></div>

  const exposed = params.filter(p => p.exposed)
  const execute = () => {
    const r = actions.run(template, params, 'ad-hoc', pvals)
    navigate(`#/view/${id}/run/${r.id}`)
  }
  const outdated = run && JSON.stringify(run.snapshot) !== JSON.stringify({ ...template })
  const out = OUTPUTS.find(o => o.type === (run?.snapshot ?? template).output.type)!

  return (
    <div className="flex h-[calc(100vh-48px)] min-h-0">
      <main className="min-w-0 flex-1 overflow-y-auto">
        {/* header */}
        <div className="border-b bg-card px-6 py-4">
          <div className="flex items-start gap-3">
            <button onClick={() => navigate('#/')} className="mt-0.5 rounded p-1 text-muted-foreground hover:bg-muted"><ArrowLeft size={16} /></button>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[20px] font-semibold">{template.name}</h1>
                <Badge tone="positive">Viewer</Badge>
                <Badge>{DOMAINS.find(d => d.id === template.domain)?.label}</Badge>
                <Badge><out.icon size={11} /> {out.label}</Badge>
                {scheduleLabel(template.schedule) && <Badge tone="info"><CalendarClock size={11} /> {scheduleLabel(template.schedule)}</Badge>}
              </div>
              {template.description && <p className="mt-1 max-w-3xl text-[13px] text-muted-foreground">{interpolate(template.description, template, resolveParamValues(template, pvals, TODAY))}</p>}
            </div>
            <Button onClick={() => navigate(template.studio ? `#/studio/${id}` : `#/builder/${id}`)}><Pencil size={14} /> Editar</Button>
            <Button disabled={!result} onClick={() => result && exportCsv(template.name, result)}><Download size={14} /> CSV</Button>
          </div>

          {/* parameters */}
          <div className="mt-4 flex flex-wrap items-end gap-2">
            {(template.params ?? []).map(p => (
              <ReportParamInput key={p.id} p={p} value={pvals[p.id] ?? p.value} onChange={v => setPvals(x => ({ ...x, [p.id]: v }))} />
            ))}
            {exposed.map(p => <ParamControl key={p.id} f={p} t={template} onChange={nf => setParams(ps => ps.map(x => (x.id === nf.id ? nf : x)))} />)}
            {!exposed.length && !(template.params ?? []).length && <span className="text-[12px] text-muted-foreground">Este reporte no expone parámetros.</span>}
            <Button variant="primary" onClick={execute} className="ml-auto"><Play size={14} /> Ejecutar</Button>
          </div>
        </div>

        <div className="space-y-3 p-6">
          {run ? (
            <>
              <RunStrip run={run} result={result} />
              {outdated && (
                <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-accent/40 px-3 py-2 text-[12.5px]">
                  <AlertTriangle size={14} className="text-accent-foreground" /> Esta ejecución usa una versión anterior del template. Volvé a ejecutar para ver la definición actual.
                </div>
              )}
              {run.status === 'failed' ? (
                <Card className="flex items-start gap-3 p-5 text-[13px]">
                  <XCircle size={18} className="text-negative" />
                  <div><div className="font-semibold">La ejecución falló</div><div className="text-muted-foreground">{run.error}</div></div>
                </Card>
              ) : result && (
                <Card className="p-4">
                  {(result.notices.length > 0 || result.warnings.length > 0) && (
                    <details className="mb-3 text-[12px] text-muted-foreground">
                      <summary className="cursor-pointer select-none">Cómo se calculó ({result.grainLabel})</summary>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5">{[...result.warnings, ...result.notices].map(n => <li key={n}>{n}</li>)}</ul>
                    </details>
                  )}
                  <ReportOutput template={run.snapshot} result={result} runOpts={runOpts} height={420} />
                </Card>
              )}
            </>
          ) : (
            <Card className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="text-[14px] font-semibold">Todavía no hay ejecuciones</div>
              <div className="text-[13px] text-muted-foreground">Ejecutá el reporte para crear el primer Report Run.</div>
              <Button variant="primary" onClick={execute}><Play size={14} /> Ejecutar ahora</Button>
            </Card>
          )}
        </div>
      </main>

      {/* run history */}
      <aside className="w-[300px] shrink-0 overflow-y-auto border-l bg-card">
        <div className="border-b px-4 py-3">
          <div className="text-[13px] font-semibold">Report Runs</div>
          <div className="text-[11.5px] text-muted-foreground">{runs.length} ejecuciones · ad-hoc y programadas</div>
        </div>
        <div className="p-2">
          {runs.map(r => (
            <button key={r.id} onClick={() => navigate(`#/view/${id}/run/${r.id}`)}
              className={cn('mb-1 w-full rounded-md border px-3 py-2 text-left transition-colors', r.id === run?.id ? 'border-primary bg-accent/40' : 'border-transparent hover:bg-muted')}>
              <div className="flex items-center gap-2 text-[12.5px]">
                {r.status === 'succeeded' ? <CheckCircle2 size={13} className="text-positive" /> : <XCircle size={13} className="text-negative" />}
                <span className="font-medium">{fmtDateTime(r.startedAt)}</span>
                <span className="ml-auto">{r.trigger === 'scheduled' ? <Badge tone="info"><CalendarClock size={10} /> programado</Badge> : <Badge><Zap size={10} /> ad-hoc</Badge>}</span>
              </div>
              <div className="mt-1 flex gap-3 pl-5 text-[11px] text-muted-foreground">
                <span>{r.rowCount} filas</span><span>{r.durationMs} ms</span><span className="truncate">{r.runBy}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>
    </div>
  )
}

function ReportParamInput({ p, value, onChange }: { p: ReportParam; value: string | number; onChange: (v: string | number) => void }) {
  const rel = relativeLabel(value)
  const resolved = resolveRelative(value, TODAY)
  return (
    <div className="flex h-9 items-center gap-1.5 rounded-md border border-primary/40 bg-accent/30 pl-2.5 pr-1 text-[13px]">
      <Variable size={13} className="text-accent-foreground" />
      <span className="font-semibold">{p.name}</span>
      {p.type === 'date' ? (
        <>
          <input type="date" className="h-7 rounded border bg-card px-1.5 text-[12.5px]" value={String(resolved)} onChange={e => onChange(e.target.value)} />
          <select className="h-7 rounded border bg-card px-1 text-[11.5px] text-muted-foreground" value={rel ? String(value) : ''} onChange={e => onChange(e.target.value || String(resolved))}>
            <option value="">fecha fija</option>
            {RELATIVE_DATES.map(r => <option key={r.token} value={r.token}>{r.label}</option>)}
          </select>
        </>
      ) : <input className="h-7 w-28 rounded border bg-card px-1.5 text-[12.5px]" type={p.type === 'number' ? 'number' : 'text'} value={String(value)} onChange={e => onChange(p.type === 'number' ? Number(e.target.value) : e.target.value)} />}
    </div>
  )
}

function ParamControl({ f, t, onChange }: { f: Filter; t: ReportTemplate; onChange: (f: Filter) => void }) {
  const [open, setOpen] = useState(false)
  const calcs = t.calcs
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="flex h-9 items-center gap-2 rounded-md border bg-card px-3 text-[13px] hover:bg-muted">
        <span className="max-w-[320px] truncate">{filterSummary(f, calcs, t)}</span>
        <span className="text-muted-foreground">▾</span>
      </button>
      <Popover open={open} onClose={() => setOpen(false)} className="w-[300px]">
        <FilterEditor filter={f} calcs={calcs} onChange={onChange} />
      </Popover>
    </div>
  )
}

function RunStrip({ run, result }: { run: ReportRun; result: QueryResult | null }) {
  const item = (icon: React.ReactNode, label: string, value: React.ReactNode) => (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{icon}</span>
      <div><div className="text-[10.5px] uppercase tracking-wide text-muted-foreground">{label}</div><div className="text-[13px] font-medium">{value}</div></div>
    </div>
  )
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 rounded-lg border bg-card px-4 py-2.5">
      {item(run.status === 'succeeded' ? <CheckCircle2 size={15} className="text-positive" /> : <XCircle size={15} className="text-negative" />, 'Run', <code className="text-[12px]">{run.id}</code>)}
      {item(run.trigger === 'scheduled' ? <CalendarClock size={15} /> : <Zap size={15} />, 'Disparo', run.trigger === 'scheduled' ? 'Programado' : 'Ad-hoc')}
      {item(<Clock size={15} />, 'Ejecutado', `${fmtDateTime(run.startedAt)} · ${run.durationMs} ms`)}
      {item(<User size={15} />, 'Por', run.runBy)}
      {result && item(<span className="text-[13px]">≡</span>, 'Resultado', `${result.rows.length.toLocaleString('es-AR')} filas · ${result.grainLabel}`)}
      <div className="ml-auto flex max-w-[520px] flex-wrap gap-1">
        {(run.snapshot.params ?? []).map(p => <Badge key={p.id} tone="gold"><Variable size={10} /> {p.name} = {formatParamValue(p, run.paramValues?.[p.id])}</Badge>)}
        {run.params.map(p => <Badge key={p.id}>{filterSummary(p, run.snapshot.calcs, run.snapshot, run.paramValues)}</Badge>)}
      </div>
    </div>
  )
}

function exportCsv(name: string, r: QueryResult) {
  const rows = r.rows.flatMap(x => [x, ...(x.children ?? [])])
  const esc = (s: string) => (/[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s)
  const lines = [r.columns.map(c => esc(c.label)).join(','), ...rows.map(x => r.columns.map(c => esc(x.cells[c.key] === null || x.cells[c.key] === undefined ? '' : String(x.cells[c.key]))).join(','))]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${name.replace(/[^\w\s-]/g, '').trim() || 'reporte'}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

