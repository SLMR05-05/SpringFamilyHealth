import { Modal, Button, Typography, Tabs, Space, Divider, Card, Tag } from 'antd';
import React, { useState } from 'react'; // ⭐️ Import useState
import { ArrowLeftOutlined, EditOutlined, PrinterOutlined, HeartOutlined } from '@ant-design/icons';
// Đảm bảo đường dẫn này đúng
import AddPrescriptionModal from "./AddPrescriptionModal"; 

const { Title, Text } = Typography;

// --- Dữ liệu chi tiết giả định cho Trần Thị Bích ---
const detailedPatientData = {
    name: "Trần Thị Bích",
    id: "BN00124",
    status: "Đã duyệt",
    avatarUrl: "https://via.placeholder.com/100/7F9CF5/000000?text=TB", 
    birthDate: "15/05/1985",
    gender: "Nữ",
    phone: "0987 654 321",
    email: "bich.tt@example.com",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    bloodGroup: "O+",
    allergies: "Penicillin",
    
    // Lịch sử bệnh án (giữ nguyên)
    history: [
        { date: "10/06/  2025", hospital: "Bệnh viện Y Dược TP.HCM", type: "Khám tổng quát định kỳ", symptoms: "Chẩn đoán: Sức khỏe ổn định, huyết áp cao.", treatment: "Chỉ dẫn: Cần theo dõi huyết áp, giảm ăn mặn, tăng cường tập thể dục.", tag: "Khám tổng quát", },
        { date: "02/03/  2025", hospital: "Phòng khám Đa khoa Quốc tế", type: "Điều trị viêm họng cấp", symptoms: "Chẩn đoán: Viêm họng cấp do virus.", treatment: "Đơn thuốc: Paracetamol, nước muối súc miệng.", tag: "Điều trị viêm họng", },
        { date: "20/09/2023", hospital: "Bệnh viện Chợ Rẫy", type: "Tái khám sau phẫu thuật ruột thừa", symptoms: "Chẩn đoán: Vết mổ lành tốt, không có dấu hiệu nhiễm trùng.", treatment: "Chỉ dẫn: Có thể sinh hoạt bình thường, tránh vận động mạnh trong 2 tuần tới.", tag: "Tái khám", },
    ]
};

// Hàm hiển thị một trường thông tin cá nhân (Giữ nguyên)
const InfoField = ({ label, value, isRed = false }) => (
    <div className="flex flex-col">
        <Text className="text-gray-500 text-sm mb-0">{label}</Text>
        <Text className={`font-medium ${isRed ? 'text-red-500' : 'text-gray-900'}`}>{value}</Text>
    </div>
);

// Hàm render một mục Lịch sử bệnh án (Giữ nguyên)
const HistoryItem = ({ item }) => (
    <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-3">
        <Space direction="vertical" size={2} className="w-full">
            <div className='flex justify-between items-start'>
                <Text className="text-base font-semibold text-gray-800">
                    {item.date} - {item.hospital}
                </Text>
                <Tag color="blue" className="text-xs font-medium">{item.tag}</Tag>
            </div>
            <Title level={5} className="m-0 font-bold text-base">{item.type}</Title>
            <Text className="text-sm text-gray-700">
                **{item.symptoms.split(':')[0]}**: {item.symptoms.split(':')[1]}
            </Text>
            <Text className="text-sm text-gray-700">
                **{item.treatment.split(':')[0]}**: {item.treatment.split(':')[1]}
            </Text>
        </Space>
        <Button type="link" className="text-blue-600 self-start p-0 h-auto text-sm">Xem chi tiết</Button>
    </div>
);


