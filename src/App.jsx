import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartScreen from "./components/StartScreen";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";
import AdminPage from "./components/AdminPage";
import LandingPage from "./components/LandingPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/auth" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<AdminPage />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}
