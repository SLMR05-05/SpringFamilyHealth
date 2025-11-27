import { Modal, Form, Input, DatePicker, Button, message } from 'antd';
import React from 'react';
import dayjs from 'dayjs';
import { visitHistoryApi } from '../../api';

const { TextArea } = Input;

const AddHealthRecordModal = ({ isVisible, onClose, patientData, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            
            // Format data for API - VisitHistory
            const visitData = {
                memberId: patientData.memberId,
                visitDate: values.recordDate ? values.recordDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
                reason: values.symptoms, // symptoms -> reason
                diagnosis: values.diagnosis,
                // treatment và notes không có trong VisitHistory entity, có thể thêm vào diagnosis
            };

            // Nếu có treatment, thêm vào diagnosis
            if (values.treatment) {
                visitData.diagnosis = `${values.diagnosis}\n\nĐiều trị: ${values.treatment}`;
            }
            if (values.notes) {
                visitData.diagnosis = `${visitData.diagnosis}\n\nGhi chú: ${values.notes}`;
            }

            // Call API to create visit history
            await visitHistoryApi.create(visitData);
            
            message.success('Cập nhật bệnh án thành công');
            
            form.resetFields();
            
            if (onSuccess) {
                onSuccess();
            }
            
            onClose();
        } catch (error) {
            if (error.errorFields) {
                message.error('Vui lòng kiểm tra lại thông tin');
            } else {
                console.error('Error creating health record:', error);
                message.error('Cập nhật bệnh án thất bại');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={isVisible}
            onCancel={onClose}
            title="Cập nhật bệnh án"
            width={700}
            footer={[
                <Button key="cancel" onClick={onClose} disabled={loading}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
                    Lưu bệnh án
                </Button>,
            ]}
        >
            <div className="mb-4">
                <p className="text-gray-600">
                    Bệnh nhân: <strong>{patientData?.name || 'N/A'}</strong>
                </p>
                <p className="text-gray-600">
                    Mã bệnh nhân: <strong>{patientData?.memberId || 'N/A'}</strong>
                </p>
            </div>

            <Form form={form} layout="vertical" initialValues={{ recordDate: dayjs() }}>
                <Form.Item
                    name="recordDate"
                    label="Ngày khám"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày khám' }]}
                >
                    <DatePicker 
                        format="DD/MM/YYYY" 
                        placeholder="Chọn ngày khám"
                        className="w-full"
                    />
                </Form.Item>

                <Form.Item
                    name="symptoms"
                    label="Lý do khám / Triệu chứng"
                    rules={[{ required: true, message: 'Vui lòng nhập lý do khám' }]}
                >
                    <TextArea 
                        rows={3} 
                        placeholder="Mô tả lý do khám và các triệu chứng của bệnh nhân..."
                    />
                </Form.Item>

                <Form.Item
                    name="diagnosis"
                    label="Chẩn đoán và điều trị"
                    rules={[{ required: true, message: 'Vui lòng nhập chẩn đoán' }]}
                >
                    <TextArea 
                        rows={4} 
                        placeholder="Nhập kết quả chẩn đoán và phương pháp điều trị..."
                    />
                </Form.Item>

                <Form.Item
                    name="treatment"
                    label="Phương pháp điều trị bổ sung"
                >
                    <TextArea 
                        rows={2} 
                        placeholder="Thêm chi tiết điều trị nếu cần..."
                    />
                </Form.Item>

                <Form.Item
                    name="notes"
                    label="Ghi chú thêm"
                >
                    <TextArea 
                        rows={2} 
                        placeholder="Thêm ghi chú nếu cần..."
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddHealthRecordModal;
