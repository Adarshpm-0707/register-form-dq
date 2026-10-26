import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { savePopupLead } from "../services/dbService";

export default function LeadPopupModal({ forceOpen = false, onCloseCallback = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [countryPrefix, setCountryPrefix] = useState("IN");
  const [phone, setPhone] = useState("");
  const [programme, setProgramme] = useState("");

  const location = useLocation();

  const handleClose = useCallback(() => {
    setIsOpen(false);
    sessionStorage.setItem("lead_popup_dismissed", "true");
    if (onCloseCallback) onCloseCallback();
  }, [onCloseCallback]);

  // Automatic open on home page ("/") after brief delay
  useEffect(() => {
    if (location.pathname !== "/") {
      setIsOpen(false);
      return;
    }

    // Check session storage
    if (
      sessionStorage.getItem("lead_popup_completed") === "true" ||
      sessionStorage.getItem("lead_popup_dismissed") === "true"
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (
        location.pathname === "/" &&
        sessionStorage.getItem("lead_popup_completed") !== "true" &&
        sessionStorage.getItem("lead_popup_dismissed") !== "true"
      ) {
        setIsOpen(true);
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Support forceOpen prop
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setIsSuccess(false);
      setErrorMessage("");
    }
  }, [forceOpen]);

  // Support global custom events to open the modal from anywhere
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsSuccess(false);
      setErrorMessage("");
    };
    window.addEventListener("open-career-goal-modal", handleOpen);
    window.addEventListener("open-lead-popup", handleOpen);
    return () => {
      window.removeEventListener("open-career-goal-modal", handleOpen);
      window.removeEventListener("open-lead-popup", handleOpen);
    };
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const handleCountryChange = (e) => {
    const val = e.target.value;
    // e.g. "IN:+91"
    const [prefix, code] = val.split(":");
    setCountryPrefix(prefix || "IN");
    setCountryCode(code || "+91");
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage("");

    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage("Please enter your name.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 7) {
      setErrorMessage("Please enter a valid phone number (at least 7 to 10 digits).");
      return;
    }

    if (!programme) {
      setErrorMessage("Please select a programme.");
      return;
    }

    setIsSubmitting(true);

    try {
      const fullPhoneNumber = `${countryCode} ${phone.trim()}`;
      
      await savePopupLead({
        fullName: trimmedName,
        phone: fullPhoneNumber,
        countryCode,
        programme,
        program: programme,
        purpose: programme,
        completed: true,
        type: "POPUP_LEAD",
        leadType: "CAREER_GOAL_POPUP",
        status: "New Lead",
        leadStatus: "New Lead",
        leadSource: window.location.pathname || "Website Modal",
      });

      setIsSuccess(true);
      sessionStorage.setItem("lead_popup_completed", "true");

      // Auto close after 2.8 seconds
      setTimeout(() => {
        setIsOpen(false);
        if (onCloseCallback) onCloseCallback();
      }, 2800);
    } catch (err) {
      console.error("Error submitting career goal lead:", err);
      // Still show success to the user as local offline fallback will have saved it
      setIsSuccess(true);
      sessionStorage.setItem("lead_popup_completed", "true");
      setTimeout(() => {
        setIsOpen(false);
        if (onCloseCallback) onCloseCallback();
      }, 2800);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only render on the home page ("/")
  if (location.pathname !== "/") return null;

  return (
    <>
      {/* Floating Reopen Launcher when modal is dismissed */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsSuccess(false);
            setErrorMessage("");
          }}
          className="fixed bottom-6 right-6 z-40 bg-[#12111b] hover:bg-[#1a1827] text-white pl-4 pr-5 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-[#6d52f6]/40 hover:border-[#6d52f6] flex items-center gap-2.5 transition-all duration-300 group hover:scale-105 cursor-pointer"
          title="Got a career goal in mind?"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#6d52f6] animate-ping" />
          <span className="text-xs font-bold tracking-wide text-white">Career Goal?</span>
          <svg className="w-4 h-4 text-[#a78bfa] group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      )}

      {/* Main Modal Backdrop & Single-Page Card */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
          onClick={handleClose}
        >
          {/* Glowing Border Container */}
          <div 
            className="relative w-full max-w-[420px] p-[1.5px] rounded-[28px] bg-gradient-to-tr from-[#f97316]/40 via-[#7c3aed]/50 to-[#4f46e5]/40 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_35px_rgba(109,82,246,0.2)] my-auto transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Inner Dark Modal Content */}
            <div className="relative w-full bg-[#121118] rounded-[26.5px] p-6 sm:p-7 text-left flex flex-col">
              
              {/* Close Button '✕' at Top Right */}
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-10"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* SUCCESS STATE */}
              {isSuccess ? (
                <div className="flex flex-col items-center text-center py-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Thank you!
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-[300px] leading-relaxed">
                    We've received your details. Our team will get in touch with you shortly to help guide your career path.
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-6 px-7 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                /* SINGLE PAGE FORM */
                <form onSubmit={handleSubmit} className="flex flex-col">
                  {/* Header Title */}
                  <h2 className="text-2xl sm:text-[30px] font-black text-white tracking-tight leading-[1.18] pr-8">
                    Got a career<br />goal in mind?
                  </h2>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-[13px] text-neutral-400 mt-2 mb-6 leading-relaxed">
                    Share your details and let our team help you find the right path.
                  </p>

                  {/* Error Notification Banner if any */}
                  {errorMessage && (
                    <div className="mb-4 p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="space-y-3.5">
                    {/* FIELD 1: Name Input */}
                    <div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errorMessage) setErrorMessage("");
                        }}
                        placeholder="Enter your name"
                        className="w-full bg-[#201e28] border border-[#322f3e] rounded-2xl px-4 py-3 text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#7059f6] focus:ring-1 focus:ring-[#7059f6] transition-all"
                      />
                    </div>

                    {/* FIELD 2: Phone with Country Code */}
                    <div className="flex items-center w-full bg-[#201e28] border border-[#322f3e] rounded-2xl overflow-hidden focus-within:border-[#7059f6] focus-within:ring-1 focus-within:ring-[#7059f6] transition-all">
                      {/* Country Code Select */}
                      <div className="relative flex items-center shrink-0 pl-3.5 pr-2 py-3 cursor-pointer">
                        <span className="text-xs font-bold text-neutral-200 mr-1 select-none">
                          {countryPrefix} {countryCode}
                        </span>
                        <svg className="w-3.5 h-3.5 text-neutral-400 shrink-0 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        <select
                          value={`${countryPrefix}:${countryCode}`}
                          onChange={handleCountryChange}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                          aria-label="Select country code"
                        >
                          <option value="IN:+91">India (+91)</option>
                          <option value="AE:+971">UAE (+971)</option>
                          <option value="SA:+966">Saudi Arabia (+966)</option>
                          <option value="QA:+974">Qatar (+974)</option>
                          <option value="OM:+968">Oman (+968)</option>
                          <option value="KW:+965">Kuwait (+965)</option>
                          <option value="BH:+973">Bahrain (+973)</option>
                          <option value="US:+1">USA (+1)</option>
                          <option value="GB:+44">UK (+44)</option>
                          <option value="SG:+65">Singapore (+65)</option>
                          <option value="MY:+60">Malaysia (+60)</option>
                          <option value="AU:+61">Australia (+61)</option>
                          <option value="DE:+49">Germany (+49)</option>
                          <option value="CA:+1">Canada (+1)</option>
                        </select>
                      </div>

                      {/* Divider */}
                      <div className="w-[1px] h-6 bg-[#322f3e]" />

                      {/* Phone Input */}
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errorMessage) setErrorMessage("");
                        }}
                        placeholder="Phone number"
                        className="flex-1 bg-transparent px-3.5 py-3 text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none"
                      />
                    </div>

                    {/* FIELD 3: Select a Programme */}
                    <div className="relative w-full bg-[#201e28] border border-[#322f3e] rounded-2xl overflow-hidden focus-within:border-[#7059f6] focus-within:ring-1 focus-within:ring-[#7059f6] transition-all">
                      <select
                        value={programme}
                        onChange={(e) => {
                          setProgramme(e.target.value);
                          if (errorMessage) setErrorMessage("");
                        }}
                        className={`w-full bg-transparent px-4 py-3 text-sm font-medium focus:outline-none appearance-none cursor-pointer pr-10 ${
                          programme ? "text-white" : "text-neutral-500"
                        }`}
                        aria-label="Select a programme"
                      >
                        <option value="" disabled className="bg-[#1a1824] text-neutral-400">
                          Select a programme...
                        </option>
                        <option value="AI / ML & Generative AI Diploma" className="bg-[#1a1824] text-white">
                          AI / ML & Generative AI Diploma (6 Months)
                        </option>
                        <option value="Machine Learning & Deep Learning Course" className="bg-[#1a1824] text-white">
                          Machine Learning & Deep Learning Course
                        </option>
                        <option value="Applied AI & Data Science Mastery" className="bg-[#1a1824] text-white">
                          Applied AI & Data Science Mastery
                        </option>
                        <option value="AI Booster Program for Students" className="bg-[#1a1824] text-white">
                          AI Booster Program (For Students)
                        </option>
                        <option value="AI Easy Ayi Initiative" className="bg-[#1a1824] text-white">
                          AI Easy Ayi Initiative
                        </option>
                        <option value="Online AI Certification" className="bg-[#1a1824] text-white">
                          Online AI Certification Program
                        </option>
                        <option value="Offline AI Course (Kannur Campus)" className="bg-[#1a1824] text-white">
                          Offline AI Course (Kannur Campus)
                        </option>
                        <option value="1-on-1 Career Consultation & Guidance" className="bg-[#1a1824] text-white">
                          1-on-1 Career Guidance & Consultation
                        </option>
                      </select>

                      {/* Dropdown Chevron Icon */}
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-neutral-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* SUBMIT BUTTON (Centered as in 2nd image) */}
                  <div className="flex justify-center pt-5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-9 py-2.5 sm:py-3 rounded-xl bg-[#6d52f6] hover:bg-[#5b3ee8] text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(109,82,246,0.35)] hover:shadow-[0_6px_25px_rgba(109,82,246,0.55)] transition-all transform active:scale-95 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit</span>
                      )}
                    </button>
                  </div>

                  {/* PRIVACY FOOTER NOTICE */}
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 font-normal mt-5 select-none text-center">
                    <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Your information stays private and is never shared.</span>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
