/* eslint-disable no-unused-vars */
import axiosClient from './axiosClient';

const notificationApi = {
  // Get paged notifications for current user
  get(page = 0, size = 20) {
    return axiosClient.get('/notifications', { params: { page, size } });
  },

  // Get unread notifications list
  getUnread() {
    return axiosClient.get('/notifications/unread');
  },

  // Get unread count for badge
  getUnreadCount() {
    return axiosClient.get('/notifications/unread/count');
  },

  // Mark single notification as read
  markRead(id) {
    return axiosClient.put(`/notifications/${id}/read`);
  },

  // Mark all notifications as read
  markAllRead() {
    return axiosClient.put('/notifications/read-all');
  }
};

export default notificationApi;


