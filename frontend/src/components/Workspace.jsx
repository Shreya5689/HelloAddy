import { useState } from "react";

export default function Workspace() {
  const tabs = [
    { label: "Attempted", value: "attempted", color: "from-green-400 to-green-600" },
    { label: "Marked", value: "marked", color: "from-yellow-400 to-orange-500" },
    { label: "Important Attempted", value: "important", color: "from-purple-500 to-indigo-600" },
  ];

  const [activeTab, setActiveTab] = useState("attempted");
  const [workspaceData, setWorkspaceData] = useState({
    attempted: [],
    marked: [],
    important: [],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const openModal = (index = null) => {
    setEditingIndex(index);
    setInputValue(index !== null ? workspaceData[activeTab][index].value : "");
    setModalOpen(true);
  };

  const handleAddOrEdit = () => {
    if (!inputValue.trim()) return;

    setWorkspaceData((prev) => {
      const copy = { ...prev };
      if (editingIndex !== null) {
        copy[activeTab][editingIndex].value = inputValue;
      } else {
        copy[activeTab].push({ value: inputValue, done: false });
      }
      return copy;
    });

    setModalOpen(false);
    setEditingIndex(null);
    setInputValue("");
  };

  const toggleDone = (index) => {
    setWorkspaceData((prev) => {
      const copy = { ...prev };
      copy[activeTab][index].done = !copy[activeTab][index].done;
      return copy;
    });
  };

  const removeItem = (index) => {
    setWorkspaceData((prev) => {
      const copy = { ...prev };
      copy[activeTab].splice(index, 1);
      return { ...copy };
    });
  };

  return (
    <div className="min-h-screen bg-[var(--primary)] p-10 flex flex-col items-center">
      {/* TABS */}
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

      {/* WORKSPACE AREA */}
      <div className="bg-[var(--secondary)] w-full max-w-6xl flex-1 rounded-3xl p-6 shadow-2xl min-h-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            {tabs.find((t) => t.value === activeTab).label} Workspace
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => openModal()}
              className={`px-3 py-1 rounded-full text-white bg-gradient-to-br ${tabs.find((t) => t.value === activeTab).color} hover:scale-105 transition`}
            >
              ➕
            </button>
          </div>
        </div>

        <ul className="space-y-4">
          {workspaceData[activeTab].length === 0 && (
            <li className="text-gray-400 italic text-sm">
              Nothing here yet… click ➕ to add something! ✨
            </li>
          )}

          {workspaceData[activeTab].map((item, index) => (
            <li
              key={index}
              className={`flex items-center gap-3 p-4 rounded-xl transition
                ${item.done ? "bg-green-100 text-gray-500 line-through" : "bg-[var(--primary)]"}
              `}
            >
              {/* CHECKMARK */}
              <button
                onClick={() => toggleDone(index)}
                className={`w-6 h-6 rounded-full flex items-center justify-center border
                  ${item.done ? "bg-green-500 text-white border-green-500" : "border-gray-400"}
                `}
              >
                {item.done && "✔"}
              </button>

              {/* CONTENT */}
              <div className="flex-1 break-all">{item.value}</div>

              {/* EDIT & REMOVE */}
              <button onClick={() => openModal(index)} className="hover:scale-110 transition">
                ✏️
              </button>
              {item.done && (
                <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 transition">
                  🗑
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-2xl">
            <h3 className="text-xl font-semibold mb-4">
              {editingIndex !== null ? "Edit Item ✏️" : "Add New Item ➕"}
            </h3>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type something here..."
              className="w-full border rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEdit}
                className="px-4 py-2 rounded-xl bg-[var(--tertiary)] text-white hover:bg-[var(--tertiary-hover)]"
              >
                {editingIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
