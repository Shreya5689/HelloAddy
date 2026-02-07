import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ===================== TOPIC GROUPS ===================== */

const CODEFORCES_TOPICS = [
  "expression parsing", "string suffix structures", "2-sat", "hashing",
  "schedules", "dfs and similar", "strings", "graphs", "special",
  "greedy", "two pointers", "geometry", "implementation", "brute force",
  "trees", "meet-in-the-middle", "flows", "constructive algorithms",
  "matrices", "dsu", "combinatorics", "fft", "graph matchings", "math",
  "bitmasks", "data structures", "chinese remainder theorem",
  "divide and conquer", "probabilities", "sortings", "binary search",
  "games", "dp", "ternary search", "shortest paths", "number theory",
  "interactive"
];

const LEETCODE_TOPICS = [
  "monotonic-stack", "data-stream", "iterator", "radix-sort",
  "breadth-first-search", "dynamic-programming", "line-sweep",
  "merge-sort", "topological-sort", "enumeration", "counting-sort",
  "bit-manipulation", "bucket-sort", "recursion", "backtracking",
  "binary-indexed-tree", "stack", "queue", "heap-priority-queue",
  "prefix-sum", "sliding-window", "trie", "segment-tree",
  "union-find", "binary-tree", "linked-list"
];

/* ===================== COMPONENT ===================== */

export default function Problems() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  if (!token) navigate("/login");

  const [topic, setTopic] = useState("");
  const [selectedTopics_leetcode, setSelectedTopics_leetcode] = useState([]);
  const [selectedTopics_codeforces, setSelectedTopics_codeforces] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleTopic = (t) => {
    setSelectedTopics_leetcode((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const toggleTopic_codeforces = (t) => {
    setSelectedTopics_codeforces((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );     
  };

  const handleSubmit = () => {
    if (!topic.trim()) return;

    setLoading(true);
    navigate("/home", {
      state: {
        topic: topic,
        tags_leetcode: null,
        tags_codeforces: null
      },
    });
  };

    const handle_checkbox_Submit = () => {
    if (selectedTopics_leetcode.length === 0 && selectedTopics_codeforces.length === 0) return;

    setLoading(true);
    navigate("/home", {
      state: {
        topic: null,
        tags_codeforces: selectedTopics_codeforces,
        tags_leetcode: selectedTopics_leetcode
      },
    });
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[var(--primary)]">
      <div className="w-[90%] min-h-[80%] grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-[var(--secondary)] rounded-xl shadow-lg">

        {/* LEFT SIDE — INPUT */}
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-semibold text-[var(--card)]">
            Welcome to our App!
          </h2>

          <input
            type="text"
            value={topic}
            placeholder="What do you need to learn?"
            onChange={(e) => setTopic(e.target.value)}
            className="w-80 px-4 py-3 rounded-lg border border-[var(--card)] outline-none focus:ring-2 focus:ring-gray-800"
          />

          <button
            onClick={handleSubmit}
            className="bg-[var(--card)] text-white py-2 px-6 rounded-lg hover:opacity-90 transition"
          >
            Submit
          </button>
        </div>

        {/* RIGHT SIDE — CHECKBOXES */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-[var(--card)] text-center">
            Or Select Topics
          </h2>

          <div className="max-h-[400px] overflow-y-auto p-3 border rounded-lg space-y-4">

            {/* LeetCode */}
            <div>
              <h3 className="font-bold text-blue-600 mb-2">
                🟦 LeetCode Tags
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {LEETCODE_TOPICS.map((t) => (
                  <label
                    key={t}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTopics_leetcode.includes(t)}
                      onChange={() => toggleTopic(t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            {/* Codeforces */}
            <div>
              <h3 className="font-bold text-red-600 mb-2">
                🟥 Codeforces Tags
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {CODEFORCES_TOPICS.map((t) => (
                  <label
                    key={t}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTopics_codeforces.includes(t)}
                      onChange={() => toggleTopic_codeforces(t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

          </div>

          <button
            onClick={handle_checkbox_Submit}
            className="self-center mt-2 bg-[var(--card)] text-white py-2 px-6 rounded-lg hover:opacity-90 transition"
          >
            Submit Selected
          </button>
        </div>

        {loading && (
          <p className="col-span-full text-center text-sm">Loading...</p>
        )}
      </div>
    </div>
  );
}
