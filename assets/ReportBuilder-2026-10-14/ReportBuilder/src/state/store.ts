import { useSyncExternalStore } from 'react'
import { Catalog, DataStore } from '../engine/catalog'
import { runReport } from '../engine/query'
import type { Filter, ReportRun, ReportTemplate } from '../engine/report'
import { uid } from '../engine/report'
import { resolveParamValues } from '../engine/params'
import { TABLES, TODAY } from '../model/mockData'
import { SEED_TEMPLATES, seedRuns, STUDIO_SEEDS } from '../model/seeds'
import { DOMAINS, ENTITIES } from '../model/silver'

export const catalog = new Catalog(ENTITIES, DOMAINS)
export const dataStore = new DataStore(catalog, TABLES)
export { TODAY }

// Templates and runs live in localStorage: this is a local POC with no backend.
const KEY = 'rb-poc/v2'

interface State { templates: ReportTemplate[]; runs: ReportRun[] }

const STUDIO_SEEDS_KEY = 'rb-poc/studio-seeds'

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const saved = JSON.parse(raw) as State
      // existing local state: add each simple-builder example once (a deleted one doesn't come back),
      // without touching the user's templates. '1' = the first four examples were already offered.
      const raw2 = localStorage.getItem(STUDIO_SEEDS_KEY)
      const offered = new Set<string>(raw2 === '1' ? ['tpl_s_flow', 'tpl_s_balances', 'tpl_s_recon_kpis', 'tpl_s_matches'] : raw2 ? JSON.parse(raw2) : [])
      const fresh = STUDIO_SEEDS.filter(t => !offered.has(t.id) && !saved.templates.some(x => x.id === t.id))
      if (fresh.length || raw2 === '1' || !raw2) {
        saved.templates = [...fresh, ...saved.templates]
        localStorage.setItem(STUDIO_SEEDS_KEY, JSON.stringify(STUDIO_SEEDS.map(t => t.id)))
        localStorage.setItem(KEY, JSON.stringify(saved))
      }
      return saved
    }
  } catch { /* storage unavailable: fall back to seeds */ }
  return { templates: SEED_TEMPLATES, runs: seedRuns(SEED_TEMPLATES) }
}

let state = load()
const listeners = new Set<() => void>()
function set(next: State) {
  state = next
  try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* ignore */ }
  listeners.forEach(l => l())
}

export const useStore = <T,>(sel: (s: State) => T): T =>
  useSyncExternalStore(cb => { listeners.add(cb); return () => listeners.delete(cb) }, () => sel(state))

export const actions = {
  saveTemplate(t: ReportTemplate) {
    const stamped = { ...t, updatedAt: new Date().toISOString() }
    const exists = state.templates.some(x => x.id === t.id)
    set({ ...state, templates: exists ? state.templates.map(x => (x.id === t.id ? stamped : x)) : [stamped, ...state.templates] })
    return stamped
  },
  deleteTemplate(id: string) {
    set({ templates: state.templates.filter(t => t.id !== id), runs: state.runs.filter(r => r.templateId !== id) })
  },
  duplicate(id: string) {
    const t = state.templates.find(x => x.id === id)
    if (!t) return
    const copy = { ...structuredClone(t), id: uid('tpl_'), name: `${t.name} (copia)`, schedule: undefined }
    set({ ...state, templates: [copy, ...state.templates] })
    return copy
  },
  /** Executes a template now and records a Report Run with a frozen snapshot of the definition. */
  run(t: ReportTemplate, params: Filter[], trigger: ReportRun['trigger'] = 'ad-hoc', paramValues?: Record<string, string | number>): ReportRun {
    const started = performance.now()
    let status: ReportRun['status'] = 'succeeded'
    let rowCount = 0
    let error: string | undefined
    try {
      const r = runReport(t, catalog, dataStore, { today: TODAY, params, paramValues })
      rowCount = r.rows.length
    } catch (e) {
      status = 'failed'
      error = (e as Error).message
    }
    const run: ReportRun = {
      id: uid('run_'), templateId: t.id, templateName: t.name, trigger, status, startedAt: new Date().toISOString(),
      durationMs: Math.max(1, Math.round(performance.now() - started)), rowCount, params: structuredClone(params),
      paramValues: resolveParamValues(t, paramValues, TODAY),
      snapshot: structuredClone(t), runBy: trigger === 'scheduled' ? 'scheduler' : 'nicolas@treasuryhub.ai', error,
    }
    set({ ...state, runs: [run, ...state.runs] })
    return run
  },
  reset() {
    set({ templates: SEED_TEMPLATES, runs: seedRuns(SEED_TEMPLATES) })
  },
}

export const getState = () => state
