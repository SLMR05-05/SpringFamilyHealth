import React, { useMemo, useState, useCallback } from "react";
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
  CheckCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

// Các Modal ngoại vi (giữ nguyên import nếu bạn đã có các component này)
import AddDoctorModal from "../../components/modalAdmin/AddDoctorModal";
import ApproveDoctorModal from "../../components/modalAdmin/ApproveDoctorModal";
import DoctorDetailModal from "../../components/modalAdmin/DoctorDetailModal";

const { Title, Text } = Typography;

// -------------------- DỮ LIỆU MẪU (tách ra file nếu muốn) --------------------
const PENDING_DOCTORS_INITIAL = [
  {
    key: 1,
    name: "BS. Lê Văn An",
    email: "an.le@clinic.com",
    specialty: "Khoa Tim Mạch",
    date: "20/07/2023",
    certificate_number: "CC001122",
  },
  {
    key: 2,
    name: "BS. Trần Thị Bình",
    email: "binh.tran@clinic.com",
    specialty: "Khoa Nhi",
    date: "19/07/2023",
    certificate_number: "CC003344",
  },
];

const ACTIVE_DOCTORS_INITIAL = [
  {
    key: 3,
    name: "BS. Nguyễn Văn Cường",
    email: "cuong.nguyen@clinic.com",
    specialty: "Khoa Da Liễu",
    status: "Kích hoạt",
    certificate_number: "CC009900",
    date: "10/01/2023",
  },
  {
    key: 4,
    name: "BS. Phạm Thị Dung",
    email: "dung.pham@clinic.com",
    specialty: "Khoa Mắt",
    status: "Khóa",
    certificate_number: "CC008800",
    date: "15/03/2022",
  },
  {
    key: 5,
    name: "BS. Hoàng Đình Giang",
    email: "giang.hoang@clinic.com",
    specialty: "Khoa Thần Kinh",
    status: "Kích hoạt",
    certificate_number: "CC007700",
    date: "22/11/2023",
  },
  {
    key: 6,
    name: "BS. Vũ Thị Hòa",
    email: "hoa.vu@clinic.com",
    specialty: "Khoa Răng Hàm Mặt",
    status: "Kích hoạt",
    certificate_number: "CC006600",
    date: "01/05/2023",
  },
  {
    key: 7,
    name: "BS. Đặng Thanh Sơn",
    email: "son.dang@clinic.com",
    specialty: "Khoa Tai Mũi Họng",
    status: "Khóa",
    certificate_number: "CC005500",
    date: "04/04/2023",
  },
  {
    key: 8,
    name: "BS. Lý Thị Mai",
    email: "mai.ly@clinic.com",
    specialty: "Khoa Nội",
    status: "Kích hoạt",
    certificate_number: "CC004400",
    date: "12/07/2022",
  },
  {
    key: 9,
    name: "BS. Trương Văn Hùng",
    email: "hung.truong@clinic.com",
    specialty: "Khoa Nội",
    status: "Kích hoạt",
    certificate_number: "CC003300",
    date: "25/08/2023",
  },
];

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

