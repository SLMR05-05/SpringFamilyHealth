-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: FamilyHealth
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Quản lý lịch hẹn khám bệnh';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (1,12,5,'2025-12-01 09:00:00','COMPLETED','Tái khám huyết áp','Mang theo kết quả xét nghiệm','2025-11-26 15:40:53','2025-12-01 13:18:23'),(2,3,5,'2025-12-05 10:30:00','COMPLETED','Khám thai định kỳ','Siêu âm thai','2025-11-26 15:40:53','2025-11-28 05:15:01'),(3,8,5,'2025-11-25 14:00:00','COMPLETED','Khám ho, sốt','Đã khám xong','2025-11-26 15:40:53','2025-11-27 09:12:14'),(4,9,6,'2025-11-28 15:00:00','COMPLETED','Tái khám dạ dày','Nội soi dạ dày','2025-11-26 15:40:53','2025-11-28 05:15:10'),(12,11,5,'2025-11-01 09:00:00','COMPLETED','Đau đầu, chóng mặt','Huyết áp cao','2025-11-28 07:15:26','2025-11-28 07:15:26'),(13,13,5,'2025-11-05 09:00:00','COMPLETED','Khám thai định kỳ','Thai kỳ bình thường','2025-11-28 07:15:26','2025-11-28 07:15:26'),(14,3,5,'2025-11-10 09:00:00','COMPLETED','Ho, sốt nhẹ','Viêm đường hô hấp trên','2025-11-28 07:15:26','2025-11-28 07:15:26'),(15,7,5,'2025-11-08 09:00:00','COMPLETED','Đau lưng','Thoái hóa cột sống','2025-11-28 07:15:26','2025-11-28 07:15:26'),(16,9,6,'2025-11-15 09:00:00','COMPLETED','Đau dạ dày','Viêm loét dạ dày','2025-11-28 07:15:26','2025-11-28 07:15:26'),(19,3,5,'2025-12-20 19:56:00','SCHEDULED','Khám chuyên khoa','test','2025-12-01 18:56:19','2025-12-01 18:56:19'),(20,3,5,'2025-12-01 18:00:00','COMPLETED','Khám tổng quát','test','2025-12-01 18:58:05','2025-12-01 19:03:58');
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
  `description` text,
  PRIMARY KEY (`doctor_id`),
  UNIQUE KEY `certificate_number` (`certificate_number`),
  CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (2,'DOC2025002','Khoa Da Liễu'),(4,'CN12092049','Khoa Thần Kinh'),(5,'BS-2025-001','Khoa Răng Hàm Mặt'),(6,'BS-2025-002','Khoa Nhi');
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
  `doctor_id` int NOT NULL,
  `status` varchar(50) DEFAULT 'PENDING' COMMENT 'PENDING, APPROVED, REJECTED',
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày đăng ký',
  `reviewed_at` timestamp NULL DEFAULT NULL COMMENT 'Ngày duyệt/từ chối',
  `reviewed_by` int DEFAULT NULL COMMENT 'Admin duyệt (user_id)',
  `rejection_reason` text COMMENT 'Lý do từ chối (nếu có)',
  PRIMARY KEY (`approval_id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `doctor_approval_fk_reviewed_by` (`reviewed_by`),
  CONSTRAINT `doctor_approval_fk_reviewed_by` FOREIGN KEY (`reviewed_by`) REFERENCES `user` (`user_id`),
  CONSTRAINT `doctor_approval_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Quản lý phê duyệt tài khoản bác sĩ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_approval`
--

LOCK TABLES `doctor_approval` WRITE;
/*!40000 ALTER TABLE `doctor_approval` DISABLE KEYS */;
INSERT INTO `doctor_approval` VALUES (3,5,'APPROVED','2025-11-01 08:00:00','2025-11-01 10:00:00',1,NULL),(4,6,'APPROVED','2025-11-02 08:00:00','2025-11-02 09:30:00',1,NULL);
/*!40000 ALTER TABLE `doctor_approval` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `family`
--

LOCK TABLES `family` WRITE;
/*!40000 ALTER TABLE `family` DISABLE KEYS */;
INSERT INTO `family` VALUES (1,5,'123 Nguyễn Trãi, Quận 5, TP.HCM','0909555666'),(2,5,'456 Lê Lợi, Quận 1, TP.HCM','0909888999'),(3,6,'789 Trần Hưng Đạo, Quận 3, TP.HCM','0909222111');
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health_record`
--

LOCK TABLES `health_record` WRITE;
/*!40000 ALTER TABLE `health_record` DISABLE KEYS */;
INSERT INTO `health_record` VALUES (1,11,'O+','Không','Tăng huyết áp'),(2,13,'A+','Hải sản','Không'),(3,3,'O+','Không','Hen suyễn nhẹ'),(4,7,'B+','Penicillin','Thoái hóa cột sống'),(5,8,'AB+','Không','Không'),(6,9,'A+','Không','Viêm loét dạ dày'),(7,10,'O+','Không','Không'),(8,12,'A+','Không','Không');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invite_code`
--

LOCK TABLES `invite_code` WRITE;
/*!40000 ALTER TABLE `invite_code` DISABLE KEYS */;
INSERT INTO `invite_code` VALUES (1,1,'FAM1-INVITE-2025','2025-11-26 14:51:46','2025-12-26 14:51:46'),(2,2,'FAM2-INVITE-2025','2025-11-26 14:51:46','2025-12-26 14:51:46'),(3,3,'FAM3-INVITE-2025','2025-11-26 14:51:46','2025-12-26 14:51:46');
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
INSERT INTO `medication` VALUES (1,'Paracetamol 500mg'),(2,'Ibuprofen 400mg'),(3,'Amoxicillin 500mg'),(4,'Vitamin C 1000mg'),(5,'Elevit Prenatal'),(6,'Amlodipine 5mg'),(7,'Omeprazole 20mg'),(8,'Glucosamine 500mg'),(9,'t'),(10,'Vitamin C');
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
INSERT INTO `member` VALUES (3,1,10,'2015-11-05','MALE',32,140,'Con trai','MEMBER','0909222332','user1@example.com',NULL),(7,2,42,'1983-05-10','MALE',78,172,'Chồng','HEAD',NULL,NULL,NULL),(8,2,40,'1985-08-25','FEMALE',62,160,'Vợ','MEMBER',NULL,NULL,NULL),(9,3,35,'1990-01-12','MALE',68.5,170,'Chồng','HEAD',NULL,NULL,NULL),(10,3,33,'1992-04-18','FEMALE',55,158,'Vợ','MEMBER',NULL,NULL,NULL),(11,1,38,'1987-03-15','MALE',72.5,175,'Chồng','HEAD',NULL,NULL,NULL),(12,1,30,'1995-06-15','MALE',70,172,'Con trai','MEMBER',NULL,NULL,NULL),(13,1,36,'1989-07-20','FEMALE',58,165,'Vợ','MEMBER',NULL,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Thông báo cho người dùng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,7,'Lịch hẹn sắp tới','Bạn có lịch hẹn khám vào ngày 01/12/2025 lúc 09:00','INFO',0,'2025-11-26 15:40:53'),(2,8,'Lịch hẹn sắp tới','Bạn có lịch hẹn khám vào ngày 05/12/2025 lúc 10:30','INFO',0,'2025-11-26 15:40:53'),(3,9,'Lịch hẹn sắp tới','Bạn có lịch hẹn khám vào ngày 28/11/2025 lúc 15:00','INFO',0,'2025-11-26 15:40:53'),(4,5,'Bệnh nhân mới','Bạn có lịch hẹn mới từ bệnh nhân Nguyễn Văn An','SUCCESS',1,'2025-11-26 15:40:53');
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
  `status` varchar(50) DEFAULT 'ACTIVE' COMMENT 'ACTIVE, COMPLETED, EXPIRED',
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
INSERT INTO `prescription` VALUES (1,11,12,5,1,'Uống thuốc hạ huyết áp đều đặn, ăn nhạt, tập thể dục nhẹ.','ACTIVE','2025-11-01 10:00:00'),(2,13,13,5,2,'Bổ sung vitamin cho bà bầu, nghỉ ngơi đầy đủ.','ACTIVE','2025-11-05 10:00:00'),(3,3,14,5,3,'Uống thuốc hạ sốt, giữ ấm, uống nhiều nước.','COMPLETED','2025-11-10 10:00:00'),(4,7,15,5,4,'Thuốc giảm đau, vật lý trị liệu.','ACTIVE','2025-11-08 10:00:00'),(5,9,16,6,6,'Thuốc bảo vệ dạ dày, ăn đúng giờ, tránh thức ăn cay nóng.','ACTIVE','2025-11-15 10:00:00'),(6,9,NULL,NULL,13,'Đơn thuốc gồm 1 loại: t','ACTIVE','2025-11-28 07:07:43'),(7,9,NULL,NULL,14,'Đơn thuốc gồm 1 loại: Vitamin C','ACTIVE','2025-11-28 07:07:43');
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
INSERT INTO `prescription_medication` VALUES (1,6,'1 viên/ngày','30 ngày'),(2,5,'1 viên/ngày','90 ngày'),(3,1,'1 viên khi sốt (tối đa 4 viên/ngày)','5 ngày'),(3,3,'1 viên x 3 lần/ngày sau ăn','7 ngày'),(4,2,'1 viên x 2 lần/ngày sau ăn','10 ngày'),(4,4,'1 viên/ngày','30 ngày'),(4,6,'1 viên/ngày sau ăn sáng','30 ngày'),(4,8,'1 viên x 2 lần/ngày','60 ngày'),(5,4,'2 viên/ngày','60 ngày'),(5,5,'1 viên/ngày','60 ngày'),(5,7,'1 viên/ngày trước ăn sáng','30 ngày'),(6,1,'1 viên khi sốt','5 ngày'),(6,3,'1 viên x 2 lần/ngày','7 ngày'),(7,7,'1 viên/ngày trước ăn','14 ngày');
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'ADMIN','$2a$10$pBlKGGwX1Nk34QvQ1bzR4ui39pZ4YEp0BeihSMLxilKEo.XcmiF.e','Administrator','0000000000','admin@example.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37'),(2,'DOCTOR','$2a$10$W1VUwC1afReDrEEygqFN0O6XU4.3lv0AwGuAZd4MK3wQvmqOyY6h6','Doctor Test','','doctor@example.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37'),(3,'USER','$2a$10$XxmabLo74.p7Z/2xu1Xub.vYAhajtH6.51ri4HQeOD31f7ZtWQDLG','User Test Update','0909222332','user1@example.com',1,'2025-11-26 15:32:37','2025-12-01 18:54:35'),(4,'DOCTOR','$2a$10$Ums1DIK4H/rJr7KwX2bCwORXFs.bgy1Llgv2fK1LmA5LxSuRIpspG','BS. Dylan','093873647334','dylan@gmail.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37'),(5,'DOCTOR','$2a$10$vR7EQ4z6.LhJ/YU3kj66CeVYXUeAVWz54GZYL4GguFh/xnTVQoyMy','BS. Trần Văn Minh','','tvminh@clinic.vn',0,'2025-11-26 15:32:37','2025-11-27 14:16:33'),(6,'DOCTOR','$2a$10$8iToZEXT8cyjzg/DnRN/ceswAkYXrQQxb2WukCwyt/gMMf3MubYi2','BS. Lê Thị Hương','','lthuong@clinic.vn',0,'2025-11-26 15:32:37','2025-11-27 14:18:45'),(7,'USER','$2a$10$d6k4zxNBx.VNdn5dvY2cf.ChrLyAGZYZj0fKP1qMYcAV2my1kaUKy','Nguyen Van An','0909555666','nvan@example.com',0,'2025-11-26 15:32:37','2025-11-27 15:27:25'),(8,'USER','$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z','Phạm Thị Bích','0909777888','ptbich@example.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37'),(9,'USER','$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z','Trần Minh Cường','0909888999','tmcuong@example.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37'),(10,'USER','$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z','Lê Văn Dũng','0909111000','lvdung@example.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37'),(11,'USER','$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z','Hoàng Thị Em','0909222111','htem@example.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37'),(12,'USER','$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z','Đặng Văn Phú','0909333222','dvphu@example.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37'),(13,'USER','$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z','Vũ Thị Giang','0909444333','vtgiang@example.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37');
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
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vaccine_id`),
  KEY `vaccination_ibfk_1` (`member_id`),
  CONSTRAINT `vaccination_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vaccination`
