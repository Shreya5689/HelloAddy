import React, { useState, useEffect } from "react";
import authApi, { useAuthStore } from "../api_sevices/auth";
import { useNavigate } from "react-router-dom";
import saveSheetsApi from "../api_sevices/save_sheets";
import Default_profile from "../assets/Default_profile.jpg";

// Helper Image Cropper Modal (Rectangular Crop Viewport)
const ImageCropperModal = ({ imageSrc, onCancel, onSave }) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = React.useRef(null);
  const [imgObj, setImgObj] = useState(null);

  React.useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImgObj(img);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
  }, [imageSrc]);

  React.useEffect(() => {
    if (!imgObj || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;

    ctx.clearRect(0, 0, size, size);

    const ratio = Math.max(size / imgObj.width, size / imgObj.height);
    const drawWidth = imgObj.width * ratio * zoom;
    const drawHeight = imgObj.height * ratio * zoom;

    const x = (size - drawWidth) / 2 + offset.x;
    const y = (size - drawHeight) / 2 + offset.y;

    ctx.drawImage(imgObj, x, y, drawWidth, drawHeight);

    // Apply rectangular crop mask
    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    ctx.rect(0, 0, size, size);
    ctx.fill();
    ctx.restore();
  }, [imgObj, zoom, offset]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCropSave = () => {
    if (!canvasRef.current) return;
    const croppedImage = canvasRef.current.toDataURL("image/jpeg", 0.9);
    onSave(croppedImage);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center z-[100] p-4 text-white font-sans">
      <div className="bg-[#121824] border border-[#1E293B] p-6 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col items-center">
        <h3 className="text-lg font-mono font-bold mb-4 text-[#8BFF00] tracking-wider uppercase">
          Adjust Profile Photo 📐
        </h3>

        {/* Rectangular Viewport */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative w-64 h-64 border-2 border-[#8BFF00]/40 rounded-xl overflow-hidden cursor-move bg-[#0B0F17] flex items-center justify-center select-none shadow-[0_0_20px_rgba(139,255,0,0.15)]"
        >
          <canvas
            ref={canvasRef}
            width={256}
            height={256}
            className="w-full h-full rounded-xl"
          />
        </div>

        <div className="w-full mt-6 px-4">
          <label className="text-xs font-mono font-bold text-gray-400 block mb-1 tracking-widest">
            ZOOM
          </label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#8BFF00]"
          />
        </div>

        <div className="flex gap-3 w-full mt-6 justify-end">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl bg-[#1E293B] text-gray-300 font-semibold hover:bg-gray-700 transition text-xs uppercase font-mono"
          >
            Cancel
          </button>
          <button
            onClick={handleCropSave}
            className="flex-1 py-2 rounded-xl bg-[#8BFF00] text-black font-extrabold hover:bg-[#9eff1a] transition text-xs uppercase font-mono"
          >
            Save Photo
          </button>
        </div>
      </div>
    </div>
  );
};

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

const EditableField = ({
  value,
  onSave,
  label,
  type = "text",
  className = "",
}) => {
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
            className="w-full p-2 text-sm border border-[#1E293B] rounded-md focus:border-[#8BFF00] focus:ring-1 focus:ring-[#8BFF00] outline-none bg-[#0B0F17] text-white"
            value={tempValue || ""}
            onChange={(e) => setTempValue(e.target.value)}
            rows={label === "about" ? 5 : 3}
            autoFocus
          />
        ) : (
          <input
            className="w-full p-1.5 text-sm border border-[#1E293B] rounded-md focus:border-[#8BFF00] focus:ring-1 focus:ring-[#8BFF00] outline-none bg-[#0B0F17] text-white"
            value={tempValue || ""}
            onChange={(e) => setTempValue(e.target.value)}
            autoFocus
          />
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1 text-xs font-mono font-bold text-black bg-[#8BFF00] rounded-md hover:bg-[#9eff1a] transition"
          >
            <CheckIcon /> Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-mono text-gray-300 bg-[#1E293B] rounded-md hover:bg-gray-700 transition"
          >
            <CrossIcon /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative flex items-start justify-between ${className}`}
    >
      <div className="flex-1 pr-6">
        {label === "name" ? (
          <h1 className="text-xl font-bold font-mono text-white tracking-wide uppercase">
            {value || "Guest User"}
          </h1>
        ) : (
          <p className="text-gray-300 text-sm leading-relaxed font-sans">
            {value || `Add ${label}...`}
          </p>
        )}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-[#8BFF00] hover:bg-[#8BFF00]/10 rounded-md transition-all"
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

  const [selectedImage, setSelectedImage] = useState(null);

  const handleDeleteSheet = async (sheetId) => {
    if (!window.confirm("Are you sure you want to delete this sheet?")) return;

    try {
      await saveSheetsApi.deleteSheet(sheetId);
      fetchSheets();
    } catch (err) {
      console.error("Failed to delete sheet", err);
      alert("Failed to delete sheet.");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCroppedImage = (croppedBase64) => {
    localStorage.setItem(`profile_picture_${user.username}`, croppedBase64);

    useAuthStore.setState((state) => ({
      user: { ...state.user, profile_picture: croppedBase64 },
    }));

    setSelectedImage(null);
  };

  if (loading || !user) return null;

  return (
    <div className="bg-[#0B0F17] text-white min-h-screen p-4 md:p-8 font-sans selection:bg-[#8BFF00]/30 selection:text-[#8BFF00]">
      {/* Top HUD Banner */}
      <div className="max-w-6xl mx-auto mb-8 bg-[#121824] border border-[#1E293B] rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-8 bg-[#8BFF00] rounded-full shadow-[0_0_10px_#8BFF00]" />
          <div>
            <h1 className="text-xl font-extrabold font-mono tracking-wider text-white uppercase flex items-center gap-2">
              QUEST LOG: ACTIVE OPERATIONS
            </h1>
            <p className="text-xs font-mono text-gray-400">
              System Status:{" "}
              <span className="text-[#8BFF00] font-bold">Optimized</span> | Mana
              Flux: <span className="text-[#8BFF00]">94.2%</span>
            </p>
          </div>
        </div>

        <div className="flex gap-4 font-mono text-xs">
          <div className="bg-[#0B0F17] border border-[#1E293B] px-3 py-1.5 rounded-lg">
            <span className="text-gray-400 block text-[10px]">TOTAL SHEETS</span>
            <span className="text-[#8BFF00] font-bold text-sm">
              {sheets.length}
            </span>
          </div>
          <div className="bg-[#0B0F17] border border-[#1E293B] px-3 py-1.5 rounded-lg">
            <span className="text-gray-400 block text-[10px]">GOLD RESERVES</span>
            <span className="text-[#8BFF00] font-bold text-sm">45,200G</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar (30% Width - User HUD Panel) */}
        <div className="w-full lg:w-[30%] space-y-6">
          <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-5 shadow-xl relative overflow-hidden">
            {/* Top Status Indicator */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono font-bold bg-[#8BFF00]/10 text-[#8BFF00] border border-[#8BFF00]/30 px-2 py-0.5 rounded uppercase tracking-widest">
                ACTIVE USER
              </span>
              <span className="w-2 h-2 rounded-full bg-[#8BFF00] animate-pulse shadow-[0_0_8px_#8BFF00]" />
            </div>

            {/* Profile Avatar Frame (Rectangular) */}
            <div className="relative group/avatar mb-5 aspect-square overflow-hidden rounded-xl border-2 border-[#8BFF00]/40 shadow-[0_0_20px_rgba(139,255,0,0.15)] cursor-pointer">
              <img
                src={
                  localStorage.getItem(`profile_picture_${user.username}`) ||
                  Default_profile
                }
                alt="Avatar"
                className="w-full h-full object-cover rounded-xl"
              />
              <div
                onClick={() => document.getElementById("avatar-input").click()}
                className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 rounded-xl"
              >
                <span className="text-white text-xs font-mono font-semibold bg-[#0B0F17] border border-[#8BFF00] text-[#8BFF00] px-3 py-1.5 rounded-lg shadow-lg">
                  Change Photo 📷
                </span>
              </div>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <EditableField label="name" value={user.username} className="mb-2" />
            <EditableField
              label="bio"
              value={user.bio}
              type="textarea"
              className="mb-4"
            />

            <div className="pt-4 border-t border-[#1E293B] space-y-3 font-mono text-xs">
              <div className="text-gray-400">
                <span className="text-[10px] text-gray-500 uppercase block">
                  RANKING
                </span>
                <EditableField value={user.ranking} />
              </div>
              <div className="text-gray-400">
                <span className="text-[10px] text-gray-500 uppercase block">
                  COMMUNICATION EMAIL
                </span>
                <EditableField value={user.email} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Panel (70% Width - Custom Sheets Tile Grid) */}
        <div className="w-full lg:w-[70%] space-y-6">
          {/* User About / Dossier Section */}
          <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-5 shadow-lg">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-[#8BFF00] rounded-xs" />
              SOVEREIGN DOSSIER / ABOUT
            </h3>
            <EditableField label="about" value={user.about} type="textarea" />
          </div>

          {/* Quest Tile Grid Container */}
          <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#1E293B]">
              <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-[#8BFF00]">⚡</span> SAVED QUEST SHEETS
              </h2>
              <span className="text-xs font-mono text-gray-400 bg-[#0B0F17] border border-[#1E293B] px-2.5 py-1 rounded-md">
                {sheets.length} ITEMS DETECTED
              </span>
            </div>

            {sheets.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-[#1E293B] rounded-xl bg-[#0B0F17]">
                <p className="text-sm font-mono text-gray-400">
                  NO SAVED QUEST SHEETS YET.
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Create and save custom sheets to populate your operational grid.
                </p>
              </div>
            ) : (
              /* 2-Column Responsive Quest Card Tiles Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {sheets.map((sheet) => (
                  <div
                    key={sheet.id}
                    className="relative bg-[#0B0F17] border border-[#1E293B] hover:border-[#8BFF00]/60 rounded-xl p-5 shadow-lg transition-all duration-300 group hover:shadow-[0_0_20px_rgba(139,255,0,0.15)] flex flex-col justify-between"
                  >
                    <div>
                      {/* Tile Header - Delete Action Only (Rank Removed) */}
                      <div className="flex justify-end items-center mb-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSheet(sheet.id);
                          }}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-all"
                          title="Delete Sheet"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>

                      {/* Sheet Name */}
                      <h3 className="text-base font-bold font-mono text-white group-hover:text-[#8BFF00] transition-colors mb-3 line-clamp-1 uppercase tracking-wide">
                        {sheet.name}
                      </h3>

                      {/* Quest Meta Stats Box */}
                      <div className="grid grid-cols-2 gap-2 bg-[#121824] p-2.5 rounded-lg border border-[#1E293B] text-[11px] font-mono mb-4">
                        <div>
                          <span className="text-gray-500 text-[9px] uppercase block">
                            DATE CREATED
                          </span>
                          <span className="text-gray-300">
                            {new Date(sheet.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-[9px] uppercase block">
                            STATUS
                          </span>
                          <span className="text-[#8BFF00] font-bold">
                            READY
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button: OPEN SHEET */}
                    <button
                      onClick={() => navigate(`/sheet/${sheet.id}`)}
                      className="w-full py-2.5 px-4 bg-[#8BFF00] hover:bg-[#9eff1a] text-black font-extrabold font-mono text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_12px_rgba(139,255,0,0.25)] hover:shadow-[0_0_20px_rgba(139,255,0,0.4)] cursor-pointer"
                    >
                      OPEN QUEST SHEET <span className="text-sm">➔</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cropper Modal */}
      {selectedImage && (
        <ImageCropperModal
          imageSrc={selectedImage}
          onCancel={() => setSelectedImage(null)}
          onSave={handleSaveCroppedImage}
        />
      )}
    </div>
  );
};

export default UserProfile;