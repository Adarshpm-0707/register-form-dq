import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import OurEventsSection from "../components/OurEventsSection";

// Event Archive Photos
import event1Img from "../assets/events/event (1).webp";
import event7Img from "../assets/events/event (7).webp";
import event8Img from "../assets/events/event (8).webp";
import event9Img from "../assets/events/event (9).webp";
import event10Img from "../assets/events/event (10).webp";
import event11Img from "../assets/events/event (11).webp";
import event12Img from "../assets/events/event (12).webp";

const pastEvents = [
  {
    id: 1,
    title: "AIwakening - High Impact AI Keynote",
    category: "Keynote & Summit",
    date: "Special Offline Workshop",
    location: "Deepstaq AI Institute, Kannur",
    img: event12Img,
    badge: "Free AI Workshop",
    desc: "A high-energy offline immersion introducing foundational AI concepts, modern generative capabilities, live tool demonstrations, and direct interactions with industry AI engineers.",
    highlights: ["250+ Attendees", "Live Generative AI Demos", "Hands-on Roadmap Guide"],
  },
  {
    id: 2,
    title: "Hands-on Practical AI & Deep Learning Lab",
    category: "Workshop",
    date: "Weekend Masterclass",
    location: "GPU Lab, Deepstaq Kannur",
    img: event1Img,
    badge: "Hands-on Session",
    desc: "Atheef Abdurahman leading an intensive live demonstration on building, training, and deploying production-grade AI neural models on cloud GPUs.",
    highlights: ["Cloud GPU Deployment", "PyTorch Live Pipeline", "Interactive Debugging"],
  },
  {
    id: 3,
    title: "Student Collaboration & AI Aptitude Assessment",
    category: "Assessment & Cohort",
    date: "Weekly Cohort",
    location: "Deepstaq Auditorium",
    img: event8Img,
    badge: "Aptitude & Diagnostic",
    desc: "Comprehensive diagnostic assessment evaluating algorithmic thinking, logical aptitude, and 1-on-1 personalized career roadmap sessions.",
    highlights: ["Diagnostic Assessment", "1:1 Career Mentorship", "Scholarship Opportunities"],
  },
  {
    id: 4,
    title: "Prompt Engineering & LLM Architecture",
    category: "Masterclass",
    date: "1-Month Track",
    location: "Deepstaq Lab Pods",
    img: event10Img,
    badge: "Intensive Lab",
    desc: "Deep-dive workshop on system prompts, chain-of-thought heuristics, few-shot fine-tuning, and robust structured LLM workflows with LangChain and LlamaIndex.",
    highlights: ["RAG Systems", "Vector Search with Pinecone", "Prompt Evaluation"],
  },
  {
    id: 5,
    title: "1-on-1 Architectural Mentorship & Project Demos",
    category: "Mentorship",
    date: "Cohort Demo Day",
    location: "Deepstaq Innovation Hub",
    img: event7Img,
    badge: "1:1 Review",
    desc: "One-on-one architectural guidance and technical review for participants building real-world intelligent applications and multi-agent systems.",
    highlights: ["Code Reviews", "System Design Guidance", "Production Best Practices"],
  },
  {
    id: 6,
    title: "Tech Q&A & Future AI Landscape",
    category: "Community",
    date: "Open Forum",
    location: "Deepstaq Amphitheatre",
    img: event9Img,
    badge: "Open Discussion",
    desc: "In-depth discussions addressing real-world deployment challenges, LLMOps, autonomous agentic frameworks, and the shifting tech career landscape.",
    highlights: ["Open Forum Discussion", "Industry Insights", "Networking Session"],
  },
  {
    id: 7,
    title: "Event Concluding Highlights & Certifications",
    category: "Ceremony",
    date: "Convocation",
    location: "Deepstaq Campus",
    img: event11Img,
    badge: "Milestone",
    desc: "Closing moments celebrating student achievements, capstone demonstrations, certificate distributions, and launching into new tech careers.",
    highlights: ["Project Showcases", "Certificate Distribution", "Community Dinner"],
  },
];

export default function Events() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const categories = ["All", "Keynote & Summit", "Workshop", "Masterclass", "Community"];

  const filteredEvents =
    activeCategory === "All"
      ? pastEvents
      : pastEvents.filter((item) => item.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto text-white overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          Community & Events Hub
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Deepstaq Events & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400">
            Workshops Archive
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
          Explore our offline summits, hands-on masterclasses, demo days, and collaborative community sessions conducted at the Deepstaq AI Institute in Kannur.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/consultation"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-[0_4px_20px_rgba(56,189,248,0.35)] transition-all"
          >
            Attend Next Workshop →
          </Link>
          <a
            href="#archive"
            className="px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-medium text-xs sm:text-sm transition-all"
          >
            Browse Past Events
          </a>
        </div>
      </div>

      {/* Featured Interactive Slider Section */}
      <div className="mb-20">
        <OurEventsSection />
      </div>

      {/* Category Filter Bar */}
      <div id="archive" className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Past Events Archive
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse through real photographs and key takeaways from our sessions.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-sky-400 text-slate-950 shadow-[0_2px_12px_rgba(56,189,248,0.4)]"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            onClick={() => setSelectedEvent(evt)}
            className="group rounded-3xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-sky-400/50 transition-all duration-300 flex flex-col justify-between shadow-xl cursor-pointer"
          >
            {/* Image Frame */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
              <img
                src={evt.img}
                alt={evt.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white">
                {evt.badge}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <span>{evt.category}</span>
                  <span>{evt.date}</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                  {evt.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mt-2">
                  {evt.desc}
                </p>
              </div>

              {/* Highlights Chips */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {evt.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-slate-300"
                  >
                    ✓ {h}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs text-sky-400 font-semibold group-hover:text-sky-300">
                <span>View Event Details</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-[#030917]/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-3xl w-full rounded-3xl overflow-hidden bg-[#07152b] border border-sky-500/20 shadow-2xl z-10"
            >
              <div className="relative aspect-[16/10] w-full bg-black">
                <img
                  src={selectedEvent.img}
                  alt={selectedEvent.title}
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#030917]/80 hover:bg-sky-400 text-white hover:text-slate-950 border border-white/20 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">
                    {selectedEvent.badge}
                  </span>
                  <span className="text-xs text-slate-400">• {selectedEvent.location}</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {selectedEvent.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedEvent.desc}
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  {selectedEvent.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono px-2.5 py-1 rounded-lg bg-sky-400/10 border border-sky-400/30 text-sky-200"
                    >
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

