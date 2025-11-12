import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 2, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', }}>
      <Typography variant="caption" color="text.secondary">© {new Date().getFullYear()} Spring Family Health • v1.0 • Last update {new Date().toLocaleDateString()}</Typography>
    </Box>
  );
}
