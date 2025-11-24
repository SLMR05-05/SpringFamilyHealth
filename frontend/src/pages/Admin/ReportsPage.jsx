import { Card, Typography, Row, Col, Button, Space } from 'antd';
import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

// Component Thẻ KPI
const AnalyticsKPI = ({ title, value, comparison, valueColor, comparisonColor }) => {
  return (
    <Card className="shadow-md h-full border-none">
      <Text className="text-gray-500 text-sm font-semibold uppercase block">{title}</Text>
      <Title level={2} className={`m-0 font-extrabold mt-1 ${valueColor}`}>{value}</Title>
      <Text className={`text-xs font-medium ${comparisonColor} flex items-center mt-1`}>
        {comparison}
      </Text>
    </Card>
  );
};

// Dữ liệu giả định cho biểu đồ
const chartData = {
    // Dữ liệu cho Biểu đồ Đường (Lượt khám)
    examinations: [
        { name: 'T1', Lượt_khám: 400, Số_bác_sĩ: 50 },
        { name: 'T2', Lượt_khám: 450, Số_bác_sĩ: 55 },
        { name: 'T3', Lượt_khám: 380, Số_bác_sĩ: 58 },
        { name: 'T4', Lượt_khám: 500, Số_bác_sĩ: 60 },
        { name: 'T5', Lượt_khám: 520, Số_bác_sĩ: 62 },
    ],
    // Dữ liệu cho Biểu đồ Cột (Người dùng & Bác sĩ)
    userDoctorData: [
        { name: 'T1', Người_dùng: 100, Bác_sĩ: 10 },
        { name: 'T2', Người_dùng: 120, Bác_sĩ: 12 },
        { name: 'T3', Người_dùng: 150, Bác_sĩ: 15 },
        { name: 'T4', Người_dùng: 180, Bác_sĩ: 18 },
        { name: 'T5', Người_dùng: 200, Bác_sĩ: 20 },
    ]
};


const AnalyticsPage = () => {
    // State quản lý chế độ xem (Tuần/Tháng/Năm)
    const [timeRange, setTimeRange] = useState("Tháng này"); 

    // Dữ liệu cho các thẻ KPI (Tái tạo từ ảnh)
    const kpiData = [
        { title: "Tổng số người dùng", value: "1,234", comparison: "+2.5% so với tháng trước", valueColor: "text-green-600", comparisonColor: "text-green-600" },
        { title: "Tổng số bác sĩ", value: "56", comparison: "+1.2% so với tháng trước", valueColor: "text-green-600", comparisonColor: "text-green-600" },
        { title: "Tổng lượt khám", value: "4,567", comparison: "+5.8% so với tháng trước", valueColor: "text-green-600", comparisonColor: "text-green-600" },
    ];

    return (
        <div className="p-6 bg-gray-50 h-full">
            
            {/* ⭐️ HEADER VÀ ĐIỀU HƯỚNG THỜI GIAN ⭐️ */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title level={2} className="m-0 font-bold">Báo cáo & Phân tích</Title>
                    <Text type="secondary">Xem các thống kê và xu hướng hoạt động của phòng khám.</Text>
                </div>
                <Space>
                    <Button type={timeRange === 'Tuần này' ? 'primary' : 'default'} onClick={() => setTimeRange('Tuần này')}>Tuần này</Button>
                    <Button type={timeRange === 'Tháng này' ? 'primary' : 'default'} onClick={() => setTimeRange('Tháng này')} className={timeRange === 'Tháng này' ? 'bg-blue-600' : ''}>Tháng này</Button>
                    <Button type={timeRange === 'Năm nay' ? 'primary' : 'default'} onClick={() => setTimeRange('Năm nay')}>Năm nay</Button>
                    <Button type={timeRange === 'Tùy chỉnh' ? 'primary' : 'default'} onClick={() => setTimeRange('Tùy chỉnh')}>Tùy chỉnh</Button>
                </Space>
            </div>

            <Row gutter={[24, 24]}>
                
                {/* ⭐️ PHẦN 1: THẺ KPI ⭐️ */}
                {kpiData.map((kpi, index) => (
                    <Col xs={24} md={8} key={index}>
                        <AnalyticsKPI {...kpi} />
                    </Col>
                ))}
                
                {/* ------------------------------------------- */}
                {/* ⭐️ PHẦN 2: BIỂU ĐỒ ⭐️ */}
                {/* ------------------------------------------- */}
                
                {/* CHART A: SỐ LƯỢT KHÁM THEO THỜI GIAN (Area/Line Chart) */}
                <Col xs={24} lg={12}>
                    <Card className="shadow-lg border-none h-96">
                        <Title level={4} className="m-0 mb-4">Số lượt khám theo thời gian</Title>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={chartData.examinations} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Legend wrapperStyle={{ paddingTop: 10 }} />
                                {/* Đường lượt khám (Màu Xanh đậm) */}
                                <Area type="monotone" dataKey="Lượt_khám" stroke="#1890ff" fill="#1890ff" fillOpacity={0.3} />
                                {/* Đường số bác sĩ (Màu Xanh nhạt/Phụ) */}
                                <Area type="monotone" dataKey="Số_bác_sĩ" stroke="#5cdbd3" fill="#5cdbd3" fillOpacity={0.3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                
                {/* CHART B: SỐ NGƯỜI DÙNG VÀ BÁC SĨ THEO THỜI GIAN (Bar Chart) */}
                <Col xs={24} lg={12}>
                    <Card className="shadow-lg border-none h-96">
                        <Title level={4} className="m-0 mb-4">Số người dùng và bác sĩ theo thời gian</Title>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData.userDoctorData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Legend wrapperStyle={{ paddingTop: 10 }} />
                                <Bar dataKey="Người_dùng" fill="#1890ff" radius={[10, 10, 0, 0]} />
                                <Bar dataKey="Bác_sĩ" fill="#faad14" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                

            </Row>
        </div>
    );
};

export default AnalyticsPage;