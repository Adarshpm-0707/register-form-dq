import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import Background3D from "../components/Background3D";
import WaterBubbles from "../components/WaterBubbles";

/* ─────────────────────────────────────────────
   TICKER TAPE
───────────────────────────────────────────── */
const tickerItems = [
  "NEURAL NETWORKS", "RAG PIPELINES", "LLM FINE-TUNING",
  "VECTOR DATABASES", "PROMPT SECURITY", "PRODUCTION MODELS",
  "DEEP LEARNING", "SPRING BATCH OPEN",
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
   CURVED ROAD MODULES (SVG Bezier Path)
───────────────────────────────────────────── */
const modules = [
  { num: "01", title: "Programming Foundation", desc: "Master core programming concepts, data structures, algorithms, and modular design patterns in Python.", tag: "PYTHON" },
  { num: "02", title: "Math & Data Handling", desc: "Linear algebra, calculus, probability, NumPy, Pandas, and interactive analytics dashboards.", tag: "MATHEMATICS" },
  { num: "03", title: "Machine Learning", desc: "Supervised and unsupervised models, regression, decision trees, evaluation metrics, and Scikit-Learn.", tag: "MODELS" },
  { num: "04", title: "Deep Learning & NLP", desc: "Build neural networks with PyTorch, explore convolutional networks, sequence models, and recurrent systems.", tag: "NETWORKS" },
  { num: "05", title: "Generative AI", desc: "Work with transformers, LLMs, prompt engineering, RAG pipelines, fine-tuning, and semantic indexing.", tag: "LLMS" },
  { num: "06", title: "MLOps & Projects", desc: "Deploy pipelines, containerize with Docker, serve APIs, monitor runs, and implement CI/CD for ML models.", tag: "PRODUCTION" },
  { num: "07", title: "Agentic AI", desc: "Design autonomous AI agents, tool-use loops, task planning, multi-agent frameworks, and self-correcting logic.", tag: "AGENTS" },
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
            Seven<br /><span className="text-stroke-dark">Modules.</span>
          </h2>
          <p className="text-slate-400 font-mono text-sm max-w-sm">The curriculum follows a curved path. Scroll to travel through the syllabus.</p>
        </div>

        <div className="absolute top-[350px] left-1/2 -translate-x-1/2 w-full h-[calc(100%-400px)] pointer-events-none z-0">
          <svg width="100%" height="100%" viewBox="0 0 800 2000" fill="none" preserveAspectRatio="none" className="overflow-visible">
            <path d={roadPath} stroke="#050521" strokeWidth="2" strokeDasharray="10 10" className="opacity-10" />
            <motion.path d={roadPath} stroke="#c6ff34" strokeWidth="6" strokeLinecap="round" style={{ pathLength }} />
          </svg>
        </div>

        <div className="flex flex-col gap-16 md:gap-40 relative z-10">
          {modules.map((mod, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex w-full ${i % 2 === 0 ? "md:justify-start" : "md:justify-end"}`}
            >
              <div className="group relative bg-white border-2 border-[#050521] rounded-3xl p-6 md:p-10 w-full md:w-[46%] shadow-[8px_8px_0px_0px_#050521] transition-all hover:shadow-[12px_12px_0px_0px_#c6ff34] hover:-translate-y-1">
                <div className="flex items-start justify-between mb-6">
                  <span className="text-5xl md:text-7xl font-black text-[#050521]/5 group-hover:text-[#c6ff34]/20 transition-colors">{mod.num}</span>
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
   SUCCESS ROADMAP
───────────────────────────────────────────── */
const roadmapData = [
  { week: "PHASE 01", title: "Foundations", task: "Python Core & Advanced Math for Gradients.", color: "bg-white" },
  { week: "PHASE 02", title: "Intelligence", task: "Classical ML, Scikit-Learn & Feature Engineering.", color: "bg-white" },
  { week: "PHASE 03", title: "Deep Learning", task: "Neural Networks, Computer Vision & PyTorch.", color: "bg-white" },
  { week: "PHASE 04", title: "Deployment", task: "Agentic Systems, LLMs & MLOps at Scale.", color: "bg-[#c6ff34]" },
];

function SuccessRoadmap() {
  return (
    <section className="py-20 md:py-32 px-5 bg-slate-50 border-y-2 border-[#050521]">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12 md:mb-20">
          <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">The Career <br/><span className="text-stroke-dark">Sprint.</span></h3>
          <p className="text-slate-400 font-mono text-sm mt-4 md:mt-6 uppercase tracking-widest">Blueprint for your AI Career Transformation.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {roadmapData.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`${item.color} border-2 border-[#050521] p-6 md:p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_#050521] relative group flex flex-col h-full`}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#050521] text-[#c6ff34] flex items-center justify-center font-black mb-4 md:mb-6 group-hover:rotate-12 transition-transform shrink-0">0{i+1}</div>
              <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1 md:mb-2">{item.week}</span>
              <h4 className="text-xl md:text-2xl font-black uppercase leading-tight mb-2 md:mb-4">{item.title}</h4>
              <p className="text-xs font-mono text-slate-600 leading-relaxed grow">{item.task}</p>
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
  { q: "How long is the programme?", a: "The full diploma runs 6 months part-time. Intensive tracks can complete in 4 months." },
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
   MAIN HOME
───────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#050521] overflow-x-hidden">
      <Background3D />
      <WaterBubbles />

      <section className="relative min-h-[100svh] flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-20">
        <div className="max-w-[1400px] mx-auto w-full z-10">
          <div className="space-y-1">
            <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[18vw] sm:text-[clamp(4rem,9vw,9rem)] font-black uppercase leading-[0.82] tracking-tighter">Every</motion.h1>
            <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-[18vw] sm:text-[clamp(4rem,9vw,9rem)] text-stroke-dark-lg font-black uppercase leading-[0.82] tracking-tighter">Graduate</motion.h1>
            <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-[18vw] sm:text-[clamp(4rem,9vw,9rem)] font-black uppercase leading-[0.82] tracking-tighter">Deserves to</motion.h1>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap items-center gap-4 mt-2">
               <span className="bg-[#050521] text-[#c6ff34] px-5 py-2 rounded-2xl text-[14vw] sm:text-[clamp(4rem,9vw,9rem)] font-black uppercase leading-none">BUILD</span>
               <span className="text-[18vw] sm:text-[clamp(4rem,9vw,9rem)] font-black uppercase leading-none">AI.</span>
            </motion.div>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            <p className="text-slate-500 font-mono text-sm max-w-xs leading-relaxed">The only 100% hands-on diploma designed to turn graduates into AI engineers.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/slot" className="w-full sm:w-auto">
                <button className="w-full px-12 py-5 bg-[#050521] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-[8px_8px_0px_0px_#c6ff34] active:translate-y-1 active:shadow-none transition-all">Reserve Slot →</button>
              </Link>
              <a href="#curriculum" className="w-full sm:w-auto">
                <button className="w-full px-12 py-5 border-2 border-[#050521] text-[#050521] font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[#050521] hover:text-white transition-all">Curriculum</button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#c6ff34] border-y-2 border-[#050521]">
        <Ticker />
        <div className="py-20 px-6 sm:px-12 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8 text-center">
            {[
              { val: 97, suffix: "%", label: "Placement Rate" },
              { val: 500, suffix: "+", label: "Graduates" },
              { val: 6, suffix: " mo", label: "Expert Track" },
              { val: 40, suffix: "+", label: "Live Projects" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-5xl md:text-7xl font-black text-[#050521] leading-none mb-3 tracking-tighter"><CountUp end={s.val} suffix={s.suffix} /></div>
                <div className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#050521]/50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ModuleRoadSection />
      <SuccessRoadmap />

      <section className="py-24 md:py-40 px-6 sm:px-12 lg:px-20 border-t-2 border-[#050521]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-8">Common<br /><span className="text-stroke-dark">Queries.</span></h2>
            <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">Everything you need to know about the journey.</p>
          </div>
          <InlineFAQ />
        </div>
      </section>

      {/* ════ REDUCED BOTTOM CTA ════ */}
      <section className="bg-[#050521] py-16 md:py-20 px-6 text-center border-t-4 border-[#c6ff34]">
        <h2 className="text-5xl md:text-7xl font-black text-[#c6ff34] uppercase tracking-tighter mb-10 leading-none">
          Ready to<br />Build?
        </h2>
        <Link to="/slot">
          <button className="px-10 py-5 bg-[#c6ff34] text-[#050521] font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[8px_8px_0px_0px_rgba(198,255,52,0.3)]">
            Join the Cohort →
          </button>
        </Link>
      </section>
    </div>
  );
}