import {
  Button,
  Card,
  Table,
  Input,
  Select,
  Space,
  Grid,
  Typography,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
// ⭐️ Đảm bảo đường dẫn này đúng
import PatientDetailModal from "../../components/modal/PatientDetailModal";

const { Text } = Typography;
const { useBreakpoint } = Grid;

// Dữ liệu chi tiết mẫu cho bệnh nhân Trần Thị Bích (Giữ nguyên)
const detailedPatientData = {
  name: "Trần Thị Bích",
  id: "BN00124",
  status: "Đã duyệt",
  avatarUrl: "https://via.placeholder.com/100/7F9CF5/000000?text=TB",
  birthDate: "15/05/1985",
  gender: "Nữ",
  phone: "0987 654 321",
  email: "bich.tt@example.com",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  bloodGroup: "O+",
  allergies: "Penicillin",
  history: [],
};

// Hàm lấy class trạng thái (Giữ nguyên)
const getStatusPillClasses = (status) => {
  switch (status) {
    case "Chờ duyệt":
      return { bg: "bg-amber-100", text: "text-amber-800" };
    case "Đã duyệt":
      return { bg: "bg-green-100", text: "text-green-800" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
};

// Dữ liệu TỔNG THỂ (7 bản ghi)
const ALL_PATIENT_DATA = [
  {
    key: "1",
    name: "Lê Văn An",
    id: "BN00123",
    date: "18/07/  2025",
    status: "Chờ duyệt",
  },
  {
    key: "2",
    name: "Trần Thị Bích",
    id: "BN00124",
    date: "17/07/  2025",
    status: "Đã duyệt",
  },
  {
    key: "3",
    name: "Nguyễn Văn Cường",
    id: "BN00125",
    date: "17/07/  2025",
    status: "Chờ duyệt",
  },
  {
    key: "4",
    name: "Phạm Thị Dung",
    id: "BN00126",
    date: "16/07/  2025",
    status: "Đã duyệt",
  },
  {
    key: "5",
    name: "Hoàng Văn Giang",
    id: "BN00127",
    date: "15/07/  2025",
    status: "Đã duyệt",
  },
  {
    key: "6",
    name: "Ngô Thị Hà",
    id: "BN00128",
    date: "14/07/  2025",
    status: "Đã duyệt",
  },
  {
    key: "7",
    name: "Lý Anh Kiệt",
    id: "BN00129",
    date: "13/07/  2025",
    status: "Đã duyệt",
  },
];

const TOTAL_RECORDS = ALL_PATIENT_DATA.length;
const PAGE_SIZE = 6; 

const PatientsPage = () => {
  const [loading, setLoading] = useState(false);
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  // ⭐️ 1. STATE CHO PHÂN TRANG ⭐️
  const [currentPage, setCurrentPage] = useState(1);

  // STATE CHO MODAL
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // 2. HÀM XỬ LÝ XEM HỒ SƠ (Giữ nguyên)
  const handleViewRecord = (record) => {
    const patientDetail = {
      ...detailedPatientData,
      name: record.name,
      id: record.id,
      status: record.status,
    };
    setSelectedPatient(patientDetail);
    setIsDetailModalVisible(true);
  };

  // ⭐️ 3. HÀM XỬ LÝ KHI CHUYỂN TRANG
  const handleTableChange = (pagination) => {
    // Cập nhật trang hiện tại
    setCurrentPage(pagination.current);
  };

  // 4. LOGIC HIỂN THỊ DỮ LIỆU CỦA TRANG HIỆN TẠI (Dùng cho dữ liệu tĩnh)
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentPatientData = ALL_PATIENT_DATA.slice(startIndex, endIndex);

  // Định nghĩa các cột cho Ant Design Table (Giữ nguyên)
  const columns = [
    {
      title: "Tên Bệnh Nhân",
      dataIndex: "name",
      key: "name",
      width: screens.lg ? "25%" : undefined,
    },
    {
      title: "Mã Bệnh Nhân",
      dataIndex: "id",
      key: "id",
      width: screens.lg ? "15%" : undefined,
    },
    {
      title: "Ngày Đăng Ký",
      dataIndex: "date",
      key: "date",
      width: screens.lg ? "15%" : undefined,
    },
    {
      title: "Trạng thái hồ sơ",
      dataIndex: "status",
      key: "status",
      width: screens.lg ? "20%" : undefined,
      render: (status) => {
        const { bg, text } = getStatusPillClasses(status);
        return (
          <span
            className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${bg} ${text}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "Hành Động",
      key: "action",
      width: screens.lg ? "15%" : undefined,
      render: (_, record) => (
        <Button
          type="primary"
          className="bg-blue-600"
          onClick={() => handleViewRecord(record)}
        >
          Xem hồ sơ
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 h-full">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-2xl font-bold">Bệnh nhân của tôi</h1>
          <p className="text-gray-500">
            Quản lý danh sách bệnh nhân và xem hồ sơ chi tiết.
          </p>
        </div>
        
      </div>

      {/* SEARCH/FILTER SECTION */}
      <div className="flex flex-col lg:flex-row gap-4 mb-5 items-stretch lg:items-center">
        <Input
          placeholder="Tìm kiếm theo tên hoặc mã bệnh nhân..."
          prefix={<SearchOutlined />}
          className="lg:flex-1 h-10"
          allowClear
        />
        <Space size="middle" className="flex justify-end w-full lg:w-auto">
          <Select
            defaultValue="Mới nhất"
            className="w-full lg:w-36 h-10"
            options={[
              { value: "newest", label: "Mới nhất" },
              { value: "oldest", label: "Cũ nhất" },
              { value: "name_asc", label: "Tên (A-Z)" },
              { value: "name_desc", label: "Tên (Z-A)" },
            ]}
          />

          <Select
            
            defaultValue="Tất cả"
            className="w-full lg:w-36 h-10"
            options={[
                { value: "all", label: "Tất cả" },
              { value: "waited", label: "Chờ duyệt" },
              { value: "approved", label: "Đã duyệt" },
              
              
            ]}
          />

          
        </Space>
      </div>

      {/* PATIENT TABLE CARD */}
      <Card className="shadow-lg">
        <Table
          columns={columns}
          dataSource={currentPatientData} // ⭐️ Dùng dữ liệu của trang hiện tại
          loading={loading}
          onChange={handleTableChange} // ⭐️ Gắn hàm xử lý sự kiện thay đổi
          pagination={{
            current: currentPage, // ⭐️ Trang hiện tại (State)
            pageSize: PAGE_SIZE, // ⭐️ Kích thước trang cố định (6)
            total: TOTAL_RECORDS, // ⭐️ Tổng số bản ghi (7)
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `Hiển thị ${range[0]} đến ${range[1]} của ${total} kết quả`,
          }}
        />
      </Card>

      {/* MODAL */}
      <PatientDetailModal
        isVisible={isDetailModalVisible}
        onClose={() => setIsDetailModalVisible(false)}
        patientRecord={selectedPatient}
      />
    </div>
  );
};

export default PatientsPage;
