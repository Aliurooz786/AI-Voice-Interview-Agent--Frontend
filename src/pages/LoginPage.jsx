import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { loginUser, registerUser } from '../services/api'; 

/**
 * Helper component to render the content for the active tab.
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Content to be rendered.
 * @param {string} props.value - Current active tab value (e.g., 'signin').
 * @param {string} props.index - Index/value of this panel (e.g., 'signin').
 */
function TabPanel({ children, value, index }) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && (<div className="pt-6">{children}</div>)}
        </div>
    );
}

/**
 * Renders the primary landing page with Sign In and Sign Up functionality.
 * This component handles standard authentication and initiates the Google OAuth2 flow.
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  /**
   * Switches between the Sign In and Sign Up tabs.
   */
  const switchTab = (tab) => {
    setActiveTab(tab);
    setFormData({ fullName: '', email: '', password: '' });
    setError('');
  };

  /**
   * Handles input changes for all form fields.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Handles form submission for manual login or registration.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { email, password, fullName } = formData;
    let success = false;

    try {
      if (activeTab === 'signin') {
        if (!email || !password || !email.includes('@')) {
          throw new Error('Please enter a valid email and password.');
        }
        
        await loginUser(email, password);
        success = true;

      } else {
        if (!fullName || !email || !password || password.length < 6 || !email.includes('@')) {
          throw new Error('Please fill all fields and ensure password is at least 6 characters.');
        }

        await registerUser(fullName, email, password);
        
        alert('Registration successful! Please Sign In.');
        switchTab('signin');
        setLoading(false);
        return; 
      }
      
      // Navigate on successful Login
      if (success) {
        navigate('/dashboard');
      }
      
    } catch (err) {
      console.error('Authentication error:', err.message);
      setError(err.message || (activeTab === 'signin' 
        ? 'Invalid credentials. Please try again.' 
        : 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initiates the Google OAuth2 sign-in flow by redirecting the user to the backend authorization URL.
   */
  const handleGoogleSignIn = () => {
    // This is the correct Spring Security authorization start path.
    window.location.href = 'http://localhost:8080/api/oauth2/authorization/google';
  };

  /**
   * Gets the Tailwind classes for the tab buttons based on active state.
   */
  const getTabButtonClass = (isActive) => {
    const baseClasses = 'flex-1 px-4 py-2 rounded-md font-medium transition-colors';
    const activeClasses = 'bg-indigo-600 text-white shadow-md';
    const inactiveClasses = 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    return [baseClasses, isActive ? activeClasses : inactiveClasses].join(' ');
  };

  /**
   * Gets the Tailwind classes for the main submit button based on loading state.
   */
  const getSubmitButtonClass = () => {
    const baseClasses = 'w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors font-semibold text-lg';
    return loading ? [baseClasses, 'opacity-50 cursor-not-allowed'].join(' ') : baseClasses;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        
        <div className="flex flex-col items-center space-y-2">
            <span className="p-3 bg-indigo-500 rounded-full text-white shadow">
                <LockClosedIcon className="w-8 h-8" />
            </span>
            <h1 className="text-3xl font-bold text-gray-900">
                AI Interview Agent
            </h1>
        </div>

        <div className="flex space-x-2 mb-6 mt-6">
          <button
            type="button"
            className={getTabButtonClass(activeTab === 'signin')}
            onClick={() => switchTab('signin')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={getTabButtonClass(activeTab === 'signup')}
            onClick={() => switchTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Sign In Fields */}
          <TabPanel value={activeTab} index="signin">
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </TabPanel>

          {/* Sign Up Fields */}
          <TabPanel value={activeTab} index="signup">
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Urooz Ali"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
              <div className="mb-4">
               
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </TabPanel>
            
            <button
              type="submit"
              disabled={loading}
              className={getSubmitButtonClass()}
            >
              {loading ? 'Processing...' : activeTab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500 bg-white flex-shrink">OR</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        <button
          type="button"
          className="w-full border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
        >
          <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" className="h-5 w-5" />
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;