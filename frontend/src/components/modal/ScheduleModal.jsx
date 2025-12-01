// ScheduleModal.jsx (Đã tối ưu hóa hiển thị dữ liệu và sử dụng hàm ánh xạ trạng thái)

import React, { useState, useEffect } from 'react';
import { Typography, Card, Button, Row, Col, Calendar, Space, Modal, Badge, List, Spin } from 'antd';
import { LeftOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; 
import weekOfYear from 'dayjs/plugin/weekOfYear'; 
import customParseFormat from 'dayjs/plugin/customParseFormat'; 
import 'dayjs/locale/vi'; 

dayjs.extend(weekOfYear); 
dayjs.extend(customParseFormat); 
dayjs.locale('vi'); 

const { Title, Text } = Typography;
import appointmentApi from '../../api/appointmentApi';
import { useAuth } from '../../context/AuthProvider';

// scheduleData will be loaded from API for the logged-in doctor
// each item shape: { date: 'YYYY-MM-DD', time: 'HH:mm', name, type }

// --- Hàm ánh xạ loại cuộc hẹn/ly do sang trạng thái (status), màu sắc và mô tả ---
const getScheduleStatus = (text = '', raw = {}) => {
    // text có thể gồm cả `type` và `reason` từ appointment
    const t = String(text || '').toLowerCase();
    const statusFromAppointment = (raw && raw.status) ? String(raw.status).toUpperCase() : null;

    // Nếu backend đã cung cấp status, ưu tiên dùng nó để xác định màu
    if (statusFromAppointment) {
        switch (statusFromAppointment) {
            case 'COMPLETED': return { status: 'success', color: '#52c41a', description: 'Hoàn thành' };
            case 'SCHEDULED': return { status: 'processing', color: '#1890ff', description: 'Đã đặt lịch' };
            case 'CANCELLED': return { status: 'default', color: '#999', description: 'Đã hủy' };
            case 'NO_SHOW': return { status: 'warning', color: '#faad14', description: 'Vắng mặt' };
            case 'CONFIRMED': return { status: 'processing', color: '#096dd9', description: 'Đã xác nhận' };
            default: break;
        }
    }

    // Khớp theo từ khóa trong type/reason
    if (t.includes('tái') || t.includes('tái khám')) return { status: 'success', color: '#52c41a', description: 'Tái khám' };
    if (t.includes('siêu âm') || t.includes('thai') || t.includes('khám thai')) return { status: 'processing', color: '#722ed1', description: 'Khám thai' };
    if (t.includes('tiêm') || t.includes('vắc') || t.includes('vaccine')) return { status: 'warning', color: '#faad14', description: 'Tiêm phòng' };
    if (t.includes('x-quang') || t.includes('xquang') || t.includes('x ray') || t.includes('xray')) return { status: 'error', color: '#ff4d4f', description: 'X-quang' };
    if (t.includes('định kỳ') || t.includes('khám định kỳ') || t.includes('định kỳ')) return { status: 'processing', color: '#7cb305', description: 'Khám định kỳ' };
    if (t.includes('ho') || t.includes('sốt') || t.includes('cảm') || t.includes('đau')) return { status: 'default', color: '#fa8c16', description: 'Khám bệnh' };

    // Mặc định
    return { status: 'default', color: '#999', description: (raw && raw.reason) ? (String(raw.reason).slice(0,30) + (String(raw.reason).length>30? '...':'')) : 'Khác' };
};

// --- Hàm lấy dữ liệu cho từng ngày (Dùng chung) ---
const getListData = (value, data) => {
    const dateKey = value.format('YYYY-MM-DD');
    const listData = (data || []).filter(item => item.date === dateKey);
    // Sắp xếp dữ liệu theo thời gian
    listData.sort((a, b) => (a.time > b.time ? 1 : -1));
    return listData;
};

// Note: month cell render will be provided inline in ScheduleModal so it can access events state

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
const WeekView = ({ currentDate, setCurrentDate, onEventClick, events = [] }) => {
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
                    const listData = getListData(day, events);
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
                                    // show time + reason (no status), but apply color by reason
                                    const reasonText = (item.raw && (item.raw.reason || item.raw.description)) || item.type || '';
                                    const { color } = getScheduleStatus(`${item.type || ''} ${item.raw?.reason || ''}`, item.raw);
                                    return (
                                        <List.Item 
                                            className="p-1 border-b-0 cursor-pointer hover:bg-gray-50" 
                                            title={`${item.time} - ${reasonText}`} 
                                            onClick={() => onEventClick && onEventClick(item)}
                                        >
                                            <div className="text-left w-full whitespace-normal break-words">
                                                <Text strong className="block" style={{ lineHeight: 1.2, color: color }}>{item.time}</Text>
                                                <Text type="secondary" className="block" style={{ whiteSpace: 'normal', overflowWrap: 'break-word' }}>{reasonText}</Text>
                                            </div>
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
const ScheduleModal = ({ open, onCancel, onEventClick }) => { 
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState('month');
    const [currentDate, setCurrentDate] = useState(dayjs()); 
    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    const handleCalendarChange = (date) => {
        setCurrentDate(date); 
    };

    useEffect(() => {
        // load events for current month when modal opens or month changes
        const loadEvents = async () => {
            if (!open || !user || !user.userId) return;
            setLoadingEvents(true);
            try {
                const start = currentDate.startOf('month').toDate();
                const end = currentDate.endOf('month').toDate();
                // The Doctor entity maps its id to User id (MapsId), so doctorId == user.userId
                const doctorIdToUse = user.userId;
                const resp = await appointmentApi.getByDateRange(doctorIdToUse, start, end);
                let items = resp?.data || resp?.result || resp || [];
                if (items && items.data && Array.isArray(items.data)) items = items.data;
                if (resp?.data && resp.data.content && Array.isArray(resp.data.content)) items = resp.data.content;

                // Debug: inspect returned items to determine doctor id shape
                try {
                    console.debug('ScheduleModal: fetched appointments count', Array.isArray(items) ? items.length : 'not-array', items?.slice?.(0,5));
                    console.log('ScheduleModal: raw items (first 20)', Array.isArray(items) ? items.slice(0,20) : items);
                } catch (logErr) {
                    // ignore logging errors
                    console.warn('ScheduleModal debug log failed', logErr);
                }

                // Filter appointments to only those assigned to the logged-in doctor (user.userId)
                const filteredItems = (items || []).filter(it => {
                    try {
                        const docId = it.doctorId || (it.doctor && (it.doctor.doctorId || it.doctor.id)) || (it.doctor && it.doctor.user && (it.doctor.user.userId || it.doctor.user.id));
                        // Debug per-item docId
                        try { console.debug('ScheduleModal: item docId resolved', docId, 'item:', it); } catch (logErr) { console.warn('ScheduleModal per-item log failed', logErr); }
                        if (docId == null) return false;
                        return String(docId) === String(user.userId);
                    } catch {
                        return false;
                    }
                });
                try {
                    console.log('ScheduleModal: filteredItems (first 20)', filteredItems.slice(0,20));
                    console.debug('ScheduleModal: filtered count', filteredItems.length);
                } catch (logErr) {
                    console.warn('ScheduleModal filtered log failed', logErr);
                }

                const mapped = (filteredItems || []).map(it => {
                    const possibleDate = it.appointment_date || it.appointmentDate || it.appointmentAt || it.startTime || it.start_at || it.start || it.date || it.appointment_datetime || it.appointmentDatetime || it.startTime;
                    let timeStr = '';
                    try {
                        if (possibleDate) timeStr = dayjs(possibleDate).isValid() ? dayjs(possibleDate).format('HH:mm') : String(possibleDate).slice(11,16);
                        else if (it.time) timeStr = it.time;
                    } catch { timeStr = it.time || ''; }

                    const name = it.patientName || it.patient?.fullName || it.memberName || it.member?.fullName || it.name || it.fullName || 'Không rõ';
                    const dateKey = possibleDate ? dayjs(possibleDate).format('YYYY-MM-DD') : (it.date ? dayjs(it.date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
                    return { date: dateKey, time: timeStr, name, type: it.type || it.reason || 'Khám bệnh', raw: it };
                });

                setEvents(mapped);
            } catch (e) {
                console.warn('Failed to load schedule events', e);
                setEvents([]);
            } finally {
                setLoadingEvents(false);
            }
        };

        loadEvents();
    }, [open, currentDate, user]);

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
                    {loadingEvents ? (
                        <div className="py-8 text-center"><Spin /></div>
                    ) : (
                        viewMode === 'month' ? (
                        <Calendar 
                            mode="month"
                            value={currentDate}
                            onChange={handleCalendarChange}
                            headerRender={MonthViewHeader}
                            dateCellRender={(value) => {
                                const listData = getListData(value, events);
                                return (
                                    <ul className="events-list p-0 m-0 list-none">
                                        {listData.map((item, index) => {
                                            // show time + reason (no status badge) but keep color by reason
                                            if (index >= 2) return null;
                                            const reasonText = (item.raw && (item.raw.reason || item.raw.description)) || item.type || '';
                                            const { color } = getScheduleStatus(`${item.type || ''} ${item.raw?.reason || ''}`, item.raw);
                                            return (
                                                <li
                                                    key={item.date + item.time}
                                                    className="text-sm cursor-pointer hover:bg-gray-50 p-1"
                                                    title={`${item.time} - ${reasonText}`}
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() => onEventClick && onEventClick(item)}
                                                >
                                                    <div className="text-left w-full whitespace-normal break-words">
                                                        <Text strong className="block" style={{ lineHeight: 1.2, color: color }}>{item.time}</Text>
                                                        <Text type="secondary" className="block" style={{ whiteSpace: 'normal', overflowWrap: 'break-word' }}>{reasonText}</Text>
                                                    </div>
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
                            }}
                            className="custom-month-calendar" 
                        />
                        ) : (
                            <WeekView 
                                currentDate={currentDate} 
                                setCurrentDate={setCurrentDate}
                                onEventClick={onEventClick}
                                events={events}
                            />
                        )
                    )}
                </Card>
            </div>
        </Modal>
    );
};

export default ScheduleModal;