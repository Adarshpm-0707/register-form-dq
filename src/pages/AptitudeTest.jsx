import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Background3D from "../components/Background3D";
import BottomSF from "./BottomSF";
import { saveAptitudeLead } from "../services/dbService";

const Icons = {
  Brain: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/>
    </svg>
  ),
  Shield: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  X: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  ArrowRight: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  )
};

export default function AptitudeTest() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await saveAptitudeLead(formData);
      if (response.success) {
        navigate("/assessment", { state: { leadId: response.id, userData: formData } });
      }
    } catch (error) {
      console.error("Detailed Error:", error);
      alert(`SYSTEM ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#050521] text-white selection:bg-[#c6ff34]/30">
      <Background3D />
      <Navbar />
      
      {/* HUD Effect */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(198,255,52,0.01)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-50 opacity-10" />
      
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-28 md:pt-44 pb-12 flex flex-col items-center text-center">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-10 md:mb-16 w-full">
 
          
          <h1 className="text-4xl sm:text-6xl md:text-[100px] font-black leading-[1] md:leading-[0.85] tracking-tighter uppercase mb-6 break-words">
            APTITUDE <br />
            <span className="text-[#c6ff34] drop-shadow-[0_0_15px_rgba(198,255,52,0.3)]">TEST</span>
          </h1>
          
          <p className="text-sm sm:text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto leading-snug font-bold tracking-tight px-4">
            High-precision algorithmic evaluation for elite AI developers. <br className="hidden md:block" /> 
            Verify your logic gates.
          </p>
        </motion.div>

        {/* Central Action Terminal */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative w-full max-w-lg group px-4">
          <div className="absolute -inset-1 bg-[#c6ff34]/10 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
          
          <div className="relative p-6 md:p-12 rounded-[30px] md:rounded-[50px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
            <Icons.Brain className="w-10 h-10 md:w-16 md:h-16 text-[#c6ff34] mx-auto mb-8 drop-shadow-[0_0_10px_rgba(198,255,52,0.4)]" />
            
            <div className="grid grid-cols-3 gap-2 mb-8 border-y border-white/5 py-6">
               <div className="text-center">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Time</p>
                  <p className="text-base font-black text-white">35M</p>
               </div>
               <div className="text-center border-x border-white/5 px-1">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Items</p>
                  <p className="text-base font-black text-white">30</p>
               </div>
               <div className="text-center">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Pass</p>
                  <p className="text-base font-black text-[#c6ff34]">85%</p>
               </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowForm(true)} className="w-full py-4 md:py-6 bg-[#c6ff34] text-[#050521] font-black text-base md:text-xl uppercase tracking-tighter rounded-xl md:rounded-[24px] shadow-[0_10px_30px_rgba(198,255,52,0.2)] transition-all flex items-center justify-center gap-2 group">
              TEST <Icons.ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

        {/* Lead Capture Modal */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-[100] overflow-y-auto px-4 py-10 flex justify-center items-center">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !loading && setShowForm(false)} className="fixed inset-0 bg-[#050521]/95 backdrop-blur-xl" />
              
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-[#050521] border border-white/10 rounded-3xl md:rounded-[40px] p-6 md:p-12 shadow-2xl backdrop-blur-3xl border-t-[#c6ff34] border-t-2 h-fit">
                <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 md:top-8 md:right-8 text-white/20 hover:text-white transition-colors z-10">
                  <Icons.X className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                   <Icons.Shield className="w-8 h-8 md:w-12 md:h-12 text-[#c6ff34] mx-auto mb-4" />
                   <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-2">AUTH_CHECK</h2>
                   <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest px-2">Verify identity to establish link</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[8px] font-black uppercase tracking-widest text-[#c6ff34] ml-4">Full_Name</label>
                    <input required type="text" placeholder="Candidate Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3 md:py-4 text-base text-white font-bold focus:outline-none focus:border-[#c6ff34] transition-all"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[8px] font-black uppercase tracking-widest text-[#c6ff34] ml-4">Email_Address</label>
                    <input required type="email" placeholder="email@deepstaq.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3 md:py-4 text-base text-white font-bold focus:outline-none focus:border-[#c6ff34] transition-all"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[8px] font-black uppercase tracking-widest text-[#c6ff34] ml-4">Uplink_Phone</label>
                    <input required type="tel" placeholder="+91 00000 00000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3 md:py-4 text-base text-white font-bold focus:outline-none focus:border-[#c6ff34] transition-all"
                    />
                  </div>

                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={loading} className="w-full py-4 md:py-6 bg-[#c6ff34] text-[#050521] font-black text-lg md:text-2xl uppercase tracking-tighter rounded-xl md:rounded-[20px] shadow-[0_15px_40px_rgba(198,255,52,0.2)] disabled:opacity-50 mt-6">
                    {loading ? "LINKING..." : "START_UPLINK"}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>

      <div className="mt-8">
        <BottomSF />
      </div>
    </div>
  );
}
