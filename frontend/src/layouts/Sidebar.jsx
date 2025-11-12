import { useMemo } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import ShareIcon from '@mui/icons-material/Share';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import { NavLink } from 'react-router-dom';

const width = 260;

export default function Sidebar() {
  const menu = useMemo(() => ([
    { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/appointments', label: 'Appointments', icon: <EventIcon /> },
    { to: '/records', label: 'Medical Records', icon: <DescriptionIcon /> },
    { to: '/patients', label: 'Patients', icon: <GroupIcon /> },
    { to: '/shared', label: 'Shared Records', icon: <ShareIcon /> },
    { to: '/notifications', label: 'Notifications', icon: <NotificationsIcon /> },
    { to: '/tickets', label: 'Support Tickets', icon: <SupportAgentIcon /> },
    { to: '/access-log', label: 'Access Logs', icon: <HistoryIcon /> },
    { to: '/profile', label: 'Profile', icon: <PersonIcon /> }
  ]), []);

  return (
    <Drawer anchor="left" variant="permanent" sx={{ width, flexShrink: 0, [`& .MuiDrawer-paper`]: { width, boxSizing: 'border-box', borderRight: '1px solid', borderColor: 'divider'  } }}>
      <Box sx={{ p: 2 }}>       
        <Typography variant="overline" color="text.secondary">Navigation</Typography>
      </Box>
      <Divider />
      <List>
        {menu.map(item => (
          <ListItemButton key={item.to} component={NavLink} to={item.to} sx={{ '&.active': { bgcolor: 'action.selected' } }}>
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
