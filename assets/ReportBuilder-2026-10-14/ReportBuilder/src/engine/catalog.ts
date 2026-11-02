import type { Domain, Entity, Field, Row } from '../model/types'

type Hop = { to: string; fk: string }

/** Graph helpers over the semantic layer: who is parent of whom, and how to walk N:1 joins. */
export class Catalog {
  readonly byId = new Map<string, Entity>()
  private pathCache = new Map<string, Hop[] | null>()

  constructor(readonly entities: Entity[], readonly domains: Domain[]) {
    entities.forEach(e => this.byId.set(e.id, e))
  }

  entity(id: string): Entity {
    const e = this.byId.get(id)
    if (!e) throw new Error(`Entidad desconocida: ${id}`)
    return e
  }

  /** `<entity>.<field>` -> entity + field (null for calc refs) */
  lookup(ref: string): { entity: Entity; field: Field } | null {
    const [eid, fid] = ref.split('.')
    if (eid === 'calc') return null
    const entity = this.byId.get(eid)
    const field = entity?.fields.find(f => f.id === fid)
    return entity && field ? { entity, field } : null
  }

  /** Subtypes share their base entity's row. */
  base(id: string): string {
    const e = this.entity(id)
    return e.parent?.kind === 'subtype' ? this.base(e.parent.entity) : id
  }

  subtypesOf(id: string): Entity[] {
    return this.entities.filter(e => e.parent?.kind === 'subtype' && e.parent.entity === id)
  }

  childrenOf(id: string): Entity[] {
    return this.entities.filter(e => e.parent?.entity === id)
  }

  private upEdges(id: string): Hop[] {
    const e = this.entity(id)
    const hops: Hop[] = []
    if (e.parent && e.parent.kind === 'parent') hops.push({ to: this.base(e.parent.entity), fk: e.parent.fk })
    e.lookups?.forEach(l => hops.push({ to: this.base(l.entity), fk: l.fk }))
    return hops
  }

  /** N:1 path from `from` up to `to` (both as base ids), or null when `to` is not above `from`. */
  pathUp(from: string, to: string): Hop[] | null {
    from = this.base(from); to = this.base(to)
    const k = `${from}>${to}`
    if (this.pathCache.has(k)) return this.pathCache.get(k)!
    let found: Hop[] | null = from === to ? [] : null
    if (!found) {
      const queue: { id: string; path: Hop[] }[] = [{ id: from, path: [] }]
      const seen = new Set([from])
      while (queue.length && !found) {
        const cur = queue.shift()!
        for (const h of this.upEdges(cur.id)) {
          if (seen.has(h.to)) continue
          const path = [...cur.path, h]
          if (h.to === to) { found = path; break }
          seen.add(h.to); queue.push({ id: h.to, path })
        }
      }
    }
    this.pathCache.set(k, found)
    return found
  }

  /** a is strictly above b (b has N rows per a) */
  isAncestor(a: string, b: string): boolean {
    return this.base(a) !== this.base(b) && this.pathUp(b, a) !== null
  }

  /** M:N resolution: an entity below every id (e.g. the tag-assignment bridge between Tag and Transaction) */
  commonDescendant(ids: string[]): string | null {
    let best: { id: string; cost: number } | null = null
    for (const e of this.entities) {
      if (e.parent?.kind === 'subtype') continue
      let cost = 0
      let ok = true
      for (const i of ids) { const p = this.pathUp(e.id, i); if (!p) { ok = false; break } cost += p.length }
      if (ok && (!best || cost < best.cost)) best = { id: e.id, cost }
    }
    return best?.id ?? null
  }

  /** nearest entity that every id in `ids` can reach going up */
  commonAncestor(ids: string[]): string | null {
    const [first, ...rest] = ids.map(i => this.base(i))
    const queue = [first]
    const seen = new Set<string>()
    while (queue.length) {
      const cur = queue.shift()!
      if (seen.has(cur)) continue
      seen.add(cur)
      if (rest.every(r => this.pathUp(r, cur) !== null)) return cur
      this.upEdges(cur).forEach(h => queue.push(h.to))
    }
    return null
  }
}

/** Primary-key indexes over the in-memory silver tables so N:1 hops are O(1). */
export class DataStore {
  private idx = new Map<string, Map<unknown, Row>>()
  constructor(readonly catalog: Catalog, readonly tables: Record<string, Row[]>) {}

  rows(entityId: string): Row[] {
    return this.tables[this.catalog.base(entityId)] ?? []
  }

  get(entityId: string, key: unknown): Row | undefined {
    const id = this.catalog.base(entityId)
    let m = this.idx.get(id)
    if (!m) {
      const e = this.catalog.entity(id)
      m = new Map(this.rows(id).map(r => [r[e.key], r]))
      this.idx.set(id, m)
    }
    return m.get(key)
  }

  /** Row of entity `to` reached from `row` (of entity `from`) following N:1 joins. */
  climb(from: string, row: Row, to: string): Row | undefined {
    const path = this.catalog.pathUp(from, to)
    if (!path) return undefined
    let cur: Row | undefined = row
    for (const h of path) {
      if (!cur) return undefined
      cur = this.get(h.to, cur[h.fk])
    }
    return cur
  }
}
