#!/bin/bash
set -e

echo "=== Starting All-in-One Container ==="

# Set MySQL directory permissions
echo "Setting MySQL permissions..."
chown -R mysql:mysql /var/lib/mysql /var/run/mysqld /var/log/mysql
chmod 755 /var/run/mysqld

# Initialize MySQL if needed
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "Initializing MySQL database..."
    mysqld --initialize-insecure --user=mysql --datadir=/var/lib/mysql
fi

# Start MySQL
echo "Starting MySQL..."
mysqld --user=mysql --datadir=/var/lib/mysql --bind-address=0.0.0.0 &

# Wait for MySQL to be ready
echo "Waiting for MySQL to start..."
for i in {1..30}; do
    if mysqladmin ping -h localhost --silent 2>/dev/null; then
        echo "MySQL is ready!"
        break
    fi
    echo "Waiting... ($i/30)"
    sleep 2
    if [ $i -eq 30 ]; then
        echo "ERROR: MySQL failed to start!"
        exit 1
    fi
done

# Configure MySQL if first time
if [ ! -f "/var/lib/mysql/.initialized" ]; then
    echo "Configuring MySQL..."
    
    # Set root password and create user for all hosts
    mysql -u root <<-EOSQL
        ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
        CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
        GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
        GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
        CREATE DATABASE IF NOT EXISTS FamilyHealth CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        FLUSH PRIVILEGES;
EOSQL

    # Import database scripts
    if [ -d "/docker-entrypoint-initdb.d" ]; then
        for f in /docker-entrypoint-initdb.d/*.sql; do
            if [ -f "$f" ]; then
                echo "Importing $f..."
                mysql -u root -proot FamilyHealth < "$f" 2>/dev/null || echo "Warning: Some SQL statements failed"
            fi
        done
    fi
    
    touch /var/lib/mysql/.initialized
    echo "MySQL configuration completed!"
fi

# Start nginx
echo "Starting nginx..."
nginx -g 'daemon off;' &

# Start Spring Boot
echo "Starting Spring Boot application..."
cd /app
exec java -jar app.jar
