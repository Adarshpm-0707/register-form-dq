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
      [faqKey]: !prev[faqKey]
    }));
  };

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const categories = ["All", "AI Fundamentals", "Machine Learning", "AI vs ML", "Agentic AI", "Career Roadmap", "Learning Timeline"];

  const filteredPosts = selectedCategory === "All"
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white text-[#050521] overflow-x-clip font-sans relative">
      {/* Hero Section */}
      <section className="relative z-10 min-h-[60vh] flex flex-col justify-center pt-28 pb-16 md:pt-36 md:pb-20 px-6 md:px-12 bg-white text-[#050521] border-b-2 border-[#050521]">
        <div className="max-w-[1400px] mx-auto text-center md:text-left relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-block bg-[#c6ff34] text-[#050521] text-xs font-black px-4 py-2 rounded-lg tracking-widest uppercase border-2 border-[#050521] shadow-[2px_2px_0px_0px_#050521]">
              AI & MACHINE LEARNING GUIDES 2026
            </span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95] max-w-5xl text-[#050521]">
              DeepStaq Knowledge Base:{" "}
              <span className="text-stroke-dark-lg">
                Master AI & ML
              </span>{" "}
              from Scratch to Production
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-xs font-mono uppercase text-slate-500">
              <span className="flex items-center gap-1.5 font-bold text-[#050521]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c6ff34] border border-[#050521]" />
                6 Comprehensive Core Guides
              </span>
              <span>•</span>
              <span>Updated for 2026</span>
              <span>•</span>
              <span>Industry-Focused Practical Learning</span>
            </div>
            <p className="text-slate-600 font-mono text-sm md:text-base max-w-3xl leading-relaxed">
              Explore our 6 foundational guides on Artificial Intelligence, Machine Learning, Deep Learning, Generative AI, and Agentic AI workflows. Built for developers, students, and professionals aiming to move from AI consumers to AI builders.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid of 6 Featured Articles */}
      <section className="relative z-10 py-12 px-6 md:px-12 max-w-[1400px] mx-auto border-b-2 border-[#050521]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-[#050521]">
              Explore All 6 Sections
            </h2>
            <p className="text-xs md:text-sm font-mono text-slate-500 mt-1">
              Select any guide to jump directly to its complete content or open its dedicated page.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-mono font-bold uppercase px-3 py-1.5 rounded-lg border-2 border-[#050521] transition-all ${
                  selectedCategory === cat
                    ? "bg-[#c6ff34] text-[#050521] shadow-[2px_2px_0px_0px_#050521]"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className="bg-white border-2 border-[#050521] rounded-3xl p-6 shadow-[6px_6px_0px_0px_#050521] hover:shadow-[10px_10px_0px_0px_#c6ff34] hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-[#050521] text-[#c6ff34] text-[10px] font-black px-3 py-1 rounded-md uppercase font-mono">
                    {post.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 font-bold">
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-black uppercase tracking-tight text-[#050521] leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs font-mono text-slate-600 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleScrollTo(post.id)}
                  className="text-xs font-black uppercase text-[#050521] hover:underline"
                >
                  Read Below ↓
                </button>
                <Link
                  to={`/blog/${post.slug}`}
                  className="bg-[#c6ff34] text-[#050521] text-xs font-black uppercase px-3.5 py-1.5 rounded-lg border border-[#050521] shadow-[2px_2px_0px_0px_#050521] hover:translate-x-0.5 transition-all"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full 6 Sections In-Depth Reading Area */}
      <section className="relative z-10 py-16 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          
          {/* Left Sticky Sidebar Directory */}
          <aside className="sticky top-36 hidden lg:block col-span-1">
            <div className="bg-slate-50 border-2 border-[#050521] rounded-3xl p-6 shadow-[6px_6px_0px_0px_#050521]">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#050521] mb-6 flex items-center gap-2">
                <span>📋</span> 6 Blog Sections
              </h3>
              <ul className="space-y-4">
                {BLOG_POSTS.map((post, idx) => (
                  <li key={post.id}>
                    <button
                      onClick={() => handleScrollTo(post.id)}
                      className="text-left text-xs font-mono font-bold uppercase tracking-wider text-slate-600 hover:text-[#050521] hover:translate-x-1 transition-all duration-200 block"
                    >
                      <span className="text-emerald-600 mr-1.5">0{idx + 1}.</span>
                      {post.title.split(":")[0].replace(" (2026)", "").replace(" (2026 Guide)", "")}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right Main Content Stream of All 6 Sections */}
          <main className="col-span-1 lg:col-span-3 space-y-24">
            {BLOG_POSTS.map((post, postIndex) => (
              <article
                key={post.id}
                id={post.id}
                className="scroll-mt-36 bg-white border-2 border-[#050521] rounded-3xl p-6 md:p-12 shadow-[8px_8px_0px_0px_#050521] space-y-8"
              >
                {/* Section Header */}
                <div className="space-y-4 pb-6 border-b-2 border-[#050521]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[11px] font-black tracking-widest text-[#050521] bg-[#c6ff34] px-3.5 py-1.5 rounded-lg uppercase font-mono border border-[#050521] shadow-[2px_2px_0px_0px_#050521]">
                      {post.badge} — {post.category}
                    </span>
                    <span className="bg-[#050521] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase font-mono">
                      {post.readTime}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {post.wordCount}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#050521] leading-tight">
                    {post.title}
                  </h2>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="text-xs font-mono text-slate-500">
                      Target Keyword: <strong className="text-[#050521]">"{post.targetKeyword}"</strong>
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase font-mono text-emerald-700 hover:text-[#050521] underline"
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
                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#050521] pt-4">
                          {sec.heading}
                        </h3>
                      )}
                      
                      <div className="prose prose-slate max-w-none text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-line font-sans">
                        {sec.content}
                      </div>

                      {sec.table && (
                        <div className="overflow-x-auto border-2 border-[#050521] rounded-2xl shadow-[4px_4px_0px_0px_#050521] my-4">
                          <table className="w-full text-left border-collapse text-xs md:text-sm">
                            <thead>
                              <tr className="bg-[#050521] text-white font-mono uppercase">
                                {sec.table.headers.map((h, hi) => (
                                  <th key={hi} className="p-3.5 border-b-2 border-[#050521]">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#050521]/10 font-mono">
                              {sec.table.rows.map((row, ri) => (
                                <tr key={ri} className="hover:bg-slate-50">
                                  {row.map((cell, ci) => (
                                    <td
                                      key={ci}
                                      className={`p-3.5 ${ci === 0 ? "font-bold text-[#050521]" : "text-slate-600"}`}
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
                  <div className="space-y-4 pt-6 border-t-2 border-[#050521]">
                    <h4 className="text-lg md:text-xl font-black uppercase text-[#050521]">
                      Section FAQs
                    </h4>
                    <div className="space-y-2.5">
                      {post.faqs.map((faq, fIdx) => {
                        const faqKey = `${post.id}-${fIdx}`;
                        return (
                          <div
                            key={fIdx}
                            className="border border-[#050521] rounded-xl overflow-hidden bg-slate-50"
                          >
                            <button
                              onClick={() => toggleFAQ(faqKey)}
                              className="w-full text-left p-4 font-black uppercase tracking-tight text-xs md:text-sm flex justify-between items-center gap-4 hover:bg-[#c6ff34]/20 transition-colors"
                            >
                              <span>{faq.q}</span>
                              <span className="w-6 h-6 rounded-full bg-[#050521] text-[#c6ff34] flex items-center justify-center font-mono text-xs flex-shrink-0">
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
                                  className="p-4 text-xs md:text-sm font-mono text-slate-600 border-t border-[#050521]/10 bg-white leading-relaxed"
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
                <div className="bg-slate-50 border-2 border-[#050521] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-black uppercase text-sm md:text-base text-[#050521]">
                      Ready to build hands-on with DeepStaq?
                    </h4>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      Explore our intensive industry programs with live GPU builds.
                    </p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Link
                      to="/programs"
                      className="w-full md:w-auto text-center bg-[#c6ff34] text-[#050521] text-xs font-black uppercase px-4 py-2.5 rounded-xl border border-[#050521] shadow-[2px_2px_0px_0px_#050521]"
                    >
                      View Programs →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </main>
        </div>
      </section>
    </div>
  );
}
