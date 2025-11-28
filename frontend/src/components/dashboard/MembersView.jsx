import { useState } from 'react';
import { Plus, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AddMemberModal } from '../modalUser/AddMemberModal';

export default function MembersView({ members }) {
  const { t } = useTranslation();
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const handleOpenAddMemberModal = () => {
    setShowAddMemberModal(true);
  };

  const handleCloseAddMemberModal = () => {
    setShowAddMemberModal(false);
  };

  return (
    <>
    <div className='bg-white py-4 px-5 rounded-xl border border-gray-200'>
      <div className="flex justify-between items-center mb-6 ">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('Dashboard.Members.Title')}</h2>
          <p className="text-gray-500 mt-1">{t('Dashboard.Members.Subtitle')}</p>
        </div>
        <button 
          onClick={handleOpenAddMemberModal}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <Plus className="w-5 h-5" /> {t('Dashboard.Members.Add')}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"><User className="w-8 h-8 text-blue-600" /></div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.age} tuổi • {member.gender}</p>
                  <p className="text-sm text-blue-600 font-medium">{member.relationship || member.role}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${member.status === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {member.status === 'Healthy' ? t('Dashboard.Members.Status.Healthy') : t('Dashboard.Members.Status.Attention')}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              {member.dayOfBirth && (
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">Ngày sinh:</span>
                  <span className="text-gray-900">{member.dayOfBirth}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-700">{t('Dashboard.Members.BloodType')}:</span>
                <span className="text-gray-900">{member.bloodType}</span>
              </div>
              {member.weight && member.height && (
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">Cân nặng/Chiều cao:</span>
                  <span className="text-gray-900">{member.weight}kg / {member.height}cm</span>
                </div>
              )}
              {member.phone && (
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">Điện thoại:</span>
                  <span className="text-gray-900">{member.phone}</span>
                </div>
              )}
              {member.email && (
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="text-gray-900">{member.email}</span>
                </div>
              )}
              {member.address && (
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">Địa chỉ:</span>
                  <span className="text-gray-900 text-right">{member.address}</span>
                </div>
              )}
              {member.allergies && member.allergies.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">{t('Dashboard.Members.Allergies')}:</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {member.allergies.map((allergy, idx) => (
                      <span key={idx} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">{allergy}</span>
                    ))}
                  </div>
                </div>
              )}
              {member.conditions && member.conditions.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">{t('Dashboard.Members.Conditions')}:</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {member.conditions.map((condition, idx) => (
                      <span key={idx} className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">{condition}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">{t('Dashboard.Members.LastVisit')}: {member.lastVisit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <AddMemberModal 
      isOpen={showAddMemberModal} 
      onClose={handleCloseAddMemberModal} 
    />
    </>
  );
}
