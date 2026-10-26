import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { saveScholarshipApplication, saveScholarshipLead } from "../services/dbService";

const EDUCATION_OPTIONS = [
  { value: "School", label: "School (10th / 12th)" },
  { value: "Diploma", label: "Diploma" },
  { value: "UG", label: "Undergraduate (UG / Bachelor's)" },
  { value: "PG", label: "Postgraduate (PG / Master's)" },
  { value: "Working Professional", label: "Working Professional" },
];

const OCCUPATION_OPTIONS = [
  { value: "Student", label: "Student" },
  { value: "Employed", label: "Employed" },
  { value: "Job-seeking", label: "Job-seeking" },
  { value: "Freelancer", label: "Freelancer" },
  { value: "Other", label: "Other" },
];

const CODING_EXPOSURE_OPTIONS = [
  { value: "None", label: "None", desc: "Completely new to coding & AI" },
  { value: "Basic", label: "Basic", desc: "Written simple Python/HTML or basic concepts" },
  { value: "Intermediate", label: "Intermediate", desc: "Built projects or have tech background" },
];

const POST_COURSE_GOALS = [
  { value: "Job", label: "Get an AI/Tech Job" },
  { value: "Freelance", label: "Work as Freelancer / Consultant" },
  { value: "Higher studies", label: "Pursue Higher Studies / Research" },
  { value: "Start something of my own", label: "Start My Own AI Venture / Product" },
  { value: "Not sure yet", label: "Not sure yet / Exploring opportunities" },
];

const STEPS = [
  { id: 1, title: "Basic Details", subtitle: "Personal & Contact" },
  { id: 2, title: "Background", subtitle: "Education & Hardware" },
  { id: 3, title: "Intent & Fit", subtitle: "Motivation & Goals" },
  { id: 4, title: "Logistics", subtitle: "Exam & Agreement" },
];

