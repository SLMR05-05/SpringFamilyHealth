import axiosClient from "./axiosClient";

const visitHistoryApi = {
  // Get all visit histories with pagination
  getAll(page = 0, size = 10) {
    return axiosClient.get("/visit-histories", {
      params: { page, size },
    });
  },

  // Get visit history by ID
  getById(id) {
    return axiosClient.get(`/visit-histories/${id}`);
  },

  // Get visit history by member ID
  getByMemberId(memberId) {
    return axiosClient.get(`/visit-histories/member/${memberId}`);
  },

  // Create new visit history
  create(data) {
    return axiosClient.post("/visit-histories", data);
  },

  // Update visit history
  update(id, data) {
    return axiosClient.put(`/visit-histories/${id}`, data);
  },

  // Delete visit history
  remove(id) {
    return axiosClient.delete(`/visit-histories/${id}`);
  },
};

export default visitHistoryApi;
