import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landingpage';
import Dashboard from './components/dashboard';
import Newsletter from './components/newsletter';
import Kanban from './components/kanban';
import Chatbot from './components/chatbot';
import Login from './components/login';
import SpeechToText from './components/speech-to-text';
import TextToSpeech from './components/text-to-speech';
import Tasks from './components/tasks'; 

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/dashboard"
        element={
          <>
            <Dashboard />
            <Chatbot />
            <SpeechToText />
            <TextToSpeech />
          </>
        }
      />

      <Route path="/tasks" element={<Tasks />} />
      
      <Route path="/newsletter" element={<Newsletter onClose={() => {}} />} />
      
      <Route path="/kanban" element={<Kanban />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
