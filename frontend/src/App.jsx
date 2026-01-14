import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import authApi from "./api_sevices/auth";

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

  return <Outlet />;
}