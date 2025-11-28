import axiosClient from "./axiosClient";

const userApi = {
  // Get current user profile
  getMe() {
    return axiosClient.get("/users/me");
  },

  // Update current user's profile
  updateMe(data) {
    return axiosClient.patch("/users/me", data);
  },
  // Get all users with pagination
  getAll(page = 0, size = 10) {
    return axiosClient.get("/users", {
      params: { page, size },
    });
  },
  
  // Get user by ID
  getById(id) {
    return axiosClient.get(`/users/${id}`);
  },
  
  // Create new user
  create(data) {
    return axiosClient.post("/users", data);
  },
  
  // Update user
  update(id, data) {
    return axiosClient.put(`/users/${id}`, data);
  },
  
  // Delete user
  remove(id) {
    return axiosClient.delete(`/users/${id}`);
  },
  
  // Get current user's family
  getMyFamily() {
    return axiosClient.get("/users/me/family");
  },

  // Change current user's password
  changePassword(data) {
    return axiosClient.patch('/users/me/password', data);
  },
};

export default userApi;
