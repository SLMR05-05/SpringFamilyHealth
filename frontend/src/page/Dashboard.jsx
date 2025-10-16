import { useState } from 'react';
import { Users, Heart, Calendar, Bell, Plus, User, Phone, AlertCircle, FileText } from 'lucide-react';

// Mock data
const familyMembers = [
  {
    id: 1,
    name: 'Trần Văn An',
    role: 'Chồng',
    age: 45,
    gender: 'Nam',
    phone: '0901234567',
    bloodType: 'A+',
    allergies: ['Penicillin'],
    status: 'Cần chú ý',
    conditions: ['Tăng huyết áp'],
    lastVisit: '15/9/2024'
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    role: 'Vợ',
    age: 38,
    gender: 'Nữ',
    phone: '0902345678',
    bloodType: 'B+',
    status: 'Khỏe mạnh',
    lastVisit: '20/9/2024'
  },
  {
    id: 3,
    name: 'Trần Văn Cường',
    role: 'Con trai',
    age: 16,
    gender: 'Nam',
    phone: '0903456789',
    bloodType: 'A+',
    allergies: ['Hải sản'],
    status: 'Khỏe mạnh',
    lastVisit: '10/11/2024'
  },
  {
    id: 4,
    name: 'Trần Thị Dung',
    role: 'Con gái',
    age: 12,
    gender: 'Nữ',
    phone: '',
    bloodType: 'B+',
    status: 'Khỏe mạnh',
    lastVisit: '1/9/2024'
  }
];

const medicalRecords = [
  {
    id: 1,
    type: 'checkup',
    title: 'Khám sức khỏe định kỳ',
    patient: 'Trần Văn An',
    doctor: 'BS. Nguyễn Văn A',
    date: '15/9/2024',
    status: 'completed'
  },
  {
    id: 2,
    type: 'vaccine',
    title: 'Tiêm vaccine cúm mùa',
    patient: 'Trần Thị Bình',
    doctor: 'BS. Trần Thị B',
    date: '20/9/2024',
    status: 'completed'
  },
  {
    id: 3,
    type: 'checkup',
    title: 'Khám sức khỏe học đường',
    patient: 'Trần Văn Cường',
    doctor: 'BS. Lê Văn C',
    date: '10/11/2024',
    status: 'upcoming'
  },
  {
    id: 4,
    type: 'prescription',
    title: 'Tái khám và tái kê đơn thuốc huyết áp',
    patient: 'Trần Văn An',
    doctor: 'BS. Nguyễn Văn A',
    date: '15/10/2024',
    status: 'upcoming'
  }
];

const appointments = [
  {
    id: 1,
    title: 'Khám sức khỏe học đường',
    patient: 'Trần Văn Cường',
    date: '10/11/2024',
    doctor: 'BS. Lê Văn C',
    status: 'upcoming'
  },
  {
    id: 2,
    title: 'Tái khám và tái kê đơn thuốc huyết áp',
    patient: 'Trần Văn An',
    date: '15/10/2024',
    doctor: 'BS. Nguyễn Văn A',
    status: 'upcoming'
  }
];

const notifications = [
  {
    id: 1,
    type: 'appointment',
    title: 'Nhắc nhở lịch khám',
    message: 'Trần Văn An có lịch khám vào ngày 15/10/2024',
    date: '7/10/2024',
    priority: 'high'
  },
  {
    id: 2,
    type: 'medicine',
    title: 'Thuốc sắp hết',
    message: 'Thuốc huyết áp của Trần Văn An sắp hết, cần tái kê đơn',
    date: '6/10/2024',
    priority: 'medium'
  },
  {
    id: 3,
    type: 'vaccine',
    title: 'Lịch tiêm chủng',
    message: 'Đã đến thời gian tiêm vaccine cho Trần Thị Dung',
    date: '5/10/2024',
    priority: 'low'
  }
];

