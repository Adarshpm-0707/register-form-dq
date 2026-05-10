import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { questions } from "../services/assessmentData";
import Background3D from "../components/Background3D";
import { updateAptitudeScore } from "../services/dbService";

const Icons = {
  Clock: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  ChevronRight: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  ),
  CheckCircle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Info: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  )
};

export default function Assessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const leadId = location.state?.leadId;
  const userData = location.state?.userData;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(35 * 60);

  useEffect(() => {
    if (!leadId) {
      navigate("/aptitude-test");
    }
  }, [leadId, navigate]);

  const calculateScore = React.useCallback(() => {
    let score = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) score++;
    });
    return score;
  }, [selectedAnswers]);

  const finishTest = React.useCallback(async () => {
    setIsFinished(true);
    
    const score = calculateScore();
    const percentage = ((score / questions.length) * 100).toFixed(1);

    try {
      if (leadId) {
        await updateAptitudeScore(leadId, {
          score: score,
          totalQuestions: questions.length,
          accuracy: percentage
        });
      }
    } catch (error) {
      console.error("Error saving results:", error);
    }
  }, [leadId, calculateScore]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelect = (optionIndex) => {
    const optionLetter = String.fromCharCode(65 + optionIndex);
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: optionLetter });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishTest();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      finishTest();
    }
  }, [timeLeft, isFinished, finishTest]);

  if (isFinished) {
    const score = calculateScore();
    const percentage = ((score / questions.length) * 100).toFixed(1);

    return (
      <div className="min-h-screen bg-[#050521] text-white flex items-center justify-center p-4 relative overflow-hidden">
        <Background3D />
        <div className="absolute inset-0 bg-[#050521]/60 backdrop-blur-sm z-0" />
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-2xl bg-[#050521] border border-white/10 p-6 md:p-12 rounded-[32px] md:rounded-[48px] backdrop-blur-3xl text-center shadow-2xl border-t-[#c6ff34] border-t-2">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#c6ff34]/10 flex items-center justify-center text-[#c6ff34] mx-auto mb-6 md:mb-8 border border-[#c6ff34]/20">
            <Icons.CheckCircle className="w-8 h-8 md:w-12 md:h-12" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Successful</h2>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
            <div className="p-4 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[8px] md:text-[10px] font-black text-[#c6ff34] tracking-[0.3em] uppercase mb-2">RAW_SCORE</p>
              <p className="text-3xl md:text-4xl font-black">{score}/{questions.length}</p>
            </div>
            <div className="p-4 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[8px] md:text-[10px] font-black text-[#c6ff34] tracking-[0.3em] uppercase mb-2">PRECISION</p>
              <p className="text-3xl md:text-4xl font-black">{percentage}%</p>
            </div>
          </div>


          <div className="space-y-4 md:space-y-6">
            <motion.a 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              href="https://chat.whatsapp.com/GQhN1xlCb1eG0v79JH8vJO"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 md:py-6 bg-white/5 border border-[#c6ff34]/30 text-[#c6ff34] font-black text-xs sm:text-lg md:text-xl uppercase tracking-widest sm:tracking-tighter rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 hover:bg-[#c6ff34]/10 transition-all"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              JOIN OUR WHATSAPP GROUP
            </motion.a>

            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={() => navigate("/")} 
              className="w-full py-5 md:py-7 bg-white/5 border border-white/10 text-white/40 font-black text-xs md:text-sm uppercase tracking-[0.4em] rounded-2xl hover:text-[#ff3b3b] hover:border-[#ff3b3b]/30 transition-all flex items-center justify-center gap-3 group"
            >
              TERMINATE & RETURN HOME
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#050521] text-white selection:bg-[#c6ff34]/30 relative overflow-hidden flex flex-col">
      <Background3D />
      
      <header className="fixed top-0 left-0 w-full z-20 px-4 py-4 md:px-12 md:py-6 flex justify-between items-center bg-[#050521]/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <div className="text-[8px] md:text-[10px] font-black tracking-[0.3em] text-[#c6ff34] flex-shrink-0">LIVE_SYNC</div>
          <div className="h-3 w-[1px] bg-white/10 flex-shrink-0" />
          <div className="text-[8px] md:text-[10px] font-black tracking-[0.3em] text-white/40 truncate max-w-[120px] sm:max-w-none">{userData?.name?.toUpperCase()}</div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
          <div className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/[0.03] border border-white/10">
            <Icons.Clock className="w-3 h-3 md:w-4 md:h-4 text-[#c6ff34]" />
            <span className="text-xs md:text-sm font-black tabular-nums">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow pt-24 md:pt-36 pb-32 px-4 sm:px-6 max-w-4xl mx-auto w-full flex flex-col">
        
        <div className="mb-6 md:mb-12">
          <div className="flex justify-between items-end mb-3 md:mb-4">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">Question {currentQuestion + 1}<span className="text-white/20">/{questions.length}</span></span>
            <span className="text-[10px] font-black text-[#c6ff34] tracking-[0.2em]">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 md:h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-[#c6ff34] shadow-[0_0_15px_rgba(198,255,52,0.5)]" />
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6 md:space-y-12">
              <h3 className="text-lg sm:text-2xl md:text-4xl font-black leading-tight tracking-tight">
                {q.question}
              </h3>

              <div className="grid grid-cols-1 gap-2.5 md:gap-4">
                {q.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = selectedAnswers[currentQuestion] === letter;
                  
                  return (
                    <motion.button key={idx} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }} onClick={() => handleSelect(idx)} className={`relative w-full p-4 md:p-8 rounded-xl md:rounded-[28px] border transition-all text-left flex items-center gap-3 md:gap-6 group overflow-hidden ${isSelected ? "bg-[#c6ff34]/10 border-[#c6ff34] shadow-[0_0_20px_rgba(198,255,52,0.1)]" : "bg-white/[0.02] border-white/10 hover:border-white/30"}`}>
                      <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-xs md:text-lg border transition-all ${isSelected ? "bg-[#c6ff34] text-[#050521] border-[#c6ff34]" : "bg-white/5 text-white/40 border-white/10 group-hover:border-white/30"}`}>
                        {letter}
                      </div>
                      <span className={`text-sm md:text-xl font-bold flex-grow pr-6 md:pr-10 ${isSelected ? "text-white" : "text-slate-400"}`}>
                        {option}
                      </span>
                      {isSelected && (
                        <div className="absolute right-4 md:right-8">
                          <Icons.CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-[#c6ff34]" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full z-20 bg-gradient-to-t from-[#050521] via-[#050521] to-transparent pt-12 pb-6 px-4 md:px-12">
        <div className="max-w-4xl mx-auto flex items-center gap-3 md:gap-4">
          <button onClick={prevQuestion} disabled={currentQuestion === 0} className="px-5 md:px-10 py-3.5 md:py-5 rounded-lg md:rounded-2xl border border-white/10 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-all bg-[#050521]/80 backdrop-blur-md">
            PREV
          </button>
          
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={nextQuestion} disabled={!selectedAnswers[currentQuestion]} className="flex-grow py-3.5 md:py-6 bg-[#c6ff34] text-[#050521] font-black text-[10px] md:text-xs uppercase tracking-[0.3em] rounded-lg md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_10px_30px_rgba(198,255,52,0.2)]">
            {currentQuestion === questions.length - 1 ? "FINALIZE_SYNC" : "NEXT_STEP"}
            <Icons.ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
          </motion.button>
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-2 opacity-30 pointer-events-none">
          <Icons.Info className="w-2.5 h-2.5 text-[#c6ff34]" />
          <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em]">Sync_Protocol: ACTIVE | Secure_ID: {leadId?.slice(-6)}</span>
        </div>
      </div>
    </div>
  );
}
