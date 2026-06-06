import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/Asset 1@4x.png";

const Icons = {
  Instagram: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  Facebook: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  LinkedIn: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  Phone: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Mail: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full relative z-10 bg-[#050521] border-t-4 border-[#c6ff34] py-12 md:py-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-8">
        
        {/* Brand Column - Centered on mobile */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 sm:col-span-2 md:col-span-1">
          <Link to="/" className="inline-block">
            <img 
              src={logo} 
              alt="DeepStaq Logo" 
              className="h-8 md:h-9 w-auto object-contain filter brightness-110"
            />
          </Link>
          <p className="text-slate-500 font-mono text-[10px] md:text-xs leading-relaxed uppercase tracking-wider max-w-[280px] md:max-w-none">
            Elite AI/ML Engineering Program. <br className="hidden md:block"/> 
            Zero Theory. 100% Production. <br className="hidden md:block"/>
            Based in Kerala, Shipping Globally.
          </p>
        </div>

        {/* Directory - 2 columns on mobile side-by-side with Socials */}
        <div className="space-y-6 text-center md:text-left">
          <h4 className="text-[#c6ff34] text-[10px] font-black uppercase tracking-[0.4em]">Directory</h4>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="text-white hover:text-[#c6ff34] transition-colors text-xs font-black uppercase tracking-widest">
                [ 01 ] Home
              </Link>
            </li>
            <li>
              <Link to="/blog" className="text-white hover:text-[#c6ff34] transition-colors text-xs font-black uppercase tracking-widest">
                [ 02 ] Blog
              </Link>
            </li>
            <li>
              <Link to="/slot" className="text-white hover:text-[#c6ff34] transition-colors text-xs font-black uppercase tracking-widest">
                [ 03 ] Reserve Slot
              </Link>
            </li>
          </ul>
        </div>

        {/* Network - Square blocks centered on mobile */}
        <div className="space-y-6 text-center md:text-left">
          <h4 className="text-[#c6ff34] text-[10px] font-black uppercase tracking-[0.4em]">Network</h4>
          <div className="flex justify-center md:justify-start gap-3">
            {[
              { icon: Icons.Instagram, href: "https://www.instagram.com/deepstaq/" },
              { icon: Icons.Facebook, href: "https://www.facebook.com/profile.php?id=61588950842506" },
              { icon: Icons.LinkedIn, href: "https://www.linkedin.com/company/deepstaq/" }
            ].map((soc, i) => (
              <motion.a 
                key={i}
                href={soc.href} 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, backgroundColor: "#c6ff34", color: "#050521" }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 border-2 border-[#c6ff34]/30 rounded-xl flex items-center justify-center text-[#c6ff34] transition-colors duration-200"
              >
                <soc.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Protocol - Stacks at bottom on mobile, centered */}
        <div className="space-y-6 text-center md:text-left sm:col-span-2 md:col-span-1">
          <h4 className="text-[#c6ff34] text-[10px] font-black uppercase tracking-[0.4em]">Protocol</h4>
          <div className="flex flex-col items-center md:items-start gap-6">
            <a href="tel:+919495957011" className="group flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Voice_Comm</span>
              <span className="text-white group-hover:text-[#c6ff34] transition-colors text-sm font-black">+91 94959 57011</span>
            </a>
            <a href="mailto:deepstackbyaleef@gmail.com" className="group flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Data_Trans</span>
              <span className="text-white group-hover:text-[#c6ff34] transition-colors text-[11px] md:text-xs font-black break-all uppercase">deepstackbyaleef@gmail.com</span>
            </a>
          </div>
        </div>

      </div>

      {/* System Footer Bar - Centered on mobile */}
      <div className="max-w-[1400px] mx-auto mt-16 md:mt-20 pt-8 border-t border-white/5 text-center md:text-left">
        <div className="text-slate-600 font-mono text-[9px] uppercase tracking-[0.3em]">
          &copy; {currentYear} DeepStaq_System_v2.0 // All Rights Reserved
        </div>
      </div>
    </footer>
  );
}