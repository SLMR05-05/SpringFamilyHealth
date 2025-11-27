import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, Form, Input, Select, DatePicker, TimePicker, Space, message, Divider ,Row ,Col} from 'antd';
import { UserOutlined, ClockCircleOutlined, CalendarOutlined, HeartOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

// Dữ liệu giả định
const PATIENT_LIST = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D'];
const APPOINTMENT_TYPES = ['Khám tổng quát', 'Tái khám', 'Tư vấn sức khỏe', 'Kiểm tra định kỳ', 'Khám chuyên khoa'];

const CreateAppointmentModal = ({ open, onClose, onSave, selectedDateKey }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Reset form và gán ngày mặc định khi modal mở
    useEffect(() => {
        if (open) {
            form.resetFields();
            // Thiết lập ngày mặc định nếu có ngày được chọn từ lịch
            if (selectedDateKey) {
                const [day, month, year] = selectedDateKey.split('/');
                form.setFieldsValue({
                    date: dayjs(`${year}-${month}-${day}`, 'YYYY-MM-DD'),
                    time: dayjs('09:00', 'HH:mm') // Giờ mặc định
                });
            } else {
                form.setFieldsValue({
                    time: dayjs('09:00', 'HH:mm')
                });
            }
        }
    }, [open, form, selectedDateKey]);

    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);
            
            // Format dữ liệu
            const dateKey = values.date.format('DD/MM/YYYY');
            const timeStr = values.time.format('HH:mm');
            const period = values.time.hour() < 12 ? 'SÁNG' : 'CHIỀU';

            const newAppointment = {
                dateKey,
                time: timeStr,
                period: period,
                name: values.patientName,
                type: values.type,
                notes: values.notes || 'Không có ghi chú.',
            };

            // Gọi hàm onSave từ component cha
            await Promise.resolve(onSave(newAppointment)); 

            message.success(`Đã tạo lịch hẹn thành công cho ${values.patientName} vào ${timeStr}, ${dateKey}.`);
            onClose();

        } catch (error) {
            message.error("Tạo lịch hẹn thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={<Title level={4} className="m-0 text-indigo-600">Tạo Lịch Hẹn Mới</Title>}
            open={open}
            onCancel={onClose}
            footer={null}
            closeIcon={<CloseOutlined className="text-gray-500 hover:text-red-500 transition" />}
            width={600}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
                className="mt-4"
            >
                <Form.Item
                    name="patientName"
                    label="Chọn Bệnh Nhân"
                    rules={[{ required: true, message: 'Vui lòng chọn bệnh nhân!' }]}
                >
                    <Select
                        showSearch
                        placeholder="Tìm kiếm hoặc chọn bệnh nhân"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {PATIENT_LIST.map(name => (
                            <Option key={name} value={name}>{name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="type"
                    label="Loại Cuộc Hẹn"
                    rules={[{ required: true, message: 'Vui lòng chọn loại cuộc hẹn!' }]}
                >
                    <Select placeholder="Chọn loại khám">
                        {APPOINTMENT_TYPES.map(type => (
                            <Option key={type} value={type}><HeartOutlined /> {type}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="date"
                            label="Ngày Hẹn"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày hẹn!' }]}
                        >
                            <DatePicker 
                                prefix={<CalendarOutlined />} 
                                format="DD/MM/YYYY" 
                                className="w-full"
                                disabledDate={(current) => current && current < dayjs().startOf('day')} // Không cho chọn ngày quá khứ
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="time"
                            label="Giờ Hẹn"
                            rules={[{ required: true, message: 'Vui lòng chọn giờ hẹn!' }]}
                        >
                            <TimePicker prefix={<ClockCircleOutlined />} format="HH:mm" className="w-full" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="notes"
                    label="Ghi Chú"
                >
                    <Input.TextArea rows={3} placeholder="Ghi chú về tình trạng hoặc yêu cầu đặc biệt..." />
                </Form.Item>

                <Divider />

                <Form.Item className="mb-0">
                    <Space className="w-full justify-end">
                        <Button onClick={onClose} disabled={loading}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" className="bg-indigo-600 hover:bg-indigo-700" loading={loading} icon={<SaveOutlined />}>
                            Tạo Lịch Hẹn
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateAppointmentModal;