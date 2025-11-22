import { Modal, Button, Typography, Tabs, Tag, Space, Divider, Tooltip, Card } from 'antd';
import React from 'react';
import { DownloadOutlined, EditOutlined, ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
// import ApprovalStatusModal from './ApprovalStatusModal'; // Giữ nguyên import nếu bạn sử dụng nó
// ... (ApprovalStatusModal được giả định là được quản lý bởi component cha)

const { Title, Text } = Typography;

// --- Dữ liệu giả định cho Modal ---
const patientData = {
    name: "Lê Văn An",
    id: "BN123456",
    birthDate: "15/05/1985 (39 tuổi)",
    gender: "Nam",
    phone: "090xxxxxxx",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    bloodGroup: "O+",
    allergies: "Hải sản, Penicillin",
    chronicDiseases: "Cao huyết áp, Tiểu đường tuýp 2",
    avatarUrl: "path/to/avatar.jpg"
};

// Dữ liệu Lịch sử bệnh án (History)
const medicalHistory = [
    // ... (Dữ liệu lịch sử giữ nguyên)
    {
        date: "18/07/  2025",
        hospital: "Bệnh viện Đa khoa Quốc tế",
        type: "Khám tổng quát định kỳ",
        tag: "Khám tổng quát",
        symptoms: "Mệt mỏi, thỉnh thoảng đau đầu.",
        diagnosis: "Sức khỏe ổn định, cao huyết áp được kiểm soát tốt.",
        doctor: "BS. Nguyễn Văn Hùng",
        statusColor: 'blue'
    },
    {
        date: "02/03/  2025",
        hospital: "Phòng khám Tim mạch",
        type: "Tái khám cao huyết áp",
        tag: "Tái khám",
        symptoms: "Chẩn đoán: Tăng huyết áp vô căn. Chỉ số huyết áp 130/85 mmHg.",
        diagnosis: "Yêu cầu: Tiếp tục dùng thuốc theo đơn, tái khám sau 3 tháng. Theo dõi huyết áp tại nhà.",
        doctor: "BS. Trần Thị Mai",
        statusColor: 'orange'
    },
    {
        date: "15/11/2023",
        hospital: "Bệnh viện Tai Mũi Họng",
        type: "Viêm họng cấp",
        tag: "Điều trị",
        symptoms: "Triệu chứng: Đau họng, sổ mũi, ho khan.",
        diagnosis: "Chẩn đoán: Viêm họng cấp do virus. Kê đơn: Thuốc giảm đau, hạ sốt và siro ho.",
        doctor: "BS. Lê Minh Tuấn",
        statusColor: 'red'
    },
];

// Component hiển thị chi tiết một lần khám
const ExaminationDetail = ({ data }) => {
    // Hàm chọn màu cho Tag
    const getTagColor = (tag) => {
        switch (tag) {
            case 'Khám tổng quát': return 'blue';
            case 'Tái khám': return 'orange';
            case 'Điều trị': return 'red';
            default: return 'gray';
        }
    };

    return (
        <Card className="shadow-sm border border-gray-200 mb-4 p-0">
            <div className="flex justify-between items-start border-b pb-2 mb-2">
                <Space direction="vertical" size={2}>
                    <Text className="text-base font-semibold text-gray-800">{data.date} - {data.hospital}</Text>
                    <Text className="text-lg font-bold">{data.type}</Text>
                </Space>
                <Tag color={getTagColor(data.tag)} className="text-sm px-3 py-1 font-medium">{data.tag}</Tag>
            </div>
            
            {/* Nội dung chi tiết */}
            <div className="text-sm space-y-2">
                {data.symptoms && (
                    <div>
                        <Text className="font-semibold block">Triệu chứng:</Text>
                        <Text className="text-gray-700 ml-2">{data.symptoms}</Text>
                    </div>
                )}
                <div>
                    <Text className="font-semibold block">Chẩn đoán:</Text>
                    <Text className="text-gray-700 ml-2">{data.diagnosis}</Text>
                </div>
                <div className="pt-2">
                    <Text className="font-semibold text-sm">Bác sĩ điều trị: </Text>
                    <Text className="text-blue-600 font-medium">{data.doctor}</Text>
                </div>
            </div>
        </Card>
    );
};


// ⭐️ THÊM onApprove VÀO PROPS
const PatientRecordModal = ({ isVisible, onClose, patientRecord, onApprove }) => { 
    // Sử dụng dữ liệu giả định nếu không có patientRecord truyền vào
    const data = patientRecord || patientData; 
    
    // Items cho Tabs
    const tabItems = [
        {
            key: '1',
            label: 'Lịch sử bệnh án',
            children: (
                <div className="space-y-4">
                    {medicalHistory.map((item, index) => (
                        <ExaminationDetail key={index} data={item} />
                    ))}
                </div>
            ),
        },
        { key:'2',label :'Tiêm văc xin', children: <Text type="secondary" className='pt-4 block'>Chưa có thông tin tiêm vắc xin.</Text>},
        { key: '3', label:'Huyết áp', children: <Text type="secondary" className='pt-4 block'>Chưa có thông tin huyết áp.</Text>},
        { key: '4', label: 'Kết quả xét nghiệm', children: <Text type="secondary">Chưa có kết quả xét nghiệm gần đây.</Text> },
        { key: '5', label: 'Đơn thuốc', children: <Text type="secondary">Chưa có đơn thuốc gần đây.</Text> },
        { key: '6', label: 'Chỉ dẫn của bác sĩ', children: <Text type="secondary">Chưa có chỉ dẫn đặc biệt.</Text> },
    ];

    return (
        <Modal
            open={isVisible}
            onCancel={onClose}
            width={'90%'} // Modal rộng hơn để chứa nội dung
            style={{ top: 20 }} // Đẩy modal lên trên
            closable={false} // Tắt nút đóng mặc định
            footer={null} // Loại bỏ footer mặc định
        >
            <div className="p-4"> {/* Padding bên trong modal */}
                {/* ⭐️ HEADER VÀ THÔNG TIN CƠ BẢN ⭐️ */}
                <div className="flex flex-col mb-4">
                    {/* Hàng trên cùng: Tên, ID, Nút Hành động */}
                    <div className="flex justify-between items-center pb-4 border-b">
                        <Space>
                            <Button icon={<ArrowLeftOutlined />} onClick={onClose} type="text" className="text-xl text-gray-600 hover:text-blue-600" />
                            <Space direction="vertical" size={0}>
                                <Title level={3} className="m-0 font-bold">{data.name}</Title>
                                <Text className="text-gray-500 text-sm">ID: {data.id}</Text>
                            </Space>
                        </Space>
                        <Space>
                            <Button icon={<DownloadOutlined />} type="default">Tải xuống</Button>
                            
                            
                            {/* ⭐️ NÚT DUYỆT MỚI ⭐️ */}
                            <Button 
                                type="primary" 
                                className="bg-green-600 hover:bg-green-700"
                                // Khi nhấn Duyệt: Đóng Modal hiện tại và gọi hàm onApprove
                                onClick={() => {
                                    onClose(); 
                                    if (onApprove) {
                                        onApprove(data.name, data.id);
                                    }
                                }}
                            >
                                Duyệt
                            </Button>

                            <Button icon={<CloseOutlined />} onClick={onClose} type="text" className="text-xl text-gray-600" />
                        </Space>
                    </div>

                    {/* Hàng thứ 2: Avatar và Thông tin chi tiết */}
                    <div className="flex items-start mt-4">
                        {/* Avatar */}
                        <div className="mr-6">
                            <img src={data.avatarUrl || "https://via.placeholder.com/80"} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                        </div>

                        {/* Thông tin cá nhân cơ bản (Grid) */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8 w-full">
                            
                            {/* Dòng 1 */}
                            <div className="flex flex-col"><Text type="secondary">Ngày sinh</Text><Text className="font-medium">{data.birthDate}</Text></div>
                            <div className="flex flex-col"><Text type="secondary">Giới tính</Text><Text className="font-medium">{data.gender}</Text></div>
                            <div className="flex flex-col"><Text type="secondary">Số điện thoại</Text><Text className="font-medium">{data.phone}</Text></div>
                            
                            {/* Dòng 2 */}
                            <div className="flex flex-col"><Text type="secondary">Nhóm máu</Text><Text className="font-medium">{data.bloodGroup}</Text></div>
                            <div className="flex flex-col"><Text type="secondary">Dị ứng</Text><Text className="font-medium text-red-600">{data.allergies}</Text></div>
                            <div className="flex flex-col"><Text type="secondary">Bệnh nền</Text><Text className="font-medium">{data.chronicDiseases}</Text></div>
                        </div>
                    </div>
                </div>

                {/* ⭐️ TABS NỘI DUNG ⭐️ */}
                <Divider className="my-4" />
                <Tabs defaultActiveKey="1" items={tabItems} size="large" />
                
            </div>
        </Modal>
    );
};

export default PatientRecordModal;