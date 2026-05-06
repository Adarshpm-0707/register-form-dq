// ─────────────────────────────────────────────────────
//  components/SelectField.jsx
// ─────────────────────────────────────────────────────

import React from "react";

function SelectField({ id, label, placeholder, options, value, onChange, error }) {
  return (
    <div className="flex flex-col space-y-1.5 group">
      <label htmlFor={id} className="text-[10px] uppercase tracking-widest font-bold text-white/40 group-focus-within:text-cyan-400 transition-colors">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-cyan-500/50 focus:bg-white/10 focus:ring-4 focus:ring-cyan-500/10 ${error ? 'border-red-500/50 bg-red-500/5' : ''}`}
        >

          <option value="" disabled className="bg-[#0f172a]">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0f172a]">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider pl-1">{error}</span>}
    </div>
  );
}

export default SelectField;
