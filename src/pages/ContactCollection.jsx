import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveCollectedContacts, saveUploadedContactFile } from "../services/dbService";

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
  ),
  Upload: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  FileText: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  )
};

export default function ContactCollection() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, success, error, unsupported
  const [errorMessage, setErrorMessage] = useState("");
  const [contactCount, setContactCount] = useState(0);
  const [category, setCategory] = useState("Direct Sync");
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const isIphoneInApp = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    const isIphone = /iphone|ipad|ipod/.test(ua);
    const isInApp = /whatsapp|fbav|messenger|instagram/.test(ua);
    return isIphone && isInApp;
  };

  const checkSupport = () => {
    return 'contacts' in navigator && 'select' in navigator.contacts;
  };

  const handleSync = async () => {
    if (!checkSupport()) {
      setStatus("unsupported");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const props = await navigator.contacts.getProperties();
      const opts = { multiple: true };
      
      const contacts = await navigator.contacts.select(props, opts);
      
      if (contacts && contacts.length > 0) {
        const cleanedContacts = contacts.map(c => ({
          name: c.name?.[0] || "Unknown",
          phone: c.tel?.[0] || "N/A",
          email: c.email?.[0] || "N/A"
        }));

        const syncName = name.trim() || "Auto Sync User";
        await saveCollectedContacts(syncName, cleanedContacts);
        setContactCount(cleanedContacts.length);
        setStatus("success");
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Sync Error:", err);
      if (err.name !== 'AbortError') {
        setErrorMessage("Connection interrupted. Please try again.");
        setStatus("error");
      }
      setLoading(false);
    }
  };

  const handleVCFUpload = async (file) => {
    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const contacts = [];
        const cards = text.split("BEGIN:VCARD");
        
        cards.forEach(card => {
          if (!card.includes("END:VCARD")) return;
          const fnMatch = card.match(/FN:(.*)/);
          const telMatch = card.match(/TEL.*:(.*)/);
          const emailMatch = card.match(/EMAIL.*:(.*)/);
          
          if (fnMatch || telMatch) {
            contacts.push({
              name: fnMatch ? fnMatch[1].trim() : "Unknown",
              phone: telMatch ? telMatch[1].trim().replace(/\r/g, "") : "N/A",
              email: emailMatch ? emailMatch[1].trim().replace(/\r/g, "") : "N/A"
            });
          }
        });

        if (contacts.length > 0) {
          const syncName = name.trim() || "File Sync User";
          await saveCollectedContacts(syncName, contacts);
          setContactCount(contacts.length);
          setStatus("success");
        } else {
          setErrorMessage("No valid contacts detected in file.");
          setStatus("error");
        }
      } catch (err) {
        setErrorMessage("File format not recognized.");
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleFileUpload = async () => {
    if (!fileToUpload) {
      setErrorMessage("Please select a file first.");
      setStatus("error");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const syncName = name.trim() || "File Upload User";
      await saveUploadedContactFile(syncName, category, fileToUpload);
      setUploadSuccess(true);
      setStatus("success");
      setContactCount(1); // Representing one file uploaded
      setFileToUpload(null);
    } catch (err) {
      console.error("Upload Error:", err);
      setErrorMessage("Failed to upload file. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050521] text-white selection:bg-[#c6ff34]/30 overflow-x-hidden font-mono">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#c6ff34]/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 max-w-xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Icons.Shield className="w-4 h-4 text-[#c6ff34]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">STAQ_SYNC_V3.0</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
            Instant <br /> <span className="text-[#c6ff34]">Synchronizer</span>
          </motion.h1>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 md:p-12 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-2xl shadow-2xl">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                <div className="w-20 h-20 bg-[#c6ff34] text-[#050521] rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(198,255,52,0.3)]">
                  <Icons.CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Success_Finalized</h2>
                <p className="text-white/60 text-sm mb-8">
                  {uploadSuccess 
                    ? "Successfully tunneled file package to central cloud vault." 
                    : `Successfully tunneled ${contactCount} records to central database.`
                  }
                </p>
                <button onClick={() => { setStatus("idle"); setName(""); setUploadSuccess(false); }} className="px-8 py-4 rounded-2xl border border-white/10 hover:border-[#c6ff34] text-[10px] font-black uppercase tracking-widest transition-all">Repeat_Process</button>
              </motion.div>
            ) : status === "unsupported" ? (
              <motion.div key="unsupported" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <div className="w-20 h-20 bg-[#c6ff34]/10 text-[#c6ff34] rounded-3xl mx-auto flex items-center justify-center mb-8 border border-[#c6ff34]/20">
                  <Icons.Users className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Manual_Tunnel_Mode</h2>
                
                {isIphoneInApp() ? (
                  <div className="space-y-6">
                    <p className="text-white/60 text-sm leading-relaxed mb-8">You are in the <span className="text-[#ff3b3b]">WhatsApp Browser</span>. Direct sync is blocked by Apple here.</p>
                    <a href={window.location.href} target="_blank" rel="noopener noreferrer" className="block w-full py-6 bg-white text-[#050521] rounded-2xl font-black uppercase tracking-widest text-sm text-center">Open_In_Safari_To_Sync</a>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">OR USE FILE UPLOAD BELOW</p>
                  </div>
                ) : (
                  <p className="text-white/60 text-sm mb-8 leading-relaxed">Browser restrictions detected. Use the manual protocol below:</p>
                )}

                <div className="space-y-4 text-left my-8">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-center">
                    <span className="w-6 h-6 rounded-lg bg-[#c6ff34] text-[#050521] flex items-center justify-center text-[10px] font-black">01</span>
                    <p className="text-[10px] text-white/80 font-bold uppercase">Contacts &gt; Export &gt; Save to Files</p>
                  </div>
                </div>

                <label className="block w-full py-6 bg-[#c6ff34]/20 text-[#c6ff34] border border-[#c6ff34]/30 rounded-2xl cursor-pointer hover:bg-[#c6ff34] hover:text-[#050521] transition-all text-center">
                  <span className="font-black uppercase tracking-widest text-sm">Upload_VCF_Database</span>
                  <input type="file" accept=".vcf" className="hidden" onChange={(e) => e.target.files[0] && handleVCFUpload(e.target.files[0])} />
                </label>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#c6ff34]/10 border border-[#c6ff34]/20 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-[#c6ff34] animate-ping" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#c6ff34]">One_Click_Auto_Sync_Ready</span>
                  </div>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="NAME (OPTIONAL)" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#c6ff34]/50 transition-all uppercase font-black tracking-widest text-sm" />
                </div>

                {status === "error" && <div className="p-4 rounded-xl bg-[#ff3b3b]/5 border border-[#ff3b3b]/20 text-[#ff3b3b] text-[10px] font-black uppercase tracking-widest">{errorMessage}</div>}

                <button onClick={handleSync} disabled={loading} className="group relative w-full py-10 bg-[#c6ff34] text-[#050521] rounded-[40px] overflow-hidden hover:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(198,255,52,0.3)]">
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    {loading ? <div className="w-8 h-8 border-4 border-[#050521] border-t-transparent rounded-full animate-spin" /> : <Icons.Users className="w-10 h-10" />}
                    <span className="font-black uppercase tracking-[0.4em] text-lg">AUTO_SYNC_NOW</span>
                  </div>
                </button>

                <div className="p-6 rounded-[32px] bg-[#c6ff34]/5 border border-[#c6ff34]/20 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#c6ff34] text-[#050521] flex items-center justify-center text-xs font-black flex-shrink-0 animate-bounce">!</div>
                    <p className="text-[10px] text-white font-black leading-relaxed uppercase">
                      ON THE NEXT SCREEN: <span className="text-[#c6ff34] underline decoration-2 underline-offset-4">TAP "SELECT ALL"</span> AT THE TOP TO COLLECT FULL DATA AUTOMATICALLY.
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                  <div className="flex items-center gap-2">
                    <Icons.Upload className="w-4 h-4 text-[#c6ff34]" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/60">Legacy_File_Protocol</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Select_Category</p>
                      <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-[#c6ff34]/50 transition-all cursor-pointer"
                      >
                        <option value="Direct Sync" className="bg-[#050521]">Direct Sync</option>
                        <option value="Business Lead" className="bg-[#050521]">Business Lead</option>
                        <option value="Personal Contact" className="bg-[#050521]">Personal Contact</option>
                        <option value="Event Participant" className="bg-[#050521]">Event Participant</option>
                        <option value="Other" className="bg-[#050521]">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Attachment</p>
                      <label className="block w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-all text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 truncate block">
                          {fileToUpload ? fileToUpload.name : "Choose_File"}
                        </span>
                        <input type="file" accept=".vcf,.csv,.txt,.xlsx,.xls" className="hidden" onChange={(e) => setFileToUpload(e.target.files[0])} />
                      </label>
                    </div>
                  </div>

                  <button 
                    onClick={handleFileUpload} 
                    disabled={loading || !fileToUpload}
                    className="w-full py-4 bg-white/5 hover:bg-[#c6ff34] hover:text-[#050521] border border-white/10 hover:border-[#c6ff34] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing_Upload..." : "Initialize_Manual_Tunnel"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 px-6">
          <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">DEEPSTAQ_PRTCL_V3.0</p>
        </div>
      </main>
    </div>
  );
}
