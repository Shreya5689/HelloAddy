import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import authApi from "../api_sevices/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // States
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // --- STEP 1: Send OTP to Email ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const res= await authApi.forgotPassword({ email });
      if (res.status === 200 || res.status === 201) {
        setSent(true);
        setSuccess("OTP sent to your email!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: Reset Password with OTP ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.resetPassword({ otp, email, password});
      setSuccess("Password changed successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP or request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[var(--primary)] text-[var(--text-primary)]">
      <div className="w-[90%] max-w-md flex flex-col gap-4 p-8 bg-[var(--secondary)] rounded-xl shadow-lg border border-[var(--card)]">
        
        <h1 className="text-3xl font-semibold text-center">
          {sent ? "Reset Password" : "Forgot Password"}
        </h1>
        
        <p className="text-sm text-center text-[var(--text-secondary)]">
          {sent 
            ? "Enter the OTP we sent and your new password" 
            : "Enter your email to receive a password reset OTP"}
        </p>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        {success && <p className="text-sm text-green-500 text-center">{success}</p>}

        {/* --- DYNAMIC VIEW TOGGLE --- */}
        {!sent ? (
          /* VIEW 1: Request OTP */
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-lg border border-[var(--card)] bg-transparent outline-none focus:ring-2 focus:ring-[var(--tertiary)]"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[var(--card)] text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          /* VIEW 2: Reset Password */
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              autoComplete="one-time-code"
              onChange={(e) => setOtp(e.target.value)}
              className="px-4 py-3 rounded-lg border border-[var(--card)] bg-transparent outline-none focus:ring-2 focus:ring-[var(--tertiary)]"
            />
            <input
              type="password"
              placeholder="New Password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-lg border border-[var(--card)] bg-transparent outline-none focus:ring-2 focus:ring-[var(--tertiary)]"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              autoComplete="new-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-3 rounded-lg border border-[var(--card)] bg-transparent outline-none focus:ring-2 focus:ring-[var(--tertiary)]"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[var(--card)] text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
            <button 
              type="button"
              onClick={() => setSent(false)} 
              className="text-xs text-center text-[var(--text-secondary)] hover:underline"
            >
              Wait, I didn't get the email? (Resend)
            </button>
          </form>
        )}
      </div>
    </div>
  );
}