import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SEO_CONFIG = {
  "/": {
    title: "Deepstaq | AI courses and training | Learn AI skills",
    description: "Learn AI skills with Deepstaq through expert AI courses and training in Artificial Intelligence, Machine Learning, Generative AI, Agentic AI, and modern AI development"
  },
  "/programs": {
    title: "6-Month Intensive Training Program | Deepstaq Kannur",
    description: "Practical upskilling for the modern creative industry. Master Creative Designing, Digital Marketing, and AI Prompt Engineering with 100% practical training."
  },
  "/blog": {
    title: "DeepStaq Blog | AI/ML Insights & Career Guides",
    description: "Expert guides, career transition strategies, and technical insights on PyTorch, Large Language Models, MLOps, and agentic workflows."
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
  title: "Deepstaq | AI courses and training | Learn AI skills",
  description: "Learn AI skills with Deepstaq through expert AI courses and training in Artificial Intelligence, Machine Learning, Generative AI, Agentic AI, and modern AI development"
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
