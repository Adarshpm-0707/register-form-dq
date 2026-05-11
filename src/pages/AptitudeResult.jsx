import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Background3D from "../components/Background3D";
import Navbar from "../components/Navbar";

const Icons = {
  Trophy: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V8a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v14"/><path d="M4.5 9.5c0 3.5 2.5 6.5 5.5 6.5s5.5-3 5.5-6.5"/>
    </svg>
  ),
  Check: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Users: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
};

export default function AptitudeResult() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("test_result");
    if (!data) {
      navigate("/aptitude-test");
      return;
    }
    setResult(JSON.parse(data));
    
    // Clear the lead ID so they can't retake immediately by just refreshing
    // localStorage.removeItem("aptitude_lead_id");
  }, [navigate]);

  if (!result) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050521] text-white selection:bg-[#c6ff34]/30">
      <Background3D />
      <Navbar />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(198,255,52,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,255,52,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent:80%)] pointer-events-none -z-10" />

      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-32 md:pt-48 pb-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 md:p-16 rounded-[40px] md:rounded-[64px] bg-white/[0.02] border border-[#c6ff34]/30 backdrop-blur-3xl text-center shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#c6ff34]/10 blur-[100px] pointer-events-none" />

          <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-[#c6ff34] text-[#050521] flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(198,255,52,0.4)] relative z-10">
            <Icons.Trophy className="w-10 h-10 md:w-16 md:h-16" />
          </div>

          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4">
            Test <span className="text-[#c6ff34]">Successfully</span> Completed
          </h1>
          <p className="text-slate-400 text-sm md:text-xl font-bold tracking-widest uppercase mb-12">
            Uplink Established • Performance Sync Complete
          </p>

          <div className="grid grid-cols-2 gap-4 md:gap-8 mb-12 max-w-2xl mx-auto">
            <div className="p-6 md:p-10 rounded-3xl bg-white/5 border border-white/10">
              <p className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-2">Final Score</p>
              <p className="text-3xl md:text-6xl font-black text-[#c6ff34]">{result.score}/{result.total}</p>
            </div>
            <div className="p-6 md:p-10 rounded-3xl bg-white/5 border border-white/10">
              <p className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-2">Accuracy</p>
              <p className="text-3xl md:text-6xl font-black text-white">{result.accuracy}%</p>
            </div>
          </div>

          <div className="space-y-4 max-w-lg mx-auto">
            <motion.a 
              whileHover={{ scale: 1.02, y: -2 }} 
              whileTap={{ scale: 0.98 }} 
              href="https://chat.whatsapp.com/Fz2kFuB282EJKEddr2GxIv"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-5 md:py-8 bg-[#c6ff34] text-[#050521] font-black text-xs md:text-xl uppercase tracking-widest rounded-2xl md:rounded-[32px] flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(198,255,52,0.3)] transition-all"
            >
              <Icons.Users className="w-5 h-5 md:w-7 md:h-7" />
              Join Our Community
            </motion.a>

            <button 
              onClick={() => navigate("/")}
              className="w-full py-4 md:py-6 bg-white/5 border border-white/10 text-white/60 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] rounded-2xl md:rounded-[24px] hover:bg-white/10 transition-all"
            >
              Terminate & Return Home
            </button>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
