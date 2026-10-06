import { useState } from 'react'
import { useSettings } from '../../store/settingsStore'

export default function SettingsApp() {
  const saved = useSettings(s => s.apiKey)
  const setApiKey = useSettings(s => s.setApiKey)
  const [key, setKey] = useState(saved)
  const [done, setDone] = useState(false)
  return (
    <div className="space-y-4 p-4 text-sm">
      <div>
        <p className="font-medium">Khóa API của bạn</p>
        <p className="mb-2 text-xs opacity-60">
          Nhập khóa API (Anthropic) để nhân vật trò chuyện bằng AI. Khóa chỉ được lưu trong trình duyệt của bạn.
          Để trống để dùng chế độ mặc định không cần AI.
        </p>
        <input type="password" value={key} onChange={e => { setKey(e.target.value); setDone(false) }} placeholder="sk-ant-..."
          autoComplete="off" className="w-full rounded-lg bg-slate-800 px-3 py-2 outline-none" />
        <div className="mt-2 flex items-center gap-2">
          <button onClick={() => { setApiKey(key.trim()); setDone(true) }} className="rounded-lg bg-blue-600 px-3 py-1.5">Lưu</button>
          <button onClick={() => { setKey(''); setApiKey(''); setDone(false) }} className="rounded-lg border border-white/30 px-3 py-1.5">Xóa khóa</button>
          {done && <span className="text-xs text-emerald-400">Đã lưu</span>}
        </div>
        <p className="mt-2 text-xs opacity-60">Trạng thái: {saved ? 'Đang dùng AI' : 'Chế độ mặc định'}</p>
      </div>
      <ul className="divide-y divide-white/10 border-t border-white/10">
        <li className="py-3">Wi-Fi <span className="block text-xs opacity-60">Đã kết nối</span></li>
        <li className="py-3">Thông báo <span className="block text-xs opacity-60">Bật</span></li>
      </ul>
    </div>
  )
}
