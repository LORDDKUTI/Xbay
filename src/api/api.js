import axios from "axios";

// Base URL from env or default
const API_URL = 
    // process.env.REACT_APP_API_URL ||
     "http://127.0.0.1:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // JWT in headers; set true only if using cookies/session
});

// Helper: read tokens from storage
const getAccess = () => localStorage.getItem("access");
const getRefresh = () => localStorage.getItem("refresh");
const saveAccess = (token) => token && localStorage.setItem("access", token);
const saveRefresh = (token) => token && localStorage.setItem("refresh", token);
const clearTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

// Attach access token to every request
api.interceptors.request.use(
  (config) => {
    const access = getAccess();
    config.headers = config.headers || {};
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor to auto-refresh on 401
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // Only try refresh once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = getRefresh();
      if (!refresh) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue the request until refresh finishes
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newAccess) => {
            if (!newAccess) return reject(error);
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // Use axios directly for the refresh call to avoid interceptors recursion
        const resp = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh });

        const newAccess = resp.data.access;
        const newRefresh = resp.data.refresh; // may be undefined if not rotated

        if (!newAccess) throw new Error("No access token returned during refresh");

        saveAccess(newAccess);
        if (newRefresh) saveRefresh(newRefresh);

        // update default header
        api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
        onRefreshed(newAccess);
        isRefreshing = false;

        // retry original request
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        onRefreshed(null);
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Exposed helpers
export const login = (data) => api.post("/auth/login/", data);
export const logout = () => {
  clearTokens();
  // If your backend has logout endpoint, call it here: return api.post("/auth/logout/");
  window.location.href = "/login";
};
export const setAuthHeader = (access) => {
  if (access) {
    saveAccess(access);
    api.defaults.headers.common.Authorization = `Bearer ${access}`;
  }
};
export const clearAuth = () => {
  clearTokens();
  delete api.defaults.headers.common.Authorization;
};

export default api;