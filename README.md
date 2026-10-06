# ScamOS

Game mô phỏng giáo dục về lừa đảo. Người chơi đóng vai người lừa đảo trên một màn hình máy tính giả lập.

## Chạy local

```bash
npm install
npm run dev
```

## Cấu hình AI (tùy chọn)

Nếu không nhập key, game dùng câu trả lời mẫu và vẫn chơi bình thường.

1. Lấy Gemini API key miễn phí tại Google AI Studio.
2. Mở **Start → Settings** trong game, dán key và bấm **Lưu**.
3. Bấm **Kiểm tra** để xác nhận key hoạt động.

Key được lưu trong localStorage của trình duyệt, không đi qua server của dự án. Mỗi người chơi dùng key và hạn mức của chính họ.

## Deploy lên Vercel

Đưa repo lên GitHub, rồi trên Vercel chọn **Add New → Project** và chọn repo. Vercel tự nhận Vite (build `npm run build`, output `dist`). Không cần biến môi trường nào.
