import { FileText, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { message as antdMessage } from 'antd';
import prescriptionApi from '../../../api/prescriptionApi';

export default function PrescriptionsTab({ prescriptions, onRefresh }) {
  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Chưa có đơn thuốc nào</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { label: 'Đang sử dụng', color: 'bg-blue-100 text-blue-800', icon: Clock },
      COMPLETED: { label: 'Đã hoàn thành', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: AlertCircle },
    };
    
    const config = statusConfig[status] || statusConfig.ACTIVE;
    const StatusIcon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <StatusIcon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const handleMarkCompleted = async (prescriptionId) => {
    try {
      await prescriptionApi.updateStatus(prescriptionId, 'COMPLETED');
      antdMessage.success('Đã đánh dấu hoàn thành đơn thuốc');
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to mark prescription as completed:', error);
      antdMessage.error('Không thể cập nhật trạng thái đơn thuốc');
    }
  };

  return (
    <div className="space-y-4">
      {prescriptions.map((prescription) => (
        <div key={prescription.prescriptionId || prescription.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Đơn thuốc ngày {formatDate(prescription.prescribedAt)}
                  </h3>
                  {prescription.doctorName && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <User className="w-4 h-4" />
                      <span>Bác sĩ kê đơn: {prescription.doctorName}</span>
                    </div>
                  )}
                </div>
                {getStatusBadge(prescription.status)}
              </div>
              
              <div className="space-y-2 text-sm">
                {prescription.note && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-700 mb-1">Ghi chú từ bác sĩ:</p>
                    <p className="text-gray-600">{prescription.note}</p>
                  </div>
                )}
                
                {prescription.medications && prescription.medications.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="font-semibold text-gray-700 mb-2">Thuốc kê đơn ({prescription.medications.length} loại):</p>
                    <ul className="space-y-2">
                      {prescription.medications.map((med, idx) => (
                        <li key={idx} className="flex justify-between items-start text-gray-600 p-2 bg-white rounded border border-blue-200">
                          <div className="flex-1">
                            <span className="font-medium text-gray-800">{med.medicationName || med.name}</span>
                            <div className="text-xs text-gray-500 mt-1">
                              {med.dosage && <span className="mr-3">Liều: {med.dosage}</span>}
                              {med.duration && <span>Thời gian: {med.duration}</span>}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-3 mt-3 border-t border-gray-100 flex gap-2">
            <button 
              onClick={() => handleMarkCompleted(prescription.prescriptionId || prescription.id)}
              className={`flex-1 py-2 rounded-lg transition text-sm font-medium ${
                prescription.status === 'ACTIVE' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-100 text-gray-500 cursor-not-allowed'
              }`}
              disabled={prescription.status !== 'ACTIVE'}
            >
              {prescription.status === 'ACTIVE' ? 'Đánh dấu hoàn thành' : 'Đã hoàn thành'}
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm font-medium">
              In đơn thuốc
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
