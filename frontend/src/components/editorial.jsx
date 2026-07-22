import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api_sevices/middleware";

export default function Editorial() {
  const location = useLocation();
  const navigate = useNavigate();
  const { problem } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [editorialData, setEditorialData] = useState(null);
  const [activeLang, setActiveLang] = useState("python");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  // Single dropdown toggle for Editorial
  const [isEditorialOpen, setIsEditorialOpen] = useState(false);

  // Progressive hint reveal state: { 0: boolean, 1: boolean, 2: boolean }
  const [revealedHints, setRevealedHints] = useState({});

  const toggleHint = (index) => {
    setRevealedHints((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    if (!problem) return;

    const fetchEditorial = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post("/problems/generate_editorial", {
          title: problem.title || problem.name,
          platform: problem.platform || "LeetCode",
          difficulty: problem.difficulty || "Medium",
        });

        setEditorialData(response.data);
      } catch (err) {
        console.error(err);
        setError("Could not generate AI Editorial. Showing video tutorials below.");
      } finally {
        setLoading(false);
      }
    };

    fetchEditorial();
  }, [problem]);

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-white">
        <h2 className="text-xl font-bold mb-4">No problem selected</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#c5ff00] text-black font-semibold rounded hover:bg-[#aee600]"
        >
          Go Back
        </button>
      </div>
    );
  }

  const editorial = editorialData?.editorial;
  const videos = editorialData?.videos || [];
  const hints = editorial?.hints || [];

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getActiveCode = () => {
    if (!editorial) return "";
    if (activeLang === "python") return editorial.code_python || "";
    if (activeLang === "cpp") return editorial.code_cpp || "";
    if (activeLang === "java") return editorial.code_java || "";
    return "";
  };

  return (
    <div
      className="w-full min-h-[85vh] flex flex-col items-center py-10 px-4 font-sans text-white"
      style={{
        backgroundColor: "#020a13",
        backgroundImage: "radial-gradient(circle at 50% 10%, #08213b 0%, #020a13 70%)",
      }}
    >
      <div className="w-full max-w-4xl bg-[#061424]/80 border border-[#0f2b48] shadow-2xl backdrop-blur-md rounded-xl p-8 relative">
        {/* Cyber Hooks */}
        <div className="absolute top-[-1px] left-[-1px] w-4 h-4 border-t-2 border-l-2 border-[#c5ff00]"></div>
        <div className="absolute bottom-[-1px] right-[-1px] w-4 h-4 border-b-2 border-r-2 border-[#c5ff00]"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-xs uppercase tracking-widest text-[#587b9a] hover:text-[#c5ff00] transition-colors mb-6 flex items-center gap-2"
        >
          ← Return to Saved Sheet
        </button>

        {/* Header */}
        <div className="border-b border-[#0f2b48] pb-6 mb-8">
          <span className="text-[10px] tracking-[0.3em] font-extrabold text-[#c5ff00] uppercase block mb-2">
            SOLUTION & EDITORIAL // {problem.platform}
          </span>
          <h1 className="text-3xl font-black">{problem.title || problem.name}</h1>
          <div className="flex gap-4 mt-3">
            <span className="text-xs bg-[#0f2b48] px-3 py-1 rounded-full text-gray-300">
              Platform: <span className="font-bold text-white uppercase">{problem.platform}</span>
            </span>
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold bg-[#0f2b48] ${
                problem.difficulty?.toLowerCase() === "easy"
                  ? "text-green-400"
                  : problem.difficulty?.toLowerCase() === "medium"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              Difficulty: {problem.difficulty}
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {/* Responsive 3-Video Walkthrough Cards Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#c5ff00]">Video Tutorial Walkthroughs</h3>
              <span className="text-[10px] text-[#587b9a] font-mono uppercase tracking-wider">
                Top YouTube Solutions
              </span>
            </div>

            {videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {videos.map((vid, idx) => (
                  <a
                    key={idx}
                    href={vid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group bg-[#030d1a] border border-[#0f2b48] rounded-xl overflow-hidden shadow-lg hover:border-[#c5ff00]/60 hover:shadow-[0_0_20px_rgba(197,255,0,0.15)] transition-all duration-300 flex flex-col p-3"
                  >
                    <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3 bg-[#051524]">
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#061424]/90 border border-[#0f2b48] group-hover:border-[#c5ff00] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                          <svg className="w-4 h-4 text-[#c5ff00] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#c5ff00] line-clamp-2 mb-2 transition-colors">
                      {vid.title}
                    </h4>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#0f2b48]/60 text-[10px] text-[#587b9a] font-mono">
                      <span className="truncate max-w-[70%]">{vid.channel}</span>
                      <span className="text-[#c5ff00] group-hover:translate-x-0.5 transition-transform">Watch →</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  `${problem.platform} ${problem.title || problem.name} solution walkthrough`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group block w-full p-6 rounded-xl border border-[#0f2b48] bg-[#030d1a] hover:border-[#c5ff00]/50 transition-all text-center"
              >
                <p className="text-sm text-gray-300 font-medium">Click to search YouTube solution walkthroughs</p>
                <span className="text-xs text-[#c5ff00] mt-1 inline-block">Search YouTube →</span>
              </a>
            )}
          </section>

          {/* AI Generation Loading Skeleton */}
          {loading && (
            <div className="py-12 bg-[#051524] border border-[#0f2b48] rounded-xl flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-[#c5ff00] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-[#587b9a] animate-pulse">
                Generating AI solution, progressive hints, and tutorial analysis...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="bg-red-900/20 border border-red-500/40 text-red-300 p-4 rounded-lg text-xs">
              {error}
            </div>
          )}

          {/* Solution & Editorial Content */}
          {!loading && editorial && (
            <div className="space-y-8 pt-4 border-t border-[#0f2b48]">
              {/* Hints Section */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#c5ff00]">Progressive Hints</h3>
                    <p className="text-xs text-[#587b9a] mt-0.5">
                      Need a push in the right direction? Reveal hints step-by-step before checking the full solution.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(hints.length > 0 ? hints : [
                    "Think about key properties or constraints of the input data.",
                    "Consider suitable data structures (e.g., Hash Maps, Two Pointers, or Dynamic Programming).",
                    "Formulate the transition step to optimize time complexity."
                  ]).map((hintText, index) => {
                    const isRevealed = revealedHints[index];
                    return (
                      <div
                        key={index}
                        className="bg-[#051524] border border-[#0f2b48] rounded-lg overflow-hidden transition-all"
                      >
                        <div
                          onClick={() => toggleHint(index)}
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#082037] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold bg-[#c5ff00]/10 text-[#c5ff00] border border-[#c5ff00]/30 px-2.5 py-1 rounded">
                              HINT {index + 1}
                            </span>
                            <span className="text-xs font-semibold text-gray-300">
                              {isRevealed ? `Hint ${index + 1} Unlocked` : `Click to reveal Hint ${index + 1}`}
                            </span>
                          </div>
                          <button
                            className="text-xs font-mono text-[#c5ff00] hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleHint(index);
                            }}
                          >
                            {isRevealed ? "Hide Hint ▲" : "Reveal Hint ▼"}
                          </button>
                        </div>

                        {isRevealed && (
                          <div className="p-4 pt-0 text-sm text-[#8fa3b5] leading-relaxed border-t border-[#0f2b48]/50 bg-[#030d1a]/50">
                            <p className="pt-3">{hintText}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Full Editorial as a Single Entity Dropdown */}
              <section className="border border-[#0f2b48] bg-[#041220] rounded-xl overflow-hidden shadow-xl">
                {/* Dropdown Accordion Header */}
                <button
                  onClick={() => setIsEditorialOpen(!isEditorialOpen)}
                  className="w-full p-5 flex items-center justify-between bg-[#06182a] hover:bg-[#0a233c] transition-colors border-b border-[#0f2b48]"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-[#c5ff00]/10 border border-[#c5ff00]/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#c5ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-wide">
                        Full Solution Editorial
                      </h3>
                      <p className="text-xs text-[#587b9a]">
                        Complete breakdown: Intuition, Approach, Complexity & Source Code
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-[#051524] border border-[#0f2b48] px-3 py-1.5 rounded-lg text-xs font-mono text-[#c5ff00]">
                    <span>{isEditorialOpen ? "Collapse Editorial" : "View Editorial"}</span>
                    <span className="transform transition-transform duration-200" style={{ transform: isEditorialOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                      ▼
                    </span>
                  </div>
                </button>

                {/* Dropdown Accordion Content Body */}
                {isEditorialOpen && (
                  <div className="p-6 space-y-8 animate-fadeIn">
                    {/* Intuition */}
                    <section>
                      <h4 className="text-sm uppercase tracking-wider font-bold text-[#c5ff00] mb-3">
                        Intuition & Pattern
                      </h4>
                      <p className="text-[#8fa3b5] leading-relaxed bg-[#051524] p-4 rounded-lg border border-[#0f2b48] text-sm">
                        {editorial.intuition}
                      </p>
                    </section>

                    {/* Step-by-Step Approach */}
                    <section>
                      <h4 className="text-sm uppercase tracking-wider font-bold text-[#c5ff00] mb-3">
                        Step-by-Step Approach
                      </h4>
                      <div className="text-[#8fa3b5] leading-relaxed bg-[#051524] p-4 rounded-lg border border-[#0f2b48] text-sm whitespace-pre-line">
                        {editorial.approach}
                      </div>
                    </section>

                    {/* Complexity Analysis */}
                    <section>
                      <h4 className="text-sm uppercase tracking-wider font-bold text-[#c5ff00] mb-3">
                        Complexity Analysis
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#051524] p-4 rounded-lg border border-[#0f2b48]">
                          <div className="text-xs uppercase tracking-widest text-[#587b9a] mb-1">Time Complexity</div>
                          <div className="text-xl font-bold font-mono text-[#c5ff00]">{editorial.time_complexity}</div>
                          <div className="text-xs text-gray-400 mt-1">{editorial.time_complexity_explanation}</div>
                        </div>
                        <div className="bg-[#051524] p-4 rounded-lg border border-[#0f2b48]">
                          <div className="text-xs uppercase tracking-widest text-[#587b9a] mb-1">Space Complexity</div>
                          <div className="text-xl font-bold font-mono text-[#c5ff00]">{editorial.space_complexity}</div>
                          <div className="text-xs text-gray-400 mt-1">{editorial.space_complexity_explanation}</div>
                        </div>
                      </div>
                    </section>

                    {/* Solution Code */}
                    <section>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm uppercase tracking-wider font-bold text-[#c5ff00]">
                          Solution Code
                        </h4>
                        <div className="flex gap-2 bg-[#051524] p-1 rounded-lg border border-[#0f2b48]">
                          {["python", "cpp", "java"].map((lang) => (
                            <button
                              key={lang}
                              onClick={() => setActiveLang(lang)}
                              className={`px-3 py-1 text-xs rounded uppercase font-mono transition-all ${
                                activeLang === lang
                                  ? "bg-[#c5ff00] text-black font-bold"
                                  : "text-gray-400 hover:text-white"
                              }`}
                            >
                              {lang === "cpp" ? "C++" : lang}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="relative bg-[#010810] border border-[#0f2b48] rounded-lg overflow-hidden">
                        <button
                          onClick={() => copyToClipboard(getActiveCode())}
                          className="absolute top-3 right-3 text-xs bg-[#0f2b48] hover:bg-[#153c65] text-gray-300 px-3 py-1 rounded font-mono transition-colors z-10"
                        >
                          {copied ? "Copied!" : "Copy Code"}
                        </button>
                        <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                          {getActiveCode()}
                        </pre>
                      </div>
                    </section>

                    {/* Edge Cases */}
                    {editorial.edge_cases && (
                      <section>
                        <h4 className="text-sm uppercase tracking-wider font-bold text-[#c5ff00] mb-3">
                          Edge Cases & Pitfalls
                        </h4>
                        <div className="bg-[#051524] p-4 rounded-lg border border-[#0f2b48] text-sm text-[#8fa3b5]">
                          {editorial.edge_cases}
                        </div>
                      </section>
                    )}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <section className="pt-6 border-t border-[#0f2b48]/50 flex justify-between items-center mt-8">
          <span className="text-[10px] font-mono text-[#587b9a]">
            SHADOW SOVEREIGN // GEMINI EDITORIAL MODULE V1.0
          </span>
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#c5ff00] hover:bg-[#aee600] text-black font-extrabold px-6 py-3 rounded-lg text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(197,255,0,0.15)]"
          >
            Solve Problem Live
          </a>
        </section>
      </div>
    </div>
  );
}