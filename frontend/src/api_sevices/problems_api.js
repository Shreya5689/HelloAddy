import api from "./middleware";
// import axios from "axios";

/*
NOTE:
- baseURL "/" is already handled by Vite proxy
- headers are already JSON by default in axios
- auth routes are PUBLIC_ROUTES in middleware.js
*/
const problemsApi = {
  /*
  POST /auth/login
  BODY:
  {
    "email": "user@mail.com",
    "password": "secret"
  }
  */
  problem: (topic) => api.post(`/problems/${topic}`),

  /*
  POST /auth/signup
  BODY:
  {
    "name": "Adarsh",
    "email": "user@mail.com",
    "password": "secret"
  }
  */
  // signup: (body) => api.post("/auth/signup", body),
  checkbox_problems: (tags) => api.post("/problems/checkbox", tags),
  /*
  POST /auth/logout
  */
  // logout: () => api.post("/auth/logout"),

  /*
  GET /auth/me
  */
  me: () => api.get("/auth/me"),
};

export default problemsApi;
