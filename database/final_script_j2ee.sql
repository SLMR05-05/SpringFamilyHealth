-- Bảng `user`: lưu trữ tài khoản người dùng của ứng dụng (ADMIN, DOCTOR, USER).
-- Bao gồm thông tin đăng nhập (mật khẩu đã băm), tên, email và số điện thoại.
-- `user_id` là khóa chính, các bảng đặc thù như `admin`/`doctor` dùng chung khoá này để liên kết.
CREATE TABLE `user` (
  `user_id` int PRIMARY KEY AUTO_INCREMENT,
  `role` varchar(255) COMMENT 'ENUM: ADMIN, DOCTOR, USER',
  `password_hash` varchar(255),
  `name` varchar(255),
  `phone` varchar(255),
  `email` varchar(255) UNIQUE
);

-- Bảng `admin`: chứa bản ghi đặc thù cho tài khoản quản trị (admin).
-- Sử dụng chung `admin_id` = `user.user_id` (quan hệ một-kèm-một với `user`).
CREATE TABLE `admin` (
  `admin_id` int PRIMARY KEY
);

-- Bảng `doctor`: hồ sơ chuyên môn của bác sĩ.
-- `doctor_id` là khóa chính (chia sẻ với `user.user_id`); chứa số chứng chỉ và mô tả chuyên môn.
CREATE TABLE `doctor` (
  `doctor_id` int PRIMARY KEY,
  `certificate_number` varchar(255) UNIQUE,
  `description` text
);

-- Bảng `family`: đại diện cho một hộ gia đình do một bác sĩ quản lý.
-- Lưu địa chỉ và số liên hệ; liên kết với `doctor` qua `doctor_id`.
CREATE TABLE `family` (
  `family_id` int PRIMARY KEY AUTO_INCREMENT,
  `doctor_id` int,
  `address` varchar(255),
  `contact_number` varchar(255)
);

-- Bảng `invite_code`: lưu mã mời để thêm thành viên vào `family`.
-- Mỗi mã có thời điểm tạo và thời điểm hết hạn.
CREATE TABLE `invite_code` (
  `invite_id` int PRIMARY KEY AUTO_INCREMENT,
  `family_id` int,
  `code` varchar(255) UNIQUE,
  `created_at` timestamp,
  `expired_at` timestamp
);

-- Bảng `member`: thông tin từng thành viên trong một `family`.
-- `member_id` tham chiếu tới `user.user_id` (mỗi member thường có tài khoản user).
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

-- Bảng `visit_history`: lịch sử khám chữa bệnh của thành viên (member).
-- Lưu ngày khám, lý do, chẩn đoán và ngày tái khám nếu có.
CREATE TABLE `visit_history` (
  `visit_id` int PRIMARY KEY AUTO_INCREMENT,
  `member_id` int,
  `visit_date` date,
  `reason` text,
  `diagnosis` text,
  `follow_up_date` date
);

-- Bảng `prescription`: lưu đơn thuốc cho một lần khám hoặc cho một thành viên.
-- Kết nối với `visit_history` và `member`.
CREATE TABLE `prescription` (
  `prescription_id` int PRIMARY KEY AUTO_INCREMENT,
  `member_id` int,
  `visit_id` int,
  `note` text
);

-- Bảng `medication`: danh mục thuốc dùng trong hệ thống.
CREATE TABLE `medication` (
  `medication_id` int PRIMARY KEY AUTO_INCREMENT,
  `medication_name` varchar(255)
);

-- Bảng `prescription_medication`: liên kết nhiều-nhiều giữa `prescription` và `medication`.
-- Chứa liều dùng (`dosage`) và thời gian sử dụng (`duration`).
CREATE TABLE `prescription_medication` (
  `prescription_id` int,
  `medication_id` int,
  `dosage` varchar(255),
  `duration` varchar(255),
  PRIMARY KEY (`prescription_id`, `medication_id`)
);

-- Bảng `vaccination`: hồ sơ tiêm chủng cho thành viên.
CREATE TABLE `vaccination` (
  `vaccine_id` int PRIMARY KEY AUTO_INCREMENT,
  `member_id` int,
  `vaccine_name` varchar(255),
  `date_given` date
);

