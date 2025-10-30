// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CreateInterviewPage from './pages/CreateInterviewPage'
import AllInterviewsPage from './pages/AllInterviewsPage'
import InterviewSessionPage from './pages/InterviewSessionPage'
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler' 
import MainLayout from './components/MainLayout'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Routes>
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

  
        <Route element={<ProtectedRoute />}>
          
         
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-interview" element={<CreateInterviewPage />} />
            <Route path="/all-interviews" element={<AllInterviewsPage />} />
           
          </Route>

          <Route path="/interview-session/:interviewId" element={<InterviewSessionPage />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          
        </Route>
      </Routes>
    </div>
  )
}

export default App