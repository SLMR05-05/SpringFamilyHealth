import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { appointments, medicalRecords, notifications, patients } from '../../api/mockData';
import StatCard from '../../components/StatCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const weekData = [
  { name: 'Mon', appts: 4, records: 2 },
  { name: 'Tue', appts: 3, records: 1 },
  { name: 'Wed', appts: 5, records: 3 },
  { name: 'Thu', appts: 2, records: 1 },
  { name: 'Fri', appts: 6, records: 4 },
  { name: 'Sat', appts: 1, records: 1 },
  { name: 'Sun', appts: 0, records: 0 }
];

export default function Dashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const todayAppts = appointments.filter(a => a.appointmentDate.startsWith(today)).length;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Tổng quan</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Bệnh nhân" value={patients.length} subtitle="Tổng số bệnh nhân" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Lịch hẹn hôm nay" value={todayAppts} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Hồ sơ mới" value={medicalRecords.length} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Thông báo mới" value={notifications.length} />
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Lịch hẹn theo tuần</Typography>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weekData} margin={{ left: -20, right: 0 }}>
                    <defs>
                      <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="appts" stroke="#1976d2" fill="url(#colorAppts)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Hồ sơ theo tuần</Typography>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="records" fill="#00a3a3" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
