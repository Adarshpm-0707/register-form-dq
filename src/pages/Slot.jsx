import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { saveSlotRegistration } from "../services/dbService";
import Background3D from "../components/Background3D";
import WaterBubbles from "../components/WaterBubbles";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const modules = [
  { icon: "🐍", label: "Python Foundations" },
  { icon: "📐", label: "Math & Statistics" },
  { icon: "🤖", label: "Machine Learning" },
  { icon: "🧠", label: "Deep Learning & NLP" },
  { icon: "✨", label: "Generative AI" },
  { icon: "⚙️", label: "MLOps" },
  { icon: "🕵️", label: "Agentic AI" },
];

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] md:text-[11px] font-black text-[#050521] uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function Slot() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [payId, setPayId] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    parentsName: "",
    address: "",
  });

  const change = (e) => {
    const { name, value } = e.target;
    if ((name === "fullName" || name === "parentsName") && value && !/^[a-zA-Z\s]*$/.test(value)) return;
    if (name === "phone") {
      if (value && !/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }
    setForm({ ...form, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Razorpay failed to load");

      const rzp = new window.Razorpay({
        key: "rzp_live_SnxCrKgLPqpHnz",
        amount: 300000, 
        currency: "INR",
        name: "DEEPSTAQ",
        description: "Slot Booking - AI/ML Diploma",
        handler: async (res) => {
          try {
            await saveSlotRegistration({
              ...form,
              paymentId: res.razorpay_payment_id,
              status: "Paid",
            });
            setPayId(res.razorpay_payment_id);
            setSuccess(true);
            setLoading(false);
          } catch {
            alert("Save failed - contact support.");
            setLoading(false);
          }
        },
        prefill: { name: form.fullName, contact: form.phone },
        theme: { color: "#050521" },
        modal: { ondismiss: () => setLoading(false) },
      });

      rzp.open();
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#050521] overflow-x-hidden font-sans">
      <Background3D />
      <WaterBubbles />

      {/* 
          pt-28 ensures content starts below the navigation bar on mobile.
          pt-40 ensures content starts below the navigation bar on desktop.
      */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-5 pt-28 pb-12 md:pt-40 md:px-12 md:pb-24">
        <AnimatePresence mode="wait">
          {success ? (
            /* ════ SUCCESS VIEW ════ */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[50vh] text-center"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-[#c6ff34] border-4 border-[#050521] rounded-full flex items-center justify-center text-3xl md:text-4xl mb-6 md:mb-8 shadow-[6px_6px_0px_0px_#050521]">
                ✓
              </div>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                Seat <span className="text-stroke-dark">Secured.</span>
              </h1>
              <p className="font-mono text-xs md:text-sm text-slate-500 mb-8 md:mb-10 max-w-md">
                Welcome to the cohort. A confirmation email and pre-course roadmap have been sent to your device.
              </p>
              
              <div className="bg-white border-2 border-[#050521] p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-[8px_8px_0px_0px_#c6ff34] text-left w-full max-w-md">
                <div className="space-y-4 font-mono text-xs md:text-sm">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 uppercase">Student</span>
                    <span className="font-bold">{form.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 uppercase">Amount</span>
                    <span className="font-bold">₹3,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 uppercase">Ref ID</span>
                    <span className="font-bold text-[9px] md:text-[10px] break-all ml-4">{payId}</span>
                  </div>
                </div>
              </div>

              <Link to="/" className="mt-10">
                <button className="px-10 py-4 bg-[#050521] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#c6ff34] hover:text-[#050521] transition-all shadow-[6px_6px_0px_0px_#050521]">
                  Back to Home
                </button>
              </Link>
            </motion.div>
          ) : (
            /* ════ MAIN REGISTRATION VIEW ════ */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              
              {/* LEFT COLUMN: INFO */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-8 md:space-y-10"
              >
                <div>
                  <h1 className="text-4xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-4 md:mb-6">
                    Reserve <br />
                    <span className="text-stroke-dark">Your Slot.</span>
                  </h1>
                  <p className="text-slate-500 font-mono text-xs md:text-sm max-w-md leading-relaxed">
                    Join the most intensive AI engineering diploma. Secure your seat with a refundable deposit and start your journey today.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {modules.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 md:p-4 bg-slate-50 border-2 border-[#050521] rounded-xl md:rounded-2xl group hover:bg-[#c6ff34] transition-colors">
                      <span className="text-xl md:text-2xl">{m.icon}</span>
                      <span className="font-black uppercase text-[9px] md:text-[10px] tracking-widest">{m.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* RIGHT COLUMN: FORM */}
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="relative"
              >
                <div className="bg-white border-2 border-[#050521] rounded-2xl md:rounded-[2.5rem] p-6 md:p-12 shadow-[10px_10px_0px_0px_#c6ff34]">
                  <div className="mb-8 md:mb-10 flex justify-between items-end">
                    <div>
                      <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Booking Amount</span>
                      <div className="text-3xl md:text-4xl font-black">₹3,000</div>
                    </div>
                  </div>

                  <form onSubmit={submit} className="space-y-5 md:space-y-6">
                    <Field label="Full Name">
                      <input
                        name="fullName"
                        value={form.fullName}
                        onChange={change}
                        placeholder="Full Name"
                        required
                        className="w-full bg-slate-50 border-2 border-[#050521] rounded-xl px-4 py-3 md:px-5 md:py-4 font-bold focus:bg-white focus:shadow-[4px_4px_0px_0px_#050521] transition-all outline-none text-sm md:text-base"
                      />
                    </Field>

                    <Field label="WhatsApp Phone">
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={change}
                        placeholder="10-digit number"
                        pattern="[0-9]{10}"
                        required
                        className="w-full bg-slate-50 border-2 border-[#050521] rounded-xl px-4 py-3 md:px-5 md:py-4 font-bold focus:bg-white focus:shadow-[4px_4px_0px_0px_#050521] transition-all outline-none text-sm md:text-base"
                      />
                    </Field>

                    <Field label="Parent / Guardian Name">
                      <input
                        name="parentsName"
                        value={form.parentsName}
                        onChange={change}
                        placeholder="Required for admission"
                        required
                        className="w-full bg-slate-50 border-2 border-[#050521] rounded-xl px-4 py-3 md:px-5 md:py-4 font-bold focus:bg-white focus:shadow-[4px_4px_0px_0px_#050521] transition-all outline-none text-sm md:text-base"
                      />
                    </Field>

                    <Field label="Full Address">
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={change}
                        placeholder="House No, Street, City, ZIP"
                        required
                        rows={3}
                        className="w-full bg-slate-50 border-2 border-[#050521] rounded-xl px-4 py-3 md:px-5 md:py-4 font-bold focus:bg-white focus:shadow-[4px_4px_0px_0px_#050521] transition-all outline-none resize-none text-sm md:text-base"
                      />
                    </Field>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-5 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] md:text-sm transition-all flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_#050521] active:translate-y-1 active:shadow-none ${
                        loading 
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                          : "bg-[#050521] text-white hover:bg-[#c6ff34] hover:text-[#050521]"
                      }`}
                    >
                      {loading ? (
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin" />
                      ) : (
                        "Confirm Enrolment →"
                      )}
                    </button>
                  </form>
                  
                  <div className="mt-8 flex justify-center gap-4 md:gap-6">
                    {["🔒 Secure", "📋 Verified", "⚡ Instant"].map((tag, i) => (
                      <span key={i} className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}