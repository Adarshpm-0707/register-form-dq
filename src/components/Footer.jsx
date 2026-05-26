import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/Asset 1@4x.png";

const Icons = {
  Instagram: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  Facebook: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  LinkedIn: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  Phone: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Mail: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full relative z-10 bg-[#050521]/60 border-t border-white/10 backdrop-blur-2xl py-12 md:py-16 px-6 md:px-12 flex flex-col items-center">
      {/* Decorative neon top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c6ff34]/20 to-transparent" />

      <div className="w-full max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
        
        {/* Brand Column */}
        <div className="col-span-2 md:col-span-1 space-y-4 flex flex-col items-start text-left">
          <Link to="/" className="inline-block transition-opacity hover:opacity-80">
            <img 
              src={logo} 
              alt="DeepStaq Logo" 
              className="h-6 md:h-8 w-auto object-contain"
            />
          </Link>
          <p className="text-slate-400 text-sm max-w-xs">
            DeepStaq AI/ML professional diploma. Learn by doing, build a portfolio, and transition into the tech industry.
          </p>
        </div>

        {/* Links Column */}
        <div className="col-span-1 flex flex-col items-start text-left">
          <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-6 text-[#c6ff34]/80">Navigation</h4>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm uppercase tracking-wider font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link to="/slot" className="text-slate-400 hover:text-white transition-colors text-sm uppercase tracking-wider font-medium">
                Book Slot
              </Link>
            </li>
          </ul>
        </div>

        {/* Socials Column */}
        <div className="col-span-1 flex flex-col items-start text-left">
          <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-6 text-[#c6ff34]/80">Connect</h4>
          <div className="flex gap-4">
            <motion.a 
              href="https://www.instagram.com/deepstaq/" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#c6ff34] hover:border-[#c6ff34]/30 hover:bg-[#c6ff34]/5 transition-colors"
            >
              <Icons.Instagram className="w-5 h-5" />
            </motion.a>
            <motion.a 
              href="https://www.facebook.com/profile.php?id=61588950842506" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#c6ff34] hover:border-[#c6ff34]/30 hover:bg-[#c6ff34]/5 transition-colors"
            >
              <Icons.Facebook className="w-5 h-5" />
            </motion.a>
            <motion.a 
              href="https://www.linkedin.com/company/deepstaq/" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#c6ff34] hover:border-[#c6ff34]/30 hover:bg-[#c6ff34]/5 transition-colors"
            >
              <Icons.LinkedIn className="w-5 h-5" />
            </motion.a>
          </div>
        </div>

        {/* Contact Column */}
        <div className="col-span-2 md:col-span-1 flex flex-col items-start text-left">
          <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-6 text-[#c6ff34]/80">Get In Touch</h4>
          <ul className="space-y-4">
            <li>
              <a 
                href="tel:+919495957011" 
                className="group flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm"
              >
                <Icons.Phone className="w-4 h-4 text-[#c6ff34]/80 group-hover:scale-110 transition-transform" />
                <span>+91 94959 57011</span>
              </a>
            </li>
            <li>
              <a 
                href="mailto:deepstackbyaleef@gmail.com" 
                className="group flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm"
              >
                <Icons.Mail className="w-4 h-4 text-[#c6ff34]/80 group-hover:scale-110 transition-transform" />
                <span className="break-all">deepstackbyaleef@gmail.com</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="w-full max-w-7xl mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[10px] uppercase tracking-widest font-mono text-center sm:text-left">
        <div>&copy; {currentYear} DeepStaq. All rights reserved.</div>
        <div className="text-[8px] opacity-60">DeepStaq_Core_System</div>
      </div>
    </footer>
  );
}
