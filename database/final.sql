-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: springfamilyhealth
-- ------------------------------------------------------
-- Server version	8.4.7

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` int NOT NULL,
  PRIMARY KEY (`admin_id`),
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `appointment_date` datetime NOT NULL COMMENT 'Ngày giờ hẹn',
  `status` varchar(50) DEFAULT 'SCHEDULED' COMMENT 'SCHEDULED, COMPLETED, CANCELLED, NO_SHOW, CONFIRMED',
  `reason` text COMMENT 'Lý do khám',
  `notes` text COMMENT 'Ghi chú',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`appointment_id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `appointment_ibfk_1` (`member_id`),
  CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Quản lý lịch hẹn khám bệnh';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (1,5,2,'2025-11-15 09:00:00','COMPLETED','Khám định kỳ','Đã khám xong, kê đơn thuốc','2025-11-10 10:00:00','2025-12-04 02:15:34'),(2,6,2,'2025-11-20 10:30:00','COMPLETED','Đau đầu, chóng mặt','Cần làm xét nghiệm máu','2025-11-18 14:00:00','2025-12-04 02:15:34'),(3,9,3,'2025-11-10 14:00:00','COMPLETED','Đau bụng','Đã khám, kê đơn','2025-11-08 09:00:00','2025-12-04 02:15:34'),(4,7,2,'2025-12-05 09:00:00','CONFIRMED','Tái khám viêm mũi dị ứng','Nhớ mang theo kết quả xét nghiệm','2025-11-25 15:00:00','2025-12-04 02:15:34'),(5,12,2,'2025-12-08 10:00:00','CONFIRMED','Khám kiểm soát đái tháo đường','Mang theo sổ theo dõi đường huyết','2025-11-28 11:00:00','2025-12-04 02:15:34'),(6,11,3,'2025-12-10 14:30:00','SCHEDULED','Tái khám hen phế quản',NULL,'2025-11-30 09:00:00','2025-12-04 02:15:34'),(7,13,2,'2025-12-12 09:30:00','SCHEDULED','Tái khám viêm khớp',NULL,'2025-12-01 10:00:00','2025-12-04 02:15:34'),(8,10,3,'2025-12-15 11:00:00','SCHEDULED','Tái khám rối loạn lipid máu','Nhớ nhịn ăn sáng để xét nghiệm','2025-12-02 14:00:00','2025-12-04 02:15:34'),(9,8,2,'2025-11-30 15:00:00','CANCELLED','Khám định kỳ','Bệnh nhân hủy do bận việc','2025-11-25 10:00:00','2025-12-04 02:15:34'),(23,5,2,'2025-12-04 21:24:00','COMPLETED','Tái khám','nothing\n','2025-12-04 14:24:47','2025-12-04 14:25:07');
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor` (
  `doctor_id` int NOT NULL,
  `certificate_number` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL COMMENT 'Doctor contact phone number',
  `address` varchar(500) DEFAULT NULL COMMENT 'Doctor clinic or practice address',
  `specialization` varchar(255) DEFAULT NULL COMMENT 'Medical specialization (e.g., Cardiology, Pediatrics)',
  `clinic_name` varchar(255) DEFAULT NULL COMMENT 'Name of clinic or hospital',
  `years_of_experience` int DEFAULT NULL COMMENT 'Years of medical practice experience',
  `education` text COMMENT 'Educational background and degrees',
  `languages_spoken` varchar(255) DEFAULT NULL COMMENT 'Languages the doctor can communicate in',
  `consultation_fee` decimal(38,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `family_id` int DEFAULT NULL,
  PRIMARY KEY (`doctor_id`),
  UNIQUE KEY `certificate_number` (`certificate_number`),
  KEY `idx_doctor_specialization` (`specialization`),
  KEY `idx_doctor_phone` (`phone`),
  CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (2,'BS-2019-001234','0912345678','123 Nguyễn Trãi, Thanh Xuân, Hà Nội','Nội khoa tổng quát','Bệnh viện Đa khoa Trung ương',15,'Bác sĩ Y khoa - ĐH Y Hà Nội (2009), Thạc sĩ Nội khoa - ĐH Y dược TP.HCM (2014)','Tiếng Việt, English',300000.00,'2025-12-04 02:15:34','2025-12-04 02:15:34',NULL),(3,'BS-2020-005678','0923456789','456 Lê Lợi, Quận 1, TP.HCM','Nhi khoa','Phòng khám Nhi đồng Sài Gòn',10,'Bác sĩ Y khoa - ĐH Y dược TP.HCM (2014), Chuyên khoa I Nhi - BV Nhi đồng 1 (2018)','Tiếng Việt, English',250000.00,'2025-12-04 02:15:34','2025-12-04 02:15:34',NULL),(4,'BS-2018-009876','0934567890','789 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội','Tim mạch','Bệnh viện Tim Hà Nội',18,'Bác sĩ Y khoa - ĐH Y Hà Nội (2006), Tiến sĩ Tim mạch - Viện Tim mạch Quốc gia (2012)','Tiếng Việt, English, 中文',500000.00,'2025-12-04 02:15:34','2025-12-04 02:15:34',NULL);
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_approval`
--

