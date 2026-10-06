export type AppId = 'messages' | 'email' | 'browser' | 'bank' | 'phone' | 'files' | 'settings'
export interface Msg { id: string; thread: string; text: string; at: number; mine: boolean }
export interface Choice { id: string; label: string }
export interface Tx { id: string; label: string; amount: number; at: number }
export interface Notice { id: string; app: AppId; title: string; body: string }
export interface GameState {
  minute: number
  balance: number
  msgs: Msg[]
  txs: Tx[]
  notices: Notice[]
  choices: Choice[]
  flags: Record<string, boolean>
  fired: string[]
}
export interface ScenarioEvent {
  id: string
  at: number
  when?: (s: GameState) => boolean
  run: (s: GameState) => GameState
}
