import { useState } from 'react'
import { useGame } from '../../store/gameStore'

export default function Browser() {
  const link = useGame(s => s.game.flags.link)
  const lost = useGame(s => s.game.flags.lost)
  const act = useGame(s => s.act)
  const [otp, setOtp] = useState('')
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 p-2">
        <div className="rounded-full bg-slate-800 px-4 py-1 text-sm">{link ? 'https://vcb-xacthuc.top/otp' : 'trang-chu'}</div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-white p-4 text-slate-900">
        {!link && <p className="text-sm text-slate-500">Chưa mở trang nào.</p>}
        {link && !lost && (
          <div className="w-full max-w-xs space-y-3 text-center">
            <h2 className="text-lg font-bold text-emerald-700">Xác thực tài khoản</h2>
            <p className="text-sm">Nhập mã OTP vừa gửi về điện thoại để tiếp tục.</p>
            <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="Mã OTP"
              className="w-full rounded border border-slate-300 px-3 py-2 text-center tracking-widest" />
            <div className="flex gap-2">
              <button onClick={() => useGame.getState().closeApp('browser')} className="flex-1 rounded border border-slate-300 py-2 text-sm">Hủy</button>
              <button disabled={otp.length < 6} onClick={() => act('submit_otp')} className="flex-1 rounded bg-emerald-600 py-2 text-sm text-white disabled:opacity-40">Xác nhận</button>
            </div>
          </div>
        )}
        {link && lost && <p className="text-sm text-slate-600">Đang xử lý yêu cầu…</p>}
      </div>
    </div>
  )
}
