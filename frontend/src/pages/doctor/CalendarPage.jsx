import { Button, Card, Typography, Grid, Space, Modal, Row, Col, Divider, Tag } from "antd";
import React, { useState, useMemo } from "react";
import {
  ClockCircleOutlined,
  LeftOutlined, 
  RightOutlined, 
  CloseCircleOutlined,
  CheckCircleOutlined,
  RedoOutlined,
  CloseOutlined, 
  ReloadOutlined
} from "@ant-design/icons";
// Loại bỏ import AppointmentDetailModal để tránh xung đột, component được định nghĩa ngay bên dưới

const { Text, Title } = Typography; 
const { useBreakpoint } = Grid;


// --- Dữ liệu chi tiết Lịch hẹn theo ngày (Dữ liệu State) ---
// Key là chuỗi ngày tháng: DD/MM/YYYY
const detailedAppointmentsByDate = {
    "22/11/2025": [
        { id: 101, time: "09:00", period: "SÁNG", name: "Hoàng Văn Giang", type: "Khám tổng quát", completed: true, isCancelled: false, statusText: "Đã hoàn thành", notes: "Bệnh nhân đã khám tổng quát, không có vấn đề nghiêm trọng." },
        { id: 102, time: "10:30", period: "SÁNG", name: "Ngô Thị Hà", type: "Tái khám", completed: false, isCancelled: false, statusText: "Chờ khám", notes: "Bệnh nhân cần mang theo kết quả xét nghiệm máu gần nhất." },
        { id: 103, time: "02:00", period: "CHIỀU", name: "Lý Anh Kiệt", type: "Tư vấn sức khỏe", completed: true, isCancelled: true, statusText: "Đã hủy hẹn", notes: "Tư vấn về chế độ ăn cho người cao tuổi." },
        { id: 104, time: "04:00", period: "CHIỀU", name: "Trần Thị Lan", type: "Kiểm tra định kỳ", completed: false, isCancelled: false, statusText: "Chờ khám", notes: "Kiểm tra định kỳ sau 3 tháng tiêm vắc xin." },
    ],
    "23/11/2025": [
        { id: 201, time: "08:30", period: "SÁNG", name: "Lê Văn An", type: "Khám chuyên khoa", completed: false, isCancelled: false, statusText: "Chờ khám", notes: "Chuẩn bị hồ sơ." },
        { id: 202, time: "11:00", period: "SÁNG", name: "Phạm Thúy Hằng", type: "Kiểm tra mắt", completed: true, isCancelled: false, statusText: "Đã hoàn thành", notes: "Mang theo kính cũ." },
    ],
};


