import { Form, Input, Modal, Button, message } from "antd";
import React from "react";

const ChangePasswordModal = ({ isVisible, onClose }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    // 1. Thực hiện logic gọi API để đổi mật khẩu tại đây
    console.log("Password change requested:", values);

    // 2. Kiểm tra logic xác nhận mật khẩu
    if (values.newPassword !== values.confirmPassword) {
      message.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    // 3. Giả lập thành công
    message.success("Đổi mật khẩu thành công!");
    
    // Đóng Modal và reset Form
    onClose();
    form.resetFields();
  };

  return (
    <Modal
      title="Đổi mật khẩu"
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          className="bg-blue-600"
          loading={false} // Thêm loading state nếu cần gọi API
          onClick={() => form.submit()}
        >
          Xác nhận
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mt-4"
      >
        {/* Mật khẩu cũ */}
        <Form.Item
          name="currentPassword"
          label="Mật khẩu cũ"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu cũ của bạn" />
        </Form.Item>

        {/* Mật khẩu mới */}
        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Tạo mật khẩu mới" />
        </Form.Item>

        {/* Xác nhận mật khẩu mới */}
        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
            // Kiểm tra mật khẩu mới và xác nhận có khớp nhau không
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp!")
                );
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Nhập lại mật khẩu mới" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;