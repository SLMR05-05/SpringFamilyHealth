import { useTranslation } from "react-i18next";
import { UserOutlined, CalendarOutlined, FieldTimeOutlined} from '@ant-design/icons';
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
  ];
};

export default MenuDoctorConfig;
