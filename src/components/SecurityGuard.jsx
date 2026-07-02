import React from "react";

/**
 * SecurityGuard Component
 * Pass-through wrapper allowing standard browser functionality, inspect element, and developer tools.
 */
export default function SecurityGuard({ children }) {
  return <>{children}</>;
}
