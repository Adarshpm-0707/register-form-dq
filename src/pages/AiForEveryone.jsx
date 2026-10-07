import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  saveAiForEveryoneRegistration,
  updateAiForEveryoneRegistration,
} from "../services/dbService";

const EDUCATION_OPTIONS = [
  "School / 10th / Plus Two (+2)",
  "Diploma / Polytechnic",
  "Undergraduate Degree (B.Tech / B.Sc / B.Com / BCA / BA / BBA)",
  "Postgraduate Degree (M.Tech / M.Sc / MCA / MBA / MA)",
  "Working Professional / Graduate",
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
 * Calculates the next occurrence of Saturday at 4:00 PM (16:00).
 * If today is Saturday and it is already 4:00 PM or later, rolls over to next Saturday 4:00 PM.
 */
const getNextSaturday4PM = () => {
  const now = new Date();
  const target = new Date(now);
  const day = now.getDay(); // 0 is Sunday, 6 is Saturday
  
  // Calculate days until Saturday (day 6)
  const daysUntilSaturday = (6 - day + 7) % 7;
  target.setDate(now.getDate() + daysUntilSaturday);
  target.setHours(16, 0, 0, 0); // 4:00 PM
  
  // If target is in the past or right now, roll over to the next Saturday at 4 PM
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 7);
  }
  
  return target;
};

const calculateTimeLeft = () => {
  const target = getNextSaturday4PM();
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

export default function AiForEveryone() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    place: "",
    education: "",
    customEducation: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [paymentNotice, setPaymentNotice] = useState(null);
  const [pendingRegId, setPendingRegId] = useState(null);

  // Live countdown timer state (resets every Saturday at 4:00 PM)
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      errs.fullName = "Name is required";
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = "Name must be at least 2 characters";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (cleanPhone.length < 10) {
      errs.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.place.trim()) {
      errs.place = "Place is required";
    }

    if (!formData.education) {
      errs.education = "Education qualification is required";
    } else if (formData.education === "Other" && !formData.customEducation.trim()) {
      errs.customEducation = "Please specify your qualification";
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
      const finalEducation =
        formData.education === "Other"
          ? `Other: ${formData.customEducation.trim()}`
          : formData.education;

      const payload = {
        fullName: formData.fullName.trim(),
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        place: formData.place.trim(),
        education: finalEducation,
        program: "AI For Everyone",
        type: "AI_FOR_EVERYONE",
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
        const result = await saveAiForEveryoneRegistration(payload);
        regId = result?.id || `AFE-${Date.now().toString().slice(-6)}`;
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

      // 3. Configure Razorpay Checkout for ₹99
      const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_live_SnxCrKgLPqpHnz";
      const cleanPhone = formData.phone.replace(/\D/g, "").slice(-10);

      const options = {
        key: razorpayKey,
        amount: 99 * 100, // 9900 paise = ₹99
        currency: "INR",
        name: "DeepStaq",
        description: "AI For Everyone Registration Fee (Special Offer ₹99)",
        image: "/favicon.ico",
        prefill: {
          name: formData.fullName.trim(),
          contact: cleanPhone,
        },
        notes: {
          registrationId: regId,
          course: "AI For Everyone",
          offerPrice: "99",
          originalPrice: "899",
        },
        theme: {
          color: "#050521",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setPaymentNotice({
              type: "warning",
              message: `Your registration details have been saved (Ref: ${regId.slice(0, 8)}). Payment was not completed. You can click "Pay ₹99 & Register" to complete payment anytime.`,
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
            await updateAiForEveryoneRegistration(regId, {
              paymentStatus: "paid",
              paymentId: paymentId,
              amountPaid: 99,
              status: "Paid & Confirmed",
            });

            setSubmittedData({
              ...payload,
              id: regId,
              paymentStatus: "paid",
              paymentId: paymentId,
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
            // Still display success card because payment was verified by Razorpay
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
          message: `Payment failed: ${failResponse.error?.description || "Transaction declined"}. Your details remain saved as pending.`,
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
      education: "",
      customEducation: "",
    });
    setErrors({});
    setSubmitError("");
    setPaymentNotice(null);
    setPendingRegId(null);
    setSubmittedData(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#050521] selection:bg-[#c6ff34] selection:text-[#050521] font-sans pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      
      {/* Background Subtle Tech Grid & Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(#050521_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-[#c6ff34]/15 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/3 -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#050521]/5 rounded-full blur-[130px] pointer-events-none translate-y-1/3 -translate-x-1/3 -z-10" />

      <div className="max-w-[720px] mx-auto relative z-10">
        
        {/* Header Breadcrumbs / Title */}
        <div className="text-center mb-8 sm:mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c6ff34] border-2 border-[#050521] shadow-[2px_2px_0px_0px_#050521]">
            <span className="w-2 h-2 rounded-full bg-[#050521] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#050521]">
              DeepStaq Initiative
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-[#050521]">
            AI FOR <span className="text-stroke-dark text-transparent">EVERYONE</span>
          </h1>

          <p className="text-slate-600 font-medium text-xs sm:text-sm">
            Registration Form
          </p>
        </div>

        {/* Form Container */}
        <AnimatePresence mode="wait">
          {submittedData ? (
            /* Success Card */
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border-3 border-[#050521] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-[8px_8px_0px_0px_#c6ff34] text-center space-y-6"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#c6ff34] border-2 border-[#050521] mx-auto flex items-center justify-center text-3xl sm:text-4xl shadow-[4px_4px_0px_0px_#050521]">
                ✓
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-[0.2em] text-emerald-800">
                    Payment & Registration Confirmed
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#050521]">
                  Thank You, {submittedData.fullName}!
                </h2>
                <p className="text-slate-600 font-medium text-xs sm:text-sm max-w-md mx-auto">
                  Your seat for <strong>AI For Everyone</strong> has been successfully booked.
                </p>
              </div>

              {/* Summary */}
              <div className="bg-slate-50 border-2 border-[#050521] rounded-2xl p-4 sm:p-5 text-left max-w-md mx-auto space-y-2.5 font-mono text-xs">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-slate-500 uppercase text-[10px] font-bold">Reference ID:</span>
                  <span className="font-bold text-[#050521]">{submittedData.id}</span>
                </div>
                {submittedData.paymentId && (
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-slate-500 uppercase text-[10px] font-bold">Payment ID:</span>
                    <span className="font-bold text-emerald-700 truncate max-w-[200px]">{submittedData.paymentId}</span>
                  </div>
                )}
                <div className="flex justify-between border-b pb-1.5 items-center">
                  <span className="text-slate-500 uppercase text-[10px] font-bold">Amount Paid:</span>
                  <span className="font-bold text-[#050521] flex items-center gap-1.5">
                    <span className="line-through text-slate-400 text-[10px]">₹899</span>
                    <span className="text-emerald-700 font-black text-sm">₹99</span>
                    <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[9px]">PAID</span>
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-slate-500 uppercase text-[10px] font-bold">Phone Number:</span>
                  <span className="font-bold text-[#050521]">{submittedData.phone}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-slate-500 uppercase text-[10px] font-bold">Place:</span>
                  <span className="font-bold text-[#050521]">{submittedData.place}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase text-[10px] font-bold">Education:</span>
                  <span className="font-bold text-[#050521] truncate max-w-[200px]">{submittedData.education}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <a
                  href={`https://wa.me/918075727195?text=${encodeURIComponent(
                    `Hi DeepStaq! I registered and paid ₹99 for AI For Everyone. Name: ${submittedData.fullName} (Ref: ${submittedData.id}, Payment ID: ${submittedData.paymentId || "N/A"})`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#25D366] text-white hover:bg-emerald-600 border-2 border-[#050521] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-[3px_3px_0px_0px_#050521] flex items-center justify-center gap-2"
                >
                  <span>Chat on WhatsApp</span>
                  <span>💬</span>
                </a>

                <button
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-3 bg-white text-[#050521] hover:bg-slate-100 border-2 border-[#050521] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-[3px_3px_0px_0px_#050521] cursor-pointer"
                >
                  Register Again
                </button>
              </div>
            </motion.div>
          ) : (
            /* The Core Registration Form */
            <div key="form-container" className="relative">
              {/* Neo-brutalist Offset Accent Plate */}
              <div className="absolute inset-0 bg-[#050521] rounded-[2rem] sm:rounded-[2.5rem] border-2 border-[#050521] translate-x-2.5 sm:translate-x-3.5 translate-y-2.5 sm:translate-y-3.5 -z-10" />

              <div className="bg-white border-2 sm:border-3 border-[#050521] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-9 md:p-10 shadow-xl">
                
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
                  
                  {/* Live Countdown Timer Banner (Resets every Saturday at 4:00 PM) */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#050521] text-white border-2 border-[#050521] shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-center sm:text-left">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#c6ff34] animate-pulse shrink-0" />
                      <div>
                        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#c6ff34]">
                          ⏳ Offer Ends In:
                        </p>
                     
                      </div>
                    </div>

                    {/* Timer Blocks: Days, Hours, Minutes, Seconds */}
                    <div className="flex items-center gap-1.5 font-mono">
                      {/* Days */}
                      <div className="flex flex-col items-center bg-white/10 border border-white/20 rounded-xl px-2.5 py-1 min-w-[46px]">
                        <span className="text-xs sm:text-sm font-black text-[#c6ff34] leading-tight">
                          {timeLeft.days}
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-slate-300">
                          Day{timeLeft.days === "01" ? "" : "s"}
                        </span>
                      </div>
                      <span className="text-[#c6ff34] font-bold text-xs">:</span>

                      {/* Hours */}
                      <div className="flex flex-col items-center bg-white/10 border border-white/20 rounded-xl px-2.5 py-1 min-w-[46px]">
                        <span className="text-xs sm:text-sm font-black text-[#c6ff34] leading-tight">
                          {timeLeft.hours}
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-slate-300">
                          Hours
                        </span>
                      </div>
                      <span className="text-[#c6ff34] font-bold text-xs">:</span>

                      {/* Minutes */}
                      <div className="flex flex-col items-center bg-white/10 border border-white/20 rounded-xl px-2.5 py-1 min-w-[46px]">
                        <span className="text-xs sm:text-sm font-black text-[#c6ff34] leading-tight">
                          {timeLeft.minutes}
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-slate-300">
                          Mins
                        </span>
                      </div>
                      <span className="text-[#c6ff34] font-bold text-xs">:</span>

                      {/* Seconds */}
                      <div className="flex flex-col items-center bg-white/10 border border-[#c6ff34]/40 rounded-xl px-2.5 py-1 min-w-[46px] shadow-[0_0_8px_rgba(198,255,52,0.2)]">
                        <span className="text-xs sm:text-sm font-black text-[#c6ff34] leading-tight animate-pulse">
                          {timeLeft.seconds}
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-[#c6ff34]">
                          Sec
                        </span>
                      </div>
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-4 rounded-xl bg-red-50 border-2 border-red-500 text-red-700 text-xs font-bold font-mono">
                      ⚠ {submitError}
                    </div>
                  )}

                  {paymentNotice && (
                    <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-500 text-amber-900 text-xs font-bold font-mono">
                      ⏳ {paymentNotice.message}
                    </div>
                  )}

                  {/* 1. Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-[#050521]">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
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
                      Place <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="place"
                      value={formData.place}
                      onChange={handleInputChange}
                      placeholder="e.g. Kannur, Taliparamba, Calicut, Kochi"
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

                  {/* 4. Education */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black uppercase tracking-wider text-[#050521]">
                        Education <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">
                        Select qualification
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {EDUCATION_OPTIONS.map((opt, i) => {
                        const isSelected = formData.education === opt;
                        return (
                          <button
                            type="button"
                            key={i}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, education: opt }));
                              if (errors.education) {
                                setErrors((prev) => ({ ...prev, education: "" }));
                              }
                            }}
                            className={`p-3 rounded-xl text-left border-2 font-bold text-xs transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? "bg-[#050521] text-[#c6ff34] border-[#050521] shadow-[2px_2px_0px_0px_#c6ff34]"
                                : "bg-slate-50 hover:bg-slate-100 text-[#050521] border-[#050521]/30 hover:border-[#050521]"
                            }`}
                          >
                            <span className="truncate pr-2">{opt}</span>
                            <span
                              className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                                isSelected
                                  ? "border-[#c6ff34] bg-[#c6ff34]"
                                  : "border-[#050521]/30 bg-white"
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#050521]" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {formData.education === "Other" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="pt-1.5"
                      >
                        <input
                          type="text"
                          name="customEducation"
                          value={formData.customEducation}
                          onChange={handleInputChange}
                          placeholder="Please specify your education / qualification"
                          className="w-full px-4 py-2.5 rounded-xl border-2 border-[#050521] font-medium text-xs sm:text-sm text-[#050521] placeholder-slate-400 focus:outline-none focus:bg-slate-50"
                        />
                        {errors.customEducation && (
                          <p className="text-xs font-bold text-red-600 mt-1 font-mono">
                            ⚠ {errors.customEducation}
                          </p>
                        )}
                      </motion.div>
                    )}

                    {errors.education && (
                      <p className="text-xs font-bold text-red-600 font-mono mt-1">
                        ⚠ {errors.education}
                      </p>
                    )}
                  </div>

                  {/* Submit Button with ₹899 strikethrough to ₹99 */}
                  <div className="pt-3 space-y-2.5">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 sm:py-4.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[#050521] transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
                        loading
                          ? "bg-slate-300 text-slate-600 cursor-not-allowed border-slate-400"
                          : "bg-[#c6ff34] text-[#050521] hover:bg-[#050521] hover:text-[#c6ff34] shadow-[4px_4px_0px_0px_#050521] hover:shadow-[4px_4px_0px_0px_#c6ff34] active:translate-y-1 duration-150"
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

                    
                  </div>

                </form>

              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
