import { Modal, Button, Typography, Result, Space } from 'antd';
import React from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ApprovalStatusModal = ({ isVisible, onClose, patientName }) => {
    return (
        <Modal
            open={isVisible}
            onCancel={onClose}
            footer={null}
            centered
        >
            <Result
                status="success"
                icon={<CheckCircleOutlined className="text-green-500" />}
                title={`Đã duyệt hồ sơ của ${patientName}`}
                subTitle="Hồ sơ đã được chuyển sang trạng thái Đã duyệt và sẽ được sắp xếp lịch hẹn (nếu cần)."
                extra={[
                    <Button 
                        key="close" 
                        type="primary" 
                        className="bg-green-600 hover:bg-green-700" 
                        onClick={onClose}
                    >
                        Đóng
                    </Button>,
                ]}
            />
        </Modal>
    );
};

export default ApprovalStatusModal;