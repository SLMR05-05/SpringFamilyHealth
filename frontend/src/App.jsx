
import { useRoutes, Navigate } from 'react-router-dom';
import { DoctorRoutes } from './routes/DoctorRoutes'; 
import { AdminRoutes } from './routes/AdminRoutes';

// chua chia root cho admin va doctor
const App = () => {
  const routes = useRoutes([
    { path: '/', element: <Navigate to="/admin" replace /> },
    AdminRoutes,
    { path: '*', element: <Navigate to="/admin" replace /> }
  ]);
  return routes;
};

export default App;