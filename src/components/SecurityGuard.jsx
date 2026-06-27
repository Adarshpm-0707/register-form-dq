import React, { useEffect } from "react";

/**
 * SecurityGuard Component
 * Provides runtime client-side security protections:
 * - Anti-tamper & console guard warnings
 * - Disables context menu (right click) inspect
 * - Disables sensitive devtool shortcut combinations (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S)
 */
export default function SecurityGuard({ children }) {
  useEffect(() => {
    // 1. Console Security Protection Warning
    const consoleStyle = "color: #c6ff34; font-size: 20px; font-weight: bold; background: #050521; padding: 10px; border-radius: 5px;";
    const warningStyle = "color: #ff4444; font-size: 14px; font-weight: bold;";
    
    console.log("%c🛡️ SECURITY PROTECTED ZONE", consoleStyle);
    console.log("%cWarning: This browser feature is intended for developers. Entering commands or pasting external scripts here could compromise your security or account data.", warningStyle);

    // 2. Prevent Context Menu (Right Click)
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // 3. Disable keyboard inspect shortcuts
    const handleKeyDown = (e) => {
      // F12 key
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I or Cmd+Option+I (Inspect element)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.keyCode === 73 || e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+J or Cmd+Option+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.keyCode === 74 || e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        return false;
      }
      // Ctrl+U or Cmd+Option+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.keyCode === 85 || e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        return false;
      }
      // Ctrl+S or Cmd+S (Save Page)
      if ((e.ctrlKey || e.metaKey) && (e.keyCode === 83 || e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <>{children}</>;
}
