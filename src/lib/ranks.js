// Cấp bậc tính theo số vụ thành công (không liên quan đến tiền).
export const RANKS = [
  { name: "Thực tập", need: 0 },
  { name: "Cộng tác viên", need: 1 },
  { name: "Trưởng nhóm", need: 3 },
  { name: "Chuyên gia", need: 5 }
];

export function getRank(success) {
  const idx = RANKS.reduce((acc, r, i) => (success >= r.need ? i : acc), 0);
  const current = RANKS[idx];
  const next = RANKS[idx + 1] ?? null;
  const progress = next ? Math.round(((success - current.need) / (next.need - current.need)) * 100) : 100;
  return { current, next, progress };
}
