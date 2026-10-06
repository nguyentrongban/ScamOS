import { useGame } from '../../store/gameStore'
import { clock, money } from '../../utils/format'

export default function Bank() {
  const balance = useGame(s => s.game.balance)
  const txs = useGame(s => s.game.txs)
  return (
    <div className="p-4">
      <p className="text-sm opacity-70">Số dư</p>
      <p className="mb-4 text-3xl font-semibold tabular-nums">{money(balance)}</p>
      <p className="mb-2 text-sm font-medium">Lịch sử giao dịch</p>
      <ul className="divide-y divide-white/10">
        {txs.map(t => (
          <li key={t.id} className="flex justify-between py-2 text-sm">
            <span>{t.label}<span className="block text-xs opacity-50">{t.at < 0 ? 'Hôm qua' : clock(t.at)}</span></span>
            <span className={t.amount < 0 ? 'text-red-400' : 'text-emerald-400'}>{(t.amount > 0 ? '+' : '') + money(t.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
