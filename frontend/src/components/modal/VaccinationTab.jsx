// VaccinationTab.jsx
import React, { useState } from 'react';
import { Typography, Button, Form, Input, DatePicker, message } from 'antd';
import { CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import vaccinationApi from '../../api/vaccinationApi';

const { Text } = Typography;
const { TextArea } = Input;

const VaccinationTab = ({ vaccinations, memberId, onVaccinationAdded }) => {
    const [form] = Form.useForm();
    const [isAddingVaccination, setIsAddingVaccination] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAddVaccination = async (values) => {
        if (!memberId) {
            message.error('Không tìm thấy thông tin bệnh nhân');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                memberId: memberId,
                vaccineName: values.vaccineName,
                vaccinationDate: values.vaccinationDate.format('YYYY-MM-DD'),
                nextDose: values.nextDose ? values.nextDose.format('YYYY-MM-DD') : null,
                location: values.location || null,
                notes: values.notes || null
            };

            await vaccinationApi.create(payload);
            message.success('Đã thêm thông tin tiêm chủng');
            form.resetFields();
            setIsAddingVaccination(false);
            
            // Callback to refresh vaccination list
            if (onVaccinationAdded) {
                onVaccinationAdded();
            }
        } catch (error) {
            console.error('Error adding vaccination:', error);
            message.error('Không thể thêm thông tin tiêm chủng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pt-4">
            <div className="flex justify-between items-center mb-4">
                <Text type="secondary">Lịch sử tiêm chủng của bệnh nhân</Text>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddingVaccination(!isAddingVaccination)}
                >
                    {isAddingVaccination ? 'Hủy' : 'Thêm vaccine'}
                </Button>
            </div>

            {isAddingVaccination && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <Text className="block mb-3 font-semibold">Thêm thông tin tiêm chủng mới</Text>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleAddVaccination}
                    >
                        <Form.Item
                            name="vaccineName"
                            label="Tên vaccine"
                            rules={[{ required: true, message: 'Vui lòng nhập tên vaccine' }]}
                        >
                            <Input placeholder="Ví dụ: Vắc-xin COVID-19, Vắc-xin cúm..." />
                        </Form.Item>

                        <Form.Item
                            name="vaccinationDate"
                            label="Ngày tiêm"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày tiêm' }]}
                        >
                            <DatePicker 
                                className="w-full" 
                                format="DD/MM/YYYY"
                                placeholder="Chọn ngày tiêm"
                            />
                        </Form.Item>

                        <Form.Item
                            name="nextDose"
                            label="Mũi tiếp theo (tùy chọn)"
                        >
                            <DatePicker 
                                className="w-full" 
                                format="DD/MM/YYYY"
                                placeholder="Chọn ngày mũi tiếp theo"
                            />
                        </Form.Item>

                        <Form.Item
                            name="location"
                            label="Nơi tiêm (tùy chọn)"
                        >
                            <Input placeholder="Ví dụ: Bệnh viện ABC, Trạm y tế XYZ..." />
                        </Form.Item>

                        <Form.Item
                            name="notes"
                            label="Ghi chú (tùy chọn)"
                        >
                            <TextArea 
                                rows={3} 
                                placeholder="Ghi chú về phản ứng sau tiêm, liều lượng..."
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                                Lưu thông tin
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}

            {!vaccinations || vaccinations.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    <Text type="secondary">Chưa có lịch sử tiêm chủng</Text>
                </div>
            ) : (
                vaccinations.map((vax, index) => {
                    const idKey = vax.vaccinationId || vax.vaccine_id || vax.id || index;
                    const vaccineName = vax.vaccineName || vax.name || vax.vaccine_name || 'Vaccine';
                    const vaccinationDate = vax.vaccinationDate || vax.date_given || vax.date || null;
                    const nextDose = vax.nextDose || vax.next_dose || null;
                    const location = vax.location || null;
                    const notes = vax.notes || vax.note || null;
                    const doctorRef = vax.doctorId || vax.doctor_id || null;

                    return (
                        <div key={idKey} className="flex justify-between items-start pb-4 border-b last:border-b-0">
                            <div className="flex space-x-4 w-full">
                                <div className="flex-shrink-0">
                                    <CheckCircleOutlined className="text-lg mt-1 text-green-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <Text className="font-semibold text-gray-800 text-lg">{vaccineName}</Text>
                                        {doctorRef && (
                                            <Text type="secondary" className="text-sm">Bác sĩ: {doctorRef}</Text>
                                        )}
                                    </div>

                                    <div className="mt-1 text-sm text-gray-600">
                                        <div>Ngày tiêm: {vaccinationDate ? dayjs(vaccinationDate).format('DD/MM/YYYY') : 'Chưa cập nhật'}</div>
                                        {nextDose && (
                                            <div className="mt-2 p-2 bg-blue-50 rounded-md inline-block">
                                                <div className="font-semibold text-blue-700 text-sm">Mũi tiếp theo</div>
                                                <div className="text-blue-700 text-sm">{dayjs(nextDose).format('DD/MM/YYYY')}</div>
                                            </div>
                                        )}

                                        {notes && (
                                            <div className="mt-2 p-2 bg-gray-50 rounded-md">
                                                <div className="font-semibold text-gray-700 text-sm">Ghi chú</div>
                                                <div className="text-sm text-gray-600">{notes}</div>
                                            </div>
                                        )}

                                        {location && (
                                            <div className="mt-2 text-sm text-gray-700">
                                                <div className="font-semibold">Nơi tiêm</div>
                                                <div className="text-gray-600">{location}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default VaccinationTab;