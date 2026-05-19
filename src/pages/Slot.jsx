import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Background3D from "../components/Background3D";
import { saveSlotRegistration } from "../services/dbService";

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

export default function Slot() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    parentsName: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "fullName" || name === "parentsName") {
      if (value !== "" && !/^[a-zA-Z\s]*$/.test(value)) return;
    }
    
    if (name === "phone") {
      if (value !== "" && !/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const [paymentId, setPaymentId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error("Razorpay SDK failed to load.");

      const options = {
        key: "rzp_live_SnxCrKgLPqpHnz",
        amount: 3000 * 100, // 3000 INR in paise
        currency: "INR",
        name: "DEEPSTAQ",
        description: "Slot Booking",
        handler: async (response) => {
          try {
            setLoading(true);
            await saveSlotRegistration({
              ...formData,
              paymentId: response.razorpay_payment_id,
              status: "Paid"
            });
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
          name: formData.fullName,
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
      // Reset loading after modal opens
      setTimeout(() => setLoading(false), 1500);

    } catch (error) {
      console.error("Payment Error:", error);
      alert(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#050521] text-white selection:bg-[#c6ff34]/30">
      <Background3D />
      <Navbar />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(198,255,52,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,255,52,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent:80%)] pointer-events-none -z-10" />

      <main className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-20 md:pb-32 flex flex-col min-h-screen justify-center">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-[#c6ff34] transition-colors mb-6 md:mb-10 group uppercase text-[10px] md:text-sm font-black tracking-[0.2em] self-start"
        >
          <Icons.ArrowLeft /> Back
        </button>

        {/* Header */}
        <div className="mb-8 md:mb-12">
           <div className="flex items-end justify-between mb-3 md:mb-4">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                 BOOK <span className="text-[#c6ff34]">SLOT</span>
              </h1>
           </div>
           
           <div className="h-1 md:h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-[#c6ff34] shadow-[0_0_20px_rgba(198,255,52,0.6)] w-full" />
           </div>
        </div>

        <form onSubmit={handleSubmit} className="relative w-full">
          <AnimatePresence mode="wait">
            
            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 md:p-16 rounded-[32px] md:rounded-[48px] bg-white/[0.02] border border-[#c6ff34]/30 backdrop-blur-3xl text-center space-y-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 md:w-64 md:h-64 bg-[#c6ff34]/10 blur-[80px] pointer-events-none" />

                 <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#c6ff34] text-[#050521] flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(198,255,52,0.4)] relative z-10">
                    <Icons.Check />
                 </div>

                 <div className="space-y-3">
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Slot <span className="text-[#c6ff34]">Booked!</span></h2>
                    <p className="text-slate-400 text-xs md:text-sm font-bold tracking-widest uppercase">We will contact you shortly</p>
                    
                    <div className="bg-[#050521]/50 border border-white/10 rounded-2xl p-4 max-w-xs mx-auto space-y-3 mt-6 text-left shadow-inner">
                       <div className="flex justify-between items-center border-b border-white/5 pb-2">
                         <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40">Mode</span>
                         <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white">Online Payment</span>
                       </div>
                       <div className="flex justify-between items-center border-b border-white/5 pb-2">
                         <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40">Status</span>
                         <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#c6ff34]">Paid</span>
                       </div>
                       {paymentId && (
                         <div className="flex justify-between items-center">
                           <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40">Ref ID</span>
                           <span className="text-[10px] md:text-xs font-black tracking-widest text-[#c6ff34] truncate max-w-[120px]">{paymentId}</span>
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="max-w-xs mx-auto space-y-4 pt-4">
                    <button 
                      onClick={() => navigate("/")}
                      className="w-full py-3 bg-[#c6ff34] text-[#050521] font-black text-xs md:text-sm uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-[0_10px_30px_rgba(198,255,52,0.3)]"
                    >
                      Return Home
                    </button>
                 </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-6"
              >
                <div className="p-6 sm:p-8 md:p-10 rounded-[24px] md:rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-xl">
                   <h2 className="text-base md:text-2xl font-black uppercase mb-6 md:mb-8 flex items-center gap-3">
                      <span className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#c6ff34]/10 text-[#c6ff34] flex items-center justify-center text-xs md:text-lg">1</span>
                      Slot Details
                   </h2>
                   
                   <div className="space-y-5 md:space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2">Full Name</label>
                          <input 
                            type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-base shadow-inner"
                            placeholder="Your Name" required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2">Phone Number</label>
                          <input 
                            type="tel" name="phone" value={formData.phone} onChange={handleChange}
                            pattern="[0-9]{10}" title="Phone number must be exactly 10 digits" maxLength={10}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-base shadow-inner"
                            placeholder="10-digit mobile number" required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2">Parent's Name</label>
                        <input 
                          type="text" name="parentsName" value={formData.parentsName} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-sm md:text-base shadow-inner"
                          placeholder="Parent's Name" required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2">Address</label>
                        <textarea 
                          name="address" value={formData.address} onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold min-h-[100px] md:min-h-[120px] text-sm md:text-base shadow-inner resize-y"
                          placeholder="Your full address..." required
                        />
                      </div>
                   </div>
                </div>
                <div className="flex pt-2">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#c6ff34] text-[#050521] font-black py-4 md:py-5 rounded-xl md:rounded-2xl uppercase tracking-[0.2em] text-xs md:text-sm shadow-[0_15px_40px_rgba(198,255,52,0.25)] hover:shadow-[0_20px_50px_rgba(198,255,52,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Pay ₹3000 & Book Slot"} <Icons.Check />
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
