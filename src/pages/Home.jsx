import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";



// Real Event Photos from Deepstaq Archive
import event1Img from "../assets/events/event (1).webp";
import event8Img from "../assets/events/event (8).webp";
import event10Img from "../assets/events/event (10).webp";
import event12Img from "../assets/events/event (12).webp";

/* ─────────────────────────────────────────────
   TECH ECOSYSTEM LOGOS & TOOLS
───────────────────────────────────────────── */
const techStack = [
  { name: "Python", category: "Core Language", tag: "3.12" },
  { name: "PyTorch", category: "Deep Learning", tag: "v2.5" },
  { name: "TensorFlow", category: "ML Engine", tag: "v2.16" },
  { name: "Hugging Face", category: "Model Hub", tag: "Transformers" },
  { name: "OpenAI", category: "LLM APIs", tag: "GPT-4o" },
  { name: "LangChain", category: "Agent Framework", tag: "v0.3" },
  { name: "LlamaIndex", category: "Data Ingestion", tag: "RAG" },
  { name: "FastAPI", category: "Backend Microservices", tag: "REST" },
  { name: "Docker", category: "Containerization", tag: "DevOps" },
  { name: "Ollama", category: "Local LLM Serving", tag: "Llama 3" },
  { name: "Pinecone", category: "Vector Database", tag: "Embeddings" },
  { name: "Claude / Anthropic", category: "Reasoning Models", tag: "Sonnet" },
];

/* ─────────────────────────────────────────────
   PROGRAMS DATA
───────────────────────────────────────────── */
const programsData = [
  {
    id: "flagship",
    flagship: true,
    title: "Professional Diploma in AI & Machine Learning",
    desc: "A complete, hands-on program to master AI and Machine Learning from foundations to real-world applications.",
    duration: "6 Months",
    mode: "Offline - Kannur",
    tags: ["Python", "Machine Learning", "Deep Learning", "Generative AI", "PyTorch"],
    features: ["160+ Total Learning Hours", "10+ Production AI Projects", "1:1 Industry Mentorship", "Placement Guarantee Support"],
    badge: "FLAGSHIP",
    link: "/programs",
  },
  {
    id: "genai",
    flagship: false,
    title: "Generative AI & LLM Engineering",
    desc: "Learn to build with modern LLMs, RAG pipelines, fine-tune models and create real-world generative AI applications.",
    duration: "6 Months",
    mode: "Offline - Kannur",
    tags: ["LLMs", "RAG", "Prompt Engineering", "Fine-tuning", "Model Deployment"],
    features: ["Vector Search Architecture", "Custom LoRA Fine-Tuning", "Multi-Modal Generative Models", "Enterprise RAG Systems"],
    badge: "POPULAR",
    link: "/programs",
  },
  {
    id: "agents",
    flagship: false,
    title: "AI Agents & Automation",
    desc: "Design and build intelligent agents to automate tasks, workflows and real business processes.",
    duration: "6 Months",
    mode: "Offline - Kannur",
    tags: ["AI Agents", "Automation", "APIs & Tools", "Multi-agent Systems", "CrewAI"],
    features: ["ReAct & Planning Loops", "Tool Calling & API Execution", "Autonomous Task Automation", "LangGraph Architectures"],
    badge: "NEW COHORT",
    link: "/programs",
  },
  {
    id: "data-science",
    flagship: false,
    title: "Data Science & Predictive ML",
    desc: "Master data analytics, exploratory modeling, statistical inference and production-ready machine learning algorithms.",
    duration: "4 Months",
    mode: "Offline / Hybrid",
    tags: ["Pandas", "Scikit-Learn", "Feature Engineering", "Data Viz", "Power BI"],
    features: ["End-to-End ML Pipelines", "Exploratory Data Analysis", "Model Evaluation & Tuning", "Interactive Dashboards"],
    badge: "FOUNDATIONS",
    link: "/programs",
  },
];


