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

  // Create YouTube search query link
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${problem.platform} ${problem.title} solution walkthrough`
  )}`;

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

          {/* Rectangular Video Player Section */}
          <section className="pt-8 border-t border-[#0f2b48]/50">
            <h3 className="text-lg font-bold text-[#c5ff00] mb-4">Video Tutorial & Walkthrough</h3>
            
            <a 
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group block w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden border border-[#0f2b48] bg-[#030d1a] shadow-lg transition-all duration-300 hover:border-[#c5ff00]/50 hover:shadow-[0_0_25px_rgba(197,255,0,0.1)]"
            >
              {/* Grid Overlay for Cyber Aesthetics */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-300 bg-[linear-gradient(to_right,#153c65_1px,transparent_1px),linear-gradient(to_bottom,#153c65_1px,transparent_1px)] [background-size:24px_24px]"></div>
              
              {/* Background gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020a13]/90 via-[#020a13]/40 to-transparent"></div>
              
              {/* Glowing Code Atmosphere */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-36 bg-[#c5ff00]/5 blur-[70px] rounded-full group-hover:bg-[#c5ff00]/10 transition-all duration-500"></div>

              {/* Top Banner (Badge & Title) */}
              <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start">
                <div className="max-w-[75%]">
                  <span className="text-[10px] tracking-widest text-[#587b9a] uppercase font-bold block mb-1">
                    YouTube Walkthrough Guide
                  </span>
                  <h4 className="text-lg font-bold text-white group-hover:text-[#c5ff00] transition-colors duration-300 truncate">
                    {problem.platform.toUpperCase()}: {problem.title}
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

              {/* Glowing Play Button (Centered) */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-16 h-16 rounded-full bg-[#061424]/90 border border-[#0f2b48] group-hover:border-[#c5ff00] flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-2xl group-hover:shadow-[0_0_25px_rgba(197,255,0,0.35)]">
                  {/* Glowing Play Icon */}
                  <svg 
                    className="w-6 h-6 text-[#587b9a] group-hover:text-[#c5ff00] transition-colors duration-300 ml-1" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Bottom Media Controls Preview */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col gap-3">
                {/* Simulated Progress Bar */}
                <div className="w-full h-1 bg-[#0f2b48] rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-[#c5ff00] group-hover:w-full transition-all duration-1000 ease-out"></div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#587b9a]">
                  <div className="flex items-center gap-3">
                    {/* Play/Pause icon indicator */}
                    <span className="hover:text-[#c5ff00] transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    </span>
                    <span className="font-mono">Click to search YouTube solutions</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono">Search: "{problem.title}"</span>
                    <svg 
                      className="w-4 h-4 group-hover:text-[#c5ff00] transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </section>

          {/* Footer Action Bar */}
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