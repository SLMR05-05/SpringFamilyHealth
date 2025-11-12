import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // medical blue
      light: '#63a4ff',
      dark: '#004ba0'
    },
    secondary: {
      main: '#00a3a3'
    },
    background: {
      default: '#f5f9fc',
      paper: '#ffffff'
    }
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCard: { styleOverrides: { root: { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } } },
    MuiDrawer: { styleOverrides: { paper: { backgroundColor: '#ffffff' } } }
  }
});

export default theme;
