import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BLOG_POSTS } from "../data/blogPosts";
import { COURSE_PAGES } from "../data/coursePages";

const BASE_URL = "https://deepstaq.in";

const STATIC_SEO_CONFIG = {
  "/": {
    title: "AI & Machine Learning Courses Online & Offline",
    description: "Learn AI & Machine Learning with Deepstaq through practical online and offline courses. Master AI, ML, Generative AI and Agentic AI with industry-focused training.",
    keywords: "AI courses, Machine Learning training, Generative AI courses, Agentic AI, AI courses online, AI courses offline, AI institute, Deepstaq",
    robots: "index, follow"
  },
  "/programs": {
    title: "AI & Machine Learning Programs | Deepstaq",
    description: "Practical upskilling for the modern tech & AI industry. Master Machine Learning, Generative AI, Prompt Engineering, and Agentic workflows with 100% practical training.",
    keywords: "AI training program, ML diploma, generative AI course, agentic AI learning, Deepstaq programs",
    robots: "index, follow"
  },

  // 7 Dedicated Course & Guide Landing Pages
  "/ai-course": {
    title: "AI Course in Kerala | 6-Month AI/ML & GenAI Diploma – DeepStaq",
    description: "Become an AI Builder in 6 months. DeepStaq's hands-on AI/ML & Generative AI diploma covers Python to agentic AI, RAG & LLM fine-tuning. No coding experience needed.",
    keywords: "ai course, AI course in Kerala, Generative AI diploma, DeepStaq",
    robots: "index, follow"
  },
  "/machine-learning-course": {
    title: "Machine Learning Course in Kerala | Hands-On ML + GenAI Diploma – DeepStaq",
    description: "Learn Machine Learning hands-on — from Python and statistics to ML algorithms, deep learning, and real-world deployment. 6-month diploma, no coding experience needed.",
    keywords: "machine learning course, Machine Learning Course in Kerala, ML diploma, DeepStaq",
    robots: "index, follow"
  },
  "/ai-ml-course": {
    title: "AI-ML Course | Become an AI-ML Engineer in 6 Months – DeepStaq",
    description: "One diploma, two skill sets. DeepStaq's AI-ML course takes you from Python to deployed AI systems — covering both classical ML and modern GenAI, hands-on.",
    keywords: "ai ml course, AI-ML engineer, AI and Machine Learning diploma, DeepStaq",
    robots: "index, follow"
  },
  "/offline-ai-course": {
    title: "Offline AI Course in Kerala | In-Person AI/ML Diploma – DeepStaq",
    description: "Learn AI/ML in a real classroom, not a video queue. DeepStaq's offline AI course pairs hands-on, in-person instruction with industry mentors. 6-month diploma.",
    keywords: "offline ai course, offline AI course in Kerala, classroom AI diploma, DeepStaq",
    robots: "index, follow"
  },
  "/ai-course-kannur": {
    title: "AI Course in Kannur | 6-Month AI/ML & GenAI Diploma – DeepStaq",
    description: "Learn AI/ML in Kannur with DeepStaq's hands-on, in-person 6-month diploma — Python to agentic AI, RAG & LLM fine-tuning. No prior coding experience needed.",
    keywords: "ai course kannur, AI course in Kannur, machine learning Kannur, DeepStaq",
    robots: "index, follow"
  },
  "/online-ai-course": {
    title: "Online AI Course | Live, Instructor-Led AI/ML Diploma – DeepStaq",
    description: "Learn AI/ML online with DeepStaq's live, instructor-led sessions — from Python to agentic AI. Real-time classes, not pre-recorded videos. 6-month diploma.",
    keywords: "online ai course, live online AI course, AI ML diploma online, DeepStaq",
    robots: "index, follow"
  },
  "/ai-ml-course-guide": {
    title: "AI & ML Course Guide 2026 | Deepstaq 6-Month AI/ML Diploma",
    description: "Complete AI & ML course guide — what is AI/ML, eligibility, duration, fees, skills, career scope, and Deepstaq's 6-month AI Builder programme in Kerala.",
    keywords: "AI course Kerala, AI ML course, Deepstaq, AI ML diploma, learn AI ML, AI course eligibility, AI course fees Kerala, AI ML career opportunities",
    robots: "index, follow"
  },

  "/blog": {
    title: "DeepStaq Blog | AI/ML Guides & Roadmaps (2026)",
    description: "Master Artificial Intelligence, Machine Learning, Deep Learning, and Agentic AI with 6 comprehensive guides, roadmaps, and career insights from DeepStaq.",
    keywords: "AI blog, what is artificial intelligence, what is machine learning, agentic AI, how to learn AI, AI roadmap, Deepstaq",
    robots: "index, follow"
  },

  // 1. What Is Artificial Intelligence?
  "/blog/what-is-artificial-intelligence": {
    title: "What Is Artificial Intelligence? A Complete Beginner's Guide (2026)",
    description: "New to AI? Learn what artificial intelligence really is, how it works, real-world examples, and how to build a career in AI/ML with DeepStaq.",
    keywords: "what is artificial intelligence, AI fundamentals, machine learning, deep learning, DeepStaq AI guide",
    robots: "index, follow"
  },

  // 2. What Is Machine Learning?
  "/blog/what-is-machine-learning": {
    title: "What Is Machine Learning? A Beginner's Guide with Examples (2026)",
    description: "Confused about machine learning? Learn what ML is, how it works, its main types, real examples, and how to start building ML skills with DeepStaq.",
    keywords: "what is machine learning, machine learning guide, supervised learning, unsupervised learning, DeepStaq ML",
    robots: "index, follow"
  },

  // 3. AI vs Machine Learning
  "/blog/ai-vs-machine-learning": {
    title: "AI vs Machine Learning: What's the Real Difference? (2026 Guide)",
    description: "AI and machine learning aren't the same thing. Learn the real difference between AI vs ML, how they relate, and where to start learning with DeepStaq.",
    keywords: "ai vs machine learning, difference between AI and ML, AI vs deep learning, DeepStaq",
    robots: "index, follow"
  },

  // 4. What Is Agentic AI?
  "/blog/what-is-agentic-ai": {
    title: "What Is Agentic AI? A Complete Beginner's Guide (2026)",
    description: "Agentic AI is the next step beyond chatbots. Learn what agentic AI means, how it works, real examples, and how to start building it with DeepStaq.",
    keywords: "what is agentic ai, AI agents, agentic workflows, autonomous AI, DeepStaq agentic AI",
    robots: "index, follow"
  },

  // 5. How to Learn AI in 2026
  "/blog/how-to-learn-ai": {
    title: "How to Learn AI in 2026: A Step-by-Step Beginner's Roadmap",
    description: "Want to learn AI but don't know where to start? Follow this step-by-step roadmap covering skills, tools, and projects — with hands-on training from DeepStaq.",
    keywords: "how to learn ai, learn AI 2026, AI roadmap, machine learning path, DeepStaq AI roadmap",
    robots: "index, follow"
  },

  // 6. AI Roadmap for Beginners
  "/blog/ai-roadmap-for-beginners": {
    title: "AI Roadmap for Beginners: A Phase-by-Phase Timeline (2026)",
    description: "A clear AI roadmap for beginners — phase by phase, month by month. Know exactly what to learn, when, and what to build at each stage, with DeepStaq.",
    keywords: "ai roadmap for beginners, AI learning timeline, month by month AI guide, DeepStaq roadmap",
    robots: "index, follow"
  },

  "/admission": {
    title: "Apply for AI & Machine Learning Programs | Deepstaq Admissions",
    description: "Apply now for Deepstaq's premier AI and Machine Learning courses. Start your journey with industry-grade practical training.",
    keywords: "AI course admission, enroll machine learning, Deepstaq application",
    robots: "index, follow"
  },
  "/aptitude": {
    title: "AI Aptitude Test & Assessment | Deepstaq",
    description: "Evaluate your readiness for advanced AI & Machine Learning programs with Deepstaq's comprehensive aptitude test.",
    keywords: "AI aptitude test, coding assessment, machine learning quiz, Deepstaq test",
    robots: "index, follow"
  },
  "/consultation": {
    title: "Book Free Career Consultation | Deepstaq AI",
    description: "Schedule a 1-on-1 career consultation session with AI industry experts at Deepstaq to find the best learning path for you.",
    keywords: "AI career consultation, free counseling, career in AI, tech mentor",
    robots: "index, follow"
  },
  "/contact": {
    title: "Contact Us | Connect with DeepStaq",
    description: "Have questions about our curriculum, installments, or schedule? Get in touch with our admissions team to learn more about our AI programs.",
    keywords: "contact Deepstaq, AI institute contact, admissions help",
    robots: "index, follow"
  },
  "/admin": {
    title: "Admin Dashboard | DeepStaq Management",
    description: "Secure administrator dashboard for DeepStaq application reviews, cohort management, and registration tracking.",
    keywords: "admin",
    robots: "noindex, nofollow"
  },
  "/admin/login": {
    title: "Admin Login | DeepStaq",
    description: "Log in to the DeepStaq administration portal.",
    keywords: "admin login",
    robots: "noindex, nofollow"
  }
};

