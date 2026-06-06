import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SEO_CONFIG = {
  "/": {
    title: "DeepStaq | Build AI & Transition into Tech",
    description: "The premier hands-on AI/ML academy. Code neural networks, build RAG pipelines, fine-tune LLMs, and launch production-grade agentic AI systems."
  },
  "/blog": {
    title: "DeepStaq Blog | AI/ML Insights & Career Guides",
    description: "Expert guides, career transition strategies, and technical insights on PyTorch, Large Language Models, MLOps, and agentic workflows."
  },
  "/slot": {
    title: "Register | DeepStaq AI/ML Diploma Cohort",
    description: "Secure your seat in the upcoming cohort. Apply today, choose your payment track, and start your journey to becoming an AI engineer."
  },
  "/contact": {
    title: "Contact Us | Connect with DeepStaq",
    description: "Have questions about our curriculum, installments, or schedule? Get in touch with our admissions team to learn more about the diploma program."
  },
  "/admin": {
    title: "Admin Dashboard | DeepStaq Management",
    description: "Secure administrator dashboard for DeepStaq application reviews, cohort management, and registration tracking."
  },
  "/admin/login": {
    title: "Admin Login | DeepStaq",
    description: "Log in to the DeepStaq administration portal."
  }
};

const DEFAULT_SEO = {
  title: "DeepStaq | Next-Gen AI/ML Academy",
  description: "Become a certified AI/ML practitioner. Master neural networks, RAG pipelines, fine-tuned LLMs, and agentic AI through hands-on GPU build sessions."
};

export default function SEO() {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const config = SEO_CONFIG[currentPath] || DEFAULT_SEO;

    // Update document title
    document.title = config.title;

    // Update meta description tag
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", config.description);
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = config.description;
      document.head.appendChild(newMeta);
    }
  }, [location]);

  return null;
}
