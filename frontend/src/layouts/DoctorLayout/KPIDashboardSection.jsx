import React from 'react';
import { Card, Typography, Space, Row, Col } from 'antd';
import { UserOutlined, CalendarOutlined, HeartOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Dữ liệu mẫu (Mô phỏng state từ backend)
const KPI_DATA = [
    {
        title: "Bệnh nhân",
        count: 3,
        subtext: "3 đang theo dõi",
        icon: UserOutlined,
        iconLabel: "patient",
    },
    {
        title: "Cuộc hẹn hôm nay",
        count: 3,
        subtext: "1 đã hoàn thành",
        icon: CalendarOutlined,
        iconLabel: "today",
    },
    
];

const KPICard = ({ title, count, subtext, Icon, iconLabel }) => {
    // Tùy chỉnh màu sắc dựa trên nội dung/trạng thái (ví dụ: đỏ cho ưu tiên cao)
    const countColor = iconLabel === 'priority' && count > 0 ? 'text-red-500' : 'text-gray-900';
    
    return (
        <Card className="rounded-xl shadow-lg border border-gray-100 transition-shadow hover:shadow-xl h-full">
            <div className="flex justify-between items-start mb-4">
                <Text className="text-lg font-semibold text-gray-700">
                    {title}
                </Text>
                {/* Icon ở góc phải trên */}
                <Icon className="text-xl text-gray-400" /> 
            </div>

            <Title level={1} className={`text-4xl font-bold m-0 ${countColor}`}>
                {count}
            </Title>
            <Text className="text-gray-500 text-sm mt-1 block">
                {subtext}
            </Text>
        </Card>
    );
};


const KPIDashboardSection = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
            <Row gutter={[24, 24]}>
                {KPI_DATA.map((kpi, index) => (
                    <Col 
                        key={index} 
                        xs={24} // 100% width on extra small screens
                        sm={12} // 50% width on small screens
                        lg={6}  // 25% width on large screens
                    >
                        <KPICard {...kpi} Icon={kpi.icon} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default KPIDashboardSection;