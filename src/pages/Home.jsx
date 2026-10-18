import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Hero AI Stack 3D Visual
import aiStackHero from "../assets/ai_stack_hero.jpg";

// Learning Experience Photos
import offlineClassroomImg from "../assets/learning/offline_classroom.jpg";
import handsOnCodingImg from "../assets/learning/hands_on_coding.jpg";
import mentorGuidanceImg from "../assets/learning/mentor_guidance.jpg";
import realWorldProjectsImg from "../assets/learning/real_world_projects.jpg";

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
   LEARNING EXPERIENCE CARDS
───────────────────────────────────────────── */
const experienceCards = [
  {
    id: 1,
    title: "Offline Classes at Kannur",
    desc: "Daily live classes at our institute with a focused learning environment.",
    img: offlineClassroomImg,
    badge: "Campus Immersion",
  },
  {
    id: 2,
    title: "Hands-on Practice",
    desc: "Learn by doing with real tools, datasets and projects.",
    img: handsOnCodingImg,
    badge: "100% Practical",
  },
  {
    id: 3,
    title: "Mentor Guidance",
    desc: "Get guidance from experienced mentors throughout your journey.",
    img: mentorGuidanceImg,
    badge: "1:1 Support",
  },
  {
    id: 4,
    title: "Real-world Projects",
    desc: "Build practical projects to strengthen your portfolio.",
    img: realWorldProjectsImg,
    badge: "Portfolio Ready",
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
    icon: "💻",
    topics: ["Python 3.12 Core & OOP", "Data Structures & Algorithms", "Git, GitHub & Version Control", "Linux & Virtual Environments"],
    desc: "Build rock-solid software engineering fundamentals from zero.",
  },
  {
    id: 2,
    title: "Math & Data Visualization",
    icon: "📊",
    topics: ["Linear Algebra & Matrix Math", "Calculus & Optimization", "NumPy & Pandas Manipulation", "Matplotlib & Seaborn Dashboards"],
    desc: "Understand the mathematical intuition driving machine intelligence.",
  },
  {
    id: 3,
    title: "Machine Learning",
    icon: "🧠",
    topics: ["Regression & Classification", "Random Forests & XGBoost", "Unsupervised Clustering & PCA", "Scikit-Learn Pipeline Engineering"],
    desc: "Train, evaluate and optimize classical machine learning models.",
  },
  {
    id: 4,
    title: "Deep Learning & NLP",
    icon: "⚡",
    topics: ["Neural Networks & Backprop", "PyTorch Tensors & Architectures", "Word2Vec, RNNs & Transformers", "Attention Mechanism & Encoders"],
    desc: "Master modern deep learning and sequence processing pipelines.",
  },
  {
    id: 5,
    title: "Generative AI & LLMs",
    icon: "🤖",
    topics: ["Prompt Engineering & System Personas", "Retrieval-Augmented Gen (RAG)", "Vector DBs (Pinecone, Chroma)", "LangChain & LlamaIndex Pipelines"],
    desc: "Create enterprise knowledge assistants and generative solutions.",
  },
  {
    id: 6,
    title: "Advanced AI & MLOps",
    icon: "🚀",
    topics: ["Autonomous AI Agents & Tool Calling", "Multi-Agent Collaboration", "LoRA / QLoRA Model Fine-Tuning", "FastAPI, Docker & Cloud Deployment"],
    desc: "Deploy, containerize, and orchestrate production-grade AI agents.",
  },
];

