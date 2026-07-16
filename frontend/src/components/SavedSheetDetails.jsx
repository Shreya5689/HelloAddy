import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import saveSheetsApi from "../api_sevices/save_sheets";
import useWorkspaceStore from "../store/workspaceStore";

// --- Attractive Emoji Icons (consistent with Home.jsx) ---
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

const DeleteIcon = () => (
    <div className="text-xl transition-all duration-300 transform hover:scale-125 hover:text-red-500 text-gray-400">
        🗑️
    </div>
);

export default function SavedSheetDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sheet, setSheet] = useState(null);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    problem: null
});



    const { addItem, fetchWorkspace, attempted, marked, important } = useWorkspaceStore();
    useEffect(() => {
        const closeMenu = () => setContextMenu((prev) => ({ ...prev, visible: false }));
        window.addEventListener("click", closeMenu);
        return () => window.removeEventListener("click", closeMenu);
    }, []);
    // Right-click Handler
    const handleContextMenu = (e, problem) => {
        e.preventDefault(); // Disable standard browser right-click menu
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            problem: problem
        });
    };
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await saveSheetsApi.getSheetDetails(id);
                setSheet(res.data.sheet);
                setProblems(res.data.problems);
            } catch (err) {
                console.error(err);
                alert("Error fetching sheet details");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
        fetchWorkspace(); // Load workspace to track active states
    }, [id]);

    const handleAction = async (e, p, category) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await addItem(
                {
                    title: p.title,
                    url: p.url,
                    platform: p.platform,
                    paid_only: p.paid_only || false,
                    done: category === "attempted",
                },
                category
            );
            await fetchWorkspace(); // Refresh workspace state
        } catch (err) {
            console.error("Failed to add item to workspace", err);
        }
    };

    const handleRemoveProblem = async (e, problemId) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm("Are you sure you want to remove this question from this sheet?")) {
            return;
        }

        try {
            await saveSheetsApi.deleteProblemFromSheet(problemId);
            setProblems((prev) => prev.filter((p) => p.id !== problemId));
        } catch (err) {
            console.error("Failed to remove problem", err);
            alert("Failed to remove problem.");
        }
    };

    const isMarked = (url, list) => list?.some(item => item.url === url);

    if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
    if (!sheet) return <div className="text-center mt-10 text-white">Sheet not found</div>;

    return (
        
        <div className="w-full min-h-screen bg-[var(--primary)] flex justify-center py-10">
            <div className="w-[70vw] bg-[var(--secondary)] rounded-xl shadow-lg p-6">
                <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline">← Back to Profile</button>
                <h1 className="text-3xl font-bold mb-6 text-center">{sheet.name}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {problems.map((p, index) => (
                         <div key={index} onContextMenu={(e) => handleContextMenu(e, p)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group hover:shadow-md transition-all duration-300 text-black cursor-pointer">
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
                                </div>
                            </a>

                            {/* Right Side: Action Buttons */}
                            <div className="flex items-center gap-3 ml-4">
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
                                    title="Add to Favourites (Marked)"
                                >
                                    <FavouriteIcon active={isMarked(p.url, marked)} />
                                </button>
                                <button 
                                    onClick={(e) => handleAction(e, p, 'important')} 
                                    className="focus:outline-none p-1 transform active:scale-90 transition-transform"
                                    title="Add to Important Attempted"
                                >
                                    <AddIcon active={isMarked(p.url, important)} />
                                </button>
                                <button 
                                    onClick={(e) => handleRemoveProblem(e, p.id)} 
                                    className="focus:outline-none p-1 transform active:scale-90 transition-transform ml-2"
                                    title="Remove from Saved Sheet"
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                 {/* Custom Context Menu Content Box */}
                 {contextMenu.visible && (
                     <div 
                         className="fixed z-50 bg-[#061424] border border-[#0f2b48] text-white shadow-2xl rounded-md py-2 w-48 text-left"
                         style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
                     >
                         <button
                             onClick={() => navigate("/editorial", { state: { problem: contextMenu.problem } })}
                             className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#c5ff00] hover:text-black transition-colors flex items-center gap-2"
                         >
                             📖 View Editorial
                         </button>
                         <a
                             href={contextMenu.problem.url}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="w-full text-left block px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#c5ff00] hover:text-black transition-colors flex items-center gap-2"
                         >
                             🔗 Open in {contextMenu.problem.platform}
                         </a>
                     </div>
                 )}
            </div>
            
        </div>
    );
}