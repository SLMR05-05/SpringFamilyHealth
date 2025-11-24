import { Modal, Button, Descriptions, Typography, Space } from "antd";
import React from "react";
import { CheckCircleOutlined, UserOutlined, MailOutlined, IdcardOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ApproveDoctorModal = ({ open, onCancel, doctor, onApprove }) => {
  if (!doctor) return null;

  return (
    <Modal
      title={<Title level={4} className="m-0 text-blue-600">Xác Nhận Duyệt Bác Sĩ</Title>}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<CheckCircleOutlined />}
          className="bg-green-600 hover:bg-green-700!"
          onClick={() => onApprove(doctor)}
        >
          Xác Nhận Duyệt
        </Button>,
      ]}
    >
      <div className="mb-4">
        <Text strong>Bạn có chắc chắn muốn duyệt tài khoản này không? </Text>
        <Text type="secondary" className="block text-sm">
          Thông tin chi tiết của bác sĩ đăng ký:
        </Text>
      </div>

      {/* Hiển thị thông tin chi tiết */}
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label={<Space><UserOutlined /> Tên Bác Sĩ</Space>}>
          {doctor.name}
        </Descriptions.Item>
        <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>
          {doctor.email}
        </Descriptions.Item>
        <Descriptions.Item label={<Space><IdcardOutlined /> Chuyên Khoa</Space>}>
          {doctor.specialty}
        </Descriptions.Item>
        {/* Giả định mã số chứng chỉ đã được thêm vào dữ liệu chờ duyệt */}
        <Descriptions.Item label={<Space><IdcardOutlined /> Mã Số Chứng Chỉ</Space>}>
          {doctor.certificate_number || 'Chưa cung cấp'} 
        </Descriptions.Item>
        <Descriptions.Item label="Ngày Đăng Ký">
          {doctor.date}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ApproveDoctorModal;