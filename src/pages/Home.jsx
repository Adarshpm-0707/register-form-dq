import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroVRSection from "../components/HeroVRSection";
import CircularGallery from "../components/CircularGallery";
import OurEventsSection from "../components/OurEventsSection";


// Career image imports
import aiMlEngineerImg from "../assets/careers/ai_ml_engineer.png";
import generativeAiDevImg from "../assets/careers/generative_ai_dev.png";
import dataScientistImg from "../assets/careers/data_scientist.png";
import llmopsEngineerImg from "../assets/careers/llmops_engineer.png";
import aiProductManagerImg from "../assets/careers/ai_product_manager.png";
import nlpEngineerImg from "../assets/careers/nlp_engineer.png";


/* ─────────────────────────────────────────────
   TICKER TAPE
───────────────────────────────────────────── */
const tickerItems = [
  "PYTHON CORE", "FASTAPI APIS", "DOCKER CONTAINERS",
  "LLM FINE-TUNING", "RAG PIPELINES", "AGENTIC AI",
  "PYTORCH & MODEL DEPLOYMENT", "ENROLLMENT OPEN NOW",
];

function Ticker() {
  return (
    <div className="overflow-hidden border-y-2 border-[#050521] bg-[#c6ff34] py-3 select-none">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="text-[#050521] font-black text-[10px] md:text-[11px] tracking-[0.25em] uppercase mr-12 flex items-center gap-2">
            <span className="w-2 h-2 rotate-45 bg-[#050521] inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}



/* ─────────────────────────────────────────────
   COUNT UP
───────────────────────────────────────────── */
function CountUp({ end, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = end / 60;
          const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 20);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   FAQ
───────────────────────────────────────────── */
const faqItems = [
  { q: "Do I need prior experience?", a: "No. We start from absolute zero — our Python & Math Essentials modules ensure every student builds a solid foundation." },
  { q: "How long is the programme?", a: "The full diploma runs 6 months part-time with 160+ total learning hours." },
  { q: "Is it industry-recognised?", a: "Yes. DeepStaq certificates are co-validated with our hiring partners." },
  { q: "What is the fee structure?", a: "We offer monthly instalments, upfront discounts, and income share agreements." },
];

function InlineFAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-4">
      {faqItems.map((item, i) => (
        <div key={i} className="border-b-2 border-[#050521]/10 last:border-0">
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between py-8 text-left group">
            <span className="font-black text-[#050521] text-lg md:text-xl uppercase tracking-tighter pr-6 leading-tight">{item.q}</span>
            <span className={`w-12 h-12 rounded-xl border-2 border-[#050521] flex-shrink-0 flex items-center justify-center transition-all ${open === i ? "bg-[#c6ff34] rotate-45" : "bg-white"}`}>
              <span className="text-2xl font-bold">+</span>
            </span>
          </button>
          <motion.div initial={false} animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }} className="overflow-hidden">
            <p className="text-slate-500 text-sm md:text-base font-mono leading-relaxed pb-8 pr-12">{item.a}</p>
          </motion.div>
        </div>
      ))}
    </div>
  );
}


/* ─────────────────────────────────────────────
   CAPSTONE ANIMATED GRID
───────────────────────────────────────────── */
const capstoneTracks = [
  { id: "01", name: "AI Chatbot Systems", desc: "Stateful multi-turn agents with custom system prompts and persistent memory.", featured: true },
  { id: "02", name: "RAG Solutions", desc: "Enterprise-grade semantic search using vector stores, chunking, and metadata filtering." },
  { id: "03", name: "Autonomous AI Assistants", desc: "Agentic workflows with tool-calling capabilities and complex decision loops." },
  { id: "04", name: "Production ML Pipelines", desc: "End-to-end pipelines covering training, testing, artifact logging, and containerization." },
  { id: "05", name: "Advanced NLP Apps", desc: "Custom sequence tagging, translation, summarization, and text classification engines." },
  { id: "06", name: "Fine-tuned LLMs", desc: "Parameter-efficient tuning via LoRA and QLoRA on custom domain datasets." },
  { id: "07", name: "AI Automation Platforms", desc: "Low-latency API integration triggering background AI workers and task orchestrations.", featured: true },
];

