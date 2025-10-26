import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  BriefcaseIcon, 
  PlayIcon, 
  ClipboardDocumentIcon 
} from '@heroicons/react/24/outline';
import Header from '../components/Header';

import { fetchUserInterviews } from '../services/api'; 

const AllInterviewsPage = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const data = await fetchUserInterviews(); 
      setInterviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load interviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleStartInterview = (id) => {
    navigate(`/interview-session/${id}`);
  };

  const handleCopyLink = (interviewId) => {
    
    const interviewUrl = `${window.location.origin}/interview-session/${interviewId}`;
    navigator.clipboard.writeText(interviewUrl)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Failed to copy link:', err));
  };

  return (
    <div className="min-h-screen bg-gray-100"> {/* Added bg color */}
      <Header 
        showProfile={true}
        showBackButton={true} 
        backTo="/dashboard" 
        backText="Back to Dashboard" 
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">All Created Interviews</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading interviews...</p>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-8">{error}</div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
             
            </div>
          ) : (
            // List/Table view
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Position</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created On</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {interviews.map((interview) => (
                    <tr key={interview.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{interview.jobPosition}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{interview.jobDescription}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          interview.interviewType === 'MOCK' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {interview.interviewType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {interview.duration} {/* "minutes" hata diya gaya */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(interview.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleCopyLink(interview.id)}
                          title="Copy Link"
                          className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <ClipboardDocumentIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleStartInterview(interview.id)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 inline-flex items-center gap-1"
                        >
                          <PlayIcon className="h-5 w-5" />
                          Start
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllInterviewsPage;