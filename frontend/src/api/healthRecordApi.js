import axiosClient from "./axiosClient";

const healthRecordApi = {
  // Get all health records with pagination
  getAll(page = 0, size = 10) {
    return axiosClient.get("/health-records", {
      params: { page, size },
    });
  },

  // Get health record by ID
  getById(id) {
    return axiosClient.get(`/health-records/${id}`);
  },

  // Create new health record
  create(data) {
    return axiosClient.post("/health-records", data);
  },

  // Update health record
  update(id, data) {
    return axiosClient.put(`/health-records/${id}`, data);
  },

  // Delete health record
  remove(id) {
    return axiosClient.delete(`/health-records/${id}`);
  },
};

export default healthRecordApi;
