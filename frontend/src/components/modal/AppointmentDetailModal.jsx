import React from 'react';
import { Modal, Button, Typography, Space } from 'antd';
import { CloseOutlined, ReloadOutlined } from '@ant-design/icons'; // ⭐️ Import ReloadOutlined

const { Title, Text } = Typography;

// ⭐️ THÊM onComplete VÀ onRestore VÀO PROPS
const AppointmentDetailModal = ({ isVisible, onClose, appointmentDetail, onCancel, onComplete, onRestore }) => { 
    // Đảm bảo appointmentDetail có giá trị mặc định nếu null
    const { 
        patientName = "Không rõ",
        time = "Không rõ",
        period = "", 
        date = "Không rõ",
        type = "Không rõ",
        notes = "Không có ghi chú.",
        id, 
        isCompleted = false,
        isCancelled = false // ⭐️ Trạng thái hủy
    } = appointmentDetail || {};

    // Hàm chung cho các hành động cần đóng Modal và gọi prop function
    const handleAction = (actionFunction) => {
        if (actionFunction && id) {
            actionFunction(id);
        }
        onClose();
    };

    return (
        <Modal
            open={isVisible}
            onCancel={onClose}
            footer={null} 
            closeIcon={<CloseOutlined className="text-gray-500" />} 
            width={500} 
            centered 
            className="rounded-lg shadow-lg" 
        >
            <div className="p-4">
                <Title level={4} className="mb-6 text-gray-800">
                    Chi tiết cuộc hẹn
                </Title>

                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
                    {/* Hàng 1: Bệnh nhân & Thời gian */}
                    <div>
                        <Text strong className="block text-gray-500 text-sm mb-1">Bệnh nhân</Text>
                        <Text className="text-base text-gray-800">{patientName}</Text>
                    </div>
                    <div>
                        <Text strong className="block text-gray-500 text-sm mb-1">Thời gian</Text>
                        <Text className="text-base text-gray-800">{time} {period} - {date}</Text>
                    </div>

                    {/* Hàng 2: Loại cuộc hẹn */}
                    <div className="col-span-2">
                        <Text strong className="block text-gray-500 text-sm mb-1">Loại cuộc hẹn</Text>
                        <Text className="text-base text-gray-800">{type}</Text>
                    </div>

                    {/* Hàng 3: Ghi chú */}
                    <div className="col-span-2">
                        <Text strong className="block text-gray-500 text-sm mb-1">Ghi chú</Text>
                        <Text className="text-base text-gray-700 italic">{notes}</Text>
                    </div>
                </div>

                {/* Footer với các nút hành động */}
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
                    
                    
                    {isCancelled && (
                        <Button 
                            icon={<ReloadOutlined />}
                            type="default"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleAction(onRestore)}
                        >
                            Khôi phục cuộc hẹn
                        </Button>
                    )}

                    <Button 
                        danger 
                        className="bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600"
                        onClick={() => handleAction(onCancel)} // Gọi onCancel
                        disabled={isCancelled} // Vô hiệu hóa nếu đã hủy
                    >
                        Hủy hẹn
                    </Button>
                    
                    <Button 
                        type="primary" 
                        className="bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700"
                        onClick={() => handleAction(onComplete)} // Gọi onComplete
                        disabled={isCompleted || isCancelled} // Vô hiệu hóa nếu đã hoàn thành hoặc đã hủy
                    >
                        Đánh dấu hoàn thành
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AppointmentDetailModal;