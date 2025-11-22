import axiosClient from "./axiosClient";

const userApi = {
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
};

export default userApi;
