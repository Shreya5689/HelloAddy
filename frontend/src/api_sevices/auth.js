import api from "./middleware";
import {create} from "zustand";
// import axios from "axios";

/*
NOTE:
- baseURL "/" is already handled by Vite proxy
- headers are already JSON by default in axios
- auth routes are PUBLIC_ROUTES in middleware.js
*/
const authApi = {
  /*
  POST /auth/login
  BODY:
  {
    "email": "user@mail.com",
    "password": "secret"
  }
  */
  login: (body) => api.post("/auth/login", body),

  /*
  POST /auth/signup
  BODY:
  {
    "name": "Adarsh",
    "email": "user@mail.com",
    "password": "secret"
  }
  */
  signup: (body) => api.post("/auth/signup", body),

  /*
  POST /auth/logout
  */
  logout: () => api.post("/auth/logout"),

  /*
  GET /auth/me
  */
  me: () => api.get("/auth/billu"),
};

export const useAuthStore = create((set) => ({
  user: null, // Will store { username, ranking, etc. }
  isAuthenticated: false,
  loading: false,

  // Action to fetch user data and update state
  fetchUserProfile: async () => {
    set({ loading: true });
    try {
      const response = await authApi.me();
      // Assuming your DB returns { username: "...", ranking: "..." }
      set({ 
        user: response.data, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error) {
      set({ user: null, isAuthenticated: false, loading: false });
      console.error("Profile fetch failed:", error);
    }
  },

  // Call this after successful Login/Signup to populate the store
  setUser: (userData) => set({ user: userData, isAuthenticated: true }),

  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));

export default authApi;
