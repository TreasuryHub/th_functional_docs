import { Blocks, Database, FileBarChart2, Hammer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BuilderPage } from './pages/BuilderPage'
import { LibraryPage } from './pages/LibraryPage'
import { ModelPage } from './pages/ModelPage'
import { StudioPage } from './pages/StudioPage'
import { ViewerPage } from './pages/ViewerPage'
import { cn } from './ui/primitives'

// Minimal hash router: #/  ·  #/studio/:id|new  ·  #/builder/:id|new  ·  #/view/:id[/run/:runId]  ·  #/model
export function navigate(hash: string, replace = false) {
  if (replace) history.replaceState(null, '', hash)
  else history.pushState(null, '', hash)
  window.dispatchEvent(new Event('hashchange'))
}

function useHash() {
  const [h, setH] = useState(location.hash || '#/')
  useEffect(() => {
    const on = () => setH(location.hash || '#/')
    window.addEventListener('hashchange', on)
    window.addEventListener('popstate', on)
    return () => { window.removeEventListener('hashchange', on); window.removeEventListener('popstate', on) }
  }, [])
  return h
}

export function App() {
  const hash = useHash()
  const [path, query = ''] = hash.slice(1).split('?')
  const parts = path.split('/').filter(Boolean)
  const qs = new URLSearchParams(query)

  let page: React.ReactNode = <LibraryPage />
  let section = 'reports'
  if (parts[0] === 'builder') {
    const id = parts[1] && parts[1] !== 'new' ? parts[1] : undefined
    page = <BuilderPage key={id ?? `new-${qs.get('domain')}`} id={id} />
    section = 'builder'
  } else if (parts[0] === 'studio') {
    const id = parts[1] && parts[1] !== 'new' ? parts[1] : undefined
    page = <StudioPage key={id ?? 'new'} id={id} />
    section = 'studio'
  } else if (parts[0] === 'view' && parts[1]) {
    page = <ViewerPage key={parts[1]} id={parts[1]} runId={parts[2] === 'run' ? parts[3] : undefined} autoRun={qs.get('run') === '1'} />
    section = 'viewer'
  } else if (parts[0] === 'model') {
    page = <ModelPage />
    section = 'model'
  }

  const nav = (id: string, label: string, icon: React.ReactNode, href: string) => (
    <button onClick={() => navigate(href)}
      className={cn('flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium transition-colors', section === id ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white')}>
      {icon}{label}
    </button>
  )

  return (
    <div className="min-h-screen">
      <header className="flex h-12 items-center gap-4 bg-topbar px-4 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary font-brand text-[12px] text-white">T</div>
          <span className="font-brand text-[14px]">Treasury Hub</span>
          <span className="text-[12px] text-white/50">/ Report Builder · POC</span>
        </div>
        <nav className="ml-4 flex items-center gap-1">
          {nav('reports', 'Reportes', <FileBarChart2 size={14} />, '#/')}
          {section === 'studio' && nav('studio', 'Editor', <Blocks size={14} />, location.hash)}
          {section === 'builder' && nav('builder', 'Builder avanzado', <Hammer size={14} />, location.hash)}
          {section === 'viewer' && nav('viewer', 'Viewer', <FileBarChart2 size={14} />, location.hash)}
          {nav('model', 'Modelo Silver', <Database size={14} />, '#/model')}
        </nav>
        <div className="ml-auto text-[12px] text-white/60">Tenant: Acme LatAm · datos mock · hoy 28-sep-2026</div>
      </header>
      {page}
    </div>
  )
}
