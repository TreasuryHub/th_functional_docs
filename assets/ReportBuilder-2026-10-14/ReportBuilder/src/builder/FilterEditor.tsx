import { useMemo, useState } from 'react'
import { Variable } from 'lucide-react'
import { isParamRef, type CalcField, type Filter, type FilterOp, type ReportParam } from '../engine/report'
import { relativeLabel } from '../engine/params'
import { cn, inputCls } from '../ui/primitives'
import { distinctValues, OP_LABEL, opsFor, refInfo } from './helpers'

/** Operator + value editor for one filter. Used in the Builder (filter chips) and in the Viewer (parameters). */
export interface ParamBinding {
  params: ReportParam[]
  /** creates a parameter seeded with the current literal and returns its id */
  onCreate: (type: ReportParam['type'], seed: unknown) => string
}

export function FilterEditor({ filter, calcs, onChange, compact, binding }: { filter: Filter; calcs: CalcField[]; onChange: (f: Filter) => void; compact?: boolean; binding?: ParamBinding }) {
  const info = refInfo(filter.ref, calcs)
  const ops = opsFor(info.type, info.role)
  const set = (patch: Partial<Filter>) => onChange({ ...filter, ...patch })
  const changeOp = (op: FilterOp) => {
    const multi = op === 'in' || op === 'nin'
    const keep = !Array.isArray(filter.value) && filter.op !== 'last_n_days' ? filter.value : undefined
    set({ op, value: multi ? (Array.isArray(filter.value) ? filter.value : []) : op === 'last_n_days' ? 30 : keep, value2: op === 'between' ? filter.value2 : undefined })
  }

  return (
    <div className={cn('space-y-2', compact && 'min-w-[220px]')}>
      {!compact || ops.length > 1 ? (
        <select className={inputCls} value={filter.op} onChange={e => changeOp(e.target.value as FilterOp)}>
          {ops.map(o => <option key={o} value={o}>{OP_LABEL[o]}</option>)}
        </select>
      ) : null}
      <ValueInput filter={filter} type={info.type} set={set} binding={binding} />
    </div>
  )
}

/** A value slot that is either a literal or bound to a report parameter. */
function Slot({ filter, slot, type, set, binding, children }: {
  filter: Filter; slot: 'value' | 'value2'; type: string; set: (p: Partial<Filter>) => void; binding?: ParamBinding; children: React.ReactNode
}) {
  if (!binding) return <>{children}</>
  const ptype: ReportParam['type'] = type === 'date' || type === 'datetime' ? 'date' : ['number', 'money', 'calc'].includes(type) ? 'number' : 'text'
  const v = filter[slot]
  const bound = isParamRef(v) ? binding.params.find(p => p.id === v.$param) : undefined
  const compatible = binding.params.filter(p => p.type === ptype)
  return (
    <div className="flex min-w-0 flex-1 items-center gap-1">
      {bound ? (
        <div className="flex h-8 min-w-0 flex-1 items-center gap-1.5 rounded-md border border-primary/50 bg-accent/50 px-2 text-[12.5px]">
          <Variable size={13} className="shrink-0 text-accent-foreground" />
          <span className="truncate font-medium">{bound.name}</span>
          <span className="truncate text-[11px] text-muted-foreground">= {relativeLabel(bound.value) ?? String(bound.value)}</span>
        </div>
      ) : <div className="min-w-0 flex-1">{children}</div>}
      <select title="Valor fijo o parámetro" className={cn(inputCls, 'w-8 shrink-0 px-1 text-[11px]')} value={bound?.id ?? ''}
        onChange={e => {
          const val = e.target.value
          if (val === '__new') set({ [slot]: { $param: binding.onCreate(ptype, v) } })
          else set({ [slot]: val ? { $param: val } : undefined })
        }}>
        <option value="">Valor fijo</option>
        {compatible.map(p => <option key={p.id} value={p.id}>Parámetro: {p.name}</option>)}
        <option value="__new">+ Nuevo parámetro…</option>
      </select>
    </div>
  )
}

