import { AppBar, Toolbar, Typography, Avatar, IconButton, Badge, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Header({ doctor, onOpenNotifications, onLogout }) {
  return (
    <AppBar position="fixed" color="inherit" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider'  }}>
      <Toolbar sx={{ display: 'flex', gap: 2, minHeight: 64 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" color="primary" fontWeight={700} noWrap>Family Health</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>Doctor Dashboard</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
          <Box sx={{ textAlign: 'right', maxWidth: { xs: 140, sm: 220 }, overflow: 'hidden' }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>{doctor.fullName}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap>{doctor.specialty} • {doctor.hospital}</Typography>
          </Box>
          <Avatar alt={doctor.fullName} src={doctor.avatarUrl} sx={{ bgcolor: 'primary.main', color: 'white' }}>
            {doctor.fullName?.charAt(0)}
          </Avatar>
          <IconButton color="primary" onClick={onOpenNotifications}>
            <Badge color="error" variant={doctor.unreadNotifications ? 'dot' : undefined}>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="primary" onClick={onLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
