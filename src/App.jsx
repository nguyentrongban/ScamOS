import React, { useEffect, useRef, useState } from "react";
import {
  Archive, FileText, HardDrive, MessageCircle, Recycle, WalletCards,
  FolderOpen, Terminal, Shield, Monitor, Settings
} from "lucide-react";
import DesktopIcon from "./components/DesktopIcon";
import Taskbar from "./components/Taskbar";
import StartMenu from "./components/StartMenu";
import Window from "./components/Window";
import TeleCRM from "./apps/TeleCRM";
import FakeProofStudio from "./apps/FakeProofStudio";
import ShadowWallet from "./apps/ShadowWallet";
import ScamNotes from "./apps/ScamNotes";
import SettingsApp from "./apps/Settings";
import { getSettings, generateText, VICTIM_SYSTEM_PROMPT } from "./lib/gemini";
import { createContacts } from "./data/contacts";

const APPS = {
  telecrm: { id: "telecrm", title: "TeleCRM v2.4", short: "TeleCRM", icon: <MessageCircle size={15} />, default: { x: 160, y: 52, width: 780, height: 510 } },
  fakeproof: { id: "fakeproof", title: "FakeProof Studio", short: "FakeProof", icon: <FileText size={15} />, default: { x: 680, y: 100, width: 510, height: 500 } },
  wallet: { id: "wallet", title: "ShadowWallet", short: "Wallet", icon: <WalletCards size={15} />, default: { x: 40, y: 105, width: 430, height: 450 } },
  notes: { id: "notes", title: "ScamNotes.txt", short: "Notes", icon: <FileText size={15} />, default: { x: 350, y: 390, width: 550, height: 330 } },
  settings: { id: "settings", title: "Settings", short: "Settings", icon: <Settings size={15} />, default: { x: 260, y: 150, width: 440, height: 360 } }
};

