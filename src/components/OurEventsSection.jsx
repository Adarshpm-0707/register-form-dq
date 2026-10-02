import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Real event images from src/assets/events/
import event1Img from "../assets/events/event (1).jpg";
import event7Img from "../assets/events/event (7).jpg";
import event8Img from "../assets/events/event (8).jpg";
import event9Img from "../assets/events/event (9).jpg";
import event10Img from "../assets/events/event (10).jpg";
import event11Img from "../assets/events/event (11).jpg";
import event12Img from "../assets/events/event (12).jpg";

const subEventsList = [
  { id: "aiwaken", name: "AIwaken" }
];

const eventImages = [
  {
    id: 1,
    src: event12Img,
    alt: "AIwaken Event - Keynote & Welcome",
    title: "Keynote & Welcome Session",
    desc: "Opening address introducing advanced AI paradigms, industry applications, and deep learning roadmaps to aspiring developers."
  },
  {
    id: 2,
    src: event1Img,
    alt: "AIwaken Event - Practical AI Workshop",
    title: "Hands-on Practical AI Workshop",
    desc: "Atheef Abdurahman leading an intensive live demonstration on building and deploying production-grade AI models."
  },
  {
    id: 3,
    src: event8Img,
    alt: "AIwaken Event - Student Collaboration",
    title: "Interactive Student Collaboration",
    desc: "Students and tech enthusiasts gathered in full capacity, engaging in discussions and collaborative AI challenges."
  },
  {
    id: 4,
    src: event10Img,
    alt: "AIwaken Event - Machine Learning Lab",
    title: "Real-time Machine Learning Lab",
    desc: "Deep-dive session exploring data pipelines, neural network architectures, and real-world evaluation metrics."
  },
  {
    id: 5,
    src: event7Img,
    alt: "AIwaken Event - Live Mentorship",
    title: "Live Mentorship & Project Demo",
    desc: "One-on-one architectural guidance and technical review for participants building real-world intelligent applications."
  },
  {
    id: 6,
    src: event9Img,
    alt: "AIwaken Event - Q&A Discussions",
    title: "Tech Q&A & Open Discussions",
    desc: "In-depth discussions addressing real-world deployment challenges, LLMOps, and the future landscape of Artificial Intelligence."
  },
  {
    id: 7,
    src: event11Img,
    alt: "AIwaken Event - Event Highlights",
    title: "Event Concluding Highlights",
    desc: "Closing moments celebrating student achievements, certificate distributions, and next steps in the Deepstaq journey."
  },
];

// Directional slide animation variants (Right to Left when next, Left to Right when prev)
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 320, damping: 32 },
      opacity: { duration: 0.3 },
      scale: { duration: 0.3 },
    },
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 0.96,
    transition: {
      x: { type: "spring", stiffness: 320, damping: 32 },
      opacity: { duration: 0.25 },
      scale: { duration: 0.25 },
    },
  }),
};

