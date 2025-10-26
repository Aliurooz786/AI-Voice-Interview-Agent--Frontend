import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header';
import { createInterviewAndGenerateQuestions } from '../services/api';

const CreateInterviewPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobPosition: '',
    jobDescription: '',
    duration: '15' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { jobPosition, jobDescription, duration } = formData; 

    if (!jobPosition.trim() || !jobDescription.trim()) {
      setError('Please fill in both job position and description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      
      const payload = { 
          jobPosition, 
          jobDescription, 
          duration: `${duration} min` 
      };
      
      console.log("Creating interview with payload:", payload);
      
      const response = await createInterviewAndGenerateQuestions(payload); 

     
      if (!response?.id) {
          throw new Error('Invalid response from server after creation.');
      }
      
      console.log("Interview created successfully:", response);

      alert(`Interview for "${response.jobPosition}" created successfully!`);
      
     
      navigate('/dashboard');
      // -----------------------------

    } catch (err) {
      const serverMessage = err?.message || 'Failed to create interview. Please try again.';
      console.error('Failed to create interview:', err);
      setError(serverMessage);
      setLoading(false); 
    }
   
  };

  return (
    <div className="min-h-screen bg-gray-100"> {/* Added bg color */}
      {/* Header */}
      <Header 
        showProfile={true}
        showBackButton={true}
        backTo="/dashboard"
        backText="Back to Dashboard"
      />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <SparklesIcon className="h-8 w-8 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Create New Interview</h2>
          </div>

          <p className="text-gray-600 mb-8">
            Provide the job details below. Our AI will analyze the role and generate a dynamic set of interview topics.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
                <p className="font-medium">Error!</p>
                <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="jobPosition">
                Job Position
              </label>
              <input
                type="text"
                id="jobPosition"
                name="jobPosition"
                value={formData.jobPosition}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="jobDescription">
                Job Description
              </label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical"
                placeholder="Describe the role, required skills, and responsibilities..."
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="duration">
                Interview Duration
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="5">5 minutes (Mock)</option>
                <option value="15">15 minutes (Standard)</option>
                <option value="30">30 minutes (Extended)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium text-lg
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Create & Generate Topics'}
            </button>
          </form>

          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mt-4">
            <p className="text-sm">
              Our AI will analyze the job description and generate relevant interview topics
              tailored to this position.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateInterviewPage;