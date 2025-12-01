# SpringFamilyHealth

Hệ thống quản lý sức khỏe gia đình với Spring Boot, React và MySQL.

## 📋 Mô tả

Ứng dụng web quản lý sức khỏe cho gia đình với các tính năng:
- Quản lý thông tin thành viên gia đình
- Theo dõi hồ sơ y tế, thuốc, vaccine
- Đặt lịch khám và quản lý bác sĩ
- Dashboard thống kê cho admin
- Hỗ trợ đa ngôn ngữ (Tiếng Việt/English)

## 🏗️ Công nghệ

**Backend:**
- Spring Boot 3.5.6 (Java 21)
- MySQL 8.0
- Hibernate JPA
- Spring Security + JWT

**Frontend:**
- React 19 + Vite 7
- Ant Design + Tailwind CSS
- React Router v6
- i18next (đa ngôn ngữ)

**DevOps:**
- Docker (all-in-one container)
- nginx (reverse proxy)

## 🚀 Quick Start với Docker

### Yêu cầu
- Docker Desktop đã cài đặt
- 8GB RAM khả dụng
- Ports 3306, 8080, 5173 phải trống

### Khởi động

```bash
# 1. Clone repository
git clone https://github.com/SLMR05-05/SpringFamilyHealth.git
cd SpringFamilyHealth

# 2. Khởi động container (all-in-one: MySQL + Backend + Frontend)
docker compose up -d --build

# 3. Chờ ~90 giây cho services khởi động, xem logs:
docker logs familyhealth-app -f

# 4. Truy cập ứng dụng
```

**Các URL:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- MySQL: localhost:3306 (root/root)

**Thời gian:**
- Build lần đầu: 5-10 phút
- Container startup: 60-90 giây

### Dừng container

```bash
docker compose down
```

### Xóa dữ liệu và khởi động lại

```bash
docker compose down -v
docker compose up -d --build
```

## 🗄️ Quản lý Database

### Kết nối MySQL từ terminal

```bash
docker exec -it familyhealth-app mysql -u root -proot FamilyHealth
```

### MySQL Workbench
- Host: `localhost`
- Port: `3306`
- Username: `root`
- Password: `root`
- Database: `FamilyHealth`

### Backup/Restore

```bash
# Backup
docker exec familyhealth-app mysqldump -u root -proot FamilyHealth > backup.sql

# Restore
docker exec -i familyhealth-app mysql -u root -proot FamilyHealth < backup.sql
```

## 🛠️ Development (không dùng Docker)

### Backend Setup

```bash
cd backend

# Cài đặt dependencies và build
./mvnw clean install

# Chạy Spring Boot (cần MySQL đang chạy)
./mvnw spring-boot:run
```

**Cấu hình MySQL:**
- Tạo database: `CREATE DATABASE FamilyHealth;`
- Update `application.yml` với MySQL credentials
- Import data từ `database/final.sql`

### Frontend Setup

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev
```

Frontend sẽ chạy tại http://localhost:5173

## 📁 Cấu trúc dự án

```
SpringFamilyHealth/
├── backend/                    # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/backend/
│   │   │   │   ├── controllers/    # REST API endpoints
│   │   │   │   ├── models/         # JPA entities
│   │   │   │   ├── repository/     # Database repositories
│   │   │   │   └── service/        # Business logic
│   │   │   └── resources/
│   │   │       ├── application.yml             # Config mặc định
│   │   │       └── application-docker.yml      # Config cho Docker
│   │   └── test/
│   └── pom.xml
├── frontend/                   # React application
│   ├── src/
│   │   ├── api/               # API client (axios)
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   │   ├── Admin/         # Admin dashboard
│   │   │   ├── auth/          # Login/Register
│   │   │   └── doctor/        # Doctor dashboard
│   │   ├── layouts/           # Layout components
│   │   ├── routes/            # React Router config
│   │   └── language/          # i18n translations
│   └── package.json
├── database/                   # SQL scripts
│   └── final.sql              # Initial data
├── docker-compose.yml         # Docker Compose config
├── Dockerfile                 # Multi-stage Docker build
├── start.sh                   # Container startup script
└── .env                       # Environment variables
```

## 🔧 Troubleshooting

### Container không start

```bash
# Xem logs chi tiết
docker logs familyhealth-app

# Restart
docker compose restart
```

### Port bị chiếm dụng

```bash
# Kiểm tra port (Windows)
netstat -ano | findstr "3306"
netstat -ano | findstr "8080"
netstat -ano | findstr "5173"

# Kill process
taskkill /F /PID <PID>
```

### MySQL không kết nối

```bash
# Test MySQL
docker exec familyhealth-app mysql -u root -proot -e "SELECT 1;"

# Xem MySQL logs
docker exec familyhealth-app tail -f /var/log/mysql/error.log
```

### Backend không start

```bash
# Test health endpoint
curl http://localhost:8080/actuator/health

# Xem Spring Boot logs
docker logs familyhealth-app | findstr "Started BackendApplication"
```

### Build lỗi

```bash
# Clean build (no cache)
docker compose build --no-cache
docker compose up -d
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
./mvnw test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📊 Container Architecture

```
┌─────────────────────────────────────┐
│  Container: familyhealth-app        │
│                                     │
│  ┌──────────────┐                  │
│  │ MySQL:3306   │ ◄─────┐          │
│  │ FamilyHealth │       │          │
│  └──────────────┘       │          │
│                         │          │
│  ┌──────────────────────┴────┐     │
│  │ Spring Boot:8080          │     │
│  │ Backend REST API          │     │
│  └───────────────────────────┘     │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ nginx:5173                   │  │
│  │ Frontend (React + Vite)      │  │
│  │ + API Proxy (/api/* → 8080) │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 🔐 Default Accounts

Sau khi import database, có sẵn các tài khoản test:

**Admin:**
- Email: `admin@example.com`
- Password: `admin`

**Doctor:**
- Email: `doctor@example.com`
- Password: `doctor`

**User:**
- Email: `kainad@gmail.com`
- Password: `testuser`

## 🧹 Cleanup

```bash
# Dừng và xóa container
docker compose down

# Xóa cả volumes (dữ liệu database)
docker compose down -v

# Xóa images
docker rmi springfamilyhealth-familyhealth-all-in-one

# Full cleanup
docker compose down -v
docker system prune -a --volumes
```

## 📝 API Documentation

API endpoints available tại `http://localhost:8080/api/*`

Xem file `backend/src/main/java/com/example/backend/controllers/` để biết chi tiết các endpoints.

## 🤝 Contributing

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License.

## 👥 Authors

- **SLMR05-05** - [GitHub](https://github.com/SLMR05-05)

## 🙏 Acknowledgments

- Spring Boot Documentation
- React Documentation
- Ant Design
- Docker Documentation