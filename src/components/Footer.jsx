import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [openFaq, setOpenFaq] = useState(null);
  const currentYear = new Date().getFullYear();

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

  return (
    <footer className="border-t border-white/10 bg-[#070B0E] pt-16 sm:pt-20 pb-12 px-4 sm:px-6 md:px-10 lg:px-16 text-white font-sans">
      <div className="max-w-[1440px] mx-auto space-y-16">
        
        {/* Top Banner: READY TO START? Your AI journey starts here. */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-12 border-b border-white/10">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#c6ff34]">
              READY TO START?
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Your AI journey <span className="text-[#c6ff34]">starts here.</span>
            </h2>
            <p className="text-sm text-slate-400 font-normal leading-relaxed">
              Talk to our team, understand the right program for you and take the first step towards a future in AI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              to="/admission"
              className="btn-slide-wrap px-8 py-4 rounded-full bg-[#c6ff34] hover:bg-[#bbf029] text-[#090D11] font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(198,255,52,0.35)] flex items-center gap-2"
            >
              <span>Apply Now</span>
              <span className="font-bold">→</span>
            </Link>
            <Link
              to="/consultation"
              className="px-7 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/15 text-sm font-semibold transition-colors"
            >
              Book a Consultation
            </Link>
          </div>
        </div>

        {/* Bottom 4-Column Grid: FAQ / Quick Links / Contact / Socials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: FAQ Section (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              FAQ
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Frequently Asked Questions.
            </h3>
            
            {/* Social icons row */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { label: "Instagram", href: "https://www.instagram.com/deepstaq/", icon: "📸" },
                { label: "LinkedIn", href: "https://www.linkedin.com/company/deepstaq/", icon: "💼" },
                { label: "YouTube", href: "https://youtube.com/@deepstaq", icon: "▶️" },
              ].map((soc, sIdx) => (
                <a
                  key={sIdx}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.label}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#c6ff34] text-slate-300 hover:text-[#090D11] border border-white/10 flex items-center justify-center text-sm transition-all"
                >
                  {soc.icon}
                </a>
              ))}
            </div>

            {/* Quick Expandable FAQs */}
            <div className="space-y-2 pt-2 text-xs">
              {faqItems.map((faq, fIdx) => (
                <div key={fIdx} className="border-b border-white/10 pb-2">
                  <button
                    onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                    className="w-full text-left py-1 text-slate-300 hover:text-[#c6ff34] font-medium flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>&gt; {faq.q}</span>
                    <span className="text-slate-500 font-bold">{openFaq === fIdx ? "−" : "+"}</span>
                  </button>
                  {openFaq === fIdx && (
                    <p className="text-slate-400 text-[11px] pt-1 pl-3 leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Quick Links
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li>
                <Link to="/programs" className="hover:text-[#c6ff34] transition-colors">Programs</Link>
              </li>
              <li>
                <Link to="/#experience" className="hover:text-[#c6ff34] transition-colors">Learning Experience</Link>
              </li>
              <li>
                <Link to="/#projects" className="hover:text-[#c6ff34] transition-colors">Projects</Link>
              </li>
              <li>
                <Link to="/#events" className="hover:text-[#c6ff34] transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#c6ff34] transition-colors">AI Learning Guides</Link>
              </li>
              <li>
                <Link to="/scholarship" className="hover:text-[#c6ff34] transition-colors">Scholarship</Link>
              </li>
              <li>
                <Link to="/aptitude" className="hover:text-[#c6ff34] transition-colors">Aptitude Test</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#c6ff34] transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Direct Actions (4 cols) */}
          <div id="contact" className="lg:col-span-4 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Contact
            </div>
            
            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Kannur, Kerala, India</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <a href="mailto:info@deepstaq.in" className="hover:text-[#c6ff34] transition-colors">
                  info@deepstaq.in
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+919495957011" className="hover:text-[#c6ff34] transition-colors font-bold text-white">
                  +91 94959 57011
                </a>
              </div>
            </div>

            <div className="pt-3">
              <Link
                to="/admission"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c6ff34] hover:bg-[#bbf029] text-[#090D11] text-xs font-bold tracking-wide transition-all shadow-md"
              >
                <span>Apply Now</span>
                <span>→</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Copyright & Legal Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} Deepstaq. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}