DROP TABLE IF EXISTS `doctor_approval`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_approval` (
  `approval_id` int NOT NULL AUTO_INCREMENT,
  `rejection_reason` text,
  `reviewed_at` datetime(6) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  `doctor_id` int NOT NULL,
  `reviewed_by` int DEFAULT NULL,
  PRIMARY KEY (`approval_id`),
  KEY `FKcnucc9xwigkxo67mcrr24cyjm` (`doctor_id`),
  KEY `FKgtaof3jpmi2na3rom9rdsir43` (`reviewed_by`),
  CONSTRAINT `FKcnucc9xwigkxo67mcrr24cyjm` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`),
  CONSTRAINT `FKgtaof3jpmi2na3rom9rdsir43` FOREIGN KEY (`reviewed_by`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_approval`
--

LOCK TABLES `doctor_approval` WRITE;
/*!40000 ALTER TABLE `doctor_approval` DISABLE KEYS */;
/*!40000 ALTER TABLE `doctor_approval` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_request`
--

DROP TABLE IF EXISTS `doctor_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_request` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `family_id` int DEFAULT NULL,
  `request_type` enum('CONSULTATION','FAMILY_DOCTOR','APPOINTMENT','QUESTION') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FAMILY_DOCTOR',
  `status` enum('PENDING','APPROVED','REJECTED','CANCELLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `doctor_response` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `responded_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `idx_doctor_requests` (`doctor_id`,`status`),
  KEY `idx_user_requests` (`user_id`,`status`),
  KEY `idx_family_requests` (`family_id`),
  CONSTRAINT `fk_doctor_request_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_doctor_request_family` FOREIGN KEY (`family_id`) REFERENCES `family` (`family_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_doctor_request_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_request`
--

LOCK TABLES `doctor_request` WRITE;
/*!40000 ALTER TABLE `doctor_request` DISABLE KEYS */;
INSERT INTO `doctor_request` VALUES (1,5,2,1,'FAMILY_DOCTOR','APPROVED','Gia đình chúng tôi muốn đăng ký bác sĩ An làm bác sĩ gia đình. Rất mong được hỗ trợ!','Cảm ơn gia đình đã tin tưởng. Tôi rất vui được đồng hành cùng gia đình!','2025-02-05 10:00:00','2025-12-04 02:15:34','2025-02-05 14:00:00'),(2,9,3,2,'FAMILY_DOCTOR','APPROVED','Xin chào bác sĩ Bình, gia đình tôi muốn nhờ bác sĩ chăm sóc sức khỏe lâu dài.','Tôi rất vinh dự được phục vụ gia đình. Hãy liên hệ nếu cần hỗ trợ!','2025-02-12 11:00:00','2025-12-04 02:15:34','2025-02-12 15:30:00'),(3,12,4,3,'CONSULTATION','PENDING','Bác sĩ ơi, bố tôi bị đái tháo đường, có thể tư vấn thêm về chế độ ăn không ạ?',NULL,'2025-12-01 09:00:00','2025-12-04 02:15:34',NULL);
/*!40000 ALTER TABLE `doctor_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `family`
--

DROP TABLE IF EXISTS `family`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `family` (
  `family_id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`family_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `family_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `family`
--

LOCK TABLES `family` WRITE;
/*!40000 ALTER TABLE `family` DISABLE KEYS */;
INSERT INTO `family` VALUES (1,2,'45 Nguyễn Chí Thanh, Đống Đa, Hà Nội','0945678901'),(2,3,'78 Võ Văn Tần, Quận 3, TP.HCM','0989012345'),(3,2,'12 Hoàng Quốc Việt, Cầu Giấy, Hà Nội','0912345679'),(6,NULL,'hồ gươm',NULL);
/*!40000 ALTER TABLE `family` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `health_record`
--

DROP TABLE IF EXISTS `health_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `health_record` (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int DEFAULT NULL,
  `blood_type` varchar(255) DEFAULT NULL COMMENT 'ENUM: A+, A-, B+, B-, AB+, AB-, O+,  O-',
  `allergies` text,
  `chronic_conditions` text,
  PRIMARY KEY (`record_id`),
  KEY `health_record_ibfk_1` (`member_id`),
  CONSTRAINT `health_record_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health_record`
--

LOCK TABLES `health_record` WRITE;
/*!40000 ALTER TABLE `health_record` DISABLE KEYS */;
INSERT INTO `health_record` VALUES (1,5,'O+','Không','Tăng huyết áp nhẹ'),(2,6,'A+','Thuốc kháng sinh Penicillin','Không'),(3,7,'O+','Bụi, phấn hoa','Viêm mũi dị ứng'),(4,8,'A+','Không','Không'),(5,9,'B+','Hải sản','Không'),(6,10,'AB+','Không','Rối loạn lipid máu'),(7,11,'B+','Sữa bò','Hen phế quản nhẹ'),(8,12,'A+','Không','Đái tháo đường type 2, Cao huyết áp'),(9,13,'O+','Aspirin','Viêm khớp'),(10,14,'A+','Không','Không'),(11,15,'O+','Phấn hoa','Không'),(12,20,'O','Thuốc lá','Không có');
/*!40000 ALTER TABLE `health_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invalidated_token`
--

DROP TABLE IF EXISTS `invalidated_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invalidated_token` (
  `id` varchar(255) NOT NULL,
  `expiry_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invalidated_token`
--

LOCK TABLES `invalidated_token` WRITE;
/*!40000 ALTER TABLE `invalidated_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `invalidated_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invite_code`
--

DROP TABLE IF EXISTS `invite_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invite_code` (
  `invite_id` int NOT NULL AUTO_INCREMENT,
  `family_id` int DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `expired_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`invite_id`),
  UNIQUE KEY `code` (`code`),
  KEY `family_id` (`family_id`),
  CONSTRAINT `invite_code_ibfk_1` FOREIGN KEY (`family_id`) REFERENCES `family` (`family_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invite_code`
--

LOCK TABLES `invite_code` WRITE;
/*!40000 ALTER TABLE `invite_code` DISABLE KEYS */;
INSERT INTO `invite_code` VALUES (1,1,'FAM2025A1','2025-02-01 08:30:00','2026-02-01 08:30:00'),(2,2,'FAM2025B2','2025-02-10 08:00:00','2026-02-10 08:00:00'),(3,3,'FAM2025C3','2025-02-15 08:00:00','2026-02-15 08:00:00'),(6,6,'FAM-7AD6DDC2','2025-12-04 04:42:01','2026-01-03 04:42:01');
/*!40000 ALTER TABLE `invite_code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medication`
--

DROP TABLE IF EXISTS `medication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medication` (
  `medication_id` int NOT NULL AUTO_INCREMENT,
  `medication_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`medication_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medication`
--

LOCK TABLES `medication` WRITE;
/*!40000 ALTER TABLE `medication` DISABLE KEYS */;
INSERT INTO `medication` VALUES (1,'Paracetamol 500mg'),(2,'Amoxicillin 500mg'),(3,'Ibuprofen 400mg'),(4,'Metformin 500mg'),(5,'Amlodipine 5mg'),(6,'Losartan 50mg'),(7,'Vitamin D3 1000IU'),(8,'Cetirizine 10mg'),(9,'Omeprazole 20mg'),(10,'Salbutamol Inhaler');
/*!40000 ALTER TABLE `medication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `member_id` int NOT NULL,
  `family_id` int DEFAULT NULL,
  `age` int DEFAULT NULL,
  `day_of_birth` date DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL COMMENT 'ENUM: MALE, FEMALE, OTHER',
  `weight` float DEFAULT NULL,
  `height` float DEFAULT NULL,
  `relationship` varchar(255) DEFAULT NULL,
  `role_in_family` varchar(255) DEFAULT 'MEMBER' COMMENT 'HEAD | MEMBER',
  `phone` varchar(255) DEFAULT NULL COMMENT 'Số điện thoại member (nếu khác user)',
  `email` varchar(255) DEFAULT NULL COMMENT 'Email member (nếu khác user)',
  `address` text COMMENT 'Địa chỉ cụ thể của member',
  PRIMARY KEY (`member_id`),
  KEY `family_id` (`family_id`),
  CONSTRAINT `member_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `member_ibfk_2` FOREIGN KEY (`family_id`) REFERENCES `family` (`family_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (5,1,45,'1980-05-15','Nam',72.5,170,NULL,'HEAD','0945678901','nguyen.hung@gmail.com','45 Nguyễn Chí Thanh, Đống Đa, Hà Nội'),(6,1,42,'1983-08-20','Nữ',58,162,'Vợ','MEMBER','0956789012','pham.lan@gmail.com','45 Nguyễn Chí Thanh, Đống Đa, Hà Nội'),(7,1,18,'2007-03-12','Nữ',52,160,'Con gái','MEMBER','0967890123','nguyen.minhanh@gmail.com','45 Nguyễn Chí Thanh, Đống Đa, Hà Nội'),(8,1,15,'2010-11-28','Nam',55,165,'Con trai','MEMBER','0978901234','nguyen.nam@gmail.com','45 Nguyễn Chí Thanh, Đống Đa, Hà Nội'),(9,2,38,'1987-02-10','Nam',75,175,NULL,'HEAD','0989012345','tran.tuan@gmail.com','78 Võ Văn Tần, Quận 3, TP.HCM'),(10,2,35,'1990-06-25','Nữ',56,158,'Vợ','MEMBER','0990123456','le.ha@gmail.com','78 Võ Văn Tần, Quận 3, TP.HCM'),(11,2,8,'2017-09-15','Nữ',28,130,'Con gái','MEMBER','0901234568','tran.ngoc@gmail.com','78 Võ Văn Tần, Quận 3, TP.HCM'),(12,3,52,'1973-12-05','Nam',70,168,NULL,'HEAD','0912345679','le.duc@gmail.com','12 Hoàng Quốc Việt, Cầu Giấy, Hà Nội'),(13,3,48,'1977-04-18','Nữ',60,160,'Vợ','MEMBER','0923456780','vo.mai@gmail.com','12 Hoàng Quốc Việt, Cầu Giấy, Hà Nội'),(14,3,22,'2003-07-22','Nam',68,172,'Con trai','MEMBER','0934567891','le.tung@gmail.com','12 Hoàng Quốc Việt, Cầu Giấy, Hà Nội'),(15,3,19,'2006-01-30','Nữ',54,165,'Con gái','MEMBER','0945678902','le.phuonganh@gmail.com','12 Hoàng Quốc Việt, Cầu Giấy, Hà Nội'),(20,6,NULL,'1998-12-29',NULL,76,170,NULL,'HEAD','0909222333','testuser@example.com',NULL);
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) DEFAULT 'INFO' COMMENT 'INFO, WARNING, SUCCESS, ERROR',
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Thông báo cho người dùng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,5,'Lịch khám sắp tới','Bạn có lịch khám với BS. Nguyễn Văn An vào ngày 08/12/2025 lúc 10:00. Nhớ mang theo sổ theo dõi đường huyết.','INFO',0,'2025-12-03 08:00:00'),(2,6,'Kết quả xét nghiệm','Kết quả xét nghiệm máu của bạn đã có. Vui lòng liên hệ phòng khám để được tư vấn.','WARNING',0,'2025-11-28 14:00:00'),(3,7,'Nhắc nhở tái khám','Lịch tái khám viêm mũi dị ứng vào ngày 05/12/2025 lúc 09:00. Nhớ mang theo kết quả xét nghiệm.','INFO',0,'2025-12-02 10:00:00'),(4,9,'Đơn thuốc mới','Bác sĩ đã kê đơn thuốc mới cho bạn. Vui lòng xem chi tiết trong mục Đơn thuốc.','SUCCESS',1,'2025-11-10 15:00:00'),(5,10,'Lịch khám sắp tới','Bạn có lịch tái khám rối loạn lipid máu vào 15/12/2025 lúc 11:00. Nhớ nhịn ăn sáng.','INFO',0,'2025-12-03 09:00:00'),(6,11,'Nhắc nhở tái khám','Lịch tái khám hen phế quản vào 10/12/2025 lúc 14:30.','INFO',0,'2025-12-04 08:00:00'),(7,12,'Nhắc nhở uống thuốc','Đừng quên uống thuốc Metformin sau bữa ăn sáng và tối.','WARNING',1,'2025-12-04 07:00:00'),(8,13,'Lịch khám sắp tới','Bạn có lịch tái khám viêm khớp vào 12/12/2025 lúc 09:30.','INFO',0,'2025-12-03 11:00:00'),(9,15,'Chúc mừng','Bạn đã hoàn thành đầy đủ mũi tiêm vắc xin COVID-19. Sức khỏe là vàng!','SUCCESS',1,'2025-11-20 16:00:00');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescription`
--

DROP TABLE IF EXISTS `prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescription` (
  `prescription_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int DEFAULT NULL,
  `appointment_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `note` text,
  `status` varchar(255) DEFAULT NULL,
  `prescribed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`prescription_id`),
  KEY `visit_id` (`visit_id`),
  KEY `prescription_ibfk_1` (`member_id`),
  KEY `prescription_appointment_fk` (`appointment_id`),
  KEY `prescription_doctor_fk` (`doctor_id`),
  CONSTRAINT `prescription_appointment_fk` FOREIGN KEY (`appointment_id`) REFERENCES `appointment` (`appointment_id`),
  CONSTRAINT `prescription_doctor_fk` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`),
  CONSTRAINT `prescription_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `prescription_ibfk_2` FOREIGN KEY (`visit_id`) REFERENCES `visit_history` (`visit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription`
--

LOCK TABLES `prescription` WRITE;
/*!40000 ALTER TABLE `prescription` DISABLE KEYS */;
INSERT INTO `prescription` VALUES (1,5,1,2,1,'Uống thuốc hạ huyết áp đều đặn, kiểm soát chế độ ăn ít muối','ACTIVE','2025-11-15 09:30:00'),(2,6,2,2,2,'Uống thuốc bổ sung sắt, ăn nhiều thực phẩm giàu sắt','ACTIVE','2025-11-20 11:00:00'),(3,7,NULL,2,3,'Uống thuốc kháng histamin khi có triệu chứng','ACTIVE','2025-11-25 10:00:00'),(4,9,3,3,5,'Uống thuốc kháng acid, ăn đúng giờ','COMPLETED','2025-11-10 14:30:00'),(5,11,NULL,3,7,'Sử dụng bình xịt khi khó thở','ACTIVE','2025-11-22 15:00:00'),(6,12,NULL,2,8,'Uống thuốc hạ đường huyết, kiểm soát chế độ ăn','ACTIVE','2025-11-05 10:00:00'),(7,13,NULL,2,9,'Uống thuốc giảm đau, nghỉ ngơi','ACTIVE','2025-11-12 11:00:00'),(8,15,NULL,2,11,'Uống thuốc giảm đau họng, súc miệng nước muối','COMPLETED','2025-11-20 15:00:00');
/*!40000 ALTER TABLE `prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescription_medication`
--

DROP TABLE IF EXISTS `prescription_medication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescription_medication` (
  `prescription_id` int NOT NULL,
  `medication_id` int NOT NULL,
  `dosage` varchar(255) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`prescription_id`,`medication_id`),
  KEY `medication_id` (`medication_id`),
  CONSTRAINT `prescription_medication_ibfk_1` FOREIGN KEY (`prescription_id`) REFERENCES `prescription` (`prescription_id`),
  CONSTRAINT `prescription_medication_ibfk_2` FOREIGN KEY (`medication_id`) REFERENCES `medication` (`medication_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription_medication`
--

LOCK TABLES `prescription_medication` WRITE;
/*!40000 ALTER TABLE `prescription_medication` DISABLE KEYS */;
INSERT INTO `prescription_medication` VALUES (1,6,'1 viên/ngày','30 ngày'),(1,7,'1 viên/ngày','30 ngày'),(2,7,'2 viên/ngày','60 ngày'),(3,8,'1 viên/ngày khi có triệu chứng','30 ngày'),(4,1,'1 viên khi đau','7 ngày'),(4,9,'1 viên/ngày trước ăn sáng','14 ngày'),(5,10,'2 nhát khi khó thở','30 ngày'),(6,4,'1 viên 2 lần/ngày sau ăn','30 ngày'),(6,5,'1 viên/ngày','30 ngày'),(7,3,'1 viên 2 lần/ngày sau ăn','14 ngày'),(8,1,'1 viên khi đau/sốt','5 ngày'),(8,2,'1 viên 3 lần/ngày','7 ngày');
/*!40000 ALTER TABLE `prescription_medication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) DEFAULT NULL COMMENT 'ENUM: ADMIN, DOCTOR, USER',
  `password_hash` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `locked` tinyint(1) DEFAULT '0' COMMENT 'Trạng thái khóa tài khoản: TRUE = Khóa, FALSE = Kích hoạt',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo tài khoản',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật cuối',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'ADMIN','$2a$10$/9ndV4/mhQ29651kLLmzT.53og4fVavQLhrNAuVVqpq6/nBIJUtr6','Quản trị viên','0909009009','admin@familyhealth.vn',0,'2025-01-01 08:00:00','2025-12-04 09:47:59'),(2,'DOCTOR','$2a$10$JnAYM6n.BoviLNTwevZIb.7UDiw4gG8E57/yw5vEjqcIOrTAtYzvW','BS. Nguyễn Văn An','0937643748','bs.nguyenvanan@hospital.vn',0,'2025-01-05 09:00:00','2025-12-04 09:40:23'),(3,'DOCTOR','$2a$10$JnAYM6n.BoviLNTwevZIb.7UDiw4gG8E57/yw5vEjqcIOrTAtYzvW','BS. Trần Thị Bình','0923456789','bs.tranthibinh@clinic.vn',0,'2025-01-06 10:00:00','2025-12-04 02:42:05'),(4,'DOCTOR','$2a$10$JnAYM6n.BoviLNTwevZIb.7UDiw4gG8E57/yw5vEjqcIOrTAtYzvW','BS. Lê Hoàng Cường','0934567890','bs.lehoangcuong@hospital.vn',0,'2025-01-07 11:00:00','2025-12-04 02:42:11'),(5,'USER','$2a$10$jRdOWuvwhyZxKwsN6zLWgugWtEFJed9/LEpXNHloIca/FFQYF/ATy','Nguyễn Văn Hùng','0937643748','nguyen.hung@gmail.com',0,'2025-02-01 08:30:00','2025-12-04 09:48:17'),(6,'USER','$2a$10$jRdOWuvwhyZxKwsN6zLWgugWtEFJed9/LEpXNHloIca/FFQYF/ATy','Phạm Thị Lan','0956789012','pham.lan@gmail.com',0,'2025-02-02 09:00:00','2025-12-04 02:43:41'),(7,'USER','$2a$10$jRdOWuvwhyZxKwsN6zLWgugWtEFJed9/LEpXNHloIca/FFQYF/ATy','Nguyễn Minh Anh','0967890123','nguyen.minhanh@gmail.com',0,'2025-02-03 10:00:00','2025-12-04 02:43:47'),(8,'USER','$2a$10$jRdOWuvwhyZxKwsN6zLWgugWtEFJed9/LEpXNHloIca/FFQYF/ATy','Nguyễn Hoàng Nam','0978901234','nguyen.nam@gmail.com',0,'2025-02-04 11:00:00','2025-12-04 02:43:51'),(9,'USER','$2a$10$jRdOWuvwhyZxKwsN6zLWgugWtEFJed9/LEpXNHloIca/FFQYF/ATy','Trần Quốc Tuấn','0989012345','tran.tuan@gmail.com',0,'2025-02-10 08:00:00','2025-12-04 02:43:55'),(10,'USER','$2a$10$jRdOWuvwhyZxKwsN6zLWgugWtEFJed9/LEpXNHloIca/FFQYF/ATy','Lê Thu Hà','0990123456','le.ha@gmail.com',0,'2025-02-11 09:00:00','2025-12-04 02:44:00'),(11,'USER','$2a$10$jRdOWuvwhyZxKwsN6zLWgugWtEFJed9/LEpXNHloIca/FFQYF/ATy','Trần Bảo Ngọc','0901234568','tran.ngoc@gmail.com',0,'2025-02-12 10:00:00','2025-12-04 02:44:05'),(12,'USER','$2a$10$jRdOWuvwhyZxKwsN6zLWgugWtEFJed9/LEpXNHloIca/FFQYF/ATy','Lê Văn Đức','0912345679','le.duc@gmail.com',0,'2025-02-15 08:00:00','2025-12-04 02:44:13'),(13,'USER','$2a$10$jRdOWuvwhyZxKwsN6zLWgugWtEFJed9/LEpXNHloIca/FFQYF/ATy','Võ Thị Mai','0923456780','vo.mai@gmail.com',0,'2025-02-16 09:00:00','2025-12-04 02:44:16'),(14,'USER','$2a$10$jRdOWuvwhyZxKwsN6zLWgugWtEFJed9/LEpXNHloIca/FFQYF/ATy','Lê Thanh Tùng','0934567891','le.tung@gmail.com',0,'2025-02-17 10:00:00','2025-12-04 02:44:19'),(15,'USER','$2a$10$jRdOWuvwhyZxKwsN6zLWgugWtEFJed9/LEpXNHloIca/FFQYF/ATy','Lê Phương Anh','0945678902','le.phuonganh@gmail.com',0,'2025-02-18 11:00:00','2025-12-04 02:44:21'),(16,'ADMIN','$2a$10$jRdOWuvwhyZxKwsN6zLWgugWtEFJed9/LEpXNHloIca/FFQYF/ATy','Administrator','0000000000','admin@example.com',0,'2025-12-04 09:19:53','2025-12-04 02:44:24'),(17,'ADMIN','$2a$10$/9ndV4/mhQ29651kLLmzT.53og4fVavQLhrNAuVVqpq6/nBIJUtr6','Quản trị viên','0909222333','adminnew@example.com',0,'2025-12-04 09:24:16','2025-12-04 09:24:16'),(20,'user','$2a$10$f5xbVXae/m67xnbNMj5KVOSBKaEl8GA3oHcWAjEHmjRTdfg.6EWzi','Nguyễn Văn Test','0909222333','testuser@example.com',0,'2025-12-04 11:42:00','2025-12-04 11:42:00');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vaccination`
--

DROP TABLE IF EXISTS `vaccination`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vaccination` (
  `vaccine_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `vaccine_name` varchar(255) DEFAULT NULL,
  `date_given` date DEFAULT NULL,
  `next_dose` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vaccine_id`),
  KEY `vaccination_ibfk_1` (`member_id`),
  KEY `FKdnel57vpin3h1l3jcqismsenc` (`doctor_id`),
  CONSTRAINT `FKdnel57vpin3h1l3jcqismsenc` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`),
  CONSTRAINT `vaccination_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vaccination`
--

LOCK TABLES `vaccination` WRITE;
/*!40000 ALTER TABLE `vaccination` DISABLE KEYS */;
INSERT INTO `vaccination` VALUES (1,7,2,'Vắc xin HPV','2024-06-15','2025-06-15','Bệnh viện Đa khoa Trung ương','Mũi 2/3','2024-06-15 10:00:00','2025-12-04 02:15:34'),(2,8,2,'Vắc xin Cúm mùa 2024-2025','2024-10-01','2025-10-01','Bệnh viện Đa khoa Trung ương','Tiêm hàng năm','2024-10-01 14:00:00','2025-12-04 02:15:34'),(3,11,3,'Vắc xin Viêm gan B','2024-09-10','2025-03-10','Phòng khám Nhi đồng Sài Gòn','Mũi 2/3','2024-09-10 09:00:00','2025-12-04 02:15:34'),(4,15,2,'Vắc xin COVID-19 (mũi bổ sung)','2024-11-20',NULL,'Trạm y tế phường','Hoàn thành','2024-11-20 15:00:00','2025-12-04 02:15:34'),(5,10,3,'Vắc xin Cúm mùa 2024-2025','2024-10-15','2025-10-15','Phòng khám Nhi đồng Sài Gòn','Tiêm hàng năm','2024-10-15 11:00:00','2025-12-04 02:15:34'),(6,5,2,'COVID_19','2025-12-04','2025-12-26','Hospital',NULL,NULL,NULL);
/*!40000 ALTER TABLE `vaccination` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visit_history`
--

DROP TABLE IF EXISTS `visit_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visit_history` (
  `visit_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int DEFAULT NULL,
  `visit_date` date DEFAULT NULL,
  `reason` text,
  `diagnosis` text,
  `follow_up_date` date DEFAULT NULL,
  `doctor_id` int DEFAULT NULL COMMENT 'Bác sĩ thực hiện khám',
  PRIMARY KEY (`visit_id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `visit_history_ibfk_1` (`member_id`),
  CONSTRAINT `visit_history_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `visit_history_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visit_history`
--

LOCK TABLES `visit_history` WRITE;
/*!40000 ALTER TABLE `visit_history` DISABLE KEYS */;
INSERT INTO `visit_history` VALUES (1,5,'2025-11-15','Khám định kỳ, kiểm tra huyết áp','Tăng huyết áp nhẹ, cần theo dõi','2025-12-15',2),(2,6,'2025-11-20','Đau đầu, chóng mặt','Thiếu máu nhẹ','2025-12-20',2),(3,7,'2025-11-25','Sổ mũi, hắt hơi thường xuyên','Viêm mũi dị ứng',NULL,2),(4,8,'2025-11-28','Khám sức khỏe định kỳ','Sức khỏe tốt',NULL,2),(5,9,'2025-11-10','Đau bụng, khó tiêu','Viêm dạ dày nhẹ','2025-12-10',3),(6,10,'2025-11-18','Khám định kỳ','Rối loạn lipid máu, cần điều chỉnh chế độ ăn','2026-02-18',3),(7,11,'2025-11-22','Ho, khó thở khi gắng sức','Hen phế quản nhẹ','2025-12-22',3),(8,12,'2025-11-05','Khám kiểm soát đái tháo đường','Đường huyết ổn định, tiếp tục điều trị','2026-01-05',2),(9,13,'2025-11-12','Đau khớp gối','Viêm khớp thoái hóa','2025-12-12',2),(10,14,'2025-11-16','Khám sức khỏe xin việc','Sức khỏe tốt',NULL,2),(11,15,'2025-11-20','Viêm họng, sốt nhẹ','Viêm họng cấp do virus',NULL,2);
/*!40000 ALTER TABLE `visit_history` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-06 14:19:36
