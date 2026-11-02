import { ChevronDown, ChevronRight, ArrowDown, ArrowUp } from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import type { Value } from '../engine/formula'
import { runReport, type QueryResult, type ResultColumn, type ResultRow } from '../engine/query'
import type { Filter, ReportTemplate } from '../engine/report'
import { catalog, dataStore, TODAY } from '../state/store'
import { compact, formatValue, isNumericCol } from '../ui/format'
import { cn } from '../ui/primitives'

// Validated default categorical palette (dataviz skill), fixed order. 9th+ series fold into "Otros".
export const SERIES = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948']
const OTHER = '#898781'
const GRID = '#e1e0d9'
const AXIS = '#898781'
const MAX_SERIES = 8

export interface RunOpts { params?: Filter[]; paramValues?: Record<string, string | number> }
interface Props { template: ReportTemplate; result: QueryResult; runOpts?: RunOpts; height?: number }

export function ReportOutput({ template, result, runOpts, height = 380 }: Props) {
  if (!result.columns.length) return <Empty>Arrastrá dimensiones y medidas para ver el resultado.</Empty>
  const type = template.output.type
  if (type === 'table') return <TableView result={result} showTotals={template.output.showTotals !== false} />
  if (type === 'pivot') return <PivotView template={template} result={result} runOpts={runOpts} />
  if (type === 'kpi') return <KpiView result={result} />
  if (!result.columns.some(isNumericCol)) return <Empty>Los gráficos necesitan al menos una medida.</Empty>
  return <ChartView template={template} result={result} runOpts={runOpts} height={height} />
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="flex h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">{children}</div>
}

const numCls = (v: Value, c: ResultColumn) => cn('text-right tabular-nums', isNumericCol(c) && typeof v === 'number' && v < 0 && c.format !== 'percent' && 'text-negative')

// ============================================================================ table

