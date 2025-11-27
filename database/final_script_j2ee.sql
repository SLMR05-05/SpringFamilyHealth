CREATE TABLE `user` (
  `user_id` int PRIMARY KEY AUTO_INCREMENT,
  `role` varchar(255) COMMENT 'ENUM: ADMIN, DOCTOR, USER',
  `password_hash` varchar(255),
  `name` varchar(255),
  `phone` varchar(255),
  `email` varchar(255) UNIQUE
);

CREATE TABLE `admin` (
  `admin_id` int PRIMARY KEY
);

CREATE TABLE `doctor` (
  `doctor_id` int PRIMARY KEY,
  `certificate_number` varchar(255) UNIQUE,
  `description` text
);

CREATE TABLE `family` (
  `family_id` int PRIMARY KEY AUTO_INCREMENT,
  `doctor_id` int,
  `address` varchar(255),
  `contact_number` varchar(255)
);

CREATE TABLE `invite_code` (
  `invite_id` int PRIMARY KEY AUTO_INCREMENT,
  `family_id` int,
  `code` varchar(255) UNIQUE,
  `created_at` timestamp,
  `expired_at` timestamp
);

CREATE TABLE `member` (
  `member_id` int PRIMARY KEY,
  `family_id` int,
  `age` int,
  `day_of_birth` date,
  `gender` varchar(255) COMMENT 'ENUM: MALE, FEMALE, OTHER',
  `weight` float,
  `height` float,
  `relationship` varchar(255),
  `role_in_family` varchar(255) DEFAULT 'MEMBER' COMMENT 'HEAD | MEMBER'
);

CREATE TABLE `visit_history` (
  `visit_id` int PRIMARY KEY AUTO_INCREMENT,
  `member_id` int,
  `visit_date` date,
  `reason` text,
  `diagnosis` text,
  `follow_up_date` date
);

CREATE TABLE `prescription` (
  `prescription_id` int PRIMARY KEY AUTO_INCREMENT,
  `member_id` int,
  `visit_id` int,
  `note` text
);

CREATE TABLE `medication` (
  `medication_id` int PRIMARY KEY AUTO_INCREMENT,
  `medication_name` varchar(255)
);

CREATE TABLE `prescription_medication` (
  `prescription_id` int,
  `medication_id` int,
  `dosage` varchar(255),
  `duration` varchar(255),
  PRIMARY KEY (`prescription_id`, `medication_id`)
);

CREATE TABLE `vaccination` (
  `vaccine_id` int PRIMARY KEY AUTO_INCREMENT,
  `member_id` int,
  `vaccine_name` varchar(255),
  `date_given` date
);

CREATE TABLE `health_record` (
  `record_id` int PRIMARY KEY AUTO_INCREMENT,
  `member_id` int,
  `blood_type` varchar(255) COMMENT 'ENUM: A+, A-, B+, B-, AB+, AB-, O+,  O-',
  `allergies` text,
  `chronic_conditions` text
);

ALTER TABLE `admin` ADD FOREIGN KEY (`admin_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `doctor` ADD FOREIGN KEY (`doctor_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `family` ADD FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`);

ALTER TABLE `invite_code` ADD FOREIGN KEY (`family_id`) REFERENCES `family` (`family_id`);

ALTER TABLE `member` ADD FOREIGN KEY (`member_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `member` ADD FOREIGN KEY (`family_id`) REFERENCES `family` (`family_id`);

ALTER TABLE `visit_history` ADD FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`);

ALTER TABLE `prescription` ADD FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`);

ALTER TABLE `prescription` ADD FOREIGN KEY (`visit_id`) REFERENCES `visit_history` (`visit_id`);

ALTER TABLE `prescription_medication` ADD FOREIGN KEY (`prescription_id`) REFERENCES `prescription` (`prescription_id`);

ALTER TABLE `prescription_medication` ADD FOREIGN KEY (`medication_id`) REFERENCES `medication` (`medication_id`);

