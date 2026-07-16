import React from 'react';

const ListItem = ({ item, listType, onEdit, toggleDone, removeItem }) => {
  const isTodo = listType === 'todo';

  return (
    <li
      className={`flex items-center gap-4 p-4 rounded-[4px] border transition-all duration-300 cursor-pointer ${
        item.done
          ? "bg-[rgba(6,30,51,0.4)] border-[#c5ff00]/20 text-[#4b6d85] line-through"
          : "bg-[#051524] border-[#0f3050] hover:border-[#c5ff00] text-white shadow-md hover:shadow-[0_0_10px_rgba(197,255,0,0.15)]"
      }`}
      onClick={() => onEdit(item)}
    >
      {/* Dynamic Checkbox Toggle (Square for Todo, Circle for Wishlist) */}
      <button
        onClick={(e) => {
          e.stopPropagation(); 
          toggleDone(item.id, listType);
        }}
        className={`w-5 h-5 min-w-[20px] flex items-center justify-center border transition-all duration-200 ${
          isTodo ? "rounded-[2px]" : "rounded-full"
        } ${
          item.done
            ? "bg-[#c5ff00] border-[#c5ff00] text-[#020a13]"
            : "border-[#c5ff00]/60 bg-transparent hover:border-[#c5ff00] hover:bg-[#c5ff00]/10 cursor-pointer"
        }`}
      >
        {item.done && (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </button>

      {/* Content Area */}
      <div className="flex-1 break-all text-sm font-mono tracking-wide">
        {item.value.startsWith("http") ? (
          <a
            href={item.value}
            target="_blank"
            rel="noreferrer"
            className={item.done ? "text-[#4b6d85] line-through" : "text-[#c5ff00] hover:underline font-mono"}
            onClick={(e) => e.stopPropagation()} 
          >
            {item.value}
          </a>
        ) : (
          <span className={item.done ? "text-[#4b6d85] line-through font-mono" : "text-white font-mono"}>
            {item.value}
          </span>
        )}
      </div>

      {/* Cyber Trash Delete Button */}
      {item.done && (
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            removeItem(item.id, listType);
          }}
          className="text-[#587b9a] hover:text-red-500 transition-colors p-1 cursor-pointer"
          title="Delete Item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" x2="10" y1="11" y2="17"/>
            <line x1="14" x2="14" y1="11" y2="17"/>
          </svg>
        </button>
      )}
    </li>
  );
};

export default ListItem;