import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import authApi from "./api_sevices/auth";
import Navbar from "../src/components/Navigation"; // 1. Import the Navbar

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );

  useEffect(() => {
    let isMounted = true;

    const validate = async () => {
      try {
        await authApi.me();
      } catch {
        if (isMounted) setIsAuthenticated(false);
      }
    };

    validate();

    const handleLogout = () => {
      localStorage.removeItem("access_token");
      if (isMounted) setIsAuthenticated(false);
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      isMounted = false;
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Return the layout with Navbar and Outlet
  return (
    <div className="min-h-screen bg-[var(--primary)] text-[var(--text-primary)] font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}