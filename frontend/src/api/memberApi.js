import axiosClient from "./axiosClient";

const memberApi = {
  // Get all members with pagination
  getAll(page = 0, size = 10) {
    return axiosClient.get("/members", {
      params: { page, size },
    });
  },

  // Get member by ID
  getById(id) {
    return axiosClient.get(`/members/${id}`);
  },

  // Create new member
  create(data) {
    return axiosClient.post("/members", data);
  },

  // Update member
  update(id, data) {
    return axiosClient.put(`/members/${id}`, data);
  },

  // Delete member
  remove(id) {
    return axiosClient.delete(`/members/${id}`);
  },
};

export default memberApi;
