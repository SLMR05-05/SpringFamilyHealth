import { Col, Row } from 'antd';
import { Outlet } from 'react-router-dom';
import React from 'react';

const AuthLayout = () => {
    return (
        // Khung nền chính: Đảm bảo màn hình chiếm toàn bộ viewport và căn giữa
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
            <Row justify="center" className="w-full">
                {/* Col chứa nội dung xác thực. Giới hạn chiều rộng tối đa (max-w-md tương đương ~448px) */}
                <Col 
                    xs={24} 
                    sm={16} 
                    md={12} 
                    lg={8}  
                    xl={6}  
                    className="max-w-md"
                >
                    {/* Outlet sẽ render component con (Login, Register, ForgotPassword) */}
                    <Outlet /> 
                </Col>
            </Row>
        </div>
    );
}

export default AuthLayout;