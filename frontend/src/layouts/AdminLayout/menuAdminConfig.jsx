import { DashboardOutlined, UserOutlined, HeartOutlined ,BarChartOutlined ,InfoOutlined,SettingOutlined } from '@ant-design/icons';
import React from 'react';  
import { useTranslation } from 'react-i18next';
const MenuAdminConfig = () => {

    const { t } = useTranslation();

    const menuItems =[
        {
            key: "/admin",
            icon: <DashboardOutlined/>,
            label: t("Tổng quan"),
            
    },
    {
        key:"/admin/users",
        icon: <UserOutlined/>,
        label: t("Quản lý người dùng"),
        
    },
    {
        key:"/admin/doctors",
        icon:<HeartOutlined />,
        label: t("Quản lý bác sĩ"),
        
    },
    {
        key:"/admin/reports",
        icon:<BarChartOutlined />,
        label: t("Báo cáo thống kê"),
       
    },
    
]
    return menuItems;


}

export default MenuAdminConfig;