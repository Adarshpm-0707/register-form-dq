import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { BLOG_POSTS } from "../data/blogPosts";

export default function Blog() {
  const [openFAQs, setOpenFAQs] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");

  const toggleFAQ = (faqKey) => {
    setOpenFAQs((prev) => ({
      ...prev,
      [faqKey]: !prev[faqKey],
    }));
  };

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const categories = [
    "All",
    "AI Fundamentals",
    "Machine Learning",
    "AI vs ML",
    "Agentic AI",
    "Career Roadmap",
    "Learning Timeline",
  ];

  const filteredPosts =
    selectedCategory === "All"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#090D11] text-white overflow-x-clip font-sans relative">
      {/* Background glow highlights */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#c6ff34]/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[55vh] flex flex-col justify-center pt-28 pb-16 md:pt-36 md:pb-20 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-[1400px] mx-auto text-center md:text-left relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 bg-[#c6ff34]/10 text-[#c6ff34] text-xs font-mono font-bold px-4 py-2 rounded-full tracking-wider uppercase border border-[#c6ff34]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c6ff34] animate-ping" />
              AI & MACHINE LEARNING GUIDES 2026
            </span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight leading-[0.95] max-w-5xl text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">Master AI & ML</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c6ff34] to-emerald-400">from Scratch to Production</span>
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-xs font-mono uppercase text-slate-400">
              <span className="flex items-center gap-2 font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-[#c6ff34]" />
                6 Comprehensive Core Guides
              </span>
              <span>•</span>
              <span>Updated for 2026</span>
              <span>•</span>
              <span>Industry-Focused Practical Learning</span>
            </div>
            <p className="text-slate-400 font-sans text-sm md:text-base max-w-3xl leading-relaxed">
              Explore our 6 foundational guides on Artificial Intelligence,
              Machine Learning, Deep Learning, Generative AI, and Agentic AI
              workflows. Built for developers, students, and professionals
              aiming to move from AI consumers to AI builders.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid of 6 Featured Articles */}
      <section className="relative z-10 py-12 px-6 md:px-12 max-w-[1400px] mx-auto border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
              Explore All 6 Sections
            </h2>
            <p className="text-xs md:text-sm font-sans text-slate-400 mt-1">
              Select any guide to jump directly to its complete content or open
              its dedicated page.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-mono font-bold uppercase px-3 py-1.5 rounded-lg border transition-all ${
                  selectedCategory === cat
                    ? "bg-[#c6ff34] text-[#090D11] border-[#c6ff34] shadow-[0_0_15px_rgba(198,255,52,0.3)] font-black"
                    : "bg-white/[0.04] text-slate-400 border-white/10 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#0D1318]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:border-[#c6ff34]/60 hover:shadow-[0_0_30px_rgba(198,255,52,0.15)] hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-[#c6ff34]/10 text-[#c6ff34] border border-[#c6ff34]/30 text-[10px] font-bold px-3 py-1 rounded-md uppercase font-mono">
                    {post.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-medium">
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-black uppercase tracking-tight text-white leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs font-sans text-slate-400 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleScrollTo(post.id)}
                  className="text-xs font-bold uppercase text-slate-400 hover:text-[#c6ff34] transition-colors"
                >
                  Read Below ↓
                </button>
                <Link
                  to={`/blog/${post.slug}`}
                  className="bg-[#c6ff34] text-[#090D11] text-xs font-black uppercase px-3.5 py-1.5 rounded-lg hover:shadow-[0_0_15px_rgba(198,255,52,0.4)] hover:translate-x-0.5 transition-all"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full 6 Sections In-Depth Reading Area */}
      <section className="relative z-10 py-16 px-6 md:px-12 max-w-5xl mx-auto">
        <main className="w-full space-y-16">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              id={post.id}
              className="scroll-mt-36 bg-[#0D1318]/90 border border-white/10 rounded-3xl p-6 md:p-12 backdrop-blur-xl shadow-2xl space-y-8"
            >
              {/* Section Header */}
              <div className="space-y-4 pb-6 border-b border-white/10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[11px] font-bold tracking-wider text-[#c6ff34] bg-[#c6ff34]/10 px-3.5 py-1.5 rounded-lg uppercase font-mono border border-[#c6ff34]/30">
                    {post.badge} — {post.category}
                  </span>
                  <span className="bg-white/10 text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase font-mono border border-white/10">
                    {post.readTime}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {post.wordCount}
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                  {post.title}
                </h2>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="text-xs font-mono text-slate-400">
                    Target Keyword:{" "}
                    <strong className="text-white">
                      "{post.targetKeyword}"
                    </strong>
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase font-mono text-[#c6ff34] hover:underline"
                  >
                    Open in Dedicated Page →
                  </Link>
                </div>
              </div>

              {/* Section Content Chunks */}
              <div className="space-y-8">
                {post.sections.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-3">
                    {sec.heading !== "Introduction" && (
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white pt-4">
                        {sec.heading}
                      </h3>
                    )}

                    <div className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line font-sans">
                      {sec.content}
                    </div>

                    {sec.table && (
                      <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/[0.02] shadow-xl my-4">
                        <table className="w-full text-left border-collapse text-xs md:text-sm">
                          <thead>
                            <tr className="bg-white/[0.05] text-[#c6ff34] font-mono uppercase">
                              {sec.table.headers.map((h, hi) => (
                                <th
                                  key={hi}
                                  className="p-3.5 border-b border-white/10"
                                >
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
                                    className={`p-3.5 ${ci === 0 ? "font-bold text-white" : "text-slate-300"}`}
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
                  </div>
                ))}
              </div>

              {/* Section Specific FAQs */}
              {post.faqs && post.faqs.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <h4 className="text-lg md:text-xl font-black uppercase text-white">
                    Section FAQs
                  </h4>
                  <div className="space-y-2.5">
                    {post.faqs.map((faq, fIdx) => {
                      const faqKey = `${post.id}-${fIdx}`;
                      return (
                        <div
                          key={fIdx}
                          className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.03]"
                        >
                          <button
                            onClick={() => toggleFAQ(faqKey)}
                            className="w-full text-left p-4 font-bold uppercase tracking-tight text-xs md:text-sm flex justify-between items-center gap-4 hover:bg-white/[0.05] transition-colors"
                          >
                            <span className="text-white">{faq.q}</span>
                            <span className="w-6 h-6 rounded-full bg-[#c6ff34] text-[#090D11] flex items-center justify-center font-mono text-xs flex-shrink-0 font-black">
                              {openFAQs[faqKey] ? "−" : "+"}
                            </span>
                          </button>
                          <AnimatePresence>
                            {openFAQs[faqKey] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="p-4 text-xs md:text-sm font-sans text-slate-300 border-t border-white/10 bg-white/[0.02] leading-relaxed"
                              >
                                {faq.a}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* DeepStaq Mini Action Box */}
              <div className="bg-gradient-to-r from-white/[0.04] to-[#c6ff34]/10 border border-[#c6ff34]/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-black uppercase text-sm md:text-base text-white">
                    Ready to build hands-on with DeepStaq?
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Explore our intensive industry programs with live GPU builds.
                  </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Link
                    to="/programs"
                    className="w-full md:w-auto text-center bg-[#c6ff34] text-[#090D11] text-xs font-black uppercase px-4 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(198,255,52,0.4)] transition-all"
                  >
                    View Programs →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </main>
      </section>
    </div>
  );
}
