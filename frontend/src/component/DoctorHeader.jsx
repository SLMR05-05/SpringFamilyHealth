import { useState } from "react";
import { Bell } from "lucide-react";

export default function DoctorHeader() {
  const [showNoti, setShowNoti] = useState(false);

  const doctorInfo = {
    name: "BS. Nguyễn Minh Tâm",
    specialty: "Nội tổng quát",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    online: true,
  };

  const notifications = [
    { id: 1, message: "Bệnh nhân Nguyễn An vừa đặt lịch khám.", time: "2 phút trước", read: false },
    { id: 2, message: "Hồ sơ bệnh nhân Lê Hà được cập nhật.", time: "1 giờ trước", read: true },
    { id: 3, message: "Cuộc hẹn lúc 14:00 đã được xác nhận.", time: "Hôm qua", read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Chào mừng trở lại, Bác sĩ Tâm</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNoti(!showNoti)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNoti && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg border bg-white z-10">
              <div className="px-4 py-3 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Thông báo</h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                    {unreadCount} mới
                  </span>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                      !notif.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <p className="text-sm text-gray-800">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2 border-t">
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  Xem tất cả
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Doctor Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{doctorInfo.name}</p>
            <p className="text-xs text-gray-500">{doctorInfo.specialty}</p>
          </div>

          <div className="relative">
            <img
              src={doctorInfo.avatar}
              alt={doctorInfo.name}
              className="w-10 h-10 rounded-full border-2 border-white shadow"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                doctorInfo.online ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
          </div>
        </div>
      </div>
    </header>
  );
}