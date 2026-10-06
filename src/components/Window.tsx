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
      initial={{ opacity: 0, scale: 0.92, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 24 }} transition={{ duration: 0.18 }}
      style={{ zIndex: z }}
      className="fixed inset-0 bottom-12 md:inset-auto md:left-[18%] md:top-[8%] md:h-[520px] md:w-[760px] flex flex-col overflow-hidden bg-slate-900 text-slate-100 shadow-2xl md:rounded-xl border border-white/10"
    >
      <div onPointerDown={e => controls.start(e)} className="flex h-10 shrink-0 cursor-grab items-center gap-2 bg-slate-800 px-3 touch-none">
        <Icon size={16} /><span className="flex-1 text-sm font-medium">{label}</span>
        <button aria-label="Đóng" onClick={() => close(id)} onPointerDown={e => e.stopPropagation()} className="rounded p-1 hover:bg-red-500/80"><X size={16} /></button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto"><Suspense fallback={<p className="p-4 text-sm opacity-60">Đang tải…</p>}><C /></Suspense></div>
    </motion.div>
  )
})
