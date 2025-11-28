import { Typography, List, Button, Tag, Card } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, LinkOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

// Dữ liệu mẫu (theo hình ảnh)
const appointmentData = [
    { 
        time: '09:00', 
        name: 'Nguyễn Văn An', 
        type: 'Khám định kỳ', 
        status: 'Scheduled',
        isLinked: true 
    },
    { 
        time: '10:30', 
        name: 'Trần Thị Bình', 
        type: 'Tái khám', 
        status: 'Scheduled',
        isLinked: true 
    },
    { 
        time: '14:00', 
        name: 'Phạm Thị Dung', 
        type: 'Tư vấn', 
        status: 'Completed',
        isLinked: false
    },
];

const TodayAppointmentList = () => {
    // Logic: Xử lý dựa trên trạng thái (status)
    const getActionAndStatus = (appointment) => {
        const linkTag = appointment.isLinked ? 
            <Tag color="blue" className="mr-2">Đã liên lịch</Tag> : 
            <Tag color="default" className="mr-2">Chưa liên lịch</Tag>;

        switch (appointment.status) {
            case 'Scheduled':
                return {
                    // Trả về cả Tag liên kết và Nút hành động
                    actionsContent: (
                        <div className="flex items-center space-x-2">
                            {linkTag}
                            <Button type="primary">Bắt đầu khám</Button>
                        </div>
                    ),
                    // Không dùng Tag Hoàn thành ở đây
                    statusTag: null, 
                };
            case 'Completed':
                return {
                    // Chỉ trả về Tag Hoàn thành
                    actionsContent: <Tag icon={<CheckCircleOutlined />} color="green" size="large" className="text-base py-1 px-3">Hoàn thành</Tag>,
                    statusTag: null,
                };
            default:
                return { actionsContent: null, statusTag: null };
        }
    };

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
            <Card className="shadow-lg">
                <Title level={4}>Lịch hẹn hôm nay</Title>
                <Text type="secondary" className="block mb-4">Thứ Sáu, 28 tháng 11, 2025</Text>
                
                <List
                    itemLayout="horizontal"
                    dataSource={appointmentData}
                    renderItem={(item) => {
                        const { actionsContent } = getActionAndStatus(item);
                        
                        // Định nghĩa mảng actions
                        const actions = actionsContent ? [actionsContent] : [];
                        
                        return (
                            <List.Item
                                // Sử dụng actions để chứa cả Tag và Button
                                actions={actions} 
                                className="p-4 hover:bg-gray-50 transition-colors rounded-lg"
                            >
                                <List.Item.Meta
                                    // Bỏ Tag liên kết khỏi avatar/description
                                    avatar={<Text strong className="text-xl text-blue-600"><ClockCircleOutlined /> {item.time}</Text>}
                                    title={<Text strong className="text-lg">{item.name}</Text>}
                                    description={
                                        // Chỉ giữ lại loại hình cuộc hẹn
                                        <Text type="secondary">{item.type}</Text>
                                    }
                                />
                            </List.Item>
                        );
                    }}
                />
            </Card>
        </div>
    );
};

export default TodayAppointmentList;