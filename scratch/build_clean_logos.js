const fs = require('fs');

// Official SVG definitions

// 1. Google Gemini Sparkle Star (Official Google Gemini Icon)
const geminiSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="geminiSpark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a73e8" />
      <stop offset="35%" stop-color="#4285f4" />
      <stop offset="70%" stop-color="#9b72cb" />
      <stop offset="100%" stop-color="#d9657b" />
    </linearGradient>
  </defs>
  {/* Main Gemini Star */}
  <path d="M50 5 C50 29.85 29.85 50 5 50 C29.85 50 50 70.15 50 95 C50 70.15 70.15 50 95 50 C70.15 50 50 29.85 50 5 Z" fill="url(#geminiSpark)" />
</svg>`;

// 2. OpenAI / ChatGPT (Official OpenAI 6-Segment Spiral Knot)
const chatgptSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
  <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7938.7938 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.535-3.0137l.142.0852 4.783 2.7582a.7748.7748 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615l-4.8351 2.7914a4.4992 4.4992 0 0 1-6.145-1.6465zm-1.2594-10.4357a4.473 4.473 0 0 1 2.3414-1.973l-.0047.161-1.0038 5.4206a.7843.7843 0 0 0 .388.8282l5.8428 3.3685-2.02 1.1638a.0804.0804 0 0 1-.0711 0l-4.8303-2.7914a4.4992 4.4992 0 0 1-.6423-6.1777zm13.9103 3.5207-5.8428-3.3685 2.02-1.1639a.0804.0804 0 0 1 .0711 0l4.8303 2.7914a4.4992 4.4992 0 0 1-.7608 8.1507v-5.5826a.7843.7843 0 0 0-.3178-.8271zm2.3462-2.3842a4.4755 4.4755 0 0 1 .535 3.0137l-.142-.0852-4.783-2.7582a.7748.7748 0 0 0-.7806 0l-5.8428 3.3685v-2.3324a.0804.0804 0 0 1 .0332-.0615l4.8351-2.7914a4.4992 4.4992 0 0 1 6.145 1.6465zm-11.4552-6.1824a4.4755 4.4755 0 0 1 2.8764 1.0408l-.1419.0804-4.7783 2.7582a.7938.7938 0 0 0-.3927.6813v6.7369l-2.02-1.1686a.071.071 0 0 1-.038-.052v-5.5826a4.504 4.504 0 0 1 4.4945-4.4944z" />
</svg>`;

// 3. Adobe Firefly (Official Adobe Firefly Generative Spark Artwork & Icon Badge)
const fireflySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="fireflyBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#3d004d" />
      <stop offset="50%" stop-color="#800055" />
      <stop offset="100%" stop-color="#ff3300" />
    </linearGradient>
    <linearGradient id="fireflySpark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffe600" />
      <stop offset="50%" stop-color="#ff5500" />
      <stop offset="100%" stop-color="#ff0066" />
    </linearGradient>
  </defs>
  {/* Firefly Generative AI Spark Wings / Flame Mark */}
  <path d="M50 15 C50 32 35 45 18 50 C35 55 50 68 50 85 C50 68 65 55 82 50 C65 45 50 32 50 15 Z" fill="url(#fireflySpark)" />
  <circle cx="72" cy="25" r="5" fill="#ffe600" opacity="0.9" />
  <circle cx="28" cy="72" r="3.5" fill="#ff7700" opacity="0.8" />
  <circle cx="75" cy="75" r="4" fill="#ff0066" opacity="0.85" />
</svg>`;

console.log("Built definitions successfully");
