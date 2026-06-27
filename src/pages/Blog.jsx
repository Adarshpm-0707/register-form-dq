import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Background3D from "../components/Background3D";
import WaterBubbles from "../components/WaterBubbles";

// FAQ data
const faqItems = [
  {
    q: "Do I need prior coding experience to join Deepstaq's AI or Data Science courses?",
    a: "No prior coding experience is required for the Python Programming or Generative AI courses. For the AI/ML and Data Science courses, Deepstaq includes a Python fundamentals module that brings all students up to speed before advancing. Hundreds of our successful graduates started from zero programming knowledge."
  },
  {
    q: "How long does it take to get a job after completing a Deepstaq course?",
    a: "On average, Deepstaq graduates secure their first relevant job within 3–5 months of completing their programme — provided they actively apply and leverage our placement support. This timeline varies depending on the specific role, location, and how thoroughly the student built their portfolio during training."
  },
  {
    q: "Are the courses available online, offline, or both?",
    a: "Deepstaq Institute offers both classroom (in-person) training at our centres and live online training via our interactive virtual classroom platform. Online students receive the same quality of live instruction, project reviews, and career support as in-person students. Recorded sessions are also available for review."
  },
  {
    q: "What is the difference between Data Science and AI/Machine Learning?",
    a: "Data Science focuses on extracting insights from data using statistical analysis, visualisation, and machine learning. AI/Machine Learning is more focused on building intelligent systems — training models to recognise patterns and make predictions or decisions. There is significant overlap, and many professionals work across both domains. At Deepstaq, we recommend Data Science as the entry point for those from non-engineering backgrounds and AI/ML for those who want to build production models."
  },
  {
    q: "Is the Deepstaq Institute certification recognised by employers?",
    a: "Yes. Deepstaq Institute certifications are recognised by our 200+ hiring partners and are well-regarded in the Indian tech industry. We also prepare students to pursue globally recognised certifications from Google, AWS, Microsoft, and TensorFlow, which carry strong weight internationally."
  },
  {
    q: "Can working professionals take these courses while employed full-time?",
    a: "Absolutely. Approximately 40% of Deepstaq students are working professionals. We offer weekend batches (Saturday–Sunday), evening batches (7 PM–9 PM), and a self-paced track with live doubt-clearing sessions. Most working professionals complete their course in 5–8 months with 8–10 hours of study per week."
  },
  {
    q: "What kinds of projects will I build during the course?",
    a: "Projects are real-world and industry-grade. Examples include: a movie recommendation engine (collaborative filtering), customer churn prediction model (banking), AI-powered resume screener (NLP), object detection system for retail (computer vision), automated content generation pipeline (Generative AI), and data dashboards for business intelligence. Every project is designed to be portfolio-ready."
  },
  {
    q: "Does Deepstaq help with job placement and interview preparation?",
    a: "Yes, comprehensively. Our career services include: resume and LinkedIn review, mock technical interviews with industry experts, portfolio critique sessions, direct referrals to 200+ hiring partners, guidance on salary negotiation, and ongoing alumni placement support even after course completion."
  },
  {
    q: "What is Generative AI and why should I learn it now?",
    a: "Generative AI refers to AI systems that create new content — text, code, images, audio, and video. Tools like ChatGPT, DALL-E, and Sora are examples. The Generative AI job market grew 306% between 2022 and 2024, making it the fastest-growing specialisation in tech. Learning it now places you at the very beginning of a decade-long technology wave, giving you first-mover advantage in a high-paying, rapidly expanding field."
  },
  {
    q: "What is the fee structure, and are there EMI options?",
    a: "Deepstaq Institute offers competitive, transparent fee structures for each course. EMI options are available through our banking partners with zero-cost EMIs for eligible students. Scholarship programmes are also available for high-potential learners from economically disadvantaged backgrounds. Contact our admissions team for the current fee schedule."
  },
  {
    q: "Can I take multiple courses together or in sequence?",
    a: "Yes. Many students choose our bundled learning paths, such as Python → Data Science → AI/ML, or Python → Generative AI → AI/ML. Bundle pricing is available and studying related courses consecutively accelerates your overall progress because concepts compound and reinforce one another."
  },
  {
    q: "What is the salary expectation for a fresher entering AI after completing Deepstaq courses?",
    a: "A fresh graduate completing the AI/ML course at Deepstaq can realistically expect roles offering ₹6–12 LPA in India, depending on their portfolio strength, interview performance, and location. Graduates who also have internship experience, strong GitHub profiles, and cloud certifications routinely receive offers at the higher end of this range, and some join product startups with additional performance bonuses and ESOPs."
  },
  {
    q: "Is Python difficult for a complete beginner?",
    a: "Python is widely considered the most beginner-friendly programming language in the world. Its English-like syntax and forgiving structure make it significantly easier to learn than languages like Java or C++. With Deepstaq's structured, project-based curriculum, most students are building working programmes within their first week of class, regardless of prior background."
  },
  {
    q: "What is the scope of AI jobs internationally?",
    a: "The international scope is enormous. The US Bureau of Labor Statistics projects 31% growth in computer and information research scientist roles through 2030 — far exceeding average job growth. Countries like Canada, Germany, Australia, the UK, and Singapore are actively offering immigration pathways to AI professionals. With 3–5 years of experience from Deepstaq-trained roles in India, international transition is very achievable."
  },
  {
    q: "How is Deepstaq Institute different from free resources like YouTube or Coursera?",
    a: "Free resources are valuable for self-learners, but they typically lack structure, accountability, expert feedback, hands-on project guidance, and career support. At Deepstaq, you get a curated, sequenced curriculum refined through thousands of student hours; instructors who review your work and provide personalised feedback; a peer cohort for accountability and networking; and dedicated placement support. The investment pays for itself many times over through faster employment and higher starting salaries."
  }
];

