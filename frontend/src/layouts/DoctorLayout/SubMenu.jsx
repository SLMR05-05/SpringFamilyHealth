// SubMenu.jsx - Menu phụ cho các tab liên quan đến gia đình đã chọn

import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";

const SubMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const subMenuItems = [
        {
            key: "/doctor/list-char",
            icon: <UserOutlined />,
            label: t("Danh sách bệnh nhân"),
        },
        {
            key: "/doctor/calendar",
            icon: <CalendarOutlined />,
            label: t("Lịch hẹn hôm nay"),
        },
    ];

    const handleButtonClick = (key) => {
        navigate(key);
    };

    return (
        <div className="flex w-full justify-around items-center p-2 rounded-full bg-gray-50 shadow-sm border border-gray-200">
            {subMenuItems.map((item) => {
                const isSelected = location.pathname === item.key;
                
                const buttonClasses = isSelected
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-blue-600 hover:bg-white"; 
                
                const baseClasses = `
                    flex-1
                    flex items-center 
                    py-2 h-10 rounded-full 
                    font-medium border-none 
                    transition-all duration-200 
                    whitespace-nowrap 
                    justify-center 
                    cursor-pointer
                    text-sm
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
                        <span className="text-lg mr-2">
                            {item.icon} 
                        </span>
                        <span>
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default SubMenu;
