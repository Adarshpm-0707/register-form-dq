import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Background3D from "../../components/Background3D";

export default function AdminSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/admin/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050521] text-white flex items-center justify-center p-6">
      <Background3D />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,255,52,0.05)_0%,transparent_70%)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-10 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="text-[#c6ff34] font-black text-xs uppercase tracking-[0.5em] mb-4">New_Registration</div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Admin <span className="text-[#c6ff34]">Signup</span></h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-4">Full Name</label>
            <input 
              type="text" 
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:border-[#c6ff34] focus:outline-none transition-all font-bold"
              placeholder="Admin Name"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-4">Identifier</label>
            <input 
              type="email" 
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:border-[#c6ff34] focus:outline-none transition-all font-bold"
              placeholder="admin@deepstaq.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-4">Access Key</label>
            <input 
              type="password" 
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:border-[#c6ff34] focus:outline-none transition-all font-bold"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#c6ff34] text-[#050521] font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-sm hover:shadow-[0_20px_50px_rgba(198,255,52,0.3)] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/admin/login" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-[#c6ff34] transition-colors">
            Already have credentials? Enter System
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
