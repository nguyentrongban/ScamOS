import { create } from 'zustand'
import type { AppId, GameState } from '../types'
import { act, createState, tick } from '../game/engine/engine'
import { say } from '../game/scenarios/bankScam'
import { getProvider } from '../ai/provider'

interface Store {
  game: GameState
  open: AppId[]
  typing: string | null
  openApp: (a: AppId) => void
  closeApp: (a: AppId) => void
  tick: () => void
  act: (id: string) => void
  dismiss: (id: string) => void
  send: (thread: string, text: string) => Promise<void>
}

export const useGame = create<Store>((set) => ({
  game: createState(), open: [], typing: null,
  openApp: a => set(s => ({ open: [...s.open.filter(x => x !== a), a] })),
  closeApp: a => set(s => ({ open: s.open.filter(x => x !== a) })),
  tick: () => set(s => ({ game: tick(s.game) })),
  act: id => set(s => ({ game: act(s.game, id) })),
  dismiss: id => set(s => ({ game: { ...s.game, notices: s.game.notices.filter(n => n.id !== id) } })),
  send: async (thread, text) => {
    set(s => ({ game: say(s.game, thread, text, true), typing: thread }))
    const r = await getProvider().reply(thread, text)
    set(s => ({ game: say(s.game, thread, r), typing: null }))
  },
}))
