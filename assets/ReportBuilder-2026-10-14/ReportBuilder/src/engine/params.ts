import { isParamRef, RELATIVE_DATES, type Filter, type ReportParam, type ReportTemplate } from './report'

const iso = (d: Date) => d.toISOString().slice(0, 10)

/** '@start_of_month' etc. -> ISO date, relative to `today`. Non-tokens pass through. */
export function resolveRelative(v: string | number, today: string): string | number {
  if (typeof v !== 'string' || !v.startsWith('@')) return v
  const t = new Date(`${today}T00:00:00Z`)
  const y = t.getUTCFullYear(), m = t.getUTCMonth()
  switch (v) {
    case '@today': return today
    case '@yesterday': return iso(new Date(t.getTime() - 86_400_000))
    case '@last_30_days': return iso(new Date(t.getTime() - 30 * 86_400_000))
    case '@start_of_month': return iso(new Date(Date.UTC(y, m, 1)))
    case '@end_of_month': return iso(new Date(Date.UTC(y, m + 1, 0)))
    case '@start_of_prev_month': return iso(new Date(Date.UTC(y, m - 1, 1)))
    case '@end_of_prev_month': return iso(new Date(Date.UTC(y, m, 0)))
    case '@start_of_year': return iso(new Date(Date.UTC(y, 0, 1)))
    case '@end_of_prev_year': return iso(new Date(Date.UTC(y - 1, 11, 31)))
  }
  return v
}

export const relativeLabel = (v: unknown) => RELATIVE_DATES.find(r => r.token === v)?.label

/** Effective value of every parameter: run-time override, else the template default; tokens resolved. */
export function resolveParamValues(t: ReportTemplate, overrides: Record<string, string | number> | undefined, today: string): Record<string, string | number> {
  const out: Record<string, string | number> = {}
  for (const p of t.params ?? []) out[p.id] = resolveRelative(overrides?.[p.id] ?? p.value, today)
  return out
}

export function bindFilter(f: Filter, values: Record<string, string | number>): Filter {
  const b = (v: unknown) => (isParamRef(v) ? values[v.$param] ?? '' : v)
  return isParamRef(f.value) || isParamRef(f.value2) ? { ...f, value: b(f.value), value2: b(f.value2) } : f
}

export function formatParamValue(p: ReportParam | undefined, v: unknown): string {
  if (v === undefined || v === null || v === '') return '…'
  if (p?.type === 'date' && typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [y, m, d] = v.split('-')
    return `${d}/${m}/${y}`
  }
  return String(v)
}

/** "Saldo al {Desde}" -> "Saldo al 01/09/2026" */
export function interpolate(label: string, t: ReportTemplate, values: Record<string, string | number>): string {
  if (!label.includes('{')) return label
  return label.replace(/\{([^}]+)\}/g, (whole, name: string) => {
    const p = (t.params ?? []).find(x => x.name.toLowerCase() === name.trim().toLowerCase())
    return p ? formatParamValue(p, values[p.id]) : whole
  })
}

export const paramName = (t: ReportTemplate, v: unknown) => (isParamRef(v) ? (t.params ?? []).find(p => p.id === v.$param)?.name : undefined)
