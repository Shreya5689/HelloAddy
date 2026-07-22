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
    <div 
      className="w-full min-h-[85vh] flex flex-col items-center justify-center font-sans relative overflow-hidden py-8 px-4"
      style={{ 
        backgroundColor: '#020a13', 
        backgroundImage: 'radial-gradient(circle at 85% 25%, #08213b 0%, #020a13 70%)' 
      }}
    >
      {/* Self-contained CSS Keyframes for Horizontal Sweep & Pulsation effects */}
      <style>{`
        @keyframes scanHorizontal {
          0% { left: 0%; opacity: 0.1; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { left: 100%; opacity: 0.1; }
        }
        .scanner-line-horizontal {
          position: absolute;
          top: 0;
          width: 1.5px;
          height: 100%;
          background: linear-gradient(180deg, transparent, rgba(197, 255, 0, 0.3), rgba(255, 255, 255, 0.9), rgba(197, 255, 0, 0.3), transparent);
          box-shadow: 0 0 8px rgba(197, 255, 0, 0.6);
          animation: scanHorizontal 8s infinite ease-in-out alternate;
          pointer-events: none;
          z-index: 50;
        }
        /* Pulsation keyframes for left card (green theme) */
        @keyframes cyberPulseGreen {
          0% { transform: scale(1); box-shadow: 0 0 12px rgba(197, 255, 0, 0.1); border-color: rgba(197, 255, 0, 0.15); }
          50% { transform: scale(1.01); box-shadow: 0 0 20px rgba(197, 255, 0, 0.25); border-color: rgba(197, 255, 0, 0.4); }
          100% { transform: scale(1); box-shadow: 0 0 12px rgba(197, 255, 0, 0.1); border-color: rgba(197, 255, 0, 0.15); }
        }
        .cyber-pulse-green {
          animation: cyberPulseGreen 1.5s infinite ease-in-out;
        }
        /* Pulsation keyframes for right card (cyan theme) */
        @keyframes cyberPulseCyan {
          0% { transform: scale(1); box-shadow: 0 0 12px rgba(197, 255, 0, 0.1); border-color: rgba(197, 255, 0, 0.15); }
          50% { transform: scale(1.01); box-shadow: 0 0 20px rgba(197, 255, 0, 0.25); border-color: rgba(197, 255, 0, 0.4); }
          100% { transform: scale(1); box-shadow: 0 0 12px rgba(197, 255, 0, 0.1); border-color: rgba(197, 255, 0, 0.15); }
        }
        .cyber-pulse-cyan {
          animation: cyberPulseCyan 1.5s infinite ease-in-out;
        }
      `}</style>
      {/* Single Horizontal Scan Line sweeping across the entire page */}
      <div className="scanner-line-horizontal"></div>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-10 items-center z-10">
        
        {/* LEFT SIDE — INPUT */}
        <div className="md:col-span-5 flex flex-col items-start justify-center">
          <span className="text-[10px] tracking-[0.3em] font-extrabold text-[#c5ff00] uppercase mb-2">
            SYSTEM INITIALIZATION
          </span>
          <h1 className="text-5xl font-black text-white leading-tight mb-8">
            Welcome to our <br />
            <span className="text-[#c5ff00]">App!</span>
          </h1>
          {/* Left panel card with corner hooks and green pulsation */}
          <div className="relative bg-[#061424]/60 border border-[#c5ff00]/15 shadow-lg backdrop-blur-md w-full max-w-[420px] p-6 rounded-[3px] cyber-pulse-green">
            {/* Corner Hooks */}
            <div className="absolute top-[-1px] left-[-1px] w-2.5 h-2.5 border-t-2 border-l-2 border-[#c5ff00]"></div>
            <div className="absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 border-b-2 border-r-2 border-[#c5ff00]"></div>
            <span className="text-[9px] uppercase tracking-widest text-[#587b9a] font-bold block mb-3">
              INPUT LEARNING OBJECTIVES
            </span>
            <input
              type="text"
              value={topic}
              placeholder="What do you need to learn?"
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#051524] text-white px-4 py-3 rounded-[2px] border border-[#0f2b48] focus:border-[#c5ff00] outline-none text-sm placeholder-[#3b5b75] transition-all mb-4 border-none"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-[#c5ff00] hover:bg-[#aee600] text-[#020a13] font-black py-3.5 rounded-[3px] uppercase tracking-wider text-xs transition-all duration-300 shadow-[0_0_15px_rgba(197,255,0,0.25)] hover:shadow-[0_0_25px_rgba(197,255,0,0.45)] cursor-pointer border-none"
            >
              SUBMIT REQUEST
            </button>
          </div>
        </div>
        {/* RIGHT SIDE — CHECKBOXES */}
        <div className="md:col-span-7 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-6 bg-[#c5ff00]"></div>
              <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider">
                Or Select Topics
              </h2>
            </div>
            <span className="text-[9px] font-mono tracking-widest text-[#c5ff00] animate-pulse">
              STATUS: SYNCING_RESOURCES . . .
            </span>
          </div>
          {/* Right panel card with corner hooks and cyan pulsation */}
          <div className="relative bg-[#061424]/60 border border-[#0f2b48] shadow-lg backdrop-blur-md p-6 rounded-[3px] flex flex-col cyber-pulse-cyan">
            {/* Corner Hooks */}
            <div className="absolute top-[-1px] left-[-1px] w-2.5 h-2.5 border-t-2 border-l-2 border-[#c5ff00]"></div>
            <div className="absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 border-b-2 border-r-2 border-[#c5ff00]"></div>
            <div className="max-h-[380px] overflow-y-auto pr-2 space-y-6">
              
              {/* LeetCode */}
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-[#0f2b48] pb-1.5">
                  <span className="text-[11px] font-black tracking-wider text-[#c5ff00] uppercase">
                    LEETCODE TAGS
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {LEETCODE_TOPICS.map((t) => {
                    const isChecked = selectedTopics_leetcode.includes(t);
                    return (
                      <label
                        key={t}
                        className="flex items-center gap-3 text-sm cursor-pointer select-none group text-[#8fa3b5] hover:text-white transition-colors"
                      >
                        <div className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-all ${
                          isChecked 
                            ? "border-[#c5ff00] bg-[#c5ff00]/10 text-[#c5ff00]" 
                            : "border-[#587b9a] group-hover:border-white"
                        }`}>
                          {isChecked && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleTopic(t)}
                          style={{ display: "none" }}
                        />
                        <span className={`${isChecked ? 'text-[#c5ff00] font-semibold' : ''}`}>
                          {t}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
              {/* Codeforces */}
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-[#0f2b48] pb-1.5">
                  <span className="text-[11px] font-black tracking-wider text-[#c5ff00] uppercase">
                    CODEFORCES TAGS
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {CODEFORCES_TOPICS.map((t) => {
                    const isChecked = selectedTopics_codeforces.includes(t);
                    return (
                      <label
                        key={t}
                        className="flex items-center gap-3 text-sm cursor-pointer select-none group text-[#8fa3b5] hover:text-white transition-colors"
                      >
                        <div className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-all ${
                          isChecked 
                            ? "border-[#c5ff00] bg-[#c5ff00]/10 text-[#c5ff00]" 
                            : "border-[#587b9a] group-hover:border-white"
                        }`}>
                          {isChecked && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleTopic_codeforces(t)}
                          style={{ display: "none" }}
                        />
                        <span className={`${isChecked ? 'text-[#c5ff00] font-semibold' : ''}`}>
                          {t}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            <button
              onClick={handle_checkbox_Submit}
              className="self-end mt-6 border border-[#c5ff00] text-[#c5ff00] hover:bg-[#c5ff00] hover:text-[#020a13] font-bold py-2.5 px-8 rounded-[3px] uppercase tracking-wider text-xs transition-all duration-300 shadow-[0_0_10px_rgba(197,255,0,0.1)] hover:shadow-[0_0_20px_rgba(197,255,0,0.35)] cursor-pointer"
            >
              SUBMIT SELECTED
            </button>
          </div>
        </div>
        {/* FOOTER STATUS BAR */}
        <div className="col-span-full flex items-center justify-center gap-2 mt-8 pt-6 border-t border-[#0f2b48]/30">
          <div className="w-2 h-2 rounded-full bg-[#c5ff00] animate-pulse"></div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#587b9a] uppercase">
            SHADOW SOVEREIGN SYSTEM V4.0.2 // UPLINK ESTABLISHED
          </span>
        </div>
        {loading && (
          <div className="col-span-full text-center text-sm text-[#c5ff00] mt-2">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}