import { useState } from 'react';
import DistrictSelector from '../components/DistrictSelector';
import Dashboard from '../components/Dashboard';
import { translations } from '../utils/translations';

const Home = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [language, setLanguage] = useState('en'); // 'en' or 'hi'

  const t = translations[language];

  return (
    <div className="space-y-8">
      {/* Language Toggle */}
      <div className="flex justify-end">
        <div className="flex border border-gray-300 rounded-md">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-2 text-sm font-medium ${
              language === 'en'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            } rounded-l-md`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-3 py-2 text-sm font-medium ${
              language === 'hi'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            } rounded-r-md`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Main Content */}
      {!selectedDistrict ? (
        <DistrictSelector
          selectedDistrict={selectedDistrict}
          onDistrictSelect={setSelectedDistrict}
          language={language}
        />
      ) : (
        <div className="space-y-6">
          {/* Back Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedDistrict(null)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>{t.backToSelection || 'Back to District Selection'}</span>
            </button>

            <div className="text-sm text-gray-600">
              {t.selectedDistrict || 'Selected'}: <strong>{selectedDistrict}</strong>
            </div>
          </div>

          {/* Dashboard */}
          <Dashboard district={selectedDistrict} language={language} />
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
        <p>
          {t.dataSource || 'Data sourced from data.gov.in MGNREGA API'}
        </p>
        <p className="mt-1">
          {t.lastUpdated || 'Last updated'}: <span id="page-last-update">Loading...</span>
        </p>
      </div>
    </div>
  );
};

export default Home;
