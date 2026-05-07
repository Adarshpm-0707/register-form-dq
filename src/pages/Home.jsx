import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Background3D from "../components/Background3D";
import BottomSF from "./BottomSF";

// Premium SVG Icons
const Icons = {
  Star: ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <div className="grid grid-cols-4 gap-3 md:gap-4 w-full">
      {units.map((unit, i) => (
        <div key={i} className="flex flex-col items-center justify-center p-3 md:p-6 rounded-xl md:rounded-[32px] bg-[#ff3b3b]/5 border border-[#ff3b3b]/20 backdrop-blur-3xl relative overflow-hidden group shadow-xl">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#ff3b3b] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          <span className="text-xl md:text-3xl font-black text-[#ff3b3b] tabular-nums tracking-tighter leading-none mb-1 md:mb-2">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="text-[8px] md:text-[10px] font-black text-[#ff3b3b]/60 uppercase tracking-[0.2em]">
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

      {/* Hero Content Wrapper */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 pt-24 md:pt-32 pb-48">
        
        {/* Top Section: Title (Left) and Description (Right) for Laptop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12 md:mb-16">
          
          {/* Title Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-start"
          >
            <h1 className="text-4xl sm:text-6xl md:text-[6rem] lg:text-[7rem] xl:text-[8rem] font-black leading-[0.9] tracking-tighter uppercase text-center lg:text-left">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#c6ff34] to-white/60 relative inline-block">
                THE FUTURE 
              </span> 
              <br />
              <span className="text-white">IS AI</span>
            </h1>
          </motion.div>

          {/* Description Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative group max-w-lg mx-auto lg:mx-0"
          >
             <div className="absolute -inset-1 bg-gradient-to-r from-[#c6ff34]/20 to-transparent rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative p-5 md:p-8 rounded-[28px] md:rounded-[40px] bg-white/[0.02] border-l-4 border-[#c6ff34] backdrop-blur-3xl shadow-2xl">
                <p className="text-white font-black text-lg md:text-2xl tracking-tight leading-snug mb-3 md:mb-4 uppercase">
                   No background in tech? <span className="text-[#c6ff34]">No problem.</span>
                </p>
                <p className="text-slate-400 text-xs md:text-lg leading-relaxed font-medium">
                   The <span className="text-white font-bold">AI/ML diploma by Deepstaq</span> is built for fresher students and beginners in AI. 
                   Learn by doing, graduate with a project portfolio.
                </p>
             </div>
          </motion.div>
        </div>

        {/* Bottom Section: Timer and Info Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center w-full"
        >
          {/* HUD Header */}
          <div className="w-full max-w-[500px] mb-4 md:mb-6 flex items-center justify-between px-4">
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff3b3b] animate-pulse" />
                <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.4em] text-[#ff3b3b]">Live_Countdown</span>
             </div>
          </div>

          {/* Countdown Timer */}
          <div className="w-full max-w-4xl mb-8 md:mb-12">
            <CountdownTimer targetDate="May 20, 2026 09:00:00" />
          </div>

          {/* Info Cards Row */}
          <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4 md:gap-6">
             <div className="flex-1 p-5 md:p-8 rounded-2xl md:rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl flex items-center justify-center gap-4 md:gap-8 group shadow-xl">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[24px] bg-[#c6ff34]/10 flex items-center justify-center text-[#c6ff34] group-hover:scale-110 transition-transform">
                   <Icons.Calendar className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                   <p className="text-base md:text-3xl font-black text-white uppercase tracking-wider">May 20th</p>
                   <p className="text-[8px] md:text-[10px] text-[#c6ff34]/60 font-bold tracking-[0.2em] uppercase mt-1">EVENT_DATE</p>
                </div>
             </div>
             <div className="flex-1 p-5 md:p-8 rounded-2xl md:rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl flex items-center justify-center gap-4 md:gap-8 group shadow-xl">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[24px] bg-[#c6ff34]/10 flex items-center justify-center text-[#c6ff34] group-hover:scale-110 transition-transform">
                   <Icons.Clock className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                   <p className="text-base md:text-3xl font-black text-white uppercase tracking-wider">09:00 AM</p>
                   <p className="text-[8px] md:text-[10px] text-[#c6ff34]/60 font-bold tracking-[0.2em] uppercase mt-1">LAUNCH_TIME</p>
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