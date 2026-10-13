import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * AdVideoSection Component
 * Uses a pure iframe embed approach for guaranteed autoplay on every page refresh.
 * - No YouTube API / no React StrictMode double-mount issues
 * - Video autoplays muted (browser policy) and immediately unmutes via postMessage
 * - Register button appears after 5 seconds
 * - Replay button shown when video ends
 * - No loop
 */
export default function AdVideoSection({
  videoId = "r5Q_3yerIJs",
  title = "deepstack AD QR",
  targetFormId = "registration-form",
  originalPrice = 899,
  offerPrice = 99,
  onGoToForm,
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [showRegisterOverlay, setShowRegisterOverlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showReplay, setShowReplay] = useState(false);

  const iframeRef = useRef(null);
  const playStartRef = useRef(null);
  const isPlayingRef = useRef(false);
  const iframeId = `yt-player-${videoId}`;

  // Send postMessage command to YouTube iframe
  const cmd = (func, args = "") => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;
    try {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*"
      );
    } catch (e) {}
  };

  // Unmute and play
  const unmute = () => {
    cmd("unMute");
    cmd("setVolume", [100]);
    setIsMuted(false);
  };

  const handleScrollToForm = () => {
    if (typeof onGoToForm === "function") onGoToForm();
    setTimeout(() => {
      const el = document.getElementById(targetFormId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => {
          const inp = el.querySelector("input");
          if (inp) inp.focus();
        }, 300);
      }
    }, 120);
  };

  const handleToggleSound = (e) => {
    e.stopPropagation();
    if (isMuted) {
      unmute();
    } else {
      cmd("mute");
      setIsMuted(true);
    }
  };

  const handleReplay = (e) => {
    e.stopPropagation();
    setShowReplay(false);
    setShowRegisterOverlay(false);
    setCurrentTime(0);
    playStartRef.current = Date.now();
    isPlayingRef.current = true;
    cmd("seekTo", [0, true]);
    cmd("playVideo");
    cmd("unMute");
    cmd("setVolume", [100]);
    setIsMuted(false);
  };

  useEffect(() => {
    // Send postMessage unmute commands immediately on mount and on a short interval
    // so that as soon as autoplay starts the audio is unmuted
    unmute();
    const unmuteRetries = [100, 300, 700, 1500, 3000].map((delay) =>
      setTimeout(() => unmute(), delay)
    );

    // GUARANTEED 5-second register button: show after 5s from mount regardless of postMessage events
    const registerTimer = setTimeout(() => {
      setShowRegisterOverlay(true);
    }, 5000);

    // Listen for any user interaction and unmute
    const onInteract = () => unmute();
    const events = ["mousemove", "touchstart", "scroll", "click", "pointerdown", "keydown"];
    events.forEach((e) => {
      window.addEventListener(e, onInteract, { passive: true });
      document.addEventListener(e, onInteract, { passive: true });
    });

    // Listen to YouTube postMessage events for state tracking
    const onMessage = (e) => {
      try {
        const msg = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (!msg || !msg.info) return;

        // Player state
        if (msg.info.playerState === 1) {
          // Playing
          isPlayingRef.current = true;
          if (!playStartRef.current) playStartRef.current = Date.now();
          unmute();
        } else if (msg.info.playerState === 2) {
          // Paused — browser may pause on refresh, force resume once
          isPlayingRef.current = false;
        } else if (msg.info.playerState === 0) {
          // Ended
          isPlayingRef.current = false;
          setShowReplay(true);
          setShowRegisterOverlay(true);
        }

        // Track time
        if (typeof msg.info.currentTime === "number") {
          const cur = msg.info.currentTime;
          setCurrentTime(cur);
          if (cur >= 5) setShowRegisterOverlay(true);
        }
        if (typeof msg.info.duration === "number" && msg.info.duration > 0) {
          setDuration(msg.info.duration);
          if (msg.info.currentTime >= msg.info.duration - 0.5) {
            setShowReplay(true);
            setShowRegisterOverlay(true);
            isPlayingRef.current = false;
          }
        }

        // If browser reported muted, unmute
        if (msg.info.muted === true) unmute();
      } catch (err) {}
    };
    window.addEventListener("message", onMessage);

    // Polling for time-based 5s register overlay fallback
    const poll = setInterval(() => {
      if (playStartRef.current && isPlayingRef.current) {
        const elapsed = Date.now() - playStartRef.current;
        if (elapsed >= 5000) setShowRegisterOverlay(true);
      }
    }, 500);

    return () => {
      unmuteRetries.forEach((t) => clearTimeout(t));
      clearTimeout(registerTimer);
      clearInterval(poll);
      window.removeEventListener("message", onMessage);
      events.forEach((e) => {
        window.removeEventListener(e, onInteract);
        document.removeEventListener(e, onInteract);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={unmute}
      onMouseEnter={unmute}
      onTouchStart={unmute}
      className="w-full flex flex-col items-center justify-center pt-4 sm:pt-8 md:pt-10 mb-8 sm:mb-12 relative px-2 sm:px-4"
    >
      <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-[#c6ff34]/25 via-emerald-400/20 to-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full flex flex-col items-center justify-center"
      >
        {/* Phone frame */}
        <div className="relative w-full max-w-[340px] xs:max-w-[360px] sm:max-w-[380px] md:max-w-[390px] aspect-[9/16] max-h-[76vh] sm:max-h-[660px] lg:max-h-[680px] bg-[#050521] rounded-[2rem] sm:rounded-[2.5rem] border-3 sm:border-4 border-[#050521] shadow-[0_20px_50px_rgba(5,5,33,0.3),0_10px_25px_rgba(198,255,52,0.18)] overflow-hidden mx-auto">

          {/* Sound toggle */}
          <div className="absolute top-4 right-4 z-30">
            <button
              type="button"
              onClick={handleToggleSound}
              className="w-8 h-8 bg-[#050521]/80 hover:bg-[#050521] border border-white/20 hover:border-[#c6ff34] text-[#c6ff34] rounded-full flex items-center justify-center text-xs shadow-md cursor-pointer transition-all hover:scale-105"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          </div>

          {/* YouTube Iframe — autoplay=1 mute=1 guarantees browser play; we unmute via postMessage */}
          <iframe
            ref={iframeRef}
            id={iframeId}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&enablejsapi=1&rel=0&modestbranding=1&controls=1`}
            title={title}
            frameBorder="0"
            allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            playsInline
            loading="eager"
            className="w-full h-full object-cover"
            onLoad={() => {
              // Send unmute immediately and with retries after iframe loads
              unmute();
              [100, 300, 600, 1200, 2500].forEach((d) => setTimeout(() => unmute(), d));
            }}
          />

          {/* Register button overlay — appears after 5 seconds */}
          <AnimatePresence>
            {showRegisterOverlay && !showReplay && (
              <motion.div
                key="register-overlay"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.9 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                className="absolute bottom-5 left-3 right-3 z-30 p-3.5 bg-[#050521]/95 backdrop-blur-xl rounded-2xl border-2 border-[#c6ff34] shadow-[0_10px_35px_rgba(198,255,52,0.4)] text-center"
              >
                <div className="text-[10px] font-mono font-black uppercase text-[#c6ff34] tracking-wider mb-1 flex items-center justify-center gap-1.5">
                  <span className="animate-bounce">⚡</span>
                  <span>Seats Filling Fast • Only ₹{offerPrice}</span>
                </div>
                <button
                  type="button"
                  onClick={handleScrollToForm}
                  className="w-full py-3.5 px-4 bg-[#c6ff34] hover:bg-[#b8f526] text-[#050521] rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-200 border-2 border-[#050521] shadow-[3px_3px_0px_0px_#ffffff] hover:shadow-[1px_1px_0px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base group-hover:scale-125 transition-transform">🚀</span>
                    <span className="font-extrabold">REGISTER NOW</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="line-through text-slate-500 text-xs">₹{originalPrice}</span>
                    <span className="bg-[#050521] text-[#c6ff34] px-2 py-0.5 rounded text-xs font-black">₹{offerPrice}</span>
                    <span className="text-[#050521] font-black group-hover:translate-y-0.5 transition-transform">↓</span>
                  </div>
                </button>
                <p className="mt-1.5 text-[10px] text-slate-300 font-medium">
                  Tap to jump directly to the registration form
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replay overlay when video ends */}
          <AnimatePresence>
            {showReplay && (
              <motion.div
                key="replay-overlay"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 z-40 bg-[#050521]/95 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center text-white"
              >
                <div className="w-14 h-14 rounded-full bg-[#c6ff34] border-2 border-[#050521] flex items-center justify-center text-2xl text-[#050521] mb-2 shadow-[0_0_20px_rgba(198,255,52,0.45)]">
                  ✓
                </div>
                <div className="space-y-1 mb-5">
                  <span className="text-[10px] font-mono font-black uppercase text-[#c6ff34] tracking-widest">
                    Video Completed
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">Ready to Join?</h3>
                  <p className="text-xs text-slate-300 font-medium max-w-[260px] mx-auto">
                    Book your seat now for ₹{offerPrice} or replay the preview video.
                  </p>
                </div>
                <div className="w-full max-w-[280px] space-y-2.5">
                  <button
                    type="button"
                    onClick={handleScrollToForm}
                    className="w-full py-3.5 px-4 bg-[#c6ff34] hover:bg-[#b8f526] text-[#050521] rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 border-2 border-[#050521] shadow-[3px_3px_0px_0px_#ffffff] hover:shadow-[1px_1px_0px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-base group-hover:scale-125 transition-transform">🚀</span>
                      <span className="font-extrabold">REGISTER NOW</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="line-through text-slate-600 text-[10px]">₹{originalPrice}</span>
                      <span className="bg-[#050521] text-[#c6ff34] px-1.5 py-0.5 rounded text-[10px] font-black">₹{offerPrice}</span>
                      <span className="text-[#050521] font-black">→</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={handleReplay}
                    className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white hover:text-[#c6ff34] rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 border border-white/20 hover:border-[#c6ff34] flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <svg className="w-4 h-4 fill-current group-hover:rotate-180 transition-transform duration-500" viewBox="0 0 24 24">
                      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                    </svg>
                    <span>Replay Video</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#050521] z-20 overflow-hidden">
            {duration > 0 && (
              <div
                className="h-full bg-[#c6ff34] transition-all duration-300 ease-linear"
                style={{ width: `${Math.min((currentTime / duration) * 100, 100)}%` }}
              />
            )}
          </div>
        </div>

        {/* CTA button below video */}
        <AnimatePresence>
          {showRegisterOverlay && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-[340px] xs:max-w-[360px] sm:max-w-[380px] md:max-w-[390px] mt-4"
            >
              <button
                type="button"
                onClick={handleScrollToForm}
                className="w-full py-4 px-6 bg-[#c6ff34] hover:bg-[#b8f526] text-[#050521] rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-200 border-3 border-[#050521] shadow-[4px_4px_0px_0px_#050521] hover:shadow-[2px_2px_0px_0px_#050521] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-y-1 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg group-hover:scale-125 transition-transform">⚡</span>
                  <span className="font-extrabold">REGISTER NOW • ₹{offerPrice}</span>
                </div>
                <span className="text-base font-black group-hover:translate-x-1 transition-transform">↓</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
