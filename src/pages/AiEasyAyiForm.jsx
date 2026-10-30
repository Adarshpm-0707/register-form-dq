import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import {
  saveAiEasyAyiRegistration,
  updateAiEasyAyiRegistration,
} from "../services/dbService";
import LimitedSeatsSection from "../components/LimitedSeatsSection";
import { useSeatsCountdown } from "../hooks/useSeatsCountdown";
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
 * Target batch date: November 7th at 5:00 PM (17:00).
 */
const getNextSaturday5PM = () => {
  const currentYear = new Date().getFullYear();
  const target = new Date(currentYear, 10, 7, 17, 0, 0, 0); // Month 10 = November
  if (target.getTime() <= Date.now()) {
    target.setFullYear(currentYear + 1);
  }
  return target;
};

const getNextSaturdayFormatted = () => {
  const nextSat = getNextSaturday5PM();
  const year = nextSat.getFullYear();
  return `7th November, ${year}`;
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

const PERSPECTIVE_SHIFTS = [
  {
    myth: "“Working 12–14 hours every day is proof of dedication.”",
    truth: "It's a structural bottleneck. 80% of routine office chores can be automated in seconds with modern AI tools.",
  },
  {
    myth: "“AI will replace human jobs, so I should be worried.”",
    truth: "AI won't replace you. But a professional who leverages AI effectively will inevitably replace someone who ignores it.",
  },
  {
    myth: "“I need a technical or programming background to use AI.”",
    truth: "Modern generative AI requires zero coding. If you can type a message on WhatsApp, you have all the technical skill required.",
  },
  {
    myth: "“I tested ChatGPT before and the responses felt too generic.”",
    truth: "Generic inputs produce generic outputs. Once you learn structured prompt frameworks, you get boardroom-ready results every time.",
  },
];

const ROADMAP_STEPS = [
  {
    step: "Step 1",
    icon: (
      <svg className="w-6 h-6 text-[#c6ff34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    title: "Secure Your ₹99 Pass",
    desc: "Complete registration in 30 seconds. Instant pass confirmation and bonus access delivered straight to your inbox.",
    highlight: "Instant Confirmation",
  },
  {
    step: "Step 2",
    icon: (
      <svg className="w-6 h-6 text-[#c6ff34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Attend Live Masterclass",
    desc: "Join live this Saturday on Zoom (5:00 PM – 7:00 PM IST). 2 hours of direct screen-share walkthroughs in Malayalam & English.",
    highlight: "Live Demonstrations",
  },
  {
    step: "Step 3",
    icon: (
      <svg className="w-6 h-6 text-[#c6ff34]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    ),
    title: "Save 15+ Hours Weekly",
    desc: "Walk away with ready-to-use prompt templates, workflow automations, and immediate 10x speed in your daily routine.",
    highlight: "Permanent Action Plan",
  },
];

const WORKSHOP_OUTCOMES = [
  {
    badge: "OUTCOME 1",
    title: "Master Structured Prompt Engineering",
    description: "Stop getting generic, robotic answers. Learn role-task-context frameworks (RTF & CoT) that produce boardroom-ready documents, emails, and client proposals in seconds.",
    tag: "Prompting Mastery",
  },
  {
    badge: "OUTCOME 2",
    title: "10x Daily Workplace & Office Productivity",
    description: "Summarize 60-page PDF reports in under 30 seconds, draft executive correspondence, generate meeting minutes, and eliminate hours of mundane typing.",
    tag: "Save 15+ Hrs/Week",
  },
  {
    badge: "OUTCOME 3",
    title: "Smart Spreadsheets & Data Analysis Without Formulas",
    description: "Analyze complex Excel/CSV files, generate complex formulas automatically, find hidden trends, and build visual dashboards without learning advanced formulas.",
    tag: "Excel & Data AI",
  },
  {
    badge: "OUTCOME 4",
    title: "High-Converting Content Creation & Design",
    description: "Create compelling marketing copy, social media posts, visual banners, video scripts, and professional presentation decks in minutes using generative tools.",
    tag: "Creative Workflows",
  },
  {
    badge: "OUTCOME 5",
    title: "Automate Repetitive Daily Tasks on Autopilot",
    description: "Connect AI tools with your daily apps (WhatsApp, Gmail, Google Sheets) using simple no-code workflows that run quietly in the background.",
    tag: "No-Code Automations",
  },
];


const AUDIENCE_LIST = [
  {
    icon: (
      <svg className="w-6 h-6 text-[#c6ff34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    role: "Working Professionals & Corporate Employees",
    benefit: "Eliminate repetitive tasks, draft complex emails in seconds, and prepare executive presentations faster.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#c6ff34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
      </svg>
    ),
    role: "College Students & Fresh Graduates",
    benefit: "Build a massive competitive edge for job interviews, placements, resume optimization, and academic research.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#c6ff34]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    ),
    role: "Freelancers, Creators & Solopreneurs",
    benefit: "Deliver client projects in half the time, create marketing assets, and scale your personal service offerings.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#c6ff34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    role: "Business Owners & Founders",
    benefit: "Automate daily inquiries, analyze sales trends, and standardize team SOPs without costly software subscriptions.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Do I need any coding, programming, or technical background?",
    a: "None at all! AI easy Ayi is engineered from the ground up for 100% beginners. If you can type a message on WhatsApp or search on Google, you have all the technical skills needed to master modern generative AI tools.",
  },
  {
    q: "In which language will the masterclass be delivered?",
    a: "The class is conducted in simple, clear Malayalam with English terminology. All instructions, tool walkthroughs, and prompt explanations are presented in conversational language so everyone can follow along effortlessly.",
  },
  {
    q: "Why is the masterclass priced at only ₹99/-?",
    a: "Our mission at DeepStaq Academy is democratizing AI literacy across Kerala. The ₹99 is not about revenue—it serves as a commitment token so registered seats are occupied by dedicated learners who will show up live and implement.",
  },
  {
    q: "Which specific AI tools and platforms will be taught?",
    a: "We cover the industry's most impactful productivity tools: ChatGPT 4o, Claude 3.5 Sonnet, Google Gemini, Perplexity AI for rapid research, Gamma / Canva AI for instant presentations, and Make.com for automated workflows.",
  },
  {
    q: "What if I am unable to attend live on Saturday from 5:00 PM to 7:00 PM?",
    a: "We strongly recommend attending live to participate in interactive Q&As. However, all registered candidates receive our detailed session summary, prompt templates, and step-by-step implementation blueprint in their inbox.",
  },
  {
    q: "What is your refund policy?",
    a: "We offer a 100% no-questions-asked refund guarantee. If you attend the 2-hour masterclass and feel it didn't give you practical clarity to save hours each week, simply email info@deepstaq.in and your ₹99 will be refunded promptly.",
  },
];

export default function AiEasyAyiForm() {
  const navigate = useNavigate();
  const formRef = useRef(null);

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
  const [isFormHighlighted, setIsFormHighlighted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const seatsLeft = useSeatsCountdown(10, 3);

  // Live countdown timer state (resets dynamically every Saturday at 5:00 PM)
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  const eventDateFormatted = getNextSaturdayFormatted();

  const handleExplorePrograms = (path = "/programs") => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(path);
  };

  const generateReceiptPDF = () => {
    if (!submittedData) return;
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // 1. Accent Top Banner
      doc.setFillColor(250, 0, 88);
      doc.rect(0, 0, 210, 6, "F");

      // 2. Brand Header
      try {
        doc.addImage(logo, "PNG", 20, 16, 16, 16);
      } catch (e) {
        doc.setTextColor(29, 0, 88);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("DEEPSTAQ", 20, 26);
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(20, 25, 45);
      doc.text("DEEPSTAQ ACADEMY", 40, 23);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 105, 120);
      doc.text("AI & Machine Learning Institute • https://deepstaq.in", 40, 28);

      // Receipt Top Right Info
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(250, 0, 88);
      doc.text("WORKSHOP PASS & RECEIPT", 190, 21, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 105, 120);
      doc.text(`Receipt No: ${submittedData.id || "AYI-REG"}`, 190, 27, { align: "right" });
      doc.text(`Issue Date: ${new Date().toLocaleDateString("en-IN")}`, 190, 32, { align: "right" });

      // Divider line
      doc.setDrawColor(230, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(20, 38, 190, 38);

      // 3. Status Banner
      doc.setFillColor(235, 253, 243);
      doc.roundedRect(20, 44, 170, 12, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(16, 120, 64);
      doc.text("STATUS: PAYMENT CONFIRMED & SEAT RESERVED (PAID INR 99.00)", 25, 51.5);

      // 4. Registration Details Box
      doc.setDrawColor(220, 224, 235);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(20, 62, 170, 98, 3, 3, "D");

      doc.setFillColor(247, 248, 252);
      doc.roundedRect(20.5, 62.5, 169, 12, 3, 3, "F");
      doc.rect(20.5, 68.5, 169, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(60, 65, 80);
      doc.text("PARTICIPANT & WORKSHOP DETAILS", 26, 70);

      const fields = [
        { label: "Participant Name", value: submittedData.fullName || "Participant" },
        { label: "Contact Phone", value: `+91 ${submittedData.phone || ""}` },
        { label: "Place / District", value: submittedData.place || "Kerala, India" },
        { label: "Background / Role", value: submittedData.qualification || "Working Professional" },
        { label: "Program", value: "AI Easy Ayi (2 Hrs Online Masterclass)" },
        { label: "Class Schedule", value: `${eventDateFormatted} • 5:00 PM – 7:00 PM IST` },
        { label: "Delivery Mode", value: "Online Live via Zoom (Interactive)" },
        { label: "Reference ID", value: submittedData.id || "AYI-REG" },
        { label: "Transaction / Payment ID", value: submittedData.paymentId || "Razorpay Confirmed" },
        { label: "Total Amount Paid", value: "INR 99.00 (Inclusive of All Taxes)" },
      ];

      let fieldY = 81;
      fields.forEach((field, index) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(110, 115, 130);
        doc.text(field.label, 26, fieldY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(20, 25, 40);
        doc.text(String(field.value), 82, fieldY);

        if (index < fields.length - 1) {
          doc.setDrawColor(242, 244, 248);
          doc.setLineWidth(0.3);
          doc.line(26, fieldY + 3, 184, fieldY + 3);
        }
        fieldY += 7.5;
      });

      // 5. Next Steps Box
      doc.setDrawColor(230, 235, 245);
      doc.setFillColor(249, 250, 254);
      doc.roundedRect(20, 168, 170, 48, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(250, 0, 88);
      doc.text("IMPORTANT INSTRUCTIONS FOR PARTICIPANTS:", 26, 176);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(60, 65, 80);
      doc.text("1. Join the Official WhatsApp Community immediately for meeting links and session materials.", 26, 183);
      doc.text("2. Zoom link and login guidelines will be posted in the community before the session.", 26, 189);
      doc.text("3. Keep a laptop or smartphone with internet connection ready for interactive activities.", 26, 195);
      doc.text("4. Prompt cheat sheets and reference guides will be distributed directly after the class.", 26, 201);
      doc.text("5. For any support or inquiries, contact +91 9495957011 or email admissions@deepstaq.in.", 26, 207);

      // 6. Footer
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(140, 145, 160);
      doc.text("Authorized Computer-Generated Receipt • No Signature Required • DeepStaq Academy", 105, 258, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(160, 165, 180);
      doc.text("DeepStaq Academy, Kannur & Kochi, Kerala | Support: +91 9495957011 | https://deepstaq.in", 105, 263, { align: "center" });

      doc.save(`DeepStaq_Receipt_${submittedData.id || "AI_Easy_Ayi"}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF receipt:", err);
      window.print();
    }
  };

  const handleDownloadReceipt = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      generateReceiptPDF();
      setIsGeneratingPdf(false);
    }, 200);
  };

  // Meta Pixel PageView tracking
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 480) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const handleScrollToForm = () => {
    setShowForm(true);
    setIsFormHighlighted(true);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        const input = formRef.current.querySelector('input[name="fullName"]');
        if (input) {
          setTimeout(() => {
            input.focus();
          }, 300);
        }
      }
    }, 100);
    setTimeout(() => {
      setIsFormHighlighted(false);
    }, 2200);
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

      // Meta Pixel Lead tracking
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq("track", "Lead", {
          content_name: "AI Easy Ayi Registration",
          value: 99,
          currency: "INR",
        });
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

            // Meta Pixel Purchase tracking
            if (typeof window !== "undefined" && typeof window.fbq === "function") {
              window.fbq("track", "Purchase", {
                content_name: "AI Easy Ayi Live Workshop",
                value: 99,
                currency: "INR",
              });
            }
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

            // Meta Pixel Purchase tracking fallback
            if (typeof window !== "undefined" && typeof window.fbq === "function") {
              window.fbq("track", "Purchase", {
                content_name: "AI Easy Ayi Live Workshop",
                value: 99,
                currency: "INR",
              });
            }
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
    <div className="min-h-screen bg-[#090D11] text-white selection:bg-[#c6ff34] selection:text-[#090D11] font-sans relative overflow-x-hidden pt-32 sm:pt-36 md:pt-40 lg:pt-44 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8">
      
      {/* Background Subtle Tech Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#c6ff34]/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/4 -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[260px] sm:w-[420px] h-[260px] sm:h-[420px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none translate-y-1/3 -translate-x-1/4 -z-10" />

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto relative z-10">

        {/* 1. SUCCESS RECEIPT (Displays after payment) */}
        <AnimatePresence>
          {submittedData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto bg-[#0D1318]/90 border border-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl mb-12 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c6ff34] to-transparent" />
              
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#c6ff34] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl sm:text-3xl font-black text-[#090D11] shadow-[0_0_25px_rgba(198,255,52,0.5)]">
                ✓
              </div>
              
              <span className="inline-block px-3 py-1 bg-[#c6ff34]/15 text-[#c6ff34] border border-[#c6ff34]/30 text-[10px] font-mono font-black uppercase tracking-wider rounded-full mb-3">
                REGISTRATION CONFIRMED • PASS ACTIVE
              </span>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                Welcome to AI easy Ayi!
              </h2>
              
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-md mx-auto font-medium">
                Thank you <strong className="text-white">{submittedData.fullName}</strong>. Your workshop seat has been reserved successfully.
              </p>

              {/* Receipt Info Card */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 my-5 sm:my-6 text-left space-y-2 text-xs font-mono">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 border-b border-white/10 pb-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px] sm:text-xs">Reference ID:</span>
                  <span className="font-bold text-[#c6ff34]">{submittedData.id}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 border-b border-white/10 pb-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px] sm:text-xs">Payment ID:</span>
                  <span className="font-bold text-emerald-400 truncate max-w-full sm:max-w-[200px]">{submittedData.paymentId || "Confirmed"}</span>
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
                  <span className="font-bold text-[#c6ff34] sm:text-right break-words">{eventDateFormatted} • 5:00 PM – 7:00 PM IST (2 Hrs Online Class)</span>
                </div>
              </div>

              {/* WhatsApp Community CTA */}
              <div className="bg-[#25D366]/10 border border-[#25D366]/40 rounded-2xl p-4 mb-4">
                <p className="text-xs text-white font-bold mb-3">
                  Join the official candidate community for meeting links, session guides, and bonuses:
                </p>
                <a
                  href="https://chat.whatsapp.com/KxVV7ep74TV0GHy5SU2FXl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-between shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
                    </svg>
                    <span>Join Official WhatsApp Community</span>
                  </div>
                  <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>

              {/* Download Official PDF Receipt Button */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  disabled={isGeneratingPdf}
                  className="w-full py-3.5 px-5 bg-white/[0.05] hover:bg-white/[0.10] border border-white/20 hover:border-[#c6ff34]/50 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all shadow-lg hover:shadow-[0_0_25px_rgba(198,255,52,0.2)] cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    {isGeneratingPdf ? (
                      <div className="w-4 h-4 border-2 border-[#c6ff34] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5 text-[#c6ff34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    <span>{isGeneratingPdf ? "Generating PDF Receipt..." : "Download Official Payment Receipt (PDF)"}</span>
                  </div>
                  <span className="text-base text-[#c6ff34] group-hover:translate-y-0.5 transition-transform">↓</span>
                </button>
              </div>

              {/* Explore Other Programs Section */}
              <div className="pt-5 border-t border-white/10 mb-6 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#c6ff34] uppercase font-bold block">
                      NEXT LEVEL CAREER PATHWAYS
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-white">
                      Explore Other DeepStaq AI Programs
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExplorePrograms("/programs")}
                    className="py-2 px-4 bg-gradient-to-r from-emerald-500 to-[#c6ff34] text-slate-950 font-black text-[11px] uppercase tracking-wider rounded-lg transition-all shadow-[0_0_15px_rgba(198,255,52,0.3)] hover:opacity-95 cursor-pointer shrink-0 self-start sm:self-auto"
                  >
                    View All Programs →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => handleExplorePrograms("/ai-course")}
                    className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-400/40 transition-all cursor-pointer group"
                  >
                    <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase">6-Month Diploma</span>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300">
                      AI & Machine Learning Builder
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                      Python to Agentic AI, RAG & LLMs. Hands-on projects with 100% placement support.
                    </p>
                  </div>

                  <div
                    onClick={() => handleExplorePrograms("/ai-booster-program")}
                    className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-[#c6ff34]/40 transition-all cursor-pointer group"
                  >
                    <span className="text-[9px] font-mono font-bold text-[#c6ff34] uppercase">Fast-Track Cohort</span>
                    <div className="text-xs font-bold text-white group-hover:text-[#c6ff34]">
                      AI Booster Program
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                      Master modern GenAI workflows and automation for business and technical roles.
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Actions */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
                <a
                  href={`https://wa.me/918075727195?text=${encodeURIComponent(
                    `Hi DeepStaq! I registered and paid ₹99 for AI easy Ayi (2 Hrs Online Class, 5:00 PM - 7:00 PM IST). Name: ${submittedData.fullName} (Ref: ${submittedData.id}, Payment ID: ${submittedData.paymentId || "N/A"})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
                  </svg>
                  <span>Chat Support</span>
                </a>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  Register Another Candidate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. THE MAIN RESPONSIVE INTERFACE */}
        {!submittedData && (
          <>
            <div className="max-w-3xl mx-auto space-y-8 mb-16 pt-3 sm:pt-6">
            
            {/* Headline, Program Narrative & Live Schedule Card */}
            <div className="space-y-6">
              {/* Bold Fluid Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-black text-white leading-[1.12] tracking-tight uppercase break-words"
              >
                The Way You Work Without AI Is Holding You Back.
              </motion.h1>

              {/* Body narrative with fluid scaling */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4 text-sm sm:text-base lg:text-base xl:text-lg text-slate-300 font-medium leading-relaxed"
              >
                <p>
                  Spending hours on repetitive tasks? Struggling with emails, research, spreadsheets, content creation, and daily office workflows? That’s not a lack of effort; that’s working without modern AI tools.
                </p>
                <p>
                  In this live 2-hour online class (5:00 PM – 7:00 PM IST), discover how tools like ChatGPT, Claude, Gemini, and intelligent automation can save you 15+ hours every week.
                </p>
              </motion.div>

              {/* Live Event Specs & Countdown Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-[#0D1318]/90 border border-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c6ff34] to-transparent" />

                {/* Header & Date Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono font-black tracking-widest uppercase text-slate-400 block">
                      UPCOMING LIVE CLASS
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mt-0.5">
                      Saturday Masterclass
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                    <span className="px-2.5 py-1 rounded-lg bg-[#c6ff34]/15 text-[#c6ff34] border border-[#c6ff34]/30 font-mono font-bold text-xs">
                      {eventDateFormatted}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-200 border border-white/10 font-mono font-bold text-xs">
                      5:00 PM – 7:00 PM IST
                    </span>
                  </div>
                </div>

                {/* Live Countdown Timer */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#c6ff34] animate-ping" />
                      Class Starts In:
                    </span>
                    <span className="text-[#c6ff34] font-black">Limited ₹99 Passes</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center font-mono">
                    <div className="bg-white/[0.04] border border-white/10 py-2 px-1 rounded-xl">
                      <span className="text-base sm:text-lg md:text-xl font-black text-white block leading-none">
                        {timeLeft.days}
                      </span>
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-1">
                        Days
                      </span>
                    </div>
                    <div className="bg-white/[0.04] border border-white/10 py-2 px-1 rounded-xl">
                      <span className="text-base sm:text-lg md:text-xl font-black text-white block leading-none">
                        {timeLeft.hours}
                      </span>
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-1">
                        Hours
                      </span>
                    </div>
                    <div className="bg-white/[0.04] border border-white/10 py-2 px-1 rounded-xl">
                      <span className="text-base sm:text-lg md:text-xl font-black text-white block leading-none">
                        {timeLeft.minutes}
                      </span>
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-1">
                        Mins
                      </span>
                    </div>
                    <div className="bg-white/[0.04] border border-white/10 py-2 px-1 rounded-xl">
                      <span className="text-base sm:text-lg md:text-xl font-black text-[#c6ff34] block leading-none">
                        {timeLeft.seconds}
                      </span>
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-1">
                        Secs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price specs row */}
                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span className="text-slate-400">Regular: <del className="text-red-400">₹899</del></span>
                  <span className="text-[#090D11] font-black bg-[#c6ff34] px-3 py-1 rounded-full shadow-[0_0_15px_rgba(198,255,52,0.4)]">
                    Special: ₹99/- Only
                  </span>
                </div>

                {/* Register CTA Button */}
                <div className="pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleScrollToForm}
                    className="w-full py-3.5 sm:py-4 px-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider bg-[#c6ff34] hover:bg-[#b8f526] text-[#090D11] shadow-[0_0_25px_rgba(198,255,52,0.4)] active:translate-y-0.5 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <span>{showForm ? "Proceed to Registration Form Below ↓" : "Register Now for ₹99/- →"}</span>
                  </button>
                  <p className="text-[10px] sm:text-[11px] text-center text-slate-400 font-mono mt-2 flex items-center justify-center gap-1.5 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c6ff34] animate-ping inline-block" />
                    <span>
                      {showForm
                        ? "Form is open below • Fill details to reserve seat"
                        : "Instant Confirmation • Click to Open Registration Form"}
                    </span>
                  </p>
                </div>
              </motion.div>

            </div>

            {/* THE REGISTRATION FORM SECTION */}
            <AnimatePresence>
              {showForm && (
                <div className="relative scroll-mt-6 sm:scroll-mt-10 pt-4" ref={formRef} id="registration-form">
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.98 }}
                    transition={{ duration: 0.35 }}
                    className={`bg-[#0D1318]/95 border border-white/15 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl relative transition-all duration-300 ${
                      isFormHighlighted
                        ? "ring-2 ring-[#c6ff34] shadow-[0_0_35px_rgba(198,255,52,0.4)] scale-[1.01]"
                        : ""
                    }`}
                  >
                    {/* Form Header with Close Button */}
                    <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#c6ff34] flex-shrink-0 animate-pulse shadow-[0_0_8px_#c6ff34]" />
                        <span className="text-[11px] sm:text-xs font-mono font-black uppercase text-white tracking-wider truncate">
                          AI easy Ayi • Registration Form
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-[#c6ff34]/20 text-[#c6ff34] border border-[#c6ff34]/40 flex-shrink-0">
                          ₹99 PASS
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          title="Hide form"
                          className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>✕</span>
                          <span className="hidden sm:inline text-[10px]">Close</span>
                        </button>
                      </div>
                    </div>

                    {/* Session Reminder Pill Banner */}
                    <div className="bg-white/[0.04] border border-white/10 text-white p-3 rounded-xl mb-4 sm:mb-5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <svg className="w-4 h-4 text-[#c6ff34] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#c6ff34] truncate">
                            2 Hrs Online Class • Live Interactive
                          </p>
                          <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono truncate">
                            {eventDateFormatted} • 5:00 PM – 7:00 PM IST
                          </p>
                        </div>
                      </div>
                      <span className="bg-[#c6ff34] text-[#090D11] text-[10px] font-mono font-black px-2 py-0.5 rounded-md flex-shrink-0">
                        LIVE
                      </span>
                    </div>

                    {/* Error Banner */}
                    {submitError && (
                      <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-xl mb-4 text-red-300 text-xs font-bold flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{submitError}</span>
                      </div>
                    )}

                    {/* Payment Notice / Warning */}
                    {paymentNotice && (
                      <div className={`p-3 rounded-xl mb-4 text-xs font-bold border ${
                        paymentNotice.type === "warning"
                          ? "bg-amber-950/40 border-amber-500/50 text-amber-200"
                          : "bg-red-950/40 border-red-500/50 text-red-200"
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
                        <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">
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
                              ? "border-red-500 bg-red-950/30"
                              : "border-white/15 bg-white/[0.04] focus:border-[#c6ff34] focus:ring-2 focus:ring-[#c6ff34]/20"
                          }`}
                        />
                        {errors.fullName && (
                          <p className="text-[11px] font-bold text-red-400 font-mono mt-0.5">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      {/* 2. Phone Number */}
                      <div className="space-y-1">
                        <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">
                          Phone Number <span className="text-[#c6ff34]">*</span>
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-white/15 bg-white/10 text-[#c6ff34] font-mono font-black text-xs sm:text-sm select-none flex-shrink-0">
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
                                ? "border-red-500 bg-red-950/30"
                                : "border-white/15 bg-white/[0.04] focus:border-[#c6ff34] focus:ring-2 focus:ring-[#c6ff34]/20"
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-[11px] font-bold text-red-400 font-mono mt-0.5">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* 3. Place */}
                      <div className="space-y-1">
                        <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">
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
                              ? "border-red-500 bg-red-950/30"
                              : "border-white/15 bg-white/[0.04] focus:border-[#c6ff34] focus:ring-2 focus:ring-[#c6ff34]/20"
                          }`}
                        />
                        {errors.place && (
                          <p className="text-[11px] font-bold text-red-400 font-mono mt-0.5">
                            {errors.place}
                          </p>
                        )}
                      </div>

                      {/* 4. Qualification */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">
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
                                    : "bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 border-white/10 hover:border-white/20"
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
                              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-white font-medium text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#c6ff34]"
                            />
                            {errors.customQualification && (
                              <p className="text-[11px] font-bold text-red-400 mt-1 font-mono">
                                {errors.customQualification}
                              </p>
                            )}
                          </motion.div>
                        )}

                        {errors.qualification && (
                          <p className="text-[11px] font-bold text-red-400 font-mono mt-0.5">
                            {errors.qualification}
                          </p>
                        )}
                      </div>

                      {/* Submission & Payment Button */}
                      <div className="pt-2 space-y-3">
                        <LimitedSeatsSection seatsLeft={seatsLeft} lang="en" variant="form" />

                        <button
                          type="submit"
                          disabled={loading}
                          className={`w-full py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between sm:justify-center gap-2 sm:gap-3 ${
                            loading
                              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                              : "bg-[#c6ff34] hover:bg-[#b8f526] text-[#090D11] shadow-[0_0_25px_rgba(198,255,52,0.4)] active:translate-y-0.5 duration-150"
                          }`}
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-[#090D11] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                              <span className="truncate">
                                {loadingStep === "saving"
                                  ? "Saving..."
                                  : loadingStep === "gateway"
                                  ? "Razorpay..."
                                  : loadingStep === "verifying"
                                  ? "Verifying..."
                                  : "Processing ₹99..."}
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
                        <p className="text-center text-[10px] sm:text-[11px] font-mono font-bold text-slate-400 mt-2">
                          Pass includes full access to 2 Hrs Online Class • 5:00 PM – 7:00 PM IST
                        </p>
                      </div>

                    </form>

                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>

            {/* ========================================================= */}
            {/* 1. SOCIAL PROOF & KEY METRICS BAR */}
            {/* ========================================================= */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto mb-16 sm:mb-20"
            >
              <div className="bg-[#0D1318]/90 border border-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div className="space-y-1 border-r-0 sm:border-r border-white/10 last:border-r-0">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white block tracking-tight">
                    12,500+
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-300 block">
                    Learners Trained
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Across Kerala & Beyond
                  </span>
                </div>

                <div className="space-y-1 border-r-0 lg:border-r border-white/10">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black text-[#c6ff34] block tracking-tight">
                    15+ Hours
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-300 block">
                    Saved Per Week
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Average Productivity Boost
                  </span>
                </div>

                <div className="space-y-1 border-r-0 sm:border-r border-white/10">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                      4.98
                    </span>
                    <span className="text-amber-400 text-lg sm:text-xl">★</span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-300 block">
                    Live Workshop Rating
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    2,800+ Verified Reviews
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-400 block tracking-tight">
                    100%
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-300 block">
                    No-Code Pedagogy
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Malayalam & English
                  </span>
                </div>
              </div>

              {/* Tools Ticker Banner */}
              <div className="mt-4 p-3 sm:p-4 bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono font-bold text-slate-300">
                <span className="text-[#c6ff34] uppercase tracking-wider text-[11px] sm:text-xs">
                  Tools Mastered:
                </span>
                <span className="flex items-center gap-1">✦ ChatGPT 4o</span>
                <span className="flex items-center gap-1">✦ Claude 3.5 Sonnet</span>
                <span className="flex items-center gap-1">✦ Google Gemini</span>
                <span className="flex items-center gap-1">✦ Perplexity AI</span>
                <span className="flex items-center gap-1">✦ Make.com</span>
                <span className="flex items-center gap-1">✦ Midjourney</span>
              </div>
            </motion.section>

            {/* ========================================================= */}
            {/* 2. PERSPECTIVE SHIFTS / HARD TRUTHS */}
            {/* ========================================================= */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto mb-16 sm:mb-20 space-y-6"
            >
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#c6ff34]/10 text-[#c6ff34] border border-[#c6ff34]/30 text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest">
                  HONEST PERSPECTIVE SHIFTS
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                  Nobody Is Going to Tell You This. <br className="hidden sm:inline" />
                  So We Will.
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm md:text-base font-medium">
                  The old manual habits are holding you back. Here is the modern reality.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {PERSPECTIVE_SHIFTS.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0D1318]/90 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="inline-block px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 font-mono text-[10px] font-black uppercase tracking-wider mb-2">
                        Common Misconception
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-slate-200 italic">
                        {item.myth}
                      </h4>
                    </div>

                    <div className="pt-3 border-t border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-black text-[#c6ff34] uppercase">
                        <span>→ The Reality</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-300 leading-relaxed">
                        {item.truth}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fixable Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#c6ff34]/15 border border-[#c6ff34]/40 text-center space-y-1">
                <p className="text-xs sm:text-sm md:text-base font-black uppercase text-[#c6ff34] tracking-wide">
                  The Good News: Every Single One of These Bottlenecks Is 100% Solvable in 2 Hours.
                </p>
              </div>
            </motion.section>

            {/* ========================================================= */}
            {/* 3. HOW IT WORKS (3-STEP ROADMAP) */}
            {/* ========================================================= */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto mb-16 sm:mb-20 space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#c6ff34]/10 text-[#c6ff34] border border-[#c6ff34]/30 text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest">
                  SIMPLE 3-STEP JOURNEY
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                  How The Masterclass Works
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm md:text-base font-medium">
                  Register, attend live, and start saving hours immediately. No pre-work or complex setup required.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ROADMAP_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0D1318]/90 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4 relative"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-lg bg-[#c6ff34]/15 text-[#c6ff34] border border-[#c6ff34]/30 font-mono font-black text-xs uppercase tracking-wider">
                          {step.step}
                        </span>
                        <span className="text-2xl">{step.icon}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#c6ff34]">
                      <span>✓ {step.highlight}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Inline Action Callout */}
              <div className="bg-[#0D1318]/90 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-base sm:text-lg font-black uppercase text-[#c6ff34] tracking-tight">
                    Ready to Save 15+ Hours Every Week?
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">
                    Limited seats available for this Saturday's live cohort (5:00 PM – 7:00 PM IST).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleScrollToForm}
                  className="px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider bg-[#c6ff34] hover:bg-[#b8f526] text-[#090D11] shadow-[0_0_20px_rgba(198,255,52,0.4)] active:translate-y-0.5 transition-all duration-150 flex-shrink-0 cursor-pointer"
                >
                  Register Now for ₹99/- →
                </button>
              </div>
            </motion.section>

            {/* ========================================================= */}
            {/* 4. WORKSHOP OUTCOMES (5 CORE OUTCOMES) */}
            {/* ========================================================= */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto mb-16 sm:mb-20 space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#c6ff34]/10 text-[#c6ff34] border border-[#c6ff34]/30 text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest">
                  PRACTICAL LEARNING OUTCOMES
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                  2 Hours of High-Impact Clarity
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm md:text-base font-medium">
                  What to learn, what to automate, and in what exact order. No boring academic theory.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {WORKSHOP_OUTCOMES.map((outcome, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0D1318]/90 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-black uppercase tracking-wider">
                          {outcome.badge}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {outcome.tag}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-white leading-snug">
                        {outcome.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                        {outcome.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#c6ff34]">
                      <span>✓ Practical screen-share demo</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ========================================================= */}
            {/* 6. WHO THIS WORKSHOP IS FOR & WHO IT'S NOT FOR */}
            {/* ========================================================= */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto mb-16 sm:mb-20 space-y-6"
            >
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#c6ff34]/10 text-[#c6ff34] border border-[#c6ff34]/30 text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest">
                  AUDIENCE PROFILE
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                  This Masterclass Is For You If...
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {AUDIENCE_LIST.map((aud, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0D1318]/90 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl flex items-start gap-3.5"
                  >
                    <span className="text-2xl flex-shrink-0 mt-0.5">{aud.icon}</span>
                    <div className="space-y-1">
                      <h4 className="text-sm sm:text-base font-black text-white">
                        {aud.role}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                        {aud.benefit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Warning Notice: NOT for you if */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs sm:text-sm text-amber-200 font-bold leading-relaxed">
                  <strong>Not For You If:</strong> You are seeking get-rich-quick hacks or passive income illusions. This is 2 hours of direct, practical, workplace-tested workflows to save real time and 10x output.
                </p>
              </div>
            </motion.section>

            {/* ========================================================= */}
            {/* 7. ABOUT DEEPSTAQ ACADEMY & PERSONAL PROMISE */}
            {/* ========================================================= */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto mb-16 sm:mb-20"
            >
              <div className="bg-[#0D1318]/90 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c6ff34] to-transparent" />
                
                <div className="relative z-10 space-y-4 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#c6ff34]/15 text-[#c6ff34] border border-[#c6ff34]/30 text-[10px] font-mono font-black uppercase tracking-wider">
                      OUR COMMITMENT
                    </span>
                    <span className="text-slate-400 font-mono text-xs">• DeepStaq Academy</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-white tracking-tight leading-snug">
                    AI Is Not Just for Techies. <br />
                    It’s The New Universal Literacy.
                  </h3>

                  <div className="space-y-3 text-xs sm:text-sm md:text-base text-slate-300 font-normal leading-relaxed">
                    <p>
                      DeepStaq Academy was founded with a singular conviction: cutting-edge emerging technologies should be accessible to every ambitious professional, student, and business owner across Kerala, without gatekeeping or technical barriers.
                    </p>
                    <p>
                      We don’t do pre-recorded monologues. Our Saturday live masterclass is interactive, screen-shared, practical, and taught in friendly Malayalam and English.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs sm:text-sm font-black text-[#c6ff34] uppercase tracking-wider">
                        100% No-Risk Money-Back Guarantee
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-400">
                        Attend the 2 hours. If you feel it wasn't worth 10x the ₹99 fee, email us for an instant refund.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleScrollToForm}
                      className="px-5 py-3 rounded-xl bg-[#c6ff34] hover:bg-[#b8f526] text-[#090D11] font-black text-xs uppercase tracking-wider transition-all flex-shrink-0 cursor-pointer shadow-[0_0_20px_rgba(198,255,52,0.4)]"
                    >
                      Reserve My Seat for ₹99 →
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ========================================================= */}
            {/* 8. FAQ ACCORDION */}
            {/* ========================================================= */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto mb-16 sm:mb-20 space-y-6"
            >
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#c6ff34]/10 text-[#c6ff34] border border-[#c6ff34]/30 text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest">
                  GOT QUESTIONS?
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                  Honest Answers to Real Questions
                </h2>
              </div>

              <div className="space-y-3">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-[#0D1318]/90 border border-white/10 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-black text-xs sm:text-sm md:text-base text-white cursor-pointer hover:bg-white/[0.04]"
                      >
                        <span>{item.q}</span>
                        <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-[#c6ff34] flex-shrink-0">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-slate-300 font-medium border-t border-white/10 leading-relaxed bg-white/[0.02]"
                          >
                            <p>{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.section>

            {/* ========================================================= */}
            {/* 9. FINAL DECISION & URGENCY BANNER */}
            {/* ========================================================= */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto mb-16 sm:mb-20 text-center bg-[#0D1318]/90 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl space-y-5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c6ff34] to-transparent" />

              <span className="inline-block px-3 py-1 rounded-full bg-[#c6ff34]/15 text-[#c6ff34] border border-[#c6ff34]/30 text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider">
                SATURDAY LIVE MASTERCLASS • 5:00 PM – 7:00 PM IST
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                You Can Keep Doing Things The Hard Way. <br />
                Or Spend 2 Hours Mastering AI.
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                No boring theory. No fluff. Just the most practical, actionable 2 hours you’ll ever invest into your career and workflow.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleScrollToForm}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider bg-[#c6ff34] hover:bg-[#b8f526] text-[#090D11] shadow-[0_0_25px_rgba(198,255,52,0.4)] active:translate-y-0.5 transition-all duration-150 cursor-pointer"
                >
                  Register Now for ₹99/- Only →
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono font-bold text-slate-400 pt-3 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>100% Secure Payment</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#c6ff34] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  <span>Instant Bonus Access</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>100% Money-Back Guarantee</span>
                </span>
              </div>
            </motion.section>
          </>
        )}

      </div>

      {/* ========================================================= */}
      {/* 10. STICKY BOTTOM QUICK REGISTER BAR (Reveals on scroll) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {!submittedData && showStickyBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 w-full z-40 bg-[#090D11]/95 backdrop-blur-xl border-t border-white/10 py-2.5 sm:py-3 px-3 sm:px-6 shadow-2xl flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c6ff34] animate-ping flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-mono text-[11px] sm:text-xs text-white font-bold block truncate">
                  AI easy Ayi • Saturday (5:00 PM - 7:00 PM IST)
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:block">
                  Limited ₹99 Passes Available
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="text-right hidden xs:block font-mono">
                <del className="text-slate-400 text-[10px] block leading-none">₹899</del>
                <span className="text-[#c6ff34] font-black text-xs sm:text-sm leading-none">₹99</span>
              </div>
              <button
                type="button"
                onClick={handleScrollToForm}
                className="py-2 px-3.5 sm:px-4 rounded-lg sm:rounded-xl font-black text-xs uppercase tracking-wider bg-[#c6ff34] hover:bg-[#b8f526] text-[#090D11] shadow-[0_0_15px_rgba(198,255,52,0.4)] transition-all cursor-pointer active:translate-y-0.5"
              >
                Register for ₹99 →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
