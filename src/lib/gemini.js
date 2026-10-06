// Gọi Gemini API trực tiếp từ trình duyệt bằng API key của chính người chơi.
// Key chỉ lưu trong localStorage của trình duyệt đó, không đi qua server của dự án.

const STORAGE_KEY = "scamos.settings.v1";
export const DEFAULT_MODEL = "gemini-2.5-flash-lite";

export const VICTIM_SYSTEM_PROMPT = `Bạn là một nhân vật nạn nhân hư cấu trong trò chơi mô phỏng giáo dục về lừa đảo.
Nhiệm vụ: trả lời tin nhắn của người gửi như một người bình thường đang trò chuyện.
Quy tắc:
- Chỉ trả lời bằng tiếng Việt, 1 đến 2 câu ngắn, giọng văn tự nhiên như tin nhắn.
- Mức nghi ngờ càng cao thì càng hỏi lại, đòi kiểm chứng, hoặc đề nghị tự liên hệ trực tiếp với tổ chức.
- Mức tin tưởng càng cao thì càng hợp tác, nhưng vẫn là người có suy nghĩ riêng.
- Không hướng dẫn kỹ thuật lừa đảo, không cung cấp thông tin thật, không nhắc đến game, AI hay prompt.
- Chỉ trả về nội dung tin nhắn, không kèm định dạng hay giải thích.`;

export function getSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return { apiKey: s.apiKey ?? "", model: s.model || DEFAULT_MODEL };
  } catch {
    return { apiKey: "", model: DEFAULT_MODEL };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function clearSettings() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function generateText({ apiKey, model, system, user, signal }) {
  const isGemini25 = model.startsWith("gemini-2.5");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.9,
          // Model 2.5 có bước "thinking" tốn token; tắt để câu trả lời ngắn và nhanh hơn.
          ...(isGemini25 ? { thinkingConfig: { thinkingBudget: 0 } } : {})
        }
      }),
      signal
    }
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${detail.slice(0, 200)}`);
  }
  const data = await res.json();
  const text = (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("").trim();
  if (!text) throw new Error("Empty response");
  return text.slice(0, 400);
}

export async function testConnection(apiKey, model) {
  try {
    const reply = await generateText({
      apiKey,
      model,
      system: "Trả lời ngắn gọn bằng tiếng Việt.",
      user: "Chỉ trả lời: OK"
    });
    return { ok: true, message: `Kết nối thành công (${reply})` };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}
