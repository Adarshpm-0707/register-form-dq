import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Background3D from "../components/Background3D";
import { saveEventRegistration } from "../services/dbService";

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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState("");
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
    const { name, value } = e.target;
    
    // Strict Validation Rules
    if (name === "fullName") {
      // Allow only letters and spaces
      if (value !== "" && !/^[a-zA-Z\s]*$/.test(value)) return;
    }
    
    if (name === "phone") {
      if (value !== "" && !/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    if (name === "passingYear") {
      if (value !== "" && !/^\d*$/.test(value)) return;
      if (value.length > 4) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${registrationId}&color=050521`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `DeepStaq_Workshop_Ticket.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download ticket. Please take a screenshot.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const regId = "WORKSHOP_" + Math.random().toString(36).substring(7).toUpperCase();
      await saveEventRegistration({
        ...formData,
        registrationId: regId,
        attendanceStatus: "Pending",
        timestamp: new Date()
      });
      setRegistrationId(regId);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Firebase Error:", error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050521] text-white selection:bg-[#c6ff34]/30">
      <Background3D />
      <Navbar />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(198,255,52,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,255,52,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent:80%)] pointer-events-none -z-10" />

      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-24 md:pt-40 pb-20 md:pb-32">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate("/register")}
          className="flex items-center gap-2 text-white/40 hover:text-[#c6ff34] transition-colors mb-6 md:mb-12 group uppercase text-[9px] md:text-xs font-black tracking-[0.2em] md:tracking-[0.3em]"
        >
          <Icons.ArrowLeft /> Back to Selection
        </button>

        {/* Progress Header */}
        <div className="mb-8 md:mb-16">
           <div className="flex items-end justify-between mb-3 md:mb-6">
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                 EVENT <span className="text-[#c6ff34]">ENTRY</span>
              </h1>
              <span className="text-[#c6ff34] font-black text-[10px] md:text-lg bg-[#c6ff34]/10 px-3 py-1.5 md:px-5 md:py-2 rounded-full border border-[#c6ff34]/20 shadow-2xl">STEP 0{step}/03</span>
           </div>
           
           <div className="h-1.5 md:h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: `${(step / 3) * 100}%` }}
                className="h-full bg-[#c6ff34] shadow-[0_0_25px_rgba(198,255,52,0.6)]"
              />
           </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <AnimatePresence mode="wait">
            
            {/* Success View */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 md:p-16 rounded-[40px] md:rounded-[64px] bg-white/[0.02] border border-[#c6ff34]/30 backdrop-blur-3xl text-center space-y-10 relative overflow-hidden"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#c6ff34]/10 blur-[100px] pointer-events-none" />

                 <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-[#c6ff34] text-[#050521] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(198,255,52,0.4)] relative z-10">
                    <Icons.Check />
                 </div>

                 <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Registration <span className="text-[#c6ff34]">Successful!</span></h2>
                    <p className="text-slate-400 text-sm md:text-xl font-bold tracking-widest uppercase">DeepStaq Workshop Uplink Established</p>
                 </div>

                 {/* QR Section */}
                 <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] w-fit mx-auto shadow-2xl relative group">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${registrationId}&color=050521`} 
                      alt="Attendance QR"
                      className="w-48 h-48 md:w-64 md:h-64 rounded-xl"
                    />
                    <div className="mt-4 text-[#050521] font-black text-[10px] md:text-xs uppercase tracking-widest opacity-40">
                      ID: {registrationId}
                    </div>
                 </div>

                 <div className="max-w-md mx-auto space-y-4">
                    <motion.a 
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }} 
                      href="https://chat.whatsapp.com/IDT2teReSM7LQGJ12sPcnH"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-5 md:py-8 bg-[#c6ff34] text-[#050521] font-black text-xs md:text-xl uppercase tracking-widest rounded-2xl md:rounded-[32px] flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(198,255,52,0.3)] transition-all"
                    >
                      <svg className="w-5 h-5 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      JOIN OUR TEAM
                    </motion.a>

                    <button 
                      onClick={handleDownloadQR}
                      className="w-full py-4 bg-white/5 border border-white/10 text-white font-black text-[10px] md:text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                    >
                      Download Workshop Ticket
                    </button>

                    <button 
                      onClick={() => navigate("/")}
                      className="w-full mt-4 text-white/20 font-black text-[8px] md:text-[10px] uppercase tracking-widest hover:text-[#ff3b3b] transition-all"
                    >
                      Terminate & Return Home
                    </button>
                 </div>
              </motion.div>
            )}

            {/* Step 1: Basic Details */}
            {!success && step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-6"
              >
                <div className="p-5 md:p-12 rounded-[24px] md:rounded-[48px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl">
                   <h2 className="text-lg md:text-3xl font-black uppercase mb-6 md:mb-12 flex items-center gap-3 md:gap-5">
                      <span className="w-6 h-6 md:w-12 md:h-12 rounded-lg md:rounded-full bg-[#c6ff34]/10 text-[#c6ff34] flex items-center justify-center text-[10px] md:text-xl">1</span>
                      Basic Details
                   </h2>
                   
                   <div className="space-y-4 md:space-y-10">
                      <div className="space-y-1.5 md:space-y-4">
                        <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">Full Name</label>
                        <input 
                          type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-2xl shadow-xl"
                          placeholder="Your Name" required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                        <div className="space-y-1.5 md:space-y-4">
                          <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">Phone Number</label>
                          <input 
                            type="tel" name="phone" value={formData.phone} onChange={handleChange}
                            pattern="[0-9]{10}" title="Phone number must be exactly 10 digits" maxLength={10}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-2xl shadow-xl"
                            placeholder="10-digit mobile number" required
                          />
                        </div>
                        <div className="space-y-1.5 md:space-y-4">
                          <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">Email Address</label>
                          <input 
                            type="email" name="email" value={formData.email} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-2xl shadow-xl"
                            placeholder="mail@example.com" required
                          />
                        </div>
                      </div>
                   </div>
                </div>
                <button 
                  type="button" onClick={nextStep}
                  className="w-full bg-white text-[#050521] font-black py-4 md:py-8 rounded-xl md:rounded-[32px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-xs md:text-lg hover:shadow-[0_20px_50px_rgba(198,255,52,0.3)] transition-all active:scale-[0.98]"
                >
                  Proceed to Academics
                </button>
              </motion.div>
            )}

            {/* Step 2: Academic Details */}
            {!success && step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-6"
              >
                <div className="p-5 md:p-12 rounded-[24px] md:rounded-[48px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl">
                   <h2 className="text-lg md:text-3xl font-black uppercase mb-6 md:mb-12 flex items-center gap-3 md:gap-5">
                      <span className="w-6 h-6 md:w-12 md:h-12 rounded-lg md:rounded-full bg-[#c6ff34]/10 text-[#c6ff34] flex items-center justify-center text-[10px] md:text-xl">2</span>
                      Academic Sync
                   </h2>
                   
                   <div className="space-y-4 md:space-y-10">
                      <div className="space-y-1.5 md:space-y-4">
                        <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">College or School</label>
                        <input 
                          type="text" name="institution" value={formData.institution} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-2xl"
                          placeholder="Institution Name" required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                        <div className="space-y-1.5 md:space-y-4">
                          <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">Department / Stream</label>
                          <input 
                            type="text" name="department" value={formData.department} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-2xl"
                            placeholder="CS / Mechanical / etc." required
                          />
                        </div>
                        <div className="space-y-1.5 md:space-y-4">
                          <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">Passing Year</label>
                          <input 
                            type="text" name="passingYear" value={formData.passingYear} onChange={handleChange}
                            pattern="[0-9]{4}" title="Year must be exactly 4 digits" maxLength={4}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-2xl"
                            placeholder="e.g. 2025" required
                          />
                        </div>
                      </div>
                   </div>
                </div>
                <div className="flex gap-3 md:gap-8">
                  <button 
                    type="button" onClick={prevStep}
                    className="flex-1 bg-white/5 border border-white/10 text-white font-black py-4 md:py-8 rounded-xl md:rounded-[32px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-lg hover:bg-white/10 transition-all active:scale-[0.98]"
                  >
                    Prev
                  </button>
                  <button 
                    type="button" onClick={nextStep}
                    className="flex-[2] bg-white text-[#050521] font-black py-4 md:py-8 rounded-xl md:rounded-[32px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-lg hover:shadow-[0_20px_50px_rgba(198,255,52,0.3)] transition-all active:scale-[0.98]"
                  >
                    Almost There
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Interest & Finalize */}
            {!success && step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-6"
              >
                <div className="p-5 md:p-12 rounded-[24px] md:rounded-[48px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl">
                   <h2 className="text-lg md:text-3xl font-black uppercase mb-6 md:mb-12 flex items-center gap-3 md:gap-5">
                      <span className="w-6 h-6 md:w-12 md:h-12 rounded-lg md:rounded-full bg-[#c6ff34]/10 text-[#c6ff34] flex items-center justify-center text-[10px] md:text-xl">3</span>
                      Final Sync
                   </h2>
                   
                   <div className="space-y-4 md:space-y-10">
                      <div className="space-y-1.5 md:space-y-4">
                        <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">Heard of AI before?</label>
                        <select 
                          name="heardOfAI" value={formData.heardOfAI} onChange={handleChange}
                          className="w-full bg-[#050521] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all font-bold appearance-none text-sm md:text-2xl"
                          required
                        >
                          <option value="">Select Option</option>
                          <option value="yes">Yes, definitely</option>
                          <option value="some">Somewhat</option>
                          <option value="no">Not really</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                         <div className="space-y-1.5 md:space-y-4">
                            <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">Interest Area</label>
                            <input 
                              type="text" name="interest" value={formData.interest} onChange={handleChange}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-2xl"
                              placeholder="Robotics / Coding / etc." required
                            />
                         </div>
                         <div className="space-y-1.5 md:space-y-4">
                            <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">How did you hear?</label>
                            <input 
                              type="text" name="referral" value={formData.referral} onChange={handleChange}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-2xl"
                              placeholder="Social Media / Friend" required
                            />
                         </div>
                      </div>
                      <div className="space-y-1.5 md:space-y-4">
                        <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">Message for us</label>
                        <textarea 
                          name="expectations" value={formData.expectations} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold min-h-[100px] md:min-h-[140px] text-sm md:text-2xl"
                          placeholder="Your message..."
                        />
                      </div>
                   </div>
                </div>
                <div className="flex gap-3 md:gap-8">
                  <button 
                    type="button" onClick={prevStep}
                    className="flex-1 bg-white/5 border border-white/10 text-white font-black py-4 md:py-8 rounded-xl md:rounded-[32px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-lg hover:bg-white/10 transition-all active:scale-[0.98]"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-[#c6ff34] text-[#050521] font-black py-4 md:py-8 rounded-xl md:rounded-[32px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-lg shadow-[0_20px_50px_rgba(198,255,52,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 md:gap-3 active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? "Syncing..." : "Finalize"} <Icons.Check />
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
