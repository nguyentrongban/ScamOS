import React from "react";
import { Maximize2, Minimize2, X } from "lucide-react";

export default function Window({
  title,
  icon,
  children,
  x,
  y,
  width,
  height,
  zIndex,
  minimized,
  maximized,
  onFocus,
  onMinimize,
  onMaximize,
  onClose,
  className = ""
}) {
  if (minimized) return null;

  const style = maximized
    ? { zIndex, left: 8, top: 8, width: "calc(100% - 16px)", height: "calc(100% - 70px)" }
    : { zIndex, left: x, top: y, width, height };

  return (
    <section
      className={`window ${maximized ? "window-maximized" : ""} ${className}`}
      style={style}
      onMouseDown={onFocus}
    >
      <header className="window-titlebar" onDoubleClick={onMaximize}>
        <div className="flex min-w-0 items-center gap-2">
          <span className="window-title-icon">{icon}</span>
          <span className="truncate">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="window-control" onClick={onMinimize} aria-label="Minimize">
            <Minimize2 size={14} />
          </button>
          <button className="window-control" onClick={onMaximize} aria-label="Maximize">
            <Maximize2 size={14} />
          </button>
          <button className="window-control close" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>
      </header>
      <div className="window-content">{children}</div>
    </section>
  );
}