import { Box, Typography, TextField, Grid, Paper, Button } from '@mui/material';
import { doctor } from '../../api/mockData';
import { useState } from 'react';

export default function ProfilePage() {
  const [form, setForm] = useState({ fullName: doctor.fullName, email: doctor.email, specialty: doctor.specialty, hospital: doctor.hospital });
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Tài khoản cá nhân</Typography>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Họ tên" name="fullName" value={form.fullName} onChange={onChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Email" name="email" value={form.email} onChange={onChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Chuyên khoa" name="specialty" value={form.specialty} onChange={onChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Bệnh viện" name="hospital" value={form.hospital} onChange={onChange} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained">Lưu thay đổi</Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
