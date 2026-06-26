import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { 
  getSlotRegistrations, 
  getEventRegistrations, 
  getMasterRegistrations, 
  getAptitudeLeads,
  getCollectedContacts,
  getUploadedContactFiles,
  getWebinarRegistrations
} from "../../services/dbService";

const DataCard = ({ item, headers }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mainKeywords = ["name", "email", "phone", "course", "institution", "year"];
  
  const mainHeaders = headers.filter(h => mainKeywords.some(kw => h.toLowerCase().includes(kw)));
  let topHeaders = mainHeaders.length > 0 ? mainHeaders : headers.slice(0, 4);
  
  // Sort topHeaders to ensure Name, Email, and Phone are at the very top
  const getPriority = (h) => {
    const lower = h.toLowerCase();
    if (lower === "name" || lower.includes("name")) return 1;
    if (lower === "email" || lower.includes("email")) return 2;
    if (lower.includes("phone") || lower.includes("number")) return 3;
    if (lower.includes("institution")) return 4;
    if (lower.includes("course")) return 5;
    if (lower.includes("year")) return 6;
    return 10;
  };
  
  topHeaders = [...topHeaders].sort((a, b) => getPriority(a) - getPriority(b));
  
  const extraHeaders = headers.filter(h => !topHeaders.includes(h));

  const renderField = (h) => {
    let val = item[h];
    if (val && typeof val === "object") {
      if (val.seconds !== undefined) {
        val = new Date(val.seconds * 1000).toLocaleString();
      } else if (Array.isArray(val)) {
        if (h === "contacts") {
          val = val.map(c => (typeof c === "object" ? (c.phone || c.number || Object.values(c)[0]) : c)).join(", ");
        } else {
          val = `[Array: ${val.length} items]`;
        }
      } else {
        val = JSON.stringify(val);
      }
    } else if (typeof val === "boolean") {
      val = val ? "Yes" : "No";
    } else if (val === null || val === undefined || val === "") {
      val = "-";
    }
    
    let displayVal = String(val);
    if (!isExpanded && displayVal.length > 80 && !displayVal.includes("http")) {
      displayVal = displayVal.substring(0, 80) + "...";
    }

    return (
      <div key={h} className="flex flex-col gap-1.5">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#050521]/40">{h.replace(/_/g, " ")}</span>
        <span className="text-sm font-medium text-[#050521] break-words">
          {displayVal.includes("http") ? (
            <a href={displayVal} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-[#c6ff34] underline decoration-blue-300 hover:decoration-[#c6ff34] underline-offset-4 transition-colors">Link</a>
          ) : (
            displayVal
          )}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white border border-[#050521]/10 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-[#c6ff34]/50 transition-all duration-300 h-fit flex flex-col">
      <div className="flex justify-between items-center mb-5 pb-5 border-b border-[#050521]/5">
        <span className="font-mono text-[10px] text-[#050521]/40 uppercase tracking-widest">ID: {item.id.slice(0, 8)}</span>
        <span className="text-[10px] font-bold text-[#050521]/70 bg-[#f8f9fa] px-3 py-1.5 rounded-xl border border-[#050521]/5">
          {item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleDateString() : "-"}
        </span>
      </div>
      
      <div className="space-y-4 flex-grow">
        {topHeaders.map(renderField)}
        
        {isExpanded && extraHeaders.length > 0 && (
          <div className="pt-5 border-t border-[#050521]/5 space-y-4 mt-5 animate-in slide-in-from-top-2 fade-in duration-300">
            {extraHeaders.map(renderField)}
          </div>
        )}
      </div>

      {extraHeaders.length > 0 && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="mt-6 w-full py-3 rounded-xl bg-slate-50 hover:bg-[#c6ff34]/20 text-[#050521] text-[10px] font-black uppercase tracking-widest transition-colors duration-300 border border-[#050521]/5"
        >
          {isExpanded ? "Show Less" : "See More"}
        </button>
      )}
    </div>
  );
};

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const [slotData, setSlotData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [aptitudeData, setAptitudeData] = useState([]);
  const [collectedData, setCollectedData] = useState([]);
  const [uploadedData, setUploadedData] = useState([]);
  const [webinarData, setWebinarData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState("slot");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const adminDoc = await getDoc(doc(db, "admins", currentUser.email));
          if (adminDoc.exists() && adminDoc.data().role === "admin") {
            setUser(currentUser);
            fetchData();
          } else {
            await signOut(auth);
            alert("Access Denied: You do not have admin privileges.");
            navigate("/admin/login");
          }
        } catch (error) {
          console.error("Error verifying admin status:", error);
          await signOut(auth);
          navigate("/admin/login");
        }
      } else {
        navigate("/admin/login");
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [slots, events, masters, aptitudes, collected, uploaded, webinars] = await Promise.all([
        getSlotRegistrations(),
        getEventRegistrations(),
        getMasterRegistrations(),
        getAptitudeLeads(),
        getCollectedContacts(),
        getUploadedContactFiles(),
        getWebinarRegistrations()
      ]);
      setSlotData(slots);
      setEventData(events);
      setMasterData(masters);
      setAptitudeData(aptitudes);
      setCollectedData(collected);
      setUploadedData(uploaded);
      setWebinarData(webinars);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  const downloadCSV = () => {
    const data = getActiveData();
    if (data.length === 0) return alert("No data to download in this tab.");

    const allKeys = new Set();
    data.forEach(item => Object.keys(item).forEach(k => allKeys.add(k)));
    const headers = Array.from(allKeys).filter(k => k !== "id");
    headers.unshift("id");

    const csvRows = [];
    csvRows.push(headers.join(","));

    data.forEach(item => {
      const row = headers.map(header => {
        let val = item[header];
        if (val && typeof val === "object" && val.seconds !== undefined) {
          val = new Date(val.seconds * 1000).toLocaleString();
        } else if (typeof val === "object") {
          val = JSON.stringify(val);
        } else if (val === null || val === undefined) {
          val = "";
        }
        
        let stringVal = String(val).replace(/"/g, '""');
        return `"${stringVal}"`;
      });
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeTab}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="w-8 h-8 border-4 border-[#050521] border-t-[#c6ff34] rounded-full animate-spin" />
      </div>
    );
  }

  const renderCards = (data) => {
    if (data.length === 0) {
      return <p className="text-center py-10 text-[#050521]/50 font-bold uppercase tracking-widest">No registrations found.</p>;
    }
    
    // Extract headers from the first item, excluding unwanted fields if necessary
    const headers = Object.keys(data[0]).filter(k => k !== "timestamp" && k !== "id");
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        {data.map((item) => (
          <DataCard key={item.id} item={item} headers={headers} />
        ))}
      </div>
    );
  };

  const getActiveData = () => {
    if (activeTab === "slot") return slotData;
    if (activeTab === "event") return eventData;
    if (activeTab === "master") return masterData;
    if (activeTab === "aptitude") return aptitudeData;
    if (activeTab === "collected") return collectedData;
    if (activeTab === "uploaded") return uploadedData;
    if (activeTab === "webinar") return webinarData;

    return slotData;
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "slot": return "Slot Registrations";
      case "event": return "Event Entry";
      case "master": return "Master Class";
      case "aptitude": return "Aptitude Leads";
      case "collected": return "Collected Contacts";
      case "uploaded": return "Uploaded Files";
      case "webinar": return "Webinar Registrations";
      default: return "Dashboard";
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f4f6f8] overflow-hidden text-[#050521]">
      
      {/* Sidebar */}
      <aside className="w-full md:w-[320px] bg-[#050521] text-white flex flex-col flex-shrink-0 z-20 shadow-2xl overflow-hidden h-auto md:h-screen">
        
        {/* Logo Area */}
        <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center md:block flex-shrink-0">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#c6ff34] shadow-[0_0_15px_#c6ff34] animate-pulse"></span>
              Admin Console
            </h1>
            <p className="text-white/40 font-bold uppercase tracking-widest text-[9px] mt-2 hidden md:block">Manage your data securely</p>
          </div>
          
          {/* Mobile Actions */}
          <div className="flex md:hidden gap-3">
             <button onClick={downloadCSV} className="px-4 py-2 bg-[#c6ff34] text-[#050521] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">Export</button>
             <button onClick={handleLogout} className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">Exit</button>
          </div>
        </div>
        
        {/* Navigation Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-x-hidden hide-scrollbar">
          <div className="hidden md:block mb-4 px-2">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Collections</h3>
          </div>
          
          <button 
             onClick={() => setActiveTab("slot")}
             className={`flex-shrink-0 md:w-full text-left px-5 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] transition-all flex justify-between items-center gap-4 ${activeTab === "slot" ? "bg-[#c6ff34] text-[#050521] shadow-[0_4px_20px_rgba(198,255,52,0.15)]" : "bg-transparent text-white/60 hover:bg-white/10"}`}
          >
             <span>Slot Registrations</span>
             <span className={`px-2.5 py-1 rounded-md text-[9px] ${activeTab === "slot" ? "bg-[#050521]/10 text-[#050521]" : "bg-white/10 text-white"}`}>{slotData.length}</span>
          </button>

          <button 
             onClick={() => setActiveTab("event")}
             className={`flex-shrink-0 md:w-full text-left px-5 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] transition-all flex justify-between items-center gap-4 ${activeTab === "event" ? "bg-[#c6ff34] text-[#050521] shadow-[0_4px_20px_rgba(198,255,52,0.15)]" : "bg-transparent text-white/60 hover:bg-white/10"}`}
          >
             <span>Event Entry</span>
             <span className={`px-2.5 py-1 rounded-md text-[9px] ${activeTab === "event" ? "bg-[#050521]/10 text-[#050521]" : "bg-white/10 text-white"}`}>{eventData.length}</span>
          </button>

          <button 
             onClick={() => setActiveTab("master")}
             className={`flex-shrink-0 md:w-full text-left px-5 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] transition-all flex justify-between items-center gap-4 ${activeTab === "master" ? "bg-[#c6ff34] text-[#050521] shadow-[0_4px_20px_rgba(198,255,52,0.15)]" : "bg-transparent text-white/60 hover:bg-white/10"}`}
          >
             <span>Master Class</span>
             <span className={`px-2.5 py-1 rounded-md text-[9px] ${activeTab === "master" ? "bg-[#050521]/10 text-[#050521]" : "bg-white/10 text-white"}`}>{masterData.length}</span>
          </button>

          <div className="hidden md:block my-2 border-t border-white/5"></div>

          <button 
             onClick={() => setActiveTab("aptitude")}
             className={`flex-shrink-0 md:w-full text-left px-5 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] transition-all flex justify-between items-center gap-4 ${activeTab === "aptitude" ? "bg-[#c6ff34] text-[#050521] shadow-[0_4px_20px_rgba(198,255,52,0.15)]" : "bg-transparent text-white/60 hover:bg-white/10"}`}
          >
             <span>Aptitude Leads</span>
             <span className={`px-2.5 py-1 rounded-md text-[9px] ${activeTab === "aptitude" ? "bg-[#050521]/10 text-[#050521]" : "bg-white/10 text-white"}`}>{aptitudeData.length}</span>
          </button>

          <button 
             onClick={() => setActiveTab("collected")}
             className={`flex-shrink-0 md:w-full text-left px-5 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] transition-all flex justify-between items-center gap-4 ${activeTab === "collected" ? "bg-[#c6ff34] text-[#050521] shadow-[0_4px_20px_rgba(198,255,52,0.15)]" : "bg-transparent text-white/60 hover:bg-white/10"}`}
          >
             <span>Collected Contacts</span>
             <span className={`px-2.5 py-1 rounded-md text-[9px] ${activeTab === "collected" ? "bg-[#050521]/10 text-[#050521]" : "bg-white/10 text-white"}`}>{collectedData.length}</span>
          </button>

          <button 
             onClick={() => setActiveTab("webinar")}
             className={`flex-shrink-0 md:w-full text-left px-5 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] transition-all flex justify-between items-center gap-4 ${activeTab === "webinar" ? "bg-[#c6ff34] text-[#050521] shadow-[0_4px_20px_rgba(198,255,52,0.15)]" : "bg-transparent text-white/60 hover:bg-white/10"}`}
          >
             <span>Webinar Entry</span>
             <span className={`px-2.5 py-1 rounded-md text-[9px] ${activeTab === "webinar" ? "bg-[#050521]/10 text-[#050521]" : "bg-white/10 text-white"}`}>{webinarData.length}</span>
          </button>

        </div>

        {/* Desktop User Profile Area */}
        <div className="hidden md:block p-6 border-t border-white/10 mt-auto flex-shrink-0">
           <div className="bg-white/5 rounded-2xl p-5 backdrop-blur-sm border border-white/5">
             <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">Signed in as</p>
             <p className="text-xs text-white font-medium truncate mb-5">{user?.email}</p>
             <div className="flex gap-3">
               <button 
                 onClick={downloadCSV} 
                 className="flex-1 py-3 bg-[#c6ff34]/10 text-[#c6ff34] border border-[#c6ff34]/20 hover:bg-[#c6ff34] hover:text-[#050521] hover:border-[#c6ff34] rounded-xl text-[9px] font-black uppercase tracking-[0.1em] transition-all"
               >
                 Export
               </button>
               <button 
                 onClick={handleLogout} 
                 className="flex-1 py-3 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] transition-all"
               >
                 Logout
               </button>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[calc(100vh-88px)] md:h-screen overflow-hidden relative bg-[#f4f6f8]">
        
        {/* Desktop Top Header (Hidden on Mobile) */}
        <header className="hidden md:flex h-24 bg-white/50 backdrop-blur-md border-b border-[#050521]/5 items-center justify-between px-10 flex-shrink-0 z-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#050521]">
              {getTabTitle()}
            </h2>
            <p className="text-[#050521]/40 font-bold uppercase tracking-widest text-[10px] mt-1">
              Currently viewing {getActiveData().length} records
            </p>
          </div>
        </header>

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 relative">
          
          {/* Mobile Title (Hidden on Desktop) */}
          <div className="md:hidden mb-6 px-2">
            <h2 className="text-2xl font-black tracking-tight text-[#050521]">{getTabTitle()}</h2>
            <p className="text-[#050521]/40 font-bold uppercase tracking-widest text-[9px] mt-1">
              {getActiveData().length} records found
            </p>
          </div>

          {loadingData ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 h-full">
              <div className="w-10 h-10 border-4 border-[#050521]/10 border-t-[#c6ff34] rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/40">Fetching Data...</p>
            </div>
          ) : (
            renderCards(getActiveData())
          )}
        </div>
      </main>

    </div>
  );
}

export default AdminDashboard;
