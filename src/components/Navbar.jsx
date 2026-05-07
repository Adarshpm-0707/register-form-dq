import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/Asset 1@4x.png";

function Navbar() {
 
  return (
    <div className="fixed top-4 md:top-8 left-0 w-full z-50 px-4 md:px-12 flex justify-center pointer-events-none">
      <nav className="w-full max-w-7xl flex items-center justify-between px-4 md:px-8 py-3 md:py-4 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-2xl pointer-events-auto shadow-2xl">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
          <img 
            src={logo} 
            alt="DeepStaq Logo" 
            className="h-5 md:h-7 w-auto object-contain"
          />
        </Link>
        
        {/* Navigation Items */}
        <div className="flex items-center gap-4 md:gap-10">
          <Link to="/" className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/50 hover:text-white transition-colors">
            HOME
          </Link>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(198,255,52,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-4 md:px-8 py-2 md:py-3 bg-[#c6ff34] text-[#050521] text-[9px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em] rounded-full transition-all cursor-pointer"
            >
              REGISTER
            </motion.button>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
