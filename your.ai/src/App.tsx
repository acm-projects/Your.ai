import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import Tasks from './components/Tasks'; // Import the Tasks page

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} /> 

      <Route path="/dashboard" element={
        <>
          <Dashboard />
          <Chatbot />
        </>
      } />

      {/* ✅ Add the new route for the Tasks page */}
      <Route path="/tasks" element={<Tasks />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