// --- Component AppointmentDetailModal ---
const AppointmentDetailModal = ({ isVisible, onClose, appointmentDetail, onCancel, onComplete, onRestore }) => {
    const { 
        patientName = "Không rõ",
        time = "Không rõ",
        period = "", 
        date = "Không rõ",
        type = "Không rõ",
        notes = "Không có ghi chú.",
        id, 
        isCompleted = false,
        isCancelled = false 
    } = appointmentDetail || {};

    const handleAction = (actionFunction) => {
        if (actionFunction && id) {
            actionFunction(id, appointmentDetail.dateKey); // Truyền thêm dateKey
        }
        onClose();
    };

    return (
        <Modal
            open={isVisible}
            onCancel={onClose}
            footer={null} 
            closeIcon={<CloseOutlined className="text-gray-500 hover:text-red-500 transition" />} 
            width={500} 
            centered 
            className="rounded-xl shadow-2xl"
        >
            <div className="p-4">
                <Title level={4} className="mb-6 text-gray-800 border-b pb-2">
                    Chi tiết cuộc hẹn
                </Title>

                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
                    <div className="col-span-2">
                        <Text strong className="block text-gray-500 text-sm mb-1">Bệnh nhân</Text>
                        <Text className="text-xl font-bold text-indigo-600">{patientName}</Text>
                    </div>

                    <div className='bg-gray-50 p-3 rounded-lg'>
                        <Text strong className="block text-gray-500 text-sm mb-1">Thời gian</Text>
                        <Text className="text-base text-gray-800 font-mono">{time} {period}</Text>
                    </div>
                    
                    <div className='bg-gray-50 p-3 rounded-lg'>
                        <Text strong className="block text-gray-500 text-sm mb-1">Ngày hẹn</Text>
                        <Text className="text-base text-gray-800">{date}</Text>
                    </div>

                    <div className="col-span-2 mt-2">
                        <Text strong className="block text-gray-500 text-sm mb-1">Loại cuộc hẹn</Text>
                        <Text className="text-base text-gray-800 font-medium">{type}</Text>
                    </div>

                    <div className="col-span-2 mt-2">
                        <Text strong className="block text-gray-500 text-sm mb-1">Ghi chú</Text>
                        <Card className="bg-white border-dashed border-gray-300 shadow-inner p-3">
                            <Text className="text-base text-gray-700 italic block whitespace-pre-wrap">{notes}</Text>
                        </Card>
                    </div>
                </div>

                {/* Footer với các nút hành động */}
                <div className="flex flex-wrap justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
                    
                    {isCancelled && (
                        <Button 
                            icon={<ReloadOutlined />}
                            type="default"
                            className="text-green-600 border-green-600 hover:bg-green-50 font-semibold order-1 lg:order-1 w-full sm:w-auto"
                            onClick={() => handleAction(onRestore)}
                        >
                            Khôi phục cuộc hẹn
                        </Button>
                    )}
                    
                    {!isCompleted && (
                        <Button 
                            danger 
                            icon={<CloseCircleOutlined />}
                            className="bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600 font-semibold order-3 lg:order-2 w-full sm:w-auto"
                            onClick={() => handleAction(onCancel)} 
                            disabled={isCancelled} 
                        >
                            Hủy hẹn
                        </Button>
                    )}
                    
                    {!isCompleted && (
                        <Button 
                            type="primary" 
                            icon={<CheckCircleOutlined />}
                            className="bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700 font-semibold order-2 lg:order-3 w-full sm:w-auto"
                            onClick={() => handleAction(onComplete)} 
                            disabled={isCancelled} 
                        >
                            Đánh dấu hoàn thành
                        </Button>
                    )}
                    
                    <Button 
                        type="default" 
                        onClick={onClose}
                        className="order-4 lg:order-4 w-full sm:w-auto mt-2 sm:mt-0"
                    >
                        Đóng
                    </Button>
                </div>
            </div>
        </Modal>
    );
};


