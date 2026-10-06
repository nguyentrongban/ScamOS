import { memo, Suspense } from 'react'
import { motion, useDragControls } from 'framer-motion'
import { X } from 'lucide-react'
import type { AppId } from '../types'
import { registry } from '../app/registry'
import { useGame } from '../store/gameStore'
import { useWide } from '../hooks/useWide'

export default memo(function Window({ id, z }: { id: AppId; z: number }) {
  const { label, Icon, C } = registry[id]
  const controls = useDragControls()
  const wide = useWide()
  const close = useGame(s => s.closeApp)
  const focus = useGame(s => s.openApp)
  return (
    <motion.div
      drag={wide} dragControls={controls} dragListener={false} dragMomentum={false}
      onPointerDown={() => focus(id)}
      initial={{ opacity: 0, scale: .96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: .96, y: 18 }} transition={{ duration: .16 }} style={{ zIndex: z }}
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden border border-white/10 bg-slate-900/96 text-slate-100 shadow-2xl backdrop-blur-xl md:inset-auto md:left-[12%] md:top-[7%] md:h-[560px] md:w-[min(820px,76vw)] md:rounded-3xl"
    >
      <div onPointerDown={e => controls.start(e)} className="flex h-12 shrink-0 cursor-grab items-center gap-2 border-b border-white/10 bg-slate-800/90 px-4 touch-none">
        <Icon size={17}/><span className="flex-1 text-sm font-bold">{label}</span>
        <button aria-label="Đóng" onClick={() => close(id)} onPointerDown={e => e.stopPropagation()} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-red-500/80"><X size={17}/></button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto"><Suspense fallback={<p className="p-5 text-sm opacity-60">Đang tải…</p>}><C /></Suspense></div>
    </motion.div>
  )
})
