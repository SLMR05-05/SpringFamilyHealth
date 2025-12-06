import { useState, useEffect } from 'react';
import { User, Phone, MapPin, Award, CheckCircle, Search, Stethoscope, GraduationCap, Calendar, DollarSign, Building2, Languages } from 'lucide-react';
import { message as antdMessage, Card, Button, Avatar, List, Tag, Spin, Modal, Input } from 'antd';
import doctorApi from '../../api/doctorApi';
import doctorRequestApi from '../../api/doctorRequestApi';
import familyApi from '../../api/familyApi';
import memberApi from '../../api/memberApi';

const { TextArea } = Input;

export default function DoctorView() {
  
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  // State để lưu thông tin bác sĩ quản lý của gia đình
  const [familyDoctor, setFamilyDoctor] = useState(null);
  const [hasFamilyDoctor, setHasFamilyDoctor] = useState(false);
  
  // Request modal states
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [requestDoctor, setRequestDoctor] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');

  // Kiểm tra xem gia đình có bác sĩ quản lý chưa
  useEffect(() => {
    // fetchFamilyDoctor is stable for this component mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchFamilyDoctor();
  }, []);

  const fetchFamilyDoctor = async () => {
    try {
      setLoading(true);
      // Lấy thông tin user từ localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.userId || user.id;

      if (!userId) {
        console.warn('Không tìm thấy userId trong localStorage');
        setHasFamilyDoctor(false);
        setLoading(false);
        return;
      }

      // Lấy thông tin member để có familyId
      const memberResp = await memberApi.getById(userId);
      const memberData = memberResp?.data || memberResp?.result || memberResp;
      const familyId = memberData?.familyId;

      if (!familyId) {
        console.warn('Member không thuộc gia đình nào');
        setHasFamilyDoctor(false);
        setLoading(false);
        return;
      }

      // Gọi API lấy thông tin gia đình
      const familyResp = await familyApi.getById(familyId);
      const familyData = familyResp?.data || familyResp;

      // Kiểm tra xem gia đình có doctorId không
      if (familyData.doctorId) {
        // Có bác sĩ quản lý, lấy thông tin chi tiết bác sĩ
        const doctorResp = await doctorApi.getById(familyData.doctorId);
        
        // Extract doctor data từ response
        const extractDoctor = (input) => {
          if (!input) return null;
          let root = input;
          if (root && typeof root === 'object' && Object.prototype.hasOwnProperty.call(root, 'data')) {
            root = root.data;
          }

          const seen = new Set();
          const isDoctorLike = (obj) => {
            if (!obj || typeof obj !== 'object') return false;
            return Boolean(obj.doctorId || obj.id || obj.name || obj.email || obj.certificateNumber || obj.certificate);
          };

          const search = (node) => {
            if (!node || typeof node !== 'object') return null;
            if (seen.has(node)) return null;
            seen.add(node);

            if (Array.isArray(node)) {
              for (const el of node) {
                const r = search(el);
                if (r) return r;
              }
              return null;
            }

            if (isDoctorLike(node)) return node;

            for (const k of Object.keys(node)) {
              try {
                const r = search(node[k]);
                if (r) return r;
              } catch {
                // ignore
              }
            }
            return null;
          };

          return search(root);
        };

        const doctorData = extractDoctor(doctorResp);
        setFamilyDoctor(doctorData);
        setHasFamilyDoctor(true);
      } else {
        // Chưa có bác sĩ quản lý, load danh sách bác sĩ
        setHasFamilyDoctor(false);
        await fetchDoctors();
      }
    } catch (error) {
      console.error('Failed to fetch family doctor info', error);
      setHasFamilyDoctor(false);
      // Nếu có lỗi, vẫn load danh sách bác sĩ
      await fetchDoctors();
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      // Gọi API lấy danh sách bác sĩ
      const resp = await doctorApi.getAll(0, 50);
      const list = resp?.data || resp || [];
      // ensure array
      setDoctors(Array.isArray(list) ? list : (list.content || []));
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    }
  };

  // selection is currently inert — no network action here

  const openDetail = async (doctor) => {
    console.log('openDetail() called with:', doctor);
    antdMessage.info('Đang mở chi tiết...');
    
    // Set loading state first
    setDetailLoading(true);
    setSelectedDoctor(null);
    
    try {
      // attempt to fetch full doctor detail by id (supports id or doctorId)
      const id = doctor?.id || doctor?.doctorId || doctor?.userId;
      console.log('Extracted doctor ID:', id);
      
      let finalDoctor = doctor;
      
      if (id) {
        const resp = await doctorApi.getById(id);

        // Robustly extract a doctor object from a variety of nested response shapes
        const extractDoctor = (input) => {
          if (!input) return null;
          // unwrap axios response
          let root = input;
          if (root && typeof root === 'object' && Object.prototype.hasOwnProperty.call(root, 'data')) {
            root = root.data;
          }

          const seen = new Set();
          const isDoctorLike = (obj) => {
            if (!obj || typeof obj !== 'object') return false;
            return Boolean(obj.doctorId || obj.id || obj.name || obj.email || obj.certificateNumber || obj.certificate);
          };

          const search = (node) => {
            if (!node || typeof node !== 'object') return null;
            if (seen.has(node)) return null;
            seen.add(node);

            if (Array.isArray(node)) {
              for (const el of node) {
                const r = search(el);
                if (r) return r;
              }
              return null;
            }

            if (isDoctorLike(node)) return node;

            for (const k of Object.keys(node)) {
              try {
                const r = search(node[k]);
                if (r) return r;
              } catch {
                // ignore
              }
            }
            return null;
          };

          return search(root);
        };

        const data = extractDoctor(resp) || {};
        finalDoctor = { ...doctor, ...data };
        console.log('Extracted doctor data:', finalDoctor);
      } else {
        console.warn('No doctor ID found, using provided data directly');
      }
      
      // Set doctor and open modal together
      setSelectedDoctor(finalDoctor);
      setDetailLoading(false);
      setDetailVisible(true);
      
    } catch (err) {
      console.error('Failed to load doctor detail, falling back to provided object', err);
      setSelectedDoctor(doctor);
      setDetailLoading(false);
      setDetailVisible(true);
    }
  };

  const closeDetail = () => {
    setSelectedDoctor(null);
    setDetailVisible(false);
  };

  const openRequestModal = (doctor) => {
    setRequestDoctor(doctor);
    setRequestMessage('');
    setRequestModalVisible(true);
  };

  const handleSendRequest = async () => {
    if (!requestMessage.trim()) {
      antdMessage.warning('Vui lòng nhập nội dung yêu cầu');
      return;
    }

    try {
      setSelecting(true);
      
      // Get user info from localStorage and fetch member to get familyId
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.userId || user.id;
      
      // Get familyId from member
      let familyId = null;
      try {
        const memberResp = await memberApi.getById(userId);
        const memberData = memberResp?.data || memberResp?.result || memberResp;
        familyId = memberData?.familyId;
      } catch (error) {
        console.error('Failed to get member info', error);
      }

      // Extract doctorId from requestDoctor object
      const doctorId = requestDoctor.doctorId || requestDoctor.id;
      
      if (!doctorId) {
        antdMessage.error('Không tìm thấy thông tin bác sĩ. Vui lòng thử lại.');
        setSelecting(false);
        return;
      }

      console.log('Sending request with data:', {
        doctorId: doctorId,
        familyId: familyId,
        requestType: 'FAMILY_DOCTOR',
        message: requestMessage
      });

      await doctorRequestApi.sendRequest({
        doctorId: doctorId,
        familyId: familyId,
        requestType: 'FAMILY_DOCTOR',
        message: requestMessage
      });

      antdMessage.success('Đã gửi yêu cầu thành công! Bác sĩ sẽ phản hồi sớm.');
      setRequestModalVisible(false);
      setRequestMessage('');
    } catch (error) {
      console.error('Failed to send request', error);
      antdMessage.error('Không thể gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      setSelecting(false);
    }
  };

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-20">
          <Spin size="large" />
          <p className="mt-4 text-gray-500">Đang tải thông tin bác sĩ...</p>
        </div>
      </div>
    );
  }

  // Render main content based on state
  const renderContent = () => {
    // --- TRƯỜNG HỢP 1: ĐÃ CÓ BÁC SĨ QUẢN LÝ ---
    if (hasFamilyDoctor && familyDoctor) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-blue-400 px-6 py-8 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Bác sĩ gia đình của bạn</h2>
                <p className="text-blue-100">Người chịu trách nhiệm theo dõi sức khỏe cho gia đình</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 text-center">
                  <Avatar
                    size={120}
                    src={familyDoctor.avatar || `https://i.pravatar.cc/150?u=${familyDoctor.id || familyDoctor.doctorId || familyDoctor.name}`}
                    icon={<User />}
                    className="bg-blue-100 text-blue-600 mb-4"
                  />
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3" /> Đang hoạt động
                  </div>
              </div>
              
              <div className="flex-1 space-y-6">
                  <div>
                      <h3 className="text-2xl font-bold text-gray-900">{familyDoctor.name || familyDoctor.doctorName || familyDoctor.fullName}</h3>
                      <p className="text-lg text-blue-600 font-medium">{familyDoctor.specialization || familyDoctor.description || familyDoctor.doctorSpecialization || "Bác sĩ đa khoa"}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Award className="w-5 h-5 text-gray-400" />
                          <div>
                              <p className="text-xs text-gray-500">Chứng chỉ hành nghề</p>
                              <p className="font-medium">{familyDoctor.certificateNumber || familyDoctor.certificate || "Đang cập nhật"}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                              <p className="text-xs text-gray-500">Số điện thoại</p>
                              <p className="font-medium">{(familyDoctor.phone || familyDoctor.phoneNumber || familyDoctor.contact) ? (familyDoctor.phone || familyDoctor.phoneNumber || familyDoctor.contact) : "Đang cập nhật"}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <div>
                              <p className="text-xs text-gray-500">Địa chỉ phòng khám</p>
                              <p className="font-medium">{familyDoctor.address || familyDoctor.clinicAddress || "Đang cập nhật"}</p>
                          </div>
                      </div>
                      {familyDoctor.clinicName && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Building2 className="w-5 h-5 text-gray-400" />
                              <div>
                                  <p className="text-xs text-gray-500">Phòng khám/Bệnh viện</p>
                                  <p className="font-medium">{familyDoctor.clinicName}</p>
                              </div>
                          </div>
                      )}
                      {familyDoctor.yearsOfExperience && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Calendar className="w-5 h-5 text-gray-400" />
                              <div>
                                  <p className="text-xs text-gray-500">Kinh nghiệm</p>
                                  <p className="font-medium">{familyDoctor.yearsOfExperience} năm</p>
                              </div>
                          </div>
                      )}
                      {familyDoctor.education && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                              <GraduationCap className="w-5 h-5 text-gray-400" />
                              <div>
                                  <p className="text-xs text-gray-500">Trình độ học vấn</p>
                                  <p className="font-medium">{familyDoctor.education}</p>
                              </div>
                          </div>
                      )}
                      {familyDoctor.languagesSpoken && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Languages className="w-5 h-5 text-gray-400" />
                              <div>
                                  <p className="text-xs text-gray-500">Ngôn ngữ</p>
                                  <p className="font-medium">{familyDoctor.languagesSpoken}</p>
                              </div>
                          </div>
                      )}
                      {familyDoctor.consultationFee && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <DollarSign className="w-5 h-5 text-gray-400" />
                              <div>
                                  <p className="text-xs text-gray-500">Phí tư vấn</p>
                                  <p className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(familyDoctor.consultationFee)}</p>
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                      <Button 
                        type="primary" 
                        size="large" 
                        className="bg-blue-600" 
                        onClick={() => {
                          console.log('Button clicked, familyDoctor:', familyDoctor);
                          openDetail(familyDoctor);
                        }}
                      >
                          Xem chi tiết
                      </Button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // --- TRƯỜNG HỢP 2: CHƯA CÓ BÁC SĨ (HIỂN THỊ LIST ĐỂ CHỌN) ---
    return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-8">
        <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Chọn bác sĩ quản lý</h2>
        <p className="text-gray-500 mt-2 max-w-lg mx-auto">Chọn một bác sĩ từ danh sách bên dưới để quản lý sức khỏe gia đình.</p>
      </div>

      <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
          dataSource={doctors}
          renderItem={(item) => (
            <List.Item>
                <Card 
                    hoverable 
                    className="text-center border-gray-200 h-full flex flex-col justify-between"
                    actions={[
                    <Button 
                      type="primary" 
                      className="bg-blue-600 w-10/12 mx-auto"
                      loading={selecting}
                      onClick={() => openRequestModal(item)}
                    >
                      Gửi yêu cầu
                    </Button>,
                    <Button type="default" onClick={() => {
                      console.log('Doctor list button clicked, item:', item);
                      antdMessage.info('Đang mở chi tiết bác sĩ...');
                      openDetail(item);
                    }}>
                      Xem chi tiết
                    </Button>
                  ]}
                >
                    <div className="flex flex-col items-center">
                        <Avatar size={80} src={item.avatar || `https://i.pravatar.cc/150?u=${item.doctorId || item.id || item.name}`} icon={<User />} className="bg-gray-100 text-gray-500 mb-3" />
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{item.name || item.doctorName || item.fullName}</h4>
                        <Tag color="blue" className="mb-3">{item.specialization || item.description || item.doctorSpecialization || "Bác sĩ chuyên khoa"}</Tag>
                        <div className="text-sm text-gray-500 space-y-1 w-full text-left bg-gray-50 p-3 rounded-lg">
                            <div className='flex items-center gap-2'><Award size={14}/> {item.certificateNumber || item.certificate}</div>
                            <div className='flex items-center gap-2'><Phone size={14}/> {(item.phone || item.phoneNumber) ? (item.phone || item.phoneNumber) : '—'}</div>
                        </div>
                    </div>
                </Card>
            </List.Item>
            )}
        />
    </div>
    );
  };

  // Return wrapper with modals that can be used from anywhere
  return (
    <>
      {renderContent()}
      
      {/* Shared modals - always rendered */}
      {/* Request modal */}
      <Modal
        title="Gửi yêu cầu đến bác sĩ"
        open={requestModalVisible}
        visible={requestModalVisible}
        getContainer={() => document.body}
        zIndex={1000}
        destroyOnClose
        onCancel={() => setRequestModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setRequestModalVisible(false)}>Hủy</Button>,
          <Button
            key="submit"
            type="primary"
            loading={selecting}
            onClick={handleSendRequest}
            className="bg-blue-600"
          >
            Gửi yêu cầu
          </Button>,
        ]}
      >
        {requestDoctor && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar size={64} src={requestDoctor.avatar || `https://i.pravatar.cc/150?u=${requestDoctor.doctorId || requestDoctor.id || requestDoctor.name}`} icon={<User />} />
              <div>
                <div className="font-medium text-lg">{requestDoctor.name || requestDoctor.doctorName || requestDoctor.fullName}</div>
                <div className="text-sm text-gray-500">{requestDoctor.specialization || requestDoctor.description || requestDoctor.doctorSpecialization || 'Bác sĩ'}</div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">Nội dung yêu cầu:</div>
              <TextArea
                rows={4}
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Nhập nội dung yêu cầu của bạn (ví dụ: muốn đăng ký bác sĩ làm bác sĩ gia đình, cần tư vấn về sức khỏe,...)"
              />
            </div>

            <div className="text-sm text-gray-500">
              Yêu cầu của bạn sẽ được gửi đến bác sĩ. Bác sĩ sẽ xem xét và phản hồi sớm nhất có thể.
            </div>
          </div>
        )}
      </Modal>

      {/* Doctor details modal */}
      <Modal
        open={detailVisible}
        visible={detailVisible}
        getContainer={() => document.body}
        zIndex={1000}
        destroyOnClose
        onCancel={closeDetail}
        footer={null}
        width={800}
        title={
          <div className="flex items-center gap-3">
            <Avatar 
              size={48} 
              src={selectedDoctor?.avatar || `https://i.pravatar.cc/150?u=${selectedDoctor?.doctorId || selectedDoctor?.id || selectedDoctor?.name}`} 
              icon={<User />}
              className="bg-blue-100 text-blue-600"
            />
            <div>
              <div className="text-lg font-bold">{selectedDoctor ? (selectedDoctor.name || selectedDoctor.doctorName || selectedDoctor.fullName) : 'Bác sĩ'}</div>
              <div className="text-sm font-normal text-gray-500">
                {selectedDoctor?.specialization || selectedDoctor?.description || selectedDoctor?.doctorSpecialization || 'Bác sĩ đa khoa'}
              </div>
            </div>
          </div>
        }
      >
        {detailLoading ? (
          <div className="text-center py-8"><Spin size="large" /></div>
        ) : selectedDoctor ? (
          <div className="space-y-6">
            {/* Thông tin liên hệ */}
            <div className="border-b pb-4">
              <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Thông tin liên hệ
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                    <p className="font-medium text-gray-900">{selectedDoctor.phone || selectedDoctor.phoneNumber || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900 break-all">{selectedDoctor.email || selectedDoctor.contactEmail || 'Chưa cập nhật'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin chuyên môn */}
            <div className="border-b pb-4">
              <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Stethoscope className="w-4 h-4" /> Thông tin chuyên môn
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Award className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600 mb-1">Mã số chứng chỉ hành nghề</p>
                    <p className="font-medium text-gray-900">{selectedDoctor.certificateNumber || selectedDoctor.certificate || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">Chuyên khoa</p>
                    <p className="font-medium text-gray-900">{selectedDoctor.specialization || selectedDoctor.description || selectedDoctor.doctorSpecialization || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                {selectedDoctor.yearsOfExperience && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 mb-1">Kinh nghiệm</p>
                      <p className="font-medium text-gray-900">{selectedDoctor.yearsOfExperience} năm</p>
                    </div>
                  </div>
                )}
                {selectedDoctor.education && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 mb-1">Trình độ học vấn</p>
                      <p className="font-medium text-gray-900 whitespace-pre-wrap">{selectedDoctor.education}</p>
                    </div>
                  </div>
                )}
                {selectedDoctor.languagesSpoken && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Languages className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 mb-1">Ngôn ngữ giao tiếp</p>
                      <p className="font-medium text-gray-900">{selectedDoctor.languagesSpoken}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Phòng khám */}
            <div className="border-b pb-4">
              <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Phòng khám
              </h4>
              <div className="space-y-3">
                {selectedDoctor.clinicName && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 mb-1">Tên phòng khám/Bệnh viện</p>
                      <p className="font-medium text-gray-900">{selectedDoctor.clinicName}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">Địa chỉ phòng khám</p>
                    <p className="font-medium text-gray-900">{selectedDoctor.address || selectedDoctor.clinicAddress || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                {selectedDoctor.consultationFee && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600 mb-1">Phí tư vấn</p>
                      <p className="font-semibold text-green-700 text-lg">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedDoctor.consultationFee)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trạng thái */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" /> Đang hoạt động
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Không có thông tin bác sĩ</div>
        )}
      </Modal>
    </>
  );
}