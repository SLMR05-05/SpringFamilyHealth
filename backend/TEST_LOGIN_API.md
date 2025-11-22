# Hướng Dẫn Test API Login - Backend

## 🚀 Chuẩn Bị

### 1. Đảm bảo Backend đang chạy
```bash
cd backend
mvn spring-boot:run
```
Kiểm tra backend đã start thành công:
- ✅ Console hiển thị: `Started BackendApplication`
- ✅ Port 8080 đang hoạt động
- ✅ Database MySQL đã kết nối

### 2. Tài khoản Admin mặc định
Khi backend start lần đầu, hệ thống tự động tạo tài khoản admin:
- **Email**: `admin@example.com`
- **Password**: `admin`
- **Role**: `ADMIN`

---

## 📝 API Endpoints

### Base URL
```
http://localhost:8080
```

### Authentication Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/auth/token` | Đăng nhập (Login) |
| POST | `/auth/introspect` | Kiểm tra token hợp lệ |
| POST | `/auth/logout` | Đăng xuất |
| POST | `/auth/refresh` | Làm mới token |

---

## 🔐 Test 1: Login (Đăng Nhập)

### Endpoint
```
POST http://localhost:8080/auth/token
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "username": "admin@example.com",
  "password": "admin"
}
```

### Response thành công (200 OK)
```json
{
  "code": 1000,
  "message": null,
  "result": {
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlzcyI6ImtoYW5nZG5tLmNvbSIsImlhdCI6MTczMjI2NzgwMCwiZXhwIjoxNzMyMjcxNDAwLCJqdGkiOiIxMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTIiLCJzY29wZSI6IlJPTEVfQURNSU4ifQ...",
    "authenticated": true
  }
}
```

### Response lỗi - Sai mật khẩu (401 Unauthorized)
```json
{
  "code": 1006,
  "message": "Unauthenticated",
  "result": null
}
```

### Response lỗi - User không tồn tại (404 Not Found)
```json
{
  "code": 1005,
  "message": "User not existed",
  "result": null
}
```

---

## 🧪 Test với cURL

### 1. Login thành công
```bash
curl -X POST http://localhost:8080/auth/token \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin@example.com\",\"password\":\"admin\"}"
```

### 2. Login với sai mật khẩu
```bash
curl -X POST http://localhost:8080/auth/token \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin@example.com\",\"password\":\"wrongpassword\"}"
```

### 3. Login với user không tồn tại
```bash
curl -X POST http://localhost:8080/auth/token \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"notexist@example.com\",\"password\":\"admin\"}"
```

---

## 🔍 Test 2: Introspect Token (Kiểm tra Token)

### Endpoint
```
POST http://localhost:8080/auth/introspect
```

### Request Body
```json
{
  "token": "YOUR_JWT_TOKEN_HERE"
}
```

### Response - Token hợp lệ
```json
{
  "code": 1000,
  "message": null,
  "result": {
    "valid": true
  }
}
```

### Response - Token không hợp lệ
```json
{
  "code": 1000,
  "message": null,
  "result": {
    "valid": false
  }
}
```

---

## 🚪 Test 3: Logout (Đăng Xuất)

### Endpoint
```
POST http://localhost:8080/auth/logout
```

### Request Body
```json
{
  "token": "YOUR_JWT_TOKEN_HERE"
}
```

### Response
```json
{
  "code": 1000,
  "message": null,
  "result": null
}
```

---

## 🔄 Test 4: Refresh Token

### Endpoint
```
POST http://localhost:8080/auth/refresh
```

### Request Body
```json
{
  "token": "YOUR_JWT_TOKEN_HERE"
}
```

### Response
```json
{
  "code": 1000,
  "message": null,
  "result": {
    "token": "NEW_JWT_TOKEN_HERE",
    "authenticated": true
  }
}
```

---

## 🛠️ Test với Postman

### Bước 1: Tạo Collection mới
1. Mở Postman
2. Tạo Collection mới: `SpringFamilyHealth - Authentication`

