import { ExternalLink, Github, Heart, Users, BarChart3, Mic } from 'lucide-react';
import AudioExplainButton from '../components/AudioExplainButton';
import { translations } from '../utils/translations';

const About = () => {
  const language = 'en'; // Default to English for about page
  const t = translations[language];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About Our Voice, Our Rights
        </h1>
        <p className="text-xl text-gray-600 font-hindi mb-6">
          हमारी आवाज़, हमारे अधिकार
        </p>

        <AudioExplainButton
          text="Our Voice, Our Rights is an accessible web application that visualizes MGNREGA performance data for districts in Uttar Pradesh. It helps citizens understand how well the rural employment scheme is working in their area."
          language={language}
        />
      </div>

      {/* Mission */}
      <div className="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <h2 className="text-2xl font-semibold text-primary-900 mb-4">Our Mission</h2>
        <p className="text-primary-800 leading-relaxed">
          To empower rural citizens in Uttar Pradesh with transparent, accessible information about
          MGNREGA implementation in their districts. We believe that when people have clear data
          about government programs, they can better advocate for their rights and hold officials
          accountable.
        </p>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card text-center">
            <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Low-Literacy Friendly</h3>
            <p className="text-gray-600 text-sm">
              Large buttons, simple language, and audio explanations make the app accessible
              to users with varying literacy levels.
            </p>
          </div>

          <div className="card text-center">
            <BarChart3 className="w-12 h-12 text-success-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Visual Data</h3>
            <p className="text-gray-600 text-sm">
              Clear charts and metrics show MGNREGA performance with comparisons to
              neighboring districts and state averages.
            </p>
          </div>

          <div className="card text-center">
            <Mic className="w-12 h-12 text-warning-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Audio Support</h3>
            <p className="text-gray-600 text-sm">
              Web Speech API provides audio explanations in Hindi and English,
              helping users understand complex data.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">How It Works</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Data Collection</h3>
              <p className="text-gray-600">
                We fetch monthly MGNREGA performance data from the official data.gov.in API
                and store it in our database for fast access.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">District Selection</h3>
              <p className="text-gray-600">
                Users can search for their district or use geolocation to automatically
                detect their location and select the appropriate district.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Data Visualization</h3>
              <p className="text-gray-600">
                Interactive dashboards show key metrics, trends, and comparisons
                with audio explanations to help users understand the data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Data Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <ExternalLink className="w-5 h-5 mr-2 text-primary-600" />
              MGNREGA Official Data
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Monthly performance data from the Ministry of Rural Development,
              available through data.gov.in open government data platform.
            </p>
            <a
              href="https://data.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Visit data.gov.in →
            </a>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <ExternalLink className="w-5 h-5 mr-2 text-success-600" />
              OpenStreetMap
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Geocoding service used to convert user locations to district names
              for automatic district detection.
            </p>
            <a
              href="https://www.openstreetmap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-success-600 hover:text-success-800 text-sm font-medium"
            >
              Visit OpenStreetMap →
            </a>
          </div>
        </div>
      </div>

      {/* Technical Details
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Technical Implementation</h2>
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• React 18 with Vite</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Recharts for data visualization</li>
                <li>• Web Speech API for audio</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Backend</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Node.js with Express</li>
                <li>• MongoDB for data storage</li>
                <li>• Redis for caching</li>
                <li>• Docker containerization</li>
              </ul>
            </div>
          </div>
        </div>
      </div> */}

      {/* Open Source
      <div className="card bg-gray-50 border-gray-200">
        <div className="text-center">
          <Github className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Open Source Project</h3>
          <p className="text-gray-600 mb-4">
            This project is open source and available on GitHub. We welcome contributions
            from developers, designers, and rural development experts.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary inline-flex items-center space-x-2"
          >
            <Github className="w-4 h-4" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div> */}

      {/* Credits */}
      <div className="text-center border-t border-gray-200 pt-6">
        <p className="text-gray-600 flex items-center justify-center">
          Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> for rural India
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Supported by UNDP and built for the citizens of Uttar Pradesh
        </p>
      </div>
    </div>
  );
};

export default About;
