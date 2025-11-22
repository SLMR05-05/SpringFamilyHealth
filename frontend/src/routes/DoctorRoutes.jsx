import React from "react";
import DoctorLayout from "../layouts/DoctorLayout/index.jsx";
import Loadable from "../components/Loadable";


const DashboardPage = Loadable(React.lazy(() => import('../pages/doctor/DashboardPage')));
const PatientsPage = Loadable(React.lazy(() => import('../pages/doctor/PatientsPage')));
const CalendarPage = Loadable(React.lazy(() => import('../pages/doctor/CalendarPage')));
const PendingRecordsPage = Loadable(React.lazy(() => import('../pages/doctor/PendingRecordsPage')));
const SettingsPage = Loadable(React.lazy(() => import('../pages/doctor/SettingPage')));
const AIChatAssistantPage = Loadable(React.lazy(() => import('../pages/doctor/ChatbotPage')));


export const DoctorRoutes = {
  path: '/doctor',
  element: <DoctorLayout />, 
  children: [
    { index: true, element: <DashboardPage /> },
    { path: 'dashboard', element: <DashboardPage /> },
    { path: 'patients', element: <PatientsPage /> },
    { path: 'pending-records', element: <PendingRecordsPage /> },
    { path: 'calendar', element: <CalendarPage /> },
    { path: 'chat-ai', element: <AIChatAssistantPage /> },
    { path: 'settings', element: <SettingsPage /> }
  ]
};