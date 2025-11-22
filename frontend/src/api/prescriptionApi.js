import axiosClient from "./axiosClient";

const prescriptionApi = {
  // Get all prescriptions with pagination
  getAll(page = 0, size = 10) {
    return axiosClient.get("/prescriptions", {
      params: { page, size },
    });
  },

  // Get prescription by ID
  getById(id) {
    return axiosClient.get(`/prescriptions/${id}`);
  },

  // Create new prescription
  create(data) {
    return axiosClient.post("/prescriptions", data);
  },

  // Update prescription
  update(id, data) {
    return axiosClient.put(`/prescriptions/${id}`, data);
  },

  // Delete prescription
  remove(id) {
    return axiosClient.delete(`/prescriptions/${id}`);
  },
};

export default prescriptionApi;
