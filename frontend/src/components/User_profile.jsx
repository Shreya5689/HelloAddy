import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../api_sevices/auth'; 
import { useNavigate } from "react-router-dom";
import saveSheetsApi from '../api_sevices/save_sheets';

const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11.013 1.427a2.75 2.75 0 1 1 3.89 3.89l-1.052 1.052-3.89-3.89L11.013 1.427ZM9.21 3.23l-7.143 7.143a1.25 1.25 0 0 0-.343.626L1.007 14.25a.75.75 0 0 0 .913.913l3.251-.717a1.25 1.25 0 0 0 .626-.343l7.143-7.143-3.89-3.89Z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
  </svg>
);

const CrossIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

const EditableField = ({ value, onSave, label, type = "text", className = "" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="w-full mt-1">
        {type === "textarea" ? (
          <textarea
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-gray-50"
            value={tempValue || ""}
            onChange={(e) => setTempValue(e.target.value)}
            rows={label === "about" ? 5 : 3}
            autoFocus
          />
        ) : (
          <input
            className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-gray-50"
            value={tempValue || ""}
            onChange={(e) => setTempValue(e.target.value)}
            autoFocus
          />
        )}
        <div className="flex gap-2 mt-2">
          <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-[#1f883d] rounded-md hover:bg-[#1a7f37]">
            <CheckIcon /> Save
          </button>
          <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
            <CrossIcon /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative flex items-start justify-between ${className}`}>
      <div className="flex-1 pr-6">
        {label === "name" ? (
          <h1 className="text-2xl font-bold text-[#1F2328]">{value || "Guest User"}</h1>
        ) : (
          <p className="text-[#1F2328] text-sm leading-relaxed">{value || `Add ${label}...`}</p>
        )}
      </div>
      <button 
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-all"
        title={`Edit ${label}`}
      >
        <PencilIcon />
      </button>
    </div>
  );
};

const UserProfile = () => {
  const { user, fetchUserProfile, loading } = useAuthStore();
  const [sheets, setSheets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    fetchSheets();
  }, [fetchUserProfile]);

  const fetchSheets = async () => {
    try {
      const res = await saveSheetsApi.getSheets();
      setSheets(res.data);
    } catch (err) {
      console.error("Error fetching sheets", err);
    }
  };

const handleDeleteSheet = async (sheetId) => {
  if (!window.confirm("Are you sure you want to delete this sheet?")) return;
  
  try {
      await saveSheetsApi.deleteSheet(sheetId);
      // Refresh the list after deleting
      fetchSheets(); 
  } catch (err) {
      console.error("Failed to delete sheet", err);
      alert("Failed to delete sheet.");
  }
};
  // ✅ CRASH FIX — NO UI CHANGE
  if (loading || !user) return null;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10 font-sans text-[#1F2328]">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/4">
          <div className="mb-4">
            <img 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}&backgroundColor=0052cc`} 
              alt="Avatar" 
              className="w-full aspect-square rounded-full border border-gray-200 shadow-sm"
            />
          </div>

          <EditableField label="name" value={user.username} className="mb-1" />
          <EditableField label="bio" value={user.bio} type="textarea" className="mb-6" />

          <div className="pt-4 border-t border-gray-200 space-y-4">
            <EditableField value={user.ranking} />
            <EditableField value={user.email} />
          </div>
        </div>

        <div className="w-full md:w-3/4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
            <EditableField label="about" value={user.about} type="textarea" />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            {sheets.length === 0 ? (
              <p className="text-sm text-gray-500">No saved sheets yet.</p>
            ) : (
              <ul className="space-y-2">
  {sheets.map(sheet => (
    <li
      key={sheet.id}
      onClick={() => navigate(`/sheet/${sheet.id}`)}
      className="p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition flex justify-between items-center group/item"
    >
      <div className="flex flex-col">
          <span className="font-semibold text-gray-700">{sheet.name}</span>
          <span className="text-xs text-gray-400">
            {new Date(sheet.created_at).toLocaleDateString()}
          </span>
      </div>
      
      <button 
          onClick={(e) => {
              e.stopPropagation(); // Prevents navigating to the sheet details
              handleDeleteSheet(sheet.id);
          }}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover/item:opacity-100"
          title="Delete Sheet"
      >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
      </button>
    </li>
  ))}
</ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
