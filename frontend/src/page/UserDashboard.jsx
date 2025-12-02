import { useState, useEffect } from 'react';
import { Users, Heart, Calendar, Bell, AlertCircle, MessageCircle, X, Globe, Stethoscope } from 'lucide-react';
import { MdSettings } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import familyApi from '../api/familyApi';
import userApi from '../api/userApi';
import healthRecordApi from '../api/healthRecordApi';
import visitHistoryApi from '../api/visitHistoryApi';
import prescriptionApi from '../api/prescriptionApi';
import { message as antdMessage } from 'antd';

// Import Dashboard Components
import SettingsView from '../components/dashboard/SettingsView';
import ChatWidget from '../components/dashboard/ChatWidget';
import StatCard from '../components/dashboard/StatCard';
import MembersView from '../components/dashboard/MembersView';
import RecordsView from '../components/dashboard/RecordsView';
import AppointmentsView from '../components/dashboard/AppointmentsView';
import VaccinationsView from '../components/dashboard/VaccinationsView';
import NotificationDropdown from '../components/NotificationDropdown';
import DoctorView from '../components/modalUser/DoctorView'; // Import Component Mới
import vaccinationApi from '../api/vaccinationApi';

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
  const [vaccinations, setVaccinations] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [familyId, setFamilyId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: 'Gia đình',
    email: '',
    phone: '',
    address: ''
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const familyInfoResponse = await userApi.getMyFamily();
      const familyInfo = familyInfoResponse.data || familyInfoResponse;
      const familyIdValue = familyInfo?.familyId;

      if (!familyIdValue) {
        antdMessage.warning('Bạn chưa thuộc gia đình nào.');
        setDashboardData({ family: {}, members: [], statistics: {}, upcomingAppointments: [], recentNotifications: [] });
        return;
      }

      setFamilyId(familyIdValue);
      let resolvedUserId = familyInfo?.userId || familyInfo?.id;
      if (!resolvedUserId) {
        const stored = localStorage.getItem('user');
        resolvedUserId = stored ? JSON.parse(stored)?.userId : null;
      }
      setCurrentUserId(resolvedUserId);

      const dashboardResponse = await familyApi.getDashboard(familyIdValue);
      const response = dashboardResponse.data || dashboardResponse;
      setDashboardData(response);

      if (response && response.family) {
        setUserProfile({
          name: `Gia đình ${response.family.doctorName || ''}`,
          email: '',
          phone: response.family.contactNumber || '',
          address: response.family.address || ''
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      antdMessage.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch user's personal health data (medical records, visit history, prescriptions)
  useEffect(() => {
    const fetchUserHealthData = async () => {
      // Compute an effective user id to use synchronously in this function.
      let effectiveUserId = currentUserId;
      if (!effectiveUserId) {
        try {
          const stored = localStorage.getItem('user');
          const parsed = stored ? JSON.parse(stored) : null;
          effectiveUserId = parsed?.userId || parsed?.id || null;
          if (effectiveUserId) {
            // update state so other effects/components can react
            setCurrentUserId(effectiveUserId);
          }
        } catch (e) {
          console.warn('Failed to parse localStorage user for fetchUserHealthData fallback', e);
          effectiveUserId = null;
        }
      }

      if (!effectiveUserId) {
        // Nothing we can do without a user identifier
        console.warn('No user id available; skipping health data fetch');
        return;
      }

      try {
        // Fetch health records
        const healthResponse = await healthRecordApi.getAll(0, 100);
        const healthData = healthResponse?.data || healthResponse?.result || healthResponse || [];
        setMedicalRecords(Array.isArray(healthData) ? healthData : []);

        // Fetch visit history
        const visitResponse = await visitHistoryApi.getAll(0, 100);
        const visitData = visitResponse?.data || visitResponse?.result || visitResponse || [];
        setVisitHistory(Array.isArray(visitData) ? visitData : []);

        // Determine memberId to fetch prescriptions for.
        const membersList = dashboardData?.members || [];
        const memberMatch = Array.isArray(membersList)
          ? membersList.find(m => m.userId === effectiveUserId || m.memberId === effectiveUserId)
          : null;
        const memberIdToFetch = memberMatch?.memberId || effectiveUserId;

        // Only call prescriptions API when we have a valid member id
        if (memberIdToFetch === null || memberIdToFetch === undefined || memberIdToFetch === 'null') {
          console.warn('No valid memberId to fetch prescriptions; skipping');
          setPrescriptions([]);
        } else {
          const memberIdNumber = Number(memberIdToFetch);
          if (Number.isNaN(memberIdNumber)) {
            console.warn('memberIdToFetch is not a number; skipping prescriptions fetch', memberIdToFetch);
            setPrescriptions([]);
          } else {
            const prescriptionResponse = await prescriptionApi.getByMemberId(memberIdNumber);

            const prescriptionData = prescriptionResponse?.data || prescriptionResponse?.result || prescriptionResponse || [];
            setPrescriptions(Array.isArray(prescriptionData) ? prescriptionData : []);

            // Fetch vaccinations for the same member
            const vaccinationResponse = await vaccinationApi.getByMemberId(memberIdNumber);
            const vaccinationData = vaccinationResponse?.data || vaccinationResponse?.result || vaccinationResponse || [];
            setVaccinations(Array.isArray(vaccinationData) ? vaccinationData : []);
          }
        }
      } catch (error) {
        console.error('Error fetching user health data:', error);
        setMedicalRecords([]);
        setVisitHistory([]);
        setPrescriptions([]);
        setVaccinations([]);
      }
    };

    fetchUserHealthData();
  }, [currentUserId, dashboardData]);

  const handleRefreshPrescriptions = async () => {
    try {
      // Get memberId to fetch prescriptions
      const membersList = dashboardData?.members || [];
      const effectiveUserId = currentUserId || localStorage.getItem('userId');
      const memberMatch = Array.isArray(membersList)
        ? membersList.find(m => m.userId === Number(effectiveUserId) || m.memberId === Number(effectiveUserId))
        : null;
      const memberIdToFetch = memberMatch?.memberId || effectiveUserId;

      if (memberIdToFetch && !isNaN(Number(memberIdToFetch))) {
        const prescriptionResponse = await prescriptionApi.getByMemberId(Number(memberIdToFetch));
        const prescriptionData = prescriptionResponse?.data || prescriptionResponse?.result || prescriptionResponse || [];
        setPrescriptions(Array.isArray(prescriptionData) ? prescriptionData : []);
      }
    } catch (error) {
      console.error('Error refreshing prescriptions:', error);
    }
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

  const appointments = dashboardData?.upcomingAppointments?.map(a => ({
    id: a.appointmentId,
    title: a.title,
    patient: a.patientName,
    date: a.date,
    doctor: a.doctorName,
    notes: a.notes || a.visitNotes || '',
    memberId: a.memberId || a.patientId || null,
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
    { id: 'vaccinations', label: 'Tiêm chủng', icon: Bell },
    { id: 'doctor', label: 'Bác sĩ', icon: Stethoscope }
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
              <button
                onClick={changeLanguage}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-sm font-medium text-gray-700"
              >
                <Globe className="w-5 h-5 text-blue-600" />
                {i18n.language === 'en' ? 'EN' : 'VN'}
              </button>

              <NotificationDropdown />
              <button
                onClick={() => setCurrentView('settings')}
                className={`w-full border rounded-lg gap-2 px-3 py-2 transition ${currentView === 'settings'
                    ? 'bg-gray-100 border-gray-400 ring-2 ring-gray-100'
                    : 'border-gray-300 hover:bg-gray-50'
                  }`}
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
          <SettingsView
            onBack={() => setCurrentView('dashboard')}
          />
        ) : (
          <div className="space-y-8">
            {/* Stats Grid */}
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

            {/* Tab Navigation */}
            <div className="bg-white border rounded-3xl border-gray-200 p-1 overflow-x-auto">
              <nav className="flex md:grid md:grid-cols-5 min-w-max md:min-w-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center gap-2 py-2 px-4 rounded-3xl m-1 transition-all flex-1 ${activeTab === tab.id
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

            {/* Tab Content */}
            <div>
              {activeTab === 'members' && <MembersView members={familyMembers} />}
              {activeTab === 'records' && (
                <RecordsView
                  records={medicalRecords}
                  visitHistory={visitHistory}
                  prescriptions={prescriptions}
                  onRefreshPrescriptions={handleRefreshPrescriptions}
                />
              )}
              {activeTab === 'appointments' && <AppointmentsView appointments={appointments} />}
              {activeTab === 'vaccinations' && <VaccinationsView vaccinations={vaccinations} />}
              {activeTab === 'doctor' && (
                <DoctorView
                  familyId={familyId}
                  // Truyền object doctor hiện tại từ dashboardData (nếu backend đã trả về trong family object)
                  currentDoctor={dashboardData?.family?.doctorId ? {
                    id: dashboardData.family.doctorId,
                    name: dashboardData.family.doctorName,
                    specialization: dashboardData.family.doctorSpecialization, // Cần backend trả thêm trường này
                    phone: dashboardData.family.doctorPhone, // Cần backend trả thêm trường này
                    address: "Phòng khám FamilyHealth"
                  } : null}
                  onRefresh={fetchDashboardData}
                />
              )}
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