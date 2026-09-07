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
  const navContainerRef = useRef(null);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setIsBlogHovered(false);
    setMobileBlogExpanded(false);
  }, [location.pathname]);

  // Handle click outside & escape key to close menu on tablet & mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsBlogHovered(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Scroll detection to hide/show navbar
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

  // Handlers for Blog Dropdown in desktop view
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
   
    { name: "SCHOLARSHIP", path: "/scholarship" },
    { name: "ADMISSION", path: "/admission" },
    { name: "CONTACT", path: "/contact" },
  ];

  const isActiveRoute = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: showNavbar ? 0 : -120, opacity: showNavbar ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-3 sm:top-4 md:top-6 left-0 w-full z-[100] px-3 sm:px-6 md:px-8 lg:px-12 flex justify-center pointer-events-none"
    >
      <nav
        ref={navContainerRef}
        className="w-full max-w-7xl flex items-center justify-between px-4 sm:px-6 md:px-8 xl:px-10 py-3 md:py-4 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] pointer-events-auto relative"
      >
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 group transition-opacity hover:opacity-80 flex-shrink-0 relative z-10"
        >
          <img
            src={logo}
            alt="DeepStaq Logo"
            className="h-5 sm:h-6 md:h-7 w-auto object-contain"
            style={{
              filter:
                "brightness(0) invert(7%) sepia(16%) saturate(3603%) hue-rotate(211deg) brightness(94%) contrast(109%)",
            }}
          />
        </Link>

        {/* DESKTOP LINKS (>= xl breakpoint for comfortable spacing) */}
        <div className="hidden xl:flex items-center gap-6 2xl:gap-8 relative z-10">
          {navLinks.map((link) => {
            const active = isActiveRoute(link.path);

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
                    className={`relative text-xs font-black uppercase tracking-[0.25em] transition-all duration-300 group flex items-center gap-1.5 ${
                      active ? "text-[#050521]" : "text-slate-700 hover:text-[#050521]"
                    }`}
                  >
                    <span>{link.name}</span>
                    <Icons.ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isBlogHovered ? "rotate-180 text-[#050521]" : "text-slate-400"
                      }`}
                    />
                    <span
                      className={`absolute -bottom-1 left-0 h-[2px] bg-[#c6ff34] transition-all duration-300 rounded-full ${
                        active || isBlogHovered ? "w-full" : "w-0 group-hover:w-full"
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
                className={`relative text-xs font-black uppercase tracking-[0.25em] transition-all duration-300 group ${
                  active ? "text-[#050521]" : "text-slate-700 hover:text-[#050521]"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-[#c6ff34] transition-all duration-300 rounded-full ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* MOBILE & TABLET MENU TOGGLE BUTTON (< xl screens) */}
        <div className="xl:hidden flex items-center gap-2 relative z-10">
          <button
            type="button"
            aria-label={isOpen ? "Close Menu" : "Open Navigation Menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2.5 rounded-full transition-all duration-300 border flex items-center justify-center ${
              isOpen
                ? "bg-[#050521] text-[#c6ff34] border-[#050521] shadow-md"
                : "bg-slate-100 hover:bg-slate-200 text-[#050521] border-slate-200/80"
            }`}
          >
            {isOpen ? <Icons.X className="w-5 h-5" /> : <Icons.Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* MOBILE & TABLET RESPONSIVE DROPDOWN MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute top-[calc(100%+10px)] left-0 w-full rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 xl:hidden z-50 flex flex-col gap-2 shadow-2xl border-2 border-[#050521] bg-white max-h-[82vh] overflow-y-auto"
            >
              {/* Menu Header in Tablet/Mobile */}
              <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-100">
                <span className="text-[11px] font-mono font-black uppercase tracking-widest text-slate-500">
                  Navigation Menu
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  DeepStaq AI Hub
                </span>
              </div>

              <div className="flex flex-col gap-1.5 pt-1">
                {navLinks.map((link) => {
                  const active = isActiveRoute(link.path);

                  // MOBILE / TABLET BLOG DROPDOWN
                  if (link.hasBlogDropdown) {
                    return (
                      <div
                        key={link.path}
                        className={`flex flex-col rounded-2xl border transition-all ${
                          active
                            ? "bg-slate-50/80 border-slate-300"
                            : "border-transparent hover:border-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between py-2.5 px-3 sm:px-4 rounded-2xl hover:bg-slate-50">
                          <Link
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`text-sm sm:text-base font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                              active ? "text-[#050521]" : "text-slate-800"
                            }`}
                          >
                            <span>{link.name}</span>
                            {active && (
                              <span className="w-2 h-2 rounded-full bg-[#c6ff34] border border-[#050521]" />
                            )}
                          </Link>
                          <button
                            type="button"
                            aria-label="Toggle Blog Guides Submenu"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setMobileBlogExpanded(!mobileBlogExpanded);
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-[#c6ff34]/30 text-[#050521] border border-slate-200 transition-colors flex items-center gap-1"
                          >
                            <span className="text-[10px] font-mono font-bold uppercase hidden sm:inline">
                              Guides
                            </span>
                            <Icons.ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                mobileBlogExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {/* Tablet/Mobile Submenu for 6 Blog Posts */}
                        <AnimatePresence>
                          {mobileBlogExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="p-3 mx-2 mb-2 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="sm:col-span-2 flex items-center justify-between pb-1 px-1">
                                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                                    Learning Guides
                                  </span>
                                  <Link
                                    to="/blog"
                                    onClick={() => setIsOpen(false)}
                                    className="text-[10px] font-mono font-bold text-emerald-700 hover:underline"
                                  >
                                    View All →
                                  </Link>
                                </div>
                                {BLOG_POSTS.map((post, idx) => (
                                  <Link
                                    key={post.id}
                                    to={`/blog/${post.slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="text-xs font-mono font-bold text-[#050521] hover:text-emerald-700 p-2.5 rounded-lg bg-white hover:bg-[#c6ff34]/20 border border-slate-200 hover:border-[#050521] flex items-start gap-2 transition-all shadow-sm"
                                  >
                                    <span className="text-[10px] font-black bg-slate-100 px-1.5 py-0.5 rounded text-[#050521]">
                                      0{idx + 1}
                                    </span>
                                    <span className="line-clamp-1 leading-snug">
                                      {post.title.split(" (2026")[0]}
                                    </span>
                                  </Link>
                                ))}
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
                      onClick={() => setIsOpen(false)}
                      className={`text-sm sm:text-base font-black uppercase tracking-[0.2em] py-2.5 sm:py-3 px-3 sm:px-4 transition-all flex items-center justify-between group rounded-2xl ${
                        active
                          ? "bg-[#c6ff34]/30 text-[#050521] font-black border border-[#050521]/20"
                          : "text-slate-800 hover:bg-slate-100 hover:text-[#050521]"
                      }`}
                    >
                      <span className="flex items-center gap-2">{link.name}</span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full border border-[#050521] transition-transform ${
                          active
                            ? "bg-[#c6ff34] scale-100"
                            : "bg-[#c6ff34] scale-0 group-hover:scale-100"
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>

              <div className="h-px bg-slate-200 w-full my-2" />
              <div className="flex items-center justify-between px-2 pt-1">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  DeepStaq · Build AI
                </p>
                <Link
                  to="/programs"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] font-black uppercase tracking-wider text-[#050521] bg-[#c6ff34] px-3 py-1 rounded-lg border border-[#050521] shadow-[2px_2px_0px_0px_#050521]"
                >
                  Explore Programs
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.div>
  );
}

export default Navbar;