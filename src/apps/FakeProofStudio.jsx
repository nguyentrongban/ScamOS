import React, { useState } from "react";
import { FileText, Sparkles } from "lucide-react";

export default function FakeProofStudio() {
  const [bank, setBank] = useState("VietBank");
  const [amount, setAmount] = useState("12,500,000");
  const [recipient, setRecipient] = useState("NGUYEN MINH");
  const [rendered, setRendered] = useState(false);

  return (
    <div className="fakeproof">
      <aside className="proof-controls">
        <div className="app-heading"><span className="app-symbol">FP</span><div><b>FakeProof Studio</b><small>visual mockup lab</small></div></div>

        <label>Bank</label>
        <select value={bank} onChange={(e) => setBank(e.target.value)}>
          <option>VietBank</option>
          <option>Global Trust</option>
          <option>Metro Finance</option>
        </select>

        <label>Amount</label>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} />

        <label>Recipient</label>
        <input value={recipient} onChange={(e) => setRecipient(e.target.value)} />

        <button className="primary-btn" onClick={() => setRendered(true)}>
          <Sparkles size={15} /> Render Bill
        </button>

        <div className="warning-box">
          <FileText size={15} />
          <span>Game-only visual prop. No real banking connection.</span>
        </div>
      </aside>

      <div className="proof-preview">
        <div className="preview-label">PREVIEW</div>
        <div className="bill">
          <div className="bill-top">
            <b>{bank}</b>
            <span>TRANSFER RECEIPT</span>
          </div>
          <div className="bill-line" />
          <div className="bill-status">{rendered ? "PROCESSING COMPLETE" : "DRAFT PREVIEW"}</div>
          <div className="bill-amount">{amount} ₫</div>
          <div className="bill-meta">
            <span>RECIPIENT</span><b>{recipient}</b>
            <span>REFERENCE</span><b>SCM-{Math.floor(100000 + Math.random() * 899999)}</b>
            <span>DATE</span><b>05 OCT 2026</b>
          </div>
          <div className="bill-footer">SCAMOS GAME PROP • NOT A REAL FINANCIAL DOCUMENT</div>
        </div>
      </div>
    </div>
  );
}