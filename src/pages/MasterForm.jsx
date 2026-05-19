import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Background3D from "../components/Background3D";
import { saveMasterRegistration, getMasterRegistrations, checkMasterRegistrationExists, updateCourseInterest } from "../services/dbService";

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
  Clock: ({ className }) => (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
};

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.id = "razorpay-sdk";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function MasterForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [registrationCount, setRegistrationCount] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(249);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    course: "",
    campus: "",
    year: "",
    yearOfCompletion: ""
  });
  const [docId, setDocId] = useState(null);
  const [enrollInterested, setEnrollInterested] = useState(false);

  const targetDate = new Date("May 25, 2026 09:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const checkRegistrations = async () => {
      try {
        const registrations = await getMasterRegistrations();
        const count = registrations.length;
        setRegistrationCount(count);
        
        const now = new Date();
        const may21st = new Date("May 21, 2026 00:00:00");

        if (count < 50) {
          setCurrentPrice(0);
        } else if (now < may21st) {
          setCurrentPrice(49);
        } else {
          setCurrentPrice(249);
        }
      } catch (err) {
        console.error("Count Check Error:", err);
      }
    };
    checkRegistrations();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Strict Validation Rules
    if (name === "name") {
      // Allow only letters and spaces
      if (value !== "" && !/^[a-zA-Z\s]*$/.test(value)) return;
    }
    
    if (name === "phone") {
      if (value !== "" && !/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }
    

    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${paymentId}&color=050521`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `DeepStaq_Ticket_${paymentId.slice(-6)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download ticket. Please take a screenshot instead.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const exists = await checkMasterRegistrationExists(formData.phone);
      if (exists) {
        alert("This mobile number is already registered for the Master Class.");
        setLoading(false);
        return;
      }

      // 1. FINAL CHECK: Get latest count & date to be 100% fair
      const registrations = await getMasterRegistrations();
      const latestCount = registrations.length;
      const now = new Date();
      const may21st = new Date("May 21, 2026 00:00:00");
      
      let finalPrice = 249;
      if (latestCount < 50) finalPrice = 0;
      else if (now < may21st) finalPrice = 49;
      else finalPrice = 249;

      // Update UI state
      setRegistrationCount(latestCount);
      setCurrentPrice(finalPrice);

      // 2. If FREE -> Save directly
      if (finalPrice === 0) {
        const freeId = "FREE_ENTRY_" + Math.random().toString(36).substring(7).toUpperCase();
        const res = await saveMasterRegistration({
          ...formData,
          paymentId: freeId,
          status: "Free_Entry",
          enrolledInAICourse: "No", // Initial state
          timestamp: new Date()
        });
        setDocId(res.id);
        setPaymentId(freeId);
        setSuccess(true);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // 3. Load Razorpay for others
      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error("Razorpay SDK failed to load.");

      const options = {
        key: "rzp_live_SnxCrKgLPqpHnz",
        amount: finalPrice * 100, // Dynamic Price in paise
        currency: "INR",
        name: "DEEPSTAQ AI/ML",
        description: "Master Class Registration",
        handler: async (response) => {
          try {
            setLoading(true);
            // 3. Save to Firestore only AFTER payment success
            const res = await saveMasterRegistration({
              ...formData,
              paymentId: response.razorpay_payment_id,
              status: "Paid",
              enrolledInAICourse: "No", // Initial state
              timestamp: new Date()
            });
            setDocId(res.id);
            setPaymentId(response.razorpay_payment_id);
            setSuccess(true);
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } catch (err) {
            console.error("Firestore Error:", err);
            alert("Payment successful but failed to save data. Please contact support.");
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#c6ff34"
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      // Reset loading after modal opens so user isn't stuck if they close it
      setTimeout(() => setLoading(false), 1500);

    } catch (error) {
      console.error("Payment Error:", error);
      alert(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050521] text-white selection:bg-[#c6ff34]/30">
      <Background3D />
      <Navbar />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(198,255,52,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,255,52,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent:80%)] pointer-events-none -z-10" />

      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-24 md:pt-40 pb-20 md:pb-32">
        
        {/* Top Header Row & Progress (Hide on Success) */}
        {!success && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
              <button 
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 text-white/40 hover:text-[#c6ff34] transition-colors group uppercase text-[9px] md:text-xs font-black tracking-[0.2em] md:tracking-[0.3em]"
              >
                <Icons.ArrowLeft /> Back to Selection
              </button>

              <div className="flex items-center gap-4 md:gap-6 bg-white/[0.03] border border-white/10 px-4 py-2 md:px-6 md:py-3 rounded-full backdrop-blur-xl shadow-2xl">
                 <div className="flex flex-col">
                    <span className="text-[7px] md:text-[9px] text-[#c6ff34] font-black uppercase tracking-widest leading-none mb-1">OFFER</span>
                    <span className="text-[#c6ff34] font-black text-xs md:text-xl leading-none uppercase">
                      {registrationCount < 50 ? "FREE" : (currentPrice === 49 ? "EARLY BIRD" : "STANDARD")}
                    </span>
                 </div>
                 <div className="w-[1px] h-6 md:h-8 bg-white/10" />
                 <div className="flex flex-col">
                    <span className="text-[7px] md:text-[9px] text-[#c6ff34] font-black uppercase tracking-widest leading-none mb-1">PRICE</span>
                    <span className="text-[#c6ff34] font-black text-xs md:text-xl leading-none uppercase">₹{currentPrice}</span>
                 </div>
                 <div className="w-[1px] h-6 md:h-8 bg-white/10" />
                 <div className="flex flex-col">
                    <span className="text-[7px] md:text-[9px] text-[#c6ff34] font-black uppercase tracking-widest leading-none mb-1">BALANCE</span>
                    <span className="text-[#c6ff34] font-black text-xs md:text-xl leading-none uppercase">
                      {Math.max(0, 50 - registrationCount)} FREE
                    </span>
                 </div>
                 <div className="w-[1px] h-6 md:h-8 bg-white/10" />
                 <div className="flex items-center gap-2 md:gap-3">
                    <Icons.Clock className="text-[#c6ff34] w-3 h-3 md:w-5 md:h-5" />
                    <span className="text-[10px] md:text-lg font-black tabular-nums text-[#c6ff34]">
                      {timeLeft.days}D:{timeLeft.hours}H:{timeLeft.minutes}M
                    </span>
                 </div>
              </div>
            </div>

            <div className="mb-8 md:mb-16">
               <div className="flex items-end justify-between mb-3 md:mb-6">
                  <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                     MASTER <span className="text-[#c6ff34]">CLASS</span>
                  </h1>
                  <span className="text-[#c6ff34] font-black text-[10px] md:text-lg bg-[#c6ff34]/10 px-3 py-1.5 md:px-5 md:py-2 rounded-full border border-[#c6ff34]/20 shadow-2xl uppercase tracking-widest">
                    STEP 0{step}/02
                  </span>
               </div>
               
               <div className="h-1.5 md:h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${(step / 2) * 100}%` }}
                    className="h-full bg-[#c6ff34] shadow-[0_0_25px_rgba(198,255,52,0.6)]"
                  />
               </div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <AnimatePresence mode="wait">
            
            {/* Success View */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 md:p-12 rounded-[32px] md:rounded-[48px] bg-white/[0.02] border border-[#c6ff34]/30 backdrop-blur-3xl text-center space-y-6 md:space-y-8"
              >
                 <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#c6ff34] text-[#050521] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(198,255,52,0.4)]">
                    <Icons.Check />
                 </div>
                 
                 <div className="space-y-2">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
                       Registration <span className="text-[#c6ff34]">Successful!</span>
                    </h2>
                    <p className="text-white/40 text-xs md:text-lg font-bold uppercase tracking-widest">Master Class Admission Confirmed</p>
                 </div>

                 {/* QR Code Section */}
                 <div className="flex flex-col items-center gap-6">
                    <div className="bg-white p-4 md:p-8 rounded-[24px] md:rounded-[40px] inline-block shadow-[0_0_100px_rgba(198,255,52,0.15)] group relative">
                        <div className="absolute -inset-4 bg-[#c6ff34]/10 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${paymentId}&color=050521`}
                          alt="Attendance QR Code"
                          className="w-40 h-40 md:w-64 md:h-64 relative z-10"
                        />
                    </div>
                    
                    <button 
                      onClick={handleDownloadQR}
                      className="flex items-center gap-2 text-[#c6ff34] font-black uppercase text-[10px] md:text-sm tracking-widest hover:opacity-70 transition-opacity border-b-2 border-[#c6ff34]/20 pb-1"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="md:w-5 md:h-5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download Admission Ticket
                    </button>
                 </div>

                 {/* AI/ML Course Enrollment Section */}
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.5 }}
                   className="max-w-md mx-auto p-6 md:p-8 rounded-[32px] bg-[#c6ff34]/5 border border-[#c6ff34]/20 backdrop-blur-xl relative overflow-hidden group mb-8"
                 >
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                    </div>
                    
                    <div className="flex items-center gap-4 text-left relative z-10">
                      <div className="flex-1">
                        <h4 className="text-[#c6ff34] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mb-1">Exclusive Offer</h4>
                        <p className="text-white text-sm md:text-lg font-bold leading-tight">
                          Would you like to enroll in our 6-month AI/ML course?
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={enrollInterested}
                          onChange={async (e) => {
                            const val = e.target.checked;
                            setEnrollInterested(val);
                            if (docId) {
                              try {
                                await updateCourseInterest("master_registrations", docId, val);
                              } catch (err) {
                                console.error("Update failed:", err);
                              }
                            }
                          }}
                        />
                        <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-[#c6ff34]"></div>
                      </label>
                    </div>
                 </motion.div>

                 <div className="pt-4 md:pt-8 space-y-4 max-w-md mx-auto">
                    <motion.a 
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }} 
                      href="https://chat.whatsapp.com/Dzoj3jm5CS67qstRjw54gz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-5 md:py-8 bg-[#25D366] text-white font-black text-xs md:text-xl uppercase tracking-[0.2em] rounded-2xl md:rounded-[32px] flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(37,211,102,0.3)]"
                    >
                      <svg className="w-5 h-5 md:w-8 md:h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      JOIN WHATSAPP GROUP
                    </motion.a>

                    <button 
                      onClick={() => navigate("/")}
                      className="w-full bg-white/5 border border-white/10 text-white/40 font-black py-4 md:py-6 rounded-2xl md:rounded-[32px] uppercase tracking-[0.2em] text-[10px] md:text-sm hover:text-[#c6ff34] transition-all"
                    >
                      Back to Home
                    </button>
                 </div>
              </motion.div>
            )}

            {/* Step 1: Personal Details */}
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
                      Personal Details
                   </h2>
                   
                   <div className="space-y-4 md:space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                        <div className="space-y-1.5 md:space-y-4">
                          <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">Name</label>
                          <input 
                            type="text" name="name" value={formData.name} onChange={handleChange}
                            pattern="[A-Za-z\s]+" title="Name should only contain letters"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-2xl shadow-xl"
                            placeholder="Full Name" required
                          />
                        </div>
                        <div className="space-y-1.5 md:space-y-4">
                          <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">Phone Number</label>
                          <input 
                            type="tel" name="phone" value={formData.phone} onChange={handleChange}
                            pattern="[0-9]{10}" title="Phone number must be exactly 10 digits" maxLength={10}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-2xl shadow-xl"
                            placeholder="10-digit mobile number" required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5 md:space-y-4">
                        <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">Mail ID</label>
                        <input 
                          type="email" name="email" value={formData.email} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-2xl shadow-xl"
                          placeholder="example@mail.com" required
                        />
                      </div>
                      <div className="space-y-1.5 md:space-y-4">
                        <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">Address</label>
                        <textarea 
                          name="address" value={formData.address} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold min-h-[80px] md:min-h-[120px] text-sm md:text-2xl"
                          placeholder="Your full address..." required
                        />
                      </div>
                   </div>
                </div>
                <button 
                  type="button" onClick={nextStep}
                  className="w-full bg-white text-[#050521] font-black py-4 md:py-8 rounded-xl md:rounded-[32px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-xs md:text-lg hover:shadow-[0_20px_50px_rgba(198,255,52,0.3)] transition-all active:scale-[0.98]"
                >
                  Proceed to Professional Details
                </button>
              </motion.div>
            )}

            {/* Step 2: Professional Details */}
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
                      Academic & Course Details
                   </h2>
                   
                   <div className="space-y-4 md:space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                        <div className="space-y-1.5 md:space-y-4">
                          <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">Course</label>
                          <input 
                            type="text" name="course" value={formData.course} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-2xl"
                            placeholder="e.g. B.Tech / BCA" required
                          />
                        </div>
                        <div className="space-y-1.5 md:space-y-4">
                          <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">Campus</label>
                          <input 
                            type="text" name="campus" value={formData.campus} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-2xl"
                            placeholder="Institution Name" required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                        <div className="space-y-1.5 md:space-y-4">
                          <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">Year of Study</label>
                          <input 
                            type="text" name="year" value={formData.year} onChange={handleChange}
                           
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-2xl"
                            placeholder="" required
                          />
                        </div>
                        <div className="space-y-1.5 md:space-y-4">
                          <label className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2 md:ml-4">Year of Completion</label>
                          <input 
                            type="text" name="yearOfCompletion" value={formData.yearOfCompletion} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-[24px] px-5 py-3.5 md:px-8 md:py-6 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-2xl"
                            placeholder="" required
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
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-[#c6ff34] text-[#050521] font-black py-4 md:py-8 rounded-xl md:rounded-[32px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-lg shadow-[0_20px_50px_rgba(198,255,52,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 md:gap-3 active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? "Processing..." : (currentPrice === 0 ? "Claim Free Seat" : (currentPrice === 49 ? "Get Early Bird ₹49" : "Complete Registration ₹249"))} <Icons.Check />
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
