import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import problemsApi from "../api_sevices/problems_api";
import useWorkspaceStore from "../store/workspaceStore";
import api from "../api_sevices/middleware";    
import {useAuthStore} from "../api_sevices/auth";
import saveSheetsApi from "../api_sevices/save_sheets";

// --- Attractive Emoji Icons with Custom glows ---
const AttemptedIcon = ({ active }) => (
  <div className={`text-xl transition-all duration-300 transform hover:scale-125 ${active ? "drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "opacity-30 grayscale hover:grayscale-0 hover:opacity-100"}`}>
    {active ? "✅" : "✔️"}
  </div>
);

const FavouriteIcon = ({ active }) => (
  <div className={`text-xl transition-all duration-300 transform hover:scale-125 ${active ? "drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]" : "opacity-30 grayscale hover:grayscale-0 hover:opacity-100"}`}>
    {active ? "💖" : "🤍"}
  </div>
);

const AddIcon = ({ active }) => (
  <div className={`text-xl transition-all duration-300 transform hover:rotate-12 hover:scale-125 ${active ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" : "opacity-30 grayscale hover:grayscale-0 hover:opacity-100"}`}>
    {active ? "🚀" : "➕"}
  </div>
);

export default function Home() {
  const location = useLocation();
  const { topic, tags_leetcode, tags_codeforces } = location.state || {};
  const {user} = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState([]);
  const [saving, setSaving] = useState(false);

  const { addItem, fetchWorkspace, attempted, marked, important } = useWorkspaceStore();

  useEffect(() => {
    fetchWorkspace(); // Load workspace on mount
  }, []);

  // Helper for difficulty sorting
  const getDifficultyValue = (diff) => {
    if (!diff) return 99;
    const d = String(diff).toLowerCase();
    if (d === 'easy') return 1;
    if (d === 'medium') return 2;
    if (d === 'hard') return 3;
    return 99;
  };

  useEffect(() => {
    if (!topic && !tags_leetcode && !tags_codeforces) return;

    const fetchProblems = async () => {
      try {
        var res;
        setLoading(true);
        if(!topic){
          const body = {
            leetcode_tags: tags_leetcode,
            codeforces_tags: tags_codeforces
          }
          res = await problemsApi.checkbox_problems(body);
        }
        else{
          res = await problemsApi.problem(topic);
        }

        const leetcode = res.data.problems.map(p => ({
          title: p.title,
          difficulty: p.difficulty,
          url: `https://leetcode.com/problems/${toKebabCase(p.title)}`,
          platform: "leetcode",
          paidOnly: p.paid_only || false,
          topic: topic || "Custom"
        }));

        const codeforces = (res.data["codeforces-problems"] || []).map(p => ({
          title: p.name,
          difficulty: p.rating ? `Rating ${p.rating}` : "N/A",
          url: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
          platform: "codeforces",
          topic: topic || "Custom"
        }));

        setProblems([...leetcode, ...codeforces]);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [topic,tags_codeforces,tags_leetcode]);

  function toKebabCase(str) {
    if(!str) return "";
    return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
  }

  const handleAction = async (e, p, category) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addItem(
        {
          title: p.title,
          url: p.url,
          platform: p.platform,
          paid_only: p.paid_only,
          done: category === "attempted",
        },
        category
      );

      await fetchWorkspace(); // refresh workspace state
    } catch (err) {
      console.error("Failed to add item", err);
    }
  };

  const isMarked = (url, list) => list?.some(item => item.url === url);

  const handleSaveSheet = async () => {
    if (problems.length === 0) return;
    try {
      setSaving(true);
      const sheetName = `${topic || "Custom"} Sheet - ${new Date().toLocaleDateString()}`;
      await saveSheetsApi.saveSheet({ name: sheetName, problems });
      alert("Sheet saved successfully!");
    } catch (err) {
      console.error("Failed to save sheet", err);
      alert("Failed to save sheet.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex justify-center py-10 pb-24 px-4 font-sans relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(197,255,0,0.04)_0%,_transparent_70%)] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(0,191,255,0.02)_0%,_transparent_70%)] pointer-events-none"></div>

      <div className="cyber-panel w-full max-w-5xl p-8 relative">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-[#c5ff00] uppercase tracking-wider border-b border-[#0f2b48] pb-4">
          Problems for "{topic || tags_leetcode?.join(', ') || tags_codeforces?.join(', ')}"
        </h1>

        {loading ? (
          <p className="text-center mt-6 text-[#c5ff00] text-sm animate-pulse">Loading problems...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-4">
              {problems.map((p, index) => (
                <div key={index} className="bg-[#061424] border border-[#0f2b48] hover:border-[#c5ff00]/50 p-4 rounded-[4px] flex justify-between items-center group transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(197,255,0,0.1)]">
                  {/* Left Side: Question Info */}
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <h2 className="font-bold text-white group-hover:text-[#c5ff00] transition-colors duration-300">
                      {p.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#587b9a] bg-[#0c2238] px-2 py-0.5 rounded-[2px] border border-[#0f2b48]">
                        {p.platform}
                      </span>
                      <span className={`text-[9px] font-bold uppercase ${
                        p.difficulty?.toLowerCase() === 'easy' ? 'text-green-400' :
                        p.difficulty?.toLowerCase() === 'medium' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        - {p.difficulty}
                      </span>
                      {p.paid_only && (
                        <span className="text-[9px] text-red-400 font-extrabold bg-red-950/40 border border-red-500/20 px-2 py-0.5 rounded-[2px] animate-pulse">
                          PREMIUM
                        </span>
                      )}
                    </div>
                  </a>
                  
                  {/* Right Side: Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={(e) => handleAction(e, p, 'attempted')} 
                      className="focus:outline-none p-1.5 hover:bg-[#0c2238] rounded-full transition-all duration-200"
                      title="Mark as Attempted"
                    >
                      <AttemptedIcon active={isMarked(p.url, attempted)} />
                    </button>
                    <button 
                      onClick={(e) => handleAction(e, p, 'marked')} 
                      className="focus:outline-none p-1.5 hover:bg-[#0c2238] rounded-full transition-all duration-200"
                      title="Add to Favourites"
                    >
                      <FavouriteIcon active={isMarked(p.url, marked)} />
                    </button>
                    <button 
                      onClick={(e) => handleAction(e, p, 'important')} 
                      className="focus:outline-none p-1.5 hover:bg-[#0c2238] rounded-full transition-all duration-200"
                      title="Add to Workspace"
                    >
                      <AddIcon active={isMarked(p.url, important)} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Save Button */}
            <div className="flex justify-center mt-8">
              <button 
                onClick={handleSaveSheet}
                disabled={saving}
                className="bg-[#c5ff00] hover:bg-[#aee600] text-[#020a13] px-10 py-3 rounded-[3px] font-black uppercase tracking-wider text-xs transition-all duration-300 shadow-[0_0_15px_rgba(197,255,0,0.25)] hover:shadow-[0_0_25px_rgba(197,255,0,0.45)] disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Saving..." : "Save This Sheet"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}