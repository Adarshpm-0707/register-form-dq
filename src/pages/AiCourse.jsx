import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AiCourse() {
  const [openFAQs, setOpenFAQs] = useState({ 0: true });
  const [activeMonth, setActiveMonth] = useState(0);

  const toggleFAQ = (idx) => {
    setOpenFAQs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const syllabus = [
    {
      month: "Month 1",
      title: "Programming Foundation (Python)",
      desc: "Core syntax & control flow, data structures (lists, dictionaries, sets), functions & recursion, an introduction to multithreading/asyncio — capped off with a hands-on Python project."
    },
    {
      month: "Month 2",
      title: "Math, Data & Visualisation",
      desc: "Probability & statistics essentials, NumPy & Pandas, data visualisation (Matplotlib/Seaborn), data cleaning, feature engineering & preprocessing."
    },
    {
      month: "Month 3",
      title: "Machine Learning",
      desc: "Regression & classification, decision trees & random forests, KNN, SVM, gradient boosting, clustering & PCA, model evaluation & cross-validation."
    },
    {
      month: "Month 4",
      title: "Deep Learning & NLP",
      desc: "Neural network fundamentals, activation functions & backpropagation, CNNs & RNNs, LSTMs/GRUs — with hands-on work in TensorFlow, Keras, and PyTorch."
    },
    {
      month: "Month 5",
      title: "Generative AI & LLMs",
      desc: "NLP foundations & embeddings, transformers & attention, the BERT/GPT family, large language models, and fine-tuning techniques (LoRA, QLoRA, PEFT)."
    },
    {
      month: "Month 6",
      title: "MLOps, Capstone & Advanced Topics",
      desc: "Vector databases & RAG, agentic AI & tool calling, MLOps (Docker, FastAPI, CI/CD, monitoring), your capstone project, plus a closing survey of GANs, diffusion models & multimodal AI."
    }
  ];

  const tools = [
    { name: "Python", desc: "The core programming language used throughout the programme" },
    { name: "FastAPI", desc: "Building REST APIs to serve ML models" },
    { name: "Docker", desc: "Containerizing and deploying ML applications" },
    { name: "OpenAI APIs", desc: "Working with LLMs for GenAI applications" },
    { name: "Claude, ChatGPT & Gemini", desc: "AI assistants for coding help, research & ideation" },
    { name: "Google Antigravity", desc: "AI-powered IDE for agentic coding workflows" },
    { name: "Cursor", desc: "AI-powered code editor for faster development" },
    { name: "Google Colab", desc: "Cloud-based notebooks for ML experimentation" }
  ];

  const careerRoles = [
    "Machine Learning Engineer",
    "AI/ML Engineer",
    "NLP Engineer",
    "MLOps Engineer",
    "Data Scientist / Data Analyst",
    "Generative AI Engineer",
    "AI Product / Applied AI roles",
    "AI Research / Junior Research roles"
  ];

  const faqs = [
    {
      q: "Do I need coding experience to join this AI course?",
      a: "No. The programme is designed for a mixed audience with no prior experience required — Month 1 starts with Python programming fundamentals from scratch."
    },
    {
      q: "How long is the DeepStaq AI course?",
      a: "The core curriculum runs 6 months, plus approximately 2 additional weeks for the capstone project — around 160 hours of total instruction."
    },
    {
      q: "What will I have at the end of the course?",
      a: "A completed capstone project — a classical ML pipeline, an NLP/deep learning model, or a domain-specific RAG application or fine-tuned LLM — plus a diploma based on your combined capstone and theory evaluation."
    },
    {
      q: "What jobs can I get after this course?",
      a: "Graduates are equipped to pursue roles such as Machine Learning Engineer, AI/ML Engineer, NLP Engineer, MLOps Engineer, Data Scientist, Generative AI Engineer, and Applied AI roles."
    },
    {
      q: "Does the course cover Generative AI and agentic AI?",
      a: "Yes. Month 5 covers Generative AI and LLM fine-tuning (LoRA, QLoRA, PEFT), and Month 6 covers RAG, vector databases, and agentic AI with tool calling."
    },
    {
      q: "How is the course graded?",
      a: "Final evaluation combines a 60% capstone project assessment and a 40% theory assessment covering the full curriculum."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#050521] font-sans pb-24 selection:bg-[#c6ff34] selection:text-[#050521]">
      
      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-12 bg-gradient-to-b from-slate-50 to-white border-b-2 border-[#050521] overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-6 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#c6ff34] text-[#050521] text-xs font-black px-3.5 py-1.5 rounded-lg border-2 border-[#050521] uppercase tracking-wider font-mono shadow-[3px_3px_0px_0px_#050521]">
              6-Month Professional Diploma
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-mono font-bold px-3 py-1 rounded-md border border-slate-200 uppercase">
              Beginner to Builder
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#050521] leading-[1.08] max-w-5xl">
            AI / ML & Generative AI — 6-Month Professional Diploma Programme
          </h1>

          <p className="text-slate-700 text-base md:text-lg max-w-4xl leading-relaxed font-sans font-medium">
            AI isn't coming — it's already here, and the gap between people who use AI tools and people who can build with them is where careers are being made right now. DeepStaq's AI Course is built for exactly that gap: a structured, hands-on, six-month path that takes you from zero coding experience to shipping your own AI/ML capstone project.
          </p>

          <p className="text-slate-600 font-mono text-sm md:text-base max-w-3xl leading-relaxed">
            No prior experience required. Whether you're from engineering, business, education, or a completely different background, this course gives you the foundation, the tools, and the hands-on practice to become an AI builder.
          </p>

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
              className="bg-white hover:bg-slate-50 text-[#050521] font-mono font-bold text-xs md:text-sm px-6 py-4 rounded-2xl border-2 border-[#050521] shadow-[4px_4px_0px_0px_#050521] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              📞 Talk to Us: +91 949 595 7011
            </a>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 space-y-16">
        
        {/* WHY DEEPSTAQ */}
        <section className="space-y-6">
          <div className="border-2 border-[#050521] rounded-3xl p-6 md:p-10 bg-slate-50 shadow-[6px_6px_0px_0px_#050521] space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#c6ff34] border border-[#050521]" />
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
                Why DeepStaq
              </h2>
            </div>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              DeepStaq is an institute built for the next generation of AI practitioners. We sit at the intersection of rigorous technical education and real-world application — for people who want to understand how artificial intelligence actually works, and how to build with it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <h4 className="text-xs font-mono font-black uppercase text-emerald-800 tracking-wider">Our Mission</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our mission is to make deep AI/ML knowledge accessible, structured, and actionable. Through a comprehensive, hands-on curriculum that takes learners from programming fundamentals all the way through to generative AI and agentic systems, we bridge the gap between theory and real-world practice. Every month builds on the last — with projects, industry-relevant tooling, and a final capstone that learners take into the world as proof of what they can build.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <h4 className="text-xs font-mono font-black uppercase text-emerald-800 tracking-wider">Our Vision</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our vision is to be the leading institute for practical AI education — producing professionals who don't just understand artificial intelligence, but build intelligent systems that solve real problems in the real world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COURSE FORMAT & STRUCTURE */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
            Course Format & Structure
          </h2>
          <div className="overflow-x-auto border-2 border-[#050521] rounded-3xl shadow-[6px_6px_0px_0px_#050521] bg-white">
            <table className="w-full text-left border-collapse text-xs md:text-sm font-mono">
              <thead>
                <tr className="bg-[#050521] text-white uppercase tracking-wider">
                  <th className="p-4 md:p-5 border-b-2 border-[#050521] w-1/3">Detail</th>
                  <th className="p-4 md:p-5 border-b-2 border-[#050521]">Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50"><td className="p-4 md:p-5 font-bold bg-slate-50/50">Duration</td><td className="p-4 md:p-5 text-slate-700">6 months core curriculum + ~2 weeks capstone</td></tr>
                <tr className="hover:bg-slate-50"><td className="p-4 md:p-5 font-bold bg-slate-50/50">Schedule</td><td className="p-4 md:p-5 text-slate-700">3 sessions/week, 2 hours/session (6 hrs/week)</td></tr>
                <tr className="hover:bg-slate-50"><td className="p-4 md:p-5 font-bold bg-slate-50/50">Total Instruction Time</td><td className="p-4 md:p-5 text-slate-700">~160 hours</td></tr>
                <tr className="hover:bg-slate-50"><td className="p-4 md:p-5 font-bold bg-slate-50/50">Format</td><td className="p-4 md:p-5 text-slate-700">Instructor-led, with a monthly guest session from an industry professional</td></tr>
                <tr className="hover:bg-slate-50"><td className="p-4 md:p-5 font-bold bg-slate-50/50">Prerequisites</td><td className="p-4 md:p-5 text-slate-700">None — designed for complete beginners</td></tr>
                <tr className="hover:bg-slate-50"><td className="p-4 md:p-5 font-bold bg-slate-50/50">Final Assessment</td><td className="p-4 md:p-5 text-slate-700">60% Capstone Project + 40% Theory</td></tr>
              </tbody>
            </table>
          </div>
          <div className="p-5 rounded-2xl bg-[#c6ff34]/20 border-2 border-[#050521] shadow-[3px_3px_0px_0px_#050521] text-xs md:text-sm font-mono text-[#050521] leading-relaxed">
            Every month of the programme includes a dedicated session led by an industry professional working in that month's area of study — bringing real-world context, current industry practice, and direct interaction with people actively building in the field, alongside the core instructor-led curriculum.
          </div>
        </section>

        {/* SYLLABUS */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
            What You'll Learn: Syllabus in Detail
          </h2>
          <p className="text-slate-600 font-mono text-sm">
            A closer look at what each month of the curriculum covers:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {syllabus.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMonth(idx)}
                className={`p-3 rounded-xl border-2 text-left font-mono transition-all ${
                  activeMonth === idx
                    ? "bg-[#050521] text-[#c6ff34] border-[#050521] shadow-[3px_3px_0px_0px_#c6ff34]"
                    : "bg-white text-[#050521] border-slate-200 hover:border-[#050521]"
                }`}
              >
                <div className="text-[10px] font-black uppercase opacity-70">{s.month}</div>
                <div className="text-xs font-bold line-clamp-1">{s.title}</div>
              </button>
            ))}
          </div>

          <div className="border-2 border-[#050521] rounded-3xl p-6 md:p-8 bg-white shadow-[6px_6px_0px_0px_#050521] space-y-3">
            <span className="text-xs font-mono font-black text-emerald-800 uppercase tracking-widest">
              {syllabus[activeMonth].month}
            </span>
            <h3 className="text-xl md:text-2xl font-black uppercase text-[#050521]">
              {syllabus[activeMonth].title}
            </h3>
            <p className="text-slate-700 font-mono text-sm leading-relaxed">
              {syllabus[activeMonth].desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {syllabus.map((m, idx) => (
              <div key={idx} className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-2">
                <span className="text-[11px] font-mono font-black text-[#050521] bg-white px-2.5 py-1 rounded border border-slate-300">
                  {m.month}
                </span>
                <h4 className="text-sm font-black uppercase text-[#050521]">{m.title}</h4>
                <p className="text-xs text-slate-600 font-mono leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TOOLS & TECHNOLOGIES */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
            Tools & Technologies You'll Use
          </h2>
          <p className="text-slate-600 font-mono text-sm">
            Across the 6-month programme, you'll get hands-on experience with the same tools, frameworks, and AI assistants used by practitioners in the industry:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {tools.map((t, idx) => (
              <div key={idx} className="p-5 rounded-2xl border-2 border-[#050521] bg-white shadow-[4px_4px_0px_0px_#050521] space-y-2 hover:bg-[#c6ff34]/10 transition-colors">
                <h4 className="text-sm font-black uppercase text-[#050521]">{t.name}</h4>
                <p className="text-xs font-mono text-slate-600">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CAPSTONE PROJECT */}
        <section className="space-y-6">
          <div className="border-2 border-[#050521] rounded-3xl p-6 md:p-10 bg-[#050521] text-white shadow-[8px_8px_0px_0px_#c6ff34] space-y-6">
            <span className="bg-[#c6ff34] text-[#050521] text-xs font-black px-3 py-1 rounded-md uppercase font-mono tracking-wider">
              The Capstone Project
            </span>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
              Build Real Intelligent Systems
            </h2>
            <p className="text-slate-300 font-mono text-sm md:text-base leading-relaxed">
              The programme culminates in an end-to-end capstone project: an original AI/ML build of your choosing. Choose from a classical ML pipeline, an NLP/deep learning model, or a domain-specific RAG application or fine-tuned LLM.
            </p>
            <div className="p-4 rounded-xl bg-white/10 text-white font-mono text-xs md:text-sm font-bold border border-white/20">
              ✨ You leave with something you actually built — not just a certificate.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-3xl md:text-4xl font-black text-[#c6ff34] font-mono">60%</span>
                <h4 className="text-base font-bold uppercase text-white">Capstone Project</h4>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  Assessed on the end-to-end build, including data handling, model implementation, evaluation, and deployment or RAG/agent components.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-3xl md:text-4xl font-black text-[#c6ff34] font-mono">40%</span>
                <h4 className="text-base font-bold uppercase text-white">Theory</h4>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  Assessed on conceptual understanding across the full curriculum, from programming foundations through to Generative AI and MLOps.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHERE THIS COURSE CAN TAKE YOU */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
            Where This Course Can Take You
          </h2>
          <p className="text-slate-600 font-mono text-sm">
            AI/ML talent is in serious demand, and the skill gap keeps widening. Here's what this programme can open up for you:
          </p>
          <div className="flex flex-wrap gap-2.5">
            {careerRoles.map((role, idx) => (
              <span key={idx} className="bg-slate-100 hover:bg-[#c6ff34] text-[#050521] text-xs font-mono font-bold px-4 py-2 rounded-xl border border-slate-300 transition-colors">
                💼 {role}
              </span>
            ))}
          </div>
          <div className="pt-4 space-y-3">
            <h3 className="text-lg font-black uppercase text-[#050521]">Beyond a Traditional Job</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border-2 border-[#050521] bg-white shadow-[4px_4px_0px_0px_#050521] space-y-2">
                <h4 className="text-sm font-black uppercase text-[#050521]">🚀 Crack a global career</h4>
                <p className="text-xs font-mono text-slate-600">AI/ML skills are in high global demand, equipping you for roles like ML Engineer, Data Scientist, GenAI Engineer, or MLOps Engineer worldwide.</p>
              </div>
              <div className="p-5 rounded-2xl border-2 border-[#050521] bg-white shadow-[4px_4px_0px_0px_#050521] space-y-2">
                <h4 className="text-sm font-black uppercase text-[#050521]">🌍 Work remote</h4>
                <p className="text-xs font-mono text-slate-600">AI/ML roles are increasingly remote-friendly, letting you work for companies anywhere without relocating.</p>
              </div>
              <div className="p-5 rounded-2xl border-2 border-[#050521] bg-white shadow-[4px_4px_0px_0px_#050521] space-y-2">
                <h4 className="text-sm font-black uppercase text-[#050521]">💡 Become an AI entrepreneur</h4>
                <p className="text-xs font-mono text-slate-600">Hands-on experience building RAG apps, agents, and fine-tuned LLMs equips you to launch your own AI products or services.</p>
              </div>
              <div className="p-5 rounded-2xl border-2 border-[#050521] bg-white shadow-[4px_4px_0px_0px_#050521] space-y-2">
                <h4 className="text-sm font-black uppercase text-[#050521]">⚡ Start freelancing & consulting</h4>
                <p className="text-xs font-mono text-slate-600">Offer AI/ML services like model building, RAG pipelines, chatbots, and advisory work for businesses adopting AI.</p>
              </div>
            </div>
          </div>
        </section>

        {/* WHO THIS COURSE IS FOR */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
            Who This Course Is For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#050521] text-[#c6ff34] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">1</span>
              <p className="text-xs md:text-sm font-mono text-slate-700 leading-relaxed">Complete beginners with zero coding background who want a structured path into AI</p>
            </div>
            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#050521] text-[#c6ff34] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">2</span>
              <p className="text-xs md:text-sm font-mono text-slate-700 leading-relaxed">Engineers and developers looking to specialize in AI/ML</p>
            </div>
            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#050521] text-[#c6ff34] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">3</span>
              <p className="text-xs md:text-sm font-mono text-slate-700 leading-relaxed">Business, education, or non-technical professionals who want to become AI builders, not just AI users</p>
            </div>
            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#050521] text-[#c6ff34] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">4</span>
              <p className="text-xs md:text-sm font-mono text-slate-700 leading-relaxed">Anyone serious about a career shift into Machine Learning Engineering, Data Science, or Generative AI</p>
            </div>
          </div>
        </section>

        {/* FAQS */}
        <section className="space-y-6 pt-6 border-t-2 border-[#050521]">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border-2 border-[#050521] rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#050521] bg-white">
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
        </section>

        {/* CTA SECTION */}
        <section className="pt-8">
          <div className="bg-[#050521] text-white rounded-3xl p-8 md:p-12 border-2 border-[#050521] shadow-[8px_8px_0px_0px_#c6ff34] space-y-6 text-center md:text-left">
            <span className="bg-[#c6ff34] text-[#050521] text-xs font-black px-3.5 py-1.5 rounded-md uppercase font-mono tracking-wider inline-block">
              Admissions Open
            </span>
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white max-w-3xl">
              Future Won't Wait. Why Should You?
            </h3>
            <p className="text-slate-300 font-mono text-sm md:text-base max-w-2xl leading-relaxed">
              AI/ML talent is in short supply and rising demand. Six months from now, you can either be watching this shift from the sidelines — or be the person building it.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link
                to="/admission"
                className="w-full sm:w-auto bg-[#c6ff34] hover:bg-[#b5f024] text-[#050521] font-black uppercase text-sm md:text-base px-8 py-4 rounded-xl border-2 border-[#050521] shadow-[4px_4px_0px_0px_white] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center"
              >
                Enroll in DeepStaq's AI Course →
              </Link>
              <Link
                to="/consultation"
                className="w-full sm:w-auto bg-transparent text-white border-2 border-white font-black uppercase text-sm px-6 py-4 rounded-xl hover:bg-white/10 transition-all text-center"
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
