
import { useRoutes, Navigate } from 'react-router-dom';
import { DoctorRoutes } from './routes/DoctorRoutes';
import { AdminRoutes } from './routes/AdminRoutes';
import { AuthRoutes } from './routes/AuthRoutes';
import UserDashboard from './page/UserDashboard';

// chua chia root cho admin va doctor
// muon test thi thay admin thanh doctor
const App = () => {
  // const routes = useRoutes([
  //   { path: '/', element: <Navigate to="/admin" replace /> },
  //   AdminRoutes,
  //   { path: '*', element: <Navigate to="/admin" replace /> }
  // ]);
  // return routes;

  // const routes = useRoutes([
  //   { path: '/', element: <Navigate to="/doctor" replace /> },
  //   DoctorRoutes,
  //   { path: '*', element: <Navigate to="/doctor" replace /> }
  // ]);
  // return routes;

  const routes = useRoutes([
    { path: '/', element: <Navigate to="/auth" replace /> },
    AuthRoutes,
    AdminRoutes,
    DoctorRoutes,
    { path: '/user-dashboard', element: <UserDashboard /> },
    { path: '*', element: <Navigate to="/auth" replace /> }
  ]);
  return routes;


};

export default App;