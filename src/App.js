import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import EventForm from "./pages/EventForm";
import MasterForm from "./pages/MasterForm";
import AptitudeTest from "./pages/AptitudeTest";
import Assessment from "./pages/Assessment";
import AptitudeResult from "./pages/AptitudeResult";
import ScrollToTop from "./components/ScrollToTop";
import BackToTopButton from "./components/BackToTopButton";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ContactCollection from "./pages/ContactCollection";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <BackToTopButton />
      <div className="relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/event-form" element={<EventForm />} />
          <Route path="/master-form" element={<MasterForm />} />
          <Route path="/aptitude-test" element={<AptitudeTest />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/aptitude-test/result" element={<AptitudeResult />} />
          <Route path="/sync-contacts" element={<ContactCollection />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* <Route path="/admin/signup" element={<AdminSignup />} /> */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard /> 
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;