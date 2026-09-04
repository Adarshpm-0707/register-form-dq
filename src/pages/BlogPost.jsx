import React, { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BLOG_POSTS } from "../data/blogPosts";

export default function BlogPost() {
  const { slug } = useParams();
  const [openFAQs, setOpenFAQs] = useState({});

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

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

  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const nextPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-white text-[#050521] font-sans pb-24">
      {/* Header / Hero */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16 px-6 md:px-12 bg-slate-50 border-b-2 border-[#050521]">
        <div className="max-w-[1100px] mx-auto space-y-6">
          {/* Breadcrumb & Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/blog"
              className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-[#050521] flex items-center gap-1"
            >
              ← Back to Blog Hub
            </Link>
            <span className="text-slate-300">•</span>
            <span className="bg-[#c6ff34] text-[#050521] text-[11px] font-black px-3 py-1 rounded-md border border-[#050521] uppercase tracking-wider font-mono shadow-[2px_2px_0px_0px_#050521]">
              {post.category}
            </span>
            <span className="bg-[#050521] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider font-mono">
              {post.readTime}
            </span>
            <span className="text-slate-400 text-xs font-mono">
              {post.wordCount}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#050521] leading-[1.05]">
            {post.title}
          </h1>

          <p className="text-slate-600 font-mono text-sm md:text-base max-w-3xl leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 pt-2 border-t border-slate-200">
            <span className="font-bold text-[#050521]">By DeepStaq Editorial</span>
            <span>•</span>
            <span>Published {post.publishDate}</span>
            <span>•</span>
            <span className="text-slate-400">Target Keyword: "{post.targetKeyword}"</span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-[1100px] mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          
          {/* Sidebar TOC */}
          <aside className="sticky top-28 hidden lg:block col-span-1">
            <div className="bg-slate-50 border-2 border-[#050521] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#050521]">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#050521] mb-4 flex items-center gap-2">
                <span>📑</span> In This Guide
              </h3>
              <ul className="space-y-2.5">
                {post.sections.map((sec, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleScrollTo(`section-${idx}`)}
                      className="text-left text-[11px] font-mono font-bold text-slate-600 hover:text-[#050521] hover:translate-x-1 transition-all leading-tight"
                    >
                      {sec.heading}
                    </button>
                  </li>
                ))}
                {post.faqs && post.faqs.length > 0 && (
                  <li>
                    <button
                      onClick={() => handleScrollTo("faq-section")}
                      className="text-left text-[11px] font-mono font-bold text-emerald-700 hover:text-[#050521] hover:translate-x-1 transition-all leading-tight"
                    >
                      FAQs
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </aside>

          {/* Article Body */}
          <main className="col-span-1 lg:col-span-3 space-y-12">
            {post.sections.map((sec, idx) => (
              <article key={idx} id={`section-${idx}`} className="scroll-mt-32 space-y-4">
                {sec.heading !== "Introduction" && (
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521] pt-4 border-t border-slate-200">
                    {sec.heading}
                  </h2>
                )}
                
                <div className="prose prose-slate max-w-none text-slate-700 text-sm md:text-base leading-relaxed space-y-4 font-sans whitespace-pre-line">
                  {sec.content}
                </div>

                {sec.table && (
                  <div className="overflow-x-auto border-2 border-[#050521] rounded-2xl shadow-[4px_4px_0px_0px_#050521] my-6">
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
                      <tbody className="divide-y divide-[#050521]/10 font-mono">
                        {sec.table.rows.map((row, ri) => (
                          <tr key={ri} className="hover:bg-slate-50">
                            {row.map((cell, ci) => (
                              <td
                                key={ci}
                                className={`p-4 ${ci === 0 ? "font-bold text-[#050521]" : "text-slate-600"}`}
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
              </article>
            ))}

            {/* DeepStaq Callout Box */}
            <div className="bg-[#050521] text-white rounded-3xl p-8 border-2 border-[#050521] shadow-[8px_8px_0px_0px_#c6ff34] space-y-4">
              <span className="bg-[#c6ff34] text-[#050521] text-xs font-black px-3 py-1 rounded-md uppercase font-mono tracking-wider">
                Hands-on AI Academy
              </span>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                Ready to move from reading to building with AI?
              </h3>
              <p className="text-slate-300 font-mono text-sm leading-relaxed">
                DeepStaq bridges the gap with live GPU build sessions, RAG pipelines, fine-tuned LLMs, and agentic workflows. Gain practical, portfolio-ready skills guided by industry mentors.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/programs"
                  className="bg-[#c6ff34] text-[#050521] font-black uppercase text-xs px-6 py-3.5 rounded-xl border-2 border-[#050521] shadow-[3px_3px_0px_0px_white] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  Explore AI/ML Programs →
                </Link>
                <Link
                  to="/consultation"
                  className="bg-transparent text-white border-2 border-white font-black uppercase text-xs px-6 py-3.5 rounded-xl hover:bg-white/10 transition-all"
                >
                  Book Free Consultation
                </Link>
              </div>
            </div>

            {/* FAQs Section */}
            {post.faqs && post.faqs.length > 0 && (
              <div id="faq-section" className="scroll-mt-32 space-y-6 pt-6 border-t-2 border-[#050521]">
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  {post.faqs.map((faq, index) => (
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
                            className="p-5 text-xs md:text-sm font-mono text-slate-600 border-t border-[#050521]/10 bg-white leading-relaxed"
                          >
                            {faq.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Post Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-slate-200">
              {prevPost ? (
                <Link
                  to={`/blog/${prevPost.slug}`}
                  className="p-5 border-2 border-[#050521] rounded-2xl bg-white shadow-[4px_4px_0px_0px_#050521] hover:bg-slate-50 transition-all flex flex-col justify-between"
                >
                  <span className="text-[10px] font-mono font-black uppercase text-slate-400">
                    ← Previous Guide
                  </span>
                  <span className="text-sm font-black uppercase text-[#050521] mt-1 line-clamp-2">
                    {prevPost.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextPost ? (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  className="p-5 border-2 border-[#050521] rounded-2xl bg-white shadow-[4px_4px_0px_0px_#050521] hover:bg-slate-50 transition-all flex flex-col justify-between text-right md:text-right"
                >
                  <span className="text-[10px] font-mono font-black uppercase text-slate-400">
                    Next Guide →
                  </span>
                  <span className="text-sm font-black uppercase text-[#050521] mt-1 line-clamp-2">
                    {nextPost.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}
