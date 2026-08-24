import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { saveAptitudeTestSubmission } from "../services/dbService";

export const aptitudeQuestions = [
  {
    id: 1,
    question: "What does \"AI\" stand for?",
    options: [
      { key: "A", text: "Algorithmic Integration" },
      { key: "B", text: "Applied Informatics" },
      { key: "C", text: "Artificial Intelligence" },
      { key: "D", text: "Automated Interface" },
    ],
    answer: "C",
    category: "AI Fundamentals",
  },
  {
    id: 2,
    question: "A train travels 180 km in 2.5 hours, then 120 km in 1.5 hours. What is its overall average speed?",
    options: [
      { key: "A", text: "75 km/h" },
      { key: "B", text: "70 km/h" },
      { key: "C", text: "60 km/h" },
      { key: "D", text: "65 km/h" },
    ],
    answer: "A",
    category: "Numerical Aptitude",
  },
  {
    id: 3,
    question: "What is the key difference between AI and traditional software?",
    options: [
      { key: "A", text: "Traditional software is faster" },
      { key: "B", text: "AI can learn patterns from data instead of following only fixed rules" },
      { key: "C", text: "There is no real difference" },
      { key: "D", text: "AI requires no code" },
    ],
    answer: "B",
    category: "AI Fundamentals",
  },
  {
    id: 4,
    question: "Complete the series: 3, 6, 11, 18, 27, __",
    options: [
      { key: "A", text: "40" },
      { key: "B", text: "34" },
      { key: "C", text: "36" },
      { key: "D", text: "38" },
    ],
    answer: "D",
    category: "Logical Reasoning",
  },
  {
    id: 5,
    question: "What is a \"large language model\" (LLM)?",
    options: [
      { key: "A", text: "A spell-checking tool" },
      { key: "B", text: "A database of pre-written answers" },
      { key: "C", text: "An AI trained on massive text data to understand and generate language" },
      { key: "D", text: "A dictionary app" },
    ],
    answer: "C",
    category: "Generative AI",
  },
  {
    id: 6,
    question: "If all Zips are Zaps, and some Zaps are Zops, then:",
    options: [
      { key: "A", text: "No Zips are Zops" },
      { key: "B", text: "Some Zips may be Zops" },
      { key: "C", text: "All Zops are Zips" },
      { key: "D", text: "All Zips are Zops" },
    ],
    answer: "B",
    category: "Logical Reasoning",
  },
  {
    id: 7,
    question: "What does \"hallucination\" mean in the context of AI tools like ChatGPT?",
    options: [
      { key: "A", text: "The AI refusing to answer" },
      { key: "B", text: "A visual glitch in the interface" },
      { key: "C", text: "The AI shutting down unexpectedly" },
      { key: "D", text: "The AI generating confident but incorrect or made-up information" },
    ],
    answer: "D",
    category: "Generative AI",
  },
  {
    id: 8,
    question: "An item is marked up 25% then discounted 20%. If the original cost price was 400, what's the final selling price?",
    options: [
      { key: "A", text: "420" },
      { key: "B", text: "400" },
      { key: "C", text: "380" },
      { key: "D", text: "360" },
    ],
    answer: "B",
    category: "Numerical Aptitude",
  },
  {
    id: 9,
    question: "Which of these best describes \"prompt engineering\"?",
    options: [
      { key: "A", text: "Writing code to build an AI model from scratch" },
      { key: "B", text: "Testing internet speed" },
      { key: "C", text: "Repairing broken AI hardware" },
      { key: "D", text: "Crafting inputs/instructions to get better outputs from an AI" },
    ],
    answer: "D",
    category: "Generative AI",
  },
  {
    id: 10,
    question: "Which number doesn't belong: 121, 144, 169, 200, 225?",
    options: [
      { key: "A", text: "225" },
      { key: "B", text: "200" },
      { key: "C", text: "144" },
      { key: "D", text: "169" },
    ],
    answer: "B",
    category: "Logical Reasoning",
  },
  {
    id: 11,
    question: "Why might a business hesitate to adopt AI tools?",
    options: [
      { key: "A", text: "AI tools require no learning curve" },
      { key: "B", text: "AI tools don't exist yet" },
      { key: "C", text: "Concerns like data privacy, accuracy, and job impact" },
      { key: "D", text: "AI tools are always free" },
    ],
    answer: "C",
    category: "AI Strategy",
  },
  {
    id: 12,
    question: "If today is Wednesday, what day will it be after 45 days?",
    options: [
      { key: "A", text: "Saturday" },
      { key: "B", text: "Wednesday" },
      { key: "C", text: "Friday" },
      { key: "D", text: "Thursday" },
    ],
    answer: "A",
    category: "Logical Reasoning",
  },
  {
    id: 13,
    question: "What is the main advantage of using AI for repetitive business tasks?",
    options: [
      { key: "A", text: "It saves time and reduces manual effort on predictable tasks" },
      { key: "B", text: "It guarantees zero errors" },
      { key: "C", text: "It eliminates the need for any human oversight forever" },
      { key: "D", text: "It replaces the need for data entirely" },
    ],
    answer: "A",
    category: "AI Strategy",
  },
  {
    id: 14,
    question: "A code reads: A=1, B=2, C=3 ... Z=26. What is the sum of the letters in \"AI\"?",
    options: [
      { key: "A", text: "27" },
      { key: "B", text: "10" },
      { key: "C", text: "18" },
      { key: "D", text: "9" },
    ],
    answer: "B",
    category: "Logical Reasoning",
  },
  {
    id: 15,
    question: "If you wanted an AI to summarize a 20-page report accurately, what matters most?",
    options: [
      { key: "A", text: "Giving it a vague one-line instruction" },
      { key: "B", text: "Asking it in a different language" },
      { key: "C", text: "Giving clear context and specifying the desired format/length" },
      { key: "D", text: "Repeating the same prompt multiple times" },
    ],
    answer: "C",
    category: "Generative AI",
  },
];