export default function FamilyDashboard() {
  const [activeTab, setActiveTab] = useState('members');
  const [userName] = useState('Gia đình Trần');

  const tabs = [
    { id: 'members', label: 'Thành viên gia đình', icon: Users },
    { id: 'records', label: 'Hồ sơ y tế', icon: Heart },
    { id: 'appointments', label: 'Lịch khám', icon: Calendar },
    { id: 'notifications', label: 'Thông báo', icon: Bell }
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Family Dashboard</h1>
                <p className="text-sm text-gray-500">Chào mừng, {userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative border border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2 bg-white text-black rounded-lg">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className='flex items-center gap-2 whitespace-nowrap'>Thông báo
                <span className=" w-7 h-7 bg-red-500 text-white text-xs rounded-lg flex items-center justify-center">
                  2
                </span></span>
              </button>
              <button className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200 focus:border-indigo-400 ">
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overview Stats - Only show on overview */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 m-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Thành viên"
              value="4"
              subtitle="3 khỏe mạnh"
              icon={Users}
              onClick={() => setActiveTab('members')}
            />
            <StatCard
              title="Cần chú ý"
              value="1"
              subtitle="Cần theo dõi sức khỏe"
              icon={AlertCircle}
              alert
              onClick={() => setActiveTab('members')}
            />
            <StatCard
              title="Lịch sắp tới"
              value="2"
              subtitle="Trong tháng này"
              icon={Calendar}
              onClick={() => setActiveTab('appointments')}
            />
            <StatCard
              title="Thông báo"
              value="2"
              subtitle="Chưa đọc"
              icon={Bell}
              onClick={() => setActiveTab('notifications')}
            />
          </div>
        </div>

      {/* Navigation Tabs */}
      <div className=" max-w-7xl mx-auto rounded-3xl px-4">
        <div className="bg-grey-700 border rounded-3xl border-gray-200 max-w-7xl ">
          <nav className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-200 text-sm ">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-4 border-2 transition-colors rounded-3xl m-1 ${
                    activeTab === tab.id
                      ? ' bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'members' && <MembersView members={familyMembers} />}
        {activeTab === 'records' && <RecordsView records={medicalRecords} />}
        {activeTab === 'appointments' && <AppointmentsView appointments={appointments} />}
        {activeTab === 'notifications' && <NotificationsView notifications={notifications} />}
      </main>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition duration-200 flex items-center justify-center">
        <span className="text-xl">?</span>
      </button>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, alert, onClick }) {
  return (
    <div
      onClick={onClick}
      className={` bg-white rounded-xl p-6 shadow-sm border cursor-pointer hover:shadow-md transition-shadow ${
        alert ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <Icon className={`w-5 h-5 ${alert ? 'text-yellow-600' : 'text-gray-400'}`} />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function MembersView({ members }) {
  return (
    <div className='bg-white py-4 px-5 rounded-xl border border-gray-200'>
      <div className="flex justify-between items-center mb-6 ">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Thành viên gia đình</h2>
          <p className="text-gray-500 mt-1">Quản lý thông tin sức khỏe của các thành viên trong gia đình</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          <Plus className="w-5 h-5" />
          Thêm thành viên
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {member.name} ({member.role})
                  </h3>
                  <p className="text-sm text-gray-500">
                    {member.age} tuổi • {member.gender} • {member.role}
                  </p>
                  {member.phone && (
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Phone className="w-4 h-4" />
                      {member.phone}
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  member.status === 'Khỏe mạnh'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {member.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-700">Nhóm máu:</span>
                <span className="text-gray-900">{member.bloodType}</span>
              </div>
              {member.allergies && (
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">Dị ứng:</span>
                  <div className="flex gap-2">
                    {member.allergies.map((allergy, idx) => (
                      <span key={idx} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {member.conditions && (
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">Tình trạng:</span>
                  <div className="flex gap-2">
                    {member.conditions.map((condition, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Khám cuối: {member.lastVisit}</p>
              <button className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition">
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecordsView({ records }) {
  return (
    <div className='bg-white py-4 px-5 rounded-xl border border-gray-200'>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Hồ sơ y tế gia đình</h2>
        <p className="text-gray-500 mt-1">Theo dõi lịch sử y tế của tất cả thành viên</p>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    record.type === 'checkup'
                      ? 'bg-green-100'
                      : record.type === 'vaccine'
                      ? 'bg-blue-100'
                      : 'bg-purple-100'
                  }`}
                >
                  {record.type === 'checkup' ? (
                    <Heart className="w-6 h-6 text-green-600" />
                  ) : record.type === 'vaccine' ? (
                    <FileText className="w-6 h-6 text-blue-600" />
                  ) : (
                    <FileText className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{record.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {record.patient} • {record.doctor}
                  </p>
                  <p className="text-sm text-gray-500">{record.date}</p>
                </div>
              </div>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  record.status === 'completed'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-purple-50 text-purple-700'
                }`}
              >
                {record.status === 'completed' ? 'Hoàn thành' : 'Sắp tới'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppointmentsView({ appointments }) {
  return (
    <div className='bg-white py-4 px-5 rounded-xl border border-gray-200'>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Lịch khám sắp tới</h2>
        <p className="text-gray-500 mt-1">Các cuộc hẹn và lịch khám của gia đình</p>
      </div>

      <div className="space-y-4">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{apt.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{apt.patient}</p>
                  <p className="text-sm text-blue-700 font-medium mb-1">{apt.date} • {apt.doctor}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  Thay đổi
                </button>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsView({ notifications }) {
  return (
    <div className='bg-white py-4 px-5 rounded-xl border border-gray-200'>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Thông báo</h2>
        <p className="text-gray-500 mt-1">Tin tức và cập nhật quan trọng về sức khỏe gia đình</p>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`rounded-xl p-6 shadow-sm border ${
              notif.priority === 'high'
                ? 'bg-red-50 border-red-200'
                : notif.priority === 'medium'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-green-50 border-green-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  notif.priority === 'high'
                    ? 'bg-red-100'
                    : notif.priority === 'medium'
                    ? 'bg-yellow-100'
                    : 'bg-green-100'
                }`}
              >
                <Bell
                  className={`w-5 h-5 ${
                    notif.priority === 'high'
                      ? 'text-red-600'
                      : notif.priority === 'medium'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{notif.title}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      notif.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : notif.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {notif.priority === 'high' ? 'Cao' : notif.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{notif.message}</p>
                <p className="text-sm text-gray-500">{notif.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}