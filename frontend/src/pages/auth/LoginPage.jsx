import React, { useState } from 'react';
import { Button, Form, Input, Typography, Divider, Space, message } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined, FacebookFilled, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
// Đã xóa: import '../../styles/tailwind.css'; // Dòng này gây lỗi

const { Title, Text } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        setLoading(true);
        console.log('Thông tin đăng nhập:', values);
        
        setTimeout(() => {
            setLoading(false);
            // Logic xác thực demo
            if (values.email === 'admin@demo.com' && values.password === '123456') {
                message.success('Đăng nhập thành công!');
                // Chuyển hướng đến Dashboard
            } else {
                message.error('Email hoặc mật khẩu không đúng.');
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
                    Chào mừng trở lại
                </Title>
                <Text className="text-gray-500 mb-8 block">
                    Đăng nhập vào Dashboard của bạn
                </Text>

                <Form
                    form={form}
                    name="login_form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    className="mt-6"
                >
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

                    {/* Password Input */}
                    <Form.Item
                        label={<Text strong className="text-gray-700">Mật khẩu</Text>}
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        className="text-left mb-2"
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Nhập mật khẩu của bạn"
                            className="h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500"
                            iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    {/* Links: Forgot Password & Register */}
                    <div className="flex justify-between text-sm mb-6">
                        <a href="#forgot" className="text-blue-600 hover:text-blue-800 font-medium">
                            Quên mật khẩu?
                        </a>
                        <a href="#register" className="text-blue-600 hover:text-blue-800 font-medium">
                            Đăng ký
                        </a>
                    </div>
                    
                    {/* Primary Login Button */}
                    <Form.Item className="mb-4">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full h-12 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700! transition duration-150 shadow-md"
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>

                {/* OR Divider */}
                <Divider className="text-gray-500 font-medium">Hoặc</Divider>

                {/* Social Login Buttons */}
                <Space direction="vertical" className="w-full">
                    <Button
                        icon={<GoogleOutlined className="text-xl" />}
                        size="large"
                        className="w-full h-12 rounded-lg border-gray-300 text-gray-700 font-semibold text-base shadow-sm hover:border-blue-500!"
                    >
                        Đăng nhập bằng Google
                    </Button>
                    <Button
                        icon={<FacebookFilled className="text-xl text-blue-600" />}
                        size="large"
                        className="w-full h-12 rounded-lg border-gray-300 text-gray-700 font-semibold text-base shadow-sm hover:border-blue-500!"
                    >
                        Đăng nhập bằng Facebook
                    </Button>
                </Space>
            </div>
        </div>
    );
};

export default LoginPage;