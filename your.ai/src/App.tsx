import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import Tasks from "./components/Tasks";
import Login from "./components/Login";
import Chatbot from "./components/Chatbot";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<><Dashboard /><Chatbot /></>} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
