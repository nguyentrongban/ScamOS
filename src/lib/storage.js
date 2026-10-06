// Lưu trạng thái game vào localStorage để tải lại trang không bị mất.
import { initialContacts } from "../data/contacts";

const KEY = "scamos.game.v1";

export function loadGame() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const contacts = data?.contacts;
    if (!Array.isArray(contacts) || contacts.length !== initialContacts.length) return null;
    if (!contacts.every((c, i) => c.id === initialContacts[i].id)) return null;
    const stats = {
      success: Number(data.stats?.success) || 0,
      failed: Number(data.stats?.failed) || 0
    };
    const profileName = typeof data.profile?.name === "string" && data.profile.name.trim()
      ? data.profile.name.trim().slice(0, 24)
      : "Operator";
    return {
      contacts,
      stats,
      profileName,
      windows: data.windows && typeof data.windows === "object" ? data.windows : {}
    };
  } catch {
    return null;
  }
}

export function saveGame(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Bộ nhớ đầy hoặc bị chặn: game vẫn chạy, chỉ không lưu được.
  }
}

export function clearGame() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
