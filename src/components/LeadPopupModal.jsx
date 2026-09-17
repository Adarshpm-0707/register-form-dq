import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { savePopupLeadStep } from "../services/dbService";

export default function LeadPopupModal({ forceOpen = false, onCloseCallback = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [leadDocId, setLeadDocId] = useState(() => sessionStorage.getItem("active_lead_doc_id") || null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form State
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("");
  const [purposeOther, setPurposeOther] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Automatic open on site load / reload (except admin pages)
  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) {
      setIsOpen(false);
      return;
    }

    // If user has already completed the form in this session, keep popup removed so they can browse freely
    if (sessionStorage.getItem("lead_popup_completed") === "true") {
      setIsOpen(false);
      return;
    }

    // Wait 5 seconds after site load before showing the popup
    const timer = setTimeout(() => {
      if (!window.location.pathname.startsWith("/admin") && sessionStorage.getItem("lead_popup_completed") !== "true") {
        setIsOpen(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Ensure modal is closed if navigating to admin
  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // If forceOpen prop changes
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setCurrentStep(1);
    }
  }, [forceOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (onCloseCallback) onCloseCallback();
  };

  // Step 1 -> Step 2
  const handleGetStarted = () => {
    setErrorMessage("");
    setCurrentStep(2);
  };

  // Step 2 (Name) -> Step 3
  const handleNextName = async () => {
    const trimmed = fullName.trim();
    if (!trimmed || trimmed.length < 2) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    setErrorMessage("");
    setIsSaving(true);

    try {
      // Auto-save Name to Firestore immediately
      const res = await savePopupLeadStep(
        {
          fullName: trimmed,
          step: 2,
          completed: false,
          status: "In Progress (Name Entered)",
          leadSource: window.location.pathname || "Website Modal",
        },
        leadDocId
      );

      if (res?.id) {
        setLeadDocId(res.id);
        sessionStorage.setItem("active_lead_doc_id", res.id);
      }
      setCurrentStep(3);
    } catch (err) {
      console.error("Error saving name lead:", err);
      // Still proceed so user isn't blocked
      setCurrentStep(3);
    } finally {
      setIsSaving(false);
    }
  };

  // Step 3 (Phone) -> Step 4
  const handleNextPhone = async () => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 7) {
      setErrorMessage("Please enter a valid phone number (at least 7 to 10 digits).");
      return;
    }
    setErrorMessage("");
    setIsSaving(true);

    const fullPhoneNumber = `${countryCode} ${phone.trim()}`;

    try {
      // Auto-update Phone to Firestore immediately
      const res = await savePopupLeadStep(
        {
          fullName: fullName.trim(),
          phone: fullPhoneNumber,
          countryCode,
          step: 3,
          completed: false,
          status: "In Progress (Phone Captured)",
        },
        leadDocId
      );

      if (res?.id && !leadDocId) {
        setLeadDocId(res.id);
        sessionStorage.setItem("active_lead_doc_id", res.id);
      }
      setCurrentStep(4);
    } catch (err) {
      console.error("Error saving phone lead:", err);
      setCurrentStep(4);
    } finally {
      setIsSaving(false);
    }
  };

  // Step 4 (Email) -> Step 5
  const handleNextEmail = async () => {
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed || !emailRegex.test(trimmed)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    setErrorMessage("");
    setIsSaving(true);

    try {
      // Auto-update Email to Firestore immediately
      const res = await savePopupLeadStep(
        {
          fullName: fullName.trim(),
          email: trimmed,
          step: 4,
          completed: false,
          status: "In Progress (Email Captured)",
        },
        leadDocId
      );

      if (res?.id && !leadDocId) {
        setLeadDocId(res.id);
        sessionStorage.setItem("active_lead_doc_id", res.id);
      }
      setCurrentStep(5);
    } catch (err) {
      console.error("Error saving email lead:", err);
      setCurrentStep(5);
    } finally {
      setIsSaving(false);
    }
  };

  // Step 5 (Purpose) -> Step 6 (Final Completion)
  const handleNextPurpose = async () => {
    if (!purpose) {
      setErrorMessage("Please choose what you'd like help with.");
      return;
    }
    if (purpose === "Other" && !purposeOther.trim()) {
      setErrorMessage("Please briefly tell us how we can help.");
      return;
    }

    setErrorMessage("");
    setIsSaving(true);

    try {
      // Auto-update Purpose and mark as Completed
      await savePopupLeadStep(
        {
          fullName: fullName.trim(),
          phone: `${countryCode} ${phone.trim()}`,
          countryCode,
          email: email.trim(),
          purpose,
          purposeOther: purposeOther.trim(),
          step: 5,
          completed: true,
          status: "Completed",
        },
        leadDocId
      );

      setCurrentStep(6);
    } catch (err) {
      console.error("Error saving final purpose:", err);
      setCurrentStep(6);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinishExplore = async () => {
    setIsSaving(true);
    try {
      const fullPhone = phone ? `${countryCode} ${phone.trim()}` : "";
      // Ensure all collected lead data is completely saved to database
      await savePopupLeadStep(
        {
          fullName: fullName.trim(),
          phone: fullPhone,
          countryCode,
          email: email.trim(),
          purpose: purpose || "Book a Free Consultation",
          purposeOther: purposeOther.trim(),
          step: 6,
          completed: true,
          status: "Completed",
          completedAt: new Date().toISOString(),
          leadSource: window.location.pathname || "Website Modal",
        },
        leadDocId
      );
    } catch (err) {
      console.error("Error finalizing lead save on explore:", err);
    } finally {
      setIsSaving(false);
    }

    // Set session flag to completely remove the popup window during this visit
    sessionStorage.setItem("lead_popup_completed", "true");
    sessionStorage.removeItem("active_lead_doc_id");

    // Close and remove the popup window
    setIsOpen(false);
    if (onCloseCallback) onCloseCallback();

    // Show other pages (navigate to programs)
    navigate("/programs");
  };

  // Don't render modal on admin routes
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* Floating Reopen Launcher when modal is dismissed */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setCurrentStep(1);
          }}
          className="fixed bottom-6 right-6 z-40 bg-[#0B132B] hover:bg-[#050521] text-white pl-4 pr-5 py-3 rounded-full shadow-[0_10px_25px_rgba(11,19,43,0.35)] hover:shadow-[0_12px_30px_rgba(198,255,52,0.4)] border-2 border-[#c6ff34] flex items-center gap-2.5 transition-all duration-300 group hover:scale-105"
          title="Build Your AI Future"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#c6ff34] animate-ping" />
          <span className="text-xs font-black tracking-wide uppercase text-white">Let's Talk</span>
          <svg className="w-4 h-4 text-[#c6ff34] group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      )}

      {/* Main Modal Backdrop & Card */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-[430px] bg-white rounded-[28px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden flex flex-col p-6 sm:p-7 text-left my-auto transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: Brand Logo & Close Button */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-black tracking-tight text-[#0B132B]">
                deepstaq
              </span>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-[#0B132B] hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Segmented 6-Step Progress Bar */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-1.5 flex-1">
                {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      stepNumber <= currentStep ? "bg-[#0B132B]" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-400 shrink-0 select-none">
                {currentStep} of 6
              </span>
            </div>

            {/* Error Message banner if any */}
            {errorMessage && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 1 OF 6: Welcome Screen */}
            {/* ========================================================= */}
            {currentStep === 1 && (
              <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
                {/* Illustration: Chat bubble + Phone Card + 'Let's Talk' */}
                <div className="relative w-44 h-32 flex items-center justify-center mb-4">
                  {/* Soft blue background cloud */}
                  <div className="absolute inset-0 bg-[#EFF6FF] rounded-[36px] -rotate-3 scale-95" />
                  
                  {/* Chat bubble behind */}
                  <div className="absolute top-2 right-4 bg-white/90 shadow-sm border border-blue-100 rounded-2xl px-3 py-2 flex flex-col gap-1 z-10">
                    <div className="w-8 h-1.5 bg-slate-300 rounded-full" />
                    <div className="w-5 h-1.5 bg-slate-200 rounded-full" />
                  </div>

                  {/* Blue phone card */}
                  <div className="relative z-20 bg-[#4F46E5] text-white w-20 h-16 rounded-2xl shadow-lg flex items-center justify-center -rotate-6 transform hover:rotate-0 transition-transform">
                    <svg className="w-8 h-8 text-white transform -rotate-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                  </div>

                  {/* "Let's Talk" sticker text with arrow */}
                  <div className="absolute -left-2 top-3 z-30 transform -rotate-12">
                    <span className="font-serif italic font-black text-sm text-[#0B132B] tracking-wide block">
                      Let's<br />Talk
                    </span>
                    <svg className="w-5 h-5 text-[#0B132B] -mt-1 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>

                  {/* Sparkle lines */}
                  <div className="absolute -right-1 bottom-4 text-[#0B132B] text-xs font-black">
                    ✨
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-[26px] font-black text-[#0B132B] tracking-tight leading-tight">
                  Let's Build Your<br />AI Future
                </h2>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-slate-500 mt-2.5 leading-relaxed max-w-[320px]">
                  Answer a few quick questions and our expert will get in touch with you.
                </p>

                {/* 3 Value Props */}
                <div className="grid grid-cols-3 gap-2 w-full mt-6 mb-7 pt-4 border-t border-slate-100">
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#0B132B]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 leading-tight">
                      Quick<br />Response
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#0B132B]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 leading-tight">
                      Expert<br />Guidance
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#0B132B]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 leading-tight">
                      No<br />Obligation
                    </span>
                  </div>
                </div>

                {/* Get Started Button */}
                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#0B132B] hover:bg-slate-800 text-white font-black text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>Get Started</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 2 OF 6: What's your name? */}
            {/* ========================================================= */}
            {currentStep === 2 && (
              <div className="flex flex-col animate-in fade-in duration-300">
                {/* Circle Icon */}
                <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center text-slate-700 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#0B132B] tracking-tight">
                  What's your name?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  So we know who to reach out to.
                </p>

                {/* Form Input */}
                <div className="mt-6 mb-8">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      autoFocus
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleNextName();
                      }}
                      placeholder="Enter your name"
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextName}
                    disabled={isSaving}
                    className="flex-1 py-3 px-6 rounded-2xl bg-[#0B132B] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
                  >
                    <span>{isSaving ? "Saving..." : "Next"}</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 3 OF 6: What's your phone number? */}
            {/* ========================================================= */}
            {currentStep === 3 && (
              <div className="flex flex-col animate-in fade-in duration-300">
                {/* Circle Icon */}
                <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center text-slate-700 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#0B132B] tracking-tight">
                  What's your phone number?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Our expert will call or WhatsApp you on this number.
                </p>

                {/* Form Input */}
                <div className="mt-6 mb-8">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#0B132B] focus-within:border-transparent transition-all">
                    {/* Country code selector */}
                    <div className="flex items-center gap-1.5 px-3 py-3 bg-slate-50 border-r border-slate-200 text-sm font-bold text-slate-700 shrink-0">
                      <span>🇮🇳</span>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-transparent border-none text-xs font-black text-slate-700 focus:outline-none cursor-pointer"
                      >
                        <option value="+91">+91 (IN)</option>
                        <option value="+971">+971 (UAE)</option>
                        <option value="+966">+966 (KSA)</option>
                        <option value="+1">+1 (US)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+65">+65 (SG)</option>
                      </select>
                    </div>

                    <input
                      type="tel"
                      autoFocus
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleNextPhone();
                      }}
                      placeholder="98765 43210"
                      className="w-full bg-white py-3 px-4 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPhone}
                    disabled={isSaving}
                    className="flex-1 py-3 px-6 rounded-2xl bg-[#0B132B] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
                  >
                    <span>{isSaving ? "Saving..." : "Next"}</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 4 OF 6: What's your email? */}
            {/* ========================================================= */}
            {currentStep === 4 && (
              <div className="flex flex-col animate-in fade-in duration-300">
                {/* Circle Icon */}
                <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center text-slate-700 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#0B132B] tracking-tight">
                  What's your email?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  We'll share course details, updates and other information here.
                </p>

                {/* Form Input */}
                <div className="mt-6 mb-8">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleNextEmail();
                      }}
                      placeholder="you@example.com"
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextEmail}
                    disabled={isSaving}
                    className="flex-1 py-3 px-6 rounded-2xl bg-[#0B132B] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
                  >
                    <span>{isSaving ? "Saving..." : "Next"}</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 5 OF 6: How can we help you? */}
            {/* ========================================================= */}
            {currentStep === 5 && (
              <div className="flex flex-col animate-in fade-in duration-300">
                {/* Circle Icon */}
                <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center text-slate-700 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#0B132B] tracking-tight">
                  How can we help you?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Let us know your purpose. We'll guide you better.
                </p>

                {/* Form Input: Dropdown */}
                <div className="mt-6 mb-6">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    I want to: <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="relative">
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition-all cursor-pointer appearance-none"
                    >
                      <option value="">-- Select an option --</option>
                      <option value="Book a Free Consultation">📅 Book a Free Consultation</option>
                      <option value="Enquire About Course">📖 Enquire About Course</option>
                      <option value="Know Fee Structure">₹ Know Fee Structure</option>
                      <option value="Get Career Guidance">📈 Get Career Guidance</option>
                      <option value="Explore Corporate Training">🏢 Explore Corporate Training</option>
                      <option value="Other">⋯ Other</option>
                    </select>

                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {purpose === "Other" && (
                    <div className="mt-3 animate-in fade-in duration-200">
                      <input
                        type="text"
                        autoFocus
                        value={purposeOther}
                        onChange={(e) => setPurposeOther(e.target.value)}
                        placeholder="Please specify your query..."
                        className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-4 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
                      />
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPurpose}
                    disabled={isSaving}
                    className="flex-1 py-3 px-6 rounded-2xl bg-[#0B132B] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
                  >
                    <span>{isSaving ? "Submitting..." : "Next"}</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 6 OF 6: You're all set! (Success) */}
            {/* ========================================================= */}
            {currentStep === 6 && (
              <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
                {/* Illustration: Paper plane flying up + Sparkles */}
                <div className="relative w-36 h-32 flex items-center justify-center mb-2">
                  {/* Soft light blue circular blob */}
                  <div className="absolute w-28 h-28 bg-[#EFF6FF] rounded-full scale-105" />

                  {/* Golden Stars / Sparkles */}
                  <span className="absolute top-4 left-3 text-amber-400 text-base font-bold animate-bounce">
                    ✨
                  </span>
                  <span className="absolute top-3 right-4 text-amber-400 text-sm font-bold animate-pulse">
                    ✦
                  </span>

                  {/* Navy paper airplane */}
                  <div className="relative z-10 text-[#1E3A8A] transform -rotate-12 translate-y-1 hover:scale-110 transition-transform">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </div>

                  {/* Motion trail dashes */}
                  <div className="absolute bottom-4 left-8 flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                  </div>
                </div>

                {/* Heading */}
                <h2 className="text-2xl sm:text-[26px] font-black text-[#0B132B] tracking-tight">
                  You're all set!
                </h2>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-[300px]">
                  Thank you for your interest. Our team will get in touch with you shortly.
                </p>

                {/* "Meanwhile" Callout card */}
                <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 my-6 text-left">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-800">Meanwhile,</span>
                    <span className="text-xs text-slate-600 leading-snug">
                      you can explore our courses and success stories.
                    </span>
                  </div>
                </div>

                {/* Explore DeepStaq Button */}
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleFinishExplore}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#0B132B] hover:bg-slate-800 text-white font-black text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70 cursor-pointer"
                >
                  <span>{isSaving ? "Saving & Exploring..." : "Explore DeepStaq"}</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
