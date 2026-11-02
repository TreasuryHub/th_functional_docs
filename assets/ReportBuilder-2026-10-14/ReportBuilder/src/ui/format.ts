import type { Value } from '../engine/formula'
import type { ResultColumn } from '../engine/query'

const nf0 = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })
const nf2 = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const pf = new Intl.NumberFormat('es-AR', { style: 'percent', maximumFractionDigits: 1 })

export function formatValue(v: Value | undefined, col?: Pick<ResultColumn, 'type' | 'format' | 'label'>): string {
  if (v === null || v === undefined || v === '') return '—'
  if (typeof v === 'boolean') return v ? 'Sí' : 'No'
  if (typeof v === 'number') {
    // identifiers stored as numbers (movement id) are text, not quantities
    if (col?.type === 'string') return String(v)
    if (col?.format === 'percent') return pf.format(v)
    if (col?.type === 'money' || col?.format === 'currency') return nf2.format(v)
    return Number.isInteger(v) ? nf0.format(v) : nf2.format(v)
  }
  if (v === 'true') return 'Sí'
  if (v === 'false') return 'No'
  return String(v)
}

export function compact(v: number): string {
  const a = Math.abs(v)
  if (a >= 1e9) return `${(v / 1e9).toFixed(1)}B`
  if (a >= 1e6) return `${(v / 1e6).toFixed(1)}M`
  if (a >= 1e3) return `${(v / 1e3).toFixed(0)}k`
  return nf0.format(v)
}

export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

export const isNumericCol = (c: ResultColumn) => c.kind === 'measure' && c.format !== 'text'
