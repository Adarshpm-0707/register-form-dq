import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Background3D from "../components/Background3D";

// Selection Icons
const Icons = {
  Event: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
    </svg>
  ),
  MasterClass: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  )
};

function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050521] text-white selection:bg-[#c6ff34]/30">
      <Background3D />
      <Navbar />
      
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(198,255,52,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,255,52,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none -z-10" />

      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-24 md:pt-32 pb-24 text-center">
        
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
           
            <p className="text-slate-400 font-bold tracking-[0.2em] md:tracking-[0.4em] text-[8px] md:text-xs uppercase">
               Select your journey sequence
            </p>
          </motion.div>
        </div>

        {/* 2 Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Card 1: Event */}
          <motion.div 
            whileHover={{ y: -8, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/event-form")}
            className="cursor-pointer group relative p-6 sm:p-8 md:p-10 rounded-[30px] md:rounded-[40px] border bg-white/[0.02] border-white/10 hover:border-[#c6ff34] transition-all duration-500 text-left overflow-hidden"
          >
            {/* Subtle Gradient Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c6ff34]/5 blur-[60px] rounded-full group-hover:bg-[#c6ff34]/10 transition-colors" />
            
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 bg-white/5 text-white group-hover:bg-[#c6ff34] group-hover:text-[#050521] transition-all duration-500 shadow-xl relative z-10">
              <Icons.Event />
            </div>
            
            <h3 className="text-xl sm:text-2xl md:text-4xl font-black uppercase mb-3 md:mb-4 tracking-tight group-hover:text-[#c6ff34] transition-colors relative z-10">
              Main Event
            </h3>
            
            <p className="text-slate-400 text-xs sm:text-sm md:text-lg leading-relaxed mb-6 md:mb-8 font-medium relative z-10">
              Join the Aiwaken One Day AI Workshop. Experience hands-on sessions and industry-leading insights.
            </p>
            
            <div className="flex items-center gap-3 text-[12px] md:text-sm font-black uppercase tracking-[0.2em] text-[#c6ff34] relative z-10">
              free booking <Icons.ArrowRight />
            </div>
          </motion.div>

          {/* Card 2: Master Class */}
          <motion.div 
            whileHover={{ y: -8, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/master-form")}
            className="cursor-pointer group relative p-6 sm:p-8 md:p-10 rounded-[30px] md:rounded-[40px] border bg-white/[0.02] border-white/10 hover:border-[#c6ff34] transition-all duration-500 text-left overflow-hidden"
          >
            {/* Subtle Gradient Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c6ff34]/5 blur-[60px] rounded-full group-hover:bg-[#c6ff34]/10 transition-colors" />
            
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 bg-white/5 text-white group-hover:bg-[#c6ff34] group-hover:text-[#050521] transition-all duration-500 shadow-xl relative z-10">
              <Icons.MasterClass />
            </div>
            
            <h3 className="text-xl sm:text-2xl md:text-4xl font-black uppercase mb-3 md:mb-4 tracking-tight group-hover:text-[#c6ff34] transition-colors relative z-10">
              Master Class
            </h3>
            
            <p className="text-slate-400 text-xs sm:text-sm md:text-lg leading-relaxed mb-6 md:mb-8 font-medium relative z-10">
              Deep-dive into advanced AI/ML architectures. Built for those ready to architect the future of tech.
            </p>
            
            <div className="flex items-center gap-3 text-[12px] md:text-sm font-black uppercase tracking-[0.1em] text-[#c6ff34] relative z-10">
              <span className="line-through opacity-40">249 RS</span> OFF TO 49 RS <Icons.ArrowRight />
            </div>
          </motion.div>
        </div>
      </main>

    </div>
  );
}

export default Register;
