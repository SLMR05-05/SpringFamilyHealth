import { Button, Input, Space } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import UserDropDown from "./UserDropDown";
import NotificationDropdown from "../../components/NotificationDropdown";
import { useState } from "react";

const HeaderLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Header style={{ background: "#fff" }} className="sticky top-0 z-50 flex items-center justify-end bg-white px-5 shadow-lg h-16">
      {/* Left */}
    
      {/* Right */}
      <Space size={16}>
        <NotificationDropdown />
        <UserDropDown />
      </Space>
    </Header>
  );
};

export default HeaderLayout;
