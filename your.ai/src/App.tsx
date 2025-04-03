// src/App.tsx

import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landingpage';
import Dashboard from './components/dashboard';
import Newsletter from './components/newsletter';
import Kanban from './components/kanban';
import Chatbot from './components/chatbot';
import Login from './components/login';
import SpeechToText from './components/speech-to-text'; // Import the SpeechToText component
import TextToSpeech from './components/text-to-speech'; // Import the TextToSpeech component

const App: React.FC = () => {
  return (
    <Routes>
      {/* Landing Page Route */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Login Route */}
      <Route path="/login" element={<Login />} />
      
      {/* Dashboard Route, including SpeechToText and TextToSpeech components */}
      <Route
        path="/dashboard"
        element={
          <>
            <Dashboard />
            <Chatbot />
            <SpeechToText /> {/* Add SpeechToText here */}
            <TextToSpeech /> {/* Add TextToSpeech here */}
          </>
        }
      />
      
      {/* Newsletter Route */}
      <Route path="/newsletter" element={<Newsletter onClose={() => {}} />} />
      
      {/* Kanban Route */}
      <Route path="/kanban" element={<Kanban />} />
      
      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
