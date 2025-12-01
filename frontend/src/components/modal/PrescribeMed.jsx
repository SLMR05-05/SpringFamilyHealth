    // PrescribeMed.jsx
    import React, { useState, useEffect } from 'react';
    import { 
        Typography, Input, Button, Card, Divider, Row, Col, Tag, List, Empty, Spin, Select
    } from 'antd';
    import { message } from 'antd';
    import { 
        PlusOutlined, SearchOutlined, FileTextOutlined, HeartFilled, 
        MinusCircleOutlined 
    } from '@ant-design/icons';

    const { Text, Title } = Typography;
    const { TextArea } = Input;
    const { Option } = Select;

    const DOSE_OPTIONS = ['1 viên', '2 viên', '3 viên', '5 ml', '10 ml'];
    const FREQ_OPTIONS = ['1 lần/ngày', '2 lần/ngày', '3 lần/ngày', 'Sáng', 'Trưa', 'Tối'];
    const DURATION_OPTIONS = ['3 ngày', '5 ngày', '7 ngày', '10 ngày', '14 ngày'];

    // --- DỮ LIỆU MẪU ---
    // will be loaded from API
    // const popularMedications = [];
    import medicationApi from '../../api/medicationApi';
    import prescriptionApi from '../../api/prescriptionApi';
    import { useAuth } from '../../context/AuthProvider';

    // --- Sub-component cho từng thuốc trong đơn ---
    const PrescriptionItem = ({ medication, index, onRemove, onChange }) => {
        // controlled component: values come from medication prop
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
                    <Select
                        value={medication.dose}
                        onChange={(val) => onChange(index, 'dose', val)}
                        style={{ width: '100%' }}
                        placeholder="Liều"
                    >
                        {DOSE_OPTIONS.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                    </Select>

                    <Select
                        value={medication.freq}
                        onChange={(val) => onChange(index, 'freq', val)}
                        style={{ width: '100%' }}
                        placeholder="Tần suất"
                    >
                        {FREQ_OPTIONS.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                    </Select>

                    <Select
                        value={medication.duration}
                        onChange={(val) => onChange(index, 'duration', val)}
                        style={{ width: '100%' }}
                        placeholder="Thời gian"
                    >
                        {DURATION_OPTIONS.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                    </Select>
                </div>
                <TextArea 
                    placeholder="Hướng dẫn sử dụng chi tiết (sau ăn, trước ngủ...)" 
                    rows={1} 
                    className="mt-2"
                    value={medication.instructions}
                    onChange={(e) => onChange(index, 'instructions', e.target.value)}
                />
            </div>
        );
    };


    // --- COMPONENT CHÍNH ---
    const PrescribeMed = ({ patientData }) => {
        const [diagnosis, setDiagnosis] = useState('');
        const [prescribedList, setPrescribedList] = useState([]);
        const [notes, setNotes] = useState('');
        const [popularMedications, setPopularMedications] = useState([]);
        const [loadingMeds, setLoadingMeds] = useState(false);
        const [saving, setSaving] = useState(false);

        // get current user (doctor) id if available
        const { user } = useAuth();

        // Hàm thêm thuốc vào đơn
        const handleAddMedication = (med) => {
            // avoid duplicates by medication id or name
            if (!prescribedList.find(p => p.medicationId === med.id || p.name === med.name)) {
                const newItem = {
                    id: Date.now() + Math.random(),
                    medicationId: med.id || null,
                    name: med.name,
                    dose: '1 viên',
                    freq: '1 lần/ngày',
                    duration: '7 ngày',
                    instructions: ''
                };
                setPrescribedList(prev => [...prev, newItem]);
            }
        };

        const handleChangeMedication = (index, field, value) => {
            setPrescribedList(prev => prev.map((it, i) => i === index ? { ...it, [field]: value } : it));
        };

        // Hàm xóa thuốc khỏi đơn
        const handleRemoveMedication = (index) => {
            const newList = prescribedList.filter((_, i) => i !== index);
            setPrescribedList(newList);
        };

        // load medications from API
        useEffect(() => {
            const loadMeds = async () => {
                setLoadingMeds(true);
                try {
                    const resp = await medicationApi.getAll(0, 50);
                    console.debug('medicationApi.getAll response:', resp);
                    let items = resp?.data || resp?.result || resp || [];
                    if (items && items.data && Array.isArray(items.data)) items = items.data;
                    if (resp?.data && resp.data.content && Array.isArray(resp.data.content)) items = resp.data.content;
                    // normalize to array
                    if (!Array.isArray(items)) {
                        console.warn('medicationApi returned non-array items', items);
                        items = [];
                    }
                    // Map backend DTO to frontend fields (medicationName -> name, medicationId -> id)
                    const normalized = (items || []).map(it => ({
                        id: it.medicationId || it.id || null,
                        name: it.medicationName || it.medication_name || it.name || it.medName || '',
                        usage: it.usage || it.description || it.category || ''
                    }));
                    setPopularMedications(normalized);
                } catch (e) {
                    console.warn('Failed to load medications', e);
                    setPopularMedications([]);
                } finally { setLoadingMeds(false); }
            };
            loadMeds();
        }, []);

        const handleSavePrescription = async () => {
            if (!diagnosis || prescribedList.length === 0) {
                message.error('Vui lòng nhập chẩn đoán và ít nhất 1 thuốc');
                return;
            }
            const memberId = data.id || data.memberId || data.userId || null;
            if (!memberId) {
                message.error('Không xác định bệnh nhân');
                return;
            }

            // Map frontend fields to backend DTO expected names:
            // - backend expects `note` (not `notes` or `diagnosis`)
            // - prescription medication expects `dosage` (not `dose`)
            const noteValue = diagnosis ? (diagnosis + (notes ? '\n' + notes : '')) : (notes || '');
                const payload = {
                memberId,
                doctorId: user?.userId || null,
                note: noteValue,
                medications: prescribedList.map(m => ({
                    medicationId: m.medicationId,
                    name: m.name,
                    // Gộp liều và tần suất vào trường `dosage` (ví dụ: "1 viên | 2 lần/ngày")
                    dosage: `${m.dose || m.dosage || ''}${m.freq ? ' | ' + m.freq : ''}`,
                    duration: m.duration,
                    // include other fields if backend later supports them
                    instructions: m.instructions
                }))
            };

                try {
                    setSaving(true);
                    await prescriptionApi.create(payload);
                    message.success('Lưu đơn thuốc thành công');
                // reset form
                setDiagnosis(''); setPrescribedList([]); setNotes('');
            } catch (e) {
                console.error('Failed to save prescription', e);
                message.error('Không lưu được đơn thuốc');
            } finally { setSaving(false); }
        };

        // Lấy dữ liệu bệnh nhân (dùng dữ liệu props từ PatientRecordModal)
        const data = patientData || {};
        const canSubmit = diagnosis && prescribedList.length > 0;

        return (
            <div className="p-4 bg-gray-50 min-h-[70vh]">
                <Row gutter={24}>
                    
                    {/* 1. Cột Thông tin Bệnh nhân & Thuốc Phổ biến (TRÁI - 6/24) */}
                    <Col span={6}>
                        

                        <Card title={<Text strong>Danh sách thuốc</Text>}>
                            <Input 
                                placeholder="Tìm kiếm thuốc..." 
                                prefix={<SearchOutlined className="mr-2" />} 
                                className="mb-3"
                            />
                                    <div className="max-h-60 overflow-y-auto"> {/* Thêm cuộn cho danh sách thuốc phổ biến */}
                                        {loadingMeds ? (
                                            <div className="py-4 text-center"><Spin /></div>
                                        ) : (
                                            popularMedications.length === 0 ? (
                                                <div className="py-6 text-center">
                                                    <Empty description={<span>Chưa có thuốc để hiển thị — kiểm tra API hoặc thêm thuốc vào hệ thống</span>} />
                                                </div>
                                            ) : (
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
                                                                    <Text type="secondary" className="text-xs italic text-gray-500">{item.usage || item.category || ''}</Text>
                                                                }
                                                            />
                                                        </List.Item>
                                                    )}
                                                />
                                            )
                                        )}
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
                                            onChange={handleChangeMedication}
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
                                    onClick={handleSavePrescription}
                                    disabled={!canSubmit || saving} // Vô hiệu hóa nếu thiếu chẩn đoán hoặc thuốc
                                    loading={saving}
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