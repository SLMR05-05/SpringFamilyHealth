import { Modal, Button, Typography, Input, Checkbox, Space, Select, Divider, message } from 'antd';
import React, { useState } from 'react';
import { CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { prescriptionApi, prescriptionMedicationApi, visitHistoryApi } from '../../api';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AddPrescriptionModal = ({ isVisible, onClose, patientData, onSuccess }) => {
    const [medications, setMedications] = useState([]);
    const [newDrug, setNewDrug] = useState({ drugName: '', dosage: '', frequency: '' });
    const [diagnosisNotes, setDiagnosisNotes] = useState('');
    const [treatmentPlan, setTreatmentPlan] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        try {
            // Validation
            if (!diagnosisNotes.trim()) {
                message.error('Vui lòng nhập ghi chú chẩn đoán');
                return;
            }
            if (!treatmentPlan.trim()) {
                message.error('Vui lòng nhập kế hoạch điều trị');
                return;
            }
            if (medications.length === 0) {
                message.error('Vui lòng thêm ít nhất một loại thuốc');
                return;
            }
            if (!confirmed) {
                message.error('Vui lòng xác nhận đồng ý của bệnh nhân');
                return;
            }

            setLoading(true);

            // Step 1: Create visit history first (bệnh án)
            let visit;
            try {
                const visitData = {
                    memberId: patientData.memberId,
                    visitDate: new Date().toISOString().split('T')[0],
                    reason: `Kê đơn thuốc - ${medications.length} loại thuốc`,
                    diagnosis: `${diagnosisNotes}\n\nĐiều trị: ${treatmentPlan}`,
                };

                const response = await visitHistoryApi.create(visitData);
                console.log('✅ Step 1 - Full response:', response);
                
                // Handle both raw axios response and extracted data
                visit = response.data || response;
                console.log('✅ Step 1 - Visit data:', visit);
                
                if (!visit || !visit.visitId) {
                    console.error('Visit object:', visit);
                    throw new Error('Visit response không có visitId');
                }
            } catch (error) {
                console.error('❌ Step 1 failed:', error);
                throw new Error(`Không thể tạo bệnh án: ${error.message}`);
            }
            
            // Step 2: Create prescription linked to visit
            let prescription;
            try {
                const prescriptionData = {
                    memberId: patientData.memberId,
                    visitId: visit.visitId,
                    note: `Đơn thuốc gồm ${medications.length} loại: ${medications.map(m => m.drugName).join(', ')}`,
                };

                console.log('📝 Step 2 - Prescription payload:', prescriptionData);
                const response = await prescriptionApi.create(prescriptionData);
                
                // Handle both raw axios response and extracted data
                prescription = response.data || response;
                console.log('✅ Step 2 - Created prescription:', prescription);
                
                if (!prescription || !prescription.prescriptionId) {
                    throw new Error('Prescription response không có prescriptionId');
                }
            } catch (error) {
                console.error('❌ Step 2 failed:', error);
                throw new Error(`Không thể tạo đơn thuốc: ${error.message}`);
            }
            
            // Step 3: Add medications to prescription using by-name endpoint
            try {
                for (const med of medications) {
                    await prescriptionMedicationApi.createByName({
                        prescriptionId: prescription.prescriptionId,
                        medicationName: med.drugName,
                        dosage: med.dosage,
                        frequency: med.frequency,
                    });
                }
                console.log('✅ Step 3 - Added medications');
            } catch (error) {
                console.error('❌ Step 3 failed:', error);
                throw new Error(`Không thể thêm thuốc vào đơn: ${error.message}`);
            }

            message.success('Kê đơn thuốc thành công');
            
            // Reset form
            setMedications([]);
            setDiagnosisNotes('');
            setTreatmentPlan('');
            setConfirmed(false);
            
            if (onSuccess) {
                onSuccess();
            }
            
            onClose();
        } catch (error) {
            console.error('Error saving prescription:', error);
            const errorMsg = error.message || 'Lưu đơn thuốc thất bại';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
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
            <Text className="text-gray-600 block mb-6">
                Bệnh nhân: {patientData?.name || 'N/A'}, Mã BN: {patientData?.memberId || 'N/A'}
            </Text>

            {/* DIAGNOSIS AND TREATMENT PLAN */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                    <Text className="font-semibold block mb-2">Ghi chú chẩn đoán</Text>
                    <TextArea
                        rows={6}
                        placeholder="Nhập các phát hiện lâm sàng, triệu chứng và chẩn đoán..."
                        className="resize-none"
                        value={diagnosisNotes}
                        onChange={(e) => setDiagnosisNotes(e.target.value)}
                    />
                    <Text type="secondary" className="text-xs block mt-1">Trình bày chi tiết các phát hiện lâm sàng và đánh giá.</Text>
                </div>
                <div>
                    <Text className="font-semibold block mb-2">Kế hoạch điều trị</Text>
                    <TextArea
                        rows={6}
                        placeholder="Phác thảo kế hoạch hành động được đề xuất, thay đổi lối sống..."
                        className="resize-none"
                        value={treatmentPlan}
                        onChange={(e) => setTreatmentPlan(e.target.value)}
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
                    <Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}>
                        Tôi xác nhận bệnh nhân đã đồng ý cập nhật hồ sơ này.
                    </Checkbox>
                </Space>
                <Space>
                    <Button onClick={onClose} disabled={loading}>Thoát</Button>
                    <Button 
                        type="primary" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleSave}
                        loading={loading}
                    >
                        Lưu và Mã hóa Hồ sơ
                    </Button>
                </Space>
            </div>
        </Modal>
    );
};

export default AddPrescriptionModal;