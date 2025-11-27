/* eslint-disable no-irregular-whitespace */
import { Modal, Button, Typography, Tabs, Space, Divider, Card, Tag } from 'antd';
import React, { useState } from 'react';
import { ArrowLeftOutlined, EditOutlined, PrinterOutlined, HeartOutlined } from '@ant-design/icons';
import AddPrescriptionModal from "./AddPrescriptionModal";
import EditPatientInfoModal from "./EditPatientInfoModal";
import AddHealthRecordModal from "./AddHealthRecordModal"; 

const { Title, Text } = Typography;

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


const PatientDetailModal = ({ isVisible, onClose, patientRecord, onRefresh }) => {
    // State quản lý các modal
    const [isPrescriptionModalVisible, setIsPrescriptionModalVisible] = useState(false);
    const [isEditInfoModalVisible, setIsEditInfoModalVisible] = useState(false);
    const [isHealthRecordModalVisible, setIsHealthRecordModalVisible] = useState(false);
    
    // Handlers cho modal kê đơn thuốc
    const handleOpenPrescription = () => {
        setIsPrescriptionModalVisible(true);
    };

    const handleClosePrescription = () => {
        setIsPrescriptionModalVisible(false);
    };

    // Handlers cho modal sửa thông tin
    const handleOpenEditInfo = () => {
        setIsEditInfoModalVisible(true);
    };

    const handleCloseEditInfo = () => {
        setIsEditInfoModalVisible(false);
    };

    // Handlers cho modal cập nhật bệnh án
    const handleOpenHealthRecord = () => {
        setIsHealthRecordModalVisible(true);
    };

    const handleCloseHealthRecord = () => {
        setIsHealthRecordModalVisible(false);
    };

    // Handler khi lưu thành công - refresh data
    const handleSuccess = () => {
        if (onRefresh) {
            onRefresh();
        }
    };
    
    // Default values for missing data
    const defaultData = {
        name: "Chưa cập nhật",
        id: "N/A",
        status: "Đang điều trị",
        avatarUrl: "https://via.placeholder.com/100/7F9CF5/ffffff?text=BN",
        birthDate: "Chưa cập nhật",
        gender: "Chưa xác định",
        age: "N/A",
        phone: "Chưa cập nhật",
        email: "Chưa cập nhật",
        address: "Chưa cập nhật",
        bloodGroup: "Chưa xác định",
        allergies: "Không có",
        weight: "N/A",
        height: "N/A",
        relationship: "Không rõ",
        roleInFamily: "Thành viên",
        history: []
    };
    
    // Merge patient data with defaults
    const data = patientRecord ? {
        ...defaultData,
        ...patientRecord,
        bloodGroup: patientRecord.bloodGroup || defaultData.bloodGroup,
        allergies: patientRecord.allergies || defaultData.allergies,
        history: patientRecord.history || defaultData.history
    } : defaultData;    const tabItems = [
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
                            <Button icon={<EditOutlined />} type="default" onClick={handleOpenEditInfo}>
                                Sửa thông tin
                            </Button>
                        </Space>
                    </div>                    {/* ⭐️ NỘI DUNG CHÍNH (3 CỘT) ⭐️ */}
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
                                    <InfoField label="Tuổi" value={data.age} />
                                    <InfoField label="Quan hệ" value={data.relationship} />
                                    <InfoField label="Số điện thoại" value={data.phone} />
                                    <InfoField label="Email" value={data.email} />
                                    <InfoField label="Cân nặng" value={data.weight ? `${data.weight} kg` : 'N/A'} />
                                    <InfoField label="Chiều cao" value={data.height ? `${data.height} cm` : 'N/A'} />
                                    <InfoField label="Nhóm máu" value={data.bloodGroup} />
                                    <InfoField label="Dị ứng" value={data.allergies} isRed={true} />
                                </div>
                                <Divider className="my-3" />
                                <div className="text-left">
                                    <InfoField label="Địa chỉ" value={data.address} />
                                </div>
                            </Card>
                        </div>                        {/* CỘT 3: HÀNH ĐỘNG & LỊCH SỬ BỆNH ÁN */}
                        <div className="md:col-span-2 flex flex-col space-y-4">
                            
                            {/* HÀNH ĐỘNG */}
                            <Card className="shadow-sm p-4">
                                <Title level={5} className="m-0 mb-3">Thao tác</Title>
                                <Space>
                                    <Button 
                                        icon={<EditOutlined />} 
                                        type="default"
                                        onClick={handleOpenHealthRecord}
                                    >
                                        Cập nhật bệnh án
                                    </Button>
                                    <Button 
                                        icon={<HeartOutlined />} 
                                        type="primary" 
                                        className="bg-blue-600"
                                        onClick={handleOpenPrescription}
                                    >
                                        Kê đơn thuốc
                                    </Button>
                                </Space>
                            </Card>                        {/* TABS LỊCH SỬ */}
                        <Card className="shadow-sm grow p-0">
                            <Tabs defaultActiveKey="1" items={tabItems} size="large" className="p-4 pt-0" />
                        </Card>
                    </div>
                </div>
            </div>
        </Modal>

        {/* MODAL KÊ ĐƠN THUỐC */}
        <AddPrescriptionModal
            isVisible={isPrescriptionModalVisible}
            onClose={handleClosePrescription}
            patientData={data}
            onSuccess={handleSuccess}
        />

        {/* MODAL SỬA THÔNG TIN */}
        <EditPatientInfoModal
            isVisible={isEditInfoModalVisible}
            onClose={handleCloseEditInfo}
            patientData={data}
            onSuccess={handleSuccess}
        />

        {/* MODAL CẬP NHẬT BỆNH ÁN */}
        <AddHealthRecordModal
            isVisible={isHealthRecordModalVisible}
            onClose={handleCloseHealthRecord}
            patientData={data}
            onSuccess={handleSuccess}
        />
        </>
    );
};

export default PatientDetailModal;