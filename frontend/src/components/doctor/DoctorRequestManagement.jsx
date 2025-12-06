import { useState, useEffect, useCallback } from 'react';
import { Table, Tag, Button, Modal, Input, Select, message, Spin, Badge } from 'antd';
import { CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import doctorRequestApi from '../../api/doctorRequestApi';

const { TextArea } = Input;
const { Option } = Select;

export default function DoctorRequestManagement({ doctorId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  
  const [responseModalVisible, setResponseModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [responseStatus, setResponseStatus] = useState('APPROVED');
  const [submitting, setSubmitting] = useState(false);

  // If doctorId not passed as prop, try to read from logged-in user in localStorage
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  })();

  const effectiveDoctorId = doctorId ?? storedUser.doctorId ?? storedUser.userId ?? storedUser.id ?? null;

  const { current, pageSize } = pagination;

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await doctorRequestApi.getDoctorRequests(
        effectiveDoctorId,
        statusFilter,
        current - 1,
        pageSize
      );
      
      const data = resp?.data || resp || {};
      setRequests(data.content || []);
      setPagination(prev => ({
        ...prev,
        total: data.totalElements || 0
      }));
    } catch (error) {
      console.error('Failed to fetch requests', error);
      message.error('Không thể tải danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  }, [effectiveDoctorId, statusFilter, current, pageSize]);

  const fetchPendingCount = useCallback(async () => {
    try {
      const resp = await doctorRequestApi.getPendingCount(effectiveDoctorId);
      const data = resp && resp.data !== undefined ? resp.data : resp;
      const count = typeof data === 'number' ? data : (data?.count ?? 0);
      setPendingCount(count || 0);
    } catch (error) {
      console.error('Failed to fetch pending count', error);
    }
  }, [effectiveDoctorId]);

  useEffect(() => {
    if (effectiveDoctorId) {
      fetchRequests();
      fetchPendingCount();
    }
  }, [effectiveDoctorId, current, statusFilter, fetchRequests, fetchPendingCount]);


  const openResponseModal = (request) => {
    setSelectedRequest(request);
    setResponseText('');
    setResponseStatus('APPROVED');
    setResponseModalVisible(true);
  };

  const handleRespond = async () => {
    if (!responseText.trim()) {
      message.warning('Vui lòng nhập phản hồi');
      return;
    }

    try {
      setSubmitting(true);
      await doctorRequestApi.respondToRequest(
        selectedRequest.requestId,
        effectiveDoctorId,
        {
          response: responseText,
          status: responseStatus
        }
      );
      
      message.success('Đã gửi phản hồi thành công');
      setResponseModalVisible(false);
      fetchRequests();
      fetchPendingCount();
    } catch (error) {
      console.error('Failed to respond', error);
      message.error('Không thể gửi phản hồi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(prev => ({ ...prev, current: newPagination.current }));
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      PENDING: { color: 'gold', icon: <Clock size={14} />, text: 'Chờ xử lý' },
      APPROVED: { color: 'green', icon: <CheckCircle size={14} />, text: 'Đã chấp nhận' },
      REJECTED: { color: 'red', icon: <XCircle size={14} />, text: 'Đã từ chối' },
      CANCELLED: { color: 'default', icon: <XCircle size={14} />, text: 'Đã hủy' }
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const getRequestTypeText = (type) => {
    const types = {
      CONSULTATION: 'Tư vấn',
      FAMILY_DOCTOR: 'Bác sĩ gia đình',
      APPOINTMENT: 'Đặt lịch khám',
      QUESTION: 'Câu hỏi'
    };
    return types[type] || type;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'requestId',
      key: 'requestId',
      width: 80,
    },
    {
      title: 'Người gửi',
      key: 'user',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.userName}</div>
          <div className="text-xs text-gray-500">{record.userEmail}</div>
        </div>
      ),
    },
    {
      title: 'Loại yêu cầu',
      dataIndex: 'requestType',
      key: 'requestType',
      render: (type) => (
        <Tag color="blue">{getRequestTypeText(type)}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Nội dung',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (text) => text || <span className="text-gray-400">Không có</span>,
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div className="space-x-2">
          {record.status === 'PENDING' ? (
            <Button
              type="primary"
              size="small"
              icon={<MessageSquare size={14} />}
              onClick={() => openResponseModal(record)}
            >
              Phản hồi
            </Button>
          ) : (
            <Button
              type="default"
              size="small"
              onClick={() => {
                Modal.info({
                  title: 'Phản hồi của bác sĩ',
                  content: record.doctorResponse || 'Không có phản hồi',
                });
              }}
            >
              Xem phản hồi
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý yêu cầu</h2>
          <p className="text-gray-500 mt-1">Xem và phản hồi các yêu cầu từ người dùng</p>
        </div>
        <Badge count={pendingCount} showZero>
          <Button type="primary" onClick={fetchRequests}>
            Làm mới
          </Button>
        </Badge>
      </div>

      <div className="mb-4">
        <Select
          style={{ width: 200 }}
          placeholder="Lọc theo trạng thái"
          value={statusFilter}
          onChange={setStatusFilter}
          allowClear
        >
          <Option value="">Tất cả</Option>
          <Option value="PENDING">Chờ xử lý</Option>
          <Option value="APPROVED">Đã chấp nhận</Option>
          <Option value="REJECTED">Đã từ chối</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={requests}
        rowKey="requestId"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      {/* Response Modal */}
      <Modal
        title="Phản hồi yêu cầu"
        visible={responseModalVisible}
        onCancel={() => setResponseModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setResponseModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            onClick={handleRespond}
          >
            Gửi phản hồi
          </Button>,
        ]}
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div>
              <div className="font-medium mb-1">Người gửi:</div>
              <div className="text-gray-700">{selectedRequest.userName}</div>
              <div className="text-sm text-gray-500">{selectedRequest.userEmail}</div>
            </div>

            <div>
              <div className="font-medium mb-1">Nội dung yêu cầu:</div>
              <div className="p-3 bg-gray-50 rounded text-gray-700">
                {selectedRequest.message || 'Không có nội dung'}
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">Quyết định:</div>
              <Select
                value={responseStatus}
                onChange={setResponseStatus}
                style={{ width: '100%' }}
              >
                <Option value="APPROVED">Chấp nhận</Option>
                <Option value="REJECTED">Từ chối</Option>
              </Select>
            </div>

            <div>
              <div className="font-medium mb-2">Phản hồi của bạn:</div>
              <TextArea
                rows={4}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Nhập phản hồi của bạn..."
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
