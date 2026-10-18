import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  saveAiEasyAyiRegistration,
  updateAiEasyAyiRegistration,
} from "../services/dbService";
import AdVideoSection from "../components/AdVideoSection";
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

export default function AiEasyAyi() {
  const formRef = useRef(null);
  const [showForm, setShowForm] = useState(false);

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

  const handleScrollToForm = () => {
    setShowForm(true);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        const firstInput = formRef.current.querySelector('input[name="fullName"]');
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 300);
        }
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
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#090D11] text-white selection:bg-[#c6ff34] selection:text-[#090D11] font-sans relative overflow-x-hidden pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8">
      
      {/* Background Subtle Tech Grid & Ambience */}
      <div className="absolute top-1/4 right-0 w-[260px] sm:w-[500px] h-[260px] sm:h-[500px] bg-[#c6ff34]/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/4 -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[240px] sm:w-[450px] h-[240px] sm:h-[450px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none translate-y-1/3 -translate-x-1/4 -z-10" />

      {/* MAIN CONTAINER */}
      <div className="max-w-4xl mx-auto relative z-10">

        {/* 1. SUCCESS RECEIPT (Displays after payment) */}
        <AnimatePresence>
          {submittedData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto bg-[#0D1318]/90 border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl mb-12 text-center"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#c6ff34]/15 border border-[#c6ff34]/40 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl sm:text-3xl font-black text-[#c6ff34] shadow-[0_0_25px_rgba(198,255,52,0.3)]">
                ✓
              </div>
              
              <span className="inline-block px-3 py-1 bg-[#c6ff34]/10 text-[#c6ff34] border border-[#c6ff34]/30 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full mb-3">
                REGISTRATION CONFIRMED • PASS ACTIVE
              </span>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                Welcome to AI easy Ayi!
              </h2>
              
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-md mx-auto font-medium">
                Thank you <strong className="text-white">{submittedData.fullName}</strong>. Your workshop seat has been reserved successfully.
              </p>

              {/* Receipt Info Card (Responsive Rows) */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 sm:p-4 my-5 sm:my-6 text-left space-y-2 text-xs font-mono">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 border-b border-white/10 pb-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px] sm:text-xs">Reference ID:</span>
                  <span className="font-bold text-white">{submittedData.id}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 border-b border-white/10 pb-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px] sm:text-xs">Payment ID:</span>
                  <span className="font-bold text-[#c6ff34] truncate max-w-full sm:max-w-[200px]">{submittedData.paymentId || "Confirmed"}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 border-b border-white/10 pb-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px] sm:text-xs">Phone:</span>
                  <span className="font-bold text-white">+91 {submittedData.phone}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 border-b border-white/10 pb-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px] sm:text-xs">Place:</span>
                  <span className="font-bold text-white">{submittedData.place}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 border-b border-white/10 pb-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px] sm:text-xs">Qualification:</span>
                  <span className="font-bold text-white">{submittedData.qualification}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 pt-0.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px] sm:text-xs flex-shrink-0">Class Schedule:</span>
                  <span className="font-bold text-emerald-400 sm:text-right break-words">{eventDateFormatted} • 5:00 PM – 7:00 PM IST (2 Hrs Online Class)</span>
                </div>
              </div>

              {/* WhatsApp Community CTA */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5 sm:p-4 mb-5">
                <p className="text-xs text-emerald-300 font-bold mb-3">
                  👉 Join the official candidate community for meeting links, session guides, and bonuses:
                </p>
                <a
                  href="https://chat.whatsapp.com/KxVV7ep74TV0GHy5SU2FXl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 sm:py-3.5 px-4 sm:px-5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <span>Join WhatsApp Community</span>
                  <span>→</span>
                </a>
              </div>

              {/* Secondary Actions */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
                <a
                  href={`https://wa.me/918075727195?text=${encodeURIComponent(
                    `Hi DeepStaq! I registered and paid ₹99 for AI easy Ayi (2 Hrs Online Class, 5:00 PM - 7:00 PM IST). Name: ${submittedData.fullName} (Ref: ${submittedData.id}, Payment ID: ${submittedData.paymentId || "N/A"})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2"
                >
                  <span>💬 Chat Support</span>
                </a>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  Register Another Candidate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!submittedData && (
          <div className="space-y-14">
            
            {/* ======================================================== */}
            {/* SECTION 1: YOUTUBE SHORTS VIDEO SECTION                   */}
            {/* ======================================================== */}
            <section className="text-center">
              <AdVideoSection
                videoId="r5Q_3yerIJs"
                title="deepstack AD QR"
                targetFormId="registration-form"
                originalPrice={899}
                offerPrice={99}
                onGoToForm={handleScrollToForm}
              />
            </section>

            {/* ======================================================== */}
            {/* SECTION 2: REGISTRATION FORM SECTION (REVEALED ON CLICK)  */}
            {/* ======================================================== */}
            <AnimatePresence>
              {showForm && (
                <motion.section
                  ref={formRef}
                  id="registration-form"
                  initial={{ opacity: 0, y: 35, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="max-w-2xl mx-auto relative pt-6 scroll-mt-28"
                >
                  <div className="bg-[#0D1318]/95 text-white border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 backdrop-blur-2xl shadow-2xl">
                    
                    {/* Form Header */}
                    <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#c6ff34] animate-ping" />
                        <span className="text-[11px] sm:text-xs font-mono font-bold uppercase text-white tracking-wider truncate">
                          AI easy Ayi • Official Registration
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="text-[11px] sm:text-xs font-mono font-bold uppercase text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors flex-shrink-0"
                      >
                        <span>▲ Close</span>
                      </button>
                    </div>

                    {/* Form Live Countdown Banner */}
                    <div className="bg-white/[0.04] border border-white/10 text-white p-3 rounded-xl mb-4 sm:mb-5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base flex-shrink-0">⚡</span>
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#c6ff34] truncate">
                            2 Hrs Online Class • Special ₹99 Pass
                          </p>
                          <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono truncate">
                            Session: {eventDateFormatted} • 5:00 PM – 7:00 PM IST
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 font-mono font-bold text-xs flex-shrink-0">
                        <span className="bg-white/10 px-1.5 py-0.5 rounded text-[#c6ff34]">{timeLeft.days}d</span>
                        <span>:</span>
                        <span className="bg-white/10 px-1.5 py-0.5 rounded text-white">{timeLeft.hours}h</span>
                        <span>:</span>
                        <span className="bg-white/10 px-1.5 py-0.5 rounded text-white">{timeLeft.minutes}m</span>
                        <span>:</span>
                        <span className="bg-white/10 px-1.5 py-0.5 rounded text-amber-300">{timeLeft.seconds}s</span>
                      </div>
                    </div>

                    {/* Error Banner */}
                    {submitError && (
                      <div className="p-3 bg-red-500/15 border border-red-500/40 rounded-xl mb-4 text-red-300 text-xs font-bold">
                        ⚠️ {submitError}
                      </div>
                    )}

                    {/* Payment Notice / Warning */}
                    {paymentNotice && (
                      <div className={`p-3 rounded-xl mb-4 text-xs font-bold border ${
                        paymentNotice.type === "warning"
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                          : "bg-red-500/15 border-red-500/40 text-red-300"
                      }`}>
                        <p>{paymentNotice.message}</p>
                        {paymentNotice.registrationId && (
                          <p className="mt-1 font-mono text-[10px] text-slate-400">
                            Saved Lead Reference: {paymentNotice.registrationId}
                          </p>
                        )}
                      </div>
                    )}

                    {/* FORM FIELDS */}
                    <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4" noValidate>
                      
                      {/* 1. Full Name */}
                      <div className="space-y-1">
                        <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                          Full Name <span className="text-[#c6ff34]">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="e.g. Rahul Sharma"
                          className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border font-medium text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                            errors.fullName
                              ? "border-red-500 bg-red-500/10"
                              : "border-white/15 bg-white/[0.04] focus:border-[#c6ff34] focus:ring-2 focus:ring-[#c6ff34]/20"
                          }`}
                        />
                        {errors.fullName && (
                          <p className="text-[11px] font-bold text-red-400 font-mono mt-0.5">
                            ⚠ {errors.fullName}
                          </p>
                        )}
                      </div>

                      {/* 2. Phone Number */}
                      <div className="space-y-1">
                        <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                          Phone Number <span className="text-[#c6ff34]">*</span>
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-white/15 bg-white/10 text-white font-mono font-bold text-xs sm:text-sm select-none flex-shrink-0">
                            +91
                          </span>
                          <input
                            type="tel"
                            name="phone"
                            maxLength={10}
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="10-digit mobile number"
                            className={`w-full px-3.5 py-2.5 sm:py-3 rounded-r-xl border font-mono font-medium text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                              errors.phone
                                ? "border-red-500 bg-red-500/10"
                                : "border-white/15 bg-white/[0.04] focus:border-[#c6ff34] focus:ring-2 focus:ring-[#c6ff34]/20"
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-[11px] font-bold text-red-400 font-mono mt-0.5">
                            ⚠ {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* 3. Place */}
                      <div className="space-y-1">
                        <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                          Place / City <span className="text-[#c6ff34]">*</span>
                        </label>
                        <input
                          type="text"
                          name="place"
                          value={formData.place}
                          onChange={handleInputChange}
                          placeholder="e.g. Kannur, Calicut, Kochi, Bangalore"
                          className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border font-medium text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                            errors.place
                              ? "border-red-500 bg-red-500/10"
                              : "border-white/15 bg-white/[0.04] focus:border-[#c6ff34] focus:ring-2 focus:ring-[#c6ff34]/20"
                          }`}
                        />
                        {errors.place && (
                          <p className="text-[11px] font-bold text-red-400 font-mono mt-0.5">
                            ⚠ {errors.place}
                          </p>
                        )}
                      </div>

                      {/* 4. Qualification */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                            Qualification <span className="text-[#c6ff34]">*</span>
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">
                            Select one
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
                                className={`p-2.5 sm:p-3 rounded-xl text-left border font-bold text-[11px] sm:text-xs transition-all cursor-pointer flex items-center justify-between gap-1 ${
                                  isSelected
                                    ? "bg-[#c6ff34] text-[#090D11] border-[#c6ff34] shadow-[0_0_15px_rgba(198,255,52,0.3)]"
                                    : "bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/10 hover:border-white/25"
                                }`}
                              >
                                <span className="truncate">{opt}</span>
                                <span
                                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                    isSelected
                                      ? "border-[#090D11] bg-[#090D11]"
                                      : "border-white/30 bg-transparent"
                                  }`}
                                >
                                  {isSelected && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#c6ff34]" />
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
                            className="pt-1"
                          >
                            <input
                              type="text"
                              name="customQualification"
                              value={formData.customQualification}
                              onChange={handleInputChange}
                              placeholder="Please specify your qualification or profession"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] font-medium text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#c6ff34]"
                            />
                            {errors.customQualification && (
                              <p className="text-[11px] font-bold text-red-400 mt-1 font-mono">
                                ⚠ {errors.customQualification}
                              </p>
                            )}
                          </motion.div>
                        )}

                        {errors.qualification && (
                          <p className="text-[11px] font-bold text-red-400 font-mono mt-0.5">
                            ⚠ {errors.qualification}
                          </p>
                        )}
                      </div>

                      {/* Submission & Payment Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className={`w-full py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between sm:justify-center gap-2 sm:gap-3 ${
                            loading
                              ? "bg-white/10 text-slate-500 cursor-not-allowed border border-white/10"
                              : "bg-[#c6ff34] text-[#090D11] hover:shadow-[0_0_25px_rgba(198,255,52,0.4)] hover:scale-[1.01] active:scale-[0.99] duration-150"
                          }`}
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-[#090D11] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                              <span className="truncate">
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
                              <span className="tracking-wide sm:tracking-widest truncate">Pay & Register</span>
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#090D11] text-white flex-shrink-0">
                                <span className="line-through text-slate-400 text-[10px] sm:text-xs font-bold font-mono">₹899</span>
                                <span className="text-[#c6ff34] font-black text-xs sm:text-sm font-mono">₹99</span>
                              </span>
                              <span className="font-black text-sm sm:text-base flex-shrink-0">→</span>
                            </>
                          )}
                        </button>
                        <p className="text-center text-[10px] sm:text-[11px] font-mono font-medium text-slate-400 mt-2">
                          🎟 Pass includes full access to 2 Hrs Online Class • 5:00 PM – 7:00 PM IST
                        </p>
                      </div>

                    </form>

                  </div>
                </motion.section>
              )}
            </AnimatePresence>

          </div>
        )}

      </div>

    </div>
  );
}
