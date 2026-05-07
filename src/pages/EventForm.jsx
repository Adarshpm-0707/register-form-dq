import React, { useState } from "react";
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
  )
};

export default function EventForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    institution: "",
    department: "",
    passingYear: "",
    heardOfAI: "",
    interest: "",
    referral: "",
    expectations: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050521] text-white selection:bg-[#c6ff34]/30">
      <Background3D />
      <Navbar />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(198,255,52,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,255,52,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent:80%)] pointer-events-none -z-10" />

      {/* Increased Container Size */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-32 md:pt-40 pb-32">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate("/register")}
          className="flex items-center gap-3 text-white/40 hover:text-[#c6ff34] transition-colors mb-8 md:mb-12 group uppercase text-[10px] md:text-xs font-black tracking-[0.3em]"
        >
          <Icons.ArrowLeft /> Back to Selection
        </button>

        {/* Progress Header - Scaled Up */}
        <div className="mb-12 md:mb-16">
           <div className="flex items-end justify-between mb-4 md:mb-6">
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                 EVENT <span className="text-[#c6ff34]">ENTRY</span>
              </h1>
              <span className="text-[#c6ff34] font-black text-xs md:text-lg bg-[#c6ff34]/10 px-5 py-2 rounded-full border border-[#c6ff34]/20 shadow-2xl">STEP 0{step} / 03</span>
           </div>
           
           <div className="h-2 md:h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: `${(step / 3) * 100}%` }}
                className="h-full bg-[#c6ff34] shadow-[0_0_25px_rgba(198,255,52,0.6)]"
              />
           </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <AnimatePresence mode="wait">
            
            {/* Page 1: Basic Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="p-6 md:p-12 rounded-[32px] md:rounded-[48px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                   <h2 className="text-xl md:text-3xl font-black uppercase mb-8 md:mb-12 flex items-center gap-5">
                      <span className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#c6ff34]/10 text-[#c6ff34] flex items-center justify-center text-xs md:text-xl">1</span>
                      Basic Details
                   </h2>
                   
                   <div className="space-y-6 md:space-y-10">
                      <div className="space-y-2 md:space-y-4">
                        <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">Full Name</label>
                        <input 
                          type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-base md:text-2xl shadow-xl"
                          placeholder="John Doe" required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                        <div className="space-y-2 md:space-y-4">
                          <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">Phone Number</label>
                          <input 
                            type="tel" name="phone" value={formData.phone} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-base md:text-2xl shadow-xl"
                            placeholder="+91 00000 00000" required
                          />
                        </div>
                        <div className="space-y-2 md:space-y-4">
                          <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">Email Address</label>
                          <input 
                            type="email" name="email" value={formData.email} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-base md:text-2xl shadow-xl"
                            placeholder="john@example.com" required
                          />
                        </div>
                      </div>
                   </div>
                </div>
                <button 
                  type="button" onClick={nextStep}
                  className="w-full bg-white text-[#050521] font-black py-5 md:py-8 rounded-2xl md:rounded-[32px] uppercase tracking-[0.4em] text-xs md:text-lg hover:shadow-[0_40px_100px_rgba(198,255,52,0.3)] transition-all active:scale-[0.98]"
                >
                  Proceed to Academics
                </button>
              </motion.div>
            )}

            {/* Step 2 & 3 would follow similar scaled-up styling patterns */}
            {/* Page 2: Academic Details */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="p-6 md:p-12 rounded-[32px] md:rounded-[48px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                   <h2 className="text-xl md:text-3xl font-black uppercase mb-8 md:mb-12 flex items-center gap-5">
                      <span className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#c6ff34]/10 text-[#c6ff34] flex items-center justify-center text-xs md:text-xl">2</span>
                      Academic Details
                   </h2>
                   
                   <div className="space-y-6 md:space-y-10">
                      <div className="space-y-2 md:space-y-4">
                        <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">College or School</label>
                        <input 
                          type="text" name="institution" value={formData.institution} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-base md:text-2xl"
                          placeholder="Institution Name" required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                        <div className="space-y-2 md:space-y-4">
                          <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">Department / Stream</label>
                          <input 
                            type="text" name="department" value={formData.department} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-base md:text-2xl"
                            placeholder="CS / Mechanical / etc." required
                          />
                        </div>
                        <div className="space-y-2 md:space-y-4">
                          <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">Passing Out Year</label>
                          <input 
                            type="text" name="passingYear" value={formData.passingYear} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-base md:text-2xl"
                            placeholder="2025" required
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
                    Previous
                  </button>
                  <button 
                    type="button" onClick={nextStep}
                    className="flex-[2] bg-white text-[#050521] font-black py-5 md:py-8 rounded-2xl md:rounded-[32px] uppercase tracking-[0.4em] text-xs md:text-lg hover:shadow-[0_40px_100px_rgba(198,255,52,0.3)] transition-all active:scale-[0.98]"
                  >
                    Almost There
                  </button>
                </div>
              </motion.div>
            )}

            {/* Page 3: AI & Career Interest */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="p-6 md:p-12 rounded-[32px] md:rounded-[48px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                   <h2 className="text-xl md:text-3xl font-black uppercase mb-8 md:mb-12 flex items-center gap-5">
                      <span className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#c6ff34]/10 text-[#c6ff34] flex items-center justify-center text-xs md:text-xl">3</span>
                      AI & Career Interest
                   </h2>
                   
                   <div className="space-y-6 md:space-y-10">
                      <div className="space-y-2 md:space-y-4">
                        <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">Have you heard of AI before?</label>
                        <select 
                          name="heardOfAI" value={formData.heardOfAI} onChange={handleChange}
                          className="w-full bg-[#050521] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all font-bold appearance-none text-base md:text-2xl"
                          required
                        >
                          <option value="">Select Option</option>
                          <option value="yes">Yes, definitely</option>
                          <option value="some">Somewhat</option>
                          <option value="no">Not really</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                         <div className="space-y-2 md:space-y-4">
                            <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">Most Interested In?</label>
                            <input 
                              type="text" name="interest" value={formData.interest} onChange={handleChange}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-base md:text-2xl"
                              placeholder="Robotics / etc." required
                            />
                         </div>
                         <div className="space-y-2 md:space-y-4">
                            <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">How did you hear about this?</label>
                            <input 
                              type="text" name="referral" value={formData.referral} onChange={handleChange}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-base md:text-2xl"
                              placeholder="Instagram / Friend / etc." required
                            />
                         </div>
                      </div>
                      <div className="space-y-2 md:space-y-4">
                        <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-4">Any questions for us?</label>
                        <textarea 
                          name="expectations" value={formData.expectations} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[24px] px-6 py-4 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold min-h-[140px] text-base md:text-2xl"
                          placeholder="Type your message..."
                        />
                      </div>
                   </div>
                </div>
                <div className="flex gap-4 md:gap-8">
                  <button 
                    type="button" onClick={prevStep}
                    className="flex-1 bg-white/5 border border-white/10 text-white font-black py-5 md:py-8 rounded-2xl md:rounded-[32px] uppercase tracking-[0.4em] text-xs md:text-lg hover:bg-white/10 transition-all active:scale-[0.98]"
                  >
                    Previous
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-[#c6ff34] text-[#050521] font-black py-5 md:py-8 rounded-2xl md:rounded-[32px] uppercase tracking-[0.4em] text-xs md:text-lg shadow-[0_40px_100px_rgba(198,255,52,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    Complete Registration <Icons.Check />
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
