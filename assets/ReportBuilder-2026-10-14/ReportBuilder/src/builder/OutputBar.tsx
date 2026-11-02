import { AreaChart, BarChart3, BarChartHorizontal, Gauge, Grid3x3, LineChart, PieChart, Table2 } from 'lucide-react'
import type { OutputConfig, OutputType, ReportTemplate } from '../engine/report'
import { cn, inputCls } from '../ui/primitives'
import { refInfo } from './helpers'
import { MEASURES_AS_SERIES } from '../output/ReportOutput'

export const OUTPUTS: { type: OutputType; label: string; icon: typeof Table2 }[] = [
  { type: 'table', label: 'Tabla', icon: Table2 },
  { type: 'pivot', label: 'Pivot', icon: Grid3x3 },
  { type: 'bar', label: 'Barras', icon: BarChart3 },
  { type: 'stacked', label: 'Apiladas', icon: BarChartHorizontal },
  { type: 'line', label: 'Líneas', icon: LineChart },
  { type: 'area', label: 'Área', icon: AreaChart },
  { type: 'pie', label: 'Torta', icon: PieChart },
  { type: 'kpi', label: 'KPI', icon: Gauge },
]

export function OutputBar({ t, onChange }: { t: ReportTemplate; onChange: (o: Partial<OutputConfig>, extra?: Partial<ReportTemplate>) => void }) {
  const o = t.output
  const dims = t.dimensions
  const chart = ['bar', 'stacked', 'line', 'area', 'pie'].includes(o.type)
  const lbl = (id: string) => { const d = dims.find(x => x.id === id)!; return d.label || refInfo(d.ref, t.calcs).label }
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <div className="inline-flex rounded-lg border bg-muted p-0.5">
        {OUTPUTS.map(x => (
          <button key={x.type} onClick={() => onChange({ type: x.type })} title={x.label}
            className={cn('inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors', o.type === x.type ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            <x.icon size={14} /><span className="hidden xl:inline">{x.label}</span>
          </button>
        ))}
      </div>
      {chart && dims.length > 0 && (
        <label className="flex items-center gap-1.5 whitespace-nowrap text-[12px] text-muted-foreground">{o.type === 'pie' ? 'Porciones' : 'Eje X'}
          <select className={cn(inputCls, 'h-7 w-auto text-[12px]')} value={o.xRef ?? dims[0].id} onChange={e => onChange({ xRef: e.target.value })}>
            {dims.map(d => <option key={d.id} value={d.id}>{lbl(d.id)}</option>)}
          </select>
        </label>
      )}
      {((chart && o.type !== 'pie') || o.type === 'pivot') && dims.length > 1 && (
        <label className="flex items-center gap-1.5 whitespace-nowrap text-[12px] text-muted-foreground">{o.type === 'pivot' ? 'Columnas' : 'Series'}
          <select className={cn(inputCls, 'h-7 w-auto text-[12px]')} value={o.pivotRef ?? (o.type === 'pivot' ? dims[dims.length - 1].id : dims.find(d => d.id !== (o.xRef ?? dims[0].id))?.id)} onChange={e => onChange({ pivotRef: e.target.value })}>
            {o.type !== 'pivot' && <option value={MEASURES_AS_SERIES}>Medidas</option>}
            {dims.filter(d => d.id !== (o.xRef ?? dims[0].id) || o.type === 'pivot').map(d => <option key={d.id} value={d.id}>{lbl(d.id)}</option>)}
          </select>
        </label>
      )}
      {(o.type === 'table' || o.type === 'pivot') && (
        <label className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <input type="checkbox" className="accent-[hsl(38_35%_53%)]" checked={o.showTotals !== false} onChange={e => onChange({ showTotals: e.target.checked })} /> Totales
        </label>
      )}
      <label className="ml-auto flex items-center gap-1.5 text-[12px] text-muted-foreground">Límite
        <input type="number" min={0} className={cn(inputCls, 'h-7 w-20 text-[12px]')} value={t.limit ?? ''} placeholder="—" onChange={e => onChange({}, { limit: e.target.value ? Number(e.target.value) : undefined })} />
      </label>
    </div>
  )
}
