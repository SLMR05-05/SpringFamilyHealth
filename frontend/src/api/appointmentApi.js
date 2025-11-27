import axiosClient from "./axiosClient";

const appointmentApi = {
  // Get appointments by doctor ID
  getByDoctorId(doctorId) {
    return axiosClient.get(`/appointments/doctor/${doctorId}`);
  },

  // Get appointments by member ID
  getByMemberId(memberId) {
    return axiosClient.get(`/appointments/member/${memberId}`);
  },

  // Get upcoming appointments for doctor
  getUpcoming(doctorId) {
    return axiosClient.get(`/appointments/doctor/${doctorId}/upcoming`);
  },

  // Get appointments by date range
  getByDateRange(doctorId, startDate, endDate) {
    return axiosClient.get(`/appointments/doctor/${doctorId}/range`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
  },

  // Create new appointment
  create(data) {
    return axiosClient.post("/appointments", data);
  },

  // Update appointment
  update(appointmentId, data) {
    return axiosClient.put(`/appointments/${appointmentId}`, data);
  },

  // Update appointment status
  updateStatus(appointmentId, status) {
    return axiosClient.put(`/appointments/${appointmentId}/status`, null, {
      params: { status },
    });
  },

  // Delete appointment
  remove(appointmentId) {
    return axiosClient.delete(`/appointments/${appointmentId}`);
  },
};

export default appointmentApi;
