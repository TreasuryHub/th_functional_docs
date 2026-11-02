import clsx from 'clsx'
import { X } from 'lucide-react'
import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

export const cn = clsx

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export function Button({ variant = 'secondary', size = 'md', className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: 'sm' | 'md' }) {
  return (
    <button
      {...p}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap',
        size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-9 px-3.5 text-sm',
        variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        variant === 'secondary' && 'bg-card border hover:bg-muted text-foreground',
        variant === 'ghost' && 'hover:bg-muted text-foreground',
        variant === 'danger' && 'text-negative hover:bg-negative/10',
        className,
      )}
    />
  )
}

export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: 'neutral' | 'gold' | 'positive' | 'negative' | 'info'; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium leading-none whitespace-nowrap',
      tone === 'neutral' && 'bg-muted text-muted-foreground border',
      tone === 'gold' && 'bg-accent text-accent-foreground',
      tone === 'positive' && 'bg-positive/10 text-positive',
      tone === 'negative' && 'bg-negative/10 text-negative',
      tone === 'info' && 'bg-info/10 text-info',
      className)}>
      {children}
    </span>
  )
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-lg border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]', className)}>{children}</div>
}

export function Modal({ open, onClose, title, subtitle, children, footer, width = 560 }: {
  open: boolean; onClose: () => void; title: ReactNode; subtitle?: ReactNode; children: ReactNode; footer?: ReactNode; width?: number
}) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4 pt-[8vh]" onMouseDown={onClose}>
      <div className="w-full rounded-xl border bg-card shadow-xl" style={{ maxWidth: width }} onMouseDown={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div>
            <div className="text-[15px] font-semibold">{title}</div>
            {subtitle && <div className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted" aria-label="Cerrar"><X size={16} /></button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t px-5 py-3">{footer}</div>}
      </div>
    </div>
  )
}

/** Anchored popover; closes on outside click. */
export function Popover({ open, onClose, children, className, align = 'left' }: { open: boolean; onClose: () => void; children: ReactNode; className?: string; align?: 'left' | 'right' }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    setTimeout(() => document.addEventListener('mousedown', h), 0)
    window.addEventListener('keydown', k)
    return () => { document.removeEventListener('mousedown', h); window.removeEventListener('keydown', k) }
  }, [open, onClose])
  if (!open) return null
  return (
    <div ref={ref} className={cn('absolute top-full z-40 mt-1 min-w-[260px] rounded-lg border bg-card p-3 shadow-lg', align === 'right' ? 'right-0' : 'left-0', className)}>
      {children}
    </div>
  )
}

export function Label({ children }: { children: ReactNode }) {
  return <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{children}</div>
}

export const inputCls = 'h-8 w-full rounded-md border bg-card px-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode; title?: string }[] }) {
  return (
    <div className="inline-flex rounded-md border bg-muted p-0.5">
      {options.map(o => (
        <button key={o.value} title={o.title} onClick={() => onChange(o.value)}
          className={cn('rounded px-2 py-1 text-xs font-medium transition-colors', value === o.value ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
