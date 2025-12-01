import React, { useEffect, useState } from "react";
import { Modal, Button, Typography, Space, Divider, Form, Input, Select, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  LockOutlined,
  CalendarOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

// Giả định danh sách chuyên khoa và trạng thái
const SPECIALTY_OPTIONS = [
  "Khoa Tim Mạch",
  "Khoa Nhi",
  "Khoa Da Liễu",
  "Khoa Mắt",
  "Khoa Thần Kinh",
  "Khoa Răng Hàm Mặt",
  "Khoa Tai Mũi Họng",
  "Khoa Nội",
  "Khoa Ngoại",
];
const STATUS_OPTIONS = ["Kích hoạt", "Khóa"];

const DoctorDetailModal = ({ open, onCancel, doctor, onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false); // State quản lý ẩn/hiện mật khẩu

  const doctorData = doctor || {}; 

  // Thiết lập giá trị ban đầu cho Form khi doctor thay đổi hoặc modal mở
  useEffect(() => {
    if (doctor && open) {
      form.setFieldsValue({
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
        certificate_number: doctor.certificate_number || "",
        status: doctor.status,
      });
      // ⭐️ LOGIC CHÍNH: Reset trạng thái mật khẩu và form fields liên quan ⭐️
      setShowPasswordField(false); 
      form.setFieldValue('newPassword', undefined);
      form.setFieldValue('confirmPassword', undefined);
    } else {
      form.resetFields();
    }
  }, [doctor, open, form]);

  const handleFormSubmit = async (values) => {
    try {
        setLoading(true);

        // 1. Kiểm tra mật khẩu (chỉ kiểm tra nếu newPassword có giá trị)
        if (values.newPassword) {
            if (values.newPassword.length < 6) {
                message.error("Mật khẩu phải có ít nhất 6 ký tự.");
                setLoading(false);
                return;
            }
            if (values.newPassword !== values.confirmPassword) {
                message.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
                setLoading(false);
                return;
            }
        }
        
        // 2. Gộp dữ liệu thay đổi và gọi hàm onSave
        const changes = {
            name: values.name,
            email: values.email,
            specialty: values.specialty,
            status: values.status,
            certificate_number: values.certificate_number,
            // Chỉ gửi mật khẩu nếu nó được điền
            newPassword: values.newPassword || undefined, 
        };
        
        // Giả lập await cho onSave (hàm cha sẽ xử lý đóng và message success)
        await Promise.resolve(onSave(doctorData.key, changes)); 

    } catch (error) {
        // message.error đã được xử lý trong validation ở trên
    } finally {
        setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Title level={4} className="m-0">
          Thông tin & Cập nhật Tài khoản
        </Title>
      }
      open={open}
      onCancel={onCancel}
      width={500}
      footer={null} 
      closeIcon={<CloseOutlined className="text-gray-500" />} 
      centered
    >
      <Form
        form={form}
        layout="vertical"
        name="edit_doctor_form"
        onFinish={handleFormSubmit} 
        preserve={false}
        className="mt-4"
      >
        {/* ID TÀI KHOẢN (THÔNG TIN CHỈ ĐỌC) */}
        <Text type="secondary" className="block mb-4">
            ID hệ thống: {doctorData.key || 'N/A'}
        </Text>
        
        <Form.Item
          name="name"
          label="Tên Tài Khoản"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input prefix={<UserOutlined className="text-gray-400" />} />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input prefix={<MailOutlined className="text-gray-400" />} />
        </Form.Item>

        <Form.Item name="certificate_number" label="Mã Số Chứng Chỉ">
          <Input prefix={<IdcardOutlined className="text-gray-400" />} />
        </Form.Item>

        <Form.Item
          name="specialty"
          label="Chuyên Khoa"
          rules={[{ required: true, message: "Vui lòng chọn chuyên khoa!" }]}
        >
          <Select placeholder="Chọn chuyên khoa">
            {SPECIALTY_OPTIONS.map((s) => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng Thái Tài Khoản"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!'  }]}
        >
          <Select placeholder="Chọn trạng thái">
            {STATUS_OPTIONS.map((s) => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Thông tin chỉ đọc: Ngày Đăng Ký */}
        <div className="mb-4">
          <Text strong className="block">
            <CalendarOutlined /> Ngày Đăng Ký:
          </Text>
          <Text type="secondary">{doctorData?.date || "N/A"}</Text>
        </div>

        {/* --- Phần Mật Khẩu --- */}
        
        <Divider className="my-3" />
        {/* Tiêu đề & Nút Toggle */}
        <div className="flex justify-between items-center mb-4">
            <Title level={5} className="mt-0 mb-0 flex items-center">
                 Thay Đổi Mật Khẩu
            </Title>
            <Button 
                type="dashed" 
                size="small"
                onClick={() => setShowPasswordField(!showPasswordField)}
            >
                {showPasswordField ? 'Ẩn trường mật khẩu' : 'Thay đổi mật khẩu'}
            </Button>
        </div>

        {showPasswordField && (
            <>
                {/* Mật khẩu mới */}
                <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    // ⭐️ BỎ REQUIRED: Chỉ cần dependency cho confirmPassword ⭐️
                    hasFeedback
                >
                    <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Để trống nếu không muốn thay đổi" />
                </Form.Item>
                
                {/* Xác nhận Mật khẩu mới */}
                <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu mới"
                    dependencies={['newPassword']}
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                // Nếu newPassword không có giá trị, bỏ qua validation này
                                if (!getFieldValue('newPassword')) return Promise.resolve(); 
                                
                                if (getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                    hasFeedback
                >
                    <Input.Password prefix={<LockOutlined className="text-gray-400" />} />
                </Form.Item>
            </>
        )}
        
        {/* FOOTER ACTIONS BÊN TRONG FORM */}
        <Form.Item className="mb-0">
            <Space className="w-full justify-end mt-4">
                <Button onClick={onCancel} disabled={loading}>
                    Hủy bỏ
                </Button>
                <Button type="primary" htmlType="submit" className="bg-blue-600" loading={loading} icon={<SaveOutlined />}>
                    Lưu thay đổi
                </Button>
            </Space>
        </Form.Item>
        
      </Form>
    </Modal>
  );
};

export default DoctorDetailModal;