import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRightIcon, 
  ClipboardDocumentIcon, 
  PlusCircleIcon, 
  PlayIcon 
} from '@heroicons/react/24/outline';
import Header from '../components/Header';

import { fetchUserInterviews, fetchCurrentUser } from '../services/api'; 

const DashboardPage = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [recentInterviews, setRecentInterviews] = useState([]); 
  const [currentUser, setCurrentUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const [interviewsResponse, userResponse] = await Promise.all([
          fetchUserInterviews(),
          fetchCurrentUser()
        ]);

        
        const sortedInterviews = interviewsResponse.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setInterviews(sortedInterviews);
        setRecentInterviews(sortedInterviews.slice(0, 3)); // Sirf top 3
        
 
        setCurrentUser(userResponse);

      } catch (err) {
        
         if (!err.response || (err.response.status !== 401 && err.response.status !== 403)) {
            setError('Failed to load dashboard data. Please try again.');
         }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]); 

  const handleCopyLink = async (interviewId) => {
    
    const interviewUrl = `${window.location.origin}/interview-session/${interviewId}`; 
    try {
      await navigator.clipboard.writeText(interviewUrl);
      setCopySuccess('Link copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setError('Failed to copy link. Please try again.');
    }
  };

  const handleStartInterview = (id) => {
    navigate(`/interview-session/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100"> 
      <Header 
        showProfile={true} 
       
      />

   
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {copySuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {copySuccess}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Create New Interview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <PlusCircleIcon className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-center mb-3">Create New Interview</h2>
            <p className="text-gray-600 text-center mb-6">
              Set up a new AI-powered interview session with custom topics.
            </p>
            <button
              onClick={() => navigate('/create-interview')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 w-full"
            >
              Get Started
            </button>
          </div>

          {/* Right Column - Recent Interviews */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Recent Interviews</h2>
            
            {interviews.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-gray-500 text-center py-8">
                No interviews yet. Create your first interview!
              </div>
            ) : (
              <>
               
                {recentInterviews.map((interview) => (
                  <div key={interview.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {interview.jobPosition}
                    </h3>
                    <div className="text-sm text-gray-600">
                      
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${interview.interviewType === 'MOCK' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        {interview.interviewType}
                      </span>
                      <span className="mx-2">•</span>
                      
                      <span>{interview.duration}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Created {new Date(interview.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleStartInterview(interview.id)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 inline-flex items-center gap-1"
                      >
                        <PlayIcon className="h-5 w-5" />
                        Start Interview
                      </button>
                      <button
                        onClick={() => handleCopyLink(interview.id)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center gap-1"
                      >
                        <ClipboardDocumentIcon className="h-5 w-5" />
                        Copy Link
                      </button>
                    </div>
                  </div>
                ))}

                {interviews.length > 3 && (
                  <a
                    href="/all-interviews"
                    className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/all-interviews');
                    }}
                  >
                    View All Interviews
                    <ArrowRightIcon className="h-5 w-5" />
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;