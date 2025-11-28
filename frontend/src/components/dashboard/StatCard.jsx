export default function StatCard({ title, value, subtitle, icon: Icon, alert, onClick }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-xl p-6 shadow-sm border cursor-pointer hover:shadow-md transition-shadow ${alert ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <Icon className={`w-5 h-5 ${alert ? 'text-yellow-600' : 'text-gray-400'}`} />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}
