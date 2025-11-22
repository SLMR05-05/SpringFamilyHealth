import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'
import Login from './page/Login.jsx'
import UserDashboard from "./page/UserDashboard.jsx";
import { AuthProvider } from './context/AuthProvider.jsx';
import PrivateRoute from './component/PrivateRoute.jsx';
import { useTranslation } from "react-i18next";
import DoctorDashboard from './page/doctor/DotorDashboard.jsx';
function App() {
  const { t, i18n } = useTranslation();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
