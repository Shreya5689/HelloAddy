import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const location = useLocation();
  const { topic } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    if (!topic) return;

    const fetchProblems = async () => {
      try {
        setLoading(true);

        const res = await axios.post(
          `http://127.0.0.1:8000/problems/${topic}`
        );

        setProblems(res.data.problems);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [topic]);

  // Convert title → LeetCode slug
  function toKebabCase(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  return (
    <div className="w-full min-h-screen bg-[#FAF3E1] flex justify-center py-10">
      <div className="w-[70vw] bg-[#F5E7C6] rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Problems for "{topic}"
        </h1>

        {loading ? (
          <p className="text-center mt-6">Loading problems...</p>
        ) : problems.length === 0 ? (
          <p className="text-center mt-6">No problems found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {problems.map((p, index) => (
              <a
                key={index}
                href={`https://leetcode.com/problems/${toKebabCase(p.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
                  <h2 className="font-bold">{p.title}</h2>
                  <p className="text-sm">Difficulty: {p.difficulty}</p>

                  {p.paidOnly && (
                    <span className="text-xs text-red-600">
                      Premium
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
