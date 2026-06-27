import React from "react";
import { motion } from "framer-motion";
import vrHeroImg from "../assets/vr_hero_ai_builder.png";

export default function HeroVRSection() {
  return (
    <div className="relative w-full max-w-[550px] sm:max-w-[750px] lg:max-w-[1100px] aspect-square flex items-center justify-center select-none scale-[1.45] sm:scale-[1.65] lg:scale-[2.1] transition-transform duration-300">
      {/* Background Radial Neon Glow Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#ff2a85]/30 via-[#00f0ff]/20 to-[#c6ff34]/25 rounded-full blur-3xl opacity-80 pointer-events-none" />

      {/* One-time Page Reload Entrance Animation: Starts at screen bottom and slides up to fixed position */}
      <motion.div
        initial={{ y: 250, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1], // Smooth custom cubic-bezier ease-out
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <img
          src={vrHeroImg}
          alt="AI Developer VR Holographic Workspace"
          className="w-[125%] h-[125%] max-w-none object-contain filter drop-shadow-[0_25px_50px_rgba(0,240,255,0.3)]"
        />
      </motion.div>
    </div>
  );
}
