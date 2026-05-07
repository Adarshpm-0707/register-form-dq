import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI WORKSHOP",
    detail: "MAY 20, 2026",
    icon: "⚡"
  },
  {
    title: "MASTER CLASS",
    detail: "ADVANCED SYNC",
    icon: "🧠"
  }
];

function BottomSF() {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="fixed bottom-0 left-0 w-full z-40 px-3 pb-3 md:px-8 md:pb-6 pointer-events-none"
    >
      <div className="max-w-3xl mx-auto flex flex-row justify-center items-center gap-2 md:gap-4 pointer-events-auto overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5, scale: 1.01 }}
            className="flex-shrink-0 snap-center min-w-[130px] md:flex-1 max-w-[280px] p-2 md:p-3 rounded-xl md:rounded-[24px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl hover:border-[#c6ff34]/50 transition-all flex items-center gap-2 md:gap-4 cursor-pointer group shadow-xl relative overflow-hidden"
          >
            {/* Subtle brand glow on hover */}
            <div className="absolute inset-0 bg-[#c6ff34]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-[#c6ff34]/10 flex items-center justify-center text-sm md:text-xl group-hover:bg-[#c6ff34] group-hover:text-[#050521] transition-all duration-500 shadow-md">
               {feature.icon}
            </div>
            
            <div className="flex flex-col relative z-10">
               <span className="text-[8px] md:text-[11px] font-black text-white uppercase tracking-tighter leading-none mb-0.5 group-hover:text-[#c6ff34] transition-colors">
                  {feature.title}
               </span>
               <span className="text-[6px] md:text-[8px] text-[#c6ff34]/40 font-bold uppercase tracking-[0.1em] leading-none">
                  {feature.detail}
               </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default BottomSF;
