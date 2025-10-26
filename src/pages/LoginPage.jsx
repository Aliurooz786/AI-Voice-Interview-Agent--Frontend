import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header';
import { loginUser, registerUser } from '../services/api';

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

  const switchTab = (tab) => {
    setActiveTab(tab);
    setFormData({ fullName: '', email: '', password: '' });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { email, password, fullName } = formData;

    try {
      if (activeTab === 'signin') {
        if (!email || !password) {
          throw new Error('Please enter both email and password');
        }
        
        if (!email.includes('@')) {
          throw new Error('Please enter a valid email address');
        }

        console.log('Submitting login form:', { email });
        await loginUser(email, password);
        console.log('Login successful');
      } else {
        if (!fullName || !email || !password) {
          throw new Error('Please fill in all fields');
        }

        if (!email.includes('@')) {
          throw new Error('Please enter a valid email address');
        }

        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        await registerUser(fullName, email, password);
      }
      
      // If we get here, login/register was successful
      navigate('/dashboard');
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || (
        activeTab === 'signin' 
          ? 'Invalid credentials. Please try again.' 
          : 'Registration failed. Please try again.'
      ));
    } finally {
      setLoading(false);
    }
  };

  const getTabButtonClass = (isActive) => {
    const baseClasses = 'flex-1 px-4 py-2 rounded-md font-medium transition-colors';
    const activeClasses = 'bg-indigo-600 text-white';
    const inactiveClasses = 'bg-gray-200 text-gray-700';
    return [baseClasses, isActive ? activeClasses : inactiveClasses].join(' ');
  };

  const getSubmitButtonClass = () => {
    const baseClasses = 'w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium';
    return loading ? [baseClasses, 'opacity-50 cursor-not-allowed'].join(' ') : baseClasses;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          AI Voice Interview Agent
        </h1>

        <div className="flex space-x-2 mb-6">
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'signup' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={getSubmitButtonClass()}
            >
              {loading ? 'Processing...' : activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t"></div>
          <span className="px-4 text-gray-500">OR</span>
          <div className="flex-1 border-t"></div>
        </div>

        <button
          type="button"
          className="w-full border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowRightIcon className="h-5 w-5" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;