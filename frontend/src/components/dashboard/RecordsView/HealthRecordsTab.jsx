import { Heart, Calendar, FileText } from 'lucide-react';

export default function HealthRecordsTab({ records }) {
  if (!records || records.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Chưa có hồ sơ y tế</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
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
      ))}
    </div>
  );
}
