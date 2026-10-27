import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AiCourseKannur() {
  const [openFAQs, setOpenFAQs] = useState({ 0: true });

  const toggleFAQ = (idx) => {
    setOpenFAQs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const kannurAdvantages = [
    {
      title: "No relocation needed",
      desc: "Get industry-relevant AI/ML training without moving to Bangalore, Kochi, or Hyderabad for a bootcamp."
    },
    {
      title: "In-person, classroom-based learning",
      desc: "Real instructors and industry mentors in the room — not a video queue you fall behind on."
    },
    {
      title: "A local peer cohort",
      desc: "Learn alongside others from Kannur and the surrounding region, building a professional network you can actually meet up with after class."
    },
    {
      title: "A genuinely current curriculum",
      desc: "From Python fundamentals through classical ML, deep learning, generative AI, fine-tuning, and agentic AI — not a syllabus that stopped updating two years ago."
    }
  ];

  const syllabus = [
    { month: "Month 1", title: "Programming Foundation (Python)", desc: "Core syntax, data structures, functions & recursion, capped with a Python project." },
    { month: "Month 2", title: "Math, Data & Visualisation", desc: "Probability & statistics, NumPy, Pandas, data cleaning & feature engineering." },
    { month: "Month 3", title: "Machine Learning", desc: "Regression, classification, decision trees, SVM, gradient boosting, clustering, model evaluation." },
    { month: "Month 4", title: "Deep Learning & NLP", desc: "Neural networks, CNNs, RNNs, hands-on TensorFlow/Keras/PyTorch in the lab." },
    { month: "Month 5", title: "Generative AI & LLMs", desc: "Transformers, LLMs, fine-tuning (LoRA, QLoRA, PEFT)." },
    { month: "Month 6", title: "MLOps, Capstone & Advanced Topics", desc: "Vector databases, RAG, agentic AI, Docker, FastAPI, capstone project." }
  ];

  const faqs = [
    {
      q: "Is there an AI/ML course available in Kannur?",
      a: "Yes — DeepStaq runs an in-person, 6-month AI/ML & Generative AI diploma programme right here in Kannur, Kerala."
    },
    {
      q: "Do I need to relocate to take this course?",
      a: "No. The course is designed for people in Kannur and the surrounding region — no relocation to a larger city required."
    },
    {
      q: "Is this course suitable for complete beginners?",
      a: "Yes. No prior coding or math background is required — Month 1 starts with Python fundamentals from zero."
    },
    {
      q: "What will I be able to build by the end of the course?",
      a: "An original capstone project — a classical ML pipeline, a deep learning/NLP model, or a domain-specific RAG application or fine-tuned LLM — plus practical experience across the full AI/ML stack."
    },
    {
      q: "What jobs can I apply for after completing this course?",
      a: "Machine Learning Engineer, AI/ML Engineer, Data Scientist, NLP Engineer, MLOps Engineer, Generative AI Engineer, and Applied AI roles — locally or remote."
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-sans pb-24 selection:bg-sky-500/30 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#c6ff34]/10 rounded-full blur-[160px] pointer-events-none -z-0" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none -z-0" />

      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-12 border-b border-white/10 overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-6 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#c6ff34]/15 text-white text-xs font-black px-3.5 py-1.5 rounded-lg border border-[#c6ff34]/30 uppercase tracking-wider font-mono shadow-[0_0_15px_rgba(198,255,52,0.2)]">
              Kannur Campus Hub
            </span>
            <span className="bg-white/5 text-white border border-white/10 text-xs font-mono font-bold px-3 py-1.5 rounded-lg">
              Kannur, Kerala
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08] max-w-5xl">
            AI / ML & Generative AI — 6-Month Professional Diploma Programme, Kannur
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-4xl leading-relaxed font-sans font-medium">
            Looking for a serious, hands-on AI course in Kannur — not another link to a generic online video subscription? DeepStaq runs an in-person, instructor-led AI/ML diploma right here, built for people who want to actually build AI systems, not just watch someone else build them on a screen.
          </p>

          <p className="text-slate-400 font-mono text-sm md:text-base max-w-3xl leading-relaxed">
            No prior coding experience required. Open to students, engineers, career-switchers, and working professionals across Kannur and North Kerala.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/admission"
              className="bg-[#c6ff34] hover:bg-[#b8f526] text-[#090D11] font-black uppercase text-sm md:text-base px-8 py-4 rounded-2xl shadow-[0_0_25px_rgba(198,255,52,0.4)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>Enroll Now</span>
              <span>→</span>
            </Link>

            <a
              href="tel:+919495957011"
              className="bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs md:text-sm px-6 py-4 rounded-2xl border border-white/15 hover:border-white/30 transition-all flex items-center gap-2"
            >
              Talk to Us: +91 949 595 7011
            </a>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 space-y-16 relative z-10">
        
        {/* WHY LEARN IN KANNUR */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Why Learn AI in Kannur With DeepStaq
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kannurAdvantages.map((adv, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-white/10 bg-[#0D1318]/80 shadow-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#c6ff34] text-[#090D11] font-mono text-xs font-black flex items-center justify-center">✓</span>
                  <h3 className="text-base font-black uppercase text-white">{adv.title}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed pl-8 font-mono">{adv.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT DEEPSTAQ */}
        <section className="space-y-6">
          <div className="border border-white/10 rounded-3xl p-6 md:p-10 bg-[#0D1318]/90 shadow-2xl backdrop-blur-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c6ff34] to-transparent" />
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              About DeepStaq
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              DeepStaq is an institute built for the next generation of AI practitioners, sitting at the intersection of rigorous technical education and real-world application — for people who want to understand how artificial intelligence actually works, and how to build with it.
            </p>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Our programme is designed for a mixed audience: no prior experience required. Whether you're coming from engineering, business, education, or any other background, DeepStaq gives you the foundation, tools, and hands-on practice to become an AI builder — right here, without needing to leave Kannur.
            </p>
          </div>
        </section>

        {/* COURSE FORMAT & STRUCTURE */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Course Format & Structure
          </h2>
          <div className="overflow-x-auto border border-white/10 rounded-3xl shadow-2xl bg-[#0D1318]/90 backdrop-blur-xl">
            <table className="w-full text-left border-collapse text-xs md:text-sm font-mono">
              <thead>
                <tr className="bg-white/[0.05] text-white uppercase tracking-wider border-b border-white/10">
                  <th className="p-4 md:p-5 w-1/3">Detail</th>
                  <th className="p-4 md:p-5">Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr className="hover:bg-white/[0.02]"><td className="p-4 md:p-5 font-bold text-white bg-white/[0.02]">Location</td><td className="p-4 md:p-5 text-slate-300">Kannur, Kerala</td></tr>
                <tr className="hover:bg-white/[0.02]"><td className="p-4 md:p-5 font-bold text-white bg-white/[0.02]">Format</td><td className="p-4 md:p-5 text-slate-300">In-person, instructor-led classroom sessions</td></tr>
                <tr className="hover:bg-white/[0.02]"><td className="p-4 md:p-5 font-bold text-white bg-white/[0.02]">Duration</td><td className="p-4 md:p-5 text-slate-300">6 months core curriculum + ~2 weeks capstone</td></tr>
                <tr className="hover:bg-white/[0.02]"><td className="p-4 md:p-5 font-bold text-white bg-white/[0.02]">Schedule</td><td className="p-4 md:p-5 text-slate-300">3 sessions/week, 2 hours/session (6 hrs/week)</td></tr>
                <tr className="hover:bg-white/[0.02]"><td className="p-4 md:p-5 font-bold text-white bg-white/[0.02]">Total Instruction Time</td><td className="p-4 md:p-5 text-slate-300">~160 hours</td></tr>
                <tr className="hover:bg-white/[0.02]"><td className="p-4 md:p-5 font-bold text-white bg-white/[0.02]">Prerequisites</td><td className="p-4 md:p-5 text-slate-300">None — beginner-friendly</td></tr>
                <tr className="hover:bg-white/[0.02]"><td className="p-4 md:p-5 font-bold text-white bg-white/[0.02]">Final Assessment</td><td className="p-4 md:p-5 text-slate-300">60% Capstone Project + 40% Theory</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SYLLABUS */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            What You'll Learn: Month by Month
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {syllabus.map((m, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/70 space-y-2">
                <span className="text-[11px] font-mono font-black text-white bg-[#c6ff34]/15 px-2.5 py-1 rounded border border-[#c6ff34]/30 inline-block">
                  {m.month}
                </span>
                <h4 className="text-sm font-black uppercase text-white">{m.title}</h4>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CAPSTONE */}
        <section className="space-y-6">
          <div className="border border-white/10 rounded-3xl p-6 md:p-10 bg-[#0D1318]/90 text-white shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c6ff34] to-transparent" />
            <span className="bg-[#c6ff34]/15 text-white text-xs font-black px-3 py-1 rounded-md uppercase font-mono tracking-wider border border-[#c6ff34]/30 inline-block">
              Capstone Build in Kannur
            </span>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
              Your Capstone Project
            </h2>
            <p className="text-slate-300 font-mono text-sm md:text-base leading-relaxed">
              The programme ends with an original, end-to-end capstone project — a classical ML pipeline, an NLP/deep learning model, or a domain-specific RAG application or fine-tuned LLM. You leave with something you actually built, presented and reviewed in person, not just a certificate.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <span className="text-3xl md:text-4xl font-black text-white font-mono">60%</span>
                <h4 className="text-base font-bold uppercase text-white">Capstone Project</h4>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">Live hands-on build evaluation in Kannur.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <span className="text-3xl md:text-4xl font-black text-white font-mono">40%</span>
                <h4 className="text-base font-bold uppercase text-white">Theory</h4>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">Covering foundations through Generative AI and MLOps.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CAREER OUTCOMES */}
        <section className="space-y-6">
          <div className="border border-white/10 rounded-3xl p-6 md:p-8 bg-[#0D1318]/90 shadow-2xl backdrop-blur-xl space-y-3">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Career Outcomes for Kannur Graduates
            </h2>
            <p className="text-slate-300 font-mono text-sm leading-relaxed">
              Because most AI/ML roles are increasingly remote-friendly, completing this course in Kannur doesn't limit you to local opportunities — graduates can pursue global remote roles, freelance AI/ML work, AI consulting, or launch their own AI products, all without relocating.
            </p>
          </div>
        </section>

        {/* FAQS */}
        <section className="space-y-6 pt-6 border-t border-white/10">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-white/10 rounded-2xl overflow-hidden shadow-xl bg-[#0D1318]/80">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-5 font-black uppercase tracking-tight text-sm md:text-base flex justify-between items-center gap-4 bg-white/[0.02] hover:bg-white/[0.05] text-white transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="w-7 h-7 rounded-full bg-[#c6ff34]/20 border border-[#c6ff34]/30 text-white flex items-center justify-center font-mono text-xs flex-shrink-0">
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
                      className="p-5 text-xs md:text-sm font-mono text-slate-300 border-t border-white/10 bg-white/[0.01] leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pt-8">
          <div className="bg-[#0D1318]/95 text-white rounded-3xl p-8 md:p-12 border border-white/15 shadow-2xl space-y-6 text-center md:text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c6ff34] to-transparent" />
            <span className="bg-[#c6ff34]/15 text-white text-xs font-black px-3.5 py-1.5 rounded-md uppercase font-mono tracking-wider inline-block border border-[#c6ff34]/30">
              Kannur Admissions Open
            </span>
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white max-w-3xl">
              Future Won't Wait. Why Should You?
            </h3>
            <p className="text-slate-300 font-mono text-sm md:text-base max-w-2xl leading-relaxed">
              You don't need to leave Kannur to build a real AI/ML career — you need the right six months.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link
                to="/admission"
                className="w-full sm:w-auto bg-[#c6ff34] hover:bg-[#b8f526] text-[#090D11] font-black uppercase text-sm md:text-base px-8 py-4 rounded-xl shadow-[0_0_25px_rgba(198,255,52,0.4)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center"
              >
                Enroll in DeepStaq's AI Course in Kannur →
              </Link>
              <Link
                to="/consultation"
                className="w-full sm:w-auto bg-white/5 text-white border border-white/20 font-black uppercase text-sm px-6 py-4 rounded-xl hover:bg-white/10 transition-all text-center"
              >
                Book Free Consultation
              </Link>
            </div>
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs font-mono text-slate-400">
              <span>+91 949 595 7011</span>
              <span>•</span>
              <span>info@deepstaq.in</span>
              <span>•</span>
              <span>Kannur Campus</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
