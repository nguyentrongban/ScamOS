import React from "react";
import { Power, RotateCcw, Settings, Volume2, UserRound, Search } from "lucide-react";

export default function StartMenu({ onOpen, onClose, onRestart, profileName = "Operator" }) {
  return (
    <div className="start-menu" onMouseDown={(e) => e.stopPropagation()}>
      <button className="start-profile" onClick={() => onOpen("profile")}>
        <div className="profile-avatar">{profileName.charAt(0).toUpperCase()}</div>
        <div className="text-left">
          <div className="font-semibold">{profileName}</div>
          <div className="text-xs text-slate-500">Nhấn để xem tài khoản</div>
        </div>
      </button>

      <div className="start-search">
        <Search size={15} />
        <input placeholder="Search apps..." />
      </div>

      <div className="start-grid">
        <button onClick={() => onOpen("telecrm")}><span>💬</span>TeleCRM</button>
        <button onClick={() => onOpen("fakeproof")}><span>🧾</span>FakeProof</button>
        <button onClick={() => onOpen("wallet")}><span>💳</span>ShadowWallet</button>
        <button onClick={() => onOpen("notes")}><span>📝</span>ScamNotes</button>
      </div>

      <div className="start-bottom">
        <button><Volume2 size={15} /> Sound</button>
        <button onClick={() => onOpen("settings")}><Settings size={15} /> Settings</button>
        <button onClick={onRestart}><RotateCcw size={15} /> Restart Game</button>
        <button onClick={onClose}><Power size={15} /> Exit</button>
      </div>
    </div>
  );
}