// Service đơn giản cho UX local (khi chuyển sang API, thay bằng gọi fetch/axios)
const doctorService = {
  approve: (doctor) => ({ ...doctor, status: "Kích hoạt", date: new Date().toLocaleDateString("vi-VN") }),
  create: (payload) => ({ ...payload, key: Date.now(), status: "Kích hoạt", date: new Date().toLocaleDateString("vi-VN") }),
  update: (doctor, changes) => ({ ...doctor, ...changes }),
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

function PendingDoctorsTable({ data, onApprove, onReject }) {
  const columns = useMemo(
    () => [
      {
        title: "THÔNG TIN BÁC SĨ",
        dataIndex: "name",
        key: "info",
        width: "35%",
        render: (_, record) => <DoctorInfoCell name={record.name} email={record.email} />,
      },
      { title: "CHUYÊN KHOA", dataIndex: "specialty", key: "specialty", width: "25%" },
      { title: "NGÀY ĐĂNG KÝ", dataIndex: "date", key: "date", width: "25%" },
      {
        title: "HÀNH ĐỘNG",
        key: "actions",
        width: "15%",
        render: (_, doctor) => (
          <Space size="small">
            <Button
              icon={<CheckCircleOutlined />}
              type="primary"
              size="small"
              onClick={() => onApprove(doctor)}
            >
              Duyệt
            </Button>
            <Button icon={<DeleteOutlined />} danger type="text" size="small" onClick={() => onReject(doctor)} />
          </Space>
        ),
      },
    ],
    [onApprove, onReject]
  );

  return <Table columns={columns} dataSource={data} pagination={false} rowKey="key" />;
}

function ActiveDoctorsTable({ data, onViewDetails, onDelete, paginationProps }) {
  const columns = useMemo(
    () => [
      {
        title: "THÔNG TIN BÁC SĨ",
        dataIndex: "name",
        key: "info",
        width: "30%",
        render: (_, record) => <DoctorInfoCell name={record.name} email={record.email} />,
      },
      { title: "CHUYÊN KHOA", dataIndex: "specialty", key: "specialty", width: "20%" },
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
        width: "15%",
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
  const [activeDoctors, setActiveDoctors] = useState(ACTIVE_DOCTORS_INITIAL);
  const [pendingDoctors, setPendingDoctors] = useState(PENDING_DOCTORS_INITIAL);

  // modal state gom chung
  const [modal, setModal] = useState({ add: false, approve: false, detail: false });
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // filter & paging
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const [isPendingTableVisible, setIsPendingTableVisible] = useState(true);

  // -------------------- CRUD handlers --------------------
  const openModal = useCallback((key, doctor = null) => {
    setSelectedDoctor(doctor);
    setModal((m) => ({ ...m, [key]: true }));
  }, []);

  const closeModal = useCallback((key) => setModal((m) => ({ ...m, [key]: false })), []);

  const handleApprove = useCallback((doctor) => {
    // remove from pending
    setPendingDoctors((prev) => prev.filter((d) => d.key !== doctor.key));

    // create active doctor
    const approved = doctorService.approve(doctor);
    setActiveDoctors((prev) => [approved, ...prev]);

    closeModal("approve");
    message.success(`Đã duyệt thành công bác sĩ ${doctor.name}!`);
    setCurrentPage(1);
  }, [closeModal]);

  const handleRejectPending = useCallback((doctor) => {
    const ok = window.confirm(`Bạn có thực sự muốn từ chối/xóa ${doctor.name}?`);
    if (!ok) return;
    setPendingDoctors((prev) => prev.filter((d) => d.key !== doctor.key));
    message.success(`Đã từ chối bác sĩ ${doctor.name}.`);
  }, []);

  const handleAddNewDoctor = useCallback((payload) => {
    const newDoctor = doctorService.create(payload);
    setActiveDoctors((prev) => [newDoctor, ...prev]);
    closeModal("add");
    setCurrentPage(1);
    message.success(`Đã thêm bác sĩ ${payload.name} thành công!`);
    // password is handled within modal - here we don't store it
    if (payload.password) console.log(`Mật khẩu tạm thời cho ${payload.name}: ${payload.password}`);
  }, [closeModal]);

  const handleSaveDoctorChanges = useCallback((doctorId, changes) => {
    setActiveDoctors((prev) => prev.map((d) => (d.key === doctorId ? doctorService.update(d, changes) : d)));
    closeModal("detail");
    message.success(`Cập nhật thành công bác sĩ ID: ${doctorId}`);
    if (changes.newPassword) console.log(`Mật khẩu mới được set cho ID ${doctorId}`);
  }, [closeModal]);

  const handleDeleteActiveDoctor = useCallback((doctor) => {
    const ok = window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản của ${doctor.name} không?`);
    if (!ok) return;
    setActiveDoctors((prev) => prev.filter((d) => d.key !== doctor.key));
    message.success(`Đã xóa tài khoản ${doctor.name} thành công.`);
  }, []);

  const handleViewDetails = useCallback((doctor) => openModal("detail", doctor), [openModal]);

  // -------------------- FILTER & PAGINATION --------------------
  const { filtered: filteredActiveDoctors, paginated: currentActiveUsers, total: totalActiveUsers, startIndex } = useFilteredPagination({
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
        <div className="flex justify-start items-center space-x-3">
          <Title level={4} className="m-0 font-semibold">
            Bác sĩ chờ duyệt ({pendingDoctors.length})
          </Title>
          <Button
            icon={isPendingTableVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            type="text"
            className="text-gray-500 hover:text-blue-600"
            onClick={() => setIsPendingTableVisible((v) => !v)}
          />
        </div>

        {isPendingTableVisible && (
          <Card className="shadow-lg">
            <PendingDoctorsTable data={pendingDoctors} onApprove={(d) => openModal("approve", d)} onReject={handleRejectPending} />
          </Card>
        )}

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

      <ApproveDoctorModal
        open={modal.approve}
        onCancel={() => closeModal("approve")}
        doctor={selectedDoctor}
        onApprove={handleApprove}
      />

      <DoctorDetailModal open={modal.detail} onCancel={() => closeModal("detail")} doctor={selectedDoctor} onSave={handleSaveDoctorChanges} />
    </div>
  );
}
