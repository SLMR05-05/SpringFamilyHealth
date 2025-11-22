import axiosClient from "./axiosClient";

const medicationApi = {
  // Get all medications with pagination
  getAll(page = 0, size = 10) {
    return axiosClient.get("/medications", {
      params: { page, size },
    });
  },

  // Get medication by ID
  getById(id) {
    return axiosClient.get(`/medications/${id}`);
  },

  // Create new medication
  create(data) {
    return axiosClient.post("/medications", data);
  },

  // Update medication
  update(id, data) {
    return axiosClient.put(`/medications/${id}`, data);
  },

  // Delete medication
  remove(id) {
    return axiosClient.delete(`/medications/${id}`);
  },
};

export default medicationApi;
