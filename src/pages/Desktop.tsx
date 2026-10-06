import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Battery, Wifi, Gamepad2 } from 'lucide-react'
import { registry } from '../app/registry'
import Window from '../components/Window'
import Toasts from '../components/Toasts'
import World3D from '../game/World3D'
import { useGame } from '../store/gameStore'
import { clock } from '../utils/format'

export default function Desktop() {
  const open = useGame(s => s.open)
  const openApp = useGame(s => s.openApp)
  const tick = useGame(s => s.tick)
  const minute = useGame(s => s.game.minute)
  useEffect(() => { const t = setInterval(tick, 5000); return () => clearInterval(t) }, [tick])
  return <div className="relative h-full w-full select-none overflow-hidden bg-slate-950">
    <World3D />
    <AnimatePresence>{open.map((id, i) => <Window key={id} id={id} z={100 + i} />)}</AnimatePresence>
    <Toasts />
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[900] hidden h-10 items-center gap-2 border-t border-white/10 bg-slate-950/88 px-3 text-white backdrop-blur-xl md:flex">
      <span className="flex items-center gap-1.5 font-black tracking-wide text-cyan-300"><Gamepad2 size={15}/> SCAMOS</span>
      <div className="pointer-events-auto flex flex-1 gap-1 overflow-x-auto">
        {open.map(id => { const { Icon, label } = registry[id]; return <button key={id} onClick={() => openApp(id)} className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs transition hover:bg-white/15"><Icon size={14}/>{label}</button> })}
      </div>
      <Wifi size={15}/><Battery size={15}/><span className="text-xs tabular-nums">{clock(minute)}</span>
    </div>
  </div>
}
