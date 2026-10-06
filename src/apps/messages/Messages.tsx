import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../../store/gameStore'

export default function Messages() {
  const msgs = useGame(s => s.game.msgs)
  const choices = useGame(s => s.game.choices)
  const typing = useGame(s => s.typing)
  const act = useGame(s => s.act)
  const openApp = useGame(s => s.openApp)
  const send = useGame(s => s.send)
  const [sel, setSel] = useState<string>()
  const [text, setText] = useState('')
  const threads = [...new Set(msgs.map(m => m.thread))]
  const cur = sel && threads.includes(sel) ? sel : threads[threads.length - 1]
  if (!cur) return <p className="p-4 text-sm opacity-60">Chưa có tin nhắn nào.</p>
  const pick = (id: string) => { act(id); if (id === 'open_link') openApp('browser') }
  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-2 overflow-x-auto border-b border-white/10 p-2">
        {threads.map(t => (
          <button key={t} onClick={() => setSel(t)} className={`shrink-0 rounded-full px-3 py-1 text-xs ${t === cur ? 'bg-blue-600' : 'bg-white/10'}`}>{t}</button>
        ))}
      </div>
      <div className="flex-1 space-y-2 overflow-auto p-3">
        {msgs.filter(m => m.thread === cur).map(m => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.mine ? 'ml-auto bg-blue-600' : 'bg-slate-700'}`}>{m.text}</motion.div>
        ))}
        {typing === cur && <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="text-xs opacity-70">đang nhập…</motion.p>}
        {cur === 'NH-VCB' && choices.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {choices.map(c => <button key={c.id} onClick={() => pick(c.id)} className="rounded-lg border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10">{c.label}</button>)}
          </div>
        )}
      </div>
      <div className="flex gap-2 border-t border-white/10 p-2">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Nhập tin nhắn" className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm outline-none" />
        <button onClick={() => { if (text.trim()) { send(cur, text.trim()); setText('') } }} className="rounded-lg bg-blue-600 px-3 text-sm">Gửi</button>
      </div>
    </div>
  )
}
