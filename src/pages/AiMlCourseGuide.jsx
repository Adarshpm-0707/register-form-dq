import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AiMlCourseGuide() {
  const [openFAQs, setOpenFAQs] = useState({ 0: true });

  const toggleFAQ = (idx) => {
    setOpenFAQs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const faqs = [
    {
      q: "1. Do I need a coding background to join an AI & ML course?",
      a: "No. Most beginner-friendly programmes, including Deepstaq's, start with a Python foundation module, so you can join with zero prior coding experience."
    },
    {
      q: "2. How long does it take to become job-ready in AI/ML?",
      a: "A structured, hands-on diploma typically takes 4–8 months to take you from fundamentals to a portfolio-ready capstone project. Short certifications (a few weeks) are useful for awareness but rarely enough for a job switch on their own."
    },
    {
      q: "3. Is AI & ML only for engineering graduates?",
      a: "No. AI/ML courses today are built for a mixed audience — students, working professionals, and career switchers from business, marketing, or other non-technical backgrounds can all learn it."
    },
    {
      q: "4. What's the difference between AI, ML, and Generative AI?",
      a: "AI is the broad goal of building intelligent machines. ML is a method within AI that learns patterns from data. Generative AI is a further subset of ML/deep learning focused on generating new content — text, images, code — using models like LLMs."
    },
    {
      q: "5. What salary can I expect after an AI/ML course?",
      a: "In India, entry-to-mid-level AI/ML professionals typically earn in the ₹3,00,000–₹10,00,000+ per annum range, depending on role, city, and specialisation — with generative AI and MLOps skills commanding a premium."
    },
    {
      q: "6. Is a capstone project necessary?",
      a: "Yes — it's often the most important part of the course. A completed, original AI/ML build (not just a certificate) is what recruiters and clients actually look at when evaluating your practical skill."
    },
    {
      q: "7. Online, offline, or hybrid — what does Deepstaq offer?",
      a: "Deepstaq runs a structured, session-based format (3 sessions/week) combining instructor-led teaching with monthly industry-expert sessions and hands-on project work — check directly with Deepstaq for the current delivery mode (online, offline, or hybrid) in your city."
    },
    {
      q: "8. What jobs can I get after completing an AI/ML diploma?",
      a: "Common roles include Machine Learning Engineer, Data Scientist/Analyst, AI/ML Engineer, Generative AI Engineer, NLP Engineer, MLOps Engineer, and Applied AI/Product roles — with freelancing and consulting as additional paths."
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-sans pb-24 selection:bg-sky-500/30 selection:text-white relative overflow-hidden">
      {/* AMBIENT GLOWS */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c6ff34]/10 rounded-full blur-[150px] pointer-events-none -z-0" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none -z-0" />

      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-12 border-b border-white/10 overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-6 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#c6ff34] text-[#090D11] text-xs font-black px-3.5 py-1.5 rounded-lg uppercase tracking-wider font-mono shadow-[0_0_20px_rgba(198,255,52,0.35)]">
              2026 Complete Guide
            </span>
            <span className="bg-white/5 text-slate-300 text-xs font-mono font-bold px-3 py-1 rounded-md border border-white/10 uppercase">
              Pillar Resource
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08] max-w-5xl">
            AI & ML Course Guide: <span className="text-white">Everything You Need to Know</span> Before You Enrol
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-4xl leading-relaxed font-sans font-medium">
            Artificial Intelligence and Machine Learning are no longer "future skills" — they're the skills employers are hiring for right now. If you're searching for the right AI & ML course, this guide walks you through everything: what AI/ML actually is, who should learn it, eligibility, duration, fees, the skills you'll gain, career paths, and how Deepstaq's 6-month "From Zero to AI Builder" programme compares to other options.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/admission"
              className="bg-[#c6ff34] hover:bg-[#b5f024] text-[#090D11] font-black uppercase text-sm md:text-base px-8 py-4 rounded-2xl shadow-[0_0_25px_rgba(198,255,52,0.4)] hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>Apply for DeepStaq AI Diploma</span>
              <span>→</span>
            </Link>

            <a
              href="tel:+919495957011"
              className="bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs md:text-sm px-6 py-4 rounded-2xl border border-white/15 hover:border-white/30 transition-all"
            >
              +91 949 595 7011
            </a>
          </div>
        </div>
      </section>

      {/* MAIN GUIDE CONTENT */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-12 space-y-16 relative z-10">
        
        {/* SECTION 1: WHAT IS AI & ML */}
        <section className="space-y-4">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">01 / Fundamentals</div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              What is AI & ML?
            </h2>
          </div>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Artificial Intelligence (AI) is the science of building machines and software that can perform tasks that normally require human intelligence — understanding language, recognising images, making decisions, or generating new content.
          </p>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Machine Learning (ML) is a subset of AI. Instead of programming a computer with fixed rules, ML trains algorithms on data so they can identify patterns and make predictions on their own — like how Netflix recommends shows or how a bank flags fraudulent transactions.
          </p>
          <div className="p-6 rounded-2xl bg-[#0D1318]/90 border border-white/10 backdrop-blur-xl space-y-3 font-mono text-xs md:text-sm shadow-xl">
            <h4 className="font-bold text-white">Within AI/ML today, three areas matter most to job-seekers:</h4>
            <p className="text-slate-300">• <strong className="text-white">Deep Learning</strong> — neural networks that power image recognition, speech, and recommendation systems.</p>
            <p className="text-slate-300">• <strong className="text-white">NLP (Natural Language Processing)</strong> — how machines understand and generate human language (chatbots, translation, sentiment analysis).</p>
            <p className="text-slate-300">• <strong className="text-white">Generative AI (GenAI)</strong> — the technology behind tools like ChatGPT and Claude, including large language models (LLMs), fine-tuning, and AI agents that can take actions on their own.</p>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            A good AI & ML course today should cover the full stack — from Python and statistics, to classical ML, to deep learning, all the way to GenAI and MLOps (deploying models in the real world).
          </p>
        </section>

        {/* SECTION 2: WHO SHOULD LEARN */}
        <section className="space-y-4 pt-6 border-t border-white/10">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">02 / Target Audience</div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Who Should Learn AI & ML?
            </h2>
          </div>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            AI/ML is one of the few tech fields genuinely open to a mixed audience. You should consider a course if you are:
          </p>
          <ul className="space-y-2.5 font-sans text-xs md:text-sm text-slate-300">
            <li className="flex items-start gap-2"><span className="text-white font-mono">→</span> A student or fresh graduate (engineering, science, commerce, or any stream) wanting a head start into a high-demand tech career.</li>
            <li className="flex items-start gap-2"><span className="text-white font-mono">→</span> A working professional in software, data, or analytics looking to upskill and move into ML/AI roles.</li>
            <li className="flex items-start gap-2"><span className="text-white font-mono">→</span> A career switcher from a non-tech background — business, marketing, finance, education — who wants to pivot into tech without starting a full degree over again.</li>
            <li className="flex items-start gap-2"><span className="text-white font-mono">→</span> An entrepreneur or freelancer who wants to build AI-powered products, chatbots, or automation tools for clients or your own business.</li>
            <li className="flex items-start gap-2"><span className="text-white font-mono">→</span> A business owner or marketer who wants to understand AI well enough to apply it — automating workflows, building simple tools, or making informed decisions about AI adoption.</li>
          </ul>
          <p className="text-slate-400 text-sm leading-relaxed">
            You don't need a computer science degree or prior coding experience — most well-designed programmes (including Deepstaq's) start from Python fundamentals and build up from there.
          </p>
        </section>

        {/* SECTION 3: ELIGIBILITY */}
        <section className="space-y-4 pt-6 border-t border-white/10">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">03 / Requirements</div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              AI & ML Course Eligibility
            </h2>
          </div>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Eligibility is intentionally kept broad for most industry-oriented AI/ML diplomas, unlike a university B.Tech/M.Tech. Typical requirements are:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs md:text-sm">
            <div className="p-4 rounded-xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl">
              <strong className="text-white">Educational background:</strong> <span className="text-slate-300">12th pass or a bachelor's degree in any discipline (engineering, science, commerce, arts) — no AI/CS degree required.</span>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl">
              <strong className="text-white">Prior coding experience:</strong> <span className="text-slate-300">Not mandatory for beginner-friendly programmes; helpful but not required if the course starts with a Python foundation module.</span>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl">
              <strong className="text-white">Math comfort:</strong> <span className="text-slate-300">Basic comfort with numbers and logical thinking helps — concepts are taught from scratch.</span>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl">
              <strong className="text-white">Devices:</strong> <span className="text-slate-300">A laptop capable of running Python/Jupyter notebooks (coursework runs seamlessly on cloud tools like Google Colab).</span>
            </div>
          </div>
        </section>

        {/* SECTION 4: DURATION */}
        <section className="space-y-4 pt-6 border-t border-white/10">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">04 / Timeline</div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              AI & ML Course Duration
            </h2>
          </div>
          <div className="overflow-x-auto border border-white/10 rounded-2xl shadow-2xl bg-[#0D1318]/90 backdrop-blur-xl">
            <table className="w-full text-left border-collapse text-xs md:text-sm font-mono">
              <thead>
                <tr className="bg-white/5 text-white uppercase tracking-wider border-b border-white/10">
                  <th className="p-4">Course Type</th>
                  <th className="p-4">Typical Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr className="hover:bg-white/[0.03]"><td className="p-4 font-bold text-slate-300">Short certification (Coursera, Udemy-style)</td><td className="p-4 text-slate-400">4–12 weeks</td></tr>
                <tr className="hover:bg-white/[0.03]"><td className="p-4 font-bold text-white">Industry diploma / bootcamp (like Deepstaq)</td><td className="p-4 text-white font-bold">4–8 months</td></tr>
                <tr className="hover:bg-white/[0.03]"><td className="p-4 font-bold text-slate-300">PG Diploma / Executive programme</td><td className="p-4 text-slate-400">6–12 months</td></tr>
                <tr className="hover:bg-white/[0.03]"><td className="p-4 font-bold text-slate-300">Full-time degree (B.Tech/M.Tech/MSc in AI)</td><td className="p-4 text-slate-400">2–4 years</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-slate-400 font-mono text-xs md:text-sm leading-relaxed">
            Deepstaq's programme runs 6 months of core curriculum, plus ~2 additional weeks for the capstone project — around 160 hours of live instruction total, delivered as 3 sessions a week, 2 hours per session.
          </p>
        </section>

        {/* SECTION 5: FEES */}
        <section className="space-y-4 pt-6 border-t border-white/10">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">05 / Investment</div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              AI & ML Course Fees
            </h2>
          </div>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Fees for AI/ML courses in India vary widely based on format and depth:
          </p>
          <ul className="space-y-2 font-mono text-xs md:text-sm text-slate-300">
            <li>• <strong className="text-white">Short online certifications:</strong> ₹1,000 – ₹40,000</li>
            <li>• <strong className="text-white">Industry diploma / bootcamp programmes (6 months, instructor-led):</strong> roughly ₹35,000 – ₹1,50,000</li>
            <li>• <strong className="text-white">PG-level executive certificates (IIT/IIM-affiliated):</strong> ₹1,00,000 – ₹3,00,000+</li>
            <li>• <strong className="text-white">Full degree programmes (B.Tech/M.Tech/MSc):</strong> ₹2,00,000 – ₹10,00,000+</li>
          </ul>
          <div className="p-5 rounded-2xl bg-[#0D1318]/90 border border-white/10 text-xs md:text-sm font-mono text-slate-300 backdrop-blur-xl">
            For Deepstaq's exact current fee structure and any active scholarship offers, contact <strong className="text-white">+91 949 595 7011</strong> or <strong className="text-white">deepstackbyaleef@gmail.com</strong>.
          </div>
        </section>

        {/* SECTION 6: SKILLS LEARNED */}
        <section className="space-y-4 pt-6 border-t border-white/10">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">06 / Curriculum</div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Skills You'll Learn
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs md:text-sm">
            <div className="p-4 rounded-xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl">
              <strong className="text-white">1. Programming Foundations (Python):</strong> <span className="text-slate-300">syntax, data structures, functions, recursion, asyncio.</span>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl">
              <strong className="text-white">2. Math, Data & Visualisation:</strong> <span className="text-slate-300">probability & statistics, NumPy, Pandas, Matplotlib/Seaborn, data cleaning, feature engineering.</span>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl">
              <strong className="text-white">3. Machine Learning:</strong> <span className="text-slate-300">regression, classification, decision trees, random forests, KNN, SVM, gradient boosting, clustering, PCA, model evaluation.</span>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl">
              <strong className="text-white">4. Deep Learning & NLP:</strong> <span className="text-slate-300">neural network fundamentals, CNNs, RNNs, LSTMs/GRUs, using TensorFlow/Keras/PyTorch.</span>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl">
              <strong className="text-white">5. Generative AI & LLMs:</strong> <span className="text-slate-300">embeddings, transformers & attention, BERT/GPT family, fine-tuning (LoRA, QLoRA, PEFT).</span>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-[#0D1318]/90 backdrop-blur-xl">
              <strong className="text-white">6. MLOps & Advanced Topics:</strong> <span className="text-slate-300">vector databases, RAG, agentic AI & tool calling, Docker, FastAPI, CI/CD.</span>
            </div>
          </div>
        </section>

        {/* SECTION 7: ONLINE VS OFFLINE */}
        <section className="space-y-4 pt-6 border-t border-white/10">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">07 / Modality</div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Online vs Offline AI & ML Courses: Which Should You Choose?
            </h2>
          </div>
          <div className="overflow-x-auto border border-white/10 rounded-2xl shadow-2xl bg-[#0D1318]/90 backdrop-blur-xl">
            <table className="w-full text-left border-collapse text-xs md:text-sm font-mono">
              <thead>
                <tr className="bg-white/5 text-white uppercase tracking-wider border-b border-white/10">
                  <th className="p-4">Factor</th>
                  <th className="p-4">Online</th>
                  <th className="p-4">Offline / In-Person</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr className="hover:bg-white/[0.03]"><td className="p-4 font-bold text-white">Flexibility</td><td className="p-4 text-slate-300">High — learn at your own pace</td><td className="p-4 text-slate-300">Fixed timings, structured routine</td></tr>
                <tr className="hover:bg-white/[0.03]"><td className="p-4 font-bold text-white">Networking</td><td className="p-4 text-slate-300">Community/Slack/Discord</td><td className="p-4 text-slate-300">Direct peer & mentor interaction</td></tr>
                <tr className="hover:bg-white/[0.03]"><td className="p-4 font-bold text-white">Doubt-clearing</td><td className="p-4 text-slate-300">Async or scheduled calls</td><td className="p-4 text-slate-300">Immediate, in-person support</td></tr>
                <tr className="hover:bg-white/[0.03]"><td className="p-4 font-bold text-white">Discipline required</td><td className="p-4 text-slate-300">High (self-driven)</td><td className="p-4 text-slate-300">Lower (structured accountability)</td></tr>
                <tr className="hover:bg-white/[0.03]"><td className="p-4 font-bold text-white">Lab / GPU access</td><td className="p-4 text-slate-300">Cloud tools provided</td><td className="p-4 text-slate-300">Direct hardware guidance</td></tr>
                <tr className="hover:bg-white/[0.03]"><td className="p-4 font-bold text-white">Best for</td><td className="p-4 text-slate-300">Working professionals</td><td className="p-4 text-slate-300">Students, career switchers</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 8: DEEPSTAQ'S PROGRAMME SUMMARY */}
        <section className="space-y-4 pt-6 border-t border-white/10">
          <div className="border border-white/10 rounded-3xl p-6 md:p-10 bg-[#0D1318]/90 backdrop-blur-xl shadow-2xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#c6ff34]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">08 / DeepStaq Standard</div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                Deepstaq's Programme: From Zero to AI Builder in Six Months
              </h2>
            </div>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Deepstaq is an institute built for the next generation of AI practitioners, positioned at the intersection of rigorous technical education and real-world application. The programme is designed for a mixed audience — no prior experience required, whether you come from engineering, business, education, or any other background.
            </p>
            <div className="space-y-2 font-mono text-xs md:text-sm text-slate-300">
              <p>• <strong className="text-white">Duration:</strong> 6 months core curriculum + ~2 weeks capstone (~160 hours total)</p>
              <p>• <strong className="text-white">Format:</strong> 3 sessions/week, 2 hours/session with monthly industry expert sessions</p>
              <p>• <strong className="text-white">Capstone project:</strong> Original end-to-end AI/ML build evaluated 60% capstone + 40% theory</p>
              <p>• <strong className="text-white">Tools:</strong> Python, OpenAI APIs, FastAPI, Claude, Docker, ChatGPT, Google Gemini, Cursor, Google Colab, Google Antigravity</p>
            </div>
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
              Start Your AI Journey
            </span>
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white max-w-3xl">
              Ready to Start Your AI & ML Journey?
            </h3>
            <p className="text-slate-300 font-sans text-sm md:text-base max-w-2xl leading-relaxed">
              Contact our admissions team today to get the latest syllabus, schedule a campus visit, or discuss installment plans.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link
                to="/admission"
                className="w-full sm:w-auto bg-[#c6ff34] hover:bg-[#b5f024] text-[#090D11] font-black uppercase text-sm md:text-base px-8 py-4 rounded-xl shadow-[0_0_25px_rgba(198,255,52,0.4)] hover:scale-[1.02] transition-all text-center"
              >
                Apply for DeepStaq AI Diploma →
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
