import React, { useState } from "react";
import { DEFAULT_MODEL, getSettings, saveSettings, clearSettings, testConnection } from "../lib/gemini";

export default function Settings({ profileName = "Operator", onSaveName }) {
  const initial = getSettings();
  const [name, setName] = useState(profileName);
  const [apiKey, setApiKey] = useState(initial.apiKey);
  const [model, setModel] = useState(initial.model);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const save = () => {
    onSaveName?.(name.trim().slice(0, 24) || "Operator");
    saveSettings({ apiKey: apiKey.trim(), model: model.trim() || DEFAULT_MODEL });
    setStatus("Đã lưu cài đặt.");
  };

  const clear = () => {
    clearSettings();
    setApiKey("");
    setModel(DEFAULT_MODEL);
    setStatus("Đã xóa cài đặt. Game sẽ dùng câu trả lời mẫu.");
  };

  const test = async () => {
    setBusy(true);
    setStatus("Đang kiểm tra...");
    const result = await testConnection(apiKey.trim(), model.trim() || DEFAULT_MODEL);
    setStatus(result.message);
    setBusy(false);
  };

  return (
    <div className="p-4 text-sm space-y-3">
      <div>
        <label className="block text-xs text-slate-400 mb-1">Tên tài khoản</label>
        <input
          value={name}
          maxLength={24}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 outline-none"
        />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Gemini API key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="AIza..."
          className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 outline-none"
        />
        <p className="text-[11px] text-slate-500 mt-1">
          Lấy key miễn phí tại Google AI Studio. Key chỉ lưu trên trình duyệt này.
        </p>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Model</label>
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1.5 outline-none"
        />
        <p className="text-[11px] text-slate-500 mt-1">
          Mặc định: {DEFAULT_MODEL}. Hạn mức miễn phí thay đổi theo thời gian, kiểm tra tại aistudio.google.com/rate-limit.
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={save} className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500">Lưu</button>
        <button onClick={test} disabled={busy || !apiKey.trim()} className="px-3 py-1.5 rounded bg-slate-700 disabled:opacity-40">
          Kiểm tra
        </button>
        <button onClick={clear} className="px-3 py-1.5 rounded bg-slate-800 text-rose-300">Xóa</button>
      </div>

      {status && <div className="text-xs text-slate-300">{status}</div>}
    </div>
  );
}
