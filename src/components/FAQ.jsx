import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "Do I need previous AI/ML experience to join?",
    answer: "No prior machine learning experience is required, but you should have a solid foundation in programming (preferably Python). We start from mathematical basics and PyTorch fundamentals before moving to complex models."
  },
  {
    question: "What is the commitment format?",
    answer: "This is a 6-week intensive cohort. Expect to dedicate 10-15 hours per week for live session sprints, peer feedback reviews, and programming models."
  },
  {
    question: "Will I get certified upon completion?",
    answer: "Yes, you will receive a verifiable digital cryptographic portfolio certification listing your completed model builds, verified code repositories, and capstone deployment."
  },
  {
    question: "Is there support during builds?",
    answer: "Absolutely. You will have daily Slack check-ins with batch mentors, interactive office hours, and collaborative live programming reviews."
  }
];

function FAQItem({ faq, isOpen, toggleOpen }) {
  return (
    <div className="border-b border-slate-200/80 py-5">
      <button
        onClick={toggleOpen}
        className="w-full flex justify-between items-center text-left py-2 font-mono group"
      >
        <span className="text-sm font-black text-[#050521] uppercase tracking-tight group-hover:text-blue-650 transition-colors">
          {faq.question}
        </span>
        <span className={`text-lg font-black text-[#050521]/60 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-slate-500 text-xs font-mono leading-relaxed pt-2 pb-4">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white border border-slate-200/80 rounded-[32px] p-8 shadow-md">
      {faqData.map((faq, i) => (
        <FAQItem
          key={i}
          faq={faq}
          isOpen={openIndex === i}
          toggleOpen={() => handleToggle(i)}
        />
      ))}
    </div>
  );
}
