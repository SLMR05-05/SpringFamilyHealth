import { DashboardOutlined, UserOutlined, HeartOutlined ,BarChartOutlined ,InfoOutlined,SettingOutlined } from '@ant-design/icons';
import React from 'react';  
import { useTranslation } from 'react-i18next';

const MenuAdminConfig = () => {
    const { t } = useTranslation();

    const menuItems = [
        {
            key: "/admin",
            icon: React.createElement(DashboardOutlined),
            label: t("Tổng quan"),
        },
        {
            key: "/admin/users",
            icon: React.createElement(UserOutlined),
            label: t("Quản lý tài khoản"),
        },
        {
            key: "/admin/doctors",
            icon: React.createElement(HeartOutlined),
            label: t("Quản lý bác sĩ"),
        },
        {
            key: "/admin/reports",
            icon: React.createElement(BarChartOutlined),
            label: t("Báo cáo thống kê"),
        },
    ];
    
    return menuItems;
}

export default MenuAdminConfig;