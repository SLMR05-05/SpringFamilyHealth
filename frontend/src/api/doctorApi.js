import axiosClient from "./axiosClient";

const doctorApi = {
  // Get all doctors with pagination
  getAll(page = 0, size = 10) {
    return axiosClient.get("/doctors", {
      params: { page, size },
    });
  },

  // Get doctor by ID
  getById(id) {
    return axiosClient.get(`/doctors/${id}`);
  },

  // Create new doctor
  create(data) {
    return axiosClient.post("/doctors", data);
  },

  // Update doctor
  update(id, data) {
    return axiosClient.put(`/doctors/${id}`, data);
  },

  // Delete doctor
  remove(id) {
    return axiosClient.delete(`/doctors/${id}`);
  },

  // Get all patients (members) managed by a specific doctor
  getPatients(doctorId) {
    return axiosClient.get(`/doctors/${doctorId}/patients`);
  },
};

export default doctorApi;
