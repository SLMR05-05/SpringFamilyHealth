import { useMemo, useState } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, Card, CardContent, Grid, Button, Stack } from '@mui/material';
import { appointments, Enums, getPatientById } from '../../api/mockData';
import StatusChip from '../../components/StatusChip';

export default function AppointmentsPage() {
  const [filter, setFilter] = useState('ALL');
  const filtered = useMemo(() => {
    if (filter === 'ALL') return appointments;
    return appointments.filter(a => a.status === filter);
  }, [filter]);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Lịch hẹn</Typography>
        <ToggleButtonGroup size="small" value={filter} exclusive onChange={(_,v)=> v && setFilter(v)}>
          <ToggleButton value="ALL">Tất cả</ToggleButton>
          {Enums.AppointmentStatus.map(s => <ToggleButton key={s} value={s}>{s}</ToggleButton>)}
        </ToggleButtonGroup>
      </Stack>

      <Grid container spacing={2}>
        {filtered.map(a => {
          const p = getPatientById(a.memberId);
          return (
            <Grid key={a.appointmentId} item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>{p?.fullName}</Typography>
                    <StatusChip status={a.status} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">Thời gian: {new Date(a.appointmentDate).toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Ghi chú: {a.notes || '-'}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button size="small" variant="outlined">Xem chi tiết</Button>
                    <Button size="small" variant="contained">Cập nhật trạng thái</Button>
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
