// ─────────────────────────────────────────────────────
//  components/TextAreaField.jsx
// ─────────────────────────────────────────────────────

import React from "react";

function TextAreaField({ id, label, placeholder, value, onChange, error }) {
  return (
    <div className="flex flex-col space-y-1.5 group">
      <label htmlFor={id} className="text-[10px] uppercase tracking-widest font-bold text-white/40 group-focus-within:text-cyan-400 transition-colors">
        {label}
      </label>
      <textarea
        id={id}
        rows={3}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all resize-none focus:border-cyan-500/50 focus:bg-white/10 focus:ring-4 focus:ring-cyan-500/10 ${error ? 'border-red-500/50 bg-red-500/5' : ''}`}
      />

      {error && <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider pl-1">{error}</span>}
    </div>
  );
}

export default TextAreaField;
