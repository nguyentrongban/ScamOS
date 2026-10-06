// Game engine thuần TypeScript: không import React/UI.
import type { GameState } from '../../types'
import { actions, events } from '../scenarios/bankScam'

export const createState = (): GameState => ({
  minute: 0, balance: 52300000, msgs: [], notices: [], choices: [], flags: {}, fired: [],
  txs: [{ id: 't0', label: 'Lương tháng 9', amount: 18000000, at: -1440 }],
})

export function tick(s: GameState): GameState {
  let n: GameState = { ...s, minute: s.minute + 1 }
  for (const e of events) {
    if (!n.fired.includes(e.id) && e.at <= n.minute && (!e.when || e.when(n))) {
      n = { ...e.run(n), fired: [...n.fired, e.id] }
    }
  }
  return n
}

export function act(s: GameState, id: string): GameState {
  const f = actions[id]
  return f ? f({ ...s, choices: [] }) : s
}
