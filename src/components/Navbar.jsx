import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/Asset 1@4x.png";
import { BLOG_POSTS } from "../data/blogPosts";

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
  ChevronDown: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
};

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [isBlogHovered, setIsBlogHovered] = useState(false);

  const [mobileBlogExpanded, setMobileBlogExpanded] = useState(false);

  const blogTimeoutRef = useRef(null);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setIsBlogHovered(false);
    setMobileBlogExpanded(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) return;
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

  // Handlers for Blog Dropdown
  const handleMouseEnterBlog = () => {
    if (blogTimeoutRef.current) clearTimeout(blogTimeoutRef.current);
    setIsBlogHovered(true);
  };

  const handleMouseLeaveBlog = () => {
    blogTimeoutRef.current = setTimeout(() => {
      setIsBlogHovered(false);
    }, 150);
  };

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "COURSES", path: "/programs" },
    { name: "BLOG", path: "/blog", hasBlogDropdown: true },
    { name: "APTITUDE TEST", path: "/aptitude" },
    { name: "ADMISSION", path: "/admission" },
    { name: "CONTACT", path: "/contact" },
  ];

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: showNavbar ? 0 : -120, opacity: showNavbar ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-4 md:top-6 left-0 w-full z-[100] px-3 md:px-12 flex justify-center pointer-events-none"
    >
      <nav className="w-full max-w-7xl flex items-center justify-between px-5 md:px-10 py-3 md:py-4 rounded-full bg-white border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] pointer-events-auto relative">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 group transition-opacity hover:opacity-75 flex-shrink-0 relative z-10"
        >
          <img
            src={logo}
            alt="DeepStaq Logo"
            className="h-5 md:h-7 w-auto object-contain"
            style={{
              filter:
                "brightness(0) invert(7%) sepia(16%) saturate(3603%) hue-rotate(211deg) brightness(94%) contrast(109%)",
            }}
          />
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6 lg:gap-9 relative z-10">
          {navLinks.map((link) => {
            // BLOG HOVER DROPDOWN (6 GUIDES)
            if (link.hasBlogDropdown) {
              return (
                <div
                  key={link.path}
                  className="relative py-2"
                  onMouseEnter={handleMouseEnterBlog}
                  onMouseLeave={handleMouseLeaveBlog}
                >
                  <Link
                    to={link.path}
                    className="relative text-xs font-black uppercase tracking-[0.25em] transition-all duration-300 group text-[#050521] flex items-center gap-1.5"
                  >
                    <span>{link.name}</span>
                    <Icons.ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isBlogHovered ? "rotate-180 text-[#050521]" : "text-slate-400"
                      }`}
                    />
                    <span
                      className={`absolute -bottom-1 left-0 h-[2px] bg-[#c6ff34] transition-all duration-300 rounded-full ${
                        isBlogHovered ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>

                  {/* HOVER DROPDOWN MENU FOR 6 BLOG PAGES */}
                  <AnimatePresence>
                    {isBlogHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-[480px] lg:w-[560px] bg-white border-2 border-[#050521] rounded-3xl p-5 shadow-[8px_8px_0px_0px_#050521] z-50 mt-1"
                      >
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#c6ff34] border border-[#050521]" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-[#050521] font-mono">
                              AI/ML Learning Guides (2026)
                            </span>
                          </div>
                          <Link
                            to="/blog"
                            onClick={() => setIsBlogHovered(false)}
                            className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 hover:text-[#050521] underline"
                          >
                            All Guides →
                          </Link>
                        </div>

                        {/* 6 Grid items */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {BLOG_POSTS.map((post, idx) => (
                            <Link
                              key={post.id}
                              to={`/blog/${post.slug}`}
                              onClick={() => setIsBlogHovered(false)}
                              className="group p-3 rounded-2xl bg-slate-50 hover:bg-[#c6ff34]/20 border border-slate-200/80 hover:border-[#050521] transition-all flex flex-col justify-between space-y-1.5 shadow-none hover:shadow-[3px_3px_0px_0px_#050521]"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-black text-[#050521] bg-white px-2 py-0.5 rounded border border-slate-300">
                                  0{idx + 1}
                                </span>
                                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                                  {post.category}
                                </span>
                              </div>
                              <h4 className="text-xs font-black uppercase text-[#050521] line-clamp-2 leading-tight group-hover:text-[#050521]">
                                {post.title.split(" (2026")[0].split(" (2026 Guide)")[0]}
                              </h4>
                            </Link>
                          ))}
                        </div>

                        {/* Footer Link */}
                        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-400">
                            6 Comprehensive Hands-On Guides
                          </span>
                          <Link
                            to="/blog"
                            onClick={() => setIsBlogHovered(false)}
                            className="text-xs font-black uppercase text-[#050521] bg-[#c6ff34] px-3.5 py-1.5 rounded-lg border border-[#050521] shadow-[2px_2px_0px_0px_#050521] hover:translate-x-0.5 transition-all"
                          >
                            Explore Blog Hub →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-xs font-black uppercase tracking-[0.3em] transition-all duration-300 group text-[#050521]"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#c6ff34] group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            );
          })}
        </div>

        {/* MOBILE MENU BUTTON */}
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
              className="absolute top-[calc(100%+12px)] left-0 w-full rounded-[24px] p-6 md:hidden z-50 flex flex-col gap-3 shadow-xl border border-slate-200 bg-white max-h-[80vh] overflow-y-auto"
            >
              {navLinks.map((link) => {
                // MOBILE BLOG DROPDOWN
                if (link.hasBlogDropdown) {
                  return (
                    <div key={link.path} className="flex flex-col">
                      <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50">
                        <Link
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className="text-base font-black uppercase tracking-[0.2em] text-[#050521]"
                        >
                          {link.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setMobileBlogExpanded(!mobileBlogExpanded)}
                          className="p-1.5 rounded-lg bg-slate-100 text-[#050521]"
                        >
                          <Icons.ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              mobileBlogExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Mobile Submenu for 6 Blog Posts */}
                      {mobileBlogExpanded && (
                        <div className="pl-4 pr-2 py-2 flex flex-col gap-2 bg-slate-50 rounded-xl my-1 border border-slate-200/80">
                          {BLOG_POSTS.map((post, idx) => (
                            <Link
                              key={post.id}
                              to={`/blog/${post.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="text-xs font-mono font-bold text-[#050521] hover:text-emerald-700 py-1.5 px-2 rounded-lg hover:bg-white flex items-start gap-2"
                            >
                              <span className="text-[#050521] font-black">0{idx + 1}.</span>
                              <span className="line-clamp-1">{post.title.split(" (2026")[0]}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="text-base font-black uppercase tracking-[0.2em] py-3 px-4 transition-all flex items-center justify-between group rounded-xl hover:bg-[#c6ff34]/20"
                  >
                    {link.name}
                    <span className="w-2 h-2 rounded-full bg-[#c6ff34] border border-[#050521] scale-0 group-hover:scale-100 transition-transform" />
                  </Link>
                );
              })}
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