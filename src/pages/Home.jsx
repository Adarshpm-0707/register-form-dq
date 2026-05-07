import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Background3D from "../components/Background3D";
import BottomSF from "./BottomSF";

// Premium SVG Icons
const Icons = {
  Star: ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="currentColor"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  Ticket: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
    </svg>
  ),
  Location: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
};

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

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

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds }
  ];

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3 w-full mb-3 md:mb-4">
      {units.map((unit, i) => (
        <div key={i} className="flex flex-col items-center justify-center p-2 md:p-3.5 rounded-xl md:rounded-2xl bg-[#c6ff34]/5 border border-[#c6ff34]/20 backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#c6ff34] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          <span className="text-lg md:text-2xl font-black text-white tabular-nums tracking-tighter">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="text-[7px] md:text-[9px] font-black text-[#c6ff34] uppercase tracking-widest mt-0.5">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050521] text-white selection:bg-[#c6ff34]/30">
      <Background3D />
      <Navbar />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(198,255,52,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,255,52,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none -z-10" />

      {/* Hero Section - Optimized Sizing for Laptop */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-24 md:pt-28 pb-32">
        
        {/* Left Column: Typography */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center lg:items-start"
        >
          <h1 className="text-4xl sm:text-6xl md:text-[4.5rem] lg:text-[5.5rem] font-black leading-[1] tracking-tighter mb-6 md:mb-8 uppercase text-center lg:text-left">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#c6ff34] to-white/60 relative inline-block">
              THE FUTURE 
            </span> 
            <br />
            <span className="text-white">IS AI</span>
          </h1>

          {/* Bottom Statement / AI Diploma Info */}
          <div className="relative group max-w-lg mb-6 md:mb-8">
             <div className="absolute -inset-1 bg-gradient-to-r from-[#c6ff34]/20 to-transparent rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative p-4 md:p-5 rounded-2xl bg-white/[0.02] border-l-4 border-[#c6ff34] backdrop-blur-3xl shadow-[0_0_30px_rgba(198,255,52,0.05)]">
                <p className="text-white font-black text-base md:text-lg tracking-tight leading-snug mb-2 md:mb-3 uppercase">
                   No background in tech? <span className="text-[#c6ff34]">No problem.</span>
                </p>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">
                   The <span className="text-white font-bold">AI/ML diploma by Deepstaq</span> is built for fresher students and beginners in AI. 
                   Learn by doing, graduate with a project portfolio.
                </p>
             </div>
          </div>
        </motion.div>


        {/* Right Column: Timer & Ticket Visuals */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center lg:items-end justify-center relative w-full"
        >
          {/* HUD Header */}
          <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[450px] mb-2 md:mb-3 flex items-center justify-between px-2">
             <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#c6ff34] animate-pulse" />
                <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#c6ff34]">Live_Countdown</span>
             </div>
          </div>

          {/* Countdown Timer Component */}
          <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[450px]">
            <CountdownTimer targetDate="May 20, 2026 09:00:00" />
          </div>

          {/* Date and Time Info Row */}
          <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[450px] mb-5 md:mb-6 flex flex-col md:flex-row gap-2 md:gap-3">
             <div className="flex-1 p-2 md:p-4 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl flex items-center gap-2 md:gap-3 group">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-[#c6ff34]/10 flex items-center justify-center text-[#c6ff34] group-hover:scale-110 transition-transform">
                   <Icons.Calendar />
                </div>
                <div>
                   <p className="text-[9px] md:text-xs font-black text-white uppercase tracking-wider">May 20th</p>
                   <p className="text-[7px] md:text-[9px] text-[#c6ff34]/60 font-bold tracking-[0.1em] uppercase">EVENT_DATE</p>
                </div>
             </div>
             <div className="flex-1 p-2 md:p-4 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl flex items-center gap-2 md:gap-3 group">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-[#c6ff34]/10 flex items-center justify-center text-[#c6ff34] group-hover:scale-110 transition-transform">
                   <Icons.Clock />
                </div>
                <div>
                   <p className="text-[9px] md:text-xs font-black text-white uppercase tracking-wider">09:00 AM</p>
                   <p className="text-[7px] md:text-[9px] text-[#c6ff34]/60 font-bold tracking-[0.1em] uppercase">LAUNCH_TIME</p>
                </div>
             </div>
          </div>

        </motion.div>
      </main>

      {/* Bottom Section - Home Page Only */}
      <BottomSF />
    </div>
  );
}