const DEFAULT_SEO = {
  title: "AI & Machine Learning Courses Online & Offline",
  description: "Learn AI & Machine Learning with Deepstaq through practical online and offline courses. Master AI, ML, Generative AI and Agentic AI with industry-focused training.",
  keywords: "AI courses, Machine Learning training, Generative AI courses, Agentic AI, AI courses online, AI courses offline, Deepstaq",
  robots: "index, follow"
};

function getSeoConfigForPath(pathname) {
  const cleanPath = pathname.replace(/\/$/, "") || "/";
  if (STATIC_SEO_CONFIG[cleanPath]) {
    return STATIC_SEO_CONFIG[cleanPath];
  }

  // Dynamic fallback for any course slug
  const matchedCourse = COURSE_PAGES.find(
    (c) => `/${c.slug}` === cleanPath || cleanPath === `/course/${c.slug}`
  );
  if (matchedCourse) {
    return {
      title: matchedCourse.metaTitle,
      description: matchedCourse.metaDescription,
      keywords: `${matchedCourse.targetKeyword}, DeepStaq, AI ML courses`,
      robots: "index, follow"
    };
  }

  // Dynamic fallback for any other /blog/:slug
  if (cleanPath.startsWith("/blog/")) {
    const slug = cleanPath.replace("/blog/", "");
    const matchedPost = BLOG_POSTS.find((p) => p.slug === slug);
    if (matchedPost) {
      return {
        title: matchedPost.metaTitle || matchedPost.title,
        description: matchedPost.metaDescription || matchedPost.excerpt,
        keywords: `${matchedPost.targetKeyword}, ${matchedPost.category}, DeepStaq blog, AI guide`,
        robots: "index, follow"
      };
    }
  }

  return DEFAULT_SEO;
}

function updateMetaTag(attributeName, attributeValue, content) {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function updateCanonicalLink(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

export default function SEO() {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const config = getSeoConfigForPath(currentPath);
    const fullUrl = `${BASE_URL}${currentPath === "/" ? "" : currentPath}`;

    // Document Title
    document.title = config.title;

    // Standard Meta Tags
    updateMetaTag("name", "title", config.title);
    updateMetaTag("name", "description", config.description);
    updateMetaTag("name", "keywords", config.keywords);
    updateMetaTag("name", "robots", config.robots);

    // Canonical URL
    updateCanonicalLink(fullUrl);

    // Open Graph / Facebook Meta Tags
    updateMetaTag("property", "og:type", "article");
    updateMetaTag("property", "og:url", fullUrl);
    updateMetaTag("property", "og:title", config.title);
    updateMetaTag("property", "og:description", config.description);
    updateMetaTag("property", "og:site_name", "Deepstaq");

    // Twitter Card Meta Tags
    updateMetaTag("name", "twitter:card", "summary_large_image");
    updateMetaTag("name", "twitter:url", fullUrl);
    updateMetaTag("name", "twitter:title", config.title);
    updateMetaTag("name", "twitter:description", config.description);
  }, [location]);

  return null;
}
