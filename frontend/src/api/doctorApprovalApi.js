import axiosClient from "./axiosClient";

const doctorApprovalApi = {
  // Get all pending approvals (ADMIN only)
  getAllPending() {
    return axiosClient.get("/doctor-approvals/pending");
  },

  // Get approval by doctor ID
  getByDoctorId(doctorId) {
    return axiosClient.get(`/doctor-approvals/doctor/${doctorId}`);
  },

  // Get approvals by status
  getByStatus(status) {
    return axiosClient.get("/doctor-approvals/status", {
      params: { status },
    });
  },

  // Approve doctor
  approve(approvalId) {
    return axiosClient.post(`/doctor-approvals/${approvalId}/approve`);
  },

  // Reject doctor with reason
  reject(approvalId, reason) {
    return axiosClient.post(`/doctor-approvals/${approvalId}/reject`, {
      reason,
    });
  },

  // Submit doctor for approval
  submit(doctorId) {
    return axiosClient.post("/doctor-approvals", { doctorId });
  },
};

export default doctorApprovalApi;
