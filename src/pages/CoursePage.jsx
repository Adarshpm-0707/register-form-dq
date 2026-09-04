import React, { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { COURSE_PAGES } from "../data/coursePages";

export default function CoursePage({ slugOverride }) {
  const params = useParams();
  const location = useLocation();
  const [openFAQs, setOpenFAQs] = useState({ 0: true });
  const [activeSyllabusMonth, setActiveSyllabusMonth] = useState(0);

  // Determine current page slug from props, route params, or pathname
  const currentSlug = slugOverride || params.slug || location.pathname.replace(/^\//, "");
  const pageData = COURSE_PAGES.find((p) => p.slug === currentSlug) || COURSE_PAGES[0];

  const toggleFAQ = (index) => {
    setOpenFAQs((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#050521] font-sans pb-24 selection:bg-[#c6ff34] selection:text-[#050521]">
      
      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-12 bg-gradient-to-b from-slate-50 to-white border-b-2 border-[#050521] overflow-hidden">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#050521_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-[1200px] mx-auto space-y-6 relative z-10">
          {/* Badges / Pill row */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#c6ff34] text-[#050521] text-xs font-black px-3.5 py-1.5 rounded-lg border-2 border-[#050521] uppercase tracking-wider font-mono shadow-[3px_3px_0px_0px_#050521]">
              {pageData.badge || "DeepStaq Programme"}
            </span>
            {pageData.locationBadge && (
              <span className="bg-[#050521] text-[#c6ff34] text-xs font-mono font-bold px-3 py-1.5 rounded-lg">
                {pageData.locationBadge}
              </span>
            )}
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
              6 Months · 160+ Hrs
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#050521] leading-[1.08] max-w-5xl">
            {pageData.title}
          </h1>

          {/* Subtitle / Intro */}
          <p className="text-slate-700 text-base md:text-lg max-w-4xl leading-relaxed font-sans font-medium">
            {pageData.subtitle}
          </p>

          {pageData.tagline && (
            <p className="text-slate-600 font-mono text-sm md:text-base max-w-3xl leading-relaxed pt-1">
              {pageData.tagline}
            </p>
          )}

          {/* CTA Buttons & Contact Quick Action */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/admission"
              className="bg-[#c6ff34] hover:bg-[#b5f024] text-[#050521] font-black uppercase text-sm md:text-base px-8 py-4 rounded-2xl border-2 border-[#050521] shadow-[5px_5px_0px_0px_#050521] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>Enroll Now</span>
              <span>→</span>
            </Link>

            <a
              href="tel:+919495957011"
              className="bg-white hover:bg-slate-50 text-[#050521] font-mono font-bold text-xs md:text-sm px-6 py-4 rounded-2xl border-2 border-[#050521] shadow-[4px_4px_0px_0px_#050521] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>📞 Talk to Us: +91 949 595 7011</span>
            </a>

            <Link
              to="/consultation"
              className="text-xs md:text-sm font-mono font-bold uppercase tracking-wider text-slate-700 hover:text-[#050521] underline px-2 py-2"
            >
              Book Free 1:1 Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK JUMP NAVIGATION BAR (If Guide or Course) */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 px-6 shadow-sm hidden md:block">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between text-xs font-mono font-bold uppercase">
          <span className="text-slate-400">Quick Navigation:</span>
          <div className="flex items-center gap-6">
            {!pageData.isGuide && (
              <>
                <button onClick={() => handleScrollTo("overview")} className="hover:text-emerald-700">
                  Overview
                </button>
                <button onClick={() => handleScrollTo("format")} className="hover:text-emerald-700">
                  Format
                </button>
                <button onClick={() => handleScrollTo("syllabus")} className="hover:text-emerald-700">
                  Syllabus
                </button>
                <button onClick={() => handleScrollTo("capstone")} className="hover:text-emerald-700">
                  Capstone
                </button>
                <button onClick={() => handleScrollTo("careers")} className="hover:text-emerald-700">
                  Careers
                </button>
              </>
            )}
            {pageData.isGuide && (
              <>
                <button onClick={() => handleScrollTo("guide-content")} className="hover:text-emerald-700">
                  Full Guide
                </button>
              </>
            )}
            <button onClick={() => handleScrollTo("faqs")} className="hover:text-emerald-700">
              FAQs
            </button>
          </div>
          <Link
            to="/admission"
            className="bg-[#050521] text-[#c6ff34] px-3.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider"
          >
            Apply Now
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 space-y-16">

        {/* 1. WHY DEEPSTAQ / OVERVIEW SECTION */}
        {pageData.whyDeepStaq && (
          <section id="overview" className="scroll-mt-36 space-y-6">
            <div className="border-2 border-[#050521] rounded-3xl p-6 md:p-10 bg-slate-50 shadow-[6px_6px_0px_0px_#050521] space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#c6ff34] border border-[#050521]" />
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
                  {pageData.whyDeepStaq.title}
                </h2>
              </div>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                {pageData.whyDeepStaq.description}
              </p>
              {pageData.whyDeepStaq.mission && (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <h4 className="text-xs font-mono font-black uppercase text-emerald-800 tracking-wider">
                    Our Mission
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {pageData.whyDeepStaq.mission}
                  </p>
                </div>
              )}
              {pageData.whyDeepStaq.vision && (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <h4 className="text-xs font-mono font-black uppercase text-emerald-800 tracking-wider">
                    Our Vision
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {pageData.whyDeepStaq.vision}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* OFFLINE / LOCAL SPECIFIC ADVANTAGES (IF PRESENT) */}
        {pageData.offlineAdvantages && (
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
              Why Choose This Format
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pageData.offlineAdvantages.map((adv, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border-2 border-[#050521] bg-white shadow-[4px_4px_0px_0px_#050521] space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#c6ff34] text-[#050521] font-mono text-xs font-black flex items-center justify-center border border-[#050521]">
                      ✓
                    </span>
                    <h3 className="text-base font-black uppercase text-[#050521]">
                      {adv.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed pl-8">
                    {adv.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. COURSE FORMAT & STRUCTURE TABLE */}
        {pageData.formatStructure && (
          <section id="format" className="scroll-mt-36 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
              Course Format & Structure
            </h2>

            <div className="overflow-x-auto border-2 border-[#050521] rounded-3xl shadow-[6px_6px_0px_0px_#050521] bg-white">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-[#050521] text-white font-mono uppercase tracking-wider">
                    <th className="p-4 md:p-5 border-b-2 border-[#050521] w-1/3">Detail</th>
                    <th className="p-4 md:p-5 border-b-2 border-[#050521]">Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {pageData.formatStructure.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 md:p-5 font-bold text-[#050521] bg-slate-50/50">
                        {row.detail}
                      </td>
                      <td className="p-4 md:p-5 text-slate-700">
                        {row.info}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pageData.guestSessionNote && (
              <div className="p-5 rounded-2xl bg-[#c6ff34]/20 border-2 border-[#050521] shadow-[3px_3px_0px_0px_#050521] text-xs md:text-sm font-mono text-[#050521] leading-relaxed">
                💡 <strong>Monthly Industry Masterclasses:</strong> {pageData.guestSessionNote}
              </div>
            )}
          </section>
        )}

        {/* OUTCOMES LIST (IF PRESENT) */}
        {pageData.outcomesList && (
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
              What You'll Be Able to Do By the End
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pageData.outcomesList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3 text-sm font-mono text-slate-800"
                >
                  <span className="text-emerald-700 font-black">✔</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. DETAILED SYLLABUS SECTION */}
        {pageData.syllabus && (
          <section id="syllabus" className="scroll-mt-36 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
                  Curriculum Breakdown
                </span>
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-[#050521]">
                  What You'll Learn: Month by Month
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                6 Months Structured Progression
              </span>
            </div>

            {/* Desktop Month Tabs / Visual Step */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {pageData.syllabus.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSyllabusMonth(idx)}
                  className={`p-3 rounded-xl border-2 text-left font-mono transition-all ${
                    activeSyllabusMonth === idx
                      ? "bg-[#050521] text-[#c6ff34] border-[#050521] shadow-[3px_3px_0px_0px_#c6ff34]"
                      : "bg-white text-[#050521] border-slate-200 hover:border-[#050521]"
                  }`}
                >
                  <div className="text-[10px] font-black uppercase opacity-70">
                    {s.month}
                  </div>
                  <div className="text-xs font-bold line-clamp-1">
                    {s.title.split(" (")[0]}
                  </div>
                </button>
              ))}
            </div>

            {/* Active Month Card Detail */}
            <div className="border-2 border-[#050521] rounded-3xl p-6 md:p-8 bg-white shadow-[6px_6px_0px_0px_#050521] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-mono font-black text-emerald-800 uppercase tracking-widest">
                    {pageData.syllabus[activeSyllabusMonth].month} Focus
                  </span>
                  <h3 className="text-xl md:text-2xl font-black uppercase text-[#050521]">
                    {pageData.syllabus[activeSyllabusMonth].title}
                  </h3>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-slate-100 font-mono text-xs font-bold text-[#050521]">
                  Hands-On Module
                </span>
              </div>
              <p className="text-slate-700 font-sans text-sm md:text-base leading-relaxed">
                {pageData.syllabus[activeSyllabusMonth].description}
              </p>
            </div>

            {/* All Months Grid on Mobile / Full Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {pageData.syllabus.map((m, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border-2 border-slate-200 hover:border-[#050521] bg-slate-50 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-black text-[#050521] bg-white px-2.5 py-1 rounded border border-slate-300">
                      {m.month}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      Module 0{idx + 1}
                    </span>
                  </div>
                  <h4 className="text-sm font-black uppercase text-[#050521]">
                    {m.title}
                  </h4>
                  <p className="text-xs text-slate-600 font-mono leading-relaxed">
                    {m.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. TOOLS & TECHNOLOGIES SECTION */}
        {pageData.tools && (
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
              Tools & Technologies You'll Use
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {pageData.tools.map((t, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border-2 border-[#050521] bg-white shadow-[4px_4px_0px_0px_#050521] space-y-2 hover:bg-[#c6ff34]/10 transition-colors"
                >
                  <h4 className="text-sm font-black uppercase text-[#050521]">
                    {t.name}
                  </h4>
                  <p className="text-xs font-mono text-slate-600 leading-tight">
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. CAPSTONE PROJECT SECTION */}
        {pageData.capstone && (
          <section id="capstone" className="scroll-mt-36 space-y-6">
            <div className="border-2 border-[#050521] rounded-3xl p-6 md:p-10 bg-[#050521] text-white shadow-[8px_8px_0px_0px_#c6ff34] space-y-6">
              <span className="bg-[#c6ff34] text-[#050521] text-xs font-black px-3 py-1 rounded-md uppercase font-mono tracking-wider">
                Capstone Build
              </span>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
                {pageData.capstone.title}
              </h2>
              <p className="text-slate-300 font-mono text-sm md:text-base leading-relaxed">
                {pageData.capstone.description}
              </p>
              <div className="p-4 rounded-xl bg-white/10 text-white font-mono text-xs md:text-sm font-bold border border-white/20">
                ✨ {pageData.capstone.outcome}
              </div>

              {pageData.capstone.breakdown && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  {pageData.capstone.breakdown.map((b, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <span className="text-3xl md:text-4xl font-black text-[#c6ff34] font-mono">
                        {b.percentage}
                      </span>
                      <h4 className="text-base font-bold uppercase text-white">
                        {b.title}
                      </h4>
                      <p className="text-xs text-slate-300 font-mono leading-relaxed">
                        {b.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 6. CAREERS & OUTCOMES */}
        {pageData.careers && (
          <section id="careers" className="scroll-mt-36 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
              {pageData.careers.title}
            </h2>
            <p className="text-slate-600 font-mono text-sm">
              {pageData.careers.description}
            </p>

            {/* Role Badges */}
            <div className="flex flex-wrap gap-2.5">
              {pageData.careers.pathways.map((role, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 hover:bg-[#c6ff34] text-[#050521] text-xs font-mono font-bold px-4 py-2 rounded-xl border border-slate-300 transition-colors"
                >
                  💼 {role}
                </span>
              ))}
            </div>

            {/* Beyond Traditional Jobs */}
            {pageData.careers.beyondJobs && (
              <div className="pt-4 space-y-3">
                <h3 className="text-lg font-black uppercase text-[#050521]">
                  Beyond a Traditional Job
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pageData.careers.beyondJobs.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border-2 border-[#050521] bg-white shadow-[4px_4px_0px_0px_#050521] space-y-2"
                    >
                      <h4 className="text-sm font-black uppercase text-[#050521]">
                        🚀 {item.title}
                      </h4>
                      <p className="text-xs font-mono text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* 7. TARGET AUDIENCE */}
        {pageData.targetAudience && (
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
              Who This Course Is For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pageData.targetAudience.map((aud, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-[#050521] text-[#c6ff34] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs md:text-sm font-mono text-slate-700 leading-relaxed">
                    {aud}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. IF GUIDE: GUIDE SECTIONS RENDER */}
        {pageData.guideSections && (
          <section id="guide-content" className="scroll-mt-36 space-y-12">
            {pageData.guideSections.map((sec, idx) => (
              <article key={idx} id={sec.id} className="scroll-mt-36 space-y-4">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521] pt-6 border-t-2 border-slate-200">
                  {sec.heading}
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 text-sm md:text-base leading-relaxed space-y-4 font-sans whitespace-pre-line">
                  {sec.content}
                </div>

                {sec.table && (
                  <div className="overflow-x-auto border-2 border-[#050521] rounded-2xl shadow-[4px_4px_0px_0px_#050521] my-6 bg-white">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className="bg-[#050521] text-white font-mono uppercase tracking-wider">
                          {sec.table.headers.map((h, hi) => (
                            <th key={hi} className="p-4 border-b-2 border-[#050521]">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono">
                        {sec.table.rows.map((row, ri) => (
                          <tr key={ri} className="hover:bg-slate-50">
                            {row.map((cell, ci) => (
                              <td
                                key={ci}
                                className={`p-4 ${
                                  ci === 0 ? "font-bold text-[#050521]" : "text-slate-600"
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {sec.extraContent && (
                  <div className="prose prose-slate max-w-none text-slate-700 text-sm md:text-base leading-relaxed space-y-4 font-sans whitespace-pre-line">
                    {sec.extraContent}
                  </div>
                )}
              </article>
            ))}
          </section>
        )}

        {/* 9. INTERACTIVE FAQS SECTION */}
        {pageData.faqs && pageData.faqs.length > 0 && (
          <section id="faqs" className="scroll-mt-36 space-y-6 pt-6 border-t-2 border-[#050521]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
                Frequently Asked Questions
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {pageData.faqs.length} Answers
              </span>
            </div>

            <div className="space-y-3">
              {pageData.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-2 border-[#050521] rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#050521] bg-white transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left p-5 font-black uppercase tracking-tight text-sm md:text-base flex justify-between items-center gap-4 bg-slate-50 hover:bg-[#c6ff34]/20 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="w-7 h-7 rounded-full bg-[#050521] text-[#c6ff34] flex items-center justify-center font-mono text-xs flex-shrink-0">
                      {openFAQs[index] ? "−" : "+"}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFAQs[index] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="p-5 text-xs md:text-sm font-mono text-slate-600 border-t border-[#050521]/10 bg-white leading-relaxed whitespace-pre-line"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 10. FINAL CALL TO ACTION */}
        <section className="pt-8">
          <div className="bg-[#050521] text-white rounded-3xl p-8 md:p-12 border-2 border-[#050521] shadow-[8px_8px_0px_0px_#c6ff34] space-y-6 text-center md:text-left">
            <span className="bg-[#c6ff34] text-[#050521] text-xs font-black px-3.5 py-1.5 rounded-md uppercase font-mono tracking-wider inline-block">
              Admissions Open
            </span>
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white max-w-3xl">
              {pageData.ctaSection?.heading || "Future Won't Wait. Why Should You?"}
            </h3>
            <p className="text-slate-300 font-mono text-sm md:text-base max-w-2xl leading-relaxed">
              {pageData.ctaSection?.subheading || "AI/ML talent is in short supply and rising demand. Enroll now to build real intelligent systems."}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link
                to="/admission"
                className="w-full sm:w-auto bg-[#c6ff34] hover:bg-[#b5f024] text-[#050521] font-black uppercase text-sm md:text-base px-8 py-4 rounded-xl border-2 border-[#050521] shadow-[4px_4px_0px_0px_white] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center"
              >
                {pageData.ctaSection?.btnText || "Enroll in DeepStaq's Course →"}
              </Link>
              <Link
                to="/consultation"
                className="w-full sm:w-auto bg-transparent text-white border-2 border-white font-black uppercase text-sm px-6 py-4 rounded-xl hover:bg-white/10 transition-all text-center"
              >
                Book Free Consultation
              </Link>
            </div>

            {/* Contact quick strip */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs font-mono text-slate-400">
              <span>📞 +91 949 595 7011</span>
              <span>•</span>
              <span>✉️ info@deepstaq.in</span>
              <span>•</span>
              <span>🌐 www.deepstaq.in</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
