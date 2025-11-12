import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import DoctorLayout from './layouts/DoctorLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/doctor/Dashboard';
import AppointmentsPage from './pages/doctor/Appointments';
import MedicalRecordsPage from './pages/doctor/MedicalRecords';
import PatientsPage from './pages/doctor/Patients';
import SharedRecordsPage from './pages/doctor/SharedRecords';
import NotificationsPage from './pages/doctor/Notifications';
import SupportTicketsPage from './pages/doctor/SupportTickets';
import ProfilePage from './pages/doctor/Profile';
import AccessLogsPage from './pages/doctor/AccessLogs';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <DoctorLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/records" element={<MedicalRecordsPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/shared" element={<SharedRecordsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/tickets" element={<SupportTicketsPage />} />
            <Route path="/access-log" element={<AccessLogsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </DoctorLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App
