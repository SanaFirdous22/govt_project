import { Wifi, WifiOff } from 'lucide-react';
import { translations } from '../utils/translations';

const OfflineNotice = ({ language = 'en' }) => {
  const t = translations[language];
  const isOnline = navigator.onLine;

  return (
    <div className={`rounded-md p-4 border ${
      isOnline
        ? 'bg-success-50 border-success-200'
        : 'bg-warning-50 border-warning-200'
    }`}>
      <div className="flex items-center space-x-3">
        {isOnline ? (
          <Wifi className="w-5 h-5 text-success-600" />
        ) : (
          <WifiOff className="w-5 h-5 text-warning-600" />
        )}

        <div className="flex-1">
          <p className={`text-sm font-medium ${
            isOnline ? 'text-success-800' : 'text-warning-800'
          }`}>
            {isOnline ? (t.online || 'Online') : (t.offline || 'Offline')}
          </p>
          <p className={`text-xs ${
            isOnline ? 'text-success-700' : 'text-warning-700'
          }`}>
            {isOnline
              ? (t.showingLiveData || 'Showing live data')
              : (t.showingCachedData || 'Showing cached data from last update')
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfflineNotice;
