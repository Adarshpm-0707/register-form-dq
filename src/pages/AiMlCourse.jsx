import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AiMlCourse() {
  const [openFAQs, setOpenFAQs] = useState({ 0: true });

  const toggleFAQ = (idx) => {
    setOpenFAQs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const outcomes = [
    "Build and evaluate classical ML models (regression, classification, clustering) on real datasets",
    "Design and train neural networks for image and text tasks",
    "Fine-tune large language models using LoRA, QLoRA, and PEFT",
    "Build a RAG (Retrieval-Augmented Generation) application connected to real data",
    "Design and deploy an agentic AI system that plans and takes multi-step actions",
    "Package and deploy a trained model using Docker, FastAPI, and basic MLOps practices",
    "Present a completed, end-to-end capstone project as proof of what you can build"
  ];

  const syllabus = [
    { month: "Month 1", focus: "Programming Foundation", skills: "Python, data structures, recursion, async" },
    { month: "Month 2", focus: "Math, Data & Visualisation", skills: "Statistics, NumPy, Pandas, feature engineering" },
    { month: "Month 3", focus: "Machine Learning", skills: "Regression, classification, ensembles, clustering, evaluation" },
    { month: "Month 4", focus: "Deep Learning & NLP", skills: "Neural networks, CNNs, RNNs, TensorFlow/PyTorch" },
    { month: "Month 5", focus: "Generative AI & LLMs", skills: "Transformers, LLMs, fine-tuning (LoRA/QLoRA/PEFT)" },
    { month: "Month 6", focus: "MLOps, Capstone & Advanced Topics", skills: "RAG, agentic AI, Docker, FastAPI, capstone project" }
  ];

  const careerRoles = [
    "Machine Learning Engineer",
    "AI/ML Engineer",
    "Data Scientist / Data Analyst",
    "NLP Engineer",
    "Generative AI Engineer",
    "MLOps Engineer",
    "AI Product / Applied AI roles",
    "AI Research / Junior Research roles (with further specialization)"
  ];

  const faqs = [
    {
      q: "What's the difference between an 'AI course' and an 'AI-ML course'?",
      a: "In practice, very little when the course is built right — but many standalone courses focus narrowly on one side. This programme is explicitly structured to cover both classical machine learning and modern AI (deep learning, GenAI, agentic systems) in one connected 6-month path."
    },
    {
      q: "Is this course beginner-friendly?",
      a: "Yes. No prior coding or math background is required — Month 1 starts with Python fundamentals from zero."
    },
    {
      q: "Will I learn both traditional ML algorithms and modern GenAI/LLMs?",
      a: "Yes. Month 3 covers classical ML (regression, classification, clustering, ensembles), and Months 5–6 cover LLMs, fine-tuning, RAG, and agentic AI."
    },
    {
      q: "What job titles can I apply for after this course?",
      a: "Machine Learning Engineer, AI/ML Engineer, Data Scientist, NLP Engineer, Generative AI Engineer, MLOps Engineer, and Applied AI roles."
    },
    {
      q: "How long does the course take, and how is it graded?",
      a: "6 months of core curriculum plus ~2 weeks for the capstone (~160 total hours), graded 60% on the capstone project and 40% on theory."
    }
  ];

  return (
    <div className="min-h-screen bg-[#090D11] text-white font-sans pb-24 selection:bg-[#c6ff34] selection:text-[#090D11] relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#c6ff34]/10 rounded-full blur-[160px] pointer-events-none -z-0" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none -z-0" />

      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-12 border-b border-white/10 overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-6 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#c6ff34]/15 text-[#c6ff34] text-xs font-black px-3.5 py-1.5 rounded-lg border border-[#c6ff34]/30 uppercase tracking-wider font-mono shadow-[0_0_15px_rgba(198,255,52,0.2)]">
              Dual Skill Track
            </span>
            <span className="bg-white/5 text-slate-300 text-xs font-mono font-bold px-3 py-1 rounded-md border border-white/10 uppercase">
              AI + ML Engineer Path
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08] max-w-5xl">
            AI / ML & Generative AI — 6-Month Professional Diploma Programme
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-4xl leading-relaxed font-sans font-medium">
            Job listings don't ask for an "AI course" or a "machine learning course" separately anymore — they ask for AI-ML skills, together, in the same person. That's exactly the gap most single-focus courses miss: an ML-only course leaves you behind on GenAI and agents; an AI-only course often skips the statistical rigor that makes ML models actually work. DeepStaq's programme is built as one connected path — so you graduate with both, not a partial view of either.
          </p>

          <p className="text-slate-400 font-mono text-sm md:text-base max-w-3xl leading-relaxed">
            No prior coding experience required. Built for engineers, career-switchers, and complete beginners alike.
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
              📞 Talk to Us: +91 949 595 7011
            </a>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 space-y-16 relative z-10">

        {/* WHY AI-ML */}
        <section className="space-y-6">
          <div className="border border-white/10 rounded-3xl p-6 md:p-10 bg-[#0D1318]/90 shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c6ff34] to-transparent" />
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Why "AI-ML," Not Just "AI" or Just "ML"
            </h2>
            <div className="space-y-3 font-mono text-sm text-slate-300 leading-relaxed">
              <p>• <strong className="text-white">Artificial Intelligence</strong> is the broad goal — machines performing tasks that require human-like intelligence.</p>
              <p>• <strong className="text-white">Machine Learning</strong> is the practical engine underneath most of it — models that learn patterns from data.</p>
              <p>• <strong className="text-white">Generative AI and agentic systems</strong> (what most people mean today when they say "AI") are built on top of solid ML foundations, not instead of them.</p>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed border-t border-white/10 pt-4">
              Employers hiring for "AI-ML Engineer" roles want someone who can move fluidly across this whole stack — clean and prepare data, train and evaluate a classical model, and also fine-tune or deploy an LLM-based system when the problem calls for it. That's the actual skill set this course is built to produce.
            </p>
          </div>
        </section>

        {/* WHAT YOU'LL BE ABLE TO DO */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            What You'll Be Able to Do By the End
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {outcomes.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-white/10 bg-[#0D1318]/80 flex items-start gap-3 text-sm font-mono text-slate-300 shadow-lg">
                <span className="text-[#c6ff34] font-black">✔</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 6-MONTH PATH AT A GLANCE */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            The 6-Month Path at a Glance
          </h2>
          <div className="overflow-x-auto border border-white/10 rounded-3xl shadow-2xl bg-[#0D1318]/90 backdrop-blur-xl">
            <table className="w-full text-left border-collapse text-xs md:text-sm font-mono">
              <thead>
                <tr className="bg-white/[0.05] text-[#c6ff34] uppercase tracking-wider border-b border-white/10">
                  <th className="p-4 md:p-5">Month</th>
                  <th className="p-4 md:p-5">Focus</th>
                  <th className="p-4 md:p-5">Key Skills</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {syllabus.map((s, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="p-4 md:p-5 font-bold text-white bg-white/[0.02]">{s.month}</td>
                    <td className="p-4 md:p-5 font-bold text-[#c6ff34]">{s.focus}</td>
                    <td className="p-4 md:p-5 text-slate-300">{s.skills}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-5 rounded-2xl bg-[#c6ff34]/10 border border-[#c6ff34]/30 text-xs md:text-sm font-mono text-slate-200 leading-relaxed">
            Format: 3 sessions/week, 2 hours/session (~6 hrs/week) · ~160 total instruction hours · monthly guest sessions from industry professionals · no prior experience required.
          </div>
        </section>

        {/* TOOLS */}
        <section className="space-y-6">
          <div className="border border-white/10 rounded-3xl p-6 md:p-8 bg-[#0D1318]/90 shadow-2xl backdrop-blur-xl space-y-3">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Built With the Same Stack the Industry Uses
            </h2>
            <p className="text-slate-300 font-mono text-sm leading-relaxed">
              Python, NumPy, Pandas, TensorFlow, Keras, PyTorch, FastAPI, Docker, OpenAI APIs, vector databases, plus hands-on use of Claude, ChatGPT, Gemini, Cursor, and Google Antigravity for AI-assisted development.
            </p>
          </div>
        </section>

        {/* CAREER OUTCOMES */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Career Outcomes: What "AI-ML Engineer" Actually Opens Up
          </h2>
          <p className="text-slate-400 font-mono text-sm">
            Graduates of this programme are equipped to pursue roles across the full AI-ML spectrum, including:
          </p>
          <div className="flex flex-wrap gap-2.5">
            {careerRoles.map((role, idx) => (
              <span key={idx} className="bg-white/[0.04] hover:bg-[#c6ff34]/15 hover:text-[#c6ff34] text-slate-300 text-xs font-mono font-bold px-4 py-2 rounded-xl border border-white/10 transition-colors">
                💼 {role}
              </span>
            ))}
          </div>
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/80 shadow-xl space-y-2">
              <h4 className="text-sm font-black uppercase text-white">Global remote roles</h4>
              <p className="text-xs font-mono text-slate-400">AI-ML roles are increasingly remote-friendly, letting you work for companies anywhere.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/80 shadow-xl space-y-2">
              <h4 className="text-sm font-black uppercase text-white">AI entrepreneurship</h4>
              <p className="text-xs font-mono text-slate-400">Build and launch your own AI products using RAG, agents, and fine-tuned models.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/80 shadow-xl space-y-2">
              <h4 className="text-sm font-black uppercase text-white">Freelancing</h4>
              <p className="text-xs font-mono text-slate-400">Offer model building, RAG pipelines, chatbot, and data analysis services independently.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/80 shadow-xl space-y-2">
              <h4 className="text-sm font-black uppercase text-white">AI consulting</h4>
              <p className="text-xs font-mono text-slate-400">Advise businesses adopting AI/ML with real, hands-on credibility.</p>
            </div>
          </div>
        </section>

        {/* CAPSTONE */}
        <section className="space-y-6">
          <div className="border border-white/10 rounded-3xl p-6 md:p-10 bg-[#0D1318]/90 text-white shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c6ff34] to-transparent" />
            <span className="bg-[#c6ff34]/15 text-[#c6ff34] text-xs font-black px-3 py-1 rounded-md uppercase font-mono tracking-wider border border-[#c6ff34]/30 inline-block">
              Proof Over Certificates
            </span>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
              Your Capstone: Proof, Not Just a Certificate
            </h2>
            <p className="text-slate-300 font-mono text-sm md:text-base leading-relaxed">
              The programme ends with an original, end-to-end capstone project — your choice of a classical ML pipeline, an NLP/deep learning model, or a domain-specific RAG application or fine-tuned LLM. You leave with something real you built, evaluated on data handling, model implementation, and deployment or RAG/agent components — not a multiple-choice exam alone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <span className="text-3xl md:text-4xl font-black text-[#c6ff34] font-mono">60%</span>
                <h4 className="text-base font-bold uppercase text-white">Capstone Project</h4>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">Assessed on architecture, data pipelines, and production readiness.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <span className="text-3xl md:text-4xl font-black text-[#c6ff34] font-mono">40%</span>
                <h4 className="text-base font-bold uppercase text-white">Theory Assessment</h4>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">Covering programming foundations through Generative AI and MLOps.</p>
              </div>
            </div>
          </div>
        </section>

        {/* WHO THIS IS FOR */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Who This AI-ML Course Is For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/70 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#c6ff34] text-[#090D11] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">1</span>
              <p className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">Beginners who want one structured path instead of stitching together separate AI and ML courses</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/70 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#c6ff34] text-[#090D11] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">2</span>
              <p className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">Developers and engineers looking to formally cross into AI/ML roles</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/70 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#c6ff34] text-[#090D11] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">3</span>
              <p className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">Data analysts aiming for a full ML Engineer or Data Scientist title</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/70 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#c6ff34] text-[#090D11] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">4</span>
              <p className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">Career switchers from any background — no coding experience required to start</p>
            </div>
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
                  <span className="w-7 h-7 rounded-full bg-[#c6ff34]/20 border border-[#c6ff34]/30 text-[#c6ff34] flex items-center justify-center font-mono text-xs flex-shrink-0">
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
            <span className="bg-[#c6ff34]/15 text-[#c6ff34] text-xs font-black px-3.5 py-1.5 rounded-md uppercase font-mono tracking-wider inline-block border border-[#c6ff34]/30">
              Unified Track
            </span>
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white max-w-3xl">
              Future Won't Wait. Why Should You?
            </h3>
            <p className="text-slate-300 font-mono text-sm md:text-base max-w-2xl leading-relaxed">
              The market isn't hiring for "AI people" and "ML people" separately anymore — it's hiring for people who can do both. Six months from now, you can be one of them.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link
                to="/admission"
                className="w-full sm:w-auto bg-[#c6ff34] hover:bg-[#b8f526] text-[#090D11] font-black uppercase text-sm md:text-base px-8 py-4 rounded-xl shadow-[0_0_25px_rgba(198,255,52,0.4)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center"
              >
                Enroll in DeepStaq's AI-ML Course →
              </Link>
              <Link
                to="/consultation"
                className="w-full sm:w-auto bg-white/5 text-white border border-white/20 font-black uppercase text-sm px-6 py-4 rounded-xl hover:bg-white/10 transition-all text-center"
              >
                Book Free Consultation
              </Link>
            </div>
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
