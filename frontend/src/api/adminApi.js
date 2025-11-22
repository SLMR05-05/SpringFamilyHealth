import axiosClient from "./axiosClient";

const adminApi = {
  // Get all admins with pagination
  getAll(page = 0, size = 10) {
    return axiosClient.get("/admins", {
      params: { page, size },
    });
  },

  // Get admin by ID
  getById(id) {
    return axiosClient.get(`/admins/${id}`);
  },

  // Create new admin
  create(data) {
    return axiosClient.post("/admins", data);
  },

  // Update admin
  update(id, data) {
    return axiosClient.put(`/admins/${id}`, data);
  },

  // Delete admin
  remove(id) {
    return axiosClient.delete(`/admins/${id}`);
  },
};

export default adminApi;
