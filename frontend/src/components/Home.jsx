import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import problemsApi from "../api_sevices/problems_api";
import useWorkspaceStore from "../store/workspaceStore";
import api from "../api_sevices/middleware";    
import {useAuthStore} from "../api_sevices/auth";
import saveSheetsApi from "../api_sevices/save_sheets";




// --- Attractive Emoji Icons ---
const AttemptedIcon = ({ active }) => (
    <div className={`text-2xl transition-all duration-300 transform hover:scale-125 ${active ? "drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "opacity-30 grayscale hover:grayscale-0 hover:opacity-100"}`}>
        {active ? "✅" : "✔️"}
    </div>
);

const FavouriteIcon = ({ active }) => (
    <div className={`text-2xl transition-all duration-300 transform hover:scale-125 ${active ? "drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]" : "opacity-30 grayscale hover:grayscale-0 hover:opacity-100"}`}>
        {active ? "💖" : "🤍"}
    </div>
);

const AddIcon = ({ active }) => (
    <div className={`text-2xl transition-all duration-300 transform hover:rotate-12 hover:scale-125 ${active ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" : "opacity-30 grayscale hover:grayscale-0 hover:opacity-100"}`}>
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
          paidOnly: p.paid_only,
          topic: topic
        }));

        const codeforces = (res.data["codeforces-problems"] || []).map(p => ({
          title: p.name,
          difficulty: p.rating ? `Rating ${p.rating}` : "N/A",
          url: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
          platform: "codeforces",
          topic: topic
        }));

        let allProblems = [...leetcode, ...codeforces];
        if (user?.ranking === "beginner") {
          allProblems = allProblems.filter((p) => {
            if (p.platform === "leetcode") {
              return p.difficulty?.toLowerCase() === "easy";
            }
            if (p.platform === "codeforces") {
              // p.difficulty is stored as "Rating 800", "Rating 1200", etc.
      const rating = parseInt(p.difficulty?.replace(/\D/g, ""), 10);
      return !isNaN(rating) && rating <= 1000;
    }
    return true;
  });
}

        allProblems.sort(() => Math.random() - 0.5);
        const selected = allProblems.slice(0, 13);
        selected.sort((a, b) => getDifficultyValue(a.difficulty) - getDifficultyValue(b.difficulty));

        setProblems(selected);
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
    <div className="w-full min-h-screen bg-[var(--primary)] flex justify-center py-10 pb-24">
      <div className="w-[70vw] bg-[var(--secondary)] rounded-xl shadow-lg p-6 relative">
        <h1 className="text-3xl font-bold mb-2 text-center text-[var(--card)]">
          Problems for "{topic} {tags_leetcode} {tags_codeforces}"
        </h1>

        {loading ? (
          <p className="text-center mt-6 text-[var(--card)] text-sm">Loading problems...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-4">
              {problems.map((p, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group hover:shadow-md transition-all duration-300">
                  {/* Left Side: Question Info */}
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <h2 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                        {p.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                        {p.platform}
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${
                        p.difficulty?.toLowerCase() === 'easy' ? 'text-green-500' :
                        p.difficulty?.toLowerCase() === 'medium' ? 'text-yellow-600' :
                        'text-red-500'
                    }`}>
                        - {p.difficulty}
                    </span>
                    {p.paidOnly && (
                        <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded animate-pulse">
                            PREMIUM
                        </span>
                    )}
                </div>
            </a>
            
            {/* Right Side: Attractive Emoji Action Buttons */}
            <div className="flex items-center gap-4 ml-4">
                <button 
                    onClick={(e) => handleAction(e, p, 'attempted')} 
                    className="focus:outline-none p-1 transform active:scale-90 transition-transform"
                    title="Mark as Attempted"
                >
                    <AttemptedIcon active={isMarked(p.url, attempted)} />
                </button>
                <button 
                    onClick={(e) => handleAction(e, p, 'marked')} 
                    className="focus:outline-none p-1 transform active:scale-90 transition-transform"
                    title="Add to Favourites"
                >
                    <FavouriteIcon active={isMarked(p.url, marked)} />
                </button>
                <button 
                    onClick={(e) => handleAction(e, p, 'important')} 
                    className="focus:outline-none p-1 transform active:scale-90 transition-transform"
                    title="Add to Workspace"
                >
                    <AddIcon active={isMarked(p.url, important)} />
                </button>
            </div>
        </div>
      ))}
            </div>
            
            <div className="flex justify-center mt-8">
                <button 
                    onClick={handleSaveSheet}
                    disabled={saving}
                    className="bg-[#1f883d] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#1a7f37] transition disabled:opacity-50"
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