import { Chip } from '@mui/material';

const colorMap = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  CANCELLED: 'default',
  COMPLETED: 'success',
  OPEN: 'warning',
  IN_PROGRESS: 'info',
  RESOLVED: 'success',
  ACTIVE: 'success',
  INACTIVE: 'default',
  EXPIRED: 'error',
  SENT: 'success',
  FAILED: 'error'
};

export default function StatusChip({ status, ...props }) {
  const color = colorMap[status] || 'default';
  return <Chip label={status} color={color} size="small" variant="outlined" {...props} />;
}
