import { useState, useEffect } from 'react';
import { Calendar, User } from 'lucide-react';
import { message as antdMessage, Modal } from 'antd';
import visitHistoryApi from '../../../api/visitHistoryApi';
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
        console.log('localStorage.user:', userStr);
        
        if (!userStr) {
          console.log('No user found in localStorage');
          setCompletedVisits([]);
          return;
        }
        
        const user = JSON.parse(userStr);
        const userId = user.userId || user.id;
        console.log('Current userId:', userId);
        
        // Fetch visit histories by member ID
        let visitHistories = [];
        try {
          const response = await visitHistoryApi.getByMemberId(userId);
          console.log('Raw API response from visit-histories:', response);
          
          // Handle paginated response structure
          const rawData = response?.data || response?.result || response;
          if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
            // Check for paginated structure (content, items, etc.)
            visitHistories = rawData.content || rawData.items || rawData.data || [];
          } else {
            visitHistories = Array.isArray(rawData) ? rawData : [];
          }
          
          console.log('Parsed visit histories:', visitHistories);
          console.log('First visit object structure:', visitHistories[0]);
        } catch (error) {
          console.error('Error fetching visit histories:', error);
          visitHistories = [];
        }

        // Filter: memberId matches userId (visit-history không có trường status)
        const userCompletedVisits = Array.isArray(visitHistories)
          ? visitHistories.filter(visit => {
              const memberIdMatch = String(visit.memberId) === String(userId);
              console.log(`Visit ${visit.visitId}: memberId=${visit.memberId} (match=${memberIdMatch})`);
              return memberIdMatch;
            })
          : [];
        
        console.log('Filtered completed visits for current user:', userCompletedVisits);
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
        <p className="text-gray-500">Chưa khám lần nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {completedVisits.map((visit) => (
        <div key={visit.visitId || visit.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Buổi khám ngày {visit.visitDate || 'Chưa cập nhật'}</h3>
              <div className="space-y-2 text-sm">
                {visit.doctorId && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Bác sĩ ID: {visit.doctorId}</span>
                  </div>
                )}

                {visit.reason && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="font-semibold text-gray-700 mb-1">Lý do khám:</p>
                    <p className="text-gray-600">{visit.reason}</p>
                  </div>
                )}

                {visit.diagnosis && (
                  <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                    <p className="font-semibold text-gray-700 mb-1">Chẩn đoán:</p>
                    <p className="text-gray-600">{visit.diagnosis}</p>
                  </div>
                )}

                {visit.treatment && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg">
                    <p className="font-semibold text-gray-700 mb-1">Điều trị:</p>
                    <p className="text-gray-600">{visit.treatment}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-gray-100 flex gap-2">
            <button
              className="flex-1 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
              onClick={async () => {
                const visitId = visit.visitId || visit.id;
                if (!visitId) {
                  antdMessage.error('Không có ID buổi khám để hiển thị chi tiết');
                  return;
                }

                try {
                  const resp = await visitHistoryApi.getById(visitId);
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
                                ? allPres.filter(p => (p.visitId || p.visitHistoryId) == visitId)
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
              <strong>Ngày khám:</strong> {selectedVisitDetail.visitDate || 'Chưa cập nhật'}
            </div>
            <div>
              <strong>Bác sĩ ID:</strong> {selectedVisitDetail.doctorId || 'N/A'}
            </div>
            {selectedVisitDetail.reason && (
              <div>
                <strong>Lý do khám:</strong>
                <div className="text-gray-700">{selectedVisitDetail.reason}</div>
              </div>
            )}
            {selectedVisitDetail.diagnosis && (
              <div>
                <strong>Chẩn đoán:</strong>
                <div className="text-gray-700">{selectedVisitDetail.diagnosis}</div>
              </div>
            )}
            {selectedVisitDetail.treatment && (
              <div>
                <strong>Điều trị:</strong>
                <div className="text-gray-700">{selectedVisitDetail.treatment}</div>
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
