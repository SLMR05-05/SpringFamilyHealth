import { Button, Card, Divider, Input, Switch, Typography, Form, Space } from "antd";
import React, { useState } from "react";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import ChangePasswordModal  from "../../components/ChangePasswordModal";

const { Title, Text } = Typography;
const { Item } = Form;

// Component Field cố định để hiển thị thông tin
const InfoField = ({ label, value, readOnly = true }) => {
  return (
    <div className="flex flex-col mb-4">
      <Text className="text-gray-500 text-sm mb-1">{label}</Text>
      <Input
        value={value}
        readOnly={readOnly}
        className={`bg-gray-50 border-gray-300 px-4 py-2 ${readOnly ? '' : 'bg-white'}`}
      />
    </div>
  );
};

// Component chính
const SettingsPage = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa thông tin cá nhân
  
  // Dữ liệu người dùng giả định
  const initialData = {
    fullName: "Minh Anh",
    email: "minhanh.bs@healthapp.com",
    phone: "0987 654 321",
    notifyEmail: true,
    notifyPush: true,
    notifySms: false,
  };

  const handleEditToggle = () => {
      setIsEditing(!isEditing);
  };
  
  const handleSaveChanges = () => {
      // Logic lưu thay đổi
      alert("Đã lưu thay đổi!");
  };
  
  const handleCancel = () => {
      // Logic hủy bỏ (hoặc reset form)
      form.resetFields();
      setIsEditing(false);
  };


  const [isModalVisible, setIsModalVisible] = useState(false); 
  
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="p-6 bg-gray-100 h-full">
      
      {/* HEADER */}
      <div className="mb-6">
        <Title level={2} className="m-0 text-2xl font-bold">Cài đặt tài khoản</Title>
        <p className="text-gray-500">
          Quản lý thông tin cá nhân, cài đặt và tùy chọn bảo mật của bạn.
        </p>
      </div>

      <Form form={form} initialValues={initialData} layout="vertical">
        <Card className="shadow-lg mb-6 p-4">
          
          {/* PHẦN 1: THÔNG TIN CÁ NHÂN */}
          <div className="flex justify-between items-start mb-6">
            <Title level={4} className="m-0">Thông tin cá nhân</Title>
            <Button type="default" onClick={handleEditToggle}>
              {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
            </Button>
          </div>

          {/* Avatar và Thông tin */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Cột Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <img 
                  src="path/to/avatar/minhanh.jpg" // Thay thế bằng đường dẫn ảnh thật
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover shadow-md"
                />
                {isEditing && (
                    <Button 
                        icon={<EditOutlined />} 
                        shape="circle" 
                        size="small" 
                        className="absolute bottom-0 right-0 border-blue-600 text-blue-600 bg-white"
                    />
                )}
              </div>
              <Text className="text-gray-500 text-sm">Họ và tên</Text>
            </div>

            {/* Cột 2 & 3: Các trường Input */}
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              
              {/* Họ và tên */}
              <Item name="fullName" label="Họ và tên" className="mb-0">
                <Input 
                    readOnly={!isEditing}
                    className={`px-4 py-2 ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                />
              </Item>

              {/* Email */}
              <Item name="email" label="Email" className="mb-0">
                <Input 
                    readOnly={!isEditing}
                    className={`px-4 py-2 ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                />
              </Item>

              

              {/* Số điện thoại */}
              <Item name="phone" label="Số điện thoại" className="mb-0">
                <Input 
                    readOnly={!isEditing}
                    className={`px-4 py-2 ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                />
              </Item>
            </div>
          </div>
        </Card>
        

        {/* PHẦN 3: BẢO MẬT */}
        <Card className="shadow-lg mb-6 p-4">
          <Title level={4} className="mt-0 mb-6">Bảo mật</Title>

          <Space direction="vertical" className="w-full" size="large">
            {/* Thay đổi mật khẩu */}
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <div>
                <Text className="block text-base font-medium">Thay đổi mật khẩu</Text>
                <Text type="secondary" className="text-sm">Nên thay đổi mật khẩu định kỳ để bảo vệ tài khoản.</Text>
              </div>
              <Button type="default" onClick={showModal}>Đổi mật khẩu</Button>
            </div>
            
          </Space>
        </Card>
      </Form>
      
      {/* FOOTER ACTIONS */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button size="large" onClick={handleCancel}>Hủy</Button>
        <Button size="large" type="primary" className="bg-blue-600" onClick={handleSaveChanges}>
          Lưu thay đổi
        </Button>
      </div>
        
        <ChangePasswordModal 
        isVisible={isModalVisible} 
        onClose={handleModalClose} 
      />
    </div>
  );
};

export default SettingsPage;