import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Background3D from "../components/Background3D";

const Icons = {
  ArrowLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Check: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
};

export default function MasterForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(198,255,52,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,255,52,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none -z-10" />

      <main className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-24">
        
        <button 
          onClick={() => navigate("/register")}
          className="flex items-center gap-2 text-white/40 hover:text-[#c6ff34] transition-colors mb-6 md:mb-8 group uppercase text-[9px] md:text-[10px] font-black tracking-widest"
        >
          <Icons.ArrowLeft /> Back to Selection
        </button>

        <div className="mb-8 md:mb-12">
           <div className="flex items-end justify-between mb-3 md:mb-4">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                 MASTER <span className="text-[#c6ff34]">SYNC</span>
              </h1>
              <span className="text-[#c6ff34] font-black text-[10px] md:text-sm bg-[#c6ff34]/10 px-3 py-1 rounded-full">STEP 0{step} / 02</span>
           </div>
           
           <div className="h-1 md:h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: `${(step / 2) * 100}%` }}
                className="h-full bg-[#c6ff34] shadow-[0_0_15px_rgba(198,255,52,0.5)]"
              />
           </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Personal Data */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 md:space-y-6"
              >
                <div className="p-5 md:p-8 rounded-[24px] md:rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl">
                   <h2 className="text-lg md:text-xl font-black uppercase mb-6 md:mb-8 flex items-center gap-3 text-[#c6ff34]">
                      Personal Details
                   </h2>
                   
                   <div className="space-y-4 md:space-y-6">
                      <div className="space-y-1.5 md:space-y-2">
                        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Name</label>
                        <input 
                          type="text" name="name" value={formData.name} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-5 py-3.5 md:px-6 md:py-4 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-base"
                          placeholder="Full Name" required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 md:space-y-2">
                          <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Phone Number</label>
                          <input 
                            type="tel" name="phone" value={formData.phone} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-5 py-3.5 md:px-6 md:py-4 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-base"
                            placeholder="+91 00000 00000" required
                          />
                        </div>
                        <div className="space-y-1.5 md:space-y-2">
                          <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Mail ID</label>
                          <input 
                            type="email" name="email" value={formData.email} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-5 py-3.5 md:px-6 md:py-4 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-base"
                            placeholder="mail@deepstaq.com" required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5 md:space-y-2">
                        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Address</label>
                        <textarea 
                          name="address" value={formData.address} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-5 py-3.5 md:px-6 md:py-4 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold min-h-[80px] text-sm md:text-base"
                          placeholder="Your residential address" required
                        />
                      </div>
                   </div>
                </div>
                <button 
                  type="button" onClick={nextStep}
                  className="w-full bg-white text-[#050521] font-black py-4 md:py-5 rounded-xl md:rounded-2xl uppercase tracking-widest text-[10px] md:text-xs hover:shadow-[0_20px_50px_rgba(198,255,52,0.2)] transition-all active:scale-[0.98]"
                >
                  Continue to Academic Sync
                </button>
              </motion.div>
            )}

            {/* Step 2: Academic Sync */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 md:space-y-6"
              >
                <div className="p-5 md:p-8 rounded-[24px] md:rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl">
                   <h2 className="text-lg md:text-xl font-black uppercase mb-6 md:mb-8 flex items-center gap-3 text-[#c6ff34]">
                      Campus Sync
                   </h2>
                   
                   <div className="space-y-4 md:space-y-6">
                      <div className="space-y-1.5 md:space-y-2">
                        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Course</label>
                        <input 
                          type="text" name="course" value={formData.course} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-5 py-3.5 md:px-6 md:py-4 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-base"
                          placeholder="B.Tech / B.Sc / etc." required
                        />
                      </div>
                      <div className="space-y-1.5 md:space-y-2">
                        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Campus</label>
                        <input 
                          type="text" name="campus" value={formData.campus} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-5 py-3.5 md:px-6 md:py-4 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-base"
                          placeholder="College Name" required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 md:space-y-2">
                          <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Year</label>
                          <input 
                            type="text" name="currentYear" value={formData.currentYear} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-5 py-3.5 md:px-6 md:py-4 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-base"
                            placeholder="Current Year (e.g. 3rd)" required
                          />
                        </div>
                        <div className="space-y-1.5 md:space-y-2">
                          <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Year of Completion</label>
                          <input 
                            type="text" name="completionYear" value={formData.completionYear} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-5 py-3.5 md:px-6 md:py-4 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-base"
                            placeholder="2026" required
                          />
                        </div>
                      </div>
                   </div>
                </div>
                <div className="flex gap-3 md:gap-4">
                  <button 
                    type="button" onClick={prevStep}
                    className="flex-1 bg-white/5 border border-white/10 text-white font-black py-4 md:py-5 rounded-xl md:rounded-2xl uppercase tracking-widest text-[10px] md:text-xs hover:bg-white/10 transition-all active:scale-[0.98]"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-[#c6ff34] text-[#050521] font-black py-4 md:py-5 rounded-xl md:rounded-2xl uppercase tracking-widest text-[10px] md:text-xs shadow-[0_20px_50px_rgba(198,255,52,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
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
