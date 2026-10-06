import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../store/gameStore'
import { registry } from '../app/registry'

export default function Toasts() {
  const n = useGame(s => s.game.notices[0])
  const dismiss = useGame(s => s.dismiss)
  const openApp = useGame(s => s.openApp)
  useEffect(() => { if (!n) return; const t = setTimeout(() => dismiss(n.id), 4500); return () => clearTimeout(t) }, [n, dismiss])
  return (
    <div className="pointer-events-none fixed right-3 top-3 z-[999] w-72 max-w-[calc(100%-1.5rem)]">
      <AnimatePresence mode="wait">
        {n && (
          <motion.button key={n.id} initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 80, opacity: 0 }}
            onClick={() => { openApp(n.app); dismiss(n.id) }}
            className="pointer-events-auto w-full rounded-lg bg-white/95 p-3 text-left text-slate-900 shadow-xl">
            <p className="text-xs font-semibold text-slate-500">{registry[n.app].label}</p>
            <p className="text-sm font-semibold">{n.title}</p>
            <p className="line-clamp-2 text-sm">{n.body}</p>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
