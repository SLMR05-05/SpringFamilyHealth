import React from "react";
import DoctorLayout from "../layouts/DoctorLayout/index.jsx";
import Loadable from "../components/Loadable";




const ListOfCharPage = Loadable(React.lazy(() => import('../pages/doctor/ListOfChar')));
const SchedulePage = Loadable(React.lazy(() => import('../pages/doctor/SchedulePage')));
const FamilyManagementList = Loadable(React.lazy(() => import('../pages/doctor/FamilyManagementList')));

export const DoctorRoutes = {
  path: '/doctor',
  element: <DoctorLayout />, 
  children: [ 
    { index: true, element: < FamilyManagementList /> },
    { path: 'list-char', element: <ListOfCharPage /> },
    { path: 'calendar', element: <SchedulePage /> },
    

  ]
};