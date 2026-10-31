import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  saveAiBoosterProgramRegistration,
  updateAiBoosterProgramRegistration,
} from "../services/dbService";

const ORIGINAL_PRICE = 599;
const OFFER_PRICE = 49;

const YEAR_SEM_SUGGESTIONS = [
  "+1 / +2 (Higher Secondary)",
  "1st Year (Sem 1-2)",
  "2nd Year (Sem 3-4)",
  "3rd Year (Sem 5-6)",
  "Final Year (Sem 7-8)",
  "High School (10th)",
  "Other / Graduate",
];

const AI_INTEREST_OPTIONS = [
  {
    id: "extreme",
    label: "Yes, Extremely Interested!",
    desc: "Passionate about building AI projects & career in AI",
  },
  {
    id: "learn",
    label: "Yes, Want to Learn From Scratch",
    desc: "Beginner eager to master AI tools & fundamentals",
  },
  {
    id: "curious",
    label: "Curious / Exploring Opportunities",
    desc: "Want to see how AI applies to my field of study",
  },
  {
    id: "not_sure",
    label: "Not Sure Yet, But Want to Know More",
    desc: "Looking for guidance and workshop sessions",
  },
];

// 2. Problem / Attention Questions
const PROBLEM_QUESTIONS = [
  {
    id: 1,
    question: "Spending hours searching for study materials?",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    tag: "Time Wasted",
  },
  {
    id: 2,
    question: "Finding it difficult to organise assignments?",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    tag: "Disorganization",
  },
  {
    id: 3,
    question: "Want to create presentations and projects more efficiently?",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    tag: "Efficiency Gap",
  },
  {
    id: 4,
    question: "Curious about how AI actually works?",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    tag: "Curiosity",
  },
  {
    id: 5,
    question: "Wondering what skills will matter in your future career?",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    tag: "Future Proof",
  },
];

