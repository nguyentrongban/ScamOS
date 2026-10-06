import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  apiKey: string
  setApiKey: (k: string) => void
}

// Khóa do người chơi tự nhập, chỉ lưu trong localStorage của trình duyệt họ.
export const useSettings = create<SettingsStore>()(
  persist((set) => ({ apiKey: '', setApiKey: apiKey => set({ apiKey }) }), { name: 'scamos-settings' })
)
