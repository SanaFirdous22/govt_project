import { Link, useLocation } from 'react-router-dom';
import { Mic, Volume2, Home, Info } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3 touch-target">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                Our Voice, Our Rights
              </h1>
              <p className="text-xs text-gray-600 font-hindi">
                हमारी आवाज़, हमारे अधिकार
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/about"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/about'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </Link>
          </nav>

          {/* Audio Help Button */}
          <button
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors touch-target"
            onClick={() => {
              // Web Speech API for audio explanation
              if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(
                  'Welcome to Our Voice, Our Rights. This app shows MGNREGA performance data for districts in Uttar Pradesh. Select a district to view detailed information.'
                );
                utterance.lang = 'en-IN'; // Indian English
                window.speechSynthesis.speak(utterance);
              }
            }}
            aria-label="Listen to introduction in English"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Listen</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <nav className="flex justify-center space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/about"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/about'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
