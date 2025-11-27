import React, { useState, useEffect } from "react";
import { Badge, Dropdown, List, Button, Typography, Spin, Empty } from "antd";
import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import notificationApi from "../api/notificationApi";
import { useAuth } from "../context/AuthProvider";

const { Text } = Typography;

const NotificationDropdown = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (user?.userId) {
      fetchUnreadCount();
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadCount(response.data || 0);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    if (!user?.userId) return;
    
    setLoading(true);
    try {
      const response = await notificationApi.getUnread();
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.filter((n) => n.notificationId !== notificationId)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleOpenChange = (visible) => {
    setOpen(visible);
    if (visible) {
      fetchNotifications();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "WARNING":
        return "⚠️";
      case "ERROR":
        return "❌";
      case "SUCCESS":
        return "✅";
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "WARNING":
        return "#faad14";
      case "ERROR":
        return "#ff4d4f";
      case "SUCCESS":
        return "#52c41a";
      default:
        return "#1890ff";
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const menu = (
    <div className="bg-white rounded-lg shadow-lg" style={{ width: 380, maxHeight: 500 }}>
      <div className="p-4 border-b flex justify-between items-center">
        <Text strong className="text-lg">
          Thông báo
        </Text>
        {notifications.length > 0 && (
          <Button
            type="link"
            size="small"
            onClick={handleMarkAllAsRead}
            className="text-blue-600"
          >
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>
      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Spin />
          </div>
        ) : notifications.length === 0 ? (
          <Empty
            description="Không có thông báo mới"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="py-8"
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                className="px-4 hover:bg-gray-50 cursor-pointer transition"
                actions={[
                  <Button
                    type="text"
                    size="small"
                    icon={<CheckOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(item.notificationId);
                    }}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{
                        backgroundColor: `${getNotificationColor(item.type)}20`,
                      }}
                    >
                      {getNotificationIcon(item.type)}
                    </div>
                  }
                  title={
                    <Text strong className="text-sm">
                      {item.title}
                    </Text>
                  }
                  description={
                    <div>
                      <Text className="text-xs text-gray-600 block mb-1">
                        {item.message}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        {formatTime(item.createdAt)}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => menu}
      trigger={["click"]}
      placement="bottomRight"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <div>
        <Badge count={unreadCount} offset={[-5, 5]}>
          <Button
            type="text"
            shape="circle"
            icon={<BellOutlined style={{ fontSize: 18 }} />}
            className="hover:bg-gray-100"
          />
        </Badge>
      </div>
    </Dropdown>
  );
};

export default NotificationDropdown;
