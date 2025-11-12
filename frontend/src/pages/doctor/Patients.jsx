import { Box, Typography, Grid, Card, CardContent, Stack } from '@mui/material';
import { patients } from '../../api/mockData';

export default function PatientsPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Bệnh nhân</Typography>
      <Grid container spacing={2}>
        {patients.map(p => (
          <Grid key={p.memberId} item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>{p.fullName}</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">DOB: {p.dateOfBirth}</Typography>
                  <Typography variant="body2" color="text.secondary">Giới tính: {p.gender}</Typography>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Typography variant="body2">Chiều cao: {p.height || '-'} cm</Typography>
                  <Typography variant="body2">Cân nặng: {p.weight || '-'} kg</Typography>
                  <Typography variant="body2">Nhóm máu: {p.bloodType || '-'}</Typography>
                </Stack>
                <Typography variant="body2">Bệnh mãn tính: {p.chronic || '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
