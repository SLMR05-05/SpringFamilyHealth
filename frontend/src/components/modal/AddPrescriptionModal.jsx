import { Modal, Button, Typography, Input, Checkbox, Space, Select,Divider } from 'antd';
import React, { useState } from 'react';
import { CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Dữ liệu thuốc mẫu ban đầu
const initialMedications = [
    { id: 1, drugName: "Metformin", dosage: "500mg", frequency: "Twice a day" },
    { id: 2, drugName: "Lisinopril", dosage: "10mg", frequency: "Once a day" },
];

const AddPrescriptionModal = ({ isVisible, onClose, patientName = "Jane Doe", dob = "01/23/1985" }) => {
    const [medications, setMedications] = useState(initialMedications);
    const [newDrug, setNewDrug] = useState({ drugName: '', dosage: '', frequency: '' });

    const handleSave = () => {
        // Logic để gửi dữ liệu chẩn đoán và đơn thuốc
        console.log("Saving Diagnosis and Prescription for:", patientName, medications);
        // Sau khi lưu, đóng modal
        onClose();
    };

    const handleDelete = (id) => {
        setMedications(medications.filter(med => med.id !== id));
    };

    const handleAddPrescription = () => {
        if (newDrug.drugName && newDrug.dosage && newDrug.frequency) {
            const newMed = {
                id: Date.now(),
                ...newDrug,
            };
            setMedications([...medications, newMed]);
            setNewDrug({ drugName: '', dosage: '', frequency: '' }); // Reset input
        }
    };
    
    // Tùy chọn tần suất
    const frequencyOptions = [
        "Once a day", 
        "Twice a day", 
        "Three times a day", 
        "Four times a day",
        "As needed"
    ];

    return (
        <Modal
            open={isVisible}
            onCancel={onClose}
            style={{ top: 20 }}
            width={800} // Kích thước cố định như trong ảnh
            closable={false}
            footer={null}
        >
            {/* HEADER */}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <Title level={4} className="m-0 font-bold">Thêm chẩn đoán & đơn thuốc</Title>
                <Button icon={<CloseOutlined />} type="text" onClick={onClose} />
            </div>

            {/* PATIENT INFO */}
            <Text className="text-gray-600 block mb-6">Bệnh nhân: {patientName}, DOB: {dob}</Text>

            {/* DIAGNOSIS AND TREATMENT PLAN */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                    <Text className="font-semibold block mb-2">Ghi chú chẩn đoán</Text>
                    <TextArea
                        rows={6}
                        placeholder="Nhập các phát hiện lâm sàng, triệu chứng và chẩn đoán..."
                        className="resize-none"
                    />
                    <Text type="secondary" className="text-xs block mt-1">Trình bày chi tiết các phát hiện lâm sàng và đánh giá.</Text>
                </div>
                <div>
                    <Text className="font-semibold block mb-2">Kế hoạch điều trị</Text>
                    <TextArea
                        rows={6}
                        placeholder="Phác thảo kế hoạch hành động được đề xuất, thay đổi lối sống..."
                        className="resize-none"
                    />
                    <Text type="secondary" className="text-xs block mt-1">Mô tả chiến lược điều trị không dùng thuốc.</Text>
                </div>
            </div>

            {/* MEDICATION PRESCRIBED */}
            <Title level={5} className="font-semibold mb-4">Đơn thuốc</Title>

            {/* TABLE HEADER */}
            <div className="grid grid-cols-10 gap-2 font-semibold text-gray-600 border-b pb-2 mb-2">
                <div className="col-span-4">Tên thuốc</div>
                <div className="col-span-3">Liều lượng</div>
                <div className="col-span-3">Tần suất</div>
                <div className="w-6"></div> {/* Column for Delete Icon */}
            </div>

            {/* EXISTING MEDICATIONS */}
            {medications.map((med) => (
                <div key={med.id} className="grid grid-cols-10 items-center gap-2 py-2 border-b border-gray-100">
                    <div className="col-span-4 text-gray-800">{med.drugName}</div>
                    <div className="col-span-3 text-gray-800">{med.dosage}</div>
                    <div className="col-span-3 text-gray-800">{med.frequency}</div>
                    <Button 
                        icon={<DeleteOutlined className='text-red-500' />} 
                        type="text" 
                        size="small"
                        onClick={() => handleDelete(med.id)}
                    />
                </div>
            ))}

            {/* INPUT ROW FOR NEW PRESCRIPTION */}
            <div className="grid grid-cols-10 items-center gap-2 py-2 mb-4">
                <Input 
                    className="col-span-4" 
                    placeholder="e.g., Atorvastatin" 
                    value={newDrug.drugName}
                    onChange={(e) => setNewDrug({...newDrug, drugName: e.target.value})}
                />
                <Input 
                    className="col-span-3" 
                    placeholder="e.g., 20mg" 
                    value={newDrug.dosage}
                    onChange={(e) => setNewDrug({...newDrug, dosage: e.target.value})}
                />
                <Select
                    className="col-span-3"
                    placeholder="Once a day"
                    value={newDrug.frequency || undefined}
                    onChange={(value) => setNewDrug({...newDrug, frequency: value})}
                >
                    {frequencyOptions.map(option => (
                        <Option key={option} value={option}>{option}</Option>
                    ))}
                </Select>
                
            </div>
            
            <Button 
                icon={<PlusOutlined />} 
                type="text" 
                className='text-green-600 p-0 text-left h-auto'
                onClick={handleAddPrescription}
            >
                Thêm đơn thuốc
            </Button>

            <Divider className="my-6" />

            {/* FOOTER ACTIONS */}
            <div className="flex justify-between items-center pt-4">
                <Space>
                    <Checkbox>Tôi xác nhận bệnh nhân đã đồng ý cập nhật hồ sơ này.</Checkbox>
                </Space>
                <Space>
                    <Button onClick={onClose}>Thoát</Button>
                    <Button 
                        type="primary" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleSave}
                    >
                        Lưu và Mã hóa Hồ sơ
                    </Button>
                </Space>
            </div>
        </Modal>
    );
};

export default AddPrescriptionModal;