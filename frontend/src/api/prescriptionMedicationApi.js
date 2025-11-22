import axiosClient from "./axiosClient";

const prescriptionMedicationApi = {
  // Get all prescription medications with pagination
  getAll(page = 0, size = 10) {
    return axiosClient.get("/prescription-medications", {
      params: { page, size },
    });
  },

  // Get prescription medication by ID
  getById(id) {
    return axiosClient.get(`/prescription-medications/${id}`);
  },

  // Create new prescription medication
  create(data) {
    return axiosClient.post("/prescription-medications", data);
  },

  // Update prescription medication
  update(id, data) {
    return axiosClient.put(`/prescription-medications/${id}`, data);
  },

  // Delete prescription medication
  remove(id) {
    return axiosClient.delete(`/prescription-medications/${id}`);
  },
};

export default prescriptionMedicationApi;
