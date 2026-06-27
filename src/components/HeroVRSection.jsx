import React from "react";
import { motion } from "framer-motion";
import vrHeroImg from "../assets/vr_hero_ai_builder.png";

export default function HeroVRSection() {
  return (
    <div className="relative w-full max-w-[450px] sm:max-w-[600px] lg:max-w-[850px] aspect-square flex items-center justify-center select-none scale-[1.2] sm:scale-[1.35] lg:scale-[1.3] transition-transform duration-300">
      {/* Background Radial Neon Glow Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#ff2a85]/25 via-[#00f0ff]/18 to-[#c6ff34]/22 rounded-full blur-3xl opacity-75 pointer-events-none" />

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
          className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,240,255,0.3)]"
        />
      </motion.div>
    </div>
  );
}
