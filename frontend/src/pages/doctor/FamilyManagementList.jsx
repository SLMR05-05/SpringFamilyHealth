// FamilyManagementList.jsx (Sửa đổi logic nút Xem bệnh nhân)

import React from "react";
import { Typography, Card, Row, Col, Tag, Button } from "antd";
import {
    HomeOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useOutletContext } from "react-router-dom"; // 👈 BƯỚC 1: Import hook

const { Text, Title } = Typography;

// Dữ liệu mẫu đã được cung cấp
const familyData = [
    {
        id: 1,
        familyName: "Gia đình Nguyễn Văn An",
        memberCount: 4,
        status: "Đang hoạt động",
        address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
        phone: "0901234567",
        email: "an.nguyen@email.com",
        registrationDate: "15/1/2023",
    },
    {
        id: 2,
        familyName: "Gia đình Trần Thị Bình",
        memberCount: 3,
        status: "Đang hoạt động",
        address: "456 Đường Nguyễn Huệ, Quận 3, TP.HCM",
        phone: "0902345678",
        email: "binh.tran@email.com",
        registrationDate: "20/3/2023",
    },
    {
        id: 3,
        familyName: "Gia đình Lê Văn Cường",
        memberCount: 5,
        status: "Đang hoạt động",
        address: "789 Đường Trần Hưng Đạo, Quận 5, TP.HCM",
        phone: "0903456789",
        email: "cuong.le@email.com",
        registrationDate: "10/5/2023",
    },
];

const FamilyManagementList = () => {
    // 👈 BƯỚC 2: Lấy handleSelectFamily từ context
    // Nó được truyền từ HorizontalLayout thông qua prop `context` của Outlet
    const { handleSelectFamily } = useOutletContext(); 

    // Hàm xử lý khi chọn gia đình
    const handleViewRecords = (family) => {
        // Gọi hàm handleSelectFamily để cập nhật trạng thái trong HorizontalLayout
        handleSelectFamily(family);
        // HorizontalLayout sẽ tự động chuyển hướng (navigate) đến Dashboard
    };


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <Card>
                <Title level={4}>Chọn gia đình để quản lý</Title>
                <Text type="secondary" className="block mb-6">
                    Bạn đang quản lý {familyData.length} gia đình
                </Text>

                <Row gutter={[24, 24]}>
                    {familyData.map((family) => (
                        <Col xs={24} md={12} key={family.id}>
                            <Card
                                className="shadow-md hover:shadow-xl transition-shadow"
                                bodyStyle={{ padding: 0 }}
                            >
                                <div className="p-5">
                                    {/* Header: Tên Gia đình & Trạng thái */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center space-x-3">
                                            <HomeOutlined className="text-2xl text-blue-500" />
                                            <div>
                                                <Text strong className="text-lg block">
                                                    {family.familyName}
                                                </Text>
                                                <Text type="secondary" className="text-sm">
                                                    <UserOutlined className="mr-1" />
                                                    {family.memberCount} thành viên
                                                </Text>
                                            </div>
                                        </div>
                                        <Tag color="green">{family.status}</Tag>
                                    </div>

                                    {/* Thông tin liên hệ */}
                                    <div className="space-y-2 mb-4 text-sm text-gray-700">
                                        <div className="flex items-center space-x-2">
                                            <EnvironmentOutlined className="text-base text-gray-500" />
                                            <Text>{family.address}</Text>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <PhoneOutlined className="text-base text-gray-500" />
                                            <Text>{family.phone}</Text>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <MailOutlined className="text-base text-gray-500" />
                                            <Text>{family.email}</Text>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer: Ngày Đăng ký & Nút Hành động */}
                                <div className="p-5 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                                    <Text type="secondary" className="text-sm">
                                        Đăng ký từ:  {family.registrationDate} 
                                    </Text>
                                    <Button
                                        style={{background:'#000', color:'#fff'}}
                                        className="bg-black text-white hover:bg-gray-800 hover:text-white border-none"
                                        // 👈 BƯỚC 3: Gọi hàm xử lý và truyền đối tượng family
                                        onClick={() => handleViewRecords(family)} 
                                    >
                                        Xem bệnh nhân
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>
        </div>
    );
};

export default FamilyManagementList;