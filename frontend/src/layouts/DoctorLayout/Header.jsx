// Header.jsx (Hoàn thiện chức năng mở Modal)

import React, { useState } from 'react'; // 👈 Cần import useState
import { Space, Button } from "antd";
import { Header } from "antd/es/layout/layout";
import UserDropDown from "./UserDropDown";
import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
// Đảm bảo đường dẫn này là chính xác
import ScheduleModal from "../../components/modal/ScheduleModal"; 

// Loại bỏ prop onViewSchedule vì nó không còn được sử dụng để chuyển hướng nữa
const HeaderLayout = ({ 
    isFamilySelected, 
    onUnselectFamily, 
    selectedFamily,
}) => {
    // 1. STATE: Quản lý trạng thái hiển thị của ScheduleModal
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    
    // Tiêu đề/mô tả hiển thị động
    const title = isFamilySelected ? 
        (selectedFamily.name || 'Dashboard') : 
        "Doctor Dashboard"; 

    const subTitle = isFamilySelected ?
        "Đang quản lý gia đình" :
        "Chào mừng, Bác sĩ Nguyễn Văn A";

    return (
        <>
            <Header
                style={{ background: "#fff" }}
                className="
                    bg-white 
                    border-b border-gray-200 
                    sticky top-0 z-10 
                    h-16
                    flex items-center
                "
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex justify-between items-center h-16">

                        {/* Left side */}
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <span className="text-emerald-600 font-bold text-lg">D</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                                <p className="text-sm text-gray-500">{subTitle}</p>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-4">
                            <Space size={16}>
                                
                                {isFamilySelected && (
                                    <>
                                        {/* NÚT ĐỔI GIA ĐÌNH */}
                                        <Button 
                                            icon={<ArrowLeftOutlined />} 
                                            type="default"
                                            onClick={onUnselectFamily} 
                                        >
                                            Đổi gia đình
                                        </Button>

                                        {/* NÚT LỊCH KHÁM: Mở Modal */}
                                        <Button 
                                            icon={<CalendarOutlined />} 
                                            type="default" 
                                            // 👈 LOGIC MỚI: Mở Modal thay vì gọi prop onViewSchedule
                                            onClick={() => setIsScheduleModalOpen(true)} 
                                        >
                                            Lịch khám
                                        </Button>
                                    </>
                                )}

                                <UserDropDown />
                            </Space>
                        </div>

                    </div>
                </div>
            </Header>

            {/* 2. COMPONENT MODAL LỊCH KHÁM được render ở đây */}
            <ScheduleModal 
                open={isScheduleModalOpen}
                onCancel={() => setIsScheduleModalOpen(false)} // Logic đóng Modal
            />
        </>
    );
};

export default HeaderLayout;