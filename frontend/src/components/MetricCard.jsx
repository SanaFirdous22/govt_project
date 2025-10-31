import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { translations } from '../utils/translations';

const MetricCard = ({ title, value, icon: Icon, change, color, language = 'en' }) => {
  const t = translations[language];

  const getChangeDisplay = () => {
    if (!change) return null;

    const { change: changePercent, direction } = change;
    const isPositive = direction === 'up';
    const isNegative = direction === 'down';

    const ChangeIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
    const changeColor = isPositive ? 'text-success-600' : isNegative ? 'text-danger-600' : 'text-gray-600';

    return (
      <div className={`flex items-center space-x-1 text-sm ${changeColor}`}>
        <ChangeIcon className="w-4 h-4" />
        <span>{Math.abs(changePercent)}%</span>
        <span className="text-xs">
          {isPositive ? (t.vsLastMonth || 'vs last month') : isNegative ? (t.vsLastMonth || 'vs last month') : ''}
        </span>
      </div>
    );
  };

  const getColorClasses = () => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50',
      green: 'border-green-200 bg-green-50',
      purple: 'border-purple-200 bg-purple-50',
      orange: 'border-orange-200 bg-orange-50'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className={`metric-card ${getColorClasses()} border-2`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-6 h-6 text-gray-600" />
        {change && getChangeDisplay()}
      </div>

      <div className="metric-value text-gray-900">
        {value}
      </div>

      <div className="metric-label">
        {title}
      </div>

      {/* Simple visual indicator */}
      <div className="mt-2 flex justify-center">
        {change?.direction === 'up' && (
          <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
        )}
        {change?.direction === 'down' && (
          <div className="w-2 h-2 bg-danger-500 rounded-full animate-pulse"></div>
        )}
        {change?.direction === 'same' && (
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