export default function Scholarship() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [savingStep1, setSavingStep1] = useState(false);
  const [savedApplicationId, setSavedApplicationId] = useState(() => sessionStorage.getItem("ds_scholarship_doc_id") || "");
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [errors, setErrors] = useState({});
  const [hasVisitedInstagram, setHasVisitedInstagram] = useState(false);

  const [form, setForm] = useState({
    // Section 1: Basic Details
    fullName: "",
    phone: "",
    email: "",
    age: "",
    cityDistrict: "",

    // Section 2: Background
    educationLevel: "",
    currentOccupation: "",
    occupationOther: "",
    hasLaptopAndInternet: "",
    priorCodingAiExposure: "",

    // Section 3: Intent & Fit
    whyJoinReason: "",
    postCourseGoal: "",
    canCommitOctoberBatch: "",

    // Section 4: Logistics & Verification
    availableForExam: "",
    followingInstagram: false,
    agreedFollowDeepStaq: false,
    agreedDiscontinueLiability: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleInstagramCheckboxClick = (e) => {
    if (!hasVisitedInstagram) {
      e.preventDefault();
      setHasVisitedInstagram(true);
      window.open("https://www.instagram.com/deepstaq/", "_blank", "noopener,noreferrer");
      return;
    }

    setForm((prev) => {
      const nextVal = !prev.followingInstagram;
      return { ...prev, followingInstagram: nextVal, agreedFollowDeepStaq: nextVal };
    });

    if (errors.followingInstagram) {
      setErrors((prev) => ({ ...prev, followingInstagram: "" }));
    }
  };

  const handleSelectOption = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!form.fullName.trim()) newErrors.fullName = "Please enter your full name.";
      if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) {
        newErrors.phone = "Please enter a valid 10-digit WhatsApp number.";
      }
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
      if (!form.age || isNaN(form.age) || Number(form.age) < 14 || Number(form.age) > 70) {
        newErrors.age = "Please enter a valid age (14 - 70).";
      }
      if (!form.cityDistrict.trim()) {
        newErrors.cityDistrict = "Please enter your City or District.";
      }
    }

    if (step === 2) {
      if (!form.educationLevel) {
        newErrors.educationLevel = "Please select your highest education level.";
      }
      if (!form.currentOccupation) {
        newErrors.currentOccupation = "Please select your current occupation.";
      }
      if (form.currentOccupation === "Other" && !form.occupationOther.trim()) {
        newErrors.occupationOther = "Please specify your occupation.";
      }
      if (!form.hasLaptopAndInternet) {
        newErrors.hasLaptopAndInternet = "Please indicate if you have a laptop/computer with stable internet.";
      }
      if (!form.priorCodingAiExposure) {
        newErrors.priorCodingAiExposure = "Please select your prior coding or AI/ML exposure.";
      }
    }

    if (step === 3) {
      if (!form.whyJoinReason.trim() || form.whyJoinReason.trim().length < 10) {
        newErrors.whyJoinReason = "Please provide a brief answer (2-3 lines) explaining why you want to join.";
      }
      if (!form.postCourseGoal) {
        newErrors.postCourseGoal = "Please select what you hope to do after completing this course.";
      }
      if (!form.canCommitOctoberBatch) {
        newErrors.canCommitOctoberBatch = "Please confirm whether you can commit to the full course duration.";
      }
    }

    if (step === 4) {
      if (!form.availableForExam) {
        newErrors.availableForExam = "Please indicate your availability to take the scholarship entrance exam.";
      }
      if (!form.followingInstagram) {
        newErrors.followingInstagram = "Please confirm that you follow @deepstaq on Instagram.";
      }
      if (!form.agreedDiscontinueLiability) {
        newErrors.agreedDiscontinueLiability = "You must acknowledge and accept the course terms.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    // Automatically save customer data to database when clicking Next on Section 1
    if (currentStep === 1) {
      setSavingStep1(true);
      try {
        const res = await saveScholarshipLead(form);
        if (res?.id) {
          setSavedApplicationId(res.id);
          sessionStorage.setItem("ds_scholarship_doc_id", res.id);
        }
      } catch (err) {
        console.warn("Auto-saving Section 1 lead failed:", err);
      } finally {
        setSavingStep1(false);
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validateStep(4)) return;

    // Rate-limiting check (cooldown of 10s between submissions from same session)
    const lastSubTime = sessionStorage.getItem("ds_last_scholarship_sub");
    if (lastSubTime && Date.now() - Number(lastSubTime) < 10000) {
      alert("Please wait a moment before submitting again.");
      return;
    }

    setLoading(true);
    try {
      const existingId = savedApplicationId || sessionStorage.getItem("ds_scholarship_doc_id");
      const res = await saveScholarshipApplication(form, existingId);
      sessionStorage.setItem("ds_last_scholarship_sub", String(Date.now()));
      setSubmissionId(res?.id || `SCH-${Date.now().toString().slice(-6)}`);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit application. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D11] text-white pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-16 md:pb-24 px-3 sm:px-6 lg:px-8 relative overflow-x-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-gradient-to-b from-[#c6ff34]/15 via-transparent to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Header / Hero Section */}
        <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12 px-2">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#c6ff34]/10 text-white border border-[#c6ff34]/30 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#c6ff34] animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#c6ff34]">
              DeepStaq AI/ML Scholarship 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight">
            Eligibility Form — DeepStaq AI/ML Scholarship
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Apply for our merit-based scholarship. Complete all 4 sections below to verify your eligibility for the upcoming scholarship entrance examination.
          </p>

          {/* Quick Highlight Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 pt-1">
            <span className="px-3 py-1 bg-white/[0.04] border border-white/10 rounded-lg text-[10px] sm:text-xs font-medium text-slate-200">
              Up to 100% Merit Scholarship
            </span>
            <span className="px-3 py-1 bg-white/[0.04] border border-white/10 rounded-lg text-[10px] sm:text-xs font-medium text-slate-200">
              Hands-On AI/ML Training
            </span>
            <span className="px-3 py-1 bg-white/[0.04] border border-white/10 rounded-lg text-[10px] sm:text-xs font-medium text-slate-200">
              Industry Mentorship
            </span>
          </div>
        </div>

        {/* Main Form Container or Success Screen */}
        {!submitted ? (
          <div className="bg-[#0D1318]/90 rounded-2xl sm:rounded-[2rem] border border-white/10 p-4 sm:p-7 md:p-10 lg:p-12 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
            
            {/* Step Progress Tracker */}
            <div className="mb-6 sm:mb-10 pb-5 sm:pb-8 border-b border-white/10">
              
              {/* Mobile Compact Progress Bar */}
              <div className="block sm:hidden mb-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase text-white mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#c6ff34] text-[#090D11] text-[10px] flex items-center justify-center font-mono font-bold">
                      {currentStep}
                    </span>
                    <span>Section {currentStep} of 4</span>
                  </span>
                  <span className="text-slate-400 font-bold">{STEPS[currentStep - 1].title}</span>
                </div>
              </div>

              {/* Tablet/Desktop Full Steps Grid */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
                {STEPS.map((s) => {
                  const isCurrent = currentStep === s.id;
                  const isDone = currentStep > s.id;

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        if (isDone) setCurrentStep(s.id);
                      }}
                      disabled={!isDone && !isCurrent}
                      className={`flex flex-col items-center sm:items-start p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all text-left ${
                        isDone ? "cursor-pointer hover:bg-white/[0.04]" : "cursor-default"
                      } ${isCurrent ? "bg-[#c6ff34]/15 border border-[#c6ff34]/40" : "border border-transparent"}`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <span
                          className={`w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all shrink-0 ${
                            isCurrent
                              ? "bg-[#c6ff34] text-[#090D11]"
                              : isDone
                              ? "bg-[#c6ff34]/20 text-[#c6ff34] font-mono font-bold"
                              : "bg-white/5 text-slate-500"
                          }`}
                        >
                          {isDone ? "✓" : s.id}
                        </span>
                        <span className="hidden md:inline text-[9px] font-mono font-bold uppercase text-slate-400">
                          Step 0{s.id}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] sm:text-[11px] md:text-xs font-bold uppercase truncate w-full text-center sm:text-left ${
                          isCurrent ? "text-[#c6ff34]" : isDone ? "text-slate-200" : "text-slate-500"
                        }`}
                      >
                        {s.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Step Progress Line */}
              <div className="w-full bg-white/10 h-1.5 sm:h-2 rounded-full overflow-hidden mt-3 sm:mt-4">
                <div
                  className="bg-[#c6ff34] h-full transition-all duration-300 rounded-full shadow-[0_0_8px_#c6ff34]"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Form Step Content */}
            <form onSubmit={handleSubmit} noValidate>
              <AnimatePresence mode="wait">
                
                {/* ═══════════════════════════════════════════════════════
                    SECTION 1: BASIC DETAILS
                   ═══════════════════════════════════════════════════════ */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div className="border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wide">
                        Section 1: Basic Details
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Please provide your contact and identification details.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                      {/* 1. Full Name */}
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                          1. Full Name <span className="text-[#c6ff34]">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Rahul Sharma"
                          className={`w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border ${
                            errors.fullName ? "border-red-500 ring-1 ring-red-500" : "border-white/15 focus:border-[#c6ff34]"
                          } text-xs sm:text-sm font-semibold text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#c6ff34]/20 transition-all`}
                        />
                        {errors.fullName && <p className="text-[11px] text-red-400 font-bold">{errors.fullName}</p>}
                      </div>

                      {/* 2. Phone Number */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                          2. Phone Number (WhatsApp) <span className="text-[#c6ff34]">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            +91
                          </span>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="10-digit number"
                            maxLength={10}
                            className={`w-full pl-12 pr-3.5 sm:pr-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border ${
                              errors.phone ? "border-red-500 ring-1 ring-red-500" : "border-white/15 focus:border-[#c6ff34]"
                            } text-xs sm:text-sm font-semibold text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#c6ff34]/20 transition-all`}
                          />
                        </div>
                        {errors.phone && <p className="text-[11px] text-red-400 font-bold">{errors.phone}</p>}
                      </div>

                      {/* 3. Email Address */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                          3. Email Address <span className="text-[#c6ff34]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={`w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border ${
                            errors.email ? "border-red-500 ring-1 ring-red-500" : "border-white/15 focus:border-[#c6ff34]"
                          } text-xs sm:text-sm font-semibold text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#c6ff34]/20 transition-all`}
                        />
                        {errors.email && <p className="text-[11px] text-red-400 font-bold">{errors.email}</p>}
                      </div>

                      {/* 4. Age */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                          4. Age <span className="text-[#c6ff34]">*</span>
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={form.age}
                          onChange={handleChange}
                          placeholder="e.g. 21"
                          min={14}
                          max={70}
                          className={`w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border ${
                            errors.age ? "border-red-500 ring-1 ring-red-500" : "border-white/15 focus:border-[#c6ff34]"
                          } text-xs sm:text-sm font-semibold text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#c6ff34]/20 transition-all`}
                        />
                        {errors.age && <p className="text-[11px] text-red-400 font-bold">{errors.age}</p>}
                      </div>

                      {/* 5. City / District */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                          5. City / District <span className="text-[#c6ff34]">*</span>
                        </label>
                        <input
                          type="text"
                          name="cityDistrict"
                          value={form.cityDistrict}
                          onChange={handleChange}
                          placeholder="e.g. Kannur, Calicut, Kochi"
                          className={`w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border ${
                            errors.cityDistrict ? "border-red-500 ring-1 ring-red-500" : "border-white/15 focus:border-[#c6ff34]"
                          } text-xs sm:text-sm font-semibold text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#c6ff34]/20 transition-all`}
                        />
                        {errors.cityDistrict && <p className="text-[11px] text-red-400 font-bold">{errors.cityDistrict}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ═══════════════════════════════════════════════════════
                    SECTION 2: BACKGROUND
                   ═══════════════════════════════════════════════════════ */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5 sm:space-y-6"
                  >
                    <div className="border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wide">
                        Section 2: Background
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Tell us about your educational background and hardware setup.
                      </p>
                    </div>

                    {/* 1. Highest Education Level */}
                    <div className="space-y-2.5">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 block">
                        1. Highest Education Level <span className="text-[#c6ff34]">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
                        {EDUCATION_OPTIONS.map((edu) => {
                          const isSelected = form.educationLevel === edu.value;
                          return (
                            <button
                              key={edu.value}
                              type="button"
                              onClick={() => handleSelectOption("educationLevel", edu.value)}
                              className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-all text-xs font-bold flex items-center justify-between ${
                                isSelected
                                  ? "bg-[#c6ff34] text-[#090D11] border-[#c6ff34] shadow-[0_0_20px_rgba(198,255,52,0.3)]"
                                  : "bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/10"
                              }`}
                            >
                              <span className="truncate">{edu.label}</span>
                              {isSelected && <span className="text-[#090D11] font-black shrink-0 ml-1">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                      {errors.educationLevel && (
                        <p className="text-[11px] text-red-400 font-bold">{errors.educationLevel}</p>
                      )}
                    </div>

                    {/* 2. Current Occupation */}
                    <div className="space-y-2.5">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 block">
                        2. Current Occupation <span className="text-[#c6ff34]">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
                        {OCCUPATION_OPTIONS.map((occ) => {
                          const isSelected = form.currentOccupation === occ.value;
                          return (
                            <button
                              key={occ.value}
                              type="button"
                              onClick={() => handleSelectOption("currentOccupation", occ.value)}
                              className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-center transition-all text-xs font-bold flex flex-col items-center justify-center ${
                                isSelected
                                  ? "bg-[#c6ff34] text-[#090D11] border-[#c6ff34] shadow-[0_0_20px_rgba(198,255,52,0.3)]"
                                  : "bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/10"
                              }`}
                            >
                              <span className="text-[11px] sm:text-xs truncate w-full">{occ.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {form.currentOccupation === "Other" && (
                        <div className="pt-2">
                          <input
                            type="text"
                            name="occupationOther"
                            value={form.occupationOther}
                            onChange={handleChange}
                            placeholder="Please specify your occupation"
                            className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/15 focus:border-[#c6ff34] text-xs font-medium text-white placeholder-slate-500 outline-none"
                          />
                          {errors.occupationOther && (
                            <p className="text-[11px] text-red-400 font-bold mt-1">{errors.occupationOther}</p>
                          )}
                        </div>
                      )}
                      {errors.currentOccupation && (
                        <p className="text-[11px] text-red-400 font-bold">{errors.currentOccupation}</p>
                      )}
                    </div>

                    {/* 3. Laptop/Computer Filter */}
                    <div className="space-y-2.5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-amber-500/30">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-200 block">
                            3. Do you have access to a laptop/computer with stable internet? <span className="text-[#c6ff34]">*</span>
                          </label>
                          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                            (Critical filter — since the AI/ML course requires active model programming)
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1.5">
                        {["Yes", "No"].map((opt) => {
                          const isSelected = form.hasLaptopAndInternet === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleSelectOption("hasLaptopAndInternet", opt)}
                              className={`py-3 px-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                                isSelected
                                  ? opt === "Yes"
                                    ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                                    : "bg-red-500/80 text-white border-red-500 shadow-md"
                                  : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]"
                              }`}
                            >
                              {opt === "Yes" ? "✓ Yes, I have access" : "✕ No, I don't have"}
                            </button>
                          );
                        })}
                      </div>
                      {errors.hasLaptopAndInternet && (
                        <p className="text-[11px] text-red-400 font-bold">{errors.hasLaptopAndInternet}</p>
                      )}
                    </div>

                    {/* 4. Prior exposure to coding or AI/ML */}
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 block">
                          4. Have you had any prior exposure to coding or AI/ML? <span className="text-[#c6ff34]">*</span>
                        </label>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                          (Not disqualifying — purely for cohort grouping & context)
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                        {CODING_EXPOSURE_OPTIONS.map((exp) => {
                          const isSelected = form.priorCodingAiExposure === exp.value;
                          return (
                            <button
                              key={exp.value}
                              type="button"
                              onClick={() => handleSelectOption("priorCodingAiExposure", exp.value)}
                              className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-all ${
                                isSelected
                                  ? "bg-[#c6ff34]/15 text-white border-[#c6ff34] shadow-[0_0_20px_rgba(198,255,52,0.15)]"
                                  : "bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/10"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-black uppercase tracking-wide">{exp.label}</span>
                                {isSelected && <span className="text-[#c6ff34] text-xs font-black">✓</span>}
                              </div>
                              <p className={`text-[10px] sm:text-[11px] leading-relaxed ${isSelected ? "text-slate-200" : "text-slate-400"}`}>
                                {exp.desc}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                      {errors.priorCodingAiExposure && (
                        <p className="text-[11px] text-red-400 font-bold">{errors.priorCodingAiExposure}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ═══════════════════════════════════════════════════════
                    SECTION 3: INTENT & FIT
                   ═══════════════════════════════════════════════════════ */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5 sm:space-y-6"
                  >
                    <div className="border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wide">
                        Section 3: Intent & Fit
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Tell us about your learning motivation and future career ambitions.
                      </p>
                    </div>

                    {/* 1. Why do you want to join */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 block">
                        1. Why do you want to join this AI/ML program? (2-3 lines) <span className="text-[#c6ff34]">*</span>
                      </label>
                      <textarea
                        name="whyJoinReason"
                        rows={3}
                        value={form.whyJoinReason}
                        onChange={handleChange}
                        placeholder="Explain your motivation, interests, or career ambitions..."
                        className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/[0.04] border ${
                          errors.whyJoinReason ? "border-red-500 ring-1 ring-red-500" : "border-white/15 focus:border-[#c6ff34]"
                        } text-xs sm:text-sm font-semibold text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#c6ff34]/20 transition-all resize-none leading-relaxed`}
                      />
                      {errors.whyJoinReason && (
                        <p className="text-[11px] text-red-400 font-bold">{errors.whyJoinReason}</p>
                      )}
                    </div>

                    {/* 2. What do you hope to do */}
                    <div className="space-y-2.5">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 block">
                        2. What do you hope to do after completing this course? <span className="text-[#c6ff34]">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                        {POST_COURSE_GOALS.map((goal) => {
                          const isSelected = form.postCourseGoal === goal.value;
                          return (
                            <button
                              key={goal.value}
                              type="button"
                              onClick={() => handleSelectOption("postCourseGoal", goal.value)}
                              className={`p-3 rounded-xl sm:rounded-2xl border text-left transition-all text-xs font-bold flex items-center justify-between gap-2.5 ${
                                isSelected
                                  ? "bg-[#c6ff34] text-[#090D11] border-[#c6ff34] shadow-[0_0_20px_rgba(198,255,52,0.3)]"
                                  : "bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/10"
                              }`}
                            >
                              <span className="flex-1 truncate">{goal.label}</span>
                              {isSelected ? (
                                <span className="text-[#090D11] font-black shrink-0">✓</span>
                              ) : (
                                <span className="text-slate-500 text-xs shrink-0">→</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {errors.postCourseGoal && (
                        <p className="text-[11px] text-red-400 font-bold">{errors.postCourseGoal}</p>
                      )}
                    </div>

                    {/* 3. October batch commitment */}
                    <div className="space-y-2.5">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 block">
                        3. Can you commit to the full course duration and attendance for the October batch? <span className="text-[#c6ff34]">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {["Yes", "No"].map((opt) => {
                          const isSelected = form.canCommitOctoberBatch === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleSelectOption("canCommitOctoberBatch", opt)}
                              className={`py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                                isSelected
                                  ? "bg-[#c6ff34] text-[#090D11] border-[#c6ff34]"
                                  : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]"
                              }`}
                            >
                              {opt === "Yes" ? "✓ Yes, 100% committed" : "✕ No / Tentative"}
                            </button>
                          );
                        })}
                      </div>
                      {errors.canCommitOctoberBatch && (
                        <p className="text-[11px] text-red-400 font-bold">{errors.canCommitOctoberBatch}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ═══════════════════════════════════════════════════════
                    SECTION 4: LOGISTICS & CONSENT
                   ═══════════════════════════════════════════════════════ */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5 sm:space-y-6"
                  >
                    <div className="border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wide">
                        Section 4: Logistics & Verification
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Exam availability, Instagram verification, and terms undertaking.
                      </p>
                    </div>

                    {/* 1. Exam Availability */}
                    <div className="space-y-2.5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 block">
                        1. Are you available to take the scholarship entrance exam on the scheduled window? <span className="text-[#c6ff34]">*</span>
                      </label>
                      <p className="text-[10px] sm:text-[11px] text-slate-400">
                        The test assesses basic logical thinking, interest, and analytical reasoning.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1.5">
                        {["Yes", "No"].map((opt) => {
                          const isSelected = form.availableForExam === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleSelectOption("availableForExam", opt)}
                              className={`py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                                isSelected
                                  ? "bg-[#c6ff34] text-[#090D11] border-[#c6ff34]"
                                  : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]"
                              }`}
                            >
                              {opt === "Yes" ? "✓ Yes, available" : "✕ Not available"}
                            </button>
                          );
                        })}
                      </div>
                      {errors.availableForExam && (
                        <p className="text-[11px] text-red-400 font-bold">{errors.availableForExam}</p>
                      )}
                    </div>

                    {/* 2. Instagram Follow Verification Checkbox */}
                    <div className="space-y-2 pt-1">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 block">
                        2. Instagram Follow Verification <span className="text-[#c6ff34]">*</span>
                      </label>
                      <div
                        onClick={handleInstagramCheckboxClick}
                        className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border cursor-pointer transition-all ${
                          form.followingInstagram
                            ? "bg-[#c6ff34]/15 border-[#c6ff34]"
                            : hasVisitedInstagram
                            ? "bg-purple-950/40 border-purple-500/50 hover:bg-purple-900/40"
                            : "bg-white/[0.03] hover:bg-white/[0.06] border-white/10"
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="followingInstagram"
                          checked={form.followingInstagram}
                          onChange={() => {}} // Controlled via container click
                          className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded border-white/20 focus:ring-0 cursor-pointer accent-[#c6ff34] shrink-0 pointer-events-none"
                        />
                        <div className="text-[11px] sm:text-xs font-medium text-slate-300 leading-relaxed w-full">
                          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                            <span className="text-white font-bold uppercase text-xs">
                              DeepStaq Official Page Follow
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shadow-sm ${
                              form.followingInstagram
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : hasVisitedInstagram
                                ? "bg-[#c6ff34] text-[#090D11] border-[#c6ff34]"
                                : "bg-white/10 text-cyan-400 border-white/15"
                            }`}>
                              {form.followingInstagram
                                ? "✓ Follow Confirmed"
                                : hasVisitedInstagram
                                ? "Click again to confirm follow"
                                : "1st Click: Opens @deepstaq ↗"}
                            </span>
                          </div>
                          <span>
                            I confirm that I am following the official DeepStaq Instagram page (<strong className="text-white">@deepstaq</strong>) to verify my eligibility.
                          </span>
                          {!hasVisitedInstagram && (
                            <p className="text-[10px] font-medium text-slate-400 mt-1">
                              Tip: Clicking will open Instagram in a new tab to follow, then click again to check the box.
                            </p>
                          )}
                        </div>
                      </div>
                      {errors.followingInstagram && (
                        <p className="text-[11px] text-red-400 font-bold">{errors.followingInstagram}</p>
                      )}
                    </div>

                    {/* 3. Course Completion Undertaking */}
                    <div className="space-y-2 pt-1">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 block">
                        3. Terms Undertaking <span className="text-[#c6ff34]">*</span>
                      </label>
                      <label className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          name="agreedDiscontinueLiability"
                          checked={form.agreedDiscontinueLiability}
                          onChange={handleChange}
                          className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded border-white/20 focus:ring-0 cursor-pointer accent-[#c6ff34] shrink-0"
                        />
                        <div className="text-[11px] sm:text-xs font-medium text-slate-300 leading-relaxed">
                          <strong className="text-white block mb-0.5">Course Completion Undertaking</strong>
                          I understand that discontinuing the course mid-way may involve a fee liability as per the scholarship terms.
                        </div>
                      </label>
                      {errors.agreedDiscontinueLiability && (
                        <p className="text-[11px] text-red-400 font-bold">{errors.agreedDiscontinueLiability}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-white/10">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/15 bg-white/5 text-slate-200 font-bold uppercase text-xs tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <span>←</span>
                    <span>Back</span>
                  </button>
                ) : (
                  <div className="hidden sm:block" />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={savingStep1}
                    className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-xl bg-[#c6ff34] text-[#090D11] font-bold uppercase text-xs tracking-widest hover:shadow-[0_0_25px_rgba(198,255,52,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 sm:ml-auto disabled:opacity-75"
                  >
                    {savingStep1 ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[#090D11] border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Next Section</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl bg-[#c6ff34] text-[#090D11] font-bold uppercase text-xs tracking-widest hover:shadow-[0_0_30px_rgba(198,255,52,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 sm:ml-auto disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#090D11] border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          /* ═══════════════════════════════════════════════════════
              SUCCESS SCREEN
             ═══════════════════════════════════════════════════════ */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0D1318]/90 rounded-2xl sm:rounded-[2rem] border border-white/10 p-5 sm:p-10 md:p-12 shadow-2xl backdrop-blur-2xl text-center space-y-5 sm:space-y-6"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#c6ff34] text-[#090D11] rounded-full flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(198,255,52,0.4)]">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#090D11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c6ff34]">
                Application Received · ID: {submissionId.slice(0, 10)}
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight">
                Scholarship Application Submitted!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{form.fullName}</strong>. Your eligibility application has been logged into our admissions system.
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-left max-w-lg mx-auto space-y-2.5 font-mono text-xs">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400 font-bold uppercase">Applicant:</span>
                <span className="text-white font-bold truncate ml-2">{form.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400 font-bold uppercase">Phone:</span>
                <span className="text-white font-bold">{form.phone}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400 font-bold uppercase">Status:</span>
                <span className="text-[#c6ff34] font-bold uppercase text-right">Eligibility Verified · Pending Exam</span>
              </div>
            </div>

            <div className="space-y-2.5 max-w-md mx-auto pt-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Next Steps for Applicants:
              </h4>
              <ul className="text-xs text-slate-300 space-y-2 text-left bg-[#c6ff34]/10 border border-[#c6ff34]/20 p-3.5 sm:p-4 rounded-xl">
                <li className="flex items-start gap-2">
                  <span className="text-[#c6ff34] font-bold">1.</span>
                  <span>Our team will notify you via WhatsApp with the exact date, timing, and link for the entrance examination.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c6ff34] font-bold">2.</span>
                  <span>Make sure you are following <strong>@deepstaq</strong> on Instagram for live shortlist announcements.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-3">
              <a
                href={`https://api.whatsapp.com/send?phone=919495957011&text=${encodeURIComponent(
                  `Hi DeepStaq! I have submitted my AI/ML Scholarship Eligibility Application.\nName: ${form.fullName}\nApp ID: ${submissionId}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2 text-center"
              >
                <span>Chat on WhatsApp</span>
              </a>

              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3.5 bg-white/5 border border-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white/10 transition-all text-center"
              >
                Return to Home
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
