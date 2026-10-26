import React from "react";

/**
 * SecurityGuard Component
 * Fully unrestricted wrapper allowing all native browser functions,
 * context menu, right-click, inspection, and devtools.
 */
export default function SecurityGuard({ children }) {
  return <>{children}</>;
}
