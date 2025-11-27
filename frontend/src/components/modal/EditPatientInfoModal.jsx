import { Modal, Form, Input, Select, DatePicker, Button, message } from 'antd';
import React from 'react';
import dayjs from 'dayjs';
import { memberApi } from '../../api';

const { Option } = Select;

const EditPatientInfoModal = ({ isVisible, onClose, patientData, onSuccess }) => {
    const [form] = Form.useForm();

    // Initialize form with patient data when modal opens
    React.useEffect(() => {
        if (isVisible && patientData) {
            form.setFieldsValue({
                name: patientData.name,
                phone: patientData.phone,
                email: patientData.email,
                address: patientData.address,
                gender: patientData.gender,
                dayOfBirth: patientData.birthDate ? dayjs(patientData.birthDate, 'DD/MM/YYYY') : null,
                weight: patientData.weight,
                height: patientData.height,
                bloodGroup: patientData.bloodGroup,
                allergies: patientData.allergies,
                relationship: patientData.relationship,
            });
        }
    }, [isVisible, patientData, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            
            // Format data for API - exclude name (name belongs to User entity) and format date
            // eslint-disable-next-line no-unused-vars
            const { name, ...memberData } = values;
            const formattedData = {
                ...memberData,
                userId: patientData.userId,
                familyId: patientData.familyId,
                dayOfBirth: values.dayOfBirth ? values.dayOfBirth.format('YYYY-MM-DD') : null,
            };

            // Call API to update member
            await memberApi.update(patientData.memberId, formattedData);
            
            message.success('Cập nhật thông tin bệnh nhân thành công');
            
            if (onSuccess) {
                onSuccess();
            }
            
            onClose();
        } catch (error) {
            if (error.errorFields) {
                message.error('Vui lòng kiểm tra lại thông tin');
            } else {
                console.error('Error updating patient:', error);
                message.error('Cập nhật thông tin thất bại');
            }
        }
    };

    return (
        <Modal
            open={isVisible}
            onCancel={onClose}
            title="Sửa thông tin bệnh nhân"
            width={700}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Lưu thay đổi
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="name"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                        <Input placeholder="Nhập họ và tên" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label="Giới tính"
                        rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                    >
                        <Select placeholder="Chọn giới tính">
                            <Option value="Nam">Nam</Option>
                            <Option value="Nữ">Nữ</Option>
                            <Option value="Khác">Khác</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="dayOfBirth"
                        label="Ngày sinh"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                    >
                        <DatePicker 
                            format="DD/MM/YYYY" 
                            placeholder="Chọn ngày sinh"
                            className="w-full"
                        />
                    </Form.Item>

                    <Form.Item
                        name="relationship"
                        label="Quan hệ"
                    >
                        <Input placeholder="Vd: Con, Vợ, Chồng..." />
                    </Form.Item>

                    <Form.Item
                        name="weight"
                        label="Cân nặng (kg)"
                    >
                        <Input type="number" placeholder="Nhập cân nặng" />
                    </Form.Item>

                    <Form.Item
                        name="height"
                        label="Chiều cao (cm)"
                    >
                        <Input type="number" placeholder="Nhập chiều cao" />
                    </Form.Item>

                    <Form.Item
                        name="bloodGroup"
                        label="Nhóm máu"
                    >
                        <Select placeholder="Chọn nhóm máu">
                            <Option value="A">A</Option>
                            <Option value="B">B</Option>
                            <Option value="AB">AB</Option>
                            <Option value="O">O</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="allergies"
                        label="Dị ứng"
                    >
                        <Input placeholder="Nhập thông tin dị ứng" />
                    </Form.Item>
                </div>

                <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                >
                    <Input.TextArea rows={2} placeholder="Nhập địa chỉ đầy đủ" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditPatientInfoModal;
