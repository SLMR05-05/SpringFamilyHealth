import { Box, Typography, Grid, Card, CardContent, Stack, Button } from '@mui/material';
import { sharedRecords } from '../../api/mockData';
import StatusChip from '../../components/StatusChip';

export default function SharedRecordsPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Hồ sơ đã chia sẻ</Typography>
      <Grid container spacing={2}>
        {sharedRecords.map(s => (
          <Grid key={s.shareId} item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>Share Code: {s.shareCode}</Typography>
                  <StatusChip status={s.status} />
                </Stack>
                <Typography variant="body2">Hạn: {new Date(s.expirationDate).toLocaleString()}</Typography>
                <Typography variant="body2">Ghi chú: {s.notes || '-'}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button size="small" variant="outlined">Sao chép mã</Button>
                  <Button size="small" variant="contained">Tạo mã mới</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
