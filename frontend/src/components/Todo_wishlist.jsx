import { useState, useEffect } from "react";
import useTodoStore from "../store/useTodoStore";
import ListItem from "./List_Item";

export default function TodoWishlist() {
  const { todos, wishlist, fetchItems, addItem, toggleDone, removeItem, updateItemValue } = useTodoStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [mode, setMode] = useState(""); // 'todo' or 'wishlist'
  const [inputType, setInputType] = useState(""); // 'link' or 'text'

  // New states for editing wishlist items
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState("");

  // FETCH ITEMS ON VISIT
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openModal = (listType, type) => {
    setMode(listType);
    setInputType(type);
    setInputValue("");
    setModalOpen(true);
  };

  const handleConfirmAdd = async () => {
    if (!inputValue.trim()) return;
    await addItem(mode, inputValue);
    setModalOpen(false);
  };



  const Card = ({ title, subtitle, items, color, listType }) => (
    <div className="bg-[var(--secondary)] rounded-3xl p-8 shadow-2xl flex-1 min-h-[520px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => openModal(listType, "link")} className={`px-3 py-1 rounded-full text-white bg-gradient-to-br ${color} hover:scale-105 transition`}>➕</button>
          <button onClick={() => openModal(listType, "text")} className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 transition">✏️</button>
        </div>
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-4">{subtitle}</p>

      <ul className="space-y-4">
        {items.length === 0 && <li className="text-sm text-gray-400 italic text-center py-10">Nothing added yet… ✨</li>}
        {items.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          listType={listType}
          toggleDone={toggleDone}
          removeItem={removeItem}
          onEdit={(clickedItem) => {
            // Edit trigger logic moved here
            if (!clickedItem.done) {
              setEditingItem(clickedItem);
              setEditValue(clickedItem.value);
            }
          }}
        />
      ))}
    </ul>
  </div>
);

  return (
    <div className="min-h-screen bg-[var(--primary)] p-6 md:p-10 flex flex-col items-center">
      <div className="max-w-7xl w-full flex flex-col md:flex-row gap-8">
        <Card title="📝 Todo List" subtitle="Tasks and reminders." items={todos} listType="todo" color="from-green-400 to-green-600" />
        <Card title="💫 Wishlist" subtitle="Goals and interesting links." items={wishlist} listType="wishlist" color="from-purple-500 to-indigo-600" />
      </div>

      {/* Add modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{inputType === "link" ? "Add Link 🔗" : "Add Note ✏️"}</h3>
            <input 
              type="text" autoFocus value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputType === "link" ? "https://..." : "Enter text here..."}
              className="w-full border rounded-xl p-4 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2 rounded-xl bg-gray-100 font-medium">Cancel</button>
              <button onClick={handleConfirmAdd} className="px-5 py-2 rounded-xl bg-black text-white font-medium">Add to List</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit wishlist item modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Update Item ✏️</h3>

            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full border rounded-xl p-4 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingItem(null)}
                className="px-5 py-2 rounded-xl bg-gray-100 font-medium"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await updateItemValue(editingItem.id, editValue);
                  setEditingItem(null);
                }}
                className="px-5 py-2 rounded-xl bg-black text-white font-medium"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
