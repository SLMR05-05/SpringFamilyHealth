import { Box, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { accessLogs } from '../../api/mockData';

export default function AccessLogsPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Nhật ký truy cập</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Entity</TableCell>
              <TableCell>Entity ID</TableCell>
              <TableCell>Hành động</TableCell>
              <TableCell>Thời gian</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accessLogs.map(l => (
              <TableRow key={l.logId}>
                <TableCell>{l.entityType}</TableCell>
                <TableCell>{l.entityId}</TableCell>
                <TableCell>{l.action}</TableCell>
                <TableCell>{new Date(l.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
