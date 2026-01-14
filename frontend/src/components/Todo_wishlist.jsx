import { useState } from "react";

export default function TodoWishlist() {
  const [todos, setTodos] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [mode, setMode] = useState("");
  const [type, setType] = useState("");

  const openModal = (listType, inputType) => {
    setMode(listType);
    setType(inputType);
    setInputValue("");
    setModalOpen(true);
  };

  const handleAdd = () => {
    if (!inputValue.trim()) return;

    const item = { value: inputValue, done: false };

    if (mode === "todo") {
      setTodos([...todos, item]);
    } else {
      setWishlist([...wishlist, item]);
    }
    setModalOpen(false);
  };

  const toggleDone = (index, listType) => {
    const update = (items, setItems) => {
      const copy = [...items];
      copy[index].done = !copy[index].done;
      setItems(copy);
    };

    listType === "todo"
      ? update(todos, setTodos)
      : update(wishlist, setWishlist);
  };

  // ✅ EDIT ITEM
  const editItem = (index, listType) => {
    const newValue = prompt("Edit item:");
    if (!newValue) return;

    const update = (items, setItems) => {
      const copy = [...items];
      copy[index].value = newValue;
      setItems(copy);
    };

    listType === "todo"
      ? update(todos, setTodos)
      : update(wishlist, setWishlist);
  };

  // ✅ REMOVE ITEM (ONLY IF DONE)
  const removeItem = (index, listType) => {
    if (listType === "todo") {
      setTodos(todos.filter((_, i) => i !== index));
    } else {
      setWishlist(wishlist.filter((_, i) => i !== index));
    }
  };

  const Card = ({ title, subtitle, items, color, listType }) => (
    <div className="bg-[var(--secondary)] rounded-3xl p-8 shadow-2xl flex-1 min-h-[520px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          {title}
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => openModal(listType, "link")}
            className={`px-3 py-1 rounded-full text-white bg-gradient-to-br ${color} hover:scale-105 transition`}
          >
            ➕
          </button>
          <button
            onClick={() => openModal(listType, "text")}
            className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
          >
            ✏️
          </button>
        </div>
      </div>

      <p className="text-sm text-[var(--text-secondary)] mb-4">
        {subtitle}
      </p>

      <ul className="space-y-4">
        {items.length === 0 && (
          <li className="text-sm text-gray-400 italic">
            Nothing added yet… click ➕ or ✏️ to begin ✨
          </li>
        )}

        {items.map((item, index) => (
          <li
            key={index}
            className={`flex items-center gap-3 p-4 rounded-xl transition
              ${
                item.done
                  ? "bg-green-100 text-gray-500 line-through"
                  : "bg-[var(--primary)]"
              }
            `}
          >
            {/* CHECKMARK */}
            <button
              onClick={() => toggleDone(index, listType)}
              className={`w-6 h-6 rounded-full flex items-center justify-center border
                ${
                  item.done
                    ? "bg-green-500 text-white border-green-500"
                    : "border-gray-400"
                }
              `}
            >
              {item.done && "✔"}
            </button>

            {/* CONTENT */}
            <div className="flex-1 break-all">
              {item.value.startsWith("http") ? (
                <a
                  href={item.value}
                  target="_blank"
                  rel="noreferrer"
                  className={`${
                    item.done ? "text-gray-400" : "text-blue-600 underline"
                  }`}
                >
                  {item.value}
                </a>
              ) : (
                <span>{item.value}</span>
              )}
            </div>

            {/* ACTIONS */}
            <button
              onClick={() => editItem(index, listType)}
              className="hover:scale-110 transition"
            >
              ✏️
            </button>

            {item.done && (
              <button
                onClick={() => removeItem(index, listType)}
                className="text-red-500 hover:text-red-700 transition"
              >
                🗑
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--primary)] flex items-center justify-center p-10">
      <div className="max-w-7xl w-full flex flex-col md:flex-row gap-10">
        <Card
          title="📝 Todo List"
          subtitle="You can add tasks, links, or notes here and mark them done."
          items={todos}
          color="from-green-400 to-green-600"
          listType="todo"
        />

        <Card
          title="💫 Wishlist"
          subtitle="Save problems, articles, or goals you want to revisit."
          items={wishlist}
          color="from-purple-500 to-indigo-600"
          listType="wishlist"
        />
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-2xl">
            <h3 className="text-xl font-semibold mb-4">
              {type === "link" ? "Add a link 🔗" : "Add text ✏️"}
            </h3>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                type === "link"
                  ? "Paste your link here..."
                  : "Type something here..."
              }
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
                onClick={handleAdd}
                className="px-4 py-2 rounded-xl bg-[var(--tertiary)] text-white hover:bg-[var(--tertiary-hover)]"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