// Table of Contents links
const tocLinks = [
  { id: "intro", label: "01. Introduction" },
  { id: "why-ai", label: "02. Why AI Skills Are the Future" },
  { id: "ai-ml", label: "03. AI & ML Course" },
  { id: "python", label: "04. Python Course" },
  { id: "data-science", label: "05. Data Science Course" },
  { id: "gen-ai", label: "06. Generative AI Course" },
  { id: "who-can-learn", label: "07. Who Can Learn?" },
  { id: "jobs", label: "08. Where to Find Jobs" },
  { id: "future", label: "09. Future Scope 2025-2035" },
  { id: "deepstaq", label: "10. Why Deepstaq Institute?" },
  { id: "roadmap", label: "11. Success Roadmap" },
  { id: "faq", label: "12. FAQs" }
];

export default function Blog() {
  const [openFAQs, setOpenFAQs] = useState({});

  const toggleFAQ = (index) => {
    setOpenFAQs((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#050521] overflow-x-clip font-sans relative">
      <Background3D />
      <WaterBubbles />

      {/* Hero Section */}
      <section className="relative z-10 min-h-[100svh] flex flex-col justify-center pt-28 pb-16 md:pt-40 md:pb-24 px-6 md:px-12 bg-white text-[#050521] border-b-2 border-[#050521]">
        <div className="max-w-[1400px] mx-auto text-center md:text-left relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-block bg-[#c6ff34] text-[#050521] text-xs font-black px-4 py-2 rounded-lg tracking-widest uppercase border-2 border-[#050521] shadow-[2px_2px_0px_0px_#050521]">
              CAREER GUIDE 2026
            </span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95] max-w-5xl text-[#050521]">
              The Ultimate Guide to Building a{" "}
              <span className="text-stroke-dark-lg">
                Future-Proof Career
              </span>{" "}
              with AI, ML, Python, Data Science & Generative AI
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-xs font-mono uppercase text-slate-500">
              <span className="flex items-center gap-1.5 font-bold text-[#050521]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c6ff34] border border-[#050521]" />
                Deepstaq Institute
              </span>
              <span>•</span>
              <span>15 Min Read</span>
              <span>•</span>
              <span>Updated June 2026</span>
            </div>
            <p className="text-slate-500 font-mono text-sm md:text-base max-w-3xl leading-relaxed">
              The global AI market is accelerating at a pace unlike anything before. Whether you are a student, a working professional, or someone ready for a career change — the skills covered in this guide represent the highest-demand, highest-earning pathways in modern technology. Deepstaq Institute is your launchpad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 bg-[#c6ff34] border-y-2 border-[#050521] py-8 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-[#050521]">
          <div>
            <div className="text-4xl md:text-5xl font-black tracking-tighter">$1.8T</div>
            <div className="text-[10px] font-black uppercase tracking-wider opacity-75 font-mono mt-1">
              Global AI Market by 2030
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black tracking-tighter">97M</div>
            <div className="text-[10px] font-black uppercase tracking-wider opacity-75 font-mono mt-1">
              New AI Jobs by 2026
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black tracking-tighter">$120K+</div>
            <div className="text-[10px] font-black uppercase tracking-wider opacity-75 font-mono mt-1">
              Avg AI Engineer Salary (US)
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black tracking-tighter">44%</div>
            <div className="text-[10px] font-black uppercase tracking-wider opacity-75 font-mono mt-1">
              Companies Adopting AI Yearly
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="relative z-10 py-16 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          
          {/* Left Sticky Sidebar (Table of Contents) */}
          <aside className="sticky top-32 hidden lg:block col-span-1">
            <div className="bg-slate-50 border-2 border-[#050521] rounded-3xl p-6 shadow-[6px_6px_0px_0px_#050521]">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#050521] mb-6 flex items-center gap-2">
                <span>📋</span> Guide Directory
              </h3>
              <ul className="space-y-3">
                {tocLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => handleScrollTo(link.id)}
                      className="text-left text-xs font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-[#050521] hover:translate-x-1 transition-all duration-200"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right Main Article Content */}
          <main className="col-span-1 lg:col-span-3 space-y-16">
            
            {/* Table of Contents for Mobile */}
            <div className="lg:hidden bg-slate-50 border-2 border-[#050521] rounded-2xl p-6 shadow-[6px_6px_0px_0px_#050521]">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#050521] mb-4">
                📋 What's in This Guide
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tocLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleScrollTo(link.id)}
                    className="text-left text-[11px] font-mono font-bold uppercase text-slate-600 hover:text-[#050521]"
                  >
                    → {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION 1: INTRODUCTION */}
            <article id="intro" className="scroll-mt-36">
              <span className="text-[10px] font-black tracking-widest text-[#c6ff34] bg-[#050521] px-3 py-1 rounded-full uppercase font-mono">
                01 — Introduction
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4 mb-6">
                The Technology Revolution Is Already Here
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed font-sans text-sm md:text-base">
                <p>
                  We are living through the most significant technological transformation in human history. Artificial Intelligence is no longer a concept from science fiction — it is reshaping every industry, every profession, and every economy on the planet. From doctors using AI to diagnose disease earlier than ever before, to financial institutions using machine learning algorithms to predict market behaviour, to marketing teams deploying generative AI to produce content in seconds — the world is changing, fast.
                </p>
                <p>
                  According to the World Economic Forum, by 2026 over <strong className="text-[#050521]">97 million new roles</strong> will emerge in fields aligned with AI, automation, and data science. Meanwhile, the global AI market is projected to surpass <strong className="text-[#050521]">$1.8 trillion by 2030</strong>, growing at a compounding annual rate of over 37%. What does this mean for you? It means the skills you acquire today will define your earning power, your career trajectory, and your relevance in tomorrow's economy.
                </p>
                <p>
                  At <strong className="text-[#050521]">Deepstaq Institute</strong>, we have designed a suite of cutting-edge courses — in Artificial Intelligence, Machine Learning, Python Programming, Data Science, and Generative AI — built specifically to transform beginners into job-ready professionals. Our curriculum is crafted with direct input from industry practitioners, ensuring every skill you learn maps directly to real employer demand.
                </p>
                <p>
                  Whether you are a fresh graduate trying to break into tech, a working professional looking to upskill, a business owner wanting to understand how AI can grow your company, or a career switcher aiming for a higher-paying role — this guide is for you. Read every section. By the end, you will have a clear picture of which path suits you, what career opportunities await, and how to get started today.
                </p>
              </div>
            </article>

            {/* SECTION 2: WHY AI */}
            <article id="why-ai" className="scroll-mt-36">
              <span className="text-[10px] font-black tracking-widest text-[#c6ff34] bg-[#050521] px-3 py-1 rounded-full uppercase font-mono">
                02 — Market Trends
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4 mb-6">
                Why AI and Data Skills Are the Future of Every Career
              </h2>
              <div className="space-y-6 text-slate-600 leading-relaxed text-sm md:text-base">
                <p>
                  The adoption of artificial intelligence is no longer a competitive advantage for businesses — it is fast becoming a baseline requirement for survival. A McKinsey Global Survey found that <strong className="text-[#050521]">50% of companies</strong> have adopted AI in at least one business function, a figure that has doubled in just five years. Goldman Sachs estimates that AI could eventually execute tasks currently worth <strong className="text-[#050521]">$7 trillion in global wages</strong> annually — meaning those who can build, manage, and leverage AI systems will command extraordinary value.
                </p>

                <h3 className="text-xl md:text-2xl font-black uppercase text-[#050521] mt-8 mb-4">
                  AI's Impact Across Major Industries
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "🏥 Healthcare", "🏦 Finance", "🎓 Education", "🛒 Retail", "📣 Marketing",
                    "🏭 Manufacturing", "🔐 Cybersecurity", "🚗 Automotive", "🌾 Agriculture", "🏗️ Real Estate"
                  ].map((ind, i) => (
                    <span key={i} className="bg-[#050521] text-white font-mono text-xs px-4 py-2 rounded-xl border border-[#c6ff34]/20 shadow-[2px_2px_0px_0px_#050521]">
                      {ind}
                    </span>
                  ))}
                </div>

                {/* McKinsey Callout */}
                <div className="bg-[#050521] text-white border-l-4 border-[#c6ff34] rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(5,5,33,0.15)] relative overflow-hidden">
                  <span className="absolute right-4 top-2 text-7xl font-serif text-white/5 pointer-events-none select-none">"</span>
                  <p className="italic text-slate-300 font-mono text-sm md:text-base">
                    "By 2030, up to 800 million jobs globally could be disrupted by automation. The professionals who will thrive are those who can work alongside AI — designing, deploying, and directing intelligent systems."
                  </p>
                  <span className="block mt-4 text-[#c6ff34] font-black uppercase tracking-wider text-xs font-mono">
                    — McKinsey Global Institute
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-black uppercase text-[#050521] mt-8 mb-4">
                  Key Market Growth Statistics
                </h3>
                <div className="overflow-x-auto border-2 border-[#050521] rounded-2xl shadow-[6px_6px_0px_0px_#050521]">
                  <table className="w-full text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="bg-[#050521] text-white font-mono uppercase tracking-wider">
                        <th className="p-4 border-b-2 border-[#050521]">Technology</th>
                        <th className="p-4 border-b-2 border-[#050521]">2023 Market Size</th>
                        <th className="p-4 border-b-2 border-[#050521]">Projected 2030 Size</th>
                        <th className="p-4 border-b-2 border-[#050521] text-[#c6ff34]">CAGR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#050521]/10 font-mono">
                      <tr className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-[#050521]">Artificial Intelligence</td>
                        <td className="p-4">$142 billion</td>
                        <td className="p-4">$1.8 trillion</td>
                        <td className="p-4 font-bold text-emerald-600">37.3%</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-[#050521]">Machine Learning</td>
                        <td className="p-4">$21 billion</td>
                        <td className="p-4">$209 billion</td>
                        <td className="p-4 font-bold text-emerald-600">38.8%</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-[#050521]">Data Science</td>
                        <td className="p-4">$103 billion</td>
                        <td className="p-4">$322 billion</td>
                        <td className="p-4 font-bold text-emerald-600">27.6%</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-[#050521]">Generative AI</td>
                        <td className="p-4">$43 billion</td>
                        <td className="p-4">$667 billion</td>
                        <td className="p-4 font-bold text-emerald-600">47.5%</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-[#050521]">Python Ecosystem</td>
                        <td className="p-4">$8.2 billion</td>
                        <td className="p-4">$63 billion</td>
                        <td className="p-4 font-bold text-emerald-600">34.1%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  These are not abstract numbers. Behind each projection are millions of hiring decisions, salary offers, and business investments — all creating an enormous demand for skilled professionals. The opportunity is historic, and it belongs to those who prepare for it now.
                </p>
              </div>
            </article>

            {/* SECTION 3: AI & ML */}
            <article id="ai-ml" className="scroll-mt-36">
              <span className="text-[10px] font-black tracking-widest text-[#c6ff34] bg-[#050521] px-3 py-1 rounded-full uppercase font-mono">
                03 — Course Overview
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4 mb-6">
                Artificial Intelligence & Machine Learning Course
              </h2>
              
              <div className="bg-white border-2 border-[#050521] rounded-3xl p-6 md:p-10 shadow-[8px_8px_0px_0px_#050521] hover:shadow-[12px_12px_0px_0px_#c6ff34] transition-all space-y-6">
                <span className="inline-block bg-[#050521] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">
                  Core Programme
                </span>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  The AI & Machine Learning course at Deepstaq Institute is our flagship programme — and for good reason. AI is not just a technology; it is the new interface between humans and computers, between data and decision-making, between possibility and progress.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-black uppercase text-[#050521] mb-2">🤖 What is Artificial Intelligence?</h4>
                    <p className="text-xs md:text-sm text-slate-500 font-mono">
                      Artificial Intelligence refers to the simulation of human intelligence in machines — enabling them to learn, reason, solve problems, perceive the world, and make decisions. Powers recommendation engines, self-driving vehicles, etc.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-md font-black uppercase text-[#050521] mb-2">🧠 What is Machine Learning?</h4>
                    <p className="text-xs md:text-sm text-slate-500 font-mono">
                      Machine Learning focuses on training systems to learn from data rather than being explicitly programmed. Instead of writing rules, you feed models data to let them discover patterns.
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#050521]/15 pt-6">
                  <h4 className="text-md font-black uppercase text-[#050521] mb-4">Core Concepts Taught</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm text-slate-600 font-mono">
                    <li className="flex items-center gap-2">▸ Supervised, Unsupervised & Reinforcement Learning</li>
                    <li className="flex items-center gap-2">▸ Neural Networks & Deep Learning (CNNs, Transformers)</li>
                    <li className="flex items-center gap-2">▸ Natural Language Processing (NLP)</li>
                    <li className="flex items-center gap-2">▸ Computer Vision & Image Recognition</li>
                    <li className="flex items-center gap-2">▸ Model Training, Validation & Deployment</li>
                    <li className="flex items-center gap-2">▸ Feature Engineering & Data Preprocessing</li>
                    <li className="flex items-center gap-2">▸ MLOps: End-to-End ML Pipelines</li>
                  </ul>
                </div>

                <div className="border-t border-[#050521]/15 pt-6">
                  <h4 className="text-md font-black uppercase text-[#050521] mb-3">Tools & Technologies Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Python", "TensorFlow", "PyTorch", "Scikit-learn", "Keras",
                      "Hugging Face", "OpenCV", "AWS SageMaker", "Vertex AI", "MLflow"
                    ].map((tool, i) => (
                      <span key={i} className="bg-slate-50 border border-[#050521] text-xs font-mono font-bold px-3 py-1.5 rounded-lg text-[#050521]">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#050521]/15 pt-6">
                  <h4 className="text-md font-black uppercase text-[#050521] mb-4">Career Opportunities & Salary Ranges</h4>
                  <div className="overflow-x-auto border border-[#050521] rounded-2xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#050521] text-white font-mono uppercase">
                          <th className="p-3">Role</th>
                          <th className="p-3">Entry (India)</th>
                          <th className="p-3">Mid-Level</th>
                          <th className="p-3">Senior</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#050521]/10 font-mono">
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">AI Engineer</td>
                          <td className="p-3">₹6–10 LPA</td>
                          <td className="p-3">₹15–25 LPA</td>
                          <td className="p-3">₹35–60+ LPA</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">Machine Learning Engineer</td>
                          <td className="p-3">₹7–12 LPA</td>
                          <td className="p-3">₹18–30 LPA</td>
                          <td className="p-3">₹40–70+ LPA</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">NLP Engineer</td>
                          <td className="p-3">₹6–11 LPA</td>
                          <td className="p-3">₹16–28 LPA</td>
                          <td className="p-3">₹38–65+ LPA</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">AI Consultant</td>
                          <td className="p-3">₹8–14 LPA</td>
                          <td className="p-3">₹20–35 LPA</td>
                          <td className="p-3">₹50–90+ LPA</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-[#050521]/15 pt-6">
                  <h4 className="text-md font-black uppercase text-[#050521] mb-4">Global Salary Benchmarks (USD)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 border-2 border-[#050521] p-4 rounded-xl text-center">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Entry Level</div>
                      <div className="text-lg font-black text-emerald-600 font-mono">$75K–$95K</div>
                      <div className="text-[9px] text-slate-400 font-mono mt-1">0-2 yrs exp</div>
                    </div>
                    <div className="bg-slate-50 border-2 border-[#050521] p-4 rounded-xl text-center">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Mid Level</div>
                      <div className="text-lg font-black text-emerald-600 font-mono">$110K–$145K</div>
                      <div className="text-[9px] text-slate-400 font-mono mt-1">2-6 yrs exp</div>
                    </div>
                    <div className="bg-slate-50 border-2 border-[#050521] p-4 rounded-xl text-center">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Senior Level</div>
                      <div className="text-lg font-black text-emerald-600 font-mono">$160K–$250K+</div>
                      <div className="text-[9px] text-slate-400 font-mono mt-1">6+ yrs exp</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#050521]/15 pt-6">
                  <h4 className="text-md font-black uppercase text-[#050521] mb-3">Top Companies Hiring AI/ML Professionals</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Google DeepMind", "Microsoft", "Amazon", "Meta AI", "Apple", "Nvidia",
                      "Wipro", "Infosys", "TCS", "Flipkart", "OpenAI", "Anthropic"
                    ].map((comp, i) => (
                      <span key={i} className="bg-[#050521] text-white text-[10px] font-mono font-black uppercase tracking-wider px-3 py-1.5 rounded-lg">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* SECTION 4: PYTHON */}
            <article id="python" className="scroll-mt-36">
              <span className="text-[10px] font-black tracking-widest text-[#c6ff34] bg-[#050521] px-3 py-1 rounded-full uppercase font-mono">
                04 — Course Overview
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4 mb-6">
                Python Programming Course
              </h2>

              <div className="bg-white border-2 border-[#050521] rounded-3xl p-6 md:p-10 shadow-[8px_8px_0px_0px_#050521] hover:shadow-[12px_12px_0px_0px_#c6ff34] transition-all space-y-6">
                <span className="inline-block bg-teal-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">
                  Foundational & Career-Ready
                </span>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  If AI is the destination, Python is the vehicle. Python has consistently ranked as the world's most popular programming language for over five consecutive years on both the TIOBE Index and Stack Overflow Developer Survey. It is the lingua franca of data science, AI engineering, web automation, and backend development — and learning it opens more doors than almost any other technical skill.
                </p>

                <div>
                  <h4 className="text-md font-black uppercase text-[#050521] mb-3">Why Python Dominates the Tech World</h4>
                  <ul className="space-y-2 text-xs md:text-sm text-slate-600 font-mono">
                    <li>▸ Simplest and most readable syntax of any major language</li>
                    <li>▸ World's largest ecosystem of libraries for AI, data, and web</li>
                    <li>▸ Supported by every major cloud platform (AWS, GCP, Azure)</li>
                    <li>▸ Used by Google, NASA, Instagram, Spotify, and 99% of AI startups</li>
                    <li>▸ Versatile — web apps, automation scripts, AI models, data pipelines</li>
                  </ul>
                </div>

                <div className="border-t border-[#050521]/15 pt-6">
                  <h4 className="text-md font-black uppercase text-[#050521] mb-4">Course Modules at Deepstaq</h4>
                  <div className="overflow-x-auto border border-[#050521] rounded-2xl">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className="bg-[#050521] text-white font-mono uppercase">
                          <th className="p-3">Module</th>
                          <th className="p-3">Topics Covered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#050521]/10 font-mono">
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">Python Fundamentals</td>
                          <td className="p-3 text-slate-500">Syntax, variables, data types, control flow, functions</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">Object-Oriented Programming</td>
                          <td className="p-3 text-slate-500">Classes, inheritance, encapsulation, polymorphism</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">Data Structures & Algorithms</td>
                          <td className="p-3 text-slate-500">Lists, dicts, trees, searching, sorting, complexity</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">File Handling & APIs</td>
                          <td className="p-3 text-slate-500">CSV/JSON processing, REST APIs, web scraping</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">Libraries for AI/Data</td>
                          <td className="p-3 text-slate-500">NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">Web Development</td>
                          <td className="p-3 text-slate-500">Flask, FastAPI, Django basics, deployment</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-[#050521]/15 pt-6">
                  <h4 className="text-md font-black uppercase text-[#050521] mb-4">Career Paths for Python Professionals</h4>
                  <div className="overflow-x-auto border border-[#050521] rounded-2xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#050521] text-white font-mono uppercase">
                          <th className="p-3">Role</th>
                          <th className="p-3">Fresher (India)</th>
                          <th className="p-3">Experienced (India)</th>
                          <th className="p-3">Global (USD)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#050521]/10 font-mono">
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">Python Developer</td>
                          <td className="p-3">₹4–7 LPA</td>
                          <td className="p-3">₹12–25 LPA</td>
                          <td className="p-3">$85K–$135K</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">Backend Developer</td>
                          <td className="p-3">₹5–8 LPA</td>
                          <td className="p-3">₹14–28 LPA</td>
                          <td className="p-3">$90K–$145K</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">Automation Engineer</td>
                          <td className="p-3">₹4–8 LPA</td>
                          <td className="p-3">₹12–22 LPA</td>
                          <td className="p-3">$80K–$125K</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </article>

            {/* SECTION 5: DATA SCIENCE */}
            <article id="data-science" className="scroll-mt-36">
              <span className="text-[10px] font-black tracking-widest text-[#c6ff34] bg-[#050521] px-3 py-1 rounded-full uppercase font-mono">
                05 — Course Overview
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4 mb-6">
                Data Science Course
              </h2>

              <div className="bg-white border-2 border-[#050521] rounded-3xl p-6 md:p-10 shadow-[8px_8px_0px_0px_#050521] hover:shadow-[12px_12px_0px_0px_#c6ff34] transition-all space-y-6">
                <span className="inline-block bg-[#f4a261] text-[#050521] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">
                  High Demand · High Pay
                </span>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  Data is the new oil — but raw data without skilled analysis is like crude oil without refineries. Data Science is the discipline that transforms vast, messy datasets into actionable business intelligence, predictive models, and strategic insights. Harvard Business Review famously called Data Scientist the "sexiest job of the 21st century," and a decade later, demand has only intensified.
                </p>

                <h3 className="text-md font-black uppercase text-[#050521] mb-2">What is Data Science?</h3>
                <p className="text-xs md:text-sm text-slate-500 font-mono">
                  Data Science is an interdisciplinary field combining statistics, mathematics, programming, domain expertise, and machine learning to extract meaningful patterns from structured and unstructured data. Powers recommendations on Amazon, fraud detection at Visa, etc.
                </p>

                <div className="border-t border-[#050521]/15 pt-6">
                  <h4 className="text-md font-black uppercase text-[#050521] mb-3">The Data Science Process</h4>
                  <ul className="space-y-2 text-xs md:text-sm text-slate-600 font-mono">
                    <li>▸ <strong>Problem Definition</strong> — Frame the business question to be answered with data</li>
                    <li>▸ <strong>Data Collection</strong> — Gather data from databases, APIs, web scraping, sensors</li>
                    <li>▸ <strong>Data Cleaning</strong> — Handle missing values, outliers, and inconsistencies</li>
                    <li>▸ <strong>Exploratory Data Analysis (EDA)</strong> — Visualise patterns and generate hypotheses</li>
                    <li>▸ <strong>Model Building</strong> — Apply ML algorithms to train predictive models</li>
                  </ul>
                </div>

                <div className="border-t border-[#050521]/15 pt-6">
                  <h4 className="text-md font-black uppercase text-[#050521] mb-3">Key Tools & Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Python", "Pandas", "NumPy", "SQL", "Tableau", "Power BI", "Spark", "Google BigQuery", "Matplotlib"].map((tool, i) => (
                      <span key={i} className="bg-slate-50 border border-[#050521] text-xs font-mono font-bold px-3 py-1.5 rounded-lg text-[#050521]">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#050521]/15 pt-6">
                  <h4 className="text-md font-black uppercase text-[#050521] mb-4">Career Opportunities in Data Science</h4>
                  <div className="overflow-x-auto border border-[#050521] rounded-2xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#050521] text-white font-mono uppercase">
                          <th className="p-3">Role</th>
                          <th className="p-3">Entry (India)</th>
                          <th className="p-3">Mid (India)</th>
                          <th className="p-3">Senior (India)</th>
                          <th className="p-3">Global (USD)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#050521]/10 font-mono">
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">Data Scientist</td>
                          <td className="p-3">₹6–11 LPA</td>
                          <td className="p-3">₹16–30 LPA</td>
                          <td className="p-3">₹40–70 LPA</td>
                          <td className="p-3">$95K–$165K</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">Data Analyst</td>
                          <td className="p-3">₹4–8 LPA</td>
                          <td className="p-3">₹10–18 LPA</td>
                          <td className="p-3">₹22–40 LPA</td>
                          <td className="p-3">$65K–$110K</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">Data Engineer</td>
                          <td className="p-3">₹7–12 LPA</td>
                          <td className="p-3">₹18–32 LPA</td>
                          <td className="p-3">₹40–70 LPA</td>
                          <td className="p-3">$100K–$170K</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </article>

            {/* SECTION 6: GENERATIVE AI */}
            <article id="gen-ai" className="scroll-mt-36">
              <span className="text-[10px] font-black tracking-widest text-[#c6ff34] bg-[#050521] px-3 py-1 rounded-full uppercase font-mono">
                06 — Course Overview
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4 mb-6">
                Generative AI Course
              </h2>

              <div className="bg-white border-2 border-[#050521] rounded-3xl p-6 md:p-10 shadow-[8px_8px_0px_0px_#050521] hover:shadow-[12px_12px_0px_0px_#c6ff34] transition-all space-y-6">
                <span className="inline-block bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">
                  The Hottest Skill of 2026
                </span>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  No technology in recent history has captured the world's imagination — and transformed business workflows — faster than Generative AI. Since the launch of ChatGPT in late 2022, Generative AI has moved from curiosity to core business infrastructure in under 18 months. Today, the fastest-growing job titles on LinkedIn include Prompt Engineer, AI Automation Consultant, and Generative AI Specialist.
                </p>

                <h3 className="text-md font-black uppercase text-[#050521] mb-2">What is Generative AI?</h3>
                <p className="text-xs md:text-sm text-slate-500 font-mono">
                  Generative AI refers to machine learning systems that can create new content — text, images, audio, video, code, and more — based on patterns learned from training data. Large Language Models (LLMs) like GPT-4, Claude, Gemini, and LLaMA are prime examples.
                </p>

                <div className="border-t border-[#050521]/15 pt-6">
                  <h4 className="text-md font-black uppercase text-[#050521] mb-4 font-mono">Core Topics in the Course</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-slate-600 text-xs md:text-sm">
                    <div>
                      <strong className="text-[#050521] block mb-1">✍️ Prompt Engineering</strong>
                      <p className="font-mono text-slate-500 text-xs">Zero-shot and few-shot prompting, chain-of-thought reasoning, and system instruction design.</p>
                    </div>
                    <div>
                      <strong className="text-[#050521] block mb-1">⚡ AI Automation</strong>
                      <p className="font-mono text-slate-500 text-xs">Build automated workflows with Zapier AI, LangChain, and n8n to reduce manual tasks.</p>
                    </div>
                    <div>
                      <strong className="text-[#050521] block mb-1">🎨 AI Content Creation</strong>
                      <p className="font-mono text-slate-500 text-xs">Explore assets generation using Midjourney, Stable Diffusion, and ElevenLabs.</p>
                    </div>
                    <div>
                      <strong className="text-[#050521] block mb-1">💼 AI-Powered Business Solutions</strong>
                      <p className="font-mono text-slate-500 text-xs">Retrieval Augmented Generation (RAG) systems, building custom agents, and custom GPT instances.</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#050521]/15 pt-6">
                  <h4 className="text-md font-black uppercase text-[#050521] mb-3">Tools & Platforms Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {["OpenAI API", "LangChain", "LlamaIndex", "Pinecone", "Midjourney", "Stable Diffusion", "n8n", "Google Gemini"].map((tool, i) => (
                      <span key={i} className="bg-slate-50 border border-[#050521] text-xs font-mono font-bold px-3 py-1.5 rounded-lg text-[#050521]">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#050521]/15 pt-6">
                  <h4 className="text-md font-black uppercase text-[#050521] mb-4 font-mono">Career Opportunities in Generative AI</h4>
                  <div className="overflow-x-auto border border-[#050521] rounded-2xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#050521] text-white font-mono uppercase">
                          <th className="p-3">Role</th>
                          <th className="p-3">Salary Range (India)</th>
                          <th className="p-3">Salary Range (USD)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#050521]/10 font-mono">
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">Generative AI Specialist</td>
                          <td className="p-3">₹12–35 LPA</td>
                          <td className="p-3">$110K–$185K</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">Prompt Engineer</td>
                          <td className="p-3">₹8–22 LPA</td>
                          <td className="p-3">$75K–$150K</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-[#050521]">AI Automation Consultant</td>
                          <td className="p-3">₹10–30 LPA</td>
                          <td className="p-3">$90K–$160K</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-[#c6ff34]/15 border-l-4 border-[#c6ff34] p-4 rounded-r-xl">
                  <p className="text-xs md:text-sm text-slate-700 font-mono">
                    <strong>Market Insight:</strong> The Generative AI job market grew by 306% between 2022 and 2024 according to LinkedIn's Jobs on the Rise report. All major tech firms are actively hiring at all levels.
                  </p>
                </div>
              </div>
            </article>

            {/* SECTION 7: WHO CAN LEARN */}
            <article id="who-can-learn" className="scroll-mt-36">
              <span className="text-[10px] font-black tracking-widest text-[#c6ff34] bg-[#050521] px-3 py-1 rounded-full uppercase font-mono">
                07 — Eligibility
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4 mb-6">
                Who Can Learn These Courses?
              </h2>
              <div className="space-y-6">
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  One of the most common questions we receive at Deepstaq Institute is: "Am I the right person for this?" The answer, almost universally, is yes. These courses have been designed to accommodate learners at every starting point, from those with zero technical background to experienced engineers seeking to upskill into AI.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 border-2 border-[#050521] p-6 rounded-2xl shadow-[4px_4px_0px_0px_#050521]">
                    <div className="text-2xl mb-2">🎓</div>
                    <h4 className="font-black uppercase text-xs tracking-wider text-[#050521] mb-1">Students & Freshers</h4>
                    <p className="text-xs text-slate-500 font-mono">Build job-ready portfolios before entering the job market.</p>
                  </div>
                  <div className="bg-slate-50 border-2 border-[#050521] p-6 rounded-2xl shadow-[4px_4px_0px_0px_#050521]">
                    <div className="text-2xl mb-2">💼</div>
                    <h4 className="font-black uppercase text-xs tracking-wider text-[#050521] mb-1">Working Professionals</h4>
                    <p className="text-xs text-slate-500 font-mono">Add high-demand AI skills to your existing industry expertise.</p>
                  </div>
                  <div className="bg-slate-50 border-2 border-[#050521] p-6 rounded-2xl shadow-[4px_4px_0px_0px_#050521]">
                    <div className="text-2xl mb-2">🔄</div>
                    <h4 className="font-black uppercase text-xs tracking-wider text-[#050521] mb-1">Career Switchers</h4>
                    <p className="text-xs text-slate-500 font-mono">Transition from non-tech backgrounds smoothly with structure.</p>
                  </div>
                </div>

                <h3 className="text-xl font-black uppercase text-[#050521] mt-8 mb-4">
                  Prerequisites by Course
                </h3>
                <div className="overflow-x-auto border border-[#050521] rounded-2xl">
                  <table className="w-full text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="bg-[#050521] text-white font-mono uppercase">
                        <th className="p-3">Course</th>
                        <th className="p-3">Recommended Background</th>
                        <th className="p-3">Minimum Requirement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#050521]/10 font-mono">
                      <tr>
                        <td className="p-3 font-bold text-[#050521]">Python Programming</td>
                        <td className="p-3">None / Any</td>
                        <td className="p-3">Basic computer literacy</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-[#050521]">Data Science</td>
                        <td className="p-3">Basic maths / analytics</td>
                        <td className="p-3">Python fundamentals (taught in-course)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-[#050521]">AI & Machine Learning</td>
                        <td className="p-3">Python + basic statistics</td>
                        <td className="p-3">Python course or equivalent</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </article>

            {/* SECTION 8: JOBS */}
            <article id="jobs" className="scroll-mt-36">
              <span className="text-[10px] font-black tracking-widest text-[#c6ff34] bg-[#050521] px-3 py-1 rounded-full uppercase font-mono">
                08 — Career Strategy
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4 mb-6">
                Where Can You Find Jobs After Completing These Courses?
              </h2>
              <div className="space-y-6 text-slate-600 text-sm md:text-base leading-relaxed">
                <p>
                  Completing a course is the beginning of your career journey, not the end of it. At Deepstaq Institute, we dedicate substantial time to career placement support — because building skills without building career strategy leaves enormous opportunity on the table.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 border-2 border-[#050521] p-6 rounded-2xl">
                    <h4 className="font-black uppercase text-sm text-[#050521] mb-2">🇮🇳 India's Tech Job Market</h4>
                    <p className="text-xs font-mono text-slate-500">
                      Primary hubs: Bangalore, Hyderabad, Pune, Chennai. Tier-2 cities like Kochi, Coimbatore are growing rapidly. IT Giants & startups both offer excellent growth paths.
                    </p>
                  </div>
                  <div className="bg-slate-50 border-2 border-[#050521] p-6 rounded-2xl">
                    <h4 className="font-black uppercase text-sm text-[#050521] mb-2">🌍 Global Remote Opportunities</h4>
                    <p className="text-xs font-mono text-slate-500">
                      Remote-first companies in US, UK, Canada, and EU hire global remote talent. Platforms like LinkedIn, Wellfound, Turing.com connect remote engineers to global markets.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-black uppercase text-sm text-[#050521] mb-3">Portfolio & Interview Preparation</h4>
                  <ul className="space-y-2 text-xs md:text-sm font-mono">
                    <li>▸ Create a clean <strong>GitHub Profile</strong> showcasing 5 well-documented projects.</li>
                    <li>▸ Optimise your <strong>LinkedIn Profile</strong> headline and description using keywords.</li>
                    <li>▸ Participate in Kaggle competitions and solve LeetCode coding rounds.</li>
                  </ul>
                </div>
              </div>
            </article>

            {/* SECTION 9: FUTURE SCOPE */}
            <article id="future" className="scroll-mt-36">
              <span className="text-[10px] font-black tracking-widest text-[#c6ff34] bg-[#050521] px-3 py-1 rounded-full uppercase font-mono">
                09 — Outlook
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4 mb-6">
                Future Career Scope: The Next Decade of AI
              </h2>
              <div className="space-y-6 text-slate-600 text-sm md:text-base leading-relaxed">
                <div className="bg-[#050521] text-white border-l-4 border-[#c6ff34] rounded-2xl p-6 relative overflow-hidden">
                  <p className="italic font-mono text-sm md:text-base text-slate-300">
                    "Artificial intelligence is one of the most profound things we're working on as humanity. It's more profound than fire or electricity."
                  </p>
                  <span className="block mt-2 text-[#c6ff34] font-black uppercase text-xs font-mono">
                    — Sundar Pichai, CEO of Google
                  </span>
                </div>

                <div className="overflow-x-auto border border-[#050521] rounded-2xl mt-6">
                  <table className="w-full text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="bg-[#050521] text-white font-mono uppercase">
                        <th className="p-3">Trend</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Opportunity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#050521]/10 font-mono">
                      <tr>
                        <td className="p-3 font-bold text-[#050521]">Agentic AI</td>
                        <td className="p-3">AI systems that autonomously plan and execute multi-step tasks.</td>
                        <td className="p-3">AI Agent Developer</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-[#050521]">Multimodal AI</td>
                        <td className="p-3">Models handling text, images, audio, and video simultaneously.</td>
                        <td className="p-3">Vision-Language Specialist</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-[#050521]">Edge AI</td>
                        <td className="p-3">Running AI models directly on-device (phones, cars, etc.).</td>
                        <td className="p-3">TinyML Developer</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </article>

            {/* SECTION 10: WHY DEEPSTAQ */}
            <article id="deepstaq" className="scroll-mt-36">
              <span className="text-[10px] font-black tracking-widest text-[#c6ff34] bg-[#050521] px-3 py-1 rounded-full uppercase font-mono">
                10 — About Us
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4 mb-6">
                Why Choose Deepstaq Institute?
              </h2>
              <div className="space-y-6">
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  There are many training options in the market — online platforms, university courses, bootcamps. So why do ambitious learners consistently choose Deepstaq Institute? The answer lies in four words: <strong className="text-[#050521]">results, not just certificates.</strong>
                </p>

                <div className="overflow-x-auto border border-[#050521] rounded-2xl">
                  <table className="w-full text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="bg-[#050521] text-white font-mono uppercase">
                        <th className="p-3">Feature</th>
                        <th className="p-3">Deepstaq Institute</th>
                        <th className="p-3">Typical Online Platforms</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#050521]/10 font-mono">
                      <tr>
                        <td className="p-3 font-bold text-[#050521]">Curriculum Design</td>
                        <td className="p-3 font-bold text-emerald-600">Industry-practitioner led, updated quarterly</td>
                        <td className="p-3 text-slate-400">Static, out of date</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-[#050521]">Project Work</td>
                        <td className="p-3 font-bold text-emerald-600">Live projects with real companies</td>
                        <td className="p-3 text-slate-400">Toy datasets & sandboxes</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-[#050521]">Mentorship</td>
                        <td className="p-3 font-bold text-emerald-600">1-on-1 mentoring by AI engineers</td>
                        <td className="p-3 text-slate-400">Forums only</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </article>

            {/* SECTION 11: ROADMAP */}
            <article id="roadmap" className="scroll-mt-36">
              <span className="text-[10px] font-black tracking-widest text-[#c6ff34] bg-[#050521] px-3 py-1 rounded-full uppercase font-mono">
                11 — Action Plan
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4 mb-6">
                Your Success Roadmap: From Beginner to Hired
              </h2>
              <div className="space-y-8 relative pl-6 border-l-2 border-[#050521]/20 ml-2">
                {[
                  {
                    step: "01",
                    title: "Learn the Fundamentals (Months 1–3)",
                    desc: "Start with Python Programming to build your coding foundation. Simultaneously, develop mathematical intuition — linear algebra, probability, and statistics."
                  },
                  {
                    step: "02",
                    title: "Build Core Technical Skills (Months 3–6)",
                    desc: "Progress into your chosen specialisation — Data Science, AI/ML, or Generative AI. Complete structured projects and start building your GitHub portfolio."
                  },
                  {
                    step: "03",
                    title: "Earn Industry Certifications (Month 5–7)",
                    desc: "Pursue Deepstaq's certification alongside Google Cloud ML Engineer, AWS Certified Machine Learning, or Azure AI Engineer certifications."
                  },
                  {
                    step: "04",
                    title: "Build a Professional Portfolio (Month 6–8)",
                    desc: "Complete your capstone project, clean up and document all GitHub repositories, and draft your technical resume."
                  },
                  {
                    step: "05",
                    title: "Apply for Internships (Month 7–9)",
                    desc: "Use Deepstaq's placement network to secure internships with partner companies. Even a 2-3 month internship provides crucial real-world experience."
                  },
                  {
                    step: "06",
                    title: "Secure Your High-Paying Job (Month 9–12)",
                    desc: "Leverage Deepstaq's placement support to target the right roles, prepare for technical interviews, and negotiate offers."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="relative space-y-2">
                    <span className="absolute -left-11 top-0 w-8 h-8 rounded-full bg-[#050521] text-white flex items-center justify-center text-xs font-mono font-bold border-2 border-white shadow-[2px_2px_0px_0px_#c6ff34]">
                      {item.step}
                    </span>
                    <h4 className="text-lg font-black uppercase text-[#050521]">{item.title}</h4>
                    <p className="text-xs md:text-sm text-slate-500 font-mono leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </article>

            {/* SECTION 12: FAQ */}
            <article id="faq" className="scroll-mt-36">
              <span className="text-[10px] font-black tracking-widest text-[#c6ff34] bg-[#050521] px-3 py-1 rounded-full uppercase font-mono">
                12 — FAQ
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4 mb-6">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                {faqItems.map((item, idx) => {
                  const isOpen = !!openFAQs[idx];
                  return (
                    <div key={idx} className="border-b border-[#050521]/10 pb-4">
                      <button
                        onClick={() => toggleFAQ(idx)}
                        className="w-full flex justify-between items-center text-left py-3 group focus:outline-none"
                      >
                        <span className="font-black uppercase text-sm tracking-wider text-[#050521] pr-4 leading-snug">
                          Q: {item.q}
                        </span>
                        <span className={`w-8 h-8 rounded-xl border border-[#050521] flex-shrink-0 flex items-center justify-center transition-all ${isOpen ? "bg-[#c6ff34] rotate-45" : "bg-white"}`}>
                          <span className="text-sm font-bold">+</span>
                        </span>
                      </button>
                      {isOpen && (
                        <p className="text-slate-500 text-xs md:text-sm font-mono leading-relaxed mt-2 pl-4">
                          {item.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>

          </main>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6 md:px-12 bg-white text-[#050521] border-t-2 border-[#050521]">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-[#050521] text-white border-2 border-[#050521] rounded-[2.5rem] p-8 md:p-16 shadow-[12px_12px_0px_0px_#c6ff34] relative overflow-hidden">
            {/* Background glowing gradients */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#c6ff34]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
              <div className="lg:col-span-3 space-y-6 text-left">
                <span className="inline-block bg-[#c6ff34] text-[#050521] text-xs font-black px-4 py-2 rounded-xl tracking-widest uppercase border border-[#050521]">
                  ENROLMENT OPEN
                </span>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                  Your <span className="text-[#c6ff34]">Future-Proof</span><br />
                  Career Starts Today
                </h2>
                <p className="text-slate-400 font-mono text-xs md:text-sm leading-relaxed max-w-xl">
                  The world's best opportunities in AI, Machine Learning, Python, Data Science, and Generative AI are being filled right now. Every week you wait is a week behind. Deepstaq Institute gives you the curriculum, the mentorship, the portfolio, and the placement support to compete at the highest level.
                </p>
              </div>
              
              <div className="lg:col-span-2 flex flex-col gap-4 w-full">
                <Link to="/slot" className="w-full">
                  <button className="w-full py-5 bg-[#c6ff34] text-[#050521] font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[8px_8px_0px_0px_rgba(198,255,52,0.25)] border-2 border-[#050521]">
                    Reserve Seat Now →
                  </button>
                </Link>
                <Link to="/contact" className="w-full">
                  <button className="w-full py-5 bg-transparent text-white border-2 border-white/30 hover:border-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all">
                    Contact Admissions
                  </button>
                </Link>
                
                <div className="h-px bg-white/10 my-2" />
                
                <div className="text-center lg:text-left space-y-1.5 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                  <p>📧 admissions@deepstaq.com</p>
                  <p>⚡ New Batches Starting Every Month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
