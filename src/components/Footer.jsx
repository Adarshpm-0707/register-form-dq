import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Asset 1@4x.png";

export default function Footer() {
  const [openFaq, setOpenFaq] = useState(null);
  const currentYear = new Date().getFullYear();

  // STRICTLY only the items present in the site navbar (no extra links)
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Programs", path: "/programs" },
    { name: "Blog", path: "/blog" },
    { name: "Scholarship", path: "/scholarship" },
    { name: "Admission", path: "/admission" },
    { name: "Contact", path: "/contact" },
  ];

  const faqItems = [
    {
      q: "What are the eligibility criteria?",
      a: "No coding background is strictly required. We begin with Python fundamentals, algorithmic thinking, and math essentials.",
    },
    {
      q: "Is there placement assistance provided?",
      a: "Yes. 100% placement support including mock technical interviews, resume polishing, and portfolio showcases to hiring partners.",
    },
    {
      q: "Can I work on my own projects?",
      a: "Absolutely. Students frequently build domain-specific capstones (healthcare, finance, robotics) under 1-on-1 mentor guidance.",
    },
  ];

  const socialLinks = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/deepstaq/",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      hoverColor: "hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-500 hover:border-pink-500/50 hover:text-white",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/deepstaq/",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      hoverColor: "hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white",
    },
    {
      label: "YouTube",
      href: "https://youtube.com/@deepstaq",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      hoverColor: "hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white",
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/919495957011?text=Hello%20DeepStaq!%20I%20would%20like%20to%20know%20more%20about%20your%20programs.",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
        </svg>
      ),
      hoverColor: "hover:bg-[#25D366] hover:border-[#25D366] hover:text-slate-950",
    },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-[#040812] pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-14 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 text-white font-sans overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[450px] sm:w-[650px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12)_0%,transparent_70%)] blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-[400px] sm:w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08)_0%,transparent_70%)] blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14 lg:space-y-16">

        {/* ══════════════════════════════════════════════════════════
            MOBILE VIEW ONLY: BRAND NEW STYLE, LAYOUT & APP-CARD DESIGN
            (Strictly renders on mobile view < md)
           ══════════════════════════════════════════════════════════ */}
        <div className="block md:hidden space-y-7">
          
          {/* Mobile Brand Card with Logo & Socials */}
          <div className="rounded-3xl p-6 bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-lg text-center space-y-4">
            <Link to="/" className="inline-block">
              <img
                src={logo}
                alt="DeepStaq Logo"
                className="h-8 w-auto mx-auto object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </Link>
            
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              Empowering next-gen AI pioneers and engineers through practical, industry-led learning.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-[11px] font-mono text-sky-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Kannur Campus • Admissions Open</span>
            </div>

            {/* Social Channels Row */}
            <div className="flex items-center justify-center gap-3 pt-1">
              {socialLinks.map((soc, sIdx) => (
                <a
                  key={sIdx}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.label}
                  className={`w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/10 text-slate-200 flex items-center justify-center transition-all ${soc.hoverColor}`}
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Hub: 2-Column Grid of Exact Navbar Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-mono font-bold tracking-widest text-sky-400 uppercase">
                Explore DeepStaq
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                Navbar Links
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="p-3.5 rounded-2xl bg-white/[0.04] active:bg-sky-500/10 border border-white/10 active:border-sky-400/40 backdrop-blur-md flex items-center justify-between transition-all group shadow-sm"
                >
                  <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                    {item.name}
                  </span>
                  <span className="text-xs text-slate-500 group-hover:text-sky-400 transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Contact Quick Card */}
          <div className="rounded-3xl p-5 bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-3">
            <div className="text-[11px] font-mono font-bold tracking-widest text-sky-400 uppercase">
              Contact & Support
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-slate-300 font-sans">Kannur, Kerala, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a
                  href="mailto:deepstackbyaleef@gmail.com"
                  className="text-slate-200 hover:text-sky-400 break-all transition-colors underline decoration-white/20 underline-offset-2"
                >
                  deepstackbyaleef@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a
                  href="tel:+919495957011"
                  className="text-white hover:text-sky-400 font-bold transition-colors font-mono"
                >
                  +91 94959 57011
                </a>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <svg className="w-4 h-4 text-[#25D366] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
                </svg>
                <a
                  href="https://wa.me/919495957011?text=Hello%20DeepStaq!%20I%20would%20like%20to%20know%20more%20about%20your%20programs."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1 font-sans"
                >
                  <span>Chat on WhatsApp</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════
            LAPTOP & TABLET VIEW: ELEGANT MULTI-COLUMN LAYOUT
            (Strictly renders on md: and above)
           ══════════════════════════════════════════════════════════ */}
        <div className="hidden md:grid md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Column (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            <Link to="/" className="inline-block group">
              <img
                src={logo}
                alt="DeepStaq Logo"
                className="h-8 w-auto object-contain transition-opacity group-hover:opacity-85"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed max-w-sm">
              Empowering students, professionals, and creators with hands-on AI & Machine Learning mastery. Practical learning, industry mentorship, and real-world projects.
            </p>

            {/* Social icons row */}
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map((soc, sIdx) => (
                <a
                  key={sIdx}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.label}
                  title={soc.label}
                  className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 flex items-center justify-center transition-all duration-200 shadow-sm ${soc.hoverColor}`}
                >
                  {soc.icon}
                </a>
              ))}
            </div>

            {/* Campus badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Kannur Campus • Admissions Open</span>
            </div>
          </div>

          {/* Navbar Links Column (3 cols) - strictly navbar items only */}
          <div className="md:col-span-3 space-y-3.5">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400">
              Navigation
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-medium">
              {navLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="hover:text-sky-400 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="text-slate-600 group-hover:text-sky-400 transition-colors text-xs">
                      →
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column (4 cols) */}
          <div id="contact" className="md:col-span-4 space-y-3.5">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400">
              Contact & Support
            </div>
            
            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-slate-300 leading-snug">Kannur, Kerala, India</span>
              </div>

              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a
                  href="mailto:deepstackbyaleef@gmail.com"
                  className="text-slate-300 hover:text-sky-400 transition-colors break-all leading-snug"
                >
                  deepstackbyaleef@gmail.com
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a
                  href="tel:+919495957011"
                  className="text-white hover:text-sky-400 font-bold transition-colors font-mono"
                >
                  +91 94959 57011
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
                </svg>
                <a
                  href="https://wa.me/919495957011?text=Hello%20DeepStaq!%20I%20would%20like%20to%20know%20more%20about%20your%20programs."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Chat on WhatsApp</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════
            EXPANDABLE FAQ SECTION (Smooth Accordion for All Viewports)
           ══════════════════════════════════════════════════════════ */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Frequently Asked Questions
            </div>
            <span className="text-[11px] font-mono text-slate-500">Tap to expand</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {faqItems.map((faq, fIdx) => {
              const isOpen = openFaq === fIdx;
              return (
                <div
                  key={fIdx}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-sky-400/30 transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                    className="w-full text-left flex items-start justify-between gap-3 cursor-pointer group"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-sky-300 transition-colors leading-snug">
                      {faq.q}
                    </span>
                    <span className={`w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center text-xs text-sky-400 font-bold shrink-0 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <p className="text-xs text-slate-400 pt-2.5 leading-relaxed border-t border-white/5 mt-2.5">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            COPYRIGHT & LEGAL BAR (Fully Responsive)
           ══════════════════════════════════════════════════════════ */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center md:text-left">
          <div>
            © {currentYear} <strong className="text-slate-200 font-semibold">Deepstaq Technologies</strong>. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-medium text-slate-400">
            <Link to="/contact" className="hover:text-sky-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-700">•</span>
            <Link to="/contact" className="hover:text-sky-400 transition-colors">
              Terms of Service
            </Link>
            <span className="text-slate-700">•</span>
            <Link to="/contact" className="hover:text-sky-400 transition-colors">
              Sitemap
            </Link>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="text-sky-400/80 font-mono hidden sm:inline">Crafted for the AI Era</span>
          </div>
        </div>

      </div>
    </footer>
  );
}