import React from 'react';
import { Modal, Typography, Row, Col, Tag, Tabs, Space } from 'antd';
import { 
    PhoneOutlined, MailOutlined, CalendarOutlined, HeartFilled, FileTextOutlined 
} from '@ant-design/icons';
// Đảm bảo tất cả các component con đã được import
import ChartTabs from './ChartTabs'; 
import PrescriptionsTab from './PrescriptionsTab'; 
import VaccinationTab from './VaccinationTab'; 
import VitalsTab from './VitalsTab'; 
import PrescribeMed from './PrescribeMed'; // <--- IMPORT COMPONENT KÊ ĐƠN THUỐC

const { Title, Text, Paragraph } = Typography;

// ✅ DỮ LIỆU MẪU (Gộp gọn)
const SAMPLE_DATA = {
    vitalsHistory: [
        { date: '15/9/2024', bp: '140/90 mmHg', hr: '78 bpm', temp: '36.5 °C', weight: '70 kg', height: '170 cm' },
        { date: '20/8/2024', bp: '135/88 mmHg', hr: '75 bpm', temp: '36.8 °C', weight: '71 kg', height: '170 cm' },
    ],
    vaccinations: [
        { name: 'Cúm mùa', doctor: 'Nguyễn Văn A', date: '1/9/2024', next: '1/9/2025', notes: 'Tiêm hàng năm' },
        { name: 'COVID-19', doctor: 'Trần Thị B', date: '15/6/2024', next: '15/6/2025', notes: 'Không phản ứng phụ' },
    ],
    prescriptions: [
        { doctor: 'Nguyễn Văn A', date: '15/9/2024', medications: [
            { name: 'Amlodipine 5mg', dose: '1 viên', freq: '1 lần/ngày', duration: '30 ngày' }
        ], instructions: 'Uống sau ăn sáng' },
    ],
    allergies: [{ name: 'Aspirin' }],
    conditions: [{ name: 'Viêm khớp' }],
    history: [{
        type: 'Khám sức khỏe', doctor: 'BS. Nguyễn Văn A', date: '15/9/2024',
        diagnosis: 'Sức khỏe tốt', treatment: 'Duy trì tập luyện', 
        note: 'Theo dõi huyết áp', icon: <HeartFilled className="text-green-500 text-xl" />
    }]
};

const PatientRecordModal = ({ isVisible, onClose, patientData: propData }) => {
    if (!isVisible) return null;

    // ✅ MERGE DỮ LIỆU: Thật + Mẫu (Tự động có dữ liệu)
    const data = {
        name: propData?.name || 'Trần Thị Bình',
        age: propData?.age || 38,
        gender: propData?.gender || 'Nữ',
        role: propData?.role || 'Chủ hộ',
        contact: { 
            phone: propData?.contact?.phone || '0902345678', // Sử dụng Optional Chaining cho contact
            email: propData?.contact?.email || 'binh.tran@email.com' 
        },
        medicalInfo: { 
            bloodType: propData?.medicalInfo?.bloodType || 'B+', // Sử dụng Optional Chaining cho medicalInfo
            lastCheckup: propData?.medicalInfo?.lastCheckup || '20/9/2024' 
        },
        // ✅ LUÔN CÓ DỮ LIỆU CHO TẤT CẢ TABS
        ...SAMPLE_DATA,
        ...propData // Override bằng dữ liệu thật nếu có
    };

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
        { label: 'Lịch sử khám', key: 'history', children: renderHistory() },
        { label: 'Sinh hiệu', key: 'vitals', children: <VitalsTab vitalsHistory={data.vitalsHistory} /> },
        { label: 'Biểu đồ', key: 'charts', children: <ChartTabs vitalsData={data.vitalsHistory} /> },
        { label: 'Tiêm chủng', key: 'vaccination', children: <VaccinationTab vaccinations={data.vaccinations} /> },
        { label: 'Đơn thuốc', key: 'prescriptions', children: <PrescriptionsTab prescriptions={data.prescriptions} /> },
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
                                <Text><PhoneOutlined /> {data.contact.phone}</Text>
                                <Text><MailOutlined /> {data.contact.email}</Text>
                            </Space>
                        </Col>
                        <Col span={6}>
                            <Text strong className="block mb-2">Thông tin y tế</Text>
                            <Space direction="vertical" size={1}>
                                <Text><HeartFilled /> {data.medicalInfo.bloodType}</Text>
                                <Text><CalendarOutlined /> {data.medicalInfo.lastCheckup}</Text>
                            </Space>
                        </Col>
                        <Col span={6}>
                            <Text strong className="block mb-2 text-red-600">⚠️ Dị ứng</Text>
                            {data.allergies.map(a => (
                                <Tag key={a.name} color="error">{a.name}</Tag>
                            ))}
                        </Col>
                        <Col span={6}>
                            <Text strong className="block mb-2">Bệnh lý</Text>
                            {data.conditions.map(c => (
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