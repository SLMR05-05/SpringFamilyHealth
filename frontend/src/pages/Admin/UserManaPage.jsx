/* eslint-disable no-irregular-whitespace */
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
import React, { useState, useMemo, useEffect } from "react";
import { userApi } from "../../api";
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

const getStatusPillClasses = (status) => {
  switch (status) {
    case "ACTIVE":
      return { bg: "bg-green-100", text: "text-green-800", label: "Kích hoạt" };
    case "INACTIVE":
      return { bg: "bg-red-100", text: "text-red-800", label: "Khóa" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800", label: status };
  }
};

const UserManagementPage = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAll(currentPage - 1, pageSize);
      const userData = response.data?.content || [];
      const formattedUsers = userData.map(user => ({
        key: user.userId,
        id: user.userId,
        name: user.name || user.email,
        email: user.email,
        phone: user.phone || "",
        role: user.role || "USER",
        status: user.locked ? "INACTIVE" : "ACTIVE",
        locked: user.locked || false,
        createdAt: user.createdAt,
        date: user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "",
      }));
      setUsers(formattedUsers);
      setTotalUsers(response.data?.totalElements || 0);
    } catch (error) {
      message.error("Không thể tải danh sách người dùng: " + error.message);
    } finally {
      setLoading(false);
    }
  }; 

  const filteredUsers = useMemo(() => {
    let data = users;

    if (filterStatus !== "Tất cả") {
      const statusMap = {
        "Kích hoạt": "ACTIVE",
        "Khóa": "INACTIVE"
      };
      const mappedStatus = statusMap[filterStatus] || filterStatus;
      data = data.filter((user) => user.status === mappedStatus);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    return data;
  }, [filterStatus, searchTerm, users]);

  const currentUsers = filteredUsers;
  const displayTotal = searchTerm || filterStatus !== "Tất cả" ? filteredUsers.length : totalUsers;
  const currentRangeStart = displayTotal > 0 ? ((currentPage - 1) * pageSize) + 1 : 0;
  const currentRangeEnd = Math.min(currentPage * pageSize, displayTotal);

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
        role: changes.role || "USER",
        name: changes.name,
        phone: changes.phone || "",
        email: changes.email,
        locked: changes.locked
      };
      // Only include passwordHash when user provided a new password
      if (changes.newPassword) {
        updateData.passwordHash = changes.newPassword;
      }
      await userApi.update(userId, updateData);
      message.success(`Cập nhật thành công tài khoản ID: ${userId}`);
      setIsDetailModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error("Không thể cập nhật người dùng: " + error.message);
    } finally {
      setLoading(false);
    }
  }; // ⭐️ HÀM MỚI: XỬ LÝ XÓA TÀI KHOẢN ⭐️

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản của ${user.name} không?`
    );

    if (confirmed) {
      try {
        setLoading(true);
        await userApi.remove(user.id);
        message.success(`Đã xóa tài khoản ${user.name} thành công.`);
        // Reset về trang 1 nếu trang hiện tại trống sau khi xóa
        if (currentUsers.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchUsers();
        }
      } catch (error) {
        message.error("Không thể xóa người dùng: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  }; // ⭐️ HÀM XỬ LÝ THÊM USER MỚI (Giữ nguyên) ⭐️

  const handleAddNewUser = async (newUser) => {
    try {
      setLoading(true);
      await userApi.create({
        role: "USER",
        passwordHash: newUser.password,
        name: newUser.name,
        phone: newUser.phone || "",
        email: newUser.email
      });
      message.success("Thêm người dùng thành công!");
      setIsAddModalVisible(false);
      setCurrentPage(1);
      fetchUsers();
    } catch (error) {
      message.error("Không thể thêm người dùng: " + error.message);
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
        const { bg, text, label } = getStatusPillClasses(status);

        return (
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${bg} ${text}`}
          >
            {label}
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
            onClick={() => {handleViewDetails(user);}}
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
            total: displayTotal,
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
