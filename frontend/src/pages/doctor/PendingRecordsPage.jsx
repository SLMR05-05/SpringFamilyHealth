import { Button, Card, Typography, Grid } from "antd";
import React, { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import PatientRecordModal from "../../components/modal/PatientRecordModal"; // Đảm bảo đường dẫn này đúng
// ⭐️ Import Modal Xác nhận Phê duyệt
import ApprovalStatusModal from "../../components/modal/ApprovalStatusModal";

const { Text } = Typography;
const { useBreakpoint } = Grid;

// Dữ liệu giả định (Tái tạo dữ liệu từ ảnh chụp màn hình)
const pendingRecords = [
  {
    id: 1,
    name: "Lê Văn An",
    gender: "Nam",
    age: 34,
    summary: "Tóm tắt: Khám sức khỏe tổng quát, có tiền sử cao huyết áp.",
    date: "Ngày gửi: 18/07/  2025",
  },
  {
    id: 2,
    name: "Trần Thị Bích",
    gender: "Nữ",
    age: 28,
    summary: "Tóm tắt: Yêu cầu tư vấn về chế độ dinh dưỡng sau sinh.",
    date: "Ngày gửi: 17/07/  2025",
  },
  {
    id: 3,
    name: "Nguyễn Văn Cường",
    gender: "Nam",
    age: 45,
    summary: "Tóm tắt: Cập nhật kết quả xét nghiệm máu định kỳ.",
    date: "Ngày gửi: 17/07/  2025",
  },
  {
    id: 4,
    name: "Phạm Thị Dung",
    gender: "Nữ",
    age: 52,
    summary: "Tóm tắt: Khám mắt định kỳ, có dấu hiệu mờ, cần chú ý.",
    date: "Ngày gửi: 18/07/  2025",
  },
  {
    id: 5,
    name: "Hoàng Văn Giang",
    gender: "Nam",
    age: 19,
    summary: "Tóm tắt: Đăng ký khám sức khỏe để làm hồ sơ du học.",
    date: "Ngày gửi: 15/07/  2025",
  },
];

// Dữ liệu chi tiết giả định cho Modal
const detailedPatientData = {
  id: "BN123456",
  birthDate: "15/05/1985 (39 tuổi)",
  phone: "090xxxxxxx",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  bloodGroup: "O+",
  allergies: "Hải sản, Penicillin",
  chronicDiseases: "Cao huyết áp, Tiểu đường tuýp 2",
  avatarUrl: "https://via.placeholder.com/80/7F9CF5/000000?text=LA",
};

// Component chính
const PendingRecordsPage = () => {
  const screens = useBreakpoint();

  // ⭐️ STATE CHO MODAL HỒ SƠ
  const [isRecordModalVisible, setIsRecordModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // ⭐️ STATE CHO MODAL DUYỆT THÀNH CÔNG
  const [isApprovalModalVisible, setIsApprovalModalVisible] = useState(false);
  const [approvedPatientName, setApprovedPatientName] = useState("");

  // HÀM XỬ LÝ XEM CHI TIẾT
  const handleViewDetails = (record) => {
    // Ghép dữ liệu chi tiết vào hồ sơ đã chọn
    const detail =
      record.name === "Lê Văn An"
        ? { ...record, ...detailedPatientData }
        : { ...record, ...detailedPatientData, name: record.name };

    setSelectedRecord(detail);
    setIsRecordModalVisible(true);
  };

  // ⭐️ HÀM XỬ LÝ PHÊ DUYỆT HỒ SƠ (Truyền xuống Modal)
  const handleApproveRecord = (name, id) => {
    // 1. Logic gọi API để cập nhật trạng thái hồ sơ thành 'Đã duyệt'
    console.log(
      `Hồ sơ ID: ${id} của ${name} đã được phê duyệt và cập nhật trạng thái.`
    );

    // 2. Hiện Modal xác nhận thành công
    setApprovedPatientName(name);
    setIsApprovalModalVisible(true);

    // Lưu ý: Trong ứng dụng thực, bạn sẽ cần làm mới danh sách pendingRecords tại đây
  };

  // Xác định số cột dựa trên kích thước màn hình
  let gridCols = 1;
  if (screens.xl) gridCols = 4; // Màn hình rất lớn: 4 cột
  else if (screens.lg) gridCols = 3; // Màn hình lớn (desktop): 3 cột
  else if (screens.md) gridCols = 2; // Màn hình trung bình (tablet): 2 cột

  return (
    <div className="p-6 bg-gray-100 h-full">
      {/* HEADER SECTION */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Hồ sơ chờ duyệt</h1>
        <p className="text-gray-500">
          Xem xét và phê duyệt các hồ sơ y tế mới được gửi đến.
        </p>
      </div>

      {/* CARDS GRID */}
      <div
        className={`grid gap-6`}
        style={{
          // Sử dụng CSS Grid cho responsive
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
        }}
      >
        {pendingRecords.map((record) => (
          <Card
            key={record.id}
            className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Tên Bệnh nhân */}
              <h2 className="text-lg font-semibold mb-1">{record.name}</h2>

              {/* Giới tính & Tuổi */}
              <div className="flex items-center text-gray-600 mb-3">
                <UserOutlined className="mr-2 text-blue-500" />
                <Text className="text-sm">
                  {record.gender}, {record.age} tuổi
                </Text>
              </div>

              {/* Tóm tắt */}
              <p className="text-sm text-gray-800 mb-4 h-12 overflow-hidden leading-relaxed">
                {record.summary}
              </p>

              {/* Ngày gửi */}
              <p className="text-xs text-gray-500 mb-4 border-t pt-3">
                {record.date}
              </p>
            </div>

            {/* GẮN HÀM handleViewDetails VÀO NÚT */}
            <Button
              type="primary"
              className="bg-blue-600 w-full"
              onClick={() => handleViewDetails(record)}
            >
              Xem chi tiết
            </Button>
          </Card>
        ))}
      </div>

      {/* ⭐️ MODAL HỒ SƠ ⭐️ */}
      <PatientRecordModal
        isVisible={isRecordModalVisible}
        onClose={() => setIsRecordModalVisible(false)}
        patientRecord={selectedRecord}
        onApprove={handleApproveRecord} // ⭐️ TRUYỀN HÀM DUYỆT VÀO MODAL
      />

      {/* ⭐️ MODAL XÁC NHẬN DUYỆT ⭐️ */}
      <ApprovalStatusModal
        isVisible={isApprovalModalVisible}
        onClose={() => setIsApprovalModalVisible(false)}
        patientName={approvedPatientName}
      />
    </div>
  );
};

export default PendingRecordsPage;
