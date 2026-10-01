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
  { id: 1, src: event12Img, alt: "AIwaken Event" },
  { id: 2, src: event1Img, alt: "AIwaken Event" },
  { id: 3, src: event8Img, alt: "AIwaken Event" },
  { id: 4, src: event10Img, alt: "AIwaken Event" },
  { id: 5, src: event7Img, alt: "AIwaken Event" },
  { id: 6, src: event9Img, alt: "AIwaken Event" },
  { id: 7, src: event11Img, alt: "AIwaken Event" },
];

export default function OurEventsSection() {
  const [activeSubEvent, setActiveSubEvent] = useState("aiwaken");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : eventImages.length - 1));
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev < eventImages.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  return (
    <section id="our-events" className="py-20 md:py-28 px-5 md:px-12 lg:px-20 border-b-2 border-[#050521] bg-white relative overflow-hidden">
      
      {/* Background Subtle Tech Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c6ff34]/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#050521]/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#c6ff34]/20 border-2 border-[#050521]">
              <span className="w-2 h-2 rounded-full bg-[#050521] animate-pulse" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-[#050521]">
                Deepstaq Events
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-[#050521]">
              OUR <span className="text-stroke-dark">EVENTS.</span>
            </h2>
          </div>

          {/* Sub Events */}
          <div className="flex flex-wrap items-center gap-3">
          
            {subEventsList.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubEvent(sub.id)}
                className={`px-5 py-2.5 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider border-2 border-[#050521] transition-all cursor-pointer ${
                  activeSubEvent === sub.id
                    ? "bg-[#050521] text-[#c6ff34] shadow-[4px_4px_0px_0px_#c6ff34] -translate-y-0.5"
                    : "bg-white text-[#050521] hover:bg-slate-100 shadow-[3px_3px_0px_0px_#050521]"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Images Gallery (Only Images, No Extra Text, Clean Images) ── */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {eventImages.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="break-inside-avoid mb-6"
            >
              <div
                onClick={() => setLightboxIndex(index)}
                className="group relative rounded-2xl md:rounded-3xl overflow-hidden border-2 border-[#050521] bg-slate-100 shadow-[6px_6px_0px_0px_#050521] hover:shadow-[10px_10px_0px_0px_#c6ff34] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-auto block object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* ── Fullscreen Clean Lightbox Modal ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(null)}
              className="fixed inset-0 bg-[#050521]/90 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center z-10"
            >
              {/* Top Controls */}
              <div className="w-full flex items-center justify-between pb-3 px-2">
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-[#c6ff34]">
                  {lightboxIndex + 1} / {eventImages.length}
                </span>

                <button
                  onClick={() => setLightboxIndex(null)}
                  className="w-10 h-10 rounded-full bg-[#050521] text-white hover:bg-[#c6ff34] hover:text-[#050521] border-2 border-white flex items-center justify-center transition-colors cursor-pointer shadow-lg"
                  aria-label="Close image preview"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Clean Image View */}
              <div className="relative w-full max-h-[80vh] flex items-center justify-center overflow-hidden rounded-2xl md:rounded-3xl border-2 border-[#050521] bg-black shadow-2xl">
                <img
                  src={eventImages[lightboxIndex].src}
                  alt={eventImages[lightboxIndex].alt}
                  className="max-h-[80vh] w-auto max-w-full object-contain"
                />

                {/* Left Arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : eventImages.length - 1));
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#050521]/80 hover:bg-[#c6ff34] hover:text-[#050521] text-white border border-white/30 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-lg"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right Arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev < eventImages.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#050521]/80 hover:bg-[#c6ff34] hover:text-[#050521] text-white border border-white/30 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-lg"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
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
