import { Heart, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Voice, Our Rights</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Empowering citizens with transparent MGNREGA data visualization.
              Built for accessibility and low-literacy users across Uttar Pradesh.
            </p>
            <p className="text-gray-400 text-xs font-hindi">
              उत्तर प्रदेश के नागरिकों को एमजीएनआरईजीए डेटा के साथ सशक्त बनाना।
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://nrega.nic.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>MGNREGA Official Website</span>
                </a>
              </li>
              <li>
                <a
                  href="https://data.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Government Data</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.undp.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>UNDP India</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Tech */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Technical Info</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>Built with React & Node.js</p>
              <p>Data sourced from data.gov.in</p>
              <p>Geocoding via OpenStreetMap</p>
              <div className="flex items-center space-x-2 mt-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="View source code on GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <span className="text-xs">Open Source</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-1 text-sm text-gray-400 mb-4 md:mb-0">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for rural India</span>
            </div>

            <div className="text-sm text-gray-400 text-center md:text-right">
              <p>&copy; {currentYear} Our Voice, Our Rights</p>
              <p className="text-xs mt-1">
                Data last updated: <span id="last-update">Loading...</span>
              </p>
            </div>
          </div>

          {/* Accessibility Statement */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              This application is designed to be accessible to users with disabilities and low literacy levels.
              For support, contact your local Gram Panchayat or Block Development Officer.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
