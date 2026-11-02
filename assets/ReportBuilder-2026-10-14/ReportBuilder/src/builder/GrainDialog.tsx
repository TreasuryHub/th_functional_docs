import { GitMerge, ListTree, Rows3, Sigma } from 'lucide-react'
import { useMemo, useState } from 'react'
import { runReport, type MixAnalysis } from '../engine/query'
import type { GrainMode, ReportTemplate } from '../engine/report'
import { catalog, dataStore, TODAY } from '../state/store'
import { Button, cn, Modal } from '../ui/primitives'

const MODES: { mode: GrainMode; icon: typeof Sigma; title: (p: string, c: string) => string; body: (p: string, c: string) => string; shape: 'parent' | 'child' | 'nested' }[] = [
  {
    mode: 'parent', icon: Sigma, shape: 'parent',
    title: p => `Resumir por ${p}`,
    body: (p, c) => `Una fila por cada combinación de campos de ${p}. Las medidas de ${c} se agregan hacia arriba (Σ, #, último). Los campos de ${c} en Dimensiones no agrupan: usalos como filtro.`,
  },
  {
    mode: 'nested', icon: ListTree, shape: 'nested',
    title: (p, c) => `Jerárquico ${p} ▸ ${c}`,
    body: (p, c) => `Filas de ${p} con subtotales, desplegables a ${c}. Los subtotales se recalculan (no se suman filas), así saldos y promedios siguen siendo correctos.`,
  },
  {
    mode: 'child', icon: Rows3, shape: 'child',
    title: (_, c) => `Detalle por ${c}`,
    body: (p, c) => `Una fila por cada ${c}; los atributos de ${p} se repiten. Medidas de ${p} se muestran por fila pero en el total cuentan una sola vez.`,
  },
]

export function GrainDialog({ open, onClose, template, mix, onPick }: {
  open: boolean; onClose: () => void; template: ReportTemplate; mix: MixAnalysis; onPick: (m: GrainMode) => void
}) {
  const current = template.grain?.signature === mix.signature ? template.grain.mode : 'parent'
  const [sel, setSel] = useState<GrainMode>(current)
  const p = mix.parent ? catalog.entity(mix.parent).label : ''
  const c = mix.child ? catalog.entity(mix.child).label : ''

  // row counts per option, computed live so the choice is concrete
  const counts = useMemo(() => {
    if (!open) return {}
    const out: Partial<Record<GrainMode, string>> = {}
    for (const m of MODES) {
      try {
        const r = runReport({ ...template, grain: { signature: mix.signature, mode: m.mode } }, catalog, dataStore, { today: TODAY })
        const kids = r.rows.reduce((a, x) => a + (x.children?.length ?? 0), 0)
        out[m.mode] = m.mode === 'nested' ? `${r.rows.length} grupos · ${kids} filas` : `${r.rows.length.toLocaleString('es-AR')} filas`
      } catch { out[m.mode] = '—' }
    }
    return out
  }, [open, template, mix.signature])

  return (
    <Modal open={open} onClose={onClose} width={720}
      title={<span className="inline-flex items-center gap-2"><GitMerge size={16} className="text-accent-foreground" /> ¿Cómo querés agrupar {p} y {c}?</span>}
      subtitle={<>Combinaste campos de <b>{p}</b> (padre) y <b>{c}</b> (hijo, N filas por cada {p}). Elegí el grano del reporte.</>}
      footer={<>
        <Button variant="ghost" onClick={onClose}>Después</Button>
        <Button variant="primary" onClick={() => { onPick(sel); onClose() }}>Aplicar</Button>
      </>}>
      <div className="grid gap-3">
        {MODES.map(m => (
          <button key={m.mode} onClick={() => setSel(m.mode)}
            className={cn('grid grid-cols-[36px_1fr_150px] items-start gap-3 rounded-lg border p-3 text-left transition-colors', sel === m.mode ? 'border-primary bg-accent/40 ring-2 ring-primary/20' : 'hover:bg-muted')}>
            <div className={cn('flex h-9 w-9 items-center justify-center rounded-md', sel === m.mode ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}><m.icon size={18} /></div>
            <div>
              <div className="text-[14px] font-semibold">{m.title(p, c)}</div>
              <div className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">{m.body(p, c)}</div>
              <div className="mt-1.5 text-[11px] font-medium text-accent-foreground">{counts[m.mode]}</div>
            </div>
            <Shape kind={m.shape} p={p} c={c} />
          </button>
        ))}
      </div>
    </Modal>
  )
}

function Shape({ kind, p, c }: { kind: 'parent' | 'child' | 'nested'; p: string; c: string }) {
  const row = (label: string, cls = '', indent = false) => (
    <div className={cn('flex h-4 items-center gap-1 rounded-sm px-1 text-[9px]', cls, indent && 'ml-3')}>
      <span className="truncate">{label}</span>
    </div>
  )
  return (
    <div className="space-y-0.5 rounded-md border bg-card p-1.5 text-muted-foreground">
      {kind === 'parent' && <>{row(`${p} A · Σ`, 'bg-accent')}{row(`${p} B · Σ`, 'bg-accent')}{row(`${p} C · Σ`, 'bg-accent')}</>}
      {kind === 'child' && <>{row(`${c} 1 · ${p} A`, 'bg-muted')}{row(`${c} 2 · ${p} A`, 'bg-muted')}{row(`${c} 3 · ${p} B`, 'bg-muted')}</>}
      {kind === 'nested' && <>{row(`▾ ${p} A · Σ`, 'bg-accent font-semibold')}{row(`${c} 1`, 'bg-muted', true)}{row(`${c} 2`, 'bg-muted', true)}{row(`▸ ${p} B · Σ`, 'bg-accent font-semibold')}</>}
    </div>
  )
}
