import React from "react";

export default function DesktopIcon({ icon, label, onDoubleClick }) {
  return (
    <button
      className="desktop-icon group"
      onDoubleClick={onDoubleClick}
      title={`Mở ${label}`}
    >
      <div className="desktop-icon-box">
        {icon}
      </div>
      <span>{label}</span>
    </button>
  );
}