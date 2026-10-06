import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PhoneCall } from 'lucide-react'
import { useGame } from '../../store/gameStore'

const contacts = [
  { name: 'Mẹ', action: '' },
  { name: 'Số in trên thẻ ngân hàng', action: 'call_card' },
]

export default function PhoneApp() {
  const act = useGame(s => s.act)
  const [calling, setCalling] = useState<string | null>(null)
  const call = (name: string, action: string) => {
    setCalling(name)
    setTimeout(() => { setCalling(null); if (action) act(action) }, 2500)
  }
  return (
    <div className="relative h-full">
      <ul className="divide-y divide-white/10">
        {contacts.map(c => (
          <li key={c.name} className="flex items-center justify-between p-4 text-sm">
            {c.name}
            <button aria-label={`Gọi ${c.name}`} onClick={() => call(c.name, c.action)} className="rounded-full bg-emerald-600 p-2"><PhoneCall size={16} /></button>
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {calling && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 grid place-items-center bg-slate-950/95">
            <div className="text-center">
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-emerald-600"><PhoneCall /></motion.div>
              <p className="font-medium">{calling}</p><p className="text-sm opacity-60">Đang gọi…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
