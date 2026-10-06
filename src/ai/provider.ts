import { useSettings } from '../store/settingsStore'

export interface AIProvider { reply(npc: string, text: string): Promise<string> }

export class MockAIProvider implements AIProvider {
  async reply(npc: string) {
    await new Promise(r => setTimeout(r, 1200))
    return npc === 'Mẹ' ? 'Ừ, mẹ nhớ rồi. Nhớ giữ gìn sức khỏe nhé.' : 'Vui lòng thực hiện theo hướng dẫn trong tin nhắn trước.'
  }
}

export class RemoteAIProvider implements AIProvider {
  private fallback = new MockAIProvider()
  constructor(private apiKey: string, private endpoint = '/api/ai') {}
  async reply(npc: string, text: string) {
    try {
      const r = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-api-key': this.apiKey },
        body: JSON.stringify({ npc, text }),
      })
      if (!r.ok) throw new Error('ai')
      return (await r.json()).reply as string
    } catch { return this.fallback.reply(npc) }
  }
}

// Có khóa của người chơi → dùng AI thật; không có → dùng Mock.
export const getProvider = (): AIProvider => {
  const key = useSettings.getState().apiKey.trim()
  return key ? new RemoteAIProvider(key) : new MockAIProvider()
}
