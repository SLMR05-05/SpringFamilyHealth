import { Box, Container ,Toolbar} from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { doctor } from '../api/mockData';

const width =260;

export default function DoctorLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header doctor={doctor} onOpenNotifications={() => {}} onLogout={() => {}} />

      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <Box component="main" sx={{ flex: 1,  }}>
          <Toolbar />
          <Container maxWidth={false} sx={{ py: 3, px: 3 }}>
            {children}
          </Container>
        </Box>
      </Box>
      
      <Footer />
    </Box>
  );
}