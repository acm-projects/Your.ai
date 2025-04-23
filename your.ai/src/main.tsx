// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import { AuthProvider } from "./Context/authContext"; 
import { CalendarProvider } from "./Context/Calendarcontext";

import "./index.css";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProvider>
        <CalendarProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CalendarProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);