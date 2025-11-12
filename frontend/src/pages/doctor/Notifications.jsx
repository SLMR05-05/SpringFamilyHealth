import { Box, Typography, Grid, Card, CardContent, Stack, Button } from '@mui/material';
import { notifications } from '../../api/mockData';
import StatusChip from '../../components/StatusChip';

export default function NotificationsPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Thông báo</Typography>
      <Grid container spacing={2}>
        {notifications.map(n => (
          <Grid key={n.notificationId} item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>{n.type}</Typography>
                  <StatusChip status={n.status} />
                </Stack>
                <Typography variant="body2">{n.content}</Typography>
                <Typography variant="caption" color="text.secondary">{new Date(n.createdAt).toLocaleString()}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button size="small" variant="outlined">Đánh dấu đã đọc</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
