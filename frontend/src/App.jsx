
import { useRoutes, Navigate } from 'react-router-dom';
import { DoctorRoutes } from './routes/DoctorRoutes'; 

// App root sets up route tree. DoctorLayout will provide <Outlet /> for children.
const App = () => {
  const routes = useRoutes([
    { path: '/', element: <Navigate to="/doctor" replace /> },
    DoctorRoutes,
    { path: '*', element: <Navigate to="/doctor" replace /> }
  ]);
  return routes;
};

export default App;