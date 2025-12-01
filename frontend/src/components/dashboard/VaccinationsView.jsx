import { Syringe, Calendar, FileText } from 'lucide-react';
import dayjs from 'dayjs';

export default function VaccinationsView({ vaccinations }) {
  if (!vaccinations || vaccinations.length === 0) {
    return (
      <div className="text-center py-12">
        <Syringe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Chưa có lịch sử tiêm chủng</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vaccinations.map((vaccination) => {
        const idKey = vaccination.vaccinationId || vaccination.vaccine_id || vaccination.id;
        const vaccineName = vaccination.vaccineName || vaccination.vaccine_name || vaccination.name || 'Vaccine';
        const vaccinationDate = vaccination.dateGiven || vaccination.vaccinationDate || vaccination.date_given || vaccination.date || null;
        const nextDose = vaccination.nextDose || vaccination.next_dose || null;
        const location = vaccination.location || null;
        const notes = vaccination.notes || vaccination.note || null;
        const doctorRef = vaccination.doctorName || vaccination.doctorId || vaccination.doctor_id || null;

        return (
          <div key={idKey} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Syringe className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{vaccineName}</h3>
                  {doctorRef && <div className="text-sm text-gray-600">Bác sĩ: {doctorRef}</div>}
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Ngày tiêm: {vaccinationDate ? dayjs(vaccinationDate).format('DD/MM/YYYY') : 'Chưa cập nhật'}</span>
                  </div>

                  {nextDose && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="font-semibold text-blue-700 mb-1">Mũi tiếp theo:</p>
                      <p className="text-blue-600">{dayjs(nextDose).format('DD/MM/YYYY')}</p>
                    </div>
                  )}

                  {notes && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-700 mb-1">Ghi chú:</p>
                      <p className="text-gray-600">{notes}</p>
                    </div>
                  )}

                  {location && (
                    <div className="mt-2 text-gray-600">
                      <p className="font-semibold mb-1">Nơi tiêm:</p>
                      <p>{location}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
