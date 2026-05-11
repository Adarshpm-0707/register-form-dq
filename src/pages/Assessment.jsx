import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Background3D from "../components/Background3D";
import { updateAptitudeScore } from "../services/dbService";

const QUESTIONS = [
  {
    question: "Which of the following is NOT an example of Artificial Intelligence?",
    options: ["A recommendation system suggesting movies on Netflix", "A light bulb turning on when you flip a switch", "A self-driving car detecting obstacles on the road", "A spam filter sorting unwanted emails"],
    answer: "B"
  },
  {
    question: "Which of the following is an everyday example of AI?",
    options: ["A calculator solving math problems", "A voice assistant like Siri or Alexa answering questions", "A fan switching on automatically with a timer", "A television remote changing channels"],
    answer: "B"
  },
  {
    question: "What is a chatbot?",
    options: ["A program that simulates human conversation through text or voice", "A robot that physically assists humans", "A device that stores large amounts of data", "A tool that scans documents and converts them to text"],
    answer: "A"
  },
  {
    question: "Which of the following best describes what a dataset is?",
    options: ["A set of instructions written for a computer program", "A collection of data used to train or test a machine learning model", "The hardware required to run an AI system", "A type of programming language used in AI"],
    answer: "B"
  },
  {
    question: "Which of the following is something AI currently does well?",
    options: ["Feeling emotions and empathy", "Making moral decisions independently", "Recognizing patterns in large amounts of data", "Understanding sarcasm perfectly in all languages"],
    answer: "C"
  },
  {
    question: "What is the main difference between Artificial Intelligence and traditional computer programming?",
    options: ["Traditional programming is faster than AI", "AI can only work with images, traditional programming works with all data types", "Traditional programming follows fixed rules written by humans, while AI learns from data to make decisions", "AI requires internet access, traditional programming does not"],
    answer: "C"
  },
  {
    question: "What is a neural network inspired by?",
    options: ["The layout of computer circuits", "The structure of the human brain", "The behavior of search engines", "The logic of spreadsheets"],
    answer: "B"
  },
  {
    question: "What is the difference between supervised and unsupervised learning?",
    options: ["Supervised learning uses images, unsupervised learning uses text", "Supervised learning trains on labeled data, unsupervised learning finds patterns in unlabeled data", "Supervised learning requires more computing power than unsupervised learning", "Unsupervised learning is more accurate than supervised learning"],
    answer: "B"
  },
  {
    question: "An AI is trained to play a video game. Every time it scores points, it receives a positive signal, and every time it loses a life, it receives a negative signal. What type of learning is this?",
    options: ["Supervised Learning", "Unsupervised Learning", "Transfer Learning", "Reinforcement Learning"],
    answer: "D"
  },
  {
    question: "Which of the following best describes 'overfitting' in a machine learning model?",
    options: ["The model trains too slowly due to large data volumes", "The model performs well on training data but poorly on new, unseen data", "The model uses too many features and crashes the system", "The model requires more labeled data than is available"],
    answer: "B"
  },
  {
    question: "What does 'natural language processing' (NLP) allow AI systems to do?",
    options: ["Render 3D images from text descriptions", "Understand, interpret, and generate human language", "Translate programming languages into machine code", "Process audio signals from microphones"],
    answer: "B"
  },
  {
    question: "Which of the following is a potential ethical concern with AI systems?",
    options: ["AI systems consume too much electricity to be affordable", "AI models can inherit and amplify biases present in their training data", "AI cannot be used in healthcare or legal industries", "AI always makes decisions that are fair and transparent"],
    answer: "B"
  },
  {
    question: "In a language model, what does the 'attention mechanism' help the model do?",
    options: ["Run faster on low-memory devices", "Focus on the most relevant words in the input when generating a response", "Reduce the size of the training dataset needed", "Convert text into numerical data before processing"],
    answer: "B"
  },
  {
    question: "What is the vanishing gradient problem in deep neural networks?",
    options: ["The model forgets earlier training data over time", "Gradients become very small during training, making it hard for earlier layers to learn", "The model uses too much memory and slows down", "The loss value grows too large and destabilizes training"],
    answer: "B"
  },
  {
    question: "What is the difference between a hyperparameter and a model parameter in machine learning?",
    options: ["Hyperparameters are learned from data; model parameters are set manually", "Hyperparameters are settings chosen before training (like learning rate), while model parameters are values learned from data during training (like weights)", "Both are the same \u2014 they refer to the model's internal weights", "Hyperparameters control the dataset; model parameters control the output format"],
    answer: "B"
  }
];

const Icons = {
  Timer: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  CheckCircle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )
};

