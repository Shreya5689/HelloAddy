import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import problemsApi from "../api_sevices/problems_api";
import useWorkspaceStore from "../store/workspaceStore";
import api from "../api_sevices/middleware"; 
import saveSheetsApi from "../api_sevices/save_sheets";

export default function Home() {
  const location = useLocation();
  const { topic } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState([]);
  const [attempted, setAttempted] = useState({});
  const [saving, setSaving] = useState(false);

  const addAttempted = useWorkspaceStore((s) => s.addAttempted);

  // Helper for difficulty sorting
  const getDifficultyValue = (diff) => {
    if (!diff) return 99;
    const d = String(diff).toLowerCase();
    if (d === 'easy') return 1;
    if (d === 'medium') return 2;
    if (d === 'hard') return 3;
    if (d.includes('rating')) {
        const num = parseInt(d.replace('rating', '').trim());
        return num || 4; 
    }
    return 99;
  };

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

        // 1. Shuffle
        allProblems.sort(() => Math.random() - 0.5);

        // 2. Take 13 random
        const selected = allProblems.slice(0, 13);

        // 3. Sort by difficulty
        selected.sort((a, b) => getDifficultyValue(a.difficulty) - getDifficultyValue(b.difficulty));

        setProblems(selected);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [topic]);

  function toKebabCase(str) {
    if(!str) return "";
    return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
  }

const handleSaveSheet = async () => {
  if (problems.length === 0) return;
  try {
    setSaving(true);
    // Construct a name for the sheet
    const sheetName = `${topic || "Custom"} Sheet - ${new Date().toLocaleDateString()}`;
    
    // Call the API service
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
        <h1 className="text-3xl font-bold mb-2 text-center">
          Problems for "{topic}"
        </h1>

        {loading ? (
          <p className="text-center mt-6">Loading problems...</p>
        ) : problems.length === 0 ? (
          <p className="text-center mt-6">No problems found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-4">
                {problems.map((p, index) => (
                <a key={index} href={p.url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="bg-white p-4 rounded shadow hover:shadow-md transition relative h-full">
                    <span
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!attempted[index]) {
                                addAttempted({ title: p.title, url: p.url, platform: p.platform, done: false });
                            }
                            setAttempted(prev => ({ ...prev, [index]: !prev[index] }));
                        }}
                        className="absolute top-2 right-2 cursor-pointer text-lg"
                    >
                        {attempted[index] ? "✅" : "⬜"}
                    </span>
                    <h2 className="font-bold pr-6">{p.title}</h2>
                    <p className="text-sm">Difficulty: {p.difficulty}</p>
                    {p.paidOnly && <span className="text-xs text-red-600">Premium</span>}
                    </div>
                </a>
                ))}
            </div>
            
            <div className="flex justify-center mt-8">
                <button 
                    onClick={handleSaveSheet}
                    disabled={saving}
                    className="bg-[#1f883d] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#1a7f37] transition disabled:opacity-50 flex items-center gap-2"
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