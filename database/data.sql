-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: FamilyHealth
-- ------------------------------------------------------
-- Server version	9.4.0

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
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (1,3,5,'2025-11-20 09:00:00','COMPLETED','Khám tổng quát','Tăng huyết áp nhẹ, theo dõi','2025-11-18 08:00:00','2025-11-20 09:00:00'),(2,7,6,'2025-12-05 10:30:00','CONFIRMED','Khám thai định kỳ','Siêu âm theo dõi thai','2025-11-20 10:00:00','2025-11-28 15:24:41');
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (5,'BS-2025-001','Khoa Nội'),(6,'BS-2025-002','Khoa Sản');
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `doctor_approval`
--

LOCK TABLES `doctor_approval` WRITE;
/*!40000 ALTER TABLE `doctor_approval` DISABLE KEYS */;
/*!40000 ALTER TABLE `doctor_approval` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `family`
--

LOCK TABLES `family` WRITE;
/*!40000 ALTER TABLE `family` DISABLE KEYS */;
INSERT INTO `family` VALUES (1,3,'123 Nguyễn Trãi, Quận 5, TP.HCM','0909555666');
/*!40000 ALTER TABLE `family` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `health_record`
--

LOCK TABLES `health_record` WRITE;
/*!40000 ALTER TABLE `health_record` DISABLE KEYS */;
INSERT INTO `health_record` VALUES (1,3,'O+','Không','Tăng huyết áp');
/*!40000 ALTER TABLE `health_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `invalidated_token`
--

LOCK TABLES `invalidated_token` WRITE;
/*!40000 ALTER TABLE `invalidated_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `invalidated_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `invite_code`
--

LOCK TABLES `invite_code` WRITE;
/*!40000 ALTER TABLE `invite_code` DISABLE KEYS */;
INSERT INTO `invite_code` VALUES (1,1,'FAM-INVITE-2025','2025-11-18 08:00:00','2025-12-18 08:00:00');
/*!40000 ALTER TABLE `invite_code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `medication`
--

LOCK TABLES `medication` WRITE;
/*!40000 ALTER TABLE `medication` DISABLE KEYS */;
INSERT INTO `medication` VALUES (1,'Paracetamol 500mg'),(2,'Amoxicillin 500mg'),(3,'Vitamin C 500mg'),(4,'Omeprazole 20mg');
/*!40000 ALTER TABLE `medication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (3,1,3,'1990-01-01','MALE',35,72,'Chính','HEAD',NULL,NULL,NULL),(7,1,4,'1988-06-15','FEMALE',37,60,'Vợ','MEMBER',NULL,NULL,NULL);
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,1,'Lịch hẹn sắp tới','Bạn có lịch hẹn khám vào ngày 20/11/2025 lúc 09:00','INFO',0,'2025-11-18 08:00:00');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `prescription`
--

LOCK TABLES `prescription` WRITE;
/*!40000 ALTER TABLE `prescription` DISABLE KEYS */;
INSERT INTO `prescription` VALUES (1,3,1,5,NULL,'Uống thuốc hạ huyết áp đều đặn, ăn nhạt, tập thể dục nhẹ.','ACTIVE','2025-11-20 10:00:00'),(2,7,2,6,NULL,'Bổ sung vitamin cho bà bầu, nghỉ ngơi đầy đủ.','ACTIVE','2025-11-20 10:30:00');
/*!40000 ALTER TABLE `prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `prescription_medication`
--

LOCK TABLES `prescription_medication` WRITE;
/*!40000 ALTER TABLE `prescription_medication` DISABLE KEYS */;
INSERT INTO `prescription_medication` VALUES (1,1,'1 viên/ngày','30 ngày'),(2,2,'1 viên/ngày','90 ngày');
/*!40000 ALTER TABLE `prescription_medication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'ADMIN','$2a$10$pBlKGGwX1Nk34QvQ1bzR4ui39pZ4YEp0BeihSMLxilKEo.XcmiF.e','Administrator','0000000000','admin@example.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37'),(2,'DOCTOR','$2a$10$W1VUwC1afReDrEEygqFN0O6XU4.3lv0AwGuAZd4MK3wQvmqOyY6h6','Doctor Test','','doctor@example.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37'),(3,'USER','$2a$10$XxmabLo74.p7Z/2xu1Xub.vYAhajtH6.51ri4HQeOD31f7ZtWQDLG','User Test','0909222333','user@example.com',1,'2025-11-26 15:32:37','2025-11-27 13:56:16'),(4,'DOCTOR','$2a$10$Ums1DIK4H/rJr7KwX2bCwORXFs.bgy1Llgv2fK1LmA5LxSuRIpspG','BS. Dylan','093873647334','dylan@gmail.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37'),(5,'DOCTOR','$2a$10$vR7EQ4z6.LhJ/YU3kj66CeVYXUeAVWz54GZYL4GguFh/xnTVQoyMy','BS. Trần Văn Minh','','tvminh@clinic.vn',0,'2025-11-26 15:32:37','2025-11-27 14:16:33'),(6,'DOCTOR','$2a$10$8iToZEXT8cyjzg/DnRN/ceswAkYXrQQxb2WukCwyt/gMMf3MubYi2','BS. Lê Thị Hương','','lthuong@clinic.vn',0,'2025-11-26 15:32:37','2025-11-27 14:18:45'),(7,'USER','$2a$10$d6k4zxNBx.VNdn5dvY2cf.ChrLyAGZYZj0fKP1qMYcAV2my1kaUKy','Nguyen Van An','0909555666','nvan@example.com',0,'2025-11-26 15:32:37','2025-11-27 15:27:25'),(8,'USER','$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z','Phạm Thị Bích','0909777888','ptbich@example.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37'),(9,'USER','$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z','Trần Minh Cường','0909888999','tmcuong@example.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37'),(10,'USER','$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z','Lê Văn Dũng','0909111000','lvdung@example.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37'),(11,'USER','$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z','Hoàng Thị Em','0909222111','htem@example.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37'),(12,'USER','$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z','Đặng Văn Phú','0909333222','dvphu@example.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37'),(13,'USER','$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z','Vũ Thị Giang','0909444333','vtgiang@example.com',0,'2025-11-26 15:32:37','2025-11-26 15:32:37');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vaccination`
--

LOCK TABLES `vaccination` WRITE;
/*!40000 ALTER TABLE `vaccination` DISABLE KEYS */;
INSERT INTO `vaccination` VALUES (1,3,'Vắc-xin cúm','2024-10-10');
/*!40000 ALTER TABLE `vaccination` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `visit_history`
--

LOCK TABLES `visit_history` WRITE;
/*!40000 ALTER TABLE `visit_history` DISABLE KEYS */;
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

-- Dump completed on 2025-11-28 18:57:37
