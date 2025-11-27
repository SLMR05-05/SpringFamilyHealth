import axiosClient from "./axiosClient";

const notificationApi = {
  // Get all notifications for a user
  getByUserId(userId) {
    return axiosClient.get(`/notifications/user/${userId}`);
  },

  // Get unread notifications for current user
  getUnread() {
    return axiosClient.get("/notifications/unread");
  },

  // Get unread count for current user
  getUnreadCount() {
    return axiosClient.get("/notifications/unread/count");
  },

  // Mark notification as read
  markAsRead(notificationId) {
    return axiosClient.put(`/notifications/${notificationId}/read`);
  },

  // Mark all as read for current user
  markAllAsRead() {
    return axiosClient.put("/notifications/read-all");
  },

  // Create notification (ADMIN only)
  create(data) {
    return axiosClient.post("/notifications", data);
  },

  // Delete notification
  remove(notificationId) {
    return axiosClient.delete(`/notifications/${notificationId}`);
  },
};

export default notificationApi;
