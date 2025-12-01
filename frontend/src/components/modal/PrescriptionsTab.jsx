// PrescriptionsTab.jsx
import React from 'react';
import { Typography } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const PrescriptionsTab = ({ prescriptions }) => (
    <div className="space-y-6 pt-4">
        <Text type="secondary" className="block mb-4">Lịch sử các đơn thuốc đã được kê</Text>

        {prescriptions.map((p) => (
            <div key={p.date} className="pb-4 border-b last:border-b-0">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-4">
                        <FileTextOutlined className="text-lg text-purple-600" />
                        <Text className="font-semibold text-gray-800">Đơn thuốc</Text>
                        <Text type="secondary" className="text-sm">BS. {p.doctor}</Text>
                    </div>
                    <Text type="secondary" className="text-sm">{p.date}</Text>
                </div>

                <div className="ml-8 space-y-3">
                    {p.medications.map((med) => (
                        <div key={med.name} className="flex justify-between items-center text-sm">
                            <Text className="font-medium text-gray-800">{med.name}</Text>
                            <div className="flex space-x-6 text-gray-600">
                                <Text>Liều: {med.dose}</Text>
                                <Text>Thời gian: {med.duration}</Text>
                            </div>
                        </div>
                    ))}
                    
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <Text className="font-semibold block mb-1">Hướng dẫn sử dụng:</Text>
                        <Text className="text-sm text-gray-700">{p.instructions}</Text>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default PrescriptionsTab;