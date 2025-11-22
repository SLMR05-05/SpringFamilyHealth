import axiosClient from "./axiosClient";

const inviteCodeApi = {
  // Get all invite codes with pagination
  getAll(page = 0, size = 10) {
    return axiosClient.get("/invite-codes", {
      params: { page, size },
    });
  },

  // Get invite code by ID
  getById(id) {
    return axiosClient.get(`/invite-codes/${id}`);
  },

  // Create new invite code
  create(data) {
    return axiosClient.post("/invite-codes", data);
  },

  // Update invite code
  update(id, data) {
    return axiosClient.put(`/invite-codes/${id}`, data);
  },

  // Delete invite code
  remove(id) {
    return axiosClient.delete(`/invite-codes/${id}`);
  },
};

export default inviteCodeApi;
