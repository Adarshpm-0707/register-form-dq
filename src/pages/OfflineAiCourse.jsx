import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function OfflineAiCourse() {
  const [openFAQs, setOpenFAQs] = useState({ 0: true });

  const toggleFAQ = (idx) => {
    setOpenFAQs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const offlineAdvantages = [
    {
      title: "Real-time doubt clearing",
      desc: "When your code breaks or a concept doesn't click, an instructor is right there — not a comment thread you're hoping someone answers."
    },
    {
      title: "A cohort, not a subscriber count",
      desc: "You're learning alongside the same group of people for six months — the kind of peer environment that turns into a professional network, not just classmates you never speak to again."
    },
    {
      title: "Structured accountability",
      desc: "Fixed class timings (3 sessions/week) build a real learning habit — the single biggest reason self-paced online learners drop off is the absence of exactly this structure."
    },
    {
      title: "Hands-on guidance on real infrastructure",
      desc: "Deep learning, fine-tuning, and GPU-based training go a lot smoother with someone physically walking you through your first setup, rather than debugging alone from a forum thread."
    },
    {
      title: "Direct access to industry mentors",
      desc: "Every month includes a session led by a working industry professional in that month's subject area — in the room, answering questions live."
    }
  ];

  const syllabus = [
    { month: "Month 1", title: "Programming Foundation (Python)", desc: "Core syntax, data structures, functions & recursion, capped with a Python project." },
    { month: "Month 2", title: "Math, Data & Visualisation", desc: "Statistics, NumPy, Pandas, data cleaning & feature engineering." },
    { month: "Month 3", title: "Machine Learning", desc: "Regression, classification, decision trees, SVM, clustering, model evaluation." },
    { month: "Month 4", title: "Deep Learning & NLP", desc: "Neural networks, CNNs, RNNs, hands-on TensorFlow/Keras/PyTorch." },
    { month: "Month 5", title: "Generative AI & LLMs", desc: "Transformers, LLMs, fine-tuning (LoRA, QLoRA, PEFT)." },
    { month: "Month 6", title: "MLOps, Capstone & Advanced Topics", desc: "RAG, agentic AI, Docker, FastAPI, and your capstone project." }
  ];

  const faqs = [
    {
      q: "Is this course fully offline, or is there any online component?",
      a: "The core programme is delivered in-person through classroom-based instructor-led sessions, 3 times a week."
    },
    {
      q: "Where is the DeepStaq campus located?",
      a: "DeepStaq campus is located in Kerala (Kannur) — contact admissions at +91 949 595 7011 for exact campus directions and orientation schedules."
    },
    {
      q: "Do I need to attend every session in person?",
      a: "Yes — the in-person format is central to how the programme works, from real-time doubt-clearing to hands-on infrastructure guidance and the cohort-based learning environment."
    },
    {
      q: "Is offline learning better than online for beginners?",
      a: "For many beginners, yes — in-person structure, fixed timings, and immediate access to instructors address the biggest reasons self-paced online learners tend to stall out. That said, it comes down to your own learning style and schedule."
    },
    {
      q: "What's the difference between this and DeepStaq's general AI course page?",
      a: "Same programme and curriculum — this page focuses specifically on the in-person, classroom-based learning experience. See the full AI course page for the complete syllabus and career details."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#050521] font-sans pb-24 selection:bg-[#c6ff34] selection:text-[#050521]">
      
      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-12 bg-gradient-to-b from-slate-50 to-white border-b-2 border-[#050521] overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-6 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#c6ff34] text-[#050521] text-xs font-black px-3.5 py-1.5 rounded-lg border-2 border-[#050521] uppercase tracking-wider font-mono shadow-[3px_3px_0px_0px_#050521]">
              In-Person Classroom Cohort
            </span>
            <span className="bg-[#050521] text-[#c6ff34] text-xs font-mono font-bold px-3 py-1.5 rounded-lg">
              📍 Campus Location — Kerala
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#050521] leading-[1.08] max-w-5xl">
            AI / ML & Generative AI — 6-Month Professional Diploma Programme, In-Person
          </h1>

          <p className="text-slate-700 text-base md:text-lg max-w-4xl leading-relaxed font-sans font-medium">
            Free YouTube tutorials and self-paced online courses have a real problem: nobody's in the room when you get stuck. DeepStaq's AI course is built the other way — in-person, classroom-based, with instructors and industry mentors physically present, and a room full of peers hitting the same bugs and building alongside you.
          </p>

          <p className="text-slate-600 font-mono text-sm md:text-base max-w-3xl leading-relaxed">
            If you've tried learning AI online and stalled out somewhere around "why doesn't my model converge," this is the format built to actually get you unstuck.
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
        
        {/* WHY LEARN OFFLINE */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
            Why Learn AI Offline, In-Person
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offlineAdvantages.map((adv, idx) => (
              <div key={idx} className="p-6 rounded-2xl border-2 border-[#050521] bg-white shadow-[4px_4px_0px_0px_#050521] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#c6ff34] text-[#050521] font-mono text-xs font-black flex items-center justify-center border border-[#050521]">✓</span>
                  <h3 className="text-base font-black uppercase text-[#050521]">{adv.title}</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed pl-8 font-mono">{adv.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT DEEPSTAQ */}
        <section className="space-y-6">
          <div className="border-2 border-[#050521] rounded-3xl p-6 md:p-10 bg-slate-50 shadow-[6px_6px_0px_0px_#050521] space-y-4">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
              About DeepStaq
            </h2>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              DeepStaq is an institute built for the next generation of AI practitioners, sitting at the intersection of rigorous technical education and real-world application — for people who want to understand how artificial intelligence actually works, and how to build with it.
            </p>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              Our mission is to make deep AI/ML knowledge accessible, structured, and actionable through a comprehensive, hands-on curriculum — bridging the gap between theory and real-world practice, one in-person session at a time. We stay current because the field demands it, and we build community because the best builders don't work alone.
            </p>
          </div>
        </section>

        {/* WHAT A TYPICAL WEEK LOOKS LIKE */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
            What a Typical Week Looks Like
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
                <tr className="hover:bg-slate-50"><td className="p-4 md:p-5 font-bold bg-slate-50/50">Format</td><td className="p-4 md:p-5 text-slate-700">In-person, instructor-led classroom sessions</td></tr>
                <tr className="hover:bg-slate-50"><td className="p-4 md:p-5 font-bold bg-slate-50/50">Schedule</td><td className="p-4 md:p-5 text-slate-700">3 sessions/week, 2 hours/session</td></tr>
                <tr className="hover:bg-slate-50"><td className="p-4 md:p-5 font-bold bg-slate-50/50">Weekly Instruction</td><td className="p-4 md:p-5 text-slate-700">6 hours</td></tr>
                <tr className="hover:bg-slate-50"><td className="p-4 md:p-5 font-bold bg-slate-50/50">Total Duration</td><td className="p-4 md:p-5 text-slate-700">6 months core curriculum + ~2 weeks capstone (~160 total hours)</td></tr>
                <tr className="hover:bg-slate-50"><td className="p-4 md:p-5 font-bold bg-slate-50/50">Class Size</td><td className="p-4 md:p-5 text-slate-700">Small cohort-based learning</td></tr>
                <tr className="hover:bg-slate-50"><td className="p-4 md:p-5 font-bold bg-slate-50/50">Guest Sessions</td><td className="p-4 md:p-5 text-slate-700">Monthly, led by an industry professional in that month's focus area</td></tr>
                <tr className="hover:bg-slate-50"><td className="p-4 md:p-5 font-bold bg-slate-50/50">Prerequisites</td><td className="p-4 md:p-5 text-slate-700">None — beginner-friendly</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CURRICULUM MONTH BY MONTH */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
            The Curriculum, Month by Month
          </h2>
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

        {/* CAPSTONE */}
        <section className="space-y-6">
          <div className="border-2 border-[#050521] rounded-3xl p-6 md:p-10 bg-[#050521] text-white shadow-[8px_8px_0px_0px_#c6ff34] space-y-6">
            <span className="bg-[#c6ff34] text-[#050521] text-xs font-black px-3 py-1 rounded-md uppercase font-mono tracking-wider">
              In-Person Capstone
            </span>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
              Your In-Person Capstone Project
            </h2>
            <p className="text-slate-300 font-mono text-sm md:text-base leading-relaxed">
              The programme ends with an end-to-end capstone project — presented and reviewed in person, not just submitted through a portal. Choose from a classical ML pipeline, an NLP/deep learning model, or a domain-specific RAG application or fine-tuned LLM.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-3xl md:text-4xl font-black text-[#c6ff34] font-mono">60%</span>
                <h4 className="text-base font-bold uppercase text-white">Capstone Project</h4>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">Presented live in the classroom to mentors and industry judges.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-3xl md:text-4xl font-black text-[#c6ff34] font-mono">40%</span>
                <h4 className="text-base font-bold uppercase text-white">Theory Assessment</h4>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">Covering the full curriculum from programming foundations through Generative AI and MLOps.</p>
              </div>
            </div>
          </div>
        </section>

        {/* WHO OFFLINE IS BEST FOR */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#050521]">
            Who Offline Learning Is Best For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#050521] text-[#c6ff34] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">1</span>
              <p className="text-xs md:text-sm font-mono text-slate-700 leading-relaxed">People who've tried self-paced online courses before and didn't finish them</p>
            </div>
            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#050521] text-[#c6ff34] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">2</span>
              <p className="text-xs md:text-sm font-mono text-slate-700 leading-relaxed">Beginners who want structure and accountability, not an open-ended playlist</p>
            </div>
            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#050521] text-[#c6ff34] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">3</span>
              <p className="text-xs md:text-sm font-mono text-slate-700 leading-relaxed">Anyone who learns faster by asking questions out loud than by pausing a video</p>
            </div>
            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#050521] text-[#c6ff34] font-mono text-xs font-black flex items-center justify-center flex-shrink-0">4</span>
              <p className="text-xs md:text-sm font-mono text-slate-700 leading-relaxed">Career switchers who want a genuine cohort and local professional network, not just a login</p>
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

        {/* CTA */}
        <section className="pt-8">
          <div className="bg-[#050521] text-white rounded-3xl p-8 md:p-12 border-2 border-[#050521] shadow-[8px_8px_0px_0px_#c6ff34] space-y-6 text-center md:text-left">
            <span className="bg-[#c6ff34] text-[#050521] text-xs font-black px-3.5 py-1.5 rounded-md uppercase font-mono tracking-wider inline-block">
              In-Person Batch
            </span>
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white max-w-3xl">
              Future Won't Wait. Why Should You?
            </h3>
            <p className="text-slate-300 font-mono text-sm md:text-base max-w-2xl leading-relaxed">
              Some things are genuinely better learned in a room with other people — AI is one of them.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link
                to="/admission"
                className="w-full sm:w-auto bg-[#c6ff34] hover:bg-[#b5f024] text-[#050521] font-black uppercase text-sm md:text-base px-8 py-4 rounded-xl border-2 border-[#050521] shadow-[4px_4px_0px_0px_white] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center"
              >
                Enroll in DeepStaq's Offline AI Course →
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
              <span>📍 Kerala Campus</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
