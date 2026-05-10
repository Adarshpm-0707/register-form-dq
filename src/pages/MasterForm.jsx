import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Background3D from "../components/Background3D";

const Icons = {
  ArrowLeft: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Clock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
};

export default function MasterForm() {
  const navigate = useNavigate();
  const targetDate = new Date("May 25, 2026 09:00:00").getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050521] text-white selection:bg-[#c6ff34]/30">
      <Background3D />
      <Navbar />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(198,255,52,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,255,52,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent:80%)] pointer-events-none -z-10" />

      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-32 md:pt-40 pb-32">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <button 
            onClick={() => navigate("/register")}
            className="flex items-center gap-3 text-white/40 hover:text-[#c6ff34] transition-colors group uppercase text-[10px] md:text-xs font-black tracking-[0.3em]"
          >
            <Icons.ArrowLeft /> Back to Selection
          </button>

          {/* Locked HUD */}
          <div className="flex items-center gap-6 bg-white/[0.03] border border-white/10 px-6 py-3 rounded-full backdrop-blur-xl shadow-2xl">
             <div className="flex flex-col">
                <span className="text-[9px] text-[#ff3b3b] font-black uppercase tracking-widest leading-none mb-1.5">STATUS</span>
                <span className="text-[#ff3b3b] font-black text-sm md:text-xl leading-none uppercase">Locked</span>
             </div>
             <div className="w-[1px] h-8 bg-white/10" />
             <div className="flex items-center gap-3">
                <Icons.Clock className="text-[#ff3b3b]" />
                <span className="text-xs md:text-lg font-black tabular-nums text-[#ff3b3b]">
                  {timeLeft.days}D:{timeLeft.hours}H:{timeLeft.minutes}M
                </span>
             </div>
          </div>
        </div>

       {/* Progress Header - HIDDEN FOR LOCKED STATE */}
        <div className="mb-12 md:mb-16">
           <div className="flex items-end justify-between mb-4 md:mb-6">
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                 MASTER <span className="text-[#c6ff34]">CLASS</span>
              </h1>
              <span className="text-[#ff3b3b] font-black text-xs md:text-lg bg-[#ff3b3b]/10 px-5 py-2 rounded-full border border-[#ff3b3b]/20 shadow-2xl uppercase tracking-widest">Locked</span>
           </div>
           
           <div className="h-2 md:h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full w-full bg-[#ff3b3b]/20" />
           </div>
        </div>

        <div className="relative">
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="p-12 md:p-20 rounded-[48px] bg-white/[0.02] border border-[#ff3b3b]/30 backdrop-blur-3xl text-center space-y-8"
           >
              <div className="w-24 h-24 rounded-full bg-[#ff3b3b]/10 text-[#ff3b3b] flex items-center justify-center mx-auto border border-[#ff3b3b]/20 shadow-[0_0_50px_rgba(255,59,59,0.1)]">
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                 </svg>
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Access <span className="text-[#ff3b3b]">Restricted</span></h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-lg mx-auto">Registration for this Master Class has been closed by the administrator. Please join our main event for future updates.</p>
              
              <button 
                onClick={() => navigate("/")}
                className="inline-block bg-white/5 border border-white/10 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
              >
                Back to Home
              </button>
           </motion.div>
        </div>
      </main>
    </div>
  );
}