export default function App() {
  const [windows, setWindows] = useState({});
  const [zCounter, setZCounter] = useState(10);
  const [startOpen, setStartOpen] = useState(false);
  const [contacts, setContacts] = useState(createContacts);
  const contactsRef = useRef(contacts);
  useEffect(() => { contactsRef.current = contacts; }, [contacts]);

  const now = () => new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));
  const rand = (min, max) => min + Math.random() * (max - min);

  // Người chơi gửi tin: chỉ số của nạn nhân thay đổi, nạn nhân bắt đầu soạn trả lời.
  const handleSend = (id, text) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id !== id
          ? c
          : {
              ...c,
              messages: [...c.messages, { from: "me", text, time: now() }],
              trust: clamp(c.trust + rand(-4, 6)),
              emotion: clamp(c.emotion + rand(-5, 5)),
              suspicion: clamp(c.suspicion + rand(0, 9)),
              typing: true
            }
      )
    );
    setTimeout(() => replyFrom(id), 1000 + Math.random() * 1200);
  };

  // Gọi Gemini bằng key người chơi nhập trong Settings. Không có key hoặc lỗi thì trả về null để dùng câu mẫu.
  const fetchAIReply = async (c) => {
    const { apiKey, model } = getSettings();
    if (!apiKey) return null;
    const transcript = c.messages
      .slice(-8)
      .map((m) => `${m.from === "me" ? "Người gửi" : "Bạn"}: ${m.text}`)
      .join("\n");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);
    try {
      return await generateText({
        apiKey,
        model,
        system: VICTIM_SYSTEM_PROMPT,
        user:
          `Bạn là ${c.name}. Mức tin tưởng: ${c.trust}/100. Mức nghi ngờ: ${c.suspicion}/100.\n` +
          `Cuộc trò chuyện gần nhất ("Người gửi" là đối phương, "Bạn" là chính nhân vật):\n${transcript}\n\n` +
          `Hãy viết tin nhắn tiếp theo của bạn.`,
        signal: controller.signal
      });
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  };

  const fallbackLine = (c) => {
    const pool = c.suspicion >= 80 ? c.warnings : c.replies;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  // Nạn nhân trả lời. Mức nghi ngờ đạt 100 thì báo cáo và khóa chat.
  const replyFrom = async (id) => {
    const c = contactsRef.current.find((x) => x.id === id);
    if (!c || c.status !== "active") {
      setContacts((prev) => prev.map((x) => (x.id === id ? { ...x, typing: false } : x)));
      return;
    }
    const reported = c.suspicion >= 100;
    const line = reported ? c.reportLine : (await fetchAIReply(c)) ?? fallbackLine(c);
    setContacts((prev) =>
      prev.map((x) =>
        x.id !== id
          ? x
          : {
              ...x,
              typing: false,
              status: reported ? "reported" : "active",
              messages: [...x.messages, { from: "them", text: line, time: now() }]
            }
      )
    );
  };

  const resetGame = () => {
    setContacts(createContacts());
    setWindows({});
    setStartOpen(false);
  };

  const threat = Math.floor(
    contacts.reduce((sum, c) => sum + c.suspicion, 0) / contacts.length * 0.5
  );

  const openApp = (id) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        open: true,
        minimized: false,
        maximized: prev[id]?.maximized ?? false,
        zIndex: zCounter + 1
      }
    }));
    setZCounter((z) => z + 1);
    setStartOpen(false);
  };

  const closeApp = (id) => setWindows((prev) => ({ ...prev, [id]: { ...prev[id], open: false } }));

  const minimizeApp = (id) => setWindows((prev) => ({ ...prev, [id]: { ...prev[id], minimized: true } }));

  const toggleMax = (id) => setWindows((prev) => ({ ...prev, [id]: { ...prev[id], maximized: !prev[id]?.maximized } }));

  const focusApp = (id) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], zIndex: zCounter + 1, minimized: false } }));
    setZCounter((z) => z + 1);
  };

  const openWindows = Object.values(APPS).filter((app) => windows[app.id]?.open);

  return (
    <main className="desktop" onMouseDown={() => startOpen && setStartOpen(false)}>
      <div className="wallpaper-grid" />
      <div className="scanlines" />

      <div className="desktop-top">
        <div className="os-label">
          <Monitor size={14} /> SCAMOS <span>v0.1</span>
        </div>
        <div className="session-label">
          <Shield size={13} /> LOCAL SESSION • SECURE
        </div>
      </div>

      <div className="desktop-icons">
        <DesktopIcon icon={<HardDrive size={27} />} label="My Computer" onDoubleClick={() => openApp("telecrm")} />
        <DesktopIcon icon={<Recycle size={27} />} label="Recycle Bin" onDoubleClick={() => openApp("notes")} />
        <DesktopIcon icon={<MessageCircle size={27} />} label="TeleCRM" onDoubleClick={() => openApp("telecrm")} />
        <DesktopIcon icon={<FileText size={27} />} label="FakeProof" onDoubleClick={() => openApp("fakeproof")} />
        <DesktopIcon icon={<WalletCards size={27} />} label="ShadowWallet" onDoubleClick={() => openApp("wallet")} />
        <DesktopIcon icon={<FileText size={27} />} label="ScamNotes.txt" onDoubleClick={() => openApp("notes")} />
      </div>

      <div className="desktop-hint">
        <span>DOUBLE-CLICK AN APP</span>
        <b>•</b>
        <span>ALL SYSTEMS OPERATIONAL</span>
      </div>

      {openWindows.map((app) => {
        const state = windows[app.id];
        return (
          <Window
            key={app.id}
            {...app.default}
            title={app.title}
            icon={app.icon}
            zIndex={state.zIndex}
            minimized={state.minimized}
            maximized={state.maximized}
            onFocus={() => focusApp(app.id)}
            onMinimize={() => minimizeApp(app.id)}
            onMaximize={() => toggleMax(app.id)}
            onClose={() => closeApp(app.id)}
          >
            {app.id === "telecrm" && <TeleCRM contacts={contacts} onSend={handleSend} />}
            {app.id === "fakeproof" && <FakeProofStudio />}
            {app.id === "wallet" && <ShadowWallet />}
            {app.id === "notes" && <ScamNotes />}
            {app.id === "settings" && <SettingsApp />}
          </Window>
        );
      })}

      {startOpen && (
        <StartMenu onOpen={openApp} onClose={() => setStartOpen(false)} onRestart={resetGame} />
      )}

      <Taskbar
        openWindows={openWindows}
        activeWindow={Object.values(windows).sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))[0]?.id}
        onOpen={openApp}
        onStart={() => setStartOpen((v) => !v)}
        threat={threat}
      />
    </main>
  );
}