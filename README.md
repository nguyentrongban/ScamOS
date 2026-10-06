# SCAMOS

Game web mô phỏng hệ điều hành: người chơi là nạn nhân và tự điều tra qua hậu quả.
Stack: React, Vite, TypeScript, Tailwind, Framer Motion, Zustand, React Router, Lucide.

## Chạy
    npm install
    npm run dev       # phát triển
    npm run build     # build production
    npm run preview   # xem thử bản build

## Triển khai Vercel
Đẩy lên GitHub → Vercel: Import repository → tự nhận Vite → Deploy.
`vercel.json` đã cấu hình SPA routing. `api/ai.ts` là endpoint phía server cho AI .
Người chơi tự nhập khóa API trong **Cài đặt** (lưu ở localStorage trình duyệt, gửi qua `/api/ai` cho từng yêu cầu). Không có khóa thì game dùng `MockAIProvider`.

## Cấu trúc
`src/game` (engine thuần TS, không phụ thuộc UI) · `src/store` (Zustand) · `src/apps` (ứng dụng) · `src/ai` (provider).
Thêm kịch bản mới: tạo file trong `src/game/scenarios` với `events` và `actions`.
