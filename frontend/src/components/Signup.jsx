import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api_sevices/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // console.log("Mai aaya")
    const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !password || !email) {
      setError("Please fill in all fields");
      return;
    }
    // console.log("Maai aagya")
    // Navigate to ranking, passing state
    console.log("mai signup se chla")
    navigate("/ranking", { state: { username, email, password } });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF3E1]">
      <div className="w-[35%] bg-[#F5E7C6] p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>

        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        <form className="space-y-4" onSubmit={handleSignup}>
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
            required
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

          <button className="w-full bg-black text-white py-2 rounded-lg">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
