// VitalsTab.jsx
import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import { LineChartOutlined } from '@ant-design/icons'; // Thêm icon Đo lường

const { Text } = Typography;

const VitalsTab = ({ vitalsHistory }) => (
    <div className="space-y-6 pt-4">
        <Text type="secondary" className="block mb-4">Theo dõi các chỉ số sức khỏe quan trọng</Text>
        
        {vitalsHistory.map((record) => (
            <div key={record.date} className="pb-4 border-b last:border-b-0">
                <div className="flex justify-between items-center mb-4">
                    <Text className="text-lg font-semibold text-gray-800">{record.date}</Text>
                    <Text type="secondary" className="cursor-pointer flex items-center space-x-1 hover:text-blue-500">
                        <LineChartOutlined />
                        <span>Đo lường</span>
                    </Text>
                </div>

                <Row gutter={[16, 16]}>
                    {[
                        { title: 'Huyết áp', value: record.bp, unit: 'mmHg' },
                        { title: 'Nhịp tim', value: record.hr, unit: 'bpm' },
                        { title: 'Nhiệt độ', value: record.temp, unit: '' },
                        { title: 'Cân nặng', value: record.weight, unit: '' },
                        { title: 'Chiều cao', value: record.height, unit: '' },
                    ].map((item, index) => (
                        <Col span={24} sm={8} md={4} key={index}>
                            <Card className="rounded-lg text-center shadow-sm">
                                <Text type="secondary" className="block text-sm">{item.title}</Text>
                                <Text className="text-xl font-bold block mt-1">{item.value}</Text>
                                <Text type="secondary" className="text-xs">{item.unit}</Text>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        ))}
    </div>
);

export default VitalsTab;