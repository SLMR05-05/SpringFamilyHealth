// FamilyManagementList.jsx - Kết nối backend API

import React, { useState, useEffect } from "react";
import { Typography, Card, Row, Col, Tag, Button, Spin, message } from "antd";
import {
    HomeOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useOutletContext } from "react-router-dom";
import doctorApi from "../../api/doctorApi";

const { Text, Title } = Typography;

const FamilyManagementList = () => {
    const { handleSelectFamily } = useOutletContext();
    const [familyData, setFamilyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [memberCounts, setMemberCounts] = useState({});

    // Fetch dữ liệu gia đình khi component mount
    useEffect(() => {
        const fetchFamilies = async () => {
            try {
                setLoading(true);
                
                // Lấy thông tin doctor từ localStorage
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.userId) {
                    message.error('Không tìm thấy thông tin bác sĩ');
                    return;
                }

                // Gọi API để lấy danh sách gia đình
                const response = await doctorApi.getFamilies(user.userId);
                const families = response?.data || response || [];

                // Lấy tất cả members do bác sĩ quản lý bằng một lần gọi API
                const patientsResp = await doctorApi.getPatients(user.userId);
                const patients = patientsResp?.data || patientsResp || [];

                // Tính số lượng thành viên cho mỗi familyId từ danh sách patients
                const countsMap = {};
                patients.forEach((m) => {
                    const fid = m.familyId;
                    if (fid == null) return;
                    countsMap[fid] = (countsMap[fid] || 0) + 1;
                });

                setFamilyData(families);
                setMemberCounts(countsMap);
            } catch (error) {
                console.error('Lỗi khi tải danh sách gia đình:', error);
                message.error('Không thể tải danh sách gia đình');
            } finally {
                setLoading(false);
            }
        };

        fetchFamilies();
    }, []);

    // Hàm xử lý khi chọn gia đình
    const handleViewRecords = (family) => {
        handleSelectFamily(family);
    };
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" tip="Đang tải danh sách gia đình..." />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <Card>
                <Title level={4}>Chọn gia đình để quản lý</Title>
                <Text type="secondary" className="block mb-6">
                    Bạn đang quản lý {familyData.length} gia đình
                </Text>

                {familyData.length === 0 ? (
                    <div className="text-center py-8">
                        <Text type="secondary">Không có gia đình nào được quản lý</Text>
                    </div>
                ) : (
                    <Row gutter={[24, 24]}>
                        {familyData.map((family) => (
                            <Col xs={24} md={12} key={family.familyId}>
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
                                                        Gia đình #{family.familyId}
                                                    </Text>
                                                    <Text type="secondary" className="text-sm">
                                                        <UserOutlined className="mr-1" />
                                                        {memberCounts[family.familyId] || 0} thành viên
                                                    </Text>
                                                </div>
                                            </div>
                                            <Tag color="green">Đang hoạt động</Tag>
                                        </div>

                                        {/* Thông tin liên hệ */}
                                        <div className="space-y-2 mb-4 text-sm text-gray-700">
                                            <div className="flex items-center space-x-2">
                                                <EnvironmentOutlined className="text-base text-gray-500" />
                                                <Text>{family.address || 'Chưa cập nhật'}</Text>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <PhoneOutlined className="text-base text-gray-500" />
                                                <Text>{family.contactNumber || 'Chưa cập nhật'}</Text>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer: Bác sĩ phụ trách & Nút Hành động */}
                                    <div className="p-5 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                                        <Text type="secondary" className="text-sm">
                                            BS: {family.doctorName || 'Chưa phân công'}
                                        </Text>
                                        <Button
                                            style={{background:'#000', color:'#fff'}}
                                            className="bg-black text-white hover:bg-gray-800 hover:text-white border-none"
                                            onClick={() => handleViewRecords(family)}
                                        >
                                            Xem bệnh nhân
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Card>
        </div>
    );
};

export default FamilyManagementList;