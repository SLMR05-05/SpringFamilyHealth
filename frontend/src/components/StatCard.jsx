import { Card, CardContent, Typography, Box } from '@mui/material';

export default function StatCard({ title, value, subtitle, color = 'primary.main', right }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="overline" color="text.secondary">{title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="h5" sx={{ color }}>{value}</Typography>
          {right}
        </Box>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
        )}
      </CardContent>
    </Card>
  );
}
