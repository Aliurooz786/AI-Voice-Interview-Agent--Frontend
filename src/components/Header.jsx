import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Header = ({ showBackButton = false, backTo = '/dashboard', backText = 'Back to Dashboard', showProfile = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem('jwt_token');
     
      try {
        const api = require('../services/api');
        if (api && api.apiClient && api.apiClient.defaults && api.apiClient.defaults.headers) {
          delete api.apiClient.defaults.headers.common['Authorization'];
        }
      } catch (e) {
        
      }
    } catch (e) {
      
    }
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 md:px-8 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer"
            style={{ background: 'none', border: 'none', padding: 0 }}
            aria-label="Home"
          >
            <span className="inline-block w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#6366F1" />
                <text x="16" y="22" textAnchor="middle" fontSize="16" fill="white" fontFamily="Arial" fontWeight="bold">AI</text>
              </svg>
            </span>
          </button>

          {showBackButton && (
            <button
              onClick={() => navigate(backTo)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="hidden sm:inline">{backText}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {showProfile && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-indigo-600">
                  <UserCircleIcon className="h-6 w-6" />
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm"
              >
                Logout
              </button>
            </div>
          )}

          {!showProfile && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-gray-700 hover:underline"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;