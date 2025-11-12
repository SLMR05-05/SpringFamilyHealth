import { Box, Typography, Grid, Card, CardContent, Stack, Button } from '@mui/material';
import { medicalRecords, getPatientById } from '../../api/mockData';

export default function MedicalRecordsPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Hồ sơ bệnh án</Typography>
      <Grid container spacing={2}>
        {medicalRecords.map(r => {
          const p = getPatientById(r.memberId);
          return (
            <Grid key={r.recordId} item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight={600}>{p?.fullName}</Typography>
                    <Typography variant="caption" color="text.secondary">Ngày khám: {r.visitDate}</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ mt: 1 }}><b>Chẩn đoán:</b> {r.diagnosis}</Typography>
                  <Typography variant="body2"><b>Đơn thuốc:</b> {r.prescription}</Typography>
                  <Typography variant="body2"><b>Ghi chú:</b> {r.notes || '-'}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button size="small" variant="outlined">Thêm ghi chú</Button>
                    <Button size="small" variant="contained">Cập nhật chẩn đoán</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
