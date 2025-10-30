import { useState } from 'react'
import './index.css'
import Login from './page/Login.jsx'
import UserDashboard from "./page/UserDashboard.jsx";
import { AuthProvider } from './context/AuthProvider.jsx';
import PrivateRoute from './component/PrivateRoute.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DoctorDashboard from './page/DotorDashboard.jsx';
function App() {
    const { t, i18n } = useTranslation();

  return (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      </Routes>
    </BrowserRouter>
</AuthProvider>
      );
}

export default App
