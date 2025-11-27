import React from 'react';
import { Modal, Form, Input, Button, Space, Typography } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, CloseOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AddUserModal = ({ open, onCancel, onFinish }) => {
    const [form] = Form.useForm();

    const handleFormSubmit = (values) => {
        // Gọi hàm xử lý thêm tài khoản từ component cha
        onFinish(values);
        
        // Đóng modal và reset form
        form.resetFields();
    };

    const handleCancelClick = () => {
        form.resetFields(); // Reset form khi hủy
        onCancel(); // Gọi hàm đóng Modal từ cha
    }

    return (
        <Modal
            title={<Title level={4} className="m-0">Thêm Tài khoản Mới</Title>}
            open={open}
            onCancel={handleCancelClick}
            footer={null} 
            closable={true}
            width={450}
            maskClosable={true}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
                className="mt-4"
            >
                {/* Tên người dùng */}
                <Form.Item
                    name="name"
                    label="Tên người dùng"
                    rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                >
                    <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Ví dụ: Nguyễn Văn K" />
                </Form.Item>

                {/* Email */}
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                >
                    <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="ví dụ: ten@email.com" />
                </Form.Item>

                {/* Số điện thoại */}
                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                        { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10-11 chữ số!' }
                    ]}
                >
                    <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="Ví dụ: 0909222333" />
                </Form.Item>

                {/* Mật khẩu */}
                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự.' }
                    ]}
                    hasFeedback
                >
                    <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Tạo mật khẩu" />
                </Form.Item>

                {/* Xác nhận Mật khẩu */}
                <Form.Item
                    name="confirm"
                    label="Xác nhận mật khẩu"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Nhập lại mật khẩu" />
                </Form.Item>

                {/* Footer (Actions) */}
                <Form.Item className="mb-0">
                    <Space className="w-full justify-end mt-4">
                        <Button onClick={handleCancelClick} icon={<CloseOutlined />}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" className="bg-blue-600">
                            Thêm Tài khoản
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddUserModal;