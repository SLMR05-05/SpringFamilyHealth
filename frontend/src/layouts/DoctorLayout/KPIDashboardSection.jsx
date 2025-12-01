import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Spin, Empty } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import familyApi from '../../api/familyApi';

const { Title, Text } = Typography;

const KPICard = ({ title, count, subtext, Icon }) => {
    return (
        <Card className="rounded-xl shadow-lg border border-gray-100 transition-shadow hover:shadow-xl h-full">
            <div className="flex justify-between items-start mb-4">
                <Text className="text-lg font-semibold text-gray-700">{title}</Text>
                <Icon className="text-xl text-gray-400" />
            </div>

            <Title level={1} className={`text-4xl font-bold m-0 text-gray-900`}>
                {count}
            </Title>
            <Text className="text-gray-500 text-sm mt-1 block">{subtext}</Text>
        </Card>
    );
};

const KPIDashboardSection = ({ selectedFamily }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!selectedFamily) {
            setData(null);
            return;
        }

        let mounted = true;
        setLoading(true);
        setError(null);
        familyApi.getDashboard(selectedFamily.familyId)
            .then((resp) => {
                if (!mounted) return;
                // axiosClient may return either the full response object or the unwrapped data.
                const response = resp?.data ?? resp;
                setData(response);
            })
            .catch((err) => {
                console.error('Failed to load family dashboard', err);
                if (!mounted) return;
                setError(err?.message || 'Load failed');
            })
            .finally(() => mounted && setLoading(false));

        return () => { mounted = false; };
    }, [selectedFamily]);

    if (!selectedFamily) return null;

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
                <Spin />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
                <div className="text-red-600">Lỗi tải KPI: {error}</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
                <Empty description="Chưa có dữ liệu KPI" />
            </div>
        );
    }

    // Map expected fields from backend FamilyDashboardResponse
    const stats = data.statistics || {};

    // Chỉ hiển thị 2 KPI theo yêu cầu: số bệnh nhân và số lịch hẹn sắp tới (dùng trường upcomingAppointments từ backend)
    const cards = [
        {
            title: 'Bệnh nhân',
            count: stats.totalMembers ?? 0,
            subtext: `${stats.totalMembers ?? 0} đang theo dõi`,
            Icon: UserOutlined,
        },
        {
            title: 'Lịch hẹn trong tuần',
            count: stats.upcomingAppointments ?? 0,
            subtext: `${stats.upcomingAppointments ?? 0} lịch hẹn`,
            Icon: CalendarOutlined,
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
            <Row gutter={[24, 24]}>
                {cards.map((kpi, index) => (
                    <Col key={index} xs={24} sm={12} lg={6}>
                        <KPICard {...kpi} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default KPIDashboardSection;