/* ─────────────────────────────────────────────
   COUNT UP COMPONENT
───────────────────────────────────────────── */
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
  const [openFaq, setOpenFaq] = useState(0);
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
    <div className="min-h-screen bg-[#090D11] text-white selection:bg-[#c6ff34] selection:text-[#090D11] font-sans overflow-x-hidden relative">
      
      {/* Subtle Ambient Background Gradients & Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-right emerald/lime radial glow */}
        <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(198,255,52,0.07)_0%,rgba(16,185,129,0.04)_40%,transparent_70%)] blur-[120px]" />
        {/* Center-left purple/emerald subtle glow */}
        <div className="absolute top-[40%] -left-[15%] w-[900px] h-[900px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(105,74,255,0.04)_0%,rgba(198,255,52,0.03)_50%,transparent_75%)] blur-[140px]" />
        {/* Bottom cyan/lime glow */}
        <div className="absolute bottom-[5%] right-[10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] blur-[120px]" />
        {/* Micro Tech Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10">

        {/* ══════════════════════════════════════════════════════════
            1. HERO SECTION (Matching Attached Design with High Fidelity)
           ══════════════════════════════════════════════════════════ */}
        <section className="relative pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6 sm:space-y-7">
              
              {/* Top Category Badge */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
              >
                <span className="w-2 h-2 rounded-full bg-[#c6ff34] animate-pulse shadow-[0_0_8px_#c6ff34]" />
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#E0E7EC]">
                  AI & MACHINE LEARNING INSTITUTE
                </span>
              </motion.div>

              {/* Huge Headline: Learn AI. Build Real Skills. Create What's Next. */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-1 sm:space-y-2"
              >
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-extrabold tracking-[-0.03em] leading-[0.98] text-white">
                  Learn AI.<br />
                  Build <span className="text-[#c6ff34] drop-shadow-[0_0_30px_rgba(198,255,52,0.35)]">Real Skills.</span><br />
                  Create What's Next.
                </h1>
              </motion.div>

              {/* Subtitle Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-slate-300 max-w-xl font-normal leading-relaxed"
              >
                A 6-month, hands-on program to master AI, Machine Learning, Generative AI and intelligent agents — with real projects and expert mentorship.
              </motion.p>

              {/* Dual Action CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto"
              >
                {/* Explore Programs Pill (Primary Lime Button) */}
                <a
                  href="#programs"
                  className="btn-slide-wrap group px-7 py-3.5 sm:py-4 rounded-full bg-[#c6ff34] hover:bg-[#bbf029] text-[#090D11] font-bold text-sm sm:text-base tracking-wide shadow-[0_4px_24px_rgba(198,255,52,0.35)] flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Programs</span>
                  <span className="font-bold transition-transform duration-200 group-hover:translate-x-1">→</span>
                </a>

                {/* Book a Consultation Pill (Dark Glassmorphic Button) */}
                <Link
                  to="/consultation"
                  className="px-6 py-3.5 sm:py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.09] text-white border border-white/15 hover:border-white/35 font-semibold text-sm sm:text-base tracking-wide transition-all duration-200 backdrop-blur-md flex items-center gap-2.5 shadow-sm"
                >
                  <span className="text-base">📅</span>
                  <span>Book a Consultation</span>
                </Link>
              </motion.div>

              {/* 4 Feature Pills in a Row (Offline Classes, Hands-on, Expert Mentorship, Career Skills) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-6 sm:pt-8 w-full border-t border-white/10"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { icon: "🏛️", label: "Offline Classes", sub: "at Kannur" },
                    { icon: "💻", label: "Hands-on", sub: "Learning" },
                    { icon: "👥", label: "Expert", sub: "Mentorship" },
                    { icon: "📈", label: "Career-focused", sub: "Skills" },
                  ].map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-white/20 transition-all duration-200 flex items-center gap-3 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-[#c6ff34]/20 text-[#c6ff34] flex items-center justify-center text-lg shrink-0 transition-colors">
                        {feat.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-white leading-tight truncate">
                          {feat.label}
                        </div>
                        <div className="text-[11px] text-slate-400 font-normal leading-tight">
                          {feat.sub}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>

            {/* Right Hero Graphic: 3D Stack Visualization + Floating Badge Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative flex items-center justify-center mt-6 lg:mt-0"
            >
              {/* Outer Glow Halo */}
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(198,255,52,0.18)_0%,transparent_70%)] blur-2xl pointer-events-none -z-10" />

              {/* Main 3D AI Stack Visual Frame */}
              <div className="relative w-full max-w-[480px] lg:max-w-none aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] bg-[#0C1218] group">
                <img
                  src={aiStackHero}
                  alt="Deepstaq AI Layered Neural Stack Architecture"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Cyber Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#090D11] via-transparent to-transparent opacity-60 pointer-events-none" />

                {/* Floating Glassmorphism Badge Card (As in Screenshot) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="absolute top-4 sm:top-6 right-4 sm:right-6 p-4 sm:p-5 rounded-2xl bg-[#090D11]/80 backdrop-blur-xl border border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.6)] max-w-[210px] space-y-2.5 z-20"
                >
                  <div className="text-xs font-semibold text-white leading-snug tracking-tight">
                    From ideas to intelligent solutions.
                  </div>
                  <div className="space-y-1.5 pt-1 text-[11px] text-slate-300 font-medium">
                    {["AI", "Machine Learning", "Generative AI", "LLMs", "AI Agents"].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c6ff34] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Bottom Left Live Status Pill */}
                <div className="absolute bottom-4 left-4 z-20">
                  <div className="px-3.5 py-1.5 rounded-full bg-[#090D11]/85 backdrop-blur-md border border-[#c6ff34]/30 text-[#c6ff34] text-[11px] font-semibold flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-[#c6ff34] animate-ping" />
                    <span>Next Batch Starting at Kannur</span>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </section>


        {/* ══════════════════════════════════════════════════════════
            HARIS & CO COMBINED: FLOATING STATS STRIP & TECH ECOSYSTEM
           ══════════════════════════════════════════════════════════ */}
        <section className="px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto mb-20 sm:mb-28">
          
          {/* Glassmorphic Stats Strip with Gradient Border */}
          <div className="relative rounded-3xl p-6 sm:p-8 md:p-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              
              <div className="flex flex-col items-center pt-3 sm:pt-0">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#c6ff34] tracking-tight">
                  <CountUpNumber end={100} suffix="%" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white mt-1.5">Placement Assistance</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Dedicated career roadmap</div>
              </div>

              <div className="flex flex-col items-center pt-3 md:pt-0">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#c6ff34] tracking-tight">
                  <CountUpNumber end={50} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white mt-1.5">Real AI Projects</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Production capstones built</div>
              </div>

              <div className="flex flex-col items-center pt-3 md:pt-0">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#c6ff34] tracking-tight">
                  <span>6</span><span className="text-xl sm:text-2xl font-bold ml-1 text-[#c6ff34]">Months</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white mt-1.5">Intensive Training</div>
                <div className="text-[11px] text-slate-400 mt-0.5">160+ live learning hours</div>
              </div>

              <div className="flex flex-col items-center pt-3 md:pt-0">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#c6ff34] tracking-tight">
                  <span>Kannur</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white mt-1.5">Offline Tech Campus</div>
                <div className="text-[11px] text-slate-400 mt-0.5">In-person mentorship</div>
              </div>

            </div>
          </div>

          {/* High-Tech Tools & Frameworks Marquee */}
          <div className="mt-8 pt-6 border-t border-white/5 overflow-hidden relative">
            <div className="flex items-center justify-between pb-3 px-2">
              <span className="text-[11px] uppercase font-semibold tracking-widest text-slate-400">
                Production AI Tech Stack You Master
              </span>
              <span className="text-[11px] text-[#c6ff34] font-medium hidden sm:inline">
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
                    className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/8 hover:border-[#c6ff34]/40 transition-colors shrink-0 group cursor-default"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c6ff34] group-hover:scale-125 transition-transform" />
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
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6ff34]">
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
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                      prog.flagship ? "bg-[#10b981]/20 text-[#c6ff34] border border-[#10b981]/40" : "bg-white/5 text-white border border-white/10"
                    }`}>
                      {prog.flagship ? "🏛️" : prog.id === "genai" ? "🤖" : "⚙️"}
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      prog.flagship
                        ? "bg-[#c6ff34] text-[#090D11] shadow-[0_0_12px_rgba(198,255,52,0.4)]"
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
                      <span>⏱</span>
                      <span>{prog.duration}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <span>📍</span>
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
                      className="text-xs font-semibold text-[#c6ff34] hover:underline flex items-center gap-1"
                    >
                      <span>Explore Syllabus</span>
                      <span>→</span>
                    </Link>

                    <Link
                      to={prog.link}
                      aria-label={`View ${prog.title} details`}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                        prog.flagship
                          ? "bg-white text-[#090D11] group-hover:bg-[#c6ff34]"
                          : "bg-white/10 text-white group-hover:bg-white group-hover:text-[#090D11]"
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
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6ff34]">
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
                      <span className="w-2 h-2 rounded-full bg-[#c6ff34]" />
                      RAG Chatbot
                    </span>
                    <span className="text-[9px] text-[#c6ff34] bg-[#c6ff34]/10 px-1.5 py-0.5 rounded">
                      Cosine: 0.94
                    </span>
                  </div>

                  <div className="bg-white/[0.04] p-2.5 rounded-xl text-slate-300 text-[11px] leading-relaxed">
                    <span className="text-slate-500 block text-[9px] mb-1">User Query:</span>
                    "Summarize the Q3 report and top 3 risk factors."
                  </div>

                  <div className="bg-[#10b981]/10 border border-[#10b981]/30 p-2.5 rounded-xl text-emerald-200 text-[11px] leading-relaxed">
                    <span className="text-[#c6ff34] font-bold block text-[9px] mb-1">Retrieved from docs.pdf:</span>
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
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#090D11] flex items-center justify-center transition-all group-hover:translate-x-1"
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
                      <div className="text-sm font-bold text-[#c6ff34]">0.87</div>
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
                        className="flex-1 bg-gradient-to-t from-cyan-500 to-[#c6ff34] rounded-t-sm"
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
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#090D11] flex items-center justify-center transition-all group-hover:translate-x-1"
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
                    <div className="flex items-center gap-2 text-[#c6ff34]">
                      <span className="px-2 py-0.5 rounded bg-[#c6ff34]/20 text-[9px] text-[#c6ff34]">STEP 2</span>
                      <span className="truncate">Tool: WebSearch(q="AI Kannur")</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[9px] text-emerald-300">STEP 3</span>
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
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#090D11] flex items-center justify-center transition-all group-hover:translate-x-1"
                >
                  →
                </Link>
              </div>
            </div>

          </div>

        </section>


        {/* ══════════════════════════════════════════════════════════
            4. OUR LEARNING EXPERIENCE (Matching Screenshot)
           ══════════════════════════════════════════════════════════ */}
        <section id="experience" className="py-16 sm:py-24 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
          
          {/* Header with Navigation Arrows */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6ff34]">
                OUR LEARNING EXPERIENCE
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                More Than Just Classes. <br />A Complete Learning Journey.
              </h2>
            </div>

            <div className="flex items-center gap-4 md:max-w-md">
              <p className="text-sm text-slate-400 font-normal leading-relaxed">
                A practical, mentor-led experience designed to help you build skills, confidence and a career in AI.
              </p>
            </div>
          </div>

          {/* 4 Cards with Real Photo Thumbnails */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {experienceCards.map((exp) => (
              <div
                key={exp.id}
                className="group rounded-3xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                {/* Photo Frame */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <img
                    src={exp.img}
                    alt={exp.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#090D11]/80 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-white">
                    {exp.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-[#c6ff34] transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {exp.desc}
                    </p>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <span className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#c6ff34] text-white group-hover:text-[#090D11] flex items-center justify-center text-xs font-bold transition-all">
                      →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </section>


        {/* ══════════════════════════════════════════════════════════
            HARIS & CO COMBINED: STEP INSIDE THE AI SCHOOL / VIDEO TOUR
           ══════════════════════════════════════════════════════════ */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-white/15 p-6 sm:p-12 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            {/* Ambient Background Blur Highlights */}
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#FF5600]/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#c6ff34]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#c6ff34]">
                <span className="w-2 h-2 rounded-full bg-[#c6ff34] animate-pulse" />
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
                  src={offlineClassroomImg}
                  alt="Deepstaq Campus Tour Video"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* Central Glowing Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#c6ff34] text-[#090D11] flex items-center justify-center shadow-[0_0_30px_rgba(198,255,52,0.6)] group-hover:scale-110 transition-transform duration-200">
                    <span className="text-2xl sm:text-3xl ml-1">▶</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl">
                  <span>Watch Institute & Student Experience Tour</span>
                  <span className="text-[#c6ff34] font-semibold">2:45 Min</span>
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
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6ff34]">
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
                className="group rounded-3xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-[#c6ff34]/40 transition-all duration-300 flex flex-col justify-between shadow-lg cursor-pointer"
              >
                {/* Photo Frame */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <img
                    src={evt.img}
                    alt={evt.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#090D11]/85 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-[#c6ff34]">
                    {evt.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#c6ff34] transition-colors">
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
                    <span className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#c6ff34] text-white group-hover:text-[#090D11] flex items-center justify-center text-xs font-bold transition-all">
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
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6ff34]">
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
                    ? "bg-white/[0.07] border-2 border-[#c6ff34] shadow-[0_0_25px_rgba(198,255,52,0.15)]"
                    : "bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:bg-[#c6ff34]/20 transition-colors">
                    {mod.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    STAGE 0{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#c6ff34] transition-colors">
                  {mod.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {mod.desc}
                </p>

                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  {mod.topics.map((top, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c6ff34] shrink-0" />
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
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6ff34]">
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
                icon: "⚡",
                title: "AI-Integrated Learning",
                desc: "Every module uses real AI tools to solve real problems. You don't just learn about AI; you use it daily.",
              },
              {
                icon: "📁",
                title: "Project-First Approach",
                desc: "10+ portfolio projects to prove real engineering competence to hiring managers from day one.",
              },
              {
                icon: "👥",
                title: "Cohort-Based Mentorship",
                desc: "Small focused groups with live discussions, code reviews, and personal architectural feedback.",
              },
              {
                icon: "🎯",
                title: "Career & Placement Launch",
                desc: "Technical mock interviews, LinkedIn & resume optimization, and direct corporate recruitment pipelines.",
              },
            ].map((adv, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#c6ff34]/30 transition-all duration-300 space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#c6ff34]/15 border border-[#c6ff34]/30 text-2xl flex items-center justify-center">
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
        <footer id="about" className="border-t border-white/10 bg-[#070B0E] pt-16 sm:pt-20 pb-12 px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="max-w-[1440px] mx-auto space-y-16">
            
            {/* Top Banner: READY TO START? Your AI journey starts here. */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-12 border-b border-white/10">
              <div className="space-y-3 max-w-2xl">
                <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#c6ff34]">
                  READY TO START?
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Your AI journey <span className="text-[#c6ff34]">starts here.</span>
                </h2>
                <p className="text-sm text-slate-400 font-normal leading-relaxed">
                  Talk to our team, understand the right program for you and take the first step towards a future in AI.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <Link
                  to="/admission"
                  className="btn-slide-wrap px-8 py-4 rounded-full bg-[#c6ff34] hover:bg-[#bbf029] text-[#090D11] font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(198,255,52,0.35)] flex items-center gap-2"
                >
                  <span>Apply Now</span>
                  <span className="font-bold">→</span>
                </Link>
                <Link
                  to="/consultation"
                  className="px-7 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/15 text-sm font-semibold transition-colors"
                >
                  Book a Consultation
                </Link>
              </div>
            </div>

            {/* Bottom 4-Column Grid: FAQ / Quick Links / Contact / Socials */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
              
              {/* Col 1: FAQ Section (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  FAQ
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Frequently Asked Questions.
                </h3>
                
                {/* Social icons row */}
                <div className="flex items-center gap-3 pt-2">
                  {[
                    { label: "Instagram", href: "https://www.instagram.com/deepstaq/", icon: "📸" },
                    { label: "LinkedIn", href: "https://www.linkedin.com/company/deepstaq/", icon: "💼" },
                    { label: "YouTube", href: "https://youtube.com/@deepstaq", icon: "▶️" },
                  ].map((soc, sIdx) => (
                    <a
                      key={sIdx}
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={soc.label}
                      className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#c6ff34] text-slate-300 hover:text-[#090D11] border border-white/10 flex items-center justify-center text-sm transition-all"
                    >
                      {soc.icon}
                    </a>
                  ))}
                </div>

                {/* Quick Expandable FAQs */}
                <div className="space-y-2 pt-2 text-xs">
                  {[
                    {
                      q: "What are the eligibility criteria?",
                      a: "No coding background is strictly required. We begin with Python fundamentals, algorithmic thinking, and math essentials.",
                    },
                    {
                      q: "Is there placement assistance provided?",
                      a: "Yes. 100% placement support including mock technical interviews, resume polishing, and portfolio showcases to hiring partners.",
                    },
                    {
                      q: "Can I work on my own projects?",
                      a: "Absolutely. Students frequently build domain-specific capstones (healthcare, finance, robotics) under 1-on-1 mentor guidance.",
                    },
                  ].map((faq, fIdx) => (
                    <div key={fIdx} className="border-b border-white/10 pb-2">
                      <button
                        onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                        className="w-full text-left py-1 text-slate-300 hover:text-[#c6ff34] font-medium flex items-center justify-between gap-2"
                      >
                        <span>&gt; {faq.q}</span>
                        <span className="text-slate-500 font-bold">{openFaq === fIdx ? "−" : "+"}</span>
                      </button>
                      {openFaq === fIdx && (
                        <p className="text-slate-400 text-[11px] pt-1 pl-3 leading-relaxed">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Col 2: Quick Links (3 cols) */}
              <div className="lg:col-span-3 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Quick Links
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                  <li>
                    <a href="#programs" className="hover:text-[#c6ff34] transition-colors">Programs</a>
                  </li>
                  <li>
                    <a href="#experience" className="hover:text-[#c6ff34] transition-colors">Learning Experience</a>
                  </li>
                  <li>
                    <a href="#projects" className="hover:text-[#c6ff34] transition-colors">Projects</a>
                  </li>
                  <li>
                    <a href="#events" className="hover:text-[#c6ff34] transition-colors">Events</a>
                  </li>
                  <li>
                    <a href="#about" className="hover:text-[#c6ff34] transition-colors">About</a>
                  </li>
                  <li>
                    <Link to="/blog" className="hover:text-[#c6ff34] transition-colors">AI Learning Guides</Link>
                  </li>
                  <li>
                    <Link to="/scholarship" className="hover:text-[#c6ff34] transition-colors">Scholarship</Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-[#c6ff34] transition-colors">Contact</Link>
                  </li>
                </ul>
              </div>

              {/* Col 3: Contact & Direct Actions (4 cols) */}
              <div id="contact" className="lg:col-span-4 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Contact
                </div>
                
                <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>Kannur, Kerala, India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✉️</span>
                    <a href="mailto:info@deepstaq.in" className="hover:text-[#c6ff34] transition-colors">
                      info@deepstaq.in
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📞</span>
                    <a href="tel:+919495957011" className="hover:text-[#c6ff34] transition-colors font-bold text-white">
                      +91 94959 57011
                    </a>
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    to="/admission"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c6ff34] hover:bg-[#bbf029] text-[#090D11] text-xs font-bold tracking-wide transition-all shadow-md"
                  >
                    <span>Apply Now</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

            </div>

            {/* Copyright & Legal Bar */}
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div>
                © 2026 Deepstaq. All rights reserved.
              </div>
              <div className="flex items-center gap-6">
                <Link to="/contact" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
                <span>•</span>
                <Link to="/contact" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
                <span>•</span>
                <Link to="/contact" className="hover:text-slate-300 transition-colors">Sitemap</Link>
              </div>
            </div>

          </div>
        </footer>

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
              className="fixed inset-0 bg-[#090D11]/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden bg-[#0D1318] border border-white/20 shadow-2xl z-10"
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
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#090D11]/80 hover:bg-[#c6ff34] text-white hover:text-[#090D11] border border-white/20 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-2">
                <span className="text-xs font-bold text-[#c6ff34] uppercase tracking-wider">
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
              className="fixed inset-0 bg-[#090D11]/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden bg-[#0D1318] border border-white/20 shadow-2xl z-10 p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c6ff34] animate-pulse" />
                  <span className="text-sm font-bold text-white">Deepstaq AI Institute Campus Tour</span>
                </div>
                <button
                  type="button"
                  aria-label="Close tour video"
                  onClick={() => setVideoModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#c6ff34] text-white hover:text-[#090D11] flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10">
                <img
                  src={offlineClassroomImg}
                  alt="Deepstaq Campus Walkthrough"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#c6ff34] text-[#090D11] flex items-center justify-center text-2xl font-bold shadow-[0_0_30px_#c6ff34]">
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
                    className="px-6 py-2.5 rounded-full bg-white text-[#090D11] font-bold text-xs uppercase tracking-wider hover:bg-[#c6ff34] transition-colors"
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