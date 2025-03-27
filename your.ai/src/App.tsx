import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landingpage';
import Dashboard from './components/dashboard';
import Newsletter from './components/newsletter';
import Kanban from './components/kanban';
import Chatbot from './components/chatbot';
import Tasks from './components/Tasks'; // Import the Tasks page
import KanbanBoard from './components/kanban';

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
      <Route path="/newsletter" element={<Newsletter onClose={function (): void {
        throw new Error('Function not implemented.');
      } } />} />

      <Route path="/kanban" element={<Kanban />} />

    </Routes>
  );
}

export default App;