### Bước 2: Tạo Request Login
1. **New Request** → Đặt tên: `Login`
2. **Method**: `POST`
3. **URL**: `http://localhost:8080/auth/token`
4. **Headers**:
   - Key: `Content-Type`
   - Value: `application/json`
5. **Body** → chọn `raw` → `JSON`:
```json
{
  "username": "admin@example.com",
  "password": "admin"
}
```
6. Click **Send**

### Bước 3: Lưu Token
Sau khi login thành công, copy token từ response:
```json
{
  "result": {
    "token": "eyJhbGci..." ← Copy token này
  }
}
```

### Bước 4: Test API có authentication
1. Tạo request mới để test API cần authentication
2. **Method**: `GET`
3. **URL**: `http://localhost:8080/api/users`
4. **Headers**:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`
5. Click **Send**

---

## 🧩 Test với Thunder Client (VS Code Extension)

### Cài đặt
1. Mở VS Code
2. Extensions → Tìm "Thunder Client"
3. Install

### Sử dụng
1. Click biểu tượng Thunder Client ở sidebar
2. **New Request**
3. Method: `POST`
4. URL: `http://localhost:8080/auth/token`
5. Body → JSON:
```json
{
  "username": "admin@example.com",
  "password": "admin"
}
```
6. Click **Send**

---

## 🧪 Test với PowerShell

### 1. Login
```powershell
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    username = "admin@example.com"
    password = "admin"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/auth/token" `
    -Method Post `
    -Headers $headers `
    -Body $body

# Hiển thị token
$response.result.token
```

### 2. Lưu token vào biến
```powershell
$token = $response.result.token
Write-Host "Token: $token"
```

### 3. Test API với token
```powershell
$authHeaders = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$users = Invoke-RestMethod -Uri "http://localhost:8080/api/users" `
    -Method Get `
    -Headers $authHeaders

$users.result
```

---

## ✅ Checklist Test Login

- [ ] Login thành công với admin@example.com/admin
- [ ] Response trả về đúng format ApiResponse<AuthenticationResponse>
- [ ] Token được tạo thành công
- [ ] Login thất bại với sai password (code 1006)
- [ ] Login thất bại với user không tồn tại (code 1005)
- [ ] Introspect token hợp lệ trả về valid: true
- [ ] Introspect token không hợp lệ trả về valid: false
- [ ] Logout thành công và token bị vô hiệu hóa
- [ ] Refresh token tạo token mới thành công
- [ ] Sử dụng token để access protected API thành công

---

## 📊 Error Codes

| Code | Message | Mô tả |
|------|---------|-------|
| 1000 | Success | Thành công |
| 1005 | User not existed | User không tồn tại |
| 1006 | Unauthenticated | Xác thực thất bại |
| 1007 | Unauthorized | Không có quyền truy cập |
| 9999 | Uncategorized error | Lỗi không xác định |

---

## 🔧 Troubleshooting

### Lỗi: Connection refused
- ✅ Kiểm tra backend đã start chưa
- ✅ Kiểm tra port 8080 có bị chiếm dụng không

### Lỗi: User not existed
- ✅ Kiểm tra database đã có table user chưa
- ✅ Chạy lại backend để tự động tạo admin user

### Lỗi: Unauthenticated
- ✅ Kiểm tra password đúng chưa (default: "admin")
- ✅ Kiểm tra username đúng format email

### Token hết hạn
- ✅ Token có hiệu lực 1 giờ (3600 giây)
- ✅ Sử dụng refresh token để lấy token mới
- ✅ Hoặc login lại để lấy token mới

---

## 🎯 Next Steps

Sau khi test login thành công, bạn có thể:

1. **Test các API khác** với token đã có
2. **Tạo user mới** và test login với user đó
3. **Test role-based access** (ADMIN vs USER)
4. **Test token expiration** và refresh token
5. **Integrate với Frontend** React/Vue

---

## 📚 Tài liệu tham khảo

- Spring Security Documentation
- JWT.io - JSON Web Token Debugger
- Postman Learning Center
- Thunder Client Documentation

---

**Chúc bạn test thành công! 🎉**
