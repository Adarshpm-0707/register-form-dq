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
  checkAptitudeCandidateExists,
  saveAptitudeV2Lead,
  saveAptitudeV2Submission,
} from "../services/dbService";

export default function AptitudeV2() {
  const getTodayFormattedDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [step, setStep] = useState(1); // 1: Registration, 2: Test, 3: Result
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    place: "",
    institution: "",
    testDate: getTodayFormattedDate(),
  });
  const [formErrors, setFormErrors] = useState({});
  const [leadDocId, setLeadDocId] = useState(null);
  const [savingLead, setSavingLead] = useState(false);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [duplicateError, setDuplicateError] = useState("");

  // Test state
  const [currentQIndex, setCurrentQIndex] = useState(0); // 0-39
  const [userAnswers, setUserAnswers] = useState({}); // { 1: "C", 2: "A", ... }
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes = 3600 seconds
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [reviewSectionFilter, setReviewSectionFilter] = useState("ALL");

  // Exam Security & Fullscreen states
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

  // Ensure test date is automatically updated to current date
  useEffect(() => {
    const todayFormatted = getTodayFormattedDate();
    setFormData((prev) => (prev.testDate === todayFormatted ? prev : { ...prev, testDate: todayFormatted }));
  }, []);

  // Hide Navbar during examination mode (Step 2)
  useEffect(() => {
    if (step === 2) {
      document.body.classList.add("in-exam-mode");
      window.dispatchEvent(new CustomEvent("deepstaq:exam-mode", { detail: { inExam: true } }));
    } else {
      document.body.classList.remove("in-exam-mode");
      window.dispatchEvent(new CustomEvent("deepstaq:exam-mode", { detail: { inExam: false } }));
    }

    return () => {
      document.body.classList.remove("in-exam-mode");
      window.dispatchEvent(new CustomEvent("deepstaq:exam-mode", { detail: { inExam: false } }));
    };
  }, [step]);

  // Anti-Screenshot & Exam Integrity Enforcement Across Laptop, Mobile & Tablet (Step 2)
  useEffect(() => {
    if (step !== 2) {
      document.body.classList.remove("screen-capture-blocked");
      return;
    }

    const purgeClipboard = () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("").catch(() => {});
        }
      } catch (_) {}
    };

    const triggerSecurityBlock = (reason) => {
      document.body.classList.add("screen-capture-blocked");
      setScreenCaptureBlocked(true);
      setSecurityWarning(reason);
      purgeClipboard();
    };

    // 1. Hardware & Keyboard Shortcut Interception (Laptop & Desktop)
    const handleKeyDown = (e) => {
      // PrintScreen key (any modifier or standalone)
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityBlock("⚠️ Screenshots are strictly prohibited during the assessment.");
        return false;
      }

      // Windows Snipping Tool (Win + Shift + S), Mac Screen Capture (Cmd + Shift + 3/4/5), Browser Capture (Ctrl + Shift + S)
      if (
        e.shiftKey &&
        (e.metaKey || e.ctrlKey) &&
        ["s", "S", "3", "4", "5", "6"].includes(e.key)
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityBlock("⚠️ Screen capture shortcut detected. Screenshots are prohibited.");
        return false;
      }

      // Combined Alt+PrintScreen or Win+PrintScreen
      if ((e.altKey || e.metaKey || e.ctrlKey) && (e.key === "PrintScreen" || e.keyCode === 44)) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityBlock("⚠️ Screenshot shortcut blocked.");
        return false;
      }

      // Print, Save, View Source, Copy, Select All
      if (
        (e.ctrlKey || e.metaKey) &&
        ["p", "P", "s", "S", "u", "U", "c", "C", "a", "A", "x", "X"].includes(e.key)
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityBlock("⚠️ Shortcuts and copy/save actions are disabled during the exam.");
        return false;
      }

      // DevTools (F12, Ctrl/Cmd + Shift + I/J/C/K)
      if (
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ["I", "i", "J", "j", "C", "c", "K", "k"].includes(e.key))
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityBlock("⚠️ Developer tools and inspection are blocked.");
        return false;
      }
    };

    const handleKeyUp = (e) => {
      if (
        e.key === "PrintScreen" ||
        e.keyCode === 44 ||
        (e.shiftKey && (e.metaKey || e.ctrlKey) && (e.key === "s" || e.key === "S"))
      ) {
        triggerSecurityBlock("⚠️ Screenshot attempt detected.");
      }
    };

    // 2. Window Blur, Pagehide & Visibility (Fires on Snipping Tool, Screenshot toolbar, Mobile hardware buttons, App switch)
    const handleWindowBlur = () => {
      triggerSecurityBlock("⚠️ Window lost focus / screen capture attempt detected.");
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerSecurityBlock("⚠️ Examination tab hidden or minimized.");
      }
    };

    // 3. Fullscreen Exit Interception across Laptop, Mobile & Tablet
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      if (!isCurrentlyFullscreen && step === 2) {
        triggerSecurityBlock("⚠️ Fullscreen mode exited. Fullscreen is mandatory for exam integrity.");
      }
    };

    // 4. Mobile & Tablet Multi-Finger Gesture Interception (e.g., 3-finger swipe screenshot)
    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length >= 3) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityBlock("⚠️ Multi-finger screenshot gesture blocked.");
        return false;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length >= 3) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 5. Prevent Context Menu, Drag, Copy, Selection
    const handlePrevent = (e) => {
      e.preventDefault();
      return false;
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focusout", handleWindowBlur);
    window.addEventListener("pagehide", handleWindowBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("contextmenu", handlePrevent);
    window.addEventListener("selectstart", handlePrevent);
    window.addEventListener("dragstart", handlePrevent);
    window.addEventListener("copy", handlePrevent);
    window.addEventListener("cut", handlePrevent);

    return () => {
      document.body.classList.remove("screen-capture-blocked");
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focusout", handleWindowBlur);
      window.removeEventListener("pagehide", handleWindowBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("contextmenu", handlePrevent);
      window.removeEventListener("selectstart", handlePrevent);
      window.removeEventListener("dragstart", handlePrevent);
      window.removeEventListener("copy", handlePrevent);
      window.removeEventListener("cut", handlePrevent);
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
    if (name === "testDate") return; // locked against manual alteration
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (duplicateError) {
      setDuplicateError("");
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

  // STEP 1 -> STEP 2: Enforce Single Student Attempt, auto-save details, trigger FULLSCREEN & start test
  const handleStartTest = async (e) => {
    e.preventDefault();
    setDuplicateError("");
    if (!validateRegistration()) return;

    setSavingLead(true);
    setCheckingDuplicate(true);

    try {
      // 1. Verify candidate has not already registered or taken the test (1 student = 1 registration/attempt)
      const duplicateCheck = await checkAptitudeCandidateExists({
        phone: formData.phone,
        email: formData.email,
      });

      if (duplicateCheck && duplicateCheck.exists) {
        setSavingLead(false);
        setCheckingDuplicate(false);
        setDuplicateError(duplicateCheck.message);
        if (duplicateCheck.matchedField === "phone") {
          setFormErrors((prev) => ({
            ...prev,
            phone: "This phone number is already registered. Each candidate is permitted only 1 attempt.",
          }));
        } else if (duplicateCheck.matchedField === "email") {
          setFormErrors((prev) => ({
            ...prev,
            email: "This email address is already registered. Each candidate is permitted only 1 attempt.",
          }));
        }
        return;
      }

      // 2. Candidate is unique: save lead record
      const res = await saveAptitudeV2Lead(formData);
      if (res && res.alreadyExists) {
        setSavingLead(false);
        setCheckingDuplicate(false);
        setDuplicateError(res.message);
        return;
      }

      if (res && res.id) {
        setLeadDocId(res.id);
      }

      // Enter fullscreen and begin test
      enterFullscreen();
      setSavingLead(false);
      setCheckingDuplicate(false);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.warn("Auto-save lead error:", err);
      enterFullscreen();
      setSavingLead(false);
      setCheckingDuplicate(false);
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
          ? "pt-14 sm:pt-20 md:pt-24 pb-16 px-3.5 sm:px-6"
          : "pt-16 sm:pt-20 md:pt-24 pb-16 px-4 sm:px-6 lg:px-8"
      } font-sans relative overflow-x-hidden selection:bg-sky-500/30 selection:text-white`}
    >
      {/* Print-Blocking & Exam Mode CSS */}
      <style>{`
        @media print {
          html, body, #root, * {
            display: none !important;
            visibility: hidden !important;
          }
        }
        body.in-exam-mode [data-navbar="true"],
        body.in-exam-mode nav,
        body.in-exam-mode header {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        body.screen-capture-blocked .exam-protected-content {
          filter: blur(60px) brightness(0) !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          user-select: none !important;
        }
        .exam-secure-zone,
        .exam-secure-zone * {
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          -khtml-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-user-drag: none !important;
        }
      `}</style>

      {/* Floating Security Violation Alert Toast */}
      {securityWarning && (
        <div className="fixed top-24 sm:top-28 left-1/2 -translate-x-1/2 z-[1000000] px-5 py-3 rounded-2xl bg-red-600/95 text-white text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 border border-red-400/50 animate-bounce">
          <span>🛡️</span>
          <span>{securityWarning}</span>
        </div>
      )}

      {/* Anti-Screenshot / Window Inactivity Solid Security Blackout Overlay */}
      {step === 2 && screenCaptureBlocked && (
        <div className="fixed inset-0 z-[999999] bg-[#090D11] flex flex-col items-center justify-center p-6 text-center space-y-4 select-none">
          <div className="w-16 h-16 rounded-3xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse">
            🛡️
          </div>
          <div className="space-y-2 max-w-lg">
            <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest block">
              Integrity Violation Detected
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Screen Capture & Window Switching Blocked
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mx-auto leading-relaxed">
              Screenshots, Snipping Tool, screen recording, multi-finger gestures, and window switching are strictly prohibited across all devices (laptop, mobile & tablet) to protect exam confidentiality.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              Candidate: <span className="text-slate-300 font-semibold">{formData.fullName}</span> • {formData.phone}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              document.body.classList.remove("screen-capture-blocked");
              setScreenCaptureBlocked(false);
              enterFullscreen();
            }}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 active:scale-[0.99] text-slate-950 font-extrabold uppercase text-xs tracking-wider shadow-[0_4px_20px_rgba(56,189,248,0.35)] cursor-pointer transition-all"
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
          <div className="text-center mb-6 sm:mb-8 space-y-3 sm:space-y-4 pt-0 sm:pt-1 relative">
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

                  {/* Test Date (Auto-updated daily, Selection removed & Locked) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Test Date
                      </label>
                     
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="testDate"
                        name="testDate"
                        value={formData.testDate}
                        readOnly
                        disabled
                        tabIndex={-1}
                        aria-readonly="true"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-slate-200 font-semibold cursor-not-allowed select-none text-xs sm:text-sm tracking-wide shadow-inner focus:outline-none"
                      />
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[11px] font-medium flex items-center gap-1 select-none">
                        <span>📅</span>
                        <span>Today</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duplicate Registration Error Banner */}
                {duplicateError && (
                  <div className="p-4 rounded-xl sm:rounded-2xl bg-red-500/10 border border-red-500/40 flex items-start gap-3 text-left">
                    <span className="text-xl sm:text-2xl shrink-0 mt-0.5">🚫</span>
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-red-400 uppercase tracking-wide">
                        Registration Blocked: Single Attempt Policy
                      </h4>
                      <p className="text-xs text-red-200/90 leading-relaxed font-medium">
                        {duplicateError}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Each student is permitted strictly <strong>one registration and attempt</strong>. Duplicate entries using the same phone number or email are blocked by system policy.
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit / Start Button (Launches Fullscreen Exam) */}
                <button
                  type="submit"
                  disabled={savingLead || checkingDuplicate}
                  className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 active:scale-[0.99] text-slate-950 font-extrabold uppercase tracking-wide sm:tracking-wider text-xs sm:text-sm md:text-base shadow-[0_4px_24px_rgba(56,189,248,0.35)] hover:shadow-[0_6px_30px_rgba(56,189,248,0.5)] transition-all flex items-center justify-center gap-2 sm:gap-3 cursor-pointer disabled:opacity-50 min-h-[48px] sm:min-h-[52px]"
                >
                  {checkingDuplicate ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin shrink-0" />
                      <span className="truncate">Verifying Registration Status...</span>
                    </>
                  ) : savingLead ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin shrink-0" />
                      <span className="truncate">Saving Student Details...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Aptitude Test</span>
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
                    <li><strong>Single Submission Policy:</strong> One student can register only once. Re-registering with the same phone number or email is prohibited.</li>
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
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-400/10 text-sky-300 border border-sky-400/20 select-none">
                            15 Mts
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="select-none"
              onContextMenu={(e) => e.preventDefault()}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              {/* UNIFIED QUESTION SECTION WITH INTEGRATED TOP BAR */}
              <div
                className="bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.4)] relative select-none overflow-hidden exam-secure-zone exam-protected-content transition-all duration-150"
                onContextMenu={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
              >
                {/* Dynamic Security Anti-Leak Watermark Grid */}
                <div
                  className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20 flex flex-wrap items-center justify-around opacity-[0.045] text-white font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-loose rotate-[-15deg] scale-125"
                  aria-hidden="true"
                >
                  {Array.from({ length: 32 }).map((_, idx) => (
                    <span key={idx} className="p-4 whitespace-nowrap">
                      DEEPSTAQ EXAM • {formData.fullName || "CANDIDATE"} • {formData.phone || "VERIFIED"} • {formData.testDate}
                    </span>
                  ))}
                </div>

                {/* QUESTION SECTION TOP POSITION: FULLY CENTRALIZED QUESTION COUNTER & TIMER */}
                <div className="bg-[#090D11]/90 border-b border-white/10 px-4 py-5 sm:py-6 text-center flex flex-col items-center justify-center gap-3">
                  {/* Centered Question Counter & Locked Badge */}
                  <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-bold uppercase tracking-wider text-white">
                    <span>Question <strong className="text-sky-400">{currentQIndex + 1}</strong> of 40</span>
                    <span className="text-slate-500 font-normal">•</span>
                    <span className="text-slate-300 font-medium">{answeredCount} Locked</span>
                  </div>

                  {/* Centered Countdown Timer Badge */}
                  <div
                    className={`px-6 sm:px-8 py-2 sm:py-2.5 rounded-2xl border flex items-center justify-center gap-2.5 font-black tabular-nums text-base sm:text-xl shadow-lg transition-all ${
                      timeLeft < 300
                        ? "bg-red-500/20 border-red-500/60 text-red-400 animate-pulse"
                        : timeLeft < 900
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                        : "bg-sky-500/10 border-sky-400/40 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]"
                    }`}
                  >
                    <span className="text-lg">⏱️</span>
                    <span className="tracking-widest">{formatTime(timeLeft)}</span>
                  </div>

                  {/* Centered Progress Bar */}
                  <div className="w-full max-w-md mx-auto bg-white/10 rounded-full h-1.5 overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 via-sky-300 to-blue-500 transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Question Body Content */}
                <div className="p-4 sm:p-8 md:p-10">
                {/* Context Table for Section C (Q21 - Q24) */}
                {currentQ.hasTable && (
                  <div className="mb-6 p-3.5 sm:p-5 bg-white/[0.02] border border-sky-400/30 rounded-xl sm:rounded-2xl max-w-2xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">
                      <span>📊</span>
                      <span>Weekly Sales Data Table (Refer for Questions 21–24)</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3 text-center">
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

                {/* Question Content (Fully Centralized) */}
                <div className="mb-6 sm:mb-8 text-center max-w-3xl mx-auto">
                  <h2 className="text-base sm:text-xl md:text-2xl font-bold text-white leading-relaxed whitespace-pre-line tracking-normal select-none">
                    <span className="text-sky-400 font-extrabold mr-2">{currentQ.id}.</span>
                    {currentQ.question}
                  </h2>
                </div>

                {/* Options Grid (A, B, C, D) — LOCKED ON FIRST CLICK */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-6 max-w-3xl mx-auto select-none">
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

                {/* Answer Lock Status Notice (Fully Centralized) */}
                <div className="mb-6 px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center text-center max-w-3xl mx-auto select-none">
                  {userAnswers[currentQ.id] ? (
                    <span className="text-sky-300 flex items-center justify-center gap-1.5">
                      <span>🔒</span>
                      <span>Answer Locked: Choice ({userAnswers[currentQ.id]}) permanently registered for Question {currentQ.id}.</span>
                    </span>
                  ) : (
                    <span className="text-amber-300/90 flex items-center justify-center gap-1.5">
                      <span>⚠️</span>
                      <span>Choose carefully — your answer locks permanently on the first click!</span>
                    </span>
                  )}
                </div>

                {/* Question Bottom Action (Fully Centralized) */}
                <div className="flex items-center justify-center pt-6 border-t border-white/10 max-w-3xl mx-auto select-none">
                  {currentQIndex < aptitudeV2Questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentQIndex((prev) =>
                          Math.min(aptitudeV2Questions.length - 1, prev + 1)
                        )
                      }
                      className="w-full sm:w-auto min-w-[220px] px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 active:scale-[0.99] text-slate-950 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(56,189,248,0.3)] cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
                    >
                      <span>Next Question</span>
                      <span>→</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSubmitTest(false)}
                      disabled={submitting}
                      className="w-full sm:w-auto min-w-[220px] px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 hover:from-sky-300 hover:to-blue-500 active:scale-[0.99] text-slate-950 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all shadow-[0_4px_24px_rgba(56,189,248,0.4)] cursor-pointer disabled:opacity-50 flex items-center justify-center min-h-[48px]"
                    >
                      {submitting ? "Finalizing Submission..." : "Finish Assessment →"}
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

