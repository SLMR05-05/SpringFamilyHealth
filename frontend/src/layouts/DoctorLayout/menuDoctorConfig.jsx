import { useTranslation } from "react-i18next";
import { UserOutlined, CalendarOutlined, FieldTimeOutlined, FileTextOutlined, TeamOutlined} from '@ant-design/icons';
const MenuDoctorConfig = () => {
  const { t } = useTranslation();
  
  return [
    {
      key: "/doctor/list-char",
      icon: <UserOutlined />,
      label: t("Danh sách bệnh nhân"),
    },
    {
      key: "/doctor/calendar",
      icon: <CalendarOutlined />,
      label: t("Lịch hẹn hôm nay"),
    },
    {
      key: "/doctor/requests",
      icon: <FileTextOutlined />,
      label: t("Quản lý yêu cầu"),
    },
    {
      key: "/doctor/families",
      icon: <TeamOutlined />,
      label: t("Quản lý gia đình"),
    },
    {
      key: "/doctor/profile",
      icon: <UserOutlined />,
      label: t("Hồ sơ cá nhân"),
    },
  ];
};

export default MenuDoctorConfig;
