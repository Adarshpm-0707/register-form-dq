import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  getEventRegistrations, 
  getMasterRegistrations, 
  getAptitudeLeads, 
  markAttendance, 
  getAttendanceList, 
  markEventAttendance, 
  getEventAttendanceList 
} from "../../services/dbService";

const Icons = {
  Refresh: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>
    </svg>
  ),
  Download: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Logout: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Camera: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  UserCheck: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>
    </svg>
  )
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("events");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(null);

  const fetchData = useCallback(async () => {
    if (activeTab === "attendance") return;
    setLoading(true);
    setSyncError(null);
    try {
      let result = [];
      if (activeTab === "events") {
        result = await getEventRegistrations();
      } else if (activeTab === "masters") {
        result = await getMasterRegistrations();
      } else if (activeTab === "aptitude") {
        result = await getAptitudeLeads();
      }
      setData(result);
    } catch (err) {
      console.error("Fetch Error:", err);
      setSyncError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const exportToCSV = () => {
    if (!data.length) return;
    
    let headers = [];
    let rows = [];

    if (activeTab === "events") {
      headers = ["ID", "Full Name", "Email", "Phone", "Institution", "Department", "Passing Year", "Interest", "Referral", "Expectations", "Timestamp"];
      rows = data.map(item => {
        const date = new Date(item.timestamp?.seconds * 1000).toLocaleString();
        return [item.id, item.fullName, item.email, item.phone, item.institution, item.department, item.passingYear, item.interest, item.referral, item.expectations?.replace(/,/g, " "), date];
      });
    } else if (activeTab === "masters") {
      headers = ["ID", "Name", "Email", "Phone", "Campus", "Course", "Current Year", "Year of Completion", "Address", "Timestamp"];
      rows = data.map(item => {
        const date = new Date(item.timestamp?.seconds * 1000).toLocaleString();
        return [item.id, item.name, item.email, item.phone, item.campus, item.course, item.year, item.yearOfCompletion, item.address?.replace(/,/g, " "), date];
      });
    } else if (activeTab === "aptitude") {
      headers = ["ID", "Name", "Email", "Phone", "Score", "Accuracy (%)", "Status", "Started At", "Completed At"];
      rows = data.map(item => {
        const started = item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleString() : "N/A";
        const completed = item.completedAt?.seconds ? new Date(item.completedAt.seconds * 1000).toLocaleString() : "N/A";
        return [item.id, item.name, item.email, item.phone, item.score || 0, item.accuracy || 0, item.status, started, completed];
      });
    }

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `DeepStaq_${activeTab}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = useMemo(() => {
    if (!data.length) return null;
    const today = new Date().toLocaleDateString();
    return {
      total: data.length,
      today: data.filter(item => {
        const ts = item.timestamp?.seconds || item.createdAt?.seconds;
        return ts && new Date(ts * 1000).toLocaleDateString() === today;
      }).length,
      recent: data.slice(0, 5)
    };
  }, [data]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  const getTabTitle = () => {
    switch(activeTab) {
      case "events": return "AI Workshop";
      case "masters": return "Master Class";
      case "aptitude": return "Aptitude Assessment";
      case "attendance": return "Live Check-In";
      default: return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-[#050521] text-white selection:bg-[#c6ff34]/30 overflow-x-hidden">
      
      <nav className="border-b border-white/5 bg-[#050521]/80 backdrop-blur-2xl sticky top-0 z-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 md:h-24 flex items-center justify-between">
            <h1 className="text-lg md:text-2xl font-black uppercase tracking-tighter truncate mr-4">
              STAQ <span className="text-[#c6ff34]">ADMIN</span>
            </h1>
            
            <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
               <button onClick={() => fetchData()} className="p-2 text-white/40 hover:text-[#c6ff34] transition-colors" title="Refresh">
                 <Icons.Refresh className="w-5 h-5" />
               </button>
               <button onClick={() => exportToCSV()} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#c6ff34]/10 text-[#c6ff34] text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-[#c6ff34] hover:text-[#050521] transition-all">
                 <Icons.Download className="w-4 h-4" />
                 <span className="hidden sm:inline">Export</span>
               </button>
               <button onClick={handleLogout} className="p-2 md:p-3 rounded-full border border-white/10 hover:border-[#ff3b3b] hover:text-[#ff3b3b] transition-all" title="Logout">
                 <Icons.Logout className="w-5 h-5" />
               </button>
            </div>
         </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-24">
            {[
               { label: "Total_Entries", value: stats?.total || 0, color: "#c6ff34" },
               { label: "New_Today", value: stats?.today || 0, color: "#34d399" },
               { label: "Current_View", value: getTabTitle(), color: "#60a5fa" },
               { label: "System_Status", value: "Optimal", color: "#f87171" }
            ].map((stat, i) => (
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="p-6 md:p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-xl group hover:border-white/10 transition-all">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">{stat.label}</p>
                  <p className="text-xl md:text-4xl font-black tracking-tighter truncate" style={{ color: stat.color }}>{stat.value}</p>
               </motion.div>
            ))}
         </div>

         <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-10 text-center lg:text-left">
            <div className="space-y-4">
               <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none break-words">
                  {getTabTitle()} <br /> <span className="text-[#c6ff34]">Synchronized</span>
               </h2>
            </div>

            <div className="flex flex-wrap justify-center p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
               <button onClick={() => setActiveTab("events")} className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "events" ? "bg-[#c6ff34] text-[#050521] shadow-[0_0_30px_rgba(198,255,52,0.3)]" : "text-white/40 hover:text-white"}`}>
                 Workshops
               </button>
               <button onClick={() => setActiveTab("masters")} className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "masters" ? "bg-[#c6ff34] text-[#050521] shadow-[0_0_30px_rgba(198,255,52,0.3)]" : "text-white/40 hover:text-white"}`}>
                 Masters
               </button>
               <button onClick={() => setActiveTab("aptitude")} className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "aptitude" ? "bg-[#c6ff34] text-[#050521] shadow-[0_0_30px_rgba(198,255,52,0.3)]" : "text-white/40 hover:text-white"}`}>
                 Aptitude
               </button>
               <button onClick={() => setActiveTab("attendance")} className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "attendance" ? "bg-[#c6ff34] text-[#050521] shadow-[0_0_30px_rgba(198,255,52,0.3)]" : "text-white/40 hover:text-white"}`}>
                 Attendance
               </button>
            </div>
         </div>

         <div className="relative">
            <AnimatePresence mode="wait">
               {loading && activeTab !== "attendance" ? (
                 <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-40 flex flex-col items-center justify-center gap-8">
                    <div className="w-16 h-16 border-t-2 border-[#c6ff34] rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#c6ff34] animate-pulse">Establishing_Data_Link</span>
                 </motion.div>
               ) : syncError ? (
                 <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center p-12 rounded-[48px] bg-[#ff3b3b]/5 border border-[#ff3b3b]/20">
                    <div className="text-[#ff3b3b] font-black uppercase tracking-widest text-2xl mb-4">Security_Violation</div>
                    <p className="text-white/60 mb-8 font-medium">{syncError}</p>
                    <button onClick={() => fetchData()} className="text-[10px] font-black uppercase tracking-widest px-8 py-4 bg-[#ff3b3b] text-white rounded-xl">Retry_Sync</button>
                 </motion.div>
               ) : activeTab === "attendance" ? (
                 <AttendanceSection />
               ) : (
                 <motion.div key="data" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    {data.length === 0 ? (
                       <div className="py-32 text-center text-white/10 font-black uppercase tracking-[0.5em] text-sm">Empty_Result_Set</div>
                    ) : (
                       data.map((item, idx) => (
                         <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="p-6 md:p-12 rounded-[40px] bg-white/[0.01] border border-white/5 hover:border-[#c6ff34]/20 hover:bg-white/[0.03] transition-all group shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-8 px-4 py-1.5 bg-white/5 rounded-b-xl text-[8px] font-black text-white/20 uppercase tracking-widest">
                                ID_{item.id.slice(-6).toUpperCase()}
                            </div>

                            <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                               <div className="lg:w-1/3 flex items-center gap-4 md:gap-6">
                                  <div className={`w-12 h-12 md:w-20 md:h-20 rounded-[20px] md:rounded-[28px] bg-gradient-to-br text-[#050521] flex items-center justify-center text-xl md:text-3xl font-black shadow-lg flex-shrink-0 ${activeTab === "aptitude" && item.status === "completed" ? "from-[#c6ff34] to-[#a3d628]" : "from-white/10 to-white/5 text-white/40"}`}>
                                     {(item.fullName || item.name || "?")[0].toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                     <h3 className="text-xl md:text-3xl font-black tracking-tighter truncate uppercase leading-tight">{item.fullName || item.name}</h3>
                                     <p className="text-[10px] md:text-xs font-bold text-white/40 truncate">{item.email}</p>
                                     <p className="text-[9px] md:text-[10px] font-black text-[#c6ff34] uppercase tracking-widest mt-1">{item.phone}</p>
                                  </div>
                               </div>

                               <div className="lg:w-1/3 grid grid-cols-2 gap-4 sm:gap-8 border-t lg:border-t-0 lg:border-x border-white/5 pt-8 lg:pt-0 lg:px-8">
                                  {activeTab === "aptitude" ? (
                                     <>
                                        <div>
                                           <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Score</p>
                                           <p className={`text-base md:text-xl font-black ${item.status === "completed" ? "text-[#c6ff34]" : "text-white/20"}`}>
                                             {item.status === "completed" ? `${item.score}/${item.totalQuestions}` : "PENDING"}
                                           </p>
                                        </div>
                                        <div>
                                           <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Accuracy</p>
                                           <p className={`text-base md:text-xl font-black ${item.status === "completed" ? "text-white" : "text-white/20"}`}>
                                             {item.status === "completed" ? `${item.accuracy}%` : "---"}
                                           </p>
                                        </div>
                                        <div>
                                           <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Time</p>
                                           <p className="text-xs md:text-sm font-black text-white truncate">
                                             {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : "N/A"}
                                           </p>
                                        </div>
                                        <div>
                                           <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Status</p>
                                           <p className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded inline-block ${item.status === "completed" ? "bg-[#c6ff34]/10 text-[#c6ff34]" : "bg-white/5 text-white/20"}`}>
                                             {item.status}
                                           </p>
                                        </div>
                                     </>
                                  ) : (
                                     <>
                                        <div className="col-span-1">
                                           <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">{activeTab === 'masters' ? 'Campus' : 'Institution'}</p>
                                           <p className="text-xs md:text-sm font-black uppercase text-white truncate">{item.institution || item.campus}</p>
                                        </div>
                                        <div className="col-span-1">
                                           <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">{activeTab === 'masters' ? 'Course' : 'Department'}</p>
                                           <p className="text-xs md:text-sm font-black uppercase text-white truncate">{item.department || item.course}</p>
                                        </div>
                                        <div>
                                           <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">{activeTab === 'masters' ? 'Year of Comp.' : 'Passing Year'}</p>
                                           <p className="text-xs md:text-sm font-black text-white">{item.passingYear || item.yearOfCompletion}</p>
                                        </div>
                                        <div>
                                           <p className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Date</p>
                                           <p className="text-xs md:text-sm font-black text-white truncate">
                                             {new Date((item.timestamp?.seconds || item.createdAt?.seconds) * 1000).toLocaleDateString()}
                                           </p>
                                        </div>
                                     </>
                                  )}
                               </div>

                               <div className="lg:w-1/3 flex flex-col justify-center space-y-3 border-t lg:border-t-0 pt-8 lg:pt-0">
                                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-[#c6ff34]/20 transition-all">
                                     <p className="text-[8px] md:text-[9px] font-black text-[#c6ff34] uppercase tracking-widest mb-1">Context</p>
                                     <p className="text-[10px] md:text-xs font-bold leading-relaxed line-clamp-2 text-white/60 italic">
                                       {activeTab === 'aptitude' ? (item.completedAt ? "Sync finalized." : "Awaiting sync...") : (item.interest || item.address || "Generic Entry")}
                                     </p>
                                  </div>
                               </div>
                            </div>
                         </motion.div>
                       ))
                    )}
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
      </main>
    </div>
  );
}

function AttendanceSection() {
  const [attendanceMode, setAttendanceMode] = useState("MASTER"); 
  const [scanning, setScanning] = useState(false);
  const [scannedName, setScannedName] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const result = attendanceMode === "MASTER" ? await getAttendanceList() : await getEventAttendanceList();
      setAttendanceData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [attendanceMode]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  useEffect(() => {
    let html5QrCode = null;
    
    if (scanning) {
      const startScannerWithRetry = () => {
        setTimeout(async () => {
          const element = document.getElementById("reader");
          if (!element) return;

          try {
            html5QrCode = new window.Html5Qrcode("reader");
            await html5QrCode.start(
              { facingMode: "environment" },
              { fps: 10, qrbox: { width: 250, height: 250 } },
              async (decodedText) => {
                try {
                  if (html5QrCode.getState() === 2) {
                    await html5QrCode.stop();
                  }
                  setScanning(false);
                  
                  let result;
                  if (attendanceMode === "MASTER") {
                    if (decodedText.startsWith("WORKSHOP_")) throw new Error("Workshop ticket. Switch mode!");
                    result = await markAttendance(decodedText);
                  } else {
                    if (!decodedText.startsWith("WORKSHOP_")) throw new Error("Master Class ticket. Switch mode!");
                    result = await markEventAttendance(decodedText);
                  }
                  
                  setScannedName(result.studentName);
                  setTimeout(() => setScannedName(null), 5000);
                  fetchAttendance();
                } catch (err) {
                  setScanError(err.message);
                  setTimeout(() => setScanError(null), 5000);
                  setScanning(false);
                }
              },
              () => {}
            );
          } catch (err) {
            console.error("Scanner failed:", err);
            setScanError("Camera access failed. Ensure HTTPS and permissions.");
            setScanning(false);
          }
        }, 300); 
      };

      if (!window.Html5Qrcode) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/html5-qrcode";
        script.onload = startScannerWithRetry;
        document.body.appendChild(script);
      } else {
        startScannerWithRetry();
      }
    }

    return () => {
      if (html5QrCode && html5QrCode.getState() === 2) { // 2 means SCANNING
        html5QrCode.stop().catch(e => console.log("Silent Cleanup:", e));
      }
    };
  }, [scanning, attendanceMode, fetchAttendance]);

  return (
    <div className="space-y-12">
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-white/5 border border-white/10 rounded-2xl">
          <button onClick={() => { setScanning(false); setAttendanceMode("MASTER"); }} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${attendanceMode === "MASTER" ? "bg-[#c6ff34] text-[#050521]" : "text-white/40"}`}>Master Class</button>
          <button onClick={() => { setScanning(false); setAttendanceMode("WORKSHOP"); }} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${attendanceMode === "WORKSHOP" ? "bg-[#c6ff34] text-[#050521]" : "text-white/40"}`}>AI Workshop</button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8">
        {!scanning ? (
          <div className="w-full max-w-md space-y-4">
             <button onClick={() => setScanning(true)} className="w-full py-8 md:py-12 bg-[#c6ff34] text-[#050521] rounded-[32px] md:rounded-[48px] flex flex-col items-center gap-4 hover:scale-[1.02] transition-all shadow-[0_30px_60px_rgba(198,255,52,0.2)]">
                <Icons.Camera className="w-12 h-12" />
                <span className="font-black uppercase tracking-[0.3em] text-sm md:text-xl">Open_{attendanceMode}_Scanner</span>
             </button>
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-white/[0.03] border border-white/10 rounded-[48px] p-4 md:p-12 overflow-hidden relative text-center">
            <div id="reader" className="w-full aspect-square rounded-[32px] overflow-hidden bg-black/40 mb-6" />
            <button onClick={() => setScanning(false)} className="w-full py-4 bg-white/5 text-white/40 font-black uppercase tracking-widest text-[10px] rounded-2xl border border-white/5 hover:text-white transition-all">Cancel_Capture</button>
          </div>
        )}

        <AnimatePresence>
          {scannedName && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-[#c6ff34] text-[#050521] px-10 py-5 rounded-full flex items-center gap-4 shadow-[0_0_50px_rgba(198,255,52,0.4)]">
              <Icons.UserCheck className="w-6 h-6" />
              <span className="font-black uppercase text-sm md:text-lg tracking-widest">Verified: {scannedName}</span>
            </motion.div>
          )}
          {scanError && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-[#ff3b3b]/20 border border-[#ff3b3b]/40 px-8 py-4 rounded-3xl text-[#ff3b3b] font-black uppercase text-xs tracking-widest text-center max-w-sm">
              {scanError}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter">{attendanceMode === 'MASTER' ? 'Master' : 'Workshop'} <span className="text-[#c6ff34]">Manifest</span></h3>
           <button onClick={fetchAttendance} className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-[#c6ff34] transition-colors flex items-center gap-2">
              <Icons.Refresh className="w-3 h-3" /> Refresh
           </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attendanceData.map((item, idx) => (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-[#c6ff34]/30 transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 text-white/20 flex items-center justify-center text-lg md:text-2xl font-black flex-shrink-0 group-hover:bg-[#c6ff34] group-hover:text-[#050521] transition-all">
                {(item.name || item.fullName || "?")[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-black uppercase tracking-tight truncate text-sm md:text-lg">{item.name || item.fullName}</p>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Entry: {new Date(item.attendedAt?.seconds * 1000).toLocaleTimeString()}</p>
              </div>
            </motion.div>
          ))}
          {!loading && attendanceData.length === 0 && (
            <div className="col-span-full py-20 text-center text-white/5 font-black uppercase tracking-[0.5em] border border-white/5 rounded-[40px]">No_Checkins_Recorded</div>
          )}
        </div>
      </div>
    </div>
  );
}
