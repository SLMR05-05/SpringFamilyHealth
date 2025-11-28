import { useState, useEffect } from 'react';
import { Calendar, User } from 'lucide-react';
import { message as antdMessage, Modal } from 'antd';
import appointmentApi from '../../../api/appointmentApi';
import prescriptionApi from '../../../api/prescriptionApi';

export default function VisitHistoryTab() {
  const [completedVisits, setCompletedVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedVisitDetail, setSelectedVisitDetail] = useState(null);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState([]);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(false);

  useEffect(() => {
    const fetchCompletedVisits = async () => {
      try {
        setLoading(true);
        
        // Get current logged-in user's member ID from localStorage or context
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setCompletedVisits([]);
          return;
        }
        
        const user = JSON.parse(userStr);
        const userId = user.userId || user.id;
        
        // Fetch appointments by member ID (we use appointments as visit records)
        let appointments = [];
        try {
          const response = await appointmentApi.getByMemberId(userId);
          appointments = response?.data || response?.result || response || [];
        } catch (error) {
          appointments = [];
        }

        // Treat appointments as visit history; filter completed ones
        const userCompletedVisits = Array.isArray(appointments)
          ? appointments.filter(a => !a.status || a.status === 'COMPLETED')
          : [];
        
        setCompletedVisits(userCompletedVisits);
      } catch (error) {
        console.error('Failed to fetch visit history:', error);
        antdMessage.error('Không thể tải lịch sử khám bệnh');
        setCompletedVisits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedVisits();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="text-gray-500 mt-3">Đang tải...</p>
      </div>
    );
  }

  if (!completedVisits || completedVisits.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Chưa có lịch sử khám bệnh</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {completedVisits.map((visit) => (
        <div key={visit.appointmentId || visit.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Buổi khám ngày {visit.appointmentDate || visit.visitDate || 'Chưa cập nhật'}</h3>
              <div className="space-y-2 text-sm">
                {visit.doctorId && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Bác sĩ ID: {visit.doctorId}</span>
                  </div>
                )}

                {visit.reason && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                    <p className="font-semibold text-gray-700 mb-1">Lý do/triệu chứng:</p>
                    <p className="text-gray-600">{visit.reason}</p>
                  </div>
                )}

                {visit.notes && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-700 mb-1">Ghi chú / Kết luận:</p>
                    <p className="text-gray-600">{visit.notes}</p>
                  </div>
                )}

                {visit.status && (
                  <div className="mt-2 inline-block px-3 py-1 text-sm font-medium rounded bg-green-50 text-green-700">
                    Trạng thái: {visit.status}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-gray-100 flex gap-2">
            <button
              className="flex-1 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
              onClick={async () => {
                const apptId = visit.appointmentId || visit.id;
                if (!apptId) {
                  antdMessage.error('Không có ID buổi khám để hiển thị chi tiết');
                  return;
                }

                try {
                  const resp = await appointmentApi.getById(apptId);
                  const data = resp?.data || resp?.result || resp || null;
                  setSelectedVisitDetail(data);
                      setDetailVisible(true);

                      // Fetch prescriptions related to this appointment (via member)
                      (async () => {
                        setPrescriptionsLoading(true);
                        try {
                          const memberId = data?.memberId || data?.patientId || null;
                          let effectiveMemberId = memberId;
                          if (!effectiveMemberId) {
                            const stored = localStorage.getItem('user');
                            const parsed = stored ? JSON.parse(stored) : null;
                            effectiveMemberId = parsed?.userId || parsed?.id || null;
                          }

                          if (!effectiveMemberId || effectiveMemberId === 'null') {
                            setSelectedPrescriptions([]);
                          } else {
                            const numId = Number(effectiveMemberId);
                            if (Number.isNaN(numId)) {
                              setSelectedPrescriptions([]);
                            } else {
                              const presResp = await prescriptionApi.getByMemberId(numId);
                              const allPres = presResp?.data || presResp?.result || presResp || [];
                              const related = Array.isArray(allPres)
                                ? allPres.filter(p => (p.appointmentId || p.appointment || p.appointment_id) == apptId)
                                : [];
                              setSelectedPrescriptions(related);
                            }
                          }
                        } catch (err) {
                          console.error('Failed to fetch prescriptions for visit detail:', err);
                          setSelectedPrescriptions([]);
                        } finally {
                          setPrescriptionsLoading(false);
                        }
                      })();
                } catch (err) {
                  console.error('Failed to load appointment detail:', err);
                  antdMessage.error('Không thể tải chi tiết buổi khám');
                }
              }}
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      ))}
      
      <Modal
        title="Chi tiết buổi khám"
        open={detailVisible}
        onCancel={() => { setDetailVisible(false); setSelectedVisitDetail(null); }}
        footer={null}
      >
        {selectedVisitDetail ? (
          <div className="space-y-3 text-sm">
            <div>
              <strong>Ngày:</strong> {selectedVisitDetail.appointmentDate || selectedVisitDetail.visitDate || 'Chưa cập nhật'}
            </div>
            <div>
              <strong>Bác sĩ ID:</strong> {selectedVisitDetail.doctorId || 'N/A'}
            </div>
            {selectedVisitDetail.reason && (
              <div>
                <strong>Lý do/triệu chứng:</strong>
                <div className="text-gray-700">{selectedVisitDetail.reason}</div>
              </div>
            )}
            {selectedVisitDetail.notes && (
              <div>
                <strong>Ghi chú / Kết luận:</strong>
                <div className="text-gray-700">{selectedVisitDetail.notes}</div>
              </div>
            )}
            {selectedVisitDetail.status && (
              <div>
                <strong>Trạng thái:</strong> {selectedVisitDetail.status}
              </div>
            )}
            <div>
              <strong>Đơn thuốc liên quan:</strong>
              {prescriptionsLoading ? (
                <div className="text-sm text-gray-500">Đang tải đơn thuốc...</div>
              ) : selectedPrescriptions && selectedPrescriptions.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2 mt-2">
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
                <div className="text-sm text-gray-500 mt-2">Không tìm thấy đơn thuốc liên quan.</div>
              )}
            </div>
          </div>
        ) : (
          <p>Đang tải...</p>
        )}
      </Modal>
    </div>
  );
}