const PatientDetailModal = ({ isVisible, onClose, patientRecord }) => {
    // ⭐️ STATE MỚI: Quản lý Modal kê đơn thuốc
    const [isPrescriptionModalVisible, setIsPrescriptionModalVisible] = useState(false);
    
    // Hàm mở Modal kê đơn
    const handleOpenPrescription = () => {
        setIsPrescriptionModalVisible(true);
    };

    // Hàm đóng Modal kê đơn
    const handleClosePrescription = () => {
        setIsPrescriptionModalVisible(false);
    };
    
    // Sử dụng dữ liệu giả định chi tiết
    const data = patientRecord || detailedPatientData; 

    const tabItems = [
        {
            key: '1',
            label: 'Lịch sử bệnh án (3)',
            children: (
                <div className="space-y-4 pt-4">
                    {data.history.map((item, index) => (
                        <HistoryItem key={index} item={item} />
                    ))}
                </div>
            ),
        },
        { key:'2',label :'Tiêm văc xin', children: <Text type="secondary" className='pt-4 block'>Chưa có thông tin tiêm vắc xin.</Text>},
        { key: '3', label:'Huyết áp', children: <Text type="secondary" className='pt-4 block'>Chưa có thông tin huyết áp.</Text>},

        { key: '4', label: 'Kết quả xét nghiệm', children: <Text type="secondary" className='pt-4 block'>Chưa có kết quả xét nghiệm.</Text> },
        { key: '5', label: 'Đơn thuốc', children: <Text type="secondary" className='pt-4 block'>Chưa có đơn thuốc.</Text> },
        { key: '6', label: 'Chỉ chủ của bác sĩ', children: <Text type="secondary" className='pt-4 block'>Không có chỉ dẫn.</Text> },
        
    ];

    return (
        <>
            <Modal
                open={isVisible}
                onCancel={onClose}
                width={'95%'} 
                style={{  top: 20 }} 
                closable={false} 
                footer={null} 
                wrapClassName="patient-detail-modal-wrap"
            >
                <div className="p-6 bg-white flex flex-col h-full"> 
                    {/* ⭐️ HEADER ⭐️ */}
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <Space>
                            <Button icon={<ArrowLeftOutlined />} onClick={onClose} type="text" className="text-xl text-gray-600 hover:text-blue-600" />
                            <Title level={3} className="m-0 font-bold">Hồ sơ bệnh nhân: {data.name}</Title>
                            <Text className="text-gray-500 text-base">Mã bệnh nhân: {data.id}</Text>
                        </Space>
                        <Space>
                            <Button icon={<PrinterOutlined />} type="default">In hồ sơ</Button>
                            <Button icon={<EditOutlined />} type="default">Sửa thông tin</Button>
                        </Space>
                    </div>
                    
                    {/* ⭐️ NỘI DUNG CHÍNH (3 CỘT) ⭐️ */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grow">
                        
                        {/* CỘT 1 & 2: THÔNG TIN CÁ NHÂN & AVATAR */}
                        <div className="md:col-span-1 flex flex-col space-y-6">
                            
                            {/* HỒ SƠ TÓM TẮT & AVATAR */}
                            <Card className="shadow-sm p-4 text-center">
                                <img src={data.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-gray-100" />
                                <Title level={4} className="m-0 font-bold">{data.name}</Title>
                                <Text className="text-gray-500 block mb-2">{data.id}</Text>
                                <Tag color="green" className='text-base px-3 py-1'>{data.status}</Tag>
                            </Card>
                            
                            {/* THÔNG TIN CÁ NHÂN */}
                            <Card className="shadow-sm p-4">
                                <Title level={5} className="m-0 mb-4">Thông tin cá nhân</Title>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-left">
                                    <InfoField label="Ngày sinh" value={data.birthDate} />
                                    <InfoField label="Giới tính" value={data.gender} />
                                    <InfoField label="Số điện thoại" value={data.phone} />
                                    <InfoField label="Email" value={data.email} />
                                    <InfoField label="Địa chỉ" value={data.address} />
                                    <InfoField label="Nhóm máu" value={data.bloodGroup} />
                                    <InfoField label="Dị ứng" value={data.allergies} isRed={true} />
                                    {/* Bệnh nền không có trong ảnh gốc nhưng thường có */}
                                </div>
                            </Card>
                        </div>

                        {/* CỘT 3: HÀNH ĐỘNG & LỊCH SỬ BỆNH ÁN */}
                        <div className="md:col-span-2 flex flex-col space-y-4">
                            
                            {/* HÀNH ĐỘNG */}
                            <Card className="shadow-sm p-4">
                                <Title level={5} className="m-0 mb-3">Thao tác</Title>
                                <Space>
                                    <Button icon={<EditOutlined />} type="default">Cập nhật bệnh án</Button>
                                    <Button 
                                          icon={<HeartOutlined />} 
                                          type="primary" 
                                          className="bg-blue-600"
                                          onClick={handleOpenPrescription} // ⭐️ GẮN HÀM MỞ MODAL
                                       >
                                           Kê đơn thuốc
                                        </Button>
                                </Space>
                            </Card>
                        
                        {/* TABS LỊCH SỬ */}
                        <Card className="shadow-sm grow p-0">
                            <Tabs defaultActiveKey="1" items={tabItems} size="large" className="p-4 pt-0" />
                        </Card>
                    </div>
                </div>
            </div>
        </Modal>

        {/* ⭐️ RENDER MODAL KÊ ĐƠN THUỐC ⭐️ */}
        <AddPrescriptionModal
            isVisible={isPrescriptionModalVisible}
            onClose={handleClosePrescription}
            patientName={data.name}
            dob={data.birthDate}
        />
        </>
    );
};

export default PatientDetailModal;