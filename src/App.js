import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import BackToTopButton from "./components/BackToTopButton";
import Slot from "./pages/Slot";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <BackToTopButton />
      <div className="relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/slot" element={<Slot />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;