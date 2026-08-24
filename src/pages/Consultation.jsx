import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { saveConsultationBooking } from "../services/dbService";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: "easeOut" },
  }),
};

const WHY_AI_OPTIONS = [
  "I want to switch my career to AI/Tech",
  "I want to upskill and grow in my current role",
  "I'm curious about AI and want to learn",
  "I want to build my own AI-based product/startup",
  "I want better job opportunities and higher salary",
  "I was referred by a friend / saw it online",
];

const MODE_OPTIONS = [
  { value: "remote", label: "Remote / Online", icon: "💻", desc: "Learn from anywhere, flexible schedule" },
  { value: "offline", label: "Offline / In-person", icon: "🏫", desc: "Attend live classes at our campus" },
  { value: "hybrid", label: "Hybrid (Both)", icon: "🔀", desc: "Mix of online & in-person sessions" },
];

export default function Consultation() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    age: "",
    education: "",
    whyAI: [],
    mode: "",
    otherReason: "",
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleWhyAI = (option) => {
    setForm((prev) => {
      const current = prev.whyAI;
      if (current.includes(option)) {
        return { ...prev, whyAI: current.filter((x) => x !== option) };
      }
      return { ...prev, whyAI: [...current, option] };
    });
    if (errors.whyAI) setErrors((prev) => ({ ...prev, whyAI: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10)
      newErrors.phone = "Valid phone number is required";
    if (!form.age.trim() || isNaN(form.age) || Number(form.age) < 15 || Number(form.age) > 60)
      newErrors.age = "Please enter a valid age (15-60)";
    if (!form.education.trim()) newErrors.education = "Education is required";
    if (!form.address.trim()) newErrors.address = "Address / City is required";
    if (form.whyAI.length === 0) newErrors.whyAI = "Please select at least one reason";
    if (!form.mode) newErrors.mode = "Please select your preferred mode";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    try {
      await saveConsultationBooking({
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        age: form.age,
        education: form.education,
        whyAI: form.whyAI,
        otherReason: form.otherReason,
        mode: form.mode,
      });

      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error saving consultation:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappMsg = encodeURIComponent(
    `Hi DeepStaq Team! I just booked a Free Consultation.\n\nName: ${form.name}\nPhone: ${form.phone}\nAge: ${form.age}\nEducation: ${form.education}\nCity/Address: ${form.address}\nPreferred Mode: ${form.mode}\nReason: ${form.whyAI.join(", ")}`
  );

  if (step === 2) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg mx-auto space-y-8"
        >
          <div className="text-7xl animate-bounce">🎉</div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-[#050521]">
            Booking Confirmed,<br />
            <span className="text-[#c6ff34] bg-[#050521] px-3 py-1 rounded-xl inline-block mt-2">
              {form.name.split(" ")[0]}!
            </span>
          </h1>
          <p className="text-slate-600 font-medium leading-relaxed">
            Your free consultation request has been submitted. Our team will reach out to you on <strong>{form.phone}</strong> within <strong>24 hours</strong>.
          </p>

          <div className="bg-[#050521] text-white rounded-3xl p-6 border-2 border-[#050521] shadow-[6px_6px_0px_0px_#c6ff34] text-left space-y-3 text-sm font-mono">
            <p className="text-[#c6ff34] font-black text-xs uppercase tracking-widest mb-3">Your Submitted Details</p>
            <p>Name: {form.name}</p>
            <p>Phone: {form.phone}</p>
            <p>Address: {form.address}</p>
            <p>Education: {form.education}</p>
            <p>Mode: <span className="capitalize">{form.mode}</span></p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://api.whatsapp.com/send?phone=919495957011&text=${whatsappMsg}`}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 bg-[#25D366] text-white border-2 border-[#050521] rounded-2xl font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_#050521] hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              WhatsApp Us Now
            </a>
            <Link to="/">
              <button className="px-8 py-4 border-2 border-[#050521] text-[#050521] font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all">
                Back to Home
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#050521]">
      {/* Header */}
      <section className="bg-[#050521] text-white px-6 sm:px-12 pt-28 sm:pt-32 pb-16 sm:pb-20 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #c6ff34 0%, transparent 60%), radial-gradient(circle at 70% 50%, #c6ff34 0%, transparent 60%)" }}
        />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-[#c6ff34] text-[#050521] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5">
            Free Consultation
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-tight mb-4">
            Book Your<br />
            <span className="text-[#c6ff34]">Free Session</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
            Fill in your details below and our AI career expert will connect with you personally to guide your next step.
          </p>
        </motion.div>
      </section>

      {/* Form */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-10" noValidate>

          {/* Personal Details */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-[#050521] text-[#c6ff34] rounded-lg flex items-center justify-center font-black text-sm">1</div>
              <h2 className="text-lg font-black uppercase tracking-widest text-[#050521]">Personal Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className={`w-full px-5 py-3.5 border-2 rounded-xl font-medium text-sm focus:outline-none focus:border-[#050521] transition-colors ${errors.name ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className={`w-full px-5 py-3.5 border-2 rounded-xl font-medium text-sm focus:outline-none focus:border-[#050521] transition-colors ${errors.phone ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  Email Address <span className="text-slate-400 font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="E mail"
                  className="w-full px-5 py-3.5 border-2 border-slate-200 rounded-xl font-medium text-sm focus:outline-none focus:border-[#050521] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="e.g. 22"
                  min="15"
                  max="60"
                  className={`w-full px-5 py-3.5 border-2 rounded-xl font-medium text-sm focus:outline-none focus:border-[#050521] transition-colors ${errors.age ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                />
                {errors.age && <p className="text-red-500 text-xs mt-1 font-medium">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  Highest Education <span className="text-red-500">*</span>
                </label>
                <select
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                  className={`w-full px-5 py-3.5 border-2 rounded-xl font-medium text-sm focus:outline-none focus:border-[#050521] transition-colors bg-white ${errors.education ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                >
                  <option value="">Select your qualification</option>
                  <option>SSLC / 10th</option>
                  <option>Plus Two / 12th</option>
                  <option>Diploma</option>
                  <option>Bachelor's Degree (B.Tech / BCA / BSc / BA / BCom)</option>
                  <option>Master's Degree (M.Tech / MCA / MSc / MBA)</option>
                  <option>Currently Studying</option>
                  <option>Other</option>
                </select>
                {errors.education && <p className="text-red-500 text-xs mt-1 font-medium">{errors.education}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  City / Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="address"
                  className={`w-full px-5 py-3.5 border-2 rounded-xl font-medium text-sm focus:outline-none focus:border-[#050521] transition-colors ${errors.address ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1 font-medium">{errors.address}</p>}
              </div>
            </div>
          </motion.div>

          <hr className="border-slate-200" />

          {/* Why AI */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-[#050521] text-[#c6ff34] rounded-lg flex items-center justify-center font-black text-sm">2</div>
              <h2 className="text-lg font-black uppercase tracking-widest text-[#050521]">Why Are You Choosing AI?</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">Select all that apply</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WHY_AI_OPTIONS.map((option) => {
                const selected = form.whyAI.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleWhyAI(option)}
                    className={`text-left px-4 py-3.5 rounded-2xl border-2 text-xs font-semibold transition-all duration-200 ${
                      selected
                        ? "bg-[#050521] text-[#c6ff34] border-[#050521] shadow-[3px_3px_0px_0px_#c6ff34]"
                        : "bg-white text-slate-700 border-slate-200 hover:border-[#050521]"
                    }`}
                  >
                    <span className="mr-2">{selected ? "✅" : "⬜"}</span>
                    {option}
                  </button>
                );
              })}
            </div>
            {errors.whyAI && <p className="text-red-500 text-xs font-medium">{errors.whyAI}</p>}

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                Anything else you'd like to share? <span className="text-slate-400 font-normal normal-case">(optional)</span>
              </label>
              <textarea
                name="otherReason"
                value={form.otherReason}
                onChange={handleChange}
                placeholder="Tell us more about your goals..."
                rows={3}
                className="w-full px-5 py-3.5 border-2 border-slate-200 rounded-xl font-medium text-sm focus:outline-none focus:border-[#050521] transition-colors resize-none"
              />
            </div>
          </motion.div>

          <hr className="border-slate-200" />

          {/* Mode Preference */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-[#050521] text-[#c6ff34] rounded-lg flex items-center justify-center font-black text-sm">3</div>
              <h2 className="text-lg font-black uppercase tracking-widest text-[#050521]">Which Mode Do You Prefer?</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {MODE_OPTIONS.map((opt) => {
                const selected = form.mode === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, mode: opt.value }));
                      if (errors.mode) setErrors((prev) => ({ ...prev, mode: "" }));
                    }}
                    className={`flex flex-col items-center text-center px-4 py-5 rounded-2xl border-2 transition-all duration-200 ${
                      selected
                        ? "bg-[#050521] text-[#c6ff34] border-[#050521] shadow-[4px_4px_0px_0px_#c6ff34]"
                        : "bg-white text-slate-700 border-slate-200 hover:border-[#050521]"
                    }`}
                  >
                    <span className="text-3xl mb-2">{opt.icon}</span>
                    <span className="font-black text-xs uppercase tracking-widest mb-1">{opt.label}</span>
                    <span className={`text-[10px] font-medium leading-snug ${selected ? "text-[#c6ff34]/80" : "text-slate-400"}`}>{opt.desc}</span>
                  </button>
                );
              })}
            </div>
            {errors.mode && <p className="text-red-500 text-xs font-medium">{errors.mode}</p>}
          </motion.div>

          {/* Submit */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#050521] text-[#c6ff34] font-black text-sm uppercase tracking-widest rounded-2xl shadow-[6px_6px_0px_0px_#c6ff34] hover:scale-[1.02] active:scale-100 active:shadow-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Book My Free Consultation"
              )}
            </button>
            <p className="text-center text-xs text-slate-400 mt-3 font-medium">
              Our team will contact you within 24 hours. 100% free. No commitment required.
            </p>
          </motion.div>
        </form>
      </section>
    </div>
  );
}
