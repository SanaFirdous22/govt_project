import { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, Loader } from 'lucide-react';
import { api } from '../utils/api';
import { translations } from '../utils/translations';

const DistrictSelector = ({ selectedDistrict, onDistrictSelect, language = 'en' }) => {
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const t = translations[language];

  // Load districts on component mount
  useEffect(() => {
    loadDistricts();
  }, []);

  // Filter districts based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDistricts(districts);
    } else {
      const filtered = districts.filter(district =>
        district.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDistricts(filtered);
    }
  }, [districts, searchTerm]);

  const loadDistricts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getDistricts();
      setDistricts(response.data || []);
    } catch (error) {
      console.error('Failed to load districts:', error);
      setError(t.errors.loadDistricts || 'Failed to load districts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeolocation = async () => {
    if (!navigator.geolocation) {
      setError(t.errors.geolocationNotSupported || 'Geolocation is not supported by this browser');
      return;
    }

    setIsGeolocating(true);
    setError(null);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get district
      const geoResponse = await api.reverseGeocode(latitude, longitude);

      if (geoResponse.success && geoResponse.data.district) {
        const foundDistrict = districts.find(d =>
          d.toLowerCase() === geoResponse.data.district.toLowerCase()
        );

        if (foundDistrict) {
          onDistrictSelect(foundDistrict);
          // Provide audio feedback
          speakSelection(foundDistrict);
        } else {
          setError(t.errors.districtNotFound || 'District not found in our database');
        }
      } else {
        setError(t.errors.geolocationFailed || 'Could not determine your district');
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      if (error.code === 1) {
        setError(t.errors.geolocationDenied || 'Location access denied. Please allow location access or select district manually.');
      } else {
        setError(t.errors.geolocationFailed || 'Could not determine your location');
      }
    } finally {
      setIsGeolocating(false);
    }
  };

  const speakSelection = (district) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${t.audio.districtSelected || 'District selected'}: ${district}`
      );
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDistrictClick = (district) => {
    onDistrictSelect(district);
    speakSelection(district);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
        <p className="text-gray-600">{t.loading || 'Loading districts...'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t.selectDistrict || 'Select Your District'}
        </h2>
        <p className="text-gray-600 font-hindi">
          {t.selectDistrictDesc || 'Choose your district to view MGNREGA performance data'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t.searchDistrict || 'Search districts...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 touch-target"
              aria-label="Search districts"
            />
          </div>
        </div>

        {/* Geolocation Button */}
        <button
          onClick={handleGeolocation}
          disabled={isGeolocating}
          className="btn btn-secondary touch-target flex items-center space-x-2"
          aria-label={t.useLocation || 'Use my location'}
        >
          {isGeolocating ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          <span>{isGeolocating ? (t.locating || 'Locating...') : (t.useLocation || 'Use Location')}</span>
        </button>

        {/* View Toggle */}
        <div className="flex border border-gray-300 rounded-md">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 text-sm font-medium ${
              viewMode === 'grid'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            } rounded-l-md`}
            aria-label="Grid view"
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 text-sm font-medium ${
              viewMode === 'list'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            } rounded-r-md`}
            aria-label="List view"
          >
            List
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-danger-50 border border-danger-200 rounded-md p-4">
          <p className="text-danger-800 text-sm">{error}</p>
        </div>
      )}

      {/* District Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredDistricts.map((district) => (
            <button
              key={district}
              onClick={() => handleDistrictClick(district)}
              className={`touch-target p-4 border-2 rounded-lg text-center transition-all ${
                selectedDistrict === district
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
              aria-label={`${t.select || 'Select'} ${district}`}
            >
              <MapPin className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <span className="text-sm font-medium block">{district}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredDistricts.map((district) => (
            <button
              key={district}
              onClick={() => handleDistrictClick(district)}
              className={`w-full touch-target p-4 border-2 rounded-lg text-left transition-all ${
                selectedDistrict === district
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
              aria-label={`${t.select || 'Select'} ${district}`}
            >
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <span className="font-medium">{district}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {filteredDistricts.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {t.noDistrictsFound || 'No districts found matching your search'}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="font-medium text-blue-900 mb-2">
          {t.howToSelect || 'How to select your district:'}
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• {t.instruction1 || 'Click "Use Location" to auto-detect your district'}</li>
          <li>• {t.instruction2 || 'Or search and click on your district name'}</li>
          <li>• {t.instruction3 || 'Or scroll through the list to find your district'}</li>
        </ul>
      </div>
    </div>
  );
};

export default DistrictSelector;
