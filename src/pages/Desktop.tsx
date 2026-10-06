import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Battery, Wifi } from 'lucide-react'
import { appIds, registry } from '../app/registry'
import Window from '../components/Window'
import Toasts from '../components/Toasts'
import { useGame } from '../store/gameStore'
import { clock } from '../utils/format'

export default function Desktop() {
  const open = useGame(s => s.open)
  const openApp = useGame(s => s.openApp)
  const tick = useGame(s => s.tick)
  const minute = useGame(s => s.game.minute)
  useEffect(() => { const t = setInterval(tick, 5000); return () => clearInterval(t) }, [tick])
  return (
    <div className="relative h-full w-full select-none overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-800 to-cyan-700">
      <div className="grid grid-cols-4 gap-2 p-4 md:w-28 md:grid-cols-1">
        {appIds.map(id => {
          const { Icon, label } = registry[id]
          return (
            <button key={id} onDoubleClick={() => openApp(id)} onClick={() => window.matchMedia('(max-width: 767px)').matches && openApp(id)}
              className="flex flex-col items-center gap-1 rounded-lg p-2 text-xs text-white hover:bg-white/15">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/20"><Icon size={26} /></span>{label}
            </button>
          )
        })}
      </div>
      <AnimatePresence>{open.map((id, i) => <Window key={id} id={id} z={10 + i} />)}</AnimatePresence>
      <Toasts />
      <div className="fixed inset-x-0 bottom-0 z-[900] flex h-12 items-center gap-2 bg-slate-950/90 px-3 text-white backdrop-blur">
        <span className="font-bold tracking-wide">SCAMOS</span>
        <div className="flex flex-1 gap-1 overflow-x-auto">
          {open.map(id => { const { Icon, label } = registry[id]; return (
            <button key={id} onClick={() => openApp(id)} className="flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-xs"><Icon size={14} />{label}</button>
          ) })}
        </div>
        <Wifi size={16} /><Battery size={16} /><span className="text-sm tabular-nums">{clock(minute)}</span>
      </div>
    </div>
  )
}
