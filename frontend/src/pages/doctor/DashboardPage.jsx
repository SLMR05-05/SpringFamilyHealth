import { Card, Table, Typography } from "antd";
import React from "react"; 

const { Text } = Typography;



const getStatusPillClasses = (status) => {
  switch (status) {
    case "Chờ duyệt":
      return { bg: "bg-amber-100", text: "text-amber-800" }; // Vàng/Nâu
    case "Đã duyệt":
      return { bg: "bg-green-100", text: "text-green-800" }; // Xanh lá
    case "Cần chú ý":
      return { bg: "bg-red-100", text: "text-red-800" }; // Đỏ/Hồng
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
};

export default function Dashboard() {
 
  // Dữ liệu bảng (Giữ nguyên)
  const records = [
    { key: "1", name: "Lê Văn An", date: "18/07/  2025", status: "Chờ duyệt" },
    { key: "2", name: "Trần Thị Bích", date: "17/07/  2025", status: "Đã duyệt" },
    {
      key: "3",
      name: "Nguyễn Văn Cường",
      date: "17/07/  2025",
      status: "Chờ duyệt",
    },
    {
      key: "4",
      name: "Phạm Thị Dung",
      date: "16/07/  2025",
      status: "Cần chú ý",
    },
    {
      key: "5",
      name: "Hoàng Văn Giang",
      date: "16/07/  2025",
      status: "Đã duyệt",
    },
    { key: "6", name: "Vũ Thị Hạnh", date: "15/07/  2025", status: "Chờ duyệt" },
  ];

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

  return (
    <div className="flex gap-6 p-6 bg-gray-100 h-full">
      {/* LEFT MAIN */}{" "}
      <div className="flex-1" style={{ width: "calc(100% - 320px)" }}>
        {" "}
        <h2 className="text-2xl font-bold">
          Chào mừng trở lại, Bác sĩ Minh Anh!{" "}
        </h2>{" "}
        <p className="text-gray-500 mb-5">
          Đây là tổng quan công việc của bạn hôm nay.{" "}
        </p>
        {/* SEARCH */}{" "}
        <input
          placeholder="🔍 Tìm kiếm bệnh nhân hoặc hồ sơ..."
          className="w-full p-3 border rounded-lg mb-5"
        />
        {/* STATS */}{" "}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {" "}
          <Card>
            <p>Hồ sơ mới</p> <p className="text-2xl font-bold">5</p>{" "}
          </Card>{" "}
          <Card>
            <p>Lịch hẹn hôm nay</p> <p className="text-2xl font-bold">3</p>{" "}
          </Card>{" "}
          <Card>
            <p>Thông báo chưa đọc</p> <p className="text-2xl font-bold">8</p>{" "}
          </Card>{" "}
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
        {/* UPCOMING APPOINTMENTS */}{" "}
        <Card title="Lịch hẹn sắp tới" className="shadow-sm">
          {" "}
          <div className="max-h-48 overflow-y-auto pr-1">
            {" "}
            {[
              {
                time: "09:00 SÁNG",
                name: "Hoàng Văn Giang",
                detail: "Khám tổng quát",
              },
              {
                time: "10:30 SÁNG",
                name: "Ngô Thị Hà",
                detail: "Tái khám",
              },
              {
                time: "02:00 CHIỀU",
                name: "Lý Anh Kiệt",
                detail: "Tư vấn sức khỏe",
              },
              {
                time: "03:30 CHIỀU",
                name: "Trần Thị Lan",
                detail: "Xét nghiệm máu",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 mb-4">
                {" "}
                <div className="bg-blue-50 p-2 rounded text-center w-20 text-xs font-medium">
                  {item.time}{" "}
                </div>{" "}
                <div>
                  <p className="font-medium">{item.name}</p>{" "}
                  <p className="text-gray-500 text-sm">{item.detail}</p>{" "}
                </div>{" "}
              </div>
            ))}{" "}
          </div>
        </Card>
        {/* IMPORTANT NOTIFICATIONS */}{" "}
        <Card title="Thông báo quan trọng" className="shadow-sm">
          {" "}
          <div className="bg-red-50 p-3 rounded mb-3 text-sm">
            ⚠️ Kết quả xét nghiệm khẩn
            <br />{" "}
            <span className="text-gray-600">
              BN: Lê Văn An – Cần xem ngay{" "}
            </span>{" "}
          </div>{" "}
          <div className="bg-yellow-50 p-3 rounded mb-3 text-sm">
            🟡 Yêu cầu tư vấn mới
            <br />{" "}
            <span className="text-gray-600">
              BN: Trần Thị Bích – Hỏi về thuốc{" "}
            </span>{" "}
          </div>{" "}
          <div className="bg-blue-50 p-3 rounded text-sm">
            🔵 Cập nhật hệ thống
            <br />{" "}
            <span className="text-gray-600">
              Hệ thống sẽ bảo trì vào 2AM{" "}
            </span>{" "}
          </div>{" "}
        </Card>{" "}
      </div>{" "}
    </div>
  );
}
