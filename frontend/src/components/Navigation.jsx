import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import authApi from '../api_sevices/auth';

const Navbar = () => {
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-2 px-3 py-2 transition-all duration-200 border-b-2 relative ${
      isActive
        ? 'text-[#c5ff00] border-[#c5ff00]'
        : 'text-[#587b9a] border-transparent hover:text-white hover:border-white/50'
    }`;
  };

  const handleLogout = async () => {
    try {
      authApi.logout();
      localStorage.removeItem("access_token");
      window.dispatchEvent(new Event("auth:logout"));
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#020a13]/80 backdrop-blur-md border-b border-[#0f2b48] px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* StudyMate Custom Logo */}
        <Link to="/" className="flex items-center gap-2 font-sans text-xl tracking-wider select-none">
          <div className="bg-[#c5ff00] text-[#020a13] font-black w-8 h-8 flex items-center justify-center rounded-[3px] text-lg">
            S
          </div>
          <span className="font-extrabold text-[#c5ff00]">
            StudyMate
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4">

          {/* Home Link */}
          <Link to="/problems" className={getLinkClass('/problems')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/> 
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="font-bold text-xs uppercase tracking-wider">Home</span>
          </Link>

          {/* Workspace Link */}
          <Link to="/workspace" className={getLinkClass('/workspace')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            <span className="font-bold text-xs uppercase tracking-wider">Workspace</span>
          </Link>

          {/* Wishlist Link */}
          <Link to="/todo" className={getLinkClass('/todo')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="font-bold text-xs uppercase tracking-wider">Wishlist</span>
          </Link>

          {/* Profile Link */}
          <Link to="/user" className={getLinkClass('/user')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span className="font-bold text-xs uppercase tracking-wider">Profile</span>
          </Link>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-[#587b9a] hover:text-[#c5ff00] transition-colors"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;