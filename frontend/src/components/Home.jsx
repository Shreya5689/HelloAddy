import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import problemsApi from "../api_sevices/problems_api";
import useWorkspaceStore from "../store/workspaceStore";

export default function Home() {
  const location = useLocation();
  const { topic } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState([]);
  const [attempted, setAttempted] = useState({});

  const addAttempted = useWorkspaceStore((s) => s.addAttempted);

  useEffect(() => {
    if (!topic) return;

    const fetchProblems = async () => {
      try {
        setLoading(true);

        const res = await problemsApi.problem(topic);

        const leetcode = res.data.problems.map(p => ({
          title: p.title,
          difficulty: p.difficulty,
          url: `https://leetcode.com/problems/${toKebabCase(p.title)}`,
          platform: "leetcode",
          paidOnly: p.paid_only
        }));

        const codeforces = (res.data["codeforces-problems"] || []).map(p => ({
          title: p.name,
          difficulty: p.rating ? `Rating ${p.rating}` : "N/A",
          url: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
          platform: "codeforces"
        }));

        setProblems([...leetcode, ...codeforces]);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [topic]);

  function toKebabCase(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  return (
    <div className="w-full min-h-screen bg-[var(--primary)] flex justify-center py-10">
      <div className="w-[70vw] bg-[var(--secondary)] rounded-xl shadow-lg p-6">
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
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="bg-white p-4 rounded shadow hover:shadow-md transition relative">
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (!attempted[index]) {
                        addAttempted({
                          title: p.title,
                          url: p.url,
                          platform: p.platform,
                          done: false,
                        });
                      }

                      setAttempted(prev => ({
                        ...prev,
                        [index]: !prev[index]
                      }));
                    }}
                    className="absolute top-2 right-2 cursor-pointer text-lg"
                  >
                    {attempted[index] ? "✅" : "⬜"}
                  </span>

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
