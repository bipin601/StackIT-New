import axios from "axios";

// ── Base URL ───────────────────────────────────────────────────────────────
// In development:  requests go to http://localhost:5000/api  (via CRA proxy
//                  or direct if REACT_APP_API_URL is set in your .env)
// In production:   set REACT_APP_API_URL to your deployed backend URL.
//
// Create a  .env.development  file in your project root with:
//   REACT_APP_API_URL=http://localhost:5000/api
//
// Or, if you prefer the CRA proxy approach, keep REACT_APP_API_URL unset and
// add this to your package.json:
//   "proxy": "http://localhost:5000"
// ──────────────────────────────────────────────────────────────────────────
const BASE_URL = process.env.REACT_APP_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // fail fast instead of hanging forever
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor ───────────────────────────────────────────────────
// Automatically attach the JWT token to every request.
// Individual components do NOT need to pass Authorization headers manually.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────────────────────
// • 401 anywhere → clear stale token and redirect to login
// • All other errors → pass through so individual components can handle them
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Token expired or invalid — clean up and send to login
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;