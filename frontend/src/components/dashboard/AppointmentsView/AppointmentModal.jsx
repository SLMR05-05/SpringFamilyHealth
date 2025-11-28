import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AppointmentModal({ appointment, type, onClose, onConfirm, onSave, onUpdate }) {
  const [form, setForm] = useState({ title: '', patient: '', date: '', doctor: '', status: 'Pending' });

  useEffect(() => {
    if (appointment) {
      setForm({
        title: appointment.title || '',
        patient: appointment.patient || '',
        date: appointment.date || '',
        doctor: appointment.doctor || '',
        status: appointment.status || 'Pending',
        id: appointment.id
      });
    } else {
      setForm({ title: '', patient: '', date: '', doctor: '', status: 'Pending' });
    }
  }, [appointment, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'create' && onSave) {
      onSave(form);
    } else if (type === 'edit' && onUpdate) {
      onUpdate(form);
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'create':
      case 'edit':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
              <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bệnh nhân</label>
              <input name="patient" value={form.patient} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ngày giờ</label>
              <input name="date" value={form.date} onChange={handleChange} placeholder="YYYY-MM-DD HH:mm" className="w-full px-3 py-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bác sĩ</label>
              <input name="doctor" value={form.doctor} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded">{type === 'create' ? 'Tạo' : 'Lưu'}</button>
            </div>
          </form>
        );

      case 'view':
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">Chi tiết cuộc hẹn</h3>
            <div className="space-y-3">
              <div><span className="font-semibold">Tiêu đề:</span> {appointment?.title}</div>
              <div><span className="font-semibold">Bệnh nhân:</span> {appointment?.patient}</div>
              <div><span className="font-semibold">Ngày giờ:</span> {appointment?.date}</div>
              <div><span className="font-semibold">Bác sĩ:</span> {appointment?.doctor}</div>
              <div><span className="font-semibold">Trạng thái:</span> {appointment?.status}</div>
            </div>
          </div>
        );

      case 'cancel':
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">Xác nhận hủy cuộc hẹn</h3>
            <p className="text-gray-600 mb-4">Bạn có chắc chắn muốn hủy cuộc hẹn "{appointment?.title}"?</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Không
              </button>
              <button 
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        );

      case 'reschedule':
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">Đổi lịch khám</h3>
            <p className="text-gray-600">Form đổi lịch sẽ được hiển thị ở đây...</p>
          </div>
        );

      case 'result':
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">Kết quả khám bệnh</h3>
            <p className="text-gray-600">Kết quả chi tiết sẽ được hiển thị ở đây...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
        <h2 className="text-xl font-bold">Cuộc hẹn</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6">
        {renderContent()}
      </div>
    </>
  );
}
