import React from 'react'

// 1. Declare the component first
const ListItem = ({ item, listType, onEdit, toggleDone, removeItem }) => {
  return (
    <li
      className={`flex items-center gap-3 p-4 rounded-xl transition cursor-pointer group ${
        item.done ? "bg-green-100/50 text-gray-400 line-through" : "bg-[var(--primary)] hover:ring-2 hover:ring-blue-300"
      }`}
      onClick={() => onEdit(item)}
    >
      {/* 1. Toggle Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation(); 
          toggleDone(item.id, listType);
        }}
        className={`w-6 h-6 min-w-[24px] rounded-full flex items-center justify-center border transition ${
          item.done ? "bg-green-500 text-white border-green-500" : "border-gray-400 opacity-50 hover:opacity-100"
        }`}
      >
        {item.done && "✔"}
      </button>

      {/* 2. Content Area */}
      <div className="flex-1 break-all">
        {item.value.startsWith("http") ? (
          <a
            href={item.value}
            target="_blank"
            rel="noreferrer"
            className={item.done ? "text-gray-400" : "text-blue-500 hover:underline"}
            onClick={(e) => e.stopPropagation()} 
          >
            {item.value}
          </a>
        ) : (
          <span>{item.value}</span>
        )}
      </div>

      {/* 3. Delete Button */}
      {item.done && (
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            removeItem(item.id, listType);
          }}
          className="text-red-400 hover:text-red-600 transition"
        >
          🗑
        </button>
      )}
    </li>
  );
};

// 2. Export it at the bottom
export default ListItem;