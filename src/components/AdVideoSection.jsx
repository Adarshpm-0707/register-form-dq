import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KNOWN_VIDEO_DURATION = 45.6; // Exact duration of YouTube Shorts video r5Q_3yerIJs
const LAST_SECONDS_THRESHOLD = 5; // Exactly last 5 seconds

/**
 * AdVideoSection Component
 *
 * Implements simultaneous automatic video playback AND automatic unmuted voice:
 * 1. Embeds with autoplay=1&mute=0 and unMute() commands on load.
 * 2. Unmutes audio automatically via YouTube Player API and postMessage.
 * 3. Fallback sound-unlocker triggers unMute on any user presence/movement/interaction.
 * 4. Shows the Register button strictly in the last 5 seconds (from ~40.6s to 45.6s) and after finish.
 * 5. Replay support and responsive layout on mobile & laptop.
 */
export default function AdVideoSection({
  videoId = "r5Q_3yerIJs",
  title = "deepstack AD QR",
  targetFormId = "registration-form",
  originalPrice = 899,
  offerPrice = 99,
  onGoToForm,
}) {
  const [showRegisterOverlay, setShowRegisterOverlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(KNOWN_VIDEO_DURATION);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isEnded, setIsEnded] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);

  const iframeRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const playStartRef = useRef(null);
  const registerTimerRef = useRef(null);
  const intervalRef = useRef(null);
  const iframeId = `yt-player-${videoId}`;

  // Helper to send postMessage command to YouTube iframe
  const postCmd = (func, args = "") => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;
    try {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*"
      );
    } catch (e) {}
  };

  // Scroll to form smoothly and focus first input
  const handleScrollToForm = () => {
    if (typeof onGoToForm === "function") {
      onGoToForm();
    }
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

  // Unmute audio automatically
  const unmute = () => {
    if (ytPlayerRef.current) {
      try {
        if (typeof ytPlayerRef.current.unMute === "function") {
          ytPlayerRef.current.unMute();
        }
        if (typeof ytPlayerRef.current.setVolume === "function") {
          ytPlayerRef.current.setVolume(100);
        }
      } catch (e) {}
    }
    postCmd("unMute");
    postCmd("setVolume", [100]);
  };

  // Play video explicitly
  const playVideo = () => {
    if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === "function") {
      try {
        ytPlayerRef.current.unMute();
        ytPlayerRef.current.playVideo();
      } catch (e) {}
    }
    postCmd("unMute");
    postCmd("playVideo");
    setIsPlaying(true);
  };

  // Replay video from start
  const handleReplay = (e) => {
    if (e) e.stopPropagation();
    setIsEnded(false);
    setShowRegisterOverlay(false);
    setCurrentTime(0);

    if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === "function") {
      try {
        ytPlayerRef.current.seekTo(0, true);
        ytPlayerRef.current.playVideo();
        ytPlayerRef.current.unMute();
      } catch (err) {}
    } else {
      postCmd("seekTo", [0, true]);
      postCmd("playVideo");
      postCmd("unMute");
    }

    setIsPlaying(true);
    startPlaybackFallback(Date.now(), 0);
  };

  // Fallback timer when API isn't communicating
  const startPlaybackFallback = (startTime = Date.now(), initialOffset = 0) => {
    clearTimeout(registerTimerRef.current);
    playStartRef.current = startTime - initialOffset * 1000;

    const dur = duration || KNOWN_VIDEO_DURATION;
    const triggerTimeSec = Math.max(0, dur - LAST_SECONDS_THRESHOLD);
    const msUntilRegister = Math.max(0, (triggerTimeSec - initialOffset) * 1000);

    registerTimerRef.current = setTimeout(() => {
      setShowRegisterOverlay(true);
    }, msUntilRegister);
  };

  // Setup official YouTube IFrame API and ensure automatic play + unmute
  useEffect(() => {
    // 1. Ensure YouTube IFrame API script is in document
    if (!window.YT) {
      const existing = document.getElementById("yt-iframe-api");
      if (!existing) {
        const tag = document.createElement("script");
        tag.id = "yt-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        const first = document.getElementsByTagName("script")[0];
        if (first && first.parentNode) {
          first.parentNode.insertBefore(tag, first);
        } else {
          document.head.appendChild(tag);
        }
      }
    }

    // 2. Poll until window.YT and window.YT.Player are available, then attach
    let initAttempts = 0;
    const initYT = () => {
      if (window.YT && window.YT.Player) {
        try {
          if (!ytPlayerRef.current && iframeRef.current) {
            ytPlayerRef.current = new window.YT.Player(iframeId, {
              events: {
                onReady: (event) => {
                  try {
                    // Automatically unmute voice and play video simultaneously
                    event.target.unMute();
                    event.target.setVolume(100);
                    event.target.playVideo();
                  } catch (e) {}
                  setIsPlaying(true);
                  setIsVideoActive(true);
                  startPlaybackFallback(Date.now(), 0);

                  // Browser safeguard: if browser paused due to sound policy, play video and unmute on presence
                  setTimeout(() => {
                    try {
                      if (event.target.getPlayerState() !== 1) {
                        event.target.mute();
                        event.target.playVideo();
                      }
                    } catch (err) {}
                  }, 400);
                },
                onStateChange: (event) => {
                  // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
                  if (event.data === 1) {
                    setIsPlaying(true);
                    setIsVideoActive(true);
                    setIsEnded(false);
                    // Ensure unmuted when actively playing
                    try {
                      event.target.unMute();
                      event.target.setVolume(100);
                    } catch (e) {}
                  } else if (event.data === 2) {
                    setIsPlaying(false);
                  } else if (event.data === 0) {
                    setIsPlaying(false);
                    setIsEnded(true);
                    setShowRegisterOverlay(true); // Always keep button visible when video finishes!
                  }
                },
              },
            });
          }
        } catch (e) {}
      } else if (initAttempts < 30) {
        initAttempts++;
        setTimeout(initYT, 200);
      }
    };
    initYT();

    // 3. High-precision 200ms time poller: checks real currentTime against last 5 seconds
    intervalRef.current = setInterval(() => {
      let cur = 0;
      let dur = duration || KNOWN_VIDEO_DURATION;

      if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === "function") {
        try {
          cur = ytPlayerRef.current.getCurrentTime() || 0;
          const apiDur = ytPlayerRef.current.getDuration();
          if (apiDur && apiDur > 0) dur = apiDur;
        } catch (e) {}
      } else if (playStartRef.current && isPlaying) {
        cur = (Date.now() - playStartRef.current) / 1000;
      }

      if (cur > 0) {
        setIsVideoActive(true);
        setCurrentTime(cur);
        setDuration(dur);

        const triggerSec = Math.max(0, dur - LAST_SECONDS_THRESHOLD);

        // Strict condition: Show in the last 5 seconds (or if video has ended)
        if (cur >= triggerSec || isEnded) {
          setShowRegisterOverlay(true);
        } else if (cur < triggerSec - 0.5 && isPlaying) {
          // Hide button if playing earlier in the video (not in the first 40 seconds)
          setShowRegisterOverlay(false);
        }
      }
    }, 200);

    // 4. Fallback start
    startPlaybackFallback(Date.now(), 0);

    // 5. Automatic Voice Unmute on user presence / interaction (mousemove, scroll, touch, click, keydown)
    const onUserPresence = () => {
      unmute();
      playVideo();
    };

    const presenceEvents = [
      "mousemove",
      "pointermove",
      "scroll",
      "wheel",
      "touchstart",
      "touchend",
      "pointerdown",
      "click",
      "keydown",
    ];

    presenceEvents.forEach((ev) =>
      window.addEventListener(ev, onUserPresence, { passive: true })
    );

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(registerTimerRef.current);
      presenceEvents.forEach((ev) =>
        window.removeEventListener(ev, onUserPresence)
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, isEnded, isPlaying]);

  // Handle iframe load — trigger autoplay and voice unmute immediately
  const handleIframeLoad = () => {
    // Send unMute, volume 100 & play commands immediately
    postCmd("unMute");
    postCmd("setVolume", [100]);
    postCmd("playVideo");
    setTimeout(() => setIsVideoActive(true), 400);

    // Multiple staggered attempts to guarantee unmuted autoplay across all browser engines
    [100, 300, 600, 1000, 1800, 2600].forEach((delay) => {
      setTimeout(() => {
        postCmd("unMute");
        postCmd("setVolume", [100]);
        postCmd("playVideo");
        if (ytPlayerRef.current) {
          try {
            if (typeof ytPlayerRef.current.unMute === "function") {
              ytPlayerRef.current.unMute();
              ytPlayerRef.current.setVolume(100);
            }
            if (typeof ytPlayerRef.current.playVideo === "function") {
              ytPlayerRef.current.playVideo();
            }
          } catch (e) {}
        }
      }, delay);
    });

    startPlaybackFallback(Date.now(), 0);
  };

  const originParam = typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : "";

  return (
    <div
      onMouseMove={unmute}
      onMouseEnter={unmute}
      onTouchStart={unmute}
      onClick={unmute}
      className="w-full flex flex-col items-center justify-center pt-1 sm:pt-3 md:pt-4 mb-8 sm:mb-12 relative px-2 sm:px-4 cursor-pointer"
    >
      {/* Ambient background glow */}
      <div className="absolute w-60 sm:w-80 md:w-96 h-60 sm:h-80 md:h-96 bg-gradient-to-tr from-[#c6ff34]/25 via-emerald-400/20 to-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full flex flex-col items-center justify-center"
      >
        {/* Smartphone mockup frame (fluid responsive 9:16 aspect ratio across mobile & laptop) */}
        <div className="relative h-[min(70vh,600px)] aspect-[9/16] w-auto max-w-[calc(100vw-2rem)] bg-[#050521] rounded-[2rem] sm:rounded-[2.5rem] border-3 sm:border-4 border-[#050521] shadow-[0_20px_50px_rgba(5,5,33,0.3),0_10px_25px_rgba(198,255,52,0.18)] overflow-hidden mx-auto group/frame">

          {/* Instant High-Res Video Poster (prevents black screen while video buffers/loads) */}
          <div
            className={`absolute inset-0 z-10 transition-opacity duration-500 pointer-events-none ${
              isVideoActive ? "opacity-0" : "opacity-100"
            }`}
          >
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              onError={(e) => {
                e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
              alt="Video Preview"
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Shimmer loading badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050521]/70 via-transparent to-transparent flex items-end justify-center pb-8">
              <div className="flex items-center gap-2 bg-[#050521]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#c6ff34]/40">
                <span className="w-2 h-2 rounded-full bg-[#c6ff34] animate-ping" />
                <span className="text-[10px] font-mono text-[#c6ff34] font-bold uppercase tracking-wider">
                  Loading Video...
                </span>
              </div>
            </div>
          </div>

          {/* YouTube Iframe with autoplay=1, mute=0, playsinline=1 */}
          <iframe
            ref={iframeRef}
            id={iframeId}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&playsinline=1&enablejsapi=1&rel=0&modestbranding=1&controls=1&origin=${originParam}`}
            title={title}
            frameBorder="0"
            allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            playsInline
            loading="eager"
            className="w-full h-full block border-0"
            onLoad={handleIframeLoad}
          />



          {/* ================================================================ */}
          {/* REGISTER BUTTON OVERLAY — SHOWN IN THE VIDEO DURING LAST 5 SEC   */}
          {/* ================================================================ */}
          <AnimatePresence>
            {showRegisterOverlay && (
              <motion.div
                key="register-overlay"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.9 }}
                transition={{ duration: 0.45, type: "spring", bounce: 0.25 }}
                className="absolute bottom-3 sm:bottom-4 left-2 sm:left-3 right-2 sm:right-3 z-30 p-2.5 sm:p-3 bg-[#050521]/95 backdrop-blur-xl rounded-2xl border-2 border-[#c6ff34] shadow-[0_12px_35px_rgba(198,255,52,0.45)] text-center"
              >
                {/* Header status pill */}
                <div className="text-[9px] sm:text-[10px] font-mono font-black uppercase text-[#c6ff34] tracking-wider mb-1 flex items-center justify-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#c6ff34] animate-ping" />
                  <span>{isEnded ? "PREVIEW COMPLETED" : "LIMITED SEATS AVAILABLE"}</span>
                </div>

                {/* Primary Register Button */}
                <button
                  type="button"
                  onClick={handleScrollToForm}
                  className="w-full py-2 sm:py-2.5 px-2 sm:px-3 bg-[#c6ff34] hover:bg-[#b8f526] text-[#050521] rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 border-2 border-[#050521] shadow-[2px_2px_0px_0px_#ffffff] sm:shadow-[3px_3px_0px_0px_#ffffff] hover:shadow-[1px_1px_0px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-y-1 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-xs sm:text-sm group-hover:scale-125 transition-transform flex-shrink-0">🚀</span>
                    <span className="font-extrabold truncate text-[10px] sm:text-xs md:text-sm">REGISTER NOW</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono flex-shrink-0">
                    <span className="line-through text-slate-500 text-[9px] sm:text-[10px]">₹{originalPrice}</span>
                    <span className="bg-[#050521] text-[#c6ff34] px-1 sm:px-1.5 py-0.5 rounded text-[9px] sm:text-xs font-black">₹{offerPrice}</span>
                    <span className="text-[#050521] font-black group-hover:translate-y-0.5 transition-transform text-xs">↓</span>
                  </div>
                </button>

                {/* Bottom hint or Replay button */}
                <div className="mt-1.5 flex items-center justify-between gap-1 text-[9px] sm:text-[10px] text-slate-300 font-medium px-1">
                  <span className="truncate">Tap button to open registration form</span>
                  <button
                    type="button"
                    onClick={handleReplay}
                    className="text-[#c6ff34] hover:underline flex items-center gap-0.5 flex-shrink-0 cursor-pointer font-bold"
                  >
                    <span>↺ Replay</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar at the bottom of the video */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 z-20 overflow-hidden">
            {duration > 0 && (
              <div
                className="h-full bg-[#c6ff34] transition-all duration-200 ease-linear"
                style={{ width: `${Math.min((currentTime / duration) * 100, 100)}%` }}
              />
            )}
          </div>
        </div>

        {/* Secondary Register Button below video (visible during the last 5 seconds) */}
        <AnimatePresence>
          {showRegisterOverlay && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-[min(360px,calc(100vw-2rem))] mt-3.5 px-2"
            >
              <button
                type="button"
                onClick={handleScrollToForm}
                className="w-full py-3 sm:py-3.5 px-4 sm:px-6 bg-[#c6ff34] hover:bg-[#b8f526] text-[#050521] rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 border-3 border-[#050521] shadow-[4px_4px_0px_0px_#050521] hover:shadow-[2px_2px_0px_0px_#050521] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-y-1 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base group-hover:scale-125 transition-transform">⚡</span>
                  <span className="font-extrabold">REGISTER NOW • ₹{offerPrice}</span>
                </div>
                <span className="text-sm sm:text-base font-black group-hover:translate-x-1 transition-transform">↓</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
