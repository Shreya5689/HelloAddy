import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Editorial() {
  const location = useLocation();
  const navigate = useNavigate();
  const { problem } = location.state || {};

  // If no problem was passed, redirect back
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

  return (
    <div 
      className="w-full min-h-[85vh] flex flex-col items-center py-10 px-4 font-sans text-white"
      style={{ 
        backgroundColor: '#020a13', 
        backgroundImage: 'radial-gradient(circle at 50% 10%, #08213b 0%, #020a13 70%)' 
      }}
    >
      <div className="w-full max-w-4xl bg-[#061424]/80 border border-[#0f2b48] shadow-2xl backdrop-blur-md rounded-xl p-8 relative">
        {/* Corner Cyber Hooks */}
        <div className="absolute top-[-1px] left-[-1px] w-4 h-4 border-t-2 border-l-2 border-[#c5ff00]"></div>
        <div className="absolute bottom-[-1px] right-[-1px] w-4 h-4 border-b-2 border-r-2 border-[#c5ff00]"></div>

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="text-xs uppercase tracking-widest text-[#587b9a] hover:text-[#c5ff00] transition-colors mb-6 flex items-center gap-2"
        >
          ← Return to Saved Sheet
        </button>

        {/* Title */}
        <div className="border-b border-[#0f2b48] pb-6 mb-8">
          <span className="text-[10px] tracking-[0.3em] font-extrabold text-[#c5ff00] uppercase block mb-2">
            SOLUTION & EDITORIAL // {problem.platform}
          </span>
          <h1 className="text-3xl font-black">{problem.title}</h1>
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

        {/* Content Section */}
        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-bold text-[#c5ff00] mb-3">Approach & Intuition</h3>
            <p className="text-[#8fa3b5] leading-relaxed">
              To solve <strong>{problem.title}</strong>, we look for key patterns corresponding to its tags. Analyze constraints and edge cases to formulate an optimal algorithm.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#c5ff00] mb-3">Complexity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#051524] p-4 rounded-lg border border-[#0f2b48]">
                <div className="text-xs uppercase tracking-widest text-[#587b9a] mb-1">Time Complexity</div>
                <div className="text-xl font-bold font-mono">O(N log N)</div>
                <div className="text-xs text-gray-400 mt-1">Depends on tag constraints</div>
              </div>
              <div className="bg-[#051524] p-4 rounded-lg border border-[#0f2b48]">
                <div className="text-xs uppercase tracking-widest text-[#587b9a] mb-1">Space Complexity</div>
                <div className="text-xl font-bold font-mono">O(N)</div>
                <div className="text-xs text-gray-400 mt-1">Auxiliary structure usage</div>
              </div>
            </div>
          </section>

          <section className="pt-6 border-t border-[#0f2b48]/50 flex justify-between items-center">
            <span className="text-[10px] font-mono text-[#587b9a]">
              SHADOW SOVEREIGN // EDITORIAL MODULE V1.0
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
    </div>
  );
}