import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  saveAiEasyAyiRegistration,
  updateAiEasyAyiRegistration,
} from "../services/dbService";
import AdVideoSection from "../components/AdVideoSection";
import logo from "../assets/Asset 1@4x.png";

/* ─────────────────────────────────────────────
   BILINGUAL CONTENT DICTIONARY
   (Malayalam default & English)
───────────────────────────────────────────── */
const TRANSLATIONS = {
  ml: {
    // Language Switcher button
    translateBtnLabel: "English",
    translateBtnTooltip: "Translate to English",
    translateSwitchSub: "English-ലേക്ക് മാറ്റുക",
    activeLangLabel: "മലയാളം",

    // Hero Section (Centered Layout)
    heroBadge: "ലൈവ് മാസ്റ്റർക്ലാസ് • ശനിയാഴ്ചകളിൽ",
    heroTitleLine1: "AI ഇനി എല്ലാവർക്കും",
    heroTitleHighlight: "Easy ആയി.",
    heroSubtitle:
      "AI എന്താണെന്ന് ഒട്ടും അറിയില്ലാത്ത ആർക്കും ഏറ്റവും ലളിതമായി മനസ്സിലാക്കാം. മുൻപരിചയമോ സാങ്കേതിക അറിവോ കോഡിങ്ങോ ആവശ്യമില്ല.",
    heroPills: [
      "Zoom വഴി തത്സമയം",
      "സാങ്കേതിക അറിവ് ആവശ്യമില്ല",
      "ലളിതമായ മലയാളത്തിൽ",
    ],
    heroCtaPrimary: "₹99 അടച്ച് സീറ്റ് ഉറപ്പാക്കൂ",
    heroOriginalPrice: "₹899",
    heroCtaSecondary: "WhatsApp വഴി സംസാരിക്കാം",
    nextBatchLabel: "അടുത്ത ബാച്ച്:",
    batchTime: "ശനി വൈകിട്ട് 5:00 – 7:00 IST",
    timerHeading: "രജിസ്റ്റർ ചെയ്യാൻ ഇനി:",
    timerDays: "Days",
    timerHours: "Hours",
    timerMinutes: "Minutes",
    timerSeconds: "Seconds",

    // Highlights Strip (Home theme 4-column)
    highlights: [
      { prefix: "എല്ലാവർക്കും എളുപ്പത്തിൽ", highlight: "തുടങ്ങാം" },
      { prefix: "2 മണിക്കൂർ കൊണ്ട്", highlight: "നേരിട്ട് ചെയ്തു പഠിക്കാം" },
      { prefix: "ലളിതമായ മലയാളത്തിൽ", highlight: "സംശയങ്ങൾക്ക് മറുപടി" },
      { prefix: "സൗജന്യ ബോണസ്", highlight: "സ്റ്റഡി ഗൈഡുകൾ" },
    ],

    // Video Section
    videoHeading: "2 മിനിറ്റ് പ്രിവ്യൂ വീഡിയോ കാണൂ",
    videoSubheading: "ഈ മാസ്റ്റർക്ലാസ്സിൽ എന്തൊക്കെയാണ് നിങ്ങൾ പഠിക്കുന്നതെന്ന് നേരിട്ട് കണ്ട് മനസ്സിലാക്കൂ.",

    // Steps (How it works)
    stepsBadge: "എങ്ങനെ തുടങ്ങാം",
    stepsTitle: "3 ലളിതമായ ഘട്ടങ്ങൾ",
    steps: [
      {
        step: "01",
        title: "₹99 അടച്ച് രജിസ്റ്റർ ചെയ്യൂ",
        desc: "Confirmation ഉം ഔദ്യോഗിക Zoom meeting ലിങ്കും നിങ്ങളുടെ ഫോണിൽ ഉടൻ എത്തും.",
      },
      {
        step: "02",
        title: "നവംബർ 7 ശനിയാഴ്ച Live ജോയിൻ ചെയ്യൂ",
        desc: "ഫോണോ ലാപ്ടോപ്പോ വഴി തത്സമയം ഒപ്പം ചെയ്തു കണ്ട് പരിശീലിക്കാം.",
      },
      {
        step: "03",
        title: "AI ഉപയോഗിച്ച് തുടങ്ങൂ",
        desc: "അന്നുതന്നെ നിങ്ങളുടെ ജോലിയിലും പഠനത്തിലും ദൈനംദിന ജീവിതത്തിലും AI ഉപയോഗിക്കാം.",
      },
    ],

    // Curriculum
    curriculumBadge: "സിലബസ്",
    curriculumTitle: "2 മണിക്കൂറിൽ നിങ്ങൾ പഠിക്കുന്നത്",
    curriculumItems: [
      {
        number: "01",
        title: "AI എന്താണ്? (അടിസ്ഥാനങ്ങൾ)",
        subtitle: "സാങ്കേതിക പദങ്ങളില്ലാതെ ലളിതമായ ഭാഷയിൽ AI യുടെ അടിസ്ഥാനങ്ങൾ മനസ്സിലാക്കാം.",
      },
      {
        number: "02",
        title: "ദൈനംദിന ജീവിതത്തിൽ AI പ്രയോഗിക്കാം",
        subtitle: "പഠനം, ഓഫീസ് ജോലി, ഇമെയിലുകൾ, പ്രസന്റേഷൻ, ട്രാവൽ പ്ലാനിംഗ് എന്നിവയിൽ AI ഉപയോഗിക്കാം.",
      },
      {
        number: "03",
        title: "സുരക്ഷിതമായി സ്മാർട്ടായി ഉപയോഗിക്കാം",
        subtitle: "ഡാറ്റ പ്രൈവസി കാത്തുസൂക്ഷിക്കാനും ഏറ്റവും മികച്ച ഫലങ്ങൾ നേടാനുമുള്ള വഴികൾ.",
      },
    ],

    // Audience
    audienceBadge: "എല്ലാവർക്കും അനുയോജ്യം",
    audienceTitle: "ഇത് ആർക്കൊക്കെ വേണ്ടിയാണ്?",
    audienceSubtitle: "കമ്പ്യൂട്ടറോ സ്മാർട്ട്ഫോണോ ഉപയോഗിക്കാൻ അറിയാവുന്ന ആർക്കും പങ്കെടുക്കാം.",
    audienceTags: [
      { label: "വിദ്യാർത്ഥികൾ", role: "Students" },
      { label: "അധ്യാപകർ", role: "Teachers" },
      { label: "വീട്ടമ്മമാർ", role: "Homemakers" },
      { label: "ജോലിക്കാർ", role: "Working Professionals" },
      { label: "ബിസിനസ്സുകാർ", role: "Entrepreneurs" },
      { label: "മുതിർന്ന പൗരന്മാർ", role: "Senior Citizens" },
    ],

    // Form
    formBadge: "ഡയറക്ട് രജിസ്ട്രേഷൻ",
    formTitle: "നിങ്ങളുടെ വിവരങ്ങൾ നൽകുക",
    formClose: "അടയ്ക്കുക ×",
    formNameLabel: "പൂർണ്ണമായ പേര്",
    formNamePlaceholder: "നിങ്ങളുടെ പേര് നൽകുക",
    formPhoneLabel: "മൊബൈൽ നമ്പർ",
    formPhonePlaceholder: "10 അക്ക മൊബൈൽ നമ്പർ",
    formPlaceLabel: "സ്ഥലം / ജില്ല",
    formPlacePlaceholder: "ഉദാ: കോഴിക്കോട്, കൊച്ചി, കണ്ണൂർ",
    formProfileLabel: "നിങ്ങളുടെ പശ്ചാത്തലം",
    qualificationOptions: [
      { id: "Working Professional", label: "ജോലിക്കാർ" },
      { id: "Student", label: "വിദ്യാർത്ഥി" },
      { id: "Other", label: "മറ്റുള്ളവ" },
    ],
    formCustomPlaceholder: "വിശദമാക്കുക (ഉദാ: വീട്ടമ്മ, അധ്യാപകൻ, ഡോക്ടർ)",
    formSubmitBtn: "₹99 അടച്ച് കൺഫേം ചെയ്യൂ",
    formSubmitHint: "ഔദ്യോഗിക രജിസ്ട്രേഷൻ • 2 മണിക്കൂർ ലൈവ് + സ്റ്റഡി ഗൈഡുകൾ",
    formSaving: "വിവരങ്ങൾ സേവ് ചെയ്യുന്നു...",
    formGateway: "Razorpay തുറക്കുന്നു...",
    formVerifying: "പരിശോധിക്കുന്നു...",

    // FAQ
    faqBadge: "സംശയങ്ങൾ",
    faqTitle: "സാധാരണ സംശയങ്ങൾ (FAQ)",
    faqs: [
      {
        q: "ടെക്നോളജി അറിവ് വേണോ?",
        a: "വേണ്ട. ഏറ്റവും തുടക്കത്തിൽ നിന്നാണ് തുടങ്ങുന്നത്. കമ്പ്യൂട്ടർ സയൻസോ കോഡിങ്ങോ അറിഞ്ഞിരിക്കേണ്ട യാതൊരു ആവശ്യമില്ല. ഒരു സ്മാർട്ട്ഫോൺ ഉപയോഗിക്കാൻ അറിയാവുന്ന ആർക്കും ഈ ക്ലാസ്സിൽ പങ്കെടുക്കാം.",
      },
      {
        q: "ഏത് ഡിവൈസ് ആണ് ക്ലാസ്സിന് വേണ്ടത്?",
        a: "ഇന്റർനെറ്റ് കണക്ഷനുള്ള സാധാരണ സ്മാർട്ട്ഫോൺ അല്ലെങ്കിൽ ലാപ്ടോപ്പ് മതിയാകും.",
      },
      {
        q: "ക്ലാസ്സിന് ശേഷം റെക്കോർഡിംഗോ നോട്ട്സോ ലഭിക്കുമോ?",
        a: "അതെ, ലൈവ് ക്ലാസ്സിന് ശേഷം പ്രായോഗികമായി റഫർ ചെയ്യാനുള്ള പ്രധാന പോയിന്റുകളും സ്റ്റെപ്പ്-ബൈ-സ്റ്റെപ്പ് ഗൈഡും നിങ്ങൾക്ക് ലഭിക്കുന്നതാണ്.",
      },
      {
        q: "ക്ലാസ്സ് ഏത് ഭാഷയിലാണ് നടക്കുന്നത്?",
        a: "ഏറ്റവും ലളിതമായ മലയാളത്തിലാണ് ക്ലാസ്സ്. എല്ലാവർക്കും മനസ്സിലാകുന്ന രീതിയിലാണ് കാര്യങ്ങൾ വിശദീകരിക്കുന്നത്.",
      },
    ],

    // Bottom CTA
    ctaTitle: "AI പഠിക്കാൻ ഇനി വൈകരുത്",
    ctaSubtitle: "അടുത്ത ബാച്ച് നവംബർ 7 • വൈകുന്നേരം 5:00 മുതൽ 7:00 വരെ • വെറും ₹99 മാത്രം",
    ctaBtn: "ഇപ്പോൾ തന്നെ ₹99-ന് രജിസ്റ്റർ ചെയ്യൂ",
    ctaWhatsApp: "WhatsApp",

    // Success receipt
    receiptBadge: "രജിസ്ട്രേഷൻ വിജയകരം",
    receiptTitle: "AI Easy Ayi-ലേക്ക് സ്വാഗതം",
    receiptThankYou: "നന്ദി",
    receiptReservedMsg: "നിങ്ങളുടെ സീറ്റ് വിജയകരമായി ബുക്ക് ചെയ്തിട്ടുണ്ട്.",
    receiptRefId: "റഫറൻസ് ഐഡി",
    receiptStatus: "പേയ്‌മെന്റ് സ്റ്റാറ്റസ്",
    receiptPaidText: "₹99 അടച്ചു (സ്ഥിരീകരിച്ചു)",
    receiptSession: "സെഷൻ തിയതി",
    receiptTime: "സമയം",
    receiptJoinCommunity: "ഔദ്യോഗിക WhatsApp ഗ്രൂപ്പിൽ ചേരുക",
    receiptNeedSupport: "സഹായം വേണോ?",
    receiptNewReg: "പുതിയ രജിസ്ട്രേഷൻ",

    // Sticky bar
    stickyTitle: "AI Easy Ayi",
    stickyPriceNote: "₹99",
    stickyOriginal: "₹899",
    stickySat: "നവംബർ 7 • ശനി 5:00 PM IST",
    stickySatMobile: "നവംബർ 7 • ശനി 5 PM",
    stickyBtn: "രജിസ്റ്റർ ചെയ്യൂ",
    stickyBtnMobile: "രജിസ്റ്റർ",
  },
  en: {
    // Language Switcher button
    translateBtnLabel: "മലയാളം",
    translateBtnTooltip: "മലയാളത്തിലേക്ക് മാറ്റുക",
    translateSwitchSub: "Switch to Malayalam",
    activeLangLabel: "English",

    // Hero Section (Centered Layout)
    heroBadge: "LIVE MASTERCLASS • SATURDAYS",
    heroTitleLine1: "AI Made Truly",
    heroTitleHighlight: "Easy For Everyone.",
    heroSubtitle:
      "Demystify AI from absolute scratch. No technical background, prior experience, or coding knowledge required.",
    heroPills: [
      "Interactive on Zoom",
      "Zero Tech Skills Needed",
      "Simple Malayalam & English",
    ],
    heroCtaPrimary: "Register for ₹99",
    heroOriginalPrice: "₹899",
    heroCtaSecondary: "Chat on WhatsApp",
    nextBatchLabel: "Next Cohort:",
    batchTime: "Saturday 5:00 PM – 7:00 PM IST",
    timerHeading: "Register In Next",
    timerDays: "Days",
    timerHours: "Hours",
    timerMinutes: "Minutes",
    timerSeconds: "Seconds",

    // Highlights Strip (Home theme 4-column)
    highlights: [
      { prefix: "Accessible for all", highlight: "Absolute Beginners" },
      { prefix: "2-Hour Intensive", highlight: "Practical Live Class" },
      { prefix: "Simple Explanations", highlight: "Live Q&A Support" },
      { prefix: "Free Bonus", highlight: "Prompt Cheat Sheets" },
    ],

    // Video Section
    videoHeading: "Watch the 2-Minute Preview",
    videoSubheading: "Discover everything you will experience and build during the interactive masterclass.",

    // Steps (How it works)
    stepsBadge: "HOW IT WORKS",
    stepsTitle: "3 Simple Steps to Start",
    steps: [
      {
        step: "01",
        title: "Register for just ₹99",
        desc: "Instant booking confirmation and your official Zoom link sent straight to your phone.",
      },
      {
        step: "02",
        title: "Join Live on Saturday, Nov 7th",
        desc: "Connect seamlessly on your smartphone or laptop and follow live interactive demos.",
      },
      {
        step: "03",
        title: "Start Using AI Daily",
        desc: "Apply your newly acquired AI workflows immediately in your job, studies, and daily tasks.",
      },
    ],

    // Curriculum
    curriculumBadge: "CURRICULUM",
    curriculumTitle: "What You Will Master in 2 Hours",
    curriculumItems: [
      {
        number: "01",
        title: "What is AI? (Foundations)",
        subtitle: "Clear, practical explanations without confusing jargon or unnecessary tech theory.",
      },
      {
        number: "02",
        title: "Real-World Everyday AI Use Cases",
        subtitle: "Effortless shortcuts for study notes, office work, email replies, presentations, and travel planning.",
      },
      {
        number: "03",
        title: "Safe & Productive Best Practices",
        subtitle: "Essential rules for privacy protection, accuracy verification, and responsible AI usage.",
      },
    ],

    // Audience
    audienceBadge: "BUILT FOR EVERYONE",
    audienceTitle: "Who Is This Masterclass For?",
    audienceSubtitle: "Anyone who can use a smartphone or computer can easily participate and thrive.",
    audienceTags: [
      { label: "Students", role: "School & College" },
      { label: "Teachers", role: "Educators & Tutors" },
      { label: "Homemakers", role: "Home Managers" },
      { label: "Working Professionals", role: "Corporate & Govt" },
      { label: "Entrepreneurs", role: "Business & Freelancers" },
      { label: "Senior Citizens", role: "Lifelong Learners" },
    ],

    // Form
    formBadge: "DIRECT REGISTRATION",
    formTitle: "Enter Your Details",
    formClose: "Close ×",
    formNameLabel: "Full Name",
    formNamePlaceholder: "e.g. Rahul Sharma",
    formPhoneLabel: "Phone Number",
    formPhonePlaceholder: "10-digit mobile number",
    formPlaceLabel: "Place / City",
    formPlacePlaceholder: "e.g. Kozhikode, Kochi, Kannur",
    formProfileLabel: "Background / Profile",
    qualificationOptions: [
      { id: "Working Professional", label: "Working Professional" },
      { id: "Student", label: "Student" },
      { id: "Other", label: "Other" },
    ],
    formCustomPlaceholder: "Please specify (e.g. Homemaker, Teacher, Doctor)",
    formSubmitBtn: "Confirm & Pay ₹99",
    formSubmitHint: "Official DeepStaq Registration • 2 Hours Live + Study Guides",
    formSaving: "Saving details...",
    formGateway: "Opening Razorpay...",
    formVerifying: "Verifying payment...",

    // FAQ
    faqBadge: "FREQUENTLY ASKED",
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "Do I need any technical or coding knowledge?",
        a: "No! We start from absolute zero. No programming or tech background is needed. Anyone who knows how to operate a smartphone can easily attend and understand.",
      },
      {
        q: "What device do I need for the class?",
        a: "A regular smartphone or laptop with an internet connection is all you need.",
      },
      {
        q: "Will I get recordings or summary guides?",
        a: "Yes! After the live session, you will receive our comprehensive prompt guides, checklists, and key takeaways for future reference.",
      },
      {
        q: "What is the medium of instruction?",
        a: "The session is conducted in simple, conversational Malayalam blended with easy-to-follow terms so everyone feels right at home.",
      },
    ],

    // Bottom CTA
    ctaTitle: "Don't Fall Behind in the AI Era",
    ctaSubtitle: "Next Batch Nov 7th • Saturday 5:00 PM – 7:00 PM IST • Just ₹99",
    ctaBtn: "Register for ₹99",
    ctaWhatsApp: "WhatsApp",

    // Success receipt
    receiptBadge: "REGISTRATION CONFIRMED",
    receiptTitle: "Welcome to AI Easy Ayi",
    receiptThankYou: "Thank you",
    receiptReservedMsg: "Your masterclass seat has been successfully reserved.",
    receiptRefId: "Reference ID",
    receiptStatus: "Payment Status",
    receiptPaidText: "₹99 Paid (Confirmed)",
    receiptSession: "Session Date",
    receiptTime: "Time",
    receiptJoinCommunity: "Join Official WhatsApp Community",
    receiptNeedSupport: "Need Support?",
    receiptNewReg: "New Registration",

    // Sticky bar
    stickyTitle: "AI Easy Ayi",
    stickyPriceNote: "₹99",
    stickyOriginal: "₹899",
    stickySat: "Nov 7th • Sat 5:00 PM IST",
    stickySatMobile: "Nov 7 • Sat 5 PM",
    stickyBtn: "Join Now",
    stickyBtnMobile: "Join",
  },
};

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
const getBatchDateTime = () => {
  const currentYear = new Date().getFullYear();
  const target = new Date(currentYear, 10, 7, 17, 0, 0, 0); // Month 10 = November
  if (target.getTime() <= Date.now()) {
    target.setFullYear(currentYear + 1);
  }
  return target;
};

