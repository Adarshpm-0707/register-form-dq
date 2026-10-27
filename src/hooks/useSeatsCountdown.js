import { useState, useEffect } from "react";

const STORAGE_KEY = "ai_easy_ayi_seats_start_time";

/**
 * Custom hook for live limited seats countdown.
 *
 * Requirements:
 * 1. Initial count: 10 seats
 * 2. First 1 minute (0 - 59s): stays at 10 seats
 * 3. After 1 minute: decreases 1 by 1 per minute (10 -> 9 -> 8 -> 7 -> 6 -> 5 -> 4 -> 3)
 * 4. Stops when it reaches 3 seats available
 */
function getCalculatedSeats(initialSeats, minSeats) {
  if (typeof window === "undefined") return initialSeats;
  try {
    let startTime = sessionStorage.getItem(STORAGE_KEY);
    if (!startTime) {
      startTime = Date.now().toString();
      sessionStorage.setItem(STORAGE_KEY, startTime);
    }
    const elapsedMs = Math.max(0, Date.now() - parseInt(startTime, 10));
    // First 60 seconds (1 minute): 0 minutes elapsed -> 10 seats
    // 60s - 119s: 1 minute elapsed -> 9 seats
    // 120s - 179s: 2 minutes elapsed -> 8 seats
    // ...
    // 360s - 419s: 6 minutes elapsed -> 4 seats
    // 420s+: 7+ minutes elapsed -> 3 seats (stops at 3)
    const minutesElapsed = Math.floor(elapsedMs / 60000);
    return Math.max(minSeats, initialSeats - minutesElapsed);
  } catch (e) {
    return initialSeats;
  }
}

export function useSeatsCountdown(initialSeats = 10, minSeats = 3) {
  const [seatsLeft, setSeatsLeft] = useState(() =>
    getCalculatedSeats(initialSeats, minSeats)
  );

  useEffect(() => {
    // Initial calculation
    setSeatsLeft(getCalculatedSeats(initialSeats, minSeats));

    const interval = setInterval(() => {
      setSeatsLeft(getCalculatedSeats(initialSeats, minSeats));
    }, 1000);

    // Global developer / test helpers
    if (typeof window !== "undefined") {
      window.__setSeatsRemaining = (num) => {
        const target = Math.max(minSeats, Math.min(initialSeats, num));
        const offsetMinutes = initialSeats - target;
        sessionStorage.setItem(
          STORAGE_KEY,
          (Date.now() - offsetMinutes * 60000).toString()
        );
        setSeatsLeft(target);
      };

      window.__resetSeatsTimer = () => {
        sessionStorage.setItem(STORAGE_KEY, Date.now().toString());
        setSeatsLeft(initialSeats);
      };
    }

    return () => clearInterval(interval);
  }, [initialSeats, minSeats]);

  return seatsLeft;
}
