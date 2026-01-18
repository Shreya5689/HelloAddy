import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-[var(--tertiary)] text-white shadow-md'
        : 'text-[var(--text-primary)] hover:bg-[var(--border-soft)] hover:bg-opacity-50'
    }`;
  };

  const handleLogout = () => {
    window.dispatchEvent(new Event("auth:logout"));
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--secondary)]/80 backdrop-blur-md border-b border-[var(--border-soft)] shadow-sm px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-[var(--tertiary)] to-[var(--accent-purple)] bg-clip-text text-transparent">
          HelloAddy
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2">

          {/* Home Link (pointing to /problems) */}
          <Link to="/problems" className={getLinkClass('/problems')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/> 
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="font-medium">Home</span>
          </Link>

          {/* Workspace Link */}
          <Link to="/workspace" className={getLinkClass('/workspace')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            <span className="font-medium">Workspace</span>
          </Link>

           

          {/* Wishlist/Todo Link */}
          <Link to="/todo" className={getLinkClass('/todo')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            <span className="font-medium">Wishlist</span>
          </Link>

          {/* Divider */}
          <div className="h-6 w-px bg-[var(--border-soft)] mx-2"></div>

          {/* Profile Link */}
          <Link to="/user" className={getLinkClass('/user')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="font-medium">Profile</span>
          </Link>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 transition-colors"
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