const getNextSaturdayFormatted = (lang = "ml") => {
  if (lang === "ml") {
    return "നവംബർ 7";
  }
  return "Nov 7th";
};

const getFullSessionDateFormatted = (lang = "ml") => {
  const target = getBatchDateTime();
  const year = target.getFullYear();
  if (lang === "ml") {
    return `നവംബർ 7, ${year}`;
  }
  return `November 7th, ${year}`;
};

const calculateTimeLeft = () => {
  const target = getBatchDateTime();
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
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Language state: 'ml' (Malayalam) or 'en' (English)
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ai_easy_ayi_lang") || "ml";
    }
    return "ml";
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ml;

  // Pre-filled WhatsApp inquiry message
  const whatsappInquiryMessage = lang === "ml"
    ? "ഹലോ DeepStaq! എനിക്ക് AI എളുപ്പമായി (AI Easy Ayi) മാസ്റ്റർക്ലാസ്സിനെക്കുറിച്ച് കൂടുതൽ വിവരങ്ങൾ അറിയണം."
    : "Hello DeepStaq! I would like to get more information about the AI Easy Ayi masterclass.";

  const whatsappUrl = `https://wa.me/919495957011?text=${encodeURIComponent(whatsappInquiryMessage)}`;

  // Toggle language function
  const toggleLanguage = () => {
    setLang((prev) => {
      const nextLang = prev === "ml" ? "en" : "ml";
      try {
        localStorage.setItem("ai_easy_ayi_lang", nextLang);
      } catch (e) {}
      return nextLang;
    });
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    place: "",
    qualification: "Working Professional",
    customQualification: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [paymentNotice, setPaymentNotice] = useState(null);
  const [pendingRegId, setPendingRegId] = useState(null);

  const eventDateFormatted = getNextSaturdayFormatted(lang);
  const fullSessionDateFormatted = getFullSessionDateFormatted(lang);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToForm = () => {
    setShowForm(true);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        const firstInput = formRef.current.querySelector('input[name="fullName"]');
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 250);
        }
      }
    }, 100);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitError) setSubmitError("");
    if (paymentNotice) setPaymentNotice(null);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = lang === "ml" ? "പൂർണ്ണമായ പേര് നൽകുക" : "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = lang === "ml" ? "പേരിൽ കുറഞ്ഞത് 2 അക്ഷരങ്ങൾ വേണം" : "Name must be at least 2 characters";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      errs.phone = lang === "ml" ? "മൊബൈൽ നമ്പർ നൽകുക" : "Phone number is required";
    } else if (cleanPhone.length < 10) {
      errs.phone = lang === "ml" ? "സാധുവായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക" : "Please enter a valid 10-digit mobile number";
    }

    if (!formData.place.trim()) {
      errs.place = lang === "ml" ? "സ്ഥലം / ജില്ല നൽകുക" : "Place / City is required";
    }

    if (!formData.qualification) {
      errs.qualification = lang === "ml" ? "നിങ്ങളുടെ പശ്ചാത്തലം തിരഞ്ഞെടുക്കുക" : "Please select your background";
    } else if (formData.qualification === "Other" && !formData.customQualification.trim()) {
      errs.customQualification = lang === "ml" ? "നിങ്ങളുടെ പശ്ചാത്തലം രേഖപ്പെടുത്തുക" : "Please specify your background";
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
          ? formData.customQualification.trim() || "Other"
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
        languagePreference: lang,
      };

      let regId = pendingRegId;
      if (!regId) {
        const result = await saveAiEasyAyiRegistration(payload);
        regId = result?.id || `AYI-${Date.now().toString().slice(-6)}`;
        setPendingRegId(regId);
      }

      setLoadingStep("gateway");
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setSubmitError(
          lang === "ml"
            ? "പേയ്‌മെന്റ് ഗേറ്റ്‌വേയിലേക്ക് കണക്റ്റ് ചെയ്യാൻ കഴിഞ്ഞില്ല. ദയവായി ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിക്കുക."
            : "Failed to connect to payment gateway. Please check your internet connection."
        );
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_live_RQB88T04c3K3R5",
        amount: 9900,
        currency: "INR",
        name: "DeepStaq Academy",
        description: "AI easy Ayi - 2 Hrs Live Class (5:00 PM - 7:00 PM IST)",
        image: logo,
        prefill: {
          name: formData.fullName.trim(),
          contact: cleanPhone,
        },
        theme: {
          color: "#f90058",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setPaymentNotice({
              type: "warning",
              message:
                lang === "ml"
                  ? "പേയ്‌മെന്റ് പൂർത്തിയായില്ല. നിങ്ങളുടെ രജിസ്ട്രേഷൻ വിവരങ്ങൾ സുരക്ഷിതമായി സേവ് ചെയ്തിട്ടുണ്ട്."
                  : "Payment was not completed. Your registration details remain saved.",
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
              registeredAt: new Date().toLocaleDateString(lang === "ml" ? "ml-IN" : "en-IN", {
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
              registeredAt: new Date().toLocaleDateString(lang === "ml" ? "ml-IN" : "en-IN", {
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
          message:
            lang === "ml"
              ? `പേയ്‌മെന്റ് പരാജയപ്പെട്ടു: ${failResponse.error?.description || "ഇടപാട് നിരസിച്ചു"}. വിവരങ്ങൾ സേവ് ചെയ്തിട്ടുണ്ട്.`
              : `Payment failed: ${failResponse.error?.description || "Transaction declined"}. Your details remain saved.`,
          registrationId: regId,
        });
      });

      rzp.open();
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmitError(
        lang === "ml"
          ? "ഒരു അപ്രതീക്ഷിത തടസ്സം ഉണ്ടായി. ദയവായി കണക്ഷൻ പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക."
          : "There was an unexpected error. Please check your connection and try again."
      );
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
    <div 
      className="min-h-screen text-white font-sans selection:bg-[#f90058]/30 selection:text-white antialiased relative overflow-x-hidden"
      style={{
        backgroundColor: "#1d0058",
      }}
    >
      
      {/* ─────────────────────────────────────────────────────────────
          AI EASY AYI 3-COLOR BACKGROUND GRADIENT & AMBIENT GLOW EFFECTS
          Palette: #1d0058 (Deep Indigo), #f90058 (Neon Magenta), #184cef (Electric Blue)
          Applied exclusively to this page only
      ───────────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Base 3-Color Dynamic Angular Gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #1d0058 0%, #1e0538 25%, #0f154e 55%, #184cef 85%, #f90058 100%)",
          }}
        />

        {/* Deep Atmospheric Mesh Scrim for Contrast & Elegance */}
        <div className="absolute inset-0 bg-[#090217]/40" />

        {/* Top-right vibrant #f90058 neon magenta radial glow */}
        <div className="absolute -top-[12%] -right-[12%] w-[850px] h-[850px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,0,88,0.32)_0%,rgba(249,0,88,0.12)_40%,transparent_70%)] blur-[130px]" />

        {/* Center-left vibrant #184cef electric blue radial glow */}
        <div className="absolute top-[35%] -left-[15%] w-[950px] h-[950px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(24,76,239,0.35)_0%,rgba(29,0,88,0.22)_50%,transparent_75%)] blur-[140px]" />

        {/* Bottom-right blended #f90058 & #184cef gradient glow */}
        <div className="absolute bottom-[2%] right-[5%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,0,88,0.25)_0%,rgba(24,76,239,0.20)_45%,transparent_70%)] blur-[130px]" />

        {/* Center-left subtle #1d0058 deep purple core glow */}
        <div className="absolute top-[65%] left-[20%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(29,0,88,0.65)_0%,transparent_70%)] blur-[110px]" />
      </div>

      <div className="relative z-10">
        <main className="max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-24 sm:pt-28 md:pt-32 pb-24 space-y-16 sm:space-y-20 lg:space-y-28">

          {/* ══════════════════════════════════════════════════════════
              SUCCESS RECEIPT STATE
             ══════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {submittedData && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white/[0.03] border border-white/15 rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-3xl mx-auto"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#f90058]/15 border border-[#f90058]/35 flex items-center justify-center text-[#ff337d] text-xl font-bold shadow-[0_0_20px_rgba(249,0,88,0.3)]">
                    ✓
                  </div>
                  <div>
                    <span className="text-[11px] font-mono tracking-widest text-[#ff337d] uppercase block">
                      {t.receiptBadge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {t.receiptTitle}
                    </h2>
                  </div>
                </div>

                <p className="text-base text-slate-300 leading-relaxed mb-6">
                  {t.receiptThankYou}{" "}
                  <strong className="text-white font-semibold">
                    {submittedData.fullName}
                  </strong>
                  . {t.receiptReservedMsg}
                </p>

                {/* Minimal Ticket Meta */}
                <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-5 my-6 space-y-3 text-xs sm:text-sm font-mono">
                  <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-white/5">
                    <span>{t.receiptRefId}</span>
                    <span className="text-white font-semibold">{submittedData.id}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-white/5">
                    <span>{t.receiptStatus}</span>
                    <span className="text-fuchsia-300 font-semibold">{t.receiptPaidText}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-white/5">
                    <span>{t.receiptSession}</span>
                    <span className="text-white">{fullSessionDateFormatted}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>{t.receiptTime}</span>
                    <span className="text-white">5:00 PM – 7:00 PM IST (Zoom)</span>
                  </div>
                </div>

                {/* Actions: WhatsApp Community & Reset */}
                <div className="space-y-3 pt-2">
                  <a
                    href="https://chat.whatsapp.com/KxVV7ep74TV0GHy5SU2FXl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#f90058] to-[#184cef] hover:from-[#ff1a6c] hover:to-[#2e62ff] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_4px_28px_rgba(249,0,88,0.4)]"
                  >
                    <span>{t.receiptJoinCommunity}</span>
                    <span>→</span>
                  </a>

                  <div className="flex gap-3">
                    <a
                      href={`https://wa.me/918075727195?text=${encodeURIComponent(
                        `Hi DeepStaq! I registered and paid ₹99 for AI easy Ayi. Name: ${submittedData.fullName} (Ref: ${submittedData.id})`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 text-center text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl transition-colors"
                    >
                      {t.receiptNeedSupport}
                    </a>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 py-3 text-center text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl transition-colors cursor-pointer"
                    >
                      {t.receiptNewReg}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!submittedData && (
            <>
              {/* ══════════════════════════════════════════════════════════
                  HERO SECTION (FULLY CENTRALIZED LAYOUT + TRANSLATE BUTTON)
                 ══════════════════════════════════════════════════════════ */}
              {/* ══════════════════════════════════════════════════════════
                  HERO SECTION (RESPONSIVE: MOBILE STACKED, TABLET/LAPTOP 2-COLUMN)
                 ══════════════════════════════════════════════════════════ */}
              <section className="relative w-full max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto pt-2 sm:pt-4 md:pt-6">
                
                {/* Subtle Centered Background Radial Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] lg:w-[1050px] h-[350px] sm:h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(24,76,239,0.25)_0%,rgba(249,0,88,0.18)_45%,transparent_70%)] blur-[110px] pointer-events-none -z-10" />

                <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-[repeat(6,auto)] gap-y-6 sm:gap-y-8 md:gap-y-4 lg:gap-y-5 md:gap-x-6 lg:gap-x-12 xl:gap-x-16 items-center">

                  {/* 1. Category Badge & Language Toggle (Row 1 on left) */}
                  <div className="order-1 col-span-1 md:col-start-1 md:col-span-7 md:row-start-1 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    {/* Category Pill Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#f90058] shadow-[0_0_8px_rgba(249,0,88,0.8)] animate-pulse" />
                      <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#E0E7EC]">
                        {t.heroBadge}
                      </span>
                    </motion.div>

                    {/* Translate Toggle Button */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      type="button"
                      onClick={toggleLanguage}
                      title={t.translateBtnTooltip}
                      className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 hover:border-[#f90058]/50 text-white text-xs sm:text-xs font-bold tracking-wide transition-all shadow-[0_0_16px_rgba(24,76,239,0.25)] hover:shadow-[0_0_24px_rgba(249,0,88,0.35)] cursor-pointer backdrop-blur-md"
                    >
                      <svg className="w-3.5 h-3.5 text-fuchsia-300 group-hover:rotate-12 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      <span className="text-white font-extrabold text-xs">
                        {t.translateBtnLabel}
                      </span>
                      <span className="text-[10px] text-blue-200 font-mono tracking-tight px-1.5 py-0.2 rounded bg-[#184cef]/20 border border-[#184cef]/30 hidden min-[400px]:inline">
                        {t.translateSwitchSub}
                      </span>
                    </motion.button>
                  </div>

                  {/* 2. Headline (Row 2 on left) */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="order-2 col-span-1 md:col-start-1 md:col-span-7 md:row-start-2 space-y-2 text-center md:text-left"
                  >
                    <h1 className="text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-[-0.03em] leading-[1.08] text-white">
                      {t.heroTitleLine1} <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f90058] via-fuchsia-200 to-[#184cef] drop-shadow-[0_0_28px_rgba(249,0,88,0.4)]">
                        {t.heroTitleHighlight}
                      </span>
                    </h1>
                  </motion.div>

                  {/* 3. Subtitle Description (Row 3 on left) */}
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="order-3 col-span-1 md:col-start-1 md:col-span-7 md:row-start-3 text-base sm:text-lg md:text-sm lg:text-base xl:text-lg text-slate-300 max-w-2xl md:max-w-none font-normal leading-relaxed text-center md:text-left"
                  >
                    {t.heroSubtitle}
                  </motion.p>

                  {/* 4. Video Player (Spans all rows on the right in tablet/laptop) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="order-4 col-span-1 md:col-start-8 md:col-span-5 md:row-start-1 md:row-end-7 flex justify-center items-center my-1 sm:my-2 md:my-0 relative md:self-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#184cef]/30 to-[#f90058]/25 blur-3xl rounded-full pointer-events-none hidden md:block -z-10" />
                    <AdVideoSection
                      videoId="r5Q_3yerIJs"
                      title="DeepStaq AI easy Ayi Video"
                      targetFormId="registration-form"
                      originalPrice={899}
                      offerPrice={99}
                      onGoToForm={handleScrollToForm}
                    />
                  </motion.div>

                  {/* 5. Cohort Date & Countdown Timer (Row 4 on left) */}
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.28 }}
                    className="order-5 col-span-1 md:col-start-1 md:col-span-7 md:row-start-4 flex flex-col items-center md:items-start justify-center space-y-3 pt-1"
                  >
                    {/* Cohort Date Info */}
                    <div className="text-xs sm:text-sm text-slate-300 font-mono text-center md:text-left flex items-center justify-center md:justify-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      <span>
                        {t.nextBatchLabel}{" "}
                        <strong className="text-white font-semibold">{eventDateFormatted}</strong>{" "}
                        • {t.batchTime}
                      </span>
                    </div>

                    {/* Countdown Timer (2x2 on mobile, 4 in row on laptop) */}
                    <div className="text-center md:text-left space-y-2 pt-1 w-full">
                      <span className="text-xs sm:text-sm font-semibold text-slate-200 tracking-wide block text-center md:text-left">
                        {t.timerHeading || "Register In Next"}
                      </span>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 max-w-[270px] sm:max-w-[290px] lg:max-w-md mx-auto md:mx-0 text-center font-sans">
                        {/* Days */}
                        <div className="bg-[#dcdcdc] border border-slate-300/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                          <div className="py-2.5 sm:py-3 px-2 flex items-center justify-center">
                            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none font-mono tracking-tight">
                              {timeLeft.days}
                            </span>
                          </div>
                          <div className="border-t border-slate-300 bg-slate-300/40 py-1.5 px-2 flex items-center justify-center">
                            <span className="text-xs sm:text-sm font-semibold text-slate-800 block leading-tight">
                              {t.timerDays || "Days"}
                            </span>
                          </div>
                        </div>

                        {/* Hours */}
                        <div className="bg-[#dcdcdc] border border-slate-300/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                          <div className="py-2.5 sm:py-3 px-2 flex items-center justify-center">
                            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none font-mono tracking-tight">
                              {timeLeft.hours}
                            </span>
                          </div>
                          <div className="border-t border-slate-300 bg-slate-300/40 py-1.5 px-2 flex items-center justify-center">
                            <span className="text-xs sm:text-sm font-semibold text-slate-800 block leading-tight">
                              {t.timerHours || "Hours"}
                            </span>
                          </div>
                        </div>

                        {/* Minutes */}
                        <div className="bg-[#dcdcdc] border border-slate-300/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                          <div className="py-2.5 sm:py-3 px-2 flex items-center justify-center">
                            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none font-mono tracking-tight">
                              {timeLeft.minutes}
                            </span>
                          </div>
                          <div className="border-t border-slate-300 bg-slate-300/40 py-1.5 px-2 flex items-center justify-center">
                            <span className="text-xs sm:text-sm font-semibold text-slate-800 block leading-tight">
                              {t.timerMinutes || "Minutes"}
                            </span>
                          </div>
                        </div>

                        {/* Seconds */}
                        <div className="bg-[#dcdcdc] border border-slate-300/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                          <div className="py-2.5 sm:py-3 px-2 flex items-center justify-center">
                            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none font-mono tracking-tight">
                              {timeLeft.seconds}
                            </span>
                          </div>
                          <div className="border-t border-slate-300 bg-slate-300/40 py-1.5 px-2 flex items-center justify-center">
                            <span className="text-xs sm:text-sm font-semibold text-slate-800 block leading-tight">
                              {t.timerSeconds || "Seconds"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* 6. Feature Badges (Row 5 on left) */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="order-6 col-span-1 md:col-start-1 md:col-span-7 md:row-start-5 flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 pt-1"
                  >
                    {t.heroPills.map((pill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#f90058]/15 via-white/[0.07] to-[#184cef]/15 border border-[#f90058]/35 hover:border-[#184cef]/50 text-xs sm:text-sm font-semibold text-white backdrop-blur-md shadow-[0_0_20px_rgba(249,0,88,0.2)] hover:shadow-[0_0_28px_rgba(24,76,239,0.35)] transition-all duration-300"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#f90058] shadow-[0_0_10px_rgba(249,0,88,0.9)] animate-pulse" />
                        <span>{pill}</span>
                      </span>
                    ))}
                  </motion.div>

                  {/* 7. CTA Actions (Row 6 on left) */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="order-7 col-span-1 md:col-start-1 md:col-span-7 md:row-start-6 flex items-center justify-center md:justify-start gap-3 sm:gap-4 pt-1 w-full sm:w-auto"
                  >
                    {/* Primary CTA */}
                    <button
                      type="button"
                      onClick={handleScrollToForm}
                      className="flex-1 sm:flex-initial px-7 lg:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#f90058] to-[#184cef] hover:from-[#ff1a6c] hover:to-[#2e62ff] text-white font-bold text-sm sm:text-base tracking-wide shadow-[0_4px_28px_rgba(249,0,88,0.4)] flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-[1.02] group whitespace-nowrap"
                    >
                      <span>{t.heroCtaPrimary}</span>
                      <span className="font-mono text-white/70 line-through text-xs">
                        {t.heroOriginalPrice}
                      </span>
                      <span className="font-bold transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </button>

                    {/* Secondary WhatsApp Button */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Chat on WhatsApp"
                      className="px-5 lg:px-6 py-3.5 sm:py-4 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 backdrop-blur-md flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_28px_rgba(16,185,129,0.4)] hover:scale-[1.02] cursor-pointer whitespace-nowrap flex-shrink-0"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
                      </svg>
                      <span>Chat on</span>
                    </a>
                  </motion.div>

                </div>
              </section>


              {/* ══════════════════════════════════════════════════════════
                  REGISTRATION FORM (Collapsible / Anchor)
                 ══════════════════════════════════════════════════════════ */}
              <AnimatePresence>
                {showForm && (
                  <motion.section
                    ref={formRef}
                    id="registration-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="scroll-mt-24 border border-white/15 rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 bg-white/[0.03] backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] max-w-3xl lg:max-w-4xl mx-auto w-full"
                  >
                    <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/10">
                      <div>
                        <span className="text-[11px] font-mono tracking-widest text-[#ff337d] uppercase block">
                          {t.formBadge}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          {t.formTitle}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 transition-colors cursor-pointer"
                      >
                        {t.formClose}
                      </button>
                    </div>

                    {submitError && (
                      <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-2xl mb-5 text-xs sm:text-sm font-medium text-red-300">
                        {submitError}
                      </div>
                    )}

                    {paymentNotice && (
                      <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-2xl mb-5 text-xs sm:text-sm font-medium text-amber-300">
                        {paymentNotice.message}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        {/* Full Name */}
                        <div className="space-y-2">
                          <label className="block text-xs font-mono tracking-wider uppercase text-slate-300">
                            {t.formNameLabel} <span className="text-[#ff337d]">*</span>
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder={t.formNamePlaceholder}
                            className={`w-full px-4 py-3 rounded-xl border bg-[#0a0f14] text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                              errors.fullName
                                ? "border-red-500/70 focus:border-red-500"
                                : "border-white/10 focus:border-[#f90058] focus:ring-1 focus:ring-[#f90058]/50"
                            }`}
                          />
                          {errors.fullName && (
                            <p className="text-xs font-mono text-red-400 mt-1">{errors.fullName}</p>
                          )}
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                          <label className="block text-xs font-mono tracking-wider uppercase text-slate-300">
                            {t.formPhoneLabel} <span className="text-[#ff337d]">*</span>
                          </label>
                          <div className="flex">
                            <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-white/10 bg-white/[0.04] text-xs font-mono text-slate-400 select-none">
                              +91
                            </span>
                            <input
                              type="tel"
                              name="phone"
                              maxLength={10}
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder={t.formPhonePlaceholder}
                              className={`w-full px-4 py-3 rounded-r-xl border bg-[#0a0f14] font-mono text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                                errors.phone
                                  ? "border-red-500/70 focus:border-red-500"
                                  : "border-white/10 focus:border-[#f90058] focus:ring-1 focus:ring-[#f90058]/50"
                              }`}
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-xs font-mono text-red-400 mt-1">{errors.phone}</p>
                          )}
                        </div>
                      </div>

                      {/* Place */}
                      <div className="space-y-2">
                        <label className="block text-xs font-mono tracking-wider uppercase text-slate-300">
                          {t.formPlaceLabel} <span className="text-[#ff337d]">*</span>
                        </label>
                        <input
                          type="text"
                          name="place"
                          value={formData.place}
                          onChange={handleInputChange}
                          placeholder={t.formPlacePlaceholder}
                          className={`w-full px-4 py-3 rounded-xl border bg-[#0a0f14] text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                            errors.place
                              ? "border-red-500/70 focus:border-red-500"
                              : "border-white/10 focus:border-[#f90058] focus:ring-1 focus:ring-[#f90058]/50"
                          }`}
                        />
                        {errors.place && (
                          <p className="text-xs font-mono text-red-400 mt-1">{errors.place}</p>
                        )}
                      </div>

                      {/* Background Selection */}
                      <div className="space-y-2">
                        <label className="block text-xs font-mono tracking-wider uppercase text-slate-300">
                          {t.formProfileLabel} <span className="text-[#ff337d]">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2.5">
                          {t.qualificationOptions.map((opt) => {
                            const isSelected = formData.qualification === opt.id;
                            return (
                              <button
                                type="button"
                                key={opt.id}
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, qualification: opt.id }));
                                  if (errors.qualification) setErrors((prev) => ({ ...prev, qualification: "" }));
                                }}
                                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all text-center cursor-pointer ${
                                  isSelected
                                    ? "bg-gradient-to-r from-[#f90058] to-[#184cef] text-white font-bold border-[#f90058]/60 shadow-[0_2px_14px_rgba(249,0,88,0.35)]"
                                    : "bg-white/[0.03] text-slate-300 border-white/10 hover:border-white/25 hover:bg-white/[0.06]"
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>

                        {formData.qualification === "Other" && (
                          <input
                            type="text"
                            name="customQualification"
                            value={formData.customQualification}
                            onChange={handleInputChange}
                            placeholder={t.formCustomPlaceholder}
                            className="w-full mt-2.5 px-4 py-2.5 rounded-xl border border-white/10 bg-[#0a0f14] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f90058]"
                          />
                        )}
                        {errors.customQualification && (
                          <p className="text-xs font-mono text-red-400 mt-1">{errors.customQualification}</p>
                        )}
                      </div>

                      {/* Submit */}
                      <div className="pt-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className={`w-full py-4 px-6 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                            loading
                              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-[#f90058] to-[#184cef] hover:from-[#ff1a6c] hover:to-[#2e62ff] text-white shadow-[0_4px_28px_rgba(249,0,88,0.4)] hover:scale-[1.01]"
                          }`}
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                              <span>
                                {loadingStep === "saving"
                                  ? t.formSaving
                                  : loadingStep === "gateway"
                                  ? t.formGateway
                                  : t.formVerifying}
                              </span>
                            </>
                          ) : (
                            <>
                              <span>{t.formSubmitBtn}</span>
                              <span className="font-bold">→</span>
                            </>
                          )}
                        </button>
                        <p className="text-center text-[11px] font-mono text-slate-400 mt-2.5">
                          {t.formSubmitHint}
                        </p>
                      </div>
                    </form>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* ══════════════════════════════════════════════════════════
                  3 EASY STEPS (HOW IT WORKS)
                 ══════════════════════════════════════════════════════════ */}
              <section className="space-y-6 pt-2 max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                <div className="border-b border-white/10 pb-4 flex items-baseline justify-between">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                    {t.stepsTitle}
                  </h2>
                  <span className="text-xs font-mono text-[#ff337d] uppercase tracking-widest">
                    {t.stepsBadge}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                  {t.steps.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-6 lg:p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-[#f90058]/40 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.3)] group flex flex-col justify-between hover:-translate-y-1"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="w-9 h-9 rounded-xl bg-[#f90058]/15 border border-[#f90058]/30 text-[#ff4382] font-mono font-bold text-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            {item.step}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-[#184cef]/50 group-hover:bg-[#f90058] transition-colors" />
                        </div>
                        <h3 className="text-base lg:text-lg font-bold text-white group-hover:text-pink-300 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm lg:text-base text-slate-400 leading-relaxed font-normal">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ══════════════════════════════════════════════════════════
                  WHAT YOU WILL LEARN (CURRICULUM)
                 ══════════════════════════════════════════════════════════ */}
              <section className="space-y-6 max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                <div className="border-b border-white/10 pb-4 flex items-baseline justify-between">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                    {t.curriculumTitle}
                  </h2>
                  <span className="text-xs font-mono text-[#ff337d] uppercase tracking-widest">
                    {t.curriculumBadge}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                  {t.curriculumItems.map((card, idx) => (
                    <div
                      key={idx}
                      className="p-6 lg:p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-[#184cef]/40 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.3)] group space-y-2.5 hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#5480ff] px-2.5 py-1 rounded-md bg-[#184cef]/15 border border-[#184cef]/30">
                          {card.number}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f90058]" />
                      </div>
                      <h3 className="text-base lg:text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-base text-slate-400 leading-relaxed">
                        {card.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ══════════════════════════════════════════════════════════
                  TARGET AUDIENCE (WHO IS THIS FOR)
                 ══════════════════════════════════════════════════════════ */}
              <section className="space-y-5 max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                <div className="border-b border-white/10 pb-4 flex items-baseline justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                      {t.audienceTitle}
                    </h2>
                    <p className="text-xs sm:text-sm lg:text-base text-slate-400 mt-1">
                      {t.audienceSubtitle}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#ff337d] uppercase tracking-widest hidden sm:inline">
                    {t.audienceBadge}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5 sm:gap-3 lg:gap-3.5">
                  {t.audienceTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:border-[#f90058]/40 text-xs sm:text-sm lg:text-base text-slate-200 font-medium transition-colors backdrop-blur-sm flex items-center gap-2 hover:bg-white/[0.06]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f90058]" />
                      <span>{tag.label}</span>
                      <span className="text-slate-500 text-xs font-mono">/ {tag.role}</span>
                    </span>
                  ))}
                </div>
              </section>


              {/* ══════════════════════════════════════════════════════════
                  BOTTOM CALLOUT (Matching Home.jsx CTA card)
                 ══════════════════════════════════════════════════════════ */}
              <section className="relative rounded-3xl p-8 sm:p-12 lg:p-16 bg-white/[0.03] backdrop-blur-2xl border border-white/15 text-center space-y-6 lg:space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                
                {/* Background glow behind CTA */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[250px] sm:h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(249,0,88,0.28)_0%,rgba(24,76,239,0.22)_50%,transparent_70%)] blur-[100px] pointer-events-none -z-10" />

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                    {t.ctaTitle}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-fuchsia-200 font-mono">
                    {t.ctaSubtitle}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-lg mx-auto">
                  <button
                    type="button"
                    onClick={handleScrollToForm}
                    className="flex-1 sm:flex-initial px-8 lg:px-10 py-3.5 sm:py-4 lg:py-4.5 bg-gradient-to-r from-[#f90058] to-[#184cef] hover:from-[#ff1a6c] hover:to-[#2e62ff] text-white font-bold text-xs sm:text-sm lg:text-base uppercase tracking-wider rounded-full transition-all shadow-[0_4px_28px_rgba(249,0,88,0.4)] hover:scale-[1.02] cursor-pointer whitespace-nowrap"
                  >
                    {t.ctaBtn}
                  </button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Chat on WhatsApp"
                    className="w-auto px-6 lg:px-8 py-3.5 sm:py-4 lg:py-4.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 font-semibold text-xs sm:text-sm lg:text-base tracking-wide transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_28px_rgba(16,185,129,0.45)] hover:scale-[1.02] cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 flex-shrink-0"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
                    </svg>
                    <span>Chat on</span>
                  </a>
                </div>
              </section>
            </>
          )}

        </main>

        {/* ══════════════════════════════════════════════════════════
            MINIMAL FLOATING STICKY BAR (Fully Responsive: Mobile & Laptop)
           ══════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {showStickyBar && !submittedData && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed bottom-3 sm:bottom-5 left-0 right-0 z-40 px-2.5 sm:px-4 md:px-6 pointer-events-none"
            >
              <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto pointer-events-auto bg-[#090D11]/95 border border-white/15 backdrop-blur-2xl rounded-2xl sm:rounded-full p-2 px-3 sm:p-2.5 sm:px-5 flex items-center justify-between gap-2 sm:gap-4 shadow-[0_16px_50px_rgba(0,0,0,0.75)]">
                
                {/* Left Side: Title, Pricing & Date */}
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                  {/* Top Line: Title & Pricing */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight whitespace-nowrap">
                      {t.stickyTitle}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono">
                      <span className="text-[#ff337d] font-extrabold text-xs sm:text-xs whitespace-nowrap">
                        {t.stickyPriceNote}
                      </span>
                      <span className="line-through text-slate-500 text-[10px] sm:text-[11px] whitespace-nowrap">
                        {t.stickyOriginal}
                      </span>
                    </span>
                  </div>

                  {/* Bottom Line: Batch Schedule (Mobile vs Laptop Responsive Text) */}
                  <p className="text-[10px] sm:text-xs font-mono text-slate-300 truncate">
                    <span className="hidden sm:inline">{t.stickySat}</span>
                    <span className="sm:hidden">{t.stickySatMobile || t.stickySat}</span>
                  </p>
                </div>

                {/* Right Side: Responsive Language Toggle + Primary CTA Button */}
                <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
                  {/* Inline Language Quick-Toggle (Visible & Responsive on BOTH mobile & laptop!) */}
                  <button
                    type="button"
                    onClick={toggleLanguage}
                    title={t.translateBtnTooltip}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 hover:border-[#f90058]/40 text-[10px] sm:text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
                    aria-label={t.translateBtnTooltip}
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fuchsia-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span className="hidden sm:inline">{t.translateBtnLabel}</span>
                    <span className="sm:hidden">{lang === "ml" ? "EN" : "മല"}</span>
                  </button>

                  {/* Primary Action Button (Guaranteed whitespace-nowrap, never wraps onto multiple lines!) */}
                  <button
                    type="button"
                    onClick={handleScrollToForm}
                    className="py-2 px-3.5 sm:px-6 bg-gradient-to-r from-[#f90058] to-[#184cef] hover:from-[#ff1a6c] hover:to-[#2e62ff] active:scale-95 text-white font-black text-xs sm:text-xs uppercase tracking-wider rounded-full transition-all shadow-[0_2px_16px_rgba(249,0,88,0.35)] cursor-pointer whitespace-nowrap flex-shrink-0"
                  >
                    <span className="hidden min-[380px]:inline">{t.stickyBtn}</span>
                    <span className="min-[380px]:hidden">{t.stickyBtnMobile || t.stickyBtn}</span>
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}