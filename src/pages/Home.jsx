// ─────────────────────────────────────────────────────
//  pages/Home.jsx
//  Interactive 3D Hero + Registration Section
// ─────────────────────────────────────────────────────

import React, { useEffect, useState, useRef } from "react";
import RegistrationForm from "../components/RegistrationForm";
import Mascot3D from "../components/Mascot3D";

function Home() {
  const [mounted, setMounted] = useState(false);
  const formSectionRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 selection:text-white overflow-x-hidden">
      
      {/* ── BACKGROUND LAYER (Fixed) ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-cyan-600/[0.02] blur-[150px] rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* ── SECTION 1: HERO (Animation & Text) ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 z-10">
        <div className={`w-full container mx-auto flex flex-col items-center justify-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Mascot Section */}
          <div className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[650px] aspect-square relative mb-6 md:mb-8 lg:mb-10">
             <Mascot3D />
             <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-32 sm:w-60 lg:w-80 h-10 bg-cyan-500/10 blur-3xl rounded-full -z-10" />
          </div>

          {/* Hero Text - Fully Responsive */}
          <header className="text-center w-full max-w-5xl px-4 mx-auto">
             <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter mb-4 md:mb-6 lg:mb-8 leading-[0.9] sm:leading-[0.85] bg-gradient-to-r from-white via-cyan-100 to-white/60 bg-clip-text text-transparent uppercase italic">
                JOIN THE <br className="block" /> EVOLUTION
             </h1>
             <p className="text-slate-400 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium mb-8 sm:mb-10 lg:mb-14 max-w-[90%] sm:max-w-2xl mx-auto leading-relaxed">
                Step into the future of tech education with our advanced professional programs.
             </p>

             {/* Registration Button (CTA) */}
             <button 
                onClick={scrollToForm}
                className="group relative px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 bg-cyan-500 rounded-full font-black text-[#020617] text-xs sm:text-sm lg:text-base uppercase tracking-[0.2em] transition-all hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] active:scale-95"
             >
                Start Registration
                <div className="absolute -inset-1 bg-cyan-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
             </button>
          </header>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 hidden sm:flex">
           <span className="text-[9px] tracking-[0.3em] font-bold uppercase">Scroll Down</span>
           <div className="w-px h-10 lg:h-16 bg-white/50" />
        </div>
      </section>

      {/* ── SECTION 2: FORM SECTION ── */}
      <section ref={formSectionRef} className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 py-20 lg:py-32 bg-black/40 backdrop-blur-3xl z-10">
         <div className="w-full container mx-auto flex flex-col items-center">
            
            {/* Form Section Text */}
            <div className="mb-10 md:mb-12 lg:mb-16 text-center px-4">
               <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-4 uppercase leading-tight">
                  Registration Portal
               </h2>
               <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-xl mx-auto">
                  Please fill out the details below to initialize your sync.
               </p>
            </div>

            <div className="w-full max-w-4xl px-2">
              {/* Responsive Glass Form Card */}
              <div className="
                bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-3xl 
                rounded-[28px] sm:rounded-[40px] lg:rounded-[48px] border border-white/20 
                shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] 
                p-[1px]
              ">
                 <div className="bg-[#020617]/80 rounded-[27px] sm:rounded-[39px] lg:rounded-[47px] p-5 sm:p-8 md:p-12 lg:p-16">
                    <RegistrationForm />
                 </div>
              </div>
            </div>
         </div>
      </section>

      {/* Decorative vertical label - Hidden on smaller screens */}
      <div className="fixed bottom-12 left-8 text-[9px] text-white/10 font-black uppercase tracking-[0.5em] rotate-90 origin-left hidden xl:block select-none pointer-events-none">
         Core Protocol // EDUCATION v5.1
      </div>
    </div>
  );
}

export default Home;