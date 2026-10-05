import React, { useState } from "react";
import { ArrowDownToLine, Coins, Droplets } from "lucide-react";

export default function ShadowWallet() {
  const [wash, setWash] = useState(40);
  const dirty = 5000;
  const clean = 1200;
  const estimated = Math.round(dirty * (wash / 100) * 0.72);

  return (
    <div className="wallet-app">
      <div className="wallet-balance dirty">
        <div className="balance-icon"><Coins size={18} /></div>
        <div><small>DIRTY CASH</small><strong>${dirty.toLocaleString()}</strong></div>
      </div>
      <div className="wallet-balance clean">
        <div className="balance-icon"><Droplets size={18} /></div>
        <div><small>CLEAN CRYPTO</small><strong>${clean.toLocaleString()}</strong></div>
      </div>

      <div className="wash-panel">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Wash Simulator</div>
            <div className="text-xs text-slate-500">Fictional game economy</div>
          </div>
          <span className="wash-percent">{wash}%</span>
        </div>
        <input className="wash-slider" type="range" min="0" max="100" value={wash} onChange={(e) => setWash(Number(e.target.value))} />
        <div className="flex justify-between text-xs text-slate-500"><span>Low</span><span>High</span></div>
        <div className="estimate"><span>Estimated clean</span><b>${estimated.toLocaleString()}</b></div>
        <button className="wash-btn"><ArrowDownToLine size={15} /> PUMP &amp; WASH</button>
      </div>
    </div>
  );
}