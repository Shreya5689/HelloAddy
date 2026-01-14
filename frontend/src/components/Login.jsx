import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api_sevices/auth";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const body = {
        "username": username,
        "password" : password
      }

      const res = await authApi.login(body);
      const data = res.data;

      console.log(data)
      localStorage.setItem("access_token", data.access_token);

      navigate("/problems");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--primary)]">
      <div className="w-[35%] bg-[var(--secondary)] p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Log In</h1>

        {error && <p className="text-red-600 text-center">{error}</p>}

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          <button className="w-full bg-[var(--card)] text-white py-2 rounded-lg">
            Log In
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
