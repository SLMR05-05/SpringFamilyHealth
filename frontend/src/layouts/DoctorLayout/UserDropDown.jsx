import { Avatar, Divider, Dropdown, Flex, Space, theme } from "antd";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";
import { useNavigate } from "react-router-dom";

const { useToken } = theme;

const UserDropDown = () => {
  const navigate = useNavigate();
  const { token } = useToken();

  const user = {
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@gmail.com",
  };

  const moveProfile = () => navigate("/profile");
  const moveSetting = () => navigate("/settings");
  const handleLogout = () => navigate("/login");

  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle = {
    boxShadow: "none",
  };

  const items = [
    {
      key: "1",
      label: "Account info",
      icon: <UserOutlined />,
      onClick: moveProfile,
    },
    {
      key: "2",
      label: "Settings",
      icon: <SettingOutlined />,
      onClick: moveSetting,
    },
    {
      key: "3",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      popupRender={(menu) => (
        <div style={contentStyle}>
          <Space style={{ padding: 10 }}>
            <Flex vertical justify="end" align="center" gap={10}>
              <p className="text-primary font-medium text-sm">
                {user.firstname} {user.lastname}
              </p>
              <p className="text-red-500 text-xs">{user.email}</p>
            </Flex>
          </Space>
          <Divider style={{ margin: 0 }} />
          {React.cloneElement(menu, { style: menuStyle })}
        </div>
      )}
      trigger={["click"]}
      placement="bottomRight"
      arrow
    >
      <Avatar size={36} style={{ cursor: "pointer" }}>
        {user.firstname[0]}
      </Avatar>
    </Dropdown>
  );
};

export default UserDropDown;
