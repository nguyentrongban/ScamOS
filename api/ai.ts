// Vercel Serverless Function: chuyển tiếp yêu cầu bằng khóa API do người chơi gửi lên.
// Khóa chỉ dùng cho từng yêu cầu, không lưu và không ghi log.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Phương thức không hợp lệ' })
  const key = req.headers['x-user-api-key']
  if (!key || typeof key !== 'string') return res.status(401).json({ error: 'Thiếu khóa API' })
  const { npc, text } = req.body || {}
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        system: `Bạn đóng vai nhân vật "${String(npc).slice(0, 60)}" trong một game mô phỏng đời thường. Trả lời ngắn gọn bằng tiếng Việt.`,
        messages: [{ role: 'user', content: String(text ?? '').slice(0, 500) }],
      }),
    })
    if (!r.ok) return res.status(502).json({ error: 'Không gọi được AI' })
    const d = await r.json()
    return res.status(200).json({ reply: d.content?.[0]?.text ?? '' })
  } catch {
    return res.status(502).json({ error: 'Không gọi được AI' })
  }
}