// 3. What will you learn (Content-focused, 100% responsive, no external images)
const WHAT_YOU_WILL_LEARN = [
  {
    id: 1,
    title: "AI for Studies",
    desc: "Learn how AI can support your everyday learning.",
    badge: "Study Smarter",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "AI for Creativity",
    desc: "Explore presentations, ideas and creative possibilities.",
    badge: "Creative Thinking",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "AI Tools & Workflows",
    desc: "Discover smarter ways to handle repetitive tasks.",
    badge: "Productivity",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "AI Agents",
    desc: "Understand how AI agents can perform useful tasks.",
    badge: "Next-Gen Tech",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

// 4. What makes this different points
const DIFFERENT_POINTS = [
  {
    title: "Beginner-friendly learning.",
    desc: "Designed from ground zero. No technical background or coding experience required.",
  },
  {
    title: "Malayalam explanations.",
    desc: "Simple, relatable concepts explained clearly in Malayalam so every student feels at home.",
  },
  {
    title: "Practical AI demonstrations.",
    desc: "Real live demonstrations of everyday AI tools in action, not dry theoretical lectures.",
  },
  {
    title: "Useful applications for students.",
    desc: "Direct takeaways for school, college, assignments, exams, presentations and research.",
  },
  {
    title: "Introduction to AI Agents and Workflows.",
    desc: "Peek into the cutting-edge future of autonomous AI agents and automated workflows.",
  },
];

// 5. Who should attend
const WHO_SHOULD_ATTEND = [
  {
    title: "Plus Two students.",
    desc: "Higher Secondary students preparing for college and exploring future tech horizons.",
    icon: "🎓",
  },
  {
    title: "Degree students.",
    desc: "Undergraduates looking to complete projects, reports, and assignments 10x faster.",
    icon: "📚",
  },
  {
    title: "College students.",
    desc: "Students looking to build skills that give them a noticeable edge in competitions.",
    icon: "🏛️",
  },
  {
    title: "Students from any academic background.",
    desc: "Science, Commerce, Arts, Humanities, Engineering or Medical — AI is universal.",
    icon: "🌐",
  },
  {
    title: "Anyone curious about AI and emerging technologies.",
    desc: "Eager learners who want to understand the technology defining the next decade.",
    icon: "💡",
  },
];

const loadRazorpayScript = (src = "https://checkout.razorpay.com/v1/checkout.js") => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      return resolve(true);
    }
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function AiBoosterProgram() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    place: "",
    collegeOrSchool: "",
    yearOrSem: "",
    interestedInAi: "Yes, Extremely Interested!",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [pendingRegId, setPendingRegId] = useState(null);
  const [paymentNotice, setPaymentNotice] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Monitor scroll for bottom sticky CTA bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToForm = () => {
    const el = document.getElementById("registration-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitError) {
      setSubmitError("");
    }
    if (paymentNotice) {
      setPaymentNotice(null);
    }
  };

  const handleSelectYearChip = (val) => {
    setFormData((prev) => ({ ...prev, yearOrSem: val }));
    if (errors.yearOrSem) {
      setErrors((prev) => ({ ...prev, yearOrSem: "" }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = "Please enter your full name";
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = "Name must be at least 2 characters";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (cleanPhone.length < 10) {
      errs.phone = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.place.trim()) {
      errs.place = "Please enter your place/city";
    }

    if (!formData.collegeOrSchool.trim()) {
      errs.collegeOrSchool = "Please enter your college or school name";
    }

    if (!formData.yearOrSem.trim()) {
      errs.yearOrSem = "Please select or enter your year / semester";
    }

    if (!formData.interestedInAi.trim()) {
      errs.interestedInAi = "Please indicate your interest in AI";
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setPaymentNotice(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      handleScrollToForm();
      return;
    }

    setLoading(true);
    setLoadingStep("saving");

    try {
      const cleanPhone = formData.phone.replace(/\D/g, "").slice(-10);
      const payload = {
        fullName: formData.fullName.trim(),
        name: formData.fullName.trim(),
        phone: cleanPhone,
        place: formData.place.trim(),
        collegeOrSchool: formData.collegeOrSchool.trim(),
        institution: formData.collegeOrSchool.trim(),
        yearOrSem: formData.yearOrSem.trim(),
        interestedInAi: formData.interestedInAi.trim(),
        program: "AI Booster Program",
        type: "AI_BOOSTER_PROGRAM",
        isAiBoosterProgram: true,
        isAiForStudents: true,
        status: "Unpaid Lead",
        paymentStatus: "unpaid",
        amountPaid: 0,
        originalPrice: ORIGINAL_PRICE,
        offerPrice: OFFER_PRICE,
      };

      // 1. Save candidate to database as "unpaid lead" immediately
      let regId = pendingRegId;
      if (!regId) {
        const result = await saveAiBoosterProgramRegistration(payload);
        regId = result?.id || `BOOST-${Date.now().toString().slice(-6)}`;
        setPendingRegId(regId);
      }

      // 2. Load Razorpay SDK
      setLoadingStep("gateway");
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setSubmitError("Failed to connect to Razorpay payment gateway. Please check your internet connection and try again.");
        setLoading(false);
        return;
      }

      // 3. Configure Razorpay Checkout for ₹49
      const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_live_SnxCrKgLPqpHnz";

      const options = {
        key: razorpayKey,
        amount: OFFER_PRICE * 100, // 4900 paise = ₹49
        currency: "INR",
        name: "DeepStaq",
        description: `AI Booster Program Registration (Special Offer ₹${OFFER_PRICE})`,
        image: "/favicon.ico",
        prefill: {
          name: formData.fullName.trim(),
          contact: cleanPhone,
        },
        notes: {
          registrationId: regId,
          course: "AI Booster Program",
          offerPrice: String(OFFER_PRICE),
          originalPrice: String(ORIGINAL_PRICE),
        },
        theme: {
          color: "#1d0058",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setPaymentNotice({
              type: "warning",
              message: `Your details are saved (Ref: ${regId.slice(0, 8)}). Payment was incomplete. Click "REGISTER NOW" to complete your ₹${OFFER_PRICE} payment anytime.`,
              registrationId: regId,
            });
          },
        },
        handler: async function (response) {
          try {
            setLoading(true);
            setLoadingStep("verifying");

            const paymentId = response.razorpay_payment_id;

            // 4. Update database record to "paid"
            await updateAiBoosterProgramRegistration(regId, {
              paymentStatus: "paid",
              paymentId: paymentId,
              amountPaid: OFFER_PRICE,
              originalPrice: ORIGINAL_PRICE,
              offerPrice: OFFER_PRICE,
              status: "Paid & Confirmed",
            });

            setSubmittedData({
              ...payload,
              id: regId,
              paymentStatus: "paid",
              paymentId: paymentId,
              amountPaid: OFFER_PRICE,
              originalPrice: ORIGINAL_PRICE,
              registeredAt: new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            });

            window.scrollTo({ top: 0, behavior: "smooth" });
          } catch (updateErr) {
            console.error("Payment status update error:", updateErr);
            setSubmittedData({
              ...payload,
              id: regId,
              paymentStatus: "paid",
              paymentId: response.razorpay_payment_id,
              amountPaid: OFFER_PRICE,
              originalPrice: ORIGINAL_PRICE,
              registeredAt: new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (failResponse) {
        setLoading(false);
        setPaymentNotice({
          type: "error",
          message: `Payment failed: ${failResponse.error?.description || "Transaction declined"}. Your details remain saved.`,
          registrationId: regId,
        });
      });
      rzp.open();
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmitError("Failed to initiate payment. Please check your internet connection and try again.");
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedData(null);
    setPendingRegId(null);
    setPaymentNotice(null);
    setFormData({
      fullName: "",
      phone: "",
      place: "",
      collegeOrSchool: "",
      yearOrSem: "",
      interestedInAi: "Yes, Extremely Interested!",
    });
    setErrors({});
    setSubmitError("");
    handleScrollToForm();
  };

  return (
    <div
      className="min-h-screen text-white font-sans selection:bg-[#f90058]/30 selection:text-white antialiased relative overflow-x-hidden w-full max-w-full"
      style={{ backgroundColor: "#1d0058" }}
    >
      {/* ─────────────────────────────────────────────────────────────
          AI EASY AYI 3-COLOR BACKGROUND GRADIENT & AMBIENT GLOW EFFECTS
          Palette: #1d0058 (Deep Indigo), #f90058 (Neon Magenta), #184cef (Electric Blue)
      ───────────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Base 3-Color Dynamic Angular Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #1d0058 0%, #1e0538 25%, #0f154e 55%, #184cef 85%, #f90058 100%)",
          }}
        />

        {/* Deep Atmospheric Mesh Scrim for Contrast & Elegance */}
        <div className="absolute inset-0 bg-[#090217]/40" />

        {/* Top-right vibrant #f90058 neon magenta radial glow */}
        <div className="absolute -top-[12%] -right-[12%] w-[350px] sm:w-[600px] md:w-[850px] h-[350px] sm:h-[600px] md:h-[850px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,0,88,0.32)_0%,rgba(249,0,88,0.12)_40%,transparent_70%)] blur-[90px] sm:blur-[130px]" />

        {/* Center-left vibrant #184cef electric blue radial glow */}
        <div className="absolute top-[35%] -left-[15%] w-[380px] sm:w-[650px] md:w-[950px] h-[380px] sm:h-[650px] md:h-[950px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(24,76,239,0.35)_0%,rgba(29,0,88,0.22)_50%,transparent_75%)] blur-[100px] sm:blur-[140px]" />

        {/* Bottom-right blended #f90058 & #184cef gradient glow */}
        <div className="absolute bottom-[2%] right-[5%] w-[320px] sm:w-[550px] md:w-[800px] h-[320px] sm:h-[550px] md:h-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,0,88,0.25)_0%,rgba(24,76,239,0.20)_45%,transparent_70%)] blur-[90px] sm:blur-[130px]" />

        {/* Center subtle #1d0058 deep purple core glow */}
        <div className="absolute top-[65%] left-[20%] w-[300px] sm:w-[500px] md:w-[700px] h-[300px] sm:h-[500px] md:h-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(29,0,88,0.65)_0%,transparent_70%)] blur-[80px] sm:blur-[110px]" />
      </div>

      <div className="relative z-10 w-full">
        <main className="w-full max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-28 sm:pb-32 space-y-12 sm:space-y-20 lg:space-y-28">
          {/* ══════════════════════════════════════════════════════════
              SUCCESS CONFIRMATION SCREEN (When paid)
             ══════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {submittedData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0d0726]/90 border border-white/20 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-10 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] text-center max-w-3xl mx-auto relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#184cef] via-[#f90058] to-[#184cef]" />

                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#25D366]/20 text-[#25D366] rounded-full mx-auto flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_30px_rgba(37,211,102,0.4)] border border-[#25D366]/40 mb-4 sm:mb-6">
                  ✓
                </div>

                <div className="inline-block px-3.5 py-1 bg-[#25D366]/15 text-[#25D366] rounded-full text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider mb-2.5 sm:mb-3 border border-[#25D366]/30">
                  Registration & Payment Confirmed
                </div>

                <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight break-words">
                  Welcome to AI Booster Program, {submittedData.fullName}!
                </h2>

                <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
                  Your <strong className="text-white">₹{OFFER_PRICE}</strong> admission fee has been verified via Razorpay. We are excited to guide you on your AI learning journey!
                </p>

                {/* Details Breakdown */}
                <div className="my-5 sm:my-6 bg-white/[0.04] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-left max-w-xl mx-auto space-y-2.5 sm:space-y-3 font-mono text-xs sm:text-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10 gap-2">
                    <span className="font-bold text-slate-400 uppercase text-[11px] sm:text-xs">Reference ID</span>
                    <span className="font-bold text-[#f90058] bg-[#f90058]/10 px-2 sm:px-2.5 py-0.5 rounded border border-[#f90058]/30 text-xs">
                      {submittedData.id}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-white/10 gap-2">
                    <span className="font-bold text-slate-400 uppercase text-[11px] sm:text-xs">Payment Status</span>
                    <span className="font-bold text-[#25D366] bg-[#25D366]/10 px-2 sm:px-2.5 py-0.5 rounded-full border border-[#25D366]/30 flex items-center gap-1 text-xs">
                      <span>✓</span> PAID ₹{submittedData.amountPaid || OFFER_PRICE}
                    </span>
                  </div>

                  {submittedData.paymentId && (
                    <div className="flex justify-between items-center pb-2 border-b border-white/10 gap-2">
                      <span className="font-bold text-slate-400 uppercase text-[11px] sm:text-xs">Razorpay ID</span>
                      <span className="font-bold text-sky-400 truncate max-w-[140px] sm:max-w-[200px] text-xs">
                        {submittedData.paymentId}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-400 text-xs sm:text-sm">Student Name:</span>
                    <span className="font-bold text-white text-xs sm:text-sm text-right truncate max-w-[180px] sm:max-w-none">{submittedData.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-400 text-xs sm:text-sm">WhatsApp Mobile:</span>
                    <span className="font-bold text-white text-xs sm:text-sm">+91 {submittedData.phone}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-400 text-xs sm:text-sm">Place:</span>
                    <span className="font-bold text-white text-xs sm:text-sm text-right">{submittedData.place}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-400 text-xs sm:text-sm">College / School:</span>
                    <span className="font-bold text-white text-xs sm:text-sm text-right truncate max-w-[180px] sm:max-w-none">{submittedData.collegeOrSchool}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-400 text-xs sm:text-sm">Year / Sem:</span>
                    <span className="font-bold text-white text-xs sm:text-sm text-right">{submittedData.yearOrSem}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 pt-2 border-t border-white/10">
                    <span className="text-slate-400 text-xs">Interest in AI:</span>
                    <span className="font-bold text-white bg-gradient-to-r from-[#f90058] to-[#184cef] px-2.5 py-1 rounded text-[11px] sm:text-xs self-start sm:self-auto">
                      {submittedData.interestedInAi}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto pt-2 w-full">
                  <a
                    href="https://chat.whatsapp.com/KxVV7ep74TV0GHy5SU2FXl"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:flex-1 py-3.5 sm:py-4 px-5 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(37,211,102,0.4)] cursor-pointer"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
                    </svg>
                    <span>Join WhatsApp Community</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full sm:flex-1 py-3.5 sm:py-4 px-5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl sm:rounded-2xl font-bold text-xs uppercase tracking-wider transition-all border border-white/20 cursor-pointer"
                  >
                    Submit Another Student
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════════
              SECTION 1: HERO SECTION
             ══════════════════════════════════════════════════════════ */}
          <section className="text-center max-w-4xl mx-auto pt-2 sm:pt-6">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.06] border border-white/15 text-[11px] sm:text-xs md:text-sm font-semibold tracking-wide text-white backdrop-blur-md mb-4 sm:mb-6 shadow-[0_0_20px_rgba(249,0,88,0.25)] max-w-full"
            >
              <span className="w-2 h-2 rounded-full bg-[#f90058] shadow-[0_0_8px_rgba(249,0,88,0.8)] animate-pulse shrink-0" />
              <span className="truncate">DeepStaq AI Booster Program • Live Masterclass</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl min-[380px]:text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.18] sm:leading-[1.12]"
            >
              The Future Belongs to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f90058] via-fuchsia-200 to-[#184cef]">
                Students Who Know AI.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal px-1"
            >
              AI is changing how we learn, create and work. Discover how to use Artificial Intelligence to study smarter, explore new possibilities and prepare yourself for tomorrow's opportunities.
            </motion.p>

            {/* CTA Button & Pricing Pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto"
            >
              <button
                type="button"
                onClick={handleScrollToForm}
                className="w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#f90058] hover:bg-[#e0004f] active:scale-95 text-white font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 sm:gap-3 transition-all duration-200 shadow-[0_4px_30px_rgba(249,0,88,0.5)] hover:scale-[1.02] cursor-pointer group"
              >
                <span>REGISTER NOW</span>
                <span className="font-mono text-white/70 line-through text-xs shrink-0">
                  ₹{ORIGINAL_PRICE}
                </span>
                <span className="bg-white text-[#1d0058] px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-black shrink-0">
                  ₹{OFFER_PRICE} ONLY
                </span>
                <span className="text-lg transition-transform group-hover:translate-x-1 shrink-0">
                  →
                </span>
              </button>

              <a
                href="https://chat.whatsapp.com/KxVV7ep74TV0GHy5SU2FXl"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 text-white font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2.5 transition-all backdrop-blur-md hover:border-[#25D366]/50 hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] cursor-pointer"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#25D366] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
                </svg>
                <span>Ask on WhatsApp</span>
              </a>
            </motion.div>

            {/* Secondary text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-3.5 sm:mt-4 text-xs sm:text-sm text-fuchsia-200/90 font-medium tracking-wide"
            >
              ✦ A practical Malayalam AI learning experience by Deepstaq.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
            >
              {[
                "100% Practical & Interactive",
                "Malayalam Explanations",
                "Plus Two & College Students",
                "No Prior Tech Knowledge Needed",
              ].map((pill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.05] border border-white/10 text-[11px] sm:text-xs font-semibold text-slate-200 backdrop-blur-md"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#184cef] shrink-0" />
                  <span>{pill}</span>
                </span>
              ))}
            </motion.div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              SECTION 2: PROBLEM / ATTENTION SECTION
             ══════════════════════════════════════════════════════════ */}
          <section className="relative w-full">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Still studying the old way in an AI-powered world?
              </h2>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-slate-300">
                The world has transformed, but students are still stuck with yesterday's slow, tedious study routines.
              </p>
            </div>

            {/* 5 Problem Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
              {PROBLEM_QUESTIONS.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="bg-[#0d0726]/80 hover:bg-[#0d0726]/95 border border-white/10 hover:border-[#f90058]/50 rounded-2xl p-4 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(249,0,88,0.2)] group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#f90058]/15 text-[#f90058] border border-[#f90058]/30 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-white/[0.05] text-slate-400 border border-white/5">
                        {item.tag}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base md:text-lg font-bold text-white leading-snug group-hover:text-fuchsia-100 transition-colors">
                      {item.question}
                    </p>
                  </div>

                  <div className="mt-3.5 sm:mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f90058] shrink-0" />
                    <span className="text-[11px] sm:text-xs">Traditional methods consume valuable hours</span>
                  </div>
                </motion.div>
              ))}

              {/* Concluding Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-gradient-to-br from-[#184cef]/40 via-[#1d0058]/80 to-[#f90058]/30 border border-white/20 rounded-2xl p-5 sm:p-6 backdrop-blur-xl flex flex-col justify-between shadow-[0_10px_35px_rgba(24,76,239,0.25)] sm:col-span-2 lg:col-span-1"
              >
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-2.5 sm:mb-3">
                    The Solution
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-tight">
                    There's a smarter way to approach all of this.
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
                    Harness AI as your 24/7 personalized study companion, research assistant, and creative partner.
                  </p>
                </div>

                <div className="mt-4 sm:mt-5">
                  <button
                    type="button"
                    onClick={handleScrollToForm}
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-white text-[#1d0058] font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-95"
                  >
                    <span>Discover How In This Session</span>
                    <span>→</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              SECTION 3: WHAT WILL YOU LEARN? (Content only, 100% responsive)
             ══════════════════════════════════════════════════════════ */}
          <section className="relative w-full">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                One session. Multiple possibilities.
              </h2>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-slate-300 max-w-xl mx-auto px-1">
                Practical, actionable takeaways crafted specifically for school and college students.
              </p>
            </div>

            {/* 4 Topic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {WHAT_YOU_WILL_LEARN.map((card, idx) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-[#0d0726]/85 border border-white/15 hover:border-[#184cef]/60 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_15px_40px_rgba(24,76,239,0.25)] hover:-translate-y-1 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#184cef]/30 to-[#f90058]/20 border border-white/15 flex items-center justify-center text-sky-300 group-hover:scale-110 group-hover:text-white transition-all shadow-md shrink-0">
                        {card.icon}
                      </div>
                      <span className="px-2.5 sm:px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[10px] sm:text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-sky-300 transition-colors">
                      {card.title}
                    </h3>
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-normal">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-mono text-slate-400">
                      Module 0{card.id} • Hands-on
                    </span>
                    <button
                      type="button"
                      onClick={handleScrollToForm}
                      className="text-xs font-bold text-[#f90058] group-hover:text-[#ff3879] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Explore</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              SECTION 4: WHAT MAKES THIS DIFFERENT?
             ══════════════════════════════════════════════════════════ */}
          <section className="relative w-full">
            <div className="bg-[#0d0726]/90 border border-white/15 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 backdrop-blur-2xl relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              {/* Subtle accent corner glow */}
              <div className="absolute top-0 right-0 w-60 sm:w-80 h-60 sm:h-80 bg-[#f90058]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-60 sm:w-80 h-60 sm:h-80 bg-[#184cef]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl">
                <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Don't just hear about AI.{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f90058] to-sky-400">
                    Understand how to use it.
                  </span>
                </h2>

                <p className="mt-2.5 sm:mt-4 text-xs sm:text-base md:text-lg text-slate-300 leading-relaxed font-normal">
                  Explore practical applications of AI through simple explanations, demonstrations and real-world examples.
                </p>
              </div>

              {/* 5 Distinct Differentiators */}
              <div className="mt-6 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 relative z-10">
                {DIFFERENT_POINTS.map((pt, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all backdrop-blur-md flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3 sm:gap-3.5">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-[#f90058] to-[#184cef] text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-sm mt-0.5">
                        ✓
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                          {pt.title}
                        </h3>
                        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {pt.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Bonus highlight box */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.45 }}
                  className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#184cef]/30 to-[#f90058]/20 border border-white/20 transition-all backdrop-blur-md flex flex-col justify-center items-start sm:col-span-2 lg:col-span-1"
                >
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-sky-300 font-bold">
                    Direct Takeaway
                  </span>
                  <div className="text-sm sm:text-base md:text-lg font-extrabold text-white mt-1">
                    Ready to apply the very next day in your studies.
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              SECTION 5: WHO SHOULD ATTEND?
             ══════════════════════════════════════════════════════════ */}
          <section className="relative w-full">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                AI isn't just for computer science students.
              </h2>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-base md:text-lg text-slate-300">
                This session is suitable for:
              </p>
            </div>

            {/* Audience Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {WHO_SHOULD_ATTEND.map((aud, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="bg-[#0d0726]/80 hover:bg-[#0d0726]/95 border border-white/10 hover:border-[#184cef]/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(24,76,239,0.2)] flex items-start gap-3 sm:gap-4"
                >
                  <div className="text-2xl sm:text-3xl shrink-0 p-2 rounded-xl bg-white/[0.05] border border-white/10">
                    {aud.icon}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-white">
                      {aud.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {aud.desc}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Universal Student Banner Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="bg-gradient-to-r from-[#f90058]/30 via-[#1d0058]/60 to-[#184cef]/40 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-xl flex flex-col justify-center sm:col-span-2 lg:col-span-1"
              >
                <div className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#ff5996] font-bold">
                  Zero Barrier
                </div>
                <div className="text-base sm:text-lg font-extrabold text-white mt-0.5 sm:mt-1">
                  All streams & grades welcome.
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  You only need curiosity and an open mind.
                </p>
              </motion.div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              SECTION 6: WHY DEEPSTAQ?
             ══════════════════════════════════════════════════════════ */}
          <section className="relative w-full">
            <div className="bg-[#0d0726]/90 border border-white/15 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 backdrop-blur-2xl relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4 mb-6 sm:mb-10">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Learn AI with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f90058] to-sky-400">
                    Deepstaq.
                  </span>
                </h2>

                <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed font-normal">
                  Deepstaq makes emerging technologies easier to understand through practical, accessible and industry-oriented learning experiences.
                </p>

                <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-normal">
                  Get introduced to the technology that's transforming industries, education and future careers.
                </p>
              </div>

              {/* 4 Feature highlight cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#f90058] mb-2 sm:mb-3 shadow-[0_0_10px_rgba(249,0,88,0.6)]" />
                  <div className="text-xs sm:text-sm font-bold text-white">Practical & Hands-On</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 mt-1">Live exercises & direct tool demos</div>
                </div>
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#184cef] mb-2 sm:mb-3 shadow-[0_0_10px_rgba(249,0,88,0.6)]" />
                  <div className="text-xs sm:text-sm font-bold text-white">Malayalam Instruction</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 mt-1">Simple language, zero jargon</div>
                </div>
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#f90058] mb-2 sm:mb-3 shadow-[0_0_10px_rgba(249,0,88,0.6)]" />
                  <div className="text-xs sm:text-sm font-bold text-white">Real-world Workflows</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 mt-1">Industry-tested methods & prompts</div>
                </div>
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#184cef] mb-2 sm:mb-3 shadow-[0_0_10px_rgba(24,76,239,0.6)]" />
                  <div className="text-xs sm:text-sm font-bold text-white">Active Community</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 mt-1">Direct support & student network</div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              REGISTRATION SECTION (100% Mobile, Tablet & Desktop Responsive)
             ══════════════════════════════════════════════════════════ */}
          <section id="registration-form" className="relative scroll-mt-28 w-full">
            <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-tight">
                AI Booster <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f90058] via-fuchsia-200 to-[#184cef]">Program</span>
              </h2>
              <p className="mt-2 sm:mt-3 text-xs sm:text-base text-slate-300 max-w-xl mx-auto px-1">
                Secure your seat now for just ₹{OFFER_PRICE} and discover how to study smarter with Artificial Intelligence.
              </p>
            </div>

            {/* Registration Form Box */}
            <div className="bg-[#0d0726]/90 border border-white/20 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-10 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] relative max-w-3xl mx-auto w-full">
              <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center justify-between gap-3 pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-white/10">
                <div>
                  <h3 className="text-base sm:text-xl font-black uppercase text-white tracking-tight">
                    Candidate Registration
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                    Please provide accurate details for workshop access & Razorpay receipt.
                  </p>
                </div>
                <div className="flex items-center min-[480px]:flex-col min-[480px]:items-end gap-2 shrink-0">
                  <span className="line-through text-slate-400 font-bold text-xs font-mono">
                    ₹{ORIGINAL_PRICE}
                  </span>
                  <span className="px-2.5 py-1 bg-[#f90058] text-white text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-lg shadow-[0_0_15px_rgba(249,0,88,0.4)]">
                    ₹{OFFER_PRICE} ONLY
                  </span>
                </div>
              </div>

              {submitError && (
                <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 bg-red-500/15 border border-red-500/40 text-red-300 rounded-xl sm:rounded-2xl text-xs font-bold flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="leading-snug">{submitError}</span>
                </div>
              )}

              {paymentNotice && (
                <div
                  className={`mb-5 sm:mb-6 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-xs font-bold border flex items-center justify-between gap-2.5 ${
                    paymentNotice.type === "warning"
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                      : "bg-red-500/15 border-red-500/40 text-red-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="leading-snug">{paymentNotice.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPaymentNotice(null)}
                    className="text-xs font-mono font-bold text-slate-400 hover:text-white px-1.5 py-1 cursor-pointer shrink-0"
                  >
                    ✕
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Field 1: Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2"
                  >
                    1. Full Name <span className="text-[#f90058]">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter student full name (e.g. Rahul Sharma)"
                    className={`w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border font-semibold text-xs sm:text-sm transition-all outline-none ${
                      errors.fullName
                        ? "border-red-500 bg-red-500/10 text-white"
                        : "border-white/15 bg-white/[0.04] text-white placeholder-slate-500 focus:border-[#f90058] focus:ring-2 focus:ring-[#f90058]/20"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-400 font-bold">{errors.fullName}</p>
                  )}
                </div>

                {/* Field 2: Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2"
                  >
                    2. Phone Number (WhatsApp Enabled) <span className="text-[#f90058]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      className={`w-full pl-12 sm:pl-14 pr-3.5 sm:pr-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border font-mono text-xs sm:text-sm transition-all outline-none ${
                        errors.phone
                          ? "border-red-500 bg-red-500/10 text-white"
                          : "border-white/15 bg-white/[0.04] text-white placeholder-slate-500 focus:border-[#f90058] focus:ring-2 focus:ring-[#f90058]/20"
                      }`}
                    />
                  </div>
                  {errors.phone ? (
                    <p className="mt-1 text-xs text-red-400 font-bold">{errors.phone}</p>
                  ) : (
                    <p className="mt-1 text-[10px] sm:text-[11px] text-slate-400">
                      We will send Razorpay receipt and workshop links to this number.
                    </p>
                  )}
                </div>

                {/* Field 3: Place */}
                <div>
                  <label
                    htmlFor="place"
                    className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2"
                  >
                    3. Place / Town / City <span className="text-[#f90058]">*</span>
                  </label>
                  <input
                    type="text"
                    id="place"
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    placeholder="Enter your place (e.g. Kannur, Calicut, Kochi, Thalassery)"
                    className={`w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border font-semibold text-xs sm:text-sm transition-all outline-none ${
                      errors.place
                        ? "border-red-500 bg-red-500/10 text-white"
                        : "border-white/15 bg-white/[0.04] text-white placeholder-slate-500 focus:border-[#f90058] focus:ring-2 focus:ring-[#f90058]/20"
                    }`}
                  />
                  {errors.place && (
                    <p className="mt-1 text-xs text-red-400 font-bold">{errors.place}</p>
                  )}
                </div>

                {/* Field 4: College or School */}
                <div>
                  <label
                    htmlFor="collegeOrSchool"
                    className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2"
                  >
                    4. College or School Name <span className="text-[#f90058]">*</span>
                  </label>
                  <input
                    type="text"
                    id="collegeOrSchool"
                    name="collegeOrSchool"
                    value={formData.collegeOrSchool}
                    onChange={handleInputChange}
                    placeholder="e.g. Govt Brennen College, NIT Calicut, St. Joseph's HSS"
                    className={`w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border font-semibold text-xs sm:text-sm transition-all outline-none ${
                      errors.collegeOrSchool
                        ? "border-red-500 bg-red-500/10 text-white"
                        : "border-white/15 bg-white/[0.04] text-white placeholder-slate-500 focus:border-[#f90058] focus:ring-2 focus:ring-[#f90058]/20"
                    }`}
                  />
                  {errors.collegeOrSchool && (
                    <p className="mt-1 text-xs text-red-400 font-bold">{errors.collegeOrSchool}</p>
                  )}
                </div>

                {/* Field 5: Year or Sem */}
                <div>
                  <label
                    htmlFor="yearOrSem"
                    className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2"
                  >
                    5. Year or Semester <span className="text-[#f90058]">*</span>
                  </label>
                  <input
                    type="text"
                    id="yearOrSem"
                    name="yearOrSem"
                    value={formData.yearOrSem}
                    onChange={handleInputChange}
                    placeholder="Select below or type (e.g. 2nd Year / Sem 4)"
                    className={`w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border font-semibold text-xs sm:text-sm transition-all outline-none mb-2 ${
                      errors.yearOrSem
                        ? "border-red-500 bg-red-500/10 text-white"
                        : "border-white/15 bg-white/[0.04] text-white placeholder-slate-500 focus:border-[#f90058] focus:ring-2 focus:ring-[#f90058]/20"
                    }`}
                  />

                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {YEAR_SEM_SUGGESTIONS.map((chip) => {
                      const isSelected = formData.yearOrSem === chip;
                      return (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleSelectYearChip(chip)}
                          className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border transition-all cursor-pointer font-medium ${
                            isSelected
                              ? "bg-[#f90058] text-white border-[#f90058] font-bold shadow-[0_0_10px_rgba(249,0,88,0.4)]"
                              : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]"
                          }`}
                        >
                          {chip}
                        </button>
                      );
                    })}
                  </div>

                  {errors.yearOrSem && (
                    <p className="mt-1 text-xs text-red-400 font-bold">{errors.yearOrSem}</p>
                  )}
                </div>

                {/* Field 6: Are you interested in AI? */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    6. Are you interested in AI? <span className="text-[#f90058]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                    {AI_INTEREST_OPTIONS.map((opt) => {
                      const isSelected = formData.interestedInAi === opt.label;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, interestedInAi: opt.label }));
                            if (errors.interestedInAi) {
                              setErrors((prev) => ({ ...prev, interestedInAi: "" }));
                            }
                          }}
                          className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 sm:gap-3 ${
                            isSelected
                              ? "border-[#f90058] bg-[#f90058]/15 shadow-[0_0_20px_rgba(249,0,88,0.2)]"
                              : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                              isSelected ? "border-[#f90058] bg-[#f90058]" : "border-white/30"
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <div className="min-w-0">
                            <span className="block text-xs font-bold text-white leading-tight">
                              {opt.label}
                            </span>
                            <span className="block text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-snug">
                              {opt.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {errors.interestedInAi && (
                    <p className="mt-1 text-xs text-red-400 font-bold">{errors.interestedInAi}</p>
                  )}
                </div>

                {/* Submit / Pay Button with Strikethrough 599 -> 49 */}
                <div className="pt-2 sm:pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 sm:py-4 md:py-5 px-4 sm:px-8 bg-[#f90058] hover:bg-[#e0004f] active:scale-[0.99] text-white rounded-xl sm:rounded-2xl font-black text-xs min-[400px]:text-sm sm:text-base uppercase tracking-wider transition-all duration-200 shadow-[0_4px_30px_rgba(249,0,88,0.5)] flex flex-col min-[440px]:flex-row items-center justify-center min-[440px]:justify-between gap-2 sm:gap-4 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2.5 w-full py-1">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 sm:border-3 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                        <span className="font-mono text-xs sm:text-sm tracking-widest text-white">
                          {loadingStep === "gateway"
                            ? "Connecting to Razorpay..."
                            : loadingStep === "verifying"
                            ? "Verifying Payment..."
                            : "Opening Payment Gateway..."}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 shrink-0">
                          <svg className="w-4 h-4 text-white shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                          </svg>
                          <span className="text-white font-extrabold tracking-wide">
                            REGISTER NOW
                          </span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 font-mono shrink-0">
                          <span className="line-through text-white/60 text-[11px] sm:text-xs md:text-sm font-bold">
                            ₹{ORIGINAL_PRICE}
                          </span>
                          <span className="bg-white text-[#1d0058] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-black shadow-sm">
                            ₹{OFFER_PRICE}
                          </span>
                          <span className="text-white text-base sm:text-lg group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </div>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          STICKY BOTTOM BAR (Fully Responsive on Mobile, Tablet & Desktop)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showStickyBar && !submittedData && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-[#1d0058]/95 backdrop-blur-xl border-t border-white/15 px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] pb-[calc(0.65rem+env(safe-area-inset-bottom,0px))]"
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#f90058] animate-pulse shrink-0" />
                <div className="min-w-0">
                  <div className="font-extrabold text-white text-xs sm:text-sm tracking-wide truncate">
                    AI Booster Program
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300 hidden md:block truncate">
                    A practical Malayalam AI learning experience by Deepstaq
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="text-right">
                  <span className="line-through text-slate-400 text-[10px] sm:text-xs font-mono mr-1 sm:mr-1.5">
                    ₹{ORIGINAL_PRICE}
                  </span>
                  <span className="text-xs sm:text-base font-black text-white font-mono">
                    ₹{OFFER_PRICE}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleScrollToForm}
                  className="px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#f90058] hover:bg-[#e0004f] active:scale-95 text-white font-black text-[11px] sm:text-xs tracking-wider shadow-[0_0_20px_rgba(249,0,88,0.5)] cursor-pointer transition-all shrink-0"
                >
                  REGISTER <span className="hidden min-[400px]:inline">NOW</span> →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
