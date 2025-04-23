import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landingpage';
import Dashboard from './components/dashboard';
import Newsletter from './components/newsletter';
import Kanban from './components/kanban';
import Chatbot from './components/chatbot';
import Login from './components/login';
import SpeechToText from './components/speech-to-text';
import TextToSpeech from './components/text-to-speech';
import Calendar from './components/calendar';
import { AuthProvider } from "./Context/authContext"; 

const App: React.FC = () => {
  return (
    <AuthProvider>
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

        <Route
          path="/calendar"
          element={
            <>
              <Calendar />
              <Chatbot />
              <SpeechToText />
              <TextToSpeech />
            </>
          }
        />

        <Route path="/newsletter" element={<Newsletter onClose={() => {}} />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
