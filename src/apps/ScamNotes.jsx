import React, { useState } from "react";

const initialNotes = `SCAMOS FIELD NOTES

• Keep messages short and readable.
• Watch the Trust / Emotion / Suspicion meters.
• Don't overload the target with information.
• Higher suspicion increases Threat Level.
• Use the desktop apps as gameplay tools.

SESSION REMINDER
Build trust. Manage risk. Get out before detection.

[FICTIONAL GAME DATA ONLY]`;

export default function ScamNotes() {
  const [notes, setNotes] = useState(initialNotes);
  return (
    <div className="notes-app">
      <div className="notes-toolbar">ScamNotes.txt <span>• autosave</span></div>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} spellCheck={false} />
      <div className="notes-status">UTF-8 • {notes.length} chars</div>
    </div>
  );
}