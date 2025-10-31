import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Home, AlertTriangle } from 'lucide-react';
import { api } from '../utils/api';
import { translations } from '../utils/translations';
import MetricCard from './MetricCard';
import ComparisonChart from './ComparisonChart';
import AudioExplainButton from './AudioExplainButton';
import OfflineNotice from './OfflineNotice';

const Dashboard = ({ district, language = 'en' }) => {
  const [data, setData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  const t = translations[language];

  useEffect(() => {
    if (district) {
      loadDistrictData();
    }
  }, [district]);

  const loadDistrictData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load district data
      const districtResponse = await api.getDistrictData(district);
      setData(districtResponse.data);

      // Load comparison data
      const comparisonResponse = await api.getDistrictComparison(district);
      setComparisonData(comparisonResponse.data);

      setIsOffline(false);
    } catch (error) {
      console.error('Failed to load district data:', error);

      if (!navigator.onLine || error.message?.includes('network')) {
        setIsOffline(true);
        setError(t.errors.offline || 'You are currently offline. Showing cached data if available.');
      } else {
        setError(t.errors.loadData || 'Failed to load district data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat(language === 'hi' ? 'hi-IN' : 'en-IN').format(num);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{t.loading || 'Loading district data...'}</p>
      </div>
    );
  }

  if (error && !isOffline) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t.errors.title || 'Error Loading Data'}
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadDistrictData}
          className="btn btn-primary"
        >
          {t.retry || 'Try Again'}
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{t.noData || 'No data available for this district'}</p>
      </div>
    );
  }

  const metrics = [
    {
      title: t.metrics.personsWorked || 'Persons Provided Work',
      value: formatNumber(data.persons_provided_work),
      icon: Users,
      change: data.comparison?.persons_provided_work,
      color: 'blue'
    },
    {
      title: t.metrics.wagesPaid || 'Total Wages Paid',
      value: formatCurrency(data.total_wages_paid),
      icon: DollarSign,
      change: data.comparison?.total_wages_paid,
      color: 'green'
    },
    {
      title: t.metrics.personDays || 'Total Person-Days',
      value: formatNumber(data.total_person_days),
      icon: Calendar,
      change: data.comparison?.total_person_days,
      color: 'purple'
    },
    {
      title: t.metrics.householdsWorked || 'Households Worked',
      value: formatNumber(data.total_households_worked),
      icon: Home,
      change: data.comparison?.total_households_worked,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {district}
        </h1>
        <p className="text-gray-600 font-hindi">
          {t.districtPerformance || 'District Performance Dashboard'}
        </p>

        <div className="flex justify-center mt-4">
          <AudioExplainButton
            text={`${t.audio.dashboardIntro || 'This dashboard shows MGNREGA performance for'} ${district}. ${t.audio.metricsDesc || 'Here are the key metrics'}.`}
            language={language}
          />
        </div>
      </div>

      {/* Offline Notice */}
      {isOffline && <OfflineNotice />}

      {/* Error Notice */}
      {error && isOffline && (
        <div className="bg-warning-50 border border-warning-200 rounded-md p-4">
          <p className="text-warning-800 text-sm">{error}</p>
        </div>
      )}

      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t.keyMetrics || 'Key Metrics'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              change={metric.change}
              color={metric.color}
              language={language}
            />
          ))}
        </div>
      </div>

      {/* Comparison Section */}
      {comparisonData && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t.comparison || 'Comparison & Trends'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* State Average Comparison */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t.vsStateAverage || 'vs State Average'}
              </h3>
              <ComparisonChart
                data={comparisonData}
                type="state"
                language={language}
              />
            </div>

            {/* District Rankings */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t.districtRankings || 'District Rankings'}
              </h3>
              <div className="space-y-3">
                {comparisonData.topDistricts?.slice(0, 3).map((district, index) => (
                  <div key={district.district_name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-success-100 text-success-800' :
                        index === 1 ? 'bg-warning-100 text-warning-800' :
                        'bg-danger-100 text-danger-800'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-medium">{district.district_name}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatNumber(district.persons_provided_work)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* What This Means Section */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          {t.whatThisMeans || 'What This Means'}
        </h3>
        <div className="space-y-3 text-sm text-blue-800">
          <p>
            {t.meaning1 || 'These numbers show how well MGNREGA is working in your district. Higher numbers generally mean more people are getting work and wages.'}
          </p>
          <p>
            {t.meaning2 || 'Compare these numbers with neighboring districts to see how your area is performing.'}
          </p>
        </div>

        <div className="mt-4">
          <AudioExplainButton
            text={t.audio.whatMeans || 'These metrics show MGNREGA performance. Higher numbers mean more work opportunities. Compare with other districts to understand local performance.'}
            language={language}
          />
        </div>
      </div>

      {/* What to Ask Section */}
      <div className="card bg-green-50 border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-3">
          {t.whatToAsk || 'What to Ask Your Local Official'}
        </h3>
        <ul className="space-y-2 text-sm text-green-800">
          <li>• {t.question1 || 'Why are the numbers higher/lower than neighboring districts?'}</li>
          <li>• {t.question2 || 'What steps are being taken to improve MGNREGA implementation?'}</li>
          <li>• {t.question3 || 'How can more people in my village get MGNREGA work?'}</li>
        </ul>

        <div className="mt-4">
          <AudioExplainButton
            text={t.audio.questions || 'Ask your local official: Why are numbers different from neighbors? What steps to improve? How to get more work opportunities?'}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
