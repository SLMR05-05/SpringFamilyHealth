# Frontend API Configuration

## Tổng quan

Frontend đã được cấu hình để tích hợp với backend REST API sử dụng JWT authentication.

## Cấu trúc API

Tất cả API services nằm trong thư mục `src/api/`:

### Authentication API (`authApi.js`)
```javascript
import { authApi } from './api';

// Đăng nhập
await authApi.login(email, password);

// Kiểm tra token
await authApi.introspect(token);

// Đăng xuất
await authApi.logout(token);

// Refresh token
await authApi.refreshToken(token);
```

### Resource APIs
Các API sau đây có cùng interface:

- `userApi` - Quản lý users
- `memberApi` - Quản lý members
- `familyApi` - Quản lý families
- `doctorApi` - Quản lý doctors
- `adminApi` - Quản lý admins
- `healthRecordApi` - Quản lý health records
- `medicationApi` - Quản lý medications
- `inviteCodeApi` - Quản lý invite codes
- `prescriptionApi` - Quản lý prescriptions
- `prescriptionMedicationApi` - Quản lý prescription medications
- `vaccinationApi` - Quản lý vaccinations
- `visitHistoryApi` - Quản lý visit histories

**Interface chung:**
```javascript
import { userApi } from './api';

// Lấy tất cả với pagination
const users = await userApi.getAll(page, size);

// Lấy theo ID
const user = await userApi.getById(id);

// Tạo mới
const newUser = await userApi.create(data);

// Cập nhật
const updatedUser = await userApi.update(id, data);

// Xóa
await userApi.remove(id);
```

## Axios Configuration

### Base URL
Cấu hình trong file `.env`:
```
VITE_API_URL=http://localhost:8080/api
```

### JWT Token
Token tự động được thêm vào header của mỗi request:
```javascript
Authorization: Bearer {token}
```

### Response Interceptor
Backend trả về format:
```json
{
  "code": 1000,
  "message": "Success",
  "result": { ... }
}
```

Response interceptor tự động extract `result` field để đơn giản hóa việc xử lý response.

### Error Handling
- **401 Unauthorized**: Tự động xóa token và redirect về `/login`
- Tất cả error messages được extract từ `ApiResponse.message`

## Sử dụng trong Components

### Example: Login
```javascript
import { useAuth } from '../context/AuthProvider';

function LoginForm() {
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };
}
```

### Example: Fetch Users
```javascript
import { userApi } from '../api';
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAll(0, 10);
        setUsers(response.data.content); // Page content
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    
    fetchUsers();
  }, []);
}
```

### Example: Create User
```javascript
import { userApi } from '../api';

async function createUser() {
  try {
    const newUser = await userApi.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '0123456789',
      role: 'user',
      passwordHash: 'hashedpassword'
    });
    console.log('User created:', newUser.data);
  } catch (error) {
    console.error('Failed to create user:', error.message);
  }
}
```

## Pagination Response Format

Backend trả về Spring Data Page format:
```json
{
  "content": [...],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10
  },
  "totalPages": 5,
  "totalElements": 50,
  "first": true,
  "last": false
}
```

## Authentication Flow

1. User đăng nhập qua `authApi.login()`
2. Backend trả về JWT token
3. Token được lưu trong localStorage
4. AuthProvider decode token để lấy user info
5. Mọi request tiếp theo tự động gửi token trong header
6. Khi 401, tự động logout và redirect về login

## Error Codes

Backend sử dụng các error codes sau (từ ErrorCode.java):

| Code | Message | HTTP Status |
|------|---------|-------------|
| 1000 | Success | 200 |
| 1001 | Invalid key | 401 |
| 1002 | User existed | 400 |
| 1003 | Username invalid | 400 |
| 1004 | Password invalid | 400 |
| 1005 | User not existed | 404 |
| 1006 | Unauthenticated | 401 |
| 1007 | Unauthorized | 403 |
| 1008 | Invalid DOB | 400 |
| 9999 | Uncategorized exception | 500 |

## Testing APIs

Tham khảo file `backend/TEST_LOGIN_API.md` để biết cách test các API endpoints.