export default function Assessment() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [isFinishing, setIsFinishing] = useState(false);
  const [leadId, setLeadId] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("aptitude_lead_id");
    if (!storedId) navigate("/aptitude-test");
    else setLeadId(storedId);
  }, [navigate]);

  const handleFinish = useCallback(async () => {
    if (isFinishing) return;
    setIsFinishing(true);

    let score = 0;
    QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) score++;
    });

    const accuracy = Math.round((score / QUESTIONS.length) * 100);

    try {
      if (leadId) {
        await updateAptitudeScore(leadId, { score, accuracy, totalQuestions: QUESTIONS.length });
      }
      localStorage.setItem("test_result", JSON.stringify({ score, total: QUESTIONS.length, accuracy }));
      navigate("/aptitude-test/result");
    } catch (err) {
      console.error("Save Error:", err);
      navigate("/aptitude-test/result");
    }
  }, [selectedAnswers, leadId, navigate, isFinishing]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleFinish]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelect = (idx) => {
    // LOCK ANSWER: Don't allow change if already selected
    if (selectedAnswers[currentQuestion]) return;
    
    const letter = String.fromCharCode(65 + idx);
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: letter });
  };

  const q = QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen bg-[#050521] text-white flex flex-col relative overflow-hidden">
      <Background3D />
      
      <nav className="h-20 md:h-24 border-b border-white/5 flex items-center justify-between px-6 md:px-12 sticky top-0 bg-[#050521]/80 backdrop-blur-2xl z-50">
        <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase">
          DeepStaq <span className="text-[#c6ff34]">Aptitude</span>
        </h1>
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-2xl">
          <Icons.Timer className="w-4 h-4 md:w-6 md:h-6 text-[#c6ff34]" />
          <span className="text-base md:text-2xl font-black tabular-nums">{formatTime(timeLeft)}</span>
        </div>
      </nav>

      <main className="relative z-10 flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 md:py-16">
        
        {/* Navigation Grid */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-16">
          {QUESTIONS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestion(idx)}
              className={`h-10 w-10 md:h-14 md:w-14 rounded-lg md:rounded-2xl font-black text-xs md:text-lg border transition-all flex items-center justify-center
                ${currentQuestion === idx ? "bg-[#c6ff34] text-[#050521] border-[#c6ff34] shadow-[0_0_20px_rgba(198,255,52,0.3)]" : 
                  selectedAnswers[idx] ? "bg-[#c6ff34]/10 text-[#c6ff34] border-[#c6ff34]/30" : 
                  "bg-white/5 text-white/20 border-white/10 hover:border-white/30"}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="space-y-8 md:space-y-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 md:space-y-12"
            >
              <div className="space-y-4">
                <span className="text-[#c6ff34] font-black text-[10px] md:text-xs uppercase tracking-[0.5em]">Question 0{currentQuestion + 1}</span>
                <h3 className="text-2xl md:text-5xl font-black tracking-tight leading-tight">
                  {q.question}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3 md:gap-6">
                {q.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = selectedAnswers[currentQuestion] === letter;
                  const isLocked = selectedAnswers[currentQuestion] !== undefined;

                  return (
                    <motion.button
                      key={idx}
                      whileHover={!isLocked ? { scale: 1.005 } : {}}
                      onClick={() => handleSelect(idx)}
                      disabled={isLocked}
                      className={`relative w-full p-5 md:p-8 rounded-2xl md:rounded-[32px] border transition-all text-left flex items-center gap-4 md:gap-8 group overflow-hidden
                        ${isSelected ? "bg-[#c6ff34]/10 border-[#c6ff34]" : "bg-white/[0.02] border-white/10"}
                        ${isLocked && !isSelected ? "opacity-50 grayscale-[0.5]" : ""}
                      `}
                    >
                      <div className={`w-8 h-8 md:w-14 md:h-14 rounded-xl md:rounded-[24px] flex-shrink-0 flex items-center justify-center font-black text-xs md:text-2xl border transition-all
                        ${isSelected ? "bg-[#c6ff34] text-[#050521] border-[#c6ff34]" : "bg-white/5 text-white/40 border-white/10"}
                      `}>
                        {letter}
                      </div>
                      <span className={`text-sm md:text-2xl font-bold ${isSelected ? "text-white" : "text-slate-400"}`}>
                        {option}
                      </span>
                      {isSelected && (
                        <div className="absolute right-6 md:right-12 bg-[#c6ff34] text-[#050521] px-3 py-1 rounded-full text-[8px] md:text-xs font-black uppercase tracking-widest">
                          Locked
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8 pt-8">
            <div className="flex gap-4 flex-grow">
               <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="flex-1 py-4 md:py-8 bg-white/5 border border-white/10 text-white font-black text-[10px] md:text-lg uppercase tracking-widest rounded-2xl md:rounded-[32px] hover:bg-white/10 disabled:opacity-20 transition-all"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(QUESTIONS.length - 1, prev + 1))}
                disabled={currentQuestion === QUESTIONS.length - 1}
                className="flex-1 py-4 md:py-8 bg-white/5 border border-white/10 text-white font-black text-[10px] md:text-lg uppercase tracking-widest rounded-2xl md:rounded-[32px] hover:bg-white/10 disabled:opacity-20 transition-all"
              >
                Skip Question
              </button>
            </div>
            
            {currentQuestion === QUESTIONS.length - 1 ? (
              <button
                onClick={handleFinish}
                disabled={isFinishing}
                className="w-full md:w-1/3 py-4 md:py-8 bg-[#c6ff34] text-[#050521] font-black text-[10px] md:text-xl uppercase tracking-widest rounded-2xl md:rounded-[32px] shadow-[0_20px_50px_rgba(198,255,52,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {isFinishing ? "Syncing..." : "Finalize Test"}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(QUESTIONS.length - 1, prev + 1))}
                className="w-full md:w-1/3 py-4 md:py-8 bg-white text-[#050521] font-black text-[10px] md:text-xl uppercase tracking-widest rounded-2xl md:rounded-[32px] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Next Question
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
