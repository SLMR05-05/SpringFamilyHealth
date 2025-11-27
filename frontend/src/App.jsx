
import { useRoutes, Navigate } from 'react-router-dom';
import { DoctorRoutes } from './routes/DoctorRoutes'; 
import { AdminRoutes } from './routes/AdminRoutes';
import { AuthRoutes } from './routes/AuthRoutes';

// chua chia root cho admin va doctor
// muon test thi thay admin thanh doctor
const App = () => {
  const routes = useRoutes([
    { path: '/', element: <Navigate to="/auth" replace /> },
    AuthRoutes,
    { path: '*', element: <Navigate to="/auth" replace /> }
  ]);
  return routes;
};

export default App;