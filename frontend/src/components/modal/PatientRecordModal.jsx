import React, { useEffect, useState } from 'react';
import { Modal, Typography, Row, Col, Tag, Tabs, Space, Spin } from 'antd';
import { 
    PhoneOutlined, MailOutlined, CalendarOutlined, HeartFilled, FileTextOutlined 
} from '@ant-design/icons';
// Đảm bảo tất cả các component con đã được import
import ChartTabs from './ChartTabs';
import PrescriptionsTab from './PrescriptionsTab';
import VaccinationTab from './VaccinationTab';
import VitalsTab from './VitalsTab';
import PrescribeMed from './PrescribeMed'; // <--- IMPORT COMPONENT KÊ ĐƠN THUỐC

import healthRecordApi from '../../api/healthRecordApi';
import prescriptionApi from '../../api/prescriptionApi';
import visitHistoryApi from '../../api/visitHistoryApi';
import vaccinationApi from '../../api/vaccinationApi';

const { Title, Text, Paragraph } = Typography;

const PatientRecordModal = ({ isVisible, onClose, patientData: propData }) => {
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [healthRecord, setHealthRecord] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [visitHistories, setVisitHistories] = useState([]);
    const [vaccinations, setVaccinations] = useState([]);
    const [currentMemberId, setCurrentMemberId] = useState(null);

    const loadVaccinations = async (memberId) => {
        try {
            const vResp = await vaccinationApi.getByMemberId(memberId);
            const items = vResp?.data || vResp?.result || vResp || [];
            setVaccinations(items.map(v => ({ 
                vaccinationId: v.vaccinationId,
                vaccineName: v.vaccineName || v.name, 
                vaccinationDate: v.vaccinationDate || v.dateGiven || v.date,
                nextDose: v.nextDose || v.next,
                location: v.location || '',
                notes: v.notes || ''
            })));
        } catch {
            setVaccinations([]);
        }
    };

    useEffect(() => {
        const loadDetails = async () => {
            if (!isVisible) return;
            const memberId = propData?.memberId || propData?.member_id || propData?.userId || propData?.user_id;
            if (!memberId) return;

            setCurrentMemberId(memberId);
            setLoadingDetails(true);
            try {
                // health record
                try {
                    const hrResp = await healthRecordApi.getByMemberId(memberId);
                    const hr = hrResp?.data || hrResp?.result || hrResp;
                    setHealthRecord(hr);
                } catch {
                    setHealthRecord(null);
                }

                // prescriptions
                try {
                    const presResp = await prescriptionApi.getByMemberId(memberId);
                    const pres = presResp?.data || presResp?.result || presResp || [];
                    const mapped = pres.map(p => ({
                        doctor: p.doctorName || p.doctor || (p.doctorId ? `BS. ${p.doctorId}` : ''),
                        date: p.prescribedAt ? new Date(p.prescribedAt).toLocaleDateString('vi-VN') : (p.date || ''),
                        medications: (p.medications || p.items || []).map(m => ({
                            name: m.medicationName || m.name || (m.medication && m.medication.medicationName),
                            dose: m.dosage || m.dose || '',
                            freq: m.frequency || m.freq || '',
                            duration: m.duration || ''
                        })),
                        instructions: p.note || p.instructions || ''
                    }));
                    setPrescriptions(mapped);
                } catch {
                    setPrescriptions([]);
                }

                // visit histories
                try {
                    const visitResp = await visitHistoryApi.getByMemberId(memberId);
                    const visits = visitResp?.data || visitResp?.result || visitResp || [];
                    setVisitHistories(visits.map(v => ({
                        type: v.reason || 'Khám bệnh',
                        doctor: v.doctorName || `BS. ${v.doctorId || ''}`,
                        date: v.visitDate ? new Date(v.visitDate).toLocaleDateString('vi-VN') : (v.date || ''),
                        diagnosis: v.diagnosis || '',
                        treatment: v.followUpDate || v.treatment || '',
                        note: v.note || ''
                    })));
                } catch {
                    setVisitHistories([]);
                }

                // vaccinations
                await loadVaccinations(memberId);

            } finally {
                setLoadingDetails(false);
            }
        };

        loadDetails();
    }, [isVisible, propData]);

    if (!isVisible) return null;

    // ✅ MERGE DỮ LIỆU: Thật (nếu có) — KHÔNG dùng dữ liệu mẫu
    const data = {
        name: propData?.name || propData?.fullName || 'Chưa cập nhật',
        age: propData?.age || propData?.ageValue || null,
        gender: propData?.gender || null,
        role: propData?.role || propData?.relationship || null,
        contact: {
            phone: propData?.phone || propData?.contact?.phone || propData?.userPhone || null,
            email: propData?.email || propData?.contact?.email || propData?.userEmail || null
        },
        medicalInfo: {
            bloodType: healthRecord?.bloodType || propData?.medicalInfo?.bloodType || null,
            lastCheckup: (visitHistories && visitHistories.length > 0) ? visitHistories[0].date : (propData?.medicalInfo?.lastCheckup || null)
        },
        // Use actual fetched lists or empty arrays
        vitalsHistory: visitHistories.length > 0 ? visitHistories.map(v => ({ date: v.date, bp: v.bp || '', hr: v.hr || '', temp: v.temp || '', weight: v.weight || '', height: v.height || '' })) : [],
        vaccinations: vaccinations.length > 0 ? vaccinations : [],
        prescriptions: prescriptions.length > 0 ? prescriptions : [],
        allergies: healthRecord?.allergies ? (Array.isArray(healthRecord.allergies) ? healthRecord.allergies : [{ name: healthRecord.allergies }]) : [],
        conditions: healthRecord?.chronicConditions ? (Array.isArray(healthRecord.chronicConditions) ? healthRecord.chronicConditions : [{ name: healthRecord.chronicConditions }]) : [],
        history: visitHistories.length > 0 ? visitHistories : [],
        ...propData
    };

    const NotUpdated = ({ text = 'Chưa cập nhật' }) => (
        <div className="text-center py-6 text-gray-500">{text}</div>
    );

    // ✅ RENDER LỊCH SỬ KHÁM (Gọn)
    const renderHistory = () => (
        <div className="space-y-4">
            <Text type="secondary">Lịch sử khám bệnh</Text>
            {data.history.map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                            <div className="pt-1">{item.icon}</div>
                            <div>
                                <Text strong>{item.type}</Text>
                                <Text type="secondary" className="ml-2">BS. {item.doctor}</Text>
                                <div className="mt-2 space-y-1 text-sm">
                                    <Text>{item.diagnosis}</Text>
                                    <Text>{item.treatment}</Text>
                                    <Text type="secondary">{item.note}</Text>
                                </div>
                            </div>
                        </div>
                        <Text type="secondary">{item.date}</Text>
                    </div>
                </div>
            ))}
        </div>
    );

    const tabItems = [
        { 
            label: 'Lịch sử khám', key: 'history', 
            children: loadingDetails ? <div className="text-center py-6"><Spin/></div> : (data.history.length === 0 ? <NotUpdated text="Lịch sử khám chưa được cập nhật"/> : renderHistory())
        },
        { 
            label: 'Sinh hiệu', key: 'vitals', 
            children: loadingDetails ? <div className="text-center py-6"><Spin/></div> : (data.vitalsHistory.length === 0 ? <NotUpdated text="Chưa có số liệu sinh hiệu"/> : <VitalsTab vitalsHistory={data.vitalsHistory} />)
        },
        { 
            label: 'Biểu đồ', key: 'charts', 
            children: loadingDetails ? <div className="text-center py-6"><Spin/></div> : (data.vitalsHistory.length === 0 ? <NotUpdated text="Không có dữ liệu để vẽ biểu đồ"/> : <ChartTabs vitalsData={data.vitalsHistory} />)
        },
        { 
            label: 'Tiêm chủng', key: 'vaccination', 
            children: loadingDetails ? <div className="text-center py-6"><Spin/></div> : (
                <VaccinationTab 
                    vaccinations={data.vaccinations} 
                    memberId={currentMemberId}
                    onVaccinationAdded={() => currentMemberId && loadVaccinations(currentMemberId)}
                />
            )
        },
        { 
            label: 'Đơn thuốc', key: 'prescriptions', 
            children: loadingDetails ? <div className="text-center py-6"><Spin/> </div> : (data.prescriptions.length === 0 ? <NotUpdated text="Chưa có đơn thuốc"/> : <PrescriptionsTab prescriptions={data.prescriptions} />)
        },
        // THAY THẾ CHỖ NÀY BẰNG COMPONENT PrescribeMed
        { 
            label: 'Kê đơn thuốc', 
            key: 'prescribe', 
            children: <PrescribeMed patientData={data} /> 
        },
    ];

    return (
        <Modal open={isVisible} onCancel={onClose} footer={null} width={1400} centered>
            <div className="p-6">
                {/* HEADER */}
                <div className="mb-6 pb-4 border-b">
                    <Title level={3} className="m-0">{data.name}</Title>
                    <Text type="secondary">{data.age} tuổi • {data.gender} • {data.role}</Text>

                    <Row gutter={16} className="mt-4">
                        <Col span={6}>
                            <Text strong className="block mb-2">Thông tin liên hệ</Text>
                            <Space direction="vertical" size={1}>
                                <Text><PhoneOutlined /> {data.contact.phone || 'Chưa cập nhật'}</Text>
                                <Text><MailOutlined /> {data.contact.email || 'Chưa cập nhật'}</Text>
                            </Space>
                        </Col>
                        <Col span={6}>
                            <Text strong className="block mb-2">Thông tin y tế</Text>
                            <Space direction="vertical" size={1}>
                                <Text><HeartFilled /> {data.medicalInfo.bloodType || 'Chưa cập nhật'}</Text>
                                <Text><CalendarOutlined /> {data.medicalInfo.lastCheckup || 'Chưa cập nhật'}</Text>
                            </Space>
                        </Col>
                        <Col span={6}>
                            <Text strong className="block mb-2 text-red-600">⚠️ Dị ứng</Text>
                            {data.allergies.length === 0 ? <NotUpdated text="Chưa cập nhật" /> : data.allergies.map(a => (
                                <Tag key={a.name} color="error">{a.name}</Tag>
                            ))}
                        </Col>
                        <Col span={6}>
                            <Text strong className="block mb-2">Bệnh lý</Text>
                            {data.conditions.length === 0 ? <NotUpdated text="Chưa cập nhật" /> : data.conditions.map(c => (
                                <Tag key={c.name} color="default">{c.name}</Tag>
                            ))}
                        </Col>
                    </Row>
                </div>

                {/* TABS */}
                <Tabs defaultActiveKey="history" items={tabItems} />
            </div>
        </Modal>
    );
};

export default PatientRecordModal;  