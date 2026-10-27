import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { saveContactMessage } from "../services/dbService";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    
    try {
      // 1. Save to Firebase Firestore database
      await saveContactMessage(formData);

      // 2. Send email notification via EmailJS
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          from_name: formData.name,
          email: formData.email,
          from_email: formData.email,
          message: formData.message,
          reply_to: formData.email,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
      
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setStatus("Failed to send. Try again.");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-4 md:px-8 overflow-x-hidden flex items-center justify-center bg-[#090D11] text-white">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#c6ff34]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 bg-[#0D1318]/90 backdrop-blur-2xl border border-white/10 p-6 md:p-10 lg:p-14 rounded-[2rem] shadow-2xl relative z-10"
      >
        {/* Left Side: Info */}
        <div className="flex flex-col justify-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c6ff34]/10 border border-[#c6ff34]/30 text-xs font-mono font-semibold uppercase tracking-wider text-[#c6ff34] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#c6ff34] animate-pulse" />
              Get In Touch
            </div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4"
            >
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c6ff34] to-emerald-400">Connect</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-300 text-sm md:text-base leading-relaxed font-normal"
            >
              Have a question about courses, admission, or fees? Drop us a message and our counselor will reach back within 24 hours.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center gap-4 md:gap-5 group p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#c6ff34]/40 transition-all">
              <div className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-2xl bg-[#c6ff34]/15 border border-[#c6ff34]/30 flex items-center justify-center text-[#c6ff34] group-hover:bg-[#c6ff34] group-hover:text-[#090D11] transition-all duration-300">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#c6ff34] mb-0.5">Email</p>
                <p className="text-white font-medium text-sm md:text-base break-all md:break-normal">info@deepstaq.in</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 md:gap-5 group p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#c6ff34]/40 transition-all">
              <div className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-2xl bg-[#c6ff34]/15 border border-[#c6ff34]/30 flex items-center justify-center text-[#c6ff34] group-hover:bg-[#c6ff34] group-hover:text-[#090D11] transition-all duration-300">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#c6ff34] mb-0.5">Campus</p>
                <p className="text-white font-medium text-sm md:text-base">Kannur, Kerala, India</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative bg-white/[0.03] p-6 md:p-8 rounded-[1.5rem] border border-white/10"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5 relative z-10">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-2">Your Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/15 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] focus:ring-2 focus:ring-[#c6ff34]/20 transition-all duration-300 placeholder:text-slate-500 text-white font-medium"
                placeholder="FULL NAME"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-2">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/15 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] focus:ring-2 focus:ring-[#c6ff34]/20 transition-all duration-300 placeholder:text-slate-500 text-white font-medium"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-2">Your Message</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/15 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] focus:ring-2 focus:ring-[#c6ff34]/20 transition-all duration-300 placeholder:text-slate-500 text-white font-medium min-h-[140px] resize-none"
                placeholder="How can we help you today?"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-2 w-full bg-[#c6ff34] text-[#090D11] font-bold tracking-wider text-sm uppercase rounded-2xl py-4 shadow-[0_0_25px_rgba(198,255,52,0.3)] hover:shadow-[0_0_35px_rgba(198,255,52,0.5)] transition-all duration-300"
            >
              {status || "Send Message →"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Contact;
