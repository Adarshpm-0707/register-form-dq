import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import ScrollToTop from "./components/ScrollToTop";
import BackToTopButton from "./components/BackToTopButton";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Slot from "./pages/Slot";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import SEO from "./components/SEO";
import "./styles/global.css";
import "./styles/effects.css";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-[#050521]">
      {!isAdmin && <Navbar />}
      <div className="flex-grow">
        {children}
      </div>
      {!isAdmin && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <SEO />
      <ScrollToTop />
      <BackToTopButton />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/slot" element={<Slot />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