// --- Component CalendarPage ---
const CalendarPage = () => {
  const today = new Date();
  
  // Helper: Trích xuất DD/MM/YYYY từ chuỗi đầy đủ (ví dụ: "Thứ 7, 22/11/2025")
  const getFormattedDateKey = (fullDateString) => {
    // Tìm chuỗi DD/MM/YYYY, giả định nó nằm sau dấu phẩy và khoảng trắng
    const match = fullDateString.match(/(\d{2}\/\d{2}\/\d{4})/);
    return match ? match[0] : "";
  };

  // 1. TÌM NGÀY ĐẦU TUẦN HIỆN TẠI (Thứ 2)
  const getStartOfWeek = (date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - (day === 0 ? 6 : day - 1); 
      d.setDate(diff);
      return d;
  };

  // 2. STATE CHÍNH CHO LỊCH VÀ MODAL
  const initialStartOfWeek = getStartOfWeek(today);
  const [currentDate, setCurrentDate] = useState(initialStartOfWeek); 
  const [selectedDayDetail, setSelectedDayDetail] = useState(today.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }));
  const screens = useBreakpoint();
    
  // State chứa toàn bộ dữ liệu hẹn hò chi tiết (theo ngày)
  const [appointmentsData, setAppointmentsData] = useState(detailedAppointmentsByDate); 
  const [isAppointmentDetailModalVisible, setIsAppointmentDetailModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Tính toán các cuộc hẹn chi tiết cho ngày được chọn
  const currentDailyAppointments = useMemo(() => {
    const dateKey = getFormattedDateKey(selectedDayDetail);
    return appointmentsData[dateKey] || [];
  }, [appointmentsData, selectedDayDetail]);


  // 3. HÀM CẬP NHẬT NGÀY (LOGIC CHÍNH)
  const updateDate = (interval, amount) => {
    // Nếu là Tuần Hiện Tại, đưa về ngày hôm nay
    if (interval === 'week' && amount === 0) {
        const newStartOfWeek = getStartOfWeek(today);
        setCurrentDate(newStartOfWeek);
        setSelectedDayDetail(today.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }));
        return;
    }

    setCurrentDate(prevDate => {
        const newDate = new Date(prevDate);
        if (interval === 'week') {
            newDate.setDate(prevDate.getDate() + (amount * 7));
        }
        // Khi chuyển tuần, chọn ngày đầu tiên của tuần mới làm ngày hiển thị chi tiết mặc định
        const newSelectedDayDetail = new Date(newDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
        setSelectedDayDetail(newSelectedDayDetail);
        return newDate;
    });
  };

  // Cập nhật selectedDayDetail khi click vào ô lịch
  const handleSelectDay = (fullDateString, dateKey) => {
    setSelectedDayDetail(fullDateString);
    // Khi chọn ngày mới, ta có thể preload dữ liệu chi tiết nếu cần, nhưng hiện tại currentDailyAppointments đã làm điều đó qua useMemo.
  };


  // 4. HÀM TÍNH TOÁN DẢI THỜI GIAN HIỂN THỊ
  const formatMonthYear = (date) => {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(date.getDate() + 6);
      
      const startMonth = start.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
      const endMonth = end.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
      
      if (startMonth === endMonth) {
          return startMonth.charAt(0).toUpperCase() + startMonth.slice(1);
      } else {
          const startStr = start.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
          const endStr = end.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
          return `${startStr} - ${endStr}`;
      }
  };

  const currentDisplayMonthYear = formatMonthYear(currentDate);

  // HÀM ĐÓNG MODAL
  const handleCloseModal = () => {
      setIsAppointmentDetailModalVisible(false);
      setSelectedAppointment(null); 
  };

  // Hàm cập nhật trạng thái chung
  const updateAppointmentStatus = (appointmentId, dateKey, updates) => {
    setAppointmentsData(prevData => {
        const appointmentsOnDay = prevData[dateKey] || [];
        const updatedAppointments = appointmentsOnDay.map(app => {
            if (app.id === appointmentId) {
                // Tạo đối tượng mới với các cập nhật
                return { ...app, ...updates };
            }
            return app;
        });
        
        return {
            ...prevData,
            [dateKey]: updatedAppointments
        };
    });
  };


  // HÀM XỬ LÝ HỦY HẸN (ĐƯỢC GỌI TỪ MODAL)
  const handleCancelAppointment = (appointmentId, dateKey) => {
      updateAppointmentStatus(appointmentId, dateKey, {
        completed: true,
        isCancelled: true,
        statusText: "Đã hủy hẹn"
      });
  };

  // HÀM MỚI: ĐÁNH DẤU HOÀN THÀNH
  const handleCompleteAppointment = (appointmentId, dateKey) => {
      updateAppointmentStatus(appointmentId, dateKey, {
        completed: true,
        isCancelled: false,
        statusText: "Đã hoàn thành"
      });
  };

  // HÀM MỚI: KHÔI PHỤC CUỘC HẸN 
  const handleRestoreAppointment = (appointmentId, dateKey) => {
      updateAppointmentStatus(appointmentId, dateKey, {
        completed: false,
        isCancelled: false,
        statusText: "Chờ khám"
      });
  };


  // HÀM XỬ LÝ MỞ MODAL 
  const handleViewAppointmentDetail = (appointment) => {
    const dateKey = getFormattedDateKey(selectedDayDetail);
    setSelectedAppointment({
        id: appointment.id,
        dateKey: dateKey, // Truyền DateKey để cập nhật state sau này
        patientName: appointment.name,
        time: appointment.time, 
        period: appointment.period, 
        date: selectedDayDetail, 
        type: appointment.type,
        notes: appointment.notes || "Không có ghi chú chi tiết.",
        status: appointment.isCancelled ? "Đã hủy hẹn" : (appointment.completed ? "Đã hoàn thành" : "Chờ khám"),
        isCompleted: appointment.completed,
        isCancelled: appointment.isCancelled
    });
    setIsAppointmentDetailModalVisible(true);
  };


