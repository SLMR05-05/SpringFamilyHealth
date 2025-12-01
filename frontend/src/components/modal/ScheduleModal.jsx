// ScheduleModal.jsx (Đã tối ưu hóa hiển thị dữ liệu và sử dụng hàm ánh xạ trạng thái)

import React, { useState } from 'react';
import { Typography, Card, Button, Row, Col, Calendar, Space, Modal, Badge, List } from 'antd';
import { LeftOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; 
import weekOfYear from 'dayjs/plugin/weekOfYear'; 
import customParseFormat from 'dayjs/plugin/customParseFormat'; 
import 'dayjs/locale/vi'; 

dayjs.extend(weekOfYear); 
dayjs.extend(customParseFormat); 
dayjs.locale('vi'); 

const { Title, Text } = Typography;

// --- Dữ liệu lịch khám giả lập ---
const scheduleData = [
    { date: '2025-11-28', time: '10:00', name: 'Nguyễn Văn An', type: 'Khám tổng quát' },
    { date: '2025-11-28', time: '15:30', name: 'Trần Thị Bích', type: 'Tái khám' },
    { date: '2025-11-29', time: '09:00', name: 'Lê Văn Cường', type: 'Tiêm phòng cúm' },
    { date: '2025-11-29', time: '11:00', name: 'Phạm Thị Duyên', type: 'Khám tổng quát' },
    { date: '2025-12-05', time: '14:00', name: 'Vũ Đình Đức', type: 'Khám định kỳ' },
    { date: '2025-12-05', time: '16:00', name: 'Mai Thu Hiền', type: 'X-quang' },
];

// --- Hàm ánh xạ loại cuộc hẹn sang trạng thái (status) và màu sắc ---
const getScheduleStatus = (type) => {
    // Sử dụng status và màu sắc để định dạng
    if (type.includes('Khám tổng quát')) return { status: 'processing', color: '#1890ff', description: 'Khám TQ' };
    if (type.includes('Tái khám')) return { status: 'success', color: '#52c41a', description: 'Tái khám' };
    if (type.includes('Tiêm phòng')) return { status: 'warning', color: '#faad14', description: 'Tiêm phòng' };
    if (type.includes('X-quang')) return { status: 'error', color: '#ff4d4f', description: 'X-quang' };
    if (type.includes('Khám định kỳ')) return { status: 'default', color: '#7cb305', description: 'Khám ĐK' };
    return { status: 'default', color: '#999', description: 'Khác' };
};

// --- Hàm lấy dữ liệu cho từng ngày (Dùng chung) ---
const getListData = (value) => {
    const dateKey = value.format('YYYY-MM-DD');
    const listData = scheduleData.filter(item => item.date === dateKey);
    // Sắp xếp dữ liệu theo thời gian
    listData.sort((a, b) => (a.time > b.time ? 1 : -1));
    return listData;
};

// --- Hàm render nội dung cho từng ô ngày (Dùng cho Month View) ---
const dateCellRender = (value) => {
    const listData = getListData(value);

    return (
        <ul className="events-list p-0 m-0 list-none">
            {listData.map((item, index) => {
                const { status, color, description } = getScheduleStatus(item.type);
                if (index >= 2) return null; 

                return (
                    <li key={item.date + item.time} className="text-xs truncate" title={`${item.time} - ${item.name}: ${item.type}`}>
                        <Badge 
                            status={status} 
                            text={
                                <Text className="text-xs" style={{ color }}>
                                    {item.time} - {description}
                                </Text>
                            }
                        />
                    </li>
                );
            })}
            {listData.length > 2 && (
                 <li key="more" className="text-xs text-blue-500 font-medium pt-1">
                     +{listData.length - 2} sự kiện khác
                 </li>
            )}
        </ul>
    );
};

// --- Custom Header cho Month View (Chuyển theo Tháng) ---
const MonthViewHeader = ({ value, onChange }) => {
    const displayMonthYear = value.format('MMMM YYYY');
    const changeMonth = (offset) => {
        onChange(value.clone().add(offset, 'month'));
    };

    return (
        <Row justify="space-between" align="middle" className="mb-4 pt-2">
            <Col>
                <Space size="small">
                    <Button icon={<LeftOutlined />} onClick={() => changeMonth(-1)} size="small" />
                    <CalendarOutlined className="text-xl text-gray-700" />
                    <Title level={5} className="m-0 text-gray-800">
                        {displayMonthYear.charAt(0).toUpperCase() + displayMonthYear.slice(1)}
                    </Title>
                    <Button icon={<RightOutlined />} onClick={() => changeMonth(1)} size="small" />
                </Space>
            </Col>
        </Row>
    );
};

// --- Component Lịch theo Tuần (Week View) ---
const WeekView = ({ currentDate, setCurrentDate }) => {
    const startOfWeek = currentDate.startOf('week'); 
    const daysInWeek = [...Array(7)].map((_, i) => startOfWeek.add(i, 'day'));
    const displayRange = `${startOfWeek.format('DD/MM/YYYY')} - ${startOfWeek.add(6, 'day').format('DD/MM/YYYY')}`;

    const changeWeek = (offset) => {
        setCurrentDate(currentDate.clone().add(offset, 'week'));
    };

    return (
        <div className="week-view-container">
            {/* Header Điều hướng Tuần */}
            <Row justify="space-between" align="middle" className="mb-4 pt-2">
                <Col>
                    <Space size="small">
                        <Button icon={<LeftOutlined />} onClick={() => changeWeek(-1)} size="small" />
                        <CalendarOutlined className="text-xl text-gray-700" />
                        <Title level={5} className="m-0 text-gray-800">
                            {displayRange}
                        </Title>
                        <Button icon={<RightOutlined />} onClick={() => changeWeek(1)} size="small" />
                    </Space>
                </Col>
            </Row>

            {/* Khung chứa 7 ngày */}
            <Row gutter={[16, 16]}>
                {daysInWeek.map((day) => {
                    const listData = getListData(day);
                    const isToday = day.isSame(dayjs(), 'day');

                    return (
                        <Col span={3} key={day.format('YYYY-MM-DD')}>
                            <Card 
                                size="small" 
                                className={`text-center ${isToday ? 'border-blue-500 bg-blue-50' : ''}`}
                                bodyStyle={{ padding: '8px' }}
                            >
                                <Text strong className={`block ${isToday ? 'text-blue-600' : ''}`}>
                                    {day.format('dd')}
                                </Text>
                                <Title level={4} className={`m-0 ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                                    {day.format('DD')}
                                </Title>
                            </Card>

                            {/* Danh sách cuộc hẹn trong ngày */}
                            <List
                                size="small"
                                dataSource={listData}
                                renderItem={(item) => {
                                    const { status, color } = getScheduleStatus(item.type);
                                    return (
                                        <List.Item className="p-0 border-b-0" title={`${item.time} - ${item.name}`}>
                                            <Badge 
                                                status={status} 
                                                text={
                                                    <div className="text-left w-full">
                                                        <Text strong className="text-xs block" style={{ color }}>
                                                            {item.time} - {item.name}
                                                        </Text>
                                                        <Text type="secondary" className="text-xs block">
                                                            {item.type}
                                                        </Text>
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    );
                                }}
                                className="mt-2"
                            />
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};


// --- Component chính (Modal) ---
const ScheduleModal = ({ open, onCancel, ...props }) => { 
    const [viewMode, setViewMode] = useState('month');
    const [currentDate, setCurrentDate] = useState(dayjs()); 

    const handleCalendarChange = (date) => {
        setCurrentDate(date); 
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            width={1000}
            centered
            className="schedule-modal"
        >
            <div className="p-4">
                
                {/* 1. TOP HEADER */}
                <Row justify="space-between" align="middle" className="mb-4 border-b pb-3">
                    <Col>
                        <Title level={3} className="m-0 text-gray-900">Lịch khám</Title>
                        <Text type="secondary" className="block">Quản lý lịch hẹn và cuộc hẹn</Text>
                    </Col>
                    <Col>
                        <Button 
                            type={viewMode === 'month' ? 'primary' : 'default'}
                            onClick={() => setViewMode('month')}
                            className="mr-2"
                        >
                            Tháng
                        </Button>
                        <Button 
                            type={viewMode === 'week' ? 'primary' : 'default'}
                            onClick={() => setViewMode('week')}
                        >
                            Tuần
                        </Button>
                    </Col>
                </Row>

                {/* 2. CALENDAR VIEW */}
                <Card className="shadow-none border-none h-full p-0">
                    {viewMode === 'month' ? (
                        <Calendar 
                            mode="month"
                            value={currentDate}
                            onChange={handleCalendarChange}
                            headerRender={MonthViewHeader}
                            dateCellRender={dateCellRender} 
                            className="custom-month-calendar" 
                        />
                    ) : (
                        <WeekView 
                            currentDate={currentDate} 
                            setCurrentDate={setCurrentDate}
                        />
                    )}
                </Card>
            </div>
        </Modal>
    );
};

export default ScheduleModal;