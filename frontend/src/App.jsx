import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate,useRoutes } from 'react-router-dom';
import './index.css'
import Login from './page/Login.jsx'
import UserDashboard from "./page/UserDashboard.jsx";
import { AuthProvider } from './context/AuthProvider.jsx';
import PrivateRoute from './component/PrivateRoute.jsx';
import { useTranslation } from "react-i18next";
// import DoctorDashboard from './page/doctor/DotorDashboard.jsx';
import { DoctorRoutes } from './routes/DoctorRoutes'; 
import { AdminRoutes } from './routes/AdminRoutes';

const AppRoutes = () => {
  const { t, i18n } = useTranslation();
  const routes = useRoutes([
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/user-dashboard",
      element: <UserDashboard />
    },
    { path: '/', element: <Navigate to="/admin" replace /> },
    AdminRoutes,
    DoctorRoutes,
    { path: '*', element: <Navigate to="/doctor" replace /> }
  ]);
  return routes;
};
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes></AppRoutes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
