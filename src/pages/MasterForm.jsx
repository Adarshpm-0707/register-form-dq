import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Background3D from "../components/Background3D";

const Icons = {
  ArrowLeft: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Check: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
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
  const [step, setStep] = useState(1);
  const [studentCount] = useState(42); 
  const targetDate = new Date("May 20, 2026 09:00:00").getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    course: "",
    campus: "",
    currentYear: "",
    completionYear: ""
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

  const getPriceDetails = () => {
    const now = new Date().getTime();
    if (now > targetDate) return { price: "249 RS", status: "EVENT LIVE RATE" };
    if (studentCount < 50) return { price: "FREE", status: "EARLY BIRD (FIRST 50)" };
    return { price: "49 RS", status: "SPECIAL PRE-EVENT RATE" };
  };

  const { price, status } = getPriceDetails();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Master Sync Submitted:", formData);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050521] text-white selection:bg-[#c6ff34]/30">
      <Background3D />
      <Navbar />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(198,255,52,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,255,52,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent:80%)] pointer-events-none -z-10" />

      {/* Increased Container Size */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-32 md:pt-40 pb-32">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <button 
            onClick={() => navigate("/register")}
            className="flex items-center gap-3 text-white/40 hover:text-[#c6ff34] transition-colors group uppercase text-[10px] md:text-xs font-black tracking-[0.3em]"
          >
            <Icons.ArrowLeft /> Back to Selection
          </button>

          {/* Pricing HUD - Scaled Up */}
          <div className="flex items-center gap-6 bg-white/[0.03] border border-white/10 px-6 py-3 rounded-full backdrop-blur-xl shadow-2xl">
             <div className="flex flex-col">
                <span className="text-[9px] text-[#ff3b3b] font-black uppercase tracking-widest leading-none mb-1.5">{status}</span>
                <span className="text-[#c6ff34] font-black text-sm md:text-xl leading-none">{price}</span>
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

        {/* Progress Header - Scaled Up */}
        <div className="mb-12 md:mb-16">
           <div className="flex items-end justify-between mb-4 md:mb-6">
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                 MASTER <span className="text-[#c6ff34]">CLASS</span>
              </h1>
              <span className="text-[#c6ff34] font-black text-xs md:text-lg bg-[#c6ff34]/10 px-5 py-2 rounded-full border border-[#c6ff34]/20 shadow-2xl">STEP 0{step} / 02</span>
           </div>
           
           <div className="h-2 md:h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: `${(step / 2) * 100}%` }}
                className="h-full bg-[#c6ff34] shadow-[0_0_25px_rgba(198,255,52,0.6)]"
              />
           </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Personal Data */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="p-6 md:p-12 rounded-[32px] md:rounded-[48px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                   <h2 className="text-xl md:text-3xl font-black uppercase mb-8 md:mb-12 flex items-center gap-5 text-[#c6ff34]">
                      Personal Details
                   </h2>
                   
                   <div className="space-y-6 md:space-y-10">
                      <div className="space-y-2 md:space-y-4">
                        <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">Name</label>
                        <input 
                          type="text" name="name" value={formData.name} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-base md:text-2xl"
                          placeholder="Full Name" required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                        <div className="space-y-2 md:space-y-4">
                          <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">Phone Number</label>
                          <input 
                            type="tel" name="phone" value={formData.phone} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-base md:text-2xl"
                            placeholder="+91 00000 00000" required
                          />
                        </div>
                        <div className="space-y-2 md:space-y-4">
                          <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">Mail ID</label>
                          <input 
                            type="email" name="email" value={formData.email} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-base md:text-2xl"
                            placeholder="mail@deepstaq.com" required
                          />
                        </div>
                      </div>
                      <div className="space-y-2 md:space-y-4">
                        <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">Address</label>
                        <textarea 
                          name="address" value={formData.address} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold min-h-[140px] text-base md:text-2xl"
                          placeholder="Your residential address" required
                        />
                      </div>
                   </div>
                </div>
                <button 
                  type="button" onClick={nextStep}
                  className="w-full bg-white text-[#050521] font-black py-5 md:py-8 rounded-2xl md:rounded-[32px] uppercase tracking-[0.4em] text-xs md:text-lg hover:shadow-[0_40px_100px_rgba(198,255,52,0.3)] transition-all active:scale-[0.98]"
                >
                  Continue to Academic Sync
                </button>
              </motion.div>
            )}

            {/* Step 2: Academic Sync */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="p-6 md:p-12 rounded-[32px] md:rounded-[48px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                   <h2 className="text-xl md:text-3xl font-black uppercase mb-8 md:mb-12 flex items-center gap-5 text-[#c6ff34]">
                      Campus Sync
                   </h2>
                   
                   <div className="space-y-6 md:space-y-10">
                      <div className="space-y-2 md:space-y-4">
                        <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">Course</label>
                        <input 
                          type="text" name="course" value={formData.course} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-base md:text-2xl"
                          placeholder="B.Tech / B.Sc / etc." required
                        />
                      </div>
                      <div className="space-y-2 md:space-y-4">
                        <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">Campus</label>
                        <input 
                          type="text" name="campus" value={formData.campus} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-base md:text-2xl"
                          placeholder="College Name" required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                        <div className="space-y-2 md:space-y-4">
                          <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">Year</label>
                          <input 
                            type="text" name="currentYear" value={formData.currentYear} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-base md:text-2xl"
                            placeholder="Current Year (e.g. 3rd)" required
                          />
                        </div>
                        <div className="space-y-2 md:space-y-4">
                          <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">Year of Completion</label>
                          <input 
                            type="text" name="completionYear" value={formData.completionYear} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-base md:text-2xl"
                            placeholder="2026" required
                          />
                        </div>
                      </div>
                   </div>
                </div>
                <div className="flex gap-4 md:gap-8">
                  <button 
                    type="button" onClick={prevStep}
                    className="flex-1 bg-white/5 border border-white/10 text-white font-black py-5 md:py-8 rounded-2xl md:rounded-[32px] uppercase tracking-[0.4em] text-xs md:text-lg hover:bg-white/10 transition-all active:scale-[0.98]"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-[#c6ff34] text-[#050521] font-black py-5 md:py-8 rounded-2xl md:rounded-[32px] uppercase tracking-[0.4em] text-xs md:text-lg shadow-[0_40px_100px_rgba(198,255,52,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    Finalize Sync <Icons.Check />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </form>
      </main>

    </div>
  );
}
