import { Modal, Form, Input, Select, Button, Space, } from "antd";
import React, { useEffect } from "react";
import { LockOutlined, MailOutlined, UserOutlined, IdcardOutlined, PhoneOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useForm } from "antd/es/form/Form";

const { Title } = Typography;

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

const AddDoctorModal = ({ open, onCancel, onFinish }) => {
  const [form] = Form.useForm();

  // Reset form khi Modal được mở/đóng
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Gọi hàm onFinish từ component cha (DoctorManagementPage)
        onFinish(values);
        // Form sẽ được reset qua useEffect khi Modal đóng
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      title={<Title level={4} className="m-0">Thêm Tài khoản Mới</Title>}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Thêm Bác Sĩ
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="add_doctor_form"
        initialValues={{ specialty: SPECIALTY_OPTIONS[0] }}
      >
        <Form.Item
          name="name"
          label="Tên Tài Khoản"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên tài khoản!",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Ví dụ: BS. Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              type: "email",
              message: "Email không hợp lệ!",
            },
            {
              required: true,
              message: "Vui lòng nhập email!",
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Ví dụ: tenbacsi@clinic.com" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            {
              pattern: /^[0-9]{10,11}$/,
              message: "Số điện thoại phải có 10-11 chữ số!",
            },
          ]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Ví dụ: 0912345678" />
        </Form.Item>

        <Form.Item
          name="certificate_number"
          label="Mã số chứng chỉ"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mã số chứng chỉ!",
            },
          ]}
        >
          <Input prefix={<IdcardOutlined />} placeholder="Ví dụ: CN123456" />
        </Form.Item>

        <Form.Item
          name="specialty"
          label="Chuyên Khoa"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn chuyên khoa!",
            },
          ]}
        >
          <Select placeholder="Chọn chuyên khoa">
            {SPECIALTY_OPTIONS.map((specialty) => (
              <Option key={specialty} value={specialty}>
                {specialty}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu!",
            },
            {
              min: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự!",
            },
          ]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu (Tối thiểu 6 ký tự)" />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Xác nhận Mật khẩu"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Vui lòng xác nhận mật khẩu!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Hai mật khẩu bạn nhập không khớp!")
                );
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDoctorModal;