import {
  Button,
  Card,
  Table,
  Input,
  Select,
  Space,
  Grid,
  Typography,
  message,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
// ⭐️ Đảm bảo đường dẫn này đúng
import PatientDetailModal from "../../components/modal/PatientDetailModal";
import doctorApi from "../../api/doctorApi";
import { useAuth } from "../../context/AuthProvider";

const { Text } = Typography;
const { useBreakpoint } = Grid;

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

// Helper để tính tuổi từ ngày sinh
const calculateAge = (birthDate) => {
  if (!birthDate) return "N/A";
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const PatientsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const screens = useBreakpoint();

  // STATE CHO DỮ LIỆU
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // STATE CHO PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  // STATE CHO MODAL
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Fetch patients data từ backend
  useEffect(() => {
    fetchPatients();
  }, [user]);

  const fetchPatients = async () => {
    if (!user?.userId) {
      message.warning("Không tìm thấy thông tin bác sĩ");
      return;
    }

    setLoading(true);
    try {
      const response = await doctorApi.getPatients(user.userId);
      const patientsData = response.data || [];
      
      // Transform data to match UI format
      const transformedData = patientsData.map((member) => ({
        key: member.memberId.toString(),
        memberId: member.memberId,
        name: member.name || `Bệnh nhân ${member.memberId}`,
        id: `BN${member.memberId.toString().padStart(5, "0")}`,
        age: member.age || calculateAge(member.dayOfBirth),
        gender: member.gender === "MALE" ? "Nam" : member.gender === "FEMALE" ? "Nữ" : "Khác",
        dayOfBirth: member.dayOfBirth,
        date: formatDate(member.dayOfBirth),
        weight: member.weight,
        height: member.height,
        relationship: member.relationship || "Không rõ",
        roleInFamily: member.roleInFamily,
        familyId: member.familyId,
        userId: member.userId,
        phone: member.phone || "Chưa cập nhật",
        email: member.email || "Chưa cập nhật",
        address: member.address || "Chưa cập nhật",
      }));

      setPatients(transformedData);
      setFilteredPatients(transformedData);
    } catch (error) {
      console.error("Error fetching patients:", error);
      message.error("Không thể tải danh sách bệnh nhân");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tìm kiếm
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  }, [searchTerm, patients]);

  // Xử lý xem hồ sơ
  const handleViewRecord = (record) => {
    const patientDetail = {
      memberId: record.memberId,
      userId: record.userId,
      familyId: record.familyId,
      name: record.name,
      id: record.id,
      status: "Đang điều trị",
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(record.name)}&background=7F9CF5&color=fff`,
      birthDate: formatDate(record.dayOfBirth),
      gender: record.gender,
      age: record.age,
      weight: record.weight,
      height: record.height,
      relationship: record.relationship,
      roleInFamily: record.roleInFamily === "HEAD" ? "Chủ hộ" : "Thành viên",
      phone: record.phone || "Chưa cập nhật",
      email: record.email || "Chưa cập nhật",
      address: record.address || "Chưa cập nhật",
      history: [],
    };
    setSelectedPatient(patientDetail);
    setIsDetailModalVisible(true);
  };

  // Xử lý chuyển trang
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  // Logic hiển thị dữ liệu của trang hiện tại
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentPatientData = filteredPatients.slice(startIndex, endIndex);

  // Định nghĩa các cột cho Ant Design Table
  const columns = [
    {
      title: "Tên Bệnh Nhân",
      dataIndex: "name",
      key: "name",
      width: screens.lg ? "20%" : undefined,
    },
    {
      title: "Mã Bệnh Nhân",
      dataIndex: "id",
      key: "id",
      width: screens.lg ? "12%" : undefined,
    },
    {
      title: "Tuổi / Giới tính",
      key: "ageGender",
      width: screens.lg ? "12%" : undefined,
      render: (_, record) => `${record.age} tuổi / ${record.gender}`,
    },
    {
      title: "Quan hệ",
      dataIndex: "relationship",
      key: "relationship",
      width: screens.lg ? "12%" : undefined,
    },
    {
      title: "Vai trò",
      dataIndex: "roleInFamily",
      key: "roleInFamily",
      width: screens.lg ? "12%" : undefined,
      render: (role) => (
        <span
          className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
            role === "HEAD"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {role === "HEAD" ? "Chủ hộ" : "Thành viên"}
        </span>
      ),
    },
    {
      title: "Cân nặng / Chiều cao",
      key: "weightHeight",
      width: screens.lg ? "15%" : undefined,
      render: (_, record) =>
        `${record.weight ? record.weight + " kg" : "N/A"} / ${
          record.height ? record.height + " cm" : "N/A"
        }`,
    },
    {
      title: "Hành Động",
      key: "action",
      width: screens.lg ? "12%" : undefined,
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
            Tổng số: {filteredPatients.length} bệnh nhân
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Space size="middle" className="flex justify-end w-full lg:w-auto">
          <Button
            type="default"
            icon={<SearchOutlined />}
            onClick={fetchPatients}
            loading={loading}
          >
            Làm mới
          </Button>
        </Space>
      </div>

      {/* PATIENT TABLE CARD */}
      <Card className="shadow-lg">
        <Table
          columns={columns}
          dataSource={currentPatientData} // ⭐️ Dùng dữ liệu của trang hiện tại
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: currentPage,
            pageSize: PAGE_SIZE,
            total: filteredPatients.length,
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
        onRefresh={fetchPatients}
      />
    </div>
  );
};

export default PatientsPage;