/* ─────────────────────────────────────────────
   EVENT HIGHLIGHTS CARDS
───────────────────────────────────────────── */
const eventHighlights = [
  {
    id: 1,
    title: "Aiwakening",
    subtitle: "Free AI Workshop",
    desc: "A high-energy offline immersion introducing foundational AI concepts, modern generative capabilities, and live tool demonstrations.",
    img: event12Img,
    date: "Special Workshop",
    badge: "Free AI Workshop",
  },
  {
    id: 2,
    title: "AI Aptitude Test",
    subtitle: "Assessment & Consultation",
    desc: "Comprehensive diagnostic assessment to evaluate logical aptitude, algorithmic thinking, and customized career guidance.",
    img: event8Img,
    date: "Weekly Cohort",
    badge: "Assessment & Consultation",
  },
  {
    id: 3,
    title: "Easy AI",
    subtitle: "2-Hour Hands-on Session",
    desc: "Fast-track masterclass demystifying prompting, conversational tools, and automated business workflows for complete beginners.",
    img: event1Img,
    date: "Weekend Masterclass",
    badge: "2-Hour Session",
  },
  {
    id: 4,
    title: "Prompt Engineering",
    subtitle: "1-Month Intensive Workshop",
    desc: "Deep-dive workshop on system prompting, chain-of-thought heuristics, few-shot tuning, and robust structured LLM outputs.",
    img: event10Img,
    date: "1-Month Track",
    badge: "1-Month Workshop",
  },
];

/* ─────────────────────────────────────────────
   WHAT YOU'LL LEARN MODULES
───────────────────────────────────────────── */
const curriculumModules = [
  {
    id: 1,
    title: "Programming Foundations",
    icon: "01",
    topics: ["Python 3.12 Core & OOP", "Data Structures & Algorithms", "Git, GitHub & Version Control", "Linux & Virtual Environments"],
    desc: "Build rock-solid software engineering fundamentals from zero.",
  },
  {
    id: 2,
    title: "Math & Data Visualization",
    icon: "02",
    topics: ["Linear Algebra & Matrix Math", "Calculus & Optimization", "NumPy & Pandas Manipulation", "Matplotlib & Seaborn Dashboards"],
    desc: "Understand the mathematical intuition driving machine intelligence.",
  },
  {
    id: 3,
    title: "Machine Learning",
    icon: "03",
    topics: ["Regression & Classification", "Random Forests & XGBoost", "Unsupervised Clustering & PCA", "Scikit-Learn Pipeline Engineering"],
    desc: "Train, evaluate and optimize classical machine learning models.",
  },
  {
    id: 4,
    title: "Deep Learning & NLP",
    icon: "04",
    topics: ["Neural Networks & Backprop", "PyTorch Tensors & Architectures", "Word2Vec, RNNs & Transformers", "Attention Mechanism & Encoders"],
    desc: "Master modern deep learning and sequence processing pipelines.",
  },
  {
    id: 5,
    title: "Generative AI & LLMs",
    icon: "05",
    topics: ["Prompt Engineering & System Personas", "Retrieval-Augmented Gen (RAG)", "Vector DBs (Pinecone, Chroma)", "LangChain & LlamaIndex Pipelines"],
    desc: "Create enterprise knowledge assistants and generative solutions.",
  },
  {
    id: 6,
    title: "Advanced AI & MLOps",
    icon: "06",
    topics: ["Autonomous AI Agents & Tool Calling", "Multi-Agent Collaboration", "LoRA / QLoRA Model Fine-Tuning", "FastAPI, Docker & Cloud Deployment"],
    desc: "Deploy, containerize, and orchestrate production-grade AI agents.",
  },
];

