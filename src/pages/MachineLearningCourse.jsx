import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function MachineLearningCourse() {
  const [openFAQs, setOpenFAQs] = useState({ 0: true });
  const [activeMonth, setActiveMonth] = useState(2); // Default to month 3 (ML core)

  const toggleFAQ = (idx) => {
    setOpenFAQs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const syllabus = [
    {
      month: "Month 1",
      title: "Programming Foundation (Python)",
      desc: "Every ML course lives or dies on your ability to actually code the models, not just understand them conceptually. You'll cover core Python syntax & control flow, data structures (lists, dictionaries, sets), functions & recursion, and an intro to multithreading/asyncio — capped with a hands-on Python project."
    },
    {
      month: "Month 2",
      title: "Math, Data & Visualisation",
      desc: "The statistics and data-handling foundation that separates people who can tune a model from people who just call .fit() without understanding what's happening. Covers probability & statistics essentials, NumPy & Pandas, data visualisation (Matplotlib/Seaborn), data cleaning, feature engineering & preprocessing."
    },
    {
      month: "Month 3",
      title: "Machine Learning (Core Module)",
      desc: "The heart of the programme: Regression & classification, decision trees & random forests, KNN, SVM, gradient boosting, clustering & PCA, model evaluation & cross-validation. You'll select, train, tune, and evaluate the right model for given real-world datasets."
    },
    {
      month: "Month 4",
      title: "Deep Learning & NLP",
      desc: "Where classical ML hits its limits, this module picks up: neural network fundamentals, activation functions & backpropagation, CNNs & RNNs, LSTMs/GRUs — with hands-on work in TensorFlow, Keras, and PyTorch."
    },
    {
      month: "Month 5",
      title: "Generative AI & LLMs",
      desc: "Extending your ML foundation into the technology behind today's most in-demand AI systems: NLP foundations & embeddings, transformers & attention, the BERT/GPT family, large language models, and fine-tuning techniques (LoRA, QLoRA, PEFT)."
    },
    {
      month: "Month 6",
      title: "MLOps, Capstone & Advanced Topics",
      desc: "The step most ML courses skip entirely — actually deploying what you've built: vector databases & RAG, agentic AI & tool calling, MLOps (Docker, FastAPI, CI/CD, monitoring), your capstone project, plus a closing survey of GANs, diffusion models & multimodal AI."
    }
  ];

  const tools = [
    { name: "Python, NumPy & Pandas", desc: "For data handling and classical ML algorithms" },
    { name: "scikit-learn", desc: "Workflows for regression, classification, and clustering" },
    { name: "TensorFlow, Keras & PyTorch", desc: "For deep neural networks and NLP modeling" },
    { name: "FastAPI & Docker", desc: "For serving and deploying your trained models" },
    { name: "OpenAI APIs, Claude, Gemini", desc: "For modern GenAI application building" },
    { name: "Google Colab", desc: "Cloud GPU notebooks for experimentation" },
    { name: "Cursor & Google Antigravity", desc: "AI-powered coding tools for faster development" }
  ];

  const careerRoles = [
    "Machine Learning Engineer",
    "Data Scientist / Data Analyst",
    "AI/ML Engineer",
    "NLP Engineer",
    "MLOps Engineer",
    "Generative AI Engineer",
    "AI Product / Applied AI roles"
  ];

  const faqs = [
    {
      q: "Is this a pure machine learning course, or does it include other topics?",
      a: "Machine learning (Month 3) is the core foundation of the programme, but the curriculum extends further — into deep learning, generative AI, and MLOps — so you graduate with a broader, more employable skill set than a standalone ML course alone would provide."
    },
    {
      q: "Do I need a math background to learn machine learning here?",
      a: "No prior background is required. Month 2 covers the probability, statistics, and data-handling foundations you need before the core ML module in Month 3."
    },
    {
      q: "What machine learning algorithms will I learn?",
      a: "Regression and classification, decision trees and random forests, KNN, SVM, gradient boosting, and clustering/PCA — along with proper model evaluation and cross-validation."
    },
    {
      q: "Will I be able to deploy the models I build?",
      a: "Yes. Month 6 covers MLOps — Docker, FastAPI, CI/CD, and monitoring — so you learn to actually ship a model, not just train one in a notebook."
    },
    {
      q: "How is the course graded?",
      a: "Final evaluation combines a 60% capstone project assessment and a 40% theory assessment covering the full curriculum."
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
              Machine Learning Specialization
            </span>
            <span className="bg-white/5 text-slate-300 text-xs font-mono font-bold px-3 py-1 rounded-md border border-white/10 uppercase">
              Core ML + GenAI Track
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08] max-w-5xl">
            A 6-Month, Hands-On Machine Learning & AI Diploma Programme
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-4xl leading-relaxed font-sans font-medium">
            Most machine learning courses teach you regression, classification, and a handful of algorithms — then leave you wondering how any of it connects to the AI tools actually shipping in the real world today. DeepStaq's programme is built differently: it takes you through rigorous ML fundamentals first, then carries that foundation forward into deep learning, generative AI, and agentic systems — so what you learn in Month 3 is still relevant in Month 6, not obsolete by it.
          </p>

          <p className="text-slate-400 font-mono text-sm md:text-base max-w-3xl leading-relaxed">
            No prior coding experience required. If you're serious about becoming a Machine Learning Engineer or Data Scientist — not just someone who can name a few algorithms — this is that path.
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
        
        {/* WHY LEARN ML WITH DEEPSTAQ */}
        <section className="space-y-6">
          <div className="border border-white/10 rounded-3xl p-6 md:p-10 bg-[#0D1318]/90 shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c6ff34] to-transparent" />
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#c6ff34] shadow-[0_0_10px_#c6ff34]" />
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                Why Learn Machine Learning With DeepStaq
              </h2>
            </div>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              DeepStaq is an institute built for the next generation of AI practitioners, sitting at the intersection of rigorous technical education and real-world application. Our mission is to make deep ML/AI knowledge accessible, structured, and actionable — through a comprehensive, hands-on curriculum that takes learners from programming fundamentals all the way through to generative AI and agentic systems.
            </p>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Every month builds on the last, with projects, industry-relevant tooling, and a final capstone that you take into the world as proof of what you can actually build — not just a certificate saying you sat through a course.
            </p>
          </div>
        </section>

        {/* SYLLABUS / CORE OF CURRICULUM */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Machine Learning: The Core of the Curriculum
          </h2>
          <p className="text-slate-400 font-mono text-sm">
            Machine learning isn't a single module here — it's the foundation the entire six months is built on. Here's exactly how it's taught, month by month:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {syllabus.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMonth(idx)}
                className={`p-3 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                  activeMonth === idx
                    ? "bg-[#c6ff34] text-[#090D11] border-[#c6ff34] shadow-[0_0_20px_rgba(198,255,52,0.4)]"
                    : "bg-white/[0.03] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                <div className="text-[10px] font-black uppercase opacity-70">{s.month}</div>
                <div className="text-xs font-bold line-clamp-1">{s.title.split(" (")[0]}</div>
              </button>
            ))}
          </div>

          <div className="border border-white/10 rounded-3xl p-6 md:p-8 bg-[#0D1318]/90 shadow-2xl backdrop-blur-xl space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c6ff34] to-transparent" />
            <span className="text-xs font-mono font-black text-white uppercase tracking-widest">
              {syllabus[activeMonth].month}
            </span>
            <h3 className="text-xl md:text-2xl font-black uppercase text-white">
              {syllabus[activeMonth].title}
            </h3>
            <p className="text-slate-300 font-mono text-sm leading-relaxed">
              {syllabus[activeMonth].desc}
            </p>
          </div>

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

        {/* FORMAT & STRUCTURE */}
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
                <tr className="hover:bg-white/[0.02]"><td className="p-4 md:p-5 font-bold text-white bg-white/[0.02]">Duration</td><td className="p-4 md:p-5 text-slate-300">6 months core curriculum + ~2 weeks capstone</td></tr>
                <tr className="hover:bg-white/[0.02]"><td className="p-4 md:p-5 font-bold text-white bg-white/[0.02]">Schedule</td><td className="p-4 md:p-5 text-slate-300">3 sessions/week, 2 hours/session (6 hrs/week)</td></tr>
                <tr className="hover:bg-white/[0.02]"><td className="p-4 md:p-5 font-bold text-white bg-white/[0.02]">Total Instruction Time</td><td className="p-4 md:p-5 text-slate-300">~160 hours</td></tr>
                <tr className="hover:bg-white/[0.02]"><td className="p-4 md:p-5 font-bold text-white bg-white/[0.02]">Format</td><td className="p-4 md:p-5 text-slate-300">Instructor-led, with a monthly guest session from an industry professional</td></tr>
                <tr className="hover:bg-white/[0.02]"><td className="p-4 md:p-5 font-bold text-white bg-white/[0.02]">Prerequisites</td><td className="p-4 md:p-5 text-slate-300">None — designed for complete beginners</td></tr>
                <tr className="hover:bg-white/[0.02]"><td className="p-4 md:p-5 font-bold text-white bg-white/[0.02]">Final Assessment</td><td className="p-4 md:p-5 text-slate-300">60% Capstone Project + 40% Theory</td></tr>
              </tbody>
            </table>
          </div>
          <div className="p-5 rounded-2xl bg-[#c6ff34]/10 border border-[#c6ff34]/30 text-xs md:text-sm font-mono text-slate-200 leading-relaxed">
            Every month includes a dedicated session led by an industry professional working in that month's area — bringing real-world context and direct interaction with people actively building in the field, alongside the core instructor-led curriculum.
          </div>
        </section>

        {/* TOOLS */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Tools You'll Actually Use
          </h2>
          <p className="text-slate-400 font-mono text-sm">
            You won't just learn ML theory on slides — you'll build with the same stack practitioners use:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {tools.map((t, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/80 shadow-xl space-y-2 hover:border-[#c6ff34]/40 hover:bg-[#c6ff34]/5 transition-all">
                <h4 className="text-sm font-black uppercase text-white">{t.name}</h4>
                <p className="text-xs font-mono text-slate-400">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CAPSTONE */}
        <section className="space-y-6">
          <div className="border border-white/10 rounded-3xl p-6 md:p-10 bg-[#0D1318]/90 text-white shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c6ff34] to-transparent" />
            <span className="bg-[#c6ff34]/15 text-white text-xs font-black px-3 py-1 rounded-md uppercase font-mono tracking-wider border border-[#c6ff34]/30 inline-block">
              Real Portfolio Project
            </span>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
              Your Machine Learning Capstone Project
            </h2>
            <p className="text-slate-300 font-mono text-sm md:text-base leading-relaxed">
              The programme culminates in an end-to-end capstone project of your choosing — including a classical ML pipeline built entirely on the skills from Month 3, if that's the direction you want to specialize in. Other options include an NLP/deep learning model or a domain-specific RAG application or fine-tuned LLM.
            </p>
            <div className="p-4 rounded-xl bg-white/[0.04] text-white font-mono text-xs md:text-sm font-bold border border-white/10">
              You leave with a real, working project — evaluated on data handling, model implementation, and evaluation, not a multiple-choice quiz.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <span className="text-3xl md:text-4xl font-black text-white font-mono">60%</span>
                <h4 className="text-base font-bold uppercase text-white">Capstone Project</h4>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">
                  Evaluated on data ingestion, pipeline engineering, model performance tuning, and serving.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <span className="text-3xl md:text-4xl font-black text-white font-mono">40%</span>
                <h4 className="text-base font-bold uppercase text-white">Theory</h4>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  Covering the full curriculum from programming foundations through Generative AI and MLOps.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CAREER PATHS */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Career Paths This Machine Learning Course Opens Up
          </h2>
          <p className="text-slate-400 font-mono text-sm">
            Because the curriculum doesn't stop at classical ML, graduates aren't limited to entry-level ML roles — the deep learning, GenAI, and MLOps months make you competitive for broader AI/ML Engineer and Applied AI positions too, not just narrow "data cleaning" work.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {careerRoles.map((role, idx) => (
              <span key={idx} className="bg-white/[0.04] hover:bg-[#c6ff34]/15 hover:text-white text-slate-300 text-xs font-mono font-bold px-4 py-2 rounded-xl border border-white/10 transition-colors">
                {role}
              </span>
            ))}
          </div>
        </section>

        {/* WHO SHOULD TAKE THIS COURSE */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Who Should Take This Machine Learning Course
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/70 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#c6ff34] text-[#090D11] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">1</span>
              <p className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">Beginners with zero coding background who want a structured, guided path into ML</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/70 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#c6ff34] text-[#090D11] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">2</span>
              <p className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">Developers or engineers wanting to formally specialize in machine learning</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/70 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#c6ff34] text-[#090D11] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">3</span>
              <p className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">Data analysts looking to move into a full Data Scientist or ML Engineer role</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/70 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#c6ff34] text-[#090D11] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">4</span>
              <p className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">Anyone who's tried scattered free ML tutorials and wants a structured, hands-on program instead</p>
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
              Machine Learning Track
            </span>
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white max-w-3xl">
              Future Won't Wait. Why Should You?
            </h3>
            <p className="text-slate-300 font-mono text-sm md:text-base max-w-2xl leading-relaxed">
              Machine learning talent is in short supply and rising demand — and the practitioners who stand out are the ones who can go from raw data to a deployed model, not just recite algorithm names.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link
                to="/admission"
                className="w-full sm:w-auto bg-[#c6ff34] hover:bg-[#b8f526] text-[#090D11] font-black uppercase text-sm md:text-base px-8 py-4 rounded-xl shadow-[0_0_25px_rgba(198,255,52,0.4)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center"
              >
                Enroll in DeepStaq's Machine Learning Course →
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
              <span>deepstackbyaleef@gmail.com</span>
              <span>•</span>
              <span>www.deepstaq.in</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