export function TableView({ result, showTotals }: { result: QueryResult; showTotals: boolean }) {
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null)
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [limit, setLimit] = useState(300)
  const nested = result.rows.some(r => r.children?.length)
  const cols = result.columns

  const rows = useMemo(() => {
    if (!sort) return result.rows
    const cmp = (a: ResultRow, b: ResultRow) => {
      const x = a.cells[sort.key], y = b.cells[sort.key]
      if (x === y) return 0
      if (x === null || x === undefined) return 1
      if (y === null || y === undefined) return -1
      return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * sort.dir
    }
    return [...result.rows].sort(cmp).map(r => (r.children ? { ...r, children: [...r.children].sort(cmp) } : r))
  }, [result.rows, sort])

  const defaultOpen = nested && rows.length <= 12
  const isOpen = (k: string) => open[k] ?? defaultOpen

  const renderRow = (r: ResultRow) => {
    const exp = r.children?.length ? isOpen(r.key) : false
    return (
      <Fragment key={r.key}>
        <tr className={cn('border-b last:border-b-0 hover:bg-[hsl(36_80%_90%/0.5)]', r.kind === 'group' && 'bg-[hsl(38_35%_53%/0.07)] font-semibold')}>
          {cols.map((c, i) => {
            const v = r.cells[c.key]
            const isChildDim = r.depth > 0 && c.kind === 'dim' && result.rows.length && !isGroupDim(result, c.key)
            let content: React.ReactNode = formatValue(v, c)
            if (r.depth > 0 && c.kind === 'dim' && !isChildDim) content = ''
            if (r.kind === 'group' && c.kind === 'dim' && !(c.key in r.cells)) content = ''
            if (r.kind === 'detail' && i === firstChildColIndex(result)) content = String(r.cells.__label ?? '')
            return (
              <td key={c.key} className={cn('px-3 py-1.5 whitespace-nowrap', isNumericCol(c) ? numCls(v, c) : '', i === 0 && r.depth > 0 && 'pl-9')}>
                {i === 0 && r.children?.length ? (
                  <button onClick={() => setOpen(o => ({ ...o, [r.key]: !exp }))} className="inline-flex items-center gap-1 -ml-1 hover:text-accent-foreground">
                    {exp ? <ChevronDown size={14} /> : <ChevronRight size={14} />}{content}
                    <span className="ml-1 text-[11px] font-normal text-muted-foreground">({r.children.length})</span>
                  </button>
                ) : content}
              </td>
            )
          })}
        </tr>
        {exp && r.children!.map(renderRow)}
      </Fragment>
    )
  }

  return (
    <div className="overflow-auto rounded-lg border max-h-[640px]">
      <table className="w-full text-[13px]">
        <thead className="sticky top-0 z-10 bg-muted">
          <tr className="border-b">
            {cols.map(c => (
              <th key={c.key} onClick={() => setSort(s => (s?.key === c.key ? (s.dir === 1 ? { key: c.key, dir: -1 } : null) : { key: c.key, dir: 1 }))}
                className={cn('cursor-pointer select-none px-3 py-2 text-[12px] font-semibold text-muted-foreground whitespace-nowrap hover:text-foreground', isNumericCol(c) ? 'text-right' : 'text-left')}>
                <span className="inline-flex items-center gap-1">
                  {c.label}
                  {sort?.key === c.key && (sort.dir === 1 ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, limit).map(renderRow)}
          {!rows.length && <tr><td colSpan={cols.length} className="px-3 py-8 text-center text-muted-foreground">Sin resultados para los filtros actuales.</td></tr>}
        </tbody>
        {showTotals && result.columns.some(c => c.kind === 'measure') && rows.length > 0 && (
          <tfoot className="sticky bottom-0 bg-card">
            <tr className="border-t-2 border-foreground/20 font-semibold">
              {cols.map((c, i) => (
                <td key={c.key} className={cn('px-3 py-2', c.kind === 'measure' && numCls(result.totals[c.key], c))}>
                  {i === 0 ? 'Total' : c.kind === 'measure' ? formatValue(result.totals[c.key], c) : ''}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
      {rows.length > limit && (
        <div className="border-t p-2 text-center">
          <button className="text-xs font-medium text-accent-foreground hover:underline" onClick={() => setLimit(l => l + 500)}>
            Mostrando {limit} de {rows.length} filas — mostrar más
          </button>
        </div>
      )}
    </div>
  )
}

/** In nested results, group rows only carry the parent-level dimension cells. */
function isGroupDim(result: QueryResult, key: string) {
  const g = result.rows.find(r => r.kind === 'group')
  return !!g && key in g.cells
}
function firstChildColIndex(result: QueryResult) {
  const i = result.columns.findIndex(c => c.kind === 'dim' && !isGroupDim(result, c.key))
  return i < 0 ? result.columns.findIndex(c => c.kind === 'measure') - 0 : i
}

// ============================================================================ flatten for pivot/charts

function flatRows(result: QueryResult): ResultRow[] {
  const nested = result.rows.some(r => r.children?.length)
  if (!nested) return result.rows
  const childDims = result.columns.filter(c => c.kind === 'dim' && !isGroupDim(result, c.key))
  // nested without child dimensions -> children are raw details; charts use the group level
  if (!childDims.length) return result.rows
  return result.rows.flatMap(r => r.children ?? [r])
}

// ============================================================================ pivot

function PivotView({ template, result, runOpts }: { template: ReportTemplate; result: QueryResult; runOpts?: RunOpts }) {
  const dims = result.columns.filter(c => c.kind === 'dim')
  const meas = result.columns.filter(isNumericCol)
  if (dims.length < 2 || !meas.length) {
    return (
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">Pivot necesita ≥ 2 dimensiones y ≥ 1 medida. Se muestra como tabla.</div>
        <TableView result={result} showTotals />
      </div>
    )
  }
  return <PivotGrid template={template} result={result} runOpts={runOpts} />
}

function PivotGrid({ template, result, runOpts }: { template: ReportTemplate; result: QueryResult; runOpts?: RunOpts }) {
  const dims = result.columns.filter(c => c.kind === 'dim')
  const meas = result.columns.filter(isNumericCol)
  const pivot = dims.find(d => d.key === template.output.pivotRef) ?? dims[dims.length - 1]
  const rowDims = dims.filter(d => d.key !== pivot.key)
  const rows = flatRows(result)
  const colVals = [...new Set(rows.map(r => String(r.cells[pivot.key])))].sort()
  const rowMap = new Map<string, { cells: Record<string, Value>; vals: Record<string, Record<string, Value>> }>()
  for (const r of rows) {
    const k = rowDims.map(d => String(r.cells[d.key])).join('\u0001')
    let e = rowMap.get(k)
    if (!e) { e = { cells: r.cells, vals: {} }; rowMap.set(k, e) }
    e.vals[String(r.cells[pivot.key])] = Object.fromEntries(meas.map(m => [m.key, r.cells[m.key]]))
  }

  // Totals are re-queried at their own grain so AVG / COUNTD / LAST stay correct (no summing of cells).
  const totals = useMemo(() => {
    if (template.output.showTotals === false) return null
    const keep = (ids: string[]) => ({ ...template, dimensions: template.dimensions.filter(d => ids.includes(d.id)), sort: undefined, limit: undefined })
    const byRow = runReport(keep(rowDims.map(d => d.key)), catalog, dataStore, { today: TODAY, ...runOpts })
    const byCol = runReport(keep([pivot.key]), catalog, dataStore, { today: TODAY, ...runOpts })
    const rowT = new Map(flatRows(byRow).map(r => [rowDims.map(d => String(r.cells[d.key])).join('\u0001'), r.cells]))
    const colT = new Map(flatRows(byCol).map(r => [String(r.cells[pivot.key]), r.cells]))
    return { rowT, colT, grand: byCol.totals }
  }, [template, runOpts, result]) // eslint-disable-line

  return (
    <div className="overflow-auto rounded-lg border max-h-[640px]">
      <table className="text-[13px]">
        <thead className="sticky top-0 z-10 bg-muted">
          <tr className="border-b">
            {rowDims.map(d => <th key={d.key} rowSpan={meas.length > 1 ? 2 : 1} className="px-3 py-2 text-left text-[12px] font-semibold text-muted-foreground whitespace-nowrap">{d.label}</th>)}
            {colVals.map(v => <th key={v} colSpan={meas.length} className="border-l px-3 py-2 text-center text-[12px] font-semibold whitespace-nowrap">{formatValue(v, pivot)}</th>)}
            {totals && <th colSpan={meas.length} className="border-l-2 border-foreground/20 px-3 py-2 text-center text-[12px] font-semibold whitespace-nowrap">Total</th>}
          </tr>
          {meas.length > 1 && (
            <tr className="border-b">
              {[...colVals, ...(totals ? ['__t'] : [])].map(v => meas.map((m, i) => (
                <th key={v + m.key} className={cn('px-3 py-1.5 text-right text-[11px] font-medium text-muted-foreground whitespace-nowrap', i === 0 && 'border-l')}>{m.label}</th>
              )))}
            </tr>
          )}
        </thead>
        <tbody>
          {[...rowMap.entries()].map(([k, e]) => (
            <tr key={k} className="border-b hover:bg-[hsl(36_80%_90%/0.5)]">
              {rowDims.map(d => <td key={d.key} className="px-3 py-1.5 whitespace-nowrap">{formatValue(e.cells[d.key], d)}</td>)}
              {colVals.map(v => meas.map((m, i) => {
                const val = e.vals[v]?.[m.key] ?? null
                return <td key={v + m.key} className={cn('px-3 py-1.5 whitespace-nowrap', numCls(val, m), i === 0 && 'border-l')}>{formatValue(val, m)}</td>
              }))}
              {totals && meas.map((m, i) => {
                const val = totals.rowT.get(k)?.[m.key] ?? null
                return <td key={'t' + m.key} className={cn('px-3 py-1.5 font-semibold whitespace-nowrap', numCls(val, m), i === 0 && 'border-l-2 border-foreground/20')}>{formatValue(val, m)}</td>
              })}
            </tr>
          ))}
        </tbody>
        {totals && (
          <tfoot className="sticky bottom-0 bg-card">
            <tr className="border-t-2 border-foreground/20 font-semibold">
              {rowDims.map((d, i) => <td key={d.key} className="px-3 py-2">{i === 0 ? 'Total' : ''}</td>)}
              {colVals.map(v => meas.map((m, i) => {
                const val = totals.colT.get(v)?.[m.key] ?? null
                return <td key={v + m.key} className={cn('px-3 py-2 whitespace-nowrap', numCls(val, m), i === 0 && 'border-l')}>{formatValue(val, m)}</td>
              }))}
              {meas.map((m, i) => <td key={'g' + m.key} className={cn('px-3 py-2 whitespace-nowrap', numCls(totals.grand[m.key], m), i === 0 && 'border-l-2 border-foreground/20')}>{formatValue(totals.grand[m.key], m)}</td>)}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}

// ============================================================================ KPI

function KpiView({ result }: { result: QueryResult }) {
  const meas = result.columns.filter(isNumericCol)
  if (!meas.length) return <Empty>KPI necesita al menos una medida.</Empty>
  const dims = result.columns.filter(c => c.kind === 'dim')
  return (
    <div className="space-y-4">
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))` }}>
        {meas.map(m => (
          <div key={m.key} className="rounded-lg border bg-card p-4">
            <div className="text-[12px] font-medium text-muted-foreground">{m.label}</div>
            <div className={cn('mt-2 text-[28px] font-semibold leading-none', typeof result.totals[m.key] === 'number' && (result.totals[m.key] as number) < 0 && m.format !== 'percent' && 'text-negative')}>
              {formatValue(result.totals[m.key], m)}
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">{result.grainLabel === 'Total' ? 'Total del período filtrado' : result.grainLabel}</div>
          </div>
        ))}
      </div>
      {dims.length > 0 && <TableView result={result} showTotals={false} />}
    </div>
  )
}

// ============================================================================ charts

const isDateLike = (s: string) => /^\d{4}(-\d{2}|-Q\d)?(-\d{2})?$/.test(s)

export const MEASURES_AS_SERIES = '__measures'

function ChartView({ template, result, runOpts, height }: { template: ReportTemplate; result: QueryResult; runOpts?: RunOpts; height: number }) {
  const type = template.output.type
  const dims = result.columns.filter(c => c.kind === 'dim')
  const meas = result.columns.filter(isNumericCol)
  const x = dims.find(d => d.key === template.output.xRef) ?? dims[0]
  const pr = template.output.pivotRef
  const seriesDim = type === 'pie' || pr === MEASURES_AS_SERIES ? undefined : dims.find(d => d.key !== x?.key && (d.key === pr || !pr))
  // When the chart shows fewer dimensions than the result, re-query at the chart's grain instead of
  // summing rows, so AVG / COUNTD / semi-additive balances stay correct.
  const rows = useMemo(() => {
    const flat = flatRows(result)
    const keep = [x?.key, seriesDim?.key].filter(Boolean) as string[]
    if (keep.length >= dims.length) return flat
    const t = { ...template, dimensions: template.dimensions.filter(d => keep.includes(d.id)), sort: undefined, limit: undefined }
    return flatRows(runReport(t, catalog, dataStore, { today: TODAY, ...runOpts }))
  }, [result, template, runOpts, x?.key, seriesDim?.key]) // eslint-disable-line
  const m0 = meas[0]

  // ---- shape data: [{x, s1, s2...}]
  const { data, series, folded } = useMemo(() => {
    const xKey = (r: ResultRow) => (x ? String(r.cells[x.key] ?? '—') : 'Total')
    if (seriesDim) {
      const totalBy = new Map<string, number>()
      rows.forEach(r => { const s = String(r.cells[seriesDim.key] ?? '—'); totalBy.set(s, (totalBy.get(s) ?? 0) + Math.abs(Number(r.cells[m0.key]) || 0)) })
      const ranked = [...totalBy.entries()].sort((a, b) => b[1] - a[1]).map(([s]) => s)
      const keep = new Set(ranked.slice(0, ranked.length > MAX_SERIES ? MAX_SERIES - 1 : MAX_SERIES))
      // color follows the entity: stable alphabetical assignment among kept series
      const kept = [...keep].sort()
      const folded = ranked.length > keep.size
      const byX = new Map<string, Record<string, number | string>>()
      for (const r of rows) {
        const k = xKey(r)
        const s0 = String(r.cells[seriesDim.key] ?? '—')
        const s = keep.has(s0) ? s0 : 'Otros'
        const e = byX.get(k) ?? { __x: k }
        e[s] = (Number(e[s]) || 0) + (Number(r.cells[m0.key]) || 0)
        byX.set(k, e)
      }
      const series = kept.map((s, i) => ({ key: s, label: formatValue(s, seriesDim), color: SERIES[i] }))
      if (folded) series.push({ key: 'Otros', label: 'Otros', color: OTHER })
      return { data: [...byX.values()], series, folded }
    }
    const data = rows.map(r => {
      const e: Record<string, number | string> = { __x: xKey(r) }
      meas.forEach(m => { e[m.key] = Number(r.cells[m.key]) || 0 })
      return e
    })
    const ms = meas.slice(0, MAX_SERIES)
    return { data, series: ms.map((m, i) => ({ key: m.key, label: m.label, color: SERIES[i] })), folded: meas.length > MAX_SERIES }
  }, [rows, x?.key, seriesDim?.key, m0.key]) // eslint-disable-line

  if (x && data.every(d => isDateLike(String(d.__x)))) data.sort((a, b) => String(a.__x).localeCompare(String(b.__x)))
  const fmt = (v: number) => (m0.format === 'percent' ? `${Math.round(v * 100)}%` : compact(v))
  const xLabel = (v: string) => formatValue(v, x)

  const legend = series.length >= 2 && (
    <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
      {series.map(s => (
        <span key={s.key} className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />{s.label}
        </span>
      ))}
      {seriesDim && meas.length > 1 && <span className="italic">· serie por {seriesDim.label}, mostrando {m0.label}</span>}
      {folded && <span className="italic">· {'>'}{MAX_SERIES} series agrupadas en "Otros"</span>}
    </div>
  )

  const tooltip = (
    <Tooltip
      cursor={type === 'line' || type === 'area' ? { stroke: AXIS, strokeDasharray: '3 3' } : { fill: 'rgba(0,0,0,0.04)' }}
      content={({ active, payload, label }) => {
        if (!active || !payload?.length) return null
        return (
          <div className="rounded-md border bg-card px-3 py-2 text-[12px] shadow-md">
            <div className="mb-1 font-semibold">{xLabel(String(label ?? payload[0]?.payload?.__x))}</div>
            {payload.map(p => {
              const s = series.find(x => x.key === p.dataKey || x.key === p.name)
              const col = seriesDim ? m0 : meas.find(m => m.key === p.dataKey) ?? m0
              return (
                <div key={String(p.dataKey ?? p.name)} className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 rounded-sm" style={{ background: s?.color ?? p.color }} />{s?.label ?? p.name}</span>
                  <span className="tabular-nums font-medium">{formatValue(p.value as number, col)}</span>
                </div>
              )
            })}
          </div>
        )
      }}
    />
  )

  const axes = (horizontal: boolean) => horizontal ? [
    <XAxis key="x" type="number" tickFormatter={fmt} tick={{ fontSize: 11, fill: AXIS }} axisLine={false} tickLine={false} />,
    <YAxis key="y" type="category" dataKey="__x" width={150} tickFormatter={xLabel} tick={{ fontSize: 11, fill: AXIS }} axisLine={{ stroke: '#c3c2b7' }} tickLine={false} interval={0} />,
  ] : [
    <XAxis key="x" dataKey="__x" tickFormatter={xLabel} tick={{ fontSize: 11, fill: AXIS }} axisLine={{ stroke: '#c3c2b7' }} tickLine={false} minTickGap={12} />,
    <YAxis key="y" tickFormatter={fmt} tick={{ fontSize: 11, fill: AXIS }} axisLine={false} tickLine={false} width={56} />,
  ]

  if (type === 'pie') {
    const vals = rows.map(r => ({ name: x ? String(r.cells[x.key] ?? '—') : 'Total', value: Number(r.cells[m0.key]) || 0 }))
    const neg = vals.some(v => v.value < 0)
    const abs = vals.map(v => ({ ...v, value: Math.abs(v.value) })).sort((a, b) => b.value - a.value)
    const top = abs.slice(0, 6)
    const rest = abs.slice(6).reduce((a, v) => a + v.value, 0)
    const slices = [...top.sort((a, b) => a.name.localeCompare(b.name)), ...(rest ? [{ name: 'Otros', value: rest }] : [])]
    const total = slices.reduce((a, s) => a + s.value, 0)
    return (
      <div className="flex flex-wrap items-center gap-6">
        <div style={{ width: 300, height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={slices} dataKey="value" nameKey="name" innerRadius={70} outerRadius={130} paddingAngle={1} stroke="#fff" strokeWidth={2} isAnimationActive={false}>
                {slices.map((s, i) => <Cell key={s.name} fill={s.name === 'Otros' ? OTHER : SERIES[i]} />)}
              </Pie>
              <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                <div className="rounded-md border bg-card px-3 py-2 text-[12px] shadow-md">
                  <div className="font-semibold">{formatValue(payload[0].name as string, x)}</div>
                  <div className="tabular-nums">{formatValue(payload[0].value as number, m0)} · {Math.round((payload[0].value as number) / total * 1000) / 10}%</div>
                </div>) : null} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1.5 text-[13px]">
          {slices.map((s, i) => (
            <div key={s.name} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.name === 'Otros' ? OTHER : SERIES[i] }} />
              <span className="min-w-[140px]">{formatValue(s.name, x)}</span>
              <span className="tabular-nums text-muted-foreground">{Math.round(s.value / total * 1000) / 10}%</span>
            </div>
          ))}
          {neg && <div className="pt-2 text-[11px] text-muted-foreground">Valores negativos mostrados en absoluto.</div>}
        </div>
      </div>
    )
  }

  const stacked = type === 'stacked' || type === 'area'
  const horizontal = (type === 'bar' || type === 'stacked') && !!x && data.length > 8 && !data.every(d => isDateLike(String(d.__x)))
  const h = horizontal ? Math.max(height, data.length * 28 + 40) : height

  return (
    <div>
      {legend}
      <div style={{ height: h }}>
        <ResponsiveContainer>
          {type === 'line' ? (
            <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke={GRID} />{axes(false)}{tooltip}
              {series.map(s => <Line key={s.key} dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }} isAnimationActive={false} />)}
            </LineChart>
          ) : type === 'area' ? (
            <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke={GRID} />{axes(false)}{tooltip}
              {series.map(s => <Area key={s.key} dataKey={s.key} name={s.label} stackId="a" stroke="#fff" strokeWidth={1.5} fill={s.color} fillOpacity={0.9} isAnimationActive={false} />)}
            </AreaChart>
          ) : (
            <BarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ top: 8, right: 16, bottom: 0, left: 0 }} barCategoryGap="22%">
              <CartesianGrid vertical={horizontal} horizontal={!horizontal} stroke={GRID} />{axes(horizontal)}{tooltip}
              {series.map((s, i) => (
                <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} stackId={stacked ? 'a' : undefined} stroke="#fff" strokeWidth={stacked ? 1 : 0}
                  radius={!stacked || i === series.length - 1 ? (horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]) : 0} maxBarSize={48} isAnimationActive={false} />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
