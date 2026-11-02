import { useState } from 'react'
import type { Schedule } from '../engine/report'
import { TODAY } from '../state/store'
import { Button, inputCls, Label, Modal, Segmented } from '../ui/primitives'

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export function nextRuns(s: Schedule, n = 3): string[] {
  const out: string[] = []
  const [hh, mm] = s.time.split(':').map(Number)
  let d = new Date(`${TODAY}T00:00:00Z`)
  for (let i = 0; i < 400 && out.length < n; i++) {
    const ok = s.frequency === 'daily' || (s.frequency === 'weekly' && d.getUTCDay() === (s.weekday ?? 1)) || (s.frequency === 'monthly' && d.getUTCDate() === (s.monthday ?? 1))
    if (ok && i > 0) {
      const at = new Date(d); at.setUTCHours(hh, mm)
      out.push(at.toLocaleString('es-AR', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }))
    }
    d = new Date(d.getTime() + 86_400_000)
  }
  return out
}

export function scheduleLabel(s?: Schedule) {
  if (!s?.enabled) return null
  if (s.frequency === 'daily') return `Diario ${s.time}`
  if (s.frequency === 'weekly') return `${WEEKDAYS[s.weekday ?? 1]} ${s.time}`
  return `Día ${s.monthday ?? 1} ${s.time}`
}

export function ScheduleDialog({ open, onClose, value, onSave, onSimulate }: {
  open: boolean; onClose: () => void; value?: Schedule; onSave: (s: Schedule) => void; onSimulate: () => void
}) {
  const [s, setS] = useState<Schedule>(value ?? { enabled: true, frequency: 'daily', time: '08:00', weekday: 1, monthday: 1, recipients: '', format: 'pdf' })
  const set = (p: Partial<Schedule>) => setS(x => ({ ...x, ...p }))
  return (
    <Modal open={open} onClose={onClose} title="Programar ejecución" subtitle="Cada ejecución programada genera un Report Run con snapshot de la definición y se envía a los destinatarios."
      footer={<>
        <Button variant="ghost" className="mr-auto" onClick={() => { onSave(s); onSimulate(); onClose() }}>Guardar y simular ejecución ahora</Button>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={() => { onSave(s); onClose() }}>Guardar</Button>
      </>}>
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" className="accent-[hsl(38_35%_53%)]" checked={s.enabled} onChange={e => set({ enabled: e.target.checked })} /> Programación activa
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Frecuencia</Label>
            <Segmented value={s.frequency} onChange={v => set({ frequency: v })} options={[{ value: 'daily', label: 'Diaria' }, { value: 'weekly', label: 'Semanal' }, { value: 'monthly', label: 'Mensual' }]} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Hora (UTC)</Label><input type="time" className={inputCls} value={s.time} onChange={e => set({ time: e.target.value })} /></div>
            {s.frequency === 'weekly' && <div><Label>Día</Label><select className={inputCls} value={s.weekday} onChange={e => set({ weekday: Number(e.target.value) })}>{WEEKDAYS.map((w, i) => <option key={w} value={i}>{w}</option>)}</select></div>}
            {s.frequency === 'monthly' && <div><Label>Día del mes</Label><input type="number" min={1} max={28} className={inputCls} value={s.monthday} onChange={e => set({ monthday: Number(e.target.value) })} /></div>}
          </div>
        </div>
        <div><Label>Destinatarios</Label><input className={inputCls} value={s.recipients} onChange={e => set({ recipients: e.target.value })} placeholder="tesoreria@empresa.com, cfo@empresa.com" /></div>
        <div>
          <Label>Entrega</Label>
          <Segmented value={s.format} onChange={v => set({ format: v })} options={[{ value: 'pdf', label: 'PDF' }, { value: 'xlsx', label: 'Excel' }, { value: 'csv', label: 'CSV' }, { value: 'link', label: 'Link al Viewer' }]} />
        </div>
        <div className="rounded-md bg-muted p-3 text-[12px]">
          <div className="font-medium">Próximas ejecuciones</div>
          <div className="mt-1 text-muted-foreground">{s.enabled ? nextRuns(s).join(' · ') : 'Pausada'}</div>
          <div className="mt-2 text-muted-foreground">Los filtros expuestos usan sus valores por defecto; los relativos ("últimos 30 días") se resuelven a la fecha de cada ejecución.</div>
        </div>
      </div>
    </Modal>
  )
}
