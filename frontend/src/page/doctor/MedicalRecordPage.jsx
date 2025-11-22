import { useState } from "react";
import { FileText, Search, Download, Eye, Calendar, User, Activity } from "lucide-react";

export default function MedicalRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const records = [
    {
      id: "BA001",
      patientName: "Nguyễn Văn An",
      diagnosis: "Tiểu đường type 2",
      date: "15/11/2025",
      doctor: "BS. Nguyễn Minh Tâm",
      category: "internal",
      status: "active",
      lastUpdate: "20/11/2025",
      notes: "Theo dõi đường huyết định kỳ, điều chỉnh thuốc"
    },
    {
      id: "BA002",
      patientName: "Trần Thị Bình",
      diagnosis: "Huyết áp cao",
      date: "18/11/2025",
      doctor: "BS. Nguyễn Minh Tâm",
      category: "cardiology",
      status: "active",
      lastUpdate: "20/11/2025",
      notes: "Kê đơn thuốc hạ huyết áp, tái khám sau 2 tuần"
    },
    {
      id: "BA003",
      patientName: "Lê Minh Hoàng",
      diagnosis: "Viêm dạ dày HP dương tính",
      date: "10/10/2025",
      doctor: "BS. Nguyễn Minh Tâm",
      category: "gastro",
      status: "completed",
      lastUpdate: "05/11/2025",
      notes: "Điều trị diệt HP hoàn thành, tái khám sau 1 tháng"
    },
    {
      id: "BA004",
      patientName: "Phạm Thị Hoa",
      diagnosis: "Cholesterol cao",
      date: "21/11/2025",
      doctor: "BS. Nguyễn Minh Tâm",
      category: "internal",
      status: "active",
      lastUpdate: "21/11/2025",
      notes: "Tư vấn chế độ ăn, kê đơn statin"
    },
    {
      id: "BA005",
      patientName: "Hoàng Văn Dũng",
      diagnosis: "Đau lưng mãn tính",
      date: "18/11/2025",
      doctor: "BS. Nguyễn Minh Tâm",
      category: "orthopedic",
      status: "active",
      lastUpdate: "19/11/2025",
      notes: "Chỉ định vật lý trị liệu, thuốc giảm đau"
    }
  ];

  const categories = [
    { value: "all", label: "Tất cả", count: records.length },
    { value: "internal", label: "Nội khoa", count: records.filter(r => r.category === "internal").length },
    { value: "cardiology", label: "Tim mạch", count: records.filter(r => r.category === "cardiology").length },
    { value: "gastro", label: "Tiêu hóa", count: records.filter(r => r.category === "gastro").length },
    { value: "orthopedic", label: "Cơ xương khớp", count: records.filter(r => r.category === "orthopedic").length }
  ];

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || record.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hồ Sơ Bệnh Án</h1>
          <p className="text-gray-600 mt-1">Quản lý và theo dõi hồ sơ bệnh nhân</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow">
          <FileText className="w-5 h-5" />
          Tạo hồ sơ mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tổng hồ sơ</p>
              <p className="text-3xl font-bold mt-1">{records.length}</p>
            </div>
            <FileText className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-5 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Đang điều trị</p>
              <p className="text-3xl font-bold mt-1">{records.filter(r => r.status === "active").length}</p>
            </div>
            <Activity className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-5 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Hoàn thành</p>
              <p className="text-3xl font-bold mt-1">{records.filter(r => r.status === "completed").length}</p>
            </div>
            <Calendar className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-5 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Cập nhật hôm nay</p>
              <p className="text-3xl font-bold mt-1">3</p>
            </div>
            <User className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã hồ sơ, chẩn đoán..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === cat.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã HS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chẩn đoán</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cập nhật</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm font-semibold text-blue-600">{record.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.patientName}</div>
                      <div className="text-xs text-gray-500">{record.doctor}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{record.diagnosis}</div>
                    <div className="text-xs text-gray-500 mt-1">{record.notes}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {record.lastUpdate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {record.status === 'active' ? 'Đang điều trị' : 'Hoàn thành'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition" title="Xem chi tiết">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded transition" title="Tải xuống">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRecords.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Không tìm thấy hồ sơ nào</p>
        </div>
      )}
    </div>
  );
}