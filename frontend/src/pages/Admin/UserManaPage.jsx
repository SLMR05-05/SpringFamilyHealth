import {
  Button,
  Card,
  Table,
  Input,
  Select,
  Space,
  Typography,
  Modal,
  message,
} from "antd";
import React, { useState, useMemo } from "react";
import {
  PlusOutlined,
  SearchOutlined,
  UnlockOutlined,
  LockOutlined,
  EyeOutlined,
  KeyOutlined,

  // ⭐️ IMPORT ICON THÙNG RÁC
  DeleteOutlined,
} from "@ant-design/icons";

import AddUserModal from "../../components/modalAdmin/AddUserModal";
import UserDetailModal from "../../components/modalAdmin/UserDetailModal";

const { Title, Text } = Typography;

// Sửa lỗi cú pháp email trong dữ liệu mẫu
const ALL_USERS_DATA_INITIAL = [
  {
    key: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    status: "Kích hoạt",
    date: "25/10/2023",
  },
  {
    key: 2,
    name: "Trần Thị B",
    email: "tranthib@email.com",
    status: "Khóa",
    date: "24/10/2020",
  },
  {
    key: 3,
    name: "Lê Văn C",
    email: "levanc@email.com",
    status: "Kích hoạt",
    date: "22/10/2023",
  },
  {
    key: 4,
    name: "Phạm Thị D",
    email: "phamthid@email.com",
    status: "Kích hoạt",
    date: "20/10/2023",
  },
  {
    key: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@email.com",
    status: "Kích hoạt",
    date: "18/10/2023",
  },
  {
    key: 6,
    name: "Vũ Thị F",
    email: "vuthif@email.com",
    status: "Khóa",
    date: "16/10/2023",
  },
  {
    key: 7,
    name: "Đặng Văn G",
    email: "dangvang@email.com",
    status: "Kích hoạt",
    date: "14/10/2023",
  },
  {
    key: 8,
    name: "Bùi Thị H",
    email: "buithih@email.com",
    status: "Khóa",
    date: "12/10/2023",
  },
  {
    key: 9,
    name: "Trịnh Văn I",
    email: "trinhvani@email.com",
    status: "Kích hoạt",
    date: "10/10/2023",
  },
  {
    key: 10,
    name: "Lý Thị K",
    email: "lythik@email.com",
    status: "Khóa",
    date: "08/10/2023",
  },
];

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

const UserManagementPage = () => {
  const [loading] = useState(false);
  const [users, setUsers] = useState(ALL_USERS_DATA_INITIAL);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả"); 

  const filteredUsers = useMemo(() => {
    let data = users;

    if (filterStatus !== "Tất cả") {
      data = data.filter((user) => user.status === filterStatus);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    if (currentPage !== 1 && data.length <= (currentPage - 1) * pageSize) {
      setCurrentPage(1);
    }

    return data;
  }, [filterStatus, searchTerm, currentPage, pageSize, users]);

  const startIndex = (currentPage - 1) * pageSize;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
  const totalUsers = filteredUsers.length;

  const currentRangeStart = totalUsers > 0 ? startIndex + 1 : 0;
  const currentRangeEnd = Math.min(startIndex + pageSize, totalUsers);

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  

  const handleViewDetails = (user) => {
    setSelectedUserDetail(user);
    setIsDetailModalVisible(true);
  };
  const handleSaveUserChanges = (userId, changes) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.key === userId) {
          const updatedUser = {
            ...user,
            name: changes.name,
            email: changes.email,
            status: changes.status,
          };
          if (changes.newPassword) {
            console.log(`Mật khẩu cho user ${user.name} đã được thay đổi!`);
          }
          return updatedUser;
        }
        return user;
      })
    );
    setIsDetailModalVisible(false);
    message.success(`Cập nhật thành công tài khoản ID: ${userId}`);
  }; // ⭐️ HÀM MỚI: XỬ LÝ XÓA TÀI KHOẢN ⭐️

  const handleDeleteUser = (user) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản của ${user.name} không?`
    );

    if (confirmed) {
      setUsers((prevUsers) => prevUsers.filter((u) => u.key !== user.key));
      message.success(`Đã xóa tài khoản ${user.name} thành công.`);
      // Reset về trang 1 nếu trang hiện tại trống sau khi xóa
      if (currentUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  }; // ⭐️ HÀM XỬ LÝ THÊM USER MỚI (Giữ nguyên) ⭐️

  const handleAddNewUser = (newUser) => {
    const newRecord = {
      key: Date.now(),
      name: newUser.name,
      email: newUser.email,
      status: "Kích hoạt",
      date: new Date().toLocaleDateString("vi-VN"),
    };

    setUsers((prev) => [newRecord, ...prev]);
    setIsAddModalVisible(false);
    setCurrentPage(1);
  };

  const columns = [
    { title: "TÊN", dataIndex: "name", key: "name", width: "20%" },
    { title: "EMAIL", dataIndex: "email", key: "email", width: "25%" },
    {
      title: "TRẠNG THÁI",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => {
        const { bg, text } = getStatusPillClasses(status);

        return (
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${bg} ${text}`}
          >
            {status}
          </span>
        );
      },
    },
    { title: "NGÀY TẠO", dataIndex: "date", key: "date", width: "15%" },
    {
      title: "HÀNH ĐỘNG",
      key: "actions",
      width: "15%",
      render: (_, user) => (
        <Space size="small">
          {/* ⭐️ NÚT XEM CHI TIẾT MỚI ⭐️ */}
          <Button
            title="Xem Chi Tiết"
            icon={<EyeOutlined />}
            size="small"
            type="text"
            onClick={() => {}}
          />
          {/* ⭐️ NÚT XÓA MỚI ⭐️ */}
          <Button
            title="Xóa Tài Khoản"
            icon={<DeleteOutlined />}
            size="small"
            type="text"
            danger
            onClick={() => handleDeleteUser(user)}
          />
                 
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 h-full">
                 
      <div className="mb-6">
                       
        <Title level={2} className="m-0 font-bold">
                    Quản lý Tài khoản        
        </Title>
           
      </div>
             
      <div className="flex flex-col lg:flex-row gap-3 mb-5 items-stretch lg:items-center">
               
        <Input
          placeholder="Tìm kiếm theo tên hoặc email..."
          prefix={<SearchOutlined />}
          className="lg:flex-1 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
               
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          className="w-full lg:w-40 h-10"
          options={[
            { value: "Tất cả", label: "Tất cả trạng thái" },
            { value: "Kích hoạt", label: "Kích hoạt" },
            { value: "Khóa", label: "Khóa" },
          ]}
        />
               
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-blue-600 h-10 px-4 text-base w-full lg:w-auto"
          onClick={() => setIsAddModalVisible(true)}
        >
        Thêm tài khoản        
        </Button>
           
      </div>
         
      <Card className="shadow-lg">
               
        <Table
          columns={columns}
          dataSource={currentUsers}
          loading={loading}
          rowKey="key"
          onChange={handleTableChange}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalUsers,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total) =>
              `Hiển thị ${currentRangeStart} đến ${currentRangeEnd} của ${total} tài khoản`,
          }}
        />
             
      </Card>
            {/* Modal thêm user */}
           
      <AddUserModal
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onFinish={handleAddNewUser}
      />
            {/* Modal chi tiết user */}
      <UserDetailModal
        isVisible={isDetailModalVisible}
        onClose={() => setIsDetailModalVisible(false)}
        user={selectedUserDetail}
        onSave={handleSaveUserChanges}
      />
               
    </div>
  );
};

export default UserManagementPage;
