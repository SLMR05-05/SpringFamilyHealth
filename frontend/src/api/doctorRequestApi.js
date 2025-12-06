import axiosClient from './axiosClient';

const doctorRequestApi = {
  // User sends request to doctor
  sendRequest(data) {
    return axiosClient.post('/doctor-requests', data);
  },

  // Doctor gets their requests
  getDoctorRequests(doctorId, status, page = 0, size = 10) {
    return axiosClient.get(`/doctor-requests/doctor/${doctorId}`, {
      params: { status, page, size }
    });
  },

  // Doctor responds to a request
  respondToRequest(requestId, doctorId, responseData) {
    return axiosClient.put(`/doctor-requests/${requestId}/respond`, responseData, {
      params: { doctorId }
    });
  },

  // Get pending count
  getPendingCount(doctorId) {
    return axiosClient.get(`/doctor-requests/doctor/${doctorId}/pending-count`);
  }
};

export default doctorRequestApi;
