// HorizontalLayout.jsx (Đã hoàn thiện logic quản lý trạng thái)

import React, { useState, useEffect } from "react";
import ReponsiveSider from "./Sider";
import { Layout } from "antd";
import HeaderLayout from "./Header";
import { Content } from "antd/es/layout/layout";
import { Outlet, useNavigate, useLocation } from "react-router-dom"; // Cần import useLocation

import KPIDashboardSection from "./KPIDashboardSection";

const HorizontalLayout = () => {
    // Để chuyển hướng sau khi chọn/đổi gia đình
    // (Lưu ý: hook này phải được đặt bên trong function component)
    const navigate = useNavigate();
  const location = useLocation(); // Thêm useLocation hook 
    
    // 1. STATE: Theo dõi gia đình đang được chọn
    // Khởi tạo từ localStorage để giữ lựa chọn khi reload trang
    const [selectedFamily, setSelectedFamily] = useState(() => {
        try {
            const raw = localStorage.getItem('selectedFamily');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.warn('Failed to parse selectedFamily from localStorage', e);
            return null;
        }
    }); // { id: string, name: string }

    // State để track xem đã nhấn "Xem bệnh nhân" chưa
    const [hasViewedPatients, setHasViewedPatients] = useState(() => {
        try {
            const raw = localStorage.getItem('hasViewedPatients');
            return raw ? JSON.parse(raw) : false;
        } catch (e) {
            console.warn('Failed to parse hasViewedPatients from localStorage', e);
            return false;
        }
    });

    const handleSelectFamily = (family) => {
        setSelectedFamily(family);
        try {
            localStorage.setItem('selectedFamily', JSON.stringify(family));
        } catch (e) {
            console.warn('Failed to save selectedFamily to localStorage', e);
        }
        // Chuyển hướng đến trang Dashboard chính sau khi chọn gia đình thành công
        navigate('/doctor/list-char'); 
        
        // Đánh dấu đã nhấn "Xem bệnh nhân"
        setHasViewedPatients(true);
        try {
            localStorage.setItem('hasViewedPatients', JSON.stringify(true));
        } catch (e) {
            console.warn('Failed to save hasViewedPatients to localStorage', e);
        }
    };

    const handleUnselectFamily = () => {
        setSelectedFamily(null);
        try {
            localStorage.removeItem('selectedFamily');
        } catch (e) {
            console.warn('Failed to remove selectedFamily from localStorage', e);
        }
        // Chuyển hướng về trang Quản lý gia đình
        navigate('/doctor/families'); 
        
        // Reset trạng thái đã xem bệnh nhân
        setHasViewedPatients(false);
        try {
            localStorage.setItem('hasViewedPatients', JSON.stringify(false));
        } catch (e) {
            console.warn('Failed to save hasViewedPatients to localStorage', e);
        }
    };

    // If localStorage had a selectedFamily but route is root, optionally navigate to list
    useEffect(() => {
        if (selectedFamily) {
            // ensure the UI shows the list when a family is present
            // do not force navigation if already in a different page intentionally
        }
    }, [selectedFamily]);

    // Reset hasViewedPatients khi navigate đến các tab cha
    useEffect(() => {
        const currentPath = location.pathname;
        const parentTabRoutes = ['/doctor/requests', '/doctor/families', '/doctor/profile'];
        
        if (parentTabRoutes.includes(currentPath)) {
            setHasViewedPatients(false);
            try {
                localStorage.setItem('hasViewedPatients', JSON.stringify(false));
            } catch (e) {
                console.warn('Failed to save hasViewedPatients to localStorage', e);
            }
        }
    }, [location.pathname]);

    const isFamilySelected = selectedFamily !== null;

    return (
        <Layout>
            {/* 2. Truyền props trạng thái xuống Header */}
            <HeaderLayout 
                isFamilySelected={isFamilySelected} 
                onUnselectFamily={handleUnselectFamily}
                selectedFamily={selectedFamily}
            />

            {/* 3. KPI SECTION chỉ hiển thị khi đã chọn gia đình; Sider/menu luôn hiển thị */}
            {isFamilySelected && (
                <KPIDashboardSection className="py-4" selectedFamily={selectedFamily} />
            )}
            {/* Menu/Sider luôn hiển thị; truyền trạng thái selection để menu có thể lọc các tab */}
            <ReponsiveSider hasViewedPatients={hasViewedPatients} />

            <Content className="overflow-auto p-4">
                {/* 4. Truyền context (selectedFamily) xuống Outlet để các trang con (ListOfCharPage) 
                       biết được gia đình nào đang được quản lý. */}
                <Outlet 
                    context={{ selectedFamily, handleSelectFamily }} 
                />
            </Content>
        </Layout>
    );
};

// Cần phải export default HorizontalLayout;
// LƯU Ý: Đảm bảo bạn đang sử dụng React Router DOM v6 và đã bao bọc HorizontalLayout bằng BrowserRouter
export default HorizontalLayout;