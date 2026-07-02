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

  return (
    <footer className="w-full bg-[#050521] border-t-2 border-[#c6ff34]/30 py-12 px-6 md:px-12 text-slate-400">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">

        {/* Brand Section: Logo & Small Description */}
        <div className="flex flex-col items-center md:items-start space-y-3 max-w-md">
          <Link to="/">
            <img
              src={logo}
              alt="DeepStaq Logo"
              className="h-8 md:h-9 w-auto object-contain filter brightness-110"
            />
          </Link>
          <p className="text-slate-400 font-mono text-xs leading-relaxed">
            Learn AI & ML in Kannur
          </p>
        </div>

        {/* Contact Details & Social Icons */}
        <div className="flex flex-col items-center md:items-end space-y-4 font-mono text-xs">
          {/* Contact Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-slate-300">
            <a
              href="tel:+919495957011"
              className="flex items-center gap-2 hover:text-[#c6ff34] transition-colors duration-200"
            >
              <Icons.Phone className="w-4 h-4 text-[#c6ff34]" />
              <span>+91 94959 57011</span>
            </a>
            <a
              href="mailto:deepstackbyaleef@gmail.com"
              className="flex items-center gap-2 hover:text-[#c6ff34] transition-colors duration-200"
            >
              <Icons.Mail className="w-4 h-4 text-[#c6ff34]" />
              <span>deepstackbyaleef@gmail.com</span>
            </a>


            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((soc, i) => (
                <a
                  key={i}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.label}
                  className="w-9 h-9 border border-white/10 hover:border-[#c6ff34] bg-white/5 hover:bg-[#c6ff34] text-slate-300 hover:text-[#050521] rounded-lg flex items-center justify-center transition-all duration-200"
                >
                  <soc.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Line */}
      <div className="max-w-[1200px] mx-auto mt-8 pt-6 border-t border-white/5 text-center text-slate-500 font-mono text-[10px] uppercase tracking-wider">
        &copy; {currentYear} DeepStaq System // All Rights Reserved
      </div>
    </footer>
  );
}