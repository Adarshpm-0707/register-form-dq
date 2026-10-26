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

  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const playStartRef = useRef(null);
  const registerTimerRef = useRef(null);
  const intervalRef = useRef(null);
  const userPausedRef = useRef(false);
  const iframeId = `yt-player-${videoId}`;

  // Helper to send postMessage command to YouTube iframe
  const postCmd = (func, args = []) => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;
    try {
      const payload = {
        event: "command",
        func,
        args: Array.isArray(args) ? args : (args !== undefined && args !== null && args !== "" ? [args] : [])
      };
      iframe.contentWindow.postMessage(JSON.stringify(payload), "*");
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
    postCmd("unMute", []);
    postCmd("setVolume", [100]);
  };

  // Pause video explicitly
  const pauseVideo = () => {
    if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === "function") {
      try {
        ytPlayerRef.current.pauseVideo();
      } catch (e) {}
    }
    postCmd("pauseVideo", []);
    setIsPlaying(false);
  };

  // Play video explicitly
  const playVideo = () => {
    if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === "function") {
      try {
        ytPlayerRef.current.unMute();
        ytPlayerRef.current.playVideo();
      } catch (e) {}
    }
    postCmd("unMute", []);
    postCmd("playVideo", []);
    setIsPlaying(true);
  };

  // Toggle play/pause on click or touch
  const togglePlayPause = (e) => {
    if (e) {
      if (typeof e.stopPropagation === "function") e.stopPropagation();
      if (typeof e.preventDefault === "function" && e.type !== "click") e.preventDefault();
    }

    if (isEnded) {
      handleReplay(e);
      return;
    }

    if (isPlaying) {
      userPausedRef.current = true;
      pauseVideo();
    } else {
      userPausedRef.current = false;
      playVideo();
    }
  };

  // Replay video from start
  const handleReplay = (e) => {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
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
      postCmd("playVideo", []);
      postCmd("unMute", []);
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

  // Handle tab switching & window blur & unmount & scrolling out of view
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseVideo();
      }
    };

    const handleWindowBlur = () => {
      if (document.hidden) {
        pauseVideo();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    // IntersectionObserver: pause if video container scrolls out of the visible page
    let observer;
    if ("IntersectionObserver" in window && containerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              // Video is out of the screen/page view -> pause it
              pauseVideo();
            } else {
              // Video came back into view -> resume only if user didn't manually pause it and tab is visible
              if (!userPausedRef.current && !document.hidden) {
                playVideo();
              }
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(containerRef.current);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      if (observer) observer.disconnect();
      pauseVideo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    // 5. One-time Voice Unmute on initial user interaction (respects manual pause)
    let initialUnlocked = false;
    const onFirstInteraction = () => {
      if (initialUnlocked) return;
      initialUnlocked = true;
      unmute();
      if (!userPausedRef.current) {
        playVideo();
      }
      presenceEvents.forEach((ev) =>
        window.removeEventListener(ev, onFirstInteraction)
      );
    };

    const presenceEvents = [
      "pointerdown",
      "touchstart",
      "click",
      "keydown",
    ];

    presenceEvents.forEach((ev) =>
      window.addEventListener(ev, onFirstInteraction, { passive: true })
    );

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(registerTimerRef.current);
      presenceEvents.forEach((ev) =>
        window.removeEventListener(ev, onFirstInteraction)
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
      className="w-full flex flex-col items-center justify-center pt-0 mb-0 relative px-0"
    >
      {/* Ambient background glow */}
      <div className="absolute w-60 sm:w-80 md:w-96 h-60 sm:h-80 md:h-96 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.18)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full flex flex-col items-center justify-center"
      >
        {/* Borderless video player container (responsive 9:16 aspect ratio) */}
        <div
          ref={containerRef}
          className="relative h-[min(65vh,520px)] md:h-[min(65vh,500px)] lg:h-[min(70vh,560px)] xl:h-[min(72vh,580px)] aspect-[9/16] w-auto max-w-[calc(100vw-2rem)] md:max-w-full bg-black rounded-2xl sm:rounded-3xl border-0 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden mx-auto group/frame"
        >

          {/* Instant High-Res Video Poster */}
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-8">
              <div className="flex items-center gap-2 bg-[#090D11]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-sky-400/30">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span className="text-[10px] font-mono text-sky-300 font-bold uppercase tracking-wider">
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
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&playsinline=1&enablejsapi=1&rel=0&modestbranding=1&controls=0&origin=${originParam}`}
            title={title}
            frameBorder="0"
            allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            playsInline
            loading="eager"
            className="w-full h-full block border-0 pointer-events-none"
            onLoad={handleIframeLoad}
          />

          {/* Transparent Tap / Click Overlay to toggle Play / Pause */}
          <div
            onClick={togglePlayPause}
            className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center select-none touch-manipulation"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                togglePlayPause(e);
              }
            }}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {/* Paused state play button overlay */}
            <AnimatePresence>
              {!isPlaying && !isEnded && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-2 pointer-events-none"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-950/85 border border-sky-400/50 backdrop-blur-md flex items-center justify-center text-white shadow-[0_0_30px_rgba(56,189,248,0.5)] group-hover/frame:scale-105 transition-transform">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-sky-400 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-white/10 text-[11px] font-mono text-slate-200 backdrop-blur-sm shadow-md">
                    Tap to play
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subtle top indicator showing status */}
            <div className="absolute top-3 right-3 pointer-events-none transition-opacity duration-300 opacity-70 group-hover/frame:opacity-100">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                {isPlaying ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Tap to pause</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Paused</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* ================================================================ */}
          {/* REGISTER BUTTON OVERLAY — SHOWN IN THE VIDEO DURING LAST 5 SEC   */}
          {/* ================================================================ */}
          <AnimatePresence>
            {showRegisterOverlay && (
              <motion.div
                key="register-overlay"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                className="absolute bottom-3 sm:bottom-4 left-2 sm:left-3 right-2 sm:right-3 z-30 p-2.5 sm:p-3 bg-[#090D11]/95 backdrop-blur-xl rounded-2xl border border-sky-400/40 shadow-[0_12px_35px_rgba(56,189,248,0.3)] text-center"
              >
                {/* Header status pill */}
                <div className="text-[9px] sm:text-[10px] font-mono font-bold uppercase text-sky-400 tracking-wider mb-1 flex items-center justify-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  <span>{isEnded ? "PREVIEW COMPLETED" : "LIMITED SEATS AVAILABLE"}</span>
                </div>

                {/* Primary Register Button */}
                <button
                  type="button"
                  onClick={handleScrollToForm}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_4px_16px_rgba(56,189,248,0.35)] flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 flex-shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    <span className="font-extrabold truncate text-[11px] sm:text-xs">REGISTER FOR ₹{offerPrice}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono flex-shrink-0">
                    <span className="line-through text-slate-700 text-[10px]">₹{originalPrice}</span>
                    <span className="text-slate-950 font-black group-hover:translate-y-0.5 transition-transform text-xs">↓</span>
                  </div>
                </button>

                {/* Bottom hint or Replay button */}
                <div className="mt-1.5 flex items-center justify-between gap-1 text-[9px] sm:text-[10px] text-slate-300 font-medium px-1">
                  <span className="truncate">Tap button to open registration form</span>
                  <button
                    type="button"
                    onClick={handleReplay}
                    className="text-sky-400 hover:underline flex items-center gap-0.5 flex-shrink-0 cursor-pointer font-bold"
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
                className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-200 ease-linear"
                style={{ width: `${Math.min((currentTime / duration) * 100, 100)}%` }}
              />
            )}
          </div>
        </div>


      </motion.div>
    </div>
  );
}
