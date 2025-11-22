import { useState } from "react";
import { Calendar, Clock, Plus, Check, X, AlertCircle, Search } from "lucide-react";

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState("2025-11-22");
  const [filterStatus, setFilterStatus] = useState("all");

  const appointments = [
    {
      id: 1,
      patientName: "Nguyễn Văn An",
      time: "08:00 - 08:30",
      date: "2025-11-22",
      type: "Tái khám",
      status: "confirmed",
      reason: "Kiểm tra đường huyết",
      phone: "0901234567"
    },
    {
      id: 2,
      patientName: "Trần Thị Bình",
      time: "09:00 - 09:30",
      date: "2025-11-22",
      type: "Khám mới",
      status: "pending",
      reason: "Đau đầu, chóng mặt",
      phone: "0912345678"
    },
    {
      id: 3,
      patientName: "Lê Minh Hoàng",
      time: "10:00 - 10:30",
      date: "2025-11-22",
      type: "Tái khám",
      status: "confirmed",
      reason: "Theo dõi viêm dạ dày",
      phone: "0923456789"
    },
    {
      id: 4,
      patientName: "Phạm Thị Hoa",
      time: "14:00 - 14:30",
      date: "2025-11-22",
      type: "Khám định kỳ",
      status: "completed",
      reason: "Kiểm tra sức khỏe tổng quát",
      phone: "0934567890"
    },
    {
      id: 5,
      patientName: "Hoàng Văn Dũng",
      time: "15:30 - 16:00",
      date: "2025-11-22",
      type: "Tái khám",
      status: "cancelled",
      reason: "Điều trị đau lưng",
      phone: "0945678901"
    }
  ];

  const statusConfig = {
    pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
    confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800", icon: Check },
    completed: { label: "Hoàn thành", color: "bg-green-100 text-green-800", icon: Check },
    cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800", icon: X }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filterStatus === "all") return true;
    return apt.status === filterStatus;
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === "pending").length,
    confirmed: appointments.filter(a => a.status === "confirmed").length,
    completed: appointments.filter(a => a.status === "completed").length
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lịch Khám Hôm Nay</h1>
          <p className="text-gray-600 mt-1">Thứ Bảy, 22 tháng 11, 2025</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow">
          <Plus className="w-5 h-5" />
          Đặt lịch mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng lịch hẹn</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chờ xác nhận</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã xác nhận</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.confirmed}</p>
            </div>
            <Check className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hoàn thành</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
            </div>
            <Check className="w-10 h-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-2">
          {[
            { value: "all", label: "Tất cả" },
            { value: "pending", label: "Chờ xác nhận" },
            { value: "confirmed", label: "Đã xác nhận" },
            { value: "completed", label: "Hoàn thành" },
            { value: "cancelled", label: "Đã hủy" }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === filter.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => {
          const statusInfo = statusConfig[appointment.status];
          const StatusIcon = statusInfo.icon;

          return (
            <div key={appointment.id} className="bg-white rounded-lg shadow hover:shadow-md transition p-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 flex-1">
                  <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center justify-center min-w-[80px]">
                    <Clock className="w-6 h-6 text-blue-600 mb-1" />
                    <p className="text-sm font-semibold text-blue-900">{appointment.time.split(' - ')[0]}</p>
                    <p className="text-xs text-blue-600">30 phút</p>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{appointment.patientName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Loại:</span> {appointment.type}</p>
                      <p><span className="font-medium">Lý do:</span> {appointment.reason}</p>
                      <p><span className="font-medium">SĐT:</span> {appointment.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {appointment.status === "pending" && (
                    <>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm">
                        Xác nhận
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">
                        Từ chối
                      </button>
                    </>
                  )}
                  {appointment.status === "confirmed" && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                      Bắt đầu khám
                    </button>
                  )}
                  {appointment.status === "completed" && (
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
                      Xem chi tiết
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Không có lịch hẹn nào</p>
        </div>
      )}
    </div>
  );
}