import axiosClient from "./axiosClient";

const familyApi = {
  // Get all families with pagination
  getAll(page = 0, size = 10) {
    return axiosClient.get("/families", {
      params: { page, size },
    });
  },

  // Get family by ID
  getById(id) {
    return axiosClient.get(`/families/${id}`);
  },

  // Create new family
  create(data) {
    return axiosClient.post("/families", data);
  },

  // Update family
  update(id, data) {
    return axiosClient.put(`/families/${id}`, data);
  },

  // Delete family
  remove(id) {
    return axiosClient.delete(`/families/${id}`);
  },

  // Get dashboard data for a family
  getDashboard(familyId) {
    return axiosClient.get(`/families/${familyId}/dashboard`);
  },

  // Get medical records for a family
  getMedicalRecords(familyId) {
    return axiosClient.get(`/families/${familyId}/medical-records`);
  },
};

export default familyApi;
