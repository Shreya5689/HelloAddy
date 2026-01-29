import { useState, useEffect } from "react";
import useWorkspaceStore from "../store/workspaceStore";

export default function Workspace() {
  const tabs = [
    { label: "Attempted", value: "attempted", color: "from-green-400 to-green-600" },
    { label: "Marked", value: "marked", color: "from-yellow-400 to-orange-500" },
    { label: "Important Attempted", value: "important", color: "from-purple-500 to-indigo-600" },
  ];

  const [activeTab, setActiveTab] = useState("attempted");
  const { attempted, marked, important, fetchWorkspace, toggleDone, removeItem } = useWorkspaceStore();

  useEffect(() => {
    fetchWorkspace();
  }, []);

  // Filter logic for "Important Attempted"
  const getDisplayData = () => {
    if (activeTab === "attempted") return attempted;
    if (activeTab === "marked") return marked.filter(i => !i.done);
    if (activeTab === "important") {
        // Show Rocket items + Favourites that are marked as Done
        const favouritedDone = marked.filter(i => i.done);
        return [...important, ...favouritedDone];
    }
    return [];
  };

  const displayList = getDisplayData();

  return (
    <div className="min-h-screen bg-[var(--primary)] p-10 flex flex-col items-center">
      <div className="flex gap-6 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-5 py-2 rounded-2xl font-semibold text-white transition
              ${activeTab === tab.value ? `bg-gradient-to-br ${tab.color} scale-105` : "bg-gray-300 text-black hover:scale-105"}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-[var(--secondary)] w-full max-w-6xl flex-1 rounded-3xl p-6 shadow-2xl min-h-[500px]">
        <ul className="space-y-4">
          {displayList.length === 0 && (
            <li className="text-gray-400 italic text-sm text-center py-10">
              Nothing here yet… go explore some questions! ✨
            </li>
          )}

          {displayList.map((item) => (
            <li key={item.id} className={`flex items-center gap-3 p-4 rounded-xl transition ${item.done ? "bg-green-100/10 text-gray-400" : "bg-[var(--primary)] text-[var(--card)] shadow-sm"}`}>
              {/* Tick Button */}
              <button
                onClick={() => toggleDone(item.id, item.category)}
                className={`w-6 h-6 rounded-full flex items-center justify-center border transition
                  ${item.done ? "bg-green-500 text-white border-green-500" : "border-gray-500 hover:border-green-400"}
                `}
              >
                {item.done && "✔"}
              </button>

              <div className={`flex-1 break-all ${item.done ? "line-through opacity-50" : ""}`}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
                    {item.title}
                </a>
              </div>

              {/* Delete Option - Now available for ALL items */}
              <button 
                onClick={() => removeItem(item.id, item.category)} 
                className="text-gray-500 hover:text-red-500 transition-colors p-2"
                title="Delete from Workspace"
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}