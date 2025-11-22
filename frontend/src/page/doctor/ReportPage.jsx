import { useState } from "react";
import { BarChart3, TrendingUp, Download, Calendar, Users, FileText, Activity } from "lucide-react";

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedYear, setSelectedYear] = useState("2025");

  const statisticsData = {
    totalPatients: 420,
    newPatients: 45,
    totalAppointments: 156,
    completedAppointments: 142,
    revenue: "285.000.000",
    averageRating: 4.8
  };

  const monthlyData = [
    { month: "T1", patients: 45, appointments: 120, revenue: 42 },
    { month: "T2", patients: 60, appointments: 145, revenue: 48 },
    { month: "T3", patients: 50, appointments: 132, revenue: 45 },
    { month: "T4", patients: 70, appointments: 168, revenue: 52 },
    { month: "T5", patients: 80, appointments: 185, revenue: 58 },
    { month: "T6", patients: 90, appointments: 196, revenue: 62 },
  ];

  const topDiseases = [
    { name: "Cảm cúm, Viêm họng", count: 85, percentage: 28 },
    { name: "Tiểu đường", count: 62, percentage: 21 },
    { name: "Huyết áp cao", count: 58, percentage: 19 },
    { name: "Viêm dạ dày", count: 45, percentage: 15 },
    { name: "Khác", count: 52, percentage: 17 }
  ];

  const recentReports = [
    {
      id: 1,
      title: "Báo cáo tháng 11/2025",
      type: "Tổng quan",
      date: "01/11/2025",
      status: "completed"
    },
    {
      id: 2,
      title: "Thống kê bệnh nhân mới Q4",
      type: "Bệnh nhân",
      date: "15/10/2025",
      status: "completed"
    },
    {
      id: 3,
      title: "Phân tích doanh thu tháng 10",
      type: "Tài chính",
      date: "05/10/2025",
      status: "completed"
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Báo Cáo & Thống Kê</h1>
          <p className="text-gray-600 mt-1">Phân tích hiệu suất và xu hướng</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm này</option>
          </select>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow">
            <Download className="w-5 h-5" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-10 h-10 opacity-80" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-blue-100 text-sm">Tổng bệnh nhân</p>
          <p className="text-3xl font-bold mt-2">{statisticsData.totalPatients}</p>
          <p className="text-blue-100 text-xs mt-2">+{statisticsData.newPatients} bệnh nhân mới</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-10 h-10 opacity-80" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-green-100 text-sm">Lịch khám hoàn thành</p>
          <p className="text-3xl font-bold mt-2">{statisticsData.completedAppointments}</p>
          <p className="text-green-100 text-xs mt-2">/{statisticsData.totalAppointments} tổng lịch hẹn</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-10 h-10 opacity-80" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-purple-100 text-sm">Doanh thu tháng này</p>
          <p className="text-3xl font-bold mt-2">{statisticsData.revenue} đ</p>
          <p className="text-purple-100 text-xs mt-2">+12% so với tháng trước</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patients Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Biểu đồ bệnh nhân theo tháng</h3>
          <div className="space-y-3">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-8">{data.month}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-3"
                    style={{ width: `${(data.patients / 100) * 100}%` }}
                  >
                    <span className="text-white text-xs font-semibold">{data.patients}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Doanh thu (triệu VNĐ)</h3>
          <div className="space-y-3">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-8">{data.month}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full flex items-center justify-end pr-3"
                    style={{ width: `${(data.revenue / 70) * 100}%` }}
                  >
                    <span className="text-white text-xs font-semibold">{data.revenue}M</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disease Statistics & Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Diseases */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bệnh phổ biến nhất</h3>
          <div className="space-y-4">
            {topDiseases.map((disease, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{disease.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{disease.count} ca ({disease.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${disease.percentage * 3}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Báo cáo gần đây</h3>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{report.title}</p>
                    <p className="text-xs text-gray-500">{report.type} • {report.date}</p>
                  </div>
                </div>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
            Xem tất cả báo cáo →
          </button>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tóm tắt hiệu suất</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">91%</p>
            <p className="text-sm text-gray-600 mt-1">Tỷ lệ hài lòng</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">95%</p>
            <p className="text-sm text-gray-600 mt-1">Hoàn thành đúng hẹn</p>
          </div>

          <div className="text-center">
            <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">12.5</p>
            <p className="text-sm text-gray-600 mt-1">BN trung bình/ngày</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{statisticsData.averageRating}</p>
            <p className="text-sm text-gray-600 mt-1">Đánh giá trung bình</p>
          </div>
        </div>
      </div>
    </div>
  );
}