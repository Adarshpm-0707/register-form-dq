import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import BackToTopButton from "./components/BackToTopButton";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SecurityGuard from "./components/SecurityGuard";
import SEO from "./components/SEO";
import Background3D from "./components/Background3D";
import WaterBubbles from "./components/WaterBubbles";
import "./styles/global.css";
import "./styles/effects.css";

// Lazy-loaded pages for instant code-splitting and zero navigation lag
const Home = lazy(() => import("./pages/Home"));
const Programs = lazy(() => import("./pages/Programs"));

// 7 Dedicated AI/ML Course & Guide Pages
const AiCourse = lazy(() => import("./pages/AiCourse"));
const MachineLearningCourse = lazy(() => import("./pages/MachineLearningCourse"));
const AiMlCourse = lazy(() => import("./pages/AiMlCourse"));
const OfflineAiCourse = lazy(() => import("./pages/OfflineAiCourse"));
const AiCourseKannur = lazy(() => import("./pages/AiCourseKannur"));
const OnlineAiCourse = lazy(() => import("./pages/OnlineAiCourse"));
const AiMlCourseGuide = lazy(() => import("./pages/AiMlCourseGuide"));

const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Aptitude = lazy(() => import("./pages/Aptitude"));
const Admission = lazy(() => import("./pages/Admission"));
const Contact = lazy(() => import("./pages/Contact"));
const Consultation = lazy(() => import("./pages/Consultation"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));

const PageFallback = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-[#c6ff34] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-[#050521]">
      {!isAdmin && <Background3D />}
      {!isAdmin && <WaterBubbles />}
      {!isAdmin && <Navbar />}
      <div className="flex-grow">
        <Suspense fallback={<PageFallback />}>
          {children}
        </Suspense>
      </div>
      {!isAdmin && <Footer />}
    </div>
  );
};

function App() {
  return (
    <SecurityGuard>
      <Router>
        <SEO />
        <ScrollToTop />
        <BackToTopButton />
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programs" element={<Programs />} />

            {/* 7 Separate AI/ML Course & Guide Pages */}
            <Route path="/ai-course" element={<AiCourse />} />
            <Route path="/machine-learning-course" element={<MachineLearningCourse />} />
            <Route path="/ai-ml-course" element={<AiMlCourse />} />
            <Route path="/offline-ai-course" element={<OfflineAiCourse />} />
            <Route path="/ai-course-kannur" element={<AiCourseKannur />} />
            <Route path="/online-ai-course" element={<OnlineAiCourse />} />
            <Route path="/ai-ml-course-guide" element={<AiMlCourseGuide />} />

            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/aptitude" element={<Aptitude />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </AppLayout>
      </Router>
    </SecurityGuard>
  );
}

export default App;
