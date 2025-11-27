import { useState, useRef, useEffect } from 'react';
import { Users, Heart, Calendar, Bell, Plus, User, Phone, AlertCircle, FileText, MessageCircle, X, Send, ArrowLeft, Mail, MapPin, Lock, Save, Globe } from 'lucide-react';
import { MdSettings } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import familyApi from '../api/familyApi';
import userApi from '../api/userApi';
import healthRecordApi from '../api/healthRecordApi';
import visitHistoryApi from '../api/visitHistoryApi';
import prescriptionApi from '../api/prescriptionApi';
import { message as antdMessage } from 'antd';
import { AddMemberModal } from '../components/modalUser/AddMemberModal';


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
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [visitHistory, setVisitHistory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [familyId, setFamilyId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: 'Gia đình',
    email: '',
    phone: '',
    address: ''
  });

  // Fetch dashboard data
  useEffect(() => {
    console.log('UserDashboard mounted - starting data fetch');
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('Fetching family info...');
        
        // Get user's family information
        const familyInfoResponse = await userApi.getMyFamily();
        console.log('Family info response:', familyInfoResponse);
        
        // Handle both unwrapped and wrapped responses
        const familyInfo = familyInfoResponse.data || familyInfoResponse;
        console.log('Family info data:', familyInfo);
        console.log('familyInfo.familyId:', familyInfo?.familyId);
        
        const familyIdValue = familyInfo?.familyId;
        console.log('Extracted familyId:', familyIdValue, 'Type:', typeof familyIdValue);
        
        // Check if user has a family
        if (!familyIdValue) {
          console.log('No familyId found - showing warning');
          antdMessage.warning('Bạn chưa thuộc gia đình nào. Vui lòng tạo hoặc tham gia gia đình.');
          setDashboardData({
            family: {},
            members: [],
            statistics: {
              totalMembers: 0,
              healthyMembers: 0,
              needAttention: 0,
              upcomingAppointments: 0,
              unreadNotifications: 0
            },
            upcomingAppointments: [],
            recentNotifications: []
          });
          return;
        }
        
        setFamilyId(familyIdValue);
        setCurrentUserId(familyInfo?.userId || familyInfo?.id);
        
        // Fetch dashboard data for the family
        const dashboardResponse = await familyApi.getDashboard(familyIdValue);
        console.log('Dashboard response:', dashboardResponse);
        
        // Handle both unwrapped and wrapped responses
        const response = dashboardResponse.data || dashboardResponse;
        console.log('Dashboard data:', response);
        setDashboardData(response);
        
        // Update user profile from family data
        if (response && response.family) {
          setUserProfile({
            name: `Gia đình ${response.family.doctorName || ''}`,
            email: '',
            phone: response.family.contactNumber || '',
            address: response.family.address || ''
          });
        }
        
        console.log('Dashboard data set successfully');
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        antdMessage.error('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch user's personal health data (medical records, visit history, prescriptions)
  useEffect(() => {
    const fetchUserHealthData = async () => {
      if (!currentUserId) return;
      
      try {
        console.log('Fetching health data for userId:', currentUserId);
        
        // Fetch health records
        const healthResponse = await healthRecordApi.getAll(0, 100);
        console.log('Health records response:', healthResponse);
        const healthData = healthResponse?.data || healthResponse?.result || healthResponse || [];
        setMedicalRecords(Array.isArray(healthData) ? healthData : []);
        
        // Fetch visit history
        const visitResponse = await visitHistoryApi.getAll(0, 100);
        console.log('Visit history response:', visitResponse);
        const visitData = visitResponse?.data || visitResponse?.result || visitResponse || [];
        setVisitHistory(Array.isArray(visitData) ? visitData : []);
        
        // Fetch prescriptions
        const prescriptionResponse = await prescriptionApi.getAll(0, 100);
        console.log('Prescriptions response:', prescriptionResponse);
        const prescriptionData = prescriptionResponse?.data || prescriptionResponse?.result || prescriptionResponse || [];
        setPrescriptions(Array.isArray(prescriptionData) ? prescriptionData : []);
      } catch (error) {
        console.error('Error fetching user health data:', error);
        setMedicalRecords([]);
        setVisitHistory([]);
        setPrescriptions([]);
      }
    };

    fetchUserHealthData();
  }, [currentUserId]);

  const handleSaveProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    // TODO: Call API to update profile
  };

  const changeLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vn' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Transform backend data to component format
  const familyMembers = dashboardData?.members?.map(m => ({
    id: m.memberId,
    name: m.name,
    age: m.age,
    dayOfBirth: m.dayOfBirth,
    gender: m.gender,
    role: m.roleInFamily,
    relationship: m.relationship,
    phone: m.phone,
    email: m.email,
    address: m.address,
    weight: m.weight,
    height: m.height,
    bloodType: m.bloodType || 'N/A',
    allergies: m.allergies && m.allergies !== 'Không' ? m.allergies.split(',').map(a => a.trim()) : [],
    conditions: m.chronicConditions && m.chronicConditions !== 'Không' ? m.chronicConditions.split(',').map(c => c.trim()) : [],
    lastVisit: m.lastVisit || 'Chưa có',
    status: m.status || 'Healthy'
  })) || [];
  
  console.log('Transformed familyMembers:', familyMembers);

  const appointments = dashboardData?.upcomingAppointments?.map(a => ({
    id: a.appointmentId,
    title: a.title,
    patient: a.patientName,
    date: a.date,
    doctor: a.doctorName,
    status: a.status
  })) || [];

  const notifications = dashboardData?.recentNotifications?.map(n => ({
    id: n.notificationId,
    title: n.title,
    message: n.message,
    date: n.date,
    priority: n.priority
  })) || [];

  const stats = dashboardData?.statistics || {
    totalMembers: 0,
    healthyMembers: 0,
    needAttention: 0,
    upcomingAppointments: 0,
    unreadNotifications: 0
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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : currentView === 'settings' ? (
          <SettingsView userProfile={userProfile} onSave={handleSaveProfile} onBack={() => setCurrentView('dashboard')} />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title={t('Dashboard.Stats.Members')} 
                  value={stats.totalMembers.toString()} 
                  subtitle={`${stats.healthyMembers} ${t('Dashboard.Stats.Healthy')}`} 
                  icon={Users} 
                  onClick={() => setActiveTab('members')} 
                />
                <StatCard 
                  title={t('Dashboard.Stats.Attention')} 
                  value={stats.needAttention.toString()} 
                  subtitle={t('Dashboard.Stats.Monitor')} 
                  icon={AlertCircle} 
                  alert={stats.needAttention > 0} 
                  onClick={() => setActiveTab('members')} 
                />
                <StatCard 
                  title={t('Dashboard.Stats.Upcoming')} 
                  value={stats.upcomingAppointments.toString()} 
                  subtitle={t('Dashboard.Stats.ThisMonth')} 
                  icon={Calendar} 
                  onClick={() => setActiveTab('appointments')} 
                />
                <StatCard 
                  title={t('Dashboard.Stats.Unread')} 
                  value={stats.unreadNotifications.toString()} 
                  subtitle={t('Dashboard.Stats.Unread')} 
                  icon={Bell} 
                  onClick={() => setActiveTab('notifications')} 
                />
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
                {activeTab === 'records' && <RecordsView records={medicalRecords} visitHistory={visitHistory} prescriptions={prescriptions} />}
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
              <p className="text-sm text-gray-500 mb-3">{t('Dashboard.Members.LastVisit')}: {member.lastVisit}</p>
              <button className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition">
                {t('Dashboard.Members.ViewDetails')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Add Member Modal */}
    <AddMemberModal 
      isOpen={showAddMemberModal} 
      onClose={handleCloseAddMemberModal} 
    />
    </>
  );
}

function RecordsView({ records, visitHistory, prescriptions }) {
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState({
    weight: '65',
    height: '170',
    bloodPressure: '120/80',
    heartRate: '75',
    bloodSugar: '95',
    temperature: '36.5',
    bloodType: 'O+',
    allergies: 'Không có',
    chronicConditions: 'Không có',
    currentMedications: 'Không có',
    lastCheckup: '15/11/2024'
  });
  const [editMetrics, setEditMetrics] = useState({ ...healthMetrics });

  const handleEditHealth = () => {
    setEditMetrics({ ...healthMetrics });
    setIsEditingHealth(true);
  };

  const handleSaveHealth = () => {
    setHealthMetrics({ ...editMetrics });
    setIsEditingHealth(false);
    antdMessage.success('Đã cập nhật thông tin sức khỏe');
    // TODO: Call API to save health metrics
  };

  const handleCancelEdit = () => {
    setEditMetrics({ ...healthMetrics });
    setIsEditingHealth(false);
  };

  const handleMetricChange = (field, value) => {
    setEditMetrics(prev => ({ ...prev, [field]: value }));
  };
  
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

      {/* Health Profile Section */}
      {activeSection === 'profile' && (
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Blood Pressure */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-red-700 font-medium">Huyết áp</p>
                  {!isEditingHealth ? (
                    <p className="text-2xl font-bold text-red-900">{healthMetrics.bloodPressure}</p>
                  ) : (
                    <input
                      type="text"
                      value={editMetrics.bloodPressure}
                      onChange={(e) => handleMetricChange('bloodPressure', e.target.value)}
                      className="text-2xl font-bold text-red-900 bg-white border border-red-300 rounded px-2 py-1 w-28"
                      placeholder="120/80"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Heart Rate */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-700 font-medium">Nhịp tim</p>
                  {!isEditingHealth ? (
                    <p className="text-2xl font-bold text-purple-900">{healthMetrics.heartRate} bpm</p>
                  ) : (
                    <input
                      type="text"
                      value={editMetrics.heartRate}
                      onChange={(e) => handleMetricChange('heartRate', e.target.value)}
                      className="text-2xl font-bold text-purple-900 bg-white border border-purple-300 rounded px-2 py-1 w-24"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Blood Sugar */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-orange-700 font-medium">Đường huyết</p>
                  {!isEditingHealth ? (
                    <p className="text-2xl font-bold text-orange-900">{healthMetrics.bloodSugar} mg/dL</p>
                  ) : (
                    <input
                      type="text"
                      value={editMetrics.bloodSugar}
                      onChange={(e) => handleMetricChange('bloodSugar', e.target.value)}
                      className="text-2xl font-bold text-orange-900 bg-white border border-orange-300 rounded px-2 py-1 w-24"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Temperature */}
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 border border-cyan-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-cyan-700 font-medium">Nhiệt độ</p>
                  {!isEditingHealth ? (
                    <p className="text-2xl font-bold text-cyan-900">{healthMetrics.temperature} °C</p>
                  ) : (
                    <input
                      type="text"
                      value={editMetrics.temperature}
                      onChange={(e) => handleMetricChange('temperature', e.target.value)}
                      className="text-2xl font-bold text-cyan-900 bg-white border border-cyan-300 rounded px-2 py-1 w-24"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Khám sức khỏe lần cuối</label>
              {!isEditingHealth ? (
                <p className="text-lg font-medium text-gray-900">{healthMetrics.lastCheckup}</p>
              ) : (
                <input
                  type="text"
                  value={editMetrics.lastCheckup}
                  onChange={(e) => handleMetricChange('lastCheckup', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="DD/MM/YYYY"
                />
              )}
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Thuốc đang sử dụng</label>
              {!isEditingHealth ? (
                <p className="text-lg font-medium text-gray-900">{healthMetrics.currentMedications}</p>
              ) : (
                <textarea
                  value={editMetrics.currentMedications}
                  onChange={(e) => handleMetricChange('currentMedications', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows="3"
                  placeholder="VD: Aspirin 100mg - 1 viên/ngày, Vitamin D3..."
                />
              )}
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
      )}

      {/* Health Records Section */}
      {activeSection === 'records' && (
        <div className="space-y-4">
          {records && records.length > 0 ? (
            records.map((record) => (
              <div key={record.healthRecordId || record.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{record.recordType || 'Hồ sơ y tế'}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Ngày tạo: {record.recordDate || record.createdDate || 'Chưa cập nhật'}</span>
                      </div>
                      {record.diagnosis && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="font-semibold text-gray-700 mb-1">Chẩn đoán:</p>
                          <p className="text-gray-600">{record.diagnosis}</p>
                        </div>
                      )}
                      {record.treatment && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                          <p className="font-semibold text-gray-700 mb-1">Điều trị:</p>
                          <p className="text-gray-600">{record.treatment}</p>
                        </div>
                      )}
                      {record.notes && (
                        <div className="mt-2 text-gray-600">
                          <p className="font-semibold mb-1">Ghi chú:</p>
                          <p>{record.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-100 flex gap-2">
                  <button className="flex-1 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có hồ sơ y tế</p>
            </div>
          )}
        </div>
      )}

      {/* Visit History Section */}
      {activeSection === 'visits' && (
        <div className="space-y-4">
          {visitHistory && visitHistory.length > 0 ? (
            visitHistory.map((visit) => (
              <div key={visit.visitHistoryId || visit.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Buổi khám ngày {visit.visitDate || 'Chưa cập nhật'}</h3>
                    <div className="space-y-2 text-sm">
                      {visit.doctorName && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>Bác sĩ: {visit.doctorName}</span>
                        </div>
                      )}
                      {visit.symptoms && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                          <p className="font-semibold text-gray-700 mb-1">Triệu chứng:</p>
                          <p className="text-gray-600">{visit.symptoms}</p>
                        </div>
                      )}
                      {visit.diagnosis && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="font-semibold text-gray-700 mb-1">Chẩn đoán:</p>
                          <p className="text-gray-600">{visit.diagnosis}</p>
                        </div>
                      )}
                      {visit.treatment && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                          <p className="font-semibold text-gray-700 mb-1">Điều trị:</p>
                          <p className="text-gray-600">{visit.treatment}</p>
                        </div>
                      )}
                      {visit.followUpDate && (
                        <div className="mt-2 flex items-center gap-2 text-blue-600">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">Tái khám: {visit.followUpDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-100 flex gap-2">
                  <button className="flex-1 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có lịch sử khám bệnh</p>
            </div>
          )}
        </div>
      )}

      {/* Prescriptions Section */}
      {activeSection === 'prescriptions' && (
        <div className="space-y-4">
          {prescriptions && prescriptions.length > 0 ? (
            prescriptions.map((prescription) => (
              <div key={prescription.prescriptionId || prescription.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Đơn thuốc ngày {prescription.prescriptionDate || 'Chưa cập nhật'}</h3>
                    <div className="space-y-2 text-sm">
                      {prescription.doctorName && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>Bác sĩ kê đơn: {prescription.doctorName}</span>
                        </div>
                      )}
                      {prescription.diagnosis && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="font-semibold text-gray-700 mb-1">Chẩn đoán:</p>
                          <p className="text-gray-600">{prescription.diagnosis}</p>
                        </div>
                      )}
                      {prescription.medications && prescription.medications.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="font-semibold text-gray-700 mb-2">Thuốc kê đơn:</p>
                          <ul className="space-y-1">
                            {prescription.medications.map((med, idx) => (
                              <li key={idx} className="text-gray-600">
                                • {med.medicationName || med.name} - {med.dosage || 'Liều lượng chưa rõ'} ({med.frequency || 'Tần suất chưa rõ'})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {prescription.instructions && (
                        <div className="mt-2 text-gray-600">
                          <p className="font-semibold mb-1">Hướng dẫn sử dụng:</p>
                          <p>{prescription.instructions}</p>
                        </div>
                      )}
                      {prescription.notes && (
                        <div className="mt-2 text-gray-600">
                          <p className="font-semibold mb-1">Ghi chú:</p>
                          <p>{prescription.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-100 flex gap-2">
                  <button className="flex-1 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium">
                    Xem chi tiết
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm font-medium">
                    In đơn thuốc
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có đơn thuốc nào</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AppointmentsView({ appointments }) {
  const { t } = useTranslation();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create', 'view', 'edit', 'cancel', 'reschedule', 'result'

  const handleCreateAppointment = () => {
    setModalType('create');
    setSelectedAppointment(null);
    setShowModal(true);
  };

  const handleViewDetails = (apt) => {
    setSelectedAppointment(apt);
    setModalType('view');
    setShowModal(true);
  };

  const handleConfirmAppointment = (apt) => {
    antdMessage.success(`Đã xác nhận lịch khám: ${apt.title}`);
    // TODO: Call API to confirm appointment
  };

  const handleEditAppointment = (apt) => {
    setSelectedAppointment(apt);
    setModalType('edit');
    setShowModal(true);
  };

  const handleCancelAppointment = (apt) => {
    setSelectedAppointment(apt);
    setModalType('cancel');
    setShowModal(true);
  };

  const handleViewResults = (apt) => {
    setSelectedAppointment(apt);
    setModalType('result');
    setShowModal(true);
  };

  const handleReschedule = (apt) => {
    setSelectedAppointment(apt);
    setModalType('reschedule');
    setShowModal(true);
  };

  const confirmCancel = () => {
    if (selectedAppointment) {
      antdMessage.warning(`Đã hủy lịch khám: ${selectedAppointment.title}`);
      // TODO: Call API to cancel appointment
      setShowModal(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    setModalType('');
  };
  
  const renderEmptyState = () => (
    <div className='bg-white py-8 px-5 rounded-xl border border-gray-200'>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('Dashboard.Appointments.Title')}</h2>
        <p className="text-gray-500 mt-1">{t('Dashboard.Appointments.Subtitle')}</p>
      </div>
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Chưa có lịch khám nào</p>
        <p className="text-gray-400 text-sm mt-2">Các cuộc hẹn khám bệnh sắp tới sẽ hiển thị tại đây</p>
        <button 
          onClick={handleCreateAppointment}
          className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium flex items-center gap-2 mx-auto"
        >
          <Plus className="w-5 h-5" />
          Đặt lịch khám
        </button>
      </div>
    </div>
  );
  
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'scheduled':
      case 'confirmed':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'cancelled':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'scheduled':
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch(status?.toLowerCase()) {
      case 'scheduled':
        return 'Đã lên lịch';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status || 'Không xác định';
    }
  };
  
  return (
    <>
      {(!appointments || appointments.length === 0) ? renderEmptyState() : (
        <div className='bg-white py-4 px-5 rounded-xl border border-gray-200'>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t('Dashboard.Appointments.Title')}</h2>
              <p className="text-gray-500 mt-1">{t('Dashboard.Appointments.Subtitle')} ({appointments.length} lịch khám)</p>
            </div>
            <button 
              onClick={handleCreateAppointment}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <Plus className="w-5 h-5" />
              Đặt lịch mới
            </button>
          </div>
          
          <div className="space-y-4">
            {appointments.map((apt) => (
          <div key={apt.id} className={`rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow ${getStatusColor(apt.status)}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                  apt.status?.toLowerCase() === 'cancelled' ? 'bg-red-100' : 
                  apt.status?.toLowerCase() === 'completed' ? 'bg-green-100' : 
                  'bg-blue-100'
                }`}>
                  <Calendar className={`w-7 h-7 ${
                    apt.status?.toLowerCase() === 'cancelled' ? 'text-red-600' : 
                    apt.status?.toLowerCase() === 'completed' ? 'text-green-600' : 
                    'text-blue-600'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{apt.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ml-4 ${getStatusBadgeColor(apt.status)}`}>
                      {getStatusText(apt.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Bệnh nhân:</span>
                      <span>{apt.patient}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Thời gian:</span>
                      <span className="font-semibold text-blue-600">{apt.date}</span>
                    </div>
                    
                    {apt.doctor && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Heart className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Bác sĩ:</span>
                        <span>{apt.doctor}</span>
                      </div>
                    )}
                  </div>
                  
                  {apt.status?.toLowerCase() === 'pending' && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-yellow-700 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-yellow-800">
                        Lịch khám đang chờ xác nhận từ phòng khám. Bạn sẽ nhận được thông báo khi lịch khám được xác nhận.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {apt.status?.toLowerCase() !== 'cancelled' && apt.status?.toLowerCase() !== 'completed' && (
              <div className="pt-3 border-t border-gray-200 flex gap-2">
                <button 
                  onClick={() => apt.status?.toLowerCase() === 'pending' ? handleViewDetails(apt) : handleConfirmAppointment(apt)}
                  className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  {apt.status?.toLowerCase() === 'pending' ? 'Xem chi tiết' : t('Dashboard.Appointments.Confirm')}
                </button>
                <button 
                  onClick={() => handleEditAppointment(apt)}
                  className="px-5 py-2.5 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100 transition text-sm font-medium"
                >
                  {t('Dashboard.Appointments.Change')}
                </button>
                <button 
                  onClick={() => handleCancelAppointment(apt)}
                  className="px-5 py-2.5 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition text-sm font-medium"
                >
                  Hủy lịch
                </button>
              </div>
            )}
            
            {apt.status?.toLowerCase() === 'completed' && (
              <div className="pt-3 border-t border-gray-200 flex gap-2">
                <button 
                  onClick={() => handleViewResults(apt)}
                  className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                >
                  Xem kết quả khám
                </button>
                <button 
                  onClick={() => handleReschedule(apt)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
                >
                  Đặt lịch tái khám
                </button>
              </div>
            )}
            
            {apt.status?.toLowerCase() === 'cancelled' && (
              <div className="pt-3 border-t border-red-200">
                <p className="text-sm text-red-600 mb-3 flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Lịch khám đã bị hủy
                </p>
                <button 
                  onClick={() => handleReschedule(apt)}
                  className="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                >
                  Đặt lại lịch khám
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
        </div>
      )}
      
      {/* Modal Component - Always render to handle both empty and non-empty states */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-900">
                {modalType === 'create' && 'Đặt lịch khám mới'}
                {modalType === 'view' && 'Chi tiết lịch khám'}
                {modalType === 'edit' && 'Chỉnh sửa lịch khám'}
                {modalType === 'cancel' && 'Xác nhận hủy lịch'}
                {modalType === 'reschedule' && 'Đặt lại lịch khám'}
                {modalType === 'result' && 'Kết quả khám bệnh'}
              </h3>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              {modalType === 'cancel' && selectedAppointment && (
                <div>
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-900">Bạn có chắc muốn hủy lịch khám này?</p>
                      <p className="text-sm text-red-700 mt-1">Hành động này không thể hoàn tác.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">Lý do khám:</span>
                      <span className="text-gray-900">{selectedAppointment.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">Bệnh nhân:</span>
                      <span className="text-gray-900">{selectedAppointment.patient}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">Thời gian:</span>
                      <span className="text-blue-600 font-semibold">{selectedAppointment.date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">Bác sĩ:</span>
                      <span className="text-gray-900">{selectedAppointment.doctor}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={closeModal}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                    >
                      Quay lại
                    </button>
                    <button 
                      onClick={confirmCancel}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                    >
                      Xác nhận hủy
                    </button>
                  </div>
                </div>
              )}
              
              {modalType === 'view' && selectedAppointment && (
                <div>
                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-3">Thông tin lịch khám</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Lý do khám:</span>
                          <span className="font-medium text-gray-900">{selectedAppointment.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Bệnh nhân:</span>
                          <span className="font-medium text-gray-900">{selectedAppointment.patient}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Thời gian:</span>
                          <span className="font-semibold text-blue-600">{selectedAppointment.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Bác sĩ:</span>
                          <span className="font-medium text-gray-900">{selectedAppointment.doctor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Trạng thái:</span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(selectedAppointment.status)}`}>
                            {getStatusText(selectedAppointment.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {selectedAppointment.status?.toLowerCase() === 'pending' && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-yellow-900">Đang chờ xác nhận</p>
                            <p className="text-sm text-yellow-700 mt-1">
                              Phòng khám sẽ liên hệ với bạn trong vòng 24h để xác nhận lịch khám.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={closeModal}
                    className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
                  >
                    Đóng
                  </button>
                </div>
              )}
              
              {(modalType === 'create' || modalType === 'edit' || modalType === 'reschedule') && (
                <div>
                  <p className="text-gray-600 mb-4">
                    {modalType === 'create' && 'Vui lòng điền thông tin để đặt lịch khám mới.'}
                    {modalType === 'edit' && 'Chỉnh sửa thông tin lịch khám của bạn.'}
                    {modalType === 'reschedule' && 'Đặt lại lịch khám với thời gian mới.'}
                  </p>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lý do khám</label>
                      <input 
                        type="text" 
                        defaultValue={selectedAppointment?.title}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="VD: Khám tổng quát, Tái khám..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khám</label>
                        <input 
                          type="date" 
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giờ khám</label>
                        <input 
                          type="time" 
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (tùy chọn)</label>
                      <textarea 
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Thêm ghi chú về triệu chứng hoặc yêu cầu đặc biệt..."
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button 
                        type="button"
                        onClick={closeModal}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                      >
                        Hủy
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          antdMessage.success(modalType === 'create' ? 'Đã tạo lịch khám mới' : 'Đã cập nhật lịch khám');
                          closeModal();
                        }}
                        className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
                      >
                        {modalType === 'create' ? 'Đặt lịch' : 'Lưu thay đổi'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {modalType === 'result' && selectedAppointment && (
                <div>
                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-3">Thông tin khám bệnh</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Ngày khám:</span>
                          <span className="font-medium text-gray-900">{selectedAppointment.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Bác sĩ:</span>
                          <span className="font-medium text-gray-900">{selectedAppointment.doctor}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Chẩn đoán</h4>
                      <p className="text-sm text-gray-700">Kết quả khám sẽ được cập nhật sau khi hoàn thành.</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Đơn thuốc</h4>
                      <p className="text-sm text-gray-700">Chưa có đơn thuốc.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={closeModal}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                    >
                      Đóng
                    </button>
                    <button 
                      onClick={() => {
                        antdMessage.success('Đã tải xuống kết quả khám');
                      }}
                      className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
                    >
                      Tải xuống
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
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