ALTER TABLE `vaccination` ADD FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`);

ALTER TABLE `health_record` ADD FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`);





USE family_health;

-- =====================
-- 1. USER
-- =====================
INSERT INTO user (role, password_hash, name, phone, email) VALUES
('ADMIN', 'hashed_admin123', 'Admin One', '0909000001', 'admin@example.com'),
('DOCTOR', 'hashed_doc123', 'Dr. John Smith', '0909111222', 'john.smith@clinic.com'),
('USER', 'hashed_user123', 'Nguyen Van A', '0909222333', 'vana@example.com'),
('USER', 'hashed_user456', 'Tran Thi B', '0909333444', 'thib@example.com'),
('USER', 'hashed_user789', 'Le Van C', '0909444555', 'vanc@example.com');

-- =====================
-- 2. ADMIN / DOCTOR
-- =====================
INSERT INTO admin (admin_id) VALUES (1);

INSERT INTO doctor (doctor_id, certificate_number, description) VALUES
(2, 'DOC2025001', 'Specialist in family health with 10 years experience.');

-- =====================
-- 3. FAMILY
-- =====================
INSERT INTO family (doctor_id, address, contact_number) VALUES
(2, '123 Nguyen Trai, District 5, HCMC', '0909555666'),
(2, '45 Le Loi, District 1, HCMC', '0909777888');

-- =====================
-- 4. INVITE CODE
-- =====================
INSERT INTO invite_code (family_id, code, created_at, expired_at) VALUES
(1, 'INVITE123A', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY)),
(2, 'INVITE456B', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY));

-- =====================
-- 5. MEMBER
-- =====================
INSERT INTO member (member_id, family_id, age, day_of_birth, gender, weight, height, relationship, role_in_family) VALUES
(3, 1, 35, '1990-05-10', 'MALE', 70.5, 175.0, 'Father', 'HEAD'),
(4, 1, 33, '1992-09-15', 'FEMALE', 55.2, 162.0, 'Mother', 'MEMBER'),
(5, 1, 7, '2018-06-20', 'MALE', 25.0, 120.0, 'Son', 'MEMBER');

-- =====================
-- 6. VISIT HISTORY
-- =====================
INSERT INTO visit_history (member_id, visit_date, reason, diagnosis, follow_up_date) VALUES
(3, '2024-09-10', 'Headache', 'Migraine', '2024-09-17'),
(4, '2024-09-12', 'Checkup', 'Normal', NULL),
(5, '2024-09-13', 'Fever', 'Viral infection', '2024-09-20');

-- =====================
-- 7. PRESCRIPTION
-- =====================
INSERT INTO prescription (member_id, visit_id, note) VALUES
(3, 1, 'Take medicine A twice a day.'),
(5, 3, 'Rest and stay hydrated.');

-- =====================
-- 8. MEDICATION
-- =====================
INSERT INTO medication (medication_name) VALUES
('Paracetamol'),
('Ibuprofen'),
('Vitamin C');

-- =====================
-- 9. PRESCRIPTION_MEDICATION
-- =====================
INSERT INTO prescription_medication (prescription_id, medication_id, dosage, duration) VALUES
(1, 1, '500mg', '5 days'),
(2, 3, '1000mg', '7 days');

-- =====================
-- 10. VACCINATION
-- =====================
INSERT INTO vaccination (member_id, vaccine_name, date_given) VALUES
(5, 'MMR', '2023-10-01'),
(5, 'Hepatitis B', '2024-01-15');

-- =====================
-- 11. HEALTH RECORD
-- =====================
INSERT INTO health_record (member_id, blood_type, allergies, chronic_conditions) VALUES
(3, 'O+', 'Peanuts', 'Hypertension'),
(4, 'A+', 'None', 'None'),
(5, 'B+', 'None', 'Asthma');
