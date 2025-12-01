import React, { useEffect, useState } from 'react';
import { Typography, List, Button, Tag, Card, Spin, Empty } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import appointmentApi from '../../api/appointmentApi';
import memberApi from '../../api/memberApi';
import userApi from '../../api/userApi';
import { useAuth } from '../../context/AuthProvider';

const { Text, Title } = Typography;

const TodayAppointmentList = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadToday = async () => {
            if (!user || !user.userId) return;
            setLoading(true);
            try {
                const start = dayjs().startOf('day').toDate();
                const end = dayjs().endOf('day').toDate();
                // Attempt to fetch by date range, but also fetch full doctor list as a fallback
                const [rangeResp, allResp] = await Promise.allSettled([
                    appointmentApi.getByDateRange(user.userId, start, end),
                    appointmentApi.getByDoctorId(user.userId)
                ]);

                // Prefer rangeResp result, but merge with full list to ensure completeness
                let items = [];
                if (rangeResp.status === 'fulfilled') items = rangeResp.value?.data || rangeResp.value?.result || rangeResp.value || [];
                if (allResp.status === 'fulfilled') {
                    const allItems = allResp.value?.data || allResp.value?.result || allResp.value || [];
                    // merge unique by appointment id
                    const map = new Map();
                    (items || []).forEach(it => map.set(String(it.appointmentId || it.id || it.appointment_id), it));
                    (allItems || []).forEach(it => {
                        const key = String(it.appointmentId || it.id || it.appointment_id);
                        if (!map.has(key)) map.set(key, it);
                    });
                    items = Array.from(map.values());
                }
                // `items` already contains the merged results from rangeResp and allResp
                // (normalized below). No additional resp variable is expected here.
                // Filter results to only include appointments for today.
                // Try several common date fields; if none exist but a time field exists,
                // assume the item refers to today's schedule.
                const filteredItems = (items || []).filter(it => {
                    const possibleDate = it.appointment_date || it.appointmentDate || it.appointmentAt || it.startTime || it.start_at || it.start || it.date || it.appointment_datetime || it.appointmentDatetime;
                    if (possibleDate) {
                        try {
                            return dayjs(possibleDate).isValid() && dayjs(possibleDate).isSame(dayjs(), 'day');
                        } catch {
                            return false;
                        }
                    }
                    // If no explicit date but there is a time value, treat it as today's appointment
                    if (it.time || it.startTime || it.start_at || it.start) return true;
                    return false;
                });
                items = filteredItems;
                // Debug help: log first few items so we can inspect field names in the network response
                console.debug('appointments.rawResp', { rangeResp, allResp, sample: Array.isArray(items) ? items.slice(0,3) : items });
                // Normalize items to expected shape
                const normalized = (items || []).map(it => {
                    // Try many possible date/time fields that backend might return
                    const possibleDate = it.appointment_date || it.appointmentDate || it.appointmentAt || it.startTime || it.start_at || it.start || it.date || it.appointment_datetime || it.appointmentDatetime;
                    let timeStr = '';
                    try {
                        if (possibleDate) {
                            timeStr = dayjs(possibleDate).isValid() ? dayjs(possibleDate).format('HH:mm') : String(possibleDate).slice(11,16);
                        } else if (it.time) {
                            timeStr = it.time;
                        }
                    } catch {
                        timeStr = it.time || '';
                    }

                    // Best-effort patient name extraction from common backend shapes
                    const nameCandidates = [
                        it.patientName,
                        it.memberName,
                        it.name,
                        it.fullName,
                        it.patient?.fullName,
                        it.patient?.name,
                        it.patient?.user?.fullName,
                        it.patient?.user?.firstName && it.patient?.user?.lastName ? `${it.patient.user.firstName} ${it.patient.user.lastName}` : null,
                        it.member?.fullName,
                        it.member?.user?.fullName,
                        it.patient?.firstName && it.patient?.lastName ? `${it.patient.firstName} ${it.patient.lastName}` : null,
                    ];
                    const resolvedName = nameCandidates.find(x => x && String(x).trim()) || 'Không rõ';

                    return {
                        id: it.id || it.appointmentId,
                        time: timeStr,
                        name: resolvedName,
                        type: it.type || it.reason || 'Khám bệnh',
                        status: it.status || 'Scheduled',
                        isLinked: !!it.linked,
                        raw: it
                    };
                });
                // If some items have unresolved names, try to fetch from member/user APIs
                const needsFetch = normalized.filter(x => (!x.name || x.name === 'Không rõ') && x.raw);
                if (needsFetch.length > 0) {
                    const memberIds = new Set();
                    const userIds = new Set();
                    needsFetch.forEach(x => {
                        const r = x.raw || {};
                        if (r.memberId) memberIds.add(r.memberId);
                        if (r.member_id) memberIds.add(r.member_id);
                        if (r.patientId) memberIds.add(r.patientId);
                        if (r.patient_id) memberIds.add(r.patient_id);
                        if (r.userId) userIds.add(r.userId);
                        if (r.user_id) userIds.add(r.user_id);
                        // nested shapes
                        if (r.patient && r.patient.userId) userIds.add(r.patient.userId);
                        if (r.patient && r.patient.user_id) userIds.add(r.patient.user_id);
                        if (r.member && r.member.userId) userIds.add(r.member.userId);
                    });

                    const memberPromises = Array.from(memberIds).map(id => memberApi.getById(id).then(res => ({ id, res })).catch(() => ({ id, res: null })));
                    const userPromises = Array.from(userIds).map(id => userApi.getById(id).then(res => ({ id, res })).catch(() => ({ id, res: null })));

                    try {
                        const [membersRes, usersRes] = await Promise.all([Promise.all(memberPromises), Promise.all(userPromises)]);
                        const memberMap = new Map();
                        membersRes.forEach(m => {
                            const body = m.res?.data || m.res?.result || m.res || null;
                            if (body) memberMap.set(String(m.id), (body.fullName || body.name || body.user?.fullName || body.user?.email || null));
                        });
                        const userMap = new Map();
                        usersRes.forEach(u => {
                            const body = u.res?.data || u.res?.result || u.res || null;
                            if (body) userMap.set(String(u.id), (body.fullName || body.name || `${body.firstName || ''} ${body.lastName || ''}`.trim() || body.email || null));
                        });

                        const updated = normalized.map(it => {
                            if (it.name && it.name !== 'Không rõ') return it;
                            const r = it.raw || {};
                            const mid = r.memberId || r.member_id || r.patientId || r.patient_id || (r.patient && r.patient.memberId);
                            const uid = r.userId || r.user_id || (r.patient && r.patient.userId) || (r.member && r.member.userId) || (r.rawUserId || null);
                            const fromMember = mid ? memberMap.get(String(mid)) : null;
                            const fromUser = uid ? userMap.get(String(uid)) : null;
                            const resolved = fromMember || fromUser || it.name;
                            return { ...it, name: resolved || it.name };
                        });

                        setAppointments(updated);
                    } catch (e) {
                        // if fetch fails, fallback to normalized
                        console.warn('Failed to fetch member/user names', e);
                        setAppointments(normalized);
                    }
                } else {
                    setAppointments(normalized);
                }
            } catch (err) {
                console.error('Failed to load today appointments', err);
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        };

        loadToday();
    }, [user]);

    const getActionAndStatus = (appointment) => {
        const linkTag = appointment.isLinked ? 
            <Tag color="blue" className="mr-2">Đã liên lịch</Tag> : 
            <Tag color="default" className="mr-2">Chưa xác nhận</Tag>;

        // Normalize status for checking
        const st = String(appointment.status || '').toUpperCase();

        // Build Tag according to status
        let statusTag = null;
            if (st === 'SCHEDULED' || st === 'SCHEDULE') {
                statusTag = <Tag color="default" className="mr-2">Đã lên lịch</Tag>;
            } else if (st === 'CONFIRMED') {
                statusTag = <Tag color="processing" className="mr-2">Đã xác nhận</Tag>;
            } else if (st === 'COMPLETED' || st === 'DONE') {
                statusTag = <Tag icon={<CheckCircleOutlined />} color="green" className="mr-2">Đã hoàn thành</Tag>;
            }

        // Actions: show 'Bắt đầu khám' for scheduled items (keep existing behavior)
        // Show 'Hoàn thành' button only for appointments that are in-progress (not SCHEDULED/CONFIRMED/COMPLETED)
        let actionsContent = null;
            if (st === 'SCHEDULED' || st === 'SCHEDULE') {
                // scheduled: show linkTag and no action button
                actionsContent = (
                    <div className="flex items-center space-x-2">
                        {linkTag}
                    </div>
                );
            } else if (st === 'CONFIRMED') {
                // confirmed: show only the confirmation button (no link/status text beside it)
                actionsContent = (
                    <div className="flex items-center space-x-2">
                        <Button type="primary" loading={completingId === appointment.id} onClick={() => handleComplete(appointment.id)}>Xác nhận hoàn thành</Button>
                    </div>
                );
            } else if (st === 'COMPLETED' || st === 'DONE') {
                // completed: no actions
                actionsContent = null;
            } else {
                // other statuses: no action by default
                actionsContent = (
                    <div className="flex items-center space-x-2">
                        {linkTag}
                    </div>
                );
            }

        return { actionsContent, statusTag };
    };

    // Handler to mark appointment as COMPLETED
    const [completingId, setCompletingId] = useState(null);
    const handleComplete = async (appointmentId) => {
        if (!appointmentId) return;
        try {
            setCompletingId(appointmentId);
            await appointmentApi.updateStatus(appointmentId, 'COMPLETED');
            // update UI state
            setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'COMPLETED' } : a));
        } catch (e) {
            console.error('Failed to mark appointment completed', e);
        } finally {
            setCompletingId(null);
        }
    };

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
            <Card className="shadow-lg">
                <Title level={4}>Lịch hẹn hôm nay</Title>
                <Text type="secondary" className="block mb-4">{dayjs().format('dddd, DD MMMM YYYY')}</Text>

                {loading ? (
                    <div className="py-8 text-center"><Spin /></div>
                ) : (
                    appointments.length === 0 ? (
                        <div className="py-12 text-center">
                            <Empty description={<span>Không có lịch hẹn hôm nay</span>} />
                        </div>
                    ) : (
                        <List
                            itemLayout="horizontal"
                            dataSource={appointments}
                            renderItem={(item) => {
                                const { actionsContent, statusTag } = getActionAndStatus(item);
                                const actions = actionsContent ? [actionsContent] : [];

                                return (
                                    <List.Item
                                        actions={actions} 
                                        className="p-4 hover:bg-gray-50 transition-colors rounded-lg"
                                    >
                                        <List.Item.Meta
                                            avatar={<Text strong className="text-xl text-blue-600"><ClockCircleOutlined /> {item.time}</Text>}
                                            title={(
                                                <div className="flex items-center space-x-2">
                                                    <Text strong className="text-lg">{item.name}</Text>
                                                    {statusTag}
                                                </div>
                                            )}
                                            description={<Text type="secondary">{item.type}</Text>}
                                        />
                                    </List.Item>
                                );
                            }}
                        />
                    )
                )}
            </Card>
        </div>
    );
};

export default TodayAppointmentList;