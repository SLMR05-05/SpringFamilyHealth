    import { Card, Typography, Row, Col } from 'antd';
    import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
    import React from 'react'; // Giữ lại React

    const { Title, Text } = Typography;

    const DashboardPage = () => { // ⭐️ Đã đổi tên thành DashboardPage
        
        // ⭐️ DỮ LIỆU TĨNH THAY THẾ CHO API HOOKS ⭐️
        const todayUsersCount = 12; // Giá trị giả định
        const todayContactsCount = 5; // Giá trị giả định
        
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

        return (
            <div className="p-6">
                <Row gutter={[16, 16]}>
                    
                    {/* KPI CARD 1: Today Users - Dữ liệu tĩnh */}
                    <Col xs={24} sm={12} md={6}>
                        <Card className="shadow-md">
                            <Title level={4}>Người dùng mới</Title>
                            <Title level={2} className="text-green-600">+{todayUsersCount}</Title>
                            <Text type="secondary">Just updated</Text>
                        </Card>
                    </Col>
                    
                    {/* KPI CARD 2: Today Contacts - Dữ liệu tĩnh */}
                    <Col xs={24} sm={12} md={6}>
                        <Card className="shadow-md">
                            <Title level={4}>Bác sĩ mới</Title>
                            <Title level={2} className="text-green-600">+{todayContactsCount}</Title>
                            <Text type="secondary">Just updated</Text>
                        </Card>
                    </Col>
                    
                    {/* KPI CARD 3: Followers */}
                    <Col xs={24} sm={12} md={6}>
                        <Card className="shadow-md">
                            <Title level={4}>Lượt khám hôm nay</Title>
                            <Title level={2}>2,300</Title>
                            <Text type="success">+3% than last month</Text>
                        </Card>
                    </Col>
                    
                    {/* KPI CARD 4: Bookings */}
                    <Col xs={24} sm={12} md={6}>
                        <Card className="shadow-md">
                            <Title level={4}>Lượt khám tuần này</Title>
                            <Title level={2}>281</Title>
                            <Text type="success">+55% than last week</Text>
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