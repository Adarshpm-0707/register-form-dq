import React from "react";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────
   TICKER TAPE
───────────────────────────────────────────── */
const tickerItems = [
  "CREATIVE DESIGNING",
  "DIGITAL MARKETING",
  "AI PROMPT ENGINEERING",
  "ADOBE PHOTOSHOP & ILLUSTRATOR",
  "CANVA & FIGMA",
  "META ADS & LINKEDIN",
  "OFFLINE TRAINING KANNUR",
  "REAL CLIENT PROJECTS",
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
          <span
            key={i}
            className="text-[#050521] font-black text-[10px] md:text-[11px] tracking-[0.25em] uppercase mr-12 flex items-center gap-2"
          >
            <span className="w-2 h-2 rotate-45 bg-[#050521] inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GENERAL SVG ICONS
───────────────────────────────────────────── */
const Icons = {
  Palette: ({ className = "w-6 h-6" }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
    </svg>
  ),
  TrendingUp: ({ className = "w-6 h-6" }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  ),
  Cpu: ({ className = "w-6 h-6" }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
      />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  Phone: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  ),
  MapPin: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  Target: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  ),
  UserGroup: ({ className = "w-6 h-6" }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  Briefcase: ({ className = "w-6 h-6" }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"
      />
    </svg>
  ),
  AcademicCap: ({ className = "w-6 h-6" }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 14l9-5-9-5-9 5 9 5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
      />
    </svg>
  ),
  Sparkles: ({ className = "w-6 h-6" }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  ),
  ShieldCheck: ({ className = "w-6 h-6" }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
};

/* ─────────────────────────────────────────────
   AUTHENTIC BRAND LOGO COMPONENTS
   100% Guaranteed Visibility · Standalone & Inline SVG Assets
───────────────────────────────────────────── */
const ToolLogos = {
  Photoshop: () => (
    <div className="w-16 h-16 rounded-2xl bg-[#001E36] border border-[#31A8FF]/30 flex items-center justify-center shadow-md">
      <span className="text-[#31A8FF] font-black text-2xl tracking-tighter select-none font-sans">
        Ps
      </span>
    </div>
  ),
  Illustrator: () => (
    <div className="w-16 h-16 rounded-2xl bg-[#330000] border border-[#FF9A00]/30 flex items-center justify-center shadow-md">
      <span className="text-[#FF9A00] font-black text-2xl tracking-tighter select-none font-sans">
        Ai
      </span>
    </div>
  ),
  Firefly: () => (
    <img
      src="/icons/firefly.svg"
      alt="Adobe Firefly logo"
      className="w-16 h-16 rounded-2xl shadow-sm object-contain"
    />
  ),
  Canva: () => (
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7D2AE7] to-[#00C4CC] flex items-center justify-center shadow-md">
      <span className="text-white font-black text-lg italic tracking-tight select-none font-serif">
        Canva
      </span>
    </div>
  ),
  ChatGPT: () => (
    <img
      src="/icons/chatgpt.svg"
      alt="ChatGPT logo"
      className="w-16 h-16 rounded-2xl shadow-sm object-contain"
    />
  ),
  Gemini: () => (
    <img
      src="/icons/gemini.svg"
      alt="Google Gemini logo"
      className="w-16 h-16 rounded-2xl shadow-sm object-contain bg-white border border-slate-200 p-1.5"
    />
  ),


  Meta: () => (
    <img
      src="/icons/meta.svg"
      alt="Meta logo"
      className="w-16 h-16 rounded-2xl shadow-sm object-contain bg-white border border-slate-200 p-2.5"
    />
  ),
  LinkedIn: () => (
    <div className="w-16 h-16 rounded-2xl bg-[#0A66C2] flex items-center justify-center shadow-md">
      <svg
        className="w-9 h-9 text-white fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    </div>
  ),
};

export default function Programs() {
  const targetAudience = [
    {
      title: "Diploma Holders",
      desc: "Bridge the gap between theoretical qualifications and real industry expectations.",
      tag: "01",
    },

    {
      title: "Students Seeking Industry Exposure",
      desc: "Experience actual agency workflows and real-world client briefs.",
      tag: "02",
    },
    {
      title: "Aspiring Graphic Designers",
      desc: "Master visual storytelling, branding identity, and modern design suites.",
      tag: "03",
    },

    {
      title: "Freelancers & Entrepreneurs",
      desc: "Acquire full-stack creative & marketing capabilities to grow your brand.",
      tag: "04",
    },
  ];

  const whatYouWillLearn = [
    {
      icon: Icons.Palette,
      category: "CREATIVE DESIGNING",
      subtitle: "Visual Communication & Branding",
      desc: "Learn visual communication, branding identity, social media design, advertising creatives, and industry-standard design workflows.",
      tools: ["Adobe Photoshop", "Adobe Illustrator", "Canva", "Figma"],
      color: "from-purple-500/10 to-indigo-500/10",
    },
    {
      icon: Icons.TrendingUp,
      category: "DIGITAL MARKETING",
      subtitle: "Performance & Campaign Strategy",
      desc: "Master social media marketing, SEO, content strategy, Meta Ads, LinkedIn marketing, and digital campaign planning.",
      tools: [
        "Meta Business Suite",
        "LinkedIn",
        "SEO Platforms",
        "Content Strategy",
      ],
      color: "from-lime-500/10 to-emerald-500/10",
    },
    {
      icon: Icons.Cpu,
      category: "AI PROMPT ENGINEERING",
      subtitle: "Modern AI Tool Orchestration",
      desc: "Use cutting-edge AI tools to dramatically improve creativity, productivity, content creation, deep research, and marketing workflows.",
      tools: [
        "ChatGPT",
        "Google Gemini",
        "AI Creative Tools",
        "Workflow Automation",
      ],
      color: "from-blue-500/10 to-cyan-500/10",
    },
  ];

  const whyChooseUs = [
    {
      title: "100% Practical Training",
      desc: "Every session focuses on learning by doing through practical assignments and hands-on exercises.",
      icon: Icons.Target,
    },
    {
      title: "Real Client Projects",
      desc: "Gain real experience by working on projects inspired by actual businesses and agency workflows.",
      icon: Icons.Briefcase,
    },
    {
      title: "Industry Mentorship",
      desc: "Learn directly from practitioners who work in design, digital marketing, and AI industries.",
      icon: Icons.AcademicCap,
    },
    {
      title: "AI-Enhanced Workflow",
      desc: "Learn how to integrate ChatGPT, Gemini, and Midjourney to 10x your creative output.",
      icon: Icons.Sparkles,
    },
    {
      title: "Portfolio Development",
      desc: "Graduate with a comprehensive, industry-reviewed portfolio showcasing real-world skills.",
      icon: Icons.ShieldCheck,
    },
  ];

  const toolsList = [
    {
      name: "Adobe Photoshop",
      category: "Design",
      cdnUrl: "https://cdn.simpleicons.org/adobephotoshop/31A8FF",
      LogoComponent: ToolLogos.Photoshop,
    },
    {
      name: "Adobe Illustrator",
      category: "Vector",
      cdnUrl: "https://cdn.simpleicons.org/adobeillustrator/FF9A00",
      LogoComponent: ToolLogos.Illustrator,
    },
    {
      name: "Adobe Firefly",
      category: "Generative AI",
      cdnUrl: "https://cdn.simpleicons.org/adobe/FF0000",
      LogoComponent: ToolLogos.Firefly,
    },
    {
      name: "Canva",
      category: "Graphics",
      cdnUrl: "https://cdn.simpleicons.org/canva/00C4CC",
      LogoComponent: ToolLogos.Canva,
    },
    {
      name: "ChatGPT",
      category: "AI LLM",
      cdnUrl: "https://cdn.simpleicons.org/openai/10A37F",
      LogoComponent: ToolLogos.ChatGPT,
    },
    {
      name: "Google Gemini",
      category: "AI LLM",
      cdnUrl: "https://cdn.simpleicons.org/googlegemini/8E75FF",
      LogoComponent: ToolLogos.Gemini,
    },
    {
      name: "Meta Business Suite",
      category: "Ads",
      cdnUrl: "https://cdn.simpleicons.org/meta/0467DF",
      LogoComponent: ToolLogos.Meta,
    },
    {
      name: "LinkedIn",
      category: "Marketing",
      cdnUrl: "https://cdn.simpleicons.org/linkedin/0A66C2",
      LogoComponent: ToolLogos.LinkedIn,
    },
  ];

  const programHighlights = [
    "6 Months Intensive Offline Training",
    "100% Practical Learning",
    "No Boring Theory",
    "Real Client Projects",
    "Agency-Style Workflows",
    "Portfolio Building",
    "Industry Mentorship",
    "AI-Powered Learning",
    "Career Guidance",
    "Training Completion Certificate",
  ];

  return (
    <div className="min-h-screen bg-white text-[#050521] overflow-x-clip font-sans pt-20">
      {/* ─────────────────────────────────────────────
          HERO SECTION — REDESIGNED
      ───────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────
          HERO SECTION — HOME PAGE STYLE DESIGN
      ───────────────────────────────────────────── */}
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
                transition={{
                  type: "spring",
                  stiffness: 70,
                  damping: 12,
                  delay: 0.1,
                }}
                className="text-[10vw] sm:text-[clamp(2.5rem,5vw,5.5rem)] text-stroke-dark-lg font-black uppercase leading-[0.85] tracking-tighter"
              >
                Creative Pro
              </motion.h1>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: 12,
                  delay: 0.2,
                }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-3"
              >
                <span className="bg-[#050521] text-[#c6ff34] px-5 py-2.5 rounded-2xl text-[8vw] sm:text-[clamp(2rem,4vw,4.5rem)] font-black uppercase leading-none shadow-[4px_4px_0px_0px_#c6ff34] border border-[#c6ff34]/20">
                  in 6 Months
                </span>
              </motion.div>
            </div>

            <p className="mt-6 sm:mt-8 text-slate-700 text-sm sm:text-base md:text-lg max-w-xl font-medium leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
              Master Creative Designing, Digital Marketing, and AI Prompt
              Engineering through an intensive 6-month practical training
              program designed for beginners and aspiring professionals.
            </p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.45,
              }}
              className="mt-8 sm:mt-12 flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto items-center justify-center lg:justify-start"
            >
              <a
                href="https://wa.me/919495957011?text=Hello%20Deepstaq%2C%20I%20am%20interested%20in%20your%206-Month%20Creative%20Pro%20Program."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <button className="w-full px-12 py-5 bg-[#050521] text-white font-black text-sm md:text-base uppercase tracking-widest rounded-xl shadow-[6px_6px_0px_0px_#c6ff34] active:translate-y-1 active:shadow-none transition-all hover:scale-105 duration-200 flex items-center justify-center gap-3">
                  <svg
                    className="w-5 h-5 fill-current text-[#c6ff34]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.285-.143-1.685-.832-1.947-.927-.262-.095-.453-.143-.644.143-.191.285-.738.927-.905 1.117-.167.191-.334.214-.619.071-.285-.143-1.206-.445-2.298-1.418-.849-.757-1.423-1.692-1.59-1.977-.167-.285-.018-.439.125-.581.129-.128.285-.334.428-.5.143-.167.19-.285.285-.476.095-.191.047-.357-.024-.5-.071-.143-.644-1.551-.882-2.12-.231-.555-.468-.48-.644-.488-.166-.008-.357-.01-.548-.01-.191 0-.5.071-.762.357s-1.001.977-1.001 2.382c0 1.405 1.024 2.763 1.167 2.954.143.191 2.014 3.076 4.88 4.316.682.295 1.214.471 1.629.603.685.218 1.309.187 1.802.114.549-.081 1.685-.689 1.923-1.355.238-.666.238-1.236.167-1.355-.071-.119-.262-.19-.547-.333z" />
                  </svg>
                  <span>Contact Us</span>
                </button>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Program Details Showcase Card (No Image) */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 14,
              delay: 0.3,
            }}
            className="lg:col-span-6 w-full mt-4 lg:mt-0"
          >
            <div className="bg-white border-2 border-[#050521] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_#050521] space-y-6 relative overflow-hidden">
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-[#050521]/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#c6ff34] border border-[#050521] shadow-[2px_2px_0px_0px_#050521]" />
                  <span className="font-black text-xs uppercase tracking-widest text-[#050521]">
                    Program Highlights
                  </span>
                </div>
                <span className="bg-[#c6ff34] text-[#050521] text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-[#050521]">
                  6 Months Offline
                </span>
              </div>

              {/* 3 Core Curriculum Modules */}
              <div className="space-y-3">
                {[
                  {
                    num: "01",
                    title: "Creative Designing",
                    desc: "Adobe Photoshop · Illustrator · Canva · Figma · Branding",
                    color: "bg-purple-100 border-purple-300",
                  },
                  {
                    num: "02",
                    title: "Digital Marketing",
                    desc: "Meta Ads · Search Engine Optimization · LinkedIn · Campaigns",
                    color: "bg-emerald-100 border-emerald-300",
                  },
                  {
                    num: "03",
                    title: "AI Prompt Engineering",
                    desc: "ChatGPT · Google Gemini · Midjourney · Generative AI",
                    color: "bg-blue-100 border-blue-300",
                  },
                ].map((m) => (
                  <div
                    key={m.num}
                    className="group flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border-2 border-[#050521] shadow-[3px_3px_0px_0px_#050521] hover:shadow-[5px_5px_0px_0px_#c6ff34] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span className="w-8 h-8 rounded-xl bg-[#050521] text-[#c6ff34] font-black text-xs flex items-center justify-center shrink-0">
                      {m.num}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-sm uppercase tracking-tight text-[#050521]">
                        {m.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Features Badge */}
              <div className="bg-[#c6ff34]/20 border-2 border-[#050521] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#c6ff34] border border-[#050521] flex items-center justify-center font-black text-xs text-[#050521] shrink-0">
                  ✓
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#050521]">
                    100% Practical Training
                  </p>
                  <p className="text-xs text-slate-600 font-mono">
                    Real client projects & agency-level portfolio building in
                    Kannur.
                  </p>
                </div>
              </div>

              {/* Quick Numbers Row */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                {[
                  { val: "6", label: "Months" },
                  { val: "3", label: "Pillars" },
                  { val: "8+", label: "Tools" },
                ].map((st, i) => (
                  <div
                    key={i}
                    className="text-center p-3 rounded-xl bg-slate-100 border border-[#050521]/15"
                  >
                    <p className="text-lg font-black text-[#050521] leading-none">
                      {st.val}
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">
                      {st.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          TICKER BAR
      ───────────────────────────────────────────── */}
      <Ticker />

      {/* ─────────────────────────────────────────────
          WHO IS THIS TRAINING PROGRAM FOR?
      ───────────────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 bg-slate-50/70 border-b-2 border-[#050521]">
        <div className="max-w-[1300px] mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-[#050521] bg-[#c6ff34] border border-[#050521] px-4 py-1.5 rounded-full inline-block">
                Target Audience
              </span>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter">
                Who Is This
                <br />
                <span className="text-stroke-dark">Training Program For?</span>
              </h2>
            </div>
            <div className="bg-white border-2 border-[#050521] p-4 rounded-2xl shadow-[4px_4px_0px_0px_#050521] max-w-md">
              <span className="text-xs font-black uppercase tracking-wider text-[#050521] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c6ff34] border border-[#050521]" />
                Zero Barrier to Entry
              </span>
              <p className="text-xs text-slate-600 font-mono mt-1">
                No prior industry experience is required. We take you
                step-by-step from core basics to agency-ready performance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {targetAudience.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white border-2 border-[#050521] rounded-2xl p-6 shadow-[6px_6px_0px_0px_#050521] hover:shadow-[10px_10px_0px_0px_#c6ff34] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-[#050521]/15 group-hover:text-[#050521] transition-colors">
                      {item.tag}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#c6ff34]/30 border border-[#050521] flex items-center justify-center">
                      <Icons.Check className="w-4 h-4 text-[#050521]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-[#050521] group-hover:text-[#050521]">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          WHAT YOU'LL LEARN (3 CORE PILLARS)
      ───────────────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 border-b-2 border-[#050521]">
        <div className="max-w-[1300px] mx-auto space-y-16">
          <div className="space-y-4 text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-widest text-[#050521] bg-[#c6ff34] border border-[#050521] px-4 py-1.5 rounded-full inline-block">
              Curriculum Pillars
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter">
              What You'll <span className="text-stroke-dark">Learn.</span>
            </h2>
            <p className="text-slate-600 font-mono text-sm max-w-xl">
              Comprehensive 3-in-1 skill stack designed to make you an
              indispensable creative professional in today's AI-driven market.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {whatYouWillLearn.map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative bg-white border-2 border-[#050521] rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_#050521] hover:shadow-[12px_12px_0px_0px_#c6ff34] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-[#050521] text-[#c6ff34] flex items-center justify-center shadow-[4px_4px_0px_0px_#c6ff34]">
                      <pillar.icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-mono font-black uppercase tracking-widest text-[#050521]/40">
                      Module 0{idx + 1}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-[#050521]">
                      {pillar.category}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#050521]/70 bg-slate-100 px-3 py-1 rounded-md inline-block">
                      {pillar.subtitle}
                    </p>
                  </div>

                  <p className="text-sm font-mono text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                {/* Tools Grid */}
                <div className="mt-8 pt-6 border-t-2 border-[#050521]/10 space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#050521]/60">
                    Mastered Capabilities:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pillar.tools.map((t, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-bold text-[#050521] bg-[#c6ff34]/20 border border-[#050521]/20 px-3 py-1 rounded-lg"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          WHY CHOOSE DEEPSTAQ?
      ───────────────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 bg-[#050521] text-white border-b-2 border-[#050521] relative overflow-hidden">
        <div className="max-w-[1300px] mx-auto space-y-16 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-widest text-[#050521] bg-[#c6ff34] px-4 py-1.5 rounded-full inline-block">
              The Deepstaq Advantage
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white">
              Why Choose <span className="text-[#c6ff34]">Deepstaq?</span>
            </h2>
            <p className="text-slate-400 font-mono text-sm leading-relaxed">
              We replace outdated academic theory with real agency experience,
              industry mentors, and portfolio-driven practical learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-[#c6ff34] hover:bg-white/10 transition-all duration-300 space-y-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#c6ff34] text-[#050521] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-[#c6ff34] transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 font-mono text-xs leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          TOOLS YOU'LL MASTER (BRAND LOGOS)
      ───────────────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 border-b-2 border-[#050521] bg-slate-50/50">
        <div className="max-w-[1300px] mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-[#050521] bg-[#c6ff34] border border-[#050521] px-4 py-1.5 rounded-full inline-block">
                Industry Standard Tech
              </span>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter">
                Tools You'll <span className="text-stroke-dark">Master.</span>
              </h2>
            </div>
            <p className="text-slate-600 font-mono text-sm max-w-md">
              Gain proficiency in top creative design suites, generative AI
              engines, and marketing platforms used by leading global agencies.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {toolsList.map((tool, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className="bg-white border-2 border-[#050521] p-6 rounded-2xl shadow-[6px_6px_0px_0px_#050521] hover:shadow-[10px_10px_0px_0px_#c6ff34] hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-between gap-4 text-center group"
              >
                <div className="group-hover:scale-110 transition-transform duration-200">
                  <tool.LogoComponent />
                </div>
                <div className="space-y-1 w-full">
                  <div className="text-sm md:text-base font-black uppercase tracking-tight text-[#050521] leading-tight">
                    {tool.name}
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-[#050521]/60 bg-slate-100 px-2.5 py-0.5 rounded-full inline-block border border-slate-200">
                    {tool.category}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          PROGRAM HIGHLIGHTS & VISION QUOTE
      ───────────────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 border-b-2 border-[#050521]">
        <div className="max-w-[1300px] mx-auto space-y-16">
          {/* Quote Banner */}
          <div className="bg-[#c6ff34] border-2 border-[#050521] rounded-[2.5rem] p-8 md:p-14 shadow-[12px_12px_0px_0px_#050521] text-center space-y-6">
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#050521] leading-tight">
              Build Skills. Build Confidence. Build Your Career.
            </h3>
            <p className="text-base md:text-lg font-medium text-[#050521]/80 max-w-3xl mx-auto leading-relaxed">
              Whether your goal is to land your first job, become a freelancer,
              or start your own creative journey, Deepstaq's 6-Month Intensive
              Training Program gives you the practical skills and real-world
              experience to take the next step with confidence.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <span className="bg-[#050521] text-[#c6ff34] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                📍 Offline Training | Kannur
              </span>
              <span className="bg-white text-[#050521] border border-[#050521] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                🎯 Admissions Open | Limited Seats
              </span>
            </div>
          </div>

          {/* Checklist Highlights */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black uppercase tracking-tight">
                Program Highlights
              </h3>
              <p className="text-xs font-mono text-slate-500">
                Everything included in your 6-month hands-on journey
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {programHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-[#050521] p-4 rounded-xl shadow-[4px_4px_0px_0px_#050521] flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-[#c6ff34] border border-[#050521] flex items-center justify-center shrink-0">
                    <Icons.Check className="w-3.5 h-3.5 text-[#050521]" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-tight text-[#050521]">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
