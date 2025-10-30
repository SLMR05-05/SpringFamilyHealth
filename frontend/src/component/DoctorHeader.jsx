import { useState } from "react";

export default function DoctorHeader() {
  const [darkMode, setDarkMode] = useState(false);
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
    <header
      className={`${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
      } border-b border-gray-200 px-6 py-4 flex items-center justify-between`}
    >
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm bệnh nhân, hồ sơ..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                : "bg-gray-50 border-gray-200"
            }`}
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 ml-6">
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNoti(!showNoti)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNoti && (
            <div
              className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg border bg-white text-gray-800 z-10 ${
                darkMode ? "bg-gray-800 text-gray-100 border-gray-700" : ""
              }`}
            >
              <div className="px-4 py-2 border-b flex justify-between items-center">
                <h3 className="font-semibold">Thông báo</h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                    {unreadCount} mới
                  </span>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 text-sm ${
                      notif.read
                        ? "bg-gray-50"
                        : "bg-blue-50"
                    } border-b border-gray-100`}
                  >
                    <p>{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings (icon placeholder) */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
          ⚙️
        </button>

        {/* Doctor Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium">{doctorInfo.name}</p>
            <p className="text-xs text-gray-500">{doctorInfo.specialty}</p>
          </div>

          <div className="relative">
            <img
              src={doctorInfo.avatar}
              alt={doctorInfo.name}
              className="w-10 h-10 rounded-full border-2 border-white"
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
