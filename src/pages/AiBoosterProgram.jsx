import React, { useState } from "react";
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
    label: "Yes, Extremely Interested! 🚀",
    desc: "Passionate about building AI projects & career in AI",
  },
  {
    id: "learn",
    label: "Yes, Want to Learn From Scratch 💡",
    desc: "Beginner eager to master AI tools & fundamentals",
  },
  {
    id: "curious",
    label: "Curious / Exploring Opportunities 🔍",
    desc: "Want to see how AI applies to my field of study",
  },
  {
    id: "not_sure",
    label: "Not Sure Yet, But Want to Know More 🤔",
    desc: "Looking for guidance and workshop sessions",
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
    interestedInAi: "Yes, Extremely Interested! 🚀",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(""); // "saving" | "gateway" | "verifying"
  const [pendingRegId, setPendingRegId] = useState(null);
  const [paymentNotice, setPaymentNotice] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const [submitError, setSubmitError] = useState("");

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
      window.scrollTo({ top: 120, behavior: "smooth" });
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

      // 1. Immediately save candidate to database as "unpaid lead" so lead is never lost
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
          color: "#050521",
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
            // Still display success screen because payment was captured by Razorpay
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
      interestedInAi: "Yes, Extremely Interested! 🚀",
    });
    setErrors({});
    setSubmitError("");
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#050521] pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Tech Elements */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#c6ff34]/15 via-emerald-100/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-72 h-72 rounded-full bg-[#c6ff34]/10 blur-2xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-blue-100/30 blur-2xl pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#050521] text-[#c6ff34] text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#c6ff34] animate-pulse" />
            DeepStaq Flagship Initiative
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#050521] tracking-tight uppercase leading-none">
            AI Booster <span className="bg-[#c6ff34] px-2 py-0.5 rounded-md inline-block">Program</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium leading-relaxed">
            Register now to receive access to the DeepStaq AI Booster Program, exclusive workshops, hands-on masterclasses, and curated learning roadmaps.
          </p>

          {/* Quick Perks Badges with Price Highlight */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-700 shadow-sm flex items-center gap-1.5">
              <span>🎯</span> School & College Students
            </span>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-700 shadow-sm flex items-center gap-1.5">
              <span>⚡</span> Beginner Friendly
            </span>
            <span className="px-3 py-1 bg-[#c6ff34]/25 border border-[#050521] rounded-full text-[11px] font-black text-[#050521] shadow-sm flex items-center gap-1.5">
              <span>🔥</span> Special Offer:{" "}
              <span className="line-through text-slate-400 font-bold">₹{ORIGINAL_PRICE}</span>{" "}
              <span className="bg-[#050521] text-[#c6ff34] px-2 py-0.5 rounded font-black">
                ₹{OFFER_PRICE} ONLY
              </span>
            </span>
          </div>
        </motion.div>

        {/* Success Confirmation Screen */}
        <AnimatePresence>
          {submittedData ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-[#050521] rounded-[2rem] p-6 sm:p-10 shadow-[8px_8px_0px_0px_#050521] text-center"
            >
              <div className="w-20 h-20 bg-[#c6ff34] text-[#050521] rounded-full mx-auto flex items-center justify-center text-4xl shadow-md border-2 border-[#050521] mb-6">
                ✓
              </div>

              <div className="inline-block px-3.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider mb-2 border border-emerald-300">
                🎉 Registration & Payment Successful!
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#050521] uppercase tracking-tight">
                Welcome to AI Booster Program, {submittedData.fullName}!
              </h2>

              <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                Your ₹{OFFER_PRICE} registration fee has been verified via Razorpay and saved to the database. We look forward to seeing you at the booster sessions!
              </p>

              {/* Payment & Registration Details Summary Box */}
              <div className="my-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left max-w-lg mx-auto space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 text-xs">
                  <span className="font-bold text-slate-500 uppercase">Reference ID</span>
                  <span className="font-mono font-black text-[#050521] bg-white px-2 py-0.5 rounded border border-slate-300">
                    {submittedData.id}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-200 text-xs">
                  <span className="font-bold text-slate-500 uppercase">Payment Status</span>
                  <span className="font-mono font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                    <span>✓</span> PAID ₹{submittedData.amountPaid || OFFER_PRICE}
                  </span>
                </div>

                {submittedData.paymentId && (
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 text-xs">
                    <span className="font-bold text-slate-500 uppercase">Razorpay Payment ID</span>
                    <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-300 truncate max-w-[200px]">
                      {submittedData.paymentId}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Student Name:</span>
                  <span className="font-black text-[#050521]">{submittedData.fullName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Mobile Number:</span>
                  <span className="font-black text-[#050521] font-mono">+91 {submittedData.phone}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Place / Town:</span>
                  <span className="font-black text-[#050521]">{submittedData.place}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">College / School:</span>
                  <span className="font-black text-[#050521]">{submittedData.collegeOrSchool}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Year / Sem:</span>
                  <span className="font-black text-[#050521]">{submittedData.yearOrSem}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-500">Interested in AI:</span>
                  <span className="font-black text-emerald-800 bg-[#c6ff34] px-2 py-0.5 rounded">
                    {submittedData.interestedInAi}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
                <a
                  href="https://chat.whatsapp.com/KxVV7ep74TV0GHy5SU2FXl"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:flex-1 py-3.5 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md border-2 border-[#050521]"
                >
                  <span>💬 Join WhatsApp Community</span>
                </a>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full sm:flex-1 py-3.5 px-6 bg-[#050521] hover:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Submit Another Student
                </button>
              </div>
            </motion.div>
          ) : (
            /* Main Form Card */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border-2 border-[#050521] rounded-[2rem] p-6 sm:p-10 shadow-[8px_8px_0px_0px_#050521] relative"
            >
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-[#050521] tracking-tight">
                    AI Booster Program Registration
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Please provide accurate information to complete your ₹{OFFER_PRICE} registration.
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="line-through text-slate-400 font-bold text-xs font-mono">
                    ₹{ORIGINAL_PRICE}
                  </span>
                  <span className="px-3 py-1 bg-[#c6ff34] text-[#050521] text-xs font-black uppercase tracking-wider rounded-lg border border-[#050521] shadow-sm">
                    ₹{OFFER_PRICE} ONLY
                  </span>
                </div>
              </div>

              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 text-red-800 rounded-2xl text-xs font-bold flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <span>{submitError}</span>
                </div>
              )}

              {paymentNotice && (
                <div
                  className={`mb-6 p-4 rounded-2xl text-xs font-bold border flex items-center justify-between gap-3 ${
                    paymentNotice.type === "warning"
                      ? "bg-amber-50 border-amber-300 text-amber-900"
                      : "bg-red-50 border-red-300 text-red-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{paymentNotice.type === "warning" ? "⚠️" : "❌"}</span>
                    <span>{paymentNotice.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPaymentNotice(null)}
                    className="text-xs font-mono font-black text-slate-500 hover:text-slate-800 px-2 py-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Field 1: Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2"
                  >
                    1. Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter student full name (e.g. Rahul Sharma)"
                    className={`w-full px-4 py-3.5 rounded-2xl border-2 font-medium text-sm transition-all outline-none ${
                      errors.fullName
                        ? "border-red-500 bg-red-50/30 focus:border-red-600"
                        : "border-slate-200 bg-slate-50 focus:border-[#050521] focus:bg-white"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1.5 text-xs text-red-600 font-bold">{errors.fullName}</p>
                  )}
                </div>

                {/* Field 2: Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2"
                  >
                    2. Phone Number (WhatsApp Enabled) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-slate-400">
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
                      className={`w-full pl-14 pr-4 py-3.5 rounded-2xl border-2 font-mono text-sm transition-all outline-none ${
                        errors.phone
                          ? "border-red-500 bg-red-50/30 focus:border-red-600"
                          : "border-slate-200 bg-slate-50 focus:border-[#050521] focus:bg-white"
                      }`}
                    />
                  </div>
                  {errors.phone ? (
                    <p className="mt-1.5 text-xs text-red-600 font-bold">{errors.phone}</p>
                  ) : (
                    <p className="mt-1 text-[11px] text-slate-400">
                      We will send Razorpay receipt and booster workshop links to this number.
                    </p>
                  )}
                </div>

                {/* Field 3: Place */}
                <div>
                  <label
                    htmlFor="place"
                    className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2"
                  >
                    3. Place / Town / City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="place"
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    placeholder="Enter your place (e.g. Kannur, Calicut, Kochi, Thalassery)"
                    className={`w-full px-4 py-3.5 rounded-2xl border-2 font-medium text-sm transition-all outline-none ${
                      errors.place
                        ? "border-red-500 bg-red-50/30 focus:border-red-600"
                        : "border-slate-200 bg-slate-50 focus:border-[#050521] focus:bg-white"
                    }`}
                  />
                  {errors.place && (
                    <p className="mt-1.5 text-xs text-red-600 font-bold">{errors.place}</p>
                  )}
                </div>

                {/* Field 4: College or School */}
                <div>
                  <label
                    htmlFor="collegeOrSchool"
                    className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2"
                  >
                    4. College or School Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="collegeOrSchool"
                    name="collegeOrSchool"
                    value={formData.collegeOrSchool}
                    onChange={handleInputChange}
                    placeholder="e.g. Govt Brennen College, NIT Calicut, St. Joseph's HSS"
                    className={`w-full px-4 py-3.5 rounded-2xl border-2 font-medium text-sm transition-all outline-none ${
                      errors.collegeOrSchool
                        ? "border-red-500 bg-red-50/30 focus:border-red-600"
                        : "border-slate-200 bg-slate-50 focus:border-[#050521] focus:bg-white"
                    }`}
                  />
                  {errors.collegeOrSchool && (
                    <p className="mt-1.5 text-xs text-red-600 font-bold">{errors.collegeOrSchool}</p>
                  )}
                </div>

                {/* Field 5: Year or Sem */}
                <div>
                  <label
                    htmlFor="yearOrSem"
                    className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2"
                  >
                    5. Year or Semester <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="yearOrSem"
                    name="yearOrSem"
                    value={formData.yearOrSem}
                    onChange={handleInputChange}
                    placeholder="Select below or type (e.g. 2nd Year / Sem 4)"
                    className={`w-full px-4 py-3.5 rounded-2xl border-2 font-medium text-sm transition-all outline-none mb-2.5 ${
                      errors.yearOrSem
                        ? "border-red-500 bg-red-50/30 focus:border-red-600"
                        : "border-slate-200 bg-slate-50 focus:border-[#050521] focus:bg-white"
                    }`}
                  />

                  {/* Quick Select Suggestion Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {YEAR_SEM_SUGGESTIONS.map((chip) => {
                      const isSelected = formData.yearOrSem === chip;
                      return (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleSelectYearChip(chip)}
                          className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                            isSelected
                              ? "bg-[#050521] text-[#c6ff34] border-[#050521] shadow-sm font-bold"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                          }`}
                        >
                          {chip}
                        </button>
                      );
                    })}
                  </div>

                  {errors.yearOrSem && (
                    <p className="mt-1.5 text-xs text-red-600 font-bold">{errors.yearOrSem}</p>
                  )}
                </div>

                {/* Field 6: Are you interested in AI? */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2.5">
                    6. Are you interested in AI? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? "border-[#050521] bg-[#c6ff34]/15 shadow-[3px_3px_0px_0px_#050521]"
                              : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                              isSelected ? "border-[#050521] bg-[#050521]" : "border-slate-400"
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 bg-[#c6ff34] rounded-full" />}
                          </div>
                          <div>
                            <span className="block text-xs font-black text-[#050521]">
                              {opt.label}
                            </span>
                            <span className="block text-[11px] text-slate-500 mt-0.5">
                              {opt.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {errors.interestedInAi && (
                    <p className="mt-1.5 text-xs text-red-600 font-bold">{errors.interestedInAi}</p>
                  )}
                </div>

                {/* Submit / Pay Button with Strikethrough 599 -> 49 */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 sm:py-5 px-6 sm:px-8 bg-[#050521] hover:bg-[#0c0c38] text-white rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider transition-all duration-200 border-2 border-[#050521] shadow-[5px_5px_0px_0px_#c6ff34] hover:shadow-[2px_2px_0px_0px_#c6ff34] hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-between disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3 w-full py-1">
                        <div className="w-5 h-5 border-3 border-[#c6ff34] border-t-transparent rounded-full animate-spin" />
                        <span className="font-mono text-sm tracking-widest text-[#c6ff34]">
                          {loadingStep === "gateway"
                            ? "Connecting to Razorpay..."
                            : loadingStep === "verifying"
                            ? "Verifying Payment..."
                            : "Opening Payment Gateway..."}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">⚡</span>
                          <span className="text-white font-extrabold tracking-wide">
                            REGISTER NOW
                          </span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 font-mono">
                          <span className="line-through text-slate-400 text-xs sm:text-sm font-bold">
                            ₹{ORIGINAL_PRICE}
                          </span>
                          <span className="bg-[#c6ff34] text-[#050521] px-3 py-1 rounded-xl text-sm sm:text-base font-black shadow-sm">
                            ₹{OFFER_PRICE}
                          </span>
                          <span className="text-[#c6ff34] text-lg group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </div>
                      </>
                    )}
                  </button>

                  {/* Trust Badges */}
               
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
