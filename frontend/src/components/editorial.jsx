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
  
  // Track revealed hints state: [false, false, false]
  const [revealedHints, setRevealedHints] = useState([false, false, false]);

  // YouTube search query link
  const youtubeSearchUrl = problem ? `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${problem.platform} ${problem.title || problem.name} solution walkthrough`
  )}` : "#";

  useEffect(() => {
    if (!problem) return;

    const fetchEditorial = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post("/problems/generate_editorial", {
          title: problem.title || problem.name,
          platform: problem.platform || "LeetCode",
          difficulty: problem.difficulty || "Medium"
        });

        setEditorialData(response.data);
      } catch (err) {
        console.error(err);
        setError("Could not generate AI Editorial. You can still search YouTube tutorial walkthroughs below.");
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

  const toggleHint = (index) => {
    setRevealedHints((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <div 
      className="w-full min-h-[85vh] flex flex-col items-center py-10 px-4 font-sans text-white"
      style={{ 
        backgroundColor: '#020a13', 
        backgroundImage: 'radial-gradient(circle at 50% 10%, #08213b 0%, #020a13 70%)' 
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
          ← Return to Sheet
        </button>

        {/* Header */}
        <div className="border-b border-[#0f2b48] pb-6 mb-8">
          <span className="text-[10px] tracking-[0.3em] font-extrabold text-[#c5ff00] uppercase block mb-2">
            AI EDITORIAL & HINTS // {problem.platform}
          </span>
          <h1 className="text-3xl font-black">{problem.title || problem.name}</h1>
          <div className="flex gap-4 mt-3">
            <span className="text-xs bg-[#0f2b48] px-3 py-1 rounded-full text-gray-300">
              Platform: <span className="font-bold text-white uppercase">{problem.platform}</span>
            </span>
            <span className={`text-xs px-3 py-1 rounded-full font-bold bg-[#0f2b48] ${
              problem.difficulty?.toLowerCase() === 'easy' ? 'text-green-400' :
              problem.difficulty?.toLowerCase() === 'medium' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              Difficulty: {problem.difficulty}
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {/* YouTube Video Walkthrough Player Card */}
          <section>
            <h3 className="text-lg font-bold text-[#c5ff00] mb-4">Video Tutorial Walkthrough</h3>
            <a 
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group block w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden border border-[#0f2b48] bg-[#030d1a] shadow-lg transition-all duration-300 hover:border-[#c5ff00]/50 hover:shadow-[0_0_25px_rgba(197,255,0,0.1)]"
            >
              <div className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-300 bg-[linear-gradient(to_right,#153c65_1px,transparent_1px),linear-gradient(to_bottom,#153c65_1px,transparent_1px)] [background-size:24px_24px]"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#020a13]/90 via-[#020a13]/40 to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-36 bg-[#c5ff00]/5 blur-[70px] rounded-full group-hover:bg-[#c5ff00]/10 transition-all duration-500"></div>

              <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start">
                <div className="max-w-[75%]">
                  <span className="text-[10px] tracking-widest text-[#587b9a] uppercase font-bold block mb-1">
                    YouTube Walkthrough Guide
                  </span>
                  <h4 className="text-lg font-bold text-white group-hover:text-[#c5ff00] transition-colors duration-300 truncate">
                    {problem.platform?.toUpperCase()}: {problem.title || problem.name}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono uppercase tracking-wider animate-pulse">
                    Live
                  </span>
                  <span className="text-[9px] bg-[#c5ff00]/10 text-[#c5ff00] border border-[#c5ff00]/30 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                    Tutorial
                  </span>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-16 h-16 rounded-full bg-[#061424]/90 border border-[#0f2b48] group-hover:border-[#c5ff00] flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-2xl group-hover:shadow-[0_0_25px_rgba(197,255,0,0.35)]">
                  <svg className="w-6 h-6 text-[#587b9a] group-hover:text-[#c5ff00] transition-colors duration-300 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col gap-3">
                <div className="w-full h-1 bg-[#0f2b48] rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-[#c5ff00] group-hover:w-full transition-all duration-1000 ease-out"></div>
                </div>
                <div className="flex items-center justify-between text-xs text-[#587b9a]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono">Click to search YouTube solutions</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono">Search: "{problem.title || problem.name}"</span>
                  </div>
                </div>
              </div>
            </a>
          </section>

          {/* AI Generation Loading Skeleton */}
          {loading && (
            <div className="py-12 bg-[#051524] border border-[#0f2b48] rounded-xl flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-[#c5ff00] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-[#587b9a] animate-pulse text-center px-4">
                Generating 3 progressive hints & AI solution editorial via Gemini AI...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="bg-red-900/20 border border-red-500/40 text-red-300 p-4 rounded-lg text-xs">
              {error}
            </div>
          )}

          {/* 💡 Progressive Solution Hints (Below Video) */}
          {!loading && hints.length > 0 && (
            <section className="pt-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#c5ff00] flex items-center gap-2">
                  <span>💡</span> Progressive Solution Hints (3 Hints)
                </h3>
                <span className="text-xs text-[#587b9a] font-mono">Click to reveal hints step-by-step</span>
              </div>

              <div className="space-y-3">
                {hints.map((hintText, index) => {
                  const isRevealed = revealedHints[index];
                  return (
                    <div 
                      key={index} 
                      className={`border rounded-xl transition-all duration-300 overflow-hidden ${
                        isRevealed 
                          ? "bg-[#051a2e] border-[#c5ff00]/50 shadow-[0_0_15px_rgba(197,255,0,0.08)]" 
                          : "bg-[#051524] border-[#0f2b48] hover:border-[#1e4975]"
                      }`}
                    >
                      <button
                        onClick={() => toggleHint(index)}
                        className="w-full p-4 flex items-center justify-between text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-full text-xs font-bold font-mono flex items-center justify-center ${
                            isRevealed 
                              ? "bg-[#c5ff00] text-black" 
                              : "bg-[#0f2b48] text-gray-400"
                          }`}>
                            0{index + 1}
                          </span>
                          <span className="text-sm font-bold text-gray-200">
                            Hint {index + 1}: {index === 0 ? "Initial Pattern & Thinking" : index === 1 ? "Core Algorithm & Data Structure" : "Detailed Step-by-Step Logic"}
                          </span>
                        </div>
                        <span className={`text-xs font-mono px-3 py-1 rounded-full transition-all ${
                          isRevealed 
                            ? "bg-[#c5ff00]/20 text-[#c5ff00] border border-[#c5ff00]/40" 
                            : "bg-[#0f2b48] text-gray-400 hover:text-white"
                        }`}>
                          {isRevealed ? "Hide Hint ▲" : "Reveal Hint ▼"}
                        </span>
                      </button>

                      {isRevealed && (
                        <div className="px-5 pb-5 pt-1 text-sm text-[#a4b8c9] border-t border-[#0f2b48]/60 leading-relaxed bg-[#020d18]/60">
                          {hintText}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* AI Generated Solution Editorial */}
          {!loading && editorial && (
            <div className="space-y-8 pt-6 border-t border-[#0f2b48]">
              {/* Intuition */}
              <section>
                <h3 className="text-lg font-bold text-[#c5ff00] mb-3">Intuition & Pattern</h3>
                <p className="text-[#8fa3b5] leading-relaxed bg-[#051524] p-4 rounded-lg border border-[#0f2b48] text-sm">
                  {editorial.intuition}
                </p>
              </section>

              {/* Approach */}
              <section>
                <h3 className="text-lg font-bold text-[#c5ff00] mb-3">Step-by-Step Approach</h3>
                <div className="text-[#8fa3b5] leading-relaxed bg-[#051524] p-4 rounded-lg border border-[#0f2b48] text-sm whitespace-pre-line">
                  {editorial.approach}
                </div>
              </section>

              {/* Complexity */}
              <section>
                <h3 className="text-lg font-bold text-[#c5ff00] mb-3">Complexity Analysis</h3>
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
                  <h3 className="text-lg font-bold text-[#c5ff00]">Solution Code</h3>
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
                  <h3 className="text-lg font-bold text-[#c5ff00] mb-3">Edge Cases & Pitfalls</h3>
                  <div className="bg-[#051524] p-4 rounded-lg border border-[#0f2b48] text-sm text-[#8fa3b5]">
                    {editorial.edge_cases}
                  </div>
                </section>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <section className="pt-6 border-t border-[#0f2b48]/50 flex justify-between items-center mt-8">
          <span className="text-[10px] font-mono text-[#587b9a]">
            STUDYMATE // GEMINI EDITORIAL & HINTS MODULE
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