// Hàm mô phỏng hiển thị các lịch hẹn trong ô ngày (Sử dụng dữ liệu appointmentsData)
const renderScheduleInDay = (dateStr) => {
    // Lấy dữ liệu chi tiết từ state
    const records = appointmentsData[dateStr];
    if (!records || records.length === 0) return null;

    return (
        <div className="mt-1 space-y-1">
            {records.map((record, index) => {
                let colorClass;
                if (record.isCancelled) {
                    colorClass = 'bg-red-500'; // Đã hủy
                } else if (record.completed) {
                    colorClass = 'bg-green-600'; // Đã hoàn thành
                } else {
                    colorClass = 'bg-blue-500'; // Chờ khám
                }

                return (
                    <div 
                        key={record.id || index} 
                        className={`p-1.5 text-xs text-white rounded cursor-pointer ${colorClass} truncate transition hover:shadow-lg`} 
                        title={`${record.time} - ${record.name} (${record.type}) - ${record.statusText}`} 
                    >
                        
                        <div className="font-semibold leading-tight max-h-4 overflow-hidden">
                            {record.name.split(' ').slice(0, 2).join(' ')}...
                        </div>
                        
                        <div className="text-sm font-normal leading-tight">
                            {record.time} - {record.type}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

  // 5. TẠO CẤU TRÚC LỊCH DẠNG TUẦN (Sử dụng currentDate)
  const renderWeekView = () => {
    const days = [];
    let startDay = new Date(currentDate);

    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startDay);
        currentDay.setDate(startDay.getDate() + i);
        
        const isToday = currentDay.toDateString() === today.toDateString();
        
        // Chuỗi ngày tháng năm theo format 'dd/mm/yyyy' để khớp với appointmentsData
        const dateStr = `${String(currentDay.getDate()).padStart(2, '0')}/${String(currentDay.getMonth() + 1).padStart(2, '0')}/${currentDay.getFullYear()}`;
        const label = currentDay.toLocaleDateString('vi-VN', { weekday: 'long' });
        
        days.push({ 
            label: label, 
            date: currentDay.getDate(), 
            dateStr: dateStr, // Dùng làm key để lấy data từ appointmentsData
            isToday: isToday,
            // Chuỗi ngày tháng đầy đủ để set cho selectedDayDetail
            fullDateString: currentDay.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
        });
    }
    
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {/* Header Ngày */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-center font-medium">
          {days.map((day) => (
            <div 
              key={day.dateStr} 
              className={`py-2 px-1 border-r border-gray-200 last:border-r-0 
                ${day.isToday ? 'bg-blue-50' : ''}
                ${day.fullDateString === selectedDayDetail ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
              `}
            >
              <div className="text-sm text-gray-700">{day.label}</div>
              <div className={`text-lg ${day.isToday ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
                {day.date}
              </div>
            </div>
          ))}
        </div>
        
        {/* Nội dung Lịch */}
        <div className="grid grid-cols-7" style={{ minHeight: '150px' }}> 
          {days.map((day) => (
            <div 
              key={day.dateStr} 
              className={`p-2 border-r border-b border-gray-200 last:border-r-0 last:border-b-0 cursor-pointer transition-all 
                ${day.fullDateString === selectedDayDetail ? 'bg-indigo-50' : (day.isToday ? 'bg-blue-50' : 'hover:bg-gray-50')}
              `}
              onClick={() => handleSelectDay(day.fullDateString, day.dateStr)} // Sử dụng hàm mới
            >
              {day.dateStr && renderScheduleInDay(day.dateStr)}
            </div>
          ))}
        </div>
      </div>
    );
  };


  return (
    <>
    <div className="p-6 bg-gray-100 h-full min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold ">Quản lý Lịch hẹn</h1>
          <p className="text-gray-500">
            Xem và quản lý các cuộc hẹn trong tuần hiện tại.
          </p>
        </div>
      </div>

      {/* CALENDAR NAVIGATION & VIEW TOGGLE */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-3 text-xl font-semibold text-gray-800">
           <Button 
                icon={<LeftOutlined />} 
                type="text" 
                className="text-gray-700 hover:text-blue-600 border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center" 
                onClick={() => updateDate('week', -1)} 
            />
            <span className="text-2xl font-bold ">{currentDisplayMonthYear}</span>
            <Button 
                icon={<RightOutlined />} 
                type="text" 
                className="text-gray-700 hover:text-blue-600 border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center" 
                onClick={() => updateDate('week', 1)} 
            />
        </div>
        <Button 
            type="primary" 
            className="bg-indigo-600 hover:bg-indigo-700 font-semibold"
            onClick={() => updateDate('week', 0)} // Quay về tuần hiện tại
        >
            Tuần Hiện Tại
        </Button>
      </div>

      {/* CALENDAR VIEW CONTENT */}
      {renderWeekView()} 

      {/* DAILY DETAIL SECTION (Sử dụng currentDailyAppointments) */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
          Lịch hẹn chi tiết: <span className="text-indigo-600">{selectedDayDetail}</span>
        </h3>
        
        <Space direction="vertical" size="middle" className="w-full">
          {currentDailyAppointments.length > 0 ? (
                currentDailyAppointments.map((detail, index) => ( 
                    <Card 
                        key={detail.id || index} 
                        className={`shadow-md w-full transition-all border-l-4 
                            ${!detail.completed ? 'border-blue-500' : (detail.isCancelled ? 'border-red-500' : 'border-green-500')}
                        `} 
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center"> 
                            {/* Time & Name */}
                            <div className="flex items-center space-x-4 mb-3 md:mb-0"> 
                                <div className="text-center p-3 rounded-lg bg-blue-100 text-blue-800 font-mono min-w-[70px]">
                                    <div className="font-bold text-xl leading-none">{detail.time}</div>
                                    <div className="text-xs">{detail.period}</div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg text-gray-900">{detail.name}</h4>
                                    <p className="text-indigo-500 text-sm font-medium">{detail.type}</p>
                                </div>
                            </div>

                            {/* Status & Actions */}
                            <Space size="middle" className="flex items-center">
                                {detail.completed ? (
                                    <Tag 
                                        color={detail.isCancelled ? "error" : "success"} 
                                        icon={<ClockCircleOutlined />} 
                                        className="text-sm py-1 px-2"
                                    >
                                        {detail.statusText}
                                    </Tag>
                                ) : (
                                    <Tag color="processing" icon={<ClockCircleOutlined />} className="text-sm py-1 px-2">
                                        Chờ khám
                                    </Tag>
                                )}
                                
                                <Button 
                                    type="primary" 
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                    onClick={() => handleViewAppointmentDetail(detail)}
                                >
                                    Xem chi tiết
                                </Button>
                            </Space>
                        </div>
                    </Card>
                ))
            ) : (
                <Card className="shadow-md w-full text-center py-8 border-dashed border-gray-300">
                    <Text className="text-lg text-gray-500">Không có lịch hẹn nào được lên lịch cho ngày này.</Text>
                </Card>
            )}
        </Space>
        
      </div>
    </div>

    {/* GỌI COMPONENT MODAL RIÊNG BIỆT */}
    <AppointmentDetailModal
        isVisible={isAppointmentDetailModalVisible}
        onClose={handleCloseModal}
        appointmentDetail={selectedAppointment}
        onCancel={handleCancelAppointment} 
        onComplete={handleCompleteAppointment} 
        onRestore={handleRestoreAppointment} 
    />
    </>
  );
};

export default CalendarPage;