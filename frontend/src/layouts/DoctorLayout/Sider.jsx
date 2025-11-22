import { Drawer, Layout, Grid, Space } from "antd";
import React from "react";
import logo from "../../assets/logo.png";
import MenuCustom from "./Menu";

const { Sider } = Layout;
const { useBreakpoint } = Grid;

const ReponsiveSider = ({ collapsed, setCollapsed }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const SiderContent = (
    <>
      <Space
        className={` sticky flex flex-col items-center justify-center p-4 transition-all duration-300 ${
          collapsed ? "py-4" : "py-8"
        }`}
      >
        <img
          src={logo}
          alt="Logo"
          className={`object-fill transition-all duration-300 ${
            collapsed ? "w-10 h-10" : "w-20 h-20"
          }`}
        />
        {!collapsed && (
          <span className="text-xl font-bold text-primary">
            FamilyHealth
          </span>
        )}
      </Space>

      <MenuCustom setCollapsed={isMobile ? setCollapsed : null} />
    </>
  );

  return isMobile ? (
    <Drawer
      open={collapsed}
      onClose={() => setCollapsed(false)}
      placement="left"
      styles={{ header: { display: "none" }, body: { padding: "10px" } }}
      width={300}
    >
      {SiderContent}
    </Drawer>
  ) : (
    <Sider
      theme="light"
      trigger={null}
      collapsed={collapsed}
      width={240}
      className="overflow-auto h-screen top-0 left-0 bottom-0 px-1  border-gray-200"
    >
      {SiderContent}
    </Sider>
  );
};

export default ReponsiveSider;
