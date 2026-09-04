import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Asset 1@4x.png";

const Icons = {
  Instagram: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  Facebook: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  LinkedIn: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Phone: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Mail: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Icons.Instagram, href: "https://www.instagram.com/deepstaq/", label: "Instagram" },
    { icon: Icons.Facebook, href: "https://www.facebook.com/profile.php?id=61588950842506", label: "Facebook" },
    { icon: Icons.LinkedIn, href: "https://www.linkedin.com/company/deepstaq/", label: "LinkedIn" }
  ];

  const navItems = [
    { name: "Home", path: "/", icon: "⚡" },
    { name: "Programs", path: "/programs", icon: "🚀" },
    { name: "Blog Hub", path: "/blog", icon: "📚" },
    { name: "Aptitude Test", path: "/aptitude", icon: "🧠" },
    { name: "Admission", path: "/admission", icon: "📝" },
    { name: "Consultation", path: "/consultation", icon: "💬" },
    { name: "Contact Us", path: "/contact", icon: "📍" },
  ];

  return (
    <footer className="w-full bg-[#050521] border-t-2 border-[#c6ff34]/30 py-10 md:py-14 px-4 sm:px-6 md:px-12 text-slate-400">
      
      {/* ─────────────────────────────────────────────────────────────
          MOBILE VIEW: Ultra-Modern Cyber-Bento Footer
         ───────────────────────────────────────────────────────────── */}
      <div className="block md:hidden space-y-8">
        
        {/* 1. Mobile Brand Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <div className="flex justify-center">
            <Link to="/">
              <img
                src={logo}
                alt="DeepStaq Logo"
                className="h-8 w-auto object-contain filter brightness-110"
              />
            </Link>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-[#c6ff34]/15 text-[#c6ff34] text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#c6ff34]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c6ff34] animate-pulse" />
            AI & Machine Learning Academy
          </span>
          <p className="text-slate-400 font-mono text-xs leading-relaxed max-w-sm mx-auto">
            Practical AI training institute in Kerala. Building the next generation of AI engineers and practitioners.
          </p>

          {/* Social Icons Row */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {socialLinks.map((soc, i) => (
              <a
                key={i}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={soc.label}
                className="w-10 h-10 border border-white/15 bg-white/5 text-slate-300 hover:text-[#050521] hover:bg-[#c6ff34] rounded-xl flex items-center justify-center transition-all duration-200"
              >
                <soc.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* 2. Mobile Quick Navigation Grid (Bento Buttons) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono font-black uppercase tracking-widest text-[#c6ff34]">
              Quick Navigation
            </span>
            <span className="text-[10px] font-mono text-slate-500">7 Sections</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item, idx) => (
              <Link
                key={item.path}
                to={item.path}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between font-mono text-xs ${
                  idx === 6
                    ? "col-span-2 bg-[#c6ff34]/10 border-[#c6ff34]/40 text-[#c6ff34] font-black"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <span>{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-bold">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 3. Mobile Fast Connect & Direct Action Buttons */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-3.5">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#c6ff34] block">
            Admissions & Assistance
          </span>

          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:+919495957011"
              className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-slate-200 font-mono text-xs font-bold active:bg-[#c6ff34] active:text-[#050521] transition-all"
            >
              <Icons.Phone className="w-3.5 h-3.5 text-[#c6ff34]" />
              <span>Call Us</span>
            </a>

            <a
              href="mailto:deepstackbyaleef@gmail.com"
              className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-slate-200 font-mono text-xs font-bold active:bg-[#c6ff34] active:text-[#050521] transition-all"
            >
              <Icons.Mail className="w-3.5 h-3.5 text-[#c6ff34]" />
              <span>Email</span>
            </a>
          </div>

          <Link
            to="/admission"
            className="w-full bg-[#c6ff34] text-[#050521] py-3.5 px-4 rounded-2xl font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_white] active:translate-y-0.5 transition-all"
          >
            <span>Apply for Admission</span>
            <span>→</span>
          </Link>
        </div>

        {/* 4. Mobile Bottom Live Status & Copyright */}
        <div className="pt-4 border-t border-white/10 text-center space-y-2 font-mono text-[10px]">
          <div className="flex items-center justify-center gap-2 text-[#c6ff34]">
            <span className="w-2 h-2 rounded-full bg-[#c6ff34] animate-pulse" />
            <span className="font-bold uppercase tracking-wider">Admissions Open 2026</span>
          </div>
          <p className="text-slate-500 uppercase tracking-widest">
            &copy; {currentYear} DeepStaq // All Rights Reserved
          </p>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          DESKTOP / LAPTOP VIEW: High-Tech Cyber-Bento Grid
         ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:block max-w-[1300px] mx-auto space-y-12">
        
        {/* Top Interactive CTA Banner */}
        <div className="bg-gradient-to-r from-white/[0.07] via-white/[0.03] to-white/[0.07] border border-white/15 rounded-3xl p-8 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-2 text-[11px] font-mono font-black uppercase tracking-widest text-[#c6ff34]">
              <span className="w-2 h-2 rounded-full bg-[#c6ff34] animate-pulse" />
              Next Cohort Starting Soon
            </span>
            <h3 className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-white">
              Ready to Become an AI Builder?
            </h3>
            <p className="text-slate-400 font-mono text-xs">
              Go from zero coding to shipping real-world AI/ML capstone projects in 6 months.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              to="/aptitude"
              className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl border border-white/20 hover:border-[#c6ff34] transition-all"
            >
              Take Aptitude Test
            </Link>
            <Link
              to="/admission"
              className="bg-[#c6ff34] hover:bg-[#b5f024] text-[#050521] font-black text-xs uppercase tracking-widest px-7 py-3.5 rounded-xl border border-[#050521] shadow-[4px_4px_0px_0px_white] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              Apply for Admission →
            </Link>
          </div>
        </div>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-12 gap-8 pb-10 border-b border-white/10">

          {/* Col 1 (5 Cols): Brand, Vision & Socials */}
          <div className="col-span-5 space-y-5 pr-6">
            <Link to="/" className="inline-block">
              <img
                src={logo}
                alt="DeepStaq Logo"
                className="h-9 w-auto object-contain filter brightness-110"
              />
            </Link>
            <p className="text-slate-400 font-mono text-xs leading-relaxed">
              Kerala's leading practical Artificial Intelligence & Machine Learning institute. We bridge the gap between AI consumers and AI engineers through rigorous hands-on projects and industry mentorship.
            </p>
            
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#c6ff34]" />
              <span>Campus: Kannur, Kerala · Global Online</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((soc, i) => (
                <a
                  key={i}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.label}
                  className="w-10 h-10 border border-white/15 hover:border-[#c6ff34] bg-white/5 hover:bg-[#c6ff34] text-slate-300 hover:text-[#050521] rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm"
                >
                  <soc.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 (3 Cols): Quick Navigation */}
          <div className="col-span-3 space-y-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c6ff34]" />
              <h4 className="font-black uppercase tracking-wider text-[#c6ff34]">Navigation</h4>
            </div>
            <ul className="space-y-2.5 text-slate-300">
              {navItems.map((item, idx) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="group flex items-center gap-2 hover:text-[#c6ff34] transition-colors"
                  >
                    <span className="text-[10px] text-slate-500 font-bold group-hover:text-[#c6ff34]">
                      0{idx + 1}.
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 (4 Cols): Direct Admissions Helpdesk */}
          <div className="col-span-4 space-y-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c6ff34]" />
              <h4 className="font-black uppercase tracking-wider text-[#c6ff34]">Admissions Desk</h4>
            </div>

            <div className="space-y-3">
              <a
                href="tel:+919495957011"
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c6ff34] flex items-center gap-3.5 transition-all text-slate-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#c6ff34]/20 text-[#c6ff34] group-hover:bg-[#c6ff34] group-hover:text-[#050521] flex items-center justify-center transition-colors">
                  <Icons.Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Direct Hotline</span>
                  <span className="font-bold text-sm text-white">+91 94959 57011</span>
                </div>
              </a>

              <a
                href="mailto:deepstackbyaleef@gmail.com"
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c6ff34] flex items-center gap-3.5 transition-all text-slate-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#c6ff34]/20 text-[#c6ff34] group-hover:bg-[#c6ff34] group-hover:text-[#050521] flex items-center justify-center transition-colors">
                  <Icons.Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Email Enquiries</span>
                  <span className="font-bold text-xs text-white truncate block">deepstackbyaleef@gmail.com</span>
                </div>
              </a>

              <Link
                to="/consultation"
                className="block text-center bg-[#c6ff34] text-[#050521] font-black uppercase text-xs tracking-wider py-3.5 px-4 rounded-2xl shadow-[4px_4px_0px_0px_white] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                Book Free Consultation →
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom System Bar */}
        <div className="flex items-center justify-between text-slate-500 font-mono text-[11px] uppercase tracking-wider">
          <div>
            &copy; {currentYear} DeepStaq AI Systems // All Rights Reserved
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c6ff34]" />
              Zero to AI Builder
            </span>
            <span>•</span>
            <Link to="/programs" className="hover:text-white transition-colors">Curriculum</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}