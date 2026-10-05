import React, { useState } from "react";
import {
  Archive, FileText, HardDrive, MessageCircle, Recycle, WalletCards,
  FolderOpen, Terminal, Shield, Monitor
} from "lucide-react";
import DesktopIcon from "./components/DesktopIcon";
import Taskbar from "./components/Taskbar";
import StartMenu from "./components/StartMenu";
import Window from "./components/Window";
import TeleCRM from "./apps/TeleCRM";
import FakeProofStudio from "./apps/FakeProofStudio";
import ShadowWallet from "./apps/ShadowWallet";
import ScamNotes from "./apps/ScamNotes";
import { contacts } from "./data/contacts";

const APPS = {
  telecrm: { id: "telecrm", title: "TeleCRM v2.4", short: "TeleCRM", icon: <MessageCircle size={15} />, default: { x: 160, y: 52, width: 780, height: 510 } },
  fakeproof: { id: "fakeproof", title: "FakeProof Studio", short: "FakeProof", icon: <FileText size={15} />, default: { x: 680, y: 100, width: 510, height: 500 } },
  wallet: { id: "wallet", title: "ShadowWallet", short: "Wallet", icon: <WalletCards size={15} />, default: { x: 40, y: 105, width: 430, height: 450 } },
  notes: { id: "notes", title: "ScamNotes.txt", short: "Notes", icon: <FileText size={15} />, default: { x: 350, y: 390, width: 550, height: 330 } }
};

export default function App() {
  const [windows, setWindows] = useState({});
  const [zCounter, setZCounter] = useState(10);
  const [startOpen, setStartOpen] = useState(false);

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
            {app.id === "telecrm" && <TeleCRM contacts={contacts} />}
            {app.id === "fakeproof" && <FakeProofStudio />}
            {app.id === "wallet" && <ShadowWallet />}
            {app.id === "notes" && <ScamNotes />}
          </Window>
        );
      })}

      {startOpen && (
        <StartMenu onOpen={openApp} onClose={() => setStartOpen(false)} />
      )}

      <Taskbar
        openWindows={openWindows}
        activeWindow={Object.values(windows).sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))[0]?.id}
        onOpen={openApp}
        onStart={() => setStartOpen((v) => !v)}
      />
    </main>
  );
}