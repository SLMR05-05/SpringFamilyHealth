// PatientListItem.jsx (Đã cập nhật)

import React from 'react';
import { Tag, Button, Typography } from 'antd';
import { HeartOutlined, ClockCircleOutlined,MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

// Thêm prop onViewRecord
const PatientListItem = ({ patient, onViewRecord }) => {
    // Định nghĩa màu sắc cho ưu tiên và vai trò
    const priorityColor = {
        'Trung bình': 'orange',
        'Thấp': 'green',
        'Cao': 'red',
    }[patient.priority] || 'default';

    const roleColor = {
        'Chủ hộ': 'blue',
        'Chồng': 'magenta',
        'Con trai': 'cyan',
    }[patient.role] || 'default';
    
    // Class cho nút chính
    const buttonClass = "bg-black text-white hover:bg-gray-700 border-none font-semibold shadow-md"; // Sử dụng bg-black thay vì bg-gray-900 để đảm bảo màu đen

    return (
        <div className="flex justify-between items-center p-4 my-3 bg-white rounded-lg shadow-sm border border-gray-100">
            
            {/* Cột 1: Thông tin Chi tiết */}
            <div className="flex items-start space-x-4 grow">
                <HeartOutlined className="text-xl mt-1 text-blue-500" /> {/* Icon trái */}

                <div className="flex flex-col space-y-1">
                    {/* Tên và Vai trò */}
                    <div className="flex items-center space-x-2">
                        <Title level={4} className="m-0 text-gray-900 text-lg">
                            {patient.name}
                        </Title>
                        <Tag color={roleColor} className="font-semibold">{patient.role}</Tag>
                    </div>

                    {/* Thông tin Cơ bản */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <Text>{patient.age} tuổi • {patient.gender}</Text>
                        <PhoneOutlined /> <Text>{patient.phone}</Text>
                        <MailOutlined /> <Text>{patient.email}</Text>
                    </div>

                    {/* Lịch sử Khám */}
                    {/* <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <ClockCircleOutlined /> 
                        <Text>Khám cuối: {patient.lastCheckup}</Text>
                    </div> */}
                </div>
            </div>

            {/* Cột 2: Trạng thái (Ưu tiên & Theo dõi) */}
            {/* <div className="flex items-center space-x-3 mx-4">
                <Tag color={priorityColor} className="text-sm py-1 px-3 rounded-md font-semibold">
                    {patient.priority}
                </Tag>
                <Tag color="green" className="text-sm py-1 px-3 rounded-md font-semibold">
                    Đang theo dõi
                </Tag>
            </div> */}

            {/* Cột 3: Nút Hành động */}
            <div>
                <Button 
                    type="primary" 
                    // Bỏ style trực tiếp để dùng className và CSS đã định nghĩa
                    className={buttonClass}
                    // GỌI HÀM TỪ CHA VÀ TRUYỀN DỮ LIỆU BỆNH NHÂN
                    onClick={() => onViewRecord(patient)}
                >
                    Xem hồ sơ
                </Button>
            </div>
        </div>
    );
};

export default PatientListItem;