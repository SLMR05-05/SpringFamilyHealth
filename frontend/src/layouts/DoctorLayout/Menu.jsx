import { ConfigProvider, Menu } from "antd";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import MenuDoctorConfig from "./MenuDoctorConfig";
import { useNavigate, useLocation } from "react-router-dom";

const MenuCustom = ({ setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = MenuDoctorConfig();

  const handleMenuClick = (item) => {
    navigate(item.key);
    if (setCollapsed) setCollapsed(false);
  };

  return (
    <ConfigProvider>
      <SimpleBar style={{ maxHeight: "calc(100vh - 80px)" }}>
        <Menu
          mode="inline"
          theme="light"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </SimpleBar>
    </ConfigProvider>
  );
};

export default MenuCustom;
