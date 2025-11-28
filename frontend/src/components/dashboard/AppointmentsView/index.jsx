import { useState, useEffect } from 'react';
import { Calendar, Plus, User, Heart, AlertCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { message as antdMessage } from 'antd';
import appointmentApi from '../../../api/appointmentApi';
import prescriptionApi from '../../../api/prescriptionApi';
import memberApi from '../../../api/memberApi';
import doctorApi from '../../../api/doctorApi';

export default function AppointmentsView({ appointments }) {
  const { t } = useTranslation();
  const [localAppointments, setLocalAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create', 'view', 'edit', 'cancel', 'reschedule', 'result'
  const [selectedPrescriptions, setSelectedPrescriptions] = useState([]);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    // Keep only appointments that belong to the current logged-in user
    // Merge incoming appointments from parent with any locally created ones not yet in parent data
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const currentMemberId = user ? (user.userId || user.id || user.memberId) : null;

    setLocalAppointments(prev => {
      const incomingRaw = appointments || [];

      // Filter incoming to only this user's appointments when we have a member id
      const incoming = incomingRaw.filter(inc => {
        const incMemberId = inc.memberId || (inc.member && (inc.member.id || inc.memberId)) || null;
        if (currentMemberId == null) return true; // if we can't determine user, keep all
        return String(incMemberId) === String(currentMemberId);
      });

      // Keep locally created appointments that are not present in incoming and belong to current user
      const localOnly = prev.filter(local => !incoming.some(inc => inc.id === local.id)
        && (currentMemberId == null || String(local.memberId) === String(currentMemberId))
      );

      return [...incoming, ...localOnly];
    });
  }, [appointments]);

  const handleCreateAppointment = () => {
    setModalType('create');
    setSelectedAppointment(null);
    setFormData({ title: '', date: '', time: '', notes: '' });
    setShowModal(true);
  };

  // Fetch appointments for the currently logged-in member directly from API
  const fetchMemberAppointments = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.warn('No user in localStorage; cannot fetch member appointments');
        return;
      }
      const user = JSON.parse(userStr);
      const memberId = user.memberId || (user.member && (user.member.memberId || user.member.id)) || user.userId || user.id;
      if (!memberId) {
        console.warn('Could not determine memberId for fetching appointments');
        return;
      }

      const resp = await appointmentApi.getByMemberId(Number(memberId));
      const list = resp?.data || resp?.result || resp || [];
      const mapped = Array.isArray(list) ? list.map(normalizeAppointment) : [];
      setLocalAppointments(mapped);
    } catch (err) {
      console.error('Failed to fetch member appointments:', err);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const normalizeAppointment = (a) => {
    if (!a) return null;
    
    
    
    const id = a.appointmentId || a.id || a.appointment_id;
    const title = a.reason || a.title || a.reasonText || '';
    
    // Enhanced patient extraction
    let patient = a.patient || a.patientName || a.memberName || '';
    if (!patient && a.member) {
      patient = a.member.name || a.member.fullName || 
                (a.member.firstName && a.member.lastName ? `${a.member.firstName} ${a.member.lastName}`.trim() : '') ||
                a.member.firstName || a.member.lastName || '';
    }
    if (!patient) patient = 'Bệnh nhân';
    
    const appointmentDate = a.appointmentDate || a.date || a.appointment_date || a.scheduledAt || null;
    let dateStr = appointmentDate;
    try {
      if (appointmentDate && typeof appointmentDate === 'string') {
        dateStr = appointmentDate.replace('T', ' ').slice(0, 16);
      }
    } catch {
      dateStr = appointmentDate;
    }
    
    // Enhanced doctor extraction
    let doctor = a.doctorName || '';
    if (!doctor && a.doctor) {
      if (typeof a.doctor === 'string') {
        doctor = a.doctor;
      } else if (a.doctor.name) {
        doctor = a.doctor.name;
      } else if (a.doctor.fullName) {
        doctor = a.doctor.fullName;
      } else if (a.doctor.firstName || a.doctor.lastName) {
        doctor = `${a.doctor.firstName || ''} ${a.doctor.lastName || ''}`.trim();
      }
    }
    
    const status = a.status || a.state || '';
    const notes = a.notes || a.diagnosis || a.reason || '';
    
    
    
    return { ...a, id, title, patient, date: dateStr, doctor, status, notes };
  };

  const handleSubmitAppointment = async () => {
    try {
      if (!formData.title || !formData.date || !formData.time) {
        antdMessage.warning('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const userStr = localStorage.getItem('user');
      if (!userStr) {
        antdMessage.error('Không tìm thấy thông tin người dùng');
        return;
      }
      const user = JSON.parse(userStr);
      const memberId = user.userId || user.id;

      // Validate member exists on server (gives clearer error to user instead of 500)
      try {
        await memberApi.getById(Number(memberId));
      } catch (err) {
        console.error('Member not found for id', memberId, err);
        antdMessage.error('Không tìm thấy hồ sơ thành viên. Vui lòng liên hệ quản trị.');
        return;
      }

      const appointmentDateTime = `${formData.date}T${formData.time}:00`;

      const payload = {
        memberId: memberId,
        // Do not hardcode doctorId here. Leave it out so backend will use family's assigned doctor.
        appointmentDate: appointmentDateTime,
        status: 'SCHEDULED',
        reason: formData.title,
        notes: formData.notes || ''
      };

      const response = await appointmentApi.create(payload);
      const newApt = response?.data || response?.result || response;

      // Build displayApt with proper patient name (user who created) and doctor from response or fallback
      const displayApt = {
        ...newApt,
        id: newApt.appointmentId || newApt.id,
        title: newApt.reason || formData.title,
        patient: user.fullName || user.name || user.username || 'Bệnh nhân',
        date: `${formData.date} ${formData.time}`,
        doctor: newApt.doctorName || (newApt.doctor && (newApt.doctor.name || `${newApt.doctor.firstName || ''} ${newApt.doctor.lastName || ''}`.trim())) || 'Bác sĩ phụ trách',
        status: newApt.status || 'SCHEDULED',
        notes: newApt.notes || formData.notes,
        memberId: memberId
      };

      setLocalAppointments(prev => [...prev, displayApt]);
      antdMessage.success(`Đặt lịch khám "${formData.title}" thành công! Phòng khám sẽ liên hệ với bạn để xác nhận.`);
      try {
        await fetchMemberAppointments();
      } catch (err) {
        console.warn('fetchMemberAppointments after create failed', err);
      }
      closeModal();
    } catch (error) {
      console.error('Failed to create appointment:', error);
      antdMessage.error('Không thể đặt lịch khám. Vui lòng thử lại.');
    }
  };

  // On mount, fetch appointments for the current member so UI always reflects server state
  useEffect(() => {
    fetchMemberAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewDetails = (apt) => {
    (async () => {
      try {
        
        const apptId = apt.id || apt.appointmentId || apt.appointmentId;
        if (!apptId) {
          setSelectedAppointment(normalizeAppointment(apt));
          setModalType('view');
          setShowModal(true);
          return;
        }
        
        const resp = await appointmentApi.getById(apptId);
        
        const data = resp?.data || resp?.result || resp || apt;
        
        const normalized = normalizeAppointment(data);

        // Fallback: preserve patient/doctor from original apt if API response lacks them
        let finalAppointment = {
          ...normalized,
          patient: normalized.patient && normalized.patient !== 'Bệnh nhân' ? normalized.patient : (apt.patient || normalized.patient),
          doctor: normalized.doctor || apt.doctor || ''
        };

        // If API returned only memberId/doctorId (no names), fetch names from memberApi / doctorApi
        try {
          const memberId = data.memberId || data.member?.memberId || data.member?.id || finalAppointment.memberId || finalAppointment.member?.memberId || finalAppointment.member?.id;
          if ((!finalAppointment.patient || finalAppointment.patient === 'Bệnh nhân') && memberId) {
            try {
              const mresp = await memberApi.getById(Number(memberId));
              const mdata = mresp?.data || mresp?.result || mresp;
              const mname = mdata?.name || mdata?.fullName || mdata?.user?.name || mdata?.user?.fullName;
              if (mname) finalAppointment = { ...finalAppointment, patient: mname };
            } catch (e) {
              console.warn('Could not fetch member name for id', memberId, e);
            }
          }

          const doctorId = data.doctorId || data.doctor?.doctorId || data.doctor?.id || finalAppointment.doctorId || finalAppointment.doctor?.doctorId || finalAppointment.doctor?.id;
          if ((!finalAppointment.doctor || finalAppointment.doctor === '') && doctorId) {
            try {
              const dresp = await doctorApi.getById(Number(doctorId));
              const ddata = dresp?.data || dresp?.result || dresp;
              const dname = ddata?.name || ddata?.fullName || ddata?.user?.name || ddata?.user?.fullName;
              if (dname) finalAppointment = { ...finalAppointment, doctor: dname };
            } catch (e) {
              console.warn('Could not fetch doctor name for id', doctorId, e);
            }
          }
        } catch {
          /* non-fatal */
        }

        
        setSelectedAppointment(finalAppointment);
        setModalType('view');
        setShowModal(true);
      } catch (err) {
        console.error('Failed to load appointment detail for view:', err);
        antdMessage.error('Không thể tải chi tiết buổi khám');
        // fallback to provided summary
        setSelectedAppointment(normalizeAppointment(apt));
        setModalType('view');
        setShowModal(true);
      }
    })();
  };

  const handleConfirmAppointment = async (apt) => {
    try {
      // Call API to update appointment status to CONFIRMED
      await appointmentApi.updateStatus(apt.id, 'CONFIRMED');
      
      // Update local state to reflect confirmed status
      setLocalAppointments(prev => prev.map(a => 
        a.id === apt.id ? { ...a, status: 'CONFIRMED' } : a
      ));
      
      antdMessage.success(`Đã xác nhận lịch khám: ${apt.title}`);
    } catch (error) {
      console.error('Failed to confirm appointment:', error);
      antdMessage.error('Không thể xác nhận lịch khám. Vui lòng thử lại.');
    }
  };

  

  const handleCancelAppointment = (apt) => {
    setSelectedAppointment(apt);
    setModalType('cancel');
    setShowModal(true);
  };

  const handleViewResults = (apt) => {
    (async () => {
      try {
        const apptId = apt.id || apt.appointmentId || apt.appointmentId;
        if (!apptId) {
          setSelectedAppointment(normalizeAppointment(apt));
          setModalType('result');
          setShowModal(true);
          return;
        }

        const resp = await appointmentApi.getById(apptId);
        const data = resp?.data || resp?.result || resp || apt;
        
        const normalized = normalizeAppointment(data);

        // Fallback: preserve patient/doctor from original apt if API response lacks them
        let finalAppointment = {
          ...normalized,
          patient: normalized.patient && normalized.patient !== 'Bệnh nhân' ? normalized.patient : (apt.patient || normalized.patient),
          doctor: normalized.doctor || apt.doctor || ''
        };

        // If API returned only memberId/doctorId (no names), fetch names from memberApi / doctorApi
        try {
          const memberId = data.memberId || data.member?.memberId || data.member?.id || finalAppointment.memberId || finalAppointment.member?.memberId || finalAppointment.member?.id;
          if ((!finalAppointment.patient || finalAppointment.patient === 'Bệnh nhân') && memberId) {
            try {
              const mresp = await memberApi.getById(Number(memberId));
              const mdata = mresp?.data || mresp?.result || mresp;
              const mname = mdata?.name || mdata?.fullName || mdata?.user?.name || mdata?.user?.fullName;
              if (mname) finalAppointment = { ...finalAppointment, patient: mname };
            } catch (e) {
              console.warn('Could not fetch member name for id', memberId, e);
            }
          }

          const doctorId = data.doctorId || data.doctor?.doctorId || data.doctor?.id || finalAppointment.doctorId || finalAppointment.doctor?.doctorId || finalAppointment.doctor?.id;
          if ((!finalAppointment.doctor || finalAppointment.doctor === '') && doctorId) {
            try {
              const dresp = await doctorApi.getById(Number(doctorId));
              const ddata = dresp?.data || dresp?.result || dresp;
              const dname = ddata?.name || ddata?.fullName || ddata?.user?.name || ddata?.user?.fullName;
              if (dname) finalAppointment = { ...finalAppointment, doctor: dname };
            } catch (e) {
              console.warn('Could not fetch doctor name for id', doctorId, e);
            }
          }
        } catch {
          /* non-fatal */
        }

        setSelectedAppointment(finalAppointment);
        setModalType('result');
        setShowModal(true);
      } catch (err) {
        console.error('Failed to load appointment detail for result:', err);
        antdMessage.error('Không thể tải chi tiết buổi khám');
        setSelectedAppointment(normalizeAppointment(apt));
        setModalType('result');
        setShowModal(true);
      }
    })();
  };

  // When modal opens for view/result, try to fetch prescriptions related to this appointment
  useEffect(() => {
    const fetchPrescriptionsForAppointment = async () => {
      if (!showModal || !selectedAppointment) return;
      // Only fetch when viewing results or viewing details where diagnosis/prescriptions needed
      if (!(modalType === 'result' || modalType === 'view')) return;

      setPrescriptionsLoading(true);
      try {
        // Try to get memberId from appointment object
        const memberId = selectedAppointment.memberId || selectedAppointment.patientId || null;
        if (!memberId) {
          // fallback to localStorage user id
          const stored = localStorage.getItem('user');
          const parsed = stored ? JSON.parse(stored) : null;
          if (parsed?.userId || parsed?.id) {
            // use parsed id as memberId fallback
            // Note: this may not always match the appointment's member
          }
        }

        // If we have a memberId, fetch that member's prescriptions and filter by appointment id
        if (memberId) {
          const resp = await prescriptionApi.getByMemberId(memberId);
          const allPres = resp?.data || resp?.result || resp || [];
          const related = Array.isArray(allPres) ? allPres.filter(p => (p.appointmentId || p.appointment || p.appointment_id) == (selectedAppointment.id || selectedAppointment.appointmentId)) : [];
          setSelectedPrescriptions(related);
        } else {
          setSelectedPrescriptions([]);
        }
      } catch (err) {
        console.error('Failed to fetch prescriptions for appointment:', err);
        setSelectedPrescriptions([]);
      } finally {
        setPrescriptionsLoading(false);
      }
    };

    fetchPrescriptionsForAppointment();
  }, [showModal, modalType, selectedAppointment]);

  const handleReschedule = (apt) => {
    setSelectedAppointment(apt);
    setModalType('reschedule');
    setShowModal(true);
  };

  const confirmCancel = async () => {
    if (selectedAppointment) {
      try {
        await appointmentApi.remove(selectedAppointment.id);
        setLocalAppointments(prev => prev.filter(a => a.id !== selectedAppointment.id));
        antdMessage.success(`Đã hủy lịch khám "${selectedAppointment.title}" thành công!`);
        setShowModal(false);
        setSelectedAppointment(null);
      } catch (error) {
        console.error('Failed to cancel appointment:', error);
        antdMessage.error('Không thể hủy lịch khám. Vui lòng thử lại.');
      }
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
      {(!localAppointments || localAppointments.length === 0) ? renderEmptyState() : (
        <div className='bg-white py-4 px-5 rounded-xl border border-gray-200'>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t('Dashboard.Appointments.Title')}</h2>
              <p className="text-gray-500 mt-1">{t('Dashboard.Appointments.Subtitle')} ({localAppointments.length} lịch khám)</p>
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
            {localAppointments.map((apt) => (
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
                {apt.status?.toLowerCase() === 'scheduled' && (
                  <button 
                    onClick={() => handleConfirmAppointment(apt)}
                    className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Xác nhận lịch khám
                  </button>
                )}
                {apt.status?.toLowerCase() === 'confirmed' && (
                  <button 
                    onClick={() => handleViewDetails(apt)}
                    className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Xem chi tiết
                  </button>
                )}
                {apt.status?.toLowerCase() === 'pending' && (
                  <button 
                    onClick={() => handleViewDetails(apt)}
                    className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Xem chi tiết
                  </button>
                )}
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
                      <select
                        value={formData.title}
                        onChange={(e) => handleFormChange('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="">-- Chọn lý do khám --</option>
                        <option value="Khám tổng quát">Khám tổng quát</option>
                        <option value="Tái khám">Tái khám</option>
                        <option value="Khám chuyên khoa">Khám chuyên khoa</option>
                        <option value="Khám theo yêu cầu">Khám theo yêu cầu</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khám</label>
                        <input 
                          type="date" 
                          value={formData.date}
                          onChange={(e) => handleFormChange('date', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giờ khám</label>
                        <input 
                          type="time" 
                          value={formData.time}
                          onChange={(e) => handleFormChange('time', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (tùy chọn)</label>
                      <textarea 
                        rows="3"
                        value={formData.notes}
                        onChange={(e) => handleFormChange('notes', e.target.value)}
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
                        onClick={handleSubmitAppointment}
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
                      {selectedAppointment.notes || selectedAppointment.reason ? (
                        <p className="text-sm text-gray-700">{selectedAppointment.notes || selectedAppointment.reason}</p>
                      ) : (
                        <p className="text-sm text-gray-700">Chưa có chẩn đoán được ghi.</p>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Đơn thuốc</h4>
                      {prescriptionsLoading ? (
                        <p className="text-sm text-gray-500">Đang tải đơn thuốc...</p>
                      ) : selectedPrescriptions && selectedPrescriptions.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-2">
                          {selectedPrescriptions.map(p => (
                            <li key={p.prescriptionId || p.id}>
                              <div className="font-medium">{p.title || `Đơn thuốc #${p.prescriptionId || p.id}`}</div>
                              <div className="text-gray-600 text-sm">Trạng thái: {p.status || 'N/A'}</div>
                              {p.medications && Array.isArray(p.medications) && (
                                <div className="text-gray-600 text-sm">Thuốc: {p.medications.map(m => m.name || m.medicationName).join(', ')}</div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-700">Không có đơn thuốc liên quan.</p>
                      )}
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