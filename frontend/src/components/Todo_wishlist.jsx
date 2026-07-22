import { useState, useEffect } from "react";
import useTodoStore from "../store/useTodoStore";
import ListItem from "./List_Item";

export default function TodoWishlist() {
  const { todos, wishlist, fetchItems, addItem, toggleDone, removeItem, updateItemValue } = useTodoStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [mode, setMode] = useState(""); // 'todo' or 'wishlist'
  const [inputType, setInputType] = useState(""); // 'link' or 'text'

  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState("");

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

  const Card = ({ title, subtitle, items, listType }) => {
    // Progress block calculation for wishlist card
    const total = items.length;
    const doneCount = items.filter(i => i.done).length;
    const percent = total > 0 ? (doneCount / total) * 100 : 0;
    const totalBlocks = 6;
    const activeBlocks = Math.round((percent / 100) * totalBlocks);
    
    const progressBlocks = Array.from({ length: totalBlocks }).map((_, i) => (
      <span key={i} className={`inline-block w-4 h-1.5 mr-1.5 ${i < activeBlocks ? 'bg-[#c5ff00]' : 'bg-[#0f3050]'}`}></span>
    ));

    return (
      <div className="cyber-panel flex-1 min-h-[550px] p-8 flex flex-col justify-between">
        <div>
          {/* Cyber Title & Add Buttons */}
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-2xl font-black text-[#c5ff00] tracking-wider uppercase italic font-mono flex items-center">
              <span className="text-[#c5ff00] font-extrabold mr-1.5">#</span>
              {listType === 'todo' ? 'TODO_LIST' : 'WISHLIST'}
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => openModal(listType, "link")} 
                className="bg-[#c5ff00] text-[#020a13] font-bold w-8 h-8 rounded-[2px] flex items-center justify-center shadow-[0_0_12px_rgba(197,255,0,0.3)] hover:shadow-[0_0_20px_rgba(197,255,0,0.5)] transition duration-200 cursor-pointer text-sm"
                title="Add Link"
              >
                ＋
              </button>
              <button 
                onClick={() => openModal(listType, "text")} 
                className="border border-[#c5ff00]/50 text-[#c5ff00] w-8 h-8 rounded-[2px] flex items-center justify-center hover:bg-[#c5ff00]/10 transition duration-200 cursor-pointer text-xs"
                title="Add Note"
              >
                ✏️
              </button>
            </div>
          </div>

          <span className="text-[10px] uppercase font-mono tracking-widest text-[#407b8c] block mb-6">
            {subtitle}
          </span>

          {/* List Content */}
          <ul className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {items.length === 0 && (
              <li className="text-xs text-[#407b8c] font-mono italic text-center py-16">
                TASK QUEUE EMPTY // AWAITING INPUT
              </li>
            )}
            {items.map((item) => (
              <ListItem
                key={item.id}
                item={item}
                listType={listType}
                toggleDone={toggleDone}
                removeItem={removeItem}
                onEdit={(clickedItem) => {
                  if (!clickedItem.done) {
                    setEditingItem(clickedItem);
                    setEditValue(clickedItem.value);
                  }
                }}
              />
            ))}
          </ul>
        </div>

        {/* Footers (Metadata details vs block progress indicator) */}
        {listType === 'todo' ? (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#0f3050]/40 font-mono text-[9px] tracking-wider text-[#407b8c] uppercase">
            <span>STATUS: SYNCED</span>
            <span>LAT: 34.0522 N</span>
            <span>VER: 04.22.8</span>
          </div>
        ) : (
          <div className="flex items-center mt-6 pt-4 border-t border-[#0f3050]/40">
            <div className="flex items-center">
              {progressBlocks}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center font-sans relative overflow-hidden py-8 px-4">
      {/* Background Radial Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(197,255,0,0.03)_0%,_transparent_70%)] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(197,255,0,0.01)_0%,_transparent_70%)] pointer-events-none"></div>

      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-8">
        <Card 
          title="📝 Todo List" 
          subtitle="ACTIVE TASK QUEUE // PRIORITY: HIGH" 
          items={todos} 
          listType="todo" 
        />
        <Card 
          title="💫 Wishlist" 
          subtitle="FUTURE INTEGRATION GOALS" 
          items={wishlist} 
          listType="wishlist" 
        />
      </div>

      {/* Cyber Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="cyber-panel p-6 w-[90%] max-w-md shadow-2xl">
            <h3 className="text-base font-black font-mono uppercase tracking-wider text-[#c5ff00] mb-4">
              {inputType === "link" ? "ADD NEW LINK" : "ADD NEW NOTE"}
            </h3>
            <input 
              type="text" 
              autoFocus 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputType === "link" ? "https://..." : "Enter payload here..."}
              className="w-full bg-[#051524] text-white border border-[#0f3050] focus:border-[#c5ff00] rounded-[2px] p-4 mb-4 outline-none font-mono text-sm"
            />
            <div className="flex justify-end gap-3 font-mono">
              <button 
                onClick={() => setModalOpen(false)} 
                className="px-4 py-2 rounded-[2px] border border-[#587b9a] text-[#587b9a] hover:bg-[#587b9a]/10 font-bold uppercase tracking-wider text-xs transition duration-200 cursor-pointer"
              >
                Abort
              </button>
              <button 
                onClick={handleConfirmAdd} 
                className="px-4 py-2 rounded-[2px] bg-[#c5ff00] text-[#020a13] hover:bg-[#aee600] font-bold uppercase tracking-wider text-xs transition duration-200 shadow-[0_0_10px_rgba(197,255,0,0.2)] cursor-pointer"
              >
                Execute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cyber Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="cyber-panel p-6 w-[90%] max-w-md shadow-2xl">
            <h3 className="text-base font-black font-mono uppercase tracking-wider text-[#c5ff00] mb-4">
              UPDATE ITEM
            </h3>

            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full bg-[#051524] text-white border border-[#0f3050] focus:border-[#c5ff00] rounded-[2px] p-4 mb-4 outline-none font-mono text-sm"
            />

            <div className="flex justify-end gap-3 font-mono">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-[2px] border border-[#587b9a] text-[#587b9a] hover:bg-[#587b9a]/10 font-bold uppercase tracking-wider text-xs transition duration-200 cursor-pointer"
              >
                Abort
              </button>

              <button
                onClick={async () => {
                  await updateItemValue(editingItem.id, editValue);
                  setEditingItem(null);
                }}
                className="px-4 py-2 rounded-[2px] bg-[#c5ff00] text-[#020a13] hover:bg-[#aee600] font-bold uppercase tracking-wider text-xs transition duration-200 shadow-[0_0_10px_rgba(197,255,0,0.2)] cursor-pointer"
              >
                Execute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page bottom status footer */}
      <div className="w-full max-w-6xl flex justify-end mt-12">
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#407b8c] uppercase">
          SYSTEM_STATE: OPERATIONAL // SHADOW_SOVEREIGN_V1
        </span>
      </div>
    </div>
  );
}