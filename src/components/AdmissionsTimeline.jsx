import React from "react";
import { motion } from "framer-motion";

const timelineData = [
  {
    step: "01",
    phase: "Phase 1: Reserve Slot",
    title: "Secure Registration",
    details: "Reserve your seat batches. Fill out registration details, complete slot pre-payment, and secure your batch synchronization key."
  },
  {
    step: "02",
    phase: "Phase 2: Onboarding",
    title: "Portal Access",
    details: "Gain instant access to our active community Slack ecosystem, customized notebooks, and environment setting guides."
  },
  {
    step: "03",
    phase: "Phase 3: Live Orientation",
    title: "Briefing Sync",
    details: "Meet your core batch mates and mentors in a live onboarding sprint. Align your workspace and plan your timeline goals."
  },
  {
    step: "04",
    phase: "Phase 4: Coding Sprints",
    title: "Curriculum Kickoff",
    details: "Dive into sequential coding modules. Construct models, participate in group build challenges, and deploy live code weekly."
  },
  {
    step: "05",
    phase: "Phase 5: Graduation",
    title: "Portfolio Certification",
    details: "Consolidate and showcase your production models. Present your final capstone dashboard to the panel and graduate."
  }
];

export default function AdmissionsTimeline() {
  return (
    <div className="w-full max-w-5xl mx-auto mt-20 md:mt-28 font-mono">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="text-[10px] font-black text-[#050521]/60 uppercase tracking-[0.5em]">Enrollment_Pipeline_Protocol</div>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#050521]">
          Admissions <span className="underline decoration-[#c6ff34] decoration-4 underline-offset-4">Protocol</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        {timelineData.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-slate-50 border border-slate-200/80 rounded-[28px] p-6 shadow-md flex flex-col justify-between relative group hover:border-[#050521]/15 hover:shadow-lg transition-all duration-300 min-h-[260px]"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-[#050521] bg-[#c6ff34] uppercase tracking-widest px-2 py-0.5 rounded">
                  Step {item.step}
                </span>
                <span className="text-2xl font-black text-[#050521]/15 group-hover:text-[#050521] transition-colors">
                  {item.step}
                </span>
              </div>
              <h3 className="text-base font-black text-[#050521] uppercase leading-snug">
                {item.title}
              </h3>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed mt-4">
              {item.details}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
