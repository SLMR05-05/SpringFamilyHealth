/* eslint-disable no-unused-vars */
import { Calendar, Clock, User, MapPin, FileText, Edit, X, CheckCircle } from 'lucide-react';

export default function AppointmentCard({ 
  appointment, 
  onViewDetails, 
  onConfirm, 
  onEdit, 
  onCancel, 
  onViewResults, 
  onReschedule 
}) {
  const getStatusColor = (status) => {
    const statusColors = {
      'Đã xác nhận': 'bg-green-50 border-green-200',
      'Chờ xác nhận': 'bg-yellow-50 border-yellow-200',
      'Đã hủy': 'bg-red-50 border-red-200',
      'Hoàn thành': 'bg-blue-50 border-blue-200',
      'Confirmed': 'bg-green-50 border-green-200',
      'Pending': 'bg-yellow-50 border-yellow-200',
      'Cancelled': 'bg-red-50 border-red-200',
      'Completed': 'bg-blue-50 border-blue-200'
    };
    return statusColors[status] || 'bg-gray-50 border-gray-200';
  };

  const getStatusBadgeColor = (status) => {
    const badgeColors = {
      'Đã xác nhận': 'bg-green-100 text-green-700',
      'Chờ xác nhận': 'bg-yellow-100 text-yellow-700',
      'Đã hủy': 'bg-red-100 text-red-700',
      'Hoàn thành': 'bg-blue-100 text-blue-700',
      'Confirmed': 'bg-green-100 text-green-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Cancelled': 'bg-red-100 text-red-700',
      'Completed': 'bg-blue-100 text-blue-700'
    };
    return badgeColors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'Confirmed': 'Đã xác nhận',
      'Pending': 'Chờ xác nhận',
      'Cancelled': 'Đã hủy',
      'Completed': 'Hoàn thành'
    };
    return statusMap[status] || status;
  };

  return (
    <div className={`rounded-xl p-5 border-2 transition-all ${getStatusColor(appointment.status)}`}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">{appointment.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(appointment.status)}`}>
              {getStatusText(appointment.status)}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{appointment.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>Bệnh nhân: <span className="font-medium text-gray-900">{appointment.patient}</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>Bác sĩ: <span className="font-medium text-gray-900">{appointment.doctor}</span></span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => onViewDetails(appointment)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
          >
            <FileText className="w-4 h-4 inline mr-1" />
            Chi tiết
          </button>
          
          {appointment.status === 'Pending' && (
            <>
              <button 
                onClick={() => onConfirm(appointment)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Xác nhận
              </button>
              <button 
                onClick={() => onEdit(appointment)}
                className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition text-sm font-medium"
              >
                <Edit className="w-4 h-4 inline mr-1" />
                Sửa
              </button>
            </>
          )}
          
          {(appointment.status === 'Confirmed' || appointment.status === 'Pending') && (
            <button 
              onClick={() => onCancel(appointment)}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition text-sm font-medium"
            >
              <X className="w-4 h-4 inline mr-1" />
              Hủy
            </button>
          )}
          
          {appointment.status === 'Completed' && (
            <button 
              onClick={() => onViewResults(appointment)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              <FileText className="w-4 h-4 inline mr-1" />
              Kết quả
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
