import { useState, useRef, useEffect } from 'react';
import { Users, Heart, Calendar, Bell, Plus, User, Phone, AlertCircle, FileText, MessageCircle, X, Send, ArrowLeft, Mail, MapPin, Lock, Save, Globe, Search, MoreVertical } from 'lucide-react';
import { MdSettings } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import familyApi from '../api/familyApi';
import userApi from '../api/userApi';
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

// --- ADVANCED CHAT WIDGET ---
function AdvancedChatWidget({ onClose }) {
  const { t } = useTranslation();
  
  // Mock Contacts
  const contacts = [
    { id: 1, name: 'BS. Nguyễn Văn A', role: 'Doctor', online: true, avatarColor: 'bg-blue-100 text-blue-600' },
    { id: 2, name: 'CSKH FamilyHealth', role: 'Support', online: true, avatarColor: 'bg-green-100 text-green-600' },
    { id: 3, name: 'Trần Thị Bình', role: 'Family', online: false, avatarColor: 'bg-purple-100 text-purple-600' }
  ];

  // Initial messages state
  const [activeContactId, setActiveContactId] = useState(null);
  const [messages, setMessages] = useState({
    1: [{ id: 1, text: "Chào bác sĩ, hôm nay tôi thấy hơi mệt.", sender: 'user', time: '10:00' }, { id: 2, text: "Chào bạn, bạn có thể mô tả kỹ hơn triệu chứng không?", sender: 'other', time: '10:05' }],
    2: [{ id: 1, text: "Tôi muốn hỏi về gói khám sức khỏe.", sender: 'user', time: '09:00' }],
    3: []
  });

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  const activeContact = contacts.find(c => c.id === activeContactId);
  const currentMessages = activeContactId ? (messages[activeContactId] || []) : [];

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [currentMessages, activeContactId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContactId) return;

    const newMessage = { id: Date.now(), text: inputText, sender: 'user', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    
    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));
    setInputText("");

    // Simulate response
    setTimeout(() => {
      const responseText = activeContact.role === 'Doctor' 
        ? "Cảm ơn thông tin của bạn. Tôi sẽ xem xét ngay." 
        : "Chúng tôi đã ghi nhận yêu cầu của bạn.";
        
      const botResponse = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'other',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      setMessages(prev => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] || []), botResponse]
      }));
    }, 1500);
  };

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="fixed bottom-24 right-6 w-[90vw] md:w-[700px] h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex overflow-hidden z-40">
      {/* Sidebar / Contact List */}
      <div className={`${activeContactId ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 flex-col border-r border-gray-200 bg-gray-50`}>
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
            <h3 className="font-bold text-gray-800">{t('Dashboard.Chat.Title')}</h3>
            <button onClick={onClose} className="md:hidden text-gray-500"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-3">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"/>
                <input 
                    type="text" 
                    placeholder={t('Dashboard.Chat.Search')} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            {filteredContacts.map(contact => (
                <div 
                    key={contact.id}
                    onClick={() => setActiveContactId(contact.id)}
                    className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition ${activeContactId === contact.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}`}
                >
                    <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${contact.avatarColor}`}>
                            {contact.name.charAt(0)}
                        </div>
                        {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{contact.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{t(`Dashboard.Chat.Roles.${contact.role}`)}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`${!activeContactId ? 'hidden md:flex' : 'flex'} w-full md:w-2/3 flex-col bg-white`}>
        {activeContactId ? (
            <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setActiveContactId(null)} className="md:hidden p-1 hover:bg-gray-100 rounded-full">
                            <ArrowLeft className="w-5 h-5 text-gray-600"/>
                        </button>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${activeContact.avatarColor}`}>
                            {activeContact.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">{activeContact.name}</h4>
                            <div className="flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${activeContact.online ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                <p className="text-xs text-gray-500">{activeContact.online ? t('Dashboard.Chat.Status.Online') : t('Dashboard.Chat.Status.Offline')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"><Phone className="w-4 h-4"/></button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"><MoreVertical className="w-4 h-4"/></button>
                        <button onClick={onClose} className="hidden md:block p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"><X className="w-5 h-5"/></button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                    {currentMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <MessageCircle className="w-12 h-12 mb-2 opacity-20"/>
                            <p className="text-sm">Bắt đầu cuộc trò chuyện với {activeContact.name}</p>
                        </div>
                    ) : (
                        currentMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] space-y-1`}>
                                    <div className={`p-3 text-sm rounded-xl ${
                                        msg.sender === 'user' 
                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                    }`}>
                                        {msg.text}
                                    </div>
                                    <p className={`text-[10px] text-gray-400 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white">
                    <div className="flex gap-2 items-center">
                        <button type="button" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"><Plus className="w-5 h-5"/></button>
                        <input 
                            type="text" 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={t('Dashboard.Chat.TypeMessage')}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-gray-50"
                        />
                        <button 
                            type="submit" 
                            disabled={!inputText.trim()}
                            className={`p-2 rounded-full flex items-center justify-center transition ${inputText.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 relative bg-gray-50/50">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="w-10 h-10 text-blue-200"/>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">{t('Dashboard.Chat.Title')}</h3>
                <p className="text-sm">{t('Dashboard.Chat.SelectContact')}</p>
                <button onClick={onClose} className="absolute top-4 right-4 md:block hidden p-2 hover:bg-gray-200 rounded-full"><X className="w-5 h-5"/></button>
            </div>
        )}
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
  const [familyId, setFamilyId] = useState(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
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

  // Fetch medical records when familyId changes
  useEffect(() => {
    const fetchMedicalRecords = async () => {
      if (!familyId) return;
      
      try {
        console.log('Fetching medical records for familyId:', familyId);
        const recordsResponse = await familyApi.getMedicalRecords(familyId);
        const records = recordsResponse.data || recordsResponse;
        console.log('Medical records:', records);
        setMedicalRecords(records || []);
      } catch (error) {
        console.error('Failed to load medical records:', error);
        // Don't show error message to user, just use empty array
      }
    };

    fetchMedicalRecords();
  }, [familyId]);

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

  const transformedRecords = medicalRecords?.map(r => ({
    id: r.recordId,
    type: r.type,
    title: r.title,
    patient: r.patientName,
    date: r.date,
    diagnosis: r.diagnosis,
    followUpDate: r.followUpDate,
    status: r.status
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
                <StatCard title={t('Dashboard.Stats.Members')} value={stats.totalMembers.toString()} subtitle={`3 ${t('Dashboard.Stats.Healthy')}`} icon={Users} onClick={() => setActiveTab('members')} />
                <StatCard title={t('Dashboard.Stats.Attention')} value={stats.needAttention.toString()} subtitle={t('Dashboard.Stats.Monitor')} icon={AlertCircle} alert={stats.needAttention > 0} onClick={() => setActiveTab('members')} />
                <StatCard title={t('Dashboard.Stats.Upcoming')} value={stats.upcomingAppointments.toString()} subtitle={t('Dashboard.Stats.ThisMonth')} icon={Calendar} onClick={() => setActiveTab('appointments')} />
                <StatCard title={t('Dashboard.Stats.Unread')} value={stats.unreadNotifications.toString()} subtitle={t('Dashboard.Stats.Unread')} icon={Bell} onClick={() => setActiveTab('notifications')} />
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
                {activeTab === 'members' && <MembersView members={familyMembers} onOpenAddModal={() => setIsAddMemberOpen(true)} />}
                {activeTab === 'records' && <RecordsView records={transformedRecords} />}
                {activeTab === 'appointments' && <AppointmentsView appointments={appointments} />}
                {activeTab === 'notifications' && <NotificationsView notifications={notifications} />}
            </div>
          </div>
        )}
      </main>

      {/* MODALS & WIDGETS */}
      {/* 1. Modal Thêm thành viên */}
      <AddMemberModal 
        isOpen={isAddMemberOpen} 
        onClose={() => setIsAddMemberOpen(false)} 
      />

      {/* 2. Chat Widget */}
      {isChatOpen && <AdvancedChatWidget onClose={() => setIsChatOpen(false)} />}
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

function MembersView({ members, onOpenAddModal }) {
  const { t } = useTranslation();
  return (
    <div className='bg-white py-4 px-5 rounded-xl border border-gray-200'>
      <div className="flex justify-between items-center mb-6 ">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('Dashboard.Members.Title')}</h2>
          <p className="text-gray-500 mt-1">{t('Dashboard.Members.Subtitle')}</p>
        </div>
        <button onClick={onOpenAddModal} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"><Plus className="w-5 h-5" /> {t('Dashboard.Members.Add')}</button>
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
  );
}

function RecordsView({ records }) {
  const { t } = useTranslation();
  
  if (!records || records.length === 0) {
    return (
      <div className='bg-white py-8 px-5 rounded-xl border border-gray-200'>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('Dashboard.Records.Title')}</h2>
          <p className="text-gray-500 mt-1">{t('Dashboard.Records.Subtitle')}</p>
        </div>
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Chưa có hồ sơ y tế nào</p>
          <p className="text-gray-400 text-sm mt-2">Các lần khám bệnh sẽ được hiển thị tại đây</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className='bg-white py-4 px-5 rounded-xl border border-gray-200'>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('Dashboard.Records.Title')}</h2>
        <p className="text-gray-500 mt-1">{t('Dashboard.Records.Subtitle')} ({records.length} hồ sơ)</p>
      </div>
      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  record.type === 'visit' ? 'bg-blue-100' : 
                  record.type === 'checkup' ? 'bg-green-100' : 
                  record.type === 'vaccine' ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  {record.type === 'visit' ? <Heart className="w-6 h-6 text-blue-600" /> : 
                   record.type === 'checkup' ? <Heart className="w-6 h-6 text-green-600" /> : 
                   record.type === 'vaccine' ? <FileText className="w-6 h-6 text-purple-600" /> : 
                   <FileText className="w-6 h-6 text-gray-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{record.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    <span className="font-medium">{record.patient}</span>
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {record.date}
                  </p>
                  {record.diagnosis && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Chẩn đoán:</p>
                      <p className="text-sm text-gray-600">{record.diagnosis}</p>
                    </div>
                  )}
                  {record.followUpDate && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                      <Calendar className="w-4 h-4" />
                      <span>Tái khám: {record.followUpDate}</span>
                    </div>
                  )}
                </div>
              </div>
              <span className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                record.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' : 
                'bg-orange-50 text-orange-700 border border-orange-200'
              }`}>
                {record.status === 'completed' ? t('Dashboard.Records.Completed') : t('Dashboard.Records.Upcoming')}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-100 flex gap-2">
              <button className="flex-1 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium">
                Xem chi tiết
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm font-medium">
                In hồ sơ
              </button>
            </div>
          </div>
        ))}
      </div>
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
  
  if (!appointments || appointments.length === 0) {
    return (
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
  }
  
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
      
      {/* Modal Component */}
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