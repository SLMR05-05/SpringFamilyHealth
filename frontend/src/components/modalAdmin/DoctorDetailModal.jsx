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

// Giả định danh sách chuyên khoa
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

const DoctorDetailModal = ({ open, onCancel, doctor, onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const doctorData = doctor || {};

  // Thiết lập giá trị ban đầu cho Form khi doctor thay đổi hoặc modal mở
  useEffect(() => {
    if (doctor && open) {
      form.setFieldsValue({
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        specialty: doctor.specialty,
        certificate_number: doctor.certificate_number || "",
      });
      // Reset password fields
      form.setFieldValue("newPassword", undefined);
      form.setFieldValue("confirmPassword", undefined);
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
        phone: values.phone,
        specialty: values.specialty,
        certificate_number: values.certificate_number,
        // Chỉ gửi mật khẩu nếu nó được điền
        newPassword: values.newPassword || undefined,
      };

      // Gọi onSave từ cha
      await Promise.resolve(onSave(doctorData.key, changes));

    } catch (error) {
      console.error('DoctorDetailModal save error', error);
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
          ID hệ thống: {doctorData.key || "N/A"}
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

        <Form.Item name="phone" label="Số điện thoại">
          <Input prefix={<UserOutlined className="text-gray-400" />} />
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

        {/* Thông tin chỉ đọc: Ngày Đăng Ký */}
        <div className="mb-4">
          <Text strong className="block">
            <CalendarOutlined /> Ngày Đăng Ký:
          </Text>
          <Text type="secondary">{doctorData?.date || "N/A"}</Text>
        </div>

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