function ValueInput({ filter, type, set, binding }: { filter: Filter; type: string; set: (p: Partial<Filter>) => void; binding?: ParamBinding }) {
  const [q, setQ] = useState('')
  const values = useMemo(() => (filter.op === 'in' || filter.op === 'nin' || filter.op === 'eq' || filter.op === 'neq') && type !== 'bool' ? distinctValues(filter.ref) : [], [filter.ref, filter.op, type])
  const isDate = type === 'date' || type === 'datetime'

  switch (filter.op) {
    case 'is_null': case 'not_null': return null
    case 'last_n_days':
      return (
        <div className="flex flex-wrap gap-1">
          {[7, 30, 90, 180].map(n => (
            <button key={n} onClick={() => set({ value: n })}
              className={cn('rounded border px-2 py-1 text-xs', Number(filter.value) === n ? 'border-primary bg-accent text-accent-foreground' : 'hover:bg-muted')}>{n} días</button>
          ))}
          <input type="number" className={cn(inputCls, 'w-20')} value={String(filter.value ?? '')} onChange={e => set({ value: Number(e.target.value) })} />
        </div>
      )
    case 'between':
      return (
        <div className="space-y-1.5">
          <Slot filter={filter} slot="value" type={type} set={set} binding={binding}>
            <input type={isDate ? 'date' : 'number'} className={inputCls} value={String(filter.value ?? '')} onChange={e => set({ value: isDate ? e.target.value : Number(e.target.value) })} />
          </Slot>
          <div className="text-[11px] text-muted-foreground">y</div>
          <Slot filter={filter} slot="value2" type={type} set={set} binding={binding}>
            <input type={isDate ? 'date' : 'number'} className={inputCls} value={String(filter.value2 ?? '')} onChange={e => set({ value2: isDate ? e.target.value : Number(e.target.value) })} />
          </Slot>
        </div>
      )
    case 'in': case 'nin': {
      const sel = new Set((filter.value as string[]) ?? [])
      const shown = values.filter(v => v.toLowerCase().includes(q.toLowerCase())).slice(0, 80)
      return (
        <div>
          {values.length > 8 && <input placeholder="Buscar valor…" className={cn(inputCls, 'mb-1.5')} value={q} onChange={e => setQ(e.target.value)} />}
          <div className="max-h-48 overflow-auto rounded-md border p-1">
            {shown.map(v => (
              <label key={v} className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-[13px] hover:bg-muted">
                <input type="checkbox" className="accent-[hsl(38_35%_53%)]" checked={sel.has(v)}
                  onChange={() => { const n = new Set(sel); n.has(v) ? n.delete(v) : n.add(v); set({ value: [...n] }) }} />
                <span className="truncate">{v}</span>
              </label>
            ))}
            {!shown.length && <div className="px-2 py-1 text-xs text-muted-foreground">Sin valores</div>}
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
            <span>{sel.size ? `${sel.size} seleccionados` : 'Vacío = todos'}</span>
            {sel.size > 0 && <button className="hover:text-foreground" onClick={() => set({ value: [] })}>Limpiar</button>}
          </div>
        </div>
      )
    }
    default:
      if (type === 'bool') {
        return (
          <select className={inputCls} value={String(filter.value ?? 'true')} onChange={e => set({ value: e.target.value })}>
            <option value="true">Sí</option><option value="false">No</option>
          </select>
        )
      }
      if (values.length && (filter.op === 'eq' || filter.op === 'neq') && !isParamRef(filter.value)) {
        return (
          <select className={inputCls} value={String(filter.value ?? '')} onChange={e => set({ value: e.target.value })}>
            <option value="">—</option>
            {values.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        )
      }
      return (
        <Slot filter={filter} slot="value" type={type} set={set} binding={binding}>
          <input type={isDate ? 'date' : type === 'string' || type === 'enum' ? 'text' : 'number'} className={inputCls} value={isParamRef(filter.value) ? '' : String(filter.value ?? '')}
            onChange={e => set({ value: isDate || type === 'string' || type === 'enum' ? e.target.value : e.target.value === '' ? undefined : Number(e.target.value) })} />
        </Slot>
      )
  }
}
