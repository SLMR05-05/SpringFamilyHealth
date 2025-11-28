// VaccinationTab.jsx
import React from 'react';
import { Typography } from 'antd';
import { CheckCircleOutlined, CalendarOutlined } from '@ant-design/icons';

const { Text } = Typography;

const VaccinationTab = ({ vaccinations }) => (
    <div className="space-y-6 pt-4">
        <Text type="secondary" className="block mb-4">Lịch sử các loại vaccine đã tiêm và lịch tiêm tiếp theo</Text>

        {vaccinations.map((vax) => (
            <div key={vax.date} className="flex justify-between items-start pb-4 border-b last:border-b-0">
                <div className="flex space-x-4">
                    <CheckCircleOutlined className="text-lg mt-1 text-green-500" />
                    <div className="flex flex-col">
                        <Text className="font-semibold text-gray-800 text-lg">{vax.name}</Text>
                        <Text type="secondary" className="text-sm">BS. {vax.doctor}</Text>
                        
                        <div className="mt-2 text-sm space-y-1">
                            <Text className="flex items-center space-x-1 text-blue-600 font-medium">
                                <CalendarOutlined />
                                <span>Tiêm tiếp theo: {vax.next}</span>
                            </Text>
                            <Text type="secondary" className="block">{vax.notes}</Text>
                        </div>
                    </div>
                </div>
                <Text type="secondary" className="shrink-0 text-sm">{vax.date}</Text>
            </div>
        ))}
    </div>
);

export default VaccinationTab;