import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function OnlineAiCourse() {
  const [openFAQs, setOpenFAQs] = useState({ 0: true });

  const toggleFAQ = (idx) => {
    setOpenFAQs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const onlineAdvantages = [
    {
      title: "Live sessions, not recordings",
      desc: "Classes run on a fixed schedule (3 sessions/week, 2 hours each) with real-time instructor interaction — not a self-paced video queue."
    },
    {
      title: "Direct access to instructors and industry mentors",
      desc: "Every month includes a session led by a working industry professional, with the ability to ask questions live."
    },
    {
      title: "Cohort-based, not solo",
      desc: "You move through the curriculum with the same group for six months, not alone with a login."
    },
    {
      title: "Hands-on project work",
      desc: "Not just conceptual video lectures — the same capstone-driven structure as the in-person programme with cloud lab support."
    }
  ];

  const syllabus = [
    { month: "Month 1", title: "Programming Foundation (Python)", desc: "Core syntax, data structures, functions & recursion with live coding." },
    { month: "Month 2", title: "Math, Data & Visualisation", desc: "Statistics, NumPy, Pandas, data cleaning & feature engineering." },
    { month: "Month 3", title: "Machine Learning", desc: "Regression, classification, decision trees, SVM, clustering, model evaluation." },
    { month: "Month 4", title: "Deep Learning & NLP", desc: "Neural networks, CNNs, RNNs, hands-on TensorFlow/Keras/PyTorch." },
    { month: "Month 5", title: "Generative AI & LLMs", desc: "Transformers, LLMs, fine-tuning (LoRA, QLoRA, PEFT)." },
    { month: "Month 6", title: "MLOps, Capstone & Advanced Topics", desc: "RAG, agentic AI, Docker, FastAPI, capstone project." }
  ];

  const faqs = [
    {
      q: "Are the online classes live or pre-recorded?",
      a: "All core sessions are delivered live with instructors in real-time, allowing instant doubt clearance and interactive coding."
    },
    {
      q: "Can I access class recordings if I miss a live session?",
      a: "Yes, all live sessions are recorded and made available inside your student portal for revision and makeup study."
    },
    {
      q: "What's the difference between this and DeepStaq's in-person course?",
      a: "Both follow the exact same comprehensive 160-hour curriculum and capstone requirements. The online format is delivered via live virtual classrooms with cloud labs."
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-sans pb-24 selection:bg-sky-500/30 selection:text-white relative overflow-hidden">
      {/* AMBIENT GLOWS */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c6ff34]/10 rounded-full blur-[150px] pointer-events-none -z-0" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[300px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-0" />

      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-12 border-b border-white/10 overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-6 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#c6ff34] text-[#090D11] text-xs font-black px-3.5 py-1.5 rounded-lg uppercase tracking-wider font-mono shadow-[0_0_20px_rgba(198,255,52,0.35)]">
              Live Interactive Online Cohort
            </span>
            <span className="bg-white/5 text-slate-300 text-xs font-mono font-bold px-3 py-1 rounded-md border border-white/10 uppercase">
              Real-Time Remote
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08] max-w-5xl">
            AI / ML & Generative AI — 6-Month Professional Diploma Programme <span className="text-white">(Online)</span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-4xl leading-relaxed font-sans font-medium">
            Most "online AI courses" are really just a video library you watch alone. DeepStaq's programme is built differently — live, instructor-led sessions where you can ask questions in real time, not a pre-recorded playlist you fall behind on.
          </p>

          <p className="text-slate-400 font-mono text-sm md:text-base max-w-3xl leading-relaxed">
            No prior coding experience required. Live interactive sessions, hands-on coding labs, and direct mentor support from anywhere.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/admission"
              className="bg-[#c6ff34] hover:bg-[#b5f024] text-[#090D11] font-black uppercase text-sm md:text-base px-8 py-4 rounded-2xl shadow-[0_0_25px_rgba(198,255,52,0.4)] hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>Enroll Now</span>
              <span>→</span>
            </Link>

            <a
              href="tel:+919495957011"
              className="bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs md:text-sm px-6 py-4 rounded-2xl border border-white/15 hover:border-white/30 transition-all"
            >
              Talk to Us: +91 949 595 7011
            </a>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 space-y-16 relative z-10">
        
        {/* WHY THIS ISN'T A TYPICAL ONLINE COURSE */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">Remote Excellence</div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Why This Isn't a Typical Online Course
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onlineAdvantages.map((adv, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl shadow-xl space-y-2 hover:border-[#c6ff34]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#c6ff34]/15 text-white font-mono text-xs font-black flex items-center justify-center border border-[#c6ff34]/30">✓</span>
                  <h3 className="text-base font-black uppercase text-white">{adv.title}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed pl-10 font-sans">{adv.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT DEEPSTAQ */}
        <section className="space-y-6">
          <div className="border border-white/10 rounded-3xl p-6 md:p-10 bg-[#0D1318]/90 backdrop-blur-xl shadow-2xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c6ff34]/5 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              About DeepStaq
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              DeepStaq is an institute built for the next generation of AI practitioners, sitting at the intersection of rigorous technical education and real-world application. Our mission is to make deep AI/ML knowledge accessible, structured, and actionable through a comprehensive, hands-on curriculum — bridging the gap between theory and real-world practice.
            </p>
          </div>
        </section>

        {/* FORMAT & STRUCTURE */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">Structure</div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Course Format & Structure
            </h2>
          </div>
          <div className="overflow-x-auto border border-white/10 rounded-3xl shadow-2xl bg-[#0D1318]/90 backdrop-blur-xl">
            <table className="w-full text-left border-collapse text-xs md:text-sm font-mono">
              <thead>
                <tr className="bg-white/5 text-white uppercase tracking-wider border-b border-white/10">
                  <th className="p-4 md:p-5 w-1/3">Detail</th>
                  <th className="p-4 md:p-5">Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr className="hover:bg-white/[0.03]"><td className="p-4 md:p-5 font-bold text-white">Format</td><td className="p-4 md:p-5 text-slate-300">Live online instructor-led sessions + digital collaborative labs</td></tr>
                <tr className="hover:bg-white/[0.03]"><td className="p-4 md:p-5 font-bold text-white">Duration</td><td className="p-4 md:p-5 text-slate-300">6 months core curriculum + ~2 weeks capstone</td></tr>
                <tr className="hover:bg-white/[0.03]"><td className="p-4 md:p-5 font-bold text-white">Schedule</td><td className="p-4 md:p-5 text-slate-300">3 sessions/week, 2 hours/session (6 hrs/week)</td></tr>
                <tr className="hover:bg-white/[0.03]"><td className="p-4 md:p-5 font-bold text-white">Total Instruction Time</td><td className="p-4 md:p-5 text-slate-300">~160 hours</td></tr>
                <tr className="hover:bg-white/[0.03]"><td className="p-4 md:p-5 font-bold text-white">Prerequisites</td><td className="p-4 md:p-5 text-slate-300">None — beginner-friendly</td></tr>
                <tr className="hover:bg-white/[0.03]"><td className="p-4 md:p-5 font-bold text-white">Final Assessment</td><td className="p-4 md:p-5 text-slate-300">60% Capstone Project + 40% Theory</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CURRICULUM MONTH BY MONTH */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">Roadmap</div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              The Curriculum, Month by Month
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {syllabus.map((m, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl space-y-2 hover:border-[#c6ff34]/40 transition-colors">
                <span className="text-[11px] font-mono font-black text-white bg-[#c6ff34]/10 px-2.5 py-1 rounded border border-[#c6ff34]/30 inline-block">
                  {m.month}
                </span>
                <h4 className="text-sm font-black uppercase text-white">{m.title}</h4>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQS */}
        <section className="space-y-6 pt-6 border-t border-white/10">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">Got Questions?</div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-white/10 rounded-2xl overflow-hidden bg-[#0D1318]/90 backdrop-blur-xl">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-5 font-black uppercase tracking-tight text-sm md:text-base flex justify-between items-center gap-4 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                >
                  <span className="text-white">{faq.q}</span>
                  <span className="w-7 h-7 rounded-full bg-[#c6ff34]/15 text-white border border-[#c6ff34]/30 flex items-center justify-center font-mono text-xs flex-shrink-0">
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
                      className="p-5 text-xs md:text-sm font-sans text-slate-300 border-t border-white/10 bg-white/[0.01] leading-relaxed"
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
          <div className="bg-[#0D1318] text-white rounded-3xl p-8 md:p-12 border border-white/10 shadow-[0_0_50px_rgba(198,255,52,0.15)] space-y-6 text-center md:text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#c6ff34]/10 rounded-full blur-3xl pointer-events-none" />
            <span className="bg-[#c6ff34] text-[#090D11] text-xs font-black px-3.5 py-1.5 rounded-md uppercase font-mono tracking-wider inline-block shadow-[0_0_15px_rgba(198,255,52,0.35)]">
              Online Cohort Enrollment Open
            </span>
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white max-w-3xl">
              Future Won't Wait. Why Should You?
            </h3>
            <p className="text-slate-300 font-sans text-sm md:text-base max-w-2xl leading-relaxed">
              Gain industry-ready AI/ML skills from the comfort of your home with live mentor guidance.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link
                to="/admission"
                className="w-full sm:w-auto bg-[#c6ff34] hover:bg-[#b5f024] text-[#090D11] font-black uppercase text-sm md:text-base px-8 py-4 rounded-xl shadow-[0_0_25px_rgba(198,255,52,0.4)] hover:scale-[1.02] transition-all text-center"
              >
                Enroll in DeepStaq's Online AI Course →
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
