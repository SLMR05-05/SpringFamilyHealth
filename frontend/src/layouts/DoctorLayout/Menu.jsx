// PillTabNavigation.jsx (Đã sửa để chia đều không gian)

import React from 'react';
// KHÔNG cần import { Button } từ 'antd' nữa
import MenuDoctorConfig from "./MenuDoctorConfig";
import { useNavigate, useLocation } from "react-router-dom";

const PillTabNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const menuItems = MenuDoctorConfig(); // Lấy cấu hình menu

    const handleButtonClick = (key) => {
        navigate(key);
    };

    return (
        // SỬA ĐỔI 1: Thêm 'w-full' để Wrapper chiếm hết chiều rộng
        <div className="flex w-full justify-around items-center p-2 rounded-full bg-white shadow-md border border-gray-100">
            {menuItems.map((item) => {
                // Kiểm tra xem mục này có đang được chọn hay không
                const isSelected = location.pathname === item.key;
                
                // 2. Định nghĩa classes Tailwind có điều kiện
                const buttonClasses = isSelected
                    ? "bg-gray-900 text-white shadow-lg" // Chọn: Nền đen, chữ trắng
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"; 
                
                // CÁC SỬA ĐỔI 2: Thêm 'flex-1' và điều chỉnh padding ngang
                const baseClasses = `
                    flex-1 // **QUAN TRỌNG: Chia đều không gian**
                    flex items-center 
                    py-3 h-10 rounded-full 
                    font-semibold border-none 
                    transition-all duration-200 
                    whitespace-nowrap 
                    justify-center 
                    cursor-pointer
                    text-base // Đảm bảo cỡ chữ đủ lớn
                `;

                return (
                    <div
                        key={item.key}
                        role="button"
                        tabIndex={0}
                        className={`${baseClasses} ${buttonClasses}`}
                        onClick={() => handleButtonClick(item.key)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleButtonClick(item.key);
                            }
                        }}
                    >
                        {/* Icon của Menu Doctor Config */}
                        <span className="text-xl mr-2">
                            {item.icon} 
                        </span>
                        
                        {/* Label của Menu Doctor Config */}
                        <span>
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default PillTabNavigation;