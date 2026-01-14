import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Problems() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setTopic(e.target.value);
  };
  const token = localStorage.getItem("access_token");
  // console.log(token)
    if (!token) navigate("/login");
  const handleSubmit = () => {
    if (!topic.trim()) return;

    setLoading(true);

    navigate("/home", {
      state: { topic },
    });
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[var(--primary)]">
      <div className="w-[80%] h-[80%] flex flex-col items-center gap-4 p-8 bg-[var(--secondary)] rounded-xl shadow-lg">
        <h1 className="text-3xl font-semibold text-[var(--card)]">
          Welcome to our App!
        </h1>

        <input
          type="text"
          value={topic}
          placeholder="What do you need to learn today!?"
          onChange={handleChange}
          className="w-80 px-4 py-3 rounded-lg border border-[var(--card)] outline-none focus:ring-2 focus:ring-gray-800"
        />

        <button
          onClick={handleSubmit}
          className="mt-2 bg-[var(--card)] text-white py-2 px-6 rounded-lg hover:opacity-90 transition"
        >
          Submit
        </button>

        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}
