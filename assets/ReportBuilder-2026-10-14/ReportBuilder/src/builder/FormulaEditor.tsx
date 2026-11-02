import { useMemo, useRef, useState } from 'react'
import { FUNCTION_DOCS, fieldRefs, FormulaError, isAggregate, parse } from '../engine/formula'
import { indexCalcs, resolveFormulaRef, runReport } from '../engine/query'
import type { CalcField, ReportTemplate } from '../engine/report'
import { uid } from '../engine/report'
import { catalog, dataStore, TODAY } from '../state/store'
import { formatValue } from '../ui/format'
import { Badge, Button, cn, inputCls, Label, Modal } from '../ui/primitives'
import { FieldIcon, refInfo } from './helpers'

export function FormulaEditor({ open, onClose, template, initial, entityIds, onSave }: {
  open: boolean; onClose: () => void; template: ReportTemplate; initial?: CalcField; entityIds: string[]; onSave: (c: CalcField) => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [expr, setExpr] = useState(initial?.expr ?? '')
  const [format, setFormat] = useState<CalcField['format']>(initial?.format ?? 'number')
  const [q, setQ] = useState('')
  const ta = useRef<HTMLTextAreaElement>(null)
  const others = template.calcs.filter(c => c.id !== initial?.id)

  const analysis = useMemo(() => {
    if (!expr.trim()) return { ok: false as const, msg: 'Escribí una expresión' }
    try {
      const ast = parse(expr)
      const colName = (m: ReportTemplate['measures'][number]) => m.label || refInfo(m.ref, template.calcs).label
      const unknown = [...fieldRefs(ast)].filter(n => {
        if (n.startsWith('@')) return !template.measures.some(m => [m.id, colName(m)].some(x => x.toLowerCase() === n.slice(1).toLowerCase()))
        const r = resolveFormulaRef(n, others)
        return r.startsWith('calc.') ? !others.some(c => `calc.${c.id}` === r) : !catalog.lookup(r)
      })
      if (unknown.length) return { ok: false as const, msg: `Campo desconocido: ${unknown.join(', ')}` }
      const draft: CalcField = { id: initial?.id ?? '__draft', name: name || 'Fórmula', expr, format }
      const all = [...others, draft]
      const idx = indexCalcs(all).get(draft.id)
      const agg = isAggregate(ast) || !!idx?.agg
      const post = !!idx?.post
      // sample: evaluate the formula as a total over the current filters
      let sample: string | null = null
      try {
        const measures = post ? [...template.measures.filter(m => m.ref !== `calc.${draft.id}`), { id: 'x', ref: `calc.${draft.id}` }] : [{ id: 'x', ref: `calc.${draft.id}`, agg: agg ? undefined : 'SUM' as const }]
        const r = runReport({ ...template, calcs: all, dimensions: post ? template.dimensions : [], measures, grain: post ? template.grain : undefined }, catalog, dataStore, { today: TODAY })
        sample = formatValue(r.totals.x, { type: 'calc', format, label: '' })
      } catch { /* ignore sample errors */ }
      return { ok: true as const, agg, post, sample }
    } catch (e) {
      return { ok: false as const, msg: e instanceof FormulaError ? e.message : String(e) }
    }
  }, [expr, name, format, others, template, initial?.id])

  const insert = (text: string) => {
    const el = ta.current
    if (!el) { setExpr(e => e + text); return }
    const s = el.selectionStart, e = el.selectionEnd
    const next = expr.slice(0, s) + text + expr.slice(e)
    setExpr(next)
    requestAnimationFrame(() => { el.focus(); el.selectionStart = el.selectionEnd = s + text.length })
  }

  const fields = entityIds.flatMap(eid => catalog.entity(eid).fields.filter(f => !f.hidden || f.id.endsWith('_id') || f.id.endsWith('_uuid')).map(f => ({ ref: `${eid}.${f.id}`, f, entity: catalog.entity(eid) })))
    .filter(x => (x.f.label + x.entity.label + x.ref).toLowerCase().includes(q.toLowerCase()))

  return (
    <Modal open={open} onClose={onClose} width={860}
      title={initial ? 'Editar fórmula' : 'Nuevo campo calculado'}
      subtitle="Por fila (ej. [x] * 1.21) o de agregación (ej. SUM([a]) / SUM([b])). Las de agregación se comportan como medidas."
      footer={<>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" disabled={!analysis.ok || !name.trim()} onClick={() => { onSave({ id: initial?.id ?? uid('k'), name: name.trim(), expr, format }); onClose() }}>Guardar fórmula</Button>
      </>}>
      <div className="grid grid-cols-[1fr_280px] gap-5">
        <div className="space-y-3">
          <div className="grid grid-cols-[1fr_160px] gap-3">
            <div><Label>Nombre</Label><input className={inputCls} value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Neto USD" /></div>
            <div><Label>Formato</Label>
              <select className={inputCls} value={format} onChange={e => setFormat(e.target.value as CalcField['format'])}>
                <option value="number">Número</option><option value="currency">Moneda</option><option value="percent">Porcentaje</option><option value="text">Texto</option>
              </select>
            </div>
          </div>
          <div>
            <Label>Expresión</Label>
            <textarea ref={ta} value={expr} onChange={e => setExpr(e.target.value)} rows={5} spellCheck={false}
              className={cn(inputCls, 'h-auto py-2 font-mono text-[13px] leading-relaxed')} placeholder='SUM(IF([financial_event.direction] = "IN", [financial_event.amount_base], 0))' />
            <div className="mt-2 flex items-center gap-2 text-[12px]">
              {analysis.ok ? (
                <>
                  <Badge tone="positive">✓ Válida</Badge>
                  <Badge tone={analysis.agg ? 'gold' : 'info'}>{analysis.post ? 'Entre columnas → se calcula sobre el resultado' : analysis.agg ? 'Agregación → medida' : 'Por fila → dimensión o medida'}</Badge>
                  {analysis.sample !== null && <span className="text-muted-foreground">Total con filtros actuales: <b className="text-foreground tabular-nums">{analysis.sample}</b></span>}
                </>
              ) : <span className="text-negative">{analysis.msg}</span>}
            </div>
          </div>
          <div>
            <Label>Funciones</Label>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {FUNCTION_DOCS.map(f => (
                <button key={f.sig} onClick={() => insert(f.sig.split(' ')[0].replace(/\(.*\)/, '('))} className="flex items-baseline gap-2 rounded px-1 py-0.5 text-left hover:bg-muted">
                  <code className={cn('text-[12px] font-semibold', f.agg ? 'text-positive' : 'text-info')}>{f.sig}</code>
                  <span className="truncate text-[11px] text-muted-foreground">{f.doc}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">Operadores: + − * / · = != &lt; &gt; &lt;= &gt;= · AND OR NOT · texto entre comillas · otras fórmulas por nombre: [Cobros] · columnas del reporte: [@Saldo al {'{Hasta}'}]</div>
          </div>
        </div>
        <div className="flex min-h-0 flex-col">
          <Label>Campos (click para insertar)</Label>
          <input className={cn(inputCls, 'mb-2')} placeholder="Buscar campo…" value={q} onChange={e => setQ(e.target.value)} />
          <div className="max-h-[360px] flex-1 overflow-auto rounded-md border">
            {template.measures.some(m => m.ref !== `calc.${initial?.id}`) && (
              <div className="border-b p-1">
                <div className="px-1.5 pb-0.5 pt-1 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Columnas del reporte</div>
                {template.measures.filter(m => m.ref !== `calc.${initial?.id}`).map(m => {
                  const n = m.label || refInfo(m.ref, template.calcs).label
                  const ctx = template.contexts?.find(c => c.id === m.ctx)
                  return (
                    <button key={m.id} onClick={() => insert(`[@${n}]`)} className="flex w-full items-center gap-2 rounded px-1.5 py-1 text-left text-[12px] hover:bg-muted">
                      <span className="font-mono text-[11px] text-accent-foreground">@</span><span className="truncate">{n}</span>
                      {ctx && <span className="ml-auto text-[10px] text-muted-foreground">{ctx.name}</span>}
                    </button>
                  )
                })}
              </div>
            )}
            {others.length > 0 && (
              <div className="border-b p-1">
                {others.map(c => (
                  <button key={c.id} onClick={() => insert(`[${c.name}]`)} className="flex w-full items-center gap-2 rounded px-1.5 py-1 text-left text-[12px] hover:bg-muted">
                    <FieldIcon type="calc" /> {c.name}
                  </button>
                ))}
              </div>
            )}
            {fields.map(x => (
              <button key={x.ref} onClick={() => insert(`[${x.ref}]`)} className="flex w-full items-center gap-2 px-2 py-1 text-left text-[12px] hover:bg-muted">
                <FieldIcon type={x.f.type} role={x.f.role} />
                <span className="truncate">{x.f.label}</span>
                <span className="ml-auto truncate text-[10px] text-muted-foreground">{x.entity.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
