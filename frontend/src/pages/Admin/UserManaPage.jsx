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
import React, { useState, useMemo, useEffect } from "react";
import { PlusOutlined, SearchOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";

import AddUserModal from "../../components/modalAdmin/AddUserModal";
import UserDetailModal from "../../components/modalAdmin/UserDetailModal";
import { userApi } from "../../api";

const { Title } = Typography;

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
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userApi.getAll(0, 100);

        let usersList = [];
        if (response.data) {
          if (response.data.content && Array.isArray(response.data.content)) {
            usersList = response.data.content;
          } else if (Array.isArray(response.data)) {
            usersList = response.data;
          }
        }

        const usersData = usersList.map((user, index) => ({
          key: user.userId || index,
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: user.locked ? "Khóa" : "Kích hoạt",
          date: user.createdAt
            ? new Date(user.createdAt).toLocaleDateString("vi-VN")
            : "N/A",
          role: user.role,
          userId: user.userId,
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let data = users;

    if (filterStatus !== "Tất cả") {
      data = data.filter((user) => user.status === filterStatus);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (u) =>
          (u.name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q)
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

  const handleSaveUserChanges = async (userId, changes) => {
    try {
      setLoading(true);

      const updateData = {
        name: changes.name,
        email: changes.email,
        phone: changes.phone,
        role: changes.role,
        locked: changes.status === "Khóa",
      };

      if (changes.newPassword) {
        updateData.passwordHash = changes.newPassword;
      }

      await userApi.update(userId, updateData);

      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.key === userId) {
            return {
              ...user,
              name: changes.name,
              email: changes.email,
              phone: changes.phone,
              status: changes.status,
              role: changes.role,
            };
          }
          return user;
        })
      );

      setIsDetailModalVisible(false);
      message.success("Cập nhật thành công tài khoản!");
    } catch (error) {
      console.error("Error updating user:", error);
      message.error(error.message || "Không thể cập nhật tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (user) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản của ${user.name} không?`
    );

    if (confirmed) {
      setUsers((prevUsers) => prevUsers.filter((u) => u.key !== user.key));
      message.success(`Đã xóa tài khoản ${user.name} thành công.`);
      if (currentUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleAddNewUser = async (newUser) => {
    try {
      setLoading(true);
      const userData = {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || "",
        role: newUser.role || "user",
        passwordHash: newUser.password,
      };

      const response = await userApi.create(userData);

      const newRecord = {
        key: response.data.userId,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        status: response.data.locked ? "Khóa" : "Kích hoạt",
        date: response.data.createdAt
          ? new Date(response.data.createdAt).toLocaleDateString("vi-VN")
          : new Date().toLocaleDateString("vi-VN"),
        role: response.data.role,
        userId: response.data.userId,
      };

      setUsers((prev) => [newRecord, ...prev]);
      setIsAddModalVisible(false);
      setCurrentPage(1);
      message.success("Thêm tài khoản thành công!");
    } catch (error) {
      console.error("Error creating user:", error);
      message.error(error.message || "Không thể tạo tài khoản mới");
    } finally {
      setLoading(false);
    }
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
          <Button
            title="Xem Chi Tiết"
            icon={<EyeOutlined />}
            size="small"
            type="text"
            onClick={() => {
              handleViewDetails(user);
            }}
          />
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

      <AddUserModal
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onFinish={handleAddNewUser}
      />

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
