    // PrescribeMed.jsx
    import React, { useState } from 'react';
    import { 
        Typography, Input, Button, Card, Divider, Row, Col, Tag, List, Empty 
    } from 'antd';
    import { 
        PlusOutlined, SearchOutlined, FileTextOutlined, HeartFilled, 
        MinusCircleOutlined 
    } from '@ant-design/icons';

    const { Text, Title } = Typography;
    const { TextArea } = Input;

    // --- DỮ LIỆU MẪU ---
    const popularMedications = [
        { name: 'Paracetamol 500mg', usage: 'Giảm đau - Hạ sốt', category: 'Thuốc giảm đau, hạ sốt' },
        { name: 'Amoxicillin 500mg', usage: 'Kháng sinh điều trị nhiễm khuẩn', category: 'Kháng sinh' },
        { name: 'Amlodipine 5mg', usage: 'Thuốc điều trị tăng huyết áp', category: 'Tim mạch' },
        { name: 'Omeprazole 20mg', usage: 'Giảm tiết acid dạ dày', category: 'Tiêu hóa' },
        { name: 'Vitamin C', usage: 'Bổ sung vitamin', category: 'Vitamin' },
    ];

    // --- Sub-component cho từng thuốc trong đơn ---
    const PrescriptionItem = ({ medication, index, onRemove }) => {
        // Sử dụng state cục bộ để quản lý liều lượng, tần suất, thời gian dùng
        const [dose, setDose] = useState('1 viên');
        const [freq, setFreq] = useState('1 lần/ngày');
        const [duration, setDuration] = useState('7 ngày');

        return (
            <div className="py-3 border-b border-gray-100">
                <div className="flex justify-between items-center mb-2">
                    <Text strong className="text-base text-purple-700">{index + 1}. {medication.name}</Text>
                    <Button 
                        type="text" 
                        icon={<MinusCircleOutlined className="text-red-500" />} 
                        onClick={() => onRemove(index)}
                        size="small"
                    >
                        Xóa
                    </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                    <Input 
                        placeholder="Liều dùng" 
                        value={dose} 
                        onChange={(e) => setDose(e.target.value)} 
                        addonBefore="Liều" 
                    />
                    <Input 
                        placeholder="Tần suất" 
                        value={freq} 
                        onChange={(e) => setFreq(e.target.value)} 
                        addonBefore="Tần suất" 
                    />
                    <Input 
                        placeholder="Thời gian" 
                        value={duration} 
                        onChange={(e) => setDuration(e.target.value)} 
                        addonBefore="Thời gian" 
                    />
                </div>
                <TextArea 
                    placeholder="Hướng dẫn sử dụng chi tiết (sau ăn, trước ngủ...)" 
                    rows={1} 
                    className="mt-2"
                />
            </div>
        );
    };


    // --- COMPONENT CHÍNH ---
    const PrescribeMed = ({ patientData }) => {
        const [diagnosis, setDiagnosis] = useState('');
        const [prescribedList, setPrescribedList] = useState([]);
        const [notes, setNotes] = useState('');

        // Hàm thêm thuốc vào đơn
        const handleAddMedication = (med) => {
            // Chỉ thêm nếu thuốc chưa có trong danh sách
            if (!prescribedList.find(p => p.name === med.name)) {
                // Thêm thuộc tính nhận dạng duy nhất (dùng timestamp) để key không bị trùng
                setPrescribedList([...prescribedList, { ...med, id: Date.now() + Math.random() }]);
            }
        };

        // Hàm xóa thuốc khỏi đơn
        const handleRemoveMedication = (index) => {
            const newList = prescribedList.filter((_, i) => i !== index);
            setPrescribedList(newList);
        };

        // Lấy dữ liệu bệnh nhân (dùng dữ liệu props từ PatientRecordModal)
        const data = patientData || {};
        const medicalInfo = data.medicalInfo || {};
        const canSubmit = diagnosis && prescribedList.length > 0;

        return (
            <div className="p-4 bg-gray-50 min-h-[70vh]">
                <Row gutter={24}>
                    
                    {/* 1. Cột Thông tin Bệnh nhân & Thuốc Phổ biến (TRÁI - 6/24) */}
                    <Col span={6}>
                        

                        <Card title={<Text strong>Thuốc phổ biến</Text>}>
                            <Input 
                                placeholder="Tìm kiếm thuốc..." 
                                prefix={<SearchOutlined className="mr-2" />} 
                                className="mb-3"
                            />
                            <div className="max-h-60 overflow-y-auto"> {/* Thêm cuộn cho danh sách thuốc phổ biến */}
                                <List
                                    size="small"
                                    itemLayout="horizontal"
                                    dataSource={popularMedications}
                                    renderItem={(item) => (
                                        <List.Item 
                                            actions={[
                                                <Button 
                                                    icon={<PlusOutlined />} 
                                                    type="text" 
                                                    className="text-green-600"
                                                    onClick={() => handleAddMedication(item)}
                                                    key="add"
                                                />,
                                            ]}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <List.Item.Meta
                                                title={<Text strong className="text-sm">{item.name}</Text>}
                                                description={
                                                    <Text type="secondary" className="text-xs italic text-gray-500">{item.usage}</Text>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Card>
                    </Col>

                    {/* 2. Cột Phiếu Kê đơn (PHẢI - 18/24) */}
                    <Col span={18}>
                        <Card>
                            <div className="flex items-center space-x-3 mb-4">
                                <FileTextOutlined className="text-2xl text-blue-600" />
                                <Title level={4} className="m-0">Tạo đơn thuốc cho bệnh nhân {data.name || 'N/A'}</Title>
                            </div>
                            
                            <div className="mb-4">
                                <Text strong className="block mb-1">Chẩn đoán</Text>
                                <Input 
                                    placeholder="Nhập chẩn đoán..." 
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                />
                            </div>

                            <Divider orientation="left" className="my-4">
                                <div className="flex justify-between items-center w-full">
                                    <Text strong>Danh sách thuốc</Text>
                                    
                                </div>
                            </Divider>

                            {prescribedList.length === 0 ? (
                                <Empty 
                                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                                    description={
                                        <Text type="secondary">
                                            Chưa có thuốc nào được thêm. Nhấn "Thêm thuốc" hoặc chọn từ danh sách phổ biến bên trái.
                                        </Text>
                                    }
                                    className="my-8"
                                />
                            ) : (
                                <div className="space-y-2 max-h-80 overflow-y-auto pr-4"> {/* Thêm cuộn cho danh sách thuốc đã kê */}
                                    {prescribedList.map((med, index) => (
                                        <PrescriptionItem 
                                            key={med.id} // Sử dụng ID duy nhất
                                            medication={med} 
                                            index={index} 
                                            onRemove={handleRemoveMedication} 
                                        />
                                    ))}
                                </div>
                            )}
                            
                            <Divider className="my-4" />

                            <div className="mb-4">
                                <Text strong className="block mb-1">Ghi chú</Text>
                                <TextArea 
                                    placeholder="Ghi chú thêm cho bệnh nhân..." 
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <Button onClick={() => {
                                    setDiagnosis(''); setPrescribedList([]); setNotes('');
                                }}>Hủy</Button>
                                <Button 
                                    type="primary" 
                                    icon={<FileTextOutlined />} 
                                    onClick={() => alert('Đơn thuốc đã được tạo thành công!')}
                                    disabled={!canSubmit} // Vô hiệu hóa nếu thiếu chẩn đoán hoặc thuốc
                                >
                                    Tạo đơn thuốc
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    };

    export default PrescribeMed;