# Multi-stage build: Build frontend first
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend-build
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Main stage: Java + MySQL + nginx
FROM eclipse-temurin:21-jdk

# Install MySQL, nginx, and other dependencies
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
    mysql-server \
    nginx \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /var/run/mysqld /var/lib/mysql /var/log/mysql \
    && chown -R mysql:mysql /var/run/mysqld /var/lib/mysql /var/log/mysql \
    && chmod 755 /var/run/mysqld

# Set up application directory
WORKDIR /app

# Copy backend files and build
COPY backend/pom.xml backend/mvnw backend/mvnw.cmd ./backend/
COPY backend/.mvn ./backend/.mvn
COPY backend/src ./backend/src
WORKDIR /app/backend
RUN ./mvnw clean package -DskipTests
RUN cp target/*.jar /app/app.jar

# Copy frontend build
WORKDIR /app
COPY --from=frontend-builder /frontend-build/dist /var/www/html

# Configure nginx
RUN echo 'server {\n\
    listen 5173;\n\
    server_name localhost;\n\
    root /var/www/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    location /api/ {\n\
        proxy_pass http://localhost:8080/;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
    }\n\
}' > /etc/nginx/sites-available/default

# Copy database scripts
COPY database/*.sql /docker-entrypoint-initdb.d/

# Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose ports
EXPOSE 3306 8080 5173

# Environment variables
ENV MYSQL_ROOT_PASSWORD=root \
    MYSQL_DATABASE=FamilyHealth \
    SPRING_PROFILES_ACTIVE=docker \
    SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/FamilyHealth?useSSL=false \
    SPRING_DATASOURCE_USERNAME=root \
    SPRING_DATASOURCE_PASSWORD=root

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=90s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Start all services
CMD ["/app/start.sh"]
