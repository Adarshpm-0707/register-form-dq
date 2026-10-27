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

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

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

  // STEP 1 -> STEP 2: Auto-save candidate details to database & start test
  const handleStartTest = async (e) => {
    e.preventDefault();
    if (!validateRegistration()) return;

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

  // Select option handler
  const handleSelectOption = (questionId, optionKey) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleClearAnswer = (questionId) => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const currentQ = aptitudeV2Questions[currentQIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const progressPct = Math.round((answeredCount / aptitudeV2Questions.length) * 100);

  // Identify current section
  const currentSection =
    APTITUDE_SECTIONS.find(
      (sec) => currentQ.id >= sec.startId && currentQ.id <= sec.endId
    ) || APTITUDE_SECTIONS[0];

  const handleJumpToSection = (sectionId) => {
    const targetSection = APTITUDE_SECTIONS.find((s) => s.id === sectionId);
    if (targetSection) {
      setCurrentQIndex(targetSection.startId - 1);
    }
  };

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
    <div className="min-h-screen bg-[#090D11] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden selection:bg-[#c6ff34] selection:text-[#090D11]">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#c6ff34]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Global Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#c6ff34]/10 text-[#c6ff34] border border-[#c6ff34]/30 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#c6ff34] animate-pulse" />
            DEEPSTAQ ASSESSMENT • V2
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            Deepstaq Aptitude Test <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c6ff34] via-emerald-300 to-teal-300">V2</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto font-mono">
            Duration: 60 minutes | Questions: 40 | Sections: 4 | Total marks: 40 (1 mark each • No negative marking)
          </p>

          {/* Key test specs badge strip */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-mono text-slate-300">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              ⏱️ 60 Mins
            </span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              🎯 40 Marks
            </span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              🧩 4 Sections
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
              ✓ No Negative Marking
            </span>
          </div>
        </div>

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
              className="bg-[#0D1318]/90 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative"
            >
              <div className="mb-6 border-b border-white/10 pb-4">
                <span className="text-[10px] font-mono text-[#c6ff34] uppercase tracking-widest block font-bold">
                  Step 1 of 2
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mt-1">
                  Candidate Registration
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Fill in your details below. Your information will be automatically recorded before the 40 questions begin.
                </p>
              </div>

              {/* 4 Section Curriculum Overview Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {APTITUDE_SECTIONS.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-mono text-[#c6ff34] font-bold uppercase tracking-wider block">
                        {sec.title} ({sec.marks} Marks)
                      </span>
                      <h3 className="text-xs font-bold text-white mt-0.5">
                        {sec.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                        {sec.description}
                      </p>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 block mt-2 pt-2 border-t border-white/5">
                      {sec.questionRange} · {sec.suggestedTime}
                    </span>
                  </div>
                ))}
              </div>

              {/* Form Inputs */}
              <form onSubmit={handleStartTest} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Candidate Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Adarsh Sharma"
                      className={`w-full bg-[#050521]/60 border ${
                        formErrors.fullName ? "border-red-500" : "border-white/15"
                      } rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#c6ff34] transition-all text-sm`}
                    />
                    {formErrors.fullName && (
                      <p className="text-red-400 text-xs mt-1 font-mono">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. adarsh@example.com"
                      className={`w-full bg-[#050521]/60 border ${
                        formErrors.email ? "border-red-500" : "border-white/15"
                      } rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#c6ff34] transition-all text-sm`}
                    />
                    {formErrors.email && (
                      <p className="text-red-400 text-xs mt-1 font-mono">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Phone / WhatsApp Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      maxLength={15}
                      className={`w-full bg-[#050521]/60 border ${
                        formErrors.phone ? "border-red-500" : "border-white/15"
                      } rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#c6ff34] transition-all text-sm`}
                    />
                    {formErrors.phone && (
                      <p className="text-red-400 text-xs mt-1 font-mono">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Place / City */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Place / City <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="place"
                      value={formData.place}
                      onChange={handleInputChange}
                      placeholder="e.g. Kannur, Kozhikode, Bangalore"
                      className={`w-full bg-[#050521]/60 border ${
                        formErrors.place ? "border-red-500" : "border-white/15"
                      } rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#c6ff34] transition-all text-sm`}
                    />
                    {formErrors.place && (
                      <p className="text-red-400 text-xs mt-1 font-mono">
                        {formErrors.place}
                      </p>
                    )}
                  </div>

                  {/* Institution / College */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      College / Institution <span className="text-slate-500 text-[10px]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      placeholder="e.g. Govt Engineering College Kannur"
                      className="w-full bg-[#050521]/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#c6ff34] transition-all text-sm"
                    />
                  </div>

                  {/* Test Date */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Test Date
                    </label>
                    <input
                      type="date"
                      name="testDate"
                      value={formData.testDate}
                      onChange={handleInputChange}
                      className="w-full bg-[#050521]/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#c6ff34] transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Test Rules Banner */}
                <div className="bg-[#c6ff34]/5 border border-[#c6ff34]/20 rounded-2xl p-4 text-xs text-slate-300 space-y-2 font-mono">
                  <div className="flex items-center gap-2 text-[#c6ff34] font-bold">
                    <span>⚠️</span>
                    <span>Important Test Guidelines</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                    <li>The 60-minute countdown starts immediately once you click Start.</li>
                    <li>Mark one box per question (A, B, C, or D).</li>
                    <li>Each question carries 1 mark. There is no negative marking.</li>
                    <li>Your details are automatically saved securely to the database upon starting.</li>
                    <li>You can jump between any of the 40 questions freely using the question palette.</li>
                  </ul>
                </div>

                {/* Submit / Start Button */}
                <button
                  type="submit"
                  disabled={savingLead}
                  className="w-full py-4 rounded-2xl bg-[#c6ff34] text-[#050521] font-black uppercase tracking-[0.15em] text-sm hover:shadow-[0_0_35px_rgba(198,255,52,0.4)] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  {savingLead ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#050521] border-t-transparent rounded-full animate-spin" />
                      <span>Saving Student Details...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Aptitude Test V2 (40 Questions)</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: 40-QUESTION TEST SCREEN WITH 4 SECTIONS & TIMER                   */}
          {/* ========================================================================= */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Sticky Top HUD Bar */}
              <div className="sticky top-20 z-30 bg-[#0D1318]/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
                {/* Candidate Info Badge */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#c6ff34]/20 border border-[#c6ff34]/30 flex items-center justify-center text-[#c6ff34] font-black text-xs">
                    {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase text-white truncate max-w-[150px] sm:max-w-xs">
                      {formData.fullName}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      📍 {formData.place || "Online"}
                    </span>
                  </div>
                </div>

                {/* Section Indicator */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono">
                  <span className="text-[#c6ff34] font-bold">{currentSection.title}:</span>
                  <span className="text-slate-300">{currentSection.name}</span>
                </div>

                {/* Timer & Question Counter & Submit */}
                <div className="flex items-center gap-3 ml-auto">
                  {/* Progress Counter */}
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                      Answered
                    </span>
                    <span className="text-xs font-bold text-white font-mono">
                      <span className="text-[#c6ff34]">{answeredCount}</span> / 40 ({progressPct}%)
                    </span>
                  </div>

                  {/* 60-Minute Countdown Clock */}
                  <div
                    className={`px-3 sm:px-4 py-2 rounded-xl border flex items-center gap-2 font-mono font-bold text-sm sm:text-base ${
                      timeLeft < 300
                        ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse"
                        : timeLeft < 900
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                        : "bg-[#c6ff34]/10 border-[#c6ff34]/30 text-[#c6ff34]"
                    }`}
                  >
                    <span>⏱️</span>
                    <span>{formatTime(timeLeft)}</span>
                  </div>

                  {/* Question Palette Toggle */}
                  <button
                    type="button"
                    onClick={() => setPaletteOpen((prev) => !prev)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-mono transition-colors"
                    title="Toggle Question Palette"
                  >
                    🔢 Grid
                  </button>

                  {/* Submit Test Button */}
                  <button
                    type="button"
                    onClick={() => handleSubmitTest(false)}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Test"}
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-[#c6ff34] to-emerald-400 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* 4 Section Navigation Tabs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {APTITUDE_SECTIONS.map((sec) => {
                  const isActive = currentSection.id === sec.id;
                  // Count answered in this section
                  const sectionAnswered = aptitudeV2Questions
                    .filter((q) => q.id >= sec.startId && q.id <= sec.endId)
                    .filter((q) => Boolean(userAnswers[q.id])).length;

                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => handleJumpToSection(sec.id)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#c6ff34]/15 border-[#c6ff34] text-white shadow-lg"
                          : "bg-[#0D1318]/70 border-white/10 hover:border-white/20 text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className={isActive ? "text-[#c6ff34] font-bold" : "text-slate-400"}>
                          {sec.title}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-bold">
                          {sectionAnswered}/10
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1 truncate">
                        {sec.name}
                      </h4>
                      <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                        {sec.questionRange}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Collapsible 40-Question Quick Jump Palette */}
              {paletteOpen && (
                <div className="p-4 bg-[#0D1318]/95 border border-white/10 rounded-2xl backdrop-blur-md animate-in fade-in duration-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono">
                      Question Palette (Jump to Any Question)
                    </span>
                    <div className="flex items-center gap-3 text-[10px] font-mono">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Answered ({answeredCount})
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-white/10 inline-block" /> Unanswered ({40 - answeredCount})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-20 gap-2">
                    {aptitudeV2Questions.map((q, idx) => {
                      const isAnswered = Boolean(userAnswers[q.id]);
                      const isCurrent = idx === currentQIndex;

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => {
                            setCurrentQIndex(idx);
                            window.scrollTo({ top: 120, behavior: "smooth" });
                          }}
                          className={`h-9 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border ${
                            isCurrent
                              ? "bg-[#c6ff34] text-[#050521] border-[#c6ff34] ring-2 ring-[#c6ff34]/40 font-black scale-105"
                              : isAnswered
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
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
              <div className="bg-[#0D1318]/90 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative">
                {/* Question Section & Meta Info */}
                <div className="flex flex-wrap justify-between items-center gap-2 pb-4 mb-6 border-b border-white/10">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-[#c6ff34]/10 text-[#c6ff34] border border-[#c6ff34]/30 text-xs font-mono font-bold">
                      {currentQ.section} · {currentQ.sectionTitle}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-mono">
                      Question {currentQ.id} of 40
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    1 Mark • No Negative
                  </span>
                </div>

                {/* Context Table for Section C (Q21 - Q24) */}
                {currentQ.hasTable && (
                  <div className="mb-6 p-4 sm:p-5 bg-white/5 border border-[#c6ff34]/30 rounded-2xl">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#c6ff34] font-bold uppercase tracking-wider mb-2">
                      <span>📊</span>
                      <span>Weekly Sales Data Table (Refer for Questions 21–24)</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mb-3">
                      Number of units sold by a business across 5 consecutive weekdays:
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-300 bg-white/5">
                            <th className="py-2.5 px-4 font-bold">Day</th>
                            {WEEKLY_SALES_TABLE.map((row) => (
                              <th key={row.day} className="py-2.5 px-4 font-bold text-center">
                                {row.day}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-white/5 text-white">
                            <td className="py-2.5 px-4 font-bold text-[#c6ff34]">Units sold</td>
                            {WEEKLY_SALES_TABLE.map((row) => (
                              <td key={row.day} className="py-2.5 px-4 text-center font-black text-sm">
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
                <div className="mb-8">
                  <h2 className="text-base sm:text-xl font-bold text-white leading-relaxed whitespace-pre-line">
                    <span className="text-[#c6ff34] font-mono mr-2">{currentQ.id}.</span>
                    {currentQ.question}
                  </h2>
                </div>

                {/* Options Grid (A, B, C, D) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {currentQ.options.map((opt) => {
                    const isSelected = userAnswers[currentQ.id] === opt.key;

                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, opt.key)}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? "bg-[#c6ff34]/20 border-[#c6ff34] text-white shadow-[0_0_20px_rgba(198,255,52,0.15)] ring-1 ring-[#c6ff34]"
                            : "bg-[#050521]/40 border-white/10 hover:border-white/30 text-slate-300 hover:text-white hover:bg-[#050521]/80"
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 transition-all ${
                            isSelected
                              ? "bg-[#c6ff34] text-[#050521] shadow-md"
                              : "bg-white/10 text-white"
                          }`}
                        >
                          {opt.key}
                        </span>
                        <div className="flex-1 pt-0.5">
                          <span className="text-sm font-medium leading-snug block">
                            {opt.text}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="text-[#c6ff34] text-sm font-bold shrink-0">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Question Bottom Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      type="button"
                      disabled={currentQIndex === 0}
                      onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold font-mono transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    >
                      ← Previous
                    </button>

                    {/* Clear Answer Button */}
                    {userAnswers[currentQ.id] && (
                      <button
                        type="button"
                        onClick={() => handleClearAnswer(currentQ.id)}
                        className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Next Question / Finish Button */}
                    {currentQIndex < aptitudeV2Questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQIndex((prev) =>
                            Math.min(aptitudeV2Questions.length - 1, prev + 1)
                          )
                        }
                        className="px-5 py-2.5 rounded-xl bg-[#c6ff34] hover:bg-[#b0f516] text-[#050521] text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
                      >
                        <span>Next Question</span>
                        <span>→</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSubmitTest(false)}
                        disabled={submitting}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-[#c6ff34] text-[#050521] text-xs font-black uppercase tracking-wider transition-all shadow-lg cursor-pointer disabled:opacity-50"
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
              className="space-y-8"
            >
              {/* Success Banner */}
              <div className="bg-[#0D1318]/90 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl text-center space-y-6 relative overflow-hidden">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-[#c6ff34]/20 border border-[#c6ff34]/40 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(198,255,52,0.3)]">
                  🎉
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#c6ff34] block">
                    Assessment Completed
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                    Congratulations, {formData.fullName}!
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-lg mx-auto">
                    Your responses have been successfully recorded in the Deepstaq database. Here is your comprehensive performance scorecard.
                  </p>
                </div>

                {/* Big Score Card */}
                <div className="max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 backdrop-blur-md space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-400 border-b border-white/10 pb-3">
                    <span>Overall Score</span>
                    <span className="text-[#c6ff34] font-bold">{result.performanceRating}</span>
                  </div>

                  <div className="py-2">
                    <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#c6ff34] via-emerald-300 to-teal-300 tracking-tight">
                      {result.score}
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold text-slate-400"> / {result.totalQuestions}</span>
                    <span className="block text-sm font-mono text-slate-300 mt-1">
                      Percentage: <strong className="text-white">{result.percentage}%</strong>
                    </span>
                  </div>

                  {/* Candidate Quick Info */}
                  <div className="grid grid-cols-2 gap-2 text-left pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block text-slate-500">Candidate</span>
                      <span className="text-white font-bold truncate block">{formData.fullName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block text-slate-500">Date</span>
                      <span className="text-white font-bold block">{formData.testDate}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block text-slate-500">Location</span>
                      <span className="text-white font-bold block truncate">{formData.place}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block text-slate-500">Time Spent</span>
                      <span className="text-white font-bold block">
                        {Math.floor(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4 Section Performance Breakdown Cards */}
                <div className="text-left pt-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono mb-4 text-center">
                    Section-by-Section Performance
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {APTITUDE_SECTIONS.map((sec) => {
                      const secData = result.sectionBreakdown[sec.id] || { score: 0, total: 10 };
                      const secPct = Math.round((secData.score / secData.total) * 100);

                      return (
                        <div
                          key={sec.id}
                          className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] font-mono text-[#c6ff34] font-bold block uppercase tracking-wider">
                              {sec.title}
                            </span>
                            <h4 className="text-xs font-bold text-white mt-0.5 truncate">
                              {sec.name}
                            </h4>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/5 flex items-baseline justify-between">
                            <span className="text-xl font-black text-white font-mono">
                              {secData.score} <span className="text-xs text-slate-500 font-normal">/ {secData.total}</span>
                            </span>
                            <span className="text-xs font-mono font-bold text-emerald-400">
                              {secPct}%
                            </span>
                          </div>

                          {/* Mini Progress */}
                          <div className="w-full bg-white/10 rounded-full h-1 mt-2 overflow-hidden">
                            <div
                              className="h-full bg-[#c6ff34] rounded-full"
                              style={{ width: `${secPct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowReview((prev) => !prev)}
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {showReview ? "Hide Detailed Review" : "Review All 40 Questions & Answers"}
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    🖨️ Print / Save Scorecard
                  </button>

                  <Link
                    to="/programs"
                    className="px-6 py-3 rounded-xl bg-[#c6ff34] text-[#050521] text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-[0_0_25px_rgba(198,255,52,0.4)]"
                  >
                    Explore Deepstaq AI Programs →
                  </Link>
                </div>
              </div>

              {/* DETAILED 40-QUESTION ANSWERS REVIEW ACCORDION */}
              {showReview && (
                <div className="bg-[#0D1318]/90 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-6">
                  <div className="flex flex-wrap justify-between items-center gap-3 pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-lg font-black uppercase text-white tracking-tight">
                        Detailed Answer Review
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Inspect all 40 questions, your selected answer, correct solution, and detailed explanations.
                      </p>
                    </div>

                    {/* Filter buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                      {["ALL", "SECTION A", "SECTION B", "SECTION C", "SECTION D"].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setReviewSectionFilter(f)}
                          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            reviewSectionFilter === f
                              ? "bg-[#c6ff34] text-[#050521] border-[#c6ff34] font-black"
                              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-4">
                    {result.detailedAnswers
                      .filter((ans) =>
                        reviewSectionFilter === "ALL" ? true : ans.section === reviewSectionFilter
                      )
                      .map((ans, idx) => (
                        <div
                          key={ans.questionId}
                          className={`p-5 rounded-2xl border transition-all ${
                            ans.isCorrect
                              ? "bg-emerald-500/5 border-emerald-500/30"
                              : "bg-red-500/5 border-red-500/30"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                              Q{ans.questionId}. [{ans.section} · {ans.sectionTitle}]
                            </span>
                            <span
                              className={`text-[9px] font-mono font-black uppercase px-2.5 py-0.5 rounded-md ${
                                ans.isCorrect
                                  ? "bg-emerald-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {ans.isCorrect ? "✓ Correct (1 Mark)" : "✕ Incorrect (0 Marks)"}
                            </span>
                          </div>

                          <p className="text-sm font-bold text-white mb-4 leading-relaxed whitespace-pre-line">
                            {ans.question}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono mb-3">
                            {/* Selected Answer */}
                            <div
                              className={`p-3 rounded-xl border ${
                                ans.isCorrect
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                                  : "bg-red-500/10 border-red-500/30 text-red-200"
                              }`}
                            >
                              <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                                Your Selection:
                              </span>
                              <span className="font-bold">
                                {ans.selectedAnswerKey ? `(${ans.selectedAnswerKey}) ${ans.selectedAnswerText}` : "Not Answered"}
                              </span>
                            </div>

                            {/* Correct Answer */}
                            <div className="p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-300">
                              <span className="block text-[9px] font-black uppercase tracking-wider text-emerald-400 mb-0.5">
                                Correct Answer:
                              </span>
                              <span className="font-bold">
                                ({ans.correctAnswerKey}) {ans.correctAnswerText}
                              </span>
                            </div>
                          </div>

                          {/* Explanation */}
                          {ans.explanation && (
                            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] font-mono text-slate-300">
                              <strong className="text-[#c6ff34] mr-1">Explanation:</strong>
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
