import React from "react";

const NUM_BUBBLES = 24;

function WaterBubbles() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
    >
      {Array.from({ length: NUM_BUBBLES }, (_, i) => (
        <div key={i} className={`water-bubble water-bubble-${i + 1}`} />
      ))}
    </div>
  );
}

export default React.memo(WaterBubbles);
