import api from "./middleware";
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

export default authApi;
