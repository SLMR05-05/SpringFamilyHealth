import { Box, Typography, Grid, Card, CardContent, Stack, Button } from '@mui/material';
import { tickets } from '../../api/mockData';
import StatusChip from '../../components/StatusChip';

export default function SupportTicketsPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Hỗ trợ</Typography>
      <Grid container spacing={2}>
        {tickets.map(t => (
          <Grid key={t.ticketId} item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>{t.subject}</Typography>
                  <StatusChip status={t.status} />
                </Stack>
                <Typography variant="body2">{t.description}</Typography>
                <Typography variant="caption" color="text.secondary">{new Date(t.createdAt).toLocaleString()}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button size="small" variant="outlined">Phản hồi</Button>
                  <Button size="small" variant="contained">Đánh dấu xử lý</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
