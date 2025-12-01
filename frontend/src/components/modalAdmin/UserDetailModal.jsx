    import React, { useState, useEffect } from 'react';
    import { Modal, Button, Typography, Space, Divider, Form, Input, Select, message } from 'antd';
    import { CloseOutlined, UserOutlined, MailOutlined, LockOutlined, SaveOutlined } from '@ant-design/icons';

    const { Title, Text } = Typography;
    const { Option } = Select;

    // Component chính
    const UserDetailModal = ({ isVisible, onClose, user, onSave }) => {
        const [form] = Form.useForm();
        const [loading, setLoading] = useState(false);
        
        // Đảm bảo user có dữ liệu mặc định và email không bị mất
        const userData = user || {};

        const handleFormSubmit = async (values) => {
            try {
                setLoading(true);
                
                // 1. Kiểm tra mật khẩu xác nhận
                if (values.newPassword && values.newPassword !== values.confirmPassword) {
                    message.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
                    setLoading(false);
                    return;
                }

                // 2. Chuẩn bị dữ liệu gửi đi (chỉ gửi những trường được thay đổi)
                const changes = {
                    name: values.name,
                    email: values.email,
                    status: values.status,
                    // Chỉ gửi mật khẩu nếu nó được điền
                    newPassword: values.newPassword || undefined, 
                };
                
                // 3. Gọi hàm onSave từ component cha
                await onSave(userData.key, changes); 

                message.success(`Cập nhật tài khoản ${userData.name} thành công!`);
                onClose();

            } catch (error) {
                message.error("Có lỗi xảy ra khi lưu thay đổi.");
            } finally {
                setLoading(false);
            }
        };
        
        // Khởi tạo giá trị ban đầu cho form (chạy mỗi khi modal mở)
        const initialValues = {
            name: userData.name,
            email: userData.email,
            status: userData.status || 'Kích hoạt',
        };

        // Ensure form fields update whenever the `user` prop or visibility changes.
        useEffect(() => {
            if (isVisible) {
                // Reset then set values to ensure the form shows latest user data
                form.resetFields();
                form.setFieldsValue(initialValues);
            } else {
                // When modal is closed, reset the form to clear previous values
                form.resetFields();
            }
        }, [user, isVisible]);

        return (
            <Modal
                title={<Title level={4} className="m-0">Thông tin & Cập nhật Tài khoản</Title>}
                open={isVisible}
                onCancel={onClose}
                footer={null} // Tùy chỉnh footer bên trong Form.Item
                closeIcon={<CloseOutlined className="text-gray-500" />}
                width={500}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    initialValues={initialValues}
                    className="mt-4"
                >
                    {/* ID TÀI KHOẢN */}
                    <Text type="secondary" className="block mb-4">
                        ID hệ thống: {userData.key || 'N/A'}
                    </Text>

                    {/* Tên người dùng */}
                    <Form.Item
                        name="name"
                        label="Tên tài khoản"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input prefix={<UserOutlined className="text-gray-400" />} />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                    >
                        <Input prefix={<MailOutlined className="text-gray-400" />} />
                    </Form.Item>
                    
                    {/* Trạng thái (Select) */}
                    <Form.Item
                        name="status"
                        label="Trạng thái tài khoản"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Option value="Kích hoạt">Kích hoạt</Option>
                            <Option value="Khóa">Khóa</Option>
                        </Select>
                    </Form.Item>

                    <Divider className="my-3" />
                    <Title level={5} className="mt-0 mb-4">Thay đổi Mật khẩu</Title>

                    {/* Mật khẩu mới */}
                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[{ min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự.' }]}
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

                    {/* Footer (Actions) */}
                    <Form.Item className="mb-0">
                        <Space className="w-full justify-end mt-4">
                            <Button onClick={onClose} disabled={loading}>
                                Hủy
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

    export default UserDetailModal;