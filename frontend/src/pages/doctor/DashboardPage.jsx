import { Card, Table, Typography, message, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import appointmentApi from "../../api/appointmentApi";
import notificationApi from "../../api/notificationApi";
import doctorApi from "../../api/doctorApi";

const { Text } = Typography;

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

const formatTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
};

const getStatusPillClasses = (status) => {
  switch (status) {
    case "SCHEDULED":
    case "Chờ duyệt":
      return { bg: "bg-amber-100", text: "text-amber-800" };
    case "COMPLETED":
    case "Đã duyệt":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "CANCELLED":
    case "Cần chú ý":
      return { bg: "bg-red-100", text: "text-red-800" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    newRecords: 0,
    todayAppointments: 0,
    unreadNotifications: 0
  });

  useEffect(() => {
    if (user?.userId) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // For doctors, userId is the same as doctorId (shared primary key)
      const doctorId = user.userId;

      // Fetch upcoming appointments
      const appointmentsRes = await appointmentApi.getUpcoming(doctorId);
      const appointments = appointmentsRes.data || [];
      setUpcomingAppointments(appointments.slice(0, 4));

      // Fetch unread notifications
      const notifRes = await notificationApi.getUnread();
      const notifs = notifRes.data || [];
      setNotifications(notifs.slice(0, 3));

      // Fetch patients to get recent records count
      const patientsRes = await doctorApi.getPatients(doctorId);
      const patients = patientsRes.data || [];
      
      // Calculate stats
      const today = new Date().toDateString();
      const todayAppts = appointments.filter(apt => 
        new Date(apt.appointmentDate).toDateString() === today
      );

      setStats({
        newRecords: patients.length,
        todayAppointments: todayAppts.length,
        unreadNotifications: notifs.length
      });

      // Mock recent records for table (will be replaced with real health records API)
      setRecentRecords([
        { key: "1", name: "Lê Văn An", date: formatDate(new Date()), status: "Chờ duyệt" },
        { key: "2", name: "Trần Thị Bích", date: formatDate(new Date()), status: "Đã duyệt" },
      ]);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      message.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  const records = recentRecords;

  const columns = [
    { title: "Tên Bệnh Nhân", dataIndex: "name", key: "name" },
    { title: "Ngày Gửi", dataIndex: "date", key: "date" },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",

      render: (status) => {
        // Thay đổi render để dùng pill style
        const { bg, text } = getStatusPillClasses(status);
        return (
          <span
            className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${bg} ${text}`}
          >
            {status}{" "}
          </span>
        );
      },
    },

  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-6 bg-gray-100 h-full">
      {/* LEFT MAIN */}
      <div className="flex-1" style={{ width: "calc(100% - 320px)" }}>
        <h2 className="text-2xl font-bold">
          Chào mừng trở lại, {user?.name || 'Bác sĩ'}!
        </h2>
        <p className="text-gray-500 mb-5">
          Đây là tổng quan công việc của bạn hôm nay.
        </p>
        {/* SEARCH */}
        <input
          placeholder="🔍 Tìm kiếm bệnh nhân hoặc hồ sơ..."
          className="w-full p-3 border rounded-lg mb-5"
        />
        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <Card>
            <p>Hồ sơ mới</p>
            <p className="text-2xl font-bold">{stats.newRecords}</p>
          </Card>
          <Card>
            <p>Lịch hẹn hôm nay</p>
            <p className="text-2xl font-bold">{stats.todayAppointments}</p>
          </Card>
          <Card>
            <p>Thông báo chưa đọc</p>
            <p className="text-2xl font-bold">{stats.unreadNotifications}</p>
          </Card>
        </div>
        {/* TABLE – MEDICAL RECORDS */}{" "}
        <h3 className="font-semibold text-lg mb-2">Hồ sơ y tế mới nhận </h3>{" "}
        <Card>
          {" "}
          <Table
            columns={columns}
            dataSource={records}
            pagination={false}
            rowKey="key" // Đã sửa key
            scroll={records.length > 5 ? { y: 300, x: 600 } : undefined}
          />{" "}
        </Card>
       
      </div>
      {/* RIGHT PANEL */}{" "}
      <div className="w-80 flex flex-col gap-5">
        {/* UPCOMING APPOINTMENTS */}
        <Card title="Lịch hẹn sắp tới" className="shadow-sm">
          <div className="max-h-48 overflow-y-auto pr-1">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((item) => (
                <div key={item.appointmentId} className="flex gap-3 mb-4">
                  <div className="bg-blue-50 p-2 rounded text-center w-20 text-xs font-medium">
                    {formatTime(item.appointmentDate)}
                  </div>
                  <div>
                    <p className="font-medium">Bệnh nhân #{item.memberId}</p>
                    <p className="text-gray-500 text-sm">{item.reason || "Khám bệnh"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">Không có lịch hẹn sắp tới</p>
            )}
          </div>
        </Card>
        {/* IMPORTANT NOTIFICATIONS */}
        <Card title="Thông báo quan trọng" className="shadow-sm">
          {notifications.length > 0 ? (
            notifications.map((notif) => {
              const bgColor = notif.type === 'ERROR' ? 'bg-red-50' : 
                              notif.type === 'WARNING' ? 'bg-yellow-50' : 'bg-blue-50';
              const icon = notif.type === 'ERROR' ? '⚠️' : 
                          notif.type === 'WARNING' ? '🟡' : '🔵';
              
              return (
                <div key={notif.notificationId} className={`${bgColor} p-3 rounded mb-3 text-sm`}>
                  {icon} {notif.title}
                  <br />
                  <span className="text-gray-600">{notif.message}</span>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-center py-4">Không có thông báo mới</p>
          )}
        </Card>
      </div>
    </div>
  );
}
