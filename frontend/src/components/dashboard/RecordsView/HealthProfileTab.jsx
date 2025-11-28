import { useState, useEffect } from 'react';
import { Plus, User, AlertCircle } from 'lucide-react';
import { message as antdMessage } from 'antd';
import healthRecordApi from '../../../api/healthRecordApi';
import memberApi from '../../../api/memberApi';
import prescriptionApi from '../../../api/prescriptionApi';
import appointmentApi from '../../../api/appointmentApi';

export default function HealthProfileTab() {
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState({
    weight: '',
    height: '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    currentMedications: 'Không có',
    lastCheckup: ''
  });
  const [editMetrics, setEditMetrics] = useState({ ...healthMetrics });

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        
        // Get current logged-in user ID
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setLoading(false);
          return;
        }
        
        const user = JSON.parse(userStr);
        const userId = user.userId || user.id;
        
        // Fetch member data
        const memberResponse = await memberApi.getById(userId);
        const memberData = memberResponse?.data || memberResponse?.result || memberResponse;
        
        // Fetch health record data by member ID
        let userHealthRecord = null;
        try {
          const healthResponse = await healthRecordApi.getByMemberId(userId);
          userHealthRecord = healthResponse?.data || healthResponse?.result || healthResponse;
        } catch (error) {
          userHealthRecord = null;
        }
        
        // Fetch active prescriptions to get current medications
        let currentMedications = 'Không có';
        try {
          const prescriptionResponse = await prescriptionApi.getByMemberId(userId);
          const prescriptions = prescriptionResponse?.data || prescriptionResponse?.result || prescriptionResponse || [];
          
          // Filter active prescriptions and extract medications
          const activePrescriptions = prescriptions.filter(p => p.status === 'ACTIVE');
          if (activePrescriptions.length > 0) {
            const activeMeds = activePrescriptions
              .flatMap(p => p.medications || [])
              .map(med => `${med.medicationName} (${med.dosage || 'chưa rõ liều'})`)
              .join(', ');
            currentMedications = activeMeds || 'Không có';
          }
        } catch (error) {
        }
        
        // Fetch appointments to get last completed checkup date
        let lastCheckup = memberData?.lastVisit || '';
        try {
          const appointmentResponse = await appointmentApi.getByMemberId(userId);
          const appointments = appointmentResponse?.data || appointmentResponse?.result || appointmentResponse || [];
          
          // Find the most recent completed appointment
          const completedAppointments = appointments
            .filter(apt => apt.status === 'COMPLETED')
            .sort((a, b) => new Date(b.appointmentDate || 0) - new Date(a.appointmentDate || 0));
            
          if (completedAppointments.length > 0) {
            const lastAppointment = completedAppointments[0];
            lastCheckup = new Date(lastAppointment.appointmentDate).toLocaleDateString('vi-VN');
          }
        } catch (error) {
        }
        
        // Combine data from all sources
        const combinedMetrics = {
          weight: memberData?.weight?.toString() || '',
          height: memberData?.height?.toString() || '',
          bloodType: userHealthRecord?.bloodType || memberData?.bloodType || '',
          allergies: userHealthRecord?.allergies || 'Không có',
          chronicConditions: userHealthRecord?.chronicConditions || 'Không có',
          currentMedications,
          lastCheckup
        };
        
        setHealthMetrics(combinedMetrics);
        setEditMetrics(combinedMetrics);
      } catch (error) {
        console.error('Failed to fetch health data:', error);
        antdMessage.error('Không thể tải thông tin sức khỏe');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  const handleEditHealth = () => {
    setEditMetrics({ ...healthMetrics });
    setIsEditingHealth(true);
  };

  const handleSaveHealth = async () => {
    try {
      // Get current user ID
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        antdMessage.error('Không tìm thấy thông tin người dùng');
        return;
      }
      
      const user = JSON.parse(userStr);
      const userId = user.userId || user.id;
      
      // Update member data (weight, height) using PATCH /api/members/me
      try {
        await memberApi.updateMe({
          weight: parseFloat(editMetrics.weight) || 0,
          height: parseFloat(editMetrics.height) || 0
        });
      } catch (error) {
        console.error('Failed to update member data:', error);
        throw new Error('Không thể cập nhật cân nặng và chiều cao');
      }
      
      // Update health record data (blood type, allergies, chronic conditions)
      const healthRecordData = {
        memberId: userId,
        bloodType: editMetrics.bloodType,
        allergies: editMetrics.allergies,
        chronicConditions: editMetrics.chronicConditions
      };
      
      // Try to update existing record, or create new one if needed
      try {
        // First try to get existing health record
        const existingRecord = await healthRecordApi.getByMemberId(userId);
        const recordId = existingRecord?.data?.healthRecordId || existingRecord?.result?.healthRecordId || existingRecord?.healthRecordId;
        
        if (recordId) {
          await healthRecordApi.update(recordId, healthRecordData);
        } else {
          // create for authenticated user's member (no memberId in payload expected by backend /me endpoint)
          await healthRecordApi.createForMe({
            bloodType: editMetrics.bloodType,
            allergies: editMetrics.allergies,
            chronicConditions: editMetrics.chronicConditions
          });
        }
      } catch (error) {
        console.error('Failed to update health record:', error);
        // Try to create new record if update fails
        try {
          await healthRecordApi.createForMe({
            bloodType: editMetrics.bloodType,
            allergies: editMetrics.allergies,
            chronicConditions: editMetrics.chronicConditions
          });
        } catch (createError) {
          console.error('Failed to create health record:', createError);
          throw new Error('Không thể cập nhật hồ sơ sức khỏe');
        }
      }
      
      setHealthMetrics({ ...editMetrics });
      setIsEditingHealth(false);
      antdMessage.success('Đã cập nhật thông tin sức khỏe');
    } catch (error) {
      console.error('Failed to save health metrics:', error);
      antdMessage.error(error.message || 'Không thể cập nhật thông tin sức khỏe. Vui lòng thử lại.');
    }
  };

  const handleCancelEdit = () => {
    setEditMetrics({ ...healthMetrics });
    setIsEditingHealth(false);
  };

  const handleMetricChange = (field, value) => {
    setEditMetrics(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="text-gray-500 mt-3">Đang tải thông tin sức khỏe...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Chỉ số sức khỏe hiện tại</h3>
        {!isEditingHealth ? (
          <button
            onClick={handleEditHealth}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            <Plus className="w-4 h-4" />
            Chỉnh sửa
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveHealth}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Lưu thay đổi
            </button>
          </div>
        )}
      </div>

      {/* Vital Signs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weight */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Cân nặng</p>
              {!isEditingHealth ? (
                <p className="text-2xl font-bold text-blue-900">{healthMetrics.weight} kg</p>
              ) : (
                <input
                  type="text"
                  value={editMetrics.weight}
                  onChange={(e) => handleMetricChange('weight', e.target.value)}
                  className="text-2xl font-bold text-blue-900 bg-white border border-blue-300 rounded px-2 py-1 w-24"
                />
              )}
            </div>
          </div>
        </div>

        {/* Height */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Chiều cao</p>
              {!isEditingHealth ? (
                <p className="text-2xl font-bold text-green-900">{healthMetrics.height} cm</p>
              ) : (
                <input
                  type="text"
                  value={editMetrics.height}
                  onChange={(e) => handleMetricChange('height', e.target.value)}
                  className="text-2xl font-bold text-green-900 bg-white border border-green-300 rounded px-2 py-1 w-24"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Blood Type */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nhóm máu</label>
          {!isEditingHealth ? (
            <p className="text-lg font-medium text-gray-900">{healthMetrics.bloodType}</p>
          ) : (
            <input
              type="text"
              value={editMetrics.bloodType}
              onChange={(e) => handleMetricChange('bloodType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="VD: O+, A-, B+..."
            />
          )}
        </div>

        {/* Last Checkup */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Khám sức khỏe lần cuối
            <span className="text-xs font-normal text-gray-500 ml-2">(Tự động từ lịch hẹn hoàn thành)</span>
          </label>
          <div className="text-lg font-medium text-gray-900 bg-gray-50 rounded-lg p-3 border border-gray-200">
            {healthMetrics.lastCheckup || 'Chưa có thông tin'}
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Dị ứng</label>
          {!isEditingHealth ? (
            <p className="text-lg font-medium text-gray-900">{healthMetrics.allergies}</p>
          ) : (
            <textarea
              value={editMetrics.allergies}
              onChange={(e) => handleMetricChange('allergies', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="2"
              placeholder="VD: Phấn hoa, hải sản, penicillin..."
            />
          )}
        </div>

        {/* Chronic Conditions */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Bệnh mãn tính</label>
          {!isEditingHealth ? (
            <p className="text-lg font-medium text-gray-900">{healthMetrics.chronicConditions}</p>
          ) : (
            <textarea
              value={editMetrics.chronicConditions}
              onChange={(e) => handleMetricChange('chronicConditions', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="2"
              placeholder="VD: Tiểu đường, cao huyết áp, hen suyễn..."
            />
          )}
        </div>

        {/* Current Medications */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Thuốc đang sử dụng
            <span className="text-xs font-normal text-gray-500 ml-2">(Tự động cập nhật từ đơn thuốc đang hoạt động)</span>
          </label>
          <div className="text-lg font-medium text-gray-900 bg-gray-50 rounded-lg p-3 border border-gray-200">
            {healthMetrics.currentMedications}
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200 mt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Lời khuyên sức khỏe</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Cập nhật các chỉ số sức khỏe thường xuyên để theo dõi tốt hơn</li>
              <li>• Nên khám sức khỏe định kỳ 6 tháng/lần</li>
              <li>• Thông báo ngay cho bác sĩ nếu có bất kỳ thay đổi bất thường nào</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
