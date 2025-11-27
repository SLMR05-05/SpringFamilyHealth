import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  Button,
  Card,
  Table,
  Input,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";

// Các Modal ngoại vi (giữ nguyên import nếu bạn đã có các component này)
import AddDoctorModal from "../../components/modalAdmin/AddDoctorModal";
import DoctorDetailModal from "../../components/modalAdmin/DoctorDetailModal";
import doctorApi from "../../api/doctorApi";
import userApi from "../../api/userApi";

const { Title, Text } = Typography;

// -------------------- HELPERS / SERVICES --------------------
const getStatusPillClasses = (status) => {
  switch (status) {
    case "Kích hoạt":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "Khóa":
      return { bg: "bg-red-100", text: "text-red-800" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
};

// -------------------- CUSTOM HOOK: useFilteredPagination --------------------
function useFilteredPagination({ data, searchTerm, filterStatus, pageSize, currentPage, setCurrentPage }) {
  const filtered = useMemo(() => {
    let list = data;
    if (filterStatus && filterStatus !== "Tất cả") list = list.filter((d) => d.status === filterStatus);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (d) =>
          (d.name || "").toLowerCase().includes(q) ||
          (d.email || "").toLowerCase().includes(q) ||
          (d.specialty || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, searchTerm, filterStatus]);

  const total = filtered.length;

  // ensure currentPage valid
  useMemo(() => {
    const maxPage = Math.max(1, Math.ceil(total / pageSize));
    if (currentPage > maxPage) setCurrentPage(maxPage);
  }, [total, pageSize, currentPage, setCurrentPage]);

  const start = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return { filtered, paginated, total, startIndex: start };
}

// -------------------- SUB-COMPONENTS --------------------
const DoctorInfoCell = ({ name, email }) => (
  <Space>
    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">BS</div>
    <div>
      <Text strong className="block">
        {name}
      </Text>
      <Text type="secondary" className="text-xs">
        {email}
      </Text>
    </div>
  </Space>
);

function ActiveDoctorsTable({ data, onViewDetails, onDelete, paginationProps }) {
  const columns = useMemo(
    () => [
      {
        title: "THÔNG TIN BÁC SĨ",
        dataIndex: "name",
        key: "info",
        width: "25%",
        render: (_, record) => <DoctorInfoCell name={record.name} email={record.email} />,
      },
      { title: "CHUYÊN KHOA", dataIndex: "specialty", key: "specialty", width: "20%" },
      { 
        title: "NGÀY TẠO", 
        dataIndex: "date", 
        key: "date", 
        width: "15%",
        render: (date) => date || "N/A"
      },
      {
        title: "TRẠNG THÁI",
        dataIndex: "status",
        key: "status",
        width: "15%",
        render: (status) => {
          const { bg, text } = getStatusPillClasses(status);
          return (
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${bg} ${text}`}>{status}</span>
          );
        },
      },
      {
        title: "HÀNH ĐỘNG",
        key: "actions",
        width: "10%",
        render: (_, doctor) => (
          <Space size="small">
            <Button title="Xem Chi Tiết" icon={<EyeOutlined />} size="small" type="text" onClick={() => onViewDetails(doctor)} />
            <Button title="Xóa Tài Khoản" icon={<DeleteOutlined />} danger type="text" size="small" onClick={() => onDelete(doctor)} />
          </Space>
        ),
      },
    ],
    [onViewDetails, onDelete]
  );

  return <Table columns={columns} dataSource={data} rowKey="key" {...paginationProps} />;
}

// -------------------- MAIN COMPONENT --------------------
export default function DoctorManagementPage() {
  // data
  const [activeDoctors, setActiveDoctors] = useState([]);

  // fetch doctors from backend
  const fetchDoctors = useCallback(async () => {
    try {
      const resp = await doctorApi.getAll(0, 100);
      // resp expected to be a Spring Page-like object: { content: [...], totalElements, number, size }
      const list = resp.data?.content || resp.content || [];
      if (!Array.isArray(list)) return;

      const mapped = list.map((d) => ({
        key: d.doctorId,
        userId: d.userId,
        name: d.name || "",
        email: d.email || "",
        specialty: d.description || "",
        certificate_number: d.certificateNumber || "",
        status: d.locked ? "Khóa" : "Kích hoạt",
        date: d.createdAt ? new Date(d.createdAt).toLocaleDateString("vi-VN") : null,
        locked: d.locked || false,
        createdAt: d.createdAt,
      }));

      setActiveDoctors(mapped);
    } catch (err) {
      console.error('Failed to load doctors', err);
      message.error('Không thể tải danh sách bác sĩ');
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // modal state gom chung
  const [modal, setModal] = useState({ add: false, detail: false });
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // filter & paging
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);



  // -------------------- CRUD handlers --------------------
  const openModal = useCallback((key, doctor = null) => {
    setSelectedDoctor(doctor);
    setModal((m) => ({ ...m, [key]: true }));
  }, []);

  const closeModal = useCallback((key) => setModal((m) => ({ ...m, [key]: false })), []);





  const handleAddNewDoctor = useCallback(async (payload) => {
    // payload: { name, email, certificate_number, specialty, password }
    try {
      message.loading({ content: 'Đang tạo tài khoản bác sĩ...', key: 'add-doctor' });
      const userReq = {
        role: 'DOCTOR',
        passwordHash: payload.password,
        name: payload.name,
        phone: payload.phone || '',
        email: payload.email,
      };
      const userResp = await userApi.create(userReq);
      const createdUser = userResp.data || userResp;
      const userId = createdUser.userId || createdUser.id || createdUser.user_id;

      const doctorReq = {
        userId: userId,
        certificateNumber: payload.certificate_number,
        description: payload.specialty,
      };
      await doctorApi.create(doctorReq);

      // refresh doctor list
      await fetchDoctors();
      closeModal("add");
      setCurrentPage(1);
      message.success({ content: `Đã thêm bác sĩ ${payload.name} thành công!`, key: 'add-doctor' });
    } catch (error) {
      console.error('Add doctor failed', error);
      message.error({ content: `Không thể thêm bác sĩ: ${error.message || error}`, key: 'add-doctor' });
    }
  }, [closeModal, fetchDoctors]);

  const handleSaveDoctorChanges = useCallback(async (doctorId, changes) => {
    try {
      message.loading({ content: 'Đang lưu thay đổi...', key: 'save-doctor' });

      const userUpdate = {
        role: 'DOCTOR',
        name: changes.name,
        phone: changes.phone || '',
        email: changes.email,
      };
      if (changes.newPassword) userUpdate.passwordHash = changes.newPassword;
      await userApi.update(doctorId, userUpdate);

      const doctorUpdate = {
        userId: doctorId,
        certificateNumber: changes.certificate_number,
        description: changes.specialty,
      };
      await doctorApi.update(doctorId, doctorUpdate);

      await fetchDoctors();
      closeModal("detail");
      message.success({ content: `Cập nhật thành công bác sĩ ID: ${doctorId}`, key: 'save-doctor' });
    } catch (error) {
      console.error('Save doctor failed', error);
      message.error({ content: `Không thể cập nhật bác sĩ: ${error.message || error}`, key: 'save-doctor' });
    }
  }, [closeModal, fetchDoctors]);

  const handleDeleteActiveDoctor = useCallback(async (doctor) => {
    const ok = window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản của ${doctor.name} không?`);
    if (!ok) return;
    try {
      message.loading({ content: 'Đang xóa...', key: 'delete-doctor' });
      await doctorApi.remove(doctor.key);
      await userApi.remove(doctor.key);
      await fetchDoctors();
      message.success({ content: `Đã xóa tài khoản ${doctor.name} thành công.`, key: 'delete-doctor' });
    } catch (error) {
      message.error({ content: `Không thể xóa bác sĩ: ${error.message || error}`, key: 'delete-doctor' });
    }
  }, [fetchDoctors]);

  const handleViewDetails = useCallback((doctor) => openModal("detail", doctor), [openModal]);

  // -------------------- FILTER & PAGINATION --------------------
  const { paginated: currentActiveUsers, total: totalActiveUsers, startIndex } = useFilteredPagination({
    data: activeDoctors,
    searchTerm,
    filterStatus,
    pageSize,
    currentPage,
    setCurrentPage,
  });

  const currentRangeStart = totalActiveUsers > 0 ? startIndex + 1 : 0;
  const currentRangeEnd = Math.min(startIndex + pageSize, totalActiveUsers);

  const tablePagination = {
    current: currentPage,
    pageSize,
    total: totalActiveUsers,
    showSizeChanger: false,
    showQuickJumper: true,
    onChange: (page) => setCurrentPage(page),
    showTotal: (total) => `Hiển thị ${currentRangeStart} đến ${currentRangeEnd} của ${total} bác sĩ`,
  };

  // -------------------- RENDER --------------------
  return (
    <div className="p-6 bg-gray-100 h-full">
      <div className="mb-6">
        <Title level={2} className="m-0 font-bold">
          Quản lý bác sĩ
        </Title>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-5 items-stretch lg:items-center">
        <Input
          placeholder="Tìm kiếm theo tên, email hoặc chuyên khoa..."
          prefix={<SearchOutlined />}
          className="lg:flex-1 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />

        <Select
          value={filterStatus}
          onChange={(val) => setFilterStatus(val)}
          className="w-full lg:w-40 h-10"
          options={[
            { value: "Tất cả", label: "Tất cả trạng thái" },
            { value: "Kích hoạt", label: "Kích hoạt" },
            { value: "Khóa", label: "Khóa" },
          ]}
        />

        <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 h-10 px-4 text-base w-full lg:w-auto" onClick={() => openModal("add")}>
          Thêm tài khoản
        </Button>
      </div>

      <div className="space-y-1">
        <Title level={4} className="m-0 font-semibold flex items-center">
          Bác sĩ đang hoạt động ({totalActiveUsers})
        </Title>

        <Card className="shadow-lg">
          <ActiveDoctorsTable
            data={currentActiveUsers}
            onViewDetails={handleViewDetails}
            onDelete={handleDeleteActiveDoctor}
            paginationProps={{ pagination: tablePagination }}
          />
        </Card>
      </div>

      {/* Modals */}
      <AddDoctorModal open={modal.add} onCancel={() => closeModal("add")} onFinish={handleAddNewDoctor} />

      <DoctorDetailModal open={modal.detail} onCancel={() => closeModal("detail")} doctor={selectedDoctor} onSave={handleSaveDoctorChanges} />
    </div>
  );
}
