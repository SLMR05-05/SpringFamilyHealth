// ChartsTab.jsx (ĐÃ SỬA ĐỔI)
import React, { useState } from 'react';
import { Typography, Card, Tabs } from 'antd';
// 1. IMPORT CÁC THÀNH PHẦN RECHARTS
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { ArrowUpOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const chartTabs = [
    { key: 'bp', label: 'Huyết áp', title: 'Biểu đồ huyết áp', desc: 'Theo dõi biến thiên huyết áp tâm thu và tâm trương' },
    { key: 'hr', label: 'Nhịp tim', title: 'Biểu đồ nhịp tim', desc: 'Theo dõi nhịp tim nghỉ qua các lần khám' },
    { key: 'temp', label: 'Nhiệt độ', title: 'Biểu đồ nhiệt độ cơ thể', desc: 'Theo dõi nhiệt độ cơ thể qua các lần khám' },
    { key: 'bmi', label: 'Cân nặng & BMI', title: 'Biểu đồ cân nặng và BMI', desc: 'Theo dõi cân nặng và chỉ số khối cơ thể (BMI)' },
];

// Hàm tính BMI an toàn
const calculateBMI = (weightStr, heightStr) => {
    // Tách và chuyển đổi: '70 kg' -> 70, '170 cm' -> 1.7
    const w = parseFloat(weightStr?.replace(' kg', '')) || 0;
    const h = (parseFloat(heightStr?.replace(' cm', '')) || 0) / 100; 
    if (w > 0 && h > 0) {
        return (w / (h * h)).toFixed(2);
    }
    return null;
};

// 2. NHẬN PROPS vitalsData
const ChartsTab = ({ vitalsData }) => { 
    const [activeChart, setActiveChart] = useState('bp');

    // 3. XỬ LÝ DỮ LIỆU ĐỂ PHÙ HỢP VỚI BIỂU ĐỒ
    // Chuyển đổi chuỗi ('140/90 mmHg') thành số, tính BMI, và đảo ngược thứ tự để trục X đi từ cũ đến mới
    const processedData = vitalsData.map(record => {
        const bpParts = record.bp ? record.bp.match(/(\d+)\/(\d+)/) : null;
        return {
            date: record.date,
            systolic: bpParts ? parseFloat(bpParts[1]) : null, // Huyết áp tâm thu
            diastolic: bpParts ? parseFloat(bpParts[2]) : null, // Huyết áp tâm trương
            heartRate: parseFloat(record.hr?.replace(' bpm', '')) || null,
            temperature: parseFloat(record.temp?.replace(' °C', '')) || null,
            weight: parseFloat(record.weight?.replace(' kg', '')) || null,
            bmi: calculateBMI(record.weight, record.height)
        };
    }).reverse(); 

    // 4. THAY THẾ HÀM renderChartContent BẰNG LOGIC VẼ BIỂU ĐỒ RECHARTS
    const renderChartContent = (key) => {
        if (!processedData || processedData.length === 0) {
             return (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50 h-96 flex items-center justify-center">
                    <Text type="secondary">
                        Không có dữ liệu chỉ số sinh hiệu để hiển thị biểu đồ.
                    </Text>
                </div>
            );
        }

        let lines = [];
        let yLabel = '';
        let hasDualAxis = false;

        switch (key) {
            case 'bp':
                yLabel = 'Huyết áp (mmHg)';
                lines = [
                    <Line type="monotone" dataKey="systolic" stroke="#E57373" name="Tâm thu" key="sys" yAxisId="left" dot={false} strokeWidth={2}/>,
                    <Line type="monotone" dataKey="diastolic" stroke="#4DB6AC" name="Tâm trương" key="dia" yAxisId="left" dot={false} strokeWidth={2}/>,
                ];
                break;
            case 'hr':
                yLabel = 'Nhịp tim (bpm)';
                lines = [
                    <Line type="monotone" dataKey="heartRate" stroke="#FFB74D" name="Nhịp tim" key="hr" yAxisId="left" dot={false} strokeWidth={2}/>,
                ];
                break;
            case 'temp':
                yLabel = 'Nhiệt độ (°C)';
                lines = [
                    <Line type="monotone" dataKey="temperature" stroke="#64B5F6" name="Nhiệt độ" key="temp" yAxisId="left" dot={false} strokeWidth={2}/>,
                ];
                break;
            case 'bmi':
                hasDualAxis = true;
                lines = [
                    // Trục Y trái: Cân nặng
                    <Line type="monotone" dataKey="weight" stroke="#9575CD" name="Cân nặng (kg)" key="weight" yAxisId="left" dot={false} strokeWidth={2}/>,
                    // Trục Y phải: BMI
                    <Line type="monotone" dataKey="bmi" stroke="#F06292" name="BMI" key="bmi" yAxisId="right" dot={false} strokeWidth={2}/>,
                ];
                break;
            default:
                return null;
        }

        return (
            <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={processedData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        
                        {/* Trục Y trái (luôn cần) */}
                        <YAxis 
                            label={{ value: hasDualAxis ? 'Cân nặng (kg)' : yLabel, angle: -90, position: 'insideLeft' }} 
                            yAxisId="left" 
                        />
                        
                        {/* Trục Y phải (chỉ cho BMI) */}
                        {hasDualAxis && (
                            <YAxis 
                                orientation="right"
                                label={{ value: 'Chỉ số BMI', angle: 90, position: 'insideRight' }} 
                                yAxisId="right"
                            />
                        )}
                        
                        <Tooltip />
                        <Legend />
                        {lines}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    };

    return (
        <div className="space-y-4 pt-4">
            <Text type="secondary" className="block">Visualize vital signs trends over time for better health monitoring</Text>
            
            <Card className="rounded-lg shadow-sm">
                <Tabs 
                    defaultActiveKey="bp" 
                    onChange={setActiveChart} 
                    items={chartTabs} 
                    className="chart-sub-tabs" 
                />

                <div className="p-4">
                    <Title level={4} className="mt-0 text-xl text-gray-800">
                        {chartTabs.find(t => t.key === activeChart)?.title}
                    </Title>
                    <Text type="secondary" className="block mb-4">
                        {chartTabs.find(t => t.key === activeChart)?.desc}
                    </Text>
                    
                    {renderChartContent(activeChart)}
                </div>
            </Card>
        </div>
    );
};

export default ChartsTab;