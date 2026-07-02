import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/Asset 1@4x.png";

const Icons = {
  Menu: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  ),
  X: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) return; // Don't hide navbar if mobile menu is open
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isOpen]);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "BLOG", path: "/blog" },
    { name: "ADMISSION", path: "/admission" },
    { name: "CONTACT", path: "/contact" },
  ];

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: showNavbar ? 0 : -120, opacity: showNavbar ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-4 md:top-6 left-0 w-full z-[100] px-4 md:px-12 flex justify-center pointer-events-none"
    >
      <nav className="w-full max-w-7xl flex items-center justify-between px-5 md:px-10 py-3 md:py-4 rounded-full bg-white border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] pointer-events-auto relative">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 group transition-opacity hover:opacity-75 flex-shrink-0 relative z-10"
        >
          <img
            src={logo}
            alt="DeepStaq Logo"
            className="h-5 md:h-7 w-auto object-contain"
            style={{ filter: "brightness(0) invert(7%) sepia(16%) saturate(3603%) hue-rotate(211deg) brightness(94%) contrast(109%)" }}
          />
        </Link>

        {/* DESKTOP LINKS (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-10 relative z-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="relative text-xs font-black uppercase tracking-[0.3em] transition-all duration-300 group text-[#050521]"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#c6ff34] group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
          ))}
        </div>

        {/* MOBILE MENU BUTTON (Visible on mobile) */}
        <div className="md:hidden flex items-center relative z-10">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-full transition-all duration-300 ${
              isOpen ? "bg-[#050521] text-[#c6ff34]" : "text-[#050521]"
            }`}
          >
            {isOpen ? <Icons.X className="w-5 h-5" /> : <Icons.Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-[calc(100%+12px)] left-0 w-full rounded-[24px] p-6 md:hidden z-50 flex flex-col gap-4 shadow-xl border border-slate-200 bg-white overflow-hidden"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-black uppercase tracking-[0.2em] py-3 px-4 transition-all flex items-center justify-between group rounded-xl hover:bg-[#c6ff34]/20"
                >
                  {link.name}
                  <span className="w-2 h-2 rounded-full bg-[#c6ff34] border border-[#050521] scale-0 group-hover:scale-100 transition-transform" />
                </Link>
              ))}
              <div className="h-px bg-[#050521]/5 w-full my-2" />
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-center opacity-40">
                DeepStaq · Build AI
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.div>
  );
}

export default Navbar;