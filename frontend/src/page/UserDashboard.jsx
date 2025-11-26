import { useState, useRef, useEffect } from 'react';
import { Users, Heart, Calendar, Bell, Plus, User, Phone, AlertCircle, FileText, MessageCircle, X, Send, ArrowLeft, Mail, MapPin, Lock, Save, Globe } from 'lucide-react';
import { MdSettings } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

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
    status: 'Attention', // Changed to key
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
    status: 'Healthy', // Changed to key
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
    status: 'Healthy',
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
    status: 'Healthy',
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

// --- SETTINGS COMPONENT ---
function SettingsView({ userProfile, onSave, onBack }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(userProfile);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleForgotPassword = () => {
    alert(`Email sent to: ${formData.email}`);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('Settings.Title')}</h2>
          <p className="text-sm text-gray-500">{t('Settings.Subtitle')}</p>
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> {t('Settings.PersonalInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Settings.FullName')}</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Settings.Phone')}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Settings.Address')}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" /> {t('Settings.Security')}
            </h3>
            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Settings.Email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50" />
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full"><Lock className="w-4 h-4 text-blue-600" /></div>
                    <div>
                        <p className="font-medium text-gray-900">{t('Settings.Password')}</p>
                        <p className="text-xs text-gray-500">{t('Settings.LastChanged')}: 3 months ago</p>
                    </div>
                </div>
                <button type="button" onClick={handleForgotPassword} className="text-sm font-medium text-blue-700 hover:text-blue-800 underline">
                    {t('Settings.ForgotPassword')}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
             {isSaved && <span className="text-green-600 text-sm font-medium animate-pulse">{t('Settings.SavedMsg')}</span>}
             <button type="button" onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
               {t('Settings.Cancel')}
             </button>
             <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-2">
               <Save className="w-4 h-4" /> {t('Settings.Save')}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function FamilyDashboard() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('members');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [userProfile, setUserProfile] = useState({
    name: 'Gia đình Trần',
    email: 'giadinh.tran@example.com',
    phone: '0901234567',
    address: 'Quận 1, TP. Hồ Chí Minh'
  });

  const handleSaveProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
  };

  const changeLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vn' : 'en';
    i18n.changeLanguage(newLang);
  };

  const tabs = [
    { id: 'members', label: t('Dashboard.Tabs.Members'), icon: Users },
    { id: 'records', label: t('Dashboard.Tabs.Records'), icon: Heart },
    { id: 'appointments', label: t('Dashboard.Tabs.Appointments'), icon: Calendar },
    { id: 'notifications', label: t('Dashboard.Tabs.Notifications'), icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('Dashboard.Title')}</h1>
                <p className="text-sm text-gray-500">{t('Dashboard.Welcome')}, {userProfile.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <button 
                onClick={changeLanguage}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-sm font-medium text-gray-700"
              >
                <Globe className="w-5 h-5 text-blue-600" />
                {i18n.language === 'en' ? 'EN' : 'VN'}
              </button>

              <button className="relative border border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2 bg-white text-black hover:bg-gray-50 transition">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className='hidden sm:flex items-center gap-2 whitespace-nowrap'>{t('Dashboard.Notifications')}
                <span className=" w-7 h-7 bg-red-500 text-white text-xs rounded-lg flex items-center justify-center">2</span></span>
              </button>
              <button 
                onClick={() => setCurrentView('settings')}
                className={`w-full border rounded-lg gap-2 px-3 py-2 transition ${currentView === 'settings' ? 'bg-gray-100 border-gray-400 ring-2 ring-gray-100' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                  <MdSettings className="settings-icon w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'settings' ? (
          <SettingsView userProfile={userProfile} onSave={handleSaveProfile} onBack={() => setCurrentView('dashboard')} />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={t('Dashboard.Stats.Members')} value="4" subtitle={`3 ${t('Dashboard.Stats.Healthy')}`} icon={Users} onClick={() => setActiveTab('members')} />
                <StatCard title={t('Dashboard.Stats.Attention')} value="1" subtitle={t('Dashboard.Stats.Monitor')} icon={AlertCircle} alert onClick={() => setActiveTab('members')} />
                <StatCard title={t('Dashboard.Stats.Upcoming')} value="2" subtitle={t('Dashboard.Stats.ThisMonth')} icon={Calendar} onClick={() => setActiveTab('appointments')} />
                <StatCard title={t('Dashboard.Stats.Unread')} value="2" subtitle={t('Dashboard.Stats.Unread')} icon={Bell} onClick={() => setActiveTab('notifications')} />
            </div>

            <div className="bg-white border rounded-3xl border-gray-200 p-1 overflow-x-auto">
              <nav className="flex md:grid md:grid-cols-4 min-w-max md:min-w-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center gap-2 py-2 px-4 rounded-3xl m-1 transition-all flex-1 ${
                        activeTab === tab.id
                          ? 'bg-gray-900 text-white shadow-md'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium whitespace-nowrap">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div>
                {activeTab === 'members' && <MembersView members={familyMembers} />}
                {activeTab === 'records' && <RecordsView records={medicalRecords} />}
                {activeTab === 'appointments' && <AppointmentsView appointments={appointments} />}
                {activeTab === 'notifications' && <NotificationsView notifications={notifications} />}
            </div>
          </div>
        )}
      </main>

      {/* Chat Widget */}
      {isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition duration-200 flex items-center justify-center z-50"
      >
        {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}

// --- SUB COMPONENTS ---

function ChatWidget({ onClose }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    { id: 1, text: t('Dashboard.Chat.Welcome'), sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMessage = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInputText("");
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: t('Dashboard.Chat.Response'),
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-40 h-[500px] overflow-hidden">
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <h3 className="font-bold">{t('Dashboard.Chat.Title')}</h3>
        </div>
        <button onClick={onClose} className="hover:text-gray-300"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={t('Dashboard.Chat.Placeholder')} className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-sm" />
          <button type="submit" className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition"><Send className="w-4 h-4" /></button>
        </div>
      </form>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, alert, onClick }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-xl p-6 shadow-sm border cursor-pointer hover:shadow-md transition-shadow ${alert ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'}`}>
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
  const { t } = useTranslation();
  return (
    <div className='bg-white py-4 px-5 rounded-xl border border-gray-200'>
      <div className="flex justify-between items-center mb-6 ">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('Dashboard.Members.Title')}</h2>
          <p className="text-gray-500 mt-1">{t('Dashboard.Members.Subtitle')}</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"><Plus className="w-5 h-5" /> {t('Dashboard.Members.Add')}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"><User className="w-8 h-8 text-blue-600" /></div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{member.name} ({member.role})</h3>
                  <p className="text-sm text-gray-500">{member.age} {t('Dashboard.Members.Age')} • {member.gender} • {member.role}</p>
                  {member.phone && <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Phone className="w-4 h-4" />{member.phone}</p>}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${member.status === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {member.status === 'Healthy' ? t('Dashboard.Members.Status.Healthy') : t('Dashboard.Members.Status.Attention')}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm"><span className="font-semibold text-gray-700">{t('Dashboard.Members.BloodType')}:</span><span className="text-gray-900">{member.bloodType}</span></div>
              {member.allergies && <div className="flex justify-between text-sm"><span className="font-semibold text-gray-700">{t('Dashboard.Members.Allergies')}:</span><div className="flex gap-2">{member.allergies.map((allergy, idx) => (<span key={idx} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">{allergy}</span>))}</div></div>}
              {member.conditions && <div className="flex justify-between text-sm"><span className="font-semibold text-gray-700">{t('Dashboard.Members.Conditions')}:</span><div className="flex gap-2">{member.conditions.map((condition, idx) => (<span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{condition}</span>))}</div></div>}
            </div>
            <div className="pt-4 border-t border-gray-200"><p className="text-sm text-gray-500 mb-3">{t('Dashboard.Members.LastVisit')}: {member.lastVisit}</p><button className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition">{t('Dashboard.Members.ViewDetails')}</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecordsView({ records }) {
  const { t } = useTranslation();
  return (
    <div className='bg-white py-4 px-5 rounded-xl border border-gray-200'>
      <div className="mb-6"><h2 className="text-2xl font-bold text-gray-900">{t('Dashboard.Records.Title')}</h2><p className="text-gray-500 mt-1">{t('Dashboard.Records.Subtitle')}</p></div>
      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${record.type === 'checkup' ? 'bg-green-100' : record.type === 'vaccine' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                  {record.type === 'checkup' ? <Heart className="w-6 h-6 text-green-600" /> : record.type === 'vaccine' ? <FileText className="w-6 h-6 text-blue-600" /> : <FileText className="w-6 h-6 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{record.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{record.patient} • {record.doctor}</p>
                  <p className="text-sm text-gray-500">{record.date}</p>
                </div>
              </div>
              <button className={`px-4 py-2 rounded-lg text-sm font-medium ${record.status === 'completed' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>{record.status === 'completed' ? t('Dashboard.Records.Completed') : t('Dashboard.Records.Upcoming')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppointmentsView({ appointments }) {
  const { t } = useTranslation();
  return (
    <div className='bg-white py-4 px-5 rounded-xl border border-gray-200'>
      <div className="mb-6"><h2 className="text-2xl font-bold text-gray-900">{t('Dashboard.Appointments.Title')}</h2><p className="text-gray-500 mt-1">{t('Dashboard.Appointments.Subtitle')}</p></div>
      <div className="space-y-4">
        {appointments.map((apt) => (
          <div key={apt.id} className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Calendar className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{apt.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{apt.patient}</p>
                  <p className="text-sm text-blue-700 font-medium mb-1">{apt.date} • {apt.doctor}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">{t('Dashboard.Appointments.Change')}</button>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">{t('Dashboard.Appointments.Confirm')}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsView({ notifications }) {
  const { t } = useTranslation();
  const getPriorityLabel = (p) => {
      if(p === 'high') return t('Dashboard.Notifs.Priority.High');
      if(p === 'medium') return t('Dashboard.Notifs.Priority.Medium');
      return t('Dashboard.Notifs.Priority.Low');
  }

  return (
    <div className='bg-white py-4 px-5 rounded-xl border border-gray-200'>
      <div className="mb-6"><h2 className="text-2xl font-bold text-gray-900">{t('Dashboard.Notifs.Title')}</h2><p className="text-gray-500 mt-1">{t('Dashboard.Notifs.Subtitle')}</p></div>
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className={`rounded-xl p-6 shadow-sm border ${notif.priority === 'high' ? 'bg-red-50 border-red-200' : notif.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notif.priority === 'high' ? 'bg-red-100' : notif.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                <Bell className={`w-5 h-5 ${notif.priority === 'high' ? 'text-red-600' : notif.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{notif.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${notif.priority === 'high' ? 'bg-red-100 text-red-700' : notif.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{getPriorityLabel(notif.priority)}</span>
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