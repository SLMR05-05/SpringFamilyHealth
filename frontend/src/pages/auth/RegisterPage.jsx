import React, { useState } from 'react';
import { Button, Form, Input, Typography, Divider, Space, message, Row, Col } from 'antd'; // Import Row, Col
import { MailOutlined, LockOutlined, UserOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
// Đã xóa: import '../../styles/tailwind.css'; // Dòng này gây lỗi

const { Title, Text } = Typography;

const RegisterPage = () => { // Đổi tên component nội bộ thành RegisterPage
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        setLoading(true);
        console.log('Thông tin đăng ký:', values);
        
        setTimeout(() => {
            setLoading(false);
            // Logic đăng ký demo
            if (values.password === values.confirmPassword) {
                message.success('Tạo tài khoản thành công! Đang chuyển hướng...');
                // Logic chuyển hướng người dùng
            } else {
                message.error('Mật khẩu và xác nhận mật khẩu không khớp.');
            }
        }, 1500);
    };

    return (
        <div className="flex items-center justify-center h-full bg-gray-100 p-4 font-sans">
            <div className="w-full max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
                
                {/* Logo Area */}
                <div className="mb-8">
                    {/* Giả lập Logo/Biểu tượng */}
                    <div className="inline-block p-3 rounded-full bg-blue-50 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                {/* Header Text */}
                <Title level={2} className="text-3xl font-bold mb-2 text-gray-800">
                    Tạo tài khoản
                </Title>
                <Text className="text-gray-500 mb-8 block">
                    Bắt đầu quản lý phòng khám của bạn
                </Text>

                <Form
                    form={form}
                    name="register_form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    className="mt-6"
                >
                    {/* Tên và Họ Input */}
                    <Row gutter={16}>
                        <Col span={12} className="text-left">
                            <Form.Item
                                label={<Text strong className="text-gray-700">Tên</Text>}
                                name="firstName"
                                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                            >
                                <Input 
                                    prefix={<UserOutlined className="text-gray-400" />} 
                                    placeholder="Nhập tên của bạn" 
                                    className="h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12} className="text-left">
                            <Form.Item
                                label={<Text strong className="text-gray-700">Họ</Text>}
                                name="lastName"
                                rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                            >
                                <Input 
                                    placeholder="Nhập họ của bạn" 
                                    className="h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    {/* Email Input */}
                    <Form.Item
                        label={<Text strong className="text-gray-700">Địa chỉ Email</Text>}
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                        className="text-left"
                    >
                        <Input 
                            prefix={<MailOutlined className="text-gray-400" />} 
                            placeholder="Nhập địa chỉ email của bạn" 
                            className="h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500"
                        />
                    </Form.Item>

                    {/* Mật khẩu Input */}
                    <Form.Item
                        label={<Text strong className="text-gray-700">Mật khẩu</Text>}
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }, { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự.' }]}
                        className="text-left"
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Nhập mật khẩu của bạn"
                            className="h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500"
                            iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    {/* Xác nhận Mật khẩu Input */}
                    <Form.Item
                        label={<Text strong className="text-gray-700">Xác nhận mật khẩu</Text>}
                        name="confirmPassword"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận lại mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                        className="text-left mb-2"
                    >
                        <Input.Password
                            placeholder="Xác nhận lại mật khẩu của bạn"
                            className="h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500"
                            iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>


                    {/* Primary Register Button */}
                    <Form.Item className="mb-4 mt-8">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full h-12 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700! transition duration-150 shadow-md"
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>

                {/* Links: Forgot Password & Login */}
                <div className="flex justify-between text-sm mb-6">
                    <a href="#forgot" className="text-blue-600 hover:text-blue-800 font-medium">
                        Quên mật khẩu?
                    </a>
                    <a href="#login" className="text-blue-600 hover:text-blue-800 font-medium">
                        Đăng nhập
                    </a>
                </div>
                
                {/* ⭐️ XÓA PHẦN SOCIAL LOGIN ⭐️ */}
                
            </div>
        </div>
    );
};

export default RegisterPage;