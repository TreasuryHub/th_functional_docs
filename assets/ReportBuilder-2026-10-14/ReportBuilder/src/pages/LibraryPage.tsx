import { ArrowRight, CalendarClock, CheckCircle2, Copy, Eye, FileBarChart2, Pencil, Plus, RotateCcw, Trash2, Wrench, XCircle, Zap } from 'lucide-react'
import { useState } from 'react'
import { OUTPUTS } from '../builder/OutputBar'
import { scheduleLabel } from '../builder/ScheduleDialog'
import { DOMAINS } from '../model/silver'
import { actions, useStore } from '../state/store'
import { navigate } from '../App'
import { fmtDateTime } from '../ui/format'
import { Badge, Button, Card, cn, Modal } from '../ui/primitives'

export function LibraryPage() {
  const templates = useStore(s => s.templates)
  const runs = useStore(s => s.runs)
  const [newOpen, setNewOpen] = useState(false)
  const lastRun = (id: string) => runs.find(r => r.templateId === id)

  return (
    <div className="mx-auto max-w-[1240px] space-y-6 px-6 py-6">
      {/* Template -> Run flow, as in the design diagram */}
      <Card className="flex flex-wrap items-center gap-6 px-6 py-5">
        <div className="min-w-[260px] flex-1">
          <h1 className="text-[20px] font-semibold">Reportes</h1>
          <p className="mt-1 max-w-xl text-[13px] text-muted-foreground">
            Un <b>Report Template</b> se arma en el <b>editor simple</b> (arrastrando bloques de negocio) o en el <b>Builder avanzado</b> sobre las dimensiones de Silver. Cada ejecución, <b>ad-hoc</b> o <b>programada</b>, crea un <b>Report Run</b> con un snapshot de la definición y se consulta en el <b>Viewer</b>.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[12px]">
          <div className="rounded-md border-2 border-foreground/70 bg-card px-4 py-3 font-medium">Report Template</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 rounded bg-muted px-2 py-1"><Zap size={11} /> Ad-hoc <ArrowRight size={12} /></div>
            <div className="flex items-center gap-1 rounded bg-muted px-2 py-1"><CalendarClock size={11} /> Scheduled <ArrowRight size={12} /></div>
          </div>
          <div className="rounded-md border-2 border-foreground/70 bg-card px-4 py-3 font-medium">Report Run</div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => { if (confirm('¿Restaurar templates y runs de ejemplo? Se pierden los cambios locales.')) actions.reset() }}><RotateCcw size={14} /> Restaurar ejemplos</Button>
          <Button variant="ghost" onClick={() => setNewOpen(true)} title="Builder avanzado: JOINs, parámetros, SQL"><Wrench size={14} /> Avanzado</Button>
          <Button variant="primary" onClick={() => navigate('#/studio/new')}><Plus size={14} /> Nuevo reporte</Button>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card>
          <div className="border-b px-4 py-3 text-[13px] font-semibold">Report Templates <span className="font-normal text-muted-foreground">· {templates.length}</span></div>
          <div className="divide-y">
            {templates.map(t => {
              const out = OUTPUTS.find(o => o.type === t.output.type)!
              const lr = lastRun(t.id)
              return (
                <div key={t.id} className="group grid grid-cols-[36px_1fr_auto] items-center gap-3 px-4 py-3 hover:bg-muted/60">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground"><out.icon size={17} /></div>
                  <button className="min-w-0 text-left" onClick={() => navigate(`#/view/${t.id}`)}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-semibold group-hover:underline">{t.name}</span>
                      <Badge>{DOMAINS.find(d => d.id === t.domain)?.label}</Badge>
                      {scheduleLabel(t.schedule) && <Badge tone="info"><CalendarClock size={10} /> {scheduleLabel(t.schedule)}</Badge>}
                      {t.studio ? <Badge tone="positive">Simple</Badge> : t.grain && <Badge tone="gold">{({ parent: 'resumen padre', nested: 'jerárquico', child: 'detalle hijo', flat: 'plano' } as const)[t.grain.mode]}</Badge>}
                    </div>
                    <div className="mt-0.5 truncate text-[12.5px] text-muted-foreground">{t.description}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {t.dimensions.length} dim · {t.measures.length} medidas · {(t.studio?.filters ?? t.filters).length} filtros{(t.studio?.calcs ?? t.calcs).length ? ` · ${(t.studio?.calcs ?? t.calcs).length} fórmulas` : ''}
                      {lr && <> · último run {fmtDateTime(lr.startedAt)} {lr.status === 'failed' && <span className="text-negative">(falló)</span>}</>}
                    </div>
                  </button>
                  <div className="flex items-center gap-1">
                    <Button size="sm" onClick={() => navigate(`#/view/${t.id}`)}><Eye size={13} /> Ver</Button>
                    <Button size="sm" onClick={() => navigate(t.studio ? `#/studio/${t.id}` : `#/builder/${t.id}`)}><Pencil size={13} /> Editar</Button>
                    <button className="rounded p-1.5 text-muted-foreground hover:bg-card" title="Duplicar" onClick={() => actions.duplicate(t.id)}><Copy size={13} /></button>
                    <button className="rounded p-1.5 text-muted-foreground hover:bg-card hover:text-negative" title="Eliminar" onClick={() => confirm(`¿Eliminar "${t.name}" y sus runs?`) && actions.deleteTemplate(t.id)}><Trash2 size={13} /></button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <div className="border-b px-4 py-3 text-[13px] font-semibold">Últimos Report Runs</div>
          <div className="max-h-[640px] divide-y overflow-y-auto">
            {runs.slice(0, 30).map(r => (
              <button key={r.id} onClick={() => navigate(`#/view/${r.templateId}/run/${r.id}`)} className="block w-full px-4 py-2.5 text-left hover:bg-muted/60">
                <div className="flex items-center gap-2 text-[12.5px]">
                  {r.status === 'succeeded' ? <CheckCircle2 size={13} className="text-positive" /> : <XCircle size={13} className="text-negative" />}
                  <span className="truncate font-medium">{r.templateName}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 pl-5 text-[11px] text-muted-foreground">
                  {r.trigger === 'scheduled' ? <><CalendarClock size={10} /> programado</> : <><Zap size={10} /> ad-hoc</>} · {fmtDateTime(r.startedAt)} · {r.rowCount} filas
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="Nuevo reporte · Builder avanzado" subtitle="Elegí el dominio de partida. Después podés sumar campos de entidades relacionadas." width={640}>
        <div className="grid grid-cols-2 gap-3">
          {DOMAINS.map(d => (
            <button key={d.id} onClick={() => navigate(`#/builder/new?domain=${d.id}`)} className={cn('rounded-lg border p-4 text-left hover:border-primary hover:bg-accent/40')}>
              <div className="flex items-center gap-2"><FileBarChart2 size={16} className="text-accent-foreground" /><span className="font-semibold">{d.label}</span></div>
              <div className="mt-1 text-[12.5px] text-muted-foreground">{d.description}</div>
              <div className="mt-2"><Badge tone={d.badge === 'Eventos' ? 'positive' : d.badge === 'Fuente nueva' ? 'gold' : 'info'}>{d.badge}</Badge></div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
