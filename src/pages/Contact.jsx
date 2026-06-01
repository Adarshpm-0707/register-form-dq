import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    
    try {
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
      console.error("Error sending email:", error);
      setStatus("Failed to send. Try again.");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-4 md:px-8 overflow-x-hidden flex items-center justify-center bg-[#f8f9fa] text-[#050521]">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#c6ff34]/30 to-transparent blur-3xl opacity-50 mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-[#c6ff34]/20 to-[#050521]/5 blur-3xl opacity-60 mix-blend-multiply" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 bg-white/60 backdrop-blur-xl border border-white/40 p-6 md:p-10 lg:p-16 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]"
      >
        {/* Left Side: Info */}
        <div className="flex flex-col justify-center gap-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-[#050521] tracking-tight mb-4"
            >
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#050521] to-[#606080]">Connect</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[#050521]/70 text-base md:text-lg leading-relaxed font-medium"
            >
              Have a question, an idea, or just want to say hi? We'd love to hear from you. Drop us a message and we'll get back to you shortly.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-4 md:gap-5 group">
              <div className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-2xl bg-[#c6ff34]/20 flex items-center justify-center text-[#050521] group-hover:bg-[#c6ff34] transition-colors duration-300 shadow-sm border border-[#c6ff34]/30 group-hover:border-[#c6ff34]">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#050521]/50 mb-0.5 md:mb-1">Email</p>
                <p className="text-[#050521] font-bold text-sm md:text-lg break-all md:break-normal">deepstackbyaleef@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 md:gap-5 group">
              <div className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-2xl bg-[#c6ff34]/20 flex items-center justify-center text-[#050521] group-hover:bg-[#c6ff34] transition-colors duration-300 shadow-sm border border-[#c6ff34]/30 group-hover:border-[#c6ff34]">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#050521]/50 mb-0.5 md:mb-1">Office</p>
                <p className="text-[#050521] font-bold text-sm md:text-lg">Kannur, Kerala, India</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative bg-white/80 p-6 md:p-8 rounded-[1.5rem] shadow-sm border border-[#050521]/5"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6 relative z-10">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Your Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] focus:ring-4 focus:ring-[#c6ff34]/20 transition-all duration-300 placeholder:text-[#050521]/30 font-medium shadow-sm"
                placeholder="FULL NAME"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] focus:ring-4 focus:ring-[#c6ff34]/20 transition-all duration-300 placeholder:text-[#050521]/30 font-medium shadow-sm"
                placeholder="@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Your Message</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] focus:ring-4 focus:ring-[#c6ff34]/20 transition-all duration-300 placeholder:text-[#050521]/30 font-medium min-h-[140px] resize-none shadow-sm"
                placeholder="How can we help you today?"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-2 w-full bg-[#050521] text-white font-black tracking-[0.2em] text-sm uppercase rounded-2xl py-4 relative overflow-hidden group flex items-center justify-center shadow-lg shadow-[#050521]/20 hover:shadow-xl hover:shadow-[#c6ff34]/20 transition-all duration-300"
            >
              {/* Background fill effect */}
              <div className="absolute inset-0 bg-[#c6ff34] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0" />
              
              {/* Default text (White) */}
              <span className="relative z-10 transition-colors duration-500 group-hover:text-[#050521]">
                {status || "Send Message"}
              </span>
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Contact;
