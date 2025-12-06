import axios from "axios";

// Create separate axios instance for auth endpoints (no /api prefix)
const authClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for auth endpoints
authClient.interceptors.response.use(
  (response) => {
    // Backend returns: { code, message, result }
    if (response.data && response.data.result !== undefined) {
      return { ...response, data: response.data.result };
    }
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || "An error occurred";
    return Promise.reject(new Error(errorMessage));
  }
);

const authApi = {
  // Login - POST /auth/token
  login(email, password) {
    return authClient.post("/auth/token", {
      username: email, // Backend uses username field for email
      password: password,
    });
  },

  // Introspect token - POST /auth/introspect
  introspect(token) {
    return authClient.post("/auth/introspect", {
      token: token,
    });
  },

  // Logout - POST /auth/logout
  logout(token) {
    return authClient.post("/auth/logout", {
      token: token,
    });
  },

  // Refresh token - POST /auth/refresh
  refreshToken(token) {
    return authClient.post("/auth/refresh", {
      token: token,
    });
  },

  // Register - POST /auth/register
  register(registrationData) {
    return authClient.post("/auth/register", registrationData);
  },
};

export default authApi;
