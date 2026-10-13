import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  saveAiEasyAyiRegistration,
  updateAiEasyAyiRegistration,
} from "../services/dbService";
import logo from "../assets/Asset 1@4x.png";

const QUALIFICATION_OPTIONS = [
  "Working Professional",
  "Student",
  "Other",
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

/**
 * Calculates the next occurrence of Saturday at 5:00 PM (17:00).
 * If today is Saturday and it is already 5:00 PM or later, rolls over to next Saturday 5:00 PM.
 */
const getNextSaturday5PM = () => {
  const now = new Date();
  const target = new Date(now);
  const day = now.getDay(); // 0 is Sunday, 6 is Saturday

  // Calculate days until Saturday (day 6)
  const daysUntilSaturday = (6 - day + 7) % 7;
  target.setDate(now.getDate() + daysUntilSaturday);
  target.setHours(17, 0, 0, 0); // 5:00 PM

  // If target is in the past or right now, roll over to the next Saturday at 5 PM
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 7);
  }

  return target;
};

const getNextSaturdayFormatted = () => {
  const nextSat = getNextSaturday5PM();
  const day = nextSat.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";
  const month = nextSat.toLocaleString("en-IN", { month: "long" });
  const year = nextSat.getFullYear();
  return `${day}${suffix} ${month}, ${year}`;
};