-- Bảng `health_record`: tóm tắt hồ sơ sức khỏe của thành viên (nhóm máu, dị ứng, bệnh mãn tính).
CREATE TABLE `health_record` (
  `record_id` int PRIMARY KEY AUTO_INCREMENT,
  `member_id` int,
  `blood_type` varchar(255) COMMENT 'ENUM: A+, A-, B+, B-, AB+, AB-, O+,  O-',
  `allergies` text,
  `chronic_conditions` text
);

-- Thiết lập ràng buộc khóa ngoại (FK) giữa các bảng để đảm bảo tính toàn vẹn dữ liệu.
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


-- =====================================================
-- DỮ LIỆU MẪU ĐỂ TEST
-- =====================================================

USE FamilyHealth;

-- =====================
-- 1. USER
-- =====================
-- Mật khẩu mẫu: "password123" đã được hash bằng BCrypt
-- $2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z
INSERT INTO user (role, password_hash, name, phone, email) VALUES
('DOCTOR', '$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'BS. Trần Văn Minh', '0909111222', 'tvminh@clinic.vn'),
('DOCTOR', '$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'BS. Lê Thị Hương', '0909333444', 'lthuong@clinic.vn'),
('USER', '$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Nguyễn Văn An', '0909555666', 'nvan@example.com'),
('USER', '$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Phạm Thị Bích', '0909777888', 'ptbich@example.com'),
('USER', '$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Trần Minh Cường', '0909888999', 'tmcuong@example.com'),
('USER', '$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Lê Văn Dũng', '0909111000', 'lvdung@example.com'),
('USER', '$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Hoàng Thị Em', '0909222111', 'htem@example.com'),
('USER', '$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Đặng Văn Phú', '0909333222', 'dvphu@example.com'),
('USER', '$2a$10$XqX8V3tYKhZf5Z5Z5Z5Z5eK9Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Vũ Thị Giang', '0909444333', 'vtgiang@example.com');

-- =====================
-- 2. ADMIN / DOCTOR
-- =====================

INSERT INTO doctor (doctor_id, certificate_number, description) VALUES
(5, 'BS-2025-001', 'Bác sĩ chuyên khoa nội tổng quát, 15 năm kinh nghiệm. Chuyên điều trị các bệnh lý mạn tính.'),
(6, 'BS-2025-002', 'Bác sĩ chuyên khoa nhi, 10 năm kinh nghiệm. Chuyên chăm sóc sức khỏe trẻ em và gia đình.');

-- =====================
-- 3. FAMILY
-- =====================
-- Family 1 & 2: do BS Trần Văn Minh (doctor_id=2) quản lý
-- Family 3: do BS Lê Thị Hương (doctor_id=3) quản lý
INSERT INTO family (doctor_id, address, contact_number) VALUES
(5, '123 Nguyễn Trãi, Quận 5, TP.HCM', '0909555666'),
(5, '456 Lê Lợi, Quận 1, TP.HCM', '0909888999'),
(6, '789 Trần Hưng Đạo, Quận 3, TP.HCM', '0909222111');

-- =====================
-- 4. INVITE CODE
-- =====================
INSERT INTO invite_code (family_id, code, created_at, expired_at) VALUES
(1, 'FAM1-INVITE-2025', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
(2, 'FAM2-INVITE-2025', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
(3, 'FAM3-INVITE-2025', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY));

-- =====================
-- 5. MEMBER
-- =====================
-- Family 1 (doctor_id=2): có 3 members (user_id: 4, 5, 6)
-- Family 2 (doctor_id=2): có 2 members (user_id: 7, 8)
-- Family 3 (doctor_id=3): có 2 members (user_id: 9, 10)
INSERT INTO member (member_id, family_id, age, day_of_birth, gender, weight, height, relationship, role_in_family) VALUES
(4, 1, 38, '1987-03-15', 'MALE', 72.5, 175.0, 'Chồng', 'HEAD'),
(5, 1, 36, '1989-07-20', 'FEMALE', 58.0, 165.0, 'Vợ', 'MEMBER'),
(6, 1, 10, '2015-11-05', 'MALE', 32.0, 140.0, 'Con trai', 'MEMBER'),
(7, 2, 42, '1983-05-10', 'MALE', 78.0, 172.0, 'Chồng', 'HEAD'),
(8, 2, 40, '1985-08-25', 'FEMALE', 62.0, 160.0, 'Vợ', 'MEMBER'),
(9, 3, 35, '1990-01-12', 'MALE', 68.5, 170.0, 'Chồng', 'HEAD'),
(10, 3, 33, '1992-04-18', 'FEMALE', 55.0, 158.0, 'Vợ', 'MEMBER');

-- =====================
-- 6. VISIT HISTORY
-- =====================
INSERT INTO visit_history (member_id, visit_date, reason, diagnosis, follow_up_date) VALUES
(4, '2025-11-01', 'Đau đầu, chóng mặt', 'Huyết áp cao', '2025-12-01'),
(5, '2025-11-05', 'Khám thai định kỳ', 'Thai kỳ bình thường', '2025-12-05'),
(6, '2025-11-10', 'Ho, sốt nhẹ', 'Viêm đường hô hấp trên', '2025-11-17'),
(7, '2025-11-08', 'Đau lưng', 'Thoái hóa cột sống', '2025-12-08'),
(8, '2025-11-12', 'Kiểm tra sức khỏe định kỳ', 'Bình thường', NULL),
(9, '2025-11-15', 'Đau dạ dày', 'Viêm loét dạ dày', '2025-11-22'),
(10, '2025-11-18', 'Khám tổng quát', 'Bình thường', NULL);

-- =====================
-- 7. PRESCRIPTION
-- =====================
INSERT INTO prescription (member_id, visit_id, note) VALUES
(4, 1, 'Uống thuốc hạ huyết áp đều đặn, ăn nhạt, tập thể dục nhẹ.'),
(5, 2, 'Bổ sung vitamin cho bà bầu, nghỉ ngơi đầy đủ.'),
(6, 3, 'Uống thuốc hạ sốt, giữ ấm, uống nhiều nước.'),
(7, 4, 'Thuốc giảm đau, vật lý trị liệu.'),
(9, 6, 'Thuốc bảo vệ dạ dày, ăn đúng giờ, tránh thức ăn cay nóng.');

-- =====================
-- 8. MEDICATION
-- =====================
INSERT INTO medication (medication_name) VALUES
('Paracetamol 500mg'),
('Ibuprofen 400mg'),
('Amoxicillin 500mg'),
('Vitamin C 1000mg'),
('Elevit Prenatal'),
('Amlodipine 5mg'),
('Omeprazole 20mg'),
('Glucosamine 500mg');

-- =====================
-- 9. PRESCRIPTION_MEDICATION
-- =====================
INSERT INTO prescription_medication (prescription_id, medication_id, dosage, duration) VALUES
(1, 6, '1 viên/ngày', '30 ngày'),
(2, 5, '1 viên/ngày', '90 ngày'),
(3, 1, '1 viên khi sốt (tối đa 4 viên/ngày)', '5 ngày'),
(3, 3, '1 viên x 3 lần/ngày sau ăn', '7 ngày'),
(4, 2, '1 viên x 2 lần/ngày sau ăn', '10 ngày'),
(4, 8, '1 viên x 2 lần/ngày', '60 ngày'),
(5, 7, '1 viên/ngày trước ăn sáng', '30 ngày');

-- =====================
-- 10. VACCINATION
-- =====================
INSERT INTO vaccination (member_id, vaccine_name, date_given) VALUES
(6, 'Vắc-xin sởi-quai bị-rubella (MMR)', '2024-05-10'),
(6, 'Vắc-xin viêm gan B', '2024-08-15'),
(6, 'Vắc-xin COVID-19 (Pfizer)', '2025-01-20');

-- =====================
-- 11. HEALTH RECORD
-- =====================
INSERT INTO health_record (member_id, blood_type, allergies, chronic_conditions) VALUES
(4, 'O+', 'Không', 'Tăng huyết áp'),
(5, 'A+', 'Hải sản', 'Không'),
(6, 'O+', 'Không', 'Hen suyễn nhẹ'),
(7, 'B+', 'Penicillin', 'Thoái hóa cột sống'),
(8, 'AB+', 'Không', 'Không'),
(9, 'A+', 'Không', 'Viêm loét dạ dày'),
(10, 'O+', 'Không', 'Không');



