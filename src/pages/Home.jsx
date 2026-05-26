import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Background3D from "../components/Background3D";
import Footer from "../components/Footer";



// Premium SVG Icons
const Icons = {
  Star: ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="currentColor"/>
    </svg>
  )
};

const TerminalLine = ({ text, delay = 0 }) => {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.1, delay: delay * 0.2 }}
      className="text-slate-400 text-xs md:text-sm leading-relaxed"
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.01, delay: (delay * 0.2) + (i * 0.01) }}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
};



export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050521] text-white selection:bg-[#c6ff34]/30">
      <Background3D />
      <Navbar />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(198,255,52,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,255,52,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none -z-10" />

      {/* Hero Content Wrapper */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-24 md:pt-32 pb-16 md:pb-24 flex flex-col items-center">
        
        {/* Top Section: Title (Left) and Description (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-16 md:mb-20 w-full">
          
          {/* Title Section */}
          <motion.div 

            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start"
          >
            <h1 className="text-[2.85rem] xs:text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-[6.5rem] font-black leading-[1.0] tracking-tighter uppercase text-center lg:text-left">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#c6ff34] to-white/60 relative inline-block">
                EVERYONE DESERVES 
              </span> 
              <br />
              <span className="text-white">TO KNOW AI</span>
            </h1>
          </motion.div>

          {/* Description Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 relative z-10 group max-w-lg mx-auto lg:mx-0 w-full"
          >
             <div className="absolute -inset-1 bg-gradient-to-r from-[#c6ff34]/20 to-transparent rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative p-6 md:p-10 rounded-[28px] md:rounded-[40px] bg-white/[0.02] border-l-4 border-[#c6ff34] backdrop-blur-3xl shadow-2xl">
                <p className="text-white font-black text-lg md:text-2xl tracking-tight leading-snug mb-4 uppercase">
                   No background in tech? <br className="hidden sm:block" /> <span className="text-[#c6ff34]">No problem.</span>
                </p>
                <p className="text-slate-400 text-sm md:text-lg leading-relaxed font-medium">
                   The <span className="text-white font-bold">AI/ML diploma by Deepstaq</span> is built for fresher students and beginners in AI. 
                   Learn by doing, graduate with a project portfolio.
                </p>
             </div>

             <Link to="/slot" className="relative z-20 block w-full mt-8 md:mt-10">
               <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 md:px-14 py-4 md:py-7 rounded-xl md:rounded-[24px] bg-[#c6ff34] text-[#050521] font-black text-lg md:text-2xl uppercase tracking-tighter hover:shadow-[0_0_50px_rgba(198,255,52,0.4)] transition-all flex items-center justify-center gap-4 group"
               >
                  Book Your Slot
                  <Icons.Star className="w-5 h-5 md:w-8 md:h-8 group-hover:rotate-90 transition-transform duration-500" />
               </motion.button>
             </Link>
          </motion.div>
        </div>



        {/* AI/ML Professional Diploma Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl mt-16 md:mt-24"
        >
          <div className="flex flex-col items-center text-center space-y-4 mb-10 md:mb-16">
             <div className="text-[10px] font-black text-[#c6ff34] uppercase tracking-[0.5em]">Academic_Core_Syllabus</div>
             <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter">AI/ML PROFESSIONAL <span className="text-[#c6ff34]">DIPLOMA</span></h2>
          </div>

          <div className="w-full rounded-2xl md:rounded-[32px] bg-[#050521] border border-white/10 shadow-2xl overflow-hidden font-mono">
            {/* Terminal Header */}
            <div className="bg-white/5 px-4 md:px-6 py-3 md:py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex gap-1.5 md:gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="text-[8px] md:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">bash — diploma_protocol — 80x24</div>
              <div className="w-10" />
            </div>

            {/* Terminal Body */}
            <div className="p-6 md:p-12 space-y-8 md:space-y-12 text-left">
              <div className="space-y-2 md:space-y-4">
                <div className="flex items-center gap-2 text-[#c6ff34]">
                  <span className="text-white/40">root@deepstaq:~#</span>
                  <span className="font-bold text-sm md:text-xl">syllabus.md</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pl-4 md:pl-8 border-l border-white/5">
                  <div className="space-y-2">
                    <h4 className="text-[#c6ff34] font-black text-base md:text-2xl uppercase tracking-tight flex items-center gap-3">
                      <span className="text-white/20">01</span> AI (Artificial Intelligence)
                    </h4>
                    <TerminalLine delay={1} text="Designing intelligent systems that simulate human cognitive functions for complex problem-solving and decision-making." />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-[#c6ff34] font-black text-base md:text-2xl uppercase tracking-tight flex items-center gap-3">
                      <span className="text-white/20">02</span> GenAI (Generative AI)
                    </h4>
                    <TerminalLine delay={2} text="Mastering Large Language Models (LLMs), image synthesis, and multi-modal creative AI automation pipelines." />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[#c6ff34] font-black text-base md:text-2xl uppercase tracking-tight flex items-center gap-3">
                      <span className="text-white/20">03</span> Machine Learning
                    </h4>
                    <TerminalLine delay={3} text="Implementing advanced statistical models that allow systems to learn patterns and adapt from historical data without explicit programming." />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[#c6ff34] font-black text-base md:text-2xl uppercase tracking-tight flex items-center gap-3">
                      <span className="text-white/20">04</span> Deep Learning
                    </h4>
                    <TerminalLine delay={4} text="Architecting multi-layered artificial neural networks designed for high-precision image, speech, and sequence recognition." />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[#c6ff34] font-black text-base md:text-2xl uppercase tracking-tight flex items-center gap-3">
                      <span className="text-white/20">05</span> Data Science
                    </h4>
                    <TerminalLine delay={5} text="Processing and analyzing massive datasets to extract actionable insights and predictive intelligence for industry applications." />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[#c6ff34] font-black text-base md:text-2xl uppercase tracking-tight flex items-center gap-3">
                      <span className="text-white/20">06</span> Prompt Engineering
                    </h4>
                    <TerminalLine delay={6} text="Learning the art and science of high-precision LLM instruction design to maximize output accuracy and system efficiency." />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[#c6ff34] font-black text-base md:text-2xl uppercase tracking-tight flex items-center gap-3">
                      <span className="text-white/20">07</span> Python Programming
                    </h4>
                    <TerminalLine delay={7} text="Mastering the industry-standard language for AI, including specialized libraries like PyTorch, TensorFlow, and Pandas." />
                  </div>
                </div>
              </div>

              <div className="pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-2 text-[#c6ff34] animate-pulse">
                  <span className="text-white/40">root@deepstaq:~#</span>
                  <span className="w-2 h-4 md:w-3 md:h-6 bg-[#c6ff34]" />
                </div>
                
                <Link to="/slot" className="relative z-20 block w-full md:w-auto">
                  <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="w-full sm:w-auto px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-[18px] bg-[#c6ff34] text-[#050521] font-black text-sm md:text-lg uppercase tracking-tighter hover:shadow-[0_0_30px_rgba(198,255,52,0.4)] transition-all flex items-center justify-center gap-3 group"
                  >
                     Book Your Slot
                     <Icons.Star className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-500" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Location Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-5xl mt-16 md:mt-24 space-y-8 md:space-y-12"
        >
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="text-[10px] font-black text-[#c6ff34] uppercase tracking-[0.5em]">Geospatial_Synchronization</div>
             <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter">Visit <span className="text-[#c6ff34]">Us</span></h2>
          </div>

          <div className="relative group p-0.5 md:p-3 rounded-[28px] md:rounded-[56px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-br from-[#c6ff34]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             <iframe 
                title="DeepStaq Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d345.1010860007865!2d75.37608783658978!3d11.879088254920028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba4416f1b71991b%3A0x5863b746bbeab982!2sAleefconcepts!5e0!3m2!1sen!2sin!4v1779429880932!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '20px', filter: 'grayscale(1) invert(0.9) contrast(1.2)' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="relative z-10 w-full min-h-[250px] md:min-h-[450px]"
             ></iframe>
             
             {/* Map Overlay Decor */}
             <div className="absolute top-4 right-4 md:top-10 md:right-10 z-20 px-3 md:px-6 py-1.5 md:py-3 rounded-full bg-[#050521]/80 backdrop-blur-md border border-white/10 text-[7px] md:text-[10px] font-black uppercase tracking-widest text-[#c6ff34]">
                GPS_LOCKED
             </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}