// ─────────────────────────────────────────────────────
//  components/Loader.jsx
//  Animated loading spinner shown during form submission
// ─────────────────────────────────────────────────────

import React from "react";

/**
 * @param {string} size    - Tailwind size class (default "w-5 h-5")
 * @param {string} color   - Tailwind border-color class
 */
function Loader({ size = "w-5 h-5", color = "border-white" }) {
  return (
    <span
      role="status"
      aria-label="Loading..."
      className={`inline-block ${size} border-2 ${color} border-t-transparent rounded-full spinner`}
    />
  );
}

export default Loader;