export default function OurEventsSection() {
  const [activeSubEvent, setActiveSubEvent] = useState("aiwaken");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right-to-left (next), -1 = left-to-right (prev)
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Navigate to next or previous slide
  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (newDirection > 0) {
        return prev < eventImages.length - 1 ? prev + 1 : 0;
      }
      return prev > 0 ? prev - 1 : eventImages.length - 1;
    });
  };

  // Jump to specific slide
  const goToSlide = (targetIndex) => {
    if (targetIndex === currentIndex) return;
    setDirection(targetIndex > currentIndex ? 1 : -1);
    setCurrentIndex(targetIndex);
  };

  // Auto-play slideshow (moving right-to-left)
  useEffect(() => {
    if (!isPlaying || isHovered || lightboxIndex !== null) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 4200);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, lightboxIndex, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex !== null) {
        if (e.key === "Escape") setLightboxIndex(null);
        if (e.key === "ArrowLeft") {
          setLightboxIndex((prev) => (prev > 0 ? prev - 1 : eventImages.length - 1));
        }
        if (e.key === "ArrowRight") {
          setLightboxIndex((prev) => (prev < eventImages.length - 1 ? prev + 1 : 0));
        }
      } else {
        if (e.key === "ArrowLeft") {
          paginate(-1); // move left to right
        } else if (e.key === "ArrowRight") {
          paginate(1); // move right to left
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  const currentImage = eventImages[currentIndex];

  return (
    <section id="our-events" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 md:px-10 lg:px-16 border-b-2 border-[#050521] bg-white relative overflow-hidden select-none">
      
      {/* Subtle Tech Dot Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#050521_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none" />

      {/* Soft Ambient Glows */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-[#c6ff34]/15 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/3 -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#050521]/5 rounded-full blur-[130px] pointer-events-none translate-y-1/3 -translate-x-1/3 -z-10" />

      <div className="max-w-[1360px] mx-auto relative z-10">

        {/* ── Section Header (Always on Top across Mobile & Desktop) ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
          <div className="space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c6ff34]/25 border-2 border-[#050521]">
              <span className="w-2 h-2 rounded-full bg-[#050521] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#050521]">
                Deepstaq Highlights
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-[#050521]">
              OUR <span className="text-stroke-dark">EVENTS.</span>
            </h2>
          </div>

          {/* Sub Event Selector & Slide Counter Pill */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {subEventsList.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubEvent(sub.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[#050521] transition-all cursor-pointer ${
                  activeSubEvent === sub.id
                    ? "bg-[#050521] text-[#c6ff34] shadow-[3px_3px_0px_0px_#c6ff34]"
                    : "bg-white text-[#050521] hover:bg-slate-100 shadow-[2px_2px_0px_0px_#050521]"
                }`}
              >
                {sub.name}
              </button>
            ))}

            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-[#050521] bg-white text-xs font-mono font-black text-[#050521] shadow-[2px_2px_0px_0px_#050521]">
              <span className="text-slate-500 font-bold">SLIDE</span>
              <span className="px-2 py-0.5 rounded bg-[#050521] text-[#c6ff34]">
                {String(currentIndex + 1).padStart(2, "0")} / {String(eventImages.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* ── Main Content Grid: Image directly under 'OUR EVENTS' on Mobile, Side-by-Side on Laptop ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* ── Image Showcase Card: Positioned first on Mobile (under OUR EVENTS text), Right on Laptop ── */}
          <div className="lg:col-span-6 xl:col-span-7 flex justify-center items-center w-full order-1 lg:order-2">
            
            <div
              className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] lg:max-w-[430px] xl:max-w-[470px] mx-auto"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Neo-brutalist Offset Accent Plate (Contained, Zero Overflow) */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-[#c6ff34] border-2 border-[#050521] translate-x-2 sm:translate-x-3 translate-y-2 sm:translate-y-3 -z-10" />

              {/* Main Photo Card Frame */}
              <div className="relative aspect-[3/4] max-h-[52vh] sm:max-h-[58vh] lg:max-h-[490px] xl:max-h-[530px] w-full rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-3 border-[#050521] bg-white shadow-xl cursor-pointer group">

                {/* Top Corner Floating Badges */}
                <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-20 flex items-center justify-between pointer-events-none">
                  {/* Event Badge */}
                  <div className="pointer-events-auto flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#050521] text-[#050521] text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-md">
                    <span className="w-2 h-2 rounded-full bg-[#050521] animate-ping" />
                    <span>AIwaken Moments</span>
                  </div>

                  {/* Counter Pill + Fullscreen Trigger */}
                  <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
                    <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#050521] text-[11px] sm:text-xs font-mono font-bold text-white shadow-md">
                      <span className="text-[#c6ff34]">{String(currentIndex + 1).padStart(2, "0")}</span>
                      <span className="text-white/40 mx-1">/</span>
                      <span>{String(eventImages.length).padStart(2, "0")}</span>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxIndex(currentIndex);
                      }}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-[#c6ff34] text-[#050521] border border-[#050521] flex items-center justify-center transition-all cursor-pointer shadow-md"
                      title="Expand to Fullscreen"
                      aria-label="Expand image"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Sliding Image Showcase with Framer Motion AnimatePresence */}
                <div className="relative w-full h-full overflow-hidden">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                      key={currentImage.id}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(e, { offset, velocity }) => {
                        const swipe = Math.abs(offset.x) * velocity.x;
                        if (swipe < -6000 || offset.x < -50) {
                          paginate(1); // Swipe left -> advance right to left
                        } else if (swipe > 6000 || offset.x > 50) {
                          paginate(-1); // Swipe right -> move left to right
                        }
                      }}
                      onClick={() => setLightboxIndex(currentIndex)}
                      className="absolute inset-0 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                    >
                      {/* The Full Image (Clean aspect fit, zero dead borders) */}
                      <img
                        src={currentImage.src}
                        alt={currentImage.alt}
                        className="w-full h-full object-cover object-top select-none pointer-events-none transition-transform duration-500 group-hover:scale-[1.02]"
                        draggable={false}
                      />

                      {/* Subtle Click-to-Enlarge Overlay Indicator on Hover */}
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <div className="px-3.5 py-1.5 rounded-full bg-[#050521]/90 border border-[#c6ff34] text-[#c6ff34] text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-2xl">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                          <span>Zoom Fullscreen</span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Bottom Overlay Pill (Mobile Context) */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20 pointer-events-none lg:hidden">
                  <div className="pointer-events-auto bg-[#050521]/90 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white flex items-center justify-between shadow-xl">
                    <p className="text-xs font-bold text-white tracking-tight line-clamp-1">
                      {currentImage.title}
                    </p>
                    <span className="text-[10px] font-mono text-[#c6ff34] ml-2 shrink-0">
                      0{currentIndex + 1}/0{eventImages.length}
                    </span>
                  </div>
                </div>

                {/* Left Tap Control on Card (Always accessible without overflowing) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(-1);
                  }}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-[#c6ff34] text-[#050521] border border-[#050521] shadow-md flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Previous image"
                  title="Previous (Left to Right)"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right Tap Control on Card (Always accessible without overflowing) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-[#c6ff34] text-[#050521] border border-[#050521] shadow-md flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Next image"
                  title="Next (Right to Left)"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

              </div>
            </div>

          </div>

          {/* ── Slide Details & Direct Controls: Positioned below Image on Mobile, Left on Laptop ── */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center space-y-5 sm:space-y-6 order-2 lg:order-1">

            {/* Dynamic Event Counter & Active Slide Details Card */}
            <div className="bg-slate-50 border-2 border-[#050521] rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#050521] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-[#050521] tracking-tighter leading-none">
                    0{currentIndex + 1}
                  </span>
                  <span className="text-base sm:text-lg font-mono text-slate-400 font-bold">
                    / 0{eventImages.length}
                  </span>
                </div>

                <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#c6ff34] border border-[#050521] text-[#050521]">
                  Slide {currentIndex + 1}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-tight text-[#050521] leading-snug">
                    {currentImage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1.5 leading-relaxed">
                    {currentImage.desc}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Live Slide Countdown Bar */}
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mt-2">
                <motion.div
                  key={`${currentIndex}-${isPlaying}-${isHovered}`}
                  initial={{ width: "0%" }}
                  animate={{ width: isPlaying && !isHovered ? "100%" : "0%" }}
                  transition={{ duration: 4.2, ease: "linear" }}
                  className="h-full bg-[#c6ff34] border-r border-[#050521]"
                />
              </div>
            </div>

            {/* Navigation & Auto-Play Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Previous Button (Left to Right) */}
              <button
                onClick={() => paginate(-1)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#c6ff34] text-[#050521] border-2 border-[#050521] font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#050521] hover:shadow-[4px_4px_0px_0px_#050521] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                title="Previous Image (Left to Right)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Prev</span>
              </button>

              {/* Next Button (Right to Left) */}
              <button
                onClick={() => paginate(1)}
                className="px-5 py-2.5 rounded-xl bg-[#050521] hover:bg-[#c6ff34] text-[#c6ff34] hover:text-[#050521] border-2 border-[#050521] font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#c6ff34] hover:shadow-[4px_4px_0px_0px_#050521] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                title="Next Image (Right to Left)"
              >
                <span>Next</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Auto-Slide Play/Pause Toggle */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3.5 py-2.5 rounded-xl border-2 border-[#050521] bg-white hover:bg-slate-100 text-xs font-mono font-bold text-[#050521] flex items-center gap-2 shadow-[2px_2px_0px_0px_#050521] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ml-auto"
                title={isPlaying ? "Pause auto-slide" : "Resume auto-slide"}
              >
                {isPlaying ? (
                  <>
                    <span className="w-2 h-2 rounded-xs bg-[#050521]" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <span className="w-0 h-0 border-y-3.5 border-y-transparent border-l-5 border-l-[#050521]" />
                    <span>Play</span>
                  </>
                )}
              </button>
            </div>

            {/* Clickable Pagination Dots */}
            <div className="flex items-center gap-2 pt-1">
              {eventImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? "w-8 bg-[#050521] border border-[#050521]"
                      : "w-2.5 bg-slate-300 hover:bg-slate-500"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* ── Fullscreen Clean Lightbox Modal ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(null)}
              className="fixed inset-0 bg-[#050521]/95 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center z-10"
            >
              {/* Top Controls */}
              <div className="w-full flex items-center justify-between pb-3 px-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-[#c6ff34]">
                    {lightboxIndex + 1} / {eventImages.length}
                  </span>
                  <span className="text-white text-xs sm:text-sm font-semibold hidden sm:inline">
                    {eventImages[lightboxIndex].title}
                  </span>
                </div>

                <button
                  onClick={() => setLightboxIndex(null)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#050521] text-white hover:bg-[#c6ff34] hover:text-[#050521] border-2 border-white flex items-center justify-center transition-colors cursor-pointer shadow-lg"
                  aria-label="Close image preview"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Clean Image View */}
              <div className="relative w-full max-h-[78vh] sm:max-h-[80vh] flex items-center justify-center overflow-hidden rounded-2xl md:rounded-3xl border-2 border-[#050521] bg-black shadow-2xl">
                <img
                  src={eventImages[lightboxIndex].src}
                  alt={eventImages[lightboxIndex].alt}
                  className="max-h-[78vh] sm:max-h-[80vh] w-auto max-w-full object-contain"
                />

                {/* Left Arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : eventImages.length - 1));
                  }}
                  className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#050521]/80 hover:bg-[#c6ff34] hover:text-[#050521] text-white border border-white/30 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-lg"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right Arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev < eventImages.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#050521]/80 hover:bg-[#c6ff34] hover:text-[#050521] text-white border border-white/30 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-lg"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
