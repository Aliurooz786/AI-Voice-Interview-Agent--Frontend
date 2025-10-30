
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Vapi from '@vapi-ai/web';

import { fetchInterviewById, fetchCurrentUser } from '../services/api'; 

import { PhoneIcon, UserIcon, CpuChipIcon, MicrophoneIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';


const VAPI_PUBLIC_KEY = 'ff1f885b-5774-4575-bc62-3e5a80469eca'; 


const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

function InterviewSessionPage() {
  const params = useParams();
  const interviewId = params.interviewId || params.id;
  const navigate = useNavigate();
  
  const [interview, setInterview] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [callStatus, setCallStatus] = useState('Connecting...');
  const [speaking, setSpeaking] = useState({ interviewer: false, candidate: false });
  const [elapsedTime, setElapsedTime] = useState(0);

  const vapiRef = useRef(null);
  const isCallStarted = useRef(false);
  const timerIntervalRef = useRef(null);


  useEffect(() => {
    const loadData = async () => {
        setIsLoading(true);
        setError('');
        try {
            console.log("Fetching data for interview:", interviewId);
            const [interviewData, userData] = await Promise.all([
                fetchInterviewById(interviewId),
                fetchCurrentUser()
            ]);
            
            console.log("Data fetched:", { interviewData, userData });
            setInterview(interviewData); 
            setCurrentUser(userData); 
        } catch (err) {
            console.error('Failed to load data:', err);
             if (!err.response || (err.response.status !== 401 && err.response.status !== 403)) {
                setError('Failed to load interview details. Please check the link.');
             }
        } finally {
            setIsLoading(false);
        }
    };
    loadData();
  }, [interviewId, navigate]);

  // Start Vapi Call
  useEffect(() => {
    if (interview && currentUser && !isCallStarted.current) {
       
        if (!interview.topicsJson || interview.topicsJson.length < 5) {
            console.error("VAPI ERROR: 'topicsJson' is missing or empty.");
            setError("Failed to start: Interview topics are missing. Please re-create the interview.");
            setCallStatus("Error");
            return;
        }
      
        
        isCallStarted.current = true;
        console.log("Initializing Vapi...");

     
        let topicsListText = "[]";
        try {
            
            topicsListText = JSON.stringify(JSON.parse(interview.topicsJson));
        } catch (e) {
            console.error('Failed to parse topicsJson:', e);
            setError('Interview topics are corrupted. Cannot start.');
            return;
        }
        

        const candidateName = currentUser.fullName || 'Candidate';
        const vapi = new Vapi(VAPI_PUBLIC_KEY);
        vapiRef.current = vapi;

        
        const assistantConfig = {
            
            firstMessage: `Hello ${candidateName}. My name is Voxy, and I'll be conducting your interview for the ${interview.jobPosition} position today. To get started, could you please tell me a little bit about yourself and your recent experience?`,
            
            model: {
                provider: "openai", 
                model: "gpt-3.5-turbo", 
                
                systemPrompt: `
You are 'Voxy', an elite technical interviewer. You are interviewing ${candidateName} for the role of ${interview.jobPosition}.
The total intended duration for this interview is ${interview.duration}.

**YOUR AGENDA (MUST COVER):**
You MUST assess the candidate's skills across these specific key topics:
${topicsListText}

**INTERVIEW FLOW & RULES:**

1.  **Phase 1: Introduction (Done)**
    Your first message ("Hello... tell me about yourself...") is set. Listen carefully to their introduction.

2.  **Phase 2: Conversational Deep Dive (Core Logic)**
    - After their intro, say: "Thank you. Let's dive into the core topics for this role."
    - Pick the **first topic** from your AGENDA list.
    - Ask an insightful, open-ended, **scenario-based** question about that first topic.
    - **Listen** to their answer.
    - **Ask 1-2 relevant follow-up questions** based on their specific answer.
    - When you are satisfied, **politely transition** to the **next topic** from the AGENDA list.
    - Repeat this loop (Topic -> Question -> Answer -> Follow-up -> Next Topic) until all topics are covered.

3.  **Phase 3: Time Management**
    - You MUST manage the time. Pace the conversation to fit the ${interview.duration}.
    - If the candidate is talking too much, politely interrupt and guide them to the next topic.
    - If time is running out, skip remaining topics and move to the conclusion.

4.  **Phase 4: Conclusion**
    - After covering all topics (or if time is up), ask the candidate: "That's all the topics I wanted to cover. Do you have any questions for me?"
    - Answer their questions briefly.
    - Conclude the interview politely: "Alright, thank you for your time today, ${candidateName}. The hiring team will review our conversation and get back to you. Have a great day!"
`
            },
            voice: { provider: 'playht', voiceId: 'jennifer' } 
        };
        // --- END VAPI CONFIGURATION ---
        
        console.log("Vapi: Attempting to start call...");
        
        vapi.start(assistantConfig).catch(err => {
            console.error("VAPI: vapi.start() method itself threw an error:", err);
            setError("Failed to start Vapi call. Check console.");
            setCallStatus('Error');
        });

        // Event listeners
        vapi.on('call-start', () => {
            console.log("Vapi Call Started");
            setCallStatus('Interview in Progress');
            timerIntervalRef.current = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
        });
        vapi.on('speech-start', () => { setSpeaking({ interviewer: true, candidate: false }); });
        vapi.on('speech-end', () => { setSpeaking({ interviewer: false, candidate: false }); }); // Typo fixed
        vapi.on('volume-level', (level) => { setSpeaking(prev => ({ ...prev, candidate: level > 0.1 })); });
        vapi.on('call-end', () => {
            console.log("Vapi Call Ended");
            clearInterval(timerIntervalRef.current);
            setCallStatus("Interview Ended");
            alert("Interview has ended."); navigate('/dashboard');
        });
        vapi.on('error', (e) => {
            clearInterval(timerIntervalRef.current);
            console.error('VAPI ERROR OBJECT:', e);
            setError('A call error occurred. Check mic permissions/console logs and refresh.');
            setCallStatus('Error');
            setSpeaking({ interviewer: false, candidate: false });
        });
    }

    // Cleanup
    return () => {
        clearInterval(timerIntervalRef.current);
        if (vapiRef.current && isCallStarted.current) {
            console.log("Stopping Vapi call on component unmount.");
            vapiRef.current.stop();
            isCallStarted.current = false;
        }
    };
  }, [interview, currentUser, navigate]);

  const handleEndCall = () => {
    if (vapiRef.current) vapiRef.current.stop();
  };

  // --- RENDER LOGIC ---
  if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-400">
            {/* ... Loading SVG ... */}
            Loading interview details...
        </div>
      );
  }
  
  if (error) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
              {/* ... Error UI ... */}
          </div>
      );
  }

  if (!interview || !currentUser) {
       return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-400">Waiting for data...</div>
  }

  const candidateInitial = currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        {/* Header */}
        <header className="p-4 border-b border-gray-700">
            <div className="flex justify-between items-center max-w-6xl mx-auto">
                <h1 className="text-xl font-semibold truncate">{interview.jobPosition}</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-sm px-3 py-1 bg-gray-700 rounded-full">{callStatus}</span>
                    <span className="text-sm font-mono px-3 py-1 bg-gray-700 rounded-full">{formatTime(elapsedTime)}</span>
                </div>
            </div>
        </header>

        {/* Meeting Tiles Area */}
        <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {/* AI Interviewer Tile */}
            <div 
                className={`bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center transition-all duration-300 relative ${speaking.interviewer ? 'ring-4 ring-indigo-500 animate-pulse-ai' : 'ring-2 ring-gray-700'}`}
            >
                <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center mb-4 text-4xl">
                    {speaking.interviewer ? <SpeakerWaveIcon className="w-12 h-12 text-white" /> : <CpuChipIcon className="w-12 h-12 text-white" />}
                </div>
                <div className="font-semibold text-xl text-gray-200">Voxy (AI Interviewer)</div>
                {speaking.interviewer && (
                    <div className="absolute top-4 right-4 flex items-center space-x-2 text-indigo-300">
                        <span className="text-xs font-medium">Speaking...</span>
                    </div>
                )}
            </div>

            {/* Candidate Tile */}
            <div 
                className={`bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center transition-all duration-300 relative ${speaking.candidate ? 'ring-4 ring-green-500 animate-pulse-candidate' : 'ring-2 ring-gray-700'} ${speaking.candidate ? 'animate-pulse-candidate' : ''}`}
            >
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-4 text-4xl">
                    {speaking.candidate ? <MicrophoneIcon className="w-12 h-12 text-white" /> : <span className="font-bold">{candidateInitial}</span>}
                </div>
                <div className="font-semibold text-xl text-gray-200">{currentUser.fullName}</div>
                {speaking.candidate && (
                    <div className="absolute top-4 right-4 flex items-center space-x-2 text-green-300">
                        <span className="text-xs font-medium">Speaking...</span>
                    </div>
                )}
            </div>
        </main>

        {/* Footer / Controls */}
        <footer className="p-4 border-t border-gray-700 text-center">
            <button
                onClick={handleEndCall}
                className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center mx-auto"
                disabled={!isCallStarted.current}
            >
                <PhoneIcon className="w-6 h-6 mr-2" />
                End Call
            </button>
        </footer>
    </div>
  );
};

export default InterviewSessionPage;