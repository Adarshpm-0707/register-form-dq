import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * LimitedSeatsSection Component
 *
 * Renders a high-converting, dynamic limited-seat scarcity indicator across
 * all "Register for ₹99" touchpoints on the AI Easy Ayi page.
 *
 * Variants:
 * - "hero": Full featured for Hero section above primary register CTA
 * - "form": Clean urgent alert right above the payment button in form
 * - "cta": Centered scarcity banner above the bottom register button
 * - "sticky": Ultra-compact glowing pill for floating mobile/desktop sticky bar
 */
export default function LimitedSeatsSection({
  seatsLeft = 10,
  lang = "ml",
  variant = "hero",
  className = "",
}) {
  const isMl = lang === "ml";
  const isCritical = seatsLeft <= 4;

  // Capacity calculation (visual urgency progress bar)
  // 10 seats left -> 75% full, 4 seats left -> 92% full, 3 seats left -> 96% full
  const bookedPercent = Math.min(97, 70 + (10 - seatsLeft) * 3);

  // Labels based on language
  const text = {
    badge: isMl ? "പരിമിതമായ സീറ്റുകൾ" : "LIMITED SEATS",
    fillingFast: isMl ? "വേഗത്തിൽ തീരുന്നു" : "FILLING FAST",
    almostFull: isMl ? "അവസാന സീറ്റുകൾ!" : "ALMOST SOLD OUT!",
    only: isMl ? "ഇനി" : "Only",
    seatsLeft: isMl ? "സീറ്റുകൾ മാത്രം ബാക്കി!" : "seats available!",
    bookedLabel: isMl ? "നിറഞ്ഞു" : "Booked",
    formAlertTitle: isMl
      ? "പരിമിതമായ സീറ്റ് അറിയിപ്പ്"
      : "Limited Seats Alert",
    formAlertDesc: isMl
      ? `ഈ ബാച്ചിൽ ഇനി ${seatsLeft} സീറ്റുകൾ മാത്രം ബാക്കി. ഉടൻ ബുക്ക് ചെയ്യൂ.`
      : `Only ${seatsLeft} seats left for this cohort. Complete payment to secure your spot.`,
    stickyPill: isMl
      ? `🔥 ഇനി ${seatsLeft} സീറ്റുകൾ മാത്രം!`
      : `🔥 Only ${seatsLeft} seats left!`,
    ctaHint: isMl
      ? "തത്സമയ ലൈവ് സെഷൻ • സീറ്റുകൾ പരിമിതമാണ്"
      : "Interactive Live Zoom • Limited Cohort Size",
  };

  /* ─────────────────────────────────────────────────────────────
     VARIANT: STICKY BAR (Ultra-compact pill)
  ───────────────────────────────────────────────────────────── */
  if (variant === "sticky") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] sm:text-xs font-bold transition-all ${
          isCritical
            ? "bg-rose-500/20 border border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.35)]"
            : "bg-[#f90058]/15 border border-[#f90058]/35 text-amber-300 shadow-[0_0_10px_rgba(249,0,88,0.25)]"
        } ${className}`}
      >
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isCritical ? "bg-rose-400" : "bg-[#f90058]"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isCritical ? "bg-rose-500" : "bg-[#f90058]"
            }`}
          />
        </span>
        <span className="whitespace-nowrap">
          {text.only}{" "}
          <strong className="text-white font-black">{seatsLeft}</strong>{" "}
          {text.seatsLeft.replace("!", "")}
        </span>
      </span>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     VARIANT: FORM (Inside registration modal / anchor)
  ───────────────────────────────────────────────────────────── */
  if (variant === "form") {
    return (
      <div
        className={`rounded-2xl p-3 sm:p-3.5 border transition-all duration-300 backdrop-blur-xl ${
          isCritical
            ? "bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900/40 border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.25)]"
            : "bg-gradient-to-r from-[#f90058]/15 via-white/[0.03] to-[#184cef]/15 border-[#f90058]/35 shadow-[0_0_20px_rgba(249,0,88,0.15)]"
        } ${className}`}
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#f90058]/20 border border-[#f90058]/40 flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
              🔥
            </span>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#ff5996] font-bold block">
                {text.formAlertTitle}
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-white truncate flex items-center gap-1.5">
                <span>{text.only}</span>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={seatsLeft}
                    initial={{ y: -6, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 6, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25 }}
                    className="inline-block px-1.5 py-0.2 rounded bg-white/[0.08] border border-amber-300/40 text-amber-300 font-mono font-black"
                  >
                    {seatsLeft}
                  </motion.span>
                </AnimatePresence>
                <span>{text.seatsLeft}</span>
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                isCritical
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
                  : "bg-amber-400/15 text-amber-300 border border-amber-400/30"
              }`}
            >
              {isCritical ? text.almostFull : text.fillingFast}
            </span>
          </div>
        </div>

        {/* Mini capacity bar */}
        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className={`h-full rounded-full transition-all duration-500 ${
              isCritical
                ? "bg-gradient-to-r from-[#184cef] via-amber-400 to-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
                : "bg-gradient-to-r from-[#184cef] via-[#f90058] to-amber-300 shadow-[0_0_8px_rgba(249,0,88,0.7)]"
            }`}
            style={{ width: `${bookedPercent}%` }}
          />
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     VARIANT: HERO & CTA (Full rich card)
  ───────────────────────────────────────────────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`w-full rounded-2xl p-3.5 sm:p-4 border transition-all duration-300 backdrop-blur-xl ${
        isCritical
          ? "bg-gradient-to-r from-rose-950/35 via-purple-950/25 to-slate-900/40 border-rose-500/45 shadow-[0_0_30px_rgba(244,63,94,0.25)]"
          : "bg-gradient-to-r from-[#f90058]/15 via-white/[0.04] to-[#184cef]/15 border-[#f90058]/35 shadow-[0_0_24px_rgba(249,0,88,0.2)]"
      } ${className}`}
    >
      {/* Top Header Pill Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isCritical ? "bg-rose-400" : "bg-[#f90058]"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isCritical ? "bg-rose-500" : "bg-[#f90058]"
              }`}
            />
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-white">
            {text.badge}
          </span>
        </div>

        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-tight ${
            isCritical
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/35 animate-pulse"
              : "bg-amber-400/15 text-amber-300 border border-amber-400/30"
          }`}
        >
          <span>⚡</span>
          <span>{isCritical ? text.almostFull : text.fillingFast}</span>
        </span>
      </div>

      {/* Middle Row: Animated Seat Count */}
      <div className="flex items-baseline justify-between mt-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xs sm:text-sm text-slate-200 font-medium">
            {text.only}
          </span>

          {/* Animated Number Badge */}
          <div className="relative inline-flex items-center justify-center min-w-[2.4rem] px-2 py-0.5 rounded-xl bg-slate-950/80 border border-[#f90058]/60 shadow-[0_0_16px_rgba(249,0,88,0.4)]">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={seatsLeft}
                initial={{ y: -10, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 10, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className={`text-lg sm:text-xl font-extrabold font-mono text-transparent bg-clip-text ${
                  isCritical
                    ? "bg-gradient-to-r from-rose-400 via-amber-200 to-rose-300"
                    : "bg-gradient-to-r from-[#ff337d] via-amber-200 to-[#5480ff]"
                }`}
              >
                {seatsLeft}
              </motion.span>
            </AnimatePresence>
          </div>

          <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
            {text.seatsLeft}
          </span>
        </div>

        {/* Booked percentage tag */}
        <span className="text-[10px] sm:text-xs font-mono text-slate-400">
          <strong className="text-slate-200 font-semibold">{bookedPercent}%</strong>{" "}
          {text.bookedLabel}
        </span>
      </div>

      {/* Capacity Progress Bar */}
      <div className="w-full h-1.5 sm:h-2 bg-black/45 rounded-full overflow-hidden mt-2.5 border border-white/5">
        <motion.div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isCritical
              ? "bg-gradient-to-r from-[#184cef] via-amber-400 to-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)]"
              : "bg-gradient-to-r from-[#184cef] via-[#f90058] to-amber-300 shadow-[0_0_10px_rgba(249,0,88,0.7)]"
          }`}
          style={{ width: `${bookedPercent}%` }}
        />
      </div>
    </motion.div>
  );
}
