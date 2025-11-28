import { Bell, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NotificationsView({ notifications }) {
  const { t } = useTranslation();

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'medium': return <Info className="w-5 h-5 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  if (!notifications || notifications.length === 0) {
    return (
      <div className='bg-white py-8 px-5 rounded-xl border border-gray-200'>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('Dashboard.Notifications.Title')}</h2>
          <p className="text-gray-500 mt-1">{t('Dashboard.Notifications.Subtitle')}</p>
        </div>
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Không có thông báo mới</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white py-4 px-5 rounded-xl border border-gray-200'>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('Dashboard.Notifications.Title')}</h2>
        <p className="text-gray-500 mt-1">{t('Dashboard.Notifications.Subtitle')}</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-xl p-5 border-2 hover:shadow-md transition-all ${getPriorityColor(notification.priority)}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {getPriorityIcon(notification.priority)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">{notification.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
