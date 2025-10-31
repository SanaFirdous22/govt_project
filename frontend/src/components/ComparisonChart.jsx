import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { translations } from '../utils/translations';

const ComparisonChart = ({ data, type, language = 'en' }) => {
  const t = translations[language];

  if (!data) return null;

  let chartData = [];
  let title = '';

  if (type === 'state') {
    // Compare district vs state average
    const district = data.district;
    const stateAvg = data.stateAverage;

    if (district && stateAvg) {
      chartData = [
        {
          name: t.district || 'Your District',
          persons: district.persons_provided_work,
          wages: district.total_wages_paid / 100000, // Convert to lakhs
          personDays: district.total_person_days,
          households: district.total_households_worked
        },
        {
          name: t.stateAverage || 'State Average',
          persons: stateAvg.avgPersonsWorked,
          wages: stateAvg.avgWagesPaid / 100000,
          personDays: stateAvg.avgPersonDays,
          households: stateAvg.avgHouseholds
        }
      ];
      title = t.vsStateAverage || 'vs State Average';
    }
  }

  const formatTooltip = (value, name) => {
    if (name === 'wages') {
      return [`₹${value.toFixed(1)}L`, t.metrics.wagesPaid || 'Wages Paid'];
    }
    return [value.toLocaleString(), name];
  };

  const formatYAxisLabel = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700">{title}</h4>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              fontSize={12}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              fontSize={12}
              tick={{ fontSize: 12 }}
              tickFormatter={formatYAxisLabel}
            />
            <Tooltip
              formatter={formatTooltip}
              labelStyle={{ color: '#374151' }}
              contentStyle={{
                backgroundColor: '#f9fafb',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            />
            <Bar
              dataKey="persons"
              fill="#3b82f6"
              name={t.metrics.personsWorked || 'Persons Worked'}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Simple text summary for accessibility */}
      <div className="text-xs text-gray-600 text-center">
        {chartData.length === 2 && (
          <p>
            {chartData[0].name}: {chartData[0].persons.toLocaleString()} {t.metrics.personsWorked?.toLowerCase() || 'persons worked'}
            {' | '}
            {chartData[1].name}: {chartData[1].persons.toLocaleString()} {t.metrics.personsWorked?.toLowerCase() || 'persons worked'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ComparisonChart;
