import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/Asset 1@4x.png";

const Icons = {
  Menu: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/>
    </svg>
  ),
  X: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
};

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "APTITUDE TEST", path: "/aptitude-test" }
  ];

  return (
    <div className="fixed top-4 md:top-8 left-0 w-full z-50 px-4 md:px-12 flex justify-center pointer-events-none">
      <nav className="w-full max-w-7xl flex items-center justify-between px-4 md:px-8 py-3 md:py-4 rounded-full bg-[#050521]/60 border border-white/10 backdrop-blur-2xl pointer-events-auto shadow-2xl relative overflow-visible">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80 flex-shrink-0">
          <img 
            src={logo} 
            alt="DeepStaq Logo" 
            className="h-5 md:h-7 w-auto object-contain"
          />
        </Link>
        
        {/* Desktop Navigation Items */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="text-xs font-black uppercase tracking-[0.3em] text-white/50 hover:text-[#c6ff34] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(198,255,52,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-[#c6ff34] text-[#050521] text-xs font-black uppercase tracking-[0.2em] rounded-full transition-all"
            >
              REGISTER
            </motion.button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <Link to="/register">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-[#c6ff34] text-[#050521] text-[9px] font-black uppercase tracking-[0.1em] rounded-full shadow-[0_0_15px_rgba(198,255,52,0.3)]"
            >
              REGISTER
            </motion.button>
          </Link>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:text-[#c6ff34] transition-all"
          >
            {isOpen ? <Icons.X className="w-5 h-5" /> : <Icons.Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-[calc(100%+12px)] left-0 w-full bg-[#050521]/95 border border-white/10 backdrop-blur-3xl rounded-[32px] p-8 md:hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-50 flex flex-col gap-6"
            >
              <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#c6ff34]/20 to-transparent" />
              
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-black uppercase tracking-[0.3em] text-white/40 hover:text-[#c6ff34] py-2 transition-all flex items-center justify-between group"
                >
                  {link.name}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c6ff34] opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#c6ff34]" />
                </Link>
              ))}
              
              <div className="pt-4 border-t border-white/5">
                <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em] mb-4">DeepStaq_Mobile_Uplink</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>
    </div>
  );
}

export default Navbar;
