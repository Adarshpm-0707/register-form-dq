import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  aptitudeV2Questions,
  APTITUDE_SECTIONS,
  WEEKLY_SALES_TABLE,
  gradeAptitudeV2Submission,
} from "../data/aptitudeV2Questions";
import {
  saveAptitudeV2Lead,
  saveAptitudeV2Submission,
} from "../services/dbService";

export default function AptitudeV2() {
  const [step, setStep] = useState(1); // 1: Registration, 2: Test, 3: Result
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    place: "",
    institution: "",
    testDate: new Date().toISOString().slice(0, 10),
  });
  const [formErrors, setFormErrors] = useState({});
  const [leadDocId, setLeadDocId] = useState(null);
  const [savingLead, setSavingLead] = useState(false);

  // Test state
  const [currentQIndex, setCurrentQIndex] = useState(0); // 0-39
  const [userAnswers, setUserAnswers] = useState({}); // { 1: "C", 2: "A", ... }
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes = 3600 seconds
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [reviewSectionFilter, setReviewSectionFilter] = useState("ALL");
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Exam Security & Fullscreen states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [screenCaptureBlocked, setScreenCaptureBlocked] = useState(false);
  const [securityWarning, setSecurityWarning] = useState("");

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Fullscreen Helper Functions
  const enterFullscreen = () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } catch (_) {}
  };

  const exitFullscreen = () => {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    } catch (_) {}
  };

  // Track Fullscreen status
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(isFs);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Anti-Screenshot & Exam Integrity Enforcement (Active during Step 2)
  useEffect(() => {
    if (step !== 2) return;

    // 1. Intercept keyboard shortcuts: PrintScreen, DevTools, Print, Copy, Save, View-source
    const handleKeyDown = (e) => {
      // PrintScreen Key
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        e.preventDefault();
        try {
          navigator.clipboard?.writeText("");
        } catch (_) {}
        setSecurityWarning("⚠️ Screenshots are strictly prohibited during the examination.");
        setScreenCaptureBlocked(true);
        return false;
      }

      // Windows + Shift + S / Cmd + Shift + 4 / Ctrl + P / Ctrl + S / Ctrl + U / Ctrl + C
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "p" || e.key === "P" || e.key === "s" || e.key === "S" || e.key === "u" || e.key === "U" || e.key === "c" || e.key === "C")
      ) {
        e.preventDefault();
        setSecurityWarning("⚠️ Keyboard shortcuts, print, and copy actions are disabled.");
        return false;
      }

      // DevTools: F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c"))
      ) {
        e.preventDefault();
        setSecurityWarning("⚠️ Developer tools and inspection are blocked.");
        return false;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        try {
          navigator.clipboard?.writeText("");
        } catch (_) {}
        setSecurityWarning("⚠️ Screenshots are strictly prohibited during the examination.");
        setScreenCaptureBlocked(true);
      }
    };

    // 2. Window blur & visibility change (Triggers when Snipping Tool opens or window loses focus)
    const handleBlur = () => {
      setScreenCaptureBlocked(true);
      setSecurityWarning("⚠️ Window out of focus / screen capture attempt detected.");
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setScreenCaptureBlocked(true);
        setSecurityWarning("⚠️ Window out of focus / screen capture attempt detected.");
      }
    };

    // 3. Prevent right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [step]);

  // Auto-dismiss warning toast after 3 seconds
  useEffect(() => {
    if (securityWarning) {
      const timer = setTimeout(() => setSecurityWarning(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [securityWarning]);

  // 60-Minute Countdown Timer logic
  useEffect(() => {
    if (step === 2) {
      startTimeRef.current = Date.now();
      setTimeLeft(3600);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  // Handle auto-submit on timer expiration (00:00)
  useEffect(() => {
    if (step === 2 && timeLeft === 0 && !submitting) {
      handleSubmitTest(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, step, submitting]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateRegistration = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full Name is required";
    if (!formData.email.trim() || !formData.email.includes("@")) {
      errors.email = "Valid Email address is required";
    }
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = "Valid 10-digit Phone / WhatsApp number is required";
    }
    if (!formData.place.trim()) {
      errors.place = "Place / City is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // STEP 1 -> STEP 2: Auto-save candidate details, trigger FULLSCREEN & start test
  const handleStartTest = async (e) => {
    e.preventDefault();
    if (!validateRegistration()) return;

    // Immediately trigger fullscreen on direct user click gesture
    enterFullscreen();

    setSavingLead(true);
    try {
      const res = await saveAptitudeV2Lead(formData);
      if (res && res.id) {
        setLeadDocId(res.id);
      }
    } catch (err) {
      console.warn("Auto-save lead error (continuing with test):", err);
    } finally {
      setSavingLead(false);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Select option handler: PERMANENTLY LOCKED ON FIRST SELECTION!
  const handleSelectOption = (questionId, optionKey) => {
    // If an option has already been selected for this question, it is locked!
    if (userAnswers[questionId]) {
      return;
    }
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const currentQ = aptitudeV2Questions[currentQIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const progressPct = Math.round((answeredCount / aptitudeV2Questions.length) * 100);

  // Submit test handler
  const handleSubmitTest = async (isAutoSubmit = false) => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!isAutoSubmit && answeredCount < aptitudeV2Questions.length) {
      const unanswered = aptitudeV2Questions.length - answeredCount;
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${aptitudeV2Questions.length} questions (${unanswered} unanswered). Are you sure you want to finish and submit the test?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    // Exit fullscreen and unblock screen capture overlay
    exitFullscreen();
    setScreenCaptureBlocked(false);

    const timeSpentSeconds = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 3600 - timeLeft;

    // Grade test using the standardized grading function
    const gradeResult = gradeAptitudeV2Submission(userAnswers);

    const payload = {
      leadDocId,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      place: formData.place.trim(),
      institution: formData.institution.trim() || "N/A",
      testDate: formData.testDate,
      score: gradeResult.score,
      totalQuestions: gradeResult.totalQuestions,
      percentage: gradeResult.percentage,
      performanceRating: gradeResult.performanceRating,
      sectionBreakdown: gradeResult.sectionBreakdown,
      detailedAnswers: gradeResult.detailedAnswers,
      timeSpentSeconds,
      isAutoSubmit,
    };

    try {
      await saveAptitudeV2Submission(payload);
    } catch (err) {
      console.warn("Firestore save warning in AptitudeV2.jsx:", err);
    } finally {
      setResult({
        ...gradeResult,
        timeSpentSeconds,
        isAutoSubmit,
      });
      setStep(3);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`min-h-screen bg-transparent text-white ${
        step === 2
          ? isFullscreen
            ? "pt-6 sm:pt-8 md:pt-10 pb-14 px-3 sm:px-6"
            : "pt-28 sm:pt-36 md:pt-40 pb-16 px-3.5 sm:px-6"
          : "pt-36 sm:pt-44 md:pt-52 lg:pt-56 pb-24 px-4 sm:px-6 lg:px-8"
      } font-sans relative overflow-x-hidden selection:bg-sky-500/30 selection:text-white`}
    >
      {/* Print-Blocking CSS: Prevents printing or saving questions to PDF */}
      <style>{`
        @media print {
          html, body, #root, * {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>

      {/* Floating Security Violation Alert Toast */}
      {securityWarning && (
        <div className="fixed top-24 sm:top-28 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-red-600/95 text-white text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 border border-red-400/50 animate-bounce">
          <span>🛡️</span>
          <span>{securityWarning}</span>
        </div>
      )}

      {/* Anti-Screenshot / Window Inactivity Solid Security Blackout Overlay */}
      {step === 2 && screenCaptureBlocked && (
        <div className="fixed inset-0 z-50 bg-[#090D11] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            🛡️
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Screen Capture & Window Switching Prohibited
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Screenshots, Snipping Tool, screen recording software, and window switching are prohibited during the assessment to maintain test integrity.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setScreenCaptureBlocked(false);
              enterFullscreen();
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-extrabold uppercase text-xs tracking-wider shadow-[0_4px_20px_rgba(56,189,248,0.35)] cursor-pointer"
          >
            Resume Assessment (Fullscreen) →
          </button>
        </div>
      )}

      {/* Subtle Ambient Background Gradients matching Home Page */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-right light blue radial glow */}
        <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.14)_0%,rgba(14,165,233,0.08)_40%,transparent_70%)] blur-[120px]" />
        {/* Center-left navy/blue subtle glow */}
        <div className="absolute top-[40%] -left-[15%] w-[900px] h-[900px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.12)_0%,rgba(56,189,248,0.06)_50%,transparent_75%)] blur-[140px]" />
        {/* Bottom light blue / cyan glow */}
        <div className="absolute bottom-[5%] right-[10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.10)_0%,transparent_70%)] blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Global Header (ONLY DISPLAYED ON STEP 1 AND STEP 3 — REMOVED FROM TEST SCREEN) */}
        {step !== 2 && (
          <div className="text-center mb-10 sm:mb-14 md:mb-16 space-y-5 sm:space-y-6 pt-4 sm:pt-8 md:pt-10 relative">
            {/* Subtle Centered Background Glow matching Home Hero */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.16)_0%,transparent_70%)] blur-[90px] pointer-events-none -z-10" />

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.3)] mx-auto mb-1">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shrink-0" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#E0E7EC]">
                Deepstaq Assessment • V2
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] uppercase text-white leading-tight">
              Deepstaq Aptitude Test{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400 drop-shadow-[0_0_16px_rgba(56,189,248,0.35)]">
                V2
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto font-normal leading-relaxed px-2">
              Duration: 60 minutes | Questions: 40 | Sections: 4 | Total marks: 40 (1 mark each • No negative marking)
            </p>

            {/* Key test specs badge strip */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-2 text-[11px] sm:text-xs font-medium text-slate-300">
              <span className="px-3.5 py-1.5 bg-white/[0.04] border border-white/10 rounded-full">
                ⏱️ 60 Mins
              </span>
              <span className="px-3.5 py-1.5 bg-white/[0.04] border border-white/10 rounded-full">
                🎯 40 Marks
              </span>
              <span className="px-3.5 py-1.5 bg-white/[0.04] border border-white/10 rounded-full">
                🧩 4 Sections
              </span>
              <span className="px-3.5 py-1.5 bg-sky-500/10 border border-sky-400/20 text-sky-300 rounded-full font-medium">
                ✓ No Negative Marking
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: CANDIDATE DETAILS FORM (AUTO SAVES TO DB BEFORE TEST COMMENCES)   */}
        {/* ========================================================================= */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.4)] relative"
            >
              <div className="mb-6 sm:mb-8 border-b border-white/10 pb-5 sm:pb-6">
                <span className="text-[11px] sm:text-xs font-semibold text-sky-400 uppercase tracking-widest block mb-1">
                  Step 1 of 2
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-1">
                  Candidate Registration
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  Fill in your details below. Your information will be automatically recorded before the 40 questions begin.
                </p>
              </div>

              {/* Form Inputs (Copy/Paste Disabled For Exam Security) */}
              <form
                onSubmit={handleStartTest}
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                className="space-y-4 sm:space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Candidate Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onDrop={(e) => e.preventDefault()}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      placeholder="Full Name"
                      className={`w-full bg-white/[0.04] border ${
                        formErrors.fullName ? "border-red-500/80 ring-1 ring-red-500/30" : "border-white/10"
                      } rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40 transition-all text-xs sm:text-sm`}
                    />
                    {formErrors.fullName && (
                      <p className="text-red-400 text-[11px] sm:text-xs mt-1 font-medium">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onDrop={(e) => e.preventDefault()}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      placeholder="name@example.com"
                      className={`w-full bg-white/[0.04] border ${
                        formErrors.email ? "border-red-500/80 ring-1 ring-red-500/30" : "border-white/10"
                      } rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40 transition-all text-xs sm:text-sm`}
                    />
                    {formErrors.email && (
                      <p className="text-red-400 text-[11px] sm:text-xs mt-1 font-medium">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Phone / WhatsApp Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onDrop={(e) => e.preventDefault()}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      placeholder="10-digit mobile number"
                      maxLength={15}
                      className={`w-full bg-white/[0.04] border ${
                        formErrors.phone ? "border-red-500/80 ring-1 ring-red-500/30" : "border-white/10"
                      } rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40 transition-all text-xs sm:text-sm`}
                    />
                    {formErrors.phone && (
                      <p className="text-red-400 text-[11px] sm:text-xs mt-1 font-medium">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Place / City */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Place / City <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="place"
                      value={formData.place}
                      onChange={handleInputChange}
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onDrop={(e) => e.preventDefault()}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      placeholder="e.g. Kannur, Kozhikode, Bangalore"
                      className={`w-full bg-white/[0.04] border ${
                        formErrors.place ? "border-red-500/80 ring-1 ring-red-500/30" : "border-white/10"
                      } rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40 transition-all text-xs sm:text-sm`}
                    />
                    {formErrors.place && (
                      <p className="text-red-400 text-[11px] sm:text-xs mt-1 font-medium">
                        {formErrors.place}
                      </p>
                    )}
                  </div>

                  {/* Institution / College */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      College / Institution <span className="text-slate-500 text-[10px]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onDrop={(e) => e.preventDefault()}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      placeholder="College Name"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40 transition-all text-xs sm:text-sm"
                    />
                  </div>

                  {/* Test Date */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Test Date
                    </label>
                    <input
                      type="date"
                      name="testDate"
                      value={formData.testDate}
                      onChange={handleInputChange}
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onDrop={(e) => e.preventDefault()}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40 transition-all text-xs sm:text-sm [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Submit / Start Button (Launches Fullscreen Exam) */}
                <button
                  type="submit"
                  disabled={savingLead}
                  className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 active:scale-[0.99] text-slate-950 font-extrabold uppercase tracking-wide sm:tracking-wider text-xs sm:text-sm md:text-base shadow-[0_4px_24px_rgba(56,189,248,0.35)] hover:shadow-[0_6px_30px_rgba(56,189,248,0.5)] transition-all flex items-center justify-center gap-2 sm:gap-3 cursor-pointer disabled:opacity-50 min-h-[48px] sm:min-h-[52px]"
                >
                  {savingLead ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin shrink-0" />
                      <span className="truncate">Saving Student Details...</span>
                    </>
                  ) : (
                    <>
                      <span className="inline sm:hidden">Start Aptitude Test V2 (Fullscreen)</span>
                      <span className="hidden sm:inline">Start Aptitude Test V2 (Fullscreen Exam)</span>
                      <span className="text-base sm:text-lg shrink-0">→</span>
                    </>
                  )}
                </button>
                
                {/* Test Rules Banner */}
                <div className="bg-sky-500/[0.04] border border-sky-400/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-[11px] sm:text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 font-semibold">
                    <span>⚠️</span>
                    <span>Important Examination Rules</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 leading-relaxed text-[11px] sm:text-xs">
                    <li>The exam starts immediately in <strong>Fullscreen Mode</strong>.</li>
                    <li><strong>Answers are permanently locked on first selection</strong> and cannot be modified.</li>
                    <li><strong>Screenshots, screen recording, and tab/window switching are prohibited</strong> and trigger security locks.</li>
                    <li>Copying and pasting are disabled across all questions.</li>
                    <li>The 60-minute timer counts down continuously until final submission.</li>
                  </ul>
                </div>
              </form>

              {/* 4 Pillars: 4 Section Curriculum Overview Strip (Underneath Button) */}
              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-3 px-1">
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Assessment Modules & Syllabus
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-slate-500">
                    4 Sections • 40 Questions
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                  {APTITUDE_SECTIONS.map((sec) => (
                    <div
                      key={sec.id}
                      className="p-3 sm:p-3.5 bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl flex flex-col justify-between hover:border-sky-400/30 transition-all duration-200"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
                            {sec.title}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-400/10 text-sky-300 border border-sky-400/20">
                            {sec.marks}M
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-white mt-1">
                          {sec.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {sec.description}
                        </p>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 block mt-2.5 pt-2 border-t border-white/5">
                        {sec.questionRange} · {sec.suggestedTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: DISTRACTION-FREE EXAM SCREEN (ONLY TIMER, QUESTION & OPTIONS)     */}
          {/* ========================================================================= */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 select-none"
              onContextMenu={(e) => e.preventDefault()}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              {/* Minimalist Exam Top Bar: ONLY TIMER, QUESTION PROGRESS & SUBMIT BUTTON */}
              <div
                className={`sticky ${
                  isFullscreen ? "top-3 sm:top-4" : "top-20 sm:top-24"
                } z-30 bg-[#090D11]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all`}
              >
                <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
                  {/* Left: Question Counter & Progress */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white">
                      Question <span className="text-sky-400">{currentQIndex + 1}</span> of 40
                    </span>
                    <span className="text-[10px] sm:text-xs font-medium text-slate-400 hidden sm:inline">
                      • {answeredCount} Locked
                    </span>
                  </div>

                  {/* Center: The Countdown Timer */}
                  <div
                    className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl border flex items-center gap-2 font-bold tabular-nums text-sm sm:text-lg ${
                      timeLeft < 300
                        ? "bg-red-500/20 border-red-500/60 text-red-400 animate-pulse"
                        : timeLeft < 900
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                        : "bg-sky-500/10 border-sky-400/40 text-sky-400"
                    }`}
                  >
                    <span>⏱️</span>
                    <span>{formatTime(timeLeft)}</span>
                  </div>

                  {/* Right: Fullscreen / Grid Toggle & Submit Exam */}
                  <div className="flex items-center gap-1.5 sm:gap-2.5">
                    {/* Fullscreen Toggle */}
                    <button
                      type="button"
                      onClick={() => (isFullscreen ? exitFullscreen() : enterFullscreen())}
                      className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Toggle Fullscreen"
                    >
                      <span>⛶</span>
                      <span className="hidden sm:inline">{isFullscreen ? "Exit" : "Full"}</span>
                    </button>

                    {/* Question Palette Toggle */}
                    <button
                      type="button"
                      onClick={() => setPaletteOpen((prev) => !prev)}
                      className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Jump Palette"
                    >
                      <span>🔢</span>
                      <span className="hidden sm:inline">Grid</span>
                    </button>

                    {/* Submit Exam Button */}
                    <button
                      type="button"
                      onClick={() => handleSubmitTest(false)}
                      disabled={submitting}
                      className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-rose-500/90 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(244,63,94,0.35)] cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Exam"}
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-1 sm:h-1.5 overflow-hidden mt-2.5">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 via-sky-300 to-blue-500 transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Collapsible 40-Question Quick Jump Palette */}
              {paletteOpen && (
                <div className="p-3.5 sm:p-4 bg-[#090D11]/95 border border-white/10 rounded-2xl backdrop-blur-xl animate-in fade-in duration-200 shadow-2xl">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                      Question Palette (Jump to Any Question)
                    </span>
                    <div className="flex items-center gap-3 text-[11px] sm:text-xs font-medium">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-sky-400 inline-block" /> Locked ({answeredCount})
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-white/10 inline-block" /> Unanswered ({40 - answeredCount})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-20 gap-1.5 sm:gap-2">
                    {aptitudeV2Questions.map((q, idx) => {
                      const isAnswered = Boolean(userAnswers[q.id]);
                      const isCurrent = idx === currentQIndex;

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => {
                            setCurrentQIndex(idx);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`h-8 sm:h-9 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer border ${
                            isCurrent
                              ? "bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 border-sky-400 ring-2 ring-sky-400/50 font-black scale-105 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                              : isAnswered
                              ? "bg-sky-500/20 text-sky-300 border-sky-400/35 hover:bg-sky-500/30"
                              : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {q.id}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MAIN QUESTION DISPLAY CARD */}
              <div
                className="bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.4)] relative select-none"
                onContextMenu={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
              >
                {/* Context Table for Section C (Q21 - Q24) */}
                {currentQ.hasTable && (
                  <div className="mb-5 sm:mb-6 p-3.5 sm:p-5 bg-white/[0.02] border border-sky-400/30 rounded-xl sm:rounded-2xl">
                    <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">
                      <span>📊</span>
                      <span>Weekly Sales Data Table (Refer for Questions 21–24)</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">
                      Number of units sold by a business across 5 consecutive weekdays:
                    </p>
                    <div className="overflow-x-auto -mx-1 sm:mx-0">
                      <table className="w-full text-left text-xs border-collapse min-w-[320px]">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-300 bg-white/5">
                            <th className="py-2.5 px-3 sm:px-4 font-bold">Day</th>
                            {WEEKLY_SALES_TABLE.map((row) => (
                              <th key={row.day} className="py-2.5 px-3 sm:px-4 font-bold text-center">
                                {row.day}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-white/5 text-white">
                            <td className="py-2.5 px-3 sm:px-4 font-bold text-sky-400">Units sold</td>
                            {WEEKLY_SALES_TABLE.map((row) => (
                              <td key={row.day} className="py-2.5 px-3 sm:px-4 text-center font-bold text-xs sm:text-sm">
                                {row.units}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Question Content */}
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-base sm:text-xl font-bold text-white leading-relaxed whitespace-pre-line tracking-normal select-none">
                    <span className="text-sky-400 font-bold mr-1.5 sm:mr-2">{currentQ.id}.</span>
                    {currentQ.question}
                  </h2>
                </div>

                {/* Options Grid (A, B, C, D) — LOCKED ON FIRST CLICK */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-4 select-none">
                  {currentQ.options.map((opt) => {
                    const isSelected = userAnswers[currentQ.id] === opt.key;
                    const isLocked = Boolean(userAnswers[currentQ.id]);

                    return (
                      <button
                        key={opt.key}
                        type="button"
                        disabled={isLocked}
                        onClick={() => handleSelectOption(currentQ.id, opt.key)}
                        className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-200 flex items-start gap-2.5 sm:gap-3 min-h-[52px] ${
                          isSelected
                            ? "bg-sky-500/20 border-sky-400 text-white shadow-[0_0_24px_rgba(56,189,248,0.25)] ring-1 ring-sky-400 cursor-default"
                            : isLocked
                            ? "bg-white/[0.01] border-white/5 text-slate-500 opacity-40 cursor-not-allowed"
                            : "bg-white/[0.02] border-white/10 hover:border-sky-400/40 text-slate-300 hover:text-white hover:bg-white/[0.05] cursor-pointer"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                            isSelected
                              ? "bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 shadow-md"
                              : isLocked
                              ? "bg-white/5 text-slate-500"
                              : "bg-white/10 text-white"
                          }`}
                        >
                          {opt.key}
                        </span>
                        <div className="flex-1 pt-0.5">
                          <span className="text-xs sm:text-sm font-medium leading-snug block">
                            {opt.text}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="text-sky-400 text-xs sm:text-sm font-bold shrink-0 flex items-center gap-1">
                            <span>🔒 Locked</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Answer Lock Status Notice */}
                <div className="mb-6 px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between select-none">
                  {userAnswers[currentQ.id] ? (
                    <span className="text-sky-300 flex items-center gap-1.5">
                      <span>🔒</span>
                      <span>Answer Locked: Choice ({userAnswers[currentQ.id]}) permanently registered for Question {currentQ.id}.</span>
                    </span>
                  ) : (
                    <span className="text-amber-300/90 flex items-center gap-1.5">
                      <span>⚠️</span>
                      <span>Choose carefully — your answer locks permanently on the first click!</span>
                    </span>
                  )}
                </div>

                {/* Question Bottom Actions */}
                <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-5 sm:pt-6 border-t border-white/10 select-none">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Previous Button */}
                    <button
                      type="button"
                      disabled={currentQIndex === 0}
                      onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                      className="flex-1 sm:flex-initial px-5 py-2.5 sm:py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-center min-h-[44px]"
                    >
                      ← Previous Question
                    </button>
                  </div>

                  <div className="w-full sm:w-auto">
                    {/* Next Question / Finish Button */}
                    {currentQIndex < aptitudeV2Questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQIndex((prev) =>
                            Math.min(aptitudeV2Questions.length - 1, prev + 1)
                          )
                        }
                        className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 active:scale-[0.99] text-slate-950 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(56,189,248,0.3)] cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                      >
                        <span>Next Question</span>
                        <span>→</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSubmitTest(false)}
                        disabled={submitting}
                        className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 hover:from-sky-300 hover:to-blue-500 active:scale-[0.99] text-slate-950 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-[0_4px_24px_rgba(56,189,248,0.4)] cursor-pointer disabled:opacity-50 flex items-center justify-center min-h-[44px]"
                      >
                        {submitting ? "Finalizing Submission..." : "Review & Submit Exam"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: RESULT & SUCCESS CELEBRATION SCREEN                               */}
          {/* ========================================================================= */}
          {step === 3 && result && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Success Banner */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.4)] text-center space-y-5 sm:space-y-6 relative overflow-hidden">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl sm:rounded-3xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-2xl sm:text-3xl shadow-[0_0_30px_rgba(56,189,248,0.35)]">
                  🎉
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-sky-400 block">
                    Assessment Completed
                  </span>
                  <h2 className="text-xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-tight">
                    Congratulations, {formData.fullName}!
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm font-normal max-w-lg mx-auto leading-relaxed px-2">
                    Your responses have been successfully recorded in the Deepstaq database. Here is your comprehensive performance scorecard.
                  </p>
                </div>

                {/* Big Score Card */}
                <div className="max-w-md mx-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/15 backdrop-blur-md space-y-4 shadow-[0_16px_36px_rgba(0,0,0,0.3)]">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400 border-b border-white/10 pb-3">
                    <span>Overall Score</span>
                    <span className="text-sky-400 font-bold">{result.performanceRating}</span>
                  </div>

                  <div className="py-2">
                    <span className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.35)] tracking-tight">
                      {result.score}
                    </span>
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-400"> / {result.totalQuestions}</span>
                    <span className="block text-xs sm:text-sm text-slate-300 mt-1 font-normal">
                      Percentage: <strong className="text-white font-bold">{result.percentage}%</strong>
                    </span>
                  </div>

                  {/* Candidate Quick Info */}
                  <div className="grid grid-cols-2 gap-2 text-left pt-3 border-t border-white/10 text-xs text-slate-400">
                    <div>
                      <span className="text-[10px] uppercase font-semibold tracking-wider block text-slate-500">Candidate</span>
                      <span className="text-white font-bold truncate block">{formData.fullName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold tracking-wider block text-slate-500">Date</span>
                      <span className="text-white font-bold block">{formData.testDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold tracking-wider block text-slate-500">Location</span>
                      <span className="text-white font-bold block truncate">{formData.place}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold tracking-wider block text-slate-500">Time Spent</span>
                      <span className="text-white font-bold block">
                        {Math.floor(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4 Section Performance Breakdown Cards */}
                <div className="text-left pt-3 sm:pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 sm:mb-4 text-center">
                    Section-by-Section Performance
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                    {APTITUDE_SECTIONS.map((sec) => {
                      const secData = result.sectionBreakdown[sec.id] || { score: 0, total: 10 };
                      const secPct = Math.round((secData.score / secData.total) * 100);

                      return (
                        <div
                          key={sec.id}
                          className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/10 hover:border-sky-400/30 transition-colors flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] sm:text-[11px] font-semibold text-sky-400 block uppercase tracking-wider">
                              {sec.title}
                            </span>
                            <h4 className="text-xs font-bold text-white mt-0.5 truncate">
                              {sec.name}
                            </h4>
                          </div>

                          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/5 flex items-baseline justify-between">
                            <span className="text-lg sm:text-xl font-black text-white">
                              {secData.score} <span className="text-xs text-slate-500 font-normal">/ {secData.total}</span>
                            </span>
                            <span className="text-xs font-bold text-sky-300">
                              {secPct}%
                            </span>
                          </div>

                          {/* Mini Progress */}
                          <div className="w-full bg-white/10 rounded-full h-1 mt-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.4)]"
                              style={{ width: `${secPct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons (Fully Responsive on Mobile, Tablet, and Laptop) */}
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-5 sm:pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowReview((prev) => !prev)}
                    className="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    {showReview ? "Hide Detailed Review" : "Review All 40 Questions & Answers"}
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    🖨️ Print / Save Scorecard
                  </button>

                  <Link
                    to="/programs"
                    className="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all shadow-[0_4px_24px_rgba(56,189,248,0.35)] hover:shadow-[0_6px_30px_rgba(56,189,248,0.5)] text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Explore Deepstaq AI Programs</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* DETAILED 40-QUESTION ANSWERS REVIEW ACCORDION */}
              {showReview && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.4)] space-y-4 sm:space-y-6">
                  <div className="flex flex-wrap justify-between items-center gap-3 pb-3 sm:pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-base sm:text-lg font-black uppercase text-white tracking-tight">
                        Detailed Answer Review
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        Inspect all 40 questions, your selected answer, correct solution, and detailed explanations.
                      </p>
                    </div>

                    {/* Filter buttons */}
                    <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar flex-nowrap sm:flex-wrap text-[11px] sm:text-xs font-semibold">
                      {["ALL", "SECTION A", "SECTION B", "SECTION C", "SECTION D"].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setReviewSectionFilter(f)}
                          className={`px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            reviewSectionFilter === f
                              ? "bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 border-sky-400 font-bold shadow-[0_2px_12px_rgba(56,189,248,0.3)]"
                              : "bg-white/[0.04] border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-3.5 sm:space-y-4">
                    {result.detailedAnswers
                      .filter((ans) =>
                        reviewSectionFilter === "ALL" ? true : ans.section === reviewSectionFilter
                      )
                      .map((ans) => (
                        <div
                          key={ans.questionId}
                          className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border transition-all ${
                            ans.isCorrect
                              ? "bg-emerald-500/5 border-emerald-500/30"
                              : "bg-red-500/5 border-red-500/30"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Q{ans.questionId}. [{ans.section} · {ans.sectionTitle}]
                            </span>
                            <span
                              className={`text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 rounded-md shrink-0 ${
                                ans.isCorrect
                                  ? "bg-emerald-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {ans.isCorrect ? "✓ Correct" : "✕ Incorrect"}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm font-bold text-white mb-3 sm:mb-4 leading-relaxed whitespace-pre-line tracking-normal">
                            {ans.question}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs mb-3">
                            {/* Selected Answer */}
                            <div
                              className={`p-2.5 sm:p-3 rounded-xl border ${
                                ans.isCorrect
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                                  : "bg-red-500/10 border-red-500/30 text-red-200"
                              }`}
                            >
                              <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                                Your Selection:
                              </span>
                              <span className="font-semibold text-xs">
                                {ans.selectedAnswerKey ? `(${ans.selectedAnswerKey}) ${ans.selectedAnswerText}` : "Not Answered"}
                              </span>
                            </div>

                            {/* Correct Answer */}
                            <div className="p-2.5 sm:p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-300">
                              <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-0.5">
                                Correct Answer:
                              </span>
                              <span className="font-semibold text-xs">
                                ({ans.correctAnswerKey}) {ans.correctAnswerText}
                              </span>
                            </div>
                          </div>

                          {/* Explanation */}
                          {ans.explanation && (
                            <div className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] sm:text-xs text-slate-300 font-normal leading-relaxed">
                              <strong className="text-sky-400 font-bold mr-1">Explanation:</strong>
                              {ans.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

