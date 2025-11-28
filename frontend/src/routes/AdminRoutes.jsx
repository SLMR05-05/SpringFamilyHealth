import React from "react";
import AdminLayout from "../layouts/AdminLayout/index.jsx";
import Loadable from "../components/Loadable";

const DashboardPage = Loadable(React.lazy(() => import('../pages/admin/DashboardAdminPage')));
const UsersPage = Loadable(React.lazy(() => import('../pages/admin/UserManaPage')));
const DoctorsPage = Loadable(React.lazy(() => import('../pages/admin/DoctorManaPage')));
const ReportPage = Loadable(React.lazy(() => import('../pages/Admin/ReportsPage.jsx')));



export const AdminRoutes = {
    path:"/admin",
    element:<AdminLayout/>,
    children:[
        {index:true, element:<DashboardPage/>},
        {path:"users", element:<UsersPage/>},
        {path:"doctors", element:<DoctorsPage/>},
        {path:"reports", element:<ReportPage/>},
        
    ]
}