import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});


const PUBLIC_ROUTES = ["/login", "/signup", "/refresh"];

api.interceptors.request.use(
  (config) => {
    const isPublic = PUBLIC_ROUTES.some((route) =>
      config.url?.includes(route)
  );
  
  
  if (!isPublic) {
    // console.log("i am here")
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
},
(error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    error ? p.reject(error) : p.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const isPublic = PUBLIC_ROUTES.some((route) =>
      originalRequest.url?.includes(route)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublic
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await api.post("/auth/refresh");
        const newToken = res.data.access_token;

        localStorage.setItem("access_token", newToken);
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("access_token");
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
