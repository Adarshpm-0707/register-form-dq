import React from "react";
import { motion } from "framer-motion";
import vrHeroImg from "../assets/vr_hero_ai_builder.png";

export default function HeroVRSection() {
  return (
    <div className="relative w-full max-w-[480px] sm:max-w-[640px] lg:max-w-[850px] xl:max-w-[960px] aspect-square flex items-center justify-center select-none scale-110 sm:scale-115 lg:scale-120 xl:scale-125 transition-transform duration-300 mx-auto -my-2 sm:my-0">
      {/* Background Radial Neon Glow Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#ff2a85]/25 via-[#00f0ff]/18 to-[#c6ff34]/22 rounded-full blur-2xl md:blur-3xl opacity-80 pointer-events-none" />

      {/* One-time Page Reload Entrance Animation: Starts at screen bottom and slides up to fixed position */}
      <motion.div
        initial={{ y: 180, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1.3,
          ease: [0.16, 1, 0.3, 1], // Smooth cubic-bezier ease-out
        }}
        className="relative w-full h-full flex items-center justify-center overflow-visible"
      >
        <img
          src={vrHeroImg}
          alt="AI Developer VR Holographic Workspace"
          className="w-full h-full object-contain filter drop-shadow-[0_25px_50px_rgba(0,240,255,0.35)] hover:scale-105 transition-transform duration-500"
        />
      </motion.div>
    </div>
  );
}