export default function Aptitude() {
  const [step, setStep] = useState(1); // 1: Registration, 2: Test, 3: Result
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    place: "",
    institution: "",
  });

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { 1: "C", 2: "A", ... }
  const [lockedQuestions, setLockedQuestions] = useState({}); // { 1: true, 2: true, ... }
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes = 1200 seconds
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const timerRef = useRef(null);

  // 20-Minute Countdown Timer logic
  useEffect(() => {
    if (step === 2) {
      setTimeLeft(1200);
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
    if (!formData.email.trim() || !formData.email.includes("@")) errors.email = "Valid Email is required";
    if (!formData.phone.trim() || formData.phone.trim().length < 10) errors.phone = "Valid 10-digit Phone number required";
    if (!formData.place.trim()) errors.place = "Place / Location is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStartTest = (e) => {
    e.preventDefault();
    if (validateRegistration()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Select option handler - strictly 1 option per question & locked once selected ("select the ans lock it do not chnage it")
  const handleSelectOption = (questionId, optionKey) => {
    if (lockedQuestions[questionId]) return; // If answer is already locked, prevent any change

    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));

    // Immediately lock this question's answer choice
    setLockedQuestions((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const handleNextQuestion = () => {
    const currentQ = aptitudeQuestions[currentQIndex];
    if (currentQ.id && userAnswers[currentQ.id]) {
      setLockedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));
    }
    setCurrentQIndex((prev) => Math.min(aptitudeQuestions.length - 1, prev + 1));
  };

  const currentQ = aptitudeQuestions[currentQIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const progressPct = Math.round((answeredCount / aptitudeQuestions.length) * 100);

  const handleSubmitTest = async (isAutoSubmit = false) => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!isAutoSubmit && answeredCount < aptitudeQuestions.length) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${aptitudeQuestions.length} questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);

    // Calculate score
    let score = 0;
    const detailedAnswers = aptitudeQuestions.map((q) => {
      const selected = userAnswers[q.id] || null;
      const isCorrect = selected === q.answer;
      if (isCorrect) score += 1;

      const selectedOptObj = q.options.find((o) => o.key === selected);
      const correctOptObj = q.options.find((o) => o.key === q.answer);

      return {
        questionId: q.id,
        question: q.question,
        category: q.category,
        selectedAnswerKey: selected,
        selectedAnswerText: selectedOptObj ? selectedOptObj.text : "Not Answered",
        correctAnswerKey: q.answer,
        correctAnswerText: correctOptObj ? correctOptObj.text : "",
        isCorrect,
      };
    });

    const percentage = ((score / aptitudeQuestions.length) * 100).toFixed(1);

    const submissionPayload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      place: formData.place.trim(),
      institution: formData.institution.trim() || "N/A",
      score,
      totalQuestions: aptitudeQuestions.length,
      percentage: Number(percentage),
      detailedAnswers,
      status: "completed",
      isAutoSubmit,
    };

    try {
      await saveAptitudeTestSubmission(submissionPayload);
    } catch (err) {
      console.warn("Firestore save warning in Aptitude.jsx:", err);
    } finally {
      setResult({
        score,
        total: aptitudeQuestions.length,
        percentage: Number(percentage),
        isAutoSubmit,
      });
      setStep(3);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#050521] pt-28 pb-20 px-4 sm:px-8 font-sans relative">
      <div className="max-w-4xl mx-auto">

        {/* Header Title */}
        <div className="text-center mb-10 space-y-4">
          <span className="inline-block bg-[#c6ff34] text-[#050521] border-2 border-[#050521] px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_#050521]">
            DeepStaq Assessment
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            AI Interest & Aptitude<br />
            <span className="text-stroke-dark">Assessment.</span>
          </h1>
          <p className="text-slate-600 font-mono text-sm max-w-xl mx-auto">
            Evaluate your analytical reasoning, logical series, and core AI concepts in 15 questions (20-Minute Timer).
          </p>
        </div>

        {/* STEP 1: CANDIDATE DETAILS FORM */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-50 border-2 border-[#050521] rounded-3xl p-6 sm:p-10 shadow-[8px_8px_0px_0px_#050521]"
            >
              <div className="mb-8 border-b-2 border-[#050521]/10 pb-4">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#050521]">
                  Step 1: Enter Your Details
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Please provide your contact info before starting the test.
                </p>
              </div>

              <form onSubmit={handleStartTest} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-2 text-[#050521]">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className={`w-full bg-white border-2 ${
                      formErrors.fullName ? "border-red-500" : "border-[#050521]"
                    } rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:bg-[#c6ff34]/10 transition-all`}
                  />
                  {formErrors.fullName && (
                    <p className="text-xs text-red-500 font-bold mt-1.5">{formErrors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2 text-[#050521]">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="E mail"
                      className={`w-full bg-white border-2 ${
                        formErrors.email ? "border-red-500" : "border-[#050521]"
                      } rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:bg-[#c6ff34]/10 transition-all`}
                    />
                    {formErrors.email && (
                      <p className="text-xs text-red-500 font-bold mt-1.5">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2 text-[#050521]">
                      Phone Number (WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className={`w-full bg-white border-2 ${
                        formErrors.phone ? "border-red-500" : "border-[#050521]"
                      } rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:bg-[#c6ff34]/10 transition-all`}
                    />
                    {formErrors.phone && (
                      <p className="text-xs text-red-500 font-bold mt-1.5">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2 text-[#050521]">
                      Place / Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="place"
                      value={formData.place}
                      onChange={handleInputChange}
                      placeholder="Place / Location"
                      className={`w-full bg-white border-2 ${
                        formErrors.place ? "border-red-500" : "border-[#050521]"
                      } rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:bg-[#c6ff34]/10 transition-all`}
                    />
                    {formErrors.place && (
                      <p className="text-xs text-red-500 font-bold mt-1.5">{formErrors.place}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2 text-[#050521]">
                      College / Institution / Organization (Optional)
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      placeholder="e.g. NIT Calicut / Working Professional"
                      className="w-full bg-white border-2 border-[#050521] rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:bg-[#c6ff34]/10 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#050521] text-[#c6ff34] font-black text-sm uppercase tracking-widest rounded-xl shadow-[5px_5px_0px_0px_#c6ff34] active:translate-y-1 active:shadow-none hover:bg-[#c6ff34] hover:text-[#050521] hover:border-2 hover:border-[#050521] transition-all duration-200"
                  >
                    Start Assessment (15 Questions · 20 Mins) →
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 2: TEST QUESTIONS */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              {/* Progress & 20-Minute Timer Bar */}
              <div className="bg-[#050521] text-white border-2 border-[#050521] rounded-2xl p-4 sm:p-6 shadow-[6px_6px_0px_0px_#c6ff34]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#c6ff34] block">
                      Candidate: {formData.fullName}
                    </span>
                    <span className="text-xs font-mono text-slate-300">
                      Answered: {answeredCount} / {aptitudeQuestions.length} Questions
                    </span>
                  </div>

                  {/* 20-Minute Countdown Timer */}
                  <div className={`flex items-center gap-2 font-mono font-black text-sm px-4 py-2 rounded-xl border-2 transition-all ${
                    timeLeft <= 180 ? "bg-red-500 text-white border-white animate-pulse" : "bg-[#c6ff34] text-[#050521] border-[#050521]"
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Timer: {formatTime(timeLeft)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden mb-5">
                  <div
                    className="bg-[#c6ff34] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* Question Numbers grid */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                  {aptitudeQuestions.map((q, idx) => {
                    const isSelected = !!userAnswers[q.id];
                    const isCurrent = currentQIndex === idx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQIndex(idx)}
                        className={`w-8 h-8 rounded-lg text-xs font-black transition-all border ${
                          isCurrent
                            ? "bg-[#c6ff34] text-[#050521] border-[#c6ff34] scale-110 shadow-md"
                            : isSelected
                            ? "bg-white text-[#050521] border-white"
                            : "bg-white/10 text-white/60 border-white/10 hover:bg-white/20"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Question Box */}
              <div className="bg-white border-2 border-[#050521] rounded-3xl p-6 sm:p-10 shadow-[8px_8px_0px_0px_#050521]">
                <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-[#050521]/10">
                  <span className="text-xs font-black uppercase tracking-widest text-[#050521] bg-[#c6ff34] px-3 py-1 rounded-md border border-[#050521]">
                    Question {currentQIndex + 1} of {aptitudeQuestions.length}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Category: {currentQ.category}
                  </span>
                </div>

                <h3 className="text-lg sm:text-2xl font-black text-[#050521] leading-tight mb-8">
                  {currentQ.question}
                </h3>

                {/* Options List - Locked once selected ("select the ans lock it do not chnage it") */}
                <div className="space-y-4 mb-8">
                  {currentQ.options.map((opt) => {
                    const isChecked = userAnswers[currentQ.id] === opt.key;
                    const isLocked = !!lockedQuestions[currentQ.id];
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        disabled={isLocked}
                        onClick={() => handleSelectOption(currentQ.id, opt.key)}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${
                          isChecked
                            ? "bg-[#050521] text-white border-[#050521] shadow-[4px_4px_0px_0px_#c6ff34] translate-x-1"
                            : isLocked
                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                            : "bg-slate-50 text-[#050521] border-[#050521]/20 hover:border-[#050521] hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <span
                            className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 transition-colors border ${
                              isChecked
                                ? "bg-[#c6ff34] text-[#050521] border-[#c6ff34]"
                                : "bg-white text-[#050521] border-[#050521]/20"
                            }`}
                          >
                            {opt.key}
                          </span>
                          <span className="text-sm sm:text-base font-semibold leading-relaxed pt-1">
                            {opt.text}
                          </span>
                        </div>
                        {isChecked && isLocked && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#c6ff34] bg-white/10 px-2.5 py-1 rounded-md border border-[#c6ff34]/30 shrink-0">
                            🔒 Answer Locked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Question Navigation Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-[#050521]/10">
                  <button
                    type="button"
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                    className="w-full sm:w-auto px-6 py-3 border-2 border-[#050521] rounded-xl text-xs font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                  >
                    ← Previous
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Next button shown on Questions 1 to 14 */}
                    {currentQIndex < aptitudeQuestions.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="w-full sm:w-auto px-8 py-3.5 bg-[#050521] text-[#c6ff34] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#c6ff34] hover:text-[#050521] hover:border-2 hover:border-[#050521] transition-all"
                      >
                        Next Question →
                      </button>
                    ) : (
                      /* Submit button shown ONLY on 15th Question ("15 th quetion only show the submit button not it showinn all questions") */
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => handleSubmitTest(false)}
                        className="w-full sm:w-auto px-8 py-3.5 bg-[#c6ff34] text-[#050521] border-2 border-[#050521] rounded-xl text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#050521] hover:scale-105 active:translate-y-1 transition-all disabled:opacity-50"
                      >
                        {submitting ? "Submitting..." : "Submit Test Now ✓"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: RESULT & SCORE SUMMARY */}
          {step === 3 && result && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-2 border-[#050521] rounded-3xl p-6 sm:p-12 shadow-[10px_10px_0px_0px_#c6ff34] text-center space-y-8"
            >
              <div className="w-20 h-20 bg-[#c6ff34] border-2 border-[#050521] rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#050521]">
                <svg className="w-10 h-10 text-[#050521]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#050521] bg-slate-100 px-4 py-1.5 rounded-full border border-[#050521]">
                  {result.isAutoSubmit ? "Time Expired - Assessment Auto-Saved" : "Assessment Submitted Successfully"}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter mt-4 text-[#050521]">
                  Congratulations, {formData.fullName}!
                </h2>
                <p className="text-slate-500 font-mono text-xs sm:text-sm mt-2">
                  Your response has been recorded and submitted to DeepStaq admissions.
                </p>
              </div>

              {/* Score Display Card */}
              <div className="bg-[#050521] text-white p-8 rounded-3xl border-2 border-[#050521] max-w-md mx-auto shadow-[6px_6px_0px_0px_#c6ff34]">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c6ff34] mb-2">
                  Your Aptitude Score
                </p>
                <div className="text-5xl sm:text-6xl font-black text-white tracking-tighter mb-2">
                  {result.score} <span className="text-2xl text-white/50">/ {result.total}</span>
                </div>
                <div className="inline-block bg-[#c6ff34] text-[#050521] font-black text-sm px-4 py-1 rounded-full uppercase tracking-wider mb-4">
                  {result.percentage}% Score
                </div>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  {result.percentage >= 70
                    ? "🌟 Excellent Aptitude! You possess strong analytical and AI problem-solving fundamentals."
                    : result.percentage >= 50
                    ? "👍 Good Job! You have solid logical skills and great potential for our AI programs."
                    : "💡 Great Start! DeepStaq's 6-month AI Builder diploma will build your foundations from zero."}
                </p>
              </div>

              {/* Primary Action Buttons Grid */}
              <div className="pt-6 space-y-4 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Book Free Consultation Button */}
                  <a
                    href={`https://api.whatsapp.com/send?phone=919495957011&text=${encodeURIComponent(
                      `Hi DeepStaq Team, I completed the AI Aptitude Test!\n\nCandidate Name: ${formData.fullName}\nPhone: ${formData.phone}\nPlace: ${formData.place || 'N/A'}\nScore: ${result.score}/${result.total} (${result.percentage}%)\n\nI would like to know more about the AI Builder Diploma program and book a free 1-on-1 career consultation.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-4 bg-[#050521] text-[#c6ff34] border-2 border-[#050521] rounded-2xl font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_#c6ff34] hover:bg-[#c6ff34] hover:text-[#050521] hover:scale-105 transition-all flex items-center justify-center gap-2.5 text-center"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Book Free Consultation</span>
                  </a>

                  {/* Join WhatsApp Community Button */}
                  <a
                    href={`https://api.whatsapp.com/send?phone=919495957011&text=${encodeURIComponent(
                      `Hi DeepStaq Team, please add me to the DeepStaq AI WhatsApp Community!\n\nCandidate Name: ${formData.fullName}\nPhone: ${formData.phone}\nPlace: ${formData.place || 'N/A'}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-4 bg-[#25D366] text-white border-2 border-[#050521] rounded-2xl font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_#050521] hover:bg-[#20bd5a] hover:scale-105 transition-all flex items-center justify-center gap-2.5 text-center"
                  >
                    <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>Join WhatsApp Community</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link to="/admission" className="w-full">
                    <button className="w-full px-6 py-4 bg-[#c6ff34] text-[#050521] border-2 border-[#050521] font-black text-xs uppercase tracking-widest rounded-2xl shadow-[4px_4px_0px_0px_#050521] hover:scale-105 transition-all">
                      Proceed to Admission Application →
                    </button>
                  </Link>
                  <Link to="/" className="w-full">
                    <button className="w-full px-6 py-4 border-2 border-[#050521] text-[#050521] font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all">
                      Back to Home
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
