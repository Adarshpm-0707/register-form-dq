import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import Background3D from "../components/Background3D";
import WaterBubbles from "../components/WaterBubbles";
import HeroVRSection from "../components/HeroVRSection";

// ScrollStack and career image imports
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";
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
   CURVED ROAD MODULES (Syllabus Months 1 to 6)
───────────────────────────────────────────── */
const syllabusMonths = [
  {
    num: "01",
    title: "Programming Foundations",
    desc: "Python variables, loops, functions, data structures, and Object-Oriented Programming (OOP) essentials.",
    tag: "MONTH 1",
  },
  {
    num: "02",
    title: "Math & Data Visualization",
    desc: "NumPy, Pandas, Matplotlib, Seaborn, data cleaning, and core statistical feature engineering.",
    tag: "MONTH 2",
  },
  {
    num: "03",
    title: "Machine Learning",
    desc: "Regression, classification, Decision Trees, Random Forest, KNN, SVM, PCA, and model evaluation metrics.",
    tag: "MONTH 3",
  },
  {
    num: "04",
    title: "Deep Learning & NLP",
    desc: "Neural Networks, CNNs, RNNs, LSTMs, TensorFlow, PyTorch basics, and Natural Language Processing fundamentals.",
    tag: "MONTH 4",
  },
  {
    num: "05",
    title: "Generative AI & LLMs",
    desc: "Transformer architectures, GPT, BERT, embeddings, fine-tuning techniques (LoRA, QLoRA, PEFT).",
    tag: "MONTH 5",
  },
  {
    num: "06",
    title: "Advanced AI & MLOps",
    desc: "RAG pipelines, vector databases, Agentic AI, tool calling, Docker, FastAPI APIs, CI/CD, and model monitoring.",
    tag: "MONTH 6",
  },
];

function ModuleRoadSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 300, damping: 40 });
  const roadPath = "M 400 0 Q 400 100 200 150 T 200 350 Q 200 500 600 550 T 600 800 Q 600 950 200 1000 T 200 1250 Q 200 1400 600 1450 T 600 1700 Q 600 1850 400 1950";

  return (
    <section id="curriculum" ref={containerRef} className="relative py-20 md:py-32 px-5 overflow-hidden">
      <div className="max-w-[1200px] mx-auto relative">
        <div className="mb-20 space-y-4">
          <h2 className="text-5xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter">
            Course<br /><span className="text-stroke-dark">Syllabus.</span>
          </h2>
          <p className="text-slate-400 font-mono text-sm max-w-sm">Detailed 6-month journey from core fundamentals to advanced agentic systems.</p>
        </div>

        <div className="absolute top-[350px] left-1/2 -translate-x-1/2 w-full h-[calc(100%-400px)] pointer-events-none z-0 hidden md:block">
          <svg width="100%" height="100%" viewBox="0 0 800 2000" fill="none" preserveAspectRatio="none" className="overflow-visible">
            <path d={roadPath} stroke="#050521" strokeWidth="2" strokeDasharray="10 10" className="opacity-10" />
            <motion.path d={roadPath} stroke="#c6ff34" strokeWidth="6" strokeLinecap="round" style={{ pathLength }} />
          </svg>
        </div>

        <div className="flex flex-col gap-16 md:gap-40 relative z-10">
          {syllabusMonths.map((mod, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex w-full ${i % 2 === 0 ? "md:justify-start" : "md:justify-end"}`}
            >
              <div className="group relative bg-white border-2 border-[#050521] rounded-3xl p-6 md:p-10 w-full md:w-[46%] shadow-[8px_8px_0px_0px_#050521] transition-all hover:shadow-[12px_12px_0px_0px_#c6ff34] hover:-translate-y-1">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl md:text-7xl font-black text-[#050521]/5 group-hover:text-[#c6ff34]/20 transition-colors">{mod.num}</span>
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-[#050521] bg-[#c6ff34] px-4 py-1.5 rounded-full border-2 border-[#050521]">
                    {mod.tag}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 leading-tight">{mod.title}</h3>
                <p className="text-sm md:text-base text-slate-500 leading-relaxed font-mono">{mod.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDownloadBrochure = () => {
    const element = document.createElement("a");
    const file = new Blob([
      "Deepstaq Professional Diploma in AI/ML & Generative AI\n6-Month Intensive Programme syllabus & outcomes details."
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "Deepstaq_AI_ML_Brochure.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-white text-[#050521] overflow-x-clip font-sans">
      <Background3D />
      <WaterBubbles />

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
              <Link to="/slot" className="w-full sm:w-auto">
                <button className="w-full px-12 py-5 bg-[#050521] text-white font-black text-sm md:text-base uppercase tracking-widest rounded-xl shadow-[6px_6px_0px_0px_#c6ff34] active:translate-y-1 active:shadow-none transition-all hover:scale-105 duration-200">
                  Apply Now
                </button>
              </Link>
              <button
                onClick={handleDownloadBrochure}
                className="w-full sm:w-auto px-12 py-5 border-2 border-[#050521] text-[#050521] font-black text-sm md:text-base uppercase tracking-widest rounded-xl hover:bg-[#050521] hover:text-white transition-all hover:scale-105 duration-200"
              >
                Download Brochure
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-6 flex justify-center items-center w-full mt-6 lg:mt-0">
            <HeroVRSection />
          </div>

        </div>
      </section>

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

      {/* Curriculum scroll path */}
      <ModuleRoadSection />

      {/* Capstone Project & Evaluation section */}
      <section className="py-24 px-5 border-y-2 border-[#050521] bg-[#050521] text-white relative overflow-x-clip">
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#c6ff34]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#c6ff34]/4 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10">

          {/* ── Header row ── */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16 pb-10 border-b border-white/10">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#c6ff34] border border-[#c6ff34]/30 bg-[#c6ff34]/5 px-4 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c6ff34] animate-pulse" />
                Portfolio Building
              </span>
              <h2 className="text-5xl md:text-[clamp(3.5rem,7vw,6.5rem)] font-black uppercase tracking-tighter leading-none">
                Capstone<br />
                <span className="text-stroke-light text-transparent">Projects.</span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed max-w-xl">
                Students ship a production-ready AI application under direct industry mentorship — graduating with a verified portfolio that proves real engineering competence.
              </p>
            </div>
            {/* Evaluation Summary Pill */}
            <div className="flex gap-6 flex-wrap">
              {[{ label: "Capstone Project", pct: "60%", active: true }, { label: "Theory Exam", pct: "40%", active: false }].map((item, i) => (
                <div key={i} className={`flex flex-col items-center justify-center border-2 rounded-2xl px-8 py-6 gap-1 ${item.active ? "border-[#c6ff34] bg-[#c6ff34]/5" : "border-white/10 bg-white/3"}`}>
                  <span className={`text-5xl font-black leading-none ${item.active ? "text-[#c6ff34]" : "text-white/40"}`}>{item.pct}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bento grid of project tracks ── */}
          <CapstoneGrid />

          {/* ── Evaluation detail bar ── */}
          <div className="border border-white/10 rounded-2xl p-6 md:p-8 bg-white/3 grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-[9px] font-black uppercase tracking-widest border px-2 py-0.5 rounded ${crit.badgeColor}`}>{crit.badge}</span>
                    <h4 className="text-sm font-black uppercase tracking-wider text-white mt-1">{crit.title}</h4>
                  </div>
                  <span className={`text-4xl font-black leading-none ${crit.pctColor}`}>{crit.pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${crit.barColor}`} style={{ width: `${crit.pct}%` }} />
                </div>
                <p className="text-[11px] text-slate-400 font-mono leading-relaxed">{crit.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Windows of Opportunity */}
      <section className="py-24 px-5 border-b-2 border-[#050521] bg-slate-50/30">
        <div className="max-w-[1200px] mx-auto space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              Windows of<br /><span className="text-stroke-dark">Opportunity.</span>
            </h2>
            <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Crack Global Markets, Remote Roles, and Freelance Consulting.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Crack Global Career", desc: "Develop job-ready AI skills tailored for international opportunities and tech markets." },
              { title: "Remote Work", desc: "Build skills highly suitable for remote AI development roles across the globe." },
              { title: "AI Entrepreneur", desc: "Create your own AI SaaS products, custom chatbots, RAG systems, and commercial AI solutions." },
              { title: "Freelancing", desc: "Offer specialized services: AI Chatbots, RAG applications, automation pipelines, prompt engineering, and data analytics." },
              { title: "AI Consulting", desc: "Help businesses implement AI workflows, automate manual operations, and improve overall office productivity." }
            ].map((opp, idx) => (
              <div key={idx} className="bg-white border-2 border-[#050521] p-6 rounded-2xl shadow-[6px_6px_0px_0px_#050521] flex flex-col justify-between group hover:shadow-[6px_6px_0px_0px_#c6ff34] transition-all">
                <div>
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest text-[#050521]/40">Track 0{idx + 1}</span>
                  <h4 className="text-lg font-black uppercase tracking-tight text-[#050521] mt-3 mb-2">{opp.title}</h4>
                  <p className="text-xs text-slate-500 font-mono leading-relaxed">{opp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-5 border-b-2 border-[#050521]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[20vh] space-y-6">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                Career<br /><span className="text-stroke-dark">Opportunities.</span>
              </h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                After completing the programme, students possess the technical portfolio required to pursue multiple roles:
              </p>
              {!isMobile && (
                <div className="pt-4 hidden lg:block">
                  <p className="text-slate-400 font-mono text-xs uppercase tracking-widest animate-pulse">
                    Scroll to explore roles ↓
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-8">
            <ScrollStack useWindowScroll={true} itemDistance={80} baseScale={0.88} itemStackDistance={25}>
              {careerRolesData.map((role, idx) => (
                <ScrollStackItem key={idx}>
                  <div className="w-full h-full bg-white border-2 border-[#050521] rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#050521] hover:shadow-[6px_6px_0px_0px_#c6ff34] transition-all flex flex-col justify-between">
                    <div className="relative h-[60%] sm:h-[65%] w-full border-b-2 border-[#050521] overflow-hidden">
                      <img 
                        src={role.img} 
                        alt={role.title} 
                        className="w-full h-full object-cover grayscale contrast-[1.1] hover:grayscale-0 transition-all duration-500"
                        loading={idx > 1 ? "lazy" : undefined}
                      />
                      <span className="absolute top-4 left-4 bg-[#c6ff34] text-[#050521] font-mono text-[9px] font-black uppercase tracking-widest px-3 py-1 border border-[#050521] rounded-full shadow-[2px_2px_0px_0px_#050521]">
                        {role.track}
                      </span>
                    </div>
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center bg-white">
                      <h4 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#050521] mb-2">{role.title}</h4>
                      <p className="text-xs text-slate-500 font-mono leading-relaxed">{role.desc}</p>
                    </div>
                  </div>
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>
        </div>
      </section>


      {/* Tools & Technologies */}
      <section className="py-24 px-5 border-b-2 border-[#050521] bg-slate-50/50">
        <div className="max-w-[1200px] mx-auto space-y-12">
          <div className="space-y-3">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              Tools &<br /><span className="text-stroke-dark">Technologies.</span>
            </h2>
            <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Hands-on training with industry-standard stacks.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {[
              {
                name: "Python",
                logo: "https://cdn.simpleicons.org/python",
              },
              {
                name: "FastAPI",
                logo: "https://cdn.simpleicons.org/fastapi",
              },
              {
                name: "Docker",
                logo: "https://cdn.simpleicons.org/docker",
              },
              {
                /* OpenAI — inline SVG so it never fails to load */
                name: "OpenAI",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-12 h-12 sm:w-14 sm:h-14" fill="#000000">
                    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.499 4.499 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.843-3.371 2.019-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.401-.679zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.41 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
                  </svg>
                ),
              },
              {
                /* ChatGPT — inline SVG (same OpenAI mark, ChatGPT brand green) */
                name: "ChatGPT",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-12 h-12 sm:w-14 sm:h-14" fill="#10a37f">
                    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.499 4.499 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.843-3.371 2.019-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.401-.679zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.41 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
                  </svg>
                ),
              },
              {
                name: "Claude",
                logo: "https://cdn.simpleicons.org/anthropic/000000",
              },
              {
                name: "Gemini",
                logo: "https://cdn.simpleicons.org/googlegemini",
              },
              {
                name: "Google Colab",
                logo: "https://cdn.simpleicons.org/googlecolab",
              },
              {
                name: "Cursor AI",
                logo: "https://cdn.simpleicons.org/cursor/000000",
              },
              {
                name: "Google AI Studio",
                logo: "https://cdn.simpleicons.org/google/4285F4",
              },
            ].map((tool, idx) => (
              <div
                key={idx}
                className="group bg-white border-2 border-[#050521] rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#050521] hover:shadow-[6px_6px_0px_0px_#c6ff34] hover:border-[#c6ff34] hover:-translate-y-1 transition-all duration-200 cursor-default"
              >
                {/* Render inline SVG icon if provided, otherwise use img */}
                {tool.icon ? (
                  tool.icon
                ) : (
                  <img
                    src={tool.logo}
                    alt={tool.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain select-none"
                    loading="lazy"
                    draggable={false}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                )}
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#050521] text-center leading-tight">
                  {tool.name}
                </span>
              </div>
            ))}
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

          <div className="pt-8">
            <Link to="/slot">
              <button className="px-12 py-5 bg-[#050521] text-white hover:bg-white hover:text-[#050521] font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[6px_6px_0px_0px_#050521] hover:scale-105 active:translate-y-1 duration-200">
                Reserve Seat Now
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}