--

LOCK TABLES `vaccination` WRITE;
/*!40000 ALTER TABLE `vaccination` DISABLE KEYS */;
INSERT INTO `vaccination` VALUES (1,3,5,'Vắc-xin sởi-quai bị-rubella (MMR)','2024-05-10','2025-05-10','Bệnh viện TPHCM','test','2025-12-01 10:43:30','2025-12-01 10:51:24'),(2,3,5,'Vắc-xin viêm gan B','2024-08-15','2025-05-10','Bệnh viện TPHCM','test','2025-12-01 10:43:30','2025-12-01 10:51:59'),(3,3,5,'Vắc-xin COVID-19 (Pfizer)','2025-01-20','2025-05-10','Bệnh viện TPHCM','test','2025-12-01 10:43:30','2025-12-01 10:52:03'),(5,3,5,'test','2025-12-01','2025-12-11','test','tesst',NULL,NULL);
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
INSERT INTO `visit_history` VALUES (1,11,'2025-11-01','Đau đầu, chóng mặt','Huyết áp cao','2025-12-01',5),(2,13,'2025-11-05','Khám thai định kỳ','Thai kỳ bình thường','2025-12-05',5),(3,3,'2025-11-10','Ho, sốt nhẹ','Viêm đường hô hấp trên','2025-11-17',5),(4,7,'2025-11-08','Đau lưng','Thoái hóa cột sống','2025-12-08',5),(5,8,'2025-11-12','Kiểm tra sức khỏe định kỳ','Bình thường',NULL,5),(6,9,'2025-11-15','Đau dạ dày','Viêm loét dạ dày','2025-11-22',6),(7,10,'2025-11-18','Khám tổng quát','Bình thường',NULL,6),(8,9,'2025-11-27','te','te\n\nĐiều trị: te\n\nGhi chú: te',NULL,NULL),(9,9,'2025-11-26','Kê đơn thuốc - 1 loại thuốc','t\n\nĐiều trị: t',NULL,NULL),(10,9,'2025-11-26','Kê đơn thuốc - 1 loại thuốc','t\n\nĐiều trị: t',NULL,NULL),(11,9,'2025-11-26','Kê đơn thuốc - 1 loại thuốc','t\n\nĐiều trị: t',NULL,NULL),(12,9,'2025-11-26','Kê đơn thuốc - 1 loại thuốc','t\n\nĐiều trị: t',NULL,NULL),(13,9,'2025-11-26','Kê đơn thuốc - 1 loại thuốc','t\n\nĐiều trị: t',NULL,NULL),(14,9,'2025-11-26','Kê đơn thuốc - 1 loại thuốc','t\n\nĐiều trị: t',NULL,NULL),(15,11,'2025-11-27','t','t\n\nĐiều trị: t\n\nGhi chú: t',NULL,NULL);
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

-- Dump completed on 2025-12-01 21:34:34
