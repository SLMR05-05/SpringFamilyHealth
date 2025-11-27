    import React, { useState, useEffect } from 'react';
    import { Modal, Button, Typography, Space, Divider, Form, Input, Select, message } from 'antd';
    import { CloseOutlined, UserOutlined, MailOutlined, LockOutlined, SaveOutlined, PhoneOutlined } from '@ant-design/icons';

    const { Title, Text } = Typography;
    const { Option } = Select;

    // Component chính
    const UserDetailModal = ({ isVisible, onClose, user, onSave }) => {
        const [form] = Form.useForm();
        const [loading, setLoading] = useState(false);
        
        // Đảm bảo user có dữ liệu mặc định và email không bị mất
        const userData = user || {};

        // Cập nhật form khi user thay đổi; clear password fields when switching
        useEffect(() => {
            if (isVisible && user) {
                form.setFieldsValue({
                    name: user.name,
                    email: user.email,
                    phone: user.phone || "",
                    role: user.role || "USER",
                    status: user.status || 'Kích hoạt',
                    newPassword: '',
                    confirmPassword: '',
                });
            }

            // When modal is closed, reset all fields to avoid stale values
            if (!isVisible) {
                form.resetFields();
            }
        }, [isVisible, user, form]);

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
                    phone: values.phone || "",
                    role: values.role || "USER",
                    locked: values.status === 'Khóa',
                    passwordHash: userData.passwordHash || "unchanged",
                    // Chỉ gửi mật khẩu nếu nó được điền
                    newPassword: values.newPassword || undefined, 
                };
                
                // 3. Gọi hàm onSave từ component cha
                await onSave(userData.key, changes); 

                message.success(`Cập nhật tài khoản ${userData.name} thành công!`);
                onClose();

            // eslint-disable-next-line no-unused-vars
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
            phone: userData.phone || "",
            role: userData.role || "USER",
            status: userData.status || 'Kích hoạt',
        };

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
                    <div className="mb-4">
                        <Text type="secondary" className="block">
                            ID hệ thống: {userData.key || 'N/A'}
                        </Text>
                        {userData.createdAt && (
                            <Text type="secondary" className="block text-xs mt-1">
                                Ngày tạo: {new Date(userData.createdAt).toLocaleString('vi-VN')}
                            </Text>
                        )}
                    </div>

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

                    {/* Số điện thoại */}
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10-11 chữ số!' }]}
                    >
                        <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="Ví dụ: 0909222333" />
                    </Form.Item>

                    {/* Role (Select) */}
                    <Form.Item
                        name="role"
                        label="Vai trò"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                        <Select placeholder="Chọn vai trò">
                            <Option value="USER">Người dùng</Option>
                            <Option value="ADMIN">Quản trị viên</Option>
                            <Option value="DOCTOR">Bác sĩ</Option>
                        </Select>
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

                    {/* Mật khẩu mới (để trống nếu không muốn thay đổi) */}
                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự.' }
                        ]}
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