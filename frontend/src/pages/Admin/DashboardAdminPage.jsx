    import { Card, Typography, Row, Col, Spin } from 'antd';
    import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
    import React, { useState, useEffect } from 'react';
    import adminApi from '../../api/adminApi';

    const { Title, Text } = Typography;

    const DashboardPage = () => {
        const [loading, setLoading] = useState(true);
        const [statistics, setStatistics] = useState({
            totalUsers: 0,
            totalDoctors: 0,
            totalPatients: 0
        });

        useEffect(() => {
            fetchDashboardData();
        }, []);

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await adminApi.getDashboardStatistics();
                const data = response.result || response.data || response;
                setStatistics({
                    totalUsers: data.totalUsers || 0,
                    totalDoctors: data.totalDoctors || 0,
                    totalPatients: data.totalPatients || 0
                });
            } catch (error) {
                console.error('Failed to fetch dashboard statistics:', error);
            } finally {
                setLoading(false);
            }
        };
        
        // Data for the bar chart (Website Views)
        const barData = [
            { name: 'T2', views: 50 },
            { name: 'T3', views: 20 },
            { name: 'T4', views: 10 },
            { name: 'T5', views: 22 },
            { name: 'T6', views: 60 },
            { name: 'T7', views: 40 },
        ];

        // Data for the line chart (Monthly Website Feedback)
        const feedbackData = [
            { name: 'T1', feedback: 120 },
            { name: 'T3', feedback: 180 },
            { name: 'T5', feedback: 220 },
            { name: 'T7', feedback: 280 },
            { name: 'T9', feedback: 350 },
            { name: 'T11', feedback: 420 },
        ];

        if (loading) {
            return (
                <div className="p-6 flex justify-center items-center h-screen">
                    <Spin size="large" />
                </div>
            );
        }

        return (
            <div className="p-6">
                <Row gutter={[16, 16]}>
                    
                    {/* KPI CARD 1: Total Users */}
                    <Col xs={24} sm={12} md={6}>
                        <Card className="shadow-md">
                            <Title level={4}>Tổng người dùng</Title>
                            <Title level={2} className="text-blue-600">{statistics.totalUsers}</Title>
                            <Text type="secondary">Tất cả người dùng trong hệ thống</Text>
                        </Card>
                    </Col>
                    
                    {/* KPI CARD 2: Total Doctors */}
                    <Col xs={24} sm={12} md={6}>
                        <Card className="shadow-md">
                            <Title level={4}>Tổng bác sĩ</Title>
                            <Title level={2} className="text-green-600">{statistics.totalDoctors}</Title>
                            <Text type="secondary">Bác sĩ đang hoạt động</Text>
                        </Card>
                    </Col>
                    
                    {/* KPI CARD 3: Total Patients */}
                    <Col xs={24} sm={12} md={6}>
                        <Card className="shadow-md">
                            <Title level={4}>Tổng bệnh nhân</Title>
                            <Title level={2} className="text-purple-600">{statistics.totalPatients}</Title>
                            <Text type="secondary">Người dùng thường</Text>
                        </Card>
                    </Col>
                    
                    {/* KPI CARD 4: Growth Rate */}
                    <Col xs={24} sm={12} md={6}>
                        <Card className="shadow-md">
                            <Title level={4}>Tỷ lệ tăng trưởng</Title>
                            <Title level={2} className="text-orange-600">
                                {statistics.totalUsers > 0 ? ((statistics.totalPatients / statistics.totalUsers) * 100).toFixed(1) : 0}%
                            </Title>
                            <Text type="secondary">Bệnh nhân / Tổng người dùng</Text>
                        </Card>
                    </Col>
                    
                    {/* CHART 1: Website Views (Bar Chart) */}
                    <Col xs={24} sm={12}>
                        <Card className="shadow-md">
                            <Title level={4}>Website Views</Title>
                            <Text type="secondary">Last Campaign Performance</Text>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="views" fill="#3498db" />
                                </BarChart>
                            </ResponsiveContainer>
                            <Text type="secondary" style={{ marginTop: '8px', display: 'block' }}>
                                Campaign sent 2 days ago
                            </Text>
                        </Card>
                    </Col>
                    
                    {/* CHART 2: Website Feedback (Line Chart) */}
                    <Col xs={24} sm={12}>
                        <Card className="shadow-md">
                            <Title level={4}>Website Feedback</Title>
                            <Text type="success">(+15%) increase in feedback this month</Text>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={feedbackData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="feedback" stroke="#FF6347" fill="rgba(255, 99, 71, 0.2)" />
                                </LineChart>
                            </ResponsiveContainer>
                            <Text type="secondary" style={{ marginTop: '8px', display: 'block' }}>
                                Updated 4 min ago
                            </Text>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    };

    export default DashboardPage;