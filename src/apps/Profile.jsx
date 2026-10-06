import React from "react";
import { getRank } from "../lib/ranks";
import { detectFlags } from "../lib/hints";

const FLAG_LABELS = {
  urgency: "Tạo áp lực thời gian",
  sensitive: "Hỏi thông tin cá nhân hoặc tiền",
  authority: "Tự xưng là tổ chức"
};

const STATUS_LABELS = {
  active: "đang trò chuyện",
  reported: "đã báo cáo",
  succeeded: "đã thành công"
};

export default function Profile({ name, stats, contacts }) {
  const rank = getRank(stats.success);
  const decided = stats.success + stats.failed;
  const winRate = decided ? Math.round((stats.success / decided) * 100) : 0;

  const mySentMessages = contacts.flatMap((c) => c.messages.filter((m) => m.from === "me"));
  const conversations = contacts.filter((c) => c.messages.some((m) => m.from === "me")).length;

  const flagCounts = { urgency: 0, sensitive: 0, authority: 0 };
  mySentMessages.forEach((m) => detectFlags(m.text).forEach((k) => flagCounts[k]++));

  return (
    <div className="profile-app">
      <div className="profile-head">
        <div className="profile-avatar large">{(name || "?").charAt(0).toUpperCase()}</div>
        <div>
          <div className="profile-name">{name}</div>
          <div className="profile-rank">Cấp: {rank.current.name}</div>
        </div>
      </div>

      <div className="profile-grid">
        <Tile label="Thành công" value={stats.success} />
        <Tile label="Thất bại" value={stats.failed} />
        <Tile label="Tỷ lệ thành công" value={`${winRate}%`} />
        <Tile label="Tin đã gửi" value={mySentMessages.length} />
        <Tile label="Cuộc trò chuyện" value={conversations} />
      </div>

      <div className="profile-section">
        <div className="profile-title">Dấu hiệu đã dùng</div>
        {Object.keys(FLAG_LABELS).map((k) => (
          <div key={k} className="profile-row">
            <span>{FLAG_LABELS[k]}</span>
            <b>{flagCounts[k]} lần</b>
          </div>
        ))}
      </div>

      <div className="profile-section">
        <div className="profile-title">Theo từng nạn nhân</div>
        {contacts.map((c) => (
          <div key={c.id} className="profile-row">
            <span>
              {c.name} <small>({STATUS_LABELS[c.status] ?? c.status})</small>
            </span>
            <small>Tin {c.trust} • Nghi {c.suspicion}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function Tile({ label, value }) {
  return (
    <div className="profile-tile">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}
