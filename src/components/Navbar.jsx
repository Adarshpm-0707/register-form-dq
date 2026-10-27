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

  // Test Mode State: Completely hides navbar during exam
  const [inExamMode, setInExamMode] = useState(() => {
    if (typeof document !== "undefined") {
      return document.body.classList.contains("in-exam-mode");
    }
    return false;
  });

  useEffect(() => {
    const handleExamMode = (e) => {
      setInExamMode(Boolean(e.detail?.inExam));
    };
    window.addEventListener("deepstaq:exam-mode", handleExamMode);
    return () => window.removeEventListener("deepstaq:exam-mode", handleExamMode);
  }, []);

  // Close menus on route change and reset exam mode if navigated away
  useEffect(() => {
    setIsOpen(false);
    setIsBlogHovered(false);
    setMobileBlogExpanded(false);
    if (
      document.body.classList.contains("in-exam-mode") &&
      location.pathname !== "/aptitude-v2" &&
      location.pathname !== "/aptitude"
    ) {
      document.body.classList.remove("in-exam-mode");
      setInExamMode(false);
    }
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

  const isHome = location.pathname === "/";
  const isAiEasyAyiPage =
    location.pathname === "/aieasyayi" ||
    location.pathname === "/ai-easy-ayi" ||
    location.pathname === "/ai-for-everyone" ||
    location.pathname.startsWith("/ai-easy-ayi");

  const navLinks = isHome
    ? [
        { name: "Programs", path: "#programs" },
        { name: "Learning Experience", path: "#experience" },
        { name: "Projects", path: "#projects" },
        { name: "Events", path: "#events" },
        { name: "About", path: "#about" },
        { name: "Contact", path: "#contact" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Programs", path: "/programs" },
        { name: "Blog", path: "/blog", hasBlogDropdown: true },
        { name: "Scholarship", path: "/scholarship" },
        { name: "Admission", path: "/admission" },
        { name: "Contact", path: "/contact" },
      ];

  const handleNavClick = (e, targetPath) => {
    if (targetPath.startsWith("#")) {
      e.preventDefault();
      const id = targetPath.replace("#", "");
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
      setIsOpen(false);
    }
  };

  const isActiveRoute = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path.startsWith("#")) return false;
    return location.pathname.startsWith(path);
  };

  if (inExamMode) {
    return null;
  }

  return (
    <motion.div
      data-navbar="true"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: showNavbar ? 0 : -120, opacity: showNavbar ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-3 sm:top-4 md:top-5 left-0 w-full z-[100] px-3 sm:px-6 md:px-8 lg:px-10 flex justify-center pointer-events-none"
    >
      <nav
        ref={navContainerRef}
        className={`w-full max-w-7xl flex items-center justify-between px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full pointer-events-auto transition-all duration-300 relative ${
          isAiEasyAyiPage
            ? "bg-gradient-to-b from-white/[0.12] to-white/[0.04] backdrop-blur-2xl backdrop-saturate-150 border border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.37),inset_0_1px_1px_rgba(255,255,255,0.3)]"
            : "bg-[#090D11]/85 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        }`}
      >
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 group transition-opacity hover:opacity-85 flex-shrink-0 relative z-10"
        >
          <img
            src={logo}
            alt="DeepStaq Logo"
            className="h-6 sm:h-7 md:h-8 w-auto object-contain"
            style={{
              filter: "brightness(0) invert(1)",
            }}
          />
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7 relative z-10">
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
                    className={`relative text-xs sm:text-sm font-medium tracking-normal transition-all duration-200 group flex items-center gap-1.5 py-1 ${
                      active || isBlogHovered ? "text-sky-400 font-semibold" : "text-white/80 hover:text-white"
                    }`}
                  >
                    <span>{link.name}</span>
                    <Icons.ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isBlogHovered ? "rotate-180 text-sky-400" : "text-slate-400"
                      }`}
                    />
                    <span
                      className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-300 rounded-full ${
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
                        className="absolute top-full left-1/2 -translate-x-1/2 w-[480px] lg:w-[560px] bg-[#040d1a]/95 backdrop-blur-2xl border border-sky-500/20 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 mt-2 text-white"
                      >
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-200 font-mono">
                              AI/ML Learning Guides (2026)
                            </span>
                          </div>
                          <Link
                            to="/blog"
                            onClick={() => setIsBlogHovered(false)}
                            className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 hover:text-sky-300 transition-colors"
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
                              className="group p-3 rounded-2xl bg-white/[0.03] hover:bg-sky-400/10 border border-white/8 hover:border-sky-400/40 transition-all flex flex-col justify-between space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/20">
                                  0{idx + 1}
                                </span>
                                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                                  {post.category}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-2 leading-tight transition-colors">
                                {post.title.split(" (2026")[0].split(" (2026 Guide)")[0]}
                              </h4>
                            </Link>
                          ))}
                        </div>

                        {/* Footer Link */}
                        <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-400">
                            6 Comprehensive Hands-On Guides
                          </span>
                          <Link
                            to="/blog"
                            onClick={() => setIsBlogHovered(false)}
                            className="text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 shadow-[0_2px_12px_rgba(56,189,248,0.35)] transition-all flex items-center gap-1"
                          >
                            <span>Explore Blog Hub</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className={`relative text-xs sm:text-sm font-medium tracking-normal transition-all duration-200 group py-1 ${
                  active ? "text-sky-400 font-semibold" : "text-white/80 hover:text-white"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-300 rounded-full ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            );
          })}
        </div>

        {/* DESKTOP ACTION BUTTONS (Free AI Class + Apply Now) */}
        <div className="hidden lg:flex items-center gap-2.5 relative z-10">
          <Link
            to="/consultation"
            className="px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 border bg-white/[0.06] hover:bg-white/[0.12] text-white border-white/15 hover:border-white/30"
          >
            Free AI Class
          </Link>
          <Link
            to="/admission"
            className={`group relative px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
              isAiEasyAyiPage
                ? "bg-gradient-to-r from-[#f90058] to-[#184cef] hover:from-[#ff1a6c] hover:to-[#2e62ff] text-white shadow-[0_2px_16px_rgba(249,0,88,0.4)]"
                : "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 shadow-[0_2px_16px_rgba(56,189,248,0.35)]"
            }`}
          >
            <span>Apply Now</span>
            <span className="transition-transform duration-200 group-hover:translate-x-0.5 font-bold">→</span>
          </Link>
        </div>

        {/* MOBILE & TABLET MENU TOGGLE BUTTON (< lg screens) */}
        <div className="lg:hidden flex items-center gap-2 relative z-10">
          <button
            type="button"
            aria-label={isOpen ? "Close Menu" : "Open Navigation Menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-full transition-all duration-300 border flex items-center justify-center ${
              isOpen
                ? isAiEasyAyiPage
                  ? "bg-[#f90058] text-white border-[#f90058] shadow-[0_0_15px_rgba(249,0,88,0.4)]"
                  : "bg-sky-400 text-slate-950 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                : isAiEasyAyiPage
                ? "bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.16] text-white border-white/20"
                : "bg-white/10 hover:bg-white/20 text-white border-white/20"
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
              className={`absolute top-[calc(100%+10px)] left-0 w-full rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 lg:hidden z-50 flex flex-col gap-2 shadow-2xl border text-white max-h-[82vh] overflow-y-auto ${
                isAiEasyAyiPage
                  ? "bg-white/[0.08] backdrop-blur-3xl backdrop-saturate-150 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.25)]"
                  : "bg-[#040d1a]/95 backdrop-blur-2xl border-white/15"
              }`}
            >
              {/* Menu Header in Tablet/Mobile */}
              <div className="flex items-center justify-between pb-3 px-2 border-b border-white/10">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">
                  Navigation Menu
                </span>
                <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-500/30">
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
                            ? "bg-sky-400/10 border-sky-500/30"
                            : "border-transparent hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between py-2.5 px-3 sm:px-4 rounded-2xl hover:bg-white/[0.04]">
                          <Link
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`text-sm sm:text-base font-bold uppercase tracking-wider flex items-center gap-2 ${
                              active ? "text-sky-400" : "text-white"
                            }`}
                          >
                            <span>{link.name}</span>
                            {active && (
                              <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
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
                            className="p-2 rounded-xl bg-white/5 hover:bg-sky-400/20 text-white border border-white/10 transition-colors flex items-center gap-1"
                          >
                            <span className="text-[10px] font-mono font-bold uppercase hidden sm:inline">
                              Guides
                            </span>
                            <Icons.ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                mobileBlogExpanded ? "rotate-180 text-sky-400" : "text-slate-400"
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
                              <div className="p-3 mx-2 mb-2 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white/[0.02] rounded-xl border border-white/10">
                                <div className="sm:col-span-2 flex items-center justify-between pb-1 px-1">
                                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                                    Learning Guides
                                  </span>
                                  <Link
                                    to="/blog"
                                    onClick={() => setIsOpen(false)}
                                    className="text-[10px] font-mono font-bold text-sky-400 hover:underline"
                                  >
                                    View All →
                                  </Link>
                                </div>
                                {BLOG_POSTS.map((post, idx) => (
                                  <Link
                                    key={post.id}
                                    to={`/blog/${post.slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="text-xs font-mono font-bold text-slate-200 hover:text-white p-2.5 rounded-lg bg-white/[0.03] hover:bg-sky-400/15 border border-white/8 hover:border-sky-400/40 flex items-start gap-2 transition-all shadow-sm"
                                  >
                                    <span className="text-[10px] font-black bg-sky-950/60 text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded">
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
                    <a
                      key={link.path}
                      href={link.path}
                      onClick={(e) => handleNavClick(e, link.path)}
                      className={`text-sm sm:text-base font-semibold py-2.5 sm:py-3 px-3 sm:px-4 transition-all flex items-center justify-between group rounded-2xl ${
                        active
                          ? "bg-sky-400/15 text-sky-300 border border-sky-400/30 font-bold"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2">{link.name}</span>
                      <span
                        className={`w-2 h-2 rounded-full transition-transform ${
                          active
                            ? "bg-sky-400 scale-100 shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                            : "bg-sky-400 scale-0 group-hover:scale-100"
                        }`}
                      />
                    </a>
                  );
                })}
              </div>

              <div className="h-px w-full my-2 bg-white/10" />
              
              {/* Mobile Direct Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Link
                  to="/consultation"
                  onClick={() => setIsOpen(false)}
                  className="py-3 px-3 rounded-xl text-center text-xs font-semibold border transition-all bg-white/5 hover:bg-white/10 text-white border-white/15 hover:border-white/30"
                >
                  Free AI Class
                </Link>
                <Link
                  to="/admission"
                  onClick={() => setIsOpen(false)}
                  className="py-3 px-3 rounded-xl text-center text-xs font-bold bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 shadow-[0_2px_12px_rgba(56,189,248,0.35)] flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Apply Now</span>
                  <span className="font-bold">→</span>
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