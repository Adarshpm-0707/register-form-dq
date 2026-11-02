import React from "react";
import { Link } from "react-router-dom";
import event1Img from "../assets/events/event (1).webp";
import event8Img from "../assets/events/event (8).webp";
import event10Img from "../assets/events/event (10).webp";

export default function About() {
  const pillars = [
    {
      title: "Real Industry Workloads",
      desc: "No shallow toy tutorials. You build enterprise RAG pipelines, fine-tune open-source models (Llama 3, Mistral), and engineer autonomous agent architectures.",
      icon: "⚡",
    },
    {
      title: "GPU Hardware Lab in Kannur",
      desc: "Direct access to high-spec computing hardware, dedicated GPU workstations, and real-time collaboration pods right here in Kerala.",
      icon: "🖥️",
    },
    {
      title: "1-on-1 Senior AI Mentorship",
      desc: "Learn directly from practitioners who deploy AI models in production for global companies. Regular architectural code reviews and guidance.",
      icon: "🤝",
    },
    {
      title: "Guaranteed Placement Support",
      desc: "Comprehensive mock technical interviews, resume crafting, GitHub portfolio curation, and direct referrals to top tech companies and AI startups.",
      icon: "🎯",
    },
  ];

  const milestones = [
    { year: "2024", label: "Founding", text: "Deepstaq AI Institute established in Kannur to bridge the severe AI talent gap in South India." },
    { year: "2025", label: "Flagship Cohorts", text: "Successfully trained and mentored 500+ developers, graduates, and professionals in AI/ML & LLM engineering." },
    { year: "2026", label: "Industry Ecosystem", text: "Partnered with 20+ tech firms, hosted regional AI summits (AIwaken), and expanded hands-on offline research labs." },
  ];

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto text-white overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          About Deepstaq
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Pioneering Practical <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400">
            Artificial Intelligence Education
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
          Deepstaq is an advanced AI research and educational institute dedicated to empowering the next generation of Machine Learning engineers, generative AI developers, and tech builders.
        </p>
      </div>

      {/* Mission & Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 shadow-xl space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400">
            OUR MISSION
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Democratizing Production AI Engineering
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Our mission is to replace passive video tutorials with intense, hands-on, production-grade engineering. We believe anyone with logical curiosity can master AI when given state-of-the-art compute, expert mentorship, and real problems to solve.
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 shadow-xl space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400">
            OUR VISION
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            A Global Hub for AI Innovation in Kerala
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We envision Kannur and Kerala emerging as a vibrant global AI talent corridor, producing world-class builders who deploy frontier AI models, publish breakthrough tooling, and lead tech companies worldwide.
          </p>
        </div>
      </div>

      {/* The 4 Deepstaq Pillars */}
      <div className="mb-20 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            WHY DEEPSTAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built Different from Day One
          </h2>
          <p className="text-slate-400 text-sm">
            Here is why students and professionals choose Deepstaq over traditional bootcamps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-sky-400/40 transition-all duration-300 space-y-3"
            >
              <div className="text-3xl mb-2">{p.icon}</div>
              <h3 className="text-lg font-bold text-white">{p.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Campus & Infrastructure Photo Gallery */}
      <div className="mb-20 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400">
              CAMPUS & ENVIRONMENT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Inside Our AI Learning Facility
            </h2>
          </div>
          <Link
            to="/events"
            className="text-xs sm:text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors"
          >
            Explore Events & Workshops →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 group">
            <img
              src={event1Img}
              alt="Deepstaq Lab"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
              <span className="text-xs font-semibold text-white">Live Workshop Lab</span>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 group">
            <img
              src={event8Img}
              alt="Student Cohort"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
              <span className="text-xs font-semibold text-white">Collaborative Cohorts</span>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 group">
            <img
              src={event10Img}
              alt="Mentorship Session"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
              <span className="text-xs font-semibold text-white">1:1 Technical Mentorship</span>
            </div>
          </div>
        </div>
      </div>

      {/* Institute Milestones */}
      <div className="mb-20 p-8 sm:p-12 rounded-3xl bg-white/[0.03] border border-white/10 space-y-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center">
          Our Journey & Milestones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {milestones.map((m, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/8 space-y-2">
              <div className="text-2xl font-black font-mono text-sky-400">{m.year}</div>
              <div className="text-sm font-bold text-white">{m.label}</div>
              <p className="text-xs text-slate-400 leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-sky-500/20 via-blue-600/10 to-transparent border border-sky-400/30 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Ready to Start Your AI Career?
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Talk to an AI curriculum advisor, visit our campus in Kannur, or book a free demo session to see our practical training first-hand.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/admission"
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(56,189,248,0.35)] transition-all"
          >
            Apply for Admission →
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all"
          >
            Contact Campus
          </Link>
        </div>
      </div>
    </div>
  );
}

