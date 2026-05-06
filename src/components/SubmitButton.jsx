// ─────────────────────────────────────────────────────
//  components/SubmitButton.jsx
//  Futuristic Cyber-Tech Submit Button - Responsive
// ─────────────────────────────────────────────────────

import React from "react";
import Loader from "./Loader";

function SubmitButton({ isLoading, label = "Submit" }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="group relative w-full h-12 sm:h-14 overflow-hidden rounded-xl sm:rounded-2xl bg-cyan-500 font-black tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-sm text-[#020617] uppercase transition-all duration-300 hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] active:scale-95 disabled:opacity-50 disabled:scale-100"
    >
      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] transition-transform duration-500 group-hover:translate-x-[100%] skew-x-[-20deg]" />
      
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader size="w-4 h-4 sm:w-5 h-5" color="border-[#020617]" />
          <span>Processing</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span>{label}</span>
          <svg className="w-4 h-4 sm:w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      )}

      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-[#020617] m-1.5 opacity-50" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-[#020617] m-1.5 opacity-50" />
    </button>
  );
}

export default SubmitButton;
