import React, { useState } from 'react';
import { Button, Form, Input, Typography, message, Row, Col, Card } from 'antd'; // Giữ lại Row, Col dù không dùng
import { MailOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons'; // Import các icons cần thiết

const { Title, Text } = Typography;

const ForgotPasswordPage = () => { // Đổi tên component nội bộ thành ForgotPasswordPage
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        setLoading(true);
        console.log('Yêu cầu khôi phục mật khẩu cho email:', values.email);
        
        setTimeout(() => {
            setLoading(false);
            // Logic gửi email khôi phục demo
            message.success(`Đã gửi liên kết khôi phục đến ${values.email}. Vui lòng kiểm tra email của bạn.`);
        }, 2000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
            <div className="w-full max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
                
                {/* Logo Area */}
                <div className="mb-8">
                    {/* Biểu tượng Dấu cộng (thường dùng cho các hành động khôi phục/tạo mới) */}
                    <div className="inline-block p-4 rounded-full bg-blue-100 text-blue-600 border border-blue-400">
                        <PlusOutlined style={{ fontSize: '24px' }} />
                    </div>
                </div>

                {/* Header Text */}
                <Title level={3} className="text-2xl font-bold mb-2 text-gray-800">
                    Khôi phục mật khẩu của bạn
                </Title>
                <Text className="text-gray-500 mb-8 block px-6">
                    Đừng lo lắng. Vui lòng nhập địa chỉ email đã đăng ký của bạn. Chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
                </Text>

                <Form
                    form={form}
                    name="forgot_password_form"
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
                            placeholder="your.email@company.com" 
                            className="h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500"
                        />
                    </Form.Item>

                    
                    {/* Primary Button: Send Reset Link */}
                    <Form.Item className="mb-4 mt-6">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full h-12 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700! transition duration-150 shadow-md"
                        >
                            Gửi Liên Kết Khôi Phục
                        </Button>
                    </Form.Item>
                </Form>

                {/* Link: Back to Login */}
                <a href="#login" className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center mt-4">
                    <ArrowLeftOutlined className="mr-1" /> Quay lại trang Đăng nhập
                </a>
                
            </div>
        </div>
    );
};

export default ForgotPasswordPage;