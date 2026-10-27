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
    <div className="min-h-screen bg-transparent text-white font-sans pb-24 selection:bg-sky-500/30 selection:text-white relative overflow-hidden">
      {/* AMBIENT GLOWS */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c6ff34]/10 rounded-full blur-[150px] pointer-events-none -z-0" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none -z-0" />

      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-12 border-b border-white/10 overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-6 relative z-10">
          {/* Badges / Pill row */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#c6ff34] text-[#090D11] text-xs font-black px-3.5 py-1.5 rounded-lg uppercase tracking-wider font-mono shadow-[0_0_20px_rgba(198,255,52,0.35)]">
              {pageData.badge || "DeepStaq Programme"}
            </span>
            {pageData.locationBadge && (
              <span className="bg-white/10 text-white border border-[#c6ff34]/30 text-xs font-mono font-bold px-3 py-1.5 rounded-lg">
                {pageData.locationBadge}
              </span>
            )}
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-md border border-white/10">
              6 Months · 160+ Hrs
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08] max-w-5xl">
            {pageData.title}
          </h1>

          {/* Subtitle / Intro */}
          <p className="text-slate-300 text-base md:text-lg max-w-4xl leading-relaxed font-sans font-medium">
            {pageData.subtitle}
          </p>

          {pageData.tagline && (
            <p className="text-slate-400 font-mono text-sm md:text-base max-w-3xl leading-relaxed pt-1">
              {pageData.tagline}
            </p>
          )}

          {/* CTA Buttons & Contact Quick Action */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/admission"
              className="bg-[#c6ff34] hover:bg-[#b5f024] text-[#090D11] font-black uppercase text-sm md:text-base px-8 py-4 rounded-2xl shadow-[0_0_25px_rgba(198,255,52,0.4)] hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>Enroll Now</span>
              <span>→</span>
            </Link>

            <a
              href="tel:+919495957011"
              className="bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs md:text-sm px-6 py-4 rounded-2xl border border-white/15 hover:border-white/30 transition-all flex items-center gap-2"
            >
              <span>Talk to Us: +91 949 595 7011</span>
            </a>

            <Link
              to="/consultation"
              className="text-xs md:text-sm font-mono font-bold uppercase tracking-wider text-slate-300 hover:text-white underline px-2 py-2 transition-colors"
            >
              Book Free 1:1 Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK JUMP NAVIGATION BAR (If Guide or Course) */}
      <div className="sticky top-20 z-40 bg-[#090D11]/90 backdrop-blur-md border-b border-white/10 py-3 px-6 shadow-xl hidden md:block">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between text-xs font-mono font-bold uppercase">
          <span className="text-slate-400">Quick Navigation:</span>
          <div className="flex items-center gap-6">
            {!pageData.isGuide && (
              <>
                <button onClick={() => handleScrollTo("overview")} className="text-slate-300 hover:text-white transition-colors">
                  Overview
                </button>
                <button onClick={() => handleScrollTo("format")} className="text-slate-300 hover:text-white transition-colors">
                  Format
                </button>
                <button onClick={() => handleScrollTo("syllabus")} className="text-slate-300 hover:text-white transition-colors">
                  Syllabus
                </button>
                <button onClick={() => handleScrollTo("capstone")} className="text-slate-300 hover:text-white transition-colors">
                  Capstone
                </button>
                <button onClick={() => handleScrollTo("careers")} className="text-slate-300 hover:text-white transition-colors">
                  Careers
                </button>
              </>
            )}
            {pageData.isGuide && (
              <>
                <button onClick={() => handleScrollTo("guide-content")} className="text-slate-300 hover:text-white transition-colors">
                  Full Guide
                </button>
              </>
            )}
            <button onClick={() => handleScrollTo("faqs")} className="text-slate-300 hover:text-white transition-colors">
              FAQs
            </button>
          </div>
          <Link
            to="/admission"
            className="bg-[#c6ff34] text-[#090D11] px-3.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(198,255,52,0.3)] hover:scale-105 transition-all"
          >
            Apply Now
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 space-y-16 relative z-10">

        {/* 1. WHY DEEPSTAQ / OVERVIEW SECTION */}
        {pageData.whyDeepStaq && (
          <section id="overview" className="scroll-mt-36 space-y-6">
            <div className="border border-white/10 rounded-3xl p-6 md:p-10 bg-[#0D1318]/90 backdrop-blur-xl shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#c6ff34]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#c6ff34] shadow-[0_0_8px_#c6ff34]" />
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                  {pageData.whyDeepStaq.title}
                </h2>
              </div>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                {pageData.whyDeepStaq.description}
              </p>
              {pageData.whyDeepStaq.mission && (
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <h4 className="text-xs font-mono font-black uppercase text-white tracking-wider">
                    Our Mission
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {pageData.whyDeepStaq.mission}
                  </p>
                </div>
              )}
              {pageData.whyDeepStaq.vision && (
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <h4 className="text-xs font-mono font-black uppercase text-white tracking-wider">
                    Our Vision
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
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
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">Format Benefits</div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                Why Choose This Format
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pageData.offlineAdvantages.map((adv, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl shadow-xl space-y-2 hover:border-[#c6ff34]/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#c6ff34]/15 text-white font-mono text-xs font-black flex items-center justify-center border border-[#c6ff34]/30">
                      ✓
                    </span>
                    <h3 className="text-base font-black uppercase text-white">
                      {adv.title}
                    </h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed pl-10">
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
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">Structure</div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                Course Format & Structure
              </h2>
            </div>

            <div className="overflow-x-auto border border-white/10 rounded-3xl shadow-2xl bg-[#0D1318]/90 backdrop-blur-xl">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-white/5 text-white font-mono uppercase tracking-wider border-b border-white/10">
                    <th className="p-4 md:p-5 w-1/3">Detail</th>
                    <th className="p-4 md:p-5">Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 font-mono">
                  {pageData.formatStructure.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                      <td className="p-4 md:p-5 font-bold text-white">
                        {row.detail}
                      </td>
                      <td className="p-4 md:p-5 text-slate-300">
                        {row.info}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pageData.guestSessionNote && (
              <div className="p-5 rounded-2xl bg-[#c6ff34]/10 border border-[#c6ff34]/30 text-xs md:text-sm font-mono text-white leading-relaxed">
                <strong className="text-white">Monthly Industry Masterclasses:</strong> {pageData.guestSessionNote}
              </div>
            )}
          </section>
        )}

        {/* OUTCOMES LIST (IF PRESENT) */}
        {pageData.outcomesList && (
          <section className="space-y-6">
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">Learning Outcomes</div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                What You'll Be Able to Do By the End
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pageData.outcomesList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl flex items-start gap-3 text-sm font-mono text-slate-300"
                >
                  <span className="text-white font-black">✔</span>
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
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-white">
                  Curriculum Breakdown
                </span>
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
                  What You'll Learn: Month by Month
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                6 Months Structured Progression
              </span>
            </div>

            {/* Desktop Month Tabs / Visual Step */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {pageData.syllabus.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSyllabusMonth(idx)}
                  className={`p-3 rounded-xl border text-left font-mono transition-all ${
                    activeSyllabusMonth === idx
                      ? "bg-[#c6ff34] text-[#090D11] border-[#c6ff34] shadow-[0_0_15px_rgba(198,255,52,0.35)]"
                      : "bg-[#0D1318]/90 text-slate-300 border-white/10 hover:border-[#c6ff34]/40"
                  }`}
                >
                  <div className="text-[10px] font-black uppercase opacity-75">
                    {s.month}
                  </div>
                  <div className="text-xs font-bold line-clamp-1">
                    {s.title.split(" (")[0]}
                  </div>
                </button>
              ))}
            </div>

            {/* Active Month Card Detail */}
            <div className="border border-white/10 rounded-3xl p-6 md:p-8 bg-[#0D1318]/90 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono font-black text-white uppercase tracking-widest">
                    {pageData.syllabus[activeSyllabusMonth].month} Focus
                  </span>
                  <h3 className="text-xl md:text-2xl font-black uppercase text-white">
                    {pageData.syllabus[activeSyllabusMonth].title}
                  </h3>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs font-bold text-white">
                  Hands-On Module
                </span>
              </div>
              <p className="text-slate-300 font-sans text-sm md:text-base leading-relaxed">
                {pageData.syllabus[activeSyllabusMonth].description}
              </p>
            </div>

            {/* All Months Grid on Mobile / Full Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {pageData.syllabus.map((m, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-white/10 hover:border-[#c6ff34]/40 bg-[#0D1318]/90 backdrop-blur-xl transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-black text-white bg-[#c6ff34]/10 px-2.5 py-1 rounded border border-[#c6ff34]/30">
                      {m.month}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      Module 0{idx + 1}
                    </span>
                  </div>
                  <h4 className="text-sm font-black uppercase text-white">
                    {m.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
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
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">Toolchain</div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                Tools & Technologies You'll Use
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {pageData.tools.map((t, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl shadow-xl space-y-2 hover:border-[#c6ff34]/40 transition-colors"
                >
                  <h4 className="text-sm font-black uppercase text-white">
                    {t.name}
                  </h4>
                  <p className="text-xs font-sans text-slate-400 leading-tight">
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
            <div className="border border-white/10 rounded-3xl p-6 md:p-10 bg-[#0D1318] text-white shadow-[0_0_50px_rgba(198,255,52,0.15)] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#c6ff34]/10 rounded-full blur-3xl pointer-events-none" />
              <span className="bg-[#c6ff34] text-[#090D11] text-xs font-black px-3 py-1 rounded-md uppercase font-mono tracking-wider shadow-[0_0_15px_rgba(198,255,52,0.35)]">
                Capstone Build
              </span>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
                {pageData.capstone.title}
              </h2>
              <p className="text-slate-300 font-sans text-sm md:text-base leading-relaxed">
                {pageData.capstone.description}
              </p>
              <div className="p-4 rounded-xl bg-white/5 text-white font-mono text-xs md:text-sm font-bold border border-white/10">
                {pageData.capstone.outcome}
              </div>

              {pageData.capstone.breakdown && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  {pageData.capstone.breakdown.map((b, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                      <span className="text-3xl md:text-4xl font-black text-white font-mono">
                        {b.percentage}
                      </span>
                      <h4 className="text-base font-bold uppercase text-white">
                        {b.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
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
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">Future Proof</div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                {pageData.careers.title}
              </h2>
            </div>
            <p className="text-slate-400 font-sans text-sm">
              {pageData.careers.description}
            </p>

            {/* Role Badges */}
            <div className="flex flex-wrap gap-2.5">
              {pageData.careers.pathways.map((role, idx) => (
                <span
                  key={idx}
                  className="bg-white/5 hover:bg-[#c6ff34]/20 hover:text-white text-slate-300 text-xs font-mono font-bold px-4 py-2 rounded-xl border border-white/10 transition-colors"
                >
                  {role}
                </span>
              ))}
            </div>

            {/* Beyond Traditional Jobs */}
            {pageData.careers.beyondJobs && (
              <div className="pt-4 space-y-3">
                <h3 className="text-lg font-black uppercase text-white">
                  Beyond a Traditional Job
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pageData.careers.beyondJobs.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl shadow-xl space-y-2"
                    >
                      <h4 className="text-sm font-black uppercase text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs font-sans text-slate-400 leading-relaxed">
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
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">Eligibility</div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                Who This Course Is For
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pageData.targetAudience.map((aud, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl flex items-start gap-3 shadow-xl"
                >
                  <span className="w-6 h-6 rounded-full bg-[#c6ff34]/15 text-white border border-[#c6ff34]/30 font-mono text-xs font-black flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs md:text-sm font-sans text-slate-300 leading-relaxed">
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
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white pt-6 border-t border-white/10">
                  {sec.heading}
                </h2>
                <div className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed space-y-4 font-sans whitespace-pre-line">
                  {sec.content}
                </div>

                {sec.table && (
                  <div className="overflow-x-auto border border-white/10 rounded-2xl shadow-2xl my-6 bg-[#0D1318]/90 backdrop-blur-xl">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className="bg-white/5 text-white font-mono uppercase tracking-wider border-b border-white/10">
                          {sec.table.headers.map((h, hi) => (
                            <th key={hi} className="p-4">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 font-mono">
                        {sec.table.rows.map((row, ri) => (
                          <tr key={ri} className="hover:bg-white/[0.03]">
                            {row.map((cell, ci) => (
                              <td
                                key={ci}
                                className={`p-4 ${
                                  ci === 0 ? "font-bold text-white" : "text-slate-300"
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
                  <div className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed space-y-4 font-sans whitespace-pre-line">
                    {sec.extraContent}
                  </div>
                )}
              </article>
            ))}
          </section>
        )}

        {/* 9. INTERACTIVE FAQS SECTION */}
        {pageData.faqs && pageData.faqs.length > 0 && (
          <section id="faqs" className="scroll-mt-36 space-y-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">Questions Answered</div>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                  Frequently Asked Questions
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {pageData.faqs.length} Answers
              </span>
            </div>

            <div className="space-y-3">
              {pageData.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-white/10 rounded-2xl overflow-hidden bg-[#0D1318]/90 backdrop-blur-xl transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left p-5 font-black uppercase tracking-tight text-sm md:text-base flex justify-between items-center gap-4 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                  >
                    <span className="text-white">{faq.q}</span>
                    <span className="w-7 h-7 rounded-full bg-[#c6ff34]/15 text-white border border-[#c6ff34]/30 flex items-center justify-center font-mono text-xs flex-shrink-0">
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
                        className="p-5 text-xs md:text-sm font-sans text-slate-300 border-t border-white/10 bg-white/[0.01] leading-relaxed whitespace-pre-line"
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
          <div className="bg-[#0D1318] text-white rounded-3xl p-8 md:p-12 border border-white/10 shadow-[0_0_50px_rgba(198,255,52,0.15)] space-y-6 text-center md:text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#c6ff34]/10 rounded-full blur-3xl pointer-events-none" />
            <span className="bg-[#c6ff34] text-[#090D11] text-xs font-black px-3.5 py-1.5 rounded-md uppercase font-mono tracking-wider inline-block shadow-[0_0_15px_rgba(198,255,52,0.35)]">
              Admissions Open
            </span>
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white max-w-3xl">
              {pageData.ctaSection?.heading || "Future Won't Wait. Why Should You?"}
            </h3>
            <p className="text-slate-300 font-sans text-sm md:text-base max-w-2xl leading-relaxed">
              {pageData.ctaSection?.subheading || "AI/ML talent is in short supply and rising demand. Enroll now to build real intelligent systems."}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link
                to="/admission"
                className="w-full sm:w-auto bg-[#c6ff34] hover:bg-[#b5f024] text-[#090D11] font-black uppercase text-sm md:text-base px-8 py-4 rounded-xl shadow-[0_0_25px_rgba(198,255,52,0.4)] hover:scale-[1.02] transition-all text-center"
              >
                {pageData.ctaSection?.btnText || "Enroll in DeepStaq's Course →"}
              </Link>
              <Link
                to="/consultation"
                className="w-full sm:w-auto bg-white/5 text-white border border-white/20 font-black uppercase text-sm px-6 py-4 rounded-xl hover:bg-white/10 transition-all text-center"
              >
                Book Free Consultation
              </Link>
            </div>

            {/* Contact quick strip */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs font-mono text-slate-400">
              <span>+91 949 595 7011</span>
              <span>•</span>
              <span>info@deepstaq.in</span>
              <span>•</span>
              <span>www.deepstaq.in</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