/* ─────────────────────────────────────────────
   COUNT UP COMPONENT
───────────────────────────────────────────── */
// eslint-disable-next-line no-unused-vars
function CountUpNumber({ end, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = Math.max(1, Math.floor(end / 40));
          const timer = setInterval(() => {
            start += step;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 30);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function Home() {
  const [activeProgramIndex, setActiveProgramIndex] = useState(0);
  const [activeCurriculumIndex, setActiveCurriculumIndex] = useState(0);
  const [activeEventLightbox, setActiveEventLightbox] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Keyboard navigation for image lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveEventLightbox(null);
        setVideoModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-sky-500/30 selection:text-white font-sans overflow-x-hidden relative">
      
      {/* Subtle Ambient Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-right light blue radial glow */}
        <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.14)_0%,rgba(14,165,233,0.08)_40%,transparent_70%)] blur-[120px]" />
        {/* Center-left navy/blue subtle glow */}
        <div className="absolute top-[40%] -left-[15%] w-[900px] h-[900px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.12)_0%,rgba(56,189,248,0.06)_50%,transparent_75%)] blur-[140px]" />
        {/* Bottom light blue / cyan glow */}
        <div className="absolute bottom-[5%] right-[10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.10)_0%,transparent_70%)] blur-[120px]" />
      </div>

      <div className="relative z-10">

        {/* ══════════════════════════════════════════════════════════
            1. HERO SECTION (Centered Layout)
           ══════════════════════════════════════════════════════════ */}
        <section className="relative pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto text-center">
          {/* Subtle Centered Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.16)_0%,transparent_70%)] blur-[90px] pointer-events-none -z-10" />

          <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6 sm:space-y-8">
            
            {/* Top Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.3)] mx-auto"
            >
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#E0E7EC]">
                Ai Learning & Innovation Hub
              </span>
            </motion.div>

            {/* Huge Headline: Learn AI. Build Real Skills. Create What's Next. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-1 sm:space-y-2 w-full"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-extrabold tracking-[-0.03em] leading-[0.98] text-white text-center">
               The Next<br />
                Big Thing in  <span className="text-white">Your Career</span><br />
           
              </h1>
            </motion.div>

            {/* Subtitle Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed text-center"
            >
             Learn AI from industry professionals across the globe, with experience at leading Tier 1 and Tier 2 companies
            </motion.p>

            {/* Dual Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-2 w-full sm:w-auto mx-auto"
            >
              {/* Explore Programs Pill (Primary Lime Button) */}
              <a
                href="#programs"
                className="btn-slide-wrap group px-7 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-bold text-sm sm:text-base tracking-wide shadow-[0_4px_24px_rgba(56,189,248,0.35)] flex items-center gap-2 cursor-pointer"
              >
                <span>Book a demo class</span>
                <span className="font-bold transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>

              {/* Book a Consultation Pill (Dark Glassmorphic Button) */}
              <Link
                to="/consultation"
                className="px-6 py-3.5 sm:py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.09] text-white border border-white/15 hover:border-white/35 font-semibold text-sm sm:text-base tracking-wide transition-all duration-200 backdrop-blur-md flex items-center gap-2.5 shadow-sm"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Get a Call back</span>
              </Link>
            </motion.div>

            {/* 4 Feature Pills in a Row (Offline Classes, Hands-on, Expert Mentorship, Career Skills) */}
     

          </div>
        </section>


        {/* ══════════════════════════════════════════════════════════
            HARIS & CO COMBINED: FLOATING STATS STRIP & TECH ECOSYSTEM
           ══════════════════════════════════════════════════════════ */}
        <section className="px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto mb-20 sm:mb-28">
          
          {/* Glassmorphic Stats Strip with Gradient Border */}
          <div className="relative rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-6 lg:p-8 bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
            <div className="grid grid-cols-2 md:grid-cols-4 text-center">
              {[
                { prefix: "Millions of AI", highlight: "opportunities" },
                { prefix: "The AI skills", highlight: "gap" },
                { prefix: "Learn from global", highlight: "experts" },
                { prefix: "Global placement", highlight: "Assistance" },
              ].map((item, idx) => {
                const borderClasses =
                  idx === 0
                    ? "border-r border-b md:border-b-0 border-white/10"
                    : idx === 1
                    ? "border-b md:border-b-0 md:border-r border-white/10"
                    : idx === 2
                    ? "border-r border-white/10"
                    : "border-none";

                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center text-center p-3 sm:p-4 md:px-2 md:py-4 lg:py-6 lg:px-4 xl:py-7 xl:px-6 min-h-[85px] sm:min-h-[100px] md:min-h-[110px] lg:min-h-[125px] transition-all duration-300 hover:bg-white/[0.02] group ${borderClasses}`}
                  >
                    <div className="font-extrabold tracking-tight leading-snug sm:leading-snug md:leading-tight lg:leading-snug text-xs min-[360px]:text-sm sm:text-base md:text-sm lg:text-xl xl:text-2xl 2xl:text-3xl max-w-[150px] min-[390px]:max-w-[180px] sm:max-w-[220px] md:max-w-[165px] lg:max-w-[230px] xl:max-w-[290px] mx-auto text-balance">
                      <span className="text-white group-hover:text-slate-100 transition-colors">
                        {item.prefix}{" "}
                      </span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-blue-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.25)] group-hover:drop-shadow-[0_0_16px_rgba(56,189,248,0.45)] transition-all">
                        {item.highlight}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* High-Tech Tools & Frameworks Marquee */}
          <div className="mt-8 pt-6 border-t border-white/5 overflow-hidden relative">
            <div className="flex items-center justify-between pb-3 px-2">
              <span className="text-[11px] uppercase font-semibold tracking-widest text-slate-400">
                Production AI Tech Stack You Master
              </span>
              <span className="text-[11px] text-white font-medium hidden sm:inline">
                Industry-Grade Frameworks
              </span>
            </div>

            <div className="flex overflow-hidden relative mask-radial">
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                className="flex items-center gap-3 shrink-0 py-2"
                style={{ width: "max-content" }}
              >
                {[...techStack, ...techStack].map((tech, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/8 hover:border-sky-400/40 transition-colors shrink-0 group cursor-default"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 group-hover:scale-125 transition-transform" />
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                      {tech.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {tech.tag}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

        </section>


        {/* ══════════════════════════════════════════════════════════
            2. OUR PROGRAMS / CHOOSE YOUR AI PATH (Matching Screenshot)
           ══════════════════════════════════════════════════════════ */}
        <section id="programs" className="py-16 sm:py-24 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
                OUR PROGRAMS
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Choose Your AI Path
              </h2>
            </div>

            <div className="flex items-center gap-4 md:max-w-md">
              <p className="text-sm text-slate-400 font-normal leading-relaxed">
                Industry-relevant programs designed to take you from curiosity to real-world skills. Learn, build and grow with practical guidance.
              </p>

              {/* Slider / Nav Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  aria-label="Previous program"
                  onClick={() => setActiveProgramIndex((prev) => (prev > 0 ? prev - 1 : programsData.length - 1))}
                  className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Next program"
                  onClick={() => setActiveProgramIndex((prev) => (prev < programsData.length - 1 ? prev + 1 : 0))}
                  className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Program Cards Grid (Matching the Screenshot: Flagship + GenAI + Agents) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              ...programsData.slice(activeProgramIndex),
              ...programsData.slice(0, activeProgramIndex),
            ].slice(0, 3).map((prog) => (
              <div
                key={prog.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group ${
                  prog.flagship
                    ? "bg-gradient-to-b from-[#0F1C18] to-[#0A1115] border-2 border-[#10b981]/60 shadow-[0_12px_40px_rgba(16,185,129,0.15)]"
                    : "bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                }`}
              >
                {/* Top Row: Icon + Badge */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      prog.flagship ? "bg-[#10b981]/20 text-white border border-[#10b981]/40" : "bg-white/5 text-white border border-white/10"
                    }`}>
                      {prog.flagship ? (
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      ) : prog.id === "genai" ? (
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      prog.flagship
                        ? "bg-sky-400 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                        : "bg-white/10 text-slate-300 border border-white/10"
                    }`}>
                      {prog.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
                    {prog.title}
                  </h3>

                  <p className="text-sm text-slate-300 font-normal leading-relaxed mb-6">
                    {prog.desc}
                  </p>

                  {/* Metadata Row: Duration & Mode */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium pb-6 mb-6 border-b border-white/10">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{prog.duration}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{prog.mode}</span>
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Tags + Arrow Button */}
                <div className="space-y-6 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {prog.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-medium text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Link
                      to={prog.link}
                      className="text-xs font-semibold text-white hover:underline flex items-center gap-1"
                    >
                      <span>Explore Syllabus</span>
                      <span>→</span>
                    </Link>

                    <Link
                      to={prog.link}
                      aria-label={`View ${prog.title} details`}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                        prog.flagship
                          ? "bg-white text-[#090D11] group-hover:bg-sky-400"
                          : "bg-white/10 text-white group-hover:bg-white group-hover:text-slate-950"
                      }`}
                    >
                      <span className="text-base font-bold">→</span>
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </section>


        {/* ══════════════════════════════════════════════════════════
            3. REAL-WORLD LEARNING / LEARN BY BUILDING (Matching Screenshot)
           ══════════════════════════════════════════════════════════ */}
        <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
          
          {/* Header */}
          <div className="space-y-2 mb-12 sm:mb-16">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
              REAL-WORLD LEARNING
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Learn by Building, <br className="hidden sm:block" />Not Just Watching.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-normal max-w-xl pt-2">
              Work on real projects, solve practical problems and build a portfolio that shows what you actually do.
            </p>
          </div>

          {/* 3 Interactive Mock Project Cards (RAG Chatbot, AI Dashboard, Autonomous Agents) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Card 1: RAG-based Knowledge Chatbot */}
            <div className="rounded-3xl p-6 bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between group shadow-lg">
              <div>
                {/* Mock UI: Chatbot Window */}
                <div className="rounded-2xl bg-[#070B0E] border border-white/10 p-4 mb-5 shadow-inner space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] text-slate-400 font-sans font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      RAG Chatbot
                    </span>
                    <span className="text-[9px] text-white bg-sky-400/10 px-1.5 py-0.5 rounded">
                      Cosine: 0.94
                    </span>
                  </div>

                  <div className="bg-white/[0.04] p-2.5 rounded-xl text-slate-300 text-[11px] leading-relaxed">
                    <span className="text-slate-500 block text-[9px] mb-1">User Query:</span>
                    "Summarize the Q3 report and top 3 risk factors."
                  </div>

                  <div className="bg-sky-500/10 border border-sky-500/30 p-2.5 rounded-xl text-white text-[11px] leading-relaxed">
                    <span className="text-white font-bold block text-[9px] mb-1">Retrieved from docs.pdf:</span>
                    "1. Market volatility (+12%)<br />2. GPU compute allocation<br />3. Model latency constraint"
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  RAG-based Knowledge Chatbot
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Build a chatbot that can understand and answer from your own documents.
                </p>
              </div>

              <div className="pt-6 flex justify-end">
                <Link
                  to="/programs"
                  aria-label="View RAG project details"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 flex items-center justify-center transition-all group-hover:translate-x-1"
                >
                  →
                </Link>
              </div>
            </div>

            {/* Card 2: AI Model Analysis Dashboard */}
            <div className="rounded-3xl p-6 bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between group shadow-lg">
              <div>
                {/* Mock UI: Model Metrics & ROC Curve Graph */}
                <div className="rounded-2xl bg-[#070B0E] border border-white/10 p-4 mb-5 shadow-inner space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] text-slate-400 font-sans font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      Model Analytics
                    </span>
                    <span className="text-[9px] text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded">
                      Epoch 48/50
                    </span>
                  </div>

                  {/* Metrics Pill Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-white/[0.04]">
                      <div className="text-[9px] text-slate-400">ACCURACY</div>
                      <div className="text-sm font-bold text-white">0.89</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.04]">
                      <div className="text-[9px] text-slate-400">PRECISION</div>
                      <div className="text-sm font-bold text-white">0.87</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.04]">
                      <div className="text-[9px] text-slate-400">F1-SCORE</div>
                      <div className="text-sm font-bold text-white">0.88</div>
                    </div>
                  </div>

                  {/* Mini Trend Line */}
                  <div className="h-10 w-full bg-white/[0.02] rounded-lg p-2 flex items-end gap-1">
                    {[20, 35, 45, 40, 60, 55, 75, 80, 89].map((val, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-cyan-500 to-sky-400 rounded-t-sm"
                        style={{ height: `${val}%` }}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  AI Model Analysis Dashboard
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Train, evaluate and visualize machine learning models with real data.
                </p>
              </div>

              <div className="pt-6 flex justify-end">
                <Link
                  to="/programs"
                  aria-label="View Model Dashboard project details"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 flex items-center justify-center transition-all group-hover:translate-x-1"
                >
                  →
                </Link>
              </div>
            </div>

            {/* Card 3: Autonomous AI Agent Workflow */}
            <div className="rounded-3xl p-6 bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between group shadow-lg">
              <div>
                {/* Mock UI: Node Graph / Agent Flowchart */}
                <div className="rounded-2xl bg-[#070B0E] border border-white/10 p-4 mb-5 shadow-inner space-y-2.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] text-slate-400 font-sans font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      Agent Execution Loop
                    </span>
                    <span className="text-[9px] text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded">
                      ReAct Active
                    </span>
                  </div>

                  {/* Flow Steps */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[9px]">STEP 1</span>
                      <span className="truncate">Plan: Search & verify records</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <span className="px-2 py-0.5 rounded bg-sky-400/20 text-[9px] text-white">STEP 2</span>
                      <span className="truncate">Tool: WebSearch(q="AI Kannur")</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <span className="px-2 py-0.5 rounded bg-sky-500/20 text-[9px] text-white">STEP 3</span>
                      <span className="truncate">Output: Formatted brief created</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  Autonomous AI Agent Workflow
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Create AI agents that can plan, use tools and complete complex tasks.
                </p>
              </div>

              <div className="pt-6 flex justify-end">
                <Link
                  to="/programs"
                  aria-label="View Agent Workflow project details"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 flex items-center justify-center transition-all group-hover:translate-x-1"
                >
                  →
                </Link>
              </div>
            </div>

          </div>

        </section>




        {/* ══════════════════════════════════════════════════════════
            HARIS & CO COMBINED: STEP INSIDE THE AI SCHOOL / VIDEO TOUR
           ══════════════════════════════════════════════════════════ */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-white/15 p-6 sm:p-12 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            {/* Ambient Background Blur Highlights */}
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#FF5600]/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                Campus Immersion
              </span>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Step Inside the Deepstaq AI Institute
              </h2>

              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                Take a virtual walkthrough of our daily classroom atmosphere in Kannur. High-spec GPU workstations, collaborative project pods, and dedicated mentor roundtables.
              </p>

              {/* Video Preview Card with Central Play Button */}
              <div
                onClick={() => setVideoModalOpen(true)}
                className="relative aspect-video max-w-2xl mx-auto rounded-2xl overflow-hidden border-2 border-white/20 cursor-pointer group shadow-2xl mt-8"
              >
                <img
                  src={event1Img}
                  alt="Deepstaq Campus Tour Video"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* Central Glowing Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.5)] group-hover:scale-110 transition-transform duration-200">
                    <span className="text-2xl sm:text-3xl ml-1">▶</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl">
                  <span>Watch Institute & Student Experience Tour</span>
                  <span className="text-white font-semibold">2:45 Min</span>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* ══════════════════════════════════════════════════════════
            5. PREVIOUS EVENTS / EVENT HIGHLIGHTS (Matching Screenshot)
           ══════════════════════════════════════════════════════════ */}
        <section id="events" className="py-16 sm:py-24 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
                PREVIOUS EVENTS
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Event Highlights
              </h2>
            </div>

            <div className="flex items-center gap-4 md:max-w-md">
              <p className="text-sm text-slate-400 font-normal leading-relaxed">
                Workshops, masterclasses and community sessions to spread AI knowledge and build a stronger learning community in Kannur.
              </p>
            </div>
          </div>

          {/* 4 Event Cards from Deepstaq Archive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventHighlights.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setActiveEventLightbox(evt)}
                className="group rounded-3xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-sky-400/40 transition-all duration-300 flex flex-col justify-between shadow-lg cursor-pointer"
              >
                {/* Photo Frame */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <img
                    src={evt.img}
                    alt={evt.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#090D11]/85 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-white">
                    {evt.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-white transition-colors">
                      {evt.title}
                    </h3>
                    <div className="text-xs font-medium text-slate-300 mb-2">
                      {evt.subtitle}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {evt.desc}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">
                      {evt.date}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-sky-400 text-white group-hover:text-slate-950 flex items-center justify-center text-xs font-bold transition-all">
                      →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </section>


        {/* ══════════════════════════════════════════════════════════
            6. WHAT YOU'LL LEARN / STRUCTURED CURRICULUM (Matching Screenshot)
           ══════════════════════════════════════════════════════════ */}
        <section id="curriculum" className="py-16 sm:py-24 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
                WHAT YOU'LL LEARN
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                From Fundamentals to <br />Real-World AI Skills.
              </h2>
            </div>

            <div className="flex items-center gap-4 md:max-w-md">
              <p className="text-sm text-slate-400 font-normal leading-relaxed">
                A structured curriculum that takes you from the basics to advanced, industry-relevant skills.
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  aria-label="Previous module"
                  onClick={() => setActiveCurriculumIndex((prev) => (prev > 0 ? prev - 1 : curriculumModules.length - 1))}
                  className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Next module"
                  onClick={() => setActiveCurriculumIndex((prev) => (prev < curriculumModules.length - 1 ? prev + 1 : 0))}
                  className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* 6 Step Cards Progression */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculumModules.map((mod, idx) => (
              <div
                key={mod.id}
                onClick={() => setActiveCurriculumIndex(idx)}
                className={`p-6 rounded-3xl transition-all duration-300 space-y-4 group cursor-pointer ${
                  activeCurriculumIndex === idx
                    ? "bg-white/[0.07] border-2 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.25)]"
                    : "bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:bg-sky-400/20 transition-colors">
                    {mod.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    STAGE 0{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors">
                  {mod.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {mod.desc}
                </p>

                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  {mod.topics.map((top, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                      <span>{top}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </section>


        {/* ══════════════════════════════════════════════════════════
            HARIS & CO COMBINED: WHY CHOOSE SMARTER LEARNING WITH US?
           ══════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
              DEEPSTAQ PEDAGOGY
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Why Choose Smarter Learning with Us?
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Beginner-friendly, industry-aligned tech learning designed to help students and professionals build strong foundations and launch high-impact careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "AI-Integrated Learning",
                desc: "Every module uses real AI tools to solve real problems. You don't just learn about AI; you use it daily.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                ),
                title: "Project-First Approach",
                desc: "10+ portfolio projects to prove real engineering competence to hiring managers from day one.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Cohort-Based Mentorship",
                desc: "Small focused groups with live discussions, code reviews, and personal architectural feedback.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Career & Placement Launch",
                desc: "Technical mock interviews, LinkedIn & resume optimization, and direct corporate recruitment pipelines.",
              },
            ].map((adv, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-sky-400/30 transition-all duration-300 space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-400/15 border border-sky-400/30 flex items-center justify-center">
                  {adv.icon}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {adv.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {adv.desc}
                </p>
              </div>
            ))}
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════════
            7. READY TO START & SCREENSHOT-PERFECT FOOTER (Matching Screenshot)
           ══════════════════════════════════════════════════════════ */}
   

      </div>

      {/* ── Event Lightbox Modal ── */}
      <AnimatePresence>
        {activeEventLightbox && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveEventLightbox(null)}
              className="fixed inset-0 bg-[#030917]/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden bg-[#07152b] border border-sky-500/20 shadow-2xl z-10"
            >
              <div className="relative aspect-[16/10] w-full bg-black">
                <img
                  src={activeEventLightbox.img}
                  alt={activeEventLightbox.title}
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  aria-label="Close image preview"
                  onClick={() => setActiveEventLightbox(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#030917]/80 hover:bg-sky-400 text-white hover:text-slate-950 border border-white/20 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {activeEventLightbox.badge}
                </span>
                <h3 className="text-2xl font-bold text-white">
                  {activeEventLightbox.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeEventLightbox.desc}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Campus Tour Video Modal ── */}
      <AnimatePresence>
        {videoModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVideoModalOpen(false)}
              className="fixed inset-0 bg-[#030917]/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden bg-[#07152b] border border-sky-500/20 shadow-2xl z-10 p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span className="text-sm font-bold text-white">Deepstaq AI Institute Campus Tour</span>
                </div>
                <button
                  type="button"
                  aria-label="Close tour video"
                  onClick={() => setVideoModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-sky-400 text-white hover:text-slate-950 flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10">
                <img
                  src={event1Img}
                  alt="Deepstaq Campus Walkthrough"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 flex items-center justify-center text-2xl font-bold shadow-[0_0_30px_rgba(56,189,248,0.5)]">
                    ▶
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Interactive Campus Experience</h4>
                    <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                      Located in Kannur, Kerala. Direct offline batches running with dedicated workstations.
                    </p>
                  </div>
                  <Link
                    to="/consultation"
                    onClick={() => setVideoModalOpen(false)}
                    className="px-6 py-2.5 rounded-full bg-white text-[#090D11] font-bold text-xs uppercase tracking-wider hover:bg-sky-400 transition-colors"
                  >
                    Schedule In-Person Campus Visit →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}