function CapstoneCard({ proj }) {
  return (
    <div
      className="relative flex-shrink-0 w-[280px] sm:w-[320px] border-2 border-[#c6ff34] rounded-2xl p-6 flex flex-col justify-between cursor-default overflow-hidden group transition-colors duration-300 bg-[#c6ff34]/5 hover:bg-[#c6ff34]/10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(198,255,52,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Project_{proj.id}</span>
          <div className={`w-2 h-2 rounded-full ${proj.featured ? "bg-[#c6ff34]" : "bg-white/20 group-hover:bg-[#c6ff34] transition-colors duration-300"}`} />
        </div>
        <h3 className={`text-sm font-black uppercase tracking-tight leading-tight group-hover:text-[#c6ff34] transition-colors duration-200 ${proj.featured ? "text-[#c6ff34]" : "text-white"}`}>
          {proj.name}
        </h3>
        <p className="text-[10px] text-slate-400 font-mono leading-relaxed">{proj.desc}</p>
      </div>
      <div className={`mt-5 h-[2px] rounded-full transition-all duration-500 ${proj.featured ? "bg-[#c6ff34]/40 group-hover:bg-[#c6ff34]" : "bg-white/10 group-hover:bg-[#c6ff34]/50"}`} />
    </div>
  );
}

function CapstoneGrid() {
  const doubled = [...capstoneTracks, ...capstoneTracks];
  return (
    <div className="mb-12 overflow-hidden relative">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050521] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050521] to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-4 py-2"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        style={{ width: "max-content" }}
      >
        {doubled.map((proj, idx) => (
          <CapstoneCard key={`${proj.id}-${idx}`} proj={proj} />
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN HOME
───────────────────────────────────────────── */
const careerRolesData = [
  {
    title: "AI/ML Engineer",
    desc: "Design and implement machine learning models, neural networks, and scalable pipelines.",
    img: aiMlEngineerImg,
    track: "Track 01"
  },
  {
    title: "Generative AI Developer",
    desc: "Develop advanced LLM applications, custom RAG pipelines, fine-tuned foundational models, and agentic workflows.",
    img: generativeAiDevImg,
    track: "Track 02"
  },
  {
    title: "Data Scientist",
    desc: "Analyze complex datasets, extract business-critical insights, and build predictive statistical models.",
    img: dataScientistImg,
    track: "Track 03"
  },
  {
    title: "LLMOps Engineer",
    desc: "Deploy, monitor, scale, and optimize large language models in containerized cloud environments.",
    img: llmopsEngineerImg,
    track: "Track 04"
  },
  {
    title: "AI Product Manager",
    desc: "Drive product lifecycle from inception to deployment, blending AI technical capabilities with user experience.",
    img: aiProductManagerImg,
    track: "Track 05"
  },
  {
    title: "NLP Engineer",
    desc: "Build language processing pipelines, speech recognition algorithms, translation systems, and sentiment analyzers.",
    img: nlpEngineerImg,
    track: "Track 06"
  }
];

export default function Home() {

  return (
    <div className="min-h-screen bg-white text-[#050521] overflow-x-clip font-sans">

      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto w-full z-10 flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-2 sm:pt-10 lg:pt-0">

          <div className="lg:col-span-6 flex flex-col justify-center items-center text-center lg:items-start lg:text-left w-full">
            <div className="space-y-3">
              
              <motion.h1
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 70, damping: 12 }}
                className="text-[10vw] sm:text-[clamp(2.5rem,5vw,5.5rem)] font-black uppercase leading-[0.85] tracking-tighter"
              >
                From Zero to
              </motion.h1>
              <motion.h1
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 70, damping: 12, delay: 0.1 }}
                className="text-[10vw] sm:text-[clamp(2.5rem,5vw,5.5rem)] text-stroke-dark-lg font-black uppercase leading-[0.85] tracking-tighter"
              >
                AI Builder
              </motion.h1>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 90, damping: 12, delay: 0.2 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-3"
              >
                <span className="bg-[#050521] text-[#c6ff34] px-5 py-2.5 rounded-2xl text-[9vw] sm:text-[clamp(2rem,4.5vw,5rem)] font-black uppercase leading-none shadow-[4px_4px_0px_0px_#c6ff34] border border-[#c6ff34]/20">in 6 Months</span>
              </motion.div>
            </div>

            <p className="mt-6 sm:mt-8 text-slate-700 text-sm sm:text-base md:text-lg max-w-xl font-medium leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
              Master Artificial Intelligence, Machine Learning, Generative AI, Agentic AI, and modern AI development through an intensive 6-month professional diploma designed for beginners and professionals alike.
            </p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.45 }}
              className="mt-8 sm:mt-12 flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto items-center justify-center lg:justify-start"
            >
              <Link to="/aptitude" className="w-full sm:w-auto">
                <button className="w-full px-12 py-5 bg-[#050521] text-[#c6ff34] font-black text-sm md:text-base uppercase tracking-widest rounded-xl shadow-[6px_6px_0px_0px_#c6ff34] active:translate-y-1 active:shadow-none transition-all hover:scale-105 duration-200">
                  Take Aptitude Test
                </button>
              </Link>
              <Link to="/consultation" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-12 py-5 border-2 border-[#050521] text-[#050521] font-black text-sm md:text-base uppercase tracking-widest rounded-xl hover:bg-[#050521] hover:text-[#c6ff34] transition-all hover:scale-105 duration-200">
                  Book Your Consultation
                </button>
              </Link>
            </motion.div>
          </div>

          <div className="lg:col-span-6 flex justify-center items-center w-full mt-6 lg:mt-0">
            <HeroVRSection />
          </div>

        </div>
      </section>

      {/* Our Events Section */}
      <OurEventsSection />

      {/* Ticker & Core Statistics */}
      <section className="bg-[#c6ff34] border-y-2 border-[#050521]">
        <Ticker />
        <div className="py-16 px-6 sm:px-12 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 text-center">
            {[
              { val: 100, suffix: "%", label: "Placement Assistance" },
              { val: 10, suffix: "+", label: "Live Projects" },
              { val: 6, suffix: " Months", label: "Duration" },
              { val: 20, suffix: "+", label: "AI Tools" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-4xl md:text-6xl font-black text-[#050521] leading-none mb-3 tracking-tighter">
                  <CountUp end={s.val} suffix={s.suffix} />
                </div>
                <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-[#050521]/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About, Vision & Mission Sections */}
      <section className="py-24 px-5 border-b-2 border-[#050521] bg-slate-50/50">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              About Us<br /><span className="text-stroke-dark">Deepstaq.</span>
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed text-base md:text-lg">
              Deepstaq is an institute built for the next generation of AI practitioners. Our mission is to make Artificial Intelligence education practical, industry-focused, and accessible to everyone.
            </p>
            <p className="text-slate-600 font-medium leading-relaxed text-base md:text-lg">
              Whether you come from engineering, business, education, or a completely different background, Deepstaq provides the right foundation to become an AI Builder through hands-on learning and real-world projects.
            </p>
          </div>
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border-2 border-[#050521] p-6 md:p-8 rounded-[1.8rem] shadow-[6px_6px_0px_0px_#050521]">
              <span className="text-xs font-black uppercase tracking-widest text-[#050521] bg-[#c6ff34] border border-[#050521] px-3 py-1 rounded-full inline-block mb-4">
                Our Vision
              </span>
              <p className="text-sm font-semibold leading-relaxed text-slate-600">
                To become the leading institute for practical AI education by producing professionals who don't just understand Artificial Intelligence—but build intelligent systems that solve real-world problems.
              </p>
            </div>
            <div className="bg-white border-2 border-[#050521] p-6 md:p-8 rounded-[1.8rem] shadow-[6px_6px_0px_0px_#c6ff34]">
              <span className="text-xs font-black uppercase tracking-widest text-[#050521] bg-[#c6ff34] border border-[#050521] px-3 py-1 rounded-full inline-block mb-4">
                Our Mission
              </span>
              <p className="text-sm font-semibold leading-relaxed text-slate-600">
                Our mission is to make AI and Machine Learning education structured, practical, and accessible. Through project-based learning, expert mentorship, industry tools, and continuous practice, students progress from fundamentals to advanced Agentic and Generative AI systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Details: Highlights & Duration */}
      <section className="py-24 px-5 border-b-2 border-[#050521]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              Programme<br /><span className="text-stroke-dark">Overview.</span>
            </h2>
            <p className="text-slate-500 font-mono text-sm">Every month of the programme includes live industry sessions led by experienced AI professionals.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Live Classes",
                "Practical Projects",
                "Industry Mentorship",
                "Weekly Assignments",
                "Real AI Applications",
                "Portfolio Development",
                "Career Guidance",
              ].map((label, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-2 h-2 rotate-45 bg-[#c6ff34] border border-[#050521] shrink-0 inline-block" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#050521]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border-2 border-[#050521] p-6 md:p-10 rounded-[2rem] shadow-[8px_8px_0px_0px_#050521]">
            <h3 className="text-xl font-black uppercase tracking-tight mb-6">
              Instruction Hours
            </h3>
            <div className="space-y-4 font-mono text-sm text-slate-600">
              <div className="flex justify-between border-b pb-2"><span className="uppercase text-xs font-black text-slate-400">Duration</span><span className="font-bold text-[#050521]">6 Months</span></div>
              <div className="flex justify-between border-b pb-2"><span className="uppercase text-xs font-black text-slate-400">Classes Per Week</span><span className="font-bold text-[#050521]">3 Classes</span></div>
              <div className="flex justify-between border-b pb-2"><span className="uppercase text-xs font-black text-slate-400">Hours Per Session</span><span className="font-bold text-[#050521]">2 Hours</span></div>
              <div className="flex justify-between border-b pb-2"><span className="uppercase text-xs font-black text-slate-400">Total Weekly Hours</span><span className="font-bold text-[#050521]">6 Hours</span></div>
              <div className="flex justify-between border-b pb-2"><span className="uppercase text-xs font-black text-slate-400">Capstone Project</span><span className="font-bold text-[#050521]">2 Additional Weeks</span></div>
              <div className="flex justify-between"><span className="uppercase text-xs font-black text-slate-400">Total Learning Hours</span><span className="font-bold text-[#050521] bg-[#c6ff34] px-3 py-1 border border-[#050521] rounded-md">160+ Hours</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Capstone Project & Evaluation section */}
      <section className="py-24 px-5 border-b-2 border-[#050521] bg-[#050521] text-white relative overflow-x-clip">
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#c6ff34]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#c6ff34]/4 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10">

          {/* ── Header row ── */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between items-center text-center lg:text-left gap-8 mb-16 pb-10 border-b border-white/10">
            <div className="space-y-4 max-w-2xl flex flex-col items-center lg:items-start">
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#c6ff34] border border-[#c6ff34]/30 bg-[#c6ff34]/5 px-4 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c6ff34] animate-pulse" />
                Portfolio Building
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-[clamp(3.5rem,7vw,6.5rem)] font-black uppercase tracking-tighter leading-none">
                Capstone<br />
                <span className="text-stroke-light text-transparent">Projects.</span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed max-w-xl">
                Students ship a production-ready AI application under direct industry mentorship — graduating with a verified portfolio that proves real engineering competence.
              </p>
            </div>
            {/* Evaluation Summary Pill */}
            <div className="flex gap-4 sm:gap-6 justify-center lg:justify-start flex-wrap w-full lg:w-auto">
              {[{ label: "Capstone Project", pct: "60%", active: true }, { label: "Theory Exam", pct: "40%", active: false }].map((item, i) => (
                <div key={i} className={`flex-1 min-w-[140px] sm:min-w-[160px] flex flex-col items-center justify-center border-2 rounded-2xl px-6 sm:px-8 py-5 sm:py-6 gap-1 ${item.active ? "border-[#c6ff34] bg-[#c6ff34]/5" : "border-white/10 bg-white/3"}`}>
                  <span className={`text-4xl sm:text-5xl font-black leading-none ${item.active ? "text-[#c6ff34]" : "text-white/40"}`}>{item.pct}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bento grid of project tracks ── */}
          <CapstoneGrid />

          {/* ── Evaluation detail bar ── */}
          <div className="border border-white/10 rounded-2xl p-6 md:p-8 bg-white/3 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                badge: "PRACTICAL", badgeColor: "text-[#c6ff34] bg-[#c6ff34]/10 border-[#c6ff34]/20",
                title: "Capstone Project", pct: 60, barColor: "bg-[#c6ff34]", pctColor: "text-[#c6ff34]",
                desc: "Assessed on system design, modular codebase, model alignment, API latency, Docker setup, and documentation quality."
              },
              {
                badge: "THEORY", badgeColor: "text-slate-400 bg-white/5 border-white/10",
                title: "Theory Examination", pct: 40, barColor: "bg-white/30", pctColor: "text-white/50",
                desc: "Covers ML mathematics, neural architectures, tuning trade-offs, vector lookup mechanics, and pipeline engineering."
              }
            ].map((crit, i) => (
              <div key={i} className="space-y-3.5 p-4 sm:p-0 bg-white/[0.02] sm:bg-transparent rounded-xl sm:rounded-none border border-white/5 sm:border-none">
                <div className="flex flex-row items-center justify-between gap-2">
                  <div className="flex flex-col items-start text-left">
                    <span className={`text-[9px] font-black uppercase tracking-widest border px-2 py-0.5 rounded ${crit.badgeColor}`}>{crit.badge}</span>
                    <h4 className="text-sm font-black uppercase tracking-wider text-white mt-1.5">{crit.title}</h4>
                  </div>
                  <span className={`text-3xl sm:text-4xl font-black leading-none ${crit.pctColor}`}>{crit.pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${crit.barColor}`} style={{ width: `${crit.pct}%` }} />
                </div>
                <p className="text-[11px] text-slate-400 font-mono leading-relaxed text-left sm:text-left">{crit.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Career Opportunities ─────────────────────── */}
      <section className="py-16 md:py-24 border-b-2 border-[#050521] bg-[#050521] overflow-hidden">
        {/* Centered Header */}
        <div className="max-w-[900px] mx-auto text-center mb-12 md:mb-16 px-5 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#c6ff34] bg-[#c6ff34]/10 border border-[#c6ff34]/30 px-4 py-2 rounded-full"
          >
            Programme Outcomes
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.88] text-white"
          >
            Career<br />
            <span style={{ WebkitTextStroke: "2px #c6ff34", color: "transparent" }}>
              Opportunities.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm md:text-base font-medium leading-relaxed max-w-[550px] mx-auto"
          >
            After completing the programme, students possess the technical portfolio required to pursue multiple high-demand roles in AI.
          </motion.p>
          <p className="text-[#c6ff34]/50 font-mono text-[10px] uppercase tracking-widest animate-pulse">
            ← Drag or swipe to explore →
          </p>
        </div>

        {/* CircularGallery — WebGL curved carousel, responsive on mobile/tablet/desktop */}
        <div className="w-full h-[360px] sm:h-[450px] lg:h-[500px] relative">
          <CircularGallery
            items={careerRolesData.map(role => ({ image: role.img, text: role.title }))}
            bend={3}
            textColor="#c6ff34"
            borderRadius={0.05}
            scrollSpeed={2.5}
            scrollEase={0.04}
            fontUrl="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap"
            font="bold 22px Orbitron"
          />
        </div>
      </section>

      {/* ── AI For Everyone Initiative Section ── */}
      <section className="py-20 md:py-28 px-6 sm:px-12 lg:px-20 border-b-2 border-[#050521] bg-gradient-to-r from-slate-900 via-[#050521] to-slate-950 text-white relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c6ff34]/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#c6ff34]/5 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

        <div className="max-w-[1300px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c6ff34]/10 border border-[#c6ff34]/30 text-[#c6ff34]">
              <span className="w-2 h-2 rounded-full bg-[#c6ff34] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em]">New Public Initiative</span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95] text-white">
              AI FOR <br />
              <span style={{ WebkitTextStroke: "2px #c6ff34", color: "transparent" }}>
                EVERYONE.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-xl">
              Artificial Intelligence is not just for software engineers. Discover our hands-on, beginner-friendly program designed for students, professionals, and curious learners to master daily AI tools with zero coding required.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/ai-for-everyone">
                <button className="px-8 sm:px-10 py-4 sm:py-5 bg-[#c6ff34] text-[#050521] hover:bg-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[5px_5px_0px_0px_white] hover:shadow-[5px_5px_0px_0px_#c6ff34] hover:scale-105 active:translate-y-1 duration-200 cursor-pointer">
                  Register for AI For Everyone →
                </button>
              </Link>
              <Link to="/ai-for-everyone">
                <button className="px-8 sm:px-10 py-4 sm:py-5 border-2 border-white/20 text-white hover:border-[#c6ff34] hover:text-[#c6ff34] font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:translate-y-1 duration-200 cursor-pointer">
                  Explore Curriculum
                </button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-4 shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="font-mono text-xs uppercase tracking-wider text-[#c6ff34]">Cohort Details</span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#c6ff34]/20 text-[#c6ff34] border border-[#c6ff34]/30">Open Enrollment</span>
              </div>
              <div className="space-y-3 font-mono text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Eligibility</span>
                  <span className="font-bold text-white">Anyone (Zero Coding)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Format</span>
                  <span className="font-bold text-white">Online & Offline Hub</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tools</span>
                  <span className="font-bold text-white">ChatGPT, Claude, Canva AI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Certification</span>
                  <span className="font-bold text-[#c6ff34]">Official DeepStaq Certificate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Queries Section */}
      <section className="py-24 md:py-32 px-6 sm:px-12 lg:px-20 border-b-2 border-[#050521]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.8] mb-8">Common<br /><span className="text-stroke-dark">Queries.</span></h2>
            <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">Everything you need to know about the journey.</p>
          </div>
          <InlineFAQ />
        </div>
      </section>

      {/* Bottom CTA / Contact Section */}
      <section className="py-24 px-5 bg-[#c6ff34] border-b-2 border-[#050521] text-[#050521]">
        <div className="max-w-[1200px] mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            Ready to Become <br />An AI Builder?
          </h2>
          <p className="font-mono text-sm md:text-base font-black uppercase tracking-widest max-w-md mx-auto">
            Future Won't Wait. Why Should You?
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none mx-auto">
            <Link to="/aptitude" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-[#050521] text-[#c6ff34] hover:bg-white hover:text-[#050521] font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[6px_6px_0px_0px_#050521] hover:scale-105 active:translate-y-1 duration-200">
                Take Aptitude Test
              </button>
            </Link>
            <Link to="/programs" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 border-2 border-[#050521] text-[#050521] hover:bg-[#050521] hover:text-[#c6ff34] font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[6px_6px_0px_0px_rgba(5,5,33,0.15)] sm:shadow-none hover:shadow-[6px_6px_0px_0px_#050521] hover:scale-105 active:translate-y-1 duration-200">
                Explore Our Course
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}