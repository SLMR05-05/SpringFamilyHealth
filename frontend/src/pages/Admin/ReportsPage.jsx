import { Card, Typography, Row, Col, Button, Space, Spin, Empty } from 'antd';
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import userApi from '../../api/userApi';
import doctorApi from '../../api/doctorApi';
import appointmentApi from '../../api/appointmentApi';
import dayjs from 'dayjs';

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

// Note: charts will be populated from DB and filtered by `timeRange` below


const AnalyticsPage = () => {
    // State quản lý chế độ xem (Tuần/Tháng/Năm)
    const [timeRange, setTimeRange] = useState("Tháng này");
    const [loading, setLoading] = useState(true);
    const [kpiData, setKpiData] = useState([]);
    const [chartData, setChartData] = useState({ examinations: [], userDoctorData: [] });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // Fetch users and doctors counts (request small page to read totalElements)
                const usersResp = await userApi.getAll(0, 1000);
                const usersPage = usersResp?.data || usersResp || {};
                const totalUsers = usersPage?.totalElements ?? usersPage?.total ?? (Array.isArray(usersPage) ? usersPage.length : 0);

                const docsResp = await doctorApi.getAll(0, 1000);
                const docsPage = docsResp?.data || docsResp || {};
                const totalDoctors = docsPage?.totalElements ?? docsPage?.total ?? (Array.isArray(docsPage) ? docsPage.length : 0);

                // No generic "getAll" for appointments. Fetch appointments by doctor and aggregate.
                const docsList = docsPage?.content || (Array.isArray(docsPage) ? docsPage : []);
                let apptsList = [];
                for (const d of docsList) {
                    const docId = d?.doctorId ?? d?.id ?? d?.userId;
                    if (!docId) continue;
                    try {
                        const resp = await appointmentApi.getByDoctorId(docId);
                        const items = resp?.data || resp || [];
                        // resp is expected to be an array of appointments
                        apptsList = apptsList.concat(Array.isArray(items) ? items : (items.content || []));
                    } catch (e) {
                        console.warn('ReportsPage: failed to load appointments for doctor', docId, e);
                    }
                }

                // Determine label buckets depending on timeRange
                const now = dayjs();
                let labels = [];
                let bucketMap = {}; // label -> index

                if (timeRange === 'Tuần này') {
                    // last 7 days (Mon-Sun depending on locale)
                    const start = now.startOf('week');
                    for (let d = 0; d < 7; d++) {
                        const day = start.add(d, 'day');
                        const label = day.format('DD MMM');
                        labels.push(label);
                        bucketMap[label] = d;
                    }
                } else if (timeRange === 'Tháng này') {
                    // last 30 days including today
                    for (let i = 29; i >= 0; i--) {
                        const day = now.subtract(i, 'day');
                        const label = day.format('DD MMM');
                        labels.push(label);
                        bucketMap[label] = labels.length - 1;
                    }
                } else if (timeRange === 'Năm nay') {
                    // months in current year
                    for (let m = 0; m < 12; m++) {
                        const month = dayjs().startOf('year').add(m, 'month');
                        const label = month.format('MMM');
                        labels.push(label);
                        bucketMap[label] = m;
                    }
                } else {
                    // default: last 6 months (fallback for 'Tùy chỉnh')
                    for (let i = 5; i >= 0; i--) {
                        const label = dayjs().subtract(i, 'month').format('MMM');
                        labels.push(label);
                        bucketMap[label] = labels.length - 1;
                    }
                }

                // Initialize series (do not include doctor series)
                const examinations = labels.map(l => ({ name: l, Lượt_khám: 0 }));
                const userDoctorSeries = labels.map(l => ({ name: l, Người_dùng: 0 }));

                // Helper to resolve appointment date and doctor/patient ids
                const resolveApptDate = (a) => a.appointmentDate || a.date || a.startAt || a.start_time || a.createdAt || a.created_at || a.timestamp;

                // Count appointments into buckets (appointments are used only for visit counts)
                (apptsList || []).forEach(a => {
                    const dateStr = resolveApptDate(a);
                    if (!dateStr) return;
                    const d = dayjs(dateStr);
                    let label;
                    if (timeRange === 'Năm nay') label = d.format('MMM');
                    else if (timeRange === 'Tuần này' || timeRange === 'Tháng này') label = d.format('DD MMM');
                    else label = d.format('MMM');
                    const idx = bucketMap[label];
                    if (idx === undefined) return;

                    examinations[idx].Lượt_khám += 1;
                });

                // For users series, approximate by createdAt falling into same buckets
                const usersList = usersPage?.content || (Array.isArray(usersPage) ? usersPage : []);
                usersList.forEach(u => {
                    const d = u.createdAt || u.created_at;
                    if (!d) return;
                    const label = (timeRange === 'Năm nay') ? dayjs(d).format('MMM') : dayjs(d).format('DD MMM');
                    const idx = bucketMap[label];
                    if (idx !== undefined) userDoctorSeries[idx].Người_dùng += 1;
                });

                // Compute totals
                const totalVisitsInRange = examinations.reduce((s, it) => s + (it.Lượt_khám || 0), 0);

                setKpiData([
                    { title: 'Tổng số người dùng', value: totalUsers?.toLocaleString?.() ?? String(totalUsers), comparison: '', valueColor: 'text-gray-900', comparisonColor: 'text-gray-500' },
                    { title: 'Tổng số bác sĩ', value: totalDoctors?.toLocaleString?.() ?? String(totalDoctors), comparison: '', valueColor: 'text-gray-900', comparisonColor: 'text-gray-500' },
                    { title: 'Tổng lượt khám', value: totalVisitsInRange?.toLocaleString?.() ?? String(totalVisitsInRange), comparison: '', valueColor: 'text-gray-900', comparisonColor: 'text-gray-500' },
                ]);

                setChartData({ examinations, userDoctorData: userDoctorSeries });
            } catch (err) {
                console.error('Failed to load admin reports data', err);
                setKpiData([]);
                setChartData({ examinations: [], userDoctorData: [] });
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [timeRange]);

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 h-full flex items-center justify-center">
                <Spin />
            </div>
        );
    }

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
                
                {/* ⭐️ PHẦN 1: THẺ KPI (dữ liệu từ DB) ⭐️ */}
                {kpiData.length === 0 ? (
                    <Col xs={24}><Empty description="Không có dữ liệu" /></Col>
                ) : kpiData.map((kpi, index) => (
                    <Col xs={24} md={8} key={index}>
                        <AnalyticsKPI {...kpi} />
                    </Col>
                ))}
                
                {/* ------------------------------------------- */}
                {/* ⭐️ PHẦN 2: BIỂU ĐỒ ⭐️ */}
                {/* ------------------------------------------- */}
                
                {/* CHART A: SỐ LƯỢT KHÁM THEO THỜI GIAN (Area/Line Chart) */}
                <Col xs={24} lg={24}>
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
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                
                {/* CHART B removed: showing only visits chart now. */}

                

            </Row>
        </div>
    );
};

export default AnalyticsPage;