const calculateTimeLeft = () => {
  const target = getNextSaturday5PM();
  const diff = target.getTime() - Date.now();

  if (diff <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  return {
    days: String(d).padStart(2, "0"),
    hours: String(h).padStart(2, "0"),
    minutes: String(m).padStart(2, "0"),
    seconds: String(s).padStart(2, "0"),
  };
};

export default function AiEasyAyiForm({ onlyForm = false }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDirectForm = searchParams.get("direct") === "true";

  const formRef = useRef(null);
  const [showForm, setShowForm] = useState(isDirectForm);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    place: "",
    qualification: "Working Professional",
    customQualification: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(""); // "saving" | "gateway" | "verifying"
  const [submittedData, setSubmittedData] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [paymentNotice, setPaymentNotice] = useState(null);
  const [pendingRegId, setPendingRegId] = useState(null);

  // Live countdown timer state (resets dynamically every Saturday at 5:00 PM)
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  const eventDateFormatted = getNextSaturdayFormatted();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOpenForm = () => {
    setShowForm(true);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        const firstInput = formRef.current.querySelector('input[name="fullName"]');
        if (firstInput) firstInput.focus();
      }
    }, 150);
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

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = "Full name is required";
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
      errs.place = "Place / City is required";
    }

    if (!formData.qualification) {
      errs.qualification = "Please select your qualification";
    } else if (formData.qualification === "Other" && !formData.customQualification.trim()) {
      errs.customQualification = "Please specify your qualification / profession";
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
      return;
    }

    setLoading(true);
    setLoadingStep("saving");

    try {
      const finalQualification =
        formData.qualification === "Other"
          ? (formData.customQualification.trim() || "Other")
          : formData.qualification;

      const cleanPhone = formData.phone.replace(/\D/g, "").slice(-10);

      const payload = {
        fullName: formData.fullName.trim(),
        name: formData.fullName.trim(),
        phone: cleanPhone,
        place: formData.place.trim(),
        city: formData.place.trim(),
        qualification: finalQualification,
        education: finalQualification,
        program: "AI easy Ayi",
        type: "AI_EASY_AYI",
        isAiEasyAyi: true,
        isAiForEveryone: true,
        originalPrice: 899,
        amount: 99,
        amountPaid: 0,
        paymentStatus: "unpaid",
        status: "Unpaid Lead",
      };

      // 1. Immediately save candidate to database as "unpaid" so lead is never lost
      let regId = pendingRegId;
      if (!regId) {
        const result = await saveAiEasyAyiRegistration(payload);
        regId = result?.id || `AYI-${Date.now().toString().slice(-6)}`;
        setPendingRegId(regId);
      }

      // 2. Load Razorpay SDK
      setLoadingStep("gateway");
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setSubmitError("Failed to connect to payment gateway. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // 3. Launch Razorpay Checkout Modal
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_live_RQB88T04c3K3R5",
        amount: 9900, // ₹99 in paise
        currency: "INR",
        name: "DeepStaq Academy",
        description: "AI easy Ayi - 2 Hrs Online Class (5:00 PM - 7:00 PM IST)",
        image: logo,
        prefill: {
          name: formData.fullName.trim(),
          contact: cleanPhone,
        },
        theme: {
          color: "#050521",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setPaymentNotice({
              type: "warning",
              message: "Payment was not completed. Your registration details remain saved as an unpaid lead.",
              registrationId: regId,
            });
          },
        },
        handler: async function (response) {
          setLoadingStep("verifying");
          try {
            await updateAiEasyAyiRegistration(regId, {
              paymentStatus: "paid",
              status: "Paid & Confirmed",
              paymentId: response.razorpay_payment_id,
              amountPaid: 99,
              qualification: finalQualification,
              education: finalQualification,
            });

            setSubmittedData({
              ...payload,
              id: regId,
              paymentStatus: "paid",
              paymentId: response.razorpay_payment_id,
              amountPaid: 99,
              originalPrice: 899,
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
              amountPaid: 99,
              originalPrice: 899,
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
          message: `Payment failed: ${failResponse.error?.description || "Transaction declined"}. Your details remain saved as an unpaid lead.`,
          registrationId: regId,
        });
      });

      rzp.open();
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmitError("There was an unexpected error initiating your registration. Please check your connection and try again.");
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      place: "",
      qualification: "Working Professional",
      customQualification: "",
    });
    setErrors({});
    setSubmitError("");
    setPaymentNotice(null);
    setPendingRegId(null);
    setSubmittedData(null);
    if (!isDirectForm) {
      setShowForm(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen text-[#050521] selection:bg-[#c6ff34] selection:text-[#050521] font-sans relative overflow-x-hidden pt-28 sm:pt-36 lg:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* Background Subtle Tech Grid & Ambience (Matches Home Page) */}
      <div className="absolute inset-0 bg-[radial-gradient(#050521_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-[#c6ff34]/20 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/3 -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#050521]/5 rounded-full blur-[130px] pointer-events-none translate-y-1/3 -translate-x-1/3 -z-10" />

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto relative z-10">

        {/* 1. SUCCESS RECEIPT (Displays after payment) */}
        <AnimatePresence>
          {submittedData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto bg-white border-3 border-[#050521] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_#c6ff34] mb-12 text-center"
            >
              <div className="w-16 h-16 bg-[#c6ff34] border-2 border-[#050521] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black text-[#050521] shadow-[3px_3px_0px_0px_#050521]">
                ✓
              </div>
              
              <span className="inline-block px-3.5 py-1 bg-[#c6ff34] text-[#050521] border border-[#050521] text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
                REGISTRATION CONFIRMED • PASS ACTIVE
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-[#050521] uppercase tracking-tight">
                Welcome to AI easy Ayi!
              </h2>
              
              <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto font-medium">
                Thank you <strong className="text-[#050521]">{submittedData.fullName}</strong>. Your workshop seat has been reserved successfully.
              </p>

              {/* Receipt Info Card */}
              <div className="bg-slate-50 border-2 border-[#050521] rounded-2xl p-4 my-6 text-left space-y-2.5 text-xs font-mono">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold uppercase">Reference ID:</span>
                  <span className="font-bold text-[#050521]">{submittedData.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold uppercase">Payment ID:</span>
                  <span className="font-bold text-emerald-700 truncate max-w-[200px]">{submittedData.paymentId || "Confirmed"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold uppercase">Phone:</span>
                  <span className="font-bold text-[#050521]">+91 {submittedData.phone}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold uppercase">Place:</span>
                  <span className="font-bold text-[#050521]">{submittedData.place}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold uppercase">Qualification:</span>
                  <span className="font-bold text-[#050521]">{submittedData.qualification}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold uppercase">Class Schedule:</span>
                  <span className="font-bold text-emerald-700">{eventDateFormatted} • 5:00 PM – 7:00 PM IST (2 Hrs Online Class)</span>
                </div>
              </div>

              {/* WhatsApp Community CTA */}
              <div className="bg-emerald-50 border-2 border-[#25D366] rounded-2xl p-4 mb-5 shadow-[4px_4px_0px_0px_#25D366]">
                <p className="text-xs text-[#050521] font-bold mb-3">
                  👉 Join the official candidate community for meeting links, session guides, and bonuses:
                </p>
                <a
                  href="https://chat.whatsapp.com/KxVV7ep74TV0GHy5SU2FXl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 bg-[#25D366] hover:bg-[#20ba59] text-white border-2 border-[#050521] rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#050521] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
                >
                  <span>Join WhatsApp Community</span>
                  <span>→</span>
                </a>
              </div>

              {/* Secondary Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/918075727195?text=${encodeURIComponent(
                    `Hi DeepStaq! I registered and paid ₹99 for AI easy Ayi (2 Hrs Online Class, 5:00 PM - 7:00 PM IST). Name: ${submittedData.fullName} (Ref: ${submittedData.id}, Payment ID: ${submittedData.paymentId || "N/A"})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-white hover:bg-slate-100 border-2 border-[#050521] rounded-xl text-xs font-bold text-[#050521] transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#050521]"
                >
                  <span>💬 Chat Support</span>
                </a>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-white hover:bg-slate-100 border-2 border-[#050521]/60 hover:border-[#050521] rounded-xl text-xs font-bold text-slate-700 hover:text-[#050521] transition-all shadow-[2px_2px_0px_0px_#050521]/20"
                >
                  Register Another Candidate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. THE HERO INTERFACE (Matching layout with Home page style & AI Easy Ayi content) */}
        {!submittedData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start mb-16">
            
            {/* LEFT COLUMN: Headline & Program Narrative */}
            <div className="lg:col-span-7 space-y-6 lg:pr-6">
              
              {/* Top Pill - DeepStaq AI Program Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c6ff34] border-2 border-[#050521] shadow-[2px_2px_0px_0px_#050521] text-[#050521] text-xs sm:text-sm font-mono font-black uppercase tracking-wider"
              >
                <span className="w-2 h-2 rounded-full bg-[#050521] animate-pulse" />
                <span>AI easy Ayi • 2 Hrs Online Class • 5:00 PM – 7:00 PM IST</span>
              </motion.div>

              {/* Massive Bold Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#050521] leading-[1.08] tracking-tight uppercase"
              >
                The Way You Work Without AI Is Holding You Back.
              </motion.h1>

              {/* Body narrative with Home page styling */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4 text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-xl"
              >
                <p>
                  Spending hours on repetitive tasks? Struggling with emails, research, spreadsheets, content creation, and daily office workflows? That’s not a lack of effort; that’s working without modern AI tools.
                </p>
                <p>
                  In this live 2-hour online class (5:00 PM – 7:00 PM IST), discover how tools like ChatGPT, Claude, Gemini, and intelligent automation can save you 15+ hours every week.
                </p>
                <div className="p-4 rounded-2xl bg-white border-2 border-[#050521] shadow-[3px_3px_0px_0px_#050521] flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <p className="text-[#050521] font-bold text-sm sm:text-base">
                    100% beginner friendly. Hands-on practical guidance in simple Malayalam & English. No coding required.
                  </p>
                </div>
              </motion.div>

            </div>

            {/* RIGHT COLUMN: The Floating Workshop Registration Card */}
            <div className="lg:col-span-5 relative">
              {/* Neo-brutalist Offset Accent Plate */}
              <div className="absolute inset-0 bg-[#050521] rounded-3xl translate-x-2.5 sm:translate-x-3 translate-y-2.5 sm:translate-y-3 -z-10" />

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="bg-white border-3 border-[#050521] rounded-3xl p-6 sm:p-8 shadow-xl relative"
              >
                {/* Top Card Meta: Workshop Brand & Date */}
                <div className="flex items-start justify-between gap-4 pb-5 border-b-2 border-slate-100">
                  
                  {/* Workshop Logo Badge */}
                  <div>
                    <span className="text-[10px] font-mono font-black tracking-widest uppercase text-slate-500 block">
                      DEEPSTAQ PRESENTS
                    </span>
                    <h3 className="text-2xl font-black text-[#050521] uppercase tracking-tight leading-none mt-1">
                      AI easy Ayi
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#050521] bg-[#c6ff34] px-2.5 py-0.5 rounded-full border border-[#050521]">
                        2 HRS ONLINE CLASS
                      </span>
                    </div>
                  </div>

                  {/* Date & Time Column */}
                  <div className="text-right">
                    <p className="text-sm font-black text-[#050521] tracking-wide">
                      {eventDateFormatted}
                    </p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#050521] text-[10px] font-mono font-bold text-[#c6ff34] uppercase tracking-wider">
                      Live Online Class
                    </span>
                    <p className="text-xs font-mono font-black text-[#050521] mt-1 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded inline-block">
                      5:00 PM – 7:00 PM IST
                    </p>
                  </div>

                </div>

                {/* Schedule Quick Specs Box */}
                <div className="grid grid-cols-2 gap-2 pt-4 pb-2 border-b-2 border-slate-100">
                  <div className="bg-slate-50 border-2 border-[#050521] rounded-xl p-2.5 text-center shadow-[2px_2px_0px_0px_#050521]">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-500 block">Class Duration</span>
                    <span className="text-xs font-black text-[#050521] uppercase">2 Hrs Online Class</span>
                  </div>
                  <div className="bg-[#c6ff34]/25 border-2 border-[#050521] rounded-xl p-2.5 text-center shadow-[2px_2px_0px_0px_#050521]">
                    <span className="text-[9px] uppercase font-mono font-bold text-[#050521]/70 block">Time</span>
                    <span className="text-xs font-black text-[#050521] uppercase">5:00 PM – 7:00 PM</span>
                  </div>
                </div>

                {/* Live Countdown Timer inside Hero Card */}
                <div className="pt-4 pb-2">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Class Starts In:
                    </span>
                    <span className="text-emerald-700 font-black">Limited Passes</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center font-mono">
                    <div className="bg-slate-50 border-2 border-[#050521] py-2 rounded-xl">
                      <span className="text-lg sm:text-xl font-black text-[#050521] block leading-none">
                        {timeLeft.days}
                      </span>
                      <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold block mt-1">
                        Days
                      </span>
                    </div>
                    <div className="bg-slate-50 border-2 border-[#050521] py-2 rounded-xl">
                      <span className="text-lg sm:text-xl font-black text-[#050521] block leading-none">
                        {timeLeft.hours}
                      </span>
                      <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold block mt-1">
                        Hours
                      </span>
                    </div>
                    <div className="bg-slate-50 border-2 border-[#050521] py-2 rounded-xl">
                      <span className="text-lg sm:text-xl font-black text-[#050521] block leading-none">
                        {timeLeft.minutes}
                      </span>
                      <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold block mt-1">
                        Mins
                      </span>
                    </div>
                    <div className="bg-slate-50 border-2 border-[#050521] py-2 rounded-xl">
                      <span className="text-lg sm:text-xl font-black text-emerald-600 block leading-none">
                        {timeLeft.seconds}
                      </span>
                      <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold block mt-1">
                        Secs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Action Button (Home Page Neo-Brutalist Style) */}
                <div className="pt-3 pb-3">
                  <button
                    type="button"
                    onClick={handleOpenForm}
                    id="hero-register-btn"
                    className="w-full py-4 px-6 bg-[#c6ff34] hover:bg-[#050521] text-[#050521] hover:text-[#c6ff34] rounded-2xl border-2 border-[#050521] font-black text-sm sm:text-base uppercase tracking-wider transition-all duration-150 shadow-[4px_4px_0px_0px_#050521] hover:shadow-[4px_4px_0px_0px_#c6ff34] active:translate-y-1 cursor-pointer flex items-center justify-center gap-2 group"
                  >
                    <span>Register Now for ₹99/-</span>
                    <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>

                {/* Bullets under button */}
                <div className="space-y-1.5 text-center text-xs text-slate-600 pt-1 font-medium">
                  <div className="flex items-center justify-center gap-3">
                    <span>● No coding required.</span>
                    <span>● No boring theory.</span>
                  </div>
                  <p className="text-[#050521] font-bold">
                    ● Just the clearest 2 hours (5:00 PM – 7:00 PM IST) of practical AI you'll ever have.
                  </p>
                </div>

                {/* Pricing Guarantee Badge */}
                <div className="mt-5 pt-4 border-t-2 border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Standard Pass: <del className="text-red-500">₹899</del></span>
                  <span className="text-emerald-700 font-black">Special Offer: ₹99/-</span>
                </div>

              </motion.div>
            </div>

          </div>
        )}

        {/* 3. THE CORE REGISTRATION FORM (Revealed on Button Click) */}
        <AnimatePresence>
          {showForm && !submittedData && (
            <motion.div
              ref={formRef}
              id="registration-form"
              initial={{ opacity: 0, y: 35, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="max-w-2xl mx-auto relative my-8"
            >
              {/* Neo-brutalist Offset Accent Plate */}
              <div className="absolute inset-0 bg-[#050521] rounded-[2rem] sm:rounded-[2.5rem] translate-x-2.5 sm:translate-x-3.5 translate-y-2.5 sm:translate-y-3.5 -z-10" />

              <div className="bg-white text-[#050521] border-3 border-[#050521] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-9 md:p-10 shadow-2xl">
                
                {/* Form Header */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b-2 border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#c6ff34] border-2 border-[#050521]" />
                    <span className="text-xs font-mono font-black uppercase text-[#050521] tracking-wider">
                      AI easy Ayi • Official Registration
                    </span>
                  </div>

                  {!isDirectForm && (
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="text-xs font-black uppercase text-slate-500 hover:text-[#050521] flex items-center gap-1 cursor-pointer"
                    >
                      <span>▲ Close Form</span>
                    </button>
                  )}
                </div>

                {/* Form Live Countdown Banner */}
                <div className="bg-[#050521] text-white p-3.5 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-wider text-[#00e575]">
                        2 Hrs Online Class • Special ₹99 Pass
                      </p>
                      <p className="text-[10px] text-slate-300 font-mono">
                        Session: {eventDateFormatted} • 5:00 PM – 7:00 PM IST
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono font-bold text-xs">
                    <span className="bg-white/10 px-2 py-1 rounded-md text-[#00e575]">{timeLeft.days}d</span>
                    <span>:</span>
                    <span className="bg-white/10 px-2 py-1 rounded-md text-white">{timeLeft.hours}h</span>
                    <span>:</span>
                    <span className="bg-white/10 px-2 py-1 rounded-md text-white">{timeLeft.minutes}m</span>
                    <span>:</span>
                    <span className="bg-white/10 px-2 py-1 rounded-md text-amber-300">{timeLeft.seconds}s</span>
                  </div>
                </div>

                {/* Error Banner */}
                {submitError && (
                  <div className="p-4 bg-red-50 border-2 border-red-500 rounded-2xl mb-6 text-red-700 text-xs font-bold">
                    ⚠️ {submitError}
                  </div>
                )}

                {/* Payment Notice / Warning */}
                {paymentNotice && (
                  <div className={`p-4 rounded-2xl mb-6 text-xs font-bold border-2 ${
                    paymentNotice.type === "warning"
                      ? "bg-amber-50 border-amber-500 text-amber-900"
                      : "bg-red-50 border-red-500 text-red-900"
                  }`}>
                    <p>{paymentNotice.message}</p>
                    {paymentNotice.registrationId && (
                      <p className="mt-1 font-mono text-[10px] text-slate-600">
                        Saved Lead Reference: {paymentNotice.registrationId}
                      </p>
                    )}
                  </div>
                )}

                {/* FORM FIELDS */}
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  
                  {/* 1. Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-[#050521]">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full px-4 py-3 sm:py-3.5 rounded-xl border-2 font-medium text-sm text-[#050521] placeholder-slate-400 focus:outline-none transition-all ${
                        errors.fullName
                          ? "border-red-500 bg-red-50/40"
                          : "border-[#050521] bg-white focus:bg-slate-50 focus:shadow-[3px_3px_0px_0px_#050521]"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs font-bold text-red-600 font-mono mt-1">
                        ⚠ {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* 2. Phone Number */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-[#050521]">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3.5 rounded-l-xl border-2 border-r-0 border-[#050521] bg-[#c6ff34] text-[#050521] font-mono font-black text-xs sm:text-sm select-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        className={`w-full px-4 py-3 sm:py-3.5 rounded-r-xl border-2 font-mono font-medium text-sm text-[#050521] placeholder-slate-400 focus:outline-none transition-all ${
                          errors.phone
                            ? "border-red-500 bg-red-50/40"
                            : "border-[#050521] bg-white focus:bg-slate-50 focus:shadow-[3px_3px_0px_0px_#050521]"
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs font-bold text-red-600 font-mono mt-1">
                        ⚠ {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* 3. Place */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-[#050521]">
                      Place / City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="place"
                      value={formData.place}
                      onChange={handleInputChange}
                      placeholder="e.g. Kannur, Calicut, Kochi, Bangalore"
                      className={`w-full px-4 py-3 sm:py-3.5 rounded-xl border-2 font-medium text-sm text-[#050521] placeholder-slate-400 focus:outline-none transition-all ${
                        errors.place
                          ? "border-red-500 bg-red-50/40"
                          : "border-[#050521] bg-white focus:bg-slate-50 focus:shadow-[3px_3px_0px_0px_#050521]"
                      }`}
                    />
                    {errors.place && (
                      <p className="text-xs font-bold text-red-600 font-mono mt-1">
                        ⚠ {errors.place}
                      </p>
                    )}
                  </div>

                  {/* 4. Qualification */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black uppercase tracking-wider text-[#050521]">
                        Qualification <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">
                        Select one option
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {QUALIFICATION_OPTIONS.map((opt, i) => {
                        const isSelected = formData.qualification === opt;
                        return (
                          <button
                            type="button"
                            key={i}
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                qualification: opt,
                              }));
                              if (errors.qualification) {
                                setErrors((prev) => ({
                                  ...prev,
                                  qualification: "",
                                }));
                              }
                            }}
                            className={`p-3.5 rounded-xl text-left border-2 font-bold text-xs transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? "bg-[#050521] text-[#c6ff34] border-[#050521] shadow-[2px_2px_0px_0px_#c6ff34]"
                                : "bg-slate-50 hover:bg-slate-100 text-[#050521] border-[#050521]/30 hover:border-[#050521]"
                            }`}
                          >
                            <span>{opt}</span>
                            <span
                              className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? "border-[#c6ff34] bg-[#c6ff34]"
                                  : "border-[#050521]/30 bg-white"
                              }`}
                            >
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#050521]" />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {formData.qualification === "Other" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="pt-2"
                      >
                        <input
                          type="text"
                          name="customQualification"
                          value={formData.customQualification}
                          onChange={handleInputChange}
                          placeholder="Please specify your qualification or profession"
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#050521] font-medium text-xs sm:text-sm text-[#050521] placeholder-slate-400 focus:outline-none focus:bg-slate-50"
                        />
                        {errors.customQualification && (
                          <p className="text-xs font-bold text-red-600 mt-1 font-mono">
                            ⚠ {errors.customQualification}
                          </p>
                        )}
                      </motion.div>
                    )}

                    {errors.qualification && (
                      <p className="text-xs font-bold text-red-600 font-mono mt-1">
                        ⚠ {errors.qualification}
                      </p>
                    )}
                  </div>

                  {/* Submission & Payment Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider border-2 border-[#050521] transition-all cursor-pointer flex items-center justify-center gap-3 ${
                        loading
                          ? "bg-slate-300 text-slate-600 cursor-not-allowed border-slate-400"
                          : "bg-[#c6ff34] hover:bg-[#050521] text-[#050521] hover:text-[#c6ff34] shadow-[4px_4px_0px_0px_#050521] hover:shadow-[4px_4px_0px_0px_#c6ff34] active:translate-y-1 duration-150"
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#050521] border-t-transparent rounded-full animate-spin" />
                          <span>
                            {loadingStep === "saving"
                              ? "Saving Registration..."
                              : loadingStep === "gateway"
                              ? "Connecting to Razorpay..."
                              : loadingStep === "verifying"
                              ? "Confirming Payment..."
                              : "Processing ₹99 Payment..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="tracking-widest">Pay & Register</span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#050521] text-white">
                            <span className="line-through text-slate-400 text-xs font-bold font-mono">₹899</span>
                            <span className="text-[#c6ff34] font-black text-sm font-mono">₹99</span>
                          </span>
                          <span className="font-black text-base">→</span>
                        </>
                      )}
                    </button>
                    <p className="text-center text-[11px] font-mono font-bold text-slate-500 mt-2.5">
                      🎟 Pass includes full access to 2 Hrs Online Class • 5:00 PM – 7:00 PM IST
                    </p>
                  </div>

                </form>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
