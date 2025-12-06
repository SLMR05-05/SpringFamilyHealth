# Docker Deployment Guide

## 🐳 Kiến trúc Docker

Dự án sử dụng **Docker Compose** với 3 services riêng biệt:

```
┌─────────────────────────────────────────┐
│         familyhealth-network            │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────┐ │
│  │  MySQL   │  │ Backend  │  │ Front│ │
│  │  :3306   │→ │  :8080   │→ │ :80  │ │
│  └──────────┘  └──────────┘  └──────┘ │
└─────────────────────────────────────────┘
```

### Services:

1. **MySQL** (`familyhealth-mysql`)
   - Image: `mysql:8.4`
   - Port: `3306`
   - Database: `springfamilyhealth`
   - Auto-import: `structure.sql` + `test_data.sql`

2. **Backend** (`familyhealth-backend`)
   - Java 21 + Spring Boot
   - Port: `8080`
   - Health check: `/actuator/health`

3. **Frontend** (`familyhealth-frontend`)
   - React + Vite + Nginx
   - Port: `5173` (mapped to `80`)
   - Reverse proxy API → Backend

---

## 🚀 Cách sử dụng

### 1. Build và Start tất cả services

```bash
docker-compose up -d --build
```

### 2. Chỉ start (không build lại)

```bash
docker-compose up -d
```

### 3. Xem logs

```bash
# Tất cả services
docker-compose logs -f

# Chỉ backend
docker-compose logs -f backend

# Chỉ MySQL
docker-compose logs -f mysql
```

### 4. Stop services

```bash
docker-compose down
```

### 5. Stop và xóa volumes (reset database)

```bash
docker-compose down -v
```

---

## 🔧 Build riêng từng service

### Backend only:
```bash
cd backend
docker build -t familyhealth-backend .
```

### Frontend only:
```bash
cd frontend
docker build -t familyhealth-frontend .
```

---

## 🌐 Truy cập ứng dụng

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/actuator/health
- **MySQL**: localhost:3306

### Tài khoản test (sau khi import test_data.sql):

- **Admin**: `admin@familyhealth.vn` / `password123`
- **Doctor**: `bs.nguyenvanan@hospital.vn` / `password123`
- **User**: `nguyen.hung@gmail.com` / `password123`

---

## 🐛 Troubleshooting

### MySQL không start được:
```bash
docker-compose down -v
docker-compose up -d mysql
docker-compose logs -f mysql
```

### Backend không kết nối được MySQL:
```bash
# Kiểm tra MySQL đã ready
docker-compose exec mysql mysqladmin ping -h localhost -uroot -proot

# Kiểm tra network
docker network inspect springfamilyhealth_familyhealth-network
```

### Frontend không gọi được API:
```bash
# Kiểm tra nginx config
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf

# Kiểm tra backend health
curl http://localhost:8080/actuator/health
```

### Reset toàn bộ:
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

---

## 📊 Monitoring

### Check container status:
```bash
docker-compose ps
```

### Check resource usage:
```bash
docker stats
```

### Check health:
```bash
# Backend
curl http://localhost:8080/actuator/health

# MySQL
docker-compose exec mysql mysqladmin ping -h localhost -uroot -proot
```

---

## 🔐 Environment Variables

Tạo file `.env` trong root directory:

```env
JWT_SIGNER_KEY=your_secret_key_here
JWT_VALID_DURATION=3600
JWT_REFRESHABLE_DURATION=36000
```

---

## 📦 Production Deployment

Để deploy production, sửa `docker-compose.yml`:

1. Thay đổi MySQL password
2. Set `SPRING_PROFILES_ACTIVE=prod`
3. Disable `show-sql` trong application.yml
4. Thêm SSL certificate cho nginx
5. Set proper JWT secret key

---

## 🎯 Best Practices

✅ Luôn dùng `docker-compose down` trước khi `up` lại  
✅ Check logs nếu có lỗi  
✅ Backup database trước khi reset volumes  
✅ Dùng `.env` file cho sensitive data  
✅ Monitor resource usage với `docker stats`  

---

**Developed by**: SpringFamilyHealth Team  
**Last Updated**: December 4, 2025
