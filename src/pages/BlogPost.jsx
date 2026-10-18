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

  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const nextPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#090D11] text-white font-sans pb-24 relative overflow-hidden">
      {/* Background glow highlights */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c6ff34]/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header / Hero */}
      <section className="relative z-10 pt-28 pb-12 md:pt-36 md:pb-16 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-[1000px] mx-auto space-y-6 text-center flex flex-col items-center">
          {/* Breadcrumb & Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/blog"
              className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-[#c6ff34] flex items-center gap-1 transition-colors"
            >
              ← Back to Blog Hub
            </Link>
            <span className="text-white/20">•</span>
            <span className="bg-[#c6ff34]/10 text-[#c6ff34] text-[11px] font-bold px-3 py-1 rounded-md border border-[#c6ff34]/30 uppercase tracking-wider font-mono">
              {post.category}
            </span>
            <span className="bg-white/10 text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider font-mono border border-white/10">
              {post.readTime}
            </span>
            <span className="text-slate-400 text-xs font-mono">
              {post.wordCount}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.05] text-center">
            {post.title}
          </h1>

          <p className="text-slate-300 font-sans text-sm md:text-base max-w-3xl leading-relaxed text-center">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400 pt-3 border-t border-white/10 w-full">
            <span className="font-bold text-[#c6ff34]">By DeepStaq Editorial</span>
            <span>•</span>
            <span>Published {post.publishDate}</span>
            <span>•</span>
            <span className="text-slate-400">Target Keyword: "{post.targetKeyword}"</span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-12">
        <main className="w-full space-y-12">
          {post.sections.map((sec, idx) => (
            <article key={idx} id={`section-${idx}`} className="scroll-mt-32 space-y-4">
              {sec.heading !== "Introduction" && (
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white pt-6 border-t border-white/10">
                  {sec.heading}
                </h2>
              )}
              
              <div className="text-slate-300 text-sm md:text-base leading-relaxed space-y-4 font-sans whitespace-pre-line">
                {sec.content}
              </div>

              {sec.table && (
                <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/[0.02] shadow-xl my-6">
                  <table className="w-full text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="bg-white/[0.05] text-[#c6ff34] font-mono uppercase tracking-wider">
                        {sec.table.headers.map((h, hi) => (
                          <th key={hi} className="p-4 border-b border-white/10">
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
                              className={`p-4 ${ci === 0 ? "font-bold text-white" : "text-slate-300"}`}
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
          <div className="bg-[#0D1318]/90 text-white rounded-3xl p-8 border border-[#c6ff34]/30 shadow-[0_0_30px_rgba(198,255,52,0.15)] space-y-4">
            <span className="bg-[#c6ff34]/10 text-[#c6ff34] text-xs font-mono font-bold px-3 py-1 rounded-md uppercase tracking-wider border border-[#c6ff34]/30">
              Hands-on AI Academy
            </span>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Ready to move from reading to building with AI?
            </h3>
            <p className="text-slate-300 font-sans text-sm leading-relaxed">
              DeepStaq bridges the gap with live GPU build sessions, RAG pipelines, fine-tuned LLMs, and agentic workflows. Gain practical, portfolio-ready skills guided by industry mentors.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/programs"
                className="bg-[#c6ff34] text-[#090D11] font-black uppercase text-xs px-6 py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(198,255,52,0.4)] transition-all"
              >
                Explore AI/ML Programs →
              </Link>
              <Link
                to="/consultation"
                className="bg-white/10 text-white border border-white/20 font-bold uppercase text-xs px-6 py-3.5 rounded-xl hover:bg-white/20 transition-all"
              >
                Book Free Consultation
              </Link>
            </div>
          </div>

          {/* FAQs Section */}
          {post.faqs && post.faqs.length > 0 && (
            <div id="faq-section" className="scroll-mt-32 space-y-6 pt-6 border-t border-white/10">
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {post.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.03] transition-all"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full text-left p-5 font-bold uppercase tracking-tight text-sm md:text-base flex justify-between items-center gap-4 hover:bg-white/[0.05] transition-colors"
                    >
                      <span className="text-white">{faq.q}</span>
                      <span className="w-7 h-7 rounded-full bg-[#c6ff34] text-[#090D11] flex items-center justify-center font-mono text-xs flex-shrink-0 font-black">
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
                          className="p-5 text-xs md:text-sm font-sans text-slate-300 border-t border-white/10 bg-white/[0.02] leading-relaxed"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-white/10">
            {prevPost ? (
              <Link
                to={`/blog/${prevPost.slug}`}
                className="p-5 border border-white/10 rounded-2xl bg-[#0D1318]/90 hover:border-[#c6ff34]/40 hover:shadow-[0_0_20px_rgba(198,255,52,0.1)] transition-all flex flex-col justify-between"
              >
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  ← Previous Guide
                </span>
                <span className="text-sm font-bold uppercase text-white mt-1 line-clamp-2">
                  {prevPost.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextPost ? (
              <Link
                to={`/blog/${nextPost.slug}`}
                className="p-5 border border-white/10 rounded-2xl bg-[#0D1318]/90 hover:border-[#c6ff34]/40 hover:shadow-[0_0_20px_rgba(198,255,52,0.1)] transition-all flex flex-col justify-between text-right md:text-right"
              >
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  Next Guide →
                </span>
                <span className="text-sm font-bold uppercase text-white mt-1 line-clamp-2">
                  {nextPost.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </main>
      </section>
    </div>
  );
}
