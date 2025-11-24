import React, { useState } from "react";
import ReponsiveSider from "./Sider";
import { Layout } from "antd";
import HeaderLayout from "./Header";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";


const HorizontalLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <ReponsiveSider collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <HeaderLayout collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="overflow-auto h-[calc(100vh-64px)]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default HorizontalLayout;
