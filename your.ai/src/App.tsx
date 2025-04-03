import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landingpage';
import Dashboard from './components/dashboard';
import Newsletter from './components/newsletter';
import Kanban from './components/kanban';
import Chatbot from './components/chatbot';
//import Notifications from "./components/Notifications";
import Login from './components/login';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<><Dashboard /><Chatbot /></>} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/newsletter" element={<Newsletter onClose={function (): void {
        throw new Error('Function not implemented.');
      } } />} />

      <Route path="/kanban" element={<Kanban />} />

    </Routes>
  );
};

export default App;
