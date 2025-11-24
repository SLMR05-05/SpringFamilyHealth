import {
  AppstoreOutlined,
  CalendarOutlined,
  MailOutlined,
  UserOutlined,
  SettingOutlined,
  RobotOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const MenuDoctorConfig = () => {
  const { t } = useTranslation();

  return [
    {
      key: "/doctor/dashboard",
      icon: <AppstoreOutlined />,
      label: t("Tổng quan"),
    },
    {
      key: "/doctor/patients",
      icon: <UserOutlined />,
      label: t("Bệnh nhân"),
    },
    {
      key: "/doctor/pending-records",
      icon: <FolderOutlined />,
      label: t("Hồ sơ chờ duyệt"),
    }

    ,
    {
      key: "/doctor/calendar",
      icon: <CalendarOutlined />,
      label: t("Lịch trình"),
    },
    
    
    {
      key: "/doctor/chat-ai",
      icon: <RobotOutlined />,
      label: t("Chat AI"),
    },
    {
      key: "/doctor/settings",
      icon: <SettingOutlined />,
      label: t("Cài đặt"),
    },
  ];
};

export default MenuDoctorConfig;
