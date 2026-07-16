import { useState, useEffect } from "react";
import useWorkspaceStore from "../store/workspaceStore";

export default function Workspace() {
  const tabs = [
    { label: "Attempted", value: "attempted", activeClass: "border-[#c5ff00] text-[#c5ff00] bg-[rgba(197,255,0,0.05)]" },
    { label: "Marked", value: "marked", activeClass: "border-[#ff9600] text-[#ff9600] bg-[rgba(255,150,0,0.05)]" },
    { label: "Important", value: "important", activeClass: "border-[#7c5cff] text-[#7c5cff] bg-[rgba(124,92,255,0.05)]" },
  ];

  const [activeTab, setActiveTab] = useState("attempted");
  const { attempted, marked, important, fetchWorkspace, toggleDone, removeItem } = useWorkspaceStore();

  useEffect(() => {
    fetchWorkspace();
  }, []);

  const getDisplayData = () => {
    const attemptedList = attempted || [];
    const markedList = marked || [];
    const importantList = important || [];

    if (activeTab === "attempted") return attemptedList;
    if (activeTab === "marked") return markedList.filter(i => !i.done);
    if (activeTab === "important") {
      const favouritedDone = markedList.filter(i => i.done);
      return [...importantList, ...favouritedDone];
    }
    return [];
  };

  const displayList = getDisplayData();

  return (
    <div 
      className="min-h-[85vh] flex flex-col items-center justify-center font-sans relative overflow-hidden py-8 px-4"
      style={{ 
        backgroundColor: '#020a13', 
        backgroundImage: 'radial-gradient(circle at 85% 25%, #08213b 0%, #020a13 70%)' 
      }}
    >
      {/* Outlined Tab Switchers */}
      <div className="flex gap-4 mb-8 z-10">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-6 py-2.5 rounded-[2px] font-mono text-xs uppercase tracking-widest border transition-all duration-300 cursor-pointer bg-transparent
              ${activeTab === tab.value 
                ? tab.activeClass 
                : "border-[#0f3050] text-[#587b9a] hover:text-white hover:border-[#587b9a]"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Workspace Card Panel */}
      <div className="relative bg-[#061424]/60 border border-[#c5ff00]/15 shadow-lg backdrop-blur-md w-full max-w-6xl p-8 flex flex-col justify-between min-h-[500px] rounded-[3px] z-10">
        {/* Corner Hooks */}
        <div className="absolute top-[-1px] left-[-1px] w-2.5 h-2.5 border-t-2 border-l-2 border-[#c5ff00]"></div>
        <div className="absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 border-b-2 border-r-2 border-[#c5ff00]"></div>

        <div>
          {/* Top Panel Decor Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#c5ff00] inline-block"></span>
              <span className="w-3.5 h-3.5 bg-[#c5ff00]/55 inline-block"></span>
              <span className="w-3.5 h-3.5 bg-[#c5ff00]/25 inline-block"></span>
            </div>
            <span className="text-[9px] font-mono tracking-widest text-[#587b9a]">
              SYS_STATUS: OPTIMAL // LOCAL_DB: ACTIVE
            </span>
          </div>

          {/* List Items */}
          <ul className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {displayList.length === 0 && (
              <li className="text-[#587b9a] font-mono italic text-xs text-center py-20">
                WORKSPACE QUEUE EMPTY // EXPLORE QUESTIONS TO POPULATE
              </li>
            )}

            {displayList.map((item) => (
              <li 
                key={item.id} 
                className={`group flex items-center gap-4 p-4 rounded-[4px] border transition-all duration-300 ${
                  item.done 
                    ? "bg-[rgba(6,30,51,0.4)] border-[#c5ff00]/20 hover:bg-[rgba(197,255,0,0.06)] hover:border-[#c5ff00]/50" 
                    : "bg-[#051524] border-[#0f3050] hover:border-[#c5ff00]/50 hover:bg-[rgba(197,255,0,0.06)] shadow-md hover:shadow-[0_0_15px_rgba(197,255,0,0.08)]"
                }`}
              >
                {/* Tick Checkbox Button */}
                <button
                  onClick={() => toggleDone(item.id, item.category)}
                  className={`w-5 h-5 min-w-[20px] rounded-[2px] flex items-center justify-center border transition-all duration-200 ${
                    item.done 
                      ? "bg-[#c5ff00]/10 border-[#c5ff00] text-[#c5ff00]" 
                      : "border-[#0f3050] hover:border-[#c5ff00] text-transparent hover:text-[#c5ff00]/40 cursor-pointer"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </button>

                {/* Title & Tech Subtext (Light up title to #c5ff00 on hover) */}
                <div className="flex-1 break-all font-mono text-sm">
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`hover:underline group-hover:text-[#c5ff00] transition-colors duration-200 ${
                      item.done 
                        ? "text-[#4b6d85] line-through font-mono" 
                        : "text-white font-mono"
                    }`}
                  >
                    {item.title}
                  </a>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#587b9a] block mt-1.5">
                    STATUS: {item.done ? "COMPLETED" : "ACTIVE"} // ID: #{String(item.id || '').substring(0, 6) || 'N/A'}
                  </span>
                </div>

                {/* Delete Option */}
                <button 
                  onClick={() => removeItem(item.id, item.category)} 
                  className="text-[#587b9a] hover:text-red-500 transition-colors p-2 cursor-pointer bg-transparent border-none"
                  title="Delete from Workspace"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" x2="10" y1="11" y2="17"/>
                    <line x1="14" x2="14" y1="11" y2="17"/>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Info Decor */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#0f3050]/40 font-mono text-[9px] tracking-widest text-[#587b9a] uppercase">
          <span>ENCRYPTED TRANSMISSION LAYER V4.0.2</span>
        </div>
      </div>

      {/* Latency Footer */}
      <div className="w-full max-w-6xl flex justify-between items-center mt-8 font-mono text-[9px] tracking-widest text-[#587b9a] uppercase z-10">
        <span>LATENCY: 14ms   UPLOADS: 108%</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c5ff00] animate-pulse"></span>
          <span>SOVEREIGN NETWORK CONNECTED</span>
        </div>
      </div>
    </div>
  );
}