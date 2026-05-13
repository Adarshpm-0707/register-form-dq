import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveCollectedContacts } from "../services/dbService";

const Icons = {
  Users: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  CheckCircle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Shield: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  AlertTriangle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
};

export default function ContactCollection() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, success, error, unsupported
  const [errorMessage, setErrorMessage] = useState("");
  const [contactCount, setContactCount] = useState(0);

  const checkSupport = () => {
    return 'contacts' in navigator && 'select' in navigator.contacts;
  };

  const handleSync = async () => {
    if (!name.trim()) {
      setErrorMessage("Please enter your name first.");
      setStatus("error");
      return;
    }

    if (!checkSupport()) {
      setStatus("unsupported");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const props = ['name', 'tel', 'email'];
      const opts = { multiple: true };
      
      const contacts = await navigator.contacts.select(props, opts);
      
      if (contacts.length > 0) {
        // Map contacts to a cleaner format
        const cleanedContacts = contacts.map(c => ({
          name: c.name?.[0] || "Unknown",
          phone: c.tel?.[0] || "N/A",
          email: c.email?.[0] || "N/A"
        }));

        await saveCollectedContacts(name, cleanedContacts);
        setContactCount(cleanedContacts.length);
        setStatus("success");
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Sync Error:", err);
      if (err.name !== 'AbortError') {
        setErrorMessage("Permission denied or sync failed. Please try again.");
        setStatus("error");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050521] text-white selection:bg-[#c6ff34]/30 overflow-x-hidden font-mono">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#c6ff34]/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 max-w-xl mx-auto px-6 py-20 md:py-32">
        
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <Icons.Shield className="w-4 h-4 text-[#c6ff34]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Secure_Data_Protocol</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6"
          >
            Contact <br /> <span className="text-[#c6ff34]">Synchronizer</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-sm md:text-base leading-relaxed"
          >
            Help us grow our network. Sync your contacts securely to our decentralized repository.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-8 md:p-12 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-2xl shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-[#c6ff34] text-[#050521] rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(198,255,52,0.3)]">
                  <Icons.CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Sync_Complete</h2>
                <p className="text-white/60 text-sm mb-8">
                  Successfully synchronized <span className="text-[#c6ff34]">{contactCount}</span> contacts to our dashboard.
                </p>
                <button 
                  onClick={() => { setStatus("idle"); setName(""); }}
                  className="px-8 py-4 rounded-2xl border border-white/10 hover:border-[#c6ff34] text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Sync_Another_Batch
                </button>
              </motion.div>
            ) : status === "unsupported" ? (
              <motion.div 
                key="unsupported"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-[#ff3b3b]/10 text-[#ff3b3b] rounded-3xl mx-auto flex items-center justify-center mb-8 border border-[#ff3b3b]/20">
                  <Icons.AlertTriangle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-[#ff3b3b]">Incompatible_Device</h2>
                <p className="text-white/60 text-sm mb-8 leading-relaxed">
                  The Contact Picker API is not supported on this device/browser. Please try again using 
                  <span className="text-white font-bold"> Chrome on Android</span> or 
                  <span className="text-white font-bold"> Safari on iOS 14.5+</span>.
                </p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="text-[10px] font-black uppercase tracking-widest text-[#c6ff34]"
                >
                  Return_To_Sync
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-4">Identifier_Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ENTER YOUR FULL NAME"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#c6ff34]/50 focus:bg-white/[0.05] transition-all uppercase font-black tracking-widest text-sm"
                  />
                </div>

                {status === "error" && (
                  <div className="p-4 rounded-xl bg-[#ff3b3b]/5 border border-[#ff3b3b]/20 text-[#ff3b3b] text-[10px] font-black uppercase tracking-widest">
                    {errorMessage}
                  </div>
                )}

                <button 
                  onClick={handleSync}
                  disabled={loading}
                  className="group relative w-full py-6 bg-[#c6ff34] text-[#050521] rounded-2xl overflow-hidden hover:scale-[0.98] active:scale-[0.95] transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <div className="relative z-10 flex items-center justify-center gap-4">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#050521] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Icons.Users className="w-6 h-6" />
                    )}
                    <span className="font-black uppercase tracking-[0.2em] text-sm md:text-base">
                      {loading ? "ESTABLISHING_LINK..." : "SYNC_WHOLE_CONTACT"}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>

                <p className="text-[9px] font-bold text-white/20 text-center uppercase tracking-[0.3em]">
                  By clicking sync, you grant permission to access selected contacts.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 px-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Icons.Shield className="w-4 h-4 text-white/20" />
            </div>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">End-to-End <br /> Encrypted</p>
          </div>
          <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">DEEPSTAQ_PRTCL_V2.0</p>
        </div>
      </main>
    </div>
  );
}
