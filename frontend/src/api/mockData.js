// Mock data derived from test.txt schema
export const Enums = {
  AppointmentStatus: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
  TicketStatus: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
  NotificationStatus: ['SENT', 'PENDING', 'FAILED'],
  ConsentStatus: ['GRANTED', 'REVOKED']
};

export const doctor = {
  accountId: 1001,
  username: 'dr.nguyen',
  email: 'dr.nguyen@example.com',
  phoneNumber: '+84 912 345 678',
  fullName: 'BS. Nguyen Van A',
  dateOfBirth: '1980-05-12',
  isActive: true,
  isVerified: true,
  licenseNumber: 'VN-123456',
  specialty: 'Cardiology',
  hospital: 'Bach Mai Hospital',
  avatarUrl: '',
  unreadNotifications: 3
};

export const patients = [
  { memberId: 1, accountId: 2001, fullName: 'Le Thi B', dateOfBirth: '1990-02-10', gender: 'FEMALE', bloodType: 'A', height: 160, weight: 52, chronic: 'Hypertension' },
  { memberId: 2, accountId: 2002, fullName: 'Tran Van C', dateOfBirth: '1975-07-22', gender: 'MALE', bloodType: 'O', height: 170, weight: 70, chronic: 'Diabetes' },
  { memberId: 3, accountId: 2003, fullName: 'Pham D', dateOfBirth: '2002-12-05', gender: 'OTHER', bloodType: 'B', height: 165, weight: 60 }
];

export const appointments = [
  { appointmentId: 5001, accountId: 2001, doctorAccountId: doctor.accountId, memberId: 1, appointmentDate: '2025-11-12T09:00:00', status: 'PENDING', notes: 'Follow-up' },
  { appointmentId: 5002, accountId: 2002, doctorAccountId: doctor.accountId, memberId: 2, appointmentDate: '2025-11-12T10:30:00', status: 'CONFIRMED', notes: 'Blood test results' },
  { appointmentId: 5003, accountId: 2003, doctorAccountId: doctor.accountId, memberId: 3, appointmentDate: '2025-11-13T08:30:00', status: 'COMPLETED', notes: 'Initial check' }
];

export const medicalRecords = [
  { recordId: 7001, memberId: 1, doctorAccountId: doctor.accountId, visitDate: '2025-11-01', diagnosis: 'HTN stage 1', prescription: 'Amlodipine 5mg', notes: 'Monitor BP', createdAt: '2025-11-01T10:00:00' },
  { recordId: 7002, memberId: 2, doctorAccountId: doctor.accountId, visitDate: '2025-10-24', diagnosis: 'Type 2 DM', prescription: 'Metformin 500mg', notes: 'Diet advice', createdAt: '2025-10-24T11:30:00' }
];

export const sharedRecords = [
  { shareId: 8001, accountId: 2001, doctorAccountId: doctor.accountId, recordId: 7001, shareCode: 'SHR-ABC123', expirationDate: '2025-12-31T23:59:59', notes: 'For referral', status: 'ACTIVE', createdAt: '2025-11-02T09:00:00' }
];

export const notifications = [
  { notificationId: 9001, accountId: doctor.accountId, type: 'PUSH', content: 'New appointment booked at 09:00', status: 'SENT', createdAt: '2025-11-11T18:00:00' },
  { notificationId: 9002, accountId: doctor.accountId, type: 'EMAIL', content: 'Weekly summary is ready', status: 'SENT', createdAt: '2025-11-10T08:00:00' },
  { notificationId: 9003, accountId: doctor.accountId, type: 'PUSH', content: 'Record shared by patient', status: 'PENDING', createdAt: '2025-11-09T14:30:00' }
];

export const tickets = [
  { ticketId: 6001, accountId: doctor.accountId, subject: 'Cannot access shared record', description: 'Link expired', status: 'OPEN', createdAt: '2025-11-05T12:00:00' }
];

export const accessLogs = [
  { logId: 3001, accountId: doctor.accountId, entityType: 'MedicalRecord', entityId: 7001, action: 'VIEW', timestamp: '2025-11-02T10:00:00' },
  { logId: 3002, accountId: doctor.accountId, entityType: 'SharedRecord', entityId: 8001, action: 'CREATE', timestamp: '2025-11-02T09:02:00' }
];

export function getPatientById(id) { return patients.find(p => p.memberId === id); }
