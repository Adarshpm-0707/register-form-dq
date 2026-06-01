import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ensure their document exists in the admins collection (useful for pre-existing accounts)
      const adminDocRef = doc(db, "admins", user.email);
      const adminDoc = await getDoc(adminDocRef);
      if (!adminDoc.exists()) {
        await setDoc(adminDocRef, {
          email: user.email,
          uid: user.uid,
          role: "admin",
          createdAt: serverTimestamp()
        });
      }

      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center bg-[#f8f9fa] text-[#050521]">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-[#050521]/5">
        <h1 className="text-2xl font-black mb-6 text-center tracking-tight">Admin Login</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#f8f9fa] border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] focus:ring-4 focus:ring-[#c6ff34]/20 transition-all font-medium"
              placeholder="admin@deepstaq.com"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050521]/60 ml-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#f8f9fa] border border-[#050521]/10 rounded-2xl px-5 py-4 outline-none focus:border-[#c6ff34] focus:ring-4 focus:ring-[#c6ff34]/20 transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-[#050521] text-white font-black tracking-[0.2em] text-sm uppercase rounded-2xl py-4 hover:bg-[#c6ff34] hover:text-[#050521] transition-colors duration-300 shadow-lg shadow-[#050521]/20 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs font-bold text-[#050521]/60">
          Admin access is restricted.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
