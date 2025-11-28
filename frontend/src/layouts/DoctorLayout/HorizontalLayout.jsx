// HorizontalLayout.jsx (Đã hoàn thiện logic quản lý trạng thái)

import React, { useState } from "react";
import ReponsiveSider from "./Sider";
import { Layout } from "antd";
import HeaderLayout from "./Header";
import { Content } from "antd/es/layout/layout";
import { Outlet, useNavigate } from "react-router-dom"; // Cần import useNavigate

import KPIDashboardSection from "./KPIDashboardSection";

const HorizontalLayout = () => {
    // Để chuyển hướng sau khi chọn/đổi gia đình
    // (Lưu ý: hook này phải được đặt bên trong function component)
    const navigate = useNavigate(); 
    
    // 1. STATE: Theo dõi gia đình đang được chọn
    const [selectedFamily, setSelectedFamily] = useState(null); // { id: string, name: string }

    const handleSelectFamily = (family) => {
        setSelectedFamily(family);
        // Chuyển hướng đến trang Dashboard chính sau khi chọn gia đình thành công
        navigate('/doctor/list-char'); 
    };

    const handleUnselectFamily = () => {
        setSelectedFamily(null);
        // Chuyển hướng về trang Chọn Gia đình (index route)
        navigate('/doctor'); 
    };

    const isFamilySelected = selectedFamily !== null;

    return (
        <Layout>
            {/* 2. Truyền props trạng thái xuống Header */}
            <HeaderLayout 
                isFamilySelected={isFamilySelected} 
                onUnselectFamily={handleUnselectFamily}
                selectedFamily={selectedFamily}
            />

            {/* 3. ẨN KPI SECTION VÀ SIDER KHI CHƯA CHỌN GIA ĐÌNH */}
            {isFamilySelected && (
                <>
                    <KPIDashboardSection className="py-4" />
                    <ReponsiveSider />
                </>
            )}

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