import React, { useMemo, useState } from "react";
import { Paperclip, Send, Search, Phone, MoreHorizontal } from "lucide-react";

export default function TeleCRM({ contacts }) {
  const [selected, setSelected] = useState(contacts[0]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const filtered = useMemo(
    () => contacts.filter((c) => `${c.name} ${c.handle}`.toLowerCase().includes(query.toLowerCase())),
    [contacts, query]
  );

  const send = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  return (
    <div className="telecrm">
      <aside className="tele-sidebar">
        <div className="crm-brand">
          <div className="crm-logo">T</div>
          <div>
            <div className="font-bold">TeleCRM</div>
            <div className="text-[10px] text-cyan-400">v2.4 • SECURE</div>
          </div>
        </div>
        <div className="crm-search">
          <Search size={14} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search contacts" />
        </div>
        <div className="contact-list">
          {filtered.map((contact) => (
            <button
              key={contact.id}
              className={`contact ${selected.id === contact.id ? "selected" : ""}`}
              onClick={() => setSelected(contact)}
            >
              <div className="avatar">{contact.avatar}<i className={contact.online ? "online" : ""} /></div>
              <div className="min-w-0 flex-1 text-left">
                <div className="truncate text-sm font-semibold">{contact.name}</div>
                <div className="truncate text-xs text-slate-500">{contact.handle}</div>
              </div>
              <span className="trust-mini">{contact.trust}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="crm-chat">
        <div className="chat-head">
          <div>
            <div className="font-semibold">{selected.name}</div>
            <div className="text-xs text-emerald-400">{selected.online ? "online" : "offline"}</div>
          </div>
          <div className="flex gap-1">
            <button className="icon-btn"><Phone size={16} /></button>
            <button className="icon-btn"><MoreHorizontal size={17} /></button>
          </div>
        </div>

        <div className="chat-messages">
          <div className="chat-date">TODAY • SESSION #{selected.id}04</div>
          {selected.messages.map((m, i) => (
            <div key={i} className={`message-row ${m.from === "me" ? "mine" : ""}`}>
              <div className="message-bubble">
                <div>{m.text}</div>
                <small>{m.time}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <button className="icon-btn"><Paperclip size={17} /></button>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
          />
          <button className="send-btn" onClick={send}><Send size={15} /></button>
        </div>
      </main>

      <aside className="crm-insights">
        <div className="insight-title">LIVE PROFILE</div>
        <div className="profile-card">
          <div className="avatar large">{selected.avatar}</div>
          <div className="font-semibold">{selected.name}</div>
          <div className="text-xs text-slate-500">{selected.handle}</div>
        </div>
        <Meter label="Trust" value={selected.trust} />
        <Meter label="Emotion" value={selected.emotion} />
        <Meter label="Suspicion" value={selected.suspicion} danger />
        <div className="crm-note">
          <div className="text-[10px] uppercase tracking-widest text-slate-500">AI note</div>
          <p>Keep the conversation calm. Current profile is stable.</p>
        </div>
      </aside>
    </div>
  );
}

function Meter({ label, value, danger }) {
  return (
    <div className="meter">
      <div className="flex justify-between text-xs">
        <span>{label}</span><b>{value}%</b>
      </div>
      <div className="meter-track">
        <div className={`meter-fill ${danger ? "danger" : ""}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}