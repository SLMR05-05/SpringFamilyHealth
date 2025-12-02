import { useState, useEffect } from 'react';
import { User, Phone, MapPin, Award, CheckCircle, Search, Stethoscope } from 'lucide-react';
import { message as antdMessage, Card, Button, Avatar, List, Tag, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
// Giả định bạn sẽ tạo/cập nhật api này
// import familyApi from '../../api/familyApi'; 
// import userApi from '../../api/userApi';

export default function DoctorView({ familyId, currentDoctor, onRefresh }) {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState(false);

  // Nếu chưa có bác sĩ, tải danh sách bác sĩ để chọn
  useEffect(() => {
    if (!currentDoctor) {
      fetchDoctors();
    }
  }, [currentDoctor]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      // Gọi API lấy danh sách bác sĩ (cần implement ở backend)
      const response = await userApi.getAllDoctors(); 
      setDoctors(response.data || response);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDoctor = async (doctorId) => {
    try {
      setSelecting(true);
      // Gọi API cập nhật bác sĩ cho gia đình
      await familyApi.updateDoctor(familyId, doctorId);
      antdMessage.success('Đã chọn bác sĩ thành công!');
      onRefresh(); // Tải lại dashboard để cập nhật state cha
    } catch (error) {
      antdMessage.error('Không thể chọn bác sĩ. Vui lòng thử lại.');
    } finally {
      setSelecting(false);
    }
  };

  // --- TRƯỜNG HỢP 1: ĐÃ CÓ BÁC SĨ QUẢN LÝ ---
  if (currentDoctor && currentDoctor.id) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-8 text-white">
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
            <div className="flex-shrink-0 text-center">
                <Avatar 
                    size={120} 
                    src={currentDoctor.avatar} 
                    icon={<User />} 
                    className="bg-blue-100 text-blue-600 mb-4"
                />
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" /> Đang hoạt động
                </div>
            </div>
            
            <div className="flex-1 space-y-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">{currentDoctor.name}</h3>
                    <p className="text-lg text-blue-600 font-medium">{currentDoctor.specialization || "Bác sĩ đa khoa"}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Award className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Chứng chỉ hành nghề</p>
                            <p className="font-medium">{currentDoctor.certificateNumber || "Đang cập nhật"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Số điện thoại</p>
                            <p className="font-medium">{currentDoctor.phone || "Đang cập nhật"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Địa chỉ phòng khám</p>
                            <p className="font-medium">{currentDoctor.address || "Đang cập nhật"}</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <Button type="primary" size="large" className="bg-blue-600">
                        Đặt lịch hẹn ngay
                    </Button>
                    <Button type="default" size="large" className="ml-3">
                        Nhắn tin
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
        <h2 className="text-2xl font-bold text-gray-900">Chọn Bác sĩ quản lý</h2>
        <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            Gia đình bạn chưa có bác sĩ quản lý. Vui lòng chọn một bác sĩ từ danh sách dưới đây để bắt đầu theo dõi sức khỏe.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10"><Spin size="large" /></div>
      ) : (
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
                            onClick={() => handleSelectDoctor(item.doctorId)} // Giả sử API trả về doctorId
                        >
                            Chọn bác sĩ này
                        </Button>
                    ]}
                >
                    <div className="flex flex-col items-center">
                        <Avatar size={80} icon={<User />} className="bg-gray-100 text-gray-500 mb-3" />
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h4>
                        <Tag color="blue" className="mb-3">{item.specialization || "Bác sĩ chuyên khoa"}</Tag>
                        <div className="text-sm text-gray-500 space-y-1 w-full text-left bg-gray-50 p-3 rounded-lg">
                            <div className='flex items-center gap-2'><Award size={14}/> {item.certificateNumber}</div>
                            <div className='flex items-center gap-2'><Phone size={14}/> {item.phone}</div>
                        </div>
                    </div>
                </Card>
            </List.Item>
            )}
        />
      )}
    </div>
  );
}