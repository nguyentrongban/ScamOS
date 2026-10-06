import React, { useEffect, useMemo, useRef, useState } from "react";
import { Paperclip, Send, Search, Phone, MoreHorizontal, Lock } from "lucide-react";
import { getRank } from "../lib/ranks";

export default function TeleCRM({ contacts, stats, onSend }) {
  const [selectedId, setSelectedId] = useState(contacts[0].id);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const endRef = useRef(null);

  const selected = contacts.find((c) => c.id === selectedId) ?? contacts[0];
  const locked = selected.status !== "active";

  const filtered = useMemo(
    () => contacts.filter((c) => `${c.name} ${c.handle}`.toLowerCase().includes(query.toLowerCase())),
    [contacts, query]
  );

  // Chỉ cuộn khung chat xuống cuối. Không dùng scrollIntoView vì nó cuộn cả trang trên iPhone.
  useEffect(() => {
    const box = endRef.current?.parentElement;
    if (box) box.scrollTop = box.scrollHeight;
  }, [selected.messages.length, selected.typing, selectedId]);

  const send = () => {
    const text = message.trim();
    if (!text || locked) return;
    onSend(selected.id, text);
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
              onClick={() => setSelectedId(contact.id)}
            >
              <div className="avatar">{contact.avatar}<i className={contact.online ? "online" : ""} /></div>
              <div className="min-w-0 flex-1 text-left">
                <div className="truncate text-sm font-semibold">{contact.name}</div>
                <div className="truncate text-xs text-slate-500">
                  {contact.status === "active" && contact.handle}
                  {contact.status === "reported" && "🚫 đã báo cáo"}
                  {contact.status === "succeeded" && "✅ đã thành công"}
                </div>
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
            <div className="text-xs text-emerald-400">
              {locked ? "đã kết thúc" : selected.typing ? "đang nhập..." : selected.online ? "online" : "offline"}
            </div>
          </div>
          <div className="flex gap-1">
            <button className="icon-btn" title="Gọi (không khả dụng trong game)"><Phone size={16} /></button>
            <button className="icon-btn"><MoreHorizontal size={17} /></button>
          </div>
        </div>

        <RankBar stats={stats} />

        <div className="chat-meters">
          <MiniMeter label="Trust" value={selected.trust} />
          <MiniMeter label="Emotion" value={selected.emotion} />
          <MiniMeter label="Suspicion" value={selected.suspicion} danger />
        </div>

        <div className="chat-messages">
          <div className="chat-date">TODAY • SESSION #{selected.id}04</div>
          {selected.messages.map((m, i) => {
            if (m.from === "tip") return <div key={i} className="tip-line">💡 {m.text}</div>;
            if (m.from === "summary") return <div key={i} className="summary-box">{m.text}</div>;
            return (
              <div key={i} className={`message-row ${m.from === "me" ? "mine" : ""}`}>
                <div className="message-bubble">
                  <div>{m.text}</div>
                  <small>{m.time}</small>
                </div>
              </div>
            );
          })}
          {selected.typing && (
            <div className="message-row">
              <div className="message-bubble"><small>...</small></div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {locked ? (
          <div className="chat-input justify-center text-xs text-rose-400">
            <Lock size={14} /> &nbsp;Cuộc trò chuyện đã kết thúc
          </div>
        ) : (
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
        )}
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
          <p>{aiNote(selected)}</p>
        </div>
      </aside>
    </div>
  );
}

function aiNote(c) {
  if (c.status !== "active") return "Nạn nhân đã báo cáo. Cuộc trò chuyện bị khóa.";
  if (c.suspicion >= 80) return "Nghi ngờ rất cao. Cân nhắc rút lui hoặc đổi cách tiếp cận.";
  if (c.suspicion >= 50) return "Nạn nhân bắt đầu hỏi lại. Giữ giọng điệu bình tĩnh.";
  if (c.trust >= 70) return "Mức tin tưởng tốt. Cuộc trò chuyện đang ổn định.";
  return "Chưa rõ. Theo dõi phản ứng của nạn nhân.";
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

function MiniMeter({ label, value, danger }) {
  return (
    <div className="mini-meter">
      <div className="mini-meter-label">
        <span>{label}</span><b>{value}%</b>
      </div>
      <div className="meter-track">
        <div className={`meter-fill ${danger ? "danger" : ""}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function RankBar({ stats }) {
  const { current, next, progress } = getRank(stats.success);
  return (
    <div className="rank-bar">
      <div className="rank-row">
        <span>Cấp: <b>{current.name}</b></span>
        <span>✅ {stats.success} &nbsp;🚫 {stats.failed}</span>
      </div>
      <div className="meter-track">
        <div className="meter-fill" style={{ width: `${progress}%` }} />
      </div>
      <small>
        {next ? `Còn ${next.need - stats.success} vụ thành công để lên ${next.name}` : "Bạn đã đạt cấp cao nhất"}
      </small>
    </div>
  );
}
