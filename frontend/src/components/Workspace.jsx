import { useState, useEffect } from "react";
import useWorkspaceStore from "../store/workspaceStore";

export default function Workspace() {
  const tabs = [
    { label: "Attempted", value: "attempted", color: "from-green-400 to-green-600" },
    { label: "Marked", value: "marked", color: "from-yellow-400 to-orange-500" },
    { label: "Important Attempted", value: "important", color: "from-purple-500 to-indigo-600" },
  ];

  const [activeTab, setActiveTab] = useState("attempted");
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const {
    attempted,
    marked,
    important,
    fetchWorkspace,
    toggleDone,
    removeAttempted,
  } = useWorkspaceStore();

  const workspaceData = { attempted, marked, important };

  useEffect(() => {
    fetchWorkspace();
  }, []);

  const openModal = (index = null) => {
    setEditingIndex(index);
    setInputValue(index !== null ? workspaceData[activeTab][index].value : "");
    setModalOpen(true);
  };

  const handleAddOrEdit = () => {};

  const toggleDoneHandler = (index) => {
    toggleDone(workspaceData[activeTab][index].id);
  };

  const removeItem = (index) => {
    removeAttempted(workspaceData[activeTab][index].id);
  };

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
          {workspaceData[activeTab].length === 0 && (
            <li className="text-gray-400 italic text-sm">
              Nothing here yet… click ➕ to add something! ✨
            </li>
          )}

          {workspaceData[activeTab].map((item, index) => (
            <li
              key={item.id}
              className={`flex items-center gap-3 p-4 rounded-xl transition
                ${item.done ? "bg-green-100 text-gray-500 line-through" : "bg-[var(--primary)]"}
              `}
            >
              <button
                onClick={() => toggleDoneHandler(index)}
                className={`w-6 h-6 rounded-full flex items-center justify-center border
                  ${item.done ? "bg-green-500 text-white border-green-500" : "border-gray-400"}
                `}
              >
                {item.done && "✔"}
              </button>

              <div className="flex-1 break-all">{item.title}</div>

              {item.done && (
                <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 transition">
                  🗑
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
