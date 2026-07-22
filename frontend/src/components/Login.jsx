import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api_sevices/auth";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const body = {
        "username": username,
        "password": password,
        "email": email
      };

      const res = await authApi.login(body);
      const data = res.data;

      console.log(data);
      localStorage.setItem("access_token", data.access_token);

      navigate("/problems");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden py-12 px-4 bg-[var(--primary)]">
      {/* Self-contained CSS Keyframes for Scan Line Effect */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 0.8; }
          95% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
        .scanner-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(197, 255, 0, 0.4), rgba(255, 255, 255, 0.9), rgba(197, 255, 0, 0.4), transparent);
          box-shadow: 0 0 10px rgba(197, 255, 0, 0.7);
          animation: scan 4s infinite linear;
          pointer-events: none;
          z-index: 50;
        }
      `}</style>

      {/* Cyber Login Card */}
      <div className="relative bg-[var(--secondary)]/90 border border-[var(--border-soft)] w-full max-w-[450px] p-8 shadow-2xl rounded-[3px] z-10 flex flex-col overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--card)]"></div>
        
        {/* Holographic Scan Line */}
        <div className="scanner-line"></div>
        
        {/* Header Decor */}
        <div className="flex justify-between items-center text-[8px] font-mono tracking-widest text-[var(--text-secondary)] mb-6">
          <span>IPR \\ 8</span>
          <span>8 \\ L</span>
        </div>

        <h1 
          className="text-3xl font-black text-center text-[var(--card)] tracking-widest font-mono uppercase mb-1"
          style={{ textShadow: '0 0 10px rgba(197, 255, 0, 0.5)' }}
        >
          LOGIN
        </h1>
        <span className="text-[9px] font-mono tracking-widest text-[var(--card)]/60 block text-center mb-8">
          PROTOCOL: LOGIN_V4.2
        </span>

        {error && <p className="text-red-500 font-mono text-xs text-center mb-4">{error}</p>}

        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Inputs kept 100% identical to original code */}
          <input
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border"
          />
          
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border"
          />

          <input
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border"
          />

          {/* Submit Button */}
          <button className="w-full bg-[var(--card)] hover:opacity-90 text-[var(--primary)] font-mono font-black py-3.5 rounded-[2px] uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-[0_0_15px_rgba(197,255,0,0.25)] cursor-pointer mt-6 border-none">
            Submit
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-3 font-mono text-[9px] tracking-widest uppercase">
          <Link to="/forgot-password" title="reset-password" id="forgot-password-link" className="text-[var(--text-secondary)] hover:text-[var(--card)] transition-colors block">
            FORGOT PASSWORD?
          </Link>
          <p className="text-[var(--text-secondary)]">
            NEW USER?{" "}
            <Link to="/signup" className="text-[var(--card)] font-bold hover:underline">
              REGISTER
            </Link>
          </p>
        </div>

        {/* Bottom Decor */}
        <div className="flex justify-between items-center text-[8px] font-mono tracking-widest text-[var(--text-secondary)] mt-6 pt-2 border-t border-[var(--border-soft)]/40">
          <span>P &lt; I</span>
          <span>M \\ 6</span>
        </div>

      </div>
    </div>
  );
}