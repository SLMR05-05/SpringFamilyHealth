import React from "react";
import DoctorLayout from "../layouts/DoctorLayout/index.jsx";
import Loadable from "../components/Loadable";




const ListOfCharPage = Loadable(React.lazy(() => import('../pages/doctor/ListOfChar')));
const SchedulePage = Loadable(React.lazy(() => import('../pages/doctor/SchedulePage')));
const FamilyManagementList = Loadable(React.lazy(() => import('../pages/doctor/FamilyManagementList')));
const DoctorRequestManagement = Loadable(React.lazy(() => import('../components/doctor/DoctorRequestManagement')));
const DoctorProfile = Loadable(React.lazy(() => import('../pages/doctor/DoctorProfile')));

export const DoctorRoutes = {
  path: '/doctor',
  element: <DoctorLayout />, 
  children: [ 
    { index: true, element: <DoctorRequestManagement /> }, // Mặc định hiện tab Quản lý yêu cầu
    { path: 'list-char', element: <ListOfCharPage /> },
    { path: 'calendar', element: <SchedulePage /> },
    { path: 'requests', element: <DoctorRequestManagement /> },
    { path: 'families', element: <FamilyManagementList /> }, // Tab Quản lý gia đình
    { path: 'profile', element: <DoctorProfile /> },
  ]
};