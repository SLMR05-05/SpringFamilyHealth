import axiosClient from "./axiosClient";

const vaccinationApi = {
  // Get all vaccinations with pagination
  getAll(page = 0, size = 10) {
    return axiosClient.get("/vaccinations", {
      params: { page, size },
    });
  },

  // Get vaccination by ID
  getById(id) {
    return axiosClient.get(`/vaccinations/${id}`);
  },

  // Get vaccinations by member ID
  getByMemberId(memberId) {
    return axiosClient.get(`/vaccinations/member/${memberId}`);
  },

  // Create new vaccination
  create(data) {
    return axiosClient.post("/vaccinations", data);
  },

  // Update vaccination
  update(id, data) {
    return axiosClient.put(`/vaccinations/${id}`, data);
  },

  // Delete vaccination
  remove(id) {
    return axiosClient.delete(`/vaccinations/${id}`);
  },
};

export default vaccinationApi;
