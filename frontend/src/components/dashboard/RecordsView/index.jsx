import { useState } from 'react';
import { User, FileText, Calendar, Heart } from 'lucide-react';
import HealthProfileTab from './HealthProfileTab';
import HealthRecordsTab from './HealthRecordsTab';
import VisitHistoryTab from './VisitHistoryTab';
import PrescriptionsTab from './PrescriptionsTab';

export default function RecordsView({ records, visitHistory, prescriptions, onRefreshPrescriptions }) {
  const [activeSection, setActiveSection] = useState('profile');
  
  return (
    <div className='bg-white py-4 px-5 rounded-xl border border-gray-200'>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Hồ Sơ Sức Khỏe Của Tôi</h2>
        <p className="text-gray-500 mt-1">Quản lý thông tin sức khỏe và hồ sơ y tế cá nhân</p>
      </div>

      {/* Section Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveSection('profile')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === 'profile'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Thông tin sức khỏe
          </div>
        </button>
        <button
          onClick={() => setActiveSection('records')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === 'records'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Hồ sơ y tế ({records?.length || 0})
          </div>
        </button>
        <button
          onClick={() => setActiveSection('visits')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === 'visits'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Lịch sử khám ({visitHistory?.length || 0})
          </div>
        </button>
        <button
          onClick={() => setActiveSection('prescriptions')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === 'prescriptions'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Đơn thuốc ({prescriptions?.length || 0})
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeSection === 'profile' && <HealthProfileTab />}
      {activeSection === 'records' && <HealthRecordsTab records={records} />}
      {activeSection === 'visits' && <VisitHistoryTab visitHistory={visitHistory} />}
      {activeSection === 'prescriptions' && <PrescriptionsTab prescriptions={prescriptions} onRefresh={onRefreshPrescriptions} />}
    </div>
  );
}
