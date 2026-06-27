import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { saveWebinarRegistration } from "../services/dbService";
import Background3D from "../components/Background3D";
import WaterBubbles from "../components/WaterBubbles";

function Field({ label, id, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[10px] md:text-[11px] font-black text-[#050521] uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function Webinar() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    education: "",
    address: "",
  });

  const change = (e) => {
    const { name, value } = e.target;
    if (name === "fullName" && value && !/^[a-zA-Z\s]*$/.test(value)) return;
    if (name === "phone") {
      if (value && !/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }
    setForm({ ...form, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.phone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit phone number.");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await saveWebinarRegistration({
        name: form.fullName,
        phone: form.phone,
        education: form.education,
        address: form.address,
      });

      if (res.success) {
        setSuccess(true);
      } else {
        throw new Error("Registration failed to save");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Please try again or contact support.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#050521] overflow-x-hidden font-sans">
      <Background3D />
      <WaterBubbles />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 pt-28 pb-12 md:pt-40 md:px-12 md:pb-24">
        <AnimatePresence mode="wait">
          {success ? (
            /* ════ SUCCESS VIEW ════ */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center min-h-[50vh] text-center"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-[#c6ff34] border-4 border-[#050521] rounded-full flex items-center justify-center text-3xl md:text-4xl mb-6 md:mb-8 shadow-[6px_6px_0px_0px_#050521]">
                ✓
              </div>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                Registration <span className="text-stroke-dark">Confirmed.</span>
              </h1>
              <p className="font-mono text-xs md:text-sm text-slate-500 mb-8 md:mb-10 max-w-md">
                Your spot for the Free AI/ML Webinar is secured. We will send the webinar access link and resources to your phone number soon.
              </p>

              <div className="bg-white border-2 border-[#050521] p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-[8px_8px_0px_0px_#c6ff34] text-left w-full max-w-md">
                <div className="space-y-4 font-mono text-xs md:text-sm">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 uppercase">Name</span>
                    <span className="font-bold">{form.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 uppercase">Phone</span>
                    <span className="font-bold">{form.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400 uppercase">Education</span>
                    <span className="font-bold">{form.education}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 uppercase">Address</span>
                    <span className="font-bold text-right max-w-[200px] break-words">{form.address}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
                <a 
                  href="https://chat.whatsapp.com/FZ7xiNU5L4Y2ApLUnfZnc3" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full sm:w-auto px-8 py-4 bg-[#25D366] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#1ebe57] transition-all shadow-[6px_6px_0px_0px_#050521] flex items-center justify-center gap-2 border-2 border-[#050521]"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm5.835-3.272c1.673.993 3.486 1.517 5.361 1.518 5.753 0 10.43-4.678 10.434-10.431.002-2.786-1.08-5.403-3.05-7.37-1.97-1.968-4.586-3.053-7.373-3.053-5.754 0-10.43 4.677-10.435 10.43-.001 1.937.507 3.827 1.472 5.516l-.963 3.52 3.606-.945zm11.204-6.49c-.279-.14-1.651-.814-1.907-.907-.256-.093-.443-.14-.63.14-.187.279-.724.907-.887 1.093-.163.186-.326.21-.605.07-.279-.14-1.18-.435-2.247-1.387-.83-.74-1.39-1.653-1.553-1.932-.163-.279-.017-.43.122-.569.126-.125.279-.326.419-.489.14-.163.186-.279.279-.465.093-.186.046-.349-.023-.489-.069-.14-.63-1.517-.862-2.077-.226-.543-.454-.47-.63-.478-.163-.008-.349-.01-.535-.01-.186 0-.489.07-.745.349-.256.279-.978.955-.978 2.33 0 1.375 1.001 2.702 1.141 2.888.14.186 1.97 3.01 4.773 4.218.667.288 1.188.46 1.594.59.67.213 1.28.183 1.761.11.536-.08 1.651-.675 1.884-1.327.233-.652.233-1.21.163-1.327-.07-.116-.256-.21-.535-.349z"/>
                  </svg>
                  Join WhatsApp Group
                </a>
                
                <Link to="/" className="w-full sm:w-auto">
                  <button className="w-full px-8 py-4 bg-[#050521] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#c6ff34] hover:text-[#050521] transition-all shadow-[6px_6px_0px_0px_#050521] border-2 border-[#050521]">
                    Back to Home
                  </button>
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ════ REGISTRATION FORM VIEW ════ */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

              {/* Left Column: Copy & Info */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#050521]/10 bg-slate-50 w-fit mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#c6ff34] animate-pulse"></span>
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest text-[#050521]/80">Free Live Session</span>
                </div>

                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
                  Free AI/ML <br />
                  <span className="text-stroke-dark">Webinar.</span>
                </h1>

                <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed mb-8">
                  Get a complete masterclass roadmap on transitioning your career into tech. Understand PyTorch, custom transformer architectures, and building production-ready Agentic AI systems.
                </p>

                <div className="flex flex-col gap-4 border-t border-[#050521]/5 pt-8">
                  <h4 className="font-mono text-xs font-black uppercase tracking-widest text-[#050521]/40 mb-2">Topics Covered</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: "🤖", label: "Machine Learning" },
                      { icon: "🧠", label: "Understanding LLMs" },
                      { icon: "✨", label: "Generative AI" },
                      { icon: "🗺️", label: "AI Career Roadmap" }
                    ].map((topic, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-50 border border-[#050521]/5 px-4 py-3.5 rounded-2xl">
                        <span className="text-xl">{topic.icon}</span>
                        <span className="font-black uppercase tracking-wider text-[10px] text-[#050521]">{topic.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Form Container */}
              <div className="lg:col-span-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white border-2 border-[#050521] p-6 md:p-10 rounded-[2rem] shadow-[8px_8px_0px_0px_#050521] relative overflow-hidden"
                >
                  <h3 className="text-xl font-black uppercase tracking-tight mb-8">
                    Claim Your Free Access
                  </h3>

                  {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-mono font-semibold flex items-center gap-2">
                      <span>⚠️</span> {errorMsg}
                    </div>
                  )}

                  <form onSubmit={submit} className="space-y-6">
                    <Field label="Full Name" id="fullName">
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        required
                        value={form.fullName}
                        onChange={change}
                        placeholder="fullName"
                        className="w-full border-2 border-[#050521]/10 focus:border-[#050521] rounded-xl px-4 py-3.5 outline-none transition-all text-sm font-semibold placeholder:text-slate-300 bg-slate-50/50"
                      />
                    </Field>

                    <Field label="Phone Number" id="phone">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        value={form.phone}
                        onChange={change}
                        placeholder="10-digit Whatsapp number"
                        className="w-full border-2 border-[#050521]/10 focus:border-[#050521] rounded-xl px-4 py-3.5 outline-none transition-all text-sm font-semibold placeholder:text-slate-300 bg-slate-50/50"
                      />
                    </Field>

                    <Field label="Education / Qualification" id="education">
                      <input
                        type="text"
                        name="education"
                        id="education"
                        required
                        value={form.education}
                        onChange={change}
                        placeholder="e.g. B.Tech in CS / Self-taught"
                        className="w-full border-2 border-[#050521]/10 focus:border-[#050521] rounded-xl px-4 py-3.5 outline-none transition-all text-sm font-semibold placeholder:text-slate-300 bg-slate-50/50"
                      />
                    </Field>

                    <Field label="Permanent Address" id="address">
                      <textarea
                        name="address"
                        id="address"
                        required
                        value={form.address}
                        onChange={change}
                        placeholder="Your full address here"
                        rows={3}
                        className="w-full border-2 border-[#050521]/10 focus:border-[#050521] rounded-xl px-4 py-3.5 outline-none transition-all text-sm font-semibold placeholder:text-slate-300 bg-slate-50/50 resize-none"
                      />
                    </Field>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#050521] hover:bg-[#c6ff34] text-white hover:text-[#050521] font-black uppercase tracking-widest rounded-xl transition-all border-2 border-[#050521] shadow-[4px_4px_0px_0px_#050521] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[#c6ff34] border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Reserve My Seat"
                      )}
                    </button>
                  </form>
                </motion.div>
              </div>

            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
