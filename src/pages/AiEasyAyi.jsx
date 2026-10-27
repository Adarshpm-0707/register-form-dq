import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import {
  saveAiEasyAyiRegistration,
  updateAiEasyAyiRegistration,
} from "../services/dbService";
import AdVideoSection from "../components/AdVideoSection";
import LimitedSeatsSection from "../components/LimitedSeatsSection";
import { useSeatsCountdown } from "../hooks/useSeatsCountdown";
import logo from "../assets/Asset 1@4x.png";
import easyAiImg from "../assets/easyai.png";

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
      { prefix: "90 മിനിറ്റ് കൊണ്ട്", highlight: "നേരിട്ട് ചെയ്തു പഠിക്കാം" },
      { prefix: "ലളിതമായ മലയാളത്തിൽ", highlight: "സംശയങ്ങൾക്ക് മറുപടി" },
      { prefix: "സൗജന്യ ബോണസ്", highlight: "സ്റ്റഡി ഗൈഡുകൾ" },
    ],

    // Video Section
    videoHeading: "2 മിനിറ്റ് പ്രിവ്യൂ വീഡിയോ കാണൂ",
    videoSubheading: "ഈ മാസ്റ്റർക്ലാസ്സിൽ എന്തൊക്കെയാണ് നിങ്ങൾ പഠിക്കുന്നതെന്ന് നേരിട്ട് കണ്ട് മനസ്സിലാക്കൂ.",

    // Perspective Shifts (Hard Truths)
    perspectiveBadge: "സത്യങ്ങൾ മനസ്സിലാക്കാം",
    perspectiveHeading: "ആരും നിങ്ങളോട് ഇത് പറഞ്ഞു തരില്ല. അതുകൊണ്ട് ഞാൻ പറയാം.",
    perspectiveCards: [
      {
        myth: "ഇമെയിലുകൾക്കും നോട്ടുകൾക്കും പേപ്പർവർക്കുകൾക്കുമായി മണിക്കൂറുകൾ ചെലവഴിക്കുന്നത് ആത്മാർത്ഥതയല്ല.",
        truth: "അത് AI വഴി നിങ്ങൾക്ക് തിരികെ ലഭിക്കേണ്ട വിലപ്പെട്ട സമയമാണ്.",
      },
      {
        myth: "\"AI ടെക്നോളജി അറിയാവുന്നവർക്ക് മാത്രമുള്ളതാണ്\" എന്നത് മുൻകരുതലല്ല.",
        truth: "ഓരോ മാസവും നിങ്ങൾക്കും മറ്റുള്ളവർക്കും ഇടയിൽ വർദ്ധിച്ചുവരുന്ന വലിയൊരു വിടവാണ്.",
      },
      {
        myth: "\"എനിക്ക് സാങ്കേതികവിദ്യ വലിയ വശമില്ല\" എന്നത് ഒരു പരിമിതിയല്ല.",
        truth: "ഇതുവരെ ആരും ലളിതമായി പഠിപ്പിച്ചു തരാത്ത ഒരു സ്കിൽ മാത്രമാണത്.",
      },
    ],
    perspectiveCallout: "നല്ല വാർത്ത: നിങ്ങൾ സാങ്കേതിക വിദഗ്ദ്ധനാകേണ്ടതില്ല. നിങ്ങൾക്ക് വേണ്ടത് Easy AI ആണ്.",

    // Steps (How it works)
    stepsBadge: "HOW IT WORKS",
    stepsTitle: "➡️ എങ്ങനെ പ്രവർത്തിക്കുന്നു",
    steps: [
      {
        step: "1",
        title: "₹99 അടച്ച് രജിസ്റ്റർ ചെയ്യൂ.",
        desc: "",
      },
      {
        step: "2",
        title: "Zoom വഴി Live ജോയിൻ ചെയ്യൂ.",
        desc: "നോൺ-ടെക് പ്രൊഫഷണലുകൾക്കായി തയ്യാറാക്കിയ 90 മിനിറ്റ് ഹാൻഡ്‌സ്-ഓൺ AI ബേസിക്സ്. സാങ്കേതിക പദങ്ങളോ മുൻകൂട്ടി റെക്കോർഡ് ചെയ്ത ക്ലാസുകളോ ഇല്ല.",
      },
      {
        step: "3",
        title: "നാളെ മുതൽ പ്രയോഗിക്കാവുന്ന പുതിയ സ്കിൽസ്.",
        desc: "റെഡി-ടു-യൂസ് പ്രോംപ്റ്റുകളും എളുപ്പത്തിൽ തുടങ്ങാനുള്ള ലളിതമായ വഴികളും.",
      },
    ],

    // 90 Minutes of Easy AI for Working Professionals (5 Outcomes)
    outcomesBadge: "5 പ്രധാന നേട്ടങ്ങൾ",
    outcomesTitle: "ജോലിക്കാർക്കായി 90 മിനിറ്റ് Easy AI",
    outcomesSubtitle: "Start Simple. Save Time. Use AI With Confidence.",
    outcomes: [
      {
        number: "Outcome 1",
        title: "AI സാധ്യതകളും പരിമിതികളും",
        desc: "Understand what AI can and can't do, without the hype. അനാവശ്യ ഹൈപ്പുകളോ തെറ്റിദ്ധാരണകളോ ഇല്ലാതെ AI കൊണ്ട് എന്തൊക്കെ ചെയ്യാൻ കഴിയും, എന്തൊക്കെ കഴിയില്ല എന്ന് വ്യക്തമായി മനസ്സിലാക്കാം.",
      },
      {
        number: "Outcome 2",
        title: "ഫലപ്രദമായ പ്രോംപ്റ്റിംഗ് രീതികൾ",
        desc: "Write prompts that give useful answers the first time. ആദ്യശ്രമത്തിൽ തന്നെ ഏറ്റവും മികച്ചതും കൃത്യവുമായ ഉത്തരങ്ങൾ നൽകുന്ന പ്രോംപ്റ്റുകൾ എഴുതാൻ പഠിക്കാം.",
      },
      {
        number: "Outcome 3",
        title: "വിവിധ തൊഴിൽ മേഖലകൾക്ക് അനുയോജ്യമായ വഴികൾ",
        desc: "Teachers: plan lessons, create worksheets and save grading time. Doctors: draft patient communication and documentation faster. Other professionals: handle emails, reports and research.",
      },
      {
        number: "Outcome 4",
        title: "ഏറ്റവും മികച്ച 2–3 സുരക്ഷിത ടൂളുകൾ",
        desc: "Know which 2-3 AI tools are worth your time, and use them safely. നിങ്ങളുടെ സമയം ലാഭിക്കാൻ ഉപകരിക്കുന്ന ഏറ്റവും മികച്ച 2-3 AI ടൂളുകൾ സുരക്ഷിതമായി ഉപയോഗിക്കാം.",
      },
      {
        number: "Outcome 5",
        title: "അടുത്ത ദിവസം തന്നെ തുടങ്ങാവുന്ന AI റൂട്ടീൻ",
        desc: "Leave with your first AI routine, ready to start the next day. അടുത്ത ദിവസം തന്നെ നിങ്ങളുടെ ജോലിയിൽ പ്രാവർത്തികമാക്കാവുന്ന വ്യക്തമായ ഒരു AI വർക്ക്‌ഫ്ലോയുമായി ക്ലാസ്സ് അവസാനിപ്പിക്കാം.",
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
    formSubmitHint: "ഔദ്യോഗിക രജിസ്ട്രേഷൻ • 90 മിനിറ്റ് ലൈവ് + സ്റ്റഡി ഗൈഡുകൾ",
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
    receiptBadge: "രജിസ്ട്രേഷൻ & പേയ്‌മെന്റ് വിജയകരം",
    receiptTitle: "AI Easy Ayi-ലേക്ക് സ്വാഗതം!",
    receiptThankYou: "നന്ദി",
    receiptReservedMsg: "നിങ്ങളുടെ സീറ്റ് വിജയകരമായി ബുക്ക് ചെയ്തിട്ടുണ്ട്.",
    receiptRefId: "റഫറൻസ് ഐഡി",
    receiptPaymentId: "പേയ്‌മെന്റ് ഐഡി",
    receiptPhone: "മൊബൈൽ നമ്പർ",
    receiptPlace: "സ്ഥലം",
    receiptQualification: "പശ്ചാത്തലം",
    receiptStatus: "പേയ്‌മെന്റ് സ്റ്റാറ്റസ്",
    receiptPaidText: "₹99 അടച്ചു (സ്ഥിരീകരിച്ചു)",
    receiptSession: "സെഷൻ തിയതി",
    receiptTime: "സമയം",
    receiptFormat: "ക്ലാസ്സ് രീതി",
    receiptFormatVal: "Zoom വഴി Live ഇന്ററാക്ടീവ് ക്ലാസ്സ്",
    receiptJoinCommunity: "ഔദ്യോഗിക WhatsApp ഗ്രൂപ്പിൽ ചേരുക",
    receiptJoinCommunitySub: "Zoom ലിങ്ക്, പ്രോംപ്റ്റ് ഗൈഡുകൾ, അപ്‌ഡേറ്റുകൾ എന്നിവ ഇവിടെ ലഭിക്കും",
    receiptDownloadPdf: "രസീത് ഡൗൺലോഡ് ചെയ്യുക (PDF)",
    receiptDownloadPdfLoading: "രസീത് തയ്യാറാക്കുന്നു...",
    receiptDownloadPdfSub: "ഔദ്യോഗിക ഇൻവോയ്സും വർക്ക്‌ഷോപ്പ് പാസും",
    receiptExplorePrograms: "മറ്റ് AI പ്രോഗ്രാമുകൾ കാണുക",
    receiptExploreProgramsSub: "DeepStaq-ന്റെ 6-Month AI/ML ഡിപ്ലോമ & ബൂസ്റ്റർ കോഴ്സുകൾ",
    receiptNeedSupport: "സഹായം വേണോ? (WhatsApp)",
    receiptNewReg: "മറ്റൊരാളെ രജിസ്റ്റർ ചെയ്യുക",

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
      { prefix: "90-Minute Live", highlight: "Hands-On Workshop" },
      { prefix: "Simple Explanations", highlight: "Live Q&A Support" },
      { prefix: "Free Bonus", highlight: "Prompt Cheat Sheets" },
    ],

    // Video Section
    videoHeading: "Watch the 2-Minute Preview",
    videoSubheading: "Discover everything you will experience and build during the interactive masterclass.",

    // Perspective Shifts (Hard Truths)
    perspectiveBadge: "HARD TRUTHS",
    perspectiveHeading: "Nobody Is Going to Tell You This. So I Will.",
    perspectiveCards: [
      {
        myth: "Spending hours on emails, notes and paperwork isn't dedication.",
        truth: "It's time AI could give back to you.",
      },
      {
        myth: "“AI is for tech people” isn't caution.",
        truth: "It's a gap that grows every month.",
      },
      {
        myth: "“I'm not good with technology” isn't a limit.",
        truth: "It's just a skill nobody taught you yet.",
      },
    ],
    perspectiveCallout: "Good news: You don't need to be technical. You need Easy AI.",

    // Steps (How it works)
    stepsBadge: "HOW IT WORKS",
    stepsTitle: "➡️ How it works",
    steps: [
      {
        step: "1",
        title: "Register for ₹99.",
        desc: "",
      },
      {
        step: "2",
        title: "Join live on Zoom.",
        desc: "90 minutes of hands on AI basics, built for non-tech professionals. No jargon, no pre-recorded content.",
      },
      {
        step: "3",
        title: "Leave with skills you can use tomorrow.",
        desc: "Ready to use prompts and a simple way to start.",
      },
    ],

    // 90 Minutes of Easy AI for Working Professionals (5 Outcomes)
    outcomesBadge: "5 CONCRETE OUTCOMES",
    outcomesTitle: "90 Minutes of Easy AI for Working Professionals",
    outcomesSubtitle: "Start Simple. Save Time. Use AI With Confidence.",
    outcomes: [
      {
        number: "Outcome 1",
        title: "No-Hype AI Understanding",
        desc: "Understand what AI can and can't do, without the hype.",
      },
      {
        number: "Outcome 2",
        title: "First-Time-Right Prompts",
        desc: "Write prompts that give useful answers the first time.",
      },
      {
        number: "Outcome 3",
        title: "Workflows for Teachers, Doctors & Professionals",
        desc: "Teachers: plan lessons, create worksheets and save grading time. Doctors: draft patient communication and documentation faster. Other professionals: handle emails, reports and research.",
      },
      {
        number: "Outcome 4",
        title: "2–3 Safe & Proven Tools",
        desc: "Know which 2-3 AI tools are worth your time, and use them safely.",
      },
      {
        number: "Outcome 5",
        title: "Your First Daily AI Routine",
        desc: "Leave with your first AI routine, ready to start the next day.",
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
    formSubmitHint: "Official DeepStaq Registration • 90 Minutes Live + Study Guides",
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
    receiptBadge: "REGISTRATION & PAYMENT CONFIRMED",
    receiptTitle: "Welcome to AI Easy Ayi!",
    receiptThankYou: "Thank you",
    receiptReservedMsg: "Your masterclass seat has been successfully reserved.",
    receiptRefId: "Reference ID",
    receiptPaymentId: "Payment ID",
    receiptPhone: "Mobile Number",
    receiptPlace: "Place / City",
    receiptQualification: "Background",
    receiptStatus: "Payment Status",
    receiptPaidText: "₹99 Paid (Confirmed)",
    receiptSession: "Session Date",
    receiptTime: "Time",
    receiptFormat: "Class Format",
    receiptFormatVal: "Live Interactive Workshop on Zoom",
    receiptJoinCommunity: "Join Official WhatsApp Community",
    receiptJoinCommunitySub: "Zoom meeting link, prompt guides & bonus materials will be shared here",
    receiptDownloadPdf: "Download Payment Receipt (PDF)",
    receiptDownloadPdfLoading: "Generating Receipt...",
    receiptDownloadPdfSub: "Official tax invoice & workshop admission pass",
    receiptExplorePrograms: "Explore Other AI Programs",
    receiptExploreProgramsSub: "DeepStaq's 6-Month AI/ML Diploma & AI Booster courses",
    receiptNeedSupport: "Need Support? (WhatsApp)",
    receiptNewReg: "Register Another Person",

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

const getFullSessionDateFormatted = (lang = "ml") => {
  const target = getBatchDateTime();
  const year = target.getFullYear();
  if (lang === "ml") {
    return `നവംബർ 7, ${year}`;
  }
  return `November 7th, ${year}`;
};

export default function AiEasyAyi() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const seatsLeft = useSeatsCountdown(10, 3);

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

  const fullSessionDateFormatted = getFullSessionDateFormatted(lang);

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
      doc.setFillColor(250, 0, 88); // #fa0058 DeepStaq Neon Magenta
      doc.rect(0, 0, 210, 6, "F");

      // 2. Brand Header (Logo & Company Title)
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
      doc.setFillColor(235, 253, 243); // soft emerald tint
      doc.roundedRect(20, 44, 170, 12, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(16, 120, 64);
      doc.text("STATUS: PAYMENT CONFIRMED & SEAT RESERVED (PAID INR 99.00)", 25, 51.5);

      // 4. Registration Details Box
      doc.setDrawColor(220, 224, 235);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(20, 62, 170, 98, 3, 3, "D");

      // Box Header
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
        { label: "Program", value: "AI Easy Ayi (90-Min Live Interactive Masterclass)" },
        { label: "Class Schedule", value: `${fullSessionDateFormatted} • 5:00 PM – 7:00 PM IST` },
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

      // 5. Next Steps / Instructions Box
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
      doc.text("1. Join the Official WhatsApp Community immediately for the Zoom meeting link and updates.", 26, 183);
      doc.text("2. Meeting credentials and access guides will be posted in the community 2 hours before session.", 26, 189);
      doc.text("3. Keep a laptop or smartphone with internet connection ready for hands-on activities.", 26, 195);
      doc.text("4. Prompt templates and summary cheat sheets will be distributed directly after the class.", 26, 201);
      doc.text("5. For any inquiries or support, contact +91 9495957011 or email admissions@deepstaq.in.", 26, 207);

      // 6. Security & Verification Footer
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(140, 145, 160);
      doc.text("Authorized Computer-Generated Receipt • No Signature Required • DeepStaq Academy", 105, 258, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(160, 165, 180);
      doc.text("DeepStaq Academy, Kannur & Kochi, Kerala | Support: +91 9495957011 | https://deepstaq.in", 105, 263, { align: "center" });

      // Save PDF
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

      // Meta Pixel Lead tracking
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq("track", "Lead", {
          content_name: "AI Easy Ayi Registration",
          value: 99,
          currency: "INR",
        });
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
        description: "AI easy Ayi - 90 Mins Live Class (5:00 PM - 6:30 PM IST)",
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
              registeredAt: new Date().toLocaleDateString(lang === "ml" ? "ml-IN" : "en-IN", {
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
                initial={{ opacity: 0, scale: 0.96, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-[#090D11]/90 border border-white/20 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] max-w-3xl mx-auto relative overflow-hidden"
              >
                {/* Accent top gradient stripe */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#184cef] via-[#fa0058] to-[#c6ff34]" />

                {/* Header Badge & Title */}
                <div className="flex items-center gap-4 mb-5 pt-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] text-2xl font-black shadow-[0_0_24px_rgba(37,211,102,0.4)] shrink-0">
                    ✓
                  </div>
                  <div>
                    <span className="text-[11px] font-mono tracking-widest text-[#25D366] uppercase font-bold block">
                      {t.receiptBadge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {t.receiptTitle}
                    </h2>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                  {t.receiptThankYou}{" "}
                  <strong className="text-white font-semibold">
                    {submittedData.fullName}
                  </strong>
                  . {t.receiptReservedMsg}
                </p>

                {/* Registration Details Grid */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 sm:p-5 my-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                  <div className="flex flex-col gap-0.5 border-b border-white/5 sm:border-b-0 pb-2 sm:pb-0">
                    <span className="text-[10px] uppercase text-slate-400 font-bold">{t.receiptRefId}</span>
                    <span className="text-white font-bold text-sm text-[#ff337d]">{submittedData.id}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 border-b border-white/5 sm:border-b-0 pb-2 sm:pb-0">
                    <span className="text-[10px] uppercase text-slate-400 font-bold">{t.receiptStatus}</span>
                    <span className="text-emerald-400 font-bold">{t.receiptPaidText}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 border-b border-white/5 sm:border-b-0 pb-2 sm:pb-0">
                    <span className="text-[10px] uppercase text-slate-400 font-bold">{t.receiptSession}</span>
                    <span className="text-white font-semibold">{fullSessionDateFormatted}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 border-b border-white/5 sm:border-b-0 pb-2 sm:pb-0">
                    <span className="text-[10px] uppercase text-slate-400 font-bold">{t.receiptTime}</span>
                    <span className="text-white font-semibold">5:00 PM – 7:00 PM IST</span>
                  </div>
                  <div className="flex flex-col gap-0.5 border-b border-white/5 sm:border-b-0 pb-2 sm:pb-0">
                    <span className="text-[10px] uppercase text-slate-400 font-bold">{t.receiptFormat}</span>
                    <span className="text-sky-300 font-semibold">{t.receiptFormatVal}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase text-slate-400 font-bold">{t.receiptPaymentId}</span>
                    <span className="text-slate-300 font-mono truncate">{submittedData.paymentId || "Confirmed"}</span>
                  </div>
                </div>

                {/* PRIMARY ACTIONS */}
                <div className="space-y-3 pt-1">
                  {/* 1. Official WhatsApp Community Button */}
                  <a
                    href="https://chat.whatsapp.com/KxVV7ep74TV0GHy5SU2FXl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-5 sm:px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-bold text-sm tracking-wide flex items-center justify-between gap-3 transition-all shadow-[0_8px_30px_rgba(37,211,102,0.4)] group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
                        </svg>
                      </div>
                      <div className="text-left min-w-0">
                        <div className="font-extrabold text-sm sm:text-base text-white leading-tight">
                          {t.receiptJoinCommunity}
                        </div>
                        <div className="text-xs text-white/90 font-normal truncate sm:whitespace-normal">
                          {t.receiptJoinCommunitySub}
                        </div>
                      </div>
                    </div>
                    <span className="text-xl group-hover:translate-x-1.5 transition-transform shrink-0">→</span>
                  </a>

                  {/* 2. Download Official PDF Receipt Button */}
                  <button
                    type="button"
                    onClick={handleDownloadReceipt}
                    disabled={isGeneratingPdf}
                    className="w-full py-4 px-5 sm:px-6 rounded-2xl bg-white/[0.05] hover:bg-white/[0.10] border border-white/20 hover:border-[#fa0058]/50 text-white font-bold text-sm tracking-wide flex items-center justify-between gap-3 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(250,0,88,0.25)] cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[#fa0058]/20 border border-[#fa0058]/40 flex items-center justify-center shrink-0 text-[#ff337d]">
                        {isGeneratingPdf ? (
                          <div className="w-5 h-5 border-2 border-[#ff337d] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="text-left min-w-0">
                        <div className="font-extrabold text-sm sm:text-base text-white leading-tight">
                          {isGeneratingPdf ? t.receiptDownloadPdfLoading : t.receiptDownloadPdf}
                        </div>
                        <div className="text-xs text-slate-300 font-normal truncate sm:whitespace-normal">
                          {t.receiptDownloadPdfSub}
                        </div>
                      </div>
                    </div>
                    <span className="text-xl text-[#ff337d] group-hover:translate-y-0.5 transition-transform shrink-0">↓</span>
                  </button>
                </div>

                {/* 3. EXPLORE OTHER PROGRAMS SECTION */}
                <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-[#184cef] uppercase font-bold block">
                        NEXT LEVEL CAREER PATHWAYS
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-white">
                        {t.receiptExplorePrograms}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {t.receiptExploreProgramsSub}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleExplorePrograms("/programs")}
                      className="py-2.5 px-5 bg-gradient-to-r from-[#184cef] to-[#fa0058] hover:opacity-95 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_20px_rgba(24,76,239,0.35)] flex items-center justify-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <span>{lang === "ml" ? "എല്ലാ പ്രോഗ്രാമുകളും" : "View All Programs"}</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Program Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div 
                      onClick={() => handleExplorePrograms("/ai-course")}
                      className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#184cef]/50 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                          6-Month Diploma • Online & Offline
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                          AI & Machine Learning Builder
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          From Python fundamentals to Agentic AI, RAG & LLMs. Live classroom / online with industry mentorship.
                        </p>
                      </div>
                      <div className="text-xs font-bold text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>{lang === "ml" ? "വിശദാംശങ്ങൾ കാണുക" : "Explore Program"}</span>
                        <span>→</span>
                      </div>
                    </div>

                    <div 
                      onClick={() => handleExplorePrograms("/ai-booster-program")}
                      className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#fa0058]/50 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-[#ff337d] uppercase tracking-wider">
                          Advanced Fast-Track Cohort
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                          AI Booster Program
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Accelerate productivity with cutting-edge GenAI workflows, automations, and enterprise AI tools.
                        </p>
                      </div>
                      <div className="text-xs font-bold text-[#ff337d] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>{lang === "ml" ? "വിശദാംശങ്ങൾ കാണുക" : "Explore Program"}</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. SECONDARY ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/10 mt-6">
                  <a
                    href={`https://wa.me/918075727195?text=${encodeURIComponent(
                      `Hi DeepStaq! I registered and paid ₹99 for AI easy Ayi. Name: ${submittedData.fullName} (Ref: ${submittedData.id})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 text-center text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
                    </svg>
                    <span>{t.receiptNeedSupport}</span>
                  </a>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-3 px-4 text-center text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl transition-colors cursor-pointer"
                  >
                    {t.receiptNewReg}
                  </button>
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
                <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-[repeat(5,auto)] gap-y-6 sm:gap-y-8 md:gap-y-4 lg:gap-y-5 md:gap-x-6 lg:gap-x-12 xl:gap-x-16 items-center">

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
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f90058] via-fuchsia-200 to-[#184cef]">
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
                    className="order-4 col-span-1 md:col-start-8 md:col-span-5 md:row-start-1 md:row-end-6 flex justify-center items-center my-1 sm:my-2 md:my-0 relative md:self-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#184cef]/30 to-[#f90058]/25 blur-3xl rounded-full pointer-events-none hidden md:block -z-10" />
                    <AdVideoSection
                      videoId="r5Q_3yerIJs"
                      title="DeepStaq AI easy Ayi Video"
                      targetFormId="registration-form"
                      originalPrice={899}
                      offerPrice={99}
                      onGoToForm={handleScrollToForm}
                      seatsLeft={seatsLeft}
                    />
                  </motion.div>

                  {/* 5. Feature Badges (Row 4 on left) */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="order-5 col-span-1 md:col-start-1 md:col-span-7 md:row-start-4 flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 pt-1"
                  >
                    {t.heroPills.map((pill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/[0.05] border border-white/15 hover:border-white/30 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all duration-300"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#fa0058] animate-pulse" />
                        <span>{pill}</span>
                      </span>
                    ))}
                  </motion.div>

                  {/* 6. CTA Actions & Limited Seats (Row 5 on left) */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="order-6 col-span-1 md:col-start-1 md:col-span-7 md:row-start-5 flex flex-col items-center md:items-start justify-center gap-3 pt-1 w-full"
                  >
                    {/* Limited Seats Live Section */}
                    <div className="w-full max-w-md lg:max-w-lg">
                      <LimitedSeatsSection seatsLeft={seatsLeft} lang={lang} variant="hero" />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-2.5 sm:gap-4 w-full sm:w-auto">
                      {/* Primary CTA */}
                      <button
                        type="button"
                        onClick={handleScrollToForm}
                        className="w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#fa0058] hover:bg-[#e0004f] active:scale-95 text-white font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 sm:gap-2.5 cursor-pointer transition-all hover:scale-[1.02] group shadow-[0_4px_20px_rgba(250,0,88,0.4)]"
                      >
                        <span className="text-center">{t.heroCtaPrimary}</span>
                        <span className="font-mono text-white/70 line-through text-xs shrink-0">
                          {t.heroOriginalPrice}
                        </span>
                        <span className="font-bold transition-transform duration-200 group-hover:translate-x-1 shrink-0">
                          →
                        </span>
                      </button>

                      {/* Secondary WhatsApp Button */}
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Chat on WhatsApp"
                        className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-4 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 backdrop-blur-md flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_28px_rgba(16,185,129,0.4)] hover:scale-[1.02] cursor-pointer"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
                        </svg>
                        <span>{lang === "ml" ? "WhatsApp വഴി സംസാരിക്കാം" : "Chat on WhatsApp"}</span>
                      </a>
                    </div>
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
                                    ? "bg-[#fa0058] text-white font-bold border-[#fa0058] shadow-[0_2px_14px_rgba(250,0,88,0.35)]"
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
                      <div className="pt-3 space-y-3">
                        {/* Limited Seats Section in Registration Form */}
                        <LimitedSeatsSection seatsLeft={seatsLeft} lang={lang} variant="form" />

                        <button
                          type="submit"
                          disabled={loading}
                          className={`w-full py-4 px-6 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                            loading
                              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                              : "bg-[#fa0058] hover:bg-[#e0004f] text-white shadow-[0_4px_28px_rgba(250,0,88,0.45)] hover:scale-[1.01]"
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
                  1. PERSPECTIVE SHIFTS: NOBODY IS GOING TO TELL YOU THIS
                 ══════════════════════════════════════════════════════════ */}
              <section className="space-y-6 pt-2 max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-[#ff337d] uppercase tracking-widest block mb-1">
                      {t.perspectiveBadge || "HARD TRUTHS"}
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                      {t.perspectiveHeading}
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                    DeepStaq AI easy Ayi
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                  {t.perspectiveCards.map((card, idx) => (
                    <div
                      key={idx}
                      className="p-6 lg:p-7 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-[#f90058]/50 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between hover:-translate-y-1 group relative overflow-hidden"
                    >
                      <div className="space-y-4">
                        {/* Top: The common misconception */}
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            ✕
                          </span>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                            {card.myth}
                          </p>
                        </div>

                        <div className="w-full border-t border-white/10" />

                        {/* Bottom: The liberating truth */}
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                            ✓
                          </span>
                          <p className="text-sm sm:text-base font-bold text-white group-hover:text-fuchsia-200 transition-colors leading-snug">
                            {card.truth}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Callout Conclusion Banner */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#f90058]/15 via-white/[0.04] to-[#184cef]/15 border border-[#f90058]/40 backdrop-blur-xl shadow-[0_0_30px_rgba(249,0,88,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f90058] to-[#184cef] flex items-center justify-center text-white text-lg shadow-[0_0_16px_rgba(249,0,88,0.5)] flex-shrink-0">
                      ✨
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg font-extrabold text-white">
                      {t.perspectiveCallout}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleScrollToForm}
                    className="px-6 py-2.5 rounded-full bg-[#fa0058] hover:bg-[#e0004f] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_2px_16px_rgba(250,0,88,0.4)] cursor-pointer whitespace-nowrap flex-shrink-0 hover:scale-105"
                  >
                    ₹99 Pass →
                  </button>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════════════
                  2. HOW IT WORKS (3 Simple Steps)
                 ══════════════════════════════════════════════════════════ */}
              <section className="space-y-6 pt-2 max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                    {t.stepsTitle}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                  {t.steps.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-6 lg:p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-[#f90058]/40 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.3)] group flex flex-col justify-between hover:-translate-y-1 h-full min-h-[170px]"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="w-10 h-10 rounded-xl bg-[#f90058]/15 border border-[#f90058]/30 text-[#ff4382] font-mono font-black text-base flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(249,0,88,0.25)]">
                            {item.step}
                          </span>
                          <span className="w-2.5 h-2.5 rounded-full bg-[#184cef]/50 group-hover:bg-[#f90058] transition-colors" />
                        </div>
                        <h3 className="text-base lg:text-lg font-bold text-white group-hover:text-pink-300 transition-colors leading-snug">
                          {item.title}
                        </h3>
                        {item.desc && (
                          <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed font-normal">
                            {item.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ══════════════════════════════════════════════════════════
                  3. 90 MINUTES OF EASY AI FOR WORKING PROFESSIONALS (5 OUTCOMES)
                 ══════════════════════════════════════════════════════════ */}
              <section className="space-y-6 max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                <div className="border-b border-white/10 pb-4">
                  <span className="text-xs font-mono text-[#ff337d] uppercase tracking-widest block mb-1">
                    {t.outcomesBadge}
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                    {t.outcomesTitle}
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-300 mt-1 font-medium">
                    {t.outcomesSubtitle}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
                  {t.outcomes.map((card, idx) => {
                    const isRoleCard = idx === 2; // Outcome 3 has teachers/doctors breakdown
                    return (
                      <div
                        key={idx}
                        className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] p-6 lg:p-7 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-[#fa0058]/40 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.3)] group space-y-3 hover:-translate-y-1 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-amber-300 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 inline-flex items-center gap-1.5 shadow-sm">
                              <span className="text-sm">🏆</span>
                              <span className="uppercase tracking-wider">{card.number}</span>
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#fa0058] group-hover:scale-125 transition-transform" />
                          </div>

                          <h3 className="text-base lg:text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                            {card.title}
                          </h3>

                          <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed font-normal">
                            {card.desc}
                          </p>
                        </div>

                        {isRoleCard && (
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                            <span className="px-2.5 py-1 rounded-lg bg-pink-500/15 border border-pink-500/30 text-[11px] font-mono text-pink-300">
                              👩‍🏫 Teachers
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
                              👨‍⚕️ Doctors
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-500/30 text-[11px] font-mono text-sky-300">
                              💼 Working Professionals
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ══════════════════════════════════════════════════════════
                  TARGET AUDIENCE (WHO IS THIS FOR)
                 ══════════════════════════════════════════════════════════ */}
              <section className="space-y-5 max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                    {t.audienceTitle}
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-400 mt-1">
                    {t.audienceSubtitle}
                  </p>
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
                  EASY AI BRANDING / LOGO SHOWCASE
                 ══════════════════════════════════════════════════════════ */}
              <section className="relative py-12 sm:py-16 lg:py-20 px-4 flex flex-col items-center justify-center text-center">
                {/* Background ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] lg:w-[650px] h-[250px] sm:h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(249,0,88,0.25)_0%,rgba(24,76,239,0.2)_50%,transparent_70%)] blur-[100px] pointer-events-none -z-10" />

                <div
                  onClick={handleScrollToForm}
                  className="relative group cursor-pointer transition-transform duration-300 hover:scale-105"
                  title="Click to register"
                >
                  <img
                    src={easyAiImg}
                    alt="എ.ഐ ഈസി ആയി - Easyai by deepstaq"
                    className="w-72 sm:w-88 md:w-[420px] lg:w-[480px] max-w-full h-auto object-contain mx-auto drop-shadow-[0_15px_45px_rgba(249,0,88,0.35)] group-hover:drop-shadow-[0_20px_55px_rgba(249,0,88,0.55)] transition-all duration-300"
                  />
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
              <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto pointer-events-auto bg-[#090D11]/95 border border-white/15 backdrop-blur-2xl rounded-2xl sm:rounded-full p-2 px-3 sm:p-2.5 sm:px-5 flex items-center justify-between gap-1.5 sm:gap-4 shadow-[0_16px_50px_rgba(0,0,0,0.75)]">
                
                {/* Left Side: Title, Pricing & Seats */}
                <div className="min-w-0 flex-1 flex items-center gap-1.5 sm:gap-2.5 flex-nowrap overflow-hidden">
                  <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight whitespace-nowrap shrink-0">
                    {t.stickyTitle}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono shrink-0">
                    <span className="text-[#ff337d] font-extrabold text-xs sm:text-xs whitespace-nowrap">
                      {t.stickyPriceNote}
                    </span>
                    <span className="line-through text-slate-500 text-[10px] sm:text-[11px] whitespace-nowrap hidden min-[360px]:inline">
                      {t.stickyOriginal}
                    </span>
                  </span>

                  {/* Live Limited Seats Pill in Sticky Bar */}
                  <div className="shrink-0">
                    <LimitedSeatsSection seatsLeft={seatsLeft} lang={lang} variant="sticky" />
                  </div>
                </div>

                {/* Right Side: Primary CTA Button */}
                <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
                  {/* Primary Action Button */}
                  <button
                    type="button"
                    onClick={handleScrollToForm}
                    className="py-2 px-3 sm:px-5 bg-[#fa0058] hover:bg-[#e0004f] active:scale-95 text-white font-black text-xs sm:text-xs uppercase tracking-wider rounded-full transition-all shadow-[0_2px_16px_rgba(250,0,88,0.4)] cursor-pointer whitespace-nowrap flex-shrink-0"
                  >
                    <span className="hidden sm:inline">{t.stickyBtn}</span>
                    <span className="sm:hidden">{t.stickyBtnMobile || (lang === "ml" ? "രജിസ്റ്റർ" : "Register")}</span>
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