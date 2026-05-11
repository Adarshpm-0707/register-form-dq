import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const distance = new Date(targetDate).getTime() - new Date().getTime();
      if (distance < 0) {
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-2 tabular-nums">
      <span className="text-[#c6ff34] font-black text-[10px] md:text-lg">{timeLeft.days}D</span>
      <span className="text-white/20">/</span>
      <span className="text-[#c6ff34] font-black text-[10px] md:text-lg">{timeLeft.hours}H</span>
      <span className="text-white/20">/</span>
      <span className="text-[#c6ff34] font-black text-[10px] md:text-lg">{timeLeft.minutes}M</span>
    </div>
  );
};

function BottomSF() {
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 w-full z-50 bg-[#050521]/80 backdrop-blur-2xl border-t border-white/10"
    >
      <div className="flex h-20 md:h-32 w-full">
        
        {/* Left Section: Event */}
        <Link 
          to="/event-form"
          className="flex-1 border-r border-white/10 px-4 md:px-12 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#c6ff34]/10 flex items-center justify-center text-xl md:text-3xl text-[#c6ff34]">
              ⚡
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xl font-black text-white uppercase tracking-tighter leading-none mb-1">
                AI WORKSHOP
              </span>
              <span className="text-[7px] md:text-xs text-[#c6ff34]/60 font-bold uppercase tracking-widest">
                MAY 20, 2026
              </span>
            </div>
          </div>
          <div className="hidden sm:block">
            <Countdown targetDate="May 20, 2026 09:00:00" />
          </div>
        </Link>

        {/* Right Section: Master Class */}
        <Link 
          to="/master-form"
          className="flex-1 px-4 md:px-12 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#c6ff34]/10 flex items-center justify-center text-xl md:text-3xl text-[#c6ff34]">
              🧠
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xl font-black text-white uppercase tracking-tighter leading-none mb-1">
                MASTER CLASS
              </span>
              <span className="text-[7px] md:text-xs text-[#c6ff34]/60 font-bold uppercase tracking-widest">
                MAY 25, 2026
              </span>
            </div>
          </div>
          <div className="hidden sm:block">
            <Countdown targetDate="May 25, 2026 09:00:00" />
          </div>
        </Link>

      </div>
    </motion.div>
  );
}

export default BottomSF;
