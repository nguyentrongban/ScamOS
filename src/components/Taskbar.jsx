import React from "react";
import { ShieldAlert, Wifi, Volume2 } from "lucide-react";

export default function Taskbar({ openWindows, activeWindow, onOpen, onStart, threat }) {
  const now = new Date();
  const time = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  return (
    <footer className="taskbar">
      <button className="start-button" onClick={onStart}>
        <span className="scamos-mark">S</span>
        <span className="hidden sm:inline">ScamOS</span>
      </button>

      <div className="taskbar-apps">
        {openWindows.map((app) => (
          <button
            key={app.id}
            className={`taskbar-app ${activeWindow === app.id ? "active" : ""}`}
            onClick={() => onOpen(app.id)}
            title={app.title}
          >
            {app.icon}
            <span className="hidden md:inline">{app.short}</span>
          </button>
        ))}
      </div>

      <div className="taskbar-status">
        <Wifi size={14} />
        <Volume2 size={14} />
        <span className="threat-pill" style={{ color: threat >= 60 ? "#fb7185" : undefined }}>
          <ShieldAlert size={13} />
          Threat {threat}%
        </span>
        <span className="cash-pill">$1,200</span>
        <span className="clock">{time}</span>
      </div>
    </footer>
  );
}
