
import { useRoutes, Navigate } from 'react-router-dom';
import { DoctorRoutes } from './routes/DoctorRoutes'; 
import { AdminRoutes } from './routes/AdminRoutes';

// chua chia root cho admin va doctor
// muon test thi thay admin thanh doctor
const App = () => {
  const routes = useRoutes([
    { path: '/', element: <Navigate to="/doctor" replace /> },
    DoctorRoutes,
    { path: '*', element: <Navigate to="/doctor" replace /> }
  ]);
  return routes;
};

export default App;