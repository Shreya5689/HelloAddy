import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); 
    navigate("/App"); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF3E1]">
      <div className="w-[35%] h-[50%] bg-[#F5E7C6] p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Log In